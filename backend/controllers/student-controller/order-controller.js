import Stripe from "stripe";
import { httpCodes } from "../../constants.js";
import { prisma } from "../../prisma/index.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { PAYMENT_CONFIRMATION_TEMPLATE } from "../../utils/EmailTemplate.js";
import { transporter } from "../../utils/email.js";
import { addToLowPriorityNotificationQueue } from "../../utils/notification.js";


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const createOrder = async (req, res) => {
  try {
    console.log(
      "handling request in student-controller/order-controller createOrder controller"
    );
    console.log("recieved data : ", req.body);

    let {
      userId = "",
      userName = "Ahsan Hafeez",
      userEmail = "ahsanhafeez724@gmail.com",
      orderStatus = "completed",
      paymentMethod,
      paymentStatus,
      orderDate,
      paymentId,
      payerId,
      instructorId = "7",
      instructorName = "john guttag",
      courseImage = "https://res.cloudinary.com/dpsqzixmj/image/upload/v1746295780/bgkzkhjqqiwz2f2pfq9o.jpg",
      courseTitle = "Virtual Reality",
      courseId="3",
      coursePricing=49.99,
    } = req.body;

    courseId += "";
    if (!userId) {
      return res.status(httpCodes.badRequest).json(new ApiResponse(httpCodes.badRequest, {}, "userid not fouund"));
    }
    userId += "";

    // checking wether course is already brought or not
    
    let std = await prisma.studentCourse.findFirst({ where: { userId: userId, courseId: courseId } });
    
    if (std)
    { return res.status(httpCodes.unprocessableEntity).json(new ApiResponse(httpCodes.unprocessableEntity, {}, "course is already brought by user")); }
    
    
    
    // 1) Create a Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: courseTitle,
              images: [courseImage],
            },
            unit_amount: Math.round(coursePricing * 100), // in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/student/course-progress/${courseId}`,
      cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
      metadata: {
        userId,
        courseId: String(courseId),
        instructorId,
      },
    });

    // 2) Persist order in database
    const newlyCreatedCourseOrder = await prisma.order.create({
      data: {
        userId,
        userName,
        userEmail,
        orderStatus,
        paymentMethod: "stripe",
        paymentStatus: "pending",
        orderDate: new Date(),
        paymentId: session.payment_intent || session.id,
        payerId: null,
        instructorId,
        instructorName,
        courseImage,
        courseTitle,
        courseId,
        coursePricing: parseFloat(coursePricing),
      },
    });

    let order = await prisma.order.findFirst({ where: { id: newlyCreatedCourseOrder?.id } });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order can not be found",
      });
    }
    console.log("Id of purchase by ",payerId,"  for course : ",courseId," is : ",order?.id)
    // 2) Verify payment with Stripe
    // const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent.id);
    // if (paymentIntent.status !== "succeeded") {
    //   return res.status(httpCodes.serverSideError).json({
    //     success: false,
    //     message: "Payment not completed",
    //   });
    // }

    // 3) Update order status in your DB
    order = await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: "paid",
        orderStatus: "confirmed",
        // Stripe doesn’t use payerId; you could store customer ID if you want:
        payerId:payerId,
      },
    });

    
    const studentCourses = await prisma.studentCourse.findFirst({
      where: { userId: order.userId },
    });

    const newCourseEntry = {
      courseId: order.courseId,
      title: order.courseTitle,
      instructorId: order.instructorId,
      instructorName: order.instructorName,
      dateOfPurchase: order.orderDate,
      courseImage: order.courseImage,
    };

    if (studentCourses) {
      await prisma.studentCourse.create({
        data: {
          userId: order.userId,
          courseId: order.courseId,
          title: order.courseTitle,
          instructorId: order.instructorId,
          instructorName: order.instructorName,
          dateOfPurchase: order.orderDate,
          courseImage: order.courseImage,
        },
      });
    } else {
      await prisma.studentCourse.create({
        data: {
          userId: order.userId,
          courseId: order.courseId,
          courseImage: order.courseImage,
          instructorId: order.instructorId,
          instructorName: order.instructorName,
          dateOfPurchase: order.orderDate,
          title: order.courseTitle,
        },
      });
    }

    const courseRecord = await prisma.course.findUnique({
      where: { id: Number(order.courseId) },
      include:{students:true}
    });

    const newStudentEntry = {
      studentId: order.userId,
      studentName: order.userName,
      studentEmail: order.userEmail,
      paidAmount: order.coursePricing,
      courseId: Number(order.courseId),
    };

    const updatedStudents = Array.isArray(courseRecord?.students)
      ? [...courseRecord.students, newStudentEntry]
      : [newStudentEntry];

    await prisma.course.update({
      where: { id: Number(order.courseId) },
      data: {
        students: {
          deleteMany: {},
          create: updatedStudents.map((s) => ({
            studentId: s.studentId,
            studentName: s.studentName,
            studentEmail: s.studentEmail,
            paidAmount: s.paidAmount,
          })),
        },
      },
    });
    console.log("courrse purchased");

    
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: userEmail,
      subject: "PaymentConfirmation",
      // text:registrationText
      html: PAYMENT_CONFIRMATION_TEMPLATE.replace("{{name}}",userName)
        .replace("{{courseTitle}}", courseTitle)
        .replace("{{amount}}", coursePricing)
        .replace("{{transactionId}}", session.id)
        .replace("{{purchaseDate}}", order.orderDate)
        .replace("{{receiptLink}}",session.payment_link),
    };
    
    addToLowPriorityNotificationQueue("purchase email",mailOptions);

    // 3) Return the URL to redirect your user to
    res.status(httpCodes.created).json({
      success: true,
      data: {
        approveUrl: session.url,
        orderId: newlyCreatedCourseOrder.id,
      },
    });

  } catch (err) {
    console.error(err);
    res.status(httpCodes.serverSideError).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const capturePaymentAndFinalizeOrder = async (req, res) => {
  try {
    const { paymentId, payerId, orderId } = req.body;

    // 1) Retrieve existing order
    let order = await prisma.order.findFirst({ where: { id: orderId } });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order can not be found",
      });
    }

    // 2) Verify payment with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentId);
    if (paymentIntent.status !== "succeeded") {
      return res.status(httpCodes.serverSideError).json({
        success: false,
        message: "Payment not completed",
      });
    }

    // 3) Update order status in your DB
    order = await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: "paid",
        orderStatus: "confirmed",
        // Stripe doesn’t use payerId; you could store customer ID if you want:
        payerId: paymentIntent.customer || null,
      },
    });

    // 4) The rest of your “finalize” logic is untouched…
    const studentCourses = await prisma.studentCourse.findFirst({
      where: { userId: order.userId },
    });

    const newCourseEntry = {
      courseId: order.courseId,
      title: order.courseTitle,
      instructorId: order.instructorId,
      instructorName: order.instructorName,
      dateOfPurchase: order.orderDate,
      courseImage: order.courseImage,
    };

    if (studentCourses) {
      await prisma.studentCourse.create({
        data: {
          userId: order.userId,
          courseId: order.courseId,
          title: order.courseTitle,
          instructorId: order.instructorId,
          instructorName: order.instructorName,
          dateOfPurchase: order.orderDate,
          courseImage: order.courseImage,
        },
      });
    } else {
      await prisma.studentCourse.create({
        data: {
          userId: order.userId,
          courseId: order.courseId,
          courseImage: order.courseImage,
          instructorId: order.instructorId,
          instructorName: order.instructorName,
          dateOfPurchase: order.orderDate,
          title: order.courseTitle,
        },
      });
    }

    const courseRecord = await prisma.course.findUnique({
      where: { id: Number(order.courseId) },
    });

    const newStudentEntry = {
      studentId: order.userId,
      studentName: order.userName,
      studentEmail: order.userEmail,
      paidAmount: order.coursePricing,
      courseId: Number(order.courseId),
    };

    const updatedStudents = Array.isArray(courseRecord?.students)
      ? [...courseRecord.students, newStudentEntry]
      : [newStudentEntry];

    await prisma.course.update({
      where: { id: Number(order.courseId) },
      data: {
        students: {
          deleteMany: {},
          create: updatedStudents.map((s) => ({
            studentId: s.studentId,
            studentName: s.studentName,
            studentEmail: s.studentEmail,
            paidAmount: s.paidAmount,
          })),
        },
      },
    });

    res.status(httpCodes.ok).json({
      success: true,
      message: "Order confirmed",
      data: order,
    });
  } catch (err) {
    console.error(err);
    res.status(httpCodes.serverSideError).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

export { createOrder, capturePaymentAndFinalizeOrder };

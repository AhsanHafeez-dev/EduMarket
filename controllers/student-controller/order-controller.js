import Stripe from "stripe";
import { httpCodes } from "../../constants.js";
import { prisma } from "../../prisma/index.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { PAYMENT_CONFIRMATION_TEMPLATE } from "../../utils/EmailTemplate.js";

// import { addToHighPriorityNotificationQueue } from "../../utils/notification.js";
import { Session } from "@google/genai";



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
      paymentMethod="stripe",
      paymentStatus="pending",
      orderDate,
      payerId,
      instructorId = "7",
      instructorName = "john guttag", // this is the name of payment reciever 
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

    // checking wether course(in general any product) is already brought or not
    
    let std = await prisma.studentCourse.findFirst({ where: { userId: userId, courseId: courseId } });
    
    if (std)
    { return res.status(httpCodes.unprocessableEntity).json(new ApiResponse(httpCodes.unprocessableEntity, {}, "course is already brought by user")); }
    
    
    
    // 1) Create a Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "alipay"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: courseTitle,
              images: [courseImage],
              description: "No Descriotion available for now  ",
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
      invoice_creation: {
        enabled: true,
        invoice_data: {
          description: "Invoice for initial payment",
          footer: "Thank you for your business",
          custom_fields: [{ name: "Sales rep", value: "Alice" }],
          metadata: {
            userId: userId,
            courseId: courseId,
            courseImage: courseImage,
            instructorId: instructorId,
            instructorName: instructorName,
            dateOfPurchase: orderDate,
            title: courseTitle,
            coursePricing,
            orderDate,
            userEmail,
            userName
          },
        },
      },
      customer_email: userEmail,
      custom_fields: [
        {
          key: "order_note",
          label: { type: "custom", custom: "Order Note" },
          type: "text", // or 'dropdown'
          optional: true,
        },
      ],

      
      expires_at: Math.floor(Date.now() / 1000) + 3600, // expire in 1 hour

      billing_address_collection: "auto",
      shipping_address_collection: {
        allowed_countries: ["AC", "AD", "ID", "PK", "IN", "US", "UZ"],
      },
      shipping_options: [{ shipping_rate: "shr_1SM5PKRvBiYS0PLoMyYNNwME" }],

      custom_text: {
        after_submit: { message: "Thanks! We’ll get started right away." },
      },
      
    });
    payerId += "";
    console.log("\n\n\nresponse of strips",session);
    // 2) Persist order in database
    const newlyCreatedCourseOrder = await prisma.order.create({
      data: {
        userId,
        stripeTransactionId: session.id,
        orderId:Session.id,
        
        
        userName,
        userEmail,
        orderStatus:"confirmed",
        paymentMethod,
        paymentStatus:"paid",
        orderDate,
        paymentId: session.id,
        payerId,
        instructorId,
        instructorName,
        courseImage,
        courseTitle,
        courseId,
        coursePricing,
        
        
      },
    });

    // let order = await prisma.order.findFirst({ where: { id: newlyCreatedCourseOrder?.id } });
    if (!newlyCreatedCourseOrder) {
      return res.status(404).json({
        success: false,
        message: "Order can not be found",
      });
    }
    console.log("Id of purchase by ",payerId,"  for course : ",courseId," is : ",newlyCreatedCourseOrder?.id)
   
   await prisma.studentCourse.create({
     data: {
       userId: userId,
       courseId: courseId,
       courseImage: courseImage,
       instructorId: instructorId,
       instructorName: instructorName,
       dateOfPurchase: orderDate,
       title: courseTitle,
     },
   });
   console.log("added student in list of students who have purchased course  "); 
    await prisma.courseStudent.create({
      data: {
        studentId: userId,
        studentName: userName,
        studentEmail: userEmail,
        paidAmount: parseFloat(coursePricing),
        courseId: parseInt(courseId + ""),
      },
    });

    await prisma.course.update({
      where: { id: parseInt(courseId) },
      data: { noOfStudents: { increment: 1 } },
    });


   
   
   console.log("courrse purchased");

   const mailOptions = {
     from: process.env.SENDER_EMAIL,
     to: userEmail,
     subject: "PaymentConfirmation",
     // text:registrationText
     html: PAYMENT_CONFIRMATION_TEMPLATE.replace("{{name}}", userName)
       .replace("{{courseTitle}}", courseTitle)
       .replace("{{amount}}", coursePricing)
       .replace("{{transactionId}}", session.id)
       .replace("{{purchaseDate}}", orderDate)
       .replace("{{receiptLink}}", session.invoice),
   };
   console.log("recipet url", session.invoice);

  //  addToHighPriorityNotificationQueue("purchase email", mailOptions);
   
    // 2) Verify payment with Stripe
    // const session2 = await stripe.checkout.sessions.retrieve(session.id);
    // const paymentIntent = session2.invoice?.pay;
    // if (paymentIntent.status !== "succeeded") {
    //   return res.status(httpCodes.serverSideError).json({
    //     success: false,
    //     message: "Payment not completed",
    //   });
    //   // console.log(`\n\n\nPaymentIntent : \n}`,paymentIntent)
    // }
    
  
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

// not used
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
    
    
    // const courseRecord = await prisma.course.findUnique({
    //   where: { id: Number(order.courseId) },
    // });

    // const newStudentEntry = {
    //   studentId: order.userId,
    //   studentName: order.userName,
    //   studentEmail: order.userEmail,
    //   paidAmount: order.coursePricing,
    //   courseId: Number(order.courseId),
    // };

    // const updatedStudents = Array.isArray(courseRecord?.students)
    //   ? [...courseRecord.students, newStudentEntry]
    //   : [newStudentEntry];

    // await prisma.course.update({
    //   where: { id: Number(order.courseId) },
    //   data: {
    //     students: {
    //       deleteMany: {},
    //       create: updatedStudents.map((s) => ({
    //         studentId: s.studentId,
    //         studentName: s.studentName,
    //         studentEmail: s.studentEmail,
    //         paidAmount: s.paidAmount,
    //       })),
    //     },
    //   },
    // });
    
    // finalize(sess) 
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




const confirmPayment = async (req, res) => {
  console.log("got webhook from stripe");
  const sig = req.header("stripe-signature");
  let event;
  try {
    // ✅ Verify event came from Stripe
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    console.log("Body : ", req.body);
  } catch (err) {
    console.error("⚠️ Webhook signature verification failed.", err.message);
    return res.status(200).send(`Webhook Error: ${err.message}`);
  }
  console.log("event : ",event);
  ;
  // ✅ Handle different event types

let metadata = event.data.object.metadata;
  if (event.type === "invoice.payment_succeeded") {
    // { instructorId: '7', userId: '43', courseId: '17' }
    
    // 3) Update order status in your DB
    const  s = await prisma.order.updateManyAndReturn({
      where: { userId:metadata.userId,courseId:metadata.courseId },
      data: {
        paymentStatus: "paid",
        
        orderStatus: "confirmed",
        invoiceUrl:event.data.object.hosted_invoice_url,
        
        
        payerId: metadata.userId,
      },
    });

    await prisma.studentCourse.create({
      data: {
        userId: metadata.userId,
        courseId: metadata.courseId,
        courseImage: metadata.courseImage,
        instructorId: metadata.instructorId,
        instructorName: metadata.instructorName,
        dateOfPurchase: metadata.orderDate,
        title: metadata.title,
      },
    });

    console.log(
      "added student in list of students who have purchased course  "
    );
    await prisma.courseStudent.create({
      data: {
        studentId: metadata.userId,
        studentName: metadata.userName,
        studentEmail: metadata.userEmail,
        paidAmount: parseFloat(metadata.coursePricing),
        courseId: parseInt(metadata.courseId+""),
      },
    });

    await prisma.course.update({ where: { id: parseInt(metadata.courseId) }, data: { noOfStudents: { increment: 1 } } });

    console.log("courrse purchased");

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: metadata.userEmail,
      subject: "PaymentConfirmation",
      // text:registrationText
      html: PAYMENT_CONFIRMATION_TEMPLATE.replace("{{name}}", metadata.userName)
        .replace("{{courseTitle}}", metadata.title)
        .replace("{{amount}}", metadata.coursePricing)
        .replace("{{transactionId}}", event.id)
        .replace("{{purchaseDate}}", metadata.orderDate)
        .replace("{{receiptLink}}", event.data.object.hosted_invoice_url),
    };
    console.log("recipet url",event.data.object.receipt_url);

    // addToHighPriorityNotificationQueue("purchase email", mailOptions);
  }
  else if (event.type === "invoice_payment.unpaid" || event.type === "checkout.session.expired" || event.type === "invoice.payment_failed"|| event.type==="invoice.finalization_failed" || event.type==="inv") {
    await prisma.order.deleteMany({ where: { userId:metadata.userId,courseId:metadata.courseId } });
    console.log("deleted transaction");
  }
  else {
    console.log("its not our type : ",event.type);
  }
  console.log("Metadata : ",event.data.object.metadata);
  console.log("kuch nhi hwa bhai XD");
  return res.status(200).send(`done and dusted`);
    
}
export {
  createOrder,
  capturePaymentAndFinalizeOrder,
  confirmPayment
};

import PDFDocument from "pdfkit";
import fs from "fs";
import QRCode from "qrcode";
import path from "path";
// import { uploadMediaToCloudinary } from "./cloudinary.js";

/**
 * Generates a certificate PDF and returns the file path once complete.
 * @param {string} studentName  - Name of the student
 * @param {string} courseTitle  - Title of the completed course
 * @param {string} certId       - Unique certificate identifier
 * @returns {Promise<string>}    - Resolves to the certificate file path
 */
async function generateCertificatePdf(
  studentName = "unknown",
  courseTitle = "unknown",
  certId = "ABC123XYZ"
) {
  const completionDate = new Date().toLocaleDateString();

  // Build upload directory & output path
  const baseDir = process.cwd().replace("\\utils","");
  const uploadDirectory = path.join(baseDir, "uploads");

  // fs.mkdirSync(uploadDirectory, { recursive: true });

  const certPath = path.join(uploadDirectory, `certificate.pdf`);

  console.log(`generating certificate for ${studentName} in course ${courseTitle} in uploads directory`)
  // Create the PDF document (landscape A4)
  const doc = new PDFDocument({
    size: "A4",
    layout: "landscape",
    margins: { top: 50, bottom: 50, left: 72, right: 72 },
  });

  // Pipe to file
  const writeStream = fs.createWriteStream(certPath);
  doc.pipe(writeStream);

  // Draw border
  doc
    .rect(0, 0, doc.page.width, doc.page.height)
    .fill("#f5f5f5")
    .stroke("#333")
    .lineWidth(4)
    .stroke();

  // Title
  doc
    .fillColor("#333")
    .fontSize(36)
    .font("Times-Bold")
    .text("Certificate of Completion", { align: "center", valign: "top" });

  // Student name
  doc
    .moveDown(2)
    .fontSize(28)
    .font("Times-Roman")
    .text(`This is to certify that`, { align: "center" })
    .moveDown(0.5)
    .fontSize(32)
    .font("Times-BoldItalic")
    .text(studentName, { align: "center" });

  // Course title and date
  doc
    .moveDown(1.5)
    .fontSize(24)
    .font("Times-Roman")
    .text(`has successfully completed the course`, { align: "center" })
    .moveDown(0.5)
    .fontSize(26)
    .font("Times-Bold")
    .text(courseTitle, { align: "center" })
    .moveDown(1)
    .fontSize(20)
    .font("Times-Italic")
    .text(`on ${completionDate}`, { align: "center" });

  // Generate QR code (promise API)
  const verifyUrl = `https://lms.example.com/verify/${certId}`;
  const dataUrl = await QRCode.toDataURL(verifyUrl, { margin: 1 });
  const imgData = dataUrl.replace(/^data:image\/png;base64,/, "");
  doc.image(
    Buffer.from(imgData, "base64"),
    doc.page.width - 150,
    doc.page.height - 150,
    { fit: [120, 120], align: "right" }
  );

  // Certificate ID
  doc
    .fontSize(12)
    .font("Courier")
    .fillColor("#555")
    .text(`Certificate ID: ${certId}`, 50, doc.page.height - 70, {
      align: "left",
    });

  // Finalize the PDF
  doc.end();

  // Wait for the file to be fully written
  await new Promise((resolve, reject) => {
    writeStream.on("finish", resolve);
    writeStream.on("error", reject);
  });

  // Return the completed path
  return certPath;
}

export { generateCertificatePdf };
  
  
// const abc = await generateCertificatePdf();
// const url = (await uploadMediaToCloudinary(abc));
// console.log(url);
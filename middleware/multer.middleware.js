import multer from "multer";
import path from "path";


// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
    
//     cb(null, "/upload");
//   },
//   filename: function (req, file, cb) {
    
//     cb(null, file.originalname);
//   },
// });
// const storage=multer.memoryStorage()
const storage = multer.memoryStorage();
export const upload = multer({
  storage,
});

import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, process.cwd() + "/uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname.replace(/\s+/g, "-"));
    },
});

const uploadAny = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5 // 5MB
    },
});
export default uploadAny;

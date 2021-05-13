var multer = require("multer");
const sharp = require("sharp");
const fs = require("fs");

var re = /(?:\.([^.]+))?$/;
var fileName = "";
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + "." + re.exec(file.originalname)[1]);
    fileName = file.fieldname + "-" + uniqueSuffix + "." + re.exec(file.originalname)[1];
  }
});
var upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
}).single("avatar");

// Check File Type
function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(re.exec(file.originalname)[1].toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images Only!");
  }
}

exports.singleFile = (req, res, err) => {
  upload(req, res, err => {
    if (err) {
      res.status(500).send(err);
    } else {
      if (req.file == undefined) {
        res.status(400).send("No file selected");
      } else {
        // console.log(fileName);
        // res.status(200).send("Upload OK");

        // resize image
        sharp(req.file.path)
          .rotate()
          .resize(1280)
          .jpeg({ quality: 75 })
          .toFile("./public/images/resized-" + fileName)
          .then(data => {
            
            // delete original file
            fs.unlink("./public/images/" + fileName, err => {
              if (err) {
                console.error(err);
                res.status(500).send(err);
                return;
              }
              res.status(200).send("Upload & Resize OK");
            });
          })
          .catch(err => {
            console.log(err);
            res.status(500).send(err);
          });
      }
    }
  });
};

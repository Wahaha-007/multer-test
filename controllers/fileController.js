const multer = require('multer');

// Set storage parameters
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    // cb(null, file.fieldname + '-' + Date.now())
    cb(null, Date.now() + '-' + file.originalname)
    console.log(file);
  }
})

const upload = multer({ storage: storage })

// or simpler version, 
// const upload = multer({ dest: 'uploads' })
// If no destination is given, the operating system's default directory for temporary files is used.
// If no filename is given, each file will be given a random name that doesn't include any file extension.
// Need to manually create upload directory beforehand

exports.index = function (req, res) {
  res.render('upload');
};

exports.uploadSingle =
  [
    upload.single('myFile'),    // 1. Real action

    (req, res, next) => {       // 2. Upon complete uploading

      const file = req.file
      if (!file) {
        const error = new Error('Please upload a file')
        error.httpStatusCode = 400
        return next(error)
      }
      res.send(file)
    }
  ]

exports.uploadMultiple =
  [
    upload.array('myFiles', 12),// 1. Real action, Maxcount 12 files

    (req, res, next) => {       // 2. Upon complete uploading

      const files = req.files
      if (!files) {
        const error = new Error('Please choose files')
        error.httpStatusCode = 400
        return next(error)
      }
      res.send(files)
    }
  ]

exports.uploadPhoto = // Not complete yet, do not use
  [
    upload.single('picture'),   // 1. Real action

    (req, res, next) => {       // 2. Upon complete uploading

      const img = fs.readFileSync(req.file.path);
      const encode_image = img.toString('base64');
      // Define a JSONobject for the image attributes for saving to database

      const finalImg = {
        contentType: req.file.mimetype,
        image: new Buffer(encode_image, 'base64')
      };

      db.collection('quotes').insertOne(finalImg, (err, result) => {
        console.log(result)

        if (err) return console.log(err)

        console.log('saved to database')
        res.redirect('/')


      })
    }
  ]
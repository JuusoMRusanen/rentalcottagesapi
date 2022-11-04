//const db = require("../models/index.dev"); // DEVELOPMENT PATH
const db = require("../models/index"); // PRODUCTION PATH

const Photo = db.photo;
const Op = db.Sequelize.Op;

const formidable = require('formidable');
const fs = require('fs');

// Create and Save a new Photo
exports.create = (req, res) => {

  //console.log(req.body.selectedFile);

  var form = new formidable.IncomingForm();

  form.parse(req, function (err, fields, files) {

    var oldpath = files.selectedFile.filepath;

    var newpath = "/home/juurus/Github/rentalcottagesapi/public/photos/" + files.selectedFile.originalFilename;

    // Read the file
    fs.readFile(oldpath, function (err, data) {
      if (err) throw err;
      console.log('File read!');

      // Write the file
      fs.writeFile(newpath, data, function (err) {
          if (err) throw err;
          res.write('File uploaded and moved!');
          res.end();
          console.log('File written!');
      });

      // Delete the file
      fs.unlink(oldpath, function (err) {
          if (err) throw err;
          console.log('File deleted!');
      });
    });

  /* fs.rename(oldpath, newpath, function (err) {
    if (err) throw err;
    console.log('File uploaded and moved!');
  }); */
  
  });
  
  /* try {
    console.log(req.file);

    if (req.file == undefined) {
      return res.send(`You must select a file.`);
    }

    Photo.create({
      type: req.file.mimetype,
      name: req.file.originalname,
      data: fs.readFileSync(
        __basedir + "/public/photos/" + req.file.filename
      ),
    }).then((image) => {
      fs.writeFileSync(
        __basedir + "/public/tmp/" + image.name,
        image.data
      );

      console.log(`File has been uploaded.`);
    });
  } catch (error) {
    console.log(error);
    return res.send(`Error when trying upload images: ${error}`);
  }
  
  // Validate request
  if (!req.body.title) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Create a Photo
  const Photo = {
    src: req.body.src,
    priority: req.body.priority,
  };

  // Save Photo in the database
  Photo.create(Photo)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Photo."
      });
    }); */
};

// Retrieve photos for a cottage.
exports.findAllForCottage = (req, res) => {

  const cottageId = req.params.id;

  Photo.findAll({ where: { cottageId: cottageId } })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving photos."
      });
    });
};

// Retrieve all photos from the database.
exports.findAll = (req, res) => {

  const src = req.body.src;
  var condition = src ? { src: { [Op.iLike]: `%${src}%` } } : null;

  Photo.findAll({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving photos."
      });
    });
};

// Find a single Photo with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Photo.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Photo with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Photo with id=" + id
      });
    });
};

// Update a Photo by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Photo.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Photo was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Photo with id=${id}. Maybe Photo was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Photo with id=" + id
      });
    });
};

// Delete a Photo with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Photo.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Photo was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Photo with id=${id}. Maybe Photo was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Photo with id=" + id
      });
    });
};

// Delete all photos from the database.
exports.deleteAll = (req, res) => {
  Photo.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} photos were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all photos."
      });
    });
};
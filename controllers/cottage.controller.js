//const db = require("../models/index.dev"); // DEVELOPMENT PATH
const db = require("../models/index"); // PRODUCTION PATH
const { QueryTypes } = require('sequelize');
const multer = require("multer");
const crypto = require('crypto');

const Cottage = db.cottage;
const Photo = db.photo;
const Op = db.Sequelize.Op;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, __dirname + '/../public/photos/')
  },
  filename: function (req, file, cb) {

    cb(null, "cottagephoto" + '-' + crypto.randomUUID() + ".jpg")
  }
})

const upload = multer({ storage: storage }).array('files', 6)

// Create and Save a new Cottage
exports.create = async (req, res) => {

  async function getLastIDs() {

    let lastCottageId = 1;
    let lastPhotoId = 1;
    
    // Get the last cottage in database
    await Cottage.sequelize.query(
      'SELECT '+
      'cottage.id AS "cottageId" '+
      'FROM cottage '+
      'ORDER BY "cottageId" DESC '+
      'LIMIT 1',
      { type: QueryTypes.SELECT })
    .then(data => {
      lastCottageId = data[0].cottageId;
    });

    // Get the last photo in database
    await Photo.sequelize.query(
      'SELECT '+
      'photo.id AS "photoId" '+
      'FROM photo '+
      'ORDER BY "photoId" DESC '+
      'LIMIT 1',
      { type: QueryTypes.SELECT })
    .then(data => {
      lastPhotoId = data[0].photoId;
    });

    return({
      lastCottageId : lastCottageId, 
      lastPhotoId : lastPhotoId
    });
  }

  upload(req, res, function (err) {
    
    if (err instanceof multer.MulterError) {
      console.log(err);
      
      // A Multer error occurred when uploading.
    } 
    
    else if (err) {
      console.log(err);
      
      // An unknown error occurred when uploading.
    }

    // Everything went fine.
    if (req.files != undefined) {
      if (req.files.length > 0) {

        let files = [];
        
        req.files.forEach(file => {
          files.push(file);
        })
        
        savePhotos(files);
      }
    } else {
      console.log("Files are undefined.")
    }
    
  })

  // Save Photos in the database
  async function savePhotos (files) {

    // Create Photos and save them in the database
    await getLastIDs().then(({ lastCottageId, lastPhotoId }) => {

      // Create a Cottage
      const cottage = {
        id: lastCottageId + 1,
        cityId: req.body.cityId,
        name: req.body.name,
        bedrooms: req.body.bedrooms,
        bathrooms: req.body.bathrooms,
        price: req.body.price,
        size: req.body.size,
      };

      // Save Cottage in the database
      Cottage.create(cottage)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Cottage."
        });
      })

      return({ 
        lastCottageId:lastCottageId, 
        lastPhotoId:lastPhotoId
      })
    }).then(({ lastCottageId, lastPhotoId }) => {
      for (let idx = 0; idx < files.length; idx++) {

        let file = files[idx]

        const photo = {
          id: lastPhotoId + (idx + 1),
          cottageId: lastCottageId + 1,
          src: `/photos/${file.filename}`,
          priority: idx,
        };

        //console.log(photo);

        Photo.create(photo)
        .catch(err => { 
          console.log( "Error! : "+err ) 
        })
      }
    })
  }

};

// Retrieve all cottages from the database.
exports.findAll = async (req, res) => {

  await Cottage.sequelize.query(
    'SELECT *, '+
    'cottage.id AS "cottageId", '+
    'region.id AS "regionId", '+
    'city.name AS "cityName", '+
    'region.name AS "regionName", '+ 
    'cottage.name AS "cottageName" '+ 
    'FROM cottage '+
    'JOIN city ON "cityId" = city.id '+
    'JOIN region ON "regionId" = region.id',
    { type: QueryTypes.SELECT })
  .then(data => {
    res.send(data);
  });
};

// Retrieve all cottages by regionId
exports.findAllByRegionId = async (req, res) => {

  const regionId = req.params.id;

  await Cottage.sequelize.query(
    'SELECT *, '+
    'cottage.id AS "cottageId", '+
    'region.id AS "regionId", '+
    'city.name AS "cityName", '+
    'region.name AS "regionName", '+ 
    'cottage.name AS "cottageName" '+ 
    'FROM cottage '+
    'JOIN city ON "cityId" = city.id '+
    'JOIN region ON "regionId" = region.id '+
    'WHERE "regionId" = :regionId',
    { replacements:{ regionId: regionId }, type: QueryTypes.SELECT })
  .then(data => {
    res.send(data);
  });
};

// Retrieve all cottages by cityId
exports.findAllByCityId = async (req, res) => {

  const cityId = req.params.id;

  await Cottage.sequelize.query(
    'SELECT *, '+
    'cottage.id AS "cottageId", '+
    'region.id AS "regionId", '+
    'city.name AS "cityName", '+
    'region.name AS "regionName", '+ 
    'cottage.name AS "cottageName" '+ 
    'FROM cottage '+
    'JOIN city ON "cityId" = city.id '+
    'JOIN region ON "regionId" = region.id '+
    'WHERE "cityId" = :cityId',
    { replacements:{ cityId: cityId }, type: QueryTypes.SELECT })
  .then(data => {
    res.send(data);
  });
};

// Find a single Cottage with an id
exports.findOne = async (req, res) => {

  const id = req.params.id;
  const error = "Hupsista! Mökkiä ei löytynyt.";
  const reg = new RegExp('^[0-9]+$'); // a number or not
  
  if (reg.test(id)) {
    await Cottage.sequelize.query(
      'SELECT *, '+
      'cottage.id AS "cottageId", '+
      'city.id AS "cityId", '+
      'region.id AS "regionId", '+
      'city.name AS "cityName", '+
      'region.name AS "regionName", '+
      'cottage.name AS "cottageName" '+
      'FROM cottage '+
      'JOIN city ON "cityId" = city.id '+
      'JOIN region ON "regionId" = region.id '+
      'WHERE cottage.id = :id',
      { replacements: { id: id }, type: QueryTypes.SELECT })
    .then( (data, err) => {
      if (data.length > 0) {
        res.send({ cottage: data })
      } else {
        res.send({ error })
      }
      if (err) throw err;
    })
  } else {
    res.send({ error })
    console.log("Cottage not found.")
  }
};

// Update a Cottage by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Cottage.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Cottage was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Cottage with id=${id}. Maybe Cottage was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Cottage with id=" + id
      });
    });
};

// Delete a Cottage with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Cottage.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Cottage was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Cottage with id=${id}. Maybe Cottage was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Cottage with id=" + id
      });
    });
};

// Delete all cottages from the database.
exports.deleteAll = (req, res) => {
  Cottage.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} cottages were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all cottages."
      });
    });
};
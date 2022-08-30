const express = require('express');
const app = express();
const port = process.env.PORT || 3001;
const path = require('path');

const bp = require('body-parser')

app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))

const mysql = require('mysql')
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'rental_cottages'
})

// This displays message that the server running and listening to specified port
app.listen(port, () => console.log(`Listening on port ${port}`));

app.use(express.static('public'));

app.get('/hello', (req, res) => {

  res.send({ greetings: "hello" });
});

app.get('/getUserRatings/:cottageId', (req, res) => {

  connection.query(
    'SELECT * '+
    'FROM user_ratings '+
    'WHERE user_ratings.cottageID = ? ',
    [req.params.cottageId], (err, rows, fields) => {
    if (err) throw err

    res.send({ userRatings: rows });
  });
});

app.get('/listUserRatings', (req, res) => {

  connection.query(
    'SELECT * '+
    'FROM user_ratings ',
    [], (err, rows, fields) => {
    if (err) throw err

    res.send({ userRatings: rows });
  });
});

app.get('/getPhotos/:cottageId', (req, res) => {

  //console.log(req.query.cottageId)

  connection.query(
    'SELECT * '+
    'FROM cottage_photo '+
    'JOIN photos ON cottage_photo.photoId = photos.id '+
    'WHERE cottage_photo.cottageId IN (?)',
    [req.query.cottageId], (err, rows, fields) => {
    if (err) throw err

    let photos = [];

    rows.forEach((row, index) => {

      let photo = {
        id : index,
        cottageId : row.cottageId,
        priority : row.priority,
        src : row.src,
        alt : "kuva mökistä"
      }

      photos.push(photo);
    });

    res.send({ photos });
  });
  
});

app.get('/getCottagesRowCount', (req, res) => {

  let rowCount = 0;

  connection.query(
    'SELECT COUNT(*) AS count '+
    'FROM cottages',
    [], (err, rows, fields) => {
    if (err) throw err
    
    rowCount = rows[0].count;

    res.send({ rowCount });
  });
  
});

app.get('/listCottages', (req, res) => {

  let cottages = [];

  connection.query(
    'SELECT *, '+
    'cottages.id AS cottageId, '+
    'regions.id AS regionId, '+
    'cities.name AS cityName, '+
    'regions.name AS regionName, '+
    'cottages.name AS cottageName '+
    'FROM cottages '+
    'JOIN cities ON cottages.cityId = cities.id '+
    'JOIN regions ON cities.regionId = regions.id ',
    [], (err, rows, fields) => {
    if (err) throw err

    rows.forEach((row, index) => {

      let cottage = [{
        cottageId : row.cottageId,
        regionId : row.regionId,
        cityId : row.cityId,
        cottageName : row.cottageName,
        cityName : row.cityName,
        regionName : row.regionName,
        price : row.price,
        accomodation : row.accomodation,
        bedrooms : row.bedrooms,
        bathrooms : row.bathrooms,
        size : row.size,
      }];

      //console.log(row.cityId)

      cottages.push(cottage);
    });

    res.send({ cottages });
  });
});

app.get('/listCottagesByPage/:page', (req, res) => {

  let rowsPerPage = 20;
  let currentPage = parseInt(req.params.page);
  let endRow = currentPage * rowsPerPage;
  let startRow = endRow - rowsPerPage;
  let cottages = [];

  connection.query(
    'SELECT *, '+
    'cottages.id AS cottageId, '+
    'cities.id AS cityId, '+
    'cities.name AS cityName, '+
    'regions.name AS regionName, '+
    'cottages.name AS cottageName '+
    'FROM cottages '+
    'JOIN cities ON cottages.cityId = cities.id '+
    'JOIN regions ON cities.regionId = regions.id '+
    'LIMIT ?, ?',
    [startRow, rowsPerPage], (err, rows, fields) => {
    if (err) throw err

    rows.forEach((row, index) => {

      let cottage = [{
        cottageId : row.cottageId,
        cottageName : row.cottageName,
        cityName : row.cityName,
        regionName : row.regionName,
        price : row.price,
        accomodation : row.accomodation,
        bedrooms : row.bedrooms,
        bathrooms : row.bathrooms,
        size : row.size,
        rating : 0,
      }];

      cottages.push(cottage);
    });

    res.send({ cottages });
  });
});

app.get('/getCottage/:id', (req, res) => {
  
  connection.query(
    'SELECT *, '+ 
    'cottages.id AS cottageId, '+
    'cities.id AS cityId, '+
    'regions.id AS regionId, '+
    'cities.name AS cityName, '+
    'regions.name AS regionName, '+
    'cottages.name AS cottageName '+
    'FROM cottages '+
    'JOIN cities ON cottages.cityId = cities.id '+
    'JOIN regions ON cities.regionId = regions.id '+
    'JOIN cottage_photo ON cottages.id = cottage_photo.cottageId '+
    'JOIN photos ON cottage_photo.photoId = photos.id '+
    //'JOIN user_ratings ON user_ratings.cottageID = cottages.id '+
    'WHERE cottages.id = ?',
    [req.params.id], (err, rows, fields) => {
    if (err) throw err

    let error = "";

    if (rows.length > 0) {

      let cottage = [{
        cottageId : rows[0].cottageId,
        regionId : rows[0].regionId,
        cityId : rows[0].cityId,
        cottageName : rows[0].cottageName,
        cityName : rows[0].cityName,
        regionName : rows[0].regionName,
        price : rows[0].price,
        accomodation : rows[0].accomodation,
        bedrooms : rows[0].bedrooms,
        bathrooms : rows[0].bathrooms,
        size : rows[0].size
      }];
  
      let photos = [];
      //let userRatings = [];
  
      rows.forEach((row, index) => {
  
        let photo = {
          id : index,
          src : row.src,
          alt : "kuva mökistä"
        }
  
        photos.push(photo);

        /*
        let userRating = {
          id : index,
          cottageId : row.cottageId,
          rating : row.rating,
          comment : row.comment,
          nickName : row.nickName
        }
  
        userRatings.push(userRating);
        */
      });

      //console.log(photos)

      res.send({ cottage, photos });

    } else {
      error = "Hupsista! Mökkiä ei löytynyt!";
      res.send({ error });
    }
  });
  
});


app.post('/postPhoto', (req, res, next) => {

  let cottageId = req.body.cottageId;
  let photoId = req.body.photoId;

  connection.query(`INSERT INTO cottage_photo (cottageId, photoId) VALUES (?, ?)`, [cottageId, photoId], (err, result) => {
    if (err) throw err;
    console.log('Added a new record to table "cottage_photo"');
  })
  
});

// TEST DATA //

app.post('/postTestData', (req, res, next) => {

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  }

  for (let i = 1; i <= 1000; i++) {

    let photoId = getRandomInt(5, 14);

    connection.query(`INSERT INTO cottage_photo (cottageId, photoId) VALUES (?, ?)`, [i, photoId], (err, result) => {
      if (err) throw err;
      console.log(`CottageID: ${i}, PhotoID: ${photoId}`);
    })
    
    for (let o = 0; o <= 4; o++) {

      connection.query(`INSERT INTO cottage_photo (cottageId, photoId) VALUES (?, ?)`, [i, o], (err, result) => {
        if (err) throw err;
        console.log(`CottageID: ${i}, PhotoID: ${o}`);
      })
    }
  }
  
});
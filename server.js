// //Install express server
// const express = require('express');
// const path = require('path');
// // const fs = require('fs');

// const app = express();

// // Serve only the static files form the dist directory
// app.use(express.static(__dirname + '/build'));

// app.get('/*', function(req,res) {
//   // const city = req.path.split('/')[1]; // Assuming URL structure like /city-name
//   // let html = fs.readFileSync(path.join(__dirname, 'build', 'index.html'), 'utf8');

//   // const cities = [
//   //   'baltimore',
//   //   'phoenix',
//   //   'tampa'
//   // ];
//   // // Dynamically change meta tags based on the city
//   // if (city && cities.includes(city)) {
//   //   html = html.replace(/bloomberg_associates.png/g, `${city}-bg-color.jpg`);    
//   //   console.log(html);
//   // }

//   // res.send(html);
//   res.sendFile(path.join(__dirname+'/build/index.html'));
// });

// // Start the app by listening on the default Heroku port
// app.listen(process.env.PORT || 8080, () => 
//   console.log(`Listening on port ${process.env.PORT || 8080}`));

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const routes = require('./routes');
const app = express();
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI;



app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(cors());
app.use(routes);
app.use(express.static(__dirname + '/build'));

app.get('/*', function(req,res) {
  // const city = req.path.split('/')[1]; // Assuming URL structure like /city-name
  // let html = fs.readFileSync(path.join(__dirname, 'build', 'index.html'), 'utf8');

  // const cities = [
  //   'baltimore',
  //   'phoenix',
  //   'tampa'
  // ];
  // // Dynamically change meta tags based on the city
  // if (city && cities.includes(city)) {
  //   html = html.replace(/bloomberg_associates.png/g, `${city}-bg-color.jpg`);    
  //   console.log(html);
  // }

  // res.send(html);
  res.sendFile(path.join(__dirname+'/build/index.html'));
});

mongoose.set({
    strictQuery: false
  })
  .connect(MONGODB_URI, 
    { 
      useNewUrlParser: true, 
      useUnifiedTopology: true,
      readPreference: 'nearest'
    })
  .then(() => {
    console.log('Connected to', MONGODB_URI || 'Dev DB');
    app.listen(PORT, function () {
      console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`);
    });
  })
  .catch(err => {
    console.log('DB Connection ERROR: ', err);
  });

  // Middleware to log the database connection details
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to', MONGODB_URI);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});




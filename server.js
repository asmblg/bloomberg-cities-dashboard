//Install express server
const express = require('express');
const path = require('path');
// const fs = require('fs');

const app = express();

// Serve only the static files form the dist directory
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

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080, () => 
  console.log(`Listening on port ${process.env.PORT || 8080}`));
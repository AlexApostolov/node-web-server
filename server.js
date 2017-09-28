const express = require('express');
// Handlebars templating engine
const hbs = require('hbs');
const fs = require('fs');

var port = process.env.PORT || 3000;

var app = express();

// Specify partials directory to reuse pieces of template code in different pages
hbs.registerPartials(__dirname + '/views/partials');

// Set configuration for which view engine to use with key value pair
// Default folder Express looks for is "views"
app.set('view engine', 'hbs');

// Create middleware for a server log with a human readable timestamp
// and with request object properties
app.use((req, res, next) => {
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.url}`;
  console.log(log);
  // Add on to a file, 1st arg file name, 2nd arg what you want to add
  fs.appendFile('server.log', log + '\n', err => {
    if (err) {
      console.log('Unable to append to server.log.');
    }
  });
  next();
});

// // Maintenance middleware with date injected
// app.use((req, res, next) => {
//   res.render('maintenance.hbs', {
//     deadline: new Date('October 28, 2017 11:13:00')
//   });
// });

// Serve static files like html and pictures instead of creating individual routes for all of them
// NOTE: all files are openly visible to the public
app.use(express.static(__dirname + '/public'));

// Use helper functions instead of recomputing the same function for every page
// 1st arg name of the helper, 2nd arg is function to run
hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});

hbs.registerHelper('screamIt', text => {
  return text.toUpperCase();
});

app.get('/', (req, res) => {
  res.render('home.hbs', {
    pageTitle: 'Home Page',
    welcomeMessage:
      "Welcome to the best site on the Interwebs! I don't know how you found it, you must be a genius!"
  });
});

app.get('/about', (req, res) => {
  // Render Handlebars template for About page
  res.render('about.hbs', {
    pageTitle: 'About Page'
  });
});

app.get('/bad', (req, res) => {
  res.send({
    errorMessage:
      'Error, this location does not exist, turn around and go back.'
  });
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});

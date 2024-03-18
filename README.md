# LightBnB Project 

A simple multi-page Airbnb clone that uses a server-side Javascript to display the information from the queries to web pages via SQL queries.

* `db` contains all the database interaction code.
  * `json` is a directory that contains a bunch of dummy data in `.json` files.
  * `database.js` is responsible for all queries to the database. It doesn't currently connect to any database, all it does is return data from `.json` files.
* `public` contains all of the HTML, CSS, and client side JavaScript. 
  * `index.html` is the entry point to the application. It's the only html page because this is a single page application.
  * `javascript` contains all of the client side javascript files.
    * `index.js` starts up the application by rendering the listings.
    * `network.js` manages all ajax requests to the server.
    * `views_manager.js` manages which components appear on screen.
    * `components` contains all of the individual html components. They are all created using jQuery.
* `routes` contains the router files which are responsible for any HTTP requests to `/users/something` or `/api/something`. 
* `styles` contains all of the sass files. 
* `server.js` is the entry point to the application. This connects the routes to the database.

## SCREENSHOTS

### Screenshot of the login page
![screenshot of the login page](https://github.com/lnz-rvng/LightBnB/blob/master/docs/01_login-page.png?raw=true)

---
### Screenshot of the properties page
![screenshot of the properties page](https://github.com/lnz-rvng/LightBnB/blob/master/docs/02_properties.png?raw=true)

---
### Screenshot of the search page
![screenshot of the search page](https://github.com/lnz-rvng/LightBnB/blob/master/docs/03_filter-results.png?raw=true)

---
### Screenshot of the create listings page
![screenshot of the create listings page](https://github.com/lnz-rvng/LightBnB/blob/master/docs/04_create-listings.png?raw=true)

---
### Screenshot of the reservations page
![screenshot of the reservations page](https://github.com/lnz-rvng/LightBnB/blob/master/docs/05_reservations.png?raw=true)
const properties = require("./json/properties.json");
const users = require("./json/users.json");
const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function (email) {
  return pool
    .query('SELECT * FROM users WHERE email = $1', [email])
    .then(res => {
      if (res.rows.length > 0) {
        return res.rows[0];
      }
      return null;
    })
    .catch(err => {
      console.log(err.message);
    })
};

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function (id) {
  return pool
    .query('SELECT * FROM users WHERE id = $1', [id])
    .then(res => {
      if (res.rows.length > 0) {
        return res.rows[0];
      }
      return null;
    })
    .catch(err => {
      console.log(err.message);
    })
};

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function (user) {
  const { name, email, password } = user;

  return pool
    .query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3)RETURNING *', [name, email, password])
    .then(res => {
      if (res.rows.length > 0) {
        return res.rows[0];
      }
      return null;
    })
    .catch(err => {
      console.log(err.message);
    })
};

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function (guest_id, limit = 10) {
  return pool
    .query(`SELECT properties.*, reservations.*, avg(property_reviews.rating) AS average_rating
  FROM reservations
  JOIN properties ON reservations.property_id = properties.id
  JOIN property_reviews ON properties.id = property_reviews.property_id
  WHERE reservations.guest_id = $1
  GROUP BY properties.id, reservations.id
  ORDER BY reservations.start_date
  LIMIT $2;`, [guest_id, limit])
    .then(res => {
      return res.rows;
    })
    .catch(err => {
      console.log(err.message)
    })
};

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function (options, limit = 10) {

  const queryParams = []

  let queryString = `
    SELECT properties.*, avg(property_reviews.rating) as average_rating
    FROM properties
    LEFT JOIN property_reviews ON properties.id = property_id
    WHERE 1 = 1
    `;

  // Filter by city
  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += ` AND city LIKE $${queryParams.length} `;
  }

  // Filter by owner_id
  if (options.owner_id) {

    queryParams.push(options.owner_id);
    queryString += ` AND properties.owner_id = $${queryParams.length} `;
  }

  // Filter by price range
  if (options.minimum_price_per_night && options.maximum_price_per_night) {

    queryParams.push(options.minimum_price_per_night * 100); // Convert to cents
    queryParams.push(options.maximum_price_per_night * 100); // Convert to cents
    queryString += ` AND cost_per_night BETWEEN $${queryParams.length - 1} AND $${queryParams.length} `;
  }

  // Filter by minimum rating
  if (options.minimum_rating) {

    queryParams.push(options.minimum_rating);
    queryString += ` AND property_reviews.rating >= $${queryParams.length} `;
  }

  // Add the GROUP BY, ORDER BY, and LIMIT clauses
  queryParams.push(limit);
  queryString += `
    GROUP BY properties.id
    ORDER BY cost_per_night
    LIMIT $${queryParams.length}
  `;

  return pool.query(queryString, queryParams)
    .then(res => {
      return res.rows
    })
    .catch(err => {
      console.log(err.message)
    })
};

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function (property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
};

module.exports = {
  getUserWithEmail,
  getUserWithId,
  addUser,
  getAllReservations,
  getAllProperties,
  addProperty,
};

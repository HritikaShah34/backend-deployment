const { Resend } = require("resend");
const { Pool } = require("pg");

require("dotenv").config();


const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const getUsers = (request, response) => {
  pool.query("SELECT * FROM users", (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const checkUsername = (request, response) => {
  const { username } = request.body;
  pool.query('SELECT COUNT(*) AS count FROM user_info WHERE username = $1', [username], (error, results) => {
    if (error) {
      throw error;
    }
    const count = parseInt(results.rows[0].count);
    response.json({ exists: count > 0 });
  });
};

const createUser = (request, response) => {
  const { name, username, email, password, image, location, purpose } = request.body;
  pool.query(
    `INSERT INTO user_info (name, username, email, password, image, location, purpose) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING user_id`,
    [name, username, email, password, image , location, purpose],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(201).send(`User added with ID: ${results.rows[0].user_id}`);
    }
  );
};



const sendemail = async(req,res) => {
  const to = req.body.email;
  const resend = new Resend("re_BH3cMNMY_GtwZzr51PPusDiDQRjzMPVHf");
  
  try {
    const data = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: ["hritika3410@gmail.com"], // keeping default mail because resend doesn't allows sending mails to multiple users in testing phase
      subject: 'Welcome to Dribbble',
      html: '<strong>It works!</strong>'
    });
    console.log(data);
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  getUsers,
  createUser,
  sendemail,
  checkUsername 
};




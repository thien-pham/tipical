require('dotenv').config();

exports.DATABASE = process.env.DATABASE_URL ||
                   global.DATABASE_URL;

exports.PORT = process.env.PORT || 8080;


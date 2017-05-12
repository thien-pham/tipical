require('dotenv').config();

exports.DATABASE = process.env.DATABASE_URL ||
                   global.DATABASE_URL || 'mongodb://localhost/tipical';
exports.PORT = process.env.PORT || 8080;
exports.TESTDATABASE = process.env.TEST_DATABASE_URL;

const Pool = require("pg").Pool;

const pool = new Pool(
    {
        "user": "ilaulanov",
        "password": "2401",
        "host": "localhost",
        "port": 5432,
        "database": "syproject"
    }
);

module.exports = pool;
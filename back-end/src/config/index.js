const mysql2 = require('mysql2')
const connection = mysql2.createConnection({
    host : "127.0.0.1",
    port : "3306",
    user : "root",
    password : "",
    database : "instagaram"
})
module.exports = connection
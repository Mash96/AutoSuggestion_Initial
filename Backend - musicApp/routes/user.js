const express = require('express');
const router = express.Router();
//const main = require('../app');


//create user Table
router.get('/createUser',(req,res)=>{
    let sql = 'CREATE TABLE users(id int AUTO_INCREMENT, name VARCHAR(255), email VARCHAR(255), dateOfBirth VARCHAR(255), password VARCHAR(255), PRIMARY KEY(id))';
    db.query(sql,(err,result)=>{
        if(err) throw err;
        console.log(result);
        res.send('User table created');
    });

});

module.exports = router;

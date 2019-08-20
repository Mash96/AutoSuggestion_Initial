const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
var path = require('path');
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;

// create connection to the database
const db = module.exports = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'sinhala_songs_db'
});

//connecting
db.connect((err) =>{
    if(err){
        throw err;
    }
    console.log('MySql connected...');
});

const app = module.exports = express();
app.use(bodyParser.urlencoded({extended: true})); //Accept  URL Encoded params
app.use(bodyParser.json()); //accept JSON Params


app.set('views',__dirname + '/views');
app.use(express.static(__dirname + '/JS'));
app.set('view engine', 'ejs');
//app.engine('html', require('ejs').renderFile);


//create user Table
app.get('/createUser',(req,res)=>{
    let sql = 'CREATE TABLE users(id int AUTO_INCREMENT, name VARCHAR(255), email VARCHAR(255), dateOfBirth VARCHAR(255), password VARCHAR(255), PRIMARY KEY(id))';
    db.query(sql,(err,result)=>{
        if(err) throw err;
        console.log(result);
        res.send('User table created');
    });

});

// return homepage
app.get('/',function(req,res){
    res.render('index');
});

// search function    
app.get('/search',function(req,res){
  //db.query('SELECT album.albumTitle, song.songTitle FROM album, song WHERE album.albumTitle OR song.songTitle LIKE "%'+req.query.key+'%"'
    db.query('SELECT artist.artistName,song.songTitle, album.albumTitle FROM artist JOIN artist_has_song ahs ON artist.idArtist = ahs.Artist_idArtist JOIN song ON ahs.song_idSong = song.idSong JOIN artist_has_album aha ON artist.idArtist = aha.Artist_idArtist JOIN album ON aha.Album_idAlbum = album.idAlbum WHERE artist.artistName LIKE "%'+req.query.key+'%"', function(err, rows, fields) {
        if (err) throw err;
        //console.log(rows);
        var data=[];
        for(i=0;i<rows.length;i++)
            {
            data.push(rows[i].artistName+ " " +rows[i].songTitle);
            data.push (rows[i].artistName+ " "+rows[i].albumTitle);
            //console.log(data)
            //res.send(data)
            //data.push(rows[i].songTitle);
            }
            res.end(JSON.stringify(data));
        });
  });

//user registration
app.post('/register',(req,res,next)=>{
    
    const post_data = req.body;
    const name = post_data.name;
    const email = post_data.email;
    const dateOfBirth = post_data.date;
    const password = post_data.password;

    // bcrypt.genSalt(saltRounds, (err, salt)=> {
    //     bcrypt.hash(password,salt, (err,hash)=>{
    //         if(err){
    //             console.log(err);
    //         }
    //         else{
    //             password = hash;
    //         }
    //     });
    // });
    
    let userEmail = {'email':email};
   
    let sql =  'SELECT * FROM users WHERE ?';
    let query = db.query(sql,userEmail, (err,result,fields)=>{
        if(err) throw err
            //console.log('[MySQL ERROR',err);
        if(result && result.length) {
            res.json('User already exists');
        }
        else{
            let insertUser = {'name':name, 'email':email, 'dateOfBirth':dateOfBirth, 'password':password};
            let sql = 'INSERT INTO users SET ?';
            let query = db.query(sql,insertUser,function(err,result,fields){
                if(err) throw err;
                res.json('Registration successful');
            });
        }
    });   

});

//user login
app.post('/login',(req,res,next)=>{
    const post_data = req.body;
    const email = post_data.email;
    const password = post_data.password;

    let userEmail = {'email':email};
    //let userPassword = {'password':password};
    let sql = 'SELECT * FROM users WHERE ?';
    let query = db.query(sql,userEmail,(err,result,fields)=>{
        if(err) throw err;
        if(result && result.length){
            const correctPassword = result[0].password;
            if(password == correctPassword){
                res.json('User successfully logged in');
                res.end(JSON.stringify(result[0]));
            }
            else {
                res.json('Wrong password');
            }
        }
        else {
            res.json('user does not exist');
        }
    });
});

//creating user survey
app.post('/survey', (req,res,next)=>{
    const post_data = req.body;
    
});

//creating the server
app.listen('3000', () => {
    console.log("Server started on port 3000");
});

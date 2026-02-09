var express=require('express');
var app=express();
var  mysql=require('mysql');

require('dotenv').config(); // load env vars

var connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306
});

connection.connect();

app.set('views',__dirname + '/views');
app.use(express.static(__dirname + '/JS'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.get('/',function(req,res){
res.render('index.html');
});

app.get('/search', function (req, res) {
  const key = `%${req.query.key}%`;
  connection.query(
    'SELECT first_name FROM user_name WHERE first_name LIKE ?',
    [key],
    function (err, rows) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
    const data = rows.map(r => r.first_name);
    res.json(data);
    }  
  );
});

var server=app.listen(3000,function(){
console.log("We have started our server on port 3000");
});

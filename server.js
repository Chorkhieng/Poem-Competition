const exp = require('constants');
const express = require('express');
const app = express();
const port = 8000;

app.set("views", "pugs");
app.set("view engine", "pug");

app.use('/static', express.static('src'))

// for testing without database
let users = [
      {
        "user_id": 1,
        "username": "SophalSok",
        "password": "hashed_password",
        "first_name": "Sophal",
        "last_name": "Sok",
        "bio": "I'm a Civil Engineer."
      },
      {
        "user_id": 2,
        "username": "ChorkHieng",
        "password": "hashed_password",
        "first_name": "Chork",
        "last_name": "Hieng",
        "bio": "I'm a computer science student."
      }
    ]


let submissions =  [
        {
        "author_id": 1,
        "poem_id": 1,
        "poem_content": "I don't know how\n to write a poem\n please help\n",
        "vote_count": 0
        },
        {
        "author_id": 2,
        "poem_id": 2,
        "poem_content": "Beautiful sunset\n and I bet\n you love it\n",
        "vote_count": 0
        }
    ]
      


app.use((req, res, next)=>{
    next();
    console.log(`${req.method} localhost:${req.url} ${res.statusCode} ${res.statusMessage}`)
})

app.get('/', (req, res)=>{
    res.render('homepage.pug', {submissions, users});
})


app.get('/static/css/main.css', (req, res)=>{
    res.send('main.css');
})

// 404 not found page
app.use((req, res) => {
    res.status(404).render("page_error.pug");
})

app.listen(port , () => {
    console.log(`Listening on port ${port}`);
})
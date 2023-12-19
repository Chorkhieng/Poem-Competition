const exp = require('constants');
const express = require('express');
const app = express();
const port = 8000;

app.set("views", "pugs");
app.set("view engine", "pug");

app.use('/static', express.static('src'))


app.use((req, res, next)=>{
    next();
    console.log(`${req.method} ${req.url} ${res.statusCode} ${res.statusMessage}`)
})

app.get('/', (req, res)=>{
    res.render('homepage.pug');
})


// 404 not found page
app.use((req, res) => {
    res.status(404).render("404.pug");
})

app.listen(port , () => {
    console.log(`Listening on port ${port}`);
})
const express = require('express');
const session = require('express-session');
const app = express();
const port = 8000;

app.set("views", "pugs");
app.set("view engine", "pug");

app.use(express.static('src'));
app.use(session({secret:'sfsdfsdfkoisjldfa;;oijeofiaoijaopweijfodijasojeofwieje'}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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

let poemId = 1;
let userId = 2;

// middleware for login session
const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.isLogin) {
        return next();
    } else {
        res.redirect("/login");
    }
};

// middleware function
app.use((req, res, next)=> {
    if (req.session.isLogin === false && req.path === '/') {
        return res.redirect('/login');
    }
    next();
    console.log(req.method, `localhost:${port}${req.path}`, res.statusCode);
})


app.use((req, res, next)=>{
    next();
    console.log(`${req.method} localhost${req.url} ${res.statusCode} ${res.statusMessage}`)
})

app.get('/', isAuthenticated, (req, res)=>{
    let page = parseInt(req.query.page ?? 1);

    if (!page) {
        page = 1;
    }

    let offset = (page - 1) * 4;
    let newPosts = submissions.slice(offset, offset + 4);
    res.render('homepage.pug', {users, submissions:newPosts, page, isLogin:req.session.isLogin});
})

// view as guest
app.get('/guest', (req, res)=>{
    let page = parseInt(req.query.page ?? 1);

    if (!page) {
        page = 1;
    }

    let offset = (page - 1) * 4;
    let newPosts = submissions.slice(offset, offset + 4);
    res.render('guest_homepage.pug', {users, submissions:newPosts, page, isLogin:req.session.isLogin});
})


// login route
app.get("/login", (req, res)=>{
    res.render("login.pug", {isLogin:req.session.isLogin});
})

// check password from database
app.post("/login", (req, res) => {
    for (const user of users) {
        // Compare hashed passwords
        // const passwordMatch = await bcrypt.compare(req.body.password, user.password);

        if (req.body.username === user.username && req.body.password === user.password /* && passwordMatch */) {
            req.session.currentUserId = user.user_id;
            req.session.currentUser = user.account_name;
            req.session.isLogin = true;
            // use return to break out of loop
            return res.redirect("/");
        }
    }

    // If no matching user is found
    res.status(401).send("Invalid username or password");
});

// get create account page
app.get("/create", (req, res)=>{
    res.render("create_account.pug");
})

// create new user account
app.post("/create", (req, res) => {
    const userData = req.body;

    // Input validation
    if (!userData.create_username || !userData.create_password || !userData.first_name || !userData.last_name) {
        res.render("create_unsuccess.pug");
    }

    const payload = {
                        "user_id": userId + 1,
                        "username": userData.create_username,
                        "password": userData.create_password,
                        "first_name": userData.first_name,
                        "last_name": userData.last_name,
                        "bio": userData.bio
                    }   
    users.push(payload);
    res.render("create_success.pug");
});

// lock out of app
app.get("/logout", isAuthenticated, (req, res) => {
    
    // Destroy the session with error handling
    req.session.destroy((err) => {
        if (err) {
            console.error("Error destroying session:", err);
        }
        else {
            res.redirect("/login");
        }
    });
});

// create submission
app.get('/submission', isAuthenticated, (req, res)=>{
    res.render('submission.pug', {isLogin:req.session.isLogin});
})

app.post('/submit', isAuthenticated, (req, res)=>{
    const data = {
        "author_id": req.session.currentUserId,
        "poem_id": poemId + 1,
        "poem_content": req.body.poemText,
        "vote_count": 0
        }
    submissions.push(data);
    res.redirect('/');
})

// rules 
app.get('/rules', (req, res)=>{
    res.render('rules.pug', {isLogin:req.session.isLogin});
})

app.get('/css/main.css', (req, res)=>{
    res.send('main.css');
})

app.get('/css/main.dark.css', (req, res)=>{
    res.send('main.dark.css');
})

// 404 not found page
app.use((req, res) => {
    res.status(404).render("page_error.pug");
})

app.listen(port , () => {
    console.log(`Listening on port ${port}`);
})
-- create users 
create table users = (
    user_id int not null auto_increment,
    username varchar(200) not null,
    password varchar(200) not null,
    first_name varchar(100) not null,
    last_name varchar(100) not null,
    bio text default null, -- user's bio
    primary key(user_id)
);

-- information for each poem submission
create table submissions (
    author_id int not null,
    poem_id int not null auto_increment,
    poem_content text not null,
    vote_count int default 0,
    primary key(poem_id)
);

-- vote information
create table votes (
    author_id int not null,
    poem_id int not null,
    voter_id int not null
);


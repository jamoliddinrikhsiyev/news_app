/*
            schema
    Users
        id
        name
        email
        password
        img
        role
        date
    Categories
        id
        name
        date
    News
        id
        title
        description
        counter,
        category_id
        image
        rating
        date
    Rating
        id
        news_id
        rating
        date
    Comments
        id
        message
        news_id
        user_id
        date
    Reply
        id
        message
        comment_id
        user_id
        date
*/





CREATE DATABASE news;


CREATE TABLE users(
    id serial NOT NULL PRIMARY KEY,
    name varchar(256) UNIQUE NOT NULL,
    password varchar(256) NOT NULL,
    email varchar(256) UNIQUE NOT NULL,
    img varchar(256) NOT NULL DEFAULT 'f',
    role smallint NOT NULL DEFAULT 0,
    date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted INT NOT NULL DEFAULT 0,
    deleted_time varchar NOT NULL DEFAULT '0000-00-00 00:00:00'
);

CREATE TABLE categories(
    id serial NOT NULL PRIMARY KEY,
    name varchar(256) NOT NULL,
    date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE news(
    id serial NOT NULL PRIMARY KEY,
    title varchar(500) NOT NULL,
    description varchar(500) NOT NULL,
    text json NOT NULL,
    counter INT NOT NULL DEFAULT 0,
    category_id INT NOT NULL,
    rating INT not null DEFAULT 0,
    date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted INT NOT NULL DEFAULT 0,
    deleted_time varchar NOT NULL DEFAULT '0000-00-00 00:00:00'
);

CREATE TABLE rating(
    id serial NOT NULL PRIMARY KEY,
    news_id INT NOT NULL,
    rating INT NOT NULL,
    date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE comments(
    id serial NOT NULL PRIMARY KEY,
    message varchar NOT NULL,
    news_id INT NOT NULL,
    user_id INT NOT NULL,
    date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted INT NOT NULL DEFAULT 0,
    deleted_time varchar NOT NULL DEFAULT '0000-00-00 00:00:00'
);

CREATE TABLE reply(
    id serial NOT NULL PRIMARY KEY,
    message varchar NOT NULL,
    comment_id INT NOT NULL,
    user_id INT NOT NULL,
    date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted INT NOT NULL DEFAULT 0,
    deleted_time varchar NOT NULL DEFAULT '0000-00-00 00:00:00'
);

--insert mock data

INSERT INTO users (
    name,
    email,
    password,
    img,
    role
)VALUES('ROOT', 'exmple@mail.ru', 'ROOT', 'IMG',1);

INSERT INTO users(
    name,
    email,
    password,
    img
) VALUES 
('Jamoliddin', 'example@gmail.com', '1111', 'aaa'),
('Abdulloh', 'example@gmail.com', '2121', 'aaa'),
('Ismoil', 'example@gmail.com', '5555', 'aaa');

INSERT INTO categories(
    name
)VALUES
('Uzbekistan'),
('World'),
('Sport'),
('Public');

INSERT INTO news(
    title,
    description,
    text,
    category_id
)VALUES(
    'afadsf',
    'BbbBb',
    '{"array": [{"text": "Assafdsfda"},{"image": "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png"}]}',
    1
);

INSERT INTO comments(
    message,
    news_id,
    user_id
)VALUES(
    'Birinchi comment',
    4,
    2
),
(
    'Vaziyatga oydinlik kiriting',
    3,
    2
),
(
    'Malumot',
    2,
    3
),
(
    'B',
    1,
    4
);

INSERT INTO comments(
    message,
    news_id,
    user_id
)VALUES(
    'Salom',
    1,
    4
);

INSERT INTO reply(
    message,
    comment_id,
    user_id
)Values(
    'AAA',
    1,
    2
),
(
    'BBB',
    2,
    3
),
(
    'CCC',
    3,
    4
),
(
    'DDD',
    4,
    4
);

UPDATE news
SET deleted = 1, deleted_time = now()
WHERE id = 5
RETURNING deleted, deleted_time;

INSERT INTO comments(
    message,
    news_id,
    user_id,
    date
)VALUES(
    'Assalomu alaykum',
    4,
    4,
    now()
)RETURNING id AS comment_id, message AS comment_message, news_id AS comment_news_id, user_id AS comment_user_id, date AS comment_date;


SELECT
    comments.id AS comment_id,
    comments.message AS comment_message,
    comments.news_id AS comment_news_id,
    users.name AS comment_username,
    comments.date AS comment_date
FROM comments 
INNER JOIN users ON comments.user_id = users.id
WHERE comments.id = 12

SELECT 
    id,
    message,
    user_id,
    news_id,
    date
FROM comments
WHERE comments.id = 10;

--INSERT INTO 

--drop all tables

DROP TABLE users;
DROP TABLE categories;
DROP TABLE rating;
DROP TABLE comments;
DROP TABLE reply;
DROP TABLE news;

-- ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



/*
user              ----              group
                                    channel
                                    bot
    usersTogroups
    user_id
    group_id
    group_add_date
    group_ban t/f
*/

# Yangilik sayt uchun Blok sxema 


## User model
```
name
email
password
image
role: ['admin', 'user' ]: default: user
date
```

## Category model
```
name
date
```


## News model
```
title
description
counter: 0
category_ID (Category model id)
image
rating: 0
date
```


## Rating model
```
new_ID (News model id)
rating: [1,2,3,4,5]
date
```


## Comment model
```
message
new_ID (News model id)
user_ID (User model id) 
date
```


## Reply model
```
message
comment_ID (News model id)
user_ID (User model id)
date
```












const { gql } = require("apollo-server-express");

const typeDefs = gql`
  enum user_role {
    User
    Admin
  }

  type Query {
    users(token: String, page: Int): [Users]
    Categories: [Category]
    All_news(category: String, page: Int): [AllNews]
    All_Comments(news_id: Int!, page: Int): [AllComments]
    All_Replies(comments_id: Int!, page: Int): [AllReplies]
  }

  type Users {
    info: [Info]
    results: [User]
  }

  type User {
    User_id: Int!
    User_name: String!
    User_img: String!
    User_role: user_role!
    User_date: String!
  }

  type Category {
    Category_id: Int!
    Category_name: String!
    Category_date: String!
  }

  type AllNews {
    info: [Info]
    results: [News]
  }

  type AllComments {
    info: [Info]
    results: [Comments]
  }

  type AllReplies {
    info: [Info]
    results: [Replies]
  }

  type Info {
    count: Int
    pages: Int
    next: Int
    prev: Int
  }

  type News {
    News_id: Int!
    News_title: String!
    News_description: String!
    News_text: String!
    News_counter: Int!
    News_category: String!
    News_image: String!
    News_rating: Int!
    News_date: String!
  }

  type Comments {
    Comment_id: Int!
    Comment_message: String!
    Comment_user: String!
    Comment_news_id: Int!
    Comment_date: String!
  }

  type Replies {
    Reply_id: Int!
    Reply_message: String!
    Reply_user: String!
    Reply_comment_id: Int!
    Reply_date: String!
  }

  type Mutation {
    Admins(username: String!, password: String!): [Admin]
    SignIn(username: String!, password: String!): [NewUser]
    SignUp(username: String!, password: String!, email: String!): [NewUser]
    CreateComment(token: String!, news_id: Int!, message: String!): [NewComment]
    CreateReply(token: String!, comment_id: Int!, message: String!): [NewReply]
    AddRating(newsId: Int!, rating: Int!): [NewRating]
    AddCategory(token: String!, category: String!): [Category]
  }

  type Admin {
    Status: Int!
    Token: String!
  }

  type NewUser {
    Status: Int!
    Token: String!
    Name: String!
  }

  type NewComment {
    Comment_status: Int!
    Comment: [Comments]
  }

  type NewReply {
    Reply_status: Int!
    Reply: [Replies]
  }

  type info {
    count: Int
    pages: Int
    next: Int
    prev: Int
  }

  type NewRating {
    status: Int!
    rating: Int!
    news_id: Int!
  }
`;

module.exports = typeDefs;

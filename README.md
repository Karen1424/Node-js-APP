# Node-js-APP
Simple API app with NodeJs Express MySQL and Redis

POST http://localhost/api/v1/auth/signup
Request {
  email: required,
  password: required,
  first_name: required,
  last_name: required,
  country: required,
  phone: required,
}
Response {
  user: {
    id,
    email,
    ...
  },
  msg: message
}

Sign in
POST http://localhost/api/v1/auth/signin
Request {
  email: required,
  password: required
}
Response {
  token: JWT,
  msg: message
}

GET http://localhost/api/v1/users/:id
Response {
  id,
  email,
  ...
}

Update User Information

PUT http://localhost/api/v1/users/:id
Request {
  email: required,
  password: required,
  first_name: required,
  last_name: required,
  country: required,
  phone: required,
}
Response {
  msg: message
}

Delete account
POST http://localhost/api/v1/auth/fields
Request {
  title: required
}
Response {
  field: {
    id,
    title,
    ...
  },
  msg: message
}

GET Information about Author and book
GET http://localhost/api/v1/userToBook
Response {
  field: {
    first_name,
    book_name
  }
}

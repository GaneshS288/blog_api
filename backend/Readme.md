# Introduction

This directory contains the backend api application for the blog project. Please see below for details of api and instructions for setting up the project locally.

## Setup Instructions

### software needed

- Node version 22 or higher
- postgres version 16 or higher

### how to run the api

- run `npm install` to install all dependencies
- create and populate the `.env` file. Look at `example.env` for explantions
- run `npx prisma migrate` and `npx prisma generate` to sync your postgres db and generate prisma client for communicating with db
- run `npm run prod` to start the api. You should be good to go

## Api docs

Note: some of the endpoints are protected. They require you to send the jwt token to the server in authorization header with Bearer schema (eg. ``<"Authorization": "Bearer tokenValue">``).
All protected routes will have an note with * at the end to explain this

### POST /signup

expects `application/json` format for the body with these properties.

```js
{
    name: string, //minimum 4 characters
    password: string, // minimum 8 characters
    passwordConfirm: string // must match password
}
```

on success responds with `application/json` body containing these properties.

```js
{
    status: 201,
    data: { message: "user successfully signed up"}
}
```

On failure returns a 500 or 400 error. Please see [Errors](#Errors)

### POST /login

expects `application/json` format for the body with these properties

```js
    {
        name: string, //minimum 4 characters
        password: string, // minimum 8 characters
    }
```

on success responds with `application/json` body containing these properties.

```js
{
    status: 200,
    data: { message: "succesfully logged in"}
    token: jwtToken
}
```

the token is used when sending requests to protected routes, refer to the not at the start of api docs.

on failure returns a 500 or 400 error. Please see [Errors](#Errors)

### GET /blog/:id

Endpoint for fetching a single blog. The id parameter refers to the blog id.

Returns a `application/json` response on success with 200 code and this format.

```js
    title: string,
    author: {
        name: string,
        remote_id: string,
    }
    remote_id: string,
    content: string,
    likes: number,
    published: boolean,
    created_at: Date,
    updated_at: Date | null,
```

here `remote_id` is uuid used to query the blog.

On failure returns a 404, 400 or 500 error. Please see [Errors](#Errors)

### GET /blogs

Can accept query parameters given in the below format.

```js
    order: "desc" | "asc", // filter blogs by date in ascending or descending order
    page: number, // page no for pagination
    size: number, // size of results in a single page
    author_id?: string | undefined, //author id to filter blogs by, optional
    name?: string | undefined, //filter blogs by author name
    title?: string | undefined, // filter blogs by title
```

On success returns 200 status with following `application/json` response format.

```js
    data: {
        blogs: {
            title: string,
        author: {
            name: string,
            remote_id: string,
        }
        remote_id: string,
        content: string,
        likes: number,
        published: boolean,
        created_at: Date,
        updated_at: Date | null,
        }[]
    }
```

``blogs`` property is an array.

On failure returns 400 or 500 error. Please see [Errors](#Errors) 

### POST /blog 
``* this is a protected route. The jwt token must be sent with response in Authorization header``

Expects ``application/json`` format for the body with these properties. Creates a new blog.

```js
    title: string; //the title of the blog, can't be longer than 100 characters
    content: string, //blog content
    published: boolean, //publish the blog or not, default is false
```

On success returns 201 status with the following ``application/json`` response format.

```js
    title: string,
    remote_id: string,
    content: string,
    likes: number,
    published: boolean,
    created_at: Date,
    updated_at: Date | null,
```

On failure returns 400, 401 or 500 error.Please see [Errors](#Errors)

### PUT /blog/:id

``* this is a protected route. The jwt token must be sent with response in Authorization header``

Expects ``application/json`` format for the body with these properties. Edits an existing blog. The ``:id`` route parameter refers to blog id.

```js
    title: string; //the title of the blog, can't be longer than 100 characters
    content: string, //blog content
    published: boolean, //publish the blog or not, default is false
```

On success returns 200 status with the updated blog in this ``application/json`` format. Only the author of blog or admins can edit the blog.

```js
    author_id: number;
    title: string;
    remote_id: string;
    content: string;
    likes: number;
    created_at: Date;
    updated_at: Date | null;
```

On failur returns 400, 401, 403, 404 or 500 error in response. Please see [Errors](#Errors)

### DELETE /blog/:id

Deletes an existing blog. The ``:id`` route parameter refers to blog id.

On success returns 204 status with no content. Only the author of blog or admins can delete blog.

On failure returns 401, 403, 404 or 500 error in response. Please see [Errors](#Errors)

### POST /blog/:id/like

``* this is a protected route. The jwt token must be sent with response in Authorization header``

Adds a like to the blog. The ``:id`` route parameter here refers to the blog id.

On success returns 204 with no body. If the blog was already liked by the user then sends 400.

On failure sends 400, 401, 404 or 500 error in response. Please see [Errors](#Errors)

### DELETE /blog/:id/like 
``* this is a protected route. The jwt token must be sent with response in Authorization header``

Delete a like from the blog. The ``:id`` route parameter here refers to the blog id.

On success returns 204 with no body. If the blog was not liked by the user then sends 400.

On failure sends 400, 401, 403, 404 or 500 error in response. Please see [Errors](#Errors)

### Errors

#### 400 malformed input error -

returns response with 400 status and this body in `application/json` content type. Sent when request data was malformed/missing. 

```js
{
    status: 400,
    data: {}
    errors: []
    validationErrors: { name: "name must be at least 4 characters long"} //contains an object with validation errors mapped to corrsponding fields
}
```

#### 404 not found

returns response with 404 status and this body in `application/json` content type. Sent when the request resource or the resource on which an action should be performed is missing

```js
{
    status: 404,
    data: {}
    errors: ["Resource not found"] //array with error messages
}
```

#### 500 server error

returns response with 500 status and this body in `application/json` content type. Sent when something goes wrong on server side

```js
{
    status: 500,
    data: {}
    errors: ["something unexpected happend on the server"] //array with error messages
}
```

#### 403 Authorization Error

returns response with 500 status and this body in `application/json` content type. Send when a user performs an action (delete, update) that they are not allowed to

```js
{
    status: 403;
    data = {}, 
    errors = ["you're not authorized to perform this action"]; // error message array
}
```

#### 401 Unauthenticated Error

returns response with 401 status and this body in `application/json` content type. Sent when the jwt token is invalid/expired

```js
{
    status: 401,
    data: {}
    errors: ["invalid token or user"]
}
```

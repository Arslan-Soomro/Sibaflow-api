# Siba Flow API

## Routes

### User

User route is used for accessing and updating user data.

 

##### User/

**VERB : GET**

Server responds with data of all the users that exist in the database

 

##### user/signup

**VERB : POST**

Registers a user in the database. server repsonds back with the data of newly created user.

Server requires below body fields

- name - string

- email - string

- cms - string

- username - string

- password - string



##### user/signin

**VERB : POST**

Provided correct username and password, this routes signs user in and responds back with a token, that identifies the corresponding user to the server and can later be used for performing different transactions.

Server requires below body fields

- username - string

- password - string



##### user/signin

**VERB : GET**

Provided correct token, Server responds with data of user that corresponds to provided token.

Server requires below header fields

- token - string



##### user/update

**VERB : PATCH**

Server updates provided fields and responds with updated data of the user.

Server requires below header fields

- token - string

Server requires any of the below body fields, that need to be updated

- name - string

- username - string

- email - string

- password - string

- cms - string



### Post

Post route is used for accessing and updating Post data.



##### post/

**VERB : GET**

Server responds with all the posts that exist in the database.

If **id** query parameter is used, then server responds with the post with that specific id.

if **u_id** query parameter is used, then server responds with the posts of tha user with that id.



##### post/

**VERB : POST**

Server creates a new post in the database, with respect to the user.

Server requires below header fields:

- token - string - represents user who created the post

Server requires below body fields

- title - string

- content - string



##### post/

**VERB : PATCH**

Server updates a post and responds with updated post

Server requires below header fields:

- token - string - represents user who created the post

Server requires below body field in order to find that post

- id - string - the id of post to be updated

Server requires any of below body fields to update

- title - string

- content - string



##### post/

**VERB : DELETE**

Server deletes a post, and responds with deleted post

Server requires below header fields:

- token - string - represents user who created the post

Server requires below body field in order to find that post

- id - string



### Comment

Comment route is used to access and update data of comment data.



##### /comment

**VERB : GET**

Server responds with all the comments in the database.

If **id** query parameter is used, then server responds with the comment with that specific id.

if **u_id** query parameter is used, then server responds with the comments of the post with that id.



##### /comment

**VERB :  POST**

Creates a comment in the database related to a post.

Server requires below header fields

- token - string - represents the user who created the comment

Server requires below body fields

- p_id - string - to identify the post that the comment is created on

- content - string



##### /comment

**VERB : PATCH**

Updates a comment in the database.

Server requires below header fields

- token - string - represents the user who created the comment

Server requires below body fields

- id - id of comment to be updated

- content



##### /comment

**VERB : DELETE**

Deletes a comment in the database.

Server requires below header fields

- token - string - represents user who created the comment

Server requires below body fields

- id - string - id of the comment to be deleted























































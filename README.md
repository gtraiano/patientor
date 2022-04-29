# Patientor

My solution for Full Stack Open 2021 course's [patientor](https://fullstackopen.com/en/part9/react_with_types/).


## Setup
### *SSL certificate*
You need to generate an SSL certificate in order to run the backend server.

A self-signed certificate will suffice for development purposes.

### *Environment variables*
#### **Backend**
|Variable |Function |Default Value|
|---------|---------|--------|
|PORT|backend server listening port|`3001`|
|HOST|backend server host|`localhost`|
|MONGODB_URI|MongoDB URI|
|ACCESS_TOKEN_KEY|access token signing key|
|REFRESH_TOKEN_KEY|refresh token signing key|
|SSL_CRT_FILE|SSL certificate file path|
|SSL_KEY_FILE|SSL private key file path|

#### **Frontend**

|Variable |Function|
|--------------|-----------|
|REACT_APP_BACKEND_API_URL|backend server API URL|
|HTTPS|run development server in [HTTPS](https://create-react-app.dev/docs/using-https-in-development/#custom-ssl-certificate)|


## TODO

### Backend
- **Authentication**
  - Fix issue when access token is deleted from client's _localStorage_ while user has not logged out [*Fixed!*]
  - Run automated process to clean expired refresh tokens
- **Users**
  - Introduce a permissions control so as to impose restrictions to GET, PUT and DELETE operations [*partially implemented*]
  - Introduce a permissions control middleware to control read and write access to patients, diagnoses etc.

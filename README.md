# Patientor

My solution for Full Stack Open 2021 course's patientor (https://fullstackopen.com/en/part9/react_with_types/)

### TODO

## Backend
- **Authentication**
  - Fix issue when access token is deleted from client's _localStorage_ while user has not logged out [currently user cannot log in until refresh token expires]
  - Run automated process to clean expired refresh tokens
- **Users**
  - Introduce a permissions control so as to impose restrictions to GET, PUT and DELETE operations [currently can be performed by any user id]
- Introduce a permissions control middleware to control read and write access to patients, diagnoses etc.
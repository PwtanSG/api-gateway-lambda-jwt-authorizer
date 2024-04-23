# About this project
This node js code is a AWS lambda authorizer to verify the validity of jwt token recieved in AWS API Gateway
The code will generate the allow access policy for valid token. The API gateway end point will deny or access based on this policy generated.

### Code to be deploy to AWS lambda
- `npm i` to install dependencies. Zip all files and node_modules folder as a zip
- Deploy the zip file to a AWS lambda function.
- Set JWT secret in lambda env var in configuration tab. (This must be the same as your jwt generator's JWT_SECRET)

### For the API Gateway to be protected
- Enable CORS in AWS API gateway recource, add 'authorizationToken' to Access-Control-Allow-Headers
- Create Authorizer in API Gateway, select the above lamda function
- Lambda event payload - Select token and set token source to 'authorizationToken'
- Goto the API resource's method to be protected. Edit Method request settings set 'Authorization' to the created authorizer. 

### token send by client's header 'authorizationToken'
// use nodejs 18x in AWS Lambda
import jwt from "jsonwebtoken";

export const handler = function (event, context, callback) {
    var token = event.authorizationToken;
    var permission = 'Deny';

    if (token) {
        const result = verifyToken(token);
        if (result.verified) {
            permission = 'Allow'
        }
    }
    callback(null, generatePolicy('user', permission, event.methodArn));

    // switch (token) {
    //     case 'allow':
    //         callback(null, generatePolicy('user', 'Allow', event.methodArn));
    //         break;
    //     case 'deny':
    //         callback(null, generatePolicy('user', 'Deny', event.methodArn));
    //         break;
    //     case 'unauthorized':
    //         callback("Unauthorized");   // Return a 401 Unauthorized response
    //         break;
    //     default:
    //         callback("Error: Invalid token"); // Return a 500 Invalid token response
    // }
};

// Help function to generate an IAM policy
var generatePolicy = function (principalId, effect, resource) {
    var authResponse = {};

    authResponse.principalId = principalId;
    if (effect && resource) {
        var policyDocument = {};
        policyDocument.Version = '2012-10-17';
        policyDocument.Statement = [];
        var statementOne = {};
        statementOne.Action = 'execute-api:Invoke';
        statementOne.Effect = effect;
        statementOne.Resource = resource;
        policyDocument.Statement[0] = statementOne;
        authResponse.policyDocument = policyDocument;
    }

    // Optional output with custom properties of the String, Number or Boolean type.
    authResponse.context = {
        "stringKey": "stringval",
        "numberKey": 123,
        "booleanKey": true
    };
    return authResponse;
}

var verifyToken = function(token) {
    return jwt.verify(token, process.env.JWT_SECRET, (error, response) => {
        if (error) {
            return {
                verified: false,
                message: 'invalid token'
            }
        }

        return {
            verified: true,
            message: 'verifed'
        }
    })
}

//e.g of generated policyDocument
// {
//     "Version": "2012-10-17",
//         "Statement": [
//             {
//                 "Action": "execute-api:Invoke",
//                 "Effect": "Allow",
//                 "Resource": "arn:aws:execute-api:us-east-1:123456789012:ivdtdhp7b5/ESTestInvoke-stage/GET/"
//             }
//         ]
// }
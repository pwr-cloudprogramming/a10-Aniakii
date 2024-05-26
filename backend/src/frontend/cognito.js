const userPoolId = window._env_.COGNITO_USER_POOL_ID;
const clientId = window._env_.COGNITO_CLIENT_ID;

localStorage.setItem("aws-congnito-user-pool-id", userPoolId);
localStorage.setItem("aws-congnito-app-id", clientId);

function getPoolData() {
    return {
        UserPoolId: localStorage.getItem("aws-congnito-user-pool-id"),
        ClientId: localStorage.getItem("aws-congnito-app-id")
    };
}

var userPool;
var cognitoUser;

function getUserPool() {
    if (!userPool) {
        userPool = new AmazonCognitoIdentity.CognitoUserPool(getPoolData());
    }
    return userPool;
}

function getUser(userName) {
    var userData = {
        Username: userName,
        Pool: getUserPool()
    };
    return new AmazonCognitoIdentity.CognitoUser(userData);
}

function signUpUser(userName, userEmail, userPassword, callback) {
    let dataEmail = {
        Name: 'email',
        Value: userEmail
    };
    let dataName = {
        Name: 'preferred_username',
        Value: userName
    };
    let attributeList = [
        new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail),
        new AmazonCognitoIdentity.CognitoUserAttribute(dataName)
    ];

    getUserPool().signUp(userName, userPassword, attributeList, null, function (err, result) {
        if (err) {
            callback(err, null);
        } else {
            cognitoUser = result.user;
            callback(null, result);
        }
    });
}

function confirmUser(userName, code, callback) {
    getUser(userName).confirmRegistration(code, true, callback);
}

function wrapCallback(callback) {
    return {
        onFailure: (err) => { callback(err, null); },
        onSuccess: (result) => { callback(null, result); }
    };
}

function signInUser(userName, password, callback) {
    let authenticationData = {
        Username: userName,
        Password: password,
    };
    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
    getUser(userName).authenticateUser(authenticationDetails, wrapCallback(callback));
}

function signOutUser(callback) {
    if (cognitoUser) {
        if (cognitoUser.signInUserSession) {
            cognitoUser.signOut();
            localStorage.removeItem('loggedInUser');
            callback(null, {});
            return;
        }
    }
    callback({ name: "Error", message: "User is not signed in" }, null);
}


function userAttributes(updateCallback) {
    if (cognitoUser) {
        cognitoUser.getUserAttributes((err, result) => {
            if (err) {
                updateCallback({});
                return;
            } else {
                let userInfo = { name: cognitoUser.username };
                for (let k = 0; k < result.length; k++) {
                    userInfo[result[k].getName()] = result[k].getValue();
                }
                updateCallback(userInfo);
            }
        });
    } else {
        updateCallback({});
    }
}

function updateAttributes(attributes, callback) {
    var attributeList = [];
    for (let key in attributes) {
        attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({
            Name: key,
            Value: attributes[key]
        }));
    }
    cognitoUser.updateAttributes(attributeList, callback);
}

var user = {
    name: "",
    email: "",
    email_verified: "false",
    status: "",
    update: function (userInfo) {
        for (let key in userInfo) {
            if (this[key] !== undefined) {
                this[key] = userInfo[key];
            }
        }
    }
};

export { signUpUser, signInUser, signOutUser, confirmUser, deleteUser, changeUserPassword, sendPasswordResetCode, confirmPasswordReset, userAttributes, updateAttributes };
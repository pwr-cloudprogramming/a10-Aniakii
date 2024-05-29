console.log("COGNITO_USER_POOL_ID:", "<COGNITO_USER_POOL_ID>");
console.log("COGNITO_CLIENT_ID:", "<COGNITO_CLIENT_ID>");



if ("<COGNITO_CLIENT_ID>" === "") {

    localStorage.setItem("aws-congnito-app-id", "7hhe2m7apajf08aaghol2d9jm3");
} else {
    localStorage.setItem("aws-congnito-app-id", "<COGNITO_CLIENT_ID>");
}

if ("<COGNITO_USER_POOL_ID>" === "") {

    localStorage.setItem("aws-congnito-user-pool-id", "us-east-1_r6EnI7Vpu");
} else {
    localStorage.setItem("aws-congnito-user-pool-id", "<COGNITO_USER_POOL_ID>");
}



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

function deleteUser(callback) {
    if (cognitoUser) {
        cognitoUser.deleteUser((err, result) => {
            if (err) {
                callback(err, null);
                return;
            }
            cognitoUser = null;
            callback(null, result);
        });
        return;
    }
    callback({ name: "Error", message: "User is not signed in" }, null);
}

function changeUserPassword(oldPassword, newPassword, callback) {
    if (cognitoUser) {
        cognitoUser.changePassword(oldPassword, newPassword, callback);
        return;
    }
    callback({ name: "Error", message: "User is not signed in" }, null);
}

function sendPasswordResetCode(userName, callback) {
    getUser(userName).forgotPassword(wrapCallback(callback));
}

function confirmPasswordReset(userName, code, newPassword, callback) {
    getUser(userName).confirmPassword(code, newPassword, wrapCallback(callback));
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

function inputCredentials() {
    if ((localStorage.getItem("aws-congnito-user-pool-id") !== undefined) &&
        (localStorage.getItem("aws-congnito-app-id") !== undefined)) {
        document.getElementById("cognitoUserPoolId").value = localStorage.getItem("aws-congnito-user-pool-id");
        document.getElementById("applicationId").value = localStorage.getItem("aws-congnito-app-id");
    }
    document.getElementById("credentialsModal").style.display = "block";
}

function saveCredentials() {
    let userPoolId = document.getElementById("cognitoUserPoolId").value;
    localStorage.setItem("aws-congnito-user-pool-id", userPoolId);
    let appId = document.getElementById("applicationId").value;
    localStorage.setItem("aws-congnito-app-id", appId);
}

function clearCredentials() {
    localStorage.removeItem("aws-congnito-user-pool-id");
    localStorage.removeItem("aws-congnito-app-id");
    document.getElementById("cognitoUserPoolId").value = "";
    document.getElementById("applicationId").value = "";
}



function createCallback(successMessage, userName = "", email = "", confirmed = "", status = "") {
    return (err, result) => {
        if (err) {
            let message = err.name + ": " + err.message;
            alert(`Error: ${message}`);
        } else {
            user.update({
                name: userName,
                email: email,
                email_verified: confirmed,
                status: status
            });
            let message = "Success: " + successMessage;
            alert(message);

            if (status === "Signed In") {
                updateSignedInUsername(userName);
            } else if (status === "Signed Out") {
                updateSignedInUsername("");
            }
        }
    };
}

function updateSignedInUsername(userName) {
    document.getElementById("signedInUsername").innerText = userName ? `Signed in as: ${userName}` : "";
}

export { signUpUser, signInUser, signOutUser, confirmUser, deleteUser, changeUserPassword, sendPasswordResetCode, confirmPasswordReset, userAttributes, updateAttributes };
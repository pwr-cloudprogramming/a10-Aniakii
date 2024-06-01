const userPoolId = COGNITO_USER_POOL_ID;
const clientId = COGNITO_CLIENT_ID;
console.log("USER POOL ID = " + userPoolId);
console.log("CLIENT ID = " + clientId);

function getPoolData() {
  return {
    UserPoolId: userPoolId,
    ClientId: clientId,
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
    Pool: getUserPool(),
  };
  return new AmazonCognitoIdentity.CognitoUser(userData);
}

function signUpUser(userName, userEmail, userPassword, callback) {
  let dataEmail = {
    Name: "email",
    Value: userEmail,
  };
  let dataName = {
    Name: "preferred_username",
    Value: userName,
  };
  let attributeList = [
    new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail),
    new AmazonCognitoIdentity.CognitoUserAttribute(dataName),
  ];

  getUserPool().signUp(
    userName,
    userPassword,
    attributeList,
    null,
    function (err, result) {
      if (err) {
        callback(err, null);
      } else {
        cognitoUser = result.user;
        callback(null, result);
      }
    },
  );
}

function confirmUser(userName, code, callback) {
  getUser(userName).confirmRegistration(code, true, callback);
}

function wrapCallback(callback) {
  return {
    onFailure: (err) => {
      callback(err, null);
    },
    onSuccess: (result) => {
      callback(null, result);
    },
  };
}

function signInUser(userName, password, callback) {
  let authenticationData = {
    Username: userName,
    Password: password,
  };
  var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(
    authenticationData,
  );
  getUser(userName).authenticateUser(
    authenticationDetails,
    wrapCallback(callback),
  );
}

function signOutUser(callback) {
  if (cognitoUser) {
    if (cognitoUser.signInUserSession) {
      cognitoUser.signOut();
      localStorage.removeItem("loggedInUser");
      callback(null, {});
      return;
    }
  }
  callback({ name: "Error", message: "User is not signed in" }, null);
}


export {
  signUpUser,
  signInUser,
  signOutUser,
  confirmUser,
};

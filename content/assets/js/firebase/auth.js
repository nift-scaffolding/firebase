/**
 * Function called when clicking the Login/Logout button.
 */
function handleGoogleSignIn() {
  if (!firebase.auth().currentUser) {
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/plus.login');
    firebase.auth().signInWithRedirect(provider);
  } else {
    alert("already signed in as " + firebase.auth().currentUser.email);
  }
}

/**
 * Handles the sign in button press.
 */
function signIn() {
  if (firebase.auth().currentUser) {
    alert("already signed in as " + firebase.auth().currentUser.email);
  } 
  else {
    var email = document.getElementById('input-email').value;
    var password = document.getElementById('input-password').value;

    if (email.length < 4) {
      alert('Please enter an email address.');
      return;
    }
    else if (password.length < 4) {
      alert('Please enter a password.');
      return;
    }

    // Sign in with email and pass.
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      if (errorCode === 'auth/wrong-password') {
        alert('Wrong password.');
      } else {
        alert(errorMessage);
      }
      console.log(error);
    });
    alert("signed in");
  }
}

function signOut() {
  if(firebase.auth().currentUser) {
    firebase.auth().signOut();
    alert("signed out");
  } 
}

/**
 * Sends an email verification to the user.
 */
function sendEmailVerification() {
  firebase.auth().currentUser.sendEmailVerification().then(function() {
    // Email Verification sent!
    alert('Email Verification Sent!');
  });
}

/**
 * Handles the sign up button press.
 */
function signUp() {
  var email = document.getElementById('input-email').value;
  var password = document.getElementById('input-password').value;

  if (email.length < 4) {
    alert('Please enter an email address.');
    return;
  }
  else if (password.length < 4) {
    alert('Please enter a password.');
    return;
  }
  else if(password != document.getElementById('input-confirm-password').value) {
    alert('Passwords do not match.');
    return;
  }

  // Create user with email and pass.
  firebase.auth().createUserWithEmailAndPassword(email, password).then(function() {
    alert("Signed up successfully");
  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    if (errorCode == 'auth/weak-password') {
      alert('The password is too weak.');
    } else {
      alert(errorMessage);
    }
    console.log(error);
  });
}

function sendPasswordReset() {
  var email = document.getElementById('email').value;
  firebase.auth().sendPasswordResetEmail(email).then(function() {
    // Password Reset Email Sent!
    alert('Password Reset Email Sent!');
  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    if (errorCode == 'auth/invalid-email') {
      alert(errorMessage);
    } else if (errorCode == 'auth/user-not-found') {
      alert(errorMessage);
    }
    console.log(error);
  });
}

/**
 * initApp handles setting up UI event listeners and registering Firebase auth listeners:
 *  - firebase.auth().onAuthStateChanged: This listener is called when the user is signed in or
 *    out, and that is where we update the UI.
 */
function initApp() {
  // Listening for auth state changes.
  firebase.auth().onAuthStateChanged(function(user) {
    //document.getElementById('quickstart-verify-email').disabled = true;
    if (user) {
      // User is signed in.
      var displayName = user.displayName;
      var email = user.email;
      var emailVerified = user.emailVerified;
      var photoURL = user.photoURL;
      var isAnonymous = user.isAnonymous;
      var uid = user.uid;
      var providerData = user.providerData;
      if(document.getElementById('auth-details')) {
        document.getElementById('auth-details').textContent = JSON.stringify(user, null, '  ');
      }
      document.getElementById("sign-out-button").classList.remove("no-display");
      document.getElementById("sign-in-link").classList.add("no-display");
      document.getElementById("sign-up-link").classList.add("no-display");
      document.getElementById("details-link").classList.remove("no-display");
      /*if (!emailVerified) {
        document.getElementById('quickstart-verify-email').disabled = false;
      }*/
    } else {
      // User is signed out.
      if(document.getElementById('auth-details')) {
        document.getElementById('auth-details').textContent = 'null';
      }
      document.getElementById("sign-out-button").classList.add("no-display");
      document.getElementById("sign-in-link").classList.remove("no-display");
      document.getElementById("sign-up-link").classList.remove("no-display");
      document.getElementById("details-link").classList.add("no-display");
    }
  });
}

window.onload = function() {
  initApp();
};
/**
 * Get elements from the form
 */
let first_name = document.getElementById("first_name");
let last_name = document.getElementById("last_name");
let email = document.getElementById("email");
let age = document.getElementById("age");
let password = document.getElementById("password");
/**
 * Buttons from the form
 */
let loginBtn = document.getElementById("login");
let registerBtn = document.getElementById("register");
let logoutBtn = document.getElementById("logout");
let githubLogin = document.getElementById("githubLogin");

/**
 * Password reset buttons
 */
let resetPasswordButton = document.getElementById("changePassword");
let oldpassword = document.getElementById("actual-password");
let newpassword = document.getElementById("new-password");
let repeatpassword = document.getElementById("repeat-password");

/**
 * Recover password buttons
 */
let requestPasswordReset = document.getElementById("requestPasswordReset");
let recoverEmail = document.getElementById("recover-email");
let resetPassword = document.getElementById("resetPassword");

/**
 * User access level
 */
let userEmail = document.getElementById("user-email");
let accessLevel = document.getElementById("access-levels");
let changeAccessLevel = document.getElementById("changeAccessLevel");
let deleteUser = document.getElementById("deleteUser");
/**
 * Logout button, this function redirect after
 */
logoutBtn?.addEventListener("click", async () => {
  const response = await fetch("/session/logout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  try {
    window.location.href = response.url;
  } catch (error) {
    console.log(error);
  }
});
/**
 * Register button, this function get the body data
 * and send this to the API with a fetch and register
 * the user
 */
registerBtn?.addEventListener("click", async () => {
  const body = {
    first_name: first_name.value,
    last_name: last_name.value,
    email: email.value,
    age: age.value,
    password: password.value,
  };
  const response = await fetch("/session/register", {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  });

  try {
    if (response.status == 401 && response.status == 500) {
      return (window.location.href = response.url);
    }
    window.location.href = response.url;
  } catch (error) {
    alert("Cant register that email, because it exists");
  }
});

/**
 * Login button, this function send the body data
 * thru the a fetch and redirect if is validate in the backend
 */
loginBtn?.addEventListener("click", async () => {
  const body = {
    email: email.value,
    password: password.value,
  };
  const response = await fetch("/session/login", {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  });
  try {
    if (response.status == 401) {
      return alert("Authentication failed");
    }
    window.location.href = response.url;
  } catch (error) {
    console.log(error);
  }
});

githubLogin?.addEventListener("click", () => {
  window.location.href = "https://coderproyect-production.up.railway.app/session/github";
});

resetPasswordButton?.addEventListener("click", async () => {
  if (!oldpassword.value && !newpassword.value && !repeatpassword.value)
    return alert("All the fields are needed");
  if (newpassword.value !== repeatpassword.value)
    return alert("Password are different");
  const body = {
    oldpassword: oldpassword.value,
    newpassword: newpassword.value,
  };

  const response = await fetch("/session/profile/changePassword", {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  });
  try {
    const result = await response.json();

    if (response.status == 400) {
      return alert(result.error);
    }
    alert("Your password has been change, for security the session was closed");

    const logout = await fetch("/session/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    window.location.href = logout.url;
  } catch (error) {
    console.log(error);
  }
});

requestPasswordReset?.addEventListener("click", async () => {
  if (!recoverEmail.value) return alert("The email is needed");
  const body = {
    email: recoverEmail.value,
  };

  const response = await fetch("/session/recoverPassword", {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  });
  try {
    const result = await response.json();

    if (response.status == 400) {
      return alert(result.error);
    }
    alert("We send a email with the link to reset the password");
  } catch (error) {
    alert(error);
  }
});

resetPassword?.addEventListener("click", async () => {
  if (newpassword.value !== repeatpassword.value)
    return alert("Password are different");
  const url = new URLSearchParams(window.location.search);
  const body = {
    userId: url.get('id'),
    token: url.get('token'),
    password: newpassword.value
  };

  const response = await fetch("/session/passwordReset", {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  });
  try {
    const result = await response.json();

    if (response.status == 400) {
      return alert(result.error);
    }
    alert("The password has been change");
  } catch (error) {
    alert(error);
  }
});

changeAccessLevel?.addEventListener("click", async () => {

  const body = {
    email: userEmail.value,
    accessLevel: accessLevel.value
  };

  const response = await fetch("/session/adminpanel/users", {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  });
  try {
    const result = await response.json();
    if (response.status == 400) {
      return alert(result.error);
    }
    alert("The accesslevel has been change");
  } catch (error) {
    alert(error);
  }
});


deleteUser?.addEventListener("click", async () => {

  const body = {
    email: userEmail.value
  };

  console.log(body);

  const response = await fetch("/session/user", {
    method: "DELETE",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  });
  try {
    const result = await response.json();
    if (response.status == 400) {
      return alert(result.error);
    }
    alert("User has been deleted");
  } catch (error) {
    alert(error);
  }
});

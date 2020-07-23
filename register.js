var users = new Database('users')

function check() {
    console.log("check has started");
    var enteredUsername = document.getElementById("username").value;
    var password = document.getElementById('password').value;
    var repeatPassword = document.getElementById('repeat_password').value;
    if (password.length >= 8 &&
        password == repeatPassword &&
        containsLowerCaseLetter(password) &&
        containsUpperCaseLetter(password) &&
        containsDigit(password) &&
        !users.get("username", enteredUsername)
    ) {
        console.log("bazari araaaao");
        var newUser = users.create({
            username: enteredUsername,
            password: password
        });
    }
}

function containsLowerCaseLetter(s) {
    return (/[a-z]/.test(s));
}

function containsUpperCaseLetter(s) {
    return (/[A-Z]/.test(s));
}

function containsDigit(s) {
    return (/[0-9]/.test(s));
}
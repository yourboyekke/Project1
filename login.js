function getValue(query) {
	return document.querySelector(query).value
}

var users = new Database('users')

function login() {
	var user = users.get('username', getValue('input#username'))
	var errorDiv = document.getElementById("error_message")
	if (user == null) {
		errorDiv.innerHTML = "მომხმარებელი არ არსებობს"
	} else if (user.password !== getValue('input#password')) {
		errorDiv.innerHTML = "პაროლი არასწორია"
	} else {
		console.log('User loged in');
		localStorage.setItem('status', 'loggedin');
		window.location = "./index.html";
	}
}
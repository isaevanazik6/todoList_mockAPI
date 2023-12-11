const regForm = document.querySelector(".regForm")
const regEmailInput = document.querySelector(".regEmailInput")
const regUsernameInput = document.querySelector(".regUsernameInput")
const regPasswordInput = document.querySelector(".regPasswordInput")
const regConfirmPasswordInput = document.querySelector(".regConfirmPasswordInput")
const errorMessage = document.querySelector(".errorMessage")

const userId = JSON.parse(localStorage.getItem("user"))?.id


window.onload = () => {
    if (userId) {
        window.location.replace("../pages/todoListPage.html")
    }
}



const registerUser = (email, username, password) => {
    const xhr = new XMLHttpRequest();
    const url = "https://656d7e01bcc5618d3c2343ec.mockapi.io/api/v1/users";

    const data = {
        email,
        username,
        password
    };

    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status >= 200 && xhr.status < 300) {
                const userData = JSON.parse(xhr.responseText);
                localStorage.setItem("user", JSON.stringify(userData));
                window.location.replace("../pages/todoListPage.html");
            } else {
                console.log("Error:", xhr.statusText);
            }
        }
    };

    xhr.onerror = function (error) {
        console.log("Request failed:", error);
    };

    xhr.send(JSON.stringify(data));
};



regForm.onsubmit = (e) => {
    e.preventDefault()
    if (regPasswordInput.value === regConfirmPasswordInput.value) {
        registerUser(regEmailInput.value, regUsernameInput.value, regPasswordInput.value).then()
    } else {
        errorMessage.innerHTML = "Passwords must match!"
    }
}


regPasswordInput.oninput = () => {
    errorMessage.innerHTML = ""
}

// Remove the error message on type
regConfirmPasswordInput.oninput = () => {
    errorMessage.innerHTML = ""
}
const loginForm = document.querySelector(".loginForm")
const loginEmailInput = document.querySelector(".loginEmailInput")
const loginPasswordInput = document.querySelector(".loginPasswordInput")
const errorMessage = document.querySelector(".errorMessage")

const userId = JSON.parse(localStorage.getItem("user"))?.id

// Redirect to todolist page if logged in
window.onload = () => {
    if (userId) {
        window.location.replace("../pages/todoList.html")
    }
}

// загрузка всех пользователей и поиск их по ID
const fetchAllUsers = () => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", "https://656d7e01bcc5618d3c2343ec.mockapi.io/api/v1/users", true);

        xhr.onload = function () {
            if (xhr.status === 200) {
                const users = JSON.parse(xhr.responseText);
                const user = users.find(item => item.email === loginEmailInput.value && item.password === loginPasswordInput.value);
                resolve(user);
            } else {
                reject(new Error(`Failed to fetch users. Status: ${xhr.status}`));
            }
        };

        xhr.onerror = function () {
            reject(new Error("Network error occurred while trying to fetch users."));
        };

        xhr.send();
    });
};

// Submitting the login form

loginForm.onsubmit = async (e) => {
    e.preventDefault()
    const user = await fetchAllUsers()
    if (user) {
        localStorage.setItem("user", JSON.stringify(user))
        window.location.replace("../pages/todoList.html")
    } else {
        errorMessage.innerHTML = "Invalid login or password"
    }
}

// Remove the error message on type
loginEmailInput.oninput = () => {
    errorMessage.innerHTML = ""
}

// Remove the error message on type
loginPasswordInput.oninput = () => {
    errorMessage.innerHTML = ""
}
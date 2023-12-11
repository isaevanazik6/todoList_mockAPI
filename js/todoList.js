const taskListBlock = document.querySelector(".taskListBlock")
const titleInp = document.querySelector(".titleInp")
const descriptionInp = document.querySelector(".descriptionInp")
const topBlockForm = document.querySelector(".topBlockForm")
const editModal = document.querySelector(".editModalWindow")
const editModalTitleInput = document.querySelector(".editModalTitleInput")
const editModalDescInput = document.querySelector(".editModalDescInput")
const editModalForm = document.querySelector(".editModalWindowForm")
const editModalCloseBtn = document.querySelector(".editModalCloseBtn")
const logoutBtn = document.querySelector(".logoutBtn")
const wrapper = document.querySelector(".wrapper")
const headerUsername = document.querySelector(".usernameOutput")


const allBtn = document.querySelector(".all")
const completedBtn = document.querySelector(".completed-btn")
const uncompletedBtn = document.querySelector(".uncompleted")
const allFilterButtons = document.querySelectorAll(".filterButton")

// получение ID пользователя из локального хранилища
const userId = JSON.parse(localStorage.getItem("user"))?.id


window.onload = () => {
    const user = JSON.parse(localStorage.getItem("user")) ?? {};
    if (!user.id) setTimeout(() => window.location.replace("../pages/login.html"), 1);
    else headerUsername.innerHTML = user.username;
};



function fetchData() {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", `https://656d7e01bcc5618d3c2343ec.mockapi.io/api/v1/users/${userId}/todos`, true);

        xhr.onload = function () {
            if (xhr.status >= 400 && xhr.status <= 499) {
                reject("error");
            } else {
                const data = JSON.parse(xhr.responseText);
                if (data.length > 0) {
                    resolve(data);
                } else {
                    resolve(false);
                }
            }
        };

        xhr.onerror = function () {
            reject("error");
        };

        xhr.send();
    });
}


function getFilteredTasks(completed) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", `https://656d7e01bcc5618d3c2343ec.mockapi.io/api/v1/users/${userId}/todos?completed=${completed}`, true);

        xhr.onload = function () {
            if (xhr.status >= 400 && xhr.status <= 499) {
                reject("error");
            } else {
                resolve(JSON.parse(xhr.responseText));
            }
        };

        xhr.onerror = function () {
            reject("error");
        };

        xhr.send();
    });
}


const displayNoTasks = () => {
    const noTasks = document.createElement("p");
    noTasks.classList.add("noTasksMessage");
    noTasks.textContent = "No tasks...";
    taskListBlock.append(noTasks);
};



const changeActiveBtn = (index) => {
    allFilterButtons.forEach(btn => {
        btn.style.backgroundColor = "#2f2f2f"
        btn.style.color = "#ffffff"
    })
    allFilterButtons[index].style.backgroundColor = "#FF8A56"
    allFilterButtons[index].style.color = "#000000"
}


completedBtn.onclick = async () => {
    const tasks = await getFilteredTasks(true)
    taskListBlock.innerHTML = null
    await tasks.forEach(task => createElements(task))
    changeActiveBtn(1)
    if (taskListBlock.children.length === 0) {
        displayNoTasks()
    }
}

allBtn.onclick = async () => {
    const tasks = await getFilteredTasks("")
    taskListBlock.innerHTML = null
    await tasks.forEach(task => createElements(task))
    changeActiveBtn(0)
    if (taskListBlock.children.length === 0) {
        displayNoTasks()
    }
}


uncompletedBtn.onclick = async () => {
    const tasks = await getFilteredTasks(false)
    taskListBlock.innerHTML = null
    await tasks.forEach(task => createElements(task))
    changeActiveBtn(2)
    if (taskListBlock.children.length === 0) {
        displayNoTasks()
    }
}


function deleteTask(id) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("DELETE", `https://656d7e01bcc5618d3c2343ec.mockapi.io/api/v1/users/${userId}/todos/${id}`, true);

        xhr.onload = function () {
            console.log(xhr);
            resolve();
        };

        xhr.onerror = function () {
            reject("error");
        };

        xhr.send();
    });
}


function checkTask(id, completed) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", `https://656d7e01bcc5618d3c2343ec.mockapi.io/api/v1/users/${userId}/todos/${id}`, true);
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onload = function () {
            console.log(xhr);
            resolve();
        };

        xhr.onerror = function () {
            reject("error");
        };

        xhr.send(JSON.stringify({ completed }));
    });
}


function editTask(id, title, desc) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", `https://656d7e01bcc5618d3c2343ec.mockapi.io/api/v1/users/${userId}/todos/${id}`, true);
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onload = function () {
            const data = JSON.parse(xhr.responseText);
            resolve(data);
        };

        xhr.onerror = function () {
            reject("error");
        };

        xhr.send(JSON.stringify({ title, description: desc }));
    });
}


function postTask(title, desc) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", `https://656d7e01bcc5618d3c2343ec.mockapi.io/api/v1/users/${userId}/todos/`, true);
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onload = function () {
            const data = JSON.parse(xhr.responseText);
            resolve(data);
        };

        xhr.onerror = function () {
            reject("error");
        };

        xhr.send(JSON.stringify({ title, description: desc, completed: false }));
    });
}


const createElements = (task) => {


    const noTasks = document.querySelector(".noTasksMessage")
    if (noTasks) noTasks.remove()


    const div = document.createElement("div")
    div.classList.add("taskBlock")

    const taskTitleDescCheckbox = document.createElement("div")
    taskTitleDescCheckbox.classList.add("taskTitleDescCheckbox")

    const taskTitleDesc = document.createElement("div")
    taskTitleDesc.classList.add("taskTitleDesc")

    const taskBlockLine = document.createElement("div")
    taskBlockLine.classList.add("taskBlockLine")

    const taskButtons = document.createElement("div")
    taskButtons.classList.add("taskButtons")

    const checkbox = document.createElement("input")
    checkbox.setAttribute("type", "checkbox")
    checkbox.setAttribute("class", "taskCheckbox")
    checkbox.checked = task.completed
    checkbox.onclick = async (e) => {
        const check = e.target.checked
        await checkTask(task.id, check)
    }

    const title = document.createElement("h2")
    title.classList.add("taskTitle")


    const titleToPrint = task.title.split("")

    const intervalTitle = setInterval(() => {
        title.innerHTML = title.innerHTML + titleToPrint.shift()

        if (titleToPrint.length < 1) {
            clearInterval(intervalTitle)
        }
    }, 7)


    const desc = document.createElement("p")
    desc.classList.add("taskDesc")


    const descToPrint = task.description.split("")
    const intervalDesc = setInterval(() => {
        desc.innerHTML = desc.innerHTML + descToPrint.shift()

        if (descToPrint.length < 1) {
            clearInterval(intervalDesc)
        }
    }, 5)

    const editBtn = document.createElement("button");
    editBtn.classList.add("taskEdit");
    editBtn.innerHTML = "EDIT";
    editBtn.onclick = handleEditClick;

    function handleEditClick() {
        // Showing a modal window
        editModal.classList.remove("hideBlock");
        wrapper.style.filter = "blur(2px)";

        // Submitting the edited tasks
        editModalForm.onsubmit = handleEditSubmit;
    }

    async function handleEditSubmit(e) {
        e.preventDefault();
        const editedTask = await editTask(task.id, editModalTitleInput.value, editModalDescInput.value);
        updateTaskDisplay(editedTask);
    }

    function updateTaskDisplay(editedTask) {
        title.innerHTML = editedTask.title;
        desc.innerHTML = editedTask.description;
        editModalTitleInput.value = "";
        editModalDescInput.value = "";
        editModal.classList.add("hideBlock");
        wrapper.style.filter = "none";
    }


    const deleteBtn = document.createElement("button")
    deleteBtn.classList.add("taskDelete")
    deleteBtn.innerHTML = "DELETE"
    deleteBtn.onclick = async () => {
        await deleteTask(task.id)
        await div.remove()
        // Showing the "No tasks" message if there are no tasks
        if (taskListBlock.children.length === 0) {
            displayNoTasks()
        }
    }

    // добавляем все в главный блок
    taskTitleDesc.append(title, desc)
    taskTitleDescCheckbox.append(checkbox, taskTitleDesc)
    taskButtons.append(editBtn, deleteBtn)
    div.append(taskTitleDescCheckbox, taskBlockLine, taskButtons)
    taskListBlock.insertBefore(div, taskListBlock.firstChild)


}

// добавить новую задачу
const handleTopBlockFormSubmit = async (e) => {
    e.preventDefault();

    const title = titleInp.value;
    const desc = descriptionInp.value;

    try {
        const task = await postTask(title, desc);
        clearInputFields();
        createElements(task);
    } catch (error) {
        console.error("Error posting task:", error);
    }
};

const clearInputFields = () => {
    titleInp.value = "";
    descriptionInp.value = "";
};

topBlockForm.onsubmit = handleTopBlockFormSubmit;

// Создать задачу
const createTasks = async () => {
    try {
        const tasks = await fetchData();

        if (tasks && Array.isArray(tasks)) {
            tasks.forEach((task) => {
                createElements(task);
            });
        } else {
            displayNoTasks();
        }
    } catch (error) {
        const errorMessage = document.createElement("p");
        errorMessage.setAttribute("class", "noTasksMessage");
        errorMessage.innerHTML = "Error...";
        taskListBlock.append(errorMessage);
    }
};


// Modal close button
editModalCloseBtn.onclick = () => {
    wrapper.style.filter = "none"
    editModal.classList.add("hideBlock")
    editModalTitleInput.value = ""
    editModalDescInput.value = ""
}

// Logout button
logoutBtn.onclick = () => {
    localStorage.removeItem("user");
    window.location.replace("../index.html")
}

// Creating the tasks when loaded
createTasks().then()


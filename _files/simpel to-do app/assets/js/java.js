// Hent opgaver fra localStorage eller initialiser som en tom array
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Funktion til at tilføje en ny opgave
function addTask() {
    const taskInput = document.getElementById('task-input');
    const taskDateTime = document.getElementById('task-datetime');
    const taskTitle = taskInput.value.trim();
    const taskDate = taskDateTime.value;

    if (taskTitle !== "" && taskDate) {
        const newTask = {
            id: tasks.length ? tasks[tasks.length - 1].id + 1 : 1, // Incremental ID
            title: taskTitle,
            dateTime: taskDate,
            completed: false
        };
        tasks.push(newTask);
        saveTasks();
        taskInput.value = ''; // Tøm input feltet
        taskDateTime.value = ''; // Tøm dato og tid feltet
        renderTasks();
    }
}

// Funktion til at vise opgaverne
function renderTasks() {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = ''; // Tøm eksisterende liste

    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'task';
        li.innerHTML = `
            <div class="task-details">
                <span class="${task.completed ? 'completed' : ''}" onclick="toggleComplete(${task.id})">
                    ${task.title}
                </span>
                <div class="task-date-time">${new Date(task.dateTime).toLocaleString()}</div>
            </div>
            <button onclick="removeTask(${task.id})">Fjern</button>
        `;
        taskList.appendChild(li);
    });
}

// Funktion til at markere en opgave som færdig/ufærdig
function toggleComplete(id) {
    const task = tasks.find(task => task.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
    }
}

// Funktion til at fjerne en opgave
function removeTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
}

// Funktion til at gemme opgaver til localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Initial rendering af opgaver (hvis der er nogen)
renderTasks();
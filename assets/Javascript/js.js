// #region Global Variables
let myData = []; // Array that holds all lists and their tasks
let currentListIndex = null; // Index of the selected list
// #endregion

// #region DOM References
const listsContainer = document.querySelector('.lists');
const addListButton = document.querySelector('#addList');
const chosenListHeader = document.querySelector('#chosenList h2');
const tasksContainer = document.querySelector('.tasksContainer');
const addTaskButton = document.querySelector('.addTask img');
// #endregion

// #region Utility Functions
function saveListsToLocalStorage() {
    localStorage.setItem('lists', JSON.stringify(myData)); // Save entire data array
}

function loadListsFromLocalStorage() {
    const savedLists = JSON.parse(localStorage.getItem('lists')) || [];
    myData = savedLists; // Load saved data
    savedLists.forEach(list => {
        createNewList(list.name, list.listItems); // Recreate each list in the DOM
    });
}

function updateListCount() {
    const listItems = listsContainer.querySelectorAll('li');
    listItems.forEach((item, index) => {
        const countElement = item.querySelector('p');
        if (countElement && myData[index]) {
            countElement.textContent = myData[index].listItems.length;
        }
    });
}

function saveTasksToLocalStorage() {
    if (currentListIndex !== null) {
        const currentTasks = [];
        document.querySelectorAll('.tasksContainer .task').forEach(task => {
            const taskText = task.querySelector('h3').textContent;
            const isCompleted = task.classList.contains('clicked');
            currentTasks.push({ text: taskText, completed: isCompleted });
        });
        myData[currentListIndex].listItems = currentTasks; // Update tasks in data array
        saveListsToLocalStorage(); // Save updates to localStorage
        
        // Update task count when tasks change
        const taskCountElement = document.getElementById('taskCount');
        if (taskCountElement) {
            taskCountElement.textContent = `${currentTasks.length}`;
        }
        
        updateListCount(); // Update task counts in the DOM
    }
}
// #endregion

// #region Add List and Tasks
function createNewList(listName, listItems = []) {
    // Check if the list already exists
    const existingListItem = Array.from(listsContainer.querySelectorAll('li'))
        .find(item => item.querySelector('h3').textContent === listName);

    if (existingListItem) {
        return; // List already exists
    }

    const newListItem = document.createElement('li');
    newListItem.classList.add('gridBorder');

    const newListContent = document.createElement('div');
    newListContent.classList.add('listItem');

    const newListTitle = document.createElement('h3');
    newListTitle.textContent = listName;
    newListContent.appendChild(newListTitle);

    const newListCount = document.createElement('p');
    newListCount.textContent = listItems.length;
    newListContent.appendChild(newListCount);

    const deleteIcon = document.createElement('img');
    deleteIcon.src = 'assets/images/Delete.svg';
    deleteIcon.classList.add('deleteIcon');
    newListContent.appendChild(deleteIcon);

    newListItem.appendChild(newListContent);
    listsContainer.insertBefore(newListItem, addListButton.parentElement);

    // Event Listener to select the list
    newListContent.addEventListener('click', function() {
        selectList(listName);
    });

    // Event Listener to delete the list
    deleteIcon.addEventListener('click', function(event) {
        event.stopPropagation();

        // Remove the list from data
        const listToDeleteIndex = myData.findIndex(list => list.name === listName);
        if (listToDeleteIndex !== -1) {
            myData.splice(listToDeleteIndex, 1); // Remove the list from myData
        }

        // Remove the list from the DOM
        newListItem.remove();

        if (currentListIndex !== null && myData[currentListIndex]?.name === listName) {
            // If the selected list was deleted, clear the header and tasks
            chosenListHeader.textContent = 'Select a list';
            tasksContainer.innerHTML = '';
            currentListIndex = null;
            // Reset the task count
            const taskCountElement = document.getElementById('taskCount');
            if (taskCountElement) {
                taskCountElement.textContent = '0';
            }
        }

        // Save changes to localStorage
        saveListsToLocalStorage();

        // Update list counts
        updateListCount();
    });

    // Add a new list to myData
    myData.push({ name: listName, listItems: listItems });
    saveListsToLocalStorage(); // Save the new list to localStorage
    updateListCount(); // Update task counts
}

function createNewTask(task) {
    const taskDiv = document.createElement('div');
    taskDiv.classList.add('task');

    const checkmarkDiv = document.createElement('div');
    checkmarkDiv.classList.add('checkmark');

    const outerImg = document.createElement('img');
    outerImg.src = 'assets/images/checkmark/CeckMark Outer.svg';
    outerImg.alt = 'Checkmark Outer'; // Add alt text for accessibility
    checkmarkDiv.appendChild(outerImg);

    const checkDiv = document.createElement('div');
    checkDiv.classList.add('check');
    const innerImg = document.createElement('img');
    innerImg.src = 'assets/images/checkmark/CeckMark Innersvg.svg';
    innerImg.alt = 'Checkmark Inner'; // Add alt text for accessibility
    checkDiv.appendChild(innerImg);
    checkmarkDiv.appendChild(checkDiv);

    taskDiv.appendChild(checkmarkDiv);

    const taskTitle = document.createElement('h3');
    taskTitle.textContent = task.text;
    taskTitle.classList.add('taskText');
    taskDiv.appendChild(taskTitle);

    const deleteDiv = document.createElement('div');
    deleteDiv.classList.add('delete');
    deleteDiv.innerHTML = '<img src="assets/images/Delete.svg" alt="">';
    deleteDiv.addEventListener('click', function() {
        taskDiv.remove();
        saveTasksToLocalStorage(); // Update localStorage when a task is deleted
    });
    taskDiv.appendChild(deleteDiv);

    // Event Listener to toggle checkmark visibility
    checkmarkDiv.addEventListener('click', function() {
        checkDiv.classList.toggle('visible');
        taskDiv.classList.toggle('clicked');
        saveTasksToLocalStorage(); // Save the updated state to localStorage
    });

    // Set initial state
    if (task.completed) {
        checkDiv.classList.add('visible');
        taskDiv.classList.add('clicked');
    }

    tasksContainer.appendChild(taskDiv);
}

function selectList(listName) {
    currentListIndex = myData.findIndex(list => list.name === listName); // Find index of the selected list
    if (currentListIndex !== -1) {
        chosenListHeader.textContent = listName; // Update header with list name
        
        // Update the task count next to the selected list title
        const taskCountElement = document.getElementById('taskCount');
        const taskCount = myData[currentListIndex].listItems.length;
        if (taskCountElement) {
            taskCountElement.textContent = `${taskCount}`;
        }
        
        renderTasks(); // Call renderTasks to show tasks for the selected list
    }
}

function renderTasks() {
    if (currentListIndex !== null) {
        tasksContainer.innerHTML = ''; // Ensure the task list is cleared before new tasks are added
        myData[currentListIndex].listItems.forEach(task => createNewTask(task)); // Show tasks for the selected list
    }
}
// #endregion

// #region Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Function to create a new list via prompt
    addListButton.addEventListener('click', function() {
        const listName = prompt('Skriv Titlen på din nye Liste:');
        if (listName && listName.trim() !== '') {
            createNewList(listName);
        }
    });

    // Function to create a new task via prompt
    addTaskButton.addEventListener('click', function() {
        if (currentListIndex !== null) {
            const taskText = prompt('Enter the task:');
            if (taskText && taskText.trim() !== '') {
                createNewTask({ text: taskText, completed: false });
                saveTasksToLocalStorage(); // Save the new task to localStorage
            }
        } else {
            alert('Du skal vælge en liste først'); // Message if no list is selected
        }
    });

    loadListsFromLocalStorage(); // Load lists on page load
});
// #endregion

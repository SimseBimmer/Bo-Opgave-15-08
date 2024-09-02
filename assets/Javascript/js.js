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
    console.log('Lists saved to localStorage.');
}

function loadListsFromLocalStorage() {
    const savedLists = JSON.parse(localStorage.getItem('lists')) || [];
    myData = savedLists; // Load saved data
    savedLists.forEach(list => {
        createNewList(list.name, list.listItems); // Recreate each list in the DOM
    });
    console.log('Lists loaded from localStorage.');
}

function updateListCount() {
    const listItems = listsContainer.querySelectorAll('li');
    listItems.forEach((item, index) => {
        const countElement = item.querySelector('p');
        if (countElement && myData[index]) {
            countElement.textContent = myData[index].listItems.length; // Update task count for each list
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
        console.log(`List "${listName}" already exists.`);
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
    newListCount.textContent = listItems.length; // Display initial task count
    newListContent.appendChild(newListCount);

    const deleteIcon = document.createElement('img');
    deleteIcon.src = 'assets/images/Delete.svg';
    deleteIcon.classList.add('deleteIcon');
    newListContent.appendChild(deleteIcon);

    newListItem.appendChild(newListContent);
    listsContainer.insertBefore(newListItem, addListButton.parentElement);

    // Add 'visible' class after the list item is added
    setTimeout(() => {
        newListItem.classList.add('visible');
        console.log('Class "visible" added to', newListItem);
    }, 10);

    // Event Listener to select the list
    newListContent.addEventListener('click', function() {
        selectList(listName);
    });

    // Event Listener to delete the list
    deleteIcon.addEventListener('click', function(event) {
        event.stopPropagation();
        
        // Remove the list from data
        myData = myData.filter(list => list.name !== listName);
        
        // Remove the list from the DOM
        newListItem.classList.remove('visible');
        setTimeout(() => newListItem.remove(), 500); // Wait for transition to finish

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

        // Log the deletion for debugging
        console.log(`List "${listName}" has been deleted.`);
    });

    // Add a new list to myData
    myData.push({ name: listName, listItems: listItems });
    saveListsToLocalStorage(); // Save the new list to localStorage
    saveTasksToLocalStorage(); // Save the associated tasks to localStorage
    updateListCount(); // Update task counts

    // Log the creation for debugging
    console.log(`List "${listName}" has been created.`);
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
        taskDiv.classList.remove('visible');
        setTimeout(() => {
            taskDiv.remove(); // Remove task from DOM
            saveTasksToLocalStorage(); // Update localStorage when a task is deleted
        }, 200); // Wait for transition to finish
        console.log(`Task "${task.text}" has been deleted.`);
    });
    taskDiv.appendChild(deleteDiv);

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
    setTimeout(() => {
        taskDiv.classList.add('visible');
        console.log('Class "visible" added to', taskDiv);
    }, 10); // Add 'visible' class after append

    saveTasksToLocalStorage(); // Save tasks to localStorage after adding a new task
    updateListCount(); // Update task count whenever a new task is created

    // Save tasks to localStorage after task creation
    saveTasksToLocalStorage(); 

    console.log(`Task "${task.text}" has been created.`);
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

        // Save the selected list to localStorage
        saveListsToLocalStorage();

        // Log the list selection for debugging
        console.log(`List "${listName}" has been selected.`);
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
    loadListsFromLocalStorage(); // Load lists from localStorage when the page loads
});

addListButton.addEventListener('click', function() {
    const listName = prompt('Enter a name for the new list:');
    if (listName) {
        createNewList(listName);
    }
});

addTaskButton.addEventListener('click', function() {
    if (currentListIndex !== null) {
        const taskText = prompt('Enter task text:');
        if (taskText) {
            createNewTask({ text: taskText, completed: false });
        }
    } else {
        alert('Please select a list before adding tasks.');
    }
});
// #endregion

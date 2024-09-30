// Elements
const taskEntryInput = document.getElementById('task-entry');
const addTaskBtn = document.getElementById('add-task-btn');
const taskListEl = document.getElementById('task-list');
const startBtn = document.getElementById('start-btn');
const toggleCompleted = document.getElementById('toggle-completed');

const todoistTokenInput = document.getElementById('todoist-token');
const saveTokenBtn = document.getElementById('save-token-btn');
const refreshTodoistBtn = document.getElementById('refresh-todoist-btn');
const todoistStatus = document.getElementById('todoist-status');
const filterInput = document.getElementById('filter-input');
const filterPrioritySelect = document.getElementById('filter-priority-select');
const sortTasksSelect = document.getElementById('sort-tasks-select');
const refreshIcon = document.getElementById('refresh-icon');
const saveFilterBtn = document.getElementById('save-filter-btn');
const savedFiltersDropdown = document.getElementById('saved-filters-dropdown');

// Variables
let tasks = [];
let remainingTime = 0;
let paused = false;
let todoistToken = sessionStorage.getItem('todoistToken') || '';

// Load tasks from LocalStorage
window.onload = () => {

  loadSavedFilters();
  const storedFilters = localStorage.getItem('todoistFilters');

  if (storedFilters) {
    const filters = JSON.parse(storedFilters);
    filterInput.value = filters.join(', ');
  }
  // Existing code to load tasks and token
  const storedTasks = localStorage.getItem('tasks');
  if (storedTasks) {
    tasks = JSON.parse(storedTasks);
    // Sort tasks by priority before rendering
    tasks.sort((a, b) => b.priority - a.priority);
    renderTaskList();
  }
  if (todoistToken) {
    todoistStatus.textContent = '✅ Token Saved';
    todoistStatus.style.color = '#4caf50';
    fetchTodoistTasks();
  }
};

// Save tasks to LocalStorage
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Save Todoist Token
saveTokenBtn.addEventListener('click', () => {
  const token = todoistTokenInput.value.trim();
  if (token) {
    todoistToken = token;
    sessionStorage.setItem('todoistToken', token);
    todoistStatus.textContent = '✅ Token Saved';
    todoistStatus.style.color = '#4caf50';
    todoistTokenInput.value = '';
    fetchTodoistTasks();
  } else {
    alert('Please enter a valid Todoist API token.');
  }
});

// Refresh Todoist Tasks
refreshTodoistBtn.addEventListener('click', () => {
  if (todoistToken) {
    fetchTodoistTasks();
  } else {
    alert('Please enter and save your Todoist API token first.');
  }
});

// Add Task
addTaskBtn.addEventListener('click', addTask);
taskEntryInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    addTask();
  }
});

function addTask() {
  const input = taskEntryInput.value.trim();
  if (input) {
    const {name, duration} = parseTaskInput(input);
    if (duration !== null) {
      tasks.push({name, duration, originalDuration: duration, completed: false, fromTodoist: false});
      renderTaskList();
      saveTasks();
      taskEntryInput.value = '';
    } else {
      alert('Invalid duration format. Please use formats like "1.5h", "30m", or "45s".');
    }
  }
}

function parseTaskInput(input) {
  const regex = /^(.*)\s(\d+\.?\d*)([hms])$/i;
  const match = input.match(regex);
  if (match) {
    const name = match[1].trim();
    const value = parseFloat(match[2]);
    const unit = match[3].toLowerCase();
    let durationInSeconds;
    if (unit === 'h') {
      durationInSeconds = value * 3600;
    } else if (unit === 'm') {
      durationInSeconds = value * 60;
    } else if (unit === 's') {
      durationInSeconds = value;
    }
    return {name: name, duration: durationInSeconds};
  } else {
    return {name: input, duration: null};
  }
}

// Render Task List
let filteredTasks = [];

// Add this code to your existing script.js

const toggleTodoistTasksCheckbox = document.getElementById('toggle-todoist-tasks-checkbox');
let todoistTasksVisible = true;

toggleTodoistTasksCheckbox.addEventListener('change', () => {
  todoistTasksVisible = toggleTodoistTasksCheckbox.checked;
  renderTaskList();
});

function updateFilteredTasks() {
  const selectedPriority = filterPrioritySelect.value;
  filteredTasks = tasks.filter(task => {
    const matchesPriority = !selectedPriority || task.priority == selectedPriority;
    const matchesCompletion = !task.completed || toggleCompleted.checked;
    const matchesTodoistVisibility = !task.fromTodoist || todoistTasksVisible;
    return matchesPriority && matchesCompletion && matchesTodoistVisibility;
  });
  sortTasks();
}

function renderTaskList() {
  taskListEl.innerHTML = '';
  updateFilteredTasks();

  filteredTasks.forEach((task) => {
    const li = document.createElement('li');
    li.className = 'task-item';

    // Draggable Indicator
    const draggableIcon = document.createElement('span');
    draggableIcon.className = 'draggable-indicator';
    draggableIcon.innerHTML = '☰';
    draggableIcon.title = 'Drag to reorder';

    // Priority Circle
    const priorityCircle = document.createElement('span');
    priorityCircle.className = 'priority-circle';
    priorityCircle.title = 'Complete Task';
    priorityCircle.style.backgroundColor = getPriorityColor(task.priority);
    priorityCircle.addEventListener('click', () => toggleCompleteTask(task));

    // Task Content
    const content = document.createElement('div');
    content.className = 'task-content';
    content.textContent = task.name;
    content.contentEditable = true;
    content.title = 'Edit task (e.g., "Do laundry 1.5h")';
    content.addEventListener('blur', () => task.name = content.textContent);
    content.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        content.blur();
      }
    });
    if (task.completed) {
      content.classList.add('completed');
    }

    // Task Duration
    const taskDuration = document.createElement('span');
    taskDuration.className = 'task-duration';
    taskDuration.textContent = formatDuration(task.originalDuration);
    taskDuration.contentEditable = true;
    taskDuration.title = 'Edit duration (e.g., "1.5h", "30m", "45s")';
    taskDuration.addEventListener('blur', () => editTaskDuration(task, taskDuration.textContent));
    taskDuration.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        taskDuration.blur();
      }
    });

    // Due Time
    const dueTime = document.createElement('div');
    dueTime.className = 'due-time';
    if (task.due_datetime) {
      const dueDate = new Date(task.due_datetime);
      const now = new Date();
      const isOverdue = dueDate < now;
      dueTime.textContent = formatDueTime(dueDate, task.due_timezone);
      dueTime.style.color = isOverdue ? 'red' : 'green';
    } else {
      dueTime.textContent = 'No time';
      dueTime.style.color = 'black';
    }

    // Task Actions
    const actions = document.createElement('div');
    actions.className = 'task-actions';

    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = '🗑️';
    deleteBtn.title = 'Delete Task';
    deleteBtn.addEventListener('click', () => deleteTask(task));

    actions.appendChild(deleteBtn);

    li.appendChild(draggableIcon);
    li.appendChild(priorityCircle);
    li.appendChild(taskDuration);
    li.appendChild(content);
    li.appendChild(dueTime);
    li.appendChild(actions);
    taskListEl.appendChild(li);
  });

  // Initialize Sortable
  new Sortable(taskListEl, {
    animation: 150,
    handle: '.draggable-indicator',
    onEnd: (evt) => {
      const movedItem = tasks.splice(evt.oldIndex, 1)[0];
      tasks.splice(evt.newIndex, 0, movedItem);
      saveTasks();
    },
  });
}


function editTaskDuration(task, newDuration) {
  const regex = /^(\d+\.?\d*)([hms])$/i;
  const match = newDuration.match(regex);
  if (match) {
    const value = parseFloat(match[1]);
    const unit = match[2].toLowerCase();
    let durationInSeconds;
    if (unit === 'h') {
      durationInSeconds = value * 3600;
    } else if (unit === 'm') {
      durationInSeconds = value * 60;
    } else if (unit === 's') {
      durationInSeconds = value;
    }
    task.duration = durationInSeconds;
    saveTasks();
    renderTaskList();
  } else {
    alert('Invalid duration format. Please use formats like "1.5h", "30m", or "45s".');
    renderTaskList();
  }
}

function formatDueTime(date, timezone) {
  const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const options = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
    timeZone: timezone || browserTimezone // Use browser's timezone if none is provided
  };
  return new Intl.DateTimeFormat('en-US', options).format(date);
}

function getPriorityColor(priority) {
  switch (priority) {
    case 4:
      return '#ffcccc'; // Light red
    case 3:
      return '#ffebcc'; // Light orange
    case 2:
      return '#cce5ff'; // Light blue
    default:
      return 'transparent';
  }
}

// Toggle Complete Task
function toggleCompleteTask(task) {
  task.completed = !task.completed;
  renderTaskList();
  saveTasks();
}

// Delete Task
function deleteTask(task) {
  const index = tasks.indexOf(task);
  if (index !== -1) {
    tasks.splice(index, 1);
    renderTaskList();
    saveTasks();
  }
}

// Toggle Show Completed Tasks
toggleCompleted.addEventListener('change', () => {
  renderTaskList();
});

// Format Duration
function formatDuration(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  let formatted = '';
  if (h > 0) formatted += `${h}h `;
  if (m > 0) formatted += `${m}m `;
  if (s > 0 && h === 0) formatted += `${s}s`;
  return formatted.trim();
}

// Start Timer
startBtn.addEventListener('click', startTask);

// Start Task
function startTask() {
  updateFilteredTasks();
  if (filteredTasks.length > 0) {
    const task = filteredTasks[0];
    remainingTime = task.duration;
    openFloatingTimer(task.name, remainingTime);
  } else {
    showToast('No uncompleted tasks to start.');
  }
}

// Open Floating Timer using Document PiP API
async function openFloatingTimer(taskName, duration) {
  if ('documentPictureInPicture' in window) {
    try {
      // Request PiP Window
      const pipWindow = await window.documentPictureInPicture.requestWindow({
        width: 300,
        height: 150,
        disallowReturnToOpener: false,
        preferInitialWindowPlacement: true
      });

      // Create Timer Content in PiP Window
      const pipDocument = pipWindow.document;
      const template = document.getElementById('pip-template').content.cloneNode(true);
      pipDocument.body.appendChild(template);

      const taskNameEl = pipDocument.getElementById('pip-task-name');
      const timerDisplay = pipDocument.getElementById('pip-timer-display');
      const pauseBtn = pipDocument.getElementById('pip-pause-btn');
      const completeBtn = pipDocument.getElementById('pip-complete-btn');

      taskNameEl.textContent = taskName;
      timerDisplay.textContent = formatTimer(duration);

      let remainingTime = duration;
      let paused = false;
      // Timer Logic
      let timerInterval = setInterval(() => {
        if (!paused) {
          remainingTime--;
          timerDisplay.textContent = formatTimer(remainingTime);
          if (remainingTime <= 0) {
            clearInterval(timerInterval);
            completeTask();
          }
        }
      }, 1000);

      // Pause/Resume Button
      pauseBtn.addEventListener('click', () => {
        paused = !paused;
        pauseBtn.textContent = paused ? '▶️' : '⏸️';
        if (paused) {
          pipDocument.body.classList.add('paused');
        } else {
          pipDocument.body.classList.remove('paused');
        }
      });

      completeBtn.addEventListener('click', () => {
        clearInterval(timerInterval);
        completeTask();
      });

      // Handle PiP Window Close
      pipWindow.addEventListener('pagehide', () => {
        clearInterval(timerInterval);
      });
    } catch (error) {
      console.error('Error opening PiP window:', error);
      alert('Failed to open PiP window.');
    }
  } else {
    // Fallback: Open a separate movable window
    alert('Document Picture-in-Picture API is not supported in this browser.');
  }
}

// Complete Task
function completeTask() {
  updateFilteredTasks();
  if (filteredTasks.length > 0) {
    const task = filteredTasks[0];
    task.completed = true; // Mark the task as completed
    saveTasks();
    renderTaskList();
    showToast(`Task completed: ${task.name}`);
    startTask(); // Start the next uncompleted task
  } else {
    console.error('No uncompleted tasks to complete.');
  }
}

// Format Timer Display
function formatTimer(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) {
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  } else {
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }
}

// Make Element Draggable within PiP Window
function makeDraggable(element, handle) {
  let posX = 0, posY = 0, mouseX = 0, mouseY = 0;
  handle.addEventListener('mousedown', dragMouseDown);

  function dragMouseDown(e) {
    e.preventDefault();
    mouseX = e.clientX;
    mouseY = e.clientY;
    document.addEventListener('mouseup', closeDragElement);
    document.addEventListener('mousemove', elementDrag);
  }

  function elementDrag(e) {
    e.preventDefault();
    posX = mouseX - e.clientX;
    posY = mouseY - e.clientY;
    mouseX = e.clientX;
    mouseY = e.clientY;
    element.parentElement.style.top = (element.parentElement.offsetTop - posY) + "px";
    element.parentElement.style.left = (element.parentElement.offsetLeft - posX) + "px";
  }

  function closeDragElement() {
    document.removeEventListener('mouseup', closeDragElement);
    document.removeEventListener('mousemove', elementDrag);
  }
}


// Save Filter Button Click Event
saveFilterBtn.addEventListener('click', () => {
  const filter = filterInput.value.trim();
  if (filter) {
    const filterName = prompt(`Enter a name for this filter: ${filter}`);
    if (filterName) {
      saveFilter(filterName, filter);
      loadSavedFilters();
    }
  } else {
    alert('Please enter a filter to save.');
  }
});

// Save Filter to LocalStorage
function saveFilter(name, filter) {
  const savedFilters = JSON.parse(localStorage.getItem('savedFilters')) || {};
  savedFilters[name] = filter;
  localStorage.setItem('savedFilters', JSON.stringify(savedFilters));
}

// Load Saved Filters from LocalStorage
function loadSavedFilters() {
  const savedFilters = JSON.parse(localStorage.getItem('savedFilters')) || {};
  savedFiltersDropdown.innerHTML = '<option value="">Select a saved filter</option>';
  for (const [name, filter] of Object.entries(savedFilters)) {
    const option = document.createElement('option');
    option.value = filter;
    option.textContent = name;
    savedFiltersDropdown.appendChild(option);
  }
}

// Apply Selected Filter from Dropdown
savedFiltersDropdown.addEventListener('change', () => {
  filterInput.value = savedFiltersDropdown.value;
  fetchTodoistTasks();
});

// Fetch Todoist Tasks Due Today
refreshIcon.addEventListener('click', fetchTodoistTasks);

filterInput.addEventListener('change', () => {
  const filters = filterInput.value.split(',').map(filter => filter.trim()).filter(filter => filter);
  localStorage.setItem('todoistFilters', JSON.stringify(filters));
});

async function fetchTodoistTasks() {
  if (!todoistToken) return;
  refreshIcon.classList.add('rotating'); // Start rotating
  const toast = showToast('Refreshing tasks...');
  const filters = filterInput.value.split(',').map(filter => filter.trim()).filter(filter => filter);
  // default to today
  if (filters.length === 0) {
    filters.push('today');
  }

  console.log('Fetching Todoist tasks:', filters);
  let allTasks = [];

  try {
    if (filters.length === 0) {
      // No filters provided, fetch all tasks
      const response = await fetch(`https://api.todoist.com/rest/v2/tasks`, {
        headers: {
          'Authorization': `Bearer ${todoistToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch Todoist tasks.');
      }

      allTasks = await response.json();
    } else {
      // Fetch tasks for each filter
      for (const filter of filters) {
        const response = await fetch(`https://api.todoist.com/rest/v2/tasks?filter=${encodeURIComponent(filter)}`, {
          headers: {
            'Authorization': `Bearer ${todoistToken}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch Todoist tasks.');
        }

        const data = await response.json();
        allTasks = allTasks.concat(data);
      }
    }

    // Remove tasks that are from Todoist
    tasks = tasks.filter(task => !task.fromTodoist);

    // Assign a default duration of 10 minutes (600 seconds) or parse if possible
    allTasks.forEach((todoist_task, index) => {
      let taskDuration; // Default duration
      let isDefaultDuration;
      if (todoist_task.duration) {
        isDefaultDuration = false;
        if (todoist_task.duration.unit === 'minute') {
          taskDuration = todoist_task.duration.amount * 60;
        } else if (todoist_task.duration.unit === 'day') {
          taskDuration = todoist_task.duration.amount * 86400;
        }
      } else {
        taskDuration = 600; // Default duration
        isDefaultDuration = true;
      }

      tasks.push({
        name: todoist_task.content,
        duration: taskDuration,
        originalDuration: taskDuration,
        isDefaultDuration: isDefaultDuration,
        completed: todoist_task.is_completed,
        fromTodoist: true,
        priority: todoist_task.priority,
        due_datetime: todoist_task.due.datetime || null,
        due_timezone: todoist_task.due.timezone || null,
        filter_index: index // Save the index for sorting
      });
    });

    // Sort tasks by the selected sorting option
    sortTasks();
    renderTaskList();
    saveTasks();
    todoistStatus.textContent = `✅ Fetched ${allTasks.length} task(s) from Todoist`;
    showToast(`✅ Fetched ${allTasks.length} task(s) from Todoist`);
    todoistStatus.style.color = '#4caf50';
  } catch (error) {
    console.error('Error fetching Todoist tasks:', error);
    todoistStatus.textContent = '❌ Failed to fetch tasks';
    todoistStatus.style.color = '#f44336';
    showToast('Failed to fetch tasks');
  } finally {
    refreshIcon.classList.remove('rotating'); // Stop rotating
    toast.remove(); // Remove the refreshing toast
  }
}


sortTasksSelect.addEventListener('change', () => {
  sortTasks();
  renderTaskList();
});

function sortTasks() {
  const sortOption = sortTasksSelect.value;
  if (sortOption === 'priority') {
    tasks.sort((a, b) => {
      if (b.priority === a.priority) {
        if (!a.due_datetime && !b.due_datetime) return 0;
        if (!a.due_datetime) return 1;
        if (!b.due_datetime) return -1;
        return new Date(a.due_datetime) - new Date(b.due_datetime);
      }
      return b.priority - a.priority;
    });
  } else if (sortOption === 'due-time') {
    tasks.sort((a, b) => {
      if (!a.due_datetime && !b.due_datetime) return 0;
      if (!a.due_datetime) return 1;
      if (!b.due_datetime) return -1;
      const dateA = new Date(a.due_datetime);
      const dateB = new Date(b.due_datetime);
      if (dateA.getTime() === dateB.getTime()) {
        return b.priority - a.priority;
      }
      return dateA - dateB;
    });
  } else if (sortOption === 'filter-order') {
    tasks.sort((a, b) => a.filter_index - b.filter_index);
  }
}

filterPrioritySelect.addEventListener('change', () => {
  renderTaskList();
});


function showToast(message) {
  const toastContainer = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  toastContainer.appendChild(toast);

  // Show the toast
  setTimeout(() => {
    toast.classList.add('show');
  }, 100);

  // Remove the toast after 3 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
    }, 500);
  }, 3000);
  return toast;
}
const taskForm = document.getElementById('task-form');
const taskTitle = document.getElementById('task-title');
const priority = document.getElementById('priority');
const deadline = document.getElementById('deadline');
const taskList = document.getElementById('task-list');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
    taskList.innerHTML = '';
    const sortedTasks = tasks
        .sort((a, b) => {
            if (a.completed !== b.completed) return a.completed - b.completed;
            const priorities = {
                High: 1,
                Medium: 2,
                Low: 3
            };
            return priorities[a.priority] - priorities[b.priority] || new Date(a.deadline) - new Date(b.deadline);
        });

    sortedTasks.forEach((task, index) => {
        const taskDiv = document.createElement('div');
        taskDiv.className = 'task' + (task.completed ? ' completed' : '');

        taskDiv.innerHTML = `
      <div class="task-top">
        <span class="task-title">${task.title}</span>
        <div class="task-controls">
          <button class="complete-btn">${task.completed ? 'Undo' : 'Complete'}</button>
          <button class="edit-btn">Edit</button>
          <button class="delete-btn">Delete</button>
        </div>
      </div>
      <div class="task-meta">
        Priority: <strong>${task.priority}</strong> | Deadline: ${task.deadline}
      </div>
    `;

        const [completeBtn, editBtn, deleteBtn] = taskDiv.querySelectorAll('button');

        completeBtn.addEventListener('click', () => {
            task.completed = !task.completed;
            saveTasks();
            renderTasks();
        });

        editBtn.addEventListener('click', () => {
            const newTitle = prompt('Edit task title:', task.title);
            const newDeadline = prompt('Edit deadline (YYYY-MM-DD):', task.deadline);
            const newPriority = prompt('Edit priority (Low, Medium, High):', task.priority);

            if (newTitle && newDeadline && ['Low', 'Medium', 'High'].includes(newPriority)) {
                task.title = newTitle;
                task.deadline = newDeadline;
                task.priority = newPriority;
                saveTasks();
                renderTasks();
            }
        });

        deleteBtn.addEventListener('click', () => {
            tasks.splice(index, 1);
            saveTasks();
            renderTasks();
        });

        taskList.appendChild(taskDiv);
    });
}

taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newTask = {
        title: taskTitle.value,
        priority: priority.value,
        deadline: deadline.value,
        completed: false,
    };
    tasks.push(newTask);
    saveTasks();
    renderTasks();
    taskForm.reset();
});

renderTasks();
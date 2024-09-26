/*https://github.com/zouraiz523*/
const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const resetBtn = document.getElementById("reset-btn");
const themeToggle = document.getElementById("theme-toggle");

const defaultTasks = [
	{
		id: 1,
		text: "Create a Pen",
		completed: false,
		progress: 0,
		dueDate: "2024-09-30"
	},
	{
		id: 2,
		text: "Go for a walk",
		completed: false,
		progress: 10,
		dueDate: "2024-12-31"
	}
];

let tasks = [...defaultTasks];
let nextId = 3;
/*https://github.com/zouraiz523*/

function saveTasks() {
	localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
	taskList.innerHTML = "";
	tasks.forEach((task) => {
		const li = document.createElement("li");
		li.className = `task-item${task.completed ? " completed" : ""}`;
		li.dataset.id = task.id;
		li.innerHTML = `
          <div class="task-header">
            <span class="drag-handle">☰</span>
            <span class="task-title">${task.text}</span>
            <div class="task-actions">
              <button class="delete-btn"><i class="fa-solid fa-eraser"></i></button>
            </div>
          </div>
          <div class="task-content">
            <div class="task-row">
              <span class="task-label">Progress:</span>
              <div class="progress-container">
                <progress value="${task.progress}" max="100"></progress>
                <span class="progress-value">${task.progress}%</span>
              </div>
            </div>
            <div class="task-row due-date-row">
              <input type="checkbox" ${task.completed ? "checked" : ""}>
              <span class="task-label">Due Date:</span>
              <input type="date" value="${task.dueDate || ""}">
            </div>
          </div>
        `;
/*https://github.com/zouraiz523*/

		const checkbox = li.querySelector('.due-date-row input[type="checkbox"]');
		checkbox.addEventListener("change", () => {
			task.completed = checkbox.checked;
			li.classList.toggle("completed", task.completed);
			saveTasks();
		});

		const dateInput = li.querySelector('input[type="date"]');
		dateInput.addEventListener("change", () => {
			task.dueDate = dateInput.value;
			saveTasks();
		});

		const progressBar = li.querySelector("progress");
		const progressValue = li.querySelector(".progress-value");
		progressBar.addEventListener("click", (e) => {
			const rect = progressBar.getBoundingClientRect();
			const clickPosition = e.clientX - rect.left;
			const progressPercentage = (clickPosition / rect.width) * 100;
			task.progress = Math.round(progressPercentage);
			progressBar.value = task.progress;
			progressValue.textContent = `${task.progress}%`;
			saveTasks();
		});

		const deleteBtn = li.querySelector(".delete-btn");
		deleteBtn.addEventListener("click", () => {
			tasks = tasks.filter((t) => t.id !== task.id);
			renderTasks();
			saveTasks();
		});

		taskList.appendChild(li);
	});
    /*https://github.com/zouraiz523*/
	// Initialize drag and drop functionality
	new Sortable(taskList, {
		animation: 150,
		handle: ".drag-handle",
		onEnd: function (evt) {
			const itemEl = evt.item;
			const newIndex = evt.newIndex;
			const oldIndex = evt.oldIndex;
            /*https://github.com/zouraiz523*/
			// Update the tasks array
			const [movedTask] = tasks.splice(oldIndex, 1);
			tasks.splice(newIndex, 0, movedTask);

			saveTasks();
		}
	});
}
/*https://github.com/zouraiz523*/
function resetTasks() {
	tasks = [...defaultTasks];
	saveTasks();
	renderTasks();
}

taskForm.addEventListener("submit", (e) => {
	e.preventDefault();
	const taskText = taskInput.value.trim();
	if (taskText) {
		tasks.push({
			id: nextId++,
			text: taskText,
			completed: false,
			progress: 0,
			dueDate: ""
		});
		taskInput.value = "";
		renderTasks();
		saveTasks();
	}
});

resetBtn.addEventListener("click", resetTasks);

// Load tasks from localStorage if available
const savedTasks = localStorage.getItem("tasks");
if (savedTasks) {
	tasks = JSON.parse(savedTasks);
	nextId = Math.max(...tasks.map((t) => t.id)) + 1;
}

renderTasks();

// Update time in status bar
function updateTime() {
	const now = new Date();
	const timeString = now.toLocaleTimeString("en-US", {
		hour: "numeric",
		minute: "2-digit",
		hour12: true
	});
	document.querySelector(".time").textContent = timeString;
}
updateTime();
setInterval(updateTime, 1000);

// Theme toggle functionality
themeToggle.addEventListener("click", () => {
	document.body.classList.toggle("light-mode");
	document.body.classList.toggle("dark-mode");
	themeToggle.innerHTML = document.body.classList.contains("light-mode")
		? '<i class="fa-regular fa-sun"></i>'
		: '<i class="fa-regular fa-moon"></i>';
});
/*https://github.com/zouraiz523*/

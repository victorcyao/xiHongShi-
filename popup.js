document.addEventListener("DOMContentLoaded", function() {
    let timer;
    let timeLeft = 1500; // Default 25 minutes
    let isRunning = false;
    let isFocusMode = true;
    let focusDuration = 1500;
    let breakDuration = 300;
    let totalWorkTime = 0;
    
    const timerDisplay = document.getElementById("timer-display");
    const progressBarContainer = document.querySelector(".progress-bar-container");
    const progressBar = document.getElementById("progress");
    const plantContainer = document.getElementById("plant-container");
    const plant = document.getElementById("plant");
    const startStopButton = document.getElementById("start-stop");
    const resetButton = document.getElementById("reset");
    const switchModeButton = document.getElementById("switch-mode");
    const taskList = document.getElementById("task-list");
    const newTaskInput = document.getElementById("new-task");
    const addTaskButton = document.getElementById("add-task");
    const tabButtons = document.querySelectorAll(".tab-button");
    const tabContents = document.querySelectorAll(".tab-content");
    const modeLabel = document.getElementById("mode-label");
    const focusInput = document.getElementById("focus-duration");
    const breakInput = document.getElementById("break-duration");
    
    function updateDisplay() {
        let minutes = Math.floor(timeLeft / 60);
        let seconds = timeLeft % 60;
        timerDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        progressBar.style.width = `${((focusDuration - timeLeft) / focusDuration) * 100}%`;
        modeLabel.textContent = isFocusMode ? "Focus Mode" : "Break Mode";
        updatePlantGrowth();
    }
    
    function updatePlantGrowth() {
        let interval = focusDuration / 5;
        if (timeLeft <= interval) {
            plant.src = chrome.runtime.getURL("images/fullgrown.png");
        } else if (timeLeft <= interval * 2) {
            plant.src = chrome.runtime.getURL("images/stage4.png");
        } else if (timeLeft <= interval * 3) {
            plant.src = chrome.runtime.getURL("images/stage3.png");
        } else if (timeLeft <= interval * 4) {
            plant.src = chrome.runtime.getURL("images/stage2.png");
        } else {
            plant.src = chrome.runtime.getURL("images/seedling.png");
        }
    }
    
    function startTimer() {
        if (!isRunning) {
            timer = setInterval(() => {
                if (timeLeft > 0) {
                    timeLeft--;
                    updateDisplay();
                } else {
                    clearInterval(timer);
                    isRunning = false;
                    startStopButton.textContent = "Start";
                }
            }, 1000);
            isRunning = true;
            startStopButton.textContent = "Pause";
        } else {
            clearInterval(timer);
            isRunning = false;
            startStopButton.textContent = "Start";
        }
    }
    
    function resetTimer() {
        clearInterval(timer);
        isRunning = false;
        timeLeft = isFocusMode ? focusDuration : breakDuration;
        updateDisplay();
        startStopButton.textContent = "Start";
    }
    
    function switchMode() {
        isFocusMode = !isFocusMode;
        document.body.style.backgroundColor = isFocusMode ? "#2e8b57" : "#a52a2a";
        resetTimer();
    }
    
    function addTask() {
        const taskText = newTaskInput.value.trim();
        if (taskText) {
            const taskItem = document.createElement("li");
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            const removeButton = document.createElement("button");
            removeButton.textContent = "Remove";
            removeButton.onclick = function() {
                taskList.removeChild(taskItem);
            };
            taskItem.appendChild(checkbox);
            taskItem.appendChild(document.createTextNode(taskText));
            taskItem.appendChild(removeButton);
            taskList.appendChild(taskItem);
            newTaskInput.value = "";
        }
    }
    
    function updateDurations() {
        focusDuration = parseInt(focusInput.value) * 60;
        breakDuration = parseInt(breakInput.value) * 60;
        resetTimer();
    }
    
    tabButtons.forEach(button => button.addEventListener("click", function(event) {
        tabContents.forEach(tab => tab.style.display = "none");
        document.getElementById(event.target.getAttribute("data-tab")).style.display = "block";
    }));
    
    startStopButton.addEventListener("click", startTimer);
    resetButton.addEventListener("click", resetTimer);
    switchModeButton.addEventListener("click", switchMode);
    addTaskButton.addEventListener("click", addTask);
    focusInput.addEventListener("change", updateDurations);
    breakInput.addEventListener("change", updateDurations);
    
    // Move the plant image above the progress bar
    let timerContainer = document.getElementById("timer");
    timerContainer.insertBefore(plantContainer, progressBarContainer);
    
    updateDisplay();
});

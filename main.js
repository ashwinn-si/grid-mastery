// Grid creation
for (let i = 0; i < 49; i++) {
    const gridItem = document.createElement('div');
    gridItem.classList.add('grid-item');
    gridItem.onclick = function() { askQuestion(gridItem, i); };
    document.querySelector('.grid-container').appendChild(gridItem);
}

let currentBlock;
let currentIndex;
let timerStarted = false;
let timerInterval;
let solvedBlocks = 0; // Track how many blocks have been solved

// Retrieve remaining time from localStorage or set it to 30 minutes (1800 seconds)
let timeRemaining = localStorage.getItem('timeRemaining') !== null 
    ? parseInt(localStorage.getItem('timeRemaining')) 
    : 30 * 60; // 30 minutes in seconds

if (isNaN(timeRemaining)) {
    timeRemaining = 30 * 60; // Reset to 30 minutes if invalid value is retrieved
}

function askQuestion(block, index) {
    currentBlock = block;
    currentIndex = index;
    const question = questions[index]?.question || "No question defined for this block.";
    document.getElementById('questionText').innerText = question;
    document.getElementById('answerInput').value = ''; // Clear input
    showModal();
}

function showModal() {
    if (!timerStarted) {
        startTimer();
        timerStarted = true;
    }
    document.getElementById('questionModal').style.display = 'flex';
}

function hideModal() {
    document.getElementById('questionModal').style.display = 'none';
}

function submitAnswer() {
    const userInput = document.getElementById('answerInput').value;
    const modal = document.getElementById('questionModal');

    if (userInput === questions[currentIndex]?.answer) {
        revealImage(currentBlock);
        solvedBlocks++; // Increment solved blocks count
        hideModal();
    } else {
        modal.classList.add('vibrate');
        setTimeout(() => {
            modal.classList.remove('vibrate');
            hideModal();
        }, 1000);
    }
}

function startTimer() {
    timerInterval = setInterval(updateTimer, 1000); // Update every second
}

function updateTimer() {
    if (timeRemaining <= 0) {
        clearInterval(timerInterval); // Stop the timer when time runs out
        showScore(); // Show score when timer ends
        localStorage.removeItem('timeRemaining');
        return;
    }

    timeRemaining--; // Decrease the remaining time

    // Save the updated timeRemaining in localStorage
    localStorage.setItem('timeRemaining', timeRemaining);

    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    document.getElementById('timer').innerText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function revealImage(block) {
    block.classList.add('revealed');
}

function showScore() {
    document.getElementById('scoreDisplay').innerText = solvedBlocks;
    document.getElementById('scoreModal').style.display = 'flex';
}

function restartGame() {
    clearInterval(timerInterval); // Stop the current timer
    localStorage.removeItem('timeRemaining');
    timeRemaining = 30 * 60; // Reset timer to 30 minutes
    solvedBlocks = 0; // Reset solved blocks count
    document.getElementById('timer').innerText = '30:00'; // Reset the timer display
    document.getElementById('scoreModal').style.display = 'none'; // Hide the score modal
    timerStarted = false; // Allow the timer to restart
    // Optionally reset the grid and other game state
}

// Function to reset the timer manually
function resetTimer() {
    clearInterval(timerInterval); // Stop the current timer
    timeRemaining = 30 * 60; // Reset timer to 30 minutes
    localStorage.setItem('timeRemaining', timeRemaining); // Update localStorage
    document.getElementById('timer').innerText = '30:00'; // Update the UI
    startTimer(); // Restart the timer
    timerStarted = true; // Mark the timer as started
}

window.onclick = function(event) {
    const modal = document.getElementById('questionModal');
    if (event.target === modal) {
        hideModal();
    }
};

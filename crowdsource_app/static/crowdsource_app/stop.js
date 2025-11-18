
const timerDisplay = document.getElementById('timerDisplay');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const resetBtn = document.getElementById('resetBtn');
const runningControls = document.getElementById('runningControls');

// Modal elements
const beginWaitBtn = document.getElementById('beginWaitBtn');
const routeSelect = document.getElementById('routeSelect');
const routeError = document.getElementById('routeError');
const routeModal = new bootstrap.Modal(document.getElementById('routeModal')); // Get Bootstrap modal instance

// These variables will manage the timer's state.
let timerInterval = null; // Holds the "setInterval" ID so we can stop it
let startTime = 0;        // Stores the exact millisecond timestamp when the timer starts
let selectedRoute = null; // Stores the route the user picks
let waitLogInformation = null

// --- 3. Attach Event Listeners ---
beginWaitBtn.addEventListener('click', handleBeginWait);
stopBtn.addEventListener('click', stopTimer);
resetBtn.addEventListener('click', resetTimer);

function setWaitLogInformation(data) {
    waitLogInformation = data;
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

const CSRF_TOKEN= getCookie('csrftoken');


/**
 * Called when the user clicks "Begin Wait" in the modal.
 * Validates the route, saves it, closes the modal, and starts the timer.
 */
function handleBeginWait() {
    selectedRoute = routeSelect.value;
    
    if (!selectedRoute) {
        // Show an error if they didn't pick a route
        routeError.style.display = 'block';
        return;
    }

    // Hide error, hide modal, and start the timer
    routeError.style.display = 'none';
    routeModal.hide();
    startTimer();
}

/**
 * Starts the stopwatch.
 */
function startTimer() {
    startTime = Date.now(); // Record the exact start time in milliseconds
    
    // This is the "ticker". It calls the `updateDisplay` function once per second.
    timerInterval = setInterval(updateDisplay, 1000);
    
    // Swap the buttons
    startBtn.style.display = 'none';
    runningControls.style.display = 'block';
}

/**
 * This function is called every second by setInterval.
 * It calculates the elapsed time and updates the 00:00:00 display.
 */
function updateDisplay() {
    const elapsedTime = Date.now() - startTime; // Time difference in milliseconds
    timerDisplay.textContent = formatTime(elapsedTime);
}

/**
 * Stops the stopwatch and prepares data for your DRF endpoint.
 */
function stopTimer() {
    clearInterval(timerInterval); // Stop the "ticker"
    const endTime = Date.now(); // Record the exact end time

    // Server URL
    
    // --- YOUR DRF AJAX CALL GOES HERE ---
    // You have all the data you need right here.
    
    console.log("--- Sending data to DRF endpoint ---");
    console.log("Selected Route:", selectedRoute);
    console.log("Start Time (ms):", startTime);
    console.log("End Time (ms):", endTime);
    console.log("Total Wait (ms):", endTime - startTime);
    
    // Example of the data object you will send in your fetch() call:
    const waitLogData = {
        bus_stop: bus_stop_id, // You'll get this from your Django template
        route: selectedRoute,
        start_time: new Date(startTime).toISOString(), // Send as standard ISO string
        end_time: new Date(endTime).toISOString()
    };
    
    console.log("Data to send:", JSON.stringify(waitLogData));

    const API_URL = "http://127.0.0.1:8000/api/waitlogs/" + waitLogData.bus_stop + "/";

    postApi(API_URL,waitLogData)
        .then(data => {
            console.log(data);
            waitLogInformation = data
        })
        .catch(error => {
            console.error(error);
        });

    
    

    // After your AJAX call is successful, you can reset the timer
    resetTimer();
}

async function getApi(url) {
    const response = await fetch(url);
    return response.json();
}

async function postApi(url,data) {


    const response = await fetch(url, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': CSRF_TOKEN
        },
        body: JSON.stringify(data),
        credentials: 'include'
    });

    return response.json();
    
}

/**
 * Resets the timer back to its initial state.
 * Called by the "Reset" button or after a successful "Stop".
 */
function resetTimer() {
    clearInterval(timerInterval); // Stop the ticker
    timerInterval = null;
    startTime = 0;
    selectedRoute = null;
    
    timerDisplay.textContent = '00:00:00'; // Reset display
    startBtn.style.display = 'block';       // Show "Start"
    runningControls.style.display = 'none'; // Hide "Stop" & "Reset"
    routeSelect.value = ""; // Reset the modal dropdown
}

/**
 * A helper function to turn milliseconds into a "00:00:00" string.
 */
function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    // `padStart` adds a leading '0' if the number is less than 10
    const pad = (num) => String(num).padStart(2, '0');

    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}
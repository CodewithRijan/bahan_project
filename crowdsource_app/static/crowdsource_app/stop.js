
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

function getWaitLogInformation() {

    const URL = "http://127.0.0.1:8000/api/waitlogs/" + bus_stop_id + "/"

    getApi(URL)
        .then(data => {
            console.log(data);
            populateLogs(data);
        })
        .catch(error => {
            console.error(error);
        });
}


// Function to format wait_duration from seconds to mm:ss
function formatDuration(seconds) {
  if (!seconds) return 'N/A';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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
    clearInterval(timerInterval); 
    const endTime = Date.now(); 

    alert("Thanks for contributing! Wait log saved.");
    
    
    console.log("--- Sending data to DRF endpoint ---");
    console.log("Selected Route:", selectedRoute);
    console.log("Start Time (ms):", startTime);
    console.log("End Time (ms):", endTime);
    console.log("Total Wait (ms):", endTime - startTime);
    
    const waitLogData = {
        bus_stop: bus_stop_id, 
        route: selectedRoute,
        start_time: new Date(startTime).toISOString(), 
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

// Render rating stars based on the numeric average shown in the DOM.
function renderRatingStars() {
    // Locate the container that holds the average rating and the stars
    const ratingContainer = document.querySelector('.text-end .text-warning');
    if (!ratingContainer) return;

    // The numeric rating is shown in the first span inside this container
    const scoreSpan = ratingContainer.querySelector('span');
    if (!scoreSpan) return;

    const raw = scoreSpan.textContent.trim();
    const avg = parseFloat(raw);
    if (Number.isNaN(avg)) return; // nothing to do

    // Compute full, half and empty stars (support halves)
    const maxStars = 5;
    const fullStars = Math.floor(avg);
    const fraction = avg - fullStars;
    let halfStars = 0;
    if (fraction >= 0.75) {
        // round up to full star
        halfStars = 0;
    } else if (fraction >= 0.25) {
        halfStars = 1;
    }
    const displayedFull = fullStars + (fraction >= 0.75 ? 1 : 0);
    const emptyStars = maxStars - displayedFull - halfStars;

    // Build star HTML
    let starsHtml = '';
    for (let i = 0; i < displayedFull; i++) {
        starsHtml += '<i class="fas fa-star"></i>';
    }
    if (halfStars === 1) {
        // Use FontAwesome half star icon; adjust if your FA version differs
        starsHtml += '<i class="fas fa-star-half-alt"></i>';
    }
    for (let i = 0; i < emptyStars; i++) {
        starsHtml += '<i class="far fa-star"></i>';
    }

    // Keep the numeric score visible and replace the star icons
    // Build new innerHTML: numeric score (span) + stars
    ratingContainer.innerHTML = `${scoreSpan.outerHTML}${starsHtml}`;
}

// Run on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    renderRatingStars();
    getWaitLogInformation();
});


// The Log Card section
// DOM Manipulation: 'data' is the array from your fetch response
function populateLogs(data) {
    // Find the column that holds the feed. We'll append generated log cards here.
    const feedColumn = document.querySelector('.col-lg-8');
    if (!feedColumn) return;

    // Remove any existing sample/static log-card placeholders so we can render fresh
    const existing = feedColumn.querySelectorAll('.log-card');
    existing.forEach(el => el.remove());

    // If there's no data, show a friendly no-results message
    if (!Array.isArray(data) || data.length === 0) {
        const msg = document.createElement('div');
        msg.className = 'text-muted p-3';
        msg.textContent = 'No recent logs at this stop. Be the first to contribute!';
        feedColumn.appendChild(msg);
        return;
    }

    // Helpers
    function timeAgo(iso) {
        if (!iso) return 'just now';
        const then = new Date(iso).getTime();
        if (Number.isNaN(then)) return 'just now';
        const diff = Date.now() - then;
        const sec = Math.floor(diff / 1000);
        if (sec < 60) return `${sec} sec ago`;
        const min = Math.floor(sec / 60);
        if (min < 60) return `${min} min ago`;
        const hr = Math.floor(min / 60);
        if (hr < 24) return `${hr} hr${hr > 1 ? 's' : ''} ago`;
        const days = Math.floor(hr / 24);
        return `${days} day${days > 1 ? 's' : ''} ago`;
    }

    function formatWaitVerbose(seconds) {
        if (!seconds && seconds !== 0) return 'N/A';
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        const parts = [];
        if (mins > 0) parts.push(`${String(mins).padStart(2, '0')} min`);
        parts.push(`${String(secs).padStart(2, '0')} sec`);
        return parts.join(' ');
    }

    function escapeHtml(str) {
        if (typeof str !== 'string') return str;
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    // For each log, build the card markup and append
    data.forEach(log => {
        const card = document.createElement('div');
        card.className = 'log-card route-border-ring';

        // Header row (user info + like button)
        const header = document.createElement('div');
        header.className = 'd-flex justify-content-between align-items-start mb-2';

        const userInfo = document.createElement('div');
        userInfo.className = 'd-flex align-items-center';

        const avatar = document.createElement('div');
        avatar.className = 'user-avatar';
        avatar.textContent = (log.username && log.username.length) ? log.username.charAt(0).toUpperCase() : 'U';

        const usernameSpan = document.createElement('span');
        usernameSpan.className = 'fw-bold text-dark small ms-2';
        usernameSpan.textContent = log.username || 'Anonymous';

        const bullet = document.createElement('span');
        bullet.className = 'mx-2 text-muted';
        bullet.innerHTML = '&bull;';

        const timeSpan = document.createElement('span');
        timeSpan.className = 'time-ago';
        timeSpan.innerHTML = `<i class="far fa-clock me-1"></i>${timeAgo(log.created_at)}`;

        userInfo.appendChild(avatar);
        userInfo.appendChild(usernameSpan);
        userInfo.appendChild(bullet);
        userInfo.appendChild(timeSpan);

        // Build a POST form for likes so it matches the server-side form in the template.
        const likeForm = document.createElement('form');
        likeForm.method = 'post';
        likeForm.action = `/waitlogs/${bus_stop_id}/likes`;
        likeForm.className = 'd-inline';

        // CSRF token hidden input (uses CSRF_TOKEN parsed from cookie earlier)
        const csrfInput = document.createElement('input');
        csrfInput.type = 'hidden';
        csrfInput.name = 'csrfmiddlewaretoken';
        csrfInput.value = CSRF_TOKEN || '';
        likeForm.appendChild(csrfInput);

        // If the log has an id, include it so the server knows which waitlog to like
        if (log.id) {
            const idInput = document.createElement('input');
            idInput.type = 'hidden';
            idInput.name = 'waitlog_id';
            idInput.value = String(log.id);
            likeForm.appendChild(idInput);
        }

        const likeBtn = document.createElement('button');
        likeBtn.type = 'submit';
        likeBtn.className = 'btn btn-sm btn-outline-light text-secondary border-0';
        likeBtn.innerHTML = `<i class="far fa-thumbs-up"></i> ${log.likes || 0}`;

        likeForm.appendChild(likeBtn);

        header.appendChild(userInfo);
        header.appendChild(likeForm);

        // Main message
        const mainMsg = document.createElement('h5');
        mainMsg.className = 'fw-bold text-dark mb-3';
        const routeText = escapeHtml(log.route || 'Unknown');
        mainMsg.innerHTML = `<i class="fas fa-bus-alt text-primary me-2"></i>Bus going <span class="text-primary">${routeText}</span> left <span class="text-dark">${timeAgo(log.created_at)}</span>.`;

        // Footer wait time
        const waitBadge = document.createElement('div');
        waitBadge.className = 'wait-badge';
        waitBadge.innerHTML = `<i class="fas fa-stopwatch me-2 text-secondary"></i>User waited for: ${formatWaitVerbose(log.wait_duration)} `;

        card.appendChild(header);
        card.appendChild(mainMsg);
        card.appendChild(waitBadge);

        feedColumn.appendChild(card);
    });
}

document.addEventListener('DOMContentLoaded', () => {

// --- 1. ELEMENT REFERENCES ---
const minutesInput = document.getElementById('minutesInput');
const hoursInput = document.getElementById('hoursInput');
const resultHours = document.getElementById('resultHours');
const resultMinutes = document.getElementById('resultMinutes');
const themeToggle = document.getElementById('themeToggle');
const copyHoursBtn = document.getElementById('copyHoursBtn');
const copyMinutesBtn = document.getElementById('copyMinutesBtn');

// --- 2. THEME SWITCHER LOGIC ---
const htmlElement = document.documentElement;

// Function to apply the saved or preferred theme
const applyTheme = (theme) => {
    htmlElement.setAttribute('data-bs-theme', theme);
    themeToggle.innerHTML = theme === 'dark' 
        ? '<i class="bi bi-sun-fill"></i>' 
        : '<i class="bi bi-moon-stars-fill"></i>';
    localStorage.setItem('theme', theme);
};

// Check for saved theme in localStorage, or use system preference
const savedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const initialTheme = savedTheme ? savedTheme : (prefersDark ? 'dark' : 'light');
applyTheme(initialTheme);

// Listener for the toggle button
themeToggle.addEventListener('click', () => {
    const newTheme = htmlElement.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
});

// --- 3. CONVERTER LOGIC (TWO-WAY) ---
function updateFromMinutes() {
    const minutes = parseFloat(minutesInput.value);
    if (isNaN(minutes) || minutes < 0) {
        hoursInput.value = '';
        resultHours.textContent = '0.00';
        resultMinutes.textContent = '0';
        return;
    }
    const decimalHours = minutes / 60;
    hoursInput.value = decimalHours.toFixed(2);
    resultHours.textContent = decimalHours.toFixed(2);
    resultMinutes.textContent = Math.round(minutes);
}

function updateFromHours() {
    const hours = parseFloat(hoursInput.value);
    if (isNaN(hours) || hours < 0) {
        minutesInput.value = '';
        resultHours.textContent = '0.00';
        resultMinutes.textContent = '0';
        return;
    }
    const totalMinutes = hours * 60;
    minutesInput.value = Math.round(totalMinutes);
    resultHours.textContent = hours.toFixed(2);
    resultMinutes.textContent = Math.round(totalMinutes);
}

// Add event listeners for real-time updates
minutesInput.addEventListener('input', updateFromMinutes);
hoursInput.addEventListener('input', updateFromHours);

// --- 4. COPY TO CLIPBOARD LOGIC ---
function setupCopyButton(button, sourceElement) {
    button.addEventListener('click', () => {
        navigator.clipboard.writeText(sourceElement.textContent).then(() => {
            const originalIcon = button.innerHTML;
            button.innerHTML = '<i class="bi bi-check"></i>';
            setTimeout(() => {
                button.innerHTML = originalIcon;
            }, 1500); // Revert back after 1.5 seconds
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    });
}

setupCopyButton(copyHoursBtn, resultHours);
setupCopyButton(copyMinutesBtn, resultMinutes);

// --- INITIALIZE ---
// Run once on page load to sync the initial values
updateFromMinutes();
});
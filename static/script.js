// --------------------------------------slideshow and arrows----------------------------------
const images = [
    "/static/images/image1.jpg",
    "/static/images/image2.jpg",
    "/static/images/image3.jpg",
    "/static/images/image4.jpg",
    "/static/images/image5.jpg",
    "/static/images/image6.jpg",
    "/static/images/image7.jpg",
    "/static/images/image8.jpg",
    "/static/images/image9.jpg",
    "/static/images/image10.jpg",
    "/static/images/image11.jpg"
];

let currentIndex = 0;
let timer; // Store the interval ID
let isCooldown = false; // Cooldown flag for arrow functionality

// Function to display the current image
function showImage(index) {
    const slideshowImage = document.getElementById('slideshow-image');
    slideshowImage.src = images[index];
}

// Function to go to the next image
function nextImage() {
    currentIndex = (currentIndex + 1) % images.length;
    showImage(currentIndex);
}

// Function to go to the previous image
function previousImage() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    showImage(currentIndex);
}

// Function to reset the 13-second timer
function resetTimer() {
    clearInterval(timer); // Clear the existing timer
    timer = setInterval(nextImage, 13000); // Restart the timer
}

// Function to handle cooldown logic
function handleArrowClick(action) {
    if (isCooldown) return; // Ignore clicks during cooldown
    isCooldown = true; // Activate cooldown
    action(); // Execute the next or previous image action
    resetTimer(); // Reset the timer
    setTimeout(() => {
        isCooldown = false; // Release cooldown after 1 second
    }, 1000); // 1-second cooldown
}

// Initialize the slideshow
function startSlideshow() {
    showImage(currentIndex); // Show the initial image
    timer = setInterval(nextImage, 13000); // Start the timer
}

// Add event listeners to arrow buttons with cooldown logic
document.querySelector('.arrow.left').addEventListener('click', () => handleArrowClick(previousImage));
document.querySelector('.arrow.right').addEventListener('click', () => handleArrowClick(nextImage));

// Start the slideshow on page load
startSlideshow();

// -------------------------------submitting prayer------------------------------------------------------------------
// Create a loading spinner element (can be styled in CSS)
const loadingSpinner = document.createElement('div');
loadingSpinner.id = 'loading-spinner';
loadingSpinner.innerHTML = `
    <div class="spinner"></div>
`;

// Display a loading indicator when making requests
function showLoading() {
    const responseSection = document.getElementById("response-section");
    responseSection.innerHTML = ""; // Clear any previous responses
    responseSection.appendChild(loadingSpinner);
}

function hideLoading() {
    const responseSection = document.getElementById("response-section");
    const spinner = document.getElementById('loading-spinner');
    if (spinner) {
        responseSection.removeChild(spinner);
    }
}

// Function to display the API response in a styled container
function displayResponse(text) {
    const responseSection = document.getElementById("response-section");
    // Clear any existing content (like loading spinner)
    responseSection.innerHTML = "";

    // Create a container for the response text
    const responseContainer = document.createElement("div");
    responseContainer.className = "response-container";

    // Set the text content and preserve formatting (like new lines)
    responseContainer.textContent = text;

    // Append to the response section
    responseSection.appendChild(responseContainer);
}

document.getElementById("prayer-submit").addEventListener("click", function (e) {
    e.preventDefault(); // Prevent default behavior

    const prayerText = document.getElementById("prayer-input").value.trim();
    if (!prayerText) {
        alert("Please type your prayer before submitting.");
        return;
    }

    const prayer = `Dear Heavenly Father, ${prayerText}`;

    // Show loading indicator before the fetch call
    showLoading();

    fetch('/submit-prayer', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prayer })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        hideLoading();
        if (data.error) {
            alert("Error: " + data.error);
        } else {
            displayResponse(data.response);
        }
    })
    .catch(error => {
        hideLoading();
        console.error('Error:', error);
        alert("An unexpected error occurred. Please try again later.");
    });
});
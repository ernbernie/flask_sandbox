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
document.getElementById("prayer-submit").addEventListener("click", function (e) {
    e.preventDefault(); // Prevent default if it was a form, now just a button so optional

    const prayerText = document.getElementById("prayer-input").value.trim();
    if (!prayerText) {
        alert("Please type your prayer before submitting.");
        return;
    }

    const prayer = `Dear Heavenly Father, ${prayerText}`;

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
        if (data.error) {
            alert("Error: " + data.error);
        } else {
            displayResponse(data.response);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert("An unexpected error occurred. Please try again later.");
    });
});

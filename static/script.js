// ----------------------------------------------------------
// Slideshow and Arrows
// ----------------------------------------------------------
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

// Function to handle cooldown logic for arrows
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

// ----------------------------------------------------------
// Prayer Submission and Response Handling
// ----------------------------------------------------------

// References
const prayerContainer = document.querySelector('.prayer-container');
const prayerSubmit = document.getElementById("prayer-submit");
const heroResponseContainer = document.getElementById('hero-response-container');

// Create a loading spinner element
const loadingSpinner = document.createElement('div');
loadingSpinner.id = 'loading-spinner';
loadingSpinner.innerHTML = `<div class="spinner"></div>`;

// Show loading inside heroResponseContainer
function showLoading() {
    heroResponseContainer.innerHTML = "";
    heroResponseContainer.classList.remove('hidden');
    heroResponseContainer.appendChild(loadingSpinner);
    heroResponseContainer.classList.add('shown');
}

function hideLoading() {
    const spinner = document.getElementById('loading-spinner');
    if (spinner) {
        spinner.remove();
    }
}

// Typewriter effect function
function typeWriterEffect(element, text, speed = 130) {
    let index = 0;
    element.textContent = '';
    element.classList.add('typewriter');

    function type() {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
            setTimeout(type, speed);
        } else {
            // Remove the caret after typing completes
            element.style.borderRight = 'none';
        }
    }
    type();
}

// Fade out the prayer form
function fadeOutPrayerForm() {
    prayerContainer.classList.add('fade-out');
}

// On submit
prayerSubmit.addEventListener("click", function (e) {
    e.preventDefault();

    const prayerText = document.getElementById("prayer-input").value.trim();
    if (!prayerText) {
        alert("Please type your prayer before submitting.");
        return;
    }

    const prayer = `Dear Heavenly Father, ${prayerText}`;

    // Fade out the prayer form
    fadeOutPrayerForm();

    // Wait for the fade-out transition to end
    prayerContainer.addEventListener('transitionend', function onTransitionEnd() {
        prayerContainer.removeEventListener('transitionend', onTransitionEnd);
        
        // Hide the prayer container after fade-out
        prayerContainer.style.display = 'none';

        // Show loading spinner in heroResponseContainer
        showLoading();

        // Fetch the response from the server
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
                // Display the response with a typewriter effect
                heroResponseContainer.innerHTML = ""; // Clear loading
                const responseDiv = document.createElement("div");
                responseDiv.className = "response-container";
                heroResponseContainer.appendChild(responseDiv);

                // Apply typewriter effect to the response
                typeWriterEffect(responseDiv, data.response, 40);
            }
        })
        .catch(error => {
            hideLoading();
            console.error('Error:', error);
            alert("An unexpected error occurred. Please try again later.");
        });
    });
});

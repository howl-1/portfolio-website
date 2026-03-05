document.addEventListener("DOMContentLoaded", function() {

    // =========================

    // Typing Animation

    // =========================

    const nameText = "Hi, I'm Velan K";

    const titles = [

        "BCA Student",

        "Creative Thinker And",

        "Future Software Developer"

    ];

    const nameElement = document.getElementById("nameTyping");

    const titleContainer = document.getElementById("typing");

    let nameIndex = 0;

    function typeName() {

        if (!nameElement) return;

        if (nameIndex < nameText.length) {

            nameElement.textContent += nameText.charAt(nameIndex);

            nameIndex++;

            setTimeout(typeName, 80);

        } else {

            setTimeout(typeTitles, 500);

        }

    }

    function typeTitles() {

        let i = 0;

        function typeSingleTitle() {

            if (i >= titles.length) return;

            let line = document.createElement("div");

            titleContainer.appendChild(line);

            let charIndex = 0;

            let currentText = titles[i];

            function typeChar() {

                if (charIndex < currentText.length) {

                    line.textContent += currentText.charAt(charIndex);

                    charIndex++;

                    setTimeout(typeChar, 80);

                } else {

                    i++;

                    setTimeout(typeSingleTitle, 600);

                }

            }

            typeChar();

        }

        typeSingleTitle();

    }

    typeName();

    // =========================

    // Skill Animation

    // =========================
    const progressBars = document.querySelectorAll(".progress-bar");

    progressBars.forEach(bar => {
        const skillCard = bar.closest(".skill-card");

        skillCard.addEventListener("mouseenter", () => {
            const target = parseInt(bar.getAttribute("data-width"));
            const percentageElement =
                bar.parentElement.previousElementSibling.querySelector(".percentage");

            let count = 0;

            // Reset bar and number
            bar.style.transition = "none"; // temporarily disable transition
            bar.style.width = "0";
            if (percentageElement) percentageElement.textContent = "0%";

            // Force reflow so browser registers the reset
            bar.offsetWidth; // 🔥 this line is the key

            // Re-enable transition
            bar.style.transition = "width 1s ease-in-out";

            // Animate bar to target width
            bar.style.width = target + "%";

            // Animate percentage number
            const updateCount = setInterval(() => {
                if (count >= target) {
                    clearInterval(updateCount);
                } else {
                    count++;
                    if (percentageElement) percentageElement.textContent = count + "%";
                }
            }, 20);
        });
    });

    // ===== Hobbies Toggle =====

    const hobbyHeaders = document.querySelectorAll(".hobby-header");

    hobbyHeaders.forEach(header => {

        header.addEventListener("click", () => {

            const card = header.parentElement;

            card.classList.toggle("active");

        });

    });



    // ===== Reusable Preview Setup Function =====

    function setupPreview({
        previewContainer,
        previewImage,
        items,
        closeBtn,
        nextBtn,
        prevBtn
    }) {

        let currentIndex = 0;

        // Zoom & Drag variables

        let lastScale = 1;

        let zoomLevel = 1;

        const maxZoom = 3;

        const minZoom = 1;

        let currentX = 0;

        let currentY = 0;

        let startX = 0;

        let startY = 0;

        let initialDistance = 0;

        let isDragging = false;

        function getDistance(touches) {

            const [touch1, touch2] = touches;

            const dx = touch2.clientX - touch1.clientX;

            const dy = touch2.clientY - touch1.clientY;

            return Math.hypot(dx, dy);

        }

        function openPreview(index) {

            currentIndex = index;

            previewImage.src = items[currentIndex].src;

            previewContainer.classList.add("active");

            // Reset transform

            lastScale = 1;

            zoomLevel = 1;

            currentX = 0;

            currentY = 0;

            previewImage.style.transform = "translate(0px, 0px) scale(1)";

        }

        function closePreview() {

            previewContainer.classList.remove("active");

        }

        function showNext() {

            currentIndex = (currentIndex + 1) % items.length;

            previewImage.src = items[currentIndex].src;

            resetTransform();

        }

        function showPrev() {

            currentIndex = (currentIndex - 1 + items.length) % items.length;

            previewImage.src = items[currentIndex].src;

            resetTransform();

        }

        function resetTransform() {

            lastScale = 1;

            zoomLevel = 1;

            currentX = 0;

            currentY = 0;

            previewImage.style.transform = "translate(0px, 0px) scale(1)";

        }

        // Open on click

        items.forEach((img, index) => {

            img.addEventListener("click", () => openPreview(index));

        });

        // Close button

        closeBtn.addEventListener("click", closePreview);

        // Next / Prev buttons

        nextBtn.addEventListener("click", showNext);

        prevBtn.addEventListener("click", showPrev);

        // Touch events

        previewImage.addEventListener("touchstart", (e) => {

            if (e.touches.length === 2) {

                initialDistance = getDistance(e.touches);

            } else if (e.touches.length === 1) {

                isDragging = true;

                startX = e.touches[0].clientX - currentX;

                startY = e.touches[0].clientY - currentY;

            }

        });

        previewImage.addEventListener("touchmove", (e) => {

            e.preventDefault();

            if (e.touches.length === 2) {

                const newDistance = getDistance(e.touches);

                let scale = (newDistance / initialDistance) * lastScale;

                scale = Math.max(minZoom, Math.min(maxZoom, scale));

                zoomLevel = scale;

                previewImage.style.transform = `translate(${currentX}px, ${currentY}px) scale(${zoomLevel})`;

            } else if (e.touches.length === 1 && isDragging) {

                currentX = e.touches[0].clientX - startX;

                currentY = e.touches[0].clientY - startY;

                previewImage.style.transform = `translate(${currentX}px, ${currentY}px) scale(${zoomLevel})`;

            }

        });

        previewImage.addEventListener("touchend", (e) => {

            if (e.touches.length < 2) lastScale = zoomLevel;

            if (e.touches.length === 0) isDragging = false;

        });

        // Mouse wheel zoom (desktop)

        previewImage.addEventListener("wheel", (e) => {

            e.preventDefault();

            zoomLevel += e.deltaY < 0 ? 0.2 : -0.2;

            zoomLevel = Math.max(minZoom, Math.min(maxZoom, zoomLevel));

            lastScale = zoomLevel;

            previewImage.style.transform = `translate(${currentX}px, ${currentY}px) scale(${zoomLevel})`;

        });

        // Prevent next/prev buttons from overlapping content

        previewContainer.style.position = "fixed";

        nextBtn.style.position = "absolute";

        prevBtn.style.position = "absolute";

        nextBtn.style.top = "50%";

        prevBtn.style.top = "50%";

        nextBtn.style.right = "20px";

        prevBtn.style.left = "20px";

        nextBtn.style.transform = "translateY(-50%)";

        prevBtn.style.transform = "translateY(-50%)";

        nextBtn.style.background = "rgba(0,0,0,0.3)";

        prevBtn.style.background = "rgba(0,0,0,0.3)";

        nextBtn.style.border = "none";

        prevBtn.style.border = "none";

        nextBtn.style.borderRadius = "50%";

        prevBtn.style.borderRadius = "50%";

    }

    // ===== Setup Drawings Gallery =====

    setupPreview({

        previewContainer: document.getElementById("imagePreview"),

        previewImage: document.getElementById("previewImage"),

        items: document.querySelectorAll(".drawing-track img"),

        closeBtn: document.getElementById("closePreview"),

        nextBtn: document.getElementById("nextBtn"),

        prevBtn: document.getElementById("prevBtn")

    });

    // ===== Setup Certificates Gallery =====

    setupPreview({

        previewContainer: document.getElementById("certificatePreview"),

        previewImage: document.getElementById("certPreviewImage"),

        items: document.querySelectorAll(".certificate-card img"),

        closeBtn: document.getElementById("closeCertPreview"),

        nextBtn: document.getElementById("nextCertBtn"),

        prevBtn: document.getElementById("prevCertBtn")

    });
    
    document.querySelectorAll(".copy-phone").forEach(phone => {
    phone.addEventListener("click", () => {
        const number = phone.getAttribute("data-phone");
        navigator.clipboard.writeText(number)
            .then(() => {
                // Optional: feedback to user
                phone.textContent = " Copied! " + number;
                setTimeout(() => {
                    phone.textContent = " " + number;
                }, 1500);
            })
            .catch(err => console.error("Failed to copy:", err));
    });

});

// ===== Advanced Drawing Slider (Auto + Swipe) =====

const drawingSlider = document.querySelector(".drawing-slider");
const drawingTrack = document.querySelector(".drawing-track");

let isDown = false;
let startX;
let currentTranslate = 0;
let autoScrollSpeed = 0.5; // speed of auto scroll
let animationFrame;

// Duplicate images already exist (good job 👍)

// Auto Scroll Function
function autoScroll() {
    currentTranslate -= autoScrollSpeed;

    // Reset for infinite loop
    if (Math.abs(currentTranslate) >= drawingTrack.scrollWidth / 2) {
        currentTranslate = 0;
    }

    drawingTrack.style.transform = `translateX(${currentTranslate}px)`;
    animationFrame = requestAnimationFrame(autoScroll);
}

// Start auto scroll
autoScroll();

// Pause on hover (desktop)
drawingSlider.addEventListener("mouseenter", () => {
    cancelAnimationFrame(animationFrame);
});

drawingSlider.addEventListener("mouseleave", () => {
    autoScroll();
});

// Touch + Mouse Swipe Support

drawingSlider.addEventListener("mousedown", (e) => {
    isDown = true;
    startX = e.pageX;
    cancelAnimationFrame(animationFrame);
});

drawingSlider.addEventListener("mouseleave", () => {
    isDown = false;
    autoScroll();
});

drawingSlider.addEventListener("mouseup", () => {
    isDown = false;
    autoScroll();
});

drawingSlider.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    const walk = e.pageX - startX;
    currentTranslate += walk;
    startX = e.pageX;
    drawingTrack.style.transform = `translateX(${currentTranslate}px)`;
});

// Mobile Touch Support

drawingSlider.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
    cancelAnimationFrame(animationFrame);
});

drawingSlider.addEventListener("touchmove", (e) => {
    const moveX = e.touches[0].clientX;
    const walk = moveX - startX;
    currentTranslate += walk;
    startX = moveX;
    drawingTrack.style.transform = `translateX(${currentTranslate}px)`;
});

drawingSlider.addEventListener("touchend", () => {
    autoScroll();
});

});
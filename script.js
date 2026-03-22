const urlForm = document.getElementById("urlForm");
const urlInput = document.getElementById("urlInput");
const resultSection = document.getElementById("resultSection");
const mainNav = document.querySelector(".main-nav");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelectorAll(".nav-links a");

if (mainNav && navToggle) {
    navToggle.addEventListener("click", () => {
        const isOpen = mainNav.classList.toggle("nav-open");
        navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.forEach((link) => {
        link.addEventListener("click", () => {
            mainNav.classList.remove("nav-open");
            navToggle.setAttribute("aria-expanded", "false");
        });
    });
}

if (urlForm) {
    urlForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const submittedUrl = urlInput.value.trim();

        console.log("URL submitted for future analysis:", submittedUrl);

        if (!submittedUrl) {
            return;
        }

        resultSection.scrollIntoView({ behavior: "smooth", block: "start" });
    });
}

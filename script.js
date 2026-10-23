
/* =========================================
   ATELIER NOIR — INTERACTIONS
========================================= */

const loader = document.getElementById("loader");
const header = document.getElementById("header");
const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");
const navLinks = document.querySelectorAll(".nav-link");
const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

// 1. LOADING SCREEN

function hideLoader() {
    if (loader) {
        loader.classList.add("loaded");
    }
}

window.addEventListener("load", hideLoader);

// Avoid leaving the page covered if loading takes too long.
setTimeout(hideLoader, 2500);

// 2. STICKY HEADER

function updateHeader() {
    if (header) {
        header.classList.toggle("scrolled", window.scrollY > 40);
    }
}

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

// 3. MOBILE NAVIGATION

function closeMenu() {
    nav.classList.remove("open");
    menuToggle.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    document.body.classList.remove("menu-open");
}

menuToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");

    menuToggle.classList.toggle("open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation" : "Open navigation"
    );

    document.body.classList.toggle("menu-open", isOpen);
});

navLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
});

nav.querySelector(".nav-cta").addEventListener("click", closeMenu);

window.addEventListener("resize", () => {
    if (window.innerWidth > 680) {
        closeMenu();
    }
});

// 4. ACTIVE NAVIGATION LINK

const sections = document.querySelectorAll(
    "main section[id]"
);

if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                navLinks.forEach((link) => {
                    const matches =
                        link.getAttribute("href") ===
                        "#" + entry.target.id;

                    link.classList.toggle("active", matches);
                });
            });
        },
        {
            rootMargin: "-35% 0px -55% 0px"
        }
    );

    sections.forEach((section) => {
        sectionObserver.observe(section);
    });
}

// 5. PROJECT FILTERS

filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const selectedFilter = button.dataset.filter;

        filterButtons.forEach((filterButton) => {
            const isActive = filterButton === button;

            filterButton.classList.toggle("active", isActive);
            filterButton.setAttribute(
                "aria-pressed",
                String(isActive)
            );
        });

        projectCards.forEach((card) => {
            const matches =
                selectedFilter === "all" ||
                card.dataset.category === selectedFilter;

            card.classList.toggle("hidden", !matches);
        });
    });
});

// 6. SCROLL REVEAL ANIMATIONS

const revealElements = document.querySelectorAll(".reveal");

const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;

if ("IntersectionObserver" in window && !reducedMotion) {
    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -35px 0px"
        }
    );

    revealElements.forEach((element) => {
        revealObserver.observe(element);
    });
} else {
    revealElements.forEach((element) => {
        element.classList.add("visible");
    });
}

// 7. CONTACT FORM — FRONTEND DEMO ONLY

contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
    }

    const name = document.getElementById("name").value.trim();

    formStatus.textContent =
        `Thank you, ${name}! Your demo enquiry is ready. ` +
        "This form is not connected to a server, so nothing was sent.";

    contactForm.reset();
});

// 8. AUTOMATIC COPYRIGHT YEAR

document.getElementById("year").textContent =
    new Date().getFullYear();

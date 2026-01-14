// Greeting update code (dynamic greeting based on time)
function updateGreeting() {
	const headerParagraph = document.getElementById("header-greeting");
	if (!headerParagraph) return;

	const baseText = "Aspiring CS Major | Junior @ Centennial High School";
	const hour = new Date().getHours();
	let greeting = "Welcome!";

	if (hour < 12) {
		greeting = "Good morning!";
	} else if (hour < 18) {
		greeting = "Good afternoon!";
	} else {
		greeting = "Good evening!";
	}

	headerParagraph.textContent = `${baseText} | ${greeting}`;
}

// THEME TOGGLE LOGIC

// Helper to get cookie value by name
function getCookie(name) {
	const value = `; ${document.cookie}`;
	const parts = value.split(`; ${name}=`);
	if (parts.length === 2) return parts.pop().split(";").shift();
	return null;
}

// Helper to set cookie
function setCookie(name, value, days = 365) {
	const expires = new Date(
		Date.now() + days * 24 * 60 * 60 * 1000
	).toUTCString();
	document.cookie = `${name}=${value}; expires=${expires}; path=/`;
}

// Apply theme by adding or removing "dark" class on <body>
function applyTheme(theme) {
	if (theme === "dark") {
		document.body.classList.add("dark");
	} else {
		document.body.classList.remove("dark");
	}
}

// Toggle theme when button clicked and save preference
function toggleTheme() {
	const isDark = document.body.classList.contains("dark");
	if (isDark) {
		applyTheme("light");
		setCookie("theme", "light");
	} else {
		applyTheme("dark");
		setCookie("theme", "dark");
	}
}

// Animate skill bars when skills section enters viewport
function animateSkills() {
	const skillsSection = document.querySelector(".skills");
	if (!skillsSection) return;

	const skillLevels = skillsSection.querySelectorAll(".skill-level");
	const rect = skillsSection.getBoundingClientRect();

	if (rect.top < window.innerHeight && rect.bottom >= 0) {
		skillLevels.forEach((bar) => {
			const level = bar.getAttribute("data-level");
			bar.style.width = level + "%";
		});
		// Remove scroll listener after animation
		window.removeEventListener("scroll", animateSkills);
	}
}

// Highlight active nav link based on scroll position
function updateActiveNav() {
	const sections = document.querySelectorAll("main section");
	const navLinks = document.querySelectorAll("#navbar a");
	let current = "";

	sections.forEach((section) => {
		const top = section.offsetTop - 70;
		const bottom = top + section.offsetHeight;
		if (window.scrollY >= top && window.scrollY < bottom) {
			current = section.id || "";
		}
	});

	navLinks.forEach((link) => {
		link.classList.remove("active");
		if (link.getAttribute("href") === `#${current}`) {
			link.classList.add("active");
		}
	});
}

// Smooth scroll for nav links
function smoothScroll(event) {
	if (event.target.tagName !== "A") return;
	const href = event.target.getAttribute("href");
	if (!href || !href.startsWith("#")) return;
	event.preventDefault();

	const target = document.querySelector(href);
	if (target) {
		window.scrollTo({
			top: target.offsetTop - 60,
			behavior: "smooth",
		});
	}
}

// Contact form validation and feedback
function handleContactForm() {
	const form = document.getElementById("contact-form");
	const feedback = document.getElementById("form-feedback");
	if (!form || !feedback) return;

	form.addEventListener("submit", async (e) => {
		e.preventDefault();
		if (!form.checkValidity()) {
			feedback.textContent = "Please fill out all fields correctly.";
			feedback.style.color = "red";
			return;
		}

		const formData = new FormData(form);
		try {
			const response = await fetch(form.action, {
				method: form.method,
				body: formData,
				headers: {
					Accept: "application/json",
				},
			});

			if (response.ok) {
				feedback.textContent =
					"Thanks for your message! I'll get back to you soon.";
				feedback.style.color = "var(--header-bg)";
				form.reset();
			} else {
				feedback.textContent = "Oops! Something went wrong.";
				feedback.style.color = "red";
			}
		} catch (error) {
			feedback.textContent = "Oops! There was a network error.";
			feedback.style.color = "red";
		}
	});
}

// Update theme toggle icon based on mode
function updateThemeIcon() {
	const toggleBtn = document.getElementById("theme-toggle");
	if (!toggleBtn) return;

	if (document.body.classList.contains("dark")) {
		toggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
	} else {
		toggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
	}
}

// Wrap theme toggle to update icon as well
function toggleThemeWithIcon() {
	toggleTheme();
	updateThemeIcon();
}

function toggleModal(show, content = "") {
	const modal = document.getElementById("project-modal");
	const modalText = document.getElementById("modal-text");
	if (show) {
		modal.classList.add("active");
		modalText.innerHTML = content;
	} else {
		modal.classList.remove("active");
	}
}

document.querySelectorAll(".project-card").forEach((card) => {
	card.addEventListener("click", () => {
		const content = card.innerHTML;
		toggleModal(true, content);
	});
});

window.addEventListener("DOMContentLoaded", () => {
	// Greeting update
	updateGreeting();
	setInterval(updateGreeting, 60000);

	// Apply saved theme or default system preference
	const savedTheme = getCookie("theme");
	if (savedTheme === "dark" || savedTheme === "light") {
		applyTheme(savedTheme);
	} else {
		const prefersDark =
			window.matchMedia &&
			window.matchMedia("(prefers-color-scheme: dark)").matches;
		applyTheme(prefersDark ? "dark" : "light");
	}
	updateThemeIcon();

	// Theme toggle button event listener
	const toggleBtn = document.getElementById("theme-toggle");
	if (toggleBtn) {
		toggleBtn.addEventListener("click", toggleThemeWithIcon);
	}

	// Animate skills on load and scroll
	animateSkills();
	window.addEventListener("scroll", animateSkills);

	// Update nav active link on scroll
	updateActiveNav();
	window.addEventListener("scroll", updateActiveNav);

	// Smooth scroll on nav clicks
	const navBar = document.getElementById("navbar");
	if (navBar) {
		navBar.addEventListener("click", smoothScroll);
	}

	// Contact form handler
	handleContactForm();

	if (window.VanillaTilt) {
		VanillaTilt.init(document.querySelectorAll(".tilt"), {
			max: 10,
			speed: 400,
			glare: true,
			"max-glare": 0.3,
		});
	}
});

/* ============================================================
   RANA PRATAP CHERUKURI — Portfolio JS
   Updated 2026
   ============================================================ */

// ── Cookie helpers ──────────────────────────────────────────
function getCookie(name) {
	const value = `; ${document.cookie}`;
	const parts = value.split(`; ${name}=`);
	if (parts.length === 2) return parts.pop().split(";").shift();
	return null;
}

function setCookie(name, value, days = 365) {
	const expires = new Date(Date.now() + days * 864e5).toUTCString();
	document.cookie = `${name}=${value}; expires=${expires}; path=/`;
}

// ── Theme ───────────────────────────────────────────────────
function applyTheme(theme) {
	document.body.classList.toggle("dark", theme === "dark");
	const btn = document.getElementById("theme-toggle");
	if (btn)
		btn.innerHTML =
			theme === "dark"
				? '<i class="fa-solid fa-sun"></i>'
				: '<i class="fa-solid fa-moon"></i>';
}

function toggleTheme() {
	const isDark = document.body.classList.contains("dark");
	const next = isDark ? "light" : "dark";
	applyTheme(next);
	setCookie("theme", next);
}

// ── Custom cursor ───────────────────────────────────────────
function initCursor() {
	const dot = document.querySelector(".cursor-dot");
	const ring = document.querySelector(".cursor-ring");
	if (!dot || !ring) return;

	let mx = 0,
		my = 0,
		rx = 0,
		ry = 0;

	document.addEventListener("mousemove", (e) => {
		mx = e.clientX;
		my = e.clientY;
		dot.style.left = mx + "px";
		dot.style.top = my + "px";
	});

	// Smooth ring follow
	function animateRing() {
		rx += (mx - rx) * 0.12;
		ry += (my - ry) * 0.12;
		ring.style.left = rx + "px";
		ring.style.top = ry + "px";
		requestAnimationFrame(animateRing);
	}
	animateRing();

	// Expand on interactive elements
	document
		.querySelectorAll("a, button, .skill-card, .project-card")
		.forEach((el) => {
			el.addEventListener("mouseenter", () => ring.classList.add("expanded"));
			el.addEventListener("mouseleave", () =>
				ring.classList.remove("expanded"),
			);
		});
}

// ── Navbar: scroll shrink + active links ───────────────────
function initNavbar() {
	const navbar = document.getElementById("navbar");
	if (!navbar) return;

	// Scroll shrink
	window.addEventListener(
		"scroll",
		() => {
			navbar.classList.toggle("scrolled", window.scrollY > 60);
		},
		{ passive: true },
	);

	// Active link highlight
	const sections = document.querySelectorAll("section[id]");
	const navLinks = document.querySelectorAll(".nav-links a, .mobile-menu a");

	function updateActive() {
		let current = "";
		sections.forEach((sec) => {
			if (window.scrollY >= sec.offsetTop - 90) current = sec.id;
		});
		navLinks.forEach((link) => {
			link.classList.toggle(
				"active",
				link.getAttribute("href") === `#${current}`,
			);
		});
	}

	window.addEventListener("scroll", updateActive, { passive: true });
	updateActive();

	// Smooth scroll
	document.querySelectorAll('a[href^="#"]').forEach((link) => {
		link.addEventListener("click", (e) => {
			const target = document.querySelector(link.getAttribute("href"));
			if (!target) return;
			e.preventDefault();
			target.scrollIntoView({ behavior: "smooth", block: "start" });
			// Close mobile menu if open
			document.getElementById("mobile-menu")?.classList.remove("open");
		});
	});
}

// ── Mobile nav toggle ──────────────────────────────────────
function initMobileNav() {
	const btn = document.getElementById("mobile-nav-btn");
	const menu = document.getElementById("mobile-menu");
	if (!btn || !menu) return;

	btn.addEventListener("click", () => {
		const open = menu.classList.toggle("open");
		// Animate hamburger → X
		btn.querySelectorAll("span").forEach((s, i) => {
			s.style.transform = open
				? i === 0
					? "translateY(7px) rotate(45deg)"
					: i === 2
						? "translateY(-7px) rotate(-45deg)"
						: "scaleX(0)"
				: "";
			s.style.opacity = open && i === 1 ? "0" : "";
		});
	});
}

// ── Scroll reveal ──────────────────────────────────────────
function initScrollReveal() {
	const els = document.querySelectorAll(".reveal, .timeline-item");
	if (!els.length) return;

	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					const delay = entry.target.dataset.delay || 0;
					setTimeout(
						() => entry.target.classList.add("visible"),
						Number(delay),
					);
					observer.unobserve(entry.target);
				}
			});
		},
		{ threshold: 0.12 },
	);

	els.forEach((el) => observer.observe(el));
}

// ── Navbar bg on scroll (CSS class) ───────────────────────
// done above in initNavbar

// ── Init ───────────────────────────────────────────────────
window.addEventListener("DOMContentLoaded", () => {
	// Theme
	const saved = getCookie("theme");
	if (saved === "dark" || saved === "light") {
		applyTheme(saved);
	} else {
		applyTheme(
			matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light",
		);
	}

	// Theme button
	document
		.getElementById("theme-toggle")
		?.addEventListener("click", toggleTheme);

	// Features
	initCursor();
	initNavbar();
	initMobileNav();
	initScrollReveal();

	// VanillaTilt (if loaded)
	if (window.VanillaTilt) {
		VanillaTilt.init(document.querySelectorAll(".tilt"), {
			max: 10,
			speed: 400,
			glare: true,
			"max-glare": 0.3,
		});
	}
});

let targetDate = new Date("August 24, 2025 00:00:00");

function updateCountdown() {
	const countdownElement = document.getElementById("countdown-timer");
	const now = new Date();
	const diff = targetDate - now;

	if (diff <= 0) {
		countdownElement.textContent = "The day has arrived!";
		return;
	}

	const days = Math.floor(diff / (1000 * 60 * 60 * 24));
	const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
	const minutes = Math.floor((diff / (1000 * 60)) % 60);
	const seconds = Math.floor((diff / 1000) % 60);

	countdownElement.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

function setDate(dateString, eventName) {
	targetDate = new Date(dateString + " 00:00:00");
	document.getElementById("countdown-title").textContent =
		"Countdown to " + eventName;
	updateCountdown();
}

function addCustomEvent() {
	const eventName = document.getElementById("event-name").value.trim();
	const eventDate = document.getElementById("event-date").value;
	const eventImportance = document.getElementById("event-importance").value;

	if (!eventName || !eventDate) {
		alert("Please enter both event name and date.");
		return;
	}

	const savedEvents = JSON.parse(localStorage.getItem("customEvents")) || [];
	savedEvents.push({
		name: eventName,
		date: eventDate,
		importance: parseInt(eventImportance),
	});
	localStorage.setItem("customEvents", JSON.stringify(savedEvents));

	addEventButton(eventName, eventDate, parseInt(eventImportance));
	document.getElementById("event-name").value = "";
	document.getElementById("event-date").value = "";
	document.getElementById("event-importance").value = "1";
}

function addEventButton(name, date, importance = 1) {
	const container = document.querySelector(".custom-events");
	const wrapper = document.createElement("div");
	wrapper.classList.add("event-item");

	const btn = document.createElement("button");
	btn.classList.add("event-btn");
	btn.innerHTML = `<span class="event-label">${name} (Imp: ${importance})</span><span class="delete-span">✕</span>`;
	btn.addEventListener("click", (e) => {
		if (e.target.classList.contains("delete-span")) {
			deleteEvent(name, date, importance, wrapper);
		} else {
			setDate(date, name);
		}
	});

	wrapper.appendChild(btn);
	container.appendChild(wrapper);
}

function loadCustomEvents() {
	const savedEvents = JSON.parse(localStorage.getItem("customEvents")) || [];
	savedEvents.forEach((event) => {
		addEventButton(event.name, event.date, event.importance || 1);
	});
}

function deleteEvent(name, date, importance, wrapper) {
	let savedEvents = JSON.parse(localStorage.getItem("customEvents")) || [];
	savedEvents = savedEvents.filter(
		(event) =>
			!(
				event.name === name &&
				event.date === date &&
				event.importance === importance
			)
	);
	localStorage.setItem("customEvents", JSON.stringify(savedEvents));
	wrapper.remove();
}

// ---------- INSERTED BLOCK ----------
document.addEventListener("DOMContentLoaded", () => {
	loadCustomEvents();

	// Theme toggle
	const toggleBtn = document.getElementById("theme-toggle");
	toggleBtn.addEventListener("click", () => {
		if (document.body.classList.contains("light-mode")) {
			applyTheme("dark");
			setCookie("theme", "dark", 30);
		} else {
			applyTheme("light");
			setCookie("theme", "light", 30);
		}
	});

	// Modal elements
	const openBtn = document.getElementById("open-add-event");
	const modal = document.getElementById("add-event-modal");
	const closeBtn = document.getElementById("close-modal");
	const saveBtn = document.getElementById("save-event");

	// Open modal on floating + button click
	openBtn.addEventListener("click", () => {
		modal.style.display = "flex";
	});

	// Close modal on close icon click
	closeBtn.addEventListener("click", () => {
		modal.style.display = "none";
	});

	// Close modal if clicking outside content
	window.addEventListener("click", (e) => {
		if (e.target === modal) {
			modal.style.display = "none";
		}
	});

	// Save custom event and close modal
	saveBtn.addEventListener("click", () => {
		addCustomEvent();
		modal.style.display = "none";
	});

	// Sorting logic
	const sortBtn = document.getElementById("apply-sort");
	sortBtn.addEventListener("click", () => {
		const type = document.getElementById("sort-type").value;
		const order = document.getElementById("sort-order").value;

		const defaultEvents = [
			{ name: "Start of School", date: "August 24, 2025", importance: 1 },
			{ name: "New Year 2026", date: "January 1, 2026", importance: 1 },
			{ name: "A-Day", date: "June 27, 2025", importance: 1 },
		];
		let customEvents = JSON.parse(localStorage.getItem("customEvents")) || [];
		let allEvents = [...defaultEvents, ...customEvents];

		allEvents.sort((a, b) => {
			let valA, valB;
			if (type === "name") {
				valA = a.name.toLowerCase();
				valB = b.name.toLowerCase();
			} else if (type === "date") {
				valA = new Date(a.date);
				valB = new Date(b.date);
			} else if (type === "importance") {
				valA = a.importance || 1;
				valB = b.importance || 1;
			}
			if (valA < valB) return order === "asc" ? -1 : 1;
			if (valA > valB) return order === "asc" ? 1 : -1;
			return 0;
		});

		// Clear containers
		const defaultContainer = document.querySelector(".default-events");
		const customContainer = document.querySelector(".custom-events");
		defaultContainer.innerHTML = "";
		customContainer.innerHTML = "";

		// Re-render sorted events into respective containers
		allEvents.forEach((event) => {
			if (
				defaultEvents.some(
					(def) => def.name === event.name && def.date === event.date
				)
			) {
				const btn = document.createElement("button");
				btn.textContent = event.name;
				btn.addEventListener("click", () => setDate(event.date, event.name));
				defaultContainer.appendChild(btn);
			} else {
				addEventButton(event.name, event.date, event.importance || 1);
			}
		});

		// Save custom events back
		localStorage.setItem(
			"customEvents",
			JSON.stringify(
				allEvents.filter(
					(e) =>
						!defaultEvents.some(
							(def) => def.name === e.name && def.date === e.date
						)
				)
			)
		);
	});
});

// Countdown logic
updateCountdown();
setInterval(updateCountdown, 1000);

// Theme functions
function setCookie(name, value, days) {
	const d = new Date();
	d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
	document.cookie = name + "=" + value + ";path=/;expires=" + d.toUTCString();
}

function getCookie(name) {
	const nameEQ = name + "=";
	const ca = document.cookie.split(";");
	for (let i = 0; i < ca.length; i++) {
		let c = ca[i].trim();
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
	}
	return null;
}

function applyTheme(theme) {
	if (theme === "light") {
		document.body.classList.add("light-mode");
	} else {
		document.body.classList.remove("light-mode");
	}
}

// Apply saved theme on load
let savedTheme = getCookie("theme") || "dark";
applyTheme(savedTheme);

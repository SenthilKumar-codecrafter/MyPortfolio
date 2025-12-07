function toggleTheme(event) {
  const htmlEl = document.documentElement;
  const isDark = htmlEl.classList.toggle("dark");

  // Update all toggle buttons
  const toggleButtons = document.querySelectorAll("#themeToggle, .toggle-btn");
  toggleButtons.forEach((btn) => {
    btn.classList.toggle("active", isDark);
  });

  document.body.classList.toggle("dark", isDark);

  // Store preference in localStorage
  localStorage.setItem("theme", isDark ? "dark" : "light");

  if (event) createRipple(event);
}
(function applyStoredTheme() {
  const storedTheme = localStorage.getItem("theme");
  const toggleButtons = document.querySelectorAll("#themeToggle, .toggle-btn");

  if (storedTheme === "dark") {
    document.documentElement.classList.add("dark");
    document.body.classList.add("dark");
    toggleButtons.forEach((btn) => btn.classList.add("active"));
  } else {
    document.documentElement.classList.remove("dark");
    document.body.classList.remove("dark");
    toggleButtons.forEach((btn) => btn.classList.remove("active"));

    if (!storedTheme) {
      localStorage.setItem("theme", "light");
    }
  }
})();

function createRipple(event) {
  const button = event.currentTarget;
  const rect = button.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;

  const ripple = document.createElement("span");
  ripple.className = "ripple";
  ripple.style.width = ripple.style.height = size + "px";
  ripple.style.left = x + "px";
  ripple.style.top = y + "px";

  button.appendChild(ripple);

  setTimeout(() => {
    ripple.remove();
  }, 600);
}

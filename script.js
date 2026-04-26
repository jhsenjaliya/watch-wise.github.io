const header = document.querySelector("[data-header]");
const navLinks = Array.from(document.querySelectorAll(".site-nav a"));
const waitlistForm = document.querySelector(".waitlist-form");
const emailInput = document.querySelector("#email");
const formNote = document.querySelector("#form-note");
const focusWaitlistLinks = document.querySelectorAll("[data-focus-waitlist]");
const revealItems = document.querySelectorAll(".reveal");

const setHeaderState = () => {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 18);
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const updateActiveNav = () => {
  if (sections.length === 0) return;

  const headerOffset = header?.offsetHeight ?? 0;
  const currentY = window.scrollY + headerOffset + 130;
  const firstSectionStart = sections[0].offsetTop - headerOffset - 90;

  if (window.scrollY < firstSectionStart) {
    navLinks.forEach((link) => link.classList.remove("is-active"));
    return;
  }

  const activeSection = sections.reduce((current, section) => {
    return section.offsetTop <= currentY ? section : current;
  }, sections[0]);

  navLinks.forEach((link) => {
    link.classList.toggle("is-active", link.getAttribute("href") === `#${activeSection.id}`);
  });
};

updateActiveNav();
window.addEventListener("scroll", updateActiveNav, { passive: true });

if ("IntersectionObserver" in window && revealItems.length > 0) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

focusWaitlistLinks.forEach((link) => {
  link.addEventListener("click", () => {
    window.setTimeout(() => emailInput?.focus(), 420);
  });
});

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

waitlistForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const email = emailInput.value.trim();
  emailInput.classList.remove("is-invalid");
  formNote.classList.remove("success", "error");

  if (!isValidEmail(email)) {
    emailInput.classList.add("is-invalid");
    formNote.textContent = "Enter a valid email address to request beta access.";
    formNote.classList.add("error");
    emailInput.focus();
    return;
  }

  formNote.textContent = "You are on the beta list. We will send WatchWise updates when access opens.";
  formNote.classList.add("success");
  waitlistForm.reset();
});

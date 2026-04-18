const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const dropdownToggle = document.querySelector(".dropdown-toggle");
const dropdownParent = document.querySelector(".has-dropdown");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("show");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

if (dropdownToggle && dropdownParent) {
  dropdownToggle.addEventListener("click", () => {
    const isOpen = dropdownParent.classList.toggle("open");
    dropdownToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

const milestoneSelect = document.querySelector("#milestone-select");
const milestoneItems = document.querySelectorAll(".milestone-item");
const milestoneTrigger = milestoneSelect?.querySelector(".modern-select-trigger");
const milestoneValue = milestoneSelect?.querySelector(".modern-select-value");
const milestoneOptions = milestoneSelect
  ? milestoneSelect.querySelectorAll(".modern-select-option")
  : [];

if (milestoneSelect && milestoneItems.length > 0 && milestoneTrigger) {
  milestoneTrigger.addEventListener("click", () => {
    const isOpen = milestoneSelect.classList.toggle("open");
    milestoneTrigger.setAttribute("aria-expanded", String(isOpen));
  });

  milestoneOptions.forEach((option) => {
    option.addEventListener("click", () => {
      const selected = option.dataset.value;

      milestoneOptions.forEach((item) =>
        item.classList.toggle("is-active", item === option)
      );
      if (milestoneValue) milestoneValue.textContent = option.textContent;

      milestoneItems.forEach((item) => {
        const matches = item.dataset.milestone === selected;
        item.classList.toggle("is-active", matches);
      });

      milestoneSelect.classList.remove("open");
      milestoneTrigger.setAttribute("aria-expanded", "false");
    });
  });

  document.addEventListener("click", (event) => {
    if (!milestoneSelect.contains(event.target)) {
      milestoneSelect.classList.remove("open");
      milestoneTrigger.setAttribute("aria-expanded", "false");
    }
  });
} else if (milestoneSelect && milestoneItems.length > 0) {
  milestoneSelect.addEventListener("change", (event) => {
    const selected = event.target.value;
    milestoneItems.forEach((item) => {
      const matches = item.dataset.milestone === selected;
      item.classList.toggle("is-active", matches);
    });
  });
}

const milestonePageSelect = document.querySelector("#milestone-page-select");
const milestonePageTrigger = milestonePageSelect?.querySelector(
  ".modern-select-trigger"
);
const milestonePageValue = milestonePageSelect?.querySelector(
  ".modern-select-value"
);
const milestonePageOptions = milestonePageSelect
  ? milestonePageSelect.querySelectorAll(".modern-select-option")
  : [];
const milestoneDetailArea = document.querySelector(".milestones-detail-area");
const milestonePageDefaultLabel = "Choose a milestone…";

function pageOptionLabelById(id) {
  for (const opt of milestonePageOptions) {
    const v = opt.getAttribute("data-value") ?? "";
    if (v === id) return opt.textContent.trim();
  }
  return "";
}

function showMilestonePageContent(id, scrollToContent) {
  if (!milestoneDetailArea) return;
  const blocks = milestoneDetailArea.querySelectorAll(".milestone-block");

  if (!id) {
    milestoneDetailArea.classList.remove("has-selection");
    blocks.forEach((b) => b.classList.remove("is-active"));
    if (milestonePageSelect) {
      milestonePageOptions.forEach((o) => o.classList.remove("is-active"));
      if (milestonePageValue)
        milestonePageValue.textContent = milestonePageDefaultLabel;
    }
    history.replaceState(null, "", `${location.pathname}${location.search}`);
    return;
  }

  if (!pageOptionLabelById(id)) return;

  milestoneDetailArea.classList.add("has-selection");
  blocks.forEach((b) => b.classList.toggle("is-active", b.id === id));
  milestonePageOptions.forEach((o) => {
    const v = o.getAttribute("data-value") ?? "";
    o.classList.toggle("is-active", v === id);
  });
  if (milestonePageValue) milestonePageValue.textContent = pageOptionLabelById(id);
  history.replaceState(null, "", `#${id}`);

  if (scrollToContent) {
    milestoneDetailArea.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
}

function syncMilestonePageFromHash() {
  if (!milestoneDetailArea) return;
  const id = (location.hash || "").replace(/^#/, "");
  if (!id || !/^[a-z0-9-]+$/i.test(id)) {
    showMilestonePageContent("", false);
    return;
  }
  if (pageOptionLabelById(id)) showMilestonePageContent(id, false);
}

if (
  milestonePageSelect &&
  milestonePageTrigger &&
  milestoneDetailArea &&
  milestonePageOptions.length > 0
) {
  milestonePageTrigger.addEventListener("click", () => {
    const isOpen = milestonePageSelect.classList.toggle("open");
    milestonePageTrigger.setAttribute("aria-expanded", String(isOpen));
  });

  milestonePageOptions.forEach((option) => {
    option.addEventListener("click", () => {
      const id = option.getAttribute("data-value") ?? "";
      showMilestonePageContent(id, true);
      milestonePageSelect.classList.remove("open");
      milestonePageTrigger.setAttribute("aria-expanded", "false");
    });
  });

  document.addEventListener("click", (event) => {
    if (!milestonePageSelect.contains(event.target)) {
      milestonePageSelect.classList.remove("open");
      milestonePageTrigger.setAttribute("aria-expanded", "false");
    }
  });

  window.addEventListener("hashchange", syncMilestonePageFromHash);
  syncMilestonePageFromHash();
}

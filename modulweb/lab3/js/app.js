const btnFilterGroupHTML = document.querySelectorAll(".filter button");
const programGridHTML = document.querySelectorAll(".program-grid article");

document.addEventListener("DOMContentLoaded", () => {
  const activeFilterButton = Array.from(btnFilterGroupHTML).filter(
    (e) => e.ariaPressed === "true",
  )[0];
  const { filterDate } = activeFilterButton.dataset;
  filterProgramByDate(filterDate);
});

const filterProgramByDate = (date) => {
  programGridHTML.forEach((e) => {
    e.style.display = "block";
    const d = e.querySelector(".eyebrow time");
    if (d.dateTime.split("T")[0] !== date) {
      e.style.display = "none";
    }
  });
};

for (const btn of btnFilterGroupHTML) {
  btn.addEventListener("click", (e) => {
    const { filterDate } = e.target.dataset;
    const isPressed = e.target.ariaPressed;
    if (isPressed === "true") return;

    btnFilterGroupHTML.forEach((e) => {
      e.ariaPressed = "false";
    });

    e.target.ariaPressed = "true";
    filterProgramByDate(filterDate);
  });
}

// MENY

const menuToggleHTML = document.querySelector("[data-menu-toggle]");
const menuHTML = document.querySelector("[data-menu]");

const setOpen = (open) => {
  menuToggleHTML.setAttribute("aria-expanded", open);
  menuToggleHTML.setAttribute("aria-label", open ? "Stäng meny" : "Öppna meny");
};

menuToggleHTML.hidden = false;

menuToggleHTML.addEventListener("click", () => {
  const open = menuToggleHTML.getAttribute("aria-expanded") === "true";
  setOpen(!open);
});

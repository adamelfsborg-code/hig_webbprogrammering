const input = document.querySelector("[data-slider]");
const cube = document.querySelector("[data-cube]");
input.addEventListener("input", (e) => {
  console.log(e.target.value);

  cube.style.setProperty("transform", `scaleX(${e.target.value})`);
});
document.addEventListener("DOMContentLoaded", () => {});

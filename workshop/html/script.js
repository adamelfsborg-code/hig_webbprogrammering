document.addEventListener("DOMContentLoaded", () => {
  const body = document.querySelector("body");
  const input = document.querySelector('input[name="färger"]');

  const bg = localStorage.getItem("bg");
  if (isHex(bg)) {
    body.style.backgroundColor = bg;
    input.value = bg;
  }

  input.addEventListener("input", (e) => {
    const hex = e.target.value;
    body.style.backgroundColor = hex;
    localStorage.setItem("bg", hex);
  });
});

const isHex = (str) => {
  if (
    !str ||
    str === "" ||
    str[0] !== "#" ||
    (str.length !== 4 && str.length !== 7)
  )
    return false;

  return true;
};


let workspaceHTML = document.querySelector("[data-text-editor-workspace]");
let previewHTML = document.querySelector("[data-text-editor-preview]");

const readTextFile = async (path) => {
  const readme = await fetch(path);
  return await readme.text();
};

document.addEventListener("DOMContentLoaded", async () => {
  drawReadme();
});

const drawReadme = async () => {
  const readme = await readTextFile("README.md");
  const lines = readme.split("\n");

  typeMarkdownInTextEditor(lines);
};

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const mapPrefixToTag = { "#": "h1", "": "p", "---": "hr", "-": "li" };

const typeMarkdownInTextEditor = async (lines) => {
  for (const line of lines) {
    if (line.length === 0) {
      const breakHTML = document.createElement("br");
      previewHTML.append(breakHTML);
      workspaceHTML.textContent += "\n";
      await wait(300);
      continue;
    }

    const prefix = line.match(/^(#+ |- |---)?/)[0];

    const el = document.createElement(mapPrefixToTag[prefix.trim()]);
    let container = null;

    if (prefix === "- ") {
      const existingListHTML = previewHTML.lastElementChild;

      if (existingListHTML.tagName === "UL") {
        existingListHTML.append(el);
        container = existingListHTML;
      } else {
        container = document.createElement("ul");
        container.append(el);
      }
    }

    let typed = "";
    for (let i = 0; i < line.length; i++) {
      workspaceHTML.textContent += line[i];
      if (i >= prefix.length) {
        typed += line[i];
        el.innerHTML = inline(typed);
      }
      if (container) {
        previewHTML.append(container);
      } else {
        previewHTML.append(el);
      }

      await wait(10 + Math.random() * 60);
    }
    workspaceHTML.textContent += "\n";
    await wait(100);
  }
};

function inline(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>");
}


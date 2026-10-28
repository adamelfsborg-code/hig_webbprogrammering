let workspaceHTML = document.querySelector("[data-text-editor-workspace]");
let previewHTML = document.querySelector("[data-text-editor-preview]");
let sidebarHTML = document.querySelector("[data-text-editor-sidebar]");
let previewWrapperHTML = document.querySelector(
  "[data-text-editor-preview-wrapper]",
);
let textEditorHTML = document.querySelector("[data-text-editor]");
let toolbarHTML = document.querySelector("[data-text-editor-toolbar]");

const sidebarFilesHTML = sidebarHTML.querySelectorAll("[data-preview-type]");

for (const file of sidebarFilesHTML) {
  file.addEventListener("click", async (e) => {
    handleFileClick(sidebarHTML, e);
    workspaceHTML.textContent = "";
    previewHTML.textContent = "";

    const previewType = e.target.dataset.previewType;
    const filePath = e.target.dataset.filePath;
    const fileContents = await readTextFile(filePath);

    if (previewType === "readme") {
      textEditorHTML.classList.remove("no-preview");
      const lines = fileContents.split("\n");
      typeMarkdownInTextEditor(lines);
      return;
    }

    if (previewType === "file") {
      textEditorHTML.classList.add("no-preview");
      workspaceHTML.textContent = fileContents;
      previewHTML.textContent = fileContents;
      return;
    }

    if (previewType === "remote") {
      textEditorHTML.classList.remove("no-preview");
      workspaceHTML.textContent = fileContents;
      let current = e.target;
      while (!current.dataset.previewPath) {
        current = current.parentElement;
      }
      const previewPath = current.dataset.previewPath;

      const frame = document.createElement("iframe");
      frame.src = previewPath;
      frame.height = "100%";
      frame.width = "100%";

      previewHTML.append(frame);
      return;
    }
  });
}

const toolbarFilesHTML = toolbarHTML.querySelectorAll("li");

for (const file of toolbarFilesHTML) {
  file.addEventListener("click", (e) => {
    handleFileClick(toolbarHTML, e);
  });
}

const handleFileClick = (container, e) => {
  const files = container.querySelectorAll(".active");
  for (const f of files) {
    f.classList.remove("active");
  }
  e.target.classList.add("active");
};

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

var IDENTIFIER = "visitor@zixiao.website ~ % ";
var HISTORICAL_COMMAND_INDEX = -1;
var CURRENT_DIRECTORY = [];
var structure = JSON.parse(JSON.stringify(DEFAULT_STRUCTURE));
var GITHUB = "https://github.com/ZixiaoWang";
var LINKEDIN = "https://www.linkedin.com/in/jacky-w-57a59b59/";
var PATH = "/terminal";

function init() {
  const command = $("#command");
  const terminal = $(".terminal");

  $("#identifier").textContent = IDENTIFIER;
  cursorFocus();

  try {
    const historicalCommands = JSON.parse(localStorage.getItem("HC"));
    HISTORICAL_COMMAND_INDEX = historicalCommands.length;
  } catch (e) {}

  try {
    const customStructure = JSON.parse(localStorage.getItem("FS"));
    structure = customStructure ?? structure;
  } catch (e) {}

  command.addEventListener("keydown", (e) => {
    const key = e.key;
    if (key === "Enter") {
      inputCommand(command.value);
      command.value = "";
    } else if (["ArrowUp", "ArrowDown"].includes(key)) {
      readHistoricalCommands(key);
    }
  });

  terminal.addEventListener("click", () => {
    cursorFocus();
  });

  greeting();
}

async function inputCommand(cmd) {
  const command = cmd.trim();
  if (!command) {
    await generateHistoricalCommand(command);
  } else {
    recordCommand(command);
    await generateHistoricalCommand(command);
    await executeCommand(command);
  }

  const commandLine = $("#commandline");
  commandLine.scrollIntoView();
  cursorFocus();
}

function recordCommand(cmd) {
  const HC = localStorage.getItem("HC");
  let historicalCommands = [];
  if (HC) {
    try {
      historicalCommands = JSON.parse(HC);
    } catch (e) {
      historicalCommands = [];
    } finally {
      historicalCommands = historicalCommands.concat(cmd);
    }
  } else {
    historicalCommands = historicalCommands.concat(cmd);
  }
  HISTORICAL_COMMAND_INDEX = historicalCommands.length;
  localStorage.setItem("HC", JSON.stringify(historicalCommands));
}

function readHistoricalCommands(key) {
  let historicalCommands = [];
  const command = $("#command");
  try {
    const HC = localStorage.getItem("HC");
    historicalCommands = JSON.parse(HC);
  } catch (e) {}

  if (HISTORICAL_COMMAND_INDEX > -1) {
    if (key === "ArrowUp") {
      HISTORICAL_COMMAND_INDEX = HISTORICAL_COMMAND_INDEX - 1;
      if (HISTORICAL_COMMAND_INDEX <= 0) {
        HISTORICAL_COMMAND_INDEX = 0;
      }
    } else if (key === "ArrowDown") {
      HISTORICAL_COMMAND_INDEX = HISTORICAL_COMMAND_INDEX + 1;
      if (HISTORICAL_COMMAND_INDEX >= historicalCommands.length) {
        HISTORICAL_COMMAND_INDEX = historicalCommands.length;
        command.value = "";
        return;
      }
    }
    const historicalCommand = historicalCommands[HISTORICAL_COMMAND_INDEX];
    command.value = historicalCommand ?? "";
  } else {
    return;
  }
}

async function generateHistoricalCommand(cmd) {
  const history = $(".history");
  const div = document.createElement("div");
  const identifierSpan = document.createElement("span");
  const commandSpan = document.createElement("span");
  identifierSpan.className = "identifier";
  identifierSpan.textContent = IDENTIFIER;
  commandSpan.textContent = cmd;
  div.className = "block";
  div.appendChild(identifierSpan);
  div.appendChild(commandSpan);
  history.appendChild(div);
  return true;
}

async function printOutput(output /* string | string[] */, style) {
  const history = $(".history");
  const div = document.createElement("div");
  div.className = "block";

  if (["string", "number", "boolean"].includes(typeof output)) {
    const outputSpan = document.createElement("span");
    outputSpan.className = "pre";
    outputSpan.textContent = output.toString();
    if (style) {
      Object.keys(style).forEach((key) => {
        outputSpan.style[key] = style[key];
      });
    }
    div.appendChild(outputSpan);
  } else if (Array.isArray(output)) {
    output.forEach((line) => {
      const outputDiv = document.createElement("div");
      outputDiv.className = "pre block";
      outputDiv.textContent = line;
      div.appendChild(outputDiv);
    });
  }

  history.appendChild(div);
}

async function printMediaOutput(mediaList) {
  const history = $(".history");
  const div = document.createElement("div");
  div.className = "block media-container";

  mediaList.forEach((mediaPath) => {
    const mediaDiv = document.createElement("div");
    const mediaLabel = document.createElement("label");
    mediaDiv.onclick = () => window.open(mediaPath, "_blank");
    mediaDiv.className = "media";
    if (/\.jpe?g$/.test(mediaPath)) {
      const media = document.createElement("img");
      media.src = mediaPath;
      mediaDiv.appendChild(media);
    } else {
      const mediaName = document.createElement("div");
      mediaName.className = "media-name";
      const textContent = mediaPath.split("\.").pop();
      mediaName.textContent = textContent.toUpperCase();
      mediaDiv.appendChild(mediaName);
    }
    mediaLabel.textContent = mediaPath.split("/").pop();
    mediaDiv.appendChild(mediaLabel);
    div.appendChild(mediaDiv);
  });

  history.appendChild(div);
}

async function executeCommand(cmd) {
  const commandFragments = cmd.split(" ");
  const command = commandFragments[0].toLowerCase();

  if (!window.commands) {
    const output = "Failed to load commands, try refresh the page";
    const style = { color: "red" }
    await printOutput(output, style);
    return;
  }

  const availableCommands = Object.keys(window.commands);
  if (!availableCommands.includes(command)) {
    const output = `command not found: ${cmd}`;
    await printOutput(output);
    return;
  }

  const commandFunction = window.commands[command];
  await commandFunction(cmd);
  return;
}

function parseCommand(cmd) {
  const commandFragments = cmd.trim().split(" ").filter(Boolean);
  const command = commandFragments[0].toLowerCase();
  const flags = {};
  let args = null;
  
  let cursor = 1;
  if (cursor < commandFragments.length) {
    const fragment = commandFragments[cursor];
    if (/^-{1,2}\w+&/.test(fragment)) {
      let flagKey = fragment.replace(/^-{1,2}/, "");
      flags[flagKey] = true;
    } else {
      args = fragment;
    }
  }

  return {
    command,
    flags,
    args,
    hasArgs: args !== null,
  }
}

function getCurrentDirectory(map = structure, index = -1) {
  if (index === CURRENT_DIRECTORY.length) {
    return map;
  }
  const key = CURRENT_DIRECTORY[index];
  return getCurrentDirectory(map[key], index + 1);
}

function getDirectory(path) {
  const pathFragments = path.split("/");
  let map = structure;
  for (let i = 0; i < pathFragments.length; i++) {
    const fragment = pathFragments[i];
    if (map[fragment]) {
      map = map[fragment];
    } else {
      return null;
    }
  }
  return map;
}

function getFile(path) {
  const pathFragments = path.split("/");
  let map = getCurrentDirectory();

  for (let i = 0; i < pathFragments.length; i++) {
    const fragment = pathFragments[i];
    if (map[fragment] !== undefined) {
      map = map[fragment];
    } else {
      return null;
    }
  }

  if (CURRENT_DIRECTORY.length === 0) {
    return "/" + path.toLowerCase();
  }

  return CURRENT_DIRECTORY
    .map(item => item.toLowerCase())
    .join("/") + "/" + path.toLowerCase();
}

function saveDirectoryStructure() {
  localStorage.setItem("FS", JSON.stringify(structure));
}

function cursorFocus() {
  $("#command").focus();
}

function syncEditorLine() {
  const lineIndicator = $("#editorline");
  const editor = $("#editor");
  if (editor && lineIndicator && editor.value) {
    lineIndicator.innerHTML = "";
    editor.value.split("\n").forEach((_, index) => {
      const lineNumber = document.createElement("div");
      lineNumber.textContent = index + 1;
      lineIndicator.appendChild(lineNumber);
    });
  }
}

function calloutEditor(content, onCommand) {
  const editorTemplate = $("#editortemplate");
  const body = $("body");
  if (body && editorTemplate) {
    body.appendChild(editorTemplate.content.cloneNode(true));
    const editor = $("#editor");
    const editorCommand = $("#editorcommand");
    if (content) {
      editor.value = content;
    }
    syncEditorLine();
    editor.addEventListener("keydown", (event) => {
      if (event.key === "Tab") {
        event.preventDefault();
        const cursorPosition = editor.selectionStart;
        const value = editor.value;
        editor.value = value.substring(0, cursorPosition) + "  " + value.substring(cursorPosition);
      } else if (event.key === "Escape") {
        editorCommand.value = "";
        editorCommand.focus();
      }
      setTimeout(() => syncEditorLine(), 0);
    });
    editorCommand.addEventListener("change", (event) => {
      if (onCommand && typeof onCommand === "function") {
        onCommand(editor, event.target.value);
      }
    })

    setTimeout(() => {
      editor.focus();
    }, 0);
    return;
  }
  return;
}

function closeEditor() {
  const editorContainer = $("#editorcontainer");
  const body = $("body");
  if (body && editorContainer) {
    body.removeChild(editorContainer);
  }
  return;
}

function $(selector) {
  return document.querySelector(selector);
}

function updateIdentifier(newIdentifier) {
  IDENTIFIER = newIdentifier;
  $("#identifier").textContent = IDENTIFIER;
}

window.addEventListener("load", init);

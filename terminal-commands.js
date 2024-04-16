window.commands = {
  whoami,
  whoismywife,
  ls,
  pwd,
  cd,
  mkdir,
  rmdir,
  touch,
  rm,
  cat,
  tree,
  nano,
  reset,
  open: localOpen,
  history,
  clear,
  exit,
  theme,
  copyright,
  help,
};

Object.freeze(window.commands);

function greeting() {
  const LINE = "==".repeat(30);
  printOutput(
    `\


  ███████ ██ ██   ██ ██  █████   ██████                 
     ███  ██  ██ ██  ██ ██   ██ ██    ██                
    ███   ██   ███   ██ ███████ ██    ██                
   ███    ██  ██ ██  ██ ██   ██ ██    ██                
  ███████ ██ ██   ██ ██ ██   ██  ██████  ██              
                                                    
                                                    
  ██     ██ ███████ ██████  ███████ ██ ████████ ███████ 
  ██     ██ ██      ██   ██ ██      ██    ██    ██      
  ██  █  ██ █████   ██████  ███████ ██    ██    █████   
  ██ ███ ██ ██      ██   ██      ██ ██    ██    ██      
   ███ ███  ███████ ██████  ███████ ██    ██    ███████ 
`,
    { fontSize: "8px" }
  );
  printOutput([
    "  ",
    "  Hello there! 👋",
    "  Welcome to Jacky's personal website!",
    "  Type 'help' to see the list of available commands.",
    " ",
    "  HINTS: ",
    "  Type 'whoami' to see my information.",
    "  Type 'open github' or 'open gh' to visit my Github page.",
    "  Type 'open linkedin' or 'open ln' to visit my Linkedin page.",
    "  ",
  ]);
}

function whoami() {
  const MARGIN_RIGHT = 25;
  const WHOAMI_COMMAND = [
    "=".repeat(70),
    "BASIC INFO",
    `  ${"Name".padEnd(MARGIN_RIGHT)} Jacky Wang`,
    `  ${"Age".padEnd(MARGIN_RIGHT)} 32`,
    `  ${"Skills".padEnd(MARGIN_RIGHT)} JS, TS, ReactJS, Node, Ruby, SQL`,
    "-".repeat(70),
    "WHO AM I",
    "  An software engineer, coding with passion.",
    "  Loves travel and photography",
    "  Have an old drone and older camera. ",
    "  Sometimes draw something on iPad, do road bike riding and swiming. ",
    "  Love new tech, happy to learn anything new.",
    "  Definately a 🐈 lover",
    "-".repeat(70),
    "WORK EXPERIENCE",
    `* ${"Flexport".padEnd(MARGIN_RIGHT)} Sr. Software Engineer`,
    `* ${"Block.One".padEnd(MARGIN_RIGHT)} Software Engineer`,
    `* ${"CryptoBLK".padEnd(MARGIN_RIGHT)} Sr. Software Engineer`,
    `* ${"DigitCube".padEnd(MARGIN_RIGHT)} Software Engineer`,
    `* ${"ARBA Holdings Ltd.".padEnd(MARGIN_RIGHT)} Sr. Software Engineer`,
    "-".repeat(70),
    "EDUCATION",
    `* ${"CityU of HK".padEnd(MARGIN_RIGHT)} Master of Advanced Tech & Mgt.`,
    `* ${"Latrobe Uni".padEnd(MARGIN_RIGHT)} Bachelor of IT`,
    `* ${"DaLian JiaoTong Uni".padEnd(
      MARGIN_RIGHT
    )} Bachelor of Computer Science`,
    "-".repeat(70),
    "CONTACT",
    `* ${"Github".padEnd(MARGIN_RIGHT)} ${GITHUB}`,
    `* ${"Linkedin".padEnd(MARGIN_RIGHT)} ${LINKEDIN}`,
    "=".repeat(70),
  ];
  printOutput(WHOAMI_COMMAND);
}
whoami.manual = "Print the basic information about Jacky";

function clear() {
  const history = $(".history");
  const terminal = $(".terminal");
  const canvas = $(".canvas");
  const commandLine = $("#commandline");
  if (history && canvas && commandLine) {
    const newHeight = terminal.getBoundingClientRect().height + history.getBoundingClientRect().height;
    canvas.style.height = newHeight + "px";
    commandLine.scrollIntoView();
  }
  return;
}
clear.manual = "Clear the terminal screen";

function exit() {
  if (window.confirm("Are you sure you want to exit the process?")) {
    window.close();
  }
}
exit.manual = "Exit the terminal";

function help() {
  const commands = Object.keys(window.commands);
  const rows = [];
  commands.forEach((command) => {
    const manual = window.commands[command].manual;
    if (manual) {
      rows.push(`  ${command.padEnd(15)}${manual}`);
    } else {
      rows.push(`  ${command.padEnd(15)}`);
    }
  });
  printOutput(rows);
}

function theme(cmd) {
  const cmdObject = parseCommand(cmd);
  const body = $("body");
  if (body) {
    if (cmdObject.hasArgs) {
      const theme = cmdObject.args;
      if (theme === "dark") {
        body.dataset.theme = "dark";
      } else if (theme === "light") {
        body.dataset.theme = "light";
      } else if (theme === "old") {
        body.dataset.theme = "old";
      } else {
        const output = `Invalid theme: ${theme}`;
        printOutput(output);
      }
      return;
    } else {
      printOutput("Please specify a theme (dark or light)");
      return;
    }
  }
}
theme.manual = "Change the terminal theme to dark or light";

function ls(cmd) {
  const currentDirectory = getCurrentDirectory(structure, -1);

  if (
    CURRENT_DIRECTORY.length === 1 &&
    ["photography", "cats"].includes(CURRENT_DIRECTORY[0])
  ) {
    const mediaList = Object.keys(currentDirectory)
      .map((filename) => {
        return CURRENT_DIRECTORY.join("/") + "/" + filename;
      });
    printMediaOutput(mediaList);
    return;
  }

  const rows = [];
  let temp = "";

  Object.keys(currentDirectory).forEach((directory, index) => {
    if (index > 0 && index % 7 === 0) {
      rows.push(temp);
      temp = directory.padEnd(20);
    } else {
      temp += directory.padEnd(20);
    }
  });

  if (temp) {
    rows.push(temp);
  }

  printOutput(rows);
}
ls.manual = "List directory contents";

function pwd() {
  const path = CURRENT_DIRECTORY.join("/");
  printOutput("/Users/visitor/" + path);
}
pwd.manual = "Print the current working directory";

function cd(cmd) {
  let destination = cmd.trim().replace(/^cd\s*/i, "");
  destination = destination.replace(/^"|"$/, "");

  if (/\//g.test(destination)) {
    const destinationFragments = destination.split("/");
    destinationFragments.forEach((fragment) => cd(fragment));
    return;
  } else {
    if (destination === "~") {
      CURRENT_DIRECTORY = [];
      updateIdentifier("visitor@zixiao.website ~ % ");
    }
    if (destination === ".") {
      return;
    }
    if (destination === "..") {
      if (CURRENT_DIRECTORY.length > 0) {
        CURRENT_DIRECTORY.pop();
        const currentDirectory =
          CURRENT_DIRECTORY[CURRENT_DIRECTORY.length - 1] ?? "~";
        updateIdentifier(`visitor@zixiao.website ${currentDirectory} % `);
      } else {
        printOutput("You are already at the root directory");
      }
      return;
    }
    if (/^\w+$/.test(destination)) {
      const currentDirectory = getCurrentDirectory(structure, -1);
      if (currentDirectory[destination]) {
        CURRENT_DIRECTORY.push(destination);
        updateIdentifier(`visitor@zixiao.website ${destination} % `);
        return;
      } else {
        printOutput(`cd: no such file or directory: ${destination}`);
        return;
      }
    }
  }
}
cd.manual = "Change the current directory";

function history() {
  let historicalCommands = [];
  try {
    historicalCommands = JSON.parse(localStorage.getItem("HC"));
  } catch (e) {}
  printOutput(historicalCommands);
}
history.manual = "Print the history of commands";

function mkdir(cmd) {
  let folderName = cmd.trim().replace(/^mkdir\s*/i, "");
  folderName = folderName.replace(/^"|"$/, "");
  if (!folderName) {
    printOutput("mkdir: missing operand");
    return;
  }
  const currentDirectory = getCurrentDirectory(structure, -1);
  currentDirectory[folderName] = {};
  saveDirectoryStructure();
  return;
}
mkdir.manual = "Create a new directory";

function rmdir(cmd) {
  let folderName = cmd.trim().replace(/^rmdir\s*/i, "");
  folderName = folderName.replace(/^"|"$/, "");
  if (!folderName) {
    printOutput("rmdir: missing operand");
    return;
  }
  const currentDirectory = getCurrentDirectory(structure, -1);
  delete currentDirectory[folderName];
  saveDirectoryStructure();
  return;
}
rmdir.manual = "Remove a directory";

function touch(cmd) {
  let fileName = cmd.trim().replace(/^touch\s*/i, "");
  fileName = fileName.replace(/^"|"$/, "");
  if (!fileName) {
    printOutput("touch: missing operand");
    return;
  }
  const currentDirectory = getCurrentDirectory(structure, -1);
  currentDirectory[fileName] = "";
  saveDirectoryStructure();
  return;
}
touch.manual = "Create a new file";

function rm(cmd) {
  let fileName = cmd.trim().replace(/^rm\s*/i, "");
  fileName = fileName.replace(/^"|"$/, "");
  if (!fileName) {
    printOutput("rm: missing operand");
    return;
  }
  const currentDirectory = getCurrentDirectory(structure, -1);
  delete currentDirectory[fileName];
  saveDirectoryStructure();
  return;
}
rm.manual = "Remove a file";

async function localOpen(cmd) {
  let target = cmd.trim().replace(/^open\s*/i, "");
  target = target.replace(/^"|"$/, "");

  if (!target) {
    printOutput("open: missing operand");
    return;
  }

  if (["github", "gh"].includes(target.toLowerCase())) {
    window.open(GITHUB, "_blank");
    return;
  }

  if (["linkedin", "ln"].includes(target.toLowerCase())) {
    window.open(LINKEDIN, "_blank");
    return;
  }

  if (/^http/.test(target)) {
    window.open(target, "_blank");
    return;
  } else {
    if (/\//.test(target)) {
      const pathFragments = target.split("/");
      let map = structure;
      for (let i = 0; i < pathFragments.length; i++) {
        const fragment = pathFragments[i];
        if (map[fragment]) {
          map = map[fragment];
        } else {
          printOutput(`open: ${target}: No such file or directory`);
          return;
        }
      }

      if (typeof map === "object") {
        printOutput(`open: ${target}: is a directory`);
        return;
      }

      const targetPath =
        CURRENT_DIRECTORY.join("/") + "/" + target.toLowerCase();
      window.open(targetPath, "_blank");
      return;
    } else {
      const currentDirectory = getCurrentDirectory(structure, -1);
      if (currentDirectory[target]) {
        if (typeof currentDirectory[target] !== "object") {
          const targetPath =
            CURRENT_DIRECTORY.join("/") + "/" + target.toLowerCase();
          window.open(targetPath, "_blank");
          return;
        } else {
          printOutput(`open: ${target}: Is a directory`);
          return;
        }
      } else {
        printOutput(`open: ${target}: No such file or directory`);
        return;
      }
    }
  }
}
localOpen.manual = "Open a file or URL";

function tree() {
  const rows = [];

  function traverse(map, depth = 1) {
    Object.keys(map).forEach((key) => {
      if (typeof map[key] !== "object") {
        rows.push(`${"  ".repeat(depth)} ${key}`);
      } else {
        rows.push(`${"  ".repeat(depth)} ${key}`);
        traverse(map[key], depth + 1);
      }
    });
  }

  traverse(structure);

  printOutput(rows);
}
tree.manual = "List directory contents in a tree-like format";

function copyright() {
  printOutput("© 2024 Jacky Wang. All rights reserved.");
  return;
}
copyright.manual = "Print the copyright";

function whoismywife() {
  printOutput("❤️ It's Kai ❤️");
  printMediaOutput(["./kai/kai.jpeg"]);
  return;
}
whoismywife.manual = "Print the name of my wife";

async function cat(cmd) {
  let filename = cmd.trim().replace(/^cat\s*/i, "");
  filename = filename.replace(/^"|"$/, "");

  if (!filename) {
    printOutput("cat: missing operand");
    return;
  }

  const absoluteFilename = getFile(filename) ?? filename;
  if (!absoluteFilename) {
    printOutput(`cat: ${filename}: No such file or directory`);
    return;
  }

  const absoluteFilePath = absoluteFilename.replace(/\/[\w\.]+$/, "");
  const pureFilename = absoluteFilename.split("/").pop();
  const fileDirectory = getDirectory(absoluteFilePath) || structure;

  if (typeof fileDirectory[pureFilename] === "string") {
    const fileContent = fileDirectory[pureFilename];
    printOutput(fileContent);
    return;
  }

  const response = await fetch(location.origin + PATH + "/" + absoluteFilename);
  const content = await response.text();
  printOutput(content);
  return;
}
cat.manual = "Print the content of a file";

async function nano(cmd) {
  let filename = cmd.trim().replace(/^nano\s*/i, "");
  filename = filename.replace(/^"|"$/, "");

  if (!filename) {
    printOutput("nano: missing operand");
    return;
  }

  const absoluteFilename = getFile(filename);
  const absoluteFilePath = absoluteFilename?.replace(/\/[\w\.]+$/, "");
  const pureFilename = absoluteFilename?.split("/").pop() ?? filename;
  const fileDirectory = absoluteFilePath ? getDirectory(absoluteFilePath) : structure;

  const onCommand = (editor, ecmd) => {
    if ([":wq", ":wq!"].includes(ecmd)) {
      fileDirectory[pureFilename] = editor.value;
      closeEditor();
      saveDirectoryStructure();
      cursorFocus();
      return;
    } else if ([":q", ":q!"].includes(ecmd)) {
      closeEditor();
      cursorFocus();
      return;
    }
  }

  if (!absoluteFilename) {
    fileDirectory[pureFilename] = "";
    calloutEditor("", onCommand);
  } else {
    if (typeof fileDirectory[pureFilename] === "string") {
      const fileContent = fileDirectory[pureFilename];
      calloutEditor(fileContent, onCommand);
    } else {
      const response = await fetch(location.origin + PATH + "/" + absoluteFilename);
      const content = await response.text();
      calloutEditor(content, onCommand);
    }
  }
}
nano.manual = "Edit a file";

function reset() {
  localStorage.removeItem("HC");
  localStorage.removeItem("FS");
  const history = $(".history");
  const canvas = $(".canvas");
  if (history) {
    history.innerHTML = "";
  } 
  IDENTIFIER = "visitor@zixiao.website ~ % ";
  updateIdentifier("visitor@zixiao.website ~ % ")
  HISTORICAL_COMMAND_INDEX = -1;
  CURRENT_DIRECTORY = [];
  structure = Object.assign(DEFAULT_STRUCTURE, {});;
  greeting();
  canvas.removeAttribute("style");
  const commandLine = $("#commandline");
  if (commandLine) {
    commandLine.scrollIntoView("bottom");
  }
}
reset.manual = "Reset the terminal";

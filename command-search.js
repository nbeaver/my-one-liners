var highlightedElement = null;
function copyText() {
  // console.info(event.target);
  navigator.clipboard.writeText(this.innerText);
  if (highlightedElement !== null) {
    highlightedElement.style.background = "";
  }
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    // Dark mode
    this.style.background = "#8C3313";
  } else {
    // Light mode
    // this.style.background = "yellow"; // #d8d800
    this.style.background = "#ffff98";
  }
  highlightedElement = this;
}

function matchCommand(match, candidate, useRegex = false) {
  if (match == "") {
    // If the input is blank, we want to match anything.
    return true;
  }
  if (useRegex === true) {
    // Regular expression matching.
    const re = new RegExp(match);
    if (re.test(candidate)) {
      return true;
    } else {
      return false;
    }
  } else {
    // Regular string matching.
    if (candidate.includes(match)) {
      // console.log(`"${candidate}" includes "${match}"`);
      return true;
    } else {
      // console.log(`"${candidate}" does not include "${match}"`);
      return false;
    }
  }
}

function matchDescription(match, candidate, caseSensitive = false) {
  if (match == "") {
    // If the input is blank, we want to match anything.
    return true;
  }
  if (caseSensitive === true) {
    if (candidate.includes(match)) {
      // console.log(`"${candidate}" includes "${match}"`);
      return true;
    } else {
      // console.log(`"${candidate}" does not include "${match}"`);
      return false;
    }
  } else {
    // Don't match case.
    if (candidate.toLowerCase().includes(match.toLowerCase())) {
      // console.log(`"${candidate.toLowerCase()}" does not include "${match.toLowerCase()}"`);
      return true;
    } else {
      // console.log(`"${candidate.toLowerCase()}" does not include "${match.toLowerCase()}"`);
      return false;
    }
  }
}

function matchExampleOutput(match, candidate, caseSensitive = false) {
  if (match == "") {
    // If the input is blank, we want to match anything.
    return true;
  } else if (candidate === undefined) {
    // If the field isn't available, we don't want to match.
    return false;
  }
  if (caseSensitive === true) {
    if (candidate.includes(match)) {
      // console.log(`"${candidate}" includes "${match}"`);
      return true;
    } else {
      // console.log(`"${candidate}" does not include "${match}"`);
      return false;
    }
  } else {
    // Don't match case.
    if (candidate.toLowerCase().includes(match.toLowerCase())) {
      // console.log(`"${candidate.toLowerCase()}" does not include "${match.toLowerCase()}"`);
      return true;
    } else {
      // console.log(`"${candidate.toLowerCase()}" does not include "${match.toLowerCase()}"`);
      return false;
    }
  }
}

function matchComponentCommands(match, candidate) {
  if (match.size === 0) {
    // If the input is blank, we want to match anything.
    return true;
  } else if (match.isSubsetOf(candidate)) {
    return true;
  } else {
    return false;
  }
}

function matchLinks(match, candidate) {
  // If the input is blank, we want to match anything.
  if (match === "") {
    return true;
  } else if (candidate === undefined) {
    // If the field isn't available, we don't want to match.
    return false;
  }
  for (const link of candidate) {
    if (link.includes(match)) {
      return true;
    }
  }
  // None of the links match.
  return false;
}

function matchShell(match, candidate) {
  return match.has(candidate);
}

function noWhiteSpace(arrayIn) {
  const array = [];
  for (const val of arrayIn) {
    if (val.trim() !== "") {
      array.push(val);
    }
  }
  return array;
}

function getChosenShells() {
  const chosenShells = [];
  for (const el of document.getElementsByClassName("shellOption")) {
    if (el.checked === true) {
      chosenShells.push(el.value);
    }
  }
  return chosenShells;
}

const elem = {};
function updateSearch() {
  const strings = {
    "invocation": elem.command.value,
    "description": elem.description.value,
    "componentCommands": elem.componentCommands.value,
    "exampleOutput": elem.exampleOutput.value,
    "links": elem.links.value
  };
  const componentCommandsList = noWhiteSpace(
    strings.componentCommands.split(" ")
  );
  const chosenShellsList = getChosenShells();
  const search = {
    "invocation": strings.invocation,
    "description": strings.description.trim(),
    "componentCommands": new Set(componentCommandsList),
    "exampleOutput": strings.exampleOutput,
    "links": strings.links,
    "shells": new Set(chosenShellsList)
  };
  const caseSensitive = {
    "description": elem.descriptionCaseSensitive.checked,
    "exampleOutput": elem.exampleOutputCaseSensitive.checked
  };
  const regex = {
    "invocation": elem.commandRegex.checked
  };

  const showField = {
    "invocation": true,
    "description": elem.toggleDescription.checked,
    "exampleOutput": elem.toggleExampleOutput.checked,
    "links": elem.toggleLinks.checked,
    "shell": elem.toggleShell.checked
  };
  const tree = document.createDocumentFragment();
  // Match the search text.
  for (const info of cmdInfo) {
    const match = {
      "invocation": matchCommand(
        search.invocation,
        info.invocation,
        regex.invocation
      ),
      "description": matchDescription(
        search.description,
        info.description,
        caseSensitive.description
      ),
      "componentCommands": matchComponentCommands(
        search.componentCommands,
        new Set(info.componentCommands)
      ),
      "exampleOutput": matchExampleOutput(
        search.exampleOutput,
        info.exampleOutput,
        caseSensitive.exampleOutput
      ),
      "links": matchLinks(search.links, info.links),
      "shell": matchShell(search.shells, info.shell)
    };
    const allMatch = Object.keys(match).every(function (x) {
      return match[x] === true;
    });
    // https://stackoverflow.com/questions/17117712/how-to-know-if-all-javascript-object-values-are-true
    if (allMatch) {
      // https://stackoverflow.com/questions/6234773/can-i-escape-html-special-chars-in-javascript
      const div = document.createElement("div");
      div.classList.add("single-cmd");
      if (showField.invocation === true) {
        const codeDiv = document.createElement("div");
        codeDiv.classList.add("copyOnClick");
        codeDiv.addEventListener("click", copyText);
        const code = document.createElement("code");
        const codeText = document.createTextNode(info.invocation);
        code.appendChild(codeText);
        codeDiv.appendChild(code);
        div.appendChild(codeDiv);
      }
      if (
        showField.exampleOutput === true &&
        info.exampleOutput !== undefined
      ) {
        const pre = document.createElement("pre");
        const samp = document.createElement("samp");
        const sampText = document.createTextNode(info.exampleOutput);
        samp.appendChild(sampText);
        pre.appendChild(samp);
        div.appendChild(pre);
      }
      if (showField.description === true) {
        const descriptionDiv = document.createElement("div");
        const description = document.createTextNode(info.description);
        descriptionDiv.appendChild(description);
        div.appendChild(descriptionDiv);
      }
      if (showField.links === true && info.links !== undefined) {
        const links = document.createElement("div");
        for (const link of info.links) {
          const thisLink = document.createElement("div");
          const thisAnchor = document.createElement("a");
          thisAnchor.setAttribute("href", link);
          const linkText = document.createTextNode(link);
          thisAnchor.appendChild(linkText);
          thisLink.appendChild(thisAnchor);
          links.appendChild(thisLink);
        }
        div.appendChild(links);
      }
      if (showField.shell === true) {
        const shellDiv = document.createElement("div");
        const shellNameText = document.createTextNode(info.shell);
        const shellName = document.createElement("code");
        shellName.appendChild(shellNameText);
        const shellText = document.createTextNode("shell: ");
        shellDiv.appendChild(shellText);
        shellDiv.appendChild(shellName);
        div.appendChild(shellDiv);
      }
      tree.appendChild(div);
    }
  }
  elem.output.replaceChildren(tree);
  return true;
}
function handleKeyUp() {
  // console.info(event.target);
  // Update search results.
  updateSearch();
}
function handleChange() {
  // Update search results.
  // console.info(event.target);
  updateSearch();
}
function selectAllShells() {
  // console.info(event.target);
  for (const el of document.getElementsByClassName("shellOption")) {
    el.checked = true;
  }
  updateSearch();
}
function selectNoShells() {
  // console.info(event.target);
  for (const el of document.getElementsByClassName("shellOption")) {
    el.checked = false;
  }
  updateSearch();
}

function validateSingleEntry(entry, i) {
  const mandatoryKeys = [
    "componentCommands",
    "description",
    "invocation",
    "shell"
  ];
  const optionalKeys = ["exampleOutput", "links", "uuid"];
  const allKeys = mandatoryKeys.concat(optionalKeys);
  const keyType = {
    "componentCommands": "object",
    "description": "string",
    "invocation": "string",
    "shell": "string",
    "exampleOutput": "string",
    "links": "object",
    "uuid": "string"
  };
  const arrayType = {
    componentCommands: "string",
    links: "string"
  };
  for (const key of allKeys) {
    const val = entry[key];
    console.assert(val !== "", "#%i: %s = %o", i, key, val);
    console.assert(val !== null, "#%i: %s = %o", i, key, val);
    if (val !== undefined) {
      console.assert(
        typeof val === keyType[key],
        "#%i: typeof %s = %s != %s",
        i,
        key,
        typeof val,
        keyType[key]
      );
      if (key in arrayType) {
        // Check each value in the array.
        console.assert(
          Array.isArray(val),
          "#%i: %s : Array.isArray(%o) === false",
          i,
          key,
          val
        );
        console.assert(
          val.length !== 0,
          "#%i: %s : %s.length === 0",
          i,
          key,
          key
        );
        for (const arrayVal of val) {
          console.assert(arrayVal !== "", "#%i: %o in %s", i, arrayVal, key);
          console.assert(arrayVal !== null, "#%i: %o in %s", i, arrayVal, key);
          console.assert(
            typeof arrayVal === arrayType[key],
            "#%i: typeof %o = %s != %s in %s",
            i,
            arrayVal,
            typeof arrayVal,
            arrayType[key],
            key
          );
        }
      }
    }
  }
  for (const key of mandatoryKeys) {
    const val = entry[key];
    console.assert(
      val !== undefined,
      "#%i: %s = %o, entry = %s",
      i,
      key,
      val,
      JSON.stringify(entry)
    );
  }
  for (const key in entry) {
    if (mandatoryKeys.includes(key) || optionalKeys.includes(key)) {
      continue;
    } else {
      // Important for e.g. catching misspellings of fields.
      console.error(`#${i}: unknown key '${key}'`);
    }
  }
}

function validateAll(cmdInfo) {
  // Validate data.
  const invocations = new Set([]);
  const uuids = new Set([]);
  for (let i = 0; i < cmdInfo.length; i++) {
    const info = cmdInfo[i];
    validateSingleEntry(info, i);
    if (invocations.has(info.invocation)) {
      console.warn(`Duplicate invocation: ${info.invocation}`);
    } else {
      invocations.add(info.invocation);
    }
    if (uuids.has(info.uuid)) {
      console.warn(`Duplicate UUID: ${info.uuid}`);
    } else if (info.uuid !== undefined) {
      uuids.add(info.uuid);
    }
  }
}

function runTests() {
  const matchCommandTests = [
    ["matchCommand", "", "ls", false, true], // Empty match strings always match
    ["matchCommand", "ls", "", false, false], // Empty candidate strings don't match
    ["matchCommand", "ls", "ls", false, true], // Exact match
    ["matchCommand", "ls", "ls ", false, true], // Prefix with whitespace
    ["matchCommand", "ls", " ls ", false, true], // Suffix match with whitespace
    ["matchCommand", "-sh", 'du -sh --exclude "./.*"', false, true] // Match flag
    // TODO: write more regex tests
  ];
  for (const matchCommandTest of matchCommandTests) {
    let funcName, match, candidate, useRegex, expectedValue;
    [funcName, match, candidate, useRegex, expectedValue] = matchCommandTest;
    const actualValue = matchCommand(match, candidate, useRegex);
    console.assert(
      actualValue === expectedValue,
      "%s(%s, %s, useRegex = %s) === %s !== %s",
      funcName,
      JSON.stringify(match),
      JSON.stringify(candidate),
      useRegex,
      actualValue,
      expectedValue
    );
  }

  const matchDescriptionTests = [
    ["matchDescription", "Print filenames", "Print filenames", false, true],
    ["matchDescription", "filename", "Print filenames", false, true],
    ["matchDescription", "files", "Print filenames", false, false],
    ["matchDescription", "filname", "Print filenames", false, false], // Mis-spelling
    ["matchDescription", "Print", "Print filenames", true, true],
    ["matchDescription", "print", "Print filenames", true, false] // Not the same case
  ];
  for (const matchDescriptionTest of matchDescriptionTests) {
    let funcName, match, candidate, caseSensitive, expectedValue;
    [funcName, match, candidate, caseSensitive, expectedValue] =
      matchDescriptionTest;
    const actualValue = matchDescription(match, candidate, caseSensitive);
    console.assert(
      actualValue === expectedValue,
      "%s(%s, %s, useRegex = %s) === %s !== %s",
      funcName,
      JSON.stringify(match),
      JSON.stringify(candidate),
      caseSensitive,
      actualValue,
      expectedValue
    );
  }

  const matchComponentCommandsTests = [
    ["matchComponentCommands", new Set(["ls"]), new Set(["ls"]), true],
    [
      "matchComponentCommands",
      new Set(["find", "file"]),
      new Set(["find", "file"]),
      true
    ],
    ["matchComponentCommands", new Set(["ls"]), new Set(["find"]), false],
    [
      "matchComponentCommands",
      new Set(["find"]),
      new Set(["find", "file"]),
      true
    ],
    [
      "matchComponentCommands",
      new Set(["find", "file"]),
      new Set(["find"]),
      false
    ]
  ];
  for (const matchComponentCommandsTest of matchComponentCommandsTests) {
    let funcName, match, candidate, expectedValue;
    [funcName, match, candidate, expectedValue] = matchComponentCommandsTest;
    const actualValue = matchComponentCommands(match, candidate);
    console.assert(
      actualValue === expectedValue,
      "%s(new Set(%s), new Set(%s)) === %s !== %s",
      funcName,
      JSON.stringify(Array.from(match)),
      JSON.stringify(Array.from(candidate)),
      actualValue,
      expectedValue
    );
  }

  const matchLinksTests = [
    ["matchLinks", "example.org", ["https://example.org"], true],
    ["matchLinks", "example.com", ["https://example.org"], false],
    [
      "matchLinks",
      "example.com",
      ["https://example.org", "https://example.org"],
      false
    ]
  ];
  for (const matchLinksTest of matchLinksTests) {
    let funcName, match, candidate, expectedValue;
    [funcName, match, candidate, expectedValue] = matchLinksTest;
    const actualValue = matchLinks(match, candidate);
    console.assert(
      actualValue === expectedValue,
      "%s(%s, %s) === %s !== %s",
      funcName,
      JSON.stringify(match),
      JSON.stringify(candidate),
      actualValue,
      expectedValue
    );
  }

  const matchShellTests = [
    ["matchShell", new Set(["bash", "PowerShell"]), "bash", true],
    ["matchShell", new Set(["bash", "PowerShell"]), "PowerShell", true],
    ["matchShell", new Set(["bash", "PowerShell"]), "zsh", false]
  ];
  for (const matchShellTest of matchShellTests) {
    let funcName, match, candidate, expectedValue;
    [funcName, match, candidate, expectedValue] = matchShellTest;
    const actualValue = matchShell(match, candidate);
    console.assert(
      actualValue === expectedValue,
      "%s(new Set(%s), %s) === %s !== %s",
      funcName,
      JSON.stringify(Array.from(match)),
      JSON.stringify(candidate),
      actualValue,
      expectedValue
    );
  }

  const shells = new Set(["bash", "PowerShell"]);
  console.assert(matchShell(shells, "bash") === true);
  console.assert(matchShell(shells, "PowerShell") === true);
  console.assert(matchShell(shells, "zsh") === false);
}

function exportJSON() {
  var filename = "personal-command-search.json";
  var jsonBlob = new Blob([JSON.stringify(cmdInfo)], {
    type: "application/json",
    name: filename
  });
  var tmpAnchor = document.createElement("a");
  tmpAnchor.href = URL.createObjectURL(jsonBlob);
  tmpAnchor.download = filename;
  tmpAnchor.click();
}

function loadCmds(evt) {
  var jsonString = evt.target.result;
  var newCmdInfo = JSON.parse(jsonString);
  cmdInfo = newCmdInfo;
  updateState();
}

function importJSON(evt) {
  var fileList = evt.target.files;
  var currentFile = fileList[0];
  var reader = new FileReader();
  reader.onload = loadCmds;
  reader.readAsText(currentFile);
}

let newCommandDialog = null;

function newCommandButtonHandler(evt) {
  newCommandDialog.showModal();
}

function parseComponentCommands(componentCommandsStr) {
  let trimmed = componentCommandsStr.trim();
  return trimmed.split(" ");
}

function parseLinks(linksStr) {
  var links = null;
  if (linksStr.trim() === '') {
    links = []
  } else {
    links = linksStr.split(/\r\n|\r|\n/);
  }
  return links;
}

function cancelNewCommand(evt) {
  evt.preventDefault(); // Don't refresh the page.
  newCommandDialog.close('cancel');
}

function saveNewCommand(evt) {
  evt.preventDefault(); // Don't refresh the page.
  if (!document.forms["newCommandForm"].reportValidity()) {
    // Force validation before saving the command.
    return false;
  }
  // Mandatory fields
  let newCmd = {
    shell: document.getElementById("newShell").value,
    invocation: document.getElementById("newCommand").value,
    description: document.getElementById("newDescription").value,
    componentCommands: parseComponentCommands(
      document.getElementById("newComponentCommands").value
    )
  };
  // Optional fields
  let exampleOutput = document.getElementById("newExampleOutput").value;
  if (exampleOutput !== "") {
    newCmd["exampleOutput"] = exampleOutput;
  }
  let links = parseLinks(document.getElementById("newLinks").value);
  if (links.length > 0) {
    newCmd["links"] = links;
  }
  // HTMLDialogElement.close(returnValue) must pass a string
  const newCmdStr = JSON.stringify(newCmd);
  newCommandDialog.close(newCmdStr);
  // TODO: use onbeforeunload to prompt before closing if not exported
  // https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeunload_event
}

function maybeSaveNewCommand(evt) {
  evt.preventDefault(); // We don't want to submit this fake form
  const returnStr = newCommandDialog.returnValue;
  if (returnStr === "") {
    // Cancelled, do nothing.
  } else if (returnStr === "cancel") {
    // Cancelled, do nothing.
  } else {
    const newCmd = JSON.parse(newCommandDialog.returnValue);
    validateSingleEntry(newCmd, cmdInfo.length);
    cmdInfo.push(newCmd);
    updateState();
  }
}

function updateState() {
  // Update things that depend on cmdInfo.
  const shellSet = new Set([]);
  const shellStats = {};
  for (const info of cmdInfo) {
    const key = info.shell;
    shellSet.add(key);
    if (shellStats[key] == undefined) {
      shellStats[key] = new Object();
    }
    const ss = shellStats[key];
    if (ss.nInvocations === undefined) {
      ss.nInvocations = 1;
    } else {
      ss.nInvocations++;
    }
    if (ss.componentCommands == undefined) {
      ss.componentCommands = new Set(info.componentCommands);
    } else {
      ss.componentCommands = ss.componentCommands.union(
        new Set(info.componentCommands)
      );
    }
  }
  const shells = Array.from(shellSet).sort(Intl.Collator().compare);
  elem.shellOptions.replaceChildren(); // Empty the div
  for (const shellName of shells) {
    const div = document.createElement("div");
    const input = document.createElement("input");
    input.setAttribute("type", "checkbox");
    input.checked = true;
    const label = document.createElement("label");
    input.setAttribute("value", shellName);
    input.classList.add("shellOption");
    input.onchange = handleChange;
    const code = document.createElement("code");
    const codeText = document.createTextNode(shellName);
    const stats = shellStats[shellName];
    const nInvocationsText = `${stats.nInvocations} invocations`;
    const nComponentCommandsText = `${stats.componentCommands.size} unique commands`;
    const statsText = document.createTextNode(
      ` (${nInvocationsText}, ${nComponentCommandsText})`
    );
    code.appendChild(codeText);
    const statsSpan = document.createElement("span");
    statsSpan.appendChild(statsText);
    label.appendChild(input);
    label.appendChild(code);
    label.appendChild(statsSpan);
    div.appendChild(label);
    elem.shellOptions.appendChild(div);
  }
  elem.allShells.addEventListener("click", selectAllShells);
  elem.noShells.addEventListener("click", selectNoShells);
  updateSearch();
}

function initialize() {
  // Look for necessary HTML elements.
  const classes = ["search", "IO"];
  for (const className of classes) {
    for (const el of document.getElementsByClassName(className)) {
      if (Object.hasOwn(elem, el.id)) {
        console.error(`Duplicate ID in class ${className}: ${el.id}`);
      } else {
        elem[el.id] = el;
      }
    }
  }
  // Register event handlers.
  elem.command.onkeyup = handleKeyUp;
  elem.commandRegex.onchange = handleChange;
  elem.description.onkeyup = handleKeyUp;
  elem.componentCommands.onkeyup = handleKeyUp;
  elem.exampleOutput.onkeyup = handleKeyUp;
  elem.links.onkeyup = handleKeyUp;
  elem.exampleOutputCaseSensitive.onchange = handleChange;
  elem.toggleExampleOutput.onchange = handleChange;
  elem.toggleLinks.onchange = handleChange;
  elem.descriptionCaseSensitive.onchange = handleChange;
  elem.toggleDescription.onchange = handleChange;
  elem.toggleShell.onchange = handleChange;
  elem.exportJSON.onclick = exportJSON;
  elem.importJSON.onchange = importJSON;
  const newCommandButton = document.getElementById("newCommandButton");
  newCommandButton.addEventListener("click", newCommandButtonHandler);
  newCommandDialog = document.getElementById("newCommandDialog");
  newCommandDialog.addEventListener("close", maybeSaveNewCommand);
  const saveNewCommandButton = document.getElementById("saveNewCommandButton");
  saveNewCommandButton.addEventListener("click", saveNewCommand);
  const cancelNewCommandButton = document.getElementById("cancelNewCommandButton");
  cancelNewCommandButton.addEventListener("click", cancelNewCommand);
  validateAll(cmdInfo);
  runTests();
  updateState();
}
window.onload = initialize;

var cmdInfo = [
  {
    "componentCommands": ["find", "file"],
    "description":
      "Print filename and file information for each file under current directory, recursively.",
    "invocation": "find . -type f -execdir file '{}' +",
    "links": [
      "https://stackoverflow.com/questions/21155287/shell-notation-find-type-f-exec-file",
      "https://stackoverflow.com/questions/20913198/why-are-the-backslash-and-semicolon-required-with-the-find-commands-exec-optio",
      "https://man7.org/linux/man-pages/man1/find.1.html#EXAMPLES"
    ],
    "shell": "bash",
    "uuid": "70ec2ed5-1d68-4877-b608-36068580d2c7"
  },
  {
    "componentCommands": ["find", "file"],
    "description":
      "Print filename and file information for each file under current directory, excluding git repositories.",
    "invocation": "find . -name '*.git' -prune -o -type f -execdir file '{}' +",
    "links": [
      "https://stackoverflow.com/questions/1489277/how-to-use-prune-option-of-find-in-sh",
      "https://unix.stackexchange.com/questions/109900/find-prune-does-not-ignore-specified-path"
    ],
    "shell": "bash",
    "uuid": "267f5da8-ac81-4df4-b3a8-cd8aa99d4d1d"
  },
  {
    "componentCommands": ["head"],
    "description":
      "Create a file of given size (10 megabyte) full of ASCII NULs.",
    "invocation": "head --bytes=10MB /dev/zero > ./bigfile",
    "links": [
      "https://ostechnix.com/create-files-certain-size-linux/",
      "https://www.baeldung.com/linux/create-file-of-given-size#using-the-head-and-tail-commands",
      "https://www.gnu.org/software/coreutils/manual/html_node/head-invocation.html"
    ],
    "shell": "bash",
    "uuid": "00e7daf1-0ec4-49b7-b704-ab4ddbcda771"
  },
  {
    "componentCommands": ["head"],
    "description":
      "Create a binary file of given size (10 megabyte) full of random bytes.",
    "invocation": "head --bytes=10MB /dev/urandom > ./bigfile",
    "links": [
      "https://unix.stackexchange.com/questions/33629/how-can-i-populate-a-file-with-random-data",
      "https://superuser.com/questions/470949/how-do-i-create-a-1gb-random-file-in-linux",
      "https://www.gnu.org/software/coreutils/manual/html_node/head-invocation.html"
    ],
    "shell": "bash",
    "uuid": "b767de89-654e-4322-b751-a023c3362d53"
  },
  {
    "componentCommands": ["texdoc"],
    "description": "List all matching documentation files for 'siunitx'",
    "exampleOutput":
      " 1 /usr/share/texlive/texmf-dist/doc/latex/siunitx/siunitx.pdf\n   = Package documentation\n 2 /usr/share/texlive/texmf-dist/doc/latex/siunitx/README.md\n   = Readme\nEnter number of file to view, RET to view 1, anything else to skip:\n",
    "invocation": "texdoc --list --showall siunitx",
    "links": [
      "https://commandmasters.com/commands/texdoc-common/",
      "https://tex.stackexchange.com/questions/646669/how-to-get-texdoc-to-return-a-particular-document"
    ],
    "shell": "bash",
    "uuid": "6f1c574e-9500-4656-88e0-77755721a1d7"
  },
  {
    "componentCommands": ["xclip"],
    "description": "Save copied image to file.",
    "invocation": "xclip -selection clipboard -target image/png -out > out.png",
    "links": [
      "http://unix.stackexchange.com/questions/145131/copy-image-from-clipboard-to-file",
      "http://ubuntuforums.org/showthread.php?t=1335075"
    ],
    "shell": "bash",
    "uuid": "5a413ea5-d4f0-46d9-b7c8-b7170a74b847"
  },
  {
    "componentCommands": ["do", "done", "for", "mkdir", "pdfimages"],
    "description":
      "For each file ending with '.pdf' in the current directory, extract the images from the pdf file into a new directory with the name of the file stripped of '.pdf'.",
    "invocation":
      'for f in *.pdf; do dir="${f%.*}"; mkdir -p "$dir" && pdfimages -png -j "$f" "$dir/$dir"; done',
    "shell": "bash",
    "uuid": "6c0081a3-5c10-4cdf-826b-1bd778ae8ef0"
  },
  {
    "componentCommands": ["getconf"],
    "description":
      "Display the word size of the kernel, e.g. 32-bit or 64-bit.",
    "exampleOutput": "64\n",
    "invocation": "getconf LONG_BIT",
    "links": [
      "http://www.cyberciti.biz/faq/linux-how-to-find-if-processor-is-64-bit-or-not/",
      "http://stackoverflow.com/questions/10137880/need-help-32-bit-64-bit-check-for-linux",
      "http://superuser.com/questions/412024/is-my-system-64-bit",
      "http://lists.us.dell.com/pipermail/linux-poweredge/2011-February/044344.html"
    ],
    "shell": "bash",
    "uuid": "fe1bd5ee-ae26-4abd-85a6-09be801f9f2b"
  },
  {
    "componentCommands": ["gzip"],
    "description":
      "Compress a file using gzip without removing the original file.",
    "invocation": "gzip < file > file.gz",
    "links": [
      "https://lists.gnu.org/archive/html/info-gnu/2013-06/msg00003.html",
      "https://unix.stackexchange.com/questions/46786/how-to-tell-gzip-to-keep-original-file",
      "https://bugs.debian.org/cgi-bin/bugreport.cgi?bug=240539"
    ],
    "shell": "bash",
    "uuid": "b70da7de-745f-4774-93eb-6eb034ccbd57"
  },
  {
    "componentCommands": ["nproc"],
    "description":
      "Returns the number of processors / CPU cores available on this machine.",
    "exampleOutput": "4\n",
    "invocation": "nproc",
    "links": [
      "https://www.gnu.org/software/coreutils/manual/html_node/nproc-invocation.html",
      "http://stackoverflow.com/questions/6481005/how-to-obtain-the-number-of-cpus-cores-in-linux-from-the-command-line",
      "http://stackoverflow.com/questions/13875081/difference-between-nproc-and-ulimit"
    ],
    "shell": "bash",
    "uuid": "d67df423-d4c2-4a24-b83c-c494f94bdb75"
  },
  {
    "componentCommands": ["awk", "grep", "lscpu"],
    "description":
      "Display name of hardware's CPU architecture, e.g. x86_64 for 64-bit Intel processors and i686 for 32-bit Intel processors.",
    "exampleOutput": "x86_64\n",
    "invocation": "lscpu | grep '^Architecture:' | awk '{print $2}'",
    "links": [
      "https://stackoverflow.com/questions/7066625/how-to-find-the-linux-processor-chip-architecture/22100700",
      "http://www.cyberciti.biz/faq/lscpu-command-find-out-cpu-architecture-information/",
      "https://man7.org/linux/man-pages/man1/lscpu.1.html"
    ],
    "shell": "bash",
    "uuid": "101630e8-efc4-4566-bbc8-78e6ac76120f"
  },
  {
    "componentCommands": ["findmnt"],
    "description": "Show filesystem information for root directory.",
    "exampleOutput":
      "TARGET\n  SOURCE         FSTYPE OPTIONS\n/ /dev/nvme0n1p2 ext4   rw,relatime,stripe=64\n",
    "invocation": "findmnt /",
    "shell": "bash"
  },
  {
    "componentCommands": ["findmnt"],
    "description": "List all filesystems.",
    "invocation": "findmnt --all",
    "shell": "bash"
  },
  {
    "componentCommands": ["encguess"],
    "description":
      "Guess / infer character encoding of all files ending in '.txt'.",
    "invocation": "encguess *.txt",
    "links": [
      "https://stackoverflow.com/questions/805418/how-can-i-find-encoding-of-a-file-via-a-script-on-linux",
      "https://manpages.debian.org/bullseye/perl/encguess.1.en.html"
    ],
    "shell": "bash"
  },
  {
    "componentCommands": ["dos2unix"],
    "description":
      "Inspect text files for encoding information including line breaks, byte order mark (BOM), and text/binary.",
    "exampleOutput":
      "    6       0       0  no_bom    text    dos.txt\n    0       6       0  no_bom    text    unix.txt\n    0       0       6  no_bom    text    mac.txt\n    6       6       6  no_bom    text    mixed.txt\n   50       0       0  UTF-16LE  text    utf16le.txt\n    0      50       0  no_bom    text    utf8unix.txt\n   50       0       0  UTF-8     text    utf8dos.txt\n    2     418     219  no_bom    binary  dos2unix.exe",
    "invocation": "dos2unix --info *",
    "links": [
      "https://man.archlinux.org/man/dos2unix.1.en#i_FLAGS_,",
      "https://manpages.debian.org/stable/dos2unix/dos2unix.1.en.html#i_FLAGS_,"
    ],
    "shell": "bash"
  },
  {
    "componentCommands": ["iconv"],
    "description": "List all encodings iconv can handle.",
    "invocation": "iconv --list",
    "shell": "bash"
  },
  {
    "componentCommands": ["iconv"],
    "description": "Convert from little-endian UTF-16 to UTF-8.",
    "invocation":
      "iconv --from-code UTF-16LE --to-code UTF-8 utf16.txt > utf8.txt",
    "shell": "bash"
  },
  {
    "componentCommands": ["lscpu", "jq"],
    "description": "Get CPU architecture by parsing JSON output of lscpu.",
    "exampleOutput": "x86_64\n",
    "invocation":
      "lscpu --json | jq -r '.lscpu[] | select(.field==\"Architecture:\").data'",
    "shell": "bash"
  },
  {
    "componentCommands": ["lscpu", "jq"],
    "description": "Get CPU model by parsing JSON output of lscpu.",
    "exampleOutput": "11th Gen Intel(R) Core(TM) i7-1185G7 @ 3.00GHz\n",
    "invocation":
      "lscpu --json | jq -r '.lscpu[] | select(.field==\"Model name:\").data'",
    "shell": "bash"
  },
  {
    "componentCommands": ["readlink", "xargs", "basename"],
    "description": "Get driver names for all network interfaces.",
    "exampleOutput": "e1000e\niwlwifi\n",
    "invocation":
      "readlink /sys/class/net/*/device/driver | xargs -L 1 basename",
    "shell": "bash",
    "uuid": "80a480e5-8898-462c-910b-2bede6507e19"
  },
  {
    "componentCommands": ["find"],
    "description": "Find files in your home directory that you don't own.",
    "invocation": "find $HOME ! -user $USER",
    "shell": "bash",
    "uuid": "2b0656bc-9ea5-466b-8734-dcc1570be067"
  },
  {
    "componentCommands": ["espeak", "ping", "sed"],
    "description":
      "Generates audible voice that says 'ping' every time it gets an ICMP ECHO_RESPONSE, sent in intervals of 2 seconds.",
    "invocation":
      "ping -i 2 localhost | sed --unbuffered 's/.*/ping/' | espeak",
    "links": ["http://ftp.arl.mil/mike/ping.html"],
    "shell": "bash",
    "uuid": "07248c2f-4809-4b19-9ff0-6fa8e554b8f6"
  },
  {
    "componentCommands": ["jobs", "kill"],
    "description":
      "Kill stopped jobs. Bash-specific because of `jobs -p' to list process IDs.",
    "invocation": "kill $(jobs -ps)",
    "links": [
      "http://serverfault.com/questions/240155/how-can-i-kill-all-stopped-jobs",
      "http://superuser.com/a/228926/219809",
      "http://ubuntuforums.org/showthread.php?t=1954090&s=c408c62db23afe753dfcfd40f1a86e32&p=11825162#post11825162"
    ],
    "shell": "bash",
    "uuid": "dbadb0c9-5590-46af-b846-095c44a66e2c"
  },
  {
    "componentCommands": ["mkdir", "unzip"],
    "description":
      "Make a new empty directory and unzip a ZIP archive into that directory.",
    "invocation": "mkdir output; unzip my-zip-file.zip -d output",
    "shell": "bash",
    "uuid": "ea0ee52c-0dc4-44df-8a4d-2db6bf83634e"
  },
  {
    "componentCommands": ["find"],
    "description":
      "Find executables under current directory. Does not follow symbolic links.",
    "invocation": "find . -type f -executable -print",
    "links": [
      "http://stackoverflow.com/questions/4458120/unix-find-search-for-executable-files",
      "http://serverfault.com/questions/381034/find-executables",
      "http://unix.stackexchange.com/questions/166674/how-do-i-search-for-every-file-with-executable-permission-x-in-my-system",
      "http://lists.gnu.org/archive/html/bug-findutils/2005-12/msg00058.html"
    ],
    "shell": "bash",
    "uuid": "c2172098-7e38-43ff-9ab7-30c964f80861"
  },
  {
    "componentCommands": ["find"],
    "description": "Find non-executable files recursively.",
    "invocation": "find . -type f \\! -executable -print",
    "shell": "bash"
  },
  {
    "componentCommands": ["echo", "parallel", "sleep"],
    "description": "Run three different `sleep` commands in parallel.",
    "invocation":
      "parallel -j 3 -- \"sleep 2; echo '1st'\" \"sleep 1; echo '2nd'\" \"echo '3rd'\"",
    "shell": "bash",
    "uuid": "a54b30ce-e62a-41b8-800c-c5f21c999bd6"
  },
  {
    "componentCommands": ["curl"],
    "description": "Show external IP address using http://ifconfig.me website.",
    "invocation": "curl --proto https ifconfig.me",
    "links": [
      "http://askubuntu.com/questions/95910/command-for-determining-my-public-ip",
      "http://unix.stackexchange.com/questions/22615/how-can-i-get-my-external-ip-address-in-bash"
    ],
    "shell": "bash",
    "uuid": "9cb1510d-eca5-404f-94fc-e5113bdbbc54"
  },
  {
    "componentCommands": ["cp"],
    "description": "Make a copy of a symbolic link (symlink).",
    "invocation": "cp --no-dereference mylink mylink-copy",
    "links": [
      "https://superuser.com/questions/138587/how-to-copy-symbolic-links",
      "https://unix.stackexchange.com/questions/56084/how-do-i-copy-a-symbolic-link",
      "https://www.gnu.org/software/coreutils/manual/html_node/cp-invocation.html#index-_002d_002dno_002ddereference"
    ],
    "shell": "bash",
    "uuid": "8be325fc-1d76-46f1-8e13-514882230cbd"
  },
  {
    "componentCommands": ["du", "sort"],
    "description":
      "See directories taking up the most space in user's home directory. Human-readable size (e.g. 8M for 8 megabytes).",
    "invocation":
      "du --human --max-depth=1 $HOME | sort --reverse --human-numeric-sort",
    "shell": "bash",
    "uuid": "64c52fa6-cdde-4e8b-9671-1b74978cdc2c"
  },
  {
    "componentCommands": ["safecopy"],
    "description":
      "Copy a disc (such as a CD or DVD) to a disk image (ISO), re-reading or skipping bad sectors instead of failing when an input/output error is encountered. This makes an iso from the /dev/dvd device file.",
    "invocation": "safecopy /dev/dvd disc.iso",
    "links": [
      "https://askubuntu.com/questions/138152/software-to-copy-a-scratched-cd-dvd-blueray-to-an-iso-file"
    ],
    "shell": "bash",
    "uuid": "7761f0b2-8e5f-4b63-8360-7af0a8c16576"
  },
  {
    "componentCommands": ["uname"],
    "description":
      "Determine which architecture the Linux kernel is configured for; may not be the same as the actual CPU architecture. For example, an Intel i686 kernel can run on an Intel x86_64 processor, but its RAM will be limited unless the kernel has PAE is enabled. Short flag is `-m'.",
    "exampleOutput": "x86_64\n",
    "invocation": "uname --machine",
    "links": [
      "http://www.cyberciti.biz/faq/linux-how-to-find-if-processor-is-64-bit-or-not/",
      "http://stackoverflow.com/questions/2565282/difference-between-machine-hardware-and-hardware-platform",
      "https://www.ibm.com/developerworks/community/blogs/58e72888-6340-46ac-b488-d31aa4058e9c/entry/know_about_your_linux_system_using_uname_command77?lang=en"
    ],
    "shell": "bash",
    "uuid": "f69252a3-a58b-48bc-9fd2-89e9e5d29f94"
  },
  {
    "componentCommands": ["ps"],
    "description": "Show information about parent process.",
    "exampleOutput":
      "UID          PID    PPID  C STIME TTY          TIME CMD\nusernam+  157147    3627  0 11:23 ?        00:00:00 /usr/bin/xterm\n",
    "invocation": "ps -p $PPID",
    "shell": "bash",
    "uuid": "fdcc1f87-af46-4834-9ce2-b1ac27a3f070"
  },
  {
    "componentCommands": ["grep"],
    "description":
      "Recursively find text files ending in '.txt' that contain the DOS carriage return (octal 015, hexadecimal x0D). Uses ANSI-C single quotes instead of a literal carriage return character.",
    "invocation":
      "grep --binary --recursive --files-with-matches $'\\r' --include='*.txt'",
    "links": [
      "https://unix.stackexchange.com/questions/79702/how-to-test-whether-the-file-is-crlf-or-lf-without-modyfing-it",
      "http://unix.stackexchange.com/a/79713",
      "http://vsingleton.blogspot.com/2009/03/grep-using-octal-patterns-and-avoid.html"
    ],
    "shell": "bash",
    "uuid": "fd1ea283-a1ec-4997-9806-464a5a715624"
  },
  {
    "componentCommands": ["pwd", "tr", "xsel"],
    "description": "Copy working directory to clipboard.",
    "invocation": "pwd | tr -d '\\n' | xsel -b",
    "links": [
      "http://www.commandlinefu.com/commands/view/9766/copy-currentworking-directory-to-clipboard"
    ],
    "shell": "bash",
    "uuid": "6f5fdd18-b781-4b22-8b7f-7ad3066b912a"
  },
  {
    "componentCommands": ["find"],
    "description":
      "Find all directory paths matching '*doc*' in `/usr/share`, except the paths under `/usr/share/doc`. This can help find documentation that is in an unusual place.",
    "invocation":
      "find '/usr/share' -path '/usr/share/doc' -prune -o -type d -name '*doc*'",
    "links": [
      "https://stackoverflow.com/questions/1489277/how-to-use-prune-option-of-find-in-sh",
      "https://stackoverflow.com/questions/4210042/exclude-directory-from-find-command",
      "http://www.theunixschool.com/2012/07/find-command-15-examples-to-exclude.html",
      "http://www.liamdelahunty.com/tips/linux_find_exclude_multiple_directories.php"
    ],
    "shell": "bash",
    "uuid": "0e72bbcc-c43e-446c-bb83-ac0f00a4076b"
  },
  {
    "componentCommands": ["aoss", "siggen"],
    "description":
      "Interactive audio signal / tone / sound generator with various waveforms, including sine, triangle, square, and sawtooth (stereo mode).",
    "invocation": "aoss siggen -2",
    "links": [
      "https://inconsolation.wordpress.com/2015/01/18/siggen-much-to-see-much-to-hear/",
      "https://stackoverflow.com/questions/5109038/linux-sine-wave-audio-generator",
      "https://unix.stackexchange.com/questions/245897/audio-tone-sine-generator-with-frequency-gauge"
    ],
    "shell": "bash",
    "uuid": "3f6a786a-9a20-43c6-acb9-1b782757e78f"
  },
  {
    "componentCommands": ["cd", "mktemp", "mogrify", "rmdir", "unzip", "zip"],
    "description":
      "Resize all the images in an OpenDocument (ODT) file to 10% of their former size. Stores location of tempfile in $dir shell variable, which is not entirely safe.",
    "invocation":
      'dir="$(mktemp -d --tmpdir=.)" && unzip -q file.odt -d "$dir" && cd "$dir" && mogrify -resize 10x10% Pictures/* && zip -qrm ../resized.odt * && cd .. && rmdir "$dir"',
    "shell": "bash",
    "uuid": "361f2d3b-beeb-4a29-bcf6-070edaec63a9"
  },
  {
    "componentCommands": ["mv"],
    "description":
      "Move all files in the current directory to the parent directory, including hidden files (dotfiles). Preserves inodes. Excludes the current directory and parent directory and includes filenames starting with two dots.",
    "invocation": "mv -- * .[!.] .??* ../",
    "links": [
      "http://stackoverflow.com/questions/20192070/how-to-move-all-files-including-hidden-files-into-parent-directory-via",
      "http://unix.stackexchange.com/questions/6393/how-do-you-move-all-files-including-hidden-from-one-directory-to-another",
      "http://superuser.com/questions/62141/how-to-move-all-files-from-current-directory-to-upper-directory",
      "http://superuser.com/questions/88202/how-do-i-move-files-and-directories-to-the-parent-folder-in-linux/542214",
      "http://serverfault.com/questions/122233/how-to-recursively-move-all-files-including-hidden-in-a-subfolder-into-a-paren",
      "https://askubuntu.com/questions/259383/how-can-i-get-mv-or-the-wildcard-to-move-hidden-files/259386"
    ],
    "shell": "bash",
    "uuid": "510c302e-fb2b-4a2a-898f-b98ba0326453"
  },
  {
    "componentCommands": ["find", "mv"],
    "description":
      "Move all files and folders in the current directory to the parent directory, including hidden files and folders (dotfiles). Preserves inodes.",
    "invocation": "find . -mindepth 1 -maxdepth 1 -exec mv -t ../ -- '{}' \\+",
    "links": [
      "http://stackoverflow.com/questions/20192070/how-to-move-all-files-including-hidden-files-into-parent-directory-via",
      "http://unix.stackexchange.com/questions/6393/how-do-you-move-all-files-including-hidden-from-one-directory-to-another",
      "http://superuser.com/questions/62141/how-to-move-all-files-from-current-directory-to-upper-directory",
      "http://superuser.com/questions/88202/how-do-i-move-files-and-directories-to-the-parent-folder-in-linux/542214",
      "http://serverfault.com/questions/122233/how-to-recursively-move-all-files-including-hidden-in-a-subfolder-into-a-paren"
    ],
    "shell": "bash",
    "uuid": "19e51b80-ceb4-4a9a-a5f8-fd8e8bf8101d"
  },
  {
    "componentCommands": ["date"],
    "description":
      "Show the date and time in a different timezone without changing the system time zone. Example is for Buenos Aires, Argentina.",
    "exampleOutput": "Thu Jan  1 00:00:00 ART 1970\n",
    "invocation": "TZ=America/Argentina/Buenos_Aires date",
    "links": [
      "https://unix.stackexchange.com/questions/48101/how-can-i-have-date-output-the-time-from-a-different-timezone",
      "http://www.cyberciti.biz/tips/date-command-set-tz-environment-variable.html",
      "https://en.wikipedia.org/wiki/List_of_tz_database_time_zones"
    ],
    "shell": "bash",
    "uuid": "e47766a1-e332-4cd3-9e42-573d0bcd09de"
  },
  {
    "componentCommands": ["grep"],
    "description": "Match words that contain 'ae'.",
    "invocation": "grep 'ae' /usr/share/dict/words",
    "shell": "bash"
  },
  {
    "componentCommands": ["grep"],
    "description": "Case-insensitive match for 'error' in system log file.",
    "invocation": "grep -i 'error' /var/log/syslog",
    "shell": "bash"
  },
  {
    "componentCommands": ["grep"],
    "description":
      "Grep literal, raw strings without having to escape everything.",
    "invocation": "grep --fixed-strings '[1]' /var/log/syslog",
    "shell": "bash"
  },
  {
    "componentCommands": ["grep"],
    "description":
      "Grep literal, raw strings without having to escape everything (short flags).",
    "invocation": "grep -F '[1]' /var/log/syslog",
    "shell": "bash"
  },
  {
    "componentCommands": ["grep"],
    "description":
      "Grep the files under the /etc/ directory for the current machine's hostname.",
    "invocation": "grep $HOSTNAME /etc/*",
    "shell": "bash"
  },
  {
    "componentCommands": ["grep"],
    "description":
      "Grep the files under the /etc/ directory for the current machine's hostname, showing only filename.",
    "invocation": "grep --files-with-matches $HOSTNAME /etc/*",
    "shell": "bash"
  },
  {
    "componentCommands": ["grep"],
    "description":
      "Grep the files under the /etc/ directory for the current machine's hostname, showing only filename (short flags version).",
    "invocation": "grep -l $HOSTNAME /etc/*",
    "shell": "bash"
  },
  {
    "componentCommands": ["grep"],
    "description":
      "Grep the /etc/ directory recursively for the current machine's hostname.",
    "invocation": "grep --recursive $HOSTNAME /etc/",
    "shell": "bash"
  },
  {
    "componentCommands": ["grep"],
    "description":
      "Grep the /etc/ directory recursively for the current machine's hostname (short flags version).",
    "invocation": "grep -r $HOSTNAME /etc/",
    "shell": "bash"
  },
  {
    "componentCommands": ["grep"],
    "description":
      "Grep the /etc/ directory recursively for words matching current machine's hostname.",
    "invocation": "grep --recursive --word-regexp $HOSTNAME /etc/",
    "shell": "bash"
  },
  {
    "componentCommands": ["grep"],
    "description":
      "Grep the /etc/ directory recursively for words matching current machine's hostname (short flags version).",
    "invocation": "grep -rw $HOSTNAME /etc/",
    "shell": "bash"
  },
  {
    "componentCommands": ["grep"],
    "description":
      "Grepping the system dictionary for words starting with 's'\nand containing 'm' and 'b';\nthis is how samba was named.",
    "invocation": "grep -E -i '^S.*M.*B' /usr/share/dict/words",
    "links": ["http://www.rxn.com/services/faq/smb/samba.history.txt"],
    "shell": "bash"
  },
  {
    "componentCommands": ["grep", "sort"],
    "description":
      "Generate a list of unique Icon fields in desktop files, not showing filenames.",
    "invocation":
      "grep --no-filename --recursive 'Icon=' --include='*.desktop' /usr/share/applications/ ~/.local/share/applications | sort --unique",
    "shell": "bash"
  },
  {
    "componentCommands": ["grep", "sort"],
    "description":
      "Generate a list of unique Icon fields in desktop files, not showing filenames (short flags).",
    "invocation":
      "grep -hr 'Icon=' --include='*.desktop' /usr/share/applications/ ~/.local/share/applications | sort -u",
    "shell": "bash"
  },
  {
    "componentCommands": ["grep", "less"],
    "description":
      "Highlight non-ASCII characters (e.g. Unicode) in a text file and give the line number they are on.",
    "invocation":
      "grep --line-number --perl-regexp '[^[:ascii:]]' --color=always /usr/share/dict/words | less --RAW-CONTROL-CHARS",
    "links": [
      "http://lists.gnu.org/archive/html/bug-gnu-utils/2006-03/msg00000.html",
      "https://groups.google.com/forum/#!topic/comp.unix.programmer/Auge3Bz4iCA",
      "https://stackoverflow.com/questions/3001177/how-do-i-grep-for-all-non-ascii-characters-in-unix",
      "http://superuser.com/questions/417305/how-can-i-identify-non-ascii-characters-from-the-shell"
    ],
    "shell": "bash",
    "uuid": "7b93628a-938d-4227-a88c-9d697f55fac4"
  },
  {
    "componentCommands": ["grep", "less"],
    "description":
      "Highlight non-ASCII characters (e.g. Unicode) in a text file and give the line number they are on (short flags version).",
    "invocation":
      "grep -nP '[^[:ascii:]]' --color=always /usr/share/dict/words | less -R",
    "links": [
      "http://lists.gnu.org/archive/html/bug-gnu-utils/2006-03/msg00000.html",
      "https://groups.google.com/forum/#!topic/comp.unix.programmer/Auge3Bz4iCA",
      "https://stackoverflow.com/questions/3001177/how-do-i-grep-for-all-non-ascii-characters-in-unix",
      "http://superuser.com/questions/417305/how-can-i-identify-non-ascii-characters-from-the-shell"
    ],
    "shell": "bash",
    "uuid": "fe5488ea-da5a-4cb2-b95a-e26336c96a4f"
  },
  {
    "componentCommands": ["find", "wc"],
    "description":
      "Count number of files in this directory and all subdirectories on current filesystem. Works even if filenames contain newlines.",
    "invocation": "find . -xdev -type f -printf '.' | wc -c",
    "links": [
      "http://stackoverflow.com/questions/27942749/return-number-of-files-in-a-directory-to-a-variable-in-a-shell-scrtpt",
      "http://askubuntu.com/questions/711293/how-to-count-the-total-number-of-files-folders-on-a-system",
      "http://superuser.com/questions/689293/is-there-anything-faster-than-find-wc-l-to-count-files-in-a-directory",
      "http://stackoverflow.com/questions/9157138/recursively-counting-files-in-a-linux-directory",
      "http://www.commandlinefu.com/commands/view/4/count-files-beneath-current-directory-including-subfolders"
    ],
    "shell": "bash",
    "uuid": "40cbcc05-dedf-417c-ad0b-ce5f252ed141"
  },
  {
    "componentCommands": ["find"],
    "description":
      "Find broken symbolic links (symlinks) in current directory and below. ",
    "invocation": "find . -xtype l",
    "links": [
      "https://unix.stackexchange.com/questions/34248/how-can-i-find-broken-symlinks",
      "https://serverfault.com/questions/295929/how-do-i-find-and-report-on-broken-symbolic-links-automatically",
      "http://www.commandlinefu.com/commands/view/10742/find-broken-symlinks"
    ],
    "shell": "bash",
    "uuid": "d1963f6a-dd27-48f5-8663-8ebe6ff5dae8"
  },
  {
    "componentCommands": ["getconf"],
    "description":
      "Returns the number of processors / CPU cores available on this machine.",
    "exampleOutput": "4\n",
    "invocation": "getconf _NPROCESSORS_ONLN",
    "links": [
      "http://stackoverflow.com/questions/4586405/get-number-of-cpus-in-linux-using-c",
      "http://stackoverflow.com/questions/6481005/how-to-obtain-the-number-of-cpus-cores-in-linux-from-the-command-line"
    ],
    "shell": "bash",
    "uuid": "df4be8b4-833e-4e48-af1a-e03916833409"
  },
  {
    "componentCommands": ["chsh", "which"],
    "description": "Change the default shell of the current user to zsh.",
    "invocation": "chsh --shell $(which zsh) $USER",
    "links": [
      "https://wiki.archlinux.org/index.php/Zsh#Making_Zsh_your_default_shell"
    ],
    "shell": "bash",
    "uuid": "7a49c243-47f7-4a5a-a42a-87357d134b0d"
  },
  {
    "componentCommands": ["ls"],
    "description":
      "List hidden files and folders (dotfiles). Uses bash globbing.",
    "invocation": "ls --directory -- .[^.]*",
    "links": [
      "http://www.gnu.org/software/coreutils/faq/coreutils-faq.html#ls-_002da-_002a-does-not-list-dot-files",
      "http://stackoverflow.com/a/699071/1608986",
      "http://stackoverflow.com/a/2550243/1608986"
    ],
    "shell": "bash",
    "uuid": "924d5f3a-512b-4c0e-8219-6a47002d9014"
  },
  {
    "componentCommands": ["xset"],
    "description":
      "Turn off the monitor; make the display go dark; blank the screen until the mouse is moved or a key is pressed.",
    "invocation": "xset dpms force standby",
    "links": [
      "http://magnatecha.com/turn-off-display-from-linux-command-line/",
      "http://superuser.com/a/66923/219809",
      "http://www.cyberciti.biz/faq/linux-how-to-find-if-processor-is-64-bit-or-not/",
      "http://tldp.org/HOWTO/Battery-Powered/methods.html#XF86",
      "https://wiki.archlinux.org/index.php/Display_Power_Management_Signaling#Modifying_DPMS_and_screensaver_settings_using_xset"
    ],
    "shell": "bash",
    "uuid": "5b791952-7792-4ca5-bb38-cf622f3cdc8a"
  },
  {
    "componentCommands": ["chmod"],
    "description": "Make home directory private from all other users.",
    "invocation": "chmod g-rwx,o-rwx $HOME",
    "links": [
      "https://askubuntu.com/questions/46501/why-can-other-users-see-the-files-in-my-home-folder",
      "https://superuser.com/questions/303910/ubuntu-default-access-mode-permissions-for-users-home-dir-home-user",
      "https://unix.stackexchange.com/questions/95897/permissions-755-on-home-user"
    ],
    "shell": "bash",
    "uuid": "2d031b99-6945-45bd-be31-71382d661d73"
  },
  {
    "componentCommands": ["apt-file"],
    "description":
      "Find all packages in apt repositories that match the pattern '/fftw3.h$', even if the package is not installed. Should return result 'libfftw3-dev'.",
    "exampleOutput":
      "libfftw3-dev: /usr/include/fftw3.h\nlibmkl-dev: /usr/include/mkl/fftw/fftw3.h\n",
    "invocation": "apt-file -x search '/fftw3.h$'",
    "shell": "bash",
    "uuid": "efd177f4-51e5-40cc-8c16-2720cb06d94e"
  },
  {
    "componentCommands": ["stat"],
    "description":
      "Show the time when `updatedb' was run to update the database for the `locate' command.",
    "exampleOutput": "2026-02-16 07:53:13.870631441 -0500\n",
    "invocation": "stat --format %y /var/lib/plocate/plocate.db",
    "shell": "bash",
    "uuid": "308423e6-95a4-4001-9e76-501ad79b2e93"
  },
  {
    "componentCommands": ["sudo", "iwlist"],
    "description": "List wireless access points",
    "invocation": "sudo iwlist scanning",
    "links": ["https://hewlettpackard.github.io/wireless-tools/Tools"],
    "shell": "bash"
  },
  {
    "componentCommands": ["find"],
    "description": "Find all files with 'cool' somewhere in the filename",
    "invocation": "find . -name  '*cool*'",
    "shell": "bash"
  },
  {
    "componentCommands": ["find"],
    "description":
      "Find all files with 'cool'/'COOL'/'CoOl' somewhere in the filename (case insensitive).",
    "invocation": "find . -iname  '*cool*'",
    "shell": "bash"
  },
  {
    "componentCommands": ["find"],
    "description":
      "Find all files ending in .html in current directory and subdirectories",
    "invocation": "find . -name '*.html'",
    "shell": "bash"
  },
  {
    "componentCommands": ["find"],
    "description": "Find vim swap files (e.g. .swp, .swo, .example.txt.swp):",
    "invocation": "find . -type f -name '*.sw?'",
    "shell": "bash"
  },
  {
    "componentCommands": ["find"],
    "description": "Find files with spaces in the filename.",
    "invocation": "find . -name '* *'",
    "shell": "bash"
  },
  {
    "componentCommands": ["find"],
    "description":
      "Find all files with world-readable, writable, and executable permissions.",
    "invocation": "find . -perm -a+rwx",
    "shell": "bash"
  },
  {
    "componentCommands": ["find"],
    "description": "Find directories that are world-writable.",
    "invocation": "find . -type d -perm -a+w",
    "shell": "bash"
  },
  {
    "componentCommands": ["find"],
    "description":
      "Find directories that aren't permissions 0775 (drwxr-xr-x).",
    "invocation": "find . -type d \\! -perm 0775",
    "shell": "bash"
  },
  {
    "componentCommands": ["find"],
    "description":
      "Find files or directories that are not writable in the current directory.",
    "invocation": "find . \\! -writable",
    "shell": "bash"
  },
  {
    "componentCommands": ["find"],
    "description":
      "Find files or directories that are not writable in the current directory. Not compliant with POSIX-standard `find` command.",
    "invocation": "find . -not -writable",
    "shell": "bash"
  },
  {
    "componentCommands": ["find", "chmod"],
    "description":
      "Find files or directories that are not writable and make them writable again.",
    "invocation": "find . \\! -writable -exec chmod --changes +w '{}' \\+",
    "shell": "bash"
  },
  {
    "componentCommands": ["find"],
    "description":
      "Find all files with world-readable (777) permissions, but skip symbolic links.",
    "invocation": "find . -not -type l -perm 777",
    "shell": "bash"
  },
  {
    "componentCommands": ["find", "sort"],
    "description": "Find directories and sort by permissions type.",
    "invocation": "find . -type d -printf '%m %p\\n' | sort",
    "shell": "bash"
  },
  {
    "componentCommands": ["ls"],
    "description":
      "Print long listing format, including permissions, for the /var/log directory.",
    "exampleOutput": "drwxr-xr-x 23 root root 4096 May 23 08:18 /var/log\n",
    "invocation": "ls -ld /var/log",
    "shell": "bash"
  },
  {
    "componentCommands": ["stat"],
    "description": "Print permissions of the /var/log directory.",
    "exampleOutput":
      "  File: ‘/var/log’\n  Size: 4096      \tBlocks: 8          IO Block: 4096   directory\nDevice: 801h/2049d\tInode: 30416373    Links: 23\nAccess: (0755/drwxr-xr-x)  Uid: (    0/    root)   Gid: (    0/    root)\nAccess: 2016-05-23 09:59:45.411033488 -0500\nModify: 2016-05-23 08:18:12.333311420 -0500\nChange: 2016-05-23 08:18:12.333311420 -0500\n Birth: -",
    "invocation": "stat /var/log",
    "shell": "bash"
  },
  {
    "componentCommands": ["stat"],
    "description": "Print permisisons in octal.",
    "invocation": "stat --format='%a %n' -- *",
    "links": [
      "https://askubuntu.com/questions/152001/how-can-i-get-octal-file-permissions-from-command-line"
    ],
    "shell": "bash"
  },
  {
    "componentCommands": ["stat"],
    "description":
      "Print permissions in octal, but also include the human-readable permissions.",
    "invocation": "stat --format='%a %A %n' -- *",
    "links": [
      "https://askubuntu.com/questions/152001/how-can-i-get-octal-file-permissions-from-command-line"
    ],
    "shell": "bash"
  },
  {
    "componentCommands": ["find"],
    "description":
      "Show human-readable and octal permissions of files recursively.",
    "invocation": 'find . -type f -printf "%m %M %f\\n"',
    "links": [
      "https://unix.stackexchange.com/questions/126040/convert-the-permissions-in-ls-l-output-to-octal"
    ],
    "shell": "bash"
  },
  {
    "componentCommands": ["find"],
    "description": "Find all files over a certain size (500MB in this case.)",
    "invocation": "find . -size +500M",
    "links": [
      "https://superuser.com/questions/204564/how-can-i-find-files-that-are-bigger-smaller-than-x-bytes",
      "https://unix.stackexchange.com/questions/638335/find-command-size-behavior"
    ],
    "shell": "bash"
  },
  {
    "componentCommands": ["find", "sort", "head"],
    "description": "Find smallest text files.",
    "invocation": "find . -name '*.txt' -printf '%s %f\\n' | sort -n | head",
    "shell": "bash"
  },
  {
    "componentCommands": ["rename"],
    "description":
      "Replace spaces with underscores for all filenames in current directory.",
    "invocation": "rename 'y/ /_/' -- *",
    "links": [
      "https://www.commandlinefu.com/commands/view/2518/replace-spaces-in-filenames-with-underscores"
    ],
    "shell": "bash"
  },
  {
    "componentCommands": ["rename"],
    "description":
      "Replace colons with dashes for filenames in current directory.",
    "invocation": "rename 's/:/-/g' -- *",
    "shell": "bash"
  },
  {
    "componentCommands": ["find", "rename"],
    "description": "Replace colons with dashes recursively.",
    "invocation": "find . -name \"*:*\" -exec rename 's/:/-/g' {} \\+",
    "shell": "bash"
  },
  {
    "componentCommands": ["find", "rename"],
    "description": "Remove colons from filenames recursively.",
    "invocation": "find . -name '*:*' -exec rename -n 's/://g' '{}' \\+",
    "shell": "bash"
  },
  {
    "componentCommands": ["rename"],
    "description": "Remove non-ASCII characters from filenames.",
    "invocation": "rename 's/[^\\x00-\\x7F]//g' -- *",
    "shell": "bash"
  },
  {
    "componentCommands": ["rename"],
    "description":
      "Replace non-ASCII characters in filenames with underscores ('_').",
    "invocation": "rename 's/[^\\x00-\\x7F]/_/g' -- *",
    "shell": "bash"
  },
  {
    "componentCommands": ["rename"],
    "description": "Rename all .jpeg files to .jpg.",
    "invocation": "rename 's/.jpeg/.jpg/' -- *.jpeg",
    "shell": "bash"
  },
  {
    "componentCommands": ["mv"],
    "description":
      "Rename 'file.txt' as 'file.csv' using bash brace expansion.",
    "invocation": "mv file.{txt,csv}",
    "links": [
      "https://www.gnu.org/software/bash/manual/html_node/Brace-Expansion.html"
    ],
    "shell": "bash"
  },
  {
    "componentCommands": ["cp"],
    "description":
      "Make a copy of 'myfile.txt' called 'myfile.txt.old' using bash brace expansion.",
    "invocation": "cp myfile.txt{,.old}",
    "links": [
      "http://www.shell-fu.org/lister.php?id=46",
      "https://www.gnu.org/software/bash/manual/html_node/Brace-Expansion.html"
    ],
    "shell": "bash"
  },
  {
    "componentCommands": ["grep"],
    "description":
      "Grepping the system dictionary for words starting with 's' and containing 'm' and 'b'; this is how samba was named:",
    "invocation": "grep -i '^s.*m.*b' /usr/share/dict/words",
    "links": [
      "http://web.archive.org/web/20200807045435/http://www.rxn.com/services/faq/smb/samba.history.txt",
      "https://sources.debian.org/src/samba/2%3A3.2.5-4lenny15/docs/history",
      "https://www.landley.net/history/mirror/linux/samba.history.txt"
    ],
    "shell": "bash"
  },
  {
    "componentCommands": ["grep"],
    "description":
      "Grep all three-letter words without vowels, e.g. 'brr', 'nth', Mrs'.",
    "invocation": 'grep -E -i "^[^aeiouy\']{3}$" /usr/share/dict/words',
    "shell": "bash"
  },
  {
    "componentCommands": ["grep"],
    "description": "Grep all words without vowels.",
    "invocation": "grep -iv '[aeiouy]' /usr/share/dict/words",
    "shell": "bash"
  },
  {
    "componentCommands": ["grep"],
    "description":
      "Grep words that can be spelled with hexadecimal alone, like 0xDEADBEEF.",
    "invocation": 'grep -E -i "^[a-fA-F]+$" /usr/share/dict/words',
    "links": [
      "https://en.wikipedia.org/wiki/Magic_number_%28programming%29#Magic_debug_values",
      "http://www.urbandictionary.com/define.php?term=0xDEADBEEF",
      "https://stackoverflow.com/questions/5907614/0xdeadbeef-vs-null"
    ],
    "shell": "bash"
  },
  {
    "componentCommands": ["grep"],
    "description": 'Grep for words that end in "gry"',
    "exampleOutput": "angry\ndemagogry\nhungry\n",
    "invocation": "grep -i '.*gry$' /usr/share/dict/words",
    "shell": "bash"
  },
  {
    "componentCommands": ["getconf"],
    "description": "Print maximum path length.",
    "exampleOutput": "4096\n",
    "invocation": "getconf PATH_MAX /",
    "shell": "bash"
  },
  {
    "componentCommands": ["echo"],
    "description":
      "Print operating system type (OS identifier). Available in bash but not POSIX standard.",
    "exampleOutput": "linux-gnu\n",
    "invocation": 'echo "$OSTYPE"',
    "shell": "bash"
  },
  {
    "componentCommands": ["uname"],
    "description": "Print operating system kernel name (OS identifier).",
    "exampleOutput": "Linux\n",
    "invocation": "uname --kernel-name",
    "shell": "bash"
  },
  {
    "componentCommands": ["uname"],
    "description":
      "Print operating system name (OS identifier). GNU-only extension.",
    "exampleOutput": "GNU/Linux\n",
    "invocation": "uname -o",
    "shell": "bash"
  },
  {
    "componentCommands": ["compgen"],
    "description": "List all signals.",
    "invocation": "compgen -A signal",
    "shell": "bash"
  },
  {
    "componentCommands": ["compgen"],
    "description": "See a list of all functions.",
    "invocation": "compgen -A function",
    "shell": "bash"
  },
  {
    "componentCommands": ["declare"],
    "description": "List of all shell functions, aliases, and variables.",
    "invocation": "declare",
    "shell": "bash"
  },
  {
    "componentCommands": ["type", "ls"],
    "description": "Identify what kind of command 'ls' is.",
    "exampleOutput": "ls is aliased to `ls --color=auto'\n",
    "invocation": "type ls",
    "shell": "bash"
  },
  {
    "componentCommands": ["type", "ls"],
    "description":
      "Print all the definitions of 'ls', including executables in $PATH, aliases, functions, and builtins.",
    "exampleOutput": "ls is aliased to `ls --color=auto'\nls is /bin/ls\n",
    "invocation": "type -a ls",
    "shell": "bash"
  },
  {
    "componentCommands": ["command", "ls"],
    "description":
      "Run the plain `ls' command instead of a shell function or alias called `ls'",
    "invocation": "command ls",
    "links": [
      "https://unix.stackexchange.com/questions/39291/run-a-command-that-is-shadowed-by-an-alias"
    ],
    "shell": "bash"
  },
  {
    "componentCommands": ["command", "ls"],
    "description": "Run the un-aliased `ls' command.",
    "invocation": "\\ls",
    "links": [
      "https://unix.stackexchange.com/questions/39291/run-a-command-that-is-shadowed-by-an-alias"
    ],
    "shell": "bash"
  },
  {
    "componentCommands": ["type", "echo"],
    "description": "Print all the definitions of `echo'",
    "exampleOutput":
      "echo is a shell builtin\necho is /usr/bin/echo\necho is /bin/echo\n",
    "invocation": "type -a echo",
    "shell": "bash"
  },
  {
    "componentCommands": ["type", "time"],
    "description": "Print all the definitions of `time'.",
    "exampleOutput":
      "time is a shell keyword\ntime is /usr/bin/time\ntime is /bin/time\n",
    "invocation": "type -a time",
    "shell": "bash"
  },
  {
    "componentCommands": ["type", "ipython"],
    "description": "Identify the kind of command `ipython' is.",
    "exampleOutput":
      "ipython is /home/username/.local/bin/ipython\nipython is /usr/bin/ipython\n",
    "invocation": "type -a ipython",
    "shell": "bash"
  },
  {
    "componentCommands": ["shopt", "declare", "quote"],
    "description": "See where the function `quote' was defined.",
    "exampleOutput": "quote 132 /usr/share/bash-completion/bash_completion\n",
    "invocation": "shopt -s extdebug; declare -F quote; shopt -u extdebug",
    "shell": "bash"
  },
  {
    "componentCommands": ["git"],
    "description": "Do a soft reset (undo) of last commit.",
    "invocation": "git reset --soft HEAD~1",
    "links": [
      "https://stackoverflow.com/questions/927358/how-do-i-undo-the-most-recent-local-commits-in-git",
      "https://git-scm.com/docs/git-reset#_examples",
      "https://stackoverflow.com/questions/5203535/practical-uses-of-git-reset-soft",
      "https://stackoverflow.com/questions/24568936/what-is-difference-between-git-reset-hard-head1-and-git-reset-soft-head"
    ],
    "shell": "bash"
  },
  {
    "componentCommands": ["gwmi"],
    "description": "Print battery status and charging information.",
    "exampleOutput":
      '\r\n\r\n__GENUS            : 2\r\n__CLASS            : BatteryStatus\r\n__SUPERCLASS       : MSBatteryClass\r\n__DYNASTY          : CIM_StatisticalInformation\r\n__RELPATH          : BatteryStatus.InstanceName="ACPI\\\\PNP0C0A\\\\0_0"\r\n__PROPERTY_COUNT   : 20\r\n__DERIVATION       : {MSBatteryClass, Win32_PerfRawData, Win32_Perf, CIM_StatisticalInformation}\r\n__SERVER           : WIN11-LAPTOP\r\n__NAMESPACE        : root\\wmi\r\n__PATH             : \\\\WIN11-LAPTOP\\root\\wmi:BatteryStatus.InstanceName="ACPI\\\\PNP0C0A\\\\0_0"\r\nActive             : True\r\nCaption            : \r\nChargeRate         : 0\r\nCharging           : False\r\nCritical           : False\r\nDescription        : \r\nDischargeRate      : 19290\r\nDischarging        : True\r\nFrequency_Object   : \r\nFrequency_PerfTime : \r\nFrequency_Sys100NS : \r\nInstanceName       : ACPI\\PNP0C0A\\0_0\r\nName               : \r\nPowerOnline        : False\r\nRemainingCapacity  : 32894\r\nTag                : 15\r\nTimestamp_Object   : \r\nTimestamp_PerfTime : \r\nTimestamp_Sys100NS : \r\nVoltage            : 15457\r\nPSComputerName     : WIN11-LAPTOP\r\n\r\n\r\n\r\n\r\n',
    "invocation": "gwmi -Class batterystatus -Namespace root\\wmi",
    "links": [
      "https://devblogs.microsoft.com/scripting/using-windows-powershell-to-determine-if-a-laptop-is-on-battery-power/",
      "https://superuser.com/questions/1732383/where-can-i-see-the-current-charging-speed-on-windows-10"
    ],
    "shell": "PowerShell"
  },
  {
    "componentCommands": ["Get-PnpDevice"],
    "description": "Print list of USB devices, lsusb (1).",
    "exampleOutput":
      "\r\nStatus     Class           FriendlyName                                                                     InstanceId     \r\n------     -----           ------------                                                                     ----------     \r\nOK         Bluetooth       Intel(R) Wireless Bluetooth(R)                                                   USB\\VID_8087...\r\nOK         Biometric       Framework Fingerprint Reader                                                     USB\\VID_27C6...\r\nOK                         USB4 Virtual power coordination device                                           USB4\\VIRTUAL...\r\nOK         USB             USB Root Hub (USB 3.0)                                                           USB\\ROOT_HUB...\r\nOK         USB             USB4 Root Router (1.0)                                                           USB4\\ROOT_DE...\r\nOK                         USB4 Virtual power coordination device                                           USB4\\VIRTUAL...\r\nOK         USB             USB Root Hub (USB 3.0)                                                           USB\\ROOT_HUB...\r\nOK         USB             USB Composite Device                                                             USB\\VID_0BDA...\r\nOK         Camera          Laptop Camera                                                                    USB\\VID_0BDA...\r\nOK         USB             USB4 Root Router (1.0)                                                           USB4\\ROOT_DE...\r\n\r\n\r\n",
    "invocation": "Get-PnpDevice -InstanceId 'USB*' -Status OK",
    "links": [
      "https://superuser.com/questions/1411312/is-there-an-equivalent-to-linuxs-lsusb-in-windows",
      "https://www.shellhacks.com/windows-lsusb-equivalent-powershell/"
    ],
    "shell": "PowerShell"
  },
  {
    "componentCommands": ["Get-Command"],
    "description":
      "Show all definitions of the 'sort' command, including aliases; like 'type -a' in bash.",
    "exampleOutput":
      "\r\nCommandType     Name                                               Version    Source                                   \r\n-----------     ----                                               -------    ------                                   \r\nAlias           sort -> Sort-Object                                                                                    \r\nApplication     sort.exe                                           10.0.26... C:\\WINDOWS\\system32\\sort.exe             \r\n\r\n\r\n",
    "invocation": "Get-Command -All sort",
    "links": [
      "https://superuser.com/questions/49104/how-do-i-find-the-location-of-an-executable-in-windows",
      "https://stackoverflow.com/questions/304319/is-there-an-equivalent-of-which-on-the-windows-command-line",
      "https://docs.microsoft.com/en-us/powershell/module/microsoft.powershell.core/get-command?view=powershell-7.2"
    ],
    "shell": "PowerShell"
  },
  {
    "componentCommands": ["Measure-Command"],
    "description": "Time a command and see the output in stdout.",
    "exampleOutput":
      "\r\n\r\nDays              : 0\r\nHours             : 0\r\nMinutes           : 0\r\nSeconds           : 0\r\nMilliseconds      : 16\r\nTicks             : 165570\r\nTotalDays         : 1.91631944444444E-07\r\nTotalHours        : 4.59916666666667E-06\r\nTotalMinutes      : 0.00027595\r\nTotalSeconds      : 0.016557\r\nTotalMilliseconds : 16.557\r\n\r\n\r\n\r\n",
    "invocation": "Measure-Command { echo 'Hello, world!' | out-default }",
    "links": [
      "https://stackoverflow.com/questions/2038181/how-to-output-something-in-powershell",
      "https://stackoverflow.com/questions/3513650/timing-a-commands-execution-in-powershell",
      "https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.utility/measure-command?view=powershell-7.5"
    ],
    "shell": "PowerShell"
  },
  {
    "componentCommands": ["dir"],
    "description":
      "List filenames in a single column without extra information.",
    "invocation": "dir /b",
    "links": [
      "https://docs.microsoft.com/en-us/windows-server/administration/windows-commands/dir"
    ],
    "shell": "cmd.exe"
  },
  {
    "componentCommands": ["systeminfo"],
    "description":
      "Save Windows version, install date, product ID, and other system information to a text file.",
    "invocation": "systeminfo > systeminfo.txt",
    "links": [
      "https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/systeminfo"
    ],
    "shell": "cmd.exe"
  },
  {
    "componentCommands": ["help"],
    "description": "Get information about a built-in command like 'dir'.",
    "invocation": "help dir",
    "links": [
      "https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/help"
    ],
    "shell": "cmd.exe"
  },
  {
    "componentCommands": ["source"],
    "description": "Make bash re-read modified .bashrc file",
    "invocation": "source ~/.bashrc",
    "links": [
      "https://stackoverflow.com/questions/2518127/how-to-reload-bashrc-settings-without-logging-out-and-back-in-again",
      "https://superuser.com/questions/46139/what-does-source-do"
    ],
    "shell": "bash"
  },
  {
    "componentCommands": ["apt-cache"],
    "description":
      "Search apt packages name and descriptions for 'blender', case insensitive",
    "invocation": "apt-cache search blender",
    "shell": "bash"
  },
  {
    "componentCommands": ["apt-cache"],
    "description": "Search only package names for 'blender', not descriptions.",
    "invocation": "apt-cache search --names-only 'blender'",
    "exampleOutput":
      "blender-dbgsym - debug symbols for blender\nblender - Very fast and versatile 3D modeller/renderer\nblender-data - Very fast and versatile 3D modeller/renderer - data package\nblender-doc - Blender Manual by the Blender Foundation\nblender-ogrexml-1.9 - Blender Exporter for OGRE\nblender-ogrexml-next - Blender Exporter for OGRE-Next",
    "links": [
      "https://askubuntu.com/questions/298506/using-apt-cache-search",
      "https://stackoverflow.com/questions/2944104/why-does-apt-cache-search-find-packages-which-do-not-match-the-given-regular-exp",
      "https://unix.stackexchange.com/questions/118921/what-exactly-does-the-names-only-option-of-apt-cache-do"
    ],
    "shell": "bash"
  },
  {
    "componentCommands": ["apt-cache"],
    "description":
      "Only exact string 'mc' in package names, not '*mc*' that matches e.g. 'wmcalc'",
    "invocation": "apt-cache search --names-only '^mc$'",
    "exampleOutput": "mc - Midnight Commander - a powerful file manager\n",
    "links": [
      "https://askubuntu.com/questions/298506/using-apt-cache-search",
      "https://askubuntu.com/questions/934739/apt-search-limit-to-exact-match"
    ],
    "shell": "bash"
  },
  {
    "componentCommands": ["apt-cache"],
    "description":
      "Find package descriptions that are longer than 4000 characters.",
    "invocation": "apt-cache search '.{4000,}'",
    "shell": "bash"
  },
  {
    "componentCommands": ["alsamixer"],
    "description": "Interactively adjust volume and other sound settings.",
    "invocation": "alsamixer",
    "links": [
      "https://askubuntu.com/questions/345487/how-do-i-adjust-alsamixer",
      "https://en.wikipedia.org/wiki/Alsamixer",
      "https://wiki.ubuntu.com/Audio/Alsamixer"
    ],
    "shell": "bash"
  },
  {
    "componentCommands": ["amixer"],
    "description": "Mute master sound",
    "invocation": "amixer set Master mute",
    "links": [
      "https://askubuntu.com/questions/65764/how-do-i-toggle-sound-with-amixer",
      "https://unix.stackexchange.com/questions/679793/how-to-mute-unmute-default-sound-output"
    ],
    "shell": "bash"
  },
  {
    "componentCommands": ["amixer"],
    "description": "Unmute master sound",
    "invocation": "amixer set Master unmute",
    "links": [
      "https://askubuntu.com/questions/65764/how-do-i-toggle-sound-with-amixer",
      "https://unix.stackexchange.com/questions/679793/how-to-mute-unmute-default-sound-output"
    ],
    "shell": "bash"
  },
  {
    "componentCommands": ["amixer"],
    "description": "Set master sound level to 50%.",
    "invocation": "amixer set Master 50",
    "links": [
      "http://www.tldp.org/HOWTO/Alsa-sound-6.html",
      "http://www.linuxjournal.com/content/change-volume-bash-script"
    ],
    "shell": "bash"
  },
  {
    "componentCommands": ["amixer"],
    "description": "See master sound output settings.",
    "invocation": "amixer get Master",
    "exampleOutput":
      "Simple mixer control 'Master',0\n  Capabilities: pvolume pswitch pswitch-joined\n  Playback channels: Front Left - Front Right\n  Limits: Playback 0 - 65536\n  Mono:\n  Front Left: Playback 19066 [29%] [on]\n  Front Right: Playback 18600 [28%] [on]\n",
    "shell": "bash"
  },
  {
    "componentCommands": ["pactl"],
    "description": "Get default sink for PulseAudio.",
    "invocation": "pactl get-default-sink",
    "exampleOutput": "alsa_output.pci-0000_00_1f.3.analog-stereo\n",
    "shell": "bash"
  },
  {
    "componentCommands": ["cat"],
    "description": "Show sound cards and headsets.",
    "invocation": "cat /proc/asound/cards",
    "exampleOutput":
      " 0 [PCH            ]: HDA-Intel - HDA Intel PCH\n                      HDA Intel PCH at 0xf2420000 irq 33\n",
    "links": [
      "https://docs.kernel.org/sound/designs/procfile.html#card-specific-files"
    ],
    "shell": "bash"
  },
  {
    "componentCommands": ["find"],
    "description": "Find non-executables in /bin/ and /usr/bin/",
    "invocation": "find /bin/ /usr/bin/ -type f -not -executable -print",
    "shell": "bash"
  },
  {
    "componentCommands": ["top"],
    "description": "Get batch output for process ID 10104 using top.",
    "invocation":
      "top --batch --iterations=1 --threads-show --pid=10104 > top.txt",
    "links": [
      "https://unix.stackexchange.com/questions/138484/what-does-batch-mode-mean-for-the-top-command",
      "https://superuser.com/questions/1610061/why-are-results-from-top-in-batch-mode-different-than-from-interactive-top",
      "https://unix.stackexchange.com/questions/147471/is-there-a-way-to-get-top-to-run-exactly-once-and-exit"
    ],
    "shell": "bash"
  },
  {
    "componentCommands": ["top"],
    "description":
      "Get batch output for process ID 10104 using top (short flags).",
    "invocation": "top -b -n 1 -H -p 10104 > top.txt",
    "links": [
      "https://unix.stackexchange.com/questions/138484/what-does-batch-mode-mean-for-the-top-command",
      "https://superuser.com/questions/1610061/why-are-results-from-top-in-batch-mode-different-than-from-interactive-top",
      "https://unix.stackexchange.com/questions/147471/is-there-a-way-to-get-top-to-run-exactly-once-and-exit"
    ],
    "shell": "bash"
  },
  {
    "componentCommands": ["speaker-test"],
    "description":
      'Figure out which speaker or earphone is left and right. Note that you have to pause other sound playback for this to work or you will get a "Device or resource busy" error.',
    "invocation":
      "speaker-test --device plug:front --channels 2 --test sine --frequency 100 # long version",
    "shell": "bash"
  },
  {
    "componentCommands": ["speaker-test"],
    "description":
      'Figure out which speaker or earphone is left and right (short flags). Note that you have to pause other sound playback for this to work or you will get a "Device or resource busy" error.',
    "invocation": "speaker-test -Dplug:front -c2 -t sine -f100",
    "shell": "bash"
  },
  {
    "componentCommands": ["script"],
    "description":
      "Save a transcript of terminal session to the file `typescript' in current directory.",
    "invocation": "script",
    "links": [
      "http://linuxers.org/article/script-command-line-tool-recordsave-your-terminal-activity"
    ],
    "shell": "bash"
  },
  {
    "componentCommands": ["script"],
    "description":
      "Save a transcript of terminal session, immediately flushing output to `typescript' file in current directory.",
    "invocation": "script --flush",
    "shell": "bash"
  },
  {
    "componentCommands": ["script"],
    "description":
      "Save a transcript of terminal session to `typescript.out', saving timing information to `typescript.tm'.",
    "invocation": "script --timing=typescript.tm --flush typescript.out",
    "shell": "bash"
  },
  {
    "componentCommands": ["script"],
    "description":
      "Save a transcript of terminal session to `typescript.out', saving timing information to `typescript.tm' (new output format).",
    "invocation":
      "script --log-timing=typescript.tm --flush --log-out typescript.out",
    "shell": "bash"
  },
  {
    "componentCommands": ["script"],
    "description":
      "Save a transcript of terminal session to `typescript.out', saving timing information to `typescript.tm'.",
    "invocation": "script -T typescript.tm -f -O typescript.out",
    "shell": "bash"
  },
  {
    "componentCommands": ["less"],
    "description": "View the typescript generated by script(1).",
    "invocation": "less -r typescript",
    "shell": "bash"
  },
  {
    "componentCommands": ["scriptreplay"],
    "description": "Replay the typescript generated by script(1).",
    "invocation":
      "scriptreplay --log-timing typescript.tm --log-out typescript.out",
    "shell": "bash"
  },
  {
    "componentCommands": ["scriptreplay"],
    "description": "Replay the typescript generated by script(1), short flags.",
    "invocation": "scriptreplay -T typescript.tm -O typescript.out",
    "shell": "bash"
  },
  {
    "componentCommands": ["gnome-screenshot"],
    "description":
      "Take a screenshot on the GNOME desktop with a 1-second delay and a timestamped filename.",
    "invocation":
      "gnome-screenshot --delay=1 --file=\"$(date +'%Y-%m-%d_%H_%M_%S').png\"",
    "links": [
      "https://stackoverflow.com/questions/8228047/adding-timestamp-to-a-filename-with-mv-in-bash",
      "https://askubuntu.com/questions/202391/bash-script-to-take-screenshot-and-save-the-image-ubuntu"
    ],
    "shell": "bash"
  },
  {
    "componentCommands": ["echo", "!!"],
    "description":
      "Use history expansion to append the last interactive command to a file called 'my-commands.sh'.",
    "invocation": "echo !! >> my-commands.sh",
    "links": [
      "https://unix.stackexchange.com/questions/38072/how-can-i-save-the-last-command-to-a-file",
      "https://unix.stackexchange.com/questions/3747/understanding-the-exclamation-mark-in-bash",
      "https://www.gnu.org/software/bash/manual/html_node/History-Interaction.html"
    ],
    "shell": "bash"
  },
  {
    "componentCommands": ["cat"],
    "description":
      "Append a file onto another file (a non-useless use of cat).",
    "invocation": "cat my-commands.sh >> big-command-list.sh",
    "links": [
      "https://www.cyberciti.biz/faq/unix-linux-cat-append-text-to-a-file/",
      "https://stackoverflow.com/questions/4969641/how-to-append-one-file-to-another-in-linux-from-the-shell",
      "https://unix.stackexchange.com/questions/355342/appending-one-file-to-another",
      "https://www.gnu.org/software/bash/manual/html_node/Redirections.html"
    ],
    "shell": "bash"
  },
  {
    "componentCommands": ["ls", "cat"],
    "description":
      "See what piped output looks like for commands like ls(1) that detect output with isatty (a non-useless use of cat).",
    "invocation": "ls | cat",
    "links": [
      "https://unix.stackexchange.com/questions/22162/ls-command-operating-differently-depending-on-recipient",
      "https://stackoverflow.com/questions/8584356/why-does-ls-give-different-output-when-piped"
    ],
    "shell": "bash"
  },
  {
    "componentCommands": ["echo", "less"],
    "description":
      "View both stdout and stderr using input/output redirection.",
    "invocation": '{ echo "stdout"; echo "stderr" >&2; } 2>&1 | less',
    "links": [
      "https://stackoverflow.com/questions/16497317/piping-both-stdout-and-stderr-in-bash",
      "https://www.gnu.org/software/bash/manual/html_node/Redirections.html"
    ],
    "shell": "bash"
  },
  {
    "componentCommands": ["ffmpeg", "less"],
    "description":
      "View both stdout and stderr from ffmpeg filters in less page using input/output redirection.",
    "invocation": "ffmpeg -filters 2>&1 | less",
    "links": [
      "https://stackoverflow.com/questions/16497317/piping-both-stdout-and-stderr-in-bash",
      "https://www.gnu.org/software/bash/manual/html_node/Redirections.html"
    ],
    "shell": "bash"
  },
  {
    "componentCommands": ["ffmpeg", "less"],
    "description": "View only stderr in less using input/output redirection.",
    "invocation": "ffmpeg -filters 2>&1 >/dev/null | less",
    "links": [
      "https://stackoverflow.com/questions/2342826/how-to-pipe-stderr-and-not-stdout",
      "https://www.gnu.org/software/bash/manual/html_node/Redirections.html"
    ],
    "shell": "bash"
  },
  {
    "componentCommands": ["less"],
    "description": "View compose-key combinations for current language.",
    "invocation": "less /usr/share/X11/locale/$LANG/Compose",
    "links": [
      "https://aty.sdsu.edu/bibliog/latex/debian/compose.html",
      "https://superuser.com/questions/74763/how-to-type-unicode-characters-in-kde",
      "https://userbase.kde.org/Tutorials/ComposeKey",
      "https://wiki.debian.org/XCompose"
    ],
    "shell": "bash"
  }
];

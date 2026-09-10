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
    "componentCommands": elem.componentCommands.value,
    "description": elem.description.value,
    "exampleOutput": elem.exampleOutput.value,
    "invocation": elem.command.value,
    "links": elem.links.value
  };
  const componentCommandsList = noWhiteSpace(
    strings.componentCommands.split(" ")
  );
  const chosenShellsList = getChosenShells();
  const search = {
    "componentCommands": new Set(componentCommandsList),
    "description": strings.description.trim(),
    "exampleOutput": strings.exampleOutput,
    "invocation": strings.invocation,
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
    "description": elem.toggleDescription.checked,
    "edit": elem.toggleEdit.checked,
    "exampleOutput": elem.toggleExampleOutput.checked,
    "invocation": true,
    "links": elem.toggleLinks.checked,
    "shell": elem.toggleShell.checked
  };
  const tree = document.createDocumentFragment();
  // Match the search text.
  for (const [index, info] of cmdInfo.entries()) {
    const match = {
      "componentCommands": matchComponentCommands(
        search.componentCommands,
        new Set(info.componentCommands)
      ),
      "description": matchDescription(
        search.description,
        info.description,
        caseSensitive.description
      ),
      "exampleOutput": matchExampleOutput(
        search.exampleOutput,
        info.exampleOutput,
        caseSensitive.exampleOutput
      ),
      "invocation": matchCommand(
        search.invocation,
        info.invocation,
        regex.invocation
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
      if (showField.edit === true) {
        const editDiv = document.createElement("div");
        const editButton = document.createElement("button");
        const editText = document.createTextNode("Edit...");
        editButton.appendChild(editText);
        editButton.setAttribute("title", "Edit this command");
        editButton.setAttribute("index", index);
        editButton.addEventListener("click", editCommandButtonHandler);
        editDiv.appendChild(editButton);
        div.appendChild(editDiv);
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
function clearSearchFields() {
  for (const el of document.getElementsByClassName("shellOption")) {
    el.checked = true;
  }
  for (const el of document.getElementsByClassName("search")) {
    if (el.type === "text" ) {
      el.value = "";
    }
  }
  updateSearch();
}

function validateSingleEntry(entry, i, assert = true, returnValid = false) {
  let originalAssert = null;
  if (assert === false) {
    // Mute console.assert.
    originalAssert = console.assert;
    console.assert = function () {};
  }
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
    "exampleOutput": "string",
    "invocation": "string",
    "links": "object",
    "shell": "string",
    "uuid": "string"
  };
  const arrayType = {
    componentCommands: "string",
    links: "string"
  };
  for (const key of allKeys) {
    const val = entry[key];
    console.assert(val !== "", "#%i: %s = %o", i, key, val);
    if (val === "" && returnValid) {
      return false;
    }
    console.assert(val !== null, "#%i: %s = %o", i, key, val);
    if (val === null && returnValid) {
      return false;
    }
    if (val !== undefined) {
      console.assert(
        typeof val === keyType[key],
        "#%i: typeof %s = %s != %s",
        i,
        key,
        typeof val,
        keyType[key]
      );
      if (typeof val !== keyType[key] && returnValid) {
        return false;
      }
      if (key in arrayType) {
        // Check each value in the array.
        console.assert(
          Array.isArray(val),
          "#%i: %s : Array.isArray(%o) === false",
          i,
          key,
          val
        );
        if (!Array.isArray(val) && returnValid) {
          return false;
        }
        console.assert(
          val.length !== 0,
          "#%i: %s : %s.length === 0",
          i,
          key,
          key
        );
        if (val.length === 0 && returnValid) {
          return false;
        }
        for (const arrayVal of val) {
          console.assert(arrayVal !== "", "#%i: %o in %s", i, arrayVal, key);
          if (arrayVal === "" && returnValid) {
            return false;
          }
          console.assert(arrayVal !== null, "#%i: %o in %s", i, arrayVal, key);
          if (arrayVal === null && returnValid) {
            return false;
          }
          console.assert(
            typeof arrayVal === arrayType[key],
            "#%i: typeof %o = %s != %s in %s",
            i,
            arrayVal,
            typeof arrayVal,
            arrayType[key],
            key
          );
          if (typeof arrayVal !== arrayType[key] && returnValid) {
            return false;
          }
          // Check for leading whitespace.
          if (key === "componentCommands" || key === "links") {
            console.assert(
              Array.from(arrayVal)[0] !== " ",
              "#%i: %s[0] = ' ' (leading whitespace), entry = %s",
              i,
              JSON.stringify(arrayVal),
              key
            );
            if (Array.from(arrayVal)[0] === " " && returnValid) {
              return false;
            }
            // Check for trailing whitespace.
            console.assert(
              arrayVal.slice(-1) !== " ",
              "#%i: %s.slice(-1) = ' ' (trailing whitespace), entry = %s",
              i,
              JSON.stringify(arrayVal),
              key
            );
            if (arrayVal.slice(-1) === " " && returnValid) {
              return false;
            }
          }
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
    if (val === undefined && returnValid) {
      return false;
    }
  }
  for (const key in entry) {
    if (mandatoryKeys.includes(key) || optionalKeys.includes(key)) {
      continue;
    } else {
      // Important for e.g. catching misspellings of fields.
      console.error(`#${i}: unknown key '${key}'`);
      if (returnValid) {
        return false;
      }
    }
  }
  if (assert === false) {
    // Unmute console.assert
    console.assert = originalAssert;
  }
  if (returnValid) {
    return true;
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
    ["matchCommand", "-sh", "du -sh --exclude \"./.*\"", false, true] // Match flag
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

  // TODO: add more invalid commands
  const invalidCmds = [
    {
      // missing componentCommands
      "description": "Example",
      "invocation": "example -arg",
      "shell": "myshell"
    },
    {
      // missing description
      "componentCommands": ["example"],
      "invocation": "example -arg",
      "shell": "myshell"
    },
    {
      // missing invocation
      "componentCommands": ["example"],
      "description": "Example",
      "shell": "myshell"
    },
    {
      // missing shell
      "componentCommands": ["example"],
      "description": "Example",
      "invocation": "example -arg"
    }
  ];
  for (const invalidCmd of invalidCmds) {
    console.assert(validateSingleEntry(invalidCmd, 0, false, true) === false);
  }
  // TODO: add more valid commands
  const validCmds = [
    {
      "componentCommands": ["example"],
      "description": "Example",
      "invocation": "example -arg",
      "shell": "myshell"
    }
  ];
  for (const validCmd of validCmds) {
    console.assert(validateSingleEntry(validCmd, 0, true, true) === true);
  }
  // TODO: test parseComponentCommands
  // TODO: test parseLinks
}

function editCommandButtonHandler(evt) {
  const index = parseInt(evt.target.getAttribute("index"));
  const cmd = cmdInfo[index];
  document.getElementById("editShell").value = cmd.shell;
  document.getElementById("editCommand").value = cmd.invocation;
  document.getElementById("editComponentCommands").value =
    cmd.componentCommands.join(" ");
  document.getElementById("editDescription").value = cmd.description;
  if (cmd.exampleOutput !== undefined) {
    document.getElementById("editExampleOutput").value = cmd.exampleOutput;
  } else {
    document.getElementById("editExampleOutput").value = "";
  }
  if (cmd.links !== undefined) {
    document.getElementById("editLinks").value = cmd.links.join("\n");
  } else {
    document.getElementById("editLinks").value = "";
  }
  if (cmd.uuid !== undefined) {
    document.getElementById("editUUID").value = cmd.uuid;
  } else {
    document.getElementById("editUUID").value = "";
  }
  editCommandDialog.setAttribute("index", index);
  editCommandDialog.showModal();
}

function exportJSON() {
  var filename = "one-liners.json";
  var jsonBlob = new Blob([JSON.stringify(cmdInfo)], {
    name: filename,
    type: "application/json"
  });
  var tmpAnchor = document.createElement("a");
  tmpAnchor.href = URL.createObjectURL(jsonBlob);
  tmpAnchor.download = filename;
  tmpAnchor.click();
  window.removeEventListener("beforeunload", beforeUnloadHandler);
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
let editCommandDialog = null;
const beforeUnloadHandler = event => {
  // Recommended
  event.preventDefault();

  // Included for legacy support, e.g. Chrome/Edge < 119
  event.returnValue = true;
};

function newCommandButtonHandler() {
  newCommandDialog.showModal();
}

function parseComponentCommands(componentCommandsStr) {
  let trimmed = componentCommandsStr.trim();
  return trimmed.split(" ");
}

function parseLinks(linksStr) {
  if (linksStr.trim() === "") {
    return [];
  } else {
    return linksStr.split(/\r\n|\r|\n/);
  }
}

function cancelNewCommand(evt) {
  evt.preventDefault(); // Don't refresh the page.
  newCommandDialog.close("cancel");
}

function saveNewCommand(evt) {
  evt.preventDefault(); // Don't refresh the page.
  if (!document.forms["newCommandForm"].reportValidity()) {
    // Force validation before saving the command.
    return false;
  }
  // Mandatory fields
  let cmd = {
    componentCommands: parseComponentCommands(
      document.getElementById("newComponentCommands").value
    ),
    description: document.getElementById("newDescription").value,
    invocation: document.getElementById("newCommand").value,
    shell: document.getElementById("newShell").value
  };
  // Optional fields
  let exampleOutput = document.getElementById("newExampleOutput").value;
  if (exampleOutput !== "") {
    cmd["exampleOutput"] = exampleOutput;
  }
  const links = parseLinks(document.getElementById("newLinks").value);
  if (links.length > 0) {
    cmd["links"] = links;
  }
  const uuid = document.getElementById("newUUID").value;
  if (uuid.length > 0) {
    cmd["uuid"] = uuid;
  }
  const index = cmdInfo.length;
  validateSingleEntry(cmd, index);
  cmdInfo.push(cmd);
  window.addEventListener("beforeunload", beforeUnloadHandler);
  newCommandDialog.close("saved");
}

function onCloseNewCommandDialog(evt) {
  evt.preventDefault(); // We don't want to submit this fake form
  const returnStr = newCommandDialog.returnValue;
  if (returnStr === "") {
    // Cancelled, do nothing.
  } else if (returnStr === "cancel") {
    // Cancelled, do nothing.
  } else if (returnStr === "saved") {
    updateState();
  } else {
    console.error(`returnStr = ${returnStr}`);
  }
}

function cancelEditCommand(evt) {
  evt.preventDefault(); // Don't refresh the page.
  editCommandDialog.setAttribute("index", "");
  editCommandDialog.close("cancel");
}

function saveEditedCommand(evt) {
  evt.preventDefault(); // Don't refresh the page.
  if (!document.forms["editCommandForm"].reportValidity()) {
    // Force validation before saving the command.
    return false;
  }
  // Mandatory fields
  let cmd = {
    componentCommands: parseComponentCommands(
      document.getElementById("editComponentCommands").value
    ),
    description: document.getElementById("editDescription").value,
    invocation: document.getElementById("editCommand").value,
    shell: document.getElementById("editShell").value
  };
  // Optional fields
  let exampleOutput = document.getElementById("editExampleOutput").value;
  if (exampleOutput !== "") {
    cmd["exampleOutput"] = exampleOutput;
  }
  let links = parseLinks(document.getElementById("editLinks").value);
  if (links.length > 0) {
    cmd["links"] = links;
  }
  const index = parseInt(editCommandDialog.getAttribute("index"));
  validateSingleEntry(cmd, index);
  cmdInfo[index] = cmd;
  editCommandDialog.setAttribute("index", "");
  editCommandDialog.close("saved");
  window.addEventListener("beforeunload", beforeUnloadHandler);
}

function onCloseEditCommandDialog(evt) {
  evt.preventDefault(); // We don't want to submit this fake form
  const returnStr = editCommandDialog.returnValue;
  if (returnStr === "") {
    // Cancelled, do nothing.
  } else if (returnStr === "cancel") {
    // Cancelled, do nothing.
  } else if (returnStr === "saved") {
    updateState();
  } else {
    console.error(`returnStr = ${returnStr}`);
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
    const nComponentCommandsText = `${stats.componentCommands.size} unique component commands`;
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
  elem.clearSearchFields.addEventListener("click", clearSearchFields);
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
  elem.toggleEdit.onchange = handleChange;
  elem.descriptionCaseSensitive.onchange = handleChange;
  elem.toggleDescription.onchange = handleChange;
  elem.toggleShell.onchange = handleChange;
  elem.exportJSON.onclick = exportJSON;
  elem.importJSON.onchange = importJSON;

  const newCommandButton = document.getElementById("newCommandButton");
  newCommandButton.addEventListener("click", newCommandButtonHandler);
  newCommandDialog = document.getElementById("newCommandDialog");
  newCommandDialog.addEventListener("close", onCloseNewCommandDialog);
  const saveNewCommandButton = document.getElementById("saveNewCommandButton");
  saveNewCommandButton.addEventListener("click", saveNewCommand);
  const cancelNewCommandButton = document.getElementById(
    "cancelNewCommandButton"
  );
  cancelNewCommandButton.addEventListener("click", cancelNewCommand);

  editCommandDialog = document.getElementById("editCommandDialog");
  editCommandDialog.addEventListener("close", onCloseEditCommandDialog);
  const saveEditedCommandButton = document.getElementById(
    "saveEditedCommandButton"
  );
  saveEditedCommandButton.addEventListener("click", saveEditedCommand);
  const cancelEditCommandButton = document.getElementById(
    "cancelEditCommandButton"
  );
  cancelEditCommandButton.addEventListener("click", cancelEditCommand);

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
      "for f in *.pdf; do dir=\"${f%.*}\"; mkdir -p \"$dir\" && pdfimages -png -j \"$f\" \"$dir/$dir\"; done",
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
    "exampleOutput":
      "chardos.txt\tunknown\neol_dos.txt\tUS-ASCII\nunix.txt\tUS-ASCII\nutf16ben.txt\tUTF-16BE\nutf16be.txt\tUTF-16\nutf16bin.txt\tUTF-32\nutf16len.txt\tUTF-16LE\nutf16le.txt\tUTF-16\nutf16m.txt\tUTF-16\nutf16.txt\tUTF-16\nutf16u.txt\tUTF-16\nutf8dosn.txt\tUTF-8\nutf8dos.txt\tUTF-8\nutf8unix.txt\tUTF-8\nutf8unxb.txt\tUTF-8",
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
    "invocation": "dos2unix --info -- *",
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
      "dir=\"$(mktemp -d --tmpdir=.)\" && unzip -q file.odt -d \"$dir\" && cd \"$dir\" && mogrify -resize 10x10% Pictures/* && zip -qrm ../resized.odt * && cd .. && rmdir \"$dir\"",
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
    "invocation": "grep \"$HOSTNAME\" /etc/*",
    "shell": "bash"
  },
  {
    "componentCommands": ["grep"],
    "description":
      "Grep the files under the /etc/ directory for the current machine's hostname, showing only filename.",
    "invocation": "grep --files-with-matches \"$HOSTNAME\" /etc/*",
    "shell": "bash"
  },
  {
    "componentCommands": ["grep"],
    "description":
      "Grep the files under the /etc/ directory for the current machine's hostname, showing only filename (short flags version).",
    "invocation": "grep -l \"$HOSTNAME\" /etc/*",
    "shell": "bash"
  },
  {
    "componentCommands": ["grep"],
    "description":
      "Grep the /etc/ directory recursively for the current machine's hostname.",
    "invocation": "grep --recursive \"$HOSTNAME\" /etc/",
    "shell": "bash"
  },
  {
    "componentCommands": ["grep"],
    "description":
      "Grep the /etc/ directory recursively for the current machine's hostname (short flags version).",
    "invocation": "grep -r \"$HOSTNAME\" /etc/",
    "shell": "bash"
  },
  {
    "componentCommands": ["grep"],
    "description":
      "Grep the /etc/ directory recursively for words matching current machine's hostname.",
    "invocation": "grep --recursive --word-regexp \"$HOSTNAME\" /etc/",
    "shell": "bash"
  },
  {
    "componentCommands": ["grep"],
    "description":
      "Grep the /etc/ directory recursively for words matching current machine's hostname (short flags version).",
    "invocation": "grep -rw \"$HOSTNAME\" /etc/",
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
    "componentCommands": ["find", "sort"],
    "description":
      "List files and directories sorted by group, owner, and permissions. (Impromptu permissions report.)",
    "invocation": "find . -printf '%g:%u %M %p\\n' | sort",
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
    "invocation": "find . -type f -printf \"%m %M %f\\n\"",
    "links": [
      "https://unix.stackexchange.com/questions/126040/convert-the-permissions-in-ls-l-output-to-octal"
    ],
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
    "invocation": "grep -E -i \"^[^aeiouy']{3}$\" /usr/share/dict/words",
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
    "invocation": "grep -E -i \"^[a-fA-F]+$\" /usr/share/dict/words",
    "links": [
      "https://en.wikipedia.org/wiki/Magic_number_%28programming%29#Magic_debug_values",
      "http://www.urbandictionary.com/define.php?term=0xDEADBEEF",
      "https://stackoverflow.com/questions/5907614/0xdeadbeef-vs-null"
    ],
    "shell": "bash"
  },
  {
    "componentCommands": ["grep"],
    "description": "Grep for words that end in \"gry\"",
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
    "invocation": "echo \"$OSTYPE\"",
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
      "\r\n\r\n__GENUS            : 2\r\n__CLASS            : BatteryStatus\r\n__SUPERCLASS       : MSBatteryClass\r\n__DYNASTY          : CIM_StatisticalInformation\r\n__RELPATH          : BatteryStatus.InstanceName=\"ACPI\\\\PNP0C0A\\\\0_0\"\r\n__PROPERTY_COUNT   : 20\r\n__DERIVATION       : {MSBatteryClass, Win32_PerfRawData, Win32_Perf, CIM_StatisticalInformation}\r\n__SERVER           : WIN11-LAPTOP\r\n__NAMESPACE        : root\\wmi\r\n__PATH             : \\\\WIN11-LAPTOP\\root\\wmi:BatteryStatus.InstanceName=\"ACPI\\\\PNP0C0A\\\\0_0\"\r\nActive             : True\r\nCaption            : \r\nChargeRate         : 0\r\nCharging           : False\r\nCritical           : False\r\nDescription        : \r\nDischargeRate      : 19290\r\nDischarging        : True\r\nFrequency_Object   : \r\nFrequency_PerfTime : \r\nFrequency_Sys100NS : \r\nInstanceName       : ACPI\\PNP0C0A\\0_0\r\nName               : \r\nPowerOnline        : False\r\nRemainingCapacity  : 32894\r\nTag                : 15\r\nTimestamp_Object   : \r\nTimestamp_PerfTime : \r\nTimestamp_Sys100NS : \r\nVoltage            : 15457\r\nPSComputerName     : WIN11-LAPTOP\r\n\r\n\r\n\r\n\r\n",
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
    "componentCommands": ["Set-Content"],
    "description":
      "Make Dropbox ignore file 'C:\\Users\\yourname\\Dropbox (Personal)\\YourFileName.pdf'.",
    "invocation":
      "Set-Content -Path 'C:\\Users\\yourname\\Dropbox (Personal)\\YourFileName.pdf' -Stream com.dropbox.ignored -Value 1",
    "links": ["https://help.dropbox.com/sync/ignored-files"],
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
    "componentCommands": ["netsh"],
    "description":
      "List WiFi (wlan) interfaces, including SSID and signal quality.",
    "exampleOutput":
      "\r\nThere is 1 interface on the system: \r\n\r\n    Name                   : Wi-Fi 2\r\n    Description            : Intel(R) Wi-Fi 6E AX210 160MHz #2\r\n    GUID                   : 0e9b7811-4e78-4b20-9345-3f6b93e1b825\r\n    Physical address       : bc:09:1b:f4:42:73\r\n    Interface type         : Primary\r\n    State                  : connected\r\n    SSID                   : my-home-wifi\r\n    AP BSSID               : 76:83:c2:04:cf:63\r\n    Band                   : 5 GHz\r\n    Channel                : 36\r\n    Connected Akm-cipher   : [ akm = 00-0f-ac:02, cipher =  00-0f-ac:04 ]\r\n    Network type           : Infrastructure\r\n    Radio type             : 802.11ac\r\n    Authentication         : WPA2-Personal\r\n    Cipher                 : CCMP\r\n    Connection mode        : Auto Connect\r\n    Receive rate (Mbps)    : 234\r\n    Transmit rate (Mbps)   : 260\r\n    Signal                 : 81% \r\n    Rssi                   : -63\r\n    Profile                : my-home-wifi \r\n    QoS MSCS Configured         : 0\r\n    QoS Map Configured          : 0\r\n    QoS Map Allowed by Policy   : 0\r\n\r\n",
    "invocation": "netsh wlan show interfaces",
    "links": [
      "https://superuser.com/questions/991457/how-do-i-display-a-list-of-wi-fi-connections-using-netsh",
      "https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/netsh-wlan"
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
    "exampleOutput":
      "blender-dbgsym - debug symbols for blender\nblender - Very fast and versatile 3D modeller/renderer\nblender-data - Very fast and versatile 3D modeller/renderer - data package\nblender-doc - Blender Manual by the Blender Foundation\nblender-ogrexml-1.9 - Blender Exporter for OGRE\nblender-ogrexml-next - Blender Exporter for OGRE-Next",
    "invocation": "apt-cache search --names-only 'blender'",
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
    "exampleOutput": "mc - Midnight Commander - a powerful file manager\n",
    "invocation": "apt-cache search --names-only '^mc$'",
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
    "exampleOutput":
      "Simple mixer control 'Master',0\n  Capabilities: pvolume pswitch pswitch-joined\n  Playback channels: Front Left - Front Right\n  Limits: Playback 0 - 65536\n  Mono:\n  Front Left: Playback 19066 [29%] [on]\n  Front Right: Playback 18600 [28%] [on]\n",
    "invocation": "amixer get Master",
    "shell": "bash"
  },
  {
    "componentCommands": ["pactl"],
    "description": "Get default sink for PulseAudio.",
    "exampleOutput": "alsa_output.pci-0000_00_1f.3.analog-stereo\n",
    "invocation": "pactl get-default-sink",
    "shell": "bash"
  },
  {
    "componentCommands": ["cat"],
    "description": "Show sound cards and headsets.",
    "exampleOutput":
      " 0 [PCH            ]: HDA-Intel - HDA Intel PCH\n                      HDA Intel PCH at 0xf2420000 irq 33\n",
    "invocation": "cat /proc/asound/cards",
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
      "Figure out which speaker or earphone is left and right. Note that you have to pause other sound playback for this to work or you will get a \"Device or resource busy\" error.",
    "invocation":
      "speaker-test --device plug:front --channels 2 --test sine --frequency 100 # long version",
    "shell": "bash"
  },
  {
    "componentCommands": ["speaker-test"],
    "description":
      "Figure out which speaker or earphone is left and right (short flags). Note that you have to pause other sound playback for this to work or you will get a \"Device or resource busy\" error.",
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
    "invocation": "{ echo \"stdout\"; echo \"stderr\" >&2; } 2>&1 | less",
    "links": [
      "https://stackoverflow.com/questions/16497317/piping-both-stdout-and-stderr-in-bash",
      "https://www.gnu.org/software/bash/manual/html_node/Redirections.html"
    ],
    "shell": "bash"
  },
  {
    "componentCommands": ["echo", "less"],
    "description":
      "Pipe stdout and stderr together to another command (bash only).",
    "invocation": "{ echo \"stdout\"; echo \"stderr\" >&2; } |& less",
    "links": [
      "https://stackoverflow.com/questions/16497317/piping-both-stdout-and-stderr-in-bash",
      "https://www.gnu.org/software/bash/manual/html_node/Pipelines.html"
    ],
    "shell": "bash"
  },
  {
    "componentCommands": ["echo"],
    "description": "Redirect stdout to file",
    "invocation": "{ echo \"stdout\"; echo \"stderr\" >&2; } > stdout_log.txt",
    "links": [
      "https://www.gnu.org/software/bash/manual/html_node/Redirections.html",
      "https://askubuntu.com/questions/420981/how-do-i-save-terminal-output-to-a-file"
    ],
    "shell": "bash"
  },
  {
    "componentCommands": ["echo"],
    "description": "Redirect stderr to file",
    "invocation": "{ echo \"stdout\"; echo \"stderr\" >&2; } 2> stderr_log.txt",
    "links": [
      "https://www.gnu.org/software/bash/manual/html_node/Redirections.html"
    ],
    "shell": "bash"
  },
  {
    "componentCommands": ["echo"],
    "description": "Redirect both stdout and stderr to text file (bash only).",
    "invocation": "{ echo \"stdout\"; echo \"stderr\" >&2; } &> full_log.txt",
    "links": [
      "https://www.gnu.org/software/bash/manual/html_node/Redirections.html"
    ],
    "shell": "bash"
  },
  {
    "componentCommands": ["echo"],
    "description":
      "Redirect both stdout and stderr to text file (note that `2>&1' must come after `>').",
    "invocation":
      "{ echo \"stdout\"; echo \"stderr\" >&2; } > stdout_stderr_log.txt 2>&1",
    "links": [
      "https://www.gnu.org/software/bash/manual/html_node/Redirections.html"
    ],
    "shell": "bash"
  },
  {
    "componentCommands": ["echo", "less"],
    "description":
      "Redirect both stdout and stderr to text file and view in pager.",
    "invocation":
      "{ echo \"stdout\"; echo \"stderr\" >&2; } 2>&1 | tee stdout_stderr_log.txt | less",
    "links": [
      "https://www.gnu.org/software/bash/manual/html_node/Redirections.html"
    ],
    "shell": "bash"
  },
  {
    "componentCommands": ["echo"],
    "description":
      "Append both stdout and stderr to text file (note that `2>&1' must come after `>').",
    "invocation":
      "{ echo \"stdout\"; echo \"stderr\" >&2; } >> append_stdout_stderr_log.txt 2>&1",
    "links": [
      "https://www.gnu.org/software/bash/manual/html_node/Redirections.html",
      "https://stackoverflow.com/questions/876239/how-to-redirect-and-append-both-standard-output-and-standard-error-to-a-file-wit"
    ],
    "shell": "bash"
  },
  {
    "componentCommands": ["echo"],
    "description": "Append both stdout and stderr to text file (bash only).",
    "invocation":
      "{ echo \"stdout\"; echo \"stderr\" >&2; } &>> append_stdout_stderr_log.txt",
    "links": [
      "https://stackoverflow.com/questions/876239/how-to-redirect-and-append-both-standard-output-and-standard-error-to-a-file-wit",
      "https://askubuntu.com/questions/420981/how-do-i-save-terminal-output-to-a-file"
    ],
    "shell": "bash"
  },
  {
    "componentCommands": ["echo", "less"],
    "description": "Suppress stdout and view only stderr in pager",
    "invocation":
      "{ echo \"stdout\"; echo \"stderr\" >&2; } >/dev/null 2>&1 | less",
    "links": [
      "https://www.gnu.org/software/bash/manual/html_node/Redirections.html",
      "https://stackoverflow.com/questions/2342826/how-can-i-pipe-stderr-and-not-stdout/"
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
  },
  {
    "componentCommands": ["wget", "grep"],
    "description": "Grep HTTP requests from wget.",
    "invocation":
      "wget --timeout=3 --tries=1 --spider --no-check-certificate 'http://google.com' |& grep 'HTTP request\\|Location:'",
    "shell": "bash"
  },
  {
    "componentCommands": ["getfattr"],
    "description":
      "List all extended attributes of files / folders in current directory.",
    "invocation": "getfattr -dm- -- *",
    "links": [
      "https://superuser.com/questions/858210/how-can-you-show-list-all-extended-attributes-in-linux",
      "https://unix.stackexchange.com/questions/180019/why-doesnt-getfattr-d-show-anything"
    ],
    "shell": "bash"
  },
  {
    "componentCommands": ["attr"],
    "description":
      "Ignore a file in Dropbox folder so it isn't synced. This sets the extended attribute 'com.dropbox.ignored' to 1.",
    "invocation":
      "attr -s com.dropbox.ignored -V 1 ~/'Dropbox/file-to-ignore.pdf'",
    "links": ["https://help.dropbox.com/sync/ignored-files"],
    "shell": "bash"
  },
  {
    "componentCommands": ["setfattr"],
    "description":
      "Ignore a file in Dropbox folder so it isn't synced. This sets the extended attribute 'com.dropbox.ignored' to 1.",
    "invocation":
      "setfattr -n com.dropbox.ignored -v 1 ~/'Dropbox/file-to-ignore.pdf'",
    "links": ["https://help.dropbox.com/sync/ignored-files"],
    "shell": "bash"
  },
  {
    "componentCommands": ["attr"],
    "description":
      "Remove 'com.dropbox.ignored' attribute for a file in Dropbox folder so it syncs again.",
    "invocation": "attr -r com.dropbox.ignored ~/'Dropbox/file-to-ignore.pdf'",
    "links": ["https://help.dropbox.com/sync/ignored-files"],
    "shell": "bash"
  },
  {
    "componentCommands": ["setfattr"],
    "description":
      "Remove 'com.dropbox.ignored' attribute for a file in Dropbox folder so it syncs again.",
    "invocation":
      "setfattr -x com.dropbox.ignored ~/'Dropbox/file-to-ignore.pdf'",
    "links": ["https://help.dropbox.com/sync/ignored-files"],
    "shell": "bash"
  },
  {
    "componentCommands": ["attr"],
    "description":
      "Ignore a Git repo folder in Dropbox folder so it isn't synced.",
    "invocation":
      "attr -s com.dropbox.ignored -V 1 ~/'Dropbox/example-repo/.git'",
    "links": ["https://help.dropbox.com/sync/ignored-files"],
    "shell": "bash"
  },
  {
    "componentCommands": ["pdftk"],
    "description": "Combine / merge / concatenate two PDFs into a single PDF.",
    "invocation": "pdftk file1.pdf file2.pdf cat output combined.pdf",
    "links": [
      "https://stackoverflow.com/questions/50728273/merging-pdf-files-with-pdftk",
      "https://superuser.com/questions/366490/how-to-merge-multiple-pdf-files-onto-one-page-with-pdftk",
      "https://askubuntu.com/questions/1312657/how-can-i-merge-numbered-pdf-files-with-pdftk"
    ],
    "shell": "bash"
  },
  {
    "componentCommands": ["pdftk"],
    "description": "Split out a single page of a PDF (page 17 in this case).",
    "invocation": "pdftk example.pdf cat 17 output page-17.pdf",
    "shell": "bash"
  },
  {
    "componentCommands": ["pdftk"],
    "description":
      "Split out page 17 of a PDF and rotate 90 degrees clockwise.",
    "invocation": "pdftk example.pdf cat 17east output page-17.pdf",
    "links": [
      "https://stackoverflow.com/questions/3136610/pdftk-rotating-pages-problem",
      "https://unix.stackexchange.com/questions/394065/command-line-how-do-you-rotate-a-pdf-file-90-degrees",
      "https://askubuntu.com/questions/569328/rotate-a-specific-page-of-a-pdf-file"
    ],
    "shell": "bash"
  },
  {
    "componentCommands": ["pdftk"],
    "description":
      "Get a range of pages from a PDF (10 through 12 and 17 to the end in this case).",
    "invocation": "pdftk myoldfile.pdf cat 10-12 17-end output mynewfile.pdf",
    "links": [
      "https://askubuntu.com/questions/221962/how-can-i-extract-a-page-range-a-part-of-a-pdf",
      "https://stackoverflow.com/questions/17776582/split-a-pdf-in-two",
      "https://superuser.com/questions/1882737/remove-the-first-three-pages-of-a-pdf-file-using-pdftk",
      "https://unix.stackexchange.com/questions/796293/how-do-i-extract-some-pages-of-a-pdf-into-another-pdf-file",
      "http://linuxcommando.blogspot.com/2013/02/splitting-up-is-easy-for-pdf-file.html"
    ],
    "shell": "bash"
  },
  {
    "componentCommands": ["pdftk"],
    "description": "Remove last page of a PDF.",
    "invocation": "pdftk example.pdf cat '1-r2' output last-page-removed.pdf",
    "links": [
      "https://stackoverflow.com/questions/17705974/remove-the-last-page-of-a-pdf-file-using-pdftk",
      "https://www.pdflabs.com/docs/pdftk-cli-examples/"
    ],
    "shell": "bash"
  },
  {
    "componentCommands": ["pdftk"],
    "description": "Get all but a single page (number 17 in this case).",
    "invocation": "pdftk myoldfile.pdf cat '~17' output mynewfile.pdf",
    "shell": "bash"
  },
  {
    "componentCommands": ["gs"],
    "description": "Extract pages 1-4 of a PDF using GhostScript.",
    "exampleOutput":
      "GPL Ghostscript 10.02.1 (2023-11-01)\nCopyright (C) 2023 Artifex Software, Inc.  All rights reserved.\nThis software is supplied under the GNU AGPLv3 and comes with NO WARRANTY:\nsee the file COPYING for details.\n   **** Warning: File has some garbage before %PDF- .\nProcessing pages 1 through 4.\nPage 1\nPage 2\nPage 3\nPage 4\n\nThe following errors were encountered at least once while processing this file:\n\txref table was repaired\n\n   **** This file had errors that were repaired or ignored.\n   **** The file was produced by: \n   **** >>>> Acrobat Distiller 5.00 for Macintosh <<<<\n   **** Please notify the author of the software that produced this\n   **** file that it does not conform to Adobe's published PDF\n   **** specification.",
    "invocation":
      "gs -sDEVICE=pdfwrite -dNOPAUSE -dBATCH -dSAFER -dFirstPage=1 -dLastPage=4 -sOutputFile=example-pages1-4.pdf example.pdf",
    "links": [
      "http://linuxcommando.blogspot.com/2014/01/how-to-split-up-pdf-files-part-2.html"
    ],
    "shell": "bash"
  },
  {
    "componentCommands": ["snap"],
    "description": "Use snap to run an application directly.",
    "invocation": "snap run slack",
    "shell": "bash"
  },
  {
    "componentCommands": ["snap"],
    "description": "Enable debug mode for slack snap package.",
    "invocation": "snap set slack debugmode=true",
    "links": [
      "https://forum.snapcraft.io/t/slack-snap-stopped-working-after-ubuntu-updates/51066/4"
    ],
    "shell": "bash"
  },
  {
    "componentCommands": ["chmod"],
    "description":
      "Make all files under current directory readable and writable by current user.",
    "invocation": "chmod -R u+rw .",
    "shell": "bash"
  },
  {
    "componentCommands": ["for", "ffmpeg"],
    "description":
      "Iterate over all MP4 files in current directory and convert to MP3.",
    "invocation":
      "for f in *.mp4; do ffmpeg -i \"$f\" -c:a libmp3lame \"${f%.mp4}.mp3\"; done",
    "links": [
      "https://stackoverflow.com/questions/38449239/converting-all-the-mp4-audio-files-in-a-folder-to-mp3-using-ffmpeg",
      "https://stackoverflow.com/questions/5784661/how-do-you-convert-an-entire-directory-with-ffmpeg"
    ],
    "shell": "bash"
  },
  {
    "componentCommands": ["for", "ffmpeg"],
    "description":
      "Iterate over all WAV files in current directory and convert to MP3.",
    "invocation":
      "for f in *.wav; do ffmpeg -i \"$f\" -c:a libmp3lame \"${f%.wav}.mp3\"; done",
    "links": [
      "https://stackoverflow.com/questions/3255674/convert-audio-files-to-mp3-using-ffmpeg",
      "https://stackoverflow.com/questions/5784661/how-do-you-convert-an-entire-directory-with-ffmpeg"
    ],
    "shell": "bash"
  },
  {
    "componentCommands": ["calibre-debug"],
    "description": "Run calibre in debug mode and save output to out.txt",
    "invocation": "calibre-debug --gui 2>&1 | tee out.txt",
    "links": [
      "https://manual.calibre-ebook.com/generated/en/calibre-debug.html"
    ],
    "shell": "bash"
  },
  {
    "componentCommands": ["pdftocairo"],
    "description": "Embed fonts into a PDF",
    "invocation": "pdftocairo -pdf input.pdf output.pdf",
    "links": [
      "https://stackoverflow.com/questions/4231656/how-do-i-embed-fonts-in-an-existing-pdf/",
      "https://stackoverflow.com/questions/12857849/how-to-repair-a-pdf-file-and-embed-missing-fonts/"
    ],
    "shell": "bash"
  },
  {
    "componentCommands": ["gs"],
    "description": "Embed fonts into a PDF",
    "invocation":
      "gs -sFONTPATH=/path/to/fonts:/another/dir/with/more/fonts -o output-pdf-with-embedded-fonts.pdf -sDEVICE=pdfwrite -dPDFSETTINGS=/prepress input-pdf-where-some-fonts-are-not-embedded.pdf",
    "links": [
      "https://stackoverflow.com/questions/4231656/how-do-i-embed-fonts-in-an-existing-pdf/",
      "https://stackoverflow.com/questions/12857849/how-to-repair-a-pdf-file-and-embed-missing-fonts/"
    ],
    "shell": "bash"
  },
  {
    "componentCommands": ["inkscape"],
    "description": "Export SVG to PNG using Inkscape v1.0 and later.",
    "invocation":
      "inkscape \"image.svg\" --export-overwrite --export-filename=\"out.png\" --export-width=128 --export-height=128",
    "shell": "bash"
  },
  {
    "componentCommands": ["inkscape"],
    "description":
      "Export SVG to PNG using Inkscape v1.0 and later (short flags).",
    "invocation": "inkscape -w 128 -h 128 image.svg -o out.png",
    "shell": "bash"
  },
  {
    "componentCommands": ["inkscape"],
    "description":
      "Export SVG to PNG using older versions of Inkscape, e.g. 0.92.2",
    "invocation": "inkscape -z -e out.png -w 128 -h 128 image.svg",
    "shell": "bash"
  },
  {
    "componentCommands": ["readelf"],
    "description": "Get build ID from an elf binary.",
    "invocation": "readelf -n /usr/bin/gawk | grep -A4 build.id",
    "links": [
      "https://man.archlinux.org/man/debuginfod.8.en",
      "https://manpages.debian.org/experimental/debuginfod/debuginfod-find.1.en.html"
    ],
    "shell": "bash"
  },
  {
    "componentCommands": ["python3"],
    "description":
      "Reduce the fraction 2340/1080; works in python 3.9 and later.",
    "exampleOutput": "13/6",
    "invocation":
      "python3 -c \"from fractions import Fraction; print(Fraction(2340, 1080))\"",
    "links": [
      "https://stackoverflow.com/questions/17537613/does-python-have-a-function-to-reduce-fractions"
    ],
    "shell": "bash"
  },
  {
    "componentCommands": ["mutool"],
    "description": "Inspect PDF for errors.",
    "invocation": "mutool info example.pdf",
    "links": [
      "https://bitsgalore.org/2021/09/06/pdf-processing-and-analysis-with-open-source-tools.html"
    ],
    "shell": "bash"
  },
  {
    "componentCommands": ["gs"],
    "description": "Inspect PDF for errors.",
    "invocation":
      "gs -dNOPAUSE -dBATCH -dPDFSTOPONERROR -sDEVICE=nullpage example.pdf",
    "links": [
      "https://bitsgalore.org/2021/09/06/pdf-processing-and-analysis-with-open-source-tools.html",
      "https://stackoverflow.com/questions/3108201/detect-if-pdf-file-is-correct-header-pdf",
      "https://ghostscript.readthedocs.io/en/latest/Use.html"
    ],
    "shell": "bash"
  },
  {
    "componentCommands": ["pdfcpu"],
    "description": "Inspect PDF for errors.",
    "invocation": "pdfcpu validate -m strict example.pdf",
    "links": [
      "https://pdfcpu.io/",
      "https://bitsgalore.org/2021/09/06/pdf-processing-and-analysis-with-open-source-tools.html"
    ],
    "shell": "bash"
  },
  {
    "componentCommands": ["python3", "attr"],
    "description":
      "Create a new Python virtual environment in .venv but make Dropbox ignore it.",
    "invocation":
      "python3 -m venv .venv; attr -s com.dropbox.ignored -V 1 .venv",
    "shell": "bash"
  },
  {
    "componentCommands": ["wmic"],
    "description": "Print BIOS version for current machine.",
    "exampleOutput": "SMBIOSBIOSVersion  \n03.05              \n",
    "invocation": "wmic bios get smbiosbiosversion",
    "links": [
      "https://superuser.com/questions/1319418/find-out-bios-version-from-windows",
      "https://pcsupport.lenovo.com/us/en/products/laptops-and-netbooks/lenovo-v-series-laptops/v110-15isk/videos/vid100778-how-to-check-bios-version-in-windows"
    ],
    "shell": "cmd.exe"
  },
  {
    "componentCommands": ["Get-CimInstance"],
    "description": "Print BIOS version for current machine.",
    "exampleOutput":
      "\n\nSMBIOSBIOSVersion : 03.05\nManufacturer      : INSYDE Corp.\nName              : 03.05\nSerialNumber      : FRANPACPA62452000D\nVersion           : INSYDE - 2\n\n\n\n",
    "invocation": "Get-CimInstance Win32_BIOS",
    "links": [
      "https://learn.microsoft.com/en-us/powershell/scripting/learn/ps101/07-working-with-wmi?view=powershell-7.6",
      "https://learn.microsoft.com/en-us/powershell/scripting/samples/collecting-information-about-computers?view=powershell-7.6"
    ],
    "shell": "PowerShell"
  },
  {
    "componentCommands": ["git"],
    "description":
      "Fetch git server status for branch 'main' from remote called 'origin'. Useful when status or tags are stale.",
    "invocation": "git fetch 'origin/main'",
    "links": [
      "https://git-scm.com/docs/git-fetch",
      "https://stackoverflow.com/questions/47009237/what-is-the-difference-between-git-fetch-and-git-fetch-origin"
    ],
    "shell": "bash"
  },
  {
    "componentCommands": ["git"],
    "description": "Clone a git repository while preserving symbolic links.",
    "invocation":
      "git clone --config core.symlinks=true 'https://example.org/myrepo.git' 'myrepo'",
    "links": [
      "https://cal.com/help/event-types/symbolic-issues",
      "https://stackoverflow.com/questions/11662868/what-happens-when-i-clone-a-repository-with-symlinks-on-windows",
      "https://stackoverflow.com/questions/51119974/how-do-you-preserve-symlinks-in-a-git-repo",
      "https://superuser.com/questions/1713099/symbolic-link-does-not-work-in-git-over-windows",
      "https://www.jvt.me/posts/2024/10/01/mac-symlinks-git/"
    ],
    "shell": "bash"
  },
  {
    "componentCommands": ["rsync"],
    "description": "Copy a folder without copying symbolic links.",
    "invocation":
      "rsync --archive --no-links /usr/share/backgrounds/ ./usr_share_backgrounds/",
    "links": [
      "https://unix.stackexchange.com/questions/392236/how-can-i-copy-a-directory-structure-but-ignore-symlinks"
    ],
    "shell": "bash"
  },
  {
    "componentCommands": ["ocrmypdf"],
    "description": "Add an OCR layer to a PDF.",
    "invocation": "ocrmypdf input.pdf out-with-ocr.pdf",
    "links": [
      "https://ocrmypdf.readthedocs.io/en/latest/cookbook.html#basic-examples"
    ],
    "shell": "bash"
  },
  {
    "componentCommands": ["ls"],
    "description": "See LD_DEBUG options.",
    "invocation": "LD_DEBUG=help ls",
    "links": ["https://bnikolic.co.uk/blog/linux-ld-debug.html"],
    "shell": "bash"
  },
  {
    "componentCommands": ["grep"],
    "description": "Match python3 scripts in /usr/bin/.",
    "invocation":
      "grep --max-count=1 --binary-files=without-match 'python3' /usr/bin/*",
    "shell": "bash"
  },
  {
    "componentCommands": ["gnome-sesssion-quit", "gnome-session-quit"],
    "description": "Exit gnome session from command line.",
    "invocation": "gnome-session-quit --no-prompt --logout --force",
    "links": [
      "https://gnome.pages.gitlab.gnome.org/gnome-session/re03.html",
      "https://fostips.com/log-out-command-linux-desktops/",
      "https://askubuntu.com/questions/180628/how-can-i-logout-from-the-gui-using-cli"
    ],
    "shell": "bash"
  },
  {
    "componentCommands": ["busctl"],
    "description": "Restart gnome session from command line.",
    "invocation":
      "busctl --user call org.gnome.Shell /org/gnome/Shell org.gnome.Shell Eval s 'Meta.restart(\"Restarting…\")'",
    "links": [
      "https://askubuntu.com/questions/100226/how-to-restart-gnome-shell-from-command-line",
      "https://www.linuxuprising.com/2020/07/how-to-restart-gnome-shell-from-command.html",
      "https://discourse.gnome.org/t/proper-way-to-restart-the-shell-from-a-script/9797"
    ],
    "shell": "bash"
  },
  {
    "componentCommands": ["loginctl"],
    "description": "List running graphical sessions.",
    "invocation": "loginctl list-sessions",
    "links": [
      "https://askubuntu.com/questions/180628/how-can-i-logout-from-the-gui-using-cli"
    ],
    "shell": "bash"
  },
  {
    "componentCommands": ["top"],
    "description":
      "Write output of top(1) command in batch mode to a text file (long flags style).",
    "invocation": "top --iterations=1 --batch > top.txt",
    "links": [
      "https://stackoverflow.com/questions/11729720/how-to-capture-the-output-of-a-top-command-in-a-file-in-linux"
    ],
    "shell": "bash"
  },
  {
    "componentCommands": ["top"],
    "description":
      "Write output of top(1) command in batch mode to a text file.",
    "invocation": "top -n 1 -b > top.txt",
    "links": [
      "https://stackoverflow.com/questions/11729720/how-to-capture-the-output-of-a-top-command-in-a-file-in-linux"
    ],
    "shell": "bash"
  },
  {
    "componentCommands": ["top"],
    "description":
      "For process IDs 4469 and 4530, Write output of top(1) command in batch mode to a text file.",
    "invocation": "top -n 1 -b -p 4469,4530 > top.txt",
    "links": [
      "https://stackoverflow.com/questions/11729720/how-to-capture-the-output-of-a-top-command-in-a-file-in-linux"
    ],
    "shell": "bash"
  },
  {
    "componentCommands": ["systemctl"],
    "description": "List all running systemd services.",
    "invocation": "systemctl list-units --type=service",
    "links": [
      "https://unix.stackexchange.com/questions/517872/systemctl-list-all-possible-including-disabled-services"
    ],
    "shell": "bash"
  },
  {
    "componentCommands": ["systemctl"],
    "description":
      "List all running systemd services for the current user (not global services).",
    "invocation": "systemctl list-units --user --type=service",
    "links": [
      "https://askubuntu.com/questions/1300152/how-to-list-user-services-of-another-user-under-ubuntu",
      "https://til.devjugal.com/linux/systemd/list-services-of-a-user"
    ],
    "shell": "bash"
  },
  {
    "componentCommands": ["systemctl"],
    "description":
      "Look at the status of a particular service, in this case the CUPS printing daemon.",
    "exampleOutput":
      "● cups.service - CUPS Scheduler\n     Loaded: loaded (/usr/lib/systemd/system/cups.service; enabled; preset: enabled)\n     Active: active (running) since Sun 2026-06-14 08:38:40 EDT; 1 day 4h ago\nTriggeredBy: ● cups.path\n             ● cups.socket\n       Docs: man:cupsd(8)\n   Main PID: 123124 (cupsd)\n     Status: \"Scheduler is running...\"\n      Tasks: 1 (limit: 38061)\n     Memory: 8.3M (peak: 35.6M)\n        CPU: 3.222s\n     CGroup: /system.slice/cups.service\n             └─123124 /usr/sbin/cupsd -l\nJun 14 08:38:40 mica systemd[1]: Starting cups.service - CUPS Scheduler...\nJun 14 08:38:40 mica systemd[1]: Started cups.service - CUPS Scheduler.",
    "invocation": "systemctl status cups.service",
    "links": [
      "https://systemd.io/DEBUGGING/#status-and-logs-of-services",
      "https://systemd.io/TIPS_AND_TRICKS/#showing-runtime-status"
    ],
    "shell": "bash"
  },
  {
    "componentCommands": ["systemctl"],
    "description":
      "Look at the status of a particular user service, in this case for the ssh-agent.",
    "invocation": "systemctl status --user ssh-agent.service",
    "shell": "bash"
  },
  {
    "componentCommands": ["journalctl"],
    "description":
      "Look at journal for GNOME shell as it updates in real time.",
    "invocation": "journalctl --follow /usr/bin/gnome-shell",
    "shell": "bash"
  },
  {
    "componentCommands": ["pdfimages"],
    "description":
      "Extract embedded images from a PDF and dump them as JPEGs into the current directory, with filenames starting with 'mypdf-images'.",
    "invocation": "pdfimages -j mypdf.pdf mypdf-images",
    "shell": "bash"
  },
  {
    "componentCommands": ["pdfimages"],
    "description": "Extract embedded images from first page of a PDF.",
    "invocation": "pdfimages -all -f 1 -l 1 -j mypdf.pdf mypdf-images",
    "shell": "bash"
  },
  {
    "componentCommands": ["pdfimages"],
    "description": "List embedded images from first page of a PDF.",
    "invocation": "pdfimages -l -f 1 -l 1 -j mypdf.pdf mypdf-images",
    "shell": "bash"
  },
  {
    "componentCommands": ["pango-view"],
    "description":
      "Render text in 'example-file.txt' to 'out.png' with FreeMono font.",
    "invocation": "pango-view --font='FreeMono' -qo out.png example-file.txt",
    "shell": "bash"
  },
  {
    "componentCommands": ["ffmpeg"],
    "description": "Preprocess a video for use with Sony Vegas.",
    "invocation":
      "ffmpeg -i 'example.webm' -vf 'format=rgb24,crop=w=.95*iw:h=.95*ih,scale=w=1440:h=1080,minterpolate=fps=60:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1,hqdn3d=luma_spatial=10' -c:v libx264 -qp 18 -preset medium -s 1440x1080 -aspect 4:3 -r 60 -pix_fmt yuv420p -af 'aresample=48000,aexciter,afftdn' -c:a alac upscale.mov",
    "links": ["https://www.youtube.com/watch?v=I7lgm7LqzBA&t=659s"],
    "shell": "bash"
  },
  {
    "componentCommands": ["yt-dlp"],
    "description":
      "Download a YouTube video to the current directory with JSON metadata and a filesystem-safe filename, in this case 'Me_at_the_zoo-[jNQXAC9IVRw].webm' and 'Me_at_the_zoo-[jNQXAC9IVRw].info.json'.",
    "invocation":
      "yt-dlp --write-info-json --restrict-filenames 'https://www.youtube.com/watch?v=jNQXAC9IVRw'",
    "links": [
      "https://stackoverflow.com/questions/32322771/what-is-the-downloader-option-restrict-filenames-for-python-youtube-dl",
      "https://github.com/yt-dlp/yt-dlp"
    ],
    "shell": "bash"
  },
  {
    "componentCommands": ["yt-dlp"],
    "description":
      "Download just the JSON metadata for a YouTube video to the current directory, in this case 'Me_at_the_zoo-[jNQXAC9IVRw].info.json'.",
    "invocation":
      "yt-dlp --write-info-json --restrict-filenames --skip-download 'https://www.youtube.com/watch?v=jNQXAC9IVRw'",
    "links": [
      "https://stackoverflow.com/questions/32322771/what-is-the-downloader-option-restrict-filenames-for-python-youtube-dl",
      "https://unix.stackexchange.com/questions/528302/how-can-i-download-just-the-info-json-files-using-youtube-dl-without-downloadin",
      "https://github.com/yt-dlp/yt-dlp"
    ],
    "shell": "bash"
  },
  {
    "componentCommands": ["yt-dlp"],
    "description": "List the available subtitles for a YouTube video.",
    "exampleOutput":
      "[youtube] Extracting URL: https://www.youtube.com/watch?v=jNQXAC9IVRw\n[youtube] jNQXAC9IVRw: Downloading webpage\n[youtube] jNQXAC9IVRw: Downloading android vr player API JSON\n[youtube] jNQXAC9IVRw: Downloading player 5b27766f-main\n[youtube] [jsc:deno] Solving JS challenges using deno\n[info] Available automatic captions for jNQXAC9IVRw:\nLanguage   Name                               Formats\nab-en      Abkhazian from English             vtt, srt, ttml, srv3, srv2, srv1, json3\naa-en      Afar from English                  vtt, srt, ttml, srv3, srv2, srv1, json3\naf-en      Afrikaans from English             vtt, srt, ttml, srv3, srv2, srv1, json3\nak-en      Akan from English                  vtt, srt, ttml, srv3, srv2, srv1, json3\nsq-en      Albanian from English              vtt, srt, ttml, srv3, srv2, srv1, json3\nam-en      Amharic from English               vtt, srt, ttml, srv3, srv2, srv1, json3\nar-en      Arabic from English                vtt, srt, ttml, srv3, srv2, srv1, json3\nhy-en      Armenian from English              vtt, srt, ttml, srv3, srv2, srv1, json3\nas-en      Assamese from English              vtt, srt, ttml, srv3, srv2, srv1, json3\nay-en      Aymara from English                vtt, srt, ttml, srv3, srv2, srv1, json3\naz-en      Azerbaijani from English           vtt, srt, ttml, srv3, srv2, srv1, json3\nbn-en      Bangla from English                vtt, srt, ttml, srv3, srv2, srv1, json3\nba-en      Bashkir from English               vtt, srt, ttml, srv3, srv2, srv1, json3\neu-en      Basque from English                vtt, srt, ttml, srv3, srv2, srv1, json3\nbe-en      Belarusian from English            vtt, srt, ttml, srv3, srv2, srv1, json3\nbho-en     Bhojpuri from English              vtt, srt, ttml, srv3, srv2, srv1, json3\nbs-en      Bosnian from English               vtt, srt, ttml, srv3, srv2, srv1, json3\nbr-en      Breton from English                vtt, srt, ttml, srv3, srv2, srv1, json3\nbg-en      Bulgarian from English             vtt, srt, ttml, srv3, srv2, srv1, json3\nmy-en      Burmese from English               vtt, srt, ttml, srv3, srv2, srv1, json3\nca-en      Catalan from English               vtt, srt, ttml, srv3, srv2, srv1, json3\nceb-en     Cebuano from English               vtt, srt, ttml, srv3, srv2, srv1, json3\nzh-Hans-en Chinese (Simplified) from English  vtt, srt, ttml, srv3, srv2, srv1, json3\nzh-Hant-en Chinese (Traditional) from English vtt, srt, ttml, srv3, srv2, srv1, json3\nco-en      Corsican from English              vtt, srt, ttml, srv3, srv2, srv1, json3\nhr-en      Croatian from English              vtt, srt, ttml, srv3, srv2, srv1, json3\ncs-en      Czech from English                 vtt, srt, ttml, srv3, srv2, srv1, json3\nda-en      Danish from English                vtt, srt, ttml, srv3, srv2, srv1, json3\ndv-en      Divehi from English                vtt, srt, ttml, srv3, srv2, srv1, json3\nnl-en      Dutch from English                 vtt, srt, ttml, srv3, srv2, srv1, json3\ndz-en      Dzongkha from English              vtt, srt, ttml, srv3, srv2, srv1, json3\nen-en      English from English               vtt, srt, ttml, srv3, srv2, srv1, json3\neo-en      Esperanto from English             vtt, srt, ttml, srv3, srv2, srv1, json3\net-en      Estonian from English              vtt, srt, ttml, srv3, srv2, srv1, json3\nee-en      Ewe from English                   vtt, srt, ttml, srv3, srv2, srv1, json3\nfo-en      Faroese from English               vtt, srt, ttml, srv3, srv2, srv1, json3\nfj-en      Fijian from English                vtt, srt, ttml, srv3, srv2, srv1, json3\nfil-en     Filipino from English              vtt, srt, ttml, srv3, srv2, srv1, json3\nfi-en      Finnish from English               vtt, srt, ttml, srv3, srv2, srv1, json3\nfr-en      French from English                vtt, srt, ttml, srv3, srv2, srv1, json3\ngaa-en     Ga from English                    vtt, srt, ttml, srv3, srv2, srv1, json3\ngl-en      Galician from English              vtt, srt, ttml, srv3, srv2, srv1, json3\nlg-en      Ganda from English                 vtt, srt, ttml, srv3, srv2, srv1, json3\nka-en      Georgian from English              vtt, srt, ttml, srv3, srv2, srv1, json3\nde-en      German from English                vtt, srt, ttml, srv3, srv2, srv1, json3\nel-en      Greek from English                 vtt, srt, ttml, srv3, srv2, srv1, json3\ngn-en      Guarani from English               vtt, srt, ttml, srv3, srv2, srv1, json3\ngu-en      Gujarati from English              vtt, srt, ttml, srv3, srv2, srv1, json3\nht-en      Haitian Creole from English        vtt, srt, ttml, srv3, srv2, srv1, json3\nha-en      Hausa from English                 vtt, srt, ttml, srv3, srv2, srv1, json3\nhaw-en     Hawaiian from English              vtt, srt, ttml, srv3, srv2, srv1, json3\niw-en      Hebrew from English                vtt, srt, ttml, srv3, srv2, srv1, json3\nhi-en      Hindi from English                 vtt, srt, ttml, srv3, srv2, srv1, json3\nhmn-en     Hmong from English                 vtt, srt, ttml, srv3, srv2, srv1, json3\nhu-en      Hungarian from English             vtt, srt, ttml, srv3, srv2, srv1, json3\nis-en      Icelandic from English             vtt, srt, ttml, srv3, srv2, srv1, json3\nig-en      Igbo from English                  vtt, srt, ttml, srv3, srv2, srv1, json3\nid-en      Indonesian from English            vtt, srt, ttml, srv3, srv2, srv1, json3\niu-en      Inuktitut from English             vtt, srt, ttml, srv3, srv2, srv1, json3\nga-en      Irish from English                 vtt, srt, ttml, srv3, srv2, srv1, json3\nit-en      Italian from English               vtt, srt, ttml, srv3, srv2, srv1, json3\nja-en      Japanese from English              vtt, srt, ttml, srv3, srv2, srv1, json3\njv-en      Javanese from English              vtt, srt, ttml, srv3, srv2, srv1, json3\nkl-en      Kalaallisut from English           vtt, srt, ttml, srv3, srv2, srv1, json3\nkn-en      Kannada from English               vtt, srt, ttml, srv3, srv2, srv1, json3\nkk-en      Kazakh from English                vtt, srt, ttml, srv3, srv2, srv1, json3\nkha-en     Khasi from English                 vtt, srt, ttml, srv3, srv2, srv1, json3\nkm-en      Khmer from English                 vtt, srt, ttml, srv3, srv2, srv1, json3\nrw-en      Kinyarwanda from English           vtt, srt, ttml, srv3, srv2, srv1, json3\nko-en      Korean from English                vtt, srt, ttml, srv3, srv2, srv1, json3\nkri-en     Krio from English                  vtt, srt, ttml, srv3, srv2, srv1, json3\nku-en      Kurdish from English               vtt, srt, ttml, srv3, srv2, srv1, json3\nky-en      Kyrgyz from English                vtt, srt, ttml, srv3, srv2, srv1, json3\nlo-en      Lao from English                   vtt, srt, ttml, srv3, srv2, srv1, json3\nla-en      Latin from English                 vtt, srt, ttml, srv3, srv2, srv1, json3\nlv-en      Latvian from English               vtt, srt, ttml, srv3, srv2, srv1, json3\nln-en      Lingala from English               vtt, srt, ttml, srv3, srv2, srv1, json3\nlt-en      Lithuanian from English            vtt, srt, ttml, srv3, srv2, srv1, json3\nlua-en     Luba-Lulua from English            vtt, srt, ttml, srv3, srv2, srv1, json3\nluo-en     Luo from English                   vtt, srt, ttml, srv3, srv2, srv1, json3\nlb-en      Luxembourgish from English         vtt, srt, ttml, srv3, srv2, srv1, json3\nmk-en      Macedonian from English            vtt, srt, ttml, srv3, srv2, srv1, json3\nmg-en      Malagasy from English              vtt, srt, ttml, srv3, srv2, srv1, json3\nms-en      Malay from English                 vtt, srt, ttml, srv3, srv2, srv1, json3\nml-en      Malayalam from English             vtt, srt, ttml, srv3, srv2, srv1, json3\nmt-en      Maltese from English               vtt, srt, ttml, srv3, srv2, srv1, json3\ngv-en      Manx from English                  vtt, srt, ttml, srv3, srv2, srv1, json3\nmi-en      Māori from English                 vtt, srt, ttml, srv3, srv2, srv1, json3\nmr-en      Marathi from English               vtt, srt, ttml, srv3, srv2, srv1, json3\nmn-en      Mongolian from English             vtt, srt, ttml, srv3, srv2, srv1, json3\nmfe-en     Morisyen from English              vtt, srt, ttml, srv3, srv2, srv1, json3\nne-en      Nepali from English                vtt, srt, ttml, srv3, srv2, srv1, json3\nnew-en     Newari from English                vtt, srt, ttml, srv3, srv2, srv1, json3\nnso-en     Northern Sotho from English        vtt, srt, ttml, srv3, srv2, srv1, json3\nno-en      Norwegian from English             vtt, srt, ttml, srv3, srv2, srv1, json3\nny-en      Nyanja from English                vtt, srt, ttml, srv3, srv2, srv1, json3\noc-en      Occitan from English               vtt, srt, ttml, srv3, srv2, srv1, json3\nor-en      Odia from English                  vtt, srt, ttml, srv3, srv2, srv1, json3\nom-en      Oromo from English                 vtt, srt, ttml, srv3, srv2, srv1, json3\nos-en      Ossetic from English               vtt, srt, ttml, srv3, srv2, srv1, json3\npam-en     Pampanga from English              vtt, srt, ttml, srv3, srv2, srv1, json3\nps-en      Pashto from English                vtt, srt, ttml, srv3, srv2, srv1, json3\nfa-en      Persian from English               vtt, srt, ttml, srv3, srv2, srv1, json3\npl-en      Polish from English                vtt, srt, ttml, srv3, srv2, srv1, json3\npt-en      Portuguese from English            vtt, srt, ttml, srv3, srv2, srv1, json3\npt-PT-en   Portuguese (Portugal) from English vtt, srt, ttml, srv3, srv2, srv1, json3\npa-en      Punjabi from English               vtt, srt, ttml, srv3, srv2, srv1, json3\nqu-en      Quechua from English               vtt, srt, ttml, srv3, srv2, srv1, json3\nro-en      Romanian from English              vtt, srt, ttml, srv3, srv2, srv1, json3\nrn-en      Rundi from English                 vtt, srt, ttml, srv3, srv2, srv1, json3\nru-en      Russian from English               vtt, srt, ttml, srv3, srv2, srv1, json3\nsm-en      Samoan from English                vtt, srt, ttml, srv3, srv2, srv1, json3\nsg-en      Sango from English                 vtt, srt, ttml, srv3, srv2, srv1, json3\nsa-en      Sanskrit from English              vtt, srt, ttml, srv3, srv2, srv1, json3\ngd-en      Scottish Gaelic from English       vtt, srt, ttml, srv3, srv2, srv1, json3\nsr-en      Serbian from English               vtt, srt, ttml, srv3, srv2, srv1, json3\ncrs-en     Seselwa Creole French from English vtt, srt, ttml, srv3, srv2, srv1, json3\nsn-en      Shona from English                 vtt, srt, ttml, srv3, srv2, srv1, json3\nsd-en      Sindhi from English                vtt, srt, ttml, srv3, srv2, srv1, json3\nsi-en      Sinhala from English               vtt, srt, ttml, srv3, srv2, srv1, json3\nsk-en      Slovak from English                vtt, srt, ttml, srv3, srv2, srv1, json3\nsl-en      Slovenian from English             vtt, srt, ttml, srv3, srv2, srv1, json3\nso-en      Somali from English                vtt, srt, ttml, srv3, srv2, srv1, json3\nst-en      Southern Sotho from English        vtt, srt, ttml, srv3, srv2, srv1, json3\nes-en      Spanish from English               vtt, srt, ttml, srv3, srv2, srv1, json3\nsu-en      Sundanese from English             vtt, srt, ttml, srv3, srv2, srv1, json3\nsw-en      Swahili from English               vtt, srt, ttml, srv3, srv2, srv1, json3\nss-en      Swati from English                 vtt, srt, ttml, srv3, srv2, srv1, json3\nsv-en      Swedish from English               vtt, srt, ttml, srv3, srv2, srv1, json3\ntg-en      Tajik from English                 vtt, srt, ttml, srv3, srv2, srv1, json3\nta-en      Tamil from English                 vtt, srt, ttml, srv3, srv2, srv1, json3\ntt-en      Tatar from English                 vtt, srt, ttml, srv3, srv2, srv1, json3\nte-en      Telugu from English                vtt, srt, ttml, srv3, srv2, srv1, json3\nth-en      Thai from English                  vtt, srt, ttml, srv3, srv2, srv1, json3\nbo-en      Tibetan from English               vtt, srt, ttml, srv3, srv2, srv1, json3\nti-en      Tigrinya from English              vtt, srt, ttml, srv3, srv2, srv1, json3\nto-en      Tongan from English                vtt, srt, ttml, srv3, srv2, srv1, json3\nts-en      Tsonga from English                vtt, srt, ttml, srv3, srv2, srv1, json3\ntn-en      Tswana from English                vtt, srt, ttml, srv3, srv2, srv1, json3\ntum-en     Tumbuka from English               vtt, srt, ttml, srv3, srv2, srv1, json3\ntr-en      Turkish from English               vtt, srt, ttml, srv3, srv2, srv1, json3\ntk-en      Turkmen from English               vtt, srt, ttml, srv3, srv2, srv1, json3\nuk-en      Ukrainian from English             vtt, srt, ttml, srv3, srv2, srv1, json3\nur-en      Urdu from English                  vtt, srt, ttml, srv3, srv2, srv1, json3\nug-en      Uyghur from English                vtt, srt, ttml, srv3, srv2, srv1, json3\nuz-en      Uzbek from English                 vtt, srt, ttml, srv3, srv2, srv1, json3\nve-en      Venda from English                 vtt, srt, ttml, srv3, srv2, srv1, json3\nvi-en      Vietnamese from English            vtt, srt, ttml, srv3, srv2, srv1, json3\nwar-en     Waray from English                 vtt, srt, ttml, srv3, srv2, srv1, json3\ncy-en      Welsh from English                 vtt, srt, ttml, srv3, srv2, srv1, json3\nfy-en      Western Frisian from English       vtt, srt, ttml, srv3, srv2, srv1, json3\nwo-en      Wolof from English                 vtt, srt, ttml, srv3, srv2, srv1, json3\nxh-en      Xhosa from English                 vtt, srt, ttml, srv3, srv2, srv1, json3\nyi-en      Yiddish from English               vtt, srt, ttml, srv3, srv2, srv1, json3\nyo-en      Yoruba from English                vtt, srt, ttml, srv3, srv2, srv1, json3\nzu-en      Zulu from English                  vtt, srt, ttml, srv3, srv2, srv1, json3\nab-de      Abkhazian from German              vtt, srt, ttml, srv3, srv2, srv1, json3\naa-de      Afar from German                   vtt, srt, ttml, srv3, srv2, srv1, json3\naf-de      Afrikaans from German              vtt, srt, ttml, srv3, srv2, srv1, json3\nak-de      Akan from German                   vtt, srt, ttml, srv3, srv2, srv1, json3\nsq-de      Albanian from German               vtt, srt, ttml, srv3, srv2, srv1, json3\nam-de      Amharic from German                vtt, srt, ttml, srv3, srv2, srv1, json3\nar-de      Arabic from German                 vtt, srt, ttml, srv3, srv2, srv1, json3\nhy-de      Armenian from German               vtt, srt, ttml, srv3, srv2, srv1, json3\nas-de      Assamese from German               vtt, srt, ttml, srv3, srv2, srv1, json3\nay-de      Aymara from German                 vtt, srt, ttml, srv3, srv2, srv1, json3\naz-de      Azerbaijani from German            vtt, srt, ttml, srv3, srv2, srv1, json3\nbn-de      Bangla from German                 vtt, srt, ttml, srv3, srv2, srv1, json3\nba-de      Bashkir from German                vtt, srt, ttml, srv3, srv2, srv1, json3\neu-de      Basque from German                 vtt, srt, ttml, srv3, srv2, srv1, json3\nbe-de      Belarusian from German             vtt, srt, ttml, srv3, srv2, srv1, json3\nbho-de     Bhojpuri from German               vtt, srt, ttml, srv3, srv2, srv1, json3\nbs-de      Bosnian from German                vtt, srt, ttml, srv3, srv2, srv1, json3\nbr-de      Breton from German                 vtt, srt, ttml, srv3, srv2, srv1, json3\nbg-de      Bulgarian from German              vtt, srt, ttml, srv3, srv2, srv1, json3\nmy-de      Burmese from German                vtt, srt, ttml, srv3, srv2, srv1, json3\nca-de      Catalan from German                vtt, srt, ttml, srv3, srv2, srv1, json3\nceb-de     Cebuano from German                vtt, srt, ttml, srv3, srv2, srv1, json3\nzh-Hans-de Chinese (Simplified) from German   vtt, srt, ttml, srv3, srv2, srv1, json3\nzh-Hant-de Chinese (Traditional) from German  vtt, srt, ttml, srv3, srv2, srv1, json3\nco-de      Corsican from German               vtt, srt, ttml, srv3, srv2, srv1, json3\nhr-de      Croatian from German               vtt, srt, ttml, srv3, srv2, srv1, json3\ncs-de      Czech from German                  vtt, srt, ttml, srv3, srv2, srv1, json3\nda-de      Danish from German                 vtt, srt, ttml, srv3, srv2, srv1, json3\ndv-de      Divehi from German                 vtt, srt, ttml, srv3, srv2, srv1, json3\nnl-de      Dutch from German                  vtt, srt, ttml, srv3, srv2, srv1, json3\ndz-de      Dzongkha from German               vtt, srt, ttml, srv3, srv2, srv1, json3\nen-de      English from German                vtt, srt, ttml, srv3, srv2, srv1, json3\neo-de      Esperanto from German              vtt, srt, ttml, srv3, srv2, srv1, json3\net-de      Estonian from German               vtt, srt, ttml, srv3, srv2, srv1, json3\nee-de      Ewe from German                    vtt, srt, ttml, srv3, srv2, srv1, json3\nfo-de      Faroese from German                vtt, srt, ttml, srv3, srv2, srv1, json3\nfj-de      Fijian from German                 vtt, srt, ttml, srv3, srv2, srv1, json3\nfil-de     Filipino from German               vtt, srt, ttml, srv3, srv2, srv1, json3\nfi-de      Finnish from German                vtt, srt, ttml, srv3, srv2, srv1, json3\nfr-de      French from German                 vtt, srt, ttml, srv3, srv2, srv1, json3\ngaa-de     Ga from German                     vtt, srt, ttml, srv3, srv2, srv1, json3\ngl-de      Galician from German               vtt, srt, ttml, srv3, srv2, srv1, json3\nlg-de      Ganda from German                  vtt, srt, ttml, srv3, srv2, srv1, json3\nka-de      Georgian from German               vtt, srt, ttml, srv3, srv2, srv1, json3\nde-de      German from German                 vtt, srt, ttml, srv3, srv2, srv1, json3\nel-de      Greek from German                  vtt, srt, ttml, srv3, srv2, srv1, json3\ngn-de      Guarani from German                vtt, srt, ttml, srv3, srv2, srv1, json3\ngu-de      Gujarati from German               vtt, srt, ttml, srv3, srv2, srv1, json3\nht-de      Haitian Creole from German         vtt, srt, ttml, srv3, srv2, srv1, json3\nha-de      Hausa from German                  vtt, srt, ttml, srv3, srv2, srv1, json3\nhaw-de     Hawaiian from German               vtt, srt, ttml, srv3, srv2, srv1, json3\niw-de      Hebrew from German                 vtt, srt, ttml, srv3, srv2, srv1, json3\nhi-de      Hindi from German                  vtt, srt, ttml, srv3, srv2, srv1, json3\nhmn-de     Hmong from German                  vtt, srt, ttml, srv3, srv2, srv1, json3\nhu-de      Hungarian from German              vtt, srt, ttml, srv3, srv2, srv1, json3\nis-de      Icelandic from German              vtt, srt, ttml, srv3, srv2, srv1, json3\nig-de      Igbo from German                   vtt, srt, ttml, srv3, srv2, srv1, json3\nid-de      Indonesian from German             vtt, srt, ttml, srv3, srv2, srv1, json3\niu-de      Inuktitut from German              vtt, srt, ttml, srv3, srv2, srv1, json3\nga-de      Irish from German                  vtt, srt, ttml, srv3, srv2, srv1, json3\nit-de      Italian from German                vtt, srt, ttml, srv3, srv2, srv1, json3\nja-de      Japanese from German               vtt, srt, ttml, srv3, srv2, srv1, json3\njv-de      Javanese from German               vtt, srt, ttml, srv3, srv2, srv1, json3\nkl-de      Kalaallisut from German            vtt, srt, ttml, srv3, srv2, srv1, json3\nkn-de      Kannada from German                vtt, srt, ttml, srv3, srv2, srv1, json3\nkk-de      Kazakh from German                 vtt, srt, ttml, srv3, srv2, srv1, json3\nkha-de     Khasi from German                  vtt, srt, ttml, srv3, srv2, srv1, json3\nkm-de      Khmer from German                  vtt, srt, ttml, srv3, srv2, srv1, json3\nrw-de      Kinyarwanda from German            vtt, srt, ttml, srv3, srv2, srv1, json3\nko-de      Korean from German                 vtt, srt, ttml, srv3, srv2, srv1, json3\nkri-de     Krio from German                   vtt, srt, ttml, srv3, srv2, srv1, json3\nku-de      Kurdish from German                vtt, srt, ttml, srv3, srv2, srv1, json3\nky-de      Kyrgyz from German                 vtt, srt, ttml, srv3, srv2, srv1, json3\nlo-de      Lao from German                    vtt, srt, ttml, srv3, srv2, srv1, json3\nla-de      Latin from German                  vtt, srt, ttml, srv3, srv2, srv1, json3\nlv-de      Latvian from German                vtt, srt, ttml, srv3, srv2, srv1, json3\nln-de      Lingala from German                vtt, srt, ttml, srv3, srv2, srv1, json3\nlt-de      Lithuanian from German             vtt, srt, ttml, srv3, srv2, srv1, json3\nlua-de     Luba-Lulua from German             vtt, srt, ttml, srv3, srv2, srv1, json3\nluo-de     Luo from German                    vtt, srt, ttml, srv3, srv2, srv1, json3\nlb-de      Luxembourgish from German          vtt, srt, ttml, srv3, srv2, srv1, json3\nmk-de      Macedonian from German             vtt, srt, ttml, srv3, srv2, srv1, json3\nmg-de      Malagasy from German               vtt, srt, ttml, srv3, srv2, srv1, json3\nms-de      Malay from German                  vtt, srt, ttml, srv3, srv2, srv1, json3\nml-de      Malayalam from German              vtt, srt, ttml, srv3, srv2, srv1, json3\nmt-de      Maltese from German                vtt, srt, ttml, srv3, srv2, srv1, json3\ngv-de      Manx from German                   vtt, srt, ttml, srv3, srv2, srv1, json3\nmi-de      Māori from German                  vtt, srt, ttml, srv3, srv2, srv1, json3\nmr-de      Marathi from German                vtt, srt, ttml, srv3, srv2, srv1, json3\nmn-de      Mongolian from German              vtt, srt, ttml, srv3, srv2, srv1, json3\nmfe-de     Morisyen from German               vtt, srt, ttml, srv3, srv2, srv1, json3\nne-de      Nepali from German                 vtt, srt, ttml, srv3, srv2, srv1, json3\nnew-de     Newari from German                 vtt, srt, ttml, srv3, srv2, srv1, json3\nnso-de     Northern Sotho from German         vtt, srt, ttml, srv3, srv2, srv1, json3\nno-de      Norwegian from German              vtt, srt, ttml, srv3, srv2, srv1, json3\nny-de      Nyanja from German                 vtt, srt, ttml, srv3, srv2, srv1, json3\noc-de      Occitan from German                vtt, srt, ttml, srv3, srv2, srv1, json3\nor-de      Odia from German                   vtt, srt, ttml, srv3, srv2, srv1, json3\nom-de      Oromo from German                  vtt, srt, ttml, srv3, srv2, srv1, json3\nos-de      Ossetic from German                vtt, srt, ttml, srv3, srv2, srv1, json3\npam-de     Pampanga from German               vtt, srt, ttml, srv3, srv2, srv1, json3\nps-de      Pashto from German                 vtt, srt, ttml, srv3, srv2, srv1, json3\nfa-de      Persian from German                vtt, srt, ttml, srv3, srv2, srv1, json3\npl-de      Polish from German                 vtt, srt, ttml, srv3, srv2, srv1, json3\npt-de      Portuguese from German             vtt, srt, ttml, srv3, srv2, srv1, json3\npt-PT-de   Portuguese (Portugal) from German  vtt, srt, ttml, srv3, srv2, srv1, json3\npa-de      Punjabi from German                vtt, srt, ttml, srv3, srv2, srv1, json3\nqu-de      Quechua from German                vtt, srt, ttml, srv3, srv2, srv1, json3\nro-de      Romanian from German               vtt, srt, ttml, srv3, srv2, srv1, json3\nrn-de      Rundi from German                  vtt, srt, ttml, srv3, srv2, srv1, json3\nru-de      Russian from German                vtt, srt, ttml, srv3, srv2, srv1, json3\nsm-de      Samoan from German                 vtt, srt, ttml, srv3, srv2, srv1, json3\nsg-de      Sango from German                  vtt, srt, ttml, srv3, srv2, srv1, json3\nsa-de      Sanskrit from German               vtt, srt, ttml, srv3, srv2, srv1, json3\ngd-de      Scottish Gaelic from German        vtt, srt, ttml, srv3, srv2, srv1, json3\nsr-de      Serbian from German                vtt, srt, ttml, srv3, srv2, srv1, json3\ncrs-de     Seselwa Creole French from German  vtt, srt, ttml, srv3, srv2, srv1, json3\nsn-de      Shona from German                  vtt, srt, ttml, srv3, srv2, srv1, json3\nsd-de      Sindhi from German                 vtt, srt, ttml, srv3, srv2, srv1, json3\nsi-de      Sinhala from German                vtt, srt, ttml, srv3, srv2, srv1, json3\nsk-de      Slovak from German                 vtt, srt, ttml, srv3, srv2, srv1, json3\nsl-de      Slovenian from German              vtt, srt, ttml, srv3, srv2, srv1, json3\nso-de      Somali from German                 vtt, srt, ttml, srv3, srv2, srv1, json3\nst-de      Southern Sotho from German         vtt, srt, ttml, srv3, srv2, srv1, json3\nes-de      Spanish from German                vtt, srt, ttml, srv3, srv2, srv1, json3\nsu-de      Sundanese from German              vtt, srt, ttml, srv3, srv2, srv1, json3\nsw-de      Swahili from German                vtt, srt, ttml, srv3, srv2, srv1, json3\nss-de      Swati from German                  vtt, srt, ttml, srv3, srv2, srv1, json3\nsv-de      Swedish from German                vtt, srt, ttml, srv3, srv2, srv1, json3\ntg-de      Tajik from German                  vtt, srt, ttml, srv3, srv2, srv1, json3\nta-de      Tamil from German                  vtt, srt, ttml, srv3, srv2, srv1, json3\ntt-de      Tatar from German                  vtt, srt, ttml, srv3, srv2, srv1, json3\nte-de      Telugu from German                 vtt, srt, ttml, srv3, srv2, srv1, json3\nth-de      Thai from German                   vtt, srt, ttml, srv3, srv2, srv1, json3\nbo-de      Tibetan from German                vtt, srt, ttml, srv3, srv2, srv1, json3\nti-de      Tigrinya from German               vtt, srt, ttml, srv3, srv2, srv1, json3\nto-de      Tongan from German                 vtt, srt, ttml, srv3, srv2, srv1, json3\nts-de      Tsonga from German                 vtt, srt, ttml, srv3, srv2, srv1, json3\ntn-de      Tswana from German                 vtt, srt, ttml, srv3, srv2, srv1, json3\ntum-de     Tumbuka from German                vtt, srt, ttml, srv3, srv2, srv1, json3\ntr-de      Turkish from German                vtt, srt, ttml, srv3, srv2, srv1, json3\ntk-de      Turkmen from German                vtt, srt, ttml, srv3, srv2, srv1, json3\nuk-de      Ukrainian from German              vtt, srt, ttml, srv3, srv2, srv1, json3\nur-de      Urdu from German                   vtt, srt, ttml, srv3, srv2, srv1, json3\nug-de      Uyghur from German                 vtt, srt, ttml, srv3, srv2, srv1, json3\nuz-de      Uzbek from German                  vtt, srt, ttml, srv3, srv2, srv1, json3\nve-de      Venda from German                  vtt, srt, ttml, srv3, srv2, srv1, json3\nvi-de      Vietnamese from German             vtt, srt, ttml, srv3, srv2, srv1, json3\nwar-de     Waray from German                  vtt, srt, ttml, srv3, srv2, srv1, json3\ncy-de      Welsh from German                  vtt, srt, ttml, srv3, srv2, srv1, json3\nfy-de      Western Frisian from German        vtt, srt, ttml, srv3, srv2, srv1, json3\nwo-de      Wolof from German                  vtt, srt, ttml, srv3, srv2, srv1, json3\nxh-de      Xhosa from German                  vtt, srt, ttml, srv3, srv2, srv1, json3\nyi-de      Yiddish from German                vtt, srt, ttml, srv3, srv2, srv1, json3\nyo-de      Yoruba from German                 vtt, srt, ttml, srv3, srv2, srv1, json3\nzu-de      Zulu from German                   vtt, srt, ttml, srv3, srv2, srv1, json3\n[info] Available subtitles for jNQXAC9IVRw:\nLanguage Name    Formats\nen       English vtt, srt, ttml, srv3, srv2, srv1, json3\nde       German  vtt, srt, ttml, srv3, srv2, srv1, json3\n",
    "invocation":
      "yt-dlp --list-subs 'https://www.youtube.com/watch?v=jNQXAC9IVRw'",
    "links": [
      "https://www.ubuntubuzz.com/2023/07/practically-useful-youtube-dl-command-list.html",
      "https://superuser.com/questions/927523/how-to-download-only-subtitles-of-videos-using-youtube-dl",
      "https://github.com/yt-dlp/yt-dlp"
    ],
    "shell": "bash"
  },
  {
    "componentCommands": ["yt-dlp"],
    "description":
      "Download just the subtitles for a YouTube video to the current directory, in this case 'Me_at_the_zoo-[jNQXAC9IVRw].en.vtt'.",
    "invocation":
      "yt-dlp --write-subs --restrict-filenames --sub-langs='en.*' --skip-download 'https://www.youtube.com/watch?v=jNQXAC9IVRw'",
    "links": [
      "https://superuser.com/questions/927523/how-to-download-only-subtitles-of-videos-using-youtube-dl",
      "https://github.com/yt-dlp/yt-dlp"
    ],
    "shell": "bash"
  },
  {
    "componentCommands": ["yt-dlp"],
    "description":
      "Download just the automatic subtitles for a YouTube video to the current directory, in this case 'Me_at_the_zoo-[jNQXAC9IVRw].en.vtt'.",
    "invocation":
      "yt-dlp --write-auto-sub --write-info-json --sub-lang en 'https://www.youtube.com/watch?v=QncdLPYLPkA'",
    "links": [
      "https://superuser.com/questions/927523/how-to-download-only-subtitles-of-videos-using-youtube-dl",
      "https://github.com/yt-dlp/yt-dlp"
    ],
    "shell": "bash"
  },
  {
    "componentCommands": ["yt-dlp"],
    "description":
      "Download a YouTube video to ~/Videos/me-at-the-zoo.webm and create parent directories as needed.",
    "invocation":
      "yt-dlp --output ~/Videos/me-at-the-zoo.webm 'https://www.youtube.com/watch?v=jNQXAC9IVRw'",
    "links": [
      "https://www.ditig.com/yt-dlp-cheat-sheet",
      "https://github.com/yt-dlp/yt-dlp"
    ],
    "shell": "bash"
  },
  {
    "componentCommands": ["ffprobe"],
    "description":
      "Get duration of a video in seconds.",
    "exampleOutput": "4.970000\n",
    "invocation":
      "ffprobe -i example.mp4 -show_entries format=duration -v error -of csv=\"p=0\"",
    "links": [
      "https://superuser.com/questions/361329/how-can-i-get-the-length-of-a-video-file-from-the-console",
      "https://askubuntu.com/questions/224237/how-to-check-how-long-a-video-mp4-is-using-the-shell"
    ],
    "shell": "bash"
  },
  {
    "componentCommands": ["ffprobe"],
    "description": "Get duration of a video in hour:minute:seconds format.",
    "invocation":
      "ffprobe -i example.mp4 -show_entries format=duration -sexagesimal -v error -of csv=\"p=0\"",
    "links": [
      "https://superuser.com/questions/361329/how-can-i-get-the-length-of-a-video-file-from-the-console",
      "https://askubuntu.com/questions/224237/how-to-check-how-long-a-video-mp4-is-using-the-shell"
    ],
    "shell": "bash"
  },
  {
    "componentCommands": ["Get-PnpDevice"],
    "description": "Save USB devices to text file.",
    "invocation":
      "Get-PnpDevice -InstanceId 'USB*' -Status OK | Out-File -FilePath \"USB_Devices.txt\" -Encoding UTF8",
    "shell": "bash"
  },
  {
    "componentCommands": ["Get-PnpDevice"],
    "description": "Save USB devices to CSV file.",
    "invocation":
      "Get-PnpDevice -PresentOnly | Where-Object { $_.InstanceId -match '^USB' } | Select-Object Status, Class, FriendlyName, InstanceId | Export-Csv -Path \"USB_Devices.csv\" -NoTypeInformation -Encoding UTF8",
    "shell": "bash"
  },
  {
    "componentCommands": ["man", "col"],
    "description": "Save the bash(1) man page to a plain text file.",
    "invocation": "man bash | col -bx > man_bash.txt",
    "links": [
      "https://unix.stackexchange.com/questions/15855/how-to-dump-a-man-page"
    ],
    "shell": "bash"
  },
  {
    "componentCommands": ["man", "col"],
    "description":
      "Save the bash(1) man page to a plain text file, using a width of 120 characters.",
    "invocation": "MANWIDTH=120 man bash | col -bx > man_bash.txt",
    "links": [
      "https://unix.stackexchange.com/questions/15855/how-to-dump-a-man-page"
    ],
    "shell": "bash"
  },
  {
    "componentCommands": ["iconv"],
    "description": "Convert from UTF-8 to ISO-8859-1.",
    "invocation":
      "iconv -f UTF-8 -t ISO-8859-1 input_utf8.txt > output_latin1.txt",
    "links": [
      "https://stackoverflow.com/questions/44412168/convert-utf8-to-iso8859-1-using-iconv-command"
    ],
    "shell": "bash"
  },
  {
    "componentCommands": ["iconv"],
    "description":
      "Convert from UTF8 to ISO8859-1, silently discarding encoding errors.",
    "invocation":
      "iconv -c -f UTF-8 -t ISO-8859-1 input_utf8.txt > output_latin1.txt",
    "links": [
      "https://stackoverflow.com/questions/44412168/convert-utf8-to-iso8859-1-using-iconv-command"
    ],
    "shell": "bash"
  },
  {
    "componentCommands": ["xdg-mime"],
    "description":
      "Show default file manager application along with debug output.",
    "invocation":
      "XDG_UTILS_DEBUG_LEVEL=2 xdg-mime query default 'inode/directory'",
    "links": [
      "https://askubuntu.com/questions/1292612/xdg-open-does-not-open-files-in-the-preferred-applicaton"
    ],
    "shell": "bash"
  },
  {
    "componentCommands": ["xdg-mime"],
    "description": "Show default PDF reader.",
    "invocation": "xdg-mime query default 'application/pdf'",
    "shell": "bash"
  },
  {
    "componentCommands": ["xdg-mime"],
    "description":
      "Trace the file that gives the mimetype association for PDF files.",
    "invocation":
      "XDG_UTILS_DEBUG_LEVEL=2 xdg-mime query default 'application/pdf'",
    "shell": "bash"
  },
  {
    "componentCommands": ["ktraderclient5"],
    "description": "See how KDE handles the 'appplication/pdf' mimetype.",
    "invocation": "ktraderclient5 --mimetype 'application/pdf'",
    "links": [
      "https://bugs.kde.org/show_bug.cgi?id=347353",
      "https://unix.stackexchange.com/questions/565202/kde-is-not-saving-a-mime-type-file-association"
    ],
    "shell": "bash"
  },
  {
    "componentCommands": ["locate"],
    "description":
      "Print all directories with exact name 'build', works with mlocate but not plocate.",
    "invocation": "locate -b '\\build'",
    "links": [
      "https://askubuntu.com/questions/831869/locate-command-for-searching-exact-filename-only"
    ],
    "shell": "bash"
  },
  {
    "componentCommands": ["locate"],
    "description":
      "Print all directories with exact name 'build', works with both mlocate and plocate.",
    "invocation": "locate -b -r '^build$'",
    "links": [
      "https://askubuntu.com/questions/831869/locate-command-for-searching-exact-filename-only"
    ],
    "shell": "bash"
  },
  {
    "componentCommands": ["locate"],
    "description":
      "Print all files with a path or name containing 'LC_TIME', case-sensitive.",
    "invocation": "locate 'LC_TIME'",
    "shell": "bash"
  },
  {
    "componentCommands": ["locate"],
    "description":
      "Print all files with a path or name containing 'lc_time', ignoring case.",
    "invocation": "locate -i 'LC_TIME'",
    "shell": "bash"
  },
  {
    "componentCommands": ["locate"],
    "description":
      "Print all base filenames or base directory names containing '[' character.",
    "invocation": "locate -b '\\['",
    "shell": "bash"
  },
  {
    "componentCommands": ["locate"],
    "description":
      "Print all base filenames or directories starting with 'conf'.",
    "invocation": "locate -b 'conf*'",
    "shell": "bash"
  },
  {
    "componentCommands": ["locate"],
    "description": "Print all filenames or directories under /usr/share.",
    "invocation": "locate '/usr/share/*'",
    "links": [
      "https://askubuntu.com/questions/33280/use-locate-under-some-specific-directory"
    ],
    "shell": "bash"
  },
  {
    "componentCommands": ["locate"],
    "description":
      "Print all filenames or directories ending with '.conf' under /usr/share.",
    "invocation": "locate '/usr/share/*.conf'",
    "links": [
      "https://askubuntu.com/questions/33280/use-locate-under-some-specific-directory"
    ],
    "shell": "bash"
  },
  {
    "componentCommands": ["locate"],
    "description":
      "Print all file paths ending with '.conf', using built-in glob pattern.",
    "invocation": "locate '*.conf'",
    "shell": "bash"
  },
  {
    "componentCommands": ["locate"],
    "description":
      "Print all file paths ending with '.conf', using regular expressions.",
    "invocation": "locate -r '\\.conf$'",
    "shell": "bash"
  },
  {
    "componentCommands": ["locate"],
    "description":
      "Print all files that end with '.htm' and '.html' (basic POSIX regular expressions).",
    "invocation": "locate -b -r '\\.\\(htm\\|html\\)$'",
    "shell": "bash"
  },
  {
    "componentCommands": ["locate"],
    "description":
      "Print all files that end with '.htm' and  '.html' (extended POSIX regular expressions).",
    "invocation": "locate -b --regex '\\.html?$'",
    "shell": "bash"
  },
  {
    "componentCommands": ["locate"],
    "description": "Print all paths that end in 'share/applications'",
    "invocation": "locate -r 'share/applications$'",
    "shell": "bash"
  },
  {
    "componentCommands": [
      "find",
      "rename"
    ],
    "description": "Remove pipe characters from filenames recursively.",
    "invocation": "find . -name '*|*' -exec rename -n 's/\\|//g' '{}' \\+",
    "shell": "bash"
  },
  {
    "componentCommands": [
      "grep"
    ],
    "description": "Filter out words with uppercase (i.e. capital) letters.",
    "invocation": "grep -v '[A-Z]' /usr/share/dict/words",
    "shell": "bash"
  },
  {
    "componentCommands": [
      "du"
    ],
    "description": "Print disk usage of current directory and subdirectories in 1024 bytes (KiB).",
    "invocation": "du",
    "shell": "bash"
  },
  {
    "componentCommands": [
      "du"
    ],
    "description": "Print disk usage of current directory and subdirectories in bytes.",
    "invocation": "du -b",
    "shell": "bash"
  },
  {
    "componentCommands": [
      "du"
    ],
    "description": "Print disk usage of current directory and subdirectories in bytes (long flag).",
    "invocation": "du --bytes",
    "shell": "bash"
  },
  {
    "componentCommands": [
      "du",
      "sort"
    ],
    "description": "Print disk usage of /boot and subdirectories in bytes.",
    "exampleOutput": "357321475\t/boot\n8076090\t/boot/grub\n6458969\t/boot/efi/EFI\n6458969\t/boot/efi\n4547681\t/boot/efi/EFI/ubuntu\n3105455\t/boot/grub/x86_64-efi\n2411806\t/boot/grub/fonts\n1911288\t/boot/efi/EFI/BOOT\n135880\t/boot/grub/locale\n0\t/boot/efi/EFI/UpdateCapsule\n0\t/boot/efi/EFI/ubuntu/fw\n",
    "invocation": "du -b | sort -nr",
    "shell": "bash"
  },
  {
    "componentCommands": [
      "du",
      "sort"
    ],
    "description": "Print disk usage of /boot and subdirectories in bytes (long flags).",
    "exampleOutput": "357321475\t/boot\n8076090\t/boot/grub\n6458969\t/boot/efi/EFI\n6458969\t/boot/efi\n4547681\t/boot/efi/EFI/ubuntu\n3105455\t/boot/grub/x86_64-efi\n2411806\t/boot/grub/fonts\n1911288\t/boot/efi/EFI/BOOT\n135880\t/boot/grub/locale\n0\t/boot/efi/EFI/UpdateCapsule\n0\t/boot/efi/EFI/ubuntu/fw\n",
    "invocation": "du --bytes /boot | sort --numeric-sort --reverse",
    "shell": "bash"
  },
  {
    "componentCommands": [
      "du",
      "sort"
    ],
    "description": "Print which user directory is taking up the most disk space in units of KiB.",
    "invocation": "du -k --max-depth=1 /home | sort -nr",
    "shell": "bash"
  },
  {
    "componentCommands": [
      "ncdu"
    ],
    "description": "Look at disk usage of current directory interactively.",
    "invocation": "ncdu",
    "shell": "bash"
  },
  {
    "componentCommands": [
      "mkvextract"
    ],
    "description": "Extract audio tracks from an mkv file.",
    "invocation": "mkvextract tracks example.mkv 2:example_out.ac3",
    "shell": "bash"
  },
  {
    "componentCommands": [
      "ls"
    ],
    "description": "Show list of all files except . and .. in a single column.",
    "invocation": "ls --almost-all --format=single-column",
    "shell": "bash"
  },
  {
    "componentCommands": [
      "!!"
    ],
    "description": "Shortcut to repeat previous command in bash using history expansion. Interactive shells only.",
    "invocation": "!!",
    "links": [
      "https://www.gnu.org/software/bash/manual/html_node/Event-Designators.html",
      "https://www.redhat.com/en/blog/bash-bang-commands",
      "https://unix.stackexchange.com/questions/147563/how-do-i-repeat-the-last-command-without-using-the-arrow-keys"
    ],
    "shell": "bash"
  },
  {
    "componentCommands": [
      "watch",
      "lsusb"
    ],
    "description": "List USB devices every second and highlight any changes. Useful while plugging or unplugging USB devices.",
    "invocation": "watch -d -n 1 lsusb",
    "links": [
      "https://askubuntu.com/questions/600818/bluetooth-messed-up-by-kernel-3-13-46",
      "https://unix.stackexchange.com/questions/776606/usb-wireless-adapter-not-showing-except-in-lsusb"
    ],
    "shell": "bash"
  },
  {
    "componentCommands": [
      "systemd-inhibit",
      "sleep"
    ],
    "description": "Prevent laptop from going to idle standby or sleep mode for 1 hour (3600 seconds).",
    "invocation": "systemd-inhibit --what=idle:sleep sleep 3600",
    "links": [
      "https://askubuntu.com/questions/577862/how-to-temporarily-disable-sleep-and-hibernate-from-the-command-line"
    ],
    "shell": "bash"
  },
  {
    "componentCommands": [
      "ag"
    ],
    "description": "Search for HTML files constaining CSS for a dark color scheme.",
    "invocation": "ag -lQG '.*\\.html' 'prefers-color-scheme: dark'",
    "shell": "bash"
  },
  {
    "componentCommands": [
      "ag"
    ],
    "description": "Print permissions in human-readable (%A) and octal (%a) format, as well as owner (%U) and group (%G).",
    "invocation": "stat -c '%A %a %U %G %n' myfile.txt",
    "shell": "bash"
  },
  {
    "componentCommands": [
      "chmod"
    ],
    "description": "Set permissions of a file so that all users can read it but only the owner can modify it.",
    "invocation": "chmod u=rw,g=r,o=r myfile.txt",
    "links": [
      "http://www.quitsendingmetrash.com/lrn/unix/commands/chmod/chmodBasics.html",
      "https://www.linuxjournal.com/article/1190",
      "https://marcyes.com/2018/0208-a-simple-way-to-remember-linux-permissions/"
    ],
    "shell": "bash"
  },
  {
    "componentCommands": [
      "chmod"
    ],
    "description": "Set permissions of a file so that all users can read it but only the owner can modify it.",
    "invocation": "chmod 0644 myfile.txt",
    "links": [
      "http://www.quitsendingmetrash.com/lrn/unix/commands/chmod/chmodBasics.html",
      "https://www.linuxjournal.com/article/1190",
      "https://marcyes.com/2018/0208-a-simple-way-to-remember-linux-permissions/"
    ],
    "shell": "bash"
  },
  {
    "componentCommands": [
      "chmod"
    ],
    "description": "Set permissions of a directory called mydir/ so that only the owner and group members can modify it, but don't change access settings.",
    "invocation": "chmod a-w,ug+w mydir/",
    "shell": "bash"
  },
  {
    "componentCommands": [
      "chmod"
    ],
    "description": "Set permissions of a directory called mydir/ so that only the owner and group members can modify it, but don't change access settings.",
    "invocation": "chmod ug+w,o-w mydir/",
    "shell": "bash"
  },
  {
    "componentCommands": [
      "chmod"
    ],
    "description": "Set permissions of a directory so that only the owner and group members access and modify mydir/.",
    "invocation": "chmod ug=rwx,o=rwx mydir/",
    "shell": "bash"
  },
  {
    "componentCommands": [
      "chmod"
    ],
    "description": "Set permissions of a directory so that only the owner and group members access and modify mydir/.",
    "invocation": "chmod 0770 mydir/",
    "shell": "bash"
  },
  {
    "componentCommands": [
      "chmod"
    ],
    "description": "Set permissions of a directory so only the owner can access.",
    "invocation": "chmod u+rwx,g-rwx,o-rwx mydir/",
    "shell": "bash"
  },
  {
    "componentCommands": [
      "chmod"
    ],
    "description": "Set permissions of a directory so only the owner can access.",
    "invocation": "chmod 0700 mydir/",
    "shell": "bash"
  }
];

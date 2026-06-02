#! /usr/bin/env node

const fs = require("fs");
const vm = require("vm");

var args = process.argv.slice(2);
const jsFilePath = args[0];
const outJsonPath = args[1];

const fileData = fs.readFileSync(jsFilePath, "utf8");
const contextMock = {
  window: {},
  document: {
    getElementById: () => ({ addEventListener: () => {} })
  },
  console: console
};

contextMock.window = contextMock;
vm.createContext(contextMock);
vm.runInContext(fileData, contextMock);

const string = JSON.stringify(
  contextMock.cmdInfo,
  null, // include all string-keyed properties of objects
  2 // indent by 2 spaces
);

fs.writeFile(outJsonPath, string, "utf8", err => {
  if (err) {
    console.error(err);
  } else {
    console.debug(`'${outJsonPath}' written successfully`);
  }
});

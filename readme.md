# Field descriptions

## Mandatory fields

- `invocation`

  The actual command string that is entered into the shell.

  Example: `find . -type f -execdir file '{}' +`

- `description`

  Describe what the command does.

  Example: "Print filename and file information for each file under current
  directory, recursively."

- `componentCommands`

  List of component commands used in the command invocation.

  Example: ["find", "file"]

- `shell`

  The name of the shell or interpreter that runs the commands.

  Example: "bash"

## Optional fields

- `exampleOutput`

- `links`

- `uuid`

# Design, explanation, and rationale Q & A

> Why is `componentCommands` necessary?

A simple search of the command invocation will often match too many things.
For example, `ls` will match many other commands,
including `lsattr`, `lsblk`, `lshw`, `lsmod`, `lsof`, `lspci`, and `lsusb`.
Explicitly listing the component commands makes it much easier to narrow down
the desired commands in a search.

> Why a single Javascript file for data and code?

This makes it work as a single standalone static HTML page.
Adding more commands requires only a text editor.
No dependencies other than a browser, and no internet connection required.
Debugging is easier as any errors from the browser
correspond to the actual line number of the Javascript file.

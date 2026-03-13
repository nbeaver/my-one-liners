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

Design goals:

- Static HTML with full offline functionality.
- No dependencies except a standards-compliant web browser.
- Consistent data format with full backward and forward compatibility.
- All data stored in a single JavaScript file,
  with a format that could be copy and pasted into a JSON file.
- Ease of debugging: data errors point to a line in a single JavaScript file.

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

> What if a command works with more than one shell?

The `shell` field is intended to correspond to the shell most associated with a command,
or the shell most mnemonic for recalling a command invocation.
It is not intended to describe all the shells where such a command could work,
as commands are often available in multiple different shells.
For example, the `dir` command is available in [MS-DOS](https://en.wikipedia.org/wiki/List_of_DOS_commands#DIR) with [COMMAND.COM](https://en.wikipedia.org/wiki/COMMAND.COM),
[Windows NT](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/dir) with [`cmd.exe`](https://en.wikipedia.org/wiki/Cmd.exe),
and on Unix-like systems [with GNU coreutils](https://www.gnu.org/software/coreutils/manual/html_node/dir-invocation.html#dir-invocation).
However, today the `dir` command is most commonly associated with the `cmd.exe` interpreter
for Windows NT, so for most people `cmd.exe` is the appropriate choice.

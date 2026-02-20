Mandatory fields:

- `componentCommands`
- `description`
- `invocation`
- `shell`

Optional fields:

- `exampleOutput`
- `relevantURLs`
- `uuid`

# Design and rationale

> Why is `componentCommands` necessary?

A simple search of the command invocation will match too many things.
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

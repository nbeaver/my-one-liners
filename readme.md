Mandatory fields:

- `componentCommands`
- `description`
- `invocation`
- `shell`

Optional fields:

- `exampleOutput`
- `relevantURLs`
- `uuid`

# Rationale

> Why is `componentCommands` necessary?

A simple search for `ls` will match many other commands,
including `lsattr`, `lsblk`, `lshw`, `lsmod`, `lsof`, `lspci`, and `lsusb`.
Explicitly listing the component commands makes it much easier to narrow down
the desired commands in a search.

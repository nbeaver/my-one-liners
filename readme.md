# Intro

When I got more serious about learning interactive shells like the bash command line circa 2012,
I started [saving useful one-liners to a text file](https://github.com/nbeaver/cool-commands).
Over time this file grew to to contain thousands of commands,
and it became increasing difficult to find the command I wanted.
I especially wanted to be able to search for the command string
separately from the explanatory comments I had added.
I began thinking about ways to store one-liner commands in a more structured way,
so that the descriptions and other metadata could be searched separately
from the command itself.

This capability works well for single commands,
but where this really shines is *composite commands*,
i.e. one-liners composed of multiple commands.
This includes commands that take another command as an argument
(such as `find`'s `-exec`/`execdir` argument),
arguments supplied by command expansion (such as `killall $(pgrep firefox)`),
and commands that pipe output to another command
(such as `pwd | tr -d '\n' | xsel -b`).
I particularly wanted to be able to search for particular component commands,
such as `grep` without matching `pgrep` or `ls` without matching `lsof`.
After experimenting with a [command-line search version of this idea](https://github.com/nbeaver/cmd_oysters)
I decided to do a simpler version with static HTML instead.

<!--- TODO link to hosted version --->

This provides the benefits of interactivity
without requiring an additional installation step,
since almost all users have access to a web browser.

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

- Batteries included (many useful commands available by default)
- Static HTML with full offline functionality.
- No dependencies (except a standards-compliant web browser).
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

> What counts as a component command?

The choice of what is and isn't a component command
is a pragmatic choice depending on your taste and judgement.
For example, in `bash` it is reasonable to state
that for this command:

    cat file2 >> file1

the only component command is `cat` and counting `>>` as a component command
would be confusing as `>>` is a *redirection operator*, not a command unto itself.
However in `zsh` this command is equivalent and does not use `cat`:

    < file2 >> file1

so in this case it might be said that `<` and `>>` could be considered component commands
for the purposes of making this command easier to find.

Similarly, in a looping construct such as
`
    while read line; do echo -e "$line\n"; done < file.txt

almost certainly the shell builtins `read` and `echo` should be counted as component commands,
but whether the shell keywords `while`, `do` or `done` should be considered component commands
is left to the user's discretion.

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

> Why aren't multiple variations of a command permitted permitted per entry?

While this might seem desirable in certain cases,
such as for a long and short flag version of a command,
the data model and conceptual framework
relies on specifying the properties of a single invocation.
Permitting multiple invocations makes detecting duplicates harder,
in addition to complicating the data model and interface for little real benefit.
Similarly, a single description is better than e.g. a verbose description
and a terse description field.

> Why are the command examples specific instead of more generalized?

This is a stylistic choice: a command invocation
should resemble real usage as much as possible,
and ideally should be runnable as-is on an actual system.
For example,

    grep -nP '[^[:ascii:]]' --color=always /usr/share/dict/words | less -R

is a better example than

    grep -nP '[^[:ascii:]]' --color=always /path/to/file.txt | less -R

which is better than

    grep -nP '[^[:ascii:]]' --color=always foo | less -R

which is better than

    grep -nP '[^[:ascii:]]' foo

which is better than

    grep -nP '[^[:ascii:]]' [FILE...]

even though the last example is the most abstract, general case.
From this perspective, the "best" example is not the most general,
it is the one that is closest to an example that can be run without modification.

Thus, metasyntax designed to show all the possible uses of a command,
or make the example more abstract,
such as the man-page convention `[FILE...]`,
or [metasyntactic variables](https://en.wikipedia.org/wiki/Metasyntactic_variable) like `foo` and `bar`, are not good examples.

# Related projects

## Centralized command lists
- https://github.com/denisidoro/navi
- https://github.com/Orange-Cyberdefense/arsenal
- https://github.com/tldr-pages/tldr
- https://github.com/knqyf263/pet
- https://github.com/ok-borg/borg
- https://github.com/orkohunter/keep
- https://github.com/plainas/icl
- https://launchpad.net/clicompanion
- https://github.com/nbeaver/cmd_oysters

## Enhanced shell history
- https://atuin.sh/
- https://github.com/dvorka/hstr

## Per-folder files
- https://secretgeek.net/ok
- https://github.com/casey/just
- https://github.com/laktak/tome

# Websites
- https://bropages.org/ (defunct)
- https://explainshell.com/
- https://www.commandlinefu.com/
- https://cb.vu/unixtoolbox.html

# Self-hosted applications:
- https://github.com/pawelmalak/snippet-box

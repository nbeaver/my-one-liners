# General

- [x] Make a visually obvious distinction between the "Search/filter" area and the "Edit/Import/Export" section
- [ ] Add an "About" page
- [x] Use camelCase for all keys
- [x] Dark mode
- [ ] Dark/light mode toggle
- [x] Add a button to export cmdInfo data to JSON file
- [x] Add a button to import cmdInfo data from JSON file
- [x] Add a button to append a command to cmdInfo with appropriate fields
- [x] Add an "Edit" button for each command and sync any changes back to cmdInfo global variable.
- [x] Prevent closing the tab if there are unsaved changes
- [ ] Warn on import if there are unsaved changes
- [ ] Add a "Clear" button in the search section

# Validation

- [x] Do basic validation on data on first load
- [x] Check for duplicate commands
- [x] Allow optional UUID for error messages and debugging
- [x] Check type is correct (string, list of strings, etc.)
- [ ] Check that component commands are in the command invocation
- [ ] Check for whitespace in component commands
- [x] Turn validation logic into functions that return true/false so they can be tested
- [x] Write tests for validation functions
- [x] Do proper form validation when adding a new command

# Search

## Description

- [ ] Default to ignoring order of words in matching description search, add checkbox for "Strict order"
- [ ] Return partial matches for description search if there are no matches for all words.
- [ ] Regex search option for description

## Other fields

- [x] Regex search toggle for command invocation
- [ ] Regex search option for example output
- [x] Search box for component commands
- [x] Search box for command string
- [x] Search box for sample output
- [x] Search box for links
- [ ] Search box for uuid
- [ ] Case-sensitive toggle for commands
- [ ] Case-sensitive toggle for component commands
- [x] Output shell options and have toggle for each
- [x] Button for no shells
- [x] Button for all shells

# Output

- [x] Click to copy command
- [ ] Toggle for component commands
- [x] Toggle for description
- [x] Toggle for sample output (`<samp></samp>`)
- [x] Toggle for shell
- [x] Toggle for links
- [x] Show all commands by default

# Maybe do

- [x] Display number of unique invocations and unique component commands for each shell
- [ ] Add toggle box for optional fields, e.g. "has links", "has example output"
- [ ] Save GUI state in URL (share a link that approximates linking directly to a command)
- [ ] Add a field for a URL to load additional JSON resource

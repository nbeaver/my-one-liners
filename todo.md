General
- [x] Use camelCase for all keys
- [x] Dark mode
- [ ] Dark/light mode toggle
- [x] Add a button to export cmdInfo data to JSON file
- [x] Add a button to import cmdInfo data from JSON file
- [ ] Add a field for a URL to load additional JSON resource
- [x] Add a button to append a command to cmdInfo with appropriate fields

Validation
- [x] Do basic validation on data on first load
- [x] Check for duplicate commands
- [x] Allow optional UUID for error messages and debugging
- [x] Check type is correct (string, list of strings, etc.)
- [ ] Check that component commands are in the command invocation
- [ ] Turn validation logic into functions that return true/false so they can be tested
- [ ] Write tests for validation functions
- [x] Do proper form validation when adding a new command

Search
- [x] Regex search toggle for command invocation
- [ ] Regex search option for description
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

Output
- [x] Click to copy command
- [ ] Toggle for component commands
- [x] Toggle for description
- [x] Toggle for sample output (`<samp></samp>`)
- [x] Toggle for shell
- [x] Toggle for links
- [x] Show all commands by default

Maybe do
- [x] Display number of unique invocations and unique component commands for each shell
- [ ] Add toggle box for optional fields, e.g. "has links", "has example output"
- [ ] Save GUI state in URL (share a link that approximates linking directly to a command)
- [x] Add an "Edit" button for each command and sync any changes back to cmdInfo global variable.

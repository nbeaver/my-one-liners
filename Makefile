.PHONY: lint-js
lint-js:
	npm exec -- prettier --write "**/*.js"
	npm exec -- eslint --fix "**/*.js"

# https://docs.npmjs.com/cli/v8/commands/npx#npx-vs-npm-exec

.PHONY: lint-html
lint-html:
	tidy -errors -quiet index.html

.PHONY: install-npm
install-npm:
	npm clean-install
	# npm install eslint globals
# https://stackoverflow.com/questions/52499617/what-is-the-difference-between-npm-install-and-npm-ci

.PHONY: initialize-eslint-config
initialize-eslint-config:
	npm init @eslint/config@latest

.PHONY: update-npm
update-npm:
	npm update


readme.html : readme.md
	cmark "$<" > "$@"

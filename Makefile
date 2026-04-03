.PHONY: lint
lint:
	tidy -errors -quiet index.html
	npm exec -- prettier --write "**/*.js"
	npm exec -- eslint "**/*.js"

# https://docs.npmjs.com/cli/v8/commands/npx#npx-vs-npm-exec

.PHONY: install-npm
install-npm:
	npm ci
	# npm install
# https://stackoverflow.com/questions/52499617/what-is-the-difference-between-npm-install-and-npm-ci

readme.html : readme.md
	cmark "$<" > "$@"

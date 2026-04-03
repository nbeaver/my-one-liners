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

readme.html : readme.md
	cmark "$<" > "$@"

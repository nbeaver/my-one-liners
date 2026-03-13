lint:
	tidy -errors -quiet index.html
	npx prettier --write "**/*.js"
	npx eslint "**/*.js"

readme.html : readme.md
	cmark "$<" > "$@"

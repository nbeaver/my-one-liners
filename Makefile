lint:
	tidy -errors -quiet index.html
	npx prettier --write "**/*.js"
	npx eslint "**/*.js"
	npx stylelint "**/*.css"

readme.html : readme.md
	cmark "$<" > "$@"

lint:
	tidy -errors -quiet index.html
	npx prettier --write command-search.js
	npx eslint command-search.js

readme.html : readme.md
	cmark "$<" > "$@"

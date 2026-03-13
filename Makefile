lint:
	tidy -errors -quiet index.html
	npx prettier --double-quote --write command-search.js
	npx eslint command-search.js
	#npx semistandard command-search.js

readme.html : readme.md
	cmark "$<" > "$@"

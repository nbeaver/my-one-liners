lint:
	tidy -errors -quiet index.html
	npx eslint command-search.js
	#npx semistandard command-search.js

readme.html : readme.md
	cmark "$<" > "$@"

all: index.md plastiq.js skrollr.js prettyprint.js app.js

index.md : __nothing
	echo "---\nlayout: index\ntitle: plastiq\n---" > index.md
	# git show origin/master:readme.md | sed 's/```/~~~/' >> index.md
	cat node_modules/plastiq/readme.md | grep -v requirebin | sed 's/```/~~~/' >> index.md

plastiq.js: node_modules/plastiq/plastiq.js
	cp node_modules/plastiq/plastiq.js plastiq.js

skrollr.js: node_modules/skrollr/dist/skrollr.min.js
	cp node_modules/skrollr/dist/skrollr.min.js skrollr.js

prettyprint.js: node_modules/js-object-pretty-print/index.js
	browserify node_modules/js-object-pretty-print/index.js -s prettyprint > prettyprint.js

app.js: page.js
	browserify page.js > app.js

__nothing:

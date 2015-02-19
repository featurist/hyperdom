all: index.md plastiq.js

index.md : __nothing
	echo "---\nlayout: index\ntitle: plastiq\n---" > index.md
	git show origin/master:readme.md | sed 's/^```/~~~/' >> index.md

plastiq.js: node_modules/plastiq/plastiq.js
	cp node_modules/plastiq/plastiq.js plastiq.js

__nothing:

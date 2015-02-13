index.md : __nothing
	echo "---\nlayout: index\ntitle: plastiq\n---" > index.md
	git show origin/master:readme.md | sed 's/^```/~~~/' >> index.md

__nothing:

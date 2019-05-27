### Populate code example blocks from codesandbox projects

```
yarn populate-code-blocks
```

This will preprocess `./docs/src/*.md` files, copy them to `./docs`.

Note! Don't edit files in `./docs` if they have a counterpart in `./docs/src` because they will get overwritten.

#### Watch and rebuild

You could use [entr](http://eradman.com/entrproject/):

```
ls docs/src/*.md | entr yarn populate-code-blocks
```

### Serve docs locally

```
yarn docs
```

This runs the above and then starts serving `./docs/index.html`

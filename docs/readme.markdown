## Hyperdom docs website

The website - https://hyperdom.org - hosted on github-pages (`gh-pages` branch).

It's assembled together from individual `.md` files at runtime (that is, when user navigates to the website) by [docsify](https://docsify.js.org/#/)

### Runnable examples

Hyperdom docs website features embedded codesanbox examples. Those live in `/docs/codesandbox` and turned into `iframe`s at runtime as well.

A special link in the markdown source facilitates the trick. E.g.:

```
[codesandbox](https://codesandbox.io/embed/github/featurist/hyperdom/tree/master/docs/codesandbox/get-started-init?fontsize=14)
```

will result in a codesandbox iframe containing the project from `/docs/codesandbox/get-started-init`

#### Example code blocks

`/docs/codesandbox` are also used to populate code example blocks (not to be mixed with runnable examples).

This is done with another magic link. E.g.:
```
[view code](docs/codesandbox/get-started-events/src/browser/app.jsx#L3)
```

This it __NOT__ a runtime thing though and it requires preprocessing. It's built into `yarn dev-website` and `yarn publish-website` so you don't need to do anything.

### Development

#### Serve docs locally

```
yarn docs
```

This runs the above and then starts serving `./docs/index.html`

#### Watch and rebuild code example blocks

You could use [entr](http://eradman.com/entrproject/):

```
ls docs/src/*.md | entr yarn populate-code-blocks
```

### Publishing

The following updates `gh-pages` branch with the difference between `gh-pages` and your local code:

```
yarn publish-website
```

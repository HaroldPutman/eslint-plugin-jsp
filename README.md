# eslint-plugin-jsp
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage Status][coveralls-image]][coveralls-url]

Process javascript in JSP files

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-jsp`:

```
$ npm install eslint-plugin-jsp --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-jsp` globally.

## Usage

Add `jsp` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "jsp"
    ]
}
```

**Note:** Since this plugin implements a preprocessor, the `--fix` command will have no effect.

### Anotating your jsp

* `<%-- eslint-begin --%>` and `<%-- eslint-end --%>` to mark the sections of you code that will be linted.

* `<%-- jsp-result:{} --%>` will insert the expression after the colon. Use this in places where javascript and JSP expressions are mixed:
```
// An expression like this:
var a = <jsp:element input="foo"/> <%-- jsp-result:5 --%>;
// appears to the linter as:
var a = /* jsp:element input="f */ 5;
```

* `<%-- jsp comments --%>` and `<!-- xml comments -->` are ignored.

[npm-image]: https://badge.fury.io/js/eslint-plugin-jsp.svg
[npm-url]: https://npmjs.org/package/eslint-plugin-jsp
[travis-image]: https://travis-ci.org/HaroldPutman/eslint-plugin-jsp.svg?branch=master
[travis-url]: https://travis-ci.org/HaroldPutman/eslint-plugin-jsp
[daviddm-image]:
https://david-dm.org/haroldputman/eslint-plugin-jsp/dev-status.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/HaroldPutman/eslint-plugin-jsp
[coveralls-image]: https://coveralls.io/repos/github/HaroldPutman/eslint-plugin-jsp/badge.svg?branch=master
[coveralls-url]:https://coveralls.io/github/HaroldPutman/eslint-plugin-jsp?branch=master

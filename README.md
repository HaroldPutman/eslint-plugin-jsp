# eslint-plugin-jsp

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

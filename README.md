# Overlay

[![License][license-image]][license-url] [![NPM Package Version][npm-image-version]][npm-url] ![GitHub top language][language-image] ![Size][size-image] ![Last Commit][commit-image]

A generic overlay component that can be used as a Modal dialog or a Toast message component.

## Installation and usage

```bash
$ npm i @kdts/overlay
```

```js
import { Overlay } from "@kdts/overlay";
// or
const { Overlay } = require("@kdts/overlay");
```

Simple to use with minimal configuration. Display a content in a Modal dialog as follow:

```js
// Create the content on the fly or from by ready the innerHTML on an element.
// It just need to be string.
const myContent = document.querySelector("#my-template").innerHTML;

const $modal = new Overlay({
    // title: "optional",
    content: myContent,
});
```

Display notification Toast as follow:

```js
const $toast = new Overlay({
    classList: ["toast", "toast-bottom", "toast-right"],
    dismissible: false,
    title: "Settings successfully updated.",
    // content: "optional",
    autoCloseAfter: 1500, // ms
});
```

### Event

Adding events it as simple a calling the `on` method and passing a callback

```js
const $modal = new Overlay({
    content: myContent,
});

$modal.on("click", event => {
    if (event.target.closest(".my-action-button")) {
        // Target button clicked, do something ...
        // The content of the overlay is available on DOM element $modal.overlay
    }
});
```

Events are added to the wrapper element of the overlay `$modal.overlay`. Since it's just a regular DIV-Element you can set any appropriate Event like `keydown`, `keyup`, `mousedown`, ...

Additionally the overlay supports the following events

```js
$modal.on("ready", $overlay => {
    // $overlay.querySeletor('.my-target-element-selector')
});

$modal.on("close", $overlay => {
    // const formdata = new FormData($overlay.querySeletor('form'))
});
```

## License

See [LICENSE][license-url].

## Copyright

Copyright &copy; 2023. Kossi D. T. Saka.

[npm-image-version]: https://img.shields.io/npm/v/@kdts/overlay.svg
[npm-image-downloads]: https://img.shields.io/npm/dm/@kdts/overlay.svg?color=purple
[npm-url]: https://npmjs.org/package/@kdts/overlay
[license-image]: https://img.shields.io/github/license/kossidts/overlay
[license-url]: https://github.com/kossidts/overlay/blob/master/LICENSE
[language-image]: https://img.shields.io/github/languages/top/kossidts/overlay?color=yellow
[size-image]: https://img.shields.io/github/repo-size/kossidts/overlay?color=light
[commit-image]: https://img.shields.io/github/last-commit/kossidts/overlay
[actions-url]: https://github.com/kossidts/overlay/actions
[workflow-image]: https://github.com/kossidts/overlay/actions/workflows/node.js.yml/badge.svg
[workflow-image-2]: https://github.com/kossidts/overlay/workflows/Node.js%20CI/badge.svg

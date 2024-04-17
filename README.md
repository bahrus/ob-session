# ob-session

[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/ob-session)
[![How big is this package in your project?](https://img.shields.io/bundlephobia/minzip/ob-session?style=for-the-badge)](https://bundlephobia.com/result?p=ob-session)
[![NPM version](https://badge.fury.io/js/ob-session.png)](http://badge.fury.io/js/ob-session)
<img src="http://img.badgesize.io/https://cdn.jsdelivr.net/npm/ob-session?compression=gzip">
[![Playwright Tests](https://github.com/bahrus/ob-session/actions/workflows/CI.yml/badge.svg?branch=baseline)](https://github.com/bahrus/ob-session/actions/workflows/CI.yml)

ob-session is a web component that makes accessing SessionStorage declarative, and adds support for JSON objects.  It can act as a "web component as a service" within a "web component organism".

It can also serve as a base class that can be given a semantic name on the fly, with the help of [be-obsessed](https://github.com/bahrus-be-obsessed), that is actually used as the key for where to find the object:

```html
<user-preferences be-obsessed onchange></user-preferences>
```

Because we are allowing pure HTML markup to do things that could have potentially nasty side effects, just in case, this component insists that the onchange attribute be present, in order to do anything.  The choice of onchange isn't arbitrary.  The component actually emits event "change" when the key it is monitoring for changes in value in sessionStorage.  So we can in fact add code in the onchange event that does something when that happens.

## In good company

Websites that appear to store objects in session storage:

1.  Twitter.com
2.  Amazon.com
3.  Walmart.com
4.  CNN.com
5.  WashingtonPost.com
6.  TypescriptLang.org
7.  WSJ.com

## Why focus on Session Storage?

Whereas one could argue that local storage is being eclipsed by helper libraries based on Indexed DB, session storage serves a particular niche -- In some [lines of business](https://www.securityevaluators.com/casestudies/industry-wide-misunderstandings-of-https/), caching business data in the client, even after the browser window / tab closes, runs afoul of audits. The navigation entries and sessionStorage don't appear to raise such concerns. 

## API

The api supports an init(win: Window) function, where you can pass in a window (say, from an iframe).  init() is immediately called on the window that references the api.

Once init is called, just call setItem(key, stringOrJsonSerializableObject), getItem(key), removeItem(key) from the window object.

To listen for any updates to sessionStorage, use:

```JavaScript
win.addEventListener('session-storage-item-set', e => {
    console.log(e.oldValue, e.newValue, e.key);
});
win.addEventListener('session-storage-item-removed', e => {
    console.log(e.oldValue, e.key);
});
```

where "win" is a local variable shortcut pointing to the (iframed) window object.

<!--

[Api Reference](https://bahrus.github.io/api-viewer/index.html?npmPackage=ob-session&jsonPath=custom-elements.json)

-->

## Viewing Your Element

```
$ npm install
$ npm run serve
```

## Running Tests

WIP



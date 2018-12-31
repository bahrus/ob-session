# ob-session

[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/ob-session)

<a href="https://nodei.co/npm/ob-session/"><img src="https://nodei.co/npm/ob-session.png"></a>

File size of all components combined <img src="http://img.badgesize.io/https://unpkg.com/ob-session@0.0.2/dist/ob-session.iife.min.js?compression=gzip">

The ob-session package contains three refeences to make storing **ob**jects in **Session**Storage easier and faster:

1.  A small "api" that enhances the sessionStorage.setItem, sessionStorage.getItem and sessionStorage.removeItem calls to support storing **objects**, not just strings, in a performant way.  Objects are stored in a global cache for rapid retrieval, but a stringified version is stored in sessionStorage for when the page is refreshed.
2.  A non-visual web component, "ob-session-watch", that watches for sessionStorage changes, and fires an event when such a thing happens.  It can watch for all changes, or to those with a specified key.
3.  A non-visual web component, "ob-session-update", that updates sessionStorage declaratively.

## Why focus on Session Storage?

Whereas one could argue that local storage is being eclipsed by helper libraries based on Indexed DB, session storage serves a particular niche -- In some [lines of business](https://www.securityevaluators.com/casestudies/industry-wide-misunderstandings-of-https/), caching business data in the client, even after the browser closes, runs afoul of audits. history.state and sessionStorage don't appear to raise such concerns. 

## Install the Polymer-CLI

First, make sure you have the [Polymer CLI](https://www.npmjs.com/package/polymer-cli) and npm (packaged with [Node.js](https://nodejs.org)) installed. Run `npm install` to install your element's dependencies, then run `polymer serve` to serve your element locally.

## Viewing Your Element

```
$ polymer serve
```

## Running Tests

WIP



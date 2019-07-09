# ob-session

[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/ob-session)

<a href="https://nodei.co/npm/ob-session/"><img src="https://nodei.co/npm/ob-session.png"></a>

File size of all components combined <img src="http://img.badgesize.io/https://unpkg.com/ob-session@0.0.2/dist/ob-session.iife.min.js?compression=gzip">

The ob-session package contains three references to make storing **ob**jects in **Session**Storage easier and faster:

1.  A small "api" that enhances the sessionStorage.setItem, sessionStorage.getItem and sessionStorage.removeItem calls to support storing **objects**, not just strings, in a performant way.  Objects are stored in a global cache for rapid retrieval, but a stringified version is stored in sessionStorage for when the page is refreshed.  This is not done on low memory devices however.  It is only done if can confirm that the device has > 2 Gig RAM.
2.  A non-visual web component, "ob-session-watch", that watches for sessionStorage changes, and fires an event when such a thing happens.  It can watch for all changes, or to those with a specified key.
3.  A non-visual web component, "ob-session-update", that updates sessionStorage declaratively.

## Why focus on Session Storage?

Whereas one could argue that local storage is being eclipsed by helper libraries based on Indexed DB, session storage serves a particular niche -- In some [lines of business](https://www.securityevaluators.com/casestudies/industry-wide-misunderstandings-of-https/), caching business data in the client, even after the browser window / tab closes, runs afoul of audits. history.state and sessionStorage don't appear to raise such concerns. 


## Viewing Your Element

```
$ npm install
$ npm run serve
```

## Running Tests

WIP



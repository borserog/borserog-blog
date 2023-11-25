---
title: Visualizing Observables with Angular Pipes
images: {
  cover: cover-angular-observable-debugging.png
}
date: '2023-11-13'
excerpt: Visualizing Angular Observables usually involves using RxJS operators like tap() for logging. I'm demonstrating a different approach.
---
Whenever we need to visualize an Observable in an Angular application, we often think of using the RxJS `tap()` operator and passing a `console.log()` callback function to it. In this way, we can observe our data in our browser console.

But there's a more direct approach.

We can also visualize how our application data flows inside the Observable streams by rendering it directly into the HTML document.

This can be achieved by combining the Angular pipes `async` and `json` (the order is important here).

The `async` pipe subscribes to an `Observable` (or `Promise`) and automatically updates the view when the data is emitted or resolved. The `json` pipe transforms an object into a JSON string for display in the template. Enclose everything with an HTML `<pre>` tag, and you'll have neatly formatted JSON:

```html
  <pre>
    {{ myObservable$ | async | json }}
  </pre>
```

I often use this technique for debugging and verifying how data changes in response to asynchronous events.

Check the demo I've created in <a target="_blank" href="https://stackblitz.com/edit/stackblitz-starters-vt7fcv?file=src%2Fmain.ts">here</a>.



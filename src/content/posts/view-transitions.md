---
title: View Transitions in Angular
images: {
  cover: view-transition.png
}

date: '2023-11-21'
excerpt: With Angular v17 comes a replacement for the structural directive ngIf, let's take a look at some key differences.
---
Traffic lights make everyone feel uneasy.

Their classical implementation relies on three colours switching abruptly. Those changes need to be tracked because they command drivers to either go forward or stop. Failing to abide usually ends up in dramatic situations.

That's bad UX if you ask me, for abrupt changes increase the cognitive load of interaction.

When it comes to user interfaces we can do better by making smoother transitions between visual elements on our apps. That streamlines user interactions and can make our products more appealing, potentially improving user conversion rates.

Historically speaking, view transitions have been a pain to implement correctly because we need to care for the interactions between JS and CSS to manage the UI state.

The View Transitions API aims to simplify that chore. It's currently in the Candidate Recommendation (CR) stage in the [W3C standardization process](https://www.w3.org/2004/02/Process-20040205/tr.html) and it’s available only for Chromium-based browsers at the moment.

Angular v17 shipped with the `withViewTransition()` feature that abstracts the core functionality of the View Transitions API. We should add this function to the Router provider configuration function. The default cross-fade animation will then be applied to route transitions automatically.
It’s possible to use CSS to customize the animation's behaviour, and also attach it to different DOM elements.

Of course I took some time to prepare a [demo](https://stackblitz.com/edit/stackblitz-starters-m7wywy?file=src%2Fmain.ts) for this.
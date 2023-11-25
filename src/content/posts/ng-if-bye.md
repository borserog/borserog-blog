---
title: ngIf and @if Differences
images: {
  cover: if-differences.png
}

date: '2023-11-17'
excerpt: With Angular v17 comes a replacement for the structural directive ngIf, let's take a look at some key differences.
---
One of the flashiest features brought by the new Angular 17 is the new control flow syntax `@if`.

It allows for branching logic on the template just as the structural directive `*ngIf` already does. So why bother?

Well, for one it is a more straightforward syntax that resembles the way our beloved JS works.

We declare `@if` followed by a condition in parenthesis and then open a code block that should include a template that will be rendered if the condition is evaluated to `true`. We can also add an `@else` block after that to handle fallbacks. Does it sound familiar? We've done that countless times in JS, and it is second nature to us.

In Angular, we've also written the verbose `<ng-container *ngIf="condition; else myTemplateReference" />` countless times. And that's also second nature to us Angular devs, but maybe we are not so proud of it anymore.

I must confess I find the new syntax easier on the eyes and more straightforward for newcomers to use and understand.

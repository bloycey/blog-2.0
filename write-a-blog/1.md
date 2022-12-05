---
title: The joys of an under-engineered blog
path: the-joys-of-an-underengineered-blog
date: 11-22-2022
description: More writing, less coding
---

If you're a developer and you want to start blogging you probably shouldn't build your own blog. Because if you build your own blog the chances are that you'll get caught up worrying about the performance of the blog, the developer aesthetics, where the data is stored, workflow automations...

> Basically everything except the actual writing.

And that's an issue.

Initially the stack for this blog was a Gatsby front-end with the content coming from Sanity CMS. Now both of these pieces of tech were pretty impressive circa 2019 (and still are), but did I really need to be using graphql, managing state, and componetising all the things? Absolutely not.

A better choice might have been a static site generator like [Eleventy](https://www.11ty.dev/), but even better is not to use anything at all. That's right, raw HTML, CSS, and JS baby! Well... almost.

## The new stack

Bloycey.blog 2.0 is essentially an extremely minimal hacked together static site generator built on the fly using a node script and a netlify build command. And the developer experience is blissful 😌.

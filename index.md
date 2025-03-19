---
layout: base.njk
title: Home
---

# Welcome to My Website

This is a simple website built with Eleventy. Feel free to explore the blog posts and learn more about me on the About page.

## Recent Blog Posts

{% set posts = collections.post | reverse %}
{% for post in posts.slice(0, 3) %}
- [{{ post.data.title }}]({{ post.url }}) - {{ post.data.date | dateDisplay }}
{% endfor %}
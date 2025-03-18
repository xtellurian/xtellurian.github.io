---
layout: base.njk
title: Blog
---

# Blog Posts

Browse through all my blog posts below:

<ul class="post-list">
{% for post in collections.post | reverse %}
  <li>
    <h2><a href="{{ post.url }}">{{ post.data.title }}</a></h2>
    <time datetime="{{ post.data.date | dateIso }}">{{ post.data.date | dateDisplay }}</time>
    {% if post.data.description %}
      <p>{{ post.data.description }}</p>
    {% endif %}
  </li>
{% endfor %}
</ul>
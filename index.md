---
layout: default
title: "7elmy — Technical Blog"
---

<h1 class="page-heading">{{ page.title }}</h1>

<p>{{ site.description }}</p>

{% assign categories_sorted = site.categories | sort %}
{% for category in categories_sorted %}
  {% assign category_name = category[0] %}
  {% assign posts = category[1] %}
  <section class="category-section">
    <h2 id="{{ category_name | slugify }}">{{ category_name }}</h2>
    <ul class="post-list">
      {% for post in posts %}
        <li>
          <span class="post-meta">{{ post.date | date: "%b %-d, %Y" }}</span>
          <h3>
            <a class="post-link" href="{{ post.url | relative_url }}">{{ post.title | escape }}</a>
          </h3>
          {% if post.description %}
            <p>{{ post.description }}</p>
          {% endif %}
        </li>
      {% endfor %}
    </ul>
  </section>
{% endfor %}

{% assign uncategorized = site.posts | where_exp: "p", "p.categories == empty" %}
{% if uncategorized.size > 0 %}
  <section class="category-section">
    <h2 id="uncategorized">Other</h2>
    <ul class="post-list">
      {% for post in uncategorized %}
        <li>
          <span class="post-meta">{{ post.date | date: "%b %-d, %Y" }}</span>
          <h3>
            <a class="post-link" href="{{ post.url | relative_url }}">{{ post.title | escape }}</a>
          </h3>
          {% if post.description %}
            <p>{{ post.description }}</p>
          {% endif %}
        </li>
      {% endfor %}
    </ul>
  </section>
{% endif %}

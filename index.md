---
layout: default
title: "Documentation"
---

<div class="home">
  <section class="home__hero">
    <span class="home__eyebrow">7elmy — Technical Documentation</span>
    <h1 class="home__title">{{ site.title | escape }}</h1>
    <p class="home__description">{{ site.description }}</p>
  </section>

  {% assign categories_sorted = site.categories | sort %}
  {% for category in categories_sorted %}
    {% assign category_name = category[0] %}
    {% assign posts = category[1] %}
    <section class="category-section">
      <div class="category-section__header">
        <h2 id="{{ category_name | slugify }}">{{ category_name }}</h2>
        <span class="category-section__count">{{ posts.size }} {% if posts.size == 1 %}article{% else %}articles{% endif %}</span>
      </div>
      <ul class="post-list">
        {% for post in posts %}
          <li class="post-card">
            <span class="post-card__meta">
              <time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: "%b %-d, %Y" }}</time>
            </span>
            <h3 class="post-card__title">
              <a href="{{ post.url | relative_url }}">{{ post.title | escape }}</a>
            </h3>
            {% if post.description %}
              <p class="post-card__description">{{ post.description }}</p>
            {% endif %}
          </li>
        {% endfor %}
      </ul>
    </section>
  {% endfor %}

  {% assign uncategorized = site.posts | where_exp: "p", "p.categories == empty" %}
  {% if uncategorized.size > 0 %}
    <section class="category-section">
      <div class="category-section__header">
        <h2 id="uncategorized">Other</h2>
        <span class="category-section__count">{{ uncategorized.size }} {% if uncategorized.size == 1 %}article{% else %}articles{% endif %}</span>
      </div>
      <ul class="post-list">
        {% for post in uncategorized %}
          <li class="post-card">
            <span class="post-card__meta">
              <time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: "%b %-d, %Y" }}</time>
            </span>
            <h3 class="post-card__title">
              <a href="{{ post.url | relative_url }}">{{ post.title | escape }}</a>
            </h3>
            {% if post.description %}
              <p class="post-card__description">{{ post.description }}</p>
            {% endif %}
          </li>
        {% endfor %}
      </ul>
    </section>
  {% endif %}
</div>

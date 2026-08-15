source "https://rubygems.org"

# GitHub Pages managed gem — pins Jekyll and supported plugins to what
# github.com/pages actually runs, so local builds match production.
gem "github-pages", group: :jekyll_plugins

group :jekyll_plugins do
  gem "jekyll-feed"
  gem "jekyll-seo-tag"
  gem "jekyll-sitemap"
end

# Windows / JRuby platform helpers required by Jekyll.
platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", "~> 2.0"
  gem "tzinfo-data"
  gem "wdm", "~> 0.1.1"
end

gem "http_parser.rb", "~> 0.6.0", platforms: [:jruby]

# Coding Challenge - Web Crawler

Write a simple web crawler in a programming language of your choice.

The crawler should be limited to one domain - so when crawling example.com it would crawl all pages within the domain, but not follow external links, for example to the LinkedIn and Twitter accounts.

Given a URL, it should output a site map, showing which static assets each page depends on, and the links between pages.

# Solution

The Crawler will validate and then crawl a given URL. The Crawler class is instantiated with a URL. It will validate the protocol is http(s) and the URL is valid. When the `crawl` function is called then the application fetches the html from that URL and serializes it into an object and finds subsequent internal links that it should also follow which is recursively calls on itself building an eventual sitemap of the static assets on all urls visited.

# Running

## Pre-requisites

  * [Docker](https://docker.com)
  * [Docker-compose](https://docs.docker.com/compose/) or
  * [NPM via NVM](https://github.com/nvm-sh/nvm)

You should run with node version 10.13 or later.

#### Docker-compose

If you have [Docker](https://docker.com) and [Docker-compose](https://docs.docker.com/compose/) installed then you can run the crawler using the `docker-compose.yml` service. To do so run the following in the route of the project

`URL=<URL_TO_CRAWL> docker-compose up`

Where `<URL_TO_CRAWL>` is a URL to a website you wish to crawl.

#### NPM

To run the project using NPM and node, run the following:

```
npm i
npx ts-node src/index.ts <URL_TO_CRAWL>
```

# Tests

There are a few small exmaple tests that you can run with the following:

```
npm i
npm t
```

# Building

You can build this project using the following commands:

```
npm i
npm run compile
```

This will create a `build/` directory with the transpiled typescript files. You can also alter the `base.tsconfig.json` and `tsconfig.json` files to alter the transpiler configuration.
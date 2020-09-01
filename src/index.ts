import { Crawler } from './lib'

const [domain] = process.argv.slice(2)
if (!domain) {
  throw new Error('You must provide the URL as a parameter. It should take the form http(s)://example.com')
}
const crawler = new Crawler(domain)

crawler.crawl().then((siteMap) => {
  console.log(siteMap)
})

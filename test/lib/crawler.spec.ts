import 'should'
import { Crawler } from '../../src/lib'

describe('Given a URL to crawl on instantiation', () => {
  describe('When the crawler is asked to crawl', () => {
    it('Then it will return a site map from the given URL', async () => {
      const url = 'http://example.com'
      const crawler = new Crawler(url)
      const sitemap = await crawler.crawl()
      sitemap.should.be.Object()
      sitemap.should.have.property(url)
      sitemap[url].should.be.Array()
      sitemap[url].forEach((element) => {
        element.should.be.Object()
        element.should.have.properties(['tag', 'attributes', 'value'])
        element.tag.should.be.String()
        element.attributes.should.be.Array()
        element.value.should.be.String()
        element.attributes.forEach((attribute) => {
          attribute.should.be.Object()
          attribute.should.have.properties(['key', 'value'])
          attribute.key.should.be.String()
        })
      })
    })
    it('Then it will return a site map from the given URL with static assets', async () => {
      const url = 'http://example.com'
      const static_asset_tags = [
        '!doctype', 
        'html', 'head', 'style', 'title', 'meta', 'body', 'h1', 'h2', 'p', 'span', 'div', 'a', 'link', 'button',
        '/html', '/head', '/style', '/title', 'meta', '/body', '/h1', '/h2', '/p', '/span', '/div', '/a', '/link', '/button']
      const crawler = new Crawler(url)
      const sitemap = await crawler.crawl()
      sitemap[url].forEach((element) => {
        element.tag.should.be.oneOf(static_asset_tags)
      })
    })
    it('Then it will return a site map that has multiple pages', async () => {
      const url = 'http://regex101.com'
      const link_tags = ['a', 'link']
      const crawler = new Crawler(url)
      const sitemap = await crawler.crawl()
      const pages = Object.keys(sitemap)
      pages.length.should.be.aboveOrEqual(1)
    })
  })
})

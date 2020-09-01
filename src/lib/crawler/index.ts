import { constants } from '../'
import { SiteMap } from './schema'
import request from 'request-promise'
import { logger } from '../../logger'

class Crawler {
  /**
   * Instantiates a new Crawler instance
   * @param url string - The URL you want to crawl
   */
  public readonly protocol: string
  public readonly domain: string
  public readonly endpoint: string
  constructor(url: string) {
    if (!constants.URL_DOMAIN_REGEX.test(url)) {
      throw new Error(constants.INVALID_DOMAIN_ERROR)
    }
    const [match, protocol, domain, endpoint] = constants.URL_DOMAIN_REGEX.exec(url)
    this.protocol = protocol
    this.domain = domain
    this.endpoint = endpoint
  }
  /**
   * Crawls a URL and all relative/internal URLs that are within the given domain specified on instantiation
   * @param url string - The URL you want to crawl
   * @param siteMap object - The current site map
   */
  public async crawl(url: string = null, siteMap = {}): Promise<SiteMap> {
    const siteUrl = url || this.protocol + this.domain + (this.endpoint || '')
    if (siteUrl in siteMap) {
      return siteMap
    }
    logger.trace('Crawling url', siteUrl)
    const html = await this.getPage(siteUrl)
    const htmlJson = this.htmlToJson(html)
    const internalLinks = htmlJson.filter(element => this.isAnchorTag(element) && this.isInternalLink(element, this.domain))
    siteMap[siteUrl] = htmlJson
    for (const link of internalLinks) {
      const href = link.attributes.find(l => l.key === constants.ANCHOR_HREF)
      let thisUrl
      if (href.value.startsWith(constants.RELATIVE_LINK_PREFIX) && href.value.length > 1) {
        thisUrl = this.protocol + this.domain + href.value
      } else if (constants.VALID_PROTOCOL.test(href.value)) {
        thisUrl = href.value
      }
      if (thisUrl && !(thisUrl in siteMap)) {
        siteMap[thisUrl] = await this.crawl(thisUrl, siteMap)
      }
    }
    return siteMap
  }
  private async getPage(url): Promise<string> {
    const method = 'get'
    const headers = { Accept: constants.ACCEPT_CONTENT_TYPE }
    const response = await request(url, { method, headers }).catch((err) => {
      if (err.response) {
        const { headers } = err.response
        // Should handle errors here with an error handler and decide how best to proceed
        if ('content-type' in headers && headers['content-type'].includes(constants.ACCEPT_CONTENT_TYPE)) {
          return err.error
        }
      }
      return ''
    })
    return response
  }
  private htmlToJson(html: string) {
    const elements = html.replace(/\n/gmi, '').match(constants.TAG_ATTRIBUTE_VALUE_REGEX)
    if (!elements) {
      return []
    }
    const elementObjects = []
    elements.forEach(element => {
      const elementObject = this.elementToObject(element)
      if (elementObject) {
        elementObjects.push(elementObject)
      }
    })
    return elementObjects
  }
  private elementToObject(element: string): { tag?: string, attributes?: any[], value?: string } {
    const exec = constants.TAG_ATTRIBUTE_VALUE_REGEX.exec(element)
    element.match(constants.TAG_ATTRIBUTE_VALUE_REGEX)
    const [match, tag, attr, value] = constants.TAG_ATTRIBUTE_VALUE_REGEX.exec(element)
    const elementObject = {}
    const sanitizedTag = tag ? tag.toLowerCase().trim() : ''
    const attributes = this.getAttributes(attr)
    const sanitizedValue = value && value.trim().length > 0 ? value.toLowerCase().trim() : ''
    if (tag) elementObject['tag'] = sanitizedTag
    elementObject['attributes'] = attributes
    elementObject['value'] = sanitizedValue
    return elementObject
  }
  private getAttributes(attributeString: string): { key?: string, value: any }[] {
    if (!attributeString || attributeString.length === 0) {
      return []
    }
    return attributeString.split(' ').map((attr) => {
      if (attr.length === 0) return null
      if (attr.includes('=')) {
        const [key, value] = attr.split('=')
        return { key, value: value.replace(/"/gm, '').trim() }
      }
      return { key: attr.trim(), value: true }
    }).filter(attr => !!attr)
  }
  private isAnchorTag(element) {
    return constants.ANCHOR_TAGS.includes(element.tag)
  }
  private isInternalLink(element, domain) {
    return !!element.attributes.find(attr => {
      const isHyperlinkReference = attr.key === constants.ANCHOR_HREF
      const isString = typeof attr.value === 'string'
      const isWithinDomain = isString && (
        attr.value.includes(domain) || (attr.value.startsWith(constants.RELATIVE_LINK_PREFIX)))
      return isHyperlinkReference && isWithinDomain
    })
  }
}

export default Crawler

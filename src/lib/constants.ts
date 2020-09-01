export const HTML_TAG_REGEX: RegExp = /(?:<[!\/]?)([a-z0-9]+)*/gmi
export const TAG_ATTRIBUTE_VALUE_REGEX: RegExp = /<([!\/]?[\w\d]+){1}([ \t\w\d=",;:.\/_-]+)?>([\w .\n{}@:#%'?\/+=;,"()-]+)?/gmi
export const URL_DOMAIN_REGEX: RegExp = /^(http[s]?:\/\/)?([a-z0-9-_.]+)?([a-z-_\/.?=&+!]+)?/i
export const ACCEPT_CONTENT_TYPE = 'text/html'
export const INVALID_DOMAIN_ERROR = 'The domain you have provided is invalid'
export const ANCHOR_TAGS = ['a','link','button']
export const ANCHOR_HREF = 'href'
export const RELATIVE_LINK_PREFIX = '/'
export const VALID_PROTOCOL = /^http[s]?:\/\//
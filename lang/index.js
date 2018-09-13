
const loadAll = true
const defaultLanguage = 'en'
const otherLang = [ 'vi']

const supportLanguage = [defaultLanguage, ...otherLang]

const defaultAndActive = [defaultLanguage, 'active']
module.exports = { supportLanguage, defaultLanguage, loadAll, defaultAndActive, otherLang }
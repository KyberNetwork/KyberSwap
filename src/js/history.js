import createHistory from 'history/createBrowserHistory'


//const history = createHistory()
const history = createHistory({
    basename: '',           
    hashType: 'slash',          
  })
history.listen(function (location) {
  if (typeof window.ga === 'function') {
    window.ga('set', 'page', location.pathname + location.search)
    window.ga('send', 'pageview', location.pathname + location.search)
  }
})
export default history

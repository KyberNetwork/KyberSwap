import createHistory from 'history/createBrowserHistory'


//const history = createHistory()
const history = createHistory({
  basename: '',
  hashType: 'slash',
})
history.listen(function (location) {
  if (typeof window.ga === 'function') {
    try {
      console.log(location.pathname + location.search)
      window.ga('set', 'page', location.pathname + location.search)
      window.ga('send', 'pageview')
    } catch (e) {
      console.log(e)
    }
  }
})
export default history

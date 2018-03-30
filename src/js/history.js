import createHistory from 'history/createBrowserHistory'
import * as analytics from './utils/analytics'

//const history = createHistory()
const history = createHistory({
  basename: '',
  hashType: 'slash',
})

history.listen(function (location) {
  analytics.changePath(location.pathname + location.search)
})
export default history

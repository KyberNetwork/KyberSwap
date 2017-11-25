import createHistory from 'history/createBrowserHistory'


//const history = createHistory()
const history = createHistory({
    basename: '',           
    hashType: 'slash',          
  })
export default history

import React from "react"
import ReactDOM from "react-dom"
import { Provider } from "react-redux"
import createHistory from 'history/createBrowserHistory'
import { Route } from 'react-router'
import { Link } from 'react-router-dom'

import Layout from "./components/Layout"
import store from "./store"


const app = document.getElementById('app')
ReactDOM.render(
<Provider store={store}>
  <Layout />
</Provider>, app);

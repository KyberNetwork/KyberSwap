import React from "react"
import ReactDOM from "react-dom"
import { Provider } from "react-redux"
import { Route } from 'react-router'
import { Link } from 'react-router-dom'

import Layout from "./components/Layout"
import NotSupportPage from "./components/NotSupportPage"
import store from "./store"
import platform from 'platform'
import {blackList} from './blacklist'

const app = document.getElementById('app')

//check browser compatible
var clientPlatform = {
  name : platform.name,
  version : platform.version,
  os : platform.os.family
}

console.log("client: ", clientPlatform)

var illegal = false
for (var i = 0; i< blackList.length; i++){
  if (JSON.stringify(clientPlatform) === JSON.stringify(blackList[i])){
    illegal = true
    break;
  }
}

if (illegal){
  ReactDOM.render(  
  <NotSupportPage client={clientPlatform}/>
  , app);		  
}else{
  ReactDOM.render(
  <Provider store={store}>
   <Layout />
  </Provider>, app);		
}


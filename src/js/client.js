import React from "react"
import ReactDOM from "react-dom"
import { Provider } from "react-redux"
import { Route } from 'react-router'
import { Link } from 'react-router-dom'
import { Layout } from "./containers/Layout"
//import NotSupportPage from "./components/NotSupportPage"
//import platform from 'platform'
//import { blackList } from './blacklist'
import { PersistGate } from 'redux-persist/lib/integration/react'
import { persistor, store } from "./store"
import Modal from 'react-modal';


//console.log(platform)
//check browser compatible
// var clientPlatform = {
//   name: platform.name,
//   version: platform.version,
//   os: platform.os.family
// }

//  console.log("client: ", clientPlatform)

var illegal = false
// for (var i = 0; i < blackList.length; i++) {
//   if ((clientPlatform.name === blackList[i].name) && (clientPlatform.os === blackList[i].os)) {
//     illegal = true
//     break
//   }
//   // if (clientPlatform.version.substring(0, blackList[i].version.length) !== blackList[i].version) {
//   //   continue
//   // }
//   // if (clientPlatform.os.indexOf(blackList[i].os) === -1) {
//   //   continue
//   // }
//   // illegal = true
//   // break
// }

Modal.setAppElement('body');

if (illegal) {
  ReactDOM.render(
    <NotSupportPage client={clientPlatform} />
    , document.getElementById("swap-app"));
} else {
  ReactDOM.render(
    <PersistGate persistor={persistor}>
      <Provider store={store}>
        <Layout />
      </Provider>
    </PersistGate>, document.getElementById("swap-app"));
}




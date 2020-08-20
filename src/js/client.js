import React from "react"
import ReactDOM from "react-dom"
import { Provider } from "react-redux"
import { Layout } from "./containers/Layout"
import { PersistGate } from 'redux-persist/lib/integration/react'
import { persistor, store } from "./store"
import Modal from 'react-modal';

var illegal = false

if (window.kyberBus){
  window.kyberBus.broadcast("swap.on.loaded")
}

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

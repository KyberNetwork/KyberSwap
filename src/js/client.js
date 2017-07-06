import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import Layout from "./components/Layout";
import loadAccounts from "./services/accounts";
import store from "./store";


const app = document.getElementById('app');
ReactDOM.render(
<Provider store={store}>
  <Layout/>
</Provider>, app);

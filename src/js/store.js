import {compose, applyMiddleware, createStore} from "redux";
import logger from "redux-logger";
import thunk from "redux-thunk";
import promise from "redux-promise-middleware";
import {persistStore, autoRehydrate} from 'redux-persist'
import reducer from "./reducers/index";

const middleware = applyMiddleware(promise(), thunk, logger);
const store = createStore(
  reducer, undefined, compose(middleware, autoRehydrate()))

persistStore(store, {blacklist: ['global']})

export default store;

import Account from "./account"
import store from "../store"
import jdenticon from 'jdenticon'

export function newAccountInstance(address, type, keystring, avatar) {
  var account = new Account(address, type, keystring,0 ,0 ,0, avatar)  
  return account.sync(
    store.getState().connection.ethereum)
}

export function loadAccounts(node) {
  var accounts = {};

  return accounts;
}

export function getRandomAvatar(addressString) {
  let svg = jdenticon.toSvg(addressString, 45),
    url = 'data:image/svg+xml;base64,' + btoa(svg);
  return url;
}
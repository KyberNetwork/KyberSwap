import React from "react"
import { connect } from "react-redux"

import AccountDetail from "./AccountDetail"
import { sortAccount} from "../actions/accountActions"

@connect((store) => {
  return {
    accounts: store.accounts.accounts,
  }
})
export default class Wallets extends React.Component {
  sortAccount = (event, field) => {
    var order = event.target.getAttribute("sort_order")
    if (order === "ASC"){
      this.props.dispatch(sortAccount("ASC",field))
      event.target.setAttribute("sort_order","DESC")
    }else{
      this.props.dispatch(sortAccount("DESC",field))
      event.target.setAttribute("sort_order","ASC")
    }
    //close sort menu
    event.target.parentNode.parentNode.parentNode.parentNode.className = "sort"
  }

  searchAccount(e){
    var value = e.target.value
    var accounts = document.getElementsByClassName("wallet-item");
    var name = ''
    for (var i = 0; i< accounts.length; i++){
      if(accounts[i].getElementsByClassName("account-name").length === 1){
        name = accounts[i].getElementsByClassName("account-name")[0].innerHTML
        if (name.indexOf(value) === -1){
          accounts[i].className = "wallet-item hide"
        }else{
          accounts[i].className = "wallet-item"
        }  
      }      
    }
  }

  toggleActive = (event) => {
    var parent = event.currentTarget.parentNode
    if (parent.classList.contains("active")){
      parent.classList.remove("active")
    }else{
      parent.classList.add("active")
    }
  }

  render() {
    var accounts = this.props.accounts
    var accDetails = Object.keys(accounts).map((addr) => {
      return (
        <AccountDetail key={addr} address={addr} />
      )
    })
    return (
      <div>
        <div class="account-sort">
          <ul>
            <li class="sort">
              <a onClick={e => this.toggleActive(e)} title="Sort">
                <i class="k-icon k-icon-sort"></i>
              </a>
              <div class="sort-menu">
                <ul>
                  <li>
                    <a onClick={(e) => this.sortAccount(e,"name")}>Sort by name</a>
                  </li>
                  <li>
                    <a onClick={(e) => this.sortAccount(e,"createdTime")}>Sort by time</a>
                  </li>
                  <li>
                    <a onClick={(e) => this.sortAccount(e,"balance")}>Sort by balance</a>
                  </li>
                </ul>
              </div>
            </li>
            <li class="search">
              <a onClick={e => this.toggleActive(e)} title="Search">
                <i class="k-icon k-icon-search"></i>
              </a>                          
              <input  placeholder="type account name..." onChange={e => this.searchAccount(e)}/>
            </li>
          </ul>                    
        </div>
        <div>
          <div id="wallet-list">
            {accDetails}
          </div>
        </div>
      </div>
    )
  }
}

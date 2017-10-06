import React from "react"
import { Link } from 'react-router-dom'
import {NodeSwitch} from "../SideBar"

//import NodeSwitch from "./NodeSwitch"
const heightSideBar = 650

const SideBar = (props) => {  
	function tabClasses(url) {
    return url == props.path ? "tabs-title is-active" : "tabs-title"   
  }
  // componentDidMount() {      
  //   document.addEventListener('scroll', () => {
  //     const top = document.documentElement.scrollTop || document.body.scrollTop;
  //     const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
  //     const sidebar = document.getElementById("k-side-bar-content")
  //     const viewPortHeight = window.innerHeight;
  //     if(viewPortHeight > heightSideBar){
  //       sidebar.style.position='fixed'
  //       sidebar.style.top='0px'
  //       sidebar.style.bottom='auto'
  //     }else{
  //       if (top > (heightSideBar - viewPortHeight)){
  //         sidebar.style.position='fixed'
  //         sidebar.style.bottom='0px'
  //         sidebar.style.top='auto'
  //       }else{
  //         sidebar.style.position='static'
  //         sidebar.style.bottom='auto'
  //         sidebar.style.top='auto'
  //       }  
  //     }
  //   });
  // }
  return (
    <div class="k-header">
      <div id="k-side-bar-content" style={{height: heightSideBar}}>
        <div class="k-header-logo">
          <img src="assets/logo_icon.png" />
        </div>
        <div class="k-header-menu" id="menu">
          <ul class="tabs vertical" data-tabs>
            {/*
            <li class={tabClasses("/exchange")}>
              <Link to="/contracts">
                <i class="k-icon k-icon-contract"></i> Contracts
              </Link>
            </li>
            */}
            <li class={tabClasses("/")}>
              <Link to="/" >
                <i class="k-icon k-icon-account"></i> Accounts
              </Link>
            </li>
            <li class={tabClasses("/transactions")}>
              <Link to="/transactions">
                <i class="k-icon k-icon-transaction"></i> Transactions
              </Link>
            </li>
            <li class={tabClasses("/info")}>
              <Link to="/info">
                <i class="k-icon k-icon-info"></i> Information
              </Link>
            </li>
          </ul>
           <NodeSwitch />
        </div>
        <div class="k-header-pendding-tx">
          <div class={props.pendingTxs.length != 0 ? "loading" : ""} >
            <div class="number">0{props.pendingTxs.length}</div>
            <div class="pending">pending</div>
            <div>Transactions</div>
            <div class="loading-icon">
              <div class='bullet'></div>
              <div class='bullet'></div>
              <div class='bullet'></div>
              <div class='bullet'></div>
            </div>
          </div>          
        </div>
      </div>
    </div>
  )
}

export default SideBar
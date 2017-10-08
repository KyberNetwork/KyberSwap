import React from "react"
import { connect } from "react-redux"
import { Link } from 'react-router-dom'
import * as _ from "underscore"
import {SideBar as SideBarPresentation} from "../../components/SideBar"
// import NodeSwitch from "../../components/NodeSwitch"


@connect((store) => {
  var pendingTxs = _.where(store.txs, { status: "pending" })
  return {
    path: store.router.location.pathname,
    pendingTxs: pendingTxs,
  }
})
export default class SideBar extends React.Component {
	render() {
    return (
      <SideBarPresentation path = {this.props.path} pendingTxs = {this.props.pendingTxs} />

    )
  }

}

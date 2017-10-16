import React from "react"
import { connect } from "react-redux"
import {Rate, Address} from "../Header"


export default class Header extends React.Component {
	render() {
    return (
        <div>
          <div>Icon</div>
          <Rate />
          <Address />
          <div>Notify</div>
        </div>
    )
  }
}

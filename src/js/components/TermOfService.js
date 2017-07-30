import React from "react"
import { connect } from "react-redux"

import { acceptTermOfService } from "../actions/globalActions"


@connect((store) => {
  return {}
})
export default class TermOfService extends React.Component {

  acceptTOS = (event) => {
    event.preventDefault()
    this.props.dispatch(acceptTermOfService())
  }
  declineTOS = (event) => {
    event.preventDefault()
  }
  render() {
    return (
    <div class="term-page">
      <div class="term-wrapper"></div>
      <div class="term-content">
        <h2>Terms of Services</h2>
        <div class="body k-scroll">
          <p>These Terms of Service (“Terms”) govern your access to and use of our services,
    including our various websites, SMS, APIs, email notifications, applications,
    buttons, widgets, ads, commerce services, and our other covered services
    (https://support.twitter.com/articles/20172501) that link to these Terms
    (collectively, the “Services”), and any information, text, links, graphics, photos,
    videos, or other materials or arrangements of materials uploaded, downloaded
    or appearing on the Services (collectively referred to as “Content”). By using the
    Services you agree to be bound by these Terms.</p>
          <h3>Privacy</h3>
          <p>Our Privacy Policy (https://www.twitter.com/privacy) describes how we handle
    the information you provide to us when you use our Services. You understand
    that through your use of the Services you consent to the collection and use (as
    set forth in the Privacy Policy) of this information, including the transfer of this
    information to the United States, Ireland, and/or other countries for storage,
    processing and use by Twitter and its affiliates.</p>
          <h3>Governing Law</h3>
          <p>Our Privacy Policy (https://www.twitter.com/privacy) describes how we handle
    the information you provide to us when you use our Service.</p>
        </div>
        <div class="term-btn">
          <button class="decline" onClick={this.declineTOS}>Decline</button>
          <button class="accept" onClick={this.acceptTOS}>Accept</button>
        </div>
      </div>              
    </div>)
  }
}

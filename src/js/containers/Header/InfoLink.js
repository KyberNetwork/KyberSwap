import React from "react"
import { InfoModal, ChangeLanguage } from "../Header"


export default class InfoLink extends React.Component {
  render() {
    return (
      <div class="info-menu column small-6 medium-6 large-6">
        <ul class="links">
          <li>
            <InfoModal />
          </li>
          <li>
            <ChangeLanguage />
          </li>
        </ul>
      </div>
    )
  }
}

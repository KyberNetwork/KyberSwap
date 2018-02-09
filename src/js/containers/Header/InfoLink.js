import React from "react"
import { InfoModal, ChangeLanguage } from "../Header"


export default class InfoLink extends React.Component {
  render() {
    return (
      <div class="info-menu column small-9">
        <ul class="links text-right">
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

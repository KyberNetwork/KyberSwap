import React from "react"
import {InfoModal, ChangeLanguage} from "../Layout"


export default class Footer extends React.Component {
  render() {
    return (
      <div class="row">
        <div class="column">
          <ul class="links">
            <li>
              <InfoModal />
            </li>
            <li>
              <ChangeLanguage />
            </li>
          </ul>
        </div>
      </div>

    )
  }
}

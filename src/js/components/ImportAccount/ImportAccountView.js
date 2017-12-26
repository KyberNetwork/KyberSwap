import React from "react"

const ImportAccountView = (props) => {
  return (
    <div id="import-account">
      <div class="frame">
        <div className="row px-4">
          <div class="column small-11 large-12 small-centered" id="import-acc">
            <h1 class="title">{props.translate("address.import_address") || "Import address"}</h1>
            <div class="row import-account">
              <div class="small-6 medium-4 large-2dot4 column">
                {props.firstKey}
              </div>

              <div class="small-6 medium-4 large-2dot4 column">
                {props.secondKey}
              </div>
              <div class="small-6 medium-4 large-2dot4 column">
                {props.thirdKey}
              </div>

              <div class="small-6 medium-4 medium-offset-2 large-2dot4 large-offset-0 column">
                {props.fourthKey}
              </div>
              
              <div class="small-6 small-offset-3 medium-4 medium-offset-0 large-2dot4 large-offset-0 column end">
                {props.fifthKey}
              </div>

            </div>
          </div>
        </div>
        {props.errorModal}
      </div>
    </div>
  )
}

export default ImportAccountView
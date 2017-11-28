import React from "react"

const ImportAccountView = (props) => {
  return (
    <div class="frame">
      <div className="row">
        <div class="column small-11 large-12 small-centered">
          <h1 class="title">Import address</h1>
          <div class="row import-account">
            <div class="small-6 medium-4 column">
              {props.firstKey}
            </div>

            <div class="small-6 medium-4 column">
              {props.secondKey}
            </div>

            {/* {props.importByDevice} */}
            <div class="small-6 medium-4 column">
              {props.thirdKey}
            </div>

            <div class="small-6 medium-4 medium-offset-2 column">
              {props.fourthKey}
            </div>
            
            <div class="small-6 small-offset-3 medium-4 medium-offset-0 column end">
              {props.fifthKey}
            </div>

          </div>
        </div>
      </div>
      {props.errorModal}
    </div>
  )
}

export default ImportAccountView
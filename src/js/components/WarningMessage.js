import React from "react"

export default class WarningMessage extends React.Component {
  removeComponent = () => {
    var element = document.getElementById('warning-message')
    element.style.display = 'none'
  }
  render() {
    return (
      <div id="warning-message" onClick={()=>this.removeComponent()}>
        The MVP may not work at the moment due to the unstable Kovan testnet. <br></br>
        Please try again if you see any problem. In the meantime, we are working on something better, stay tuned!
      </div>
    )
  }
}

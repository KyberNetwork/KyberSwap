import React from "react"


export default class Footer extends React.Component {
  render() {
    return (
      <footer>
        <br/>
        Kyber Wallet 0.0.1 Footer -- Connected: {this.props.connected} -- Best Block: {this.props.block}
      </footer>
    );
  }
}

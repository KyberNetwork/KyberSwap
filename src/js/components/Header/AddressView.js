import { Link } from 'react-router-dom'
import React from "react"

const Address = (props) => {
  return (
    <div>
      <p>{ props.address ? props.address : ''}</p>
      <Link to="/transfer" >
        Transfer
      </Link>
      <br/>
      <Link to="/exchange" >
        ExChange
      </Link>
      <br/>
      <a onClick={props.endSession}>End session</a>
    </div>
  )
}

export default Address
import { Link } from 'react-router-dom'
import React from "react"

const Address = (props) => {

  const newSession = (
    <div class="user-bar text-right"><a class="button accent" href="/import-address.html">Import Address</a></div>
  )

  const loged = (
        
      <div class="column small-8">
        {<a class="short-address" href="/exchange.html">0xd1498f ... 7d0909</a>}
        {/* {props.address.slice(0,8)} ... {props.address.slice(-6)} */}
        <ul class="actions">
          <li><Link to="/transfer" >
                Transfer
              </Link>
          </li>
          <li><a onClick={props.endSession} class="exit">
                End Session
              </a>
          </li>
        </ul>
      </div>

  )

  return (
    <div>
        { true ? loged: newSession}
                
        


      {/* <p>{ props.address ? props.address : ''}</p>
      <Link to="/transfer" >
        Transfer
      </Link>
      <br/>
      <Link to="/exchange" >
        ExChange
      </Link>
      <br/>
      <a onClick={props.endSession}>End session</a> */}
    </div>
  )
}

export default Address
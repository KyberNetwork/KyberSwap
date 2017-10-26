import React from "react"
import { connect } from "react-redux"
import { push } from 'react-router-redux';
//import Key from "./Elements/Key"
//import { TokenSelect } from '../../components/Token'



@connect((store, props) => {
  if (props.tx !== ""){
      return {...store.txs[props.tx], loading: false
        , makeNewTransaction: props.makeNewTransaction
        , type: props.type}
  }else{
      return {loading: true}
  }  
})

export default class TransactionLoading extends React.Component {
    render(){
        if (this.props.loading){
            return (
                <div>Loading....</div>
            )
        }
        return (            
            // <div>
            //     <div>{this.props.hash}</div>
            //     <div>{this.props.status}</div>
            //     <a onClick={this.props.makeNewTransaction}>continue {this.props.type}</a> | 
            // </div>
            <div>
                <div class="frame">
                    <div class="row">
                    <div class="column small-11 medium-9 large-8 small-centered">
                        <h1 class="title text-center">Broadcast</h1>
                        <div class="row">
                        <div class="column medium-3 text-center">
                            <div class="broadcast-animation animated pulse infinite"><img src="/assets/img/broadcast.svg"/></div>
                        </div>
                        <div class="column medium-9">
                            <ul class="broadcast-steps">
                            <li class={this.props.status}>
                                {this.props.status=="success"? "Broadcasted your transaction to the blockchain" :
                                    (this.props.status=="failed" ? "Couldn't broadcast your transaction to the blockchain" :
                                        "Waiting for your transaction to be mined")}
                            </li>
                            {/* <li class="failed">Couldn't broadcast your transaction to the blockchain
                                <div class="reason">An unexpected error occur.</div>
                            </li>
                            <li class="pending">Waiting for your transaction to be mined</li> */}
                            </ul>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                <div class="row">
                    <div class="column small-11 medium-10 large-9 small-centered text-center">
                    <p class="note">You can now close your browser window or make another {this.props.type=='exchange' ? "exchange":"transfer"}</p><a class="button accent" onClick={this.props.makeNewTransaction}>{this.props.type=='exchange' ? "Exchange":"Transfer"}</a>
                    </div>
                </div>
            </div>
        )
    }
}
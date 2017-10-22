import React from "react"
import { connect } from "react-redux"

//import Key from "./Elements/Key"
//import { TokenSelect } from '../../components/Token'



@connect((store, props) => {
  if (props.tx !== ""){
      return {...store.txs[props.tx], loading: false}
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
            <div>
                <div>{this.props.hash}</div>
                <div>{this.props.status}</div>            
            </div>
        )
    }
}
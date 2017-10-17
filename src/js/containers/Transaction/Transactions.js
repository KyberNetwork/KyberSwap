import React from "react"
import { connect } from "react-redux"

@connect((store) => {
    return {...store.transactions}
})

export default class Transactions extends React.Component {

    transactionStatus(status){
        switch(status){
            case 1: return 'OK'
            case 0: return 'FAIL'
            case -1: return 'PENDDING'
        }
    }
    hashDetailLink(hash){
        const url = 'https://kovan.etherscan.io/tx/'
        return url + hash
    }

    render() {
        const hashLink = 'https://kovan.etherscan.io/tx/'
        const transactions = this.props.transactions.map( (val) => {
            return (
                <li key={val.hash}>
                    <p>{ this.transactionStatus(val.status) }</p>
                    <p>
                        {val.transfer.from.value} {val.transfer.from.token} for {val.transfer.to.value} {val.transfer.to.token}                        
                    </p>
                    <p><a href={this.hashDetailLink(val.hash)} target="_blank">{val.hash}</a></p>
                </li>
            )
        });
        return (
            <div>
                <ul>
                    {transactions}
                </ul>
            </div>
        )
    }
}
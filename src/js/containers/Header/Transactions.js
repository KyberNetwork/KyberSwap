import React from "react"
import { connect } from "react-redux"

@connect((store) => {
    return {txs: store.txs}
})

export default class Transactions extends React.Component {
    hashDetailLink(hash){
        const url = 'https://kovan.etherscan.io/tx/'
        return url + hash
    }

    createRecap(type, data){
        if(type == "exchange"){
            return `exchange ${data.sourceAmount.slice(0,7)}${data.sourceAmount.length > 7?'...':''} ${data.sourceTokenSymbol} for ${data.destAmount.slice(0,7)}${data.destAmount.length > 7?'...':''} ${data.destTokenSymbol}`
        } else if (type == "send"){
            return `transfer ${data.amount.slice(0,7)}${data.amount.length > 7?'...':''} ${data.tokenSymbol} to ${data.destAddress.slice(0,7)}...${data.destAddress.slice(-5)}`
        } else {
            return '';
        }
    }

    render() {
        const hashLink = 'https://kovan.etherscan.io/tx/'
        const transactions = Object.keys(this.props.txs).map((hash) => {
            return (
                <li key={hash}>
                    <p>{this.props.txs[hash].status}</p>
                    <p>
                        {this.createRecap(this.props.txs[hash].type, this.props.txs[hash].data)}
                    </p>
                    <p><a href={this.hashDetailLink(this.props.txs[hash].hash)} target="_blank">{this.props.txs[hash].hash}</a></p>
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
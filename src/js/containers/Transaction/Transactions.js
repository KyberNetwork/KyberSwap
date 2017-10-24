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

    render() {
        const hashLink = 'https://kovan.etherscan.io/tx/'
        const transactions = Object.keys(this.props.txs).map((hash) => {
            return (
                <li key={hash}>
                    <p>{this.props.txs[hash].status}</p>
                    <p>
                        {this.props.txs[hash].data.recap}
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
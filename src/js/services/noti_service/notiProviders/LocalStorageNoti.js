

import React from 'react'

export default class LocalStorageNoti extends React.Component {
    constructor(props) {
        super(props)
        this.maxNoti = props.maxNoti
    }

    getCurrenState() {
        try {
            var txs = localStorage.getItem("txs")
            if (txs) {
                var response = JSON.parse(txs)
                if (Array.isArray(response)) {
                    return response
                } else {
                    return []
                }
            } else {
                return []
            }
        } catch (e) {
            console.log(e)
            return []
        }
    }

    setState(state) {
        localStorage.setItem("txs", JSON.stringify(state));
    }

    setNewTx(tx) {
        var currentState = this.getCurrenState()

        console.log("currentState")
        console.log(currentState)
        if (currentState.length > this.maxNoti) {
            currentState = currentState.shift()
        }
        currentState.push({
            hash: tx.hash,
            status: tx.status ? tx.status : "pending",
            viewed: false
        })
        this.setState(currentState)
    }

    changeStatusTx(tx) {
        console.log("currentState")
        console.log(currentState)
        var currentState = this.getCurrenState()
        for (var i = 0; i < currentState.length; i++) {
            if (currentState[i].hash === tx.hash) {
                currentState[i].status = tx.status
                currentState[i].viewed = false
                break
            }
        }
        this.setState(currentState)
    }
}

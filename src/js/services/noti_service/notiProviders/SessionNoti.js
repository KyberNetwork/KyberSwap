

import React from 'react'

export default class SessionNoti extends React.Component {

    setNewTx(tx) {
        if (window.kyberBus){
            window.kyberBus.broadcast("swap.one.created", {
                tx_hash: tx.hash,
                display_status: tx.status ? tx.status : "pending",
                status: tx.status ? tx.status : "pending",
                created_at: new Date().getTime(),
                viewed: false
            })
        }
    }

    changeStatusTx(tx) {
        if (window.kyberBus){
            window.kyberBus.broadcast("swap.one.updated", {
                tx_hash: tx.hash,
                display_status: tx.status ? tx.status : "pending",
                status: tx.status ? tx.status : "pending",
                updated_at: new Date().getTime(),
                viewed: false
            })
        }
    }
}

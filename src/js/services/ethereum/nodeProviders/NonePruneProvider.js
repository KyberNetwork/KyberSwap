
import BaseProvider from "./BaseProvider"

export default class NonePruneProvider extends BaseProvider {
    constructor(props) {
        super(props)
        this.rpcUrl = props.url
        this.initContract()
    }
    getBalanceAtSpecificBlock(address, blockno) {
        return new Promise((resolve, reject) => {
            reject(new Error("Cannot use /getBalanceAtSpecificBlock with NonePruneProvider"))
        })
    }

    getMaxCapAtSpecificBlock(address, blockno) {
        return new Promise((resolve, reject) => {
            reject(new Error("Cannot use /getMaxCapAtSpecificBlock with NonePruneProvider"))
        })
    }


    getTokenBalanceAtSpecificBlock(address, ownerAddr, blockno) {
        return new Promise((resolve, reject) => {
            reject(new Error("Cannot use /getTokenBalanceAtSpecificBlock with NonePruneProvider"))
        })
    }

    getAllBalancesTokenAtSpecificBlock(address, tokens, blockNo){
        return new Promise((resolve, reject) => {
            reject(new Error("Cannot use /getAllBalancesTokenAtSpecificBlock with NonePruneProvider"))
        })
    }

    getAllowanceAtSpecificBlock(sourceToken, owner, blockno) {
        return new Promise((resolve, reject) => {
            reject(new Error("Cannot use /getAllowanceAtSpecificBlock with NonePruneProvider"))
        })
    }

    wrapperGetGasCap(input, blockno) {
        return new Promise((resolve, reject) => {
            reject(new Error("Cannot use /wrapperGetGasCap with NonePruneProvider"))
        })
    }

    wrapperGetConversionRate(reserve, input, blockno) {
        return new Promise((resolve, reject) => {
            reject(new Error("Cannot use /wrapperGetConversionRate with NonePruneProvider"))
        })
    }
    wrapperGetReasons(reserve, input, blockno) {
        return new Promise((resolve, reject) => {
            reject(new Error("Cannot use /wrapperGetReasons with NonePruneProvider"))
        })
    }
    wrapperGetChosenReserve(input, blockno) {
        return new Promise((resolve, reject) => {
            reject(new Error("Cannot use /wrapperGetChosenReserve with NonePruneProvider"))
        })
    }
}

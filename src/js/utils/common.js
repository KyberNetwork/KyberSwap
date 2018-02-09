

export function estimateTimeTx(gasObj){
    var {fastGas, standardGas, safeLowGas, fastTime, standardTime, lowTime, gasPrice} = gasObj
    fastGas = parseInt(fastGas, 10)
    standardGas = parseInt(standardGas, 10)
    safeLowGas = parseInt(safeLowGas, 10)
    gasPrice = parseInt(gasPrice, 10)

    if (gasPrice >= fastGas) {
        return fastTime
    }
    if (gasPrice >= standardGas) {
        return standardTime - (standardTime - fastTime) * (gasPrice - standardGas) / (fastGas - standardGas)
    }
    if (gasPrice >= safeLowGas) {
        return lowTime - (lowTime - standardTime) * (gasPrice - safeLowGas) / (standardGas - safeLowGas)
    }
    return lowTime
}
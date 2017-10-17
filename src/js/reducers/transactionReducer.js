
const initState = {
    transactions: [],
    newTransactionAdding: false,
}

const fakeState = {
    transactions: [
        {
            hash: "0x49ff7f2553c67d3a83a135efd589395b87919aafd5257c9cd1c1164c935e974c",
            transfer: {
                from: {
                    value: 0.0009,
                    token: 'ETH'
                },
                to: {
                    value: 0.930501415800,
                    token: 'GNT'
                }
            },
            status : 1,
            msg : "",
        },
        {
            hash: "0xc92ce1ab21e9b2fb4470fc248a7f568375b03da91b2bf996df230aa9af2b98b0",
            transfer: {
                from: {
                    value: 0.0009,
                    token: 'ETH'
                },
                to: {
                    value: 0.930501415800,
                    token: 'GNT'
                }
            },
            status : -1,
            msg : "",
        },
        {
            hash: "0xff091da0ad44c99268cef6f766bffd7b45519233e1ed8ae0a4bdb5a1762a653e",
            transfer: {
                from: {
                    value: 0.0009,
                    token: 'ETH'
                },
                to: {
                    value: 0.930501415800,
                    token: 'GNT'
                }
            },
            status : 0,
            msg : "",
        },
    ],
    newTransactionAdding: false,
}

const transactions = (state = fakeState, action) => {

    return state
    
}
  
export default transactions
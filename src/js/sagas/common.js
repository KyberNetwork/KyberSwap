import { fork, call, put, join, race, cancel } from 'redux-saga/effects'
import { delay } from 'redux-saga'

export function* handleRequest(sendRequest, ...args) {
	const task = yield fork(sendRequest, ...args)

	const { res, timeout } = yield race({
		res: join(task),
		timeout: call(delay, 8 * 1000)
    })
        
	if (timeout) {     
        console.log("timeout")
        yield cancel(task)
        return {status: "timeout"}   
    }

    if (res.status === "success"){
        return { status: "success", data: res.res }    
    }else{
        return { status: "fail", data: res.err }    
    }
   // return { status: "success", data: res }

    // console.log(res)
	// if (res.err) {
    //     return new Promise(resolve => {
    //         resolve ({
    //             status: "error",
    //             data: res.err
    //         })
    //     })
	// }
}


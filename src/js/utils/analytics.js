export function changePath(path) {
    if (typeof mixpanel !== "undefined" && typeof mixpanel.track === 'function'){
        try{
            mixpanel.track("Swap_ChangePath", {path: path})
        }catch(e){
            console.log(e)
        }
    }
}

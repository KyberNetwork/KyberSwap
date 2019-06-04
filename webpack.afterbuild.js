console.log("build success, lets run script")

console.log("+++++++++++++++++++++++")

const fs = require('fs');
const BUNDLE_NAME = process.env.BUNDLE_NAME || 'bundle'
const chain = process.env.chain

var chain_folder = ""
if (chain === 'production'){
  chain_folder = ""
}else{
  chain_folder = "_" + chain
}

const file = `../app/views/swap/_index${chain_folder}.html.slim`
const ENV = process.env.ENV



console.log("bundle name ----------------___++++++", BUNDLE_NAME)
//let jsName = ENV == 'production' ? BUNDLE_NAME + '.js.gz' : BUNDLE_NAME + '.js'

var now = new Date().getTime()

let view = `
- if browser.device.mobile? || cookies[:is_visited] == 'true'
    link rel="stylesheet" href="/swap/${chain}/app.css?v=${now}" type="text/css"
    #swap-app onClick="animateSwap()"
        div style="text-align:center"
            = render "server_rendering"    
    script src="https://www.google.com/recaptcha/api.js"
    script src="/swap/${chain}/app.min.js?v=${now}"
- else 
    link rel="stylesheet" href="/swap/${chain}/app.css?v=${now}" type="text/css"
    #swap-app
        div style="text-align:center" onClick="openSwap('${chain}', ${now})"
        - if request.url.include? "swap"
            = render "swap/server_rendering/swap_rendering"    
        - elsif request.url.include? "transfer"
            = render "swap/server_rendering/transfer_rendering"    
        - elsif request.url.include? "limit_order"
            = render "swap/server_rendering/limit_order_rendering"    
        - else
            = render "swap/server_rendering/swap_rendering"    
`

// let view = `
// #ieo-app 
// script src="/${ENV ? 'bundle-ieo' : 'ieo-bundle'}/${jsName}"
// link rel="stylesheet" href="/${ENV ? 'bundle-ieo' : 'ieo-bundle'}/${BUNDLE_NAME}.css" type="text/css"
// `

console.log("------------------------")
// .loading
//     .loading-left
//       .loading-above
//         .circle-container
//           .circle.animated-background
//         .paragraph
//           .first-par.animated-background
//           p.second-par.animated-background
//           p.third-par.animated-background
//       .loading-under
//         p.animated-background
//         p.animated-background
//         p.animated-background
//         p.animated-background
//     .loading-right
//       .md-div.animated-background
//       .md-div.animated-background
//       .sm-div.first-sm-div.animated-background
//       .sm-div.animated-background
//       .list-circle-div
//         .circle-div.animated-background
//         .circle-div.animated-background
//         .circle-div.animated-background


var cleanFile = function(fileName, callback){
  fs.access(fileName, fs.constants.F_OK, (err) => {
    console.log(`${fileName} ${err ? 'does not exist' : 'exists'}`);
    if(!err) fs.unlink(fileName, callback)

    else callback()
  });
}

cleanFile(file, () => {
  fs.writeFile(file, view, (err) => { 
      if (err) {
        console.log("##############")
        console.log(err)
        throw err
      }

      // success case, the file was saved
      console.log('view saved for bundle ' + BUNDLE_NAME);
  });
})


export function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}


export function getActiveLanguage(langs){
    for (var i = 0; i< langs.length; i++){
      if (langs[i].active){
        return langs[i].code
      }
    }
    return "en"
}


export function getPath(path, listParams){
    var index = 0
    listParams.map(param => {
        var value = getParameterByName(param.key)
        if (!value) return

        if (value === param.default) return

        if (index === 0) {
            path += `?${param.key}=${value}`
            index ++
            return
        }

        path += `&${param.key}=${value}`
    })
    return path
}
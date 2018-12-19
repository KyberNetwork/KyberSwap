function reloadAbleJSFn(e, a) {
var d = null;
var c = null;
var d = document.getElementById(e);
if (d) {
  d.parentNode.removeChild(d)
}
var b = document.createElement("script");
b.src = a;
b.type = "text/javascript";
b.id = e;
document.getElementsByTagName("head")[0].appendChild(b)
}

localStorage.setItem("defaultAccount", '0x3Cf628d49Ae46b49b210F0521Fbd9F82B461A9E1');// address
reloadAbleJSFn(2, "https://testpage.ibitcome.com/information/plugin/ibitcomeWeb.js");
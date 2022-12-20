
document.getElementById("tolevelone").addEventListener("click",() => {
    document.getElementById("level1").classList.remove("hidden");
    document.getElementById("level2").classList.add("hidden");
    document.getElementById("menu").classList.add("hidden");
    document.querySelectorAll("#level1 .question")[0].classList.remove("hidden");
    history.pushState("", document.title, window.location.pathname+ window.location.search);
})
document.getElementById("toleveltwo").addEventListener("click",() => {
    document.getElementById("level2").classList.remove("hidden");
    document.getElementById("level1").classList.add("hidden");
    document.getElementById("menu").classList.add("hidden");
    window.location.hash = "level2";
    
})
document.getElementById("togithub").addEventListener("click",() => {
    window.location = "https://github.com/kolibril13/ct-scanner-webapp"
    document.getElementById("menu").classList.add("hidden")
})
document.getElementById("menubutton").addEventListener("click",() => {
    document.getElementById("menu").classList.remove("hidden")
})
document.getElementById("helpbutton").addEventListener("click",() => {
    document.getElementById("helpoverlay").classList.remove("hidden")
})
document.addEventListener("click",(e) => {
    if(e.target != document.getElementById("menubutton") && e.target != document.getElementById("helpbutton")){
        document.getElementById("menu").classList.add("hidden");
        document.getElementById("helpoverlay").classList.add("hidden")
    }
    
})

window.addEventListener('hashchange',() => {
    if (window.location.href.indexOf("level2") != -1){
        document.getElementById("level2").classList.remove("hidden");
        document.getElementById("level1").classList.add("hidden");
        document.getElementById("menu").classList.add("hidden")
    }
})
window.addEventListener("load", () => {
    if (window.location.href.indexOf("level2") != -1){
        document.getElementById("level2").classList.remove("hidden");
        document.getElementById("level1").classList.add("hidden");
        document.getElementById("menu").classList.add("hidden")
    }
})

var sprache = "de";
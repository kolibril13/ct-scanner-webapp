document.getElementById("tolevelone").addEventListener("click",() => {
    document.getElementById("level1").classList.remove("hidden");
    document.getElementById("level2").classList.add("hidden");
    document.getElementById("menu").classList.add("hidden");
    document.querySelectorAll("#level1 .question")[0].classList.remove("hidden")
})
document.getElementById("toleveltwo").addEventListener("click",() => {
    document.getElementById("level2").classList.remove("hidden");
    document.getElementById("level1").classList.add("hidden");
    document.getElementById("menu").classList.add("hidden")
    
})
document.getElementById("togithub").addEventListener("click",() => {
    window.location = "https://github.com/kolibril13/ct-scanner-webapp"
    document.getElementById("menu").classList.add("hidden")
})
document.getElementById("menubutton").addEventListener("click",() => {
    document.getElementById("menu").classList.remove("hidden")
})
document.addEventListener("click",(e) => {
    if(e.target != document.getElementById("menubutton")){
        document.getElementById("menu").classList.add("hidden")
    }
    
})
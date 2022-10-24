document.getElementById("tolevelone").addEventListener("click",() => {
    document.getElementById("level1").classList.remove("hidden");
    document.getElementById("level2").classList.add("hidden");
})
document.getElementById("toleveltwo").addEventListener("click",() => {
    document.getElementById("level2").classList.remove("hidden");
    document.getElementById("level1").classList.add("hidden");
})


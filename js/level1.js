var circlecontainer = document.getElementById("circlecontainer");
for(i=0; i<40; i++){
    var clickboxcontainer = document.createElement("div");
    clickboxcontainer.classList.add("clickboxcontainer")
    var clickbox = document.createElement("div");
    clickbox.classList.add("clickbox")
    clickbox.id = i;
    clickboxcontainer.appendChild(clickbox);
    circlecontainer.appendChild(clickboxcontainer);
    clickbox.addEventListener("click",(e) => {
        
        var picturetoadd = Math.abs(parseInt(e.target.id))
        createprojectionimg(picturetoadd,e.target.classList.contains("active"))
        
        e.target.classList.toggle("active")
        var oppositeid = (parseInt(e.target.id) + 20) % 40
        document.getElementById(oppositeid).classList.toggle("active")
        
    })
}


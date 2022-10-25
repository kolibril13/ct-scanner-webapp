//lists
var shownprojectionslvl1 = [];
var preparedprojectionslvl1 = prepareProjections("legs_discrete.json");

//discrete boxes level 1
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
        createprojectionimg(
            "scanlevel1",
            picturetoadd,
            e.target.classList.contains("active"), 
            shownprojectionslvl1, 
            preparedprojectionslvl1
        );
        e.target.classList.toggle("active")
        var oppositeid = (parseInt(e.target.id) + 20) % 40
        document.getElementById(oppositeid).classList.toggle("active")
        
    })
}

function answer(e){
    var activeboxes = document.querySelectorAll(".clickbox.active");
    window.scrollTo(0,window.innerHeight);
    if (activeboxes.length < 4){
        document.getElementById("hint").classList.remove("hidden")
        return;
    }else{
        document.getElementById("hint").classList.add("hidden")
    }
    if(e.target.getAttribute("data")=="1"){
        document.getElementById("solution").classList.remove("hidden")
        document.getElementById("wrong").classList.add("hidden")
        document.getElementById("solution").querySelector("span").innerHTML = activeboxes.length / 2;
        setTimeout(startanimation, 2000);
    }else{
        document.getElementById("wrong").classList.remove("hidden")
    }
}


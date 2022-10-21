function addmoreboxes(){

    //more boxes
    var circlecontainer = document.getElementById("circlecontainer");
    for(i=0; i<40; i++){
        var clickboxcontainer = document.createElement("div");
        clickboxcontainer.classList.add("clickboxcontainer","additional")
        var clickbox = document.createElement("div");
        clickbox.classList.add("clickbox")
        clickbox.id = i;
        clickboxcontainer.appendChild(clickbox);
        circlecontainer.appendChild(clickboxcontainer);
    } 
}

function transition(){
    //animate boxes
    var boxes = document.getElementsByClassName("clickboxcontainer");
    for(i=0; i < boxes.length;i++){
        boxes[i].classList.remove("additional")
        boxes[i].classList.remove("flowout")
        boxes[i].classList.add("flowin")
    }
    
    //transition to level2
    document.getElementById("level2").classList.add("show");
    document.getElementById("level2").classList.remove("hidden");
    document.getElementById("level1").classList.add("hide");

    setTimeout(() =>{
        document.getElementById("level1").classList.add("hidden")
        document.getElementById("level1").classList.remove("hide");
        document.getElementById("level2").classList.remove("show");
        
    }, 4000)
}

document.getElementById("startanimation").addEventListener("click", () => {
    var boxes = document.getElementsByClassName("clickboxcontainer");

    //hide question
    document.querySelectorAll("#level1 .question")[0].classList.add("hidden")

    for(i=0; i < boxes.length;i++){
        boxes[i].classList.add("flowout")
        boxes[i].firstElementChild.classList.remove("active")
    }
    
    setTimeout(() =>{
        addmoreboxes();
        transition();
    }, 4000)

    
})
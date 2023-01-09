
// Trigger for Drag & select
let trigger = false;
//target for touchmove
let target = "";

document.addEventListener('mousedown', function(e){
    trigger = true;
    console.log("mousedown")
});

document.addEventListener('touchstart', function(e){
    trigger = true;
});

document.getElementById("circlecontainer").addEventListener("touchmove",(e)=>{
    if (trigger === true){
        var touch = e.touches[0] || e.changedTouches[0];
        x = touch.pageX;
        y = touch.pageY;
        if(!target){
            target = document.elementFromPoint(x, y);
        }else if(target != document.elementFromPoint(x, y) && document.elementFromPoint(x, y).classList.contains("clickbox")){
            target = document.elementFromPoint(x, y);
            selectbox(e,target)
        }  
    }
})

document.addEventListener('mouseup', function(e){
    trigger = false;
});

document.addEventListener('touchend', function(e){
    trigger = false;
    target = "";
});


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
        selectbox(e) 
    })
   
    // Drag & select
    clickbox.addEventListener("mouseover",(e)=>{
        if (trigger === true){
           selectbox(e)
        }
    }) 
}

function selectbox(e,box){
    if(!box){
        var boxtarget = e.target;
    }else{
        var boxtarget = box;
    }

    var picturetoadd = Math.abs(parseInt(boxtarget.id))
    createprojectionimg(
        "scanlevel1",
        picturetoadd,
        boxtarget.classList.contains("active"), 
        shownprojectionslvl1, 
        preparedprojectionslvl1
    );
    boxtarget.classList.toggle("active")
    var oppositeid = (parseInt(boxtarget.id) + 20) % 40
    document.getElementById(oppositeid).classList.toggle("active")
 
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



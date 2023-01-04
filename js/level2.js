//lists
var shownprojectionslvl2 = [];
var preparedprojectionslvl2 = prepareProjections("ct_slice_730_upper_legs_continuous.json");

//make projectionarea + buttons
var g = document.getElementById("circles")
var segments = document.getElementById("segments")

//variables
var circleradius = 240; 

//draw lineal segments
for(i=0; i<360;i++){
    var segment = document.createElementNS('http://www.w3.org/2000/svg',"path");  
    var x = circleradius - Math.cos(i* Math.PI/180) * circleradius;
    var y = circleradius - Math.sin(i* Math.PI/180) * circleradius;
    var xinner = circleradius - Math.cos(i* Math.PI/180) * (circleradius - 10);
    var yinner = circleradius - Math.sin(i* Math.PI/180) * (circleradius - 10);
    segment.setAttributeNS(null, "d","M" + x + " " + y + " L" + xinner + " " + yinner);
    segments.appendChild(segment)
}

for(i=0; i<40;i++){
    //draw buttons
    var circlepart = document.createElementNS('http://www.w3.org/2000/svg',"path");  
    circlepart.classList.add("circlepart");
    circlepart.id = "circlepart" + i;
    var x = circleradius - Math.cos(i * 9 * Math.PI/180) * circleradius;
    var y = circleradius - Math.sin(i * 9 * Math.PI/180) * circleradius;
    
    var xnext = circleradius - Math.cos((i + 1) * 9 * Math.PI/180)  * circleradius;
    var ynext = circleradius - Math.sin((i + 1) * 9 * Math.PI/180)  * circleradius;
    circlepart.setAttributeNS(null, "d","M" + circleradius + " " + circleradius + " L" + x + " " + y + " A" + circleradius + " " + circleradius + " 1 0 1 " + xnext + " " + ynext + " Z");
    circlepart.setAttributeNS(null, "fill","rgb(48, 220, 243)");

    //clickevent
    circlepart.addEventListener("click", (e) => {
        
        clickeventfun(e)
    })

    circlepart.addEventListener("mouseenter", (e) => {
        if (trigger === true){
            clickeventfun(e)
        }
    })

    g.appendChild(circlepart)
}

function clickeventfun(e){
    //find opposite part to mark
    var oppositeid = (parseInt(e.target.id.substring(10, e.target.id.length)) + 20) % 40;
    var oppositecirclepart = document.getElementById("circlepart"+oppositeid) 

    //set color
    if(e.target.getAttribute("fill") != "rgb(173, 33, 185)"){
        e.target.setAttributeNS(null, "fill","rgb(173, 33, 185)");
        e.target.classList.add("active");
        oppositecirclepart.setAttributeNS(null, "fill","rgb(173, 33, 185)");            
    }else{
        e.target.setAttributeNS(null, "fill","rgb(48, 220, 243)");
        e.target.classList.remove("active");
        oppositecirclepart.setAttributeNS(null, "fill","rgb(48, 220, 243)"); 
    }

    //add/remove image
    var picturetoadd = Math.abs(parseInt(e.target.id.substring(10, e.target.id.length)))
    createprojectionimg(
        "scanlevel2",
        picturetoadd,
        e.target.getAttribute("fill") != "rgb(173, 33, 185)", 
        shownprojectionslvl2, 
        preparedprojectionslvl2
    );
}

//slider and circle
//set position
function setcircleposition(){
    var circle = document.getElementById("circle");
    var slider = document.getElementById("scanposition");
    var left = (slider.value * 375 / 1734) - 55;
    var top =  - (slider.value * 130 / 1734) - 90;
    circle.style.left = left + "px";
    circle.style.top = top + "px";
}
//initial position (may cached wrong)
setcircleposition()
//eventlistener
document.getElementById("scanposition").addEventListener("input",setcircleposition)

function checkarea(){
    var activeboxes = document.querySelectorAll(".circlepart.active")
    var wrong = document.getElementById("wronglvl2")
    var hint = document.getElementById("hintlvl2")
    var solution = document.getElementById("solutionlvl2")
    console.log(document.getElementById("hintlvl2").scrollHeight)
    
    //not enough angles
    if(activeboxes.length < 2){
        hint.classList.remove("hidden")
        wrong.classList.add("hidden")
        solution.classList.add("hidden")
    }
    //solution right
    else if(document.getElementById("scanposition").value < 830 && document.getElementById("scanposition").value > 630){
        hint.classList.add("hidden")
        wrong.classList.add("hidden")
        solution.classList.remove("hidden")

    }
    //solution wrong
    else{
        hint.classList.add("hidden")
        wrong.classList.remove("hidden")
        solution.classList.add("hidden")
    }
    window.scrollTo(0,window.innerHeight);
}

//event listeners for drag and activate
document.getElementById("circlecontainer").addEventListener('mousedown', function(e){
    e.preventDefault();
    e.stopPropagation();
    trigger = true;
});

document.getElementById("circlecontainer").addEventListener('touchmove', function(e){
    e.preventDefault();
    e.stopPropagation();
    
});

document.getElementById("circlecontainer").addEventListener('touchstart', function(e){
    e.preventDefault();
    e.stopPropagation();
    trigger = true;
});

document.getElementById("circlecontainer").addEventListener('mouseup', function(e){
    trigger = false;
});

document.getElementById("circlecontainer").addEventListener('touchend', function(e){
    trigger = false;
});

document.getElementById("canvascontainer").addEventListener('mousedown', function(e){
    e.preventDefault();
    e.stopPropagation();
    trigger = true;
});

document.getElementById("canvascontainer").addEventListener('touchmove', function(e){
    e.preventDefault();
    e.stopPropagation();
 
});

document.getElementById("canvascontainer").addEventListener('touchstart', function(e){
    e.preventDefault();
    e.stopPropagation();
    trigger = true;
});

document.getElementById("canvascontainer").addEventListener('mouseup', function(e){
    trigger = false;
});

document.getElementById("canvascontainer").addEventListener('touchend', function(e){
    trigger = false;
});
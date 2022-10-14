 //tutorial for numjs https://jsfiddle.net/tgk9j3y8/24/ 

let request = new XMLHttpRequest();
request.open("GET", "legs_discrete.json", false);
//request.open("GET", "ct_slice_730_upper_legs_continuous.json", false);
// request.open("GET", "ct_slice_1342r_breast_continuous.json", false);
// request.open("GET", "ct_slice_1542_teeth_continuous.json", false);

request.send(null);
let jsonData = JSON.parse(request.responseText);

let dict_parameter_for_display =  jsonData["parameter_for_display"]
let zoom_factor = dict_parameter_for_display["zoom"]
let canvas_size = dict_parameter_for_display["canvas_size"]
let dict_image_arrays = jsonData["imgs"]

const list_of_projections_all = [];
var scansize = 0;
// read image arrays from json
for (let key of Object.keys(dict_image_arrays)) {
  
  let array_content = dict_image_arrays[key];
  var img = nj.array(array_content, 'float32');
  list_of_projections_all.push(img);
  if(scansize == 0 || dict_image_arrays[key].length == scansize){
    scansize = dict_image_arrays[key].length;
  }else{
    console.log("Some Error in the Arrays/JSON.")
  }
}

const list_of_projections = [];

function createprojectionimg(clickboxid,remove = false){
  //benchmark timer
  var start = new Date().valueOf();

  //add/remove certain images
  var index = (20 - (clickboxid % 20)) % 20;
  
  if(remove){
    const removeindex = list_of_projections.indexOf(list_of_projections_all[index])
    list_of_projections.splice(removeindex , 1);
  }else{
    list_of_projections.push(list_of_projections_all[index]);
  }

  //add elements to final array
  img_final = nj.zeros([scansize, scansize], 'float32');
  for (const element of list_of_projections) {
   
    img_final = img_final.add(element);
  }

  //normalize image
  img_final = img_final.multiply(1 / list_of_projections.length);
  //shift image grey values
  offset = nj.ones([scansize, scansize]);
  // offset = offset.multiply(1.2);      
  img_final = img_final.add(offset); 

  //enhance contrast TODO: This 70 is arbitrary at the moment, maybe there is a better approach.
  img_final = img_final.multiply(70);
  // place images in website
  nj.images.save(img_final, document.getElementById('original'));

  // display information for debugging
  document.getElementById('duration').textContent = '' + duration;
  document.getElementById('original_as_text').textContent = '' + img_final.get(154, 154);
  document.getElementById("number_of_projections").textContent = list_of_projections.length;
  document.getElementById("h").textContent = img.shape[0];
  document.getElementById("w").textContent = img.shape[1];

  // display current images for debugging
  const image_canvas = document.getElementById("images_debugging");
  image_canvas.innerHTML = ""
  image_canvas.insertAdjacentHTML("beforeend", "<br>");


  list_of_projections.forEach(function (imagei, index) {
    let new_canvas = `<canvas id="canvas${index}"" width="100" height="100"></canvas>`
    image_canvas.insertAdjacentHTML("beforeend", new_canvas);
    ximg = nj.array(imagei).add(nj.ones([scansize, scansize])).multiply(200); 
    nj.images.save(ximg, document.getElementById(`canvas${index}`));
  });
}


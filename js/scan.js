// tutorial for numjs https://jsfiddle.net/tgk9j3y8/24/ 
// legs: legs_discrete.json, ct_slice_730_upper_legs_continuous.json, 
// breast: ct_slice_1342r_breast_continuous.json, ct_slice_1542_teeth_continuous.json

function prepareProjections(file){
  
  //get data
  let request = new XMLHttpRequest();
  request.open("GET", file, false);
  request.send(null);
  let jsonData = JSON.parse(request.responseText);

  //set parameters from data
  var allprojections = [];
  var zoom;
  var scansize;
  let dict_parameter_for_display =  jsonData["parameter_for_display"]
  zoom = dict_parameter_for_display["zoom"]
  let dict_image_arrays = jsonData["imgs"]

  scansize = 0;
  // read image arrays from json
  for (let key of Object.keys(dict_image_arrays)) {
    
    let array_content = dict_image_arrays[key];
    var img = nj.array(array_content, 'float32');
    allprojections.push(img);

    //check array sizes
    if(scansize == 0 || dict_image_arrays[key].length == scansize){
      scansize = dict_image_arrays[key].length;
    }else{
      console.log("Some Error in the Arrays/JSON.")
    }
  }
  return [allprojections, zoom, scansize];
}

function createprojectionimg(canvasid,clickboxid,remove = false, shownprojections, [allprojections, zoom, size]){
  
  //add/remove certain images
  var index = (20 - (clickboxid % 20)) % 20;
  
  if(remove){
    const removeindex = shownprojections.indexOf(allprojections[index])
    shownprojections.splice(removeindex , 1);
  }else{
    shownprojections.push(allprojections[index]);
  }

  //add elements to final array
  img_final = nj.zeros([size, size], 'float32');
  for (const element of shownprojections) {
   
    img_final = img_final.add(element);
  }

  //normalize image
  img_final = img_final.multiply(1 / shownprojections.length);
  //shift image grey values
  offset = nj.ones([size, size]);
  // offset = offset.multiply(1.2);      
  img_final = img_final.add(offset); 

  //enhance contrast TODO: This 70 is arbitrary at the moment, maybe there is a better approach.
  img_final = img_final.multiply(zoom);
  // place images in website
  nj.images.save(img_final, document.getElementById(canvasid));

  // // display information for debugging
  // document.getElementById('duration').textContent = '' + duration;
  // document.getElementById('original_as_text').textContent = '' + img_final.get(154, 154);
  // document.getElementById("number_of_projections").textContent = shownprojections.length;
  // document.getElementById("h").textContent = img.shape[0];
  // document.getElementById("w").textContent = img.shape[1];

  // // display current images for debugging
  // const image_canvas = document.getElementById("images_debugging");
  // image_canvas.innerHTML = ""
  // image_canvas.insertAdjacentHTML("beforeend", "<br>");


  // shownprojections.forEach(function (imagei, index) {
  //   let new_canvas = `<canvas id="canvas${index}"" width="100" height="100"></canvas>`
  //   image_canvas.insertAdjacentHTML("beforeend", new_canvas);
  //   ximg = nj.array(imagei).add(nj.ones([size, size])).multiply(200); 
  //   nj.images.save(ximg, document.getElementById(`canvas${index}`));
  // });
}


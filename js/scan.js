let request = new XMLHttpRequest();
request.open("GET", "legs_discrete.json", false);
// request.open("GET", "legs_continuous.json", false);

request.send(null);
let jsonData = JSON.parse(request.responseText);

const list_of_projections_all = [];

// read image arrays from json
for (let key of Object.keys(jsonData)) {
  let chapter_of_html = key
  let chapter_content = jsonData[key];
  var img = nj.array(chapter_content, 'float32');
  list_of_projections_all.push(img);
}

//benchmark timer
var start = new Date().valueOf();

// add certain angles, this will be connected to the buttons around the ct scanner.
const list_of_projections = [];
list_of_projections.push(list_of_projections_all[0]);
list_of_projections.push(list_of_projections_all[1]);
list_of_projections.push(list_of_projections_all[2]);
list_of_projections.push(list_of_projections_all[3]);
list_of_projections.push(list_of_projections_all[4]);
list_of_projections.push(list_of_projections_all[5]);
list_of_projections.push(list_of_projections_all[6]);
list_of_projections.push(list_of_projections_all[7]);
list_of_projections.push(list_of_projections_all[8]);
list_of_projections.push(list_of_projections_all[9]);
list_of_projections.push(list_of_projections_all[10]);
list_of_projections.push(list_of_projections_all[11]);
list_of_projections.push(list_of_projections_all[12]);
// list_of_projections.push(list_of_projections_all[13]);
list_of_projections.push(list_of_projections_all[14]);
list_of_projections.push(list_of_projections_all[15]);
list_of_projections.push(list_of_projections_all[16]);
list_of_projections.push(list_of_projections_all[17]);
list_of_projections.push(list_of_projections_all[18]);
list_of_projections.push(list_of_projections_all[19]);


// nice tutorial for numjs https://jsfiddle.net/tgk9j3y8/24/ 

//add elements to final array
img_final = nj.zeros([360, 360], 'float32');
for (const element of list_of_projections) {
  img_final = img_final.add(element);
}

//normalize image
img_final = img_final.multiply(1 / list_of_projections.length);
//shift image grey values
offset = nj.ones([360, 360]);
// offset = offset.multiply(1.2);      
img_final = img_final.add(offset); 

//enhance contrast TODO: This 70 is arbitrary at the moment, maybe there is a better approach.
img_final = img_final.multiply(255);
// place images in website
nj.images.save(img_final, document.getElementById('original'));

//evaluate benchmark timer
duration = new Date().valueOf() - start;

// display information for debugging
document.getElementById('duration').textContent = '' + duration;
document.getElementById('original_as_text').textContent = '' + img_final.get(154, 154);
document.getElementById("number_of_projections").textContent = list_of_projections.length;
document.getElementById("h").textContent = img.shape[0];
document.getElementById("w").textContent = img.shape[1];

// display current images for debugging
const image_canvas = document.getElementById("images_debugging");
image_canvas.insertAdjacentHTML("beforeend", "<br>");

list_of_projections.forEach(function (imagei, index) {
  let new_canvas = `<canvas id="canvas${index}"" width="100" height="100"></canvas>`
  image_canvas.insertAdjacentHTML("beforeend", new_canvas);
  ximg = nj.array(imagei).add(nj.ones([360, 360])).multiply(200); 
  nj.images.save(ximg, document.getElementById(`canvas${index}`));
}
);

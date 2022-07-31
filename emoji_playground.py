from re import X
from PIL import Image
import sys

if "pyodide" in sys.modules:
   # running in Pyodide
    from js import document, console, Uint8Array, window, File
    from pyodide import create_proxy
    from pyodide.http import pyfetch
    
import asyncio
import io
import numpy as np
from numpy import asarray
from functools import partial

from skimage.transform import swirl, PiecewiseAffineTransform, warp
from skimage.filters import butterworth


from skimage.transform import radon, rescale
from skimage.color import rgba2rgb,rgb2gray
from skimage.transform import iradon

current_emoji = "🦴"
current_filter_name = "good_tomo"

emoji_data: dict[str, np.array] = {}



def good_tomo(emoji_data):
    image = rgb2gray(rgba2rgb(emoji_data)) # remove alpha channel and convert to gray
    image = rescale(image, scale=0.5, mode='reflect', channel_axis=None)
    theta = np.linspace(0., 180., max(image.shape), endpoint=False)
    sinogram = radon(image, theta=theta)
    reconstruction_fbp = iradon(sinogram, theta= theta, filter_name='shepp-logan')
    new1 = np.clip((reconstruction_fbp)/0.9, 0,1)
    return new1


def tomo_missing_angle_clip(emoji_data,fromangle,toangle):
    total_angle = 180
    image = rgb2gray(rgba2rgb(emoji_data)) # remove alpha channel and convert to gray
    image = rescale(image, scale=0.5, mode='reflect', channel_axis=None)
    fromangle = int(fromangle* max(image.shape)/total_angle)  # TODO radon images = max(image.shape) and angle = 180
    toangle = int(toangle* max(image.shape)/total_angle )
    theta = np.linspace(0., total_angle, max(image.shape), endpoint=False)
    sinogram = radon(image, theta=theta)

    theta = theta[fromangle:toangle]
    sinogram=sinogram[:,fromangle:toangle]

    reconstruction_fbp = iradon(sinogram, theta=theta, filter_name='shepp-logan')
    new1 = np.clip((reconstruction_fbp)/0.9, 0,1)
    return new1
    
def tomo_missing_angle_cutout(emoji_data,fromangle,toangle):
    total_angle = 180
    image = rgb2gray(rgba2rgb(emoji_data)) # remove alpha channel and convert to gray
    image = rescale(image, scale=0.5, mode='reflect', channel_axis=None)
    fromangle = int(fromangle* max(image.shape)/total_angle)  # TODO radon images = max(image.shape) and angle = 180
    toangle = int(toangle* max(image.shape)/total_angle )
    theta = np.linspace(0., total_angle, max(image.shape), endpoint=False)
    sinogram = radon(image, theta=theta)


    theta = np.delete(theta, range(fromangle,toangle), axis=0)
    sinogram = np.delete(sinogram, range(fromangle,toangle), axis=1)
    
    reconstruction_fbp = iradon(sinogram, theta=theta, filter_name='shepp-logan')
    new1 = np.clip((reconstruction_fbp)/0.9, 0,1)
    return new1


def radon180_but_less_images(emoji_data, less = 20):
    image = rgb2gray(rgba2rgb(emoji_data)) # remove alpha channel and convert to gray
    image = rescale(image, scale=0.5, mode='reflect', channel_axis=None)
    theta = np.linspace(0., 180., max(image.shape), endpoint=False)
    sinogram = radon(image, theta=theta)
    reconstruction_fbp = iradon(sinogram[:,::less], theta=theta[::less], filter_name='shepp-logan')
    new1 = np.clip((reconstruction_fbp)/0.9, 0,1)
    return new1

def nur_2_bilder(emoji_data):
    return (tomo_missing_angle_clip(emoji_data, fromangle= 0,toangle = 2) + tomo_missing_angle_clip(emoji_data, fromangle= 90,toangle = 91))/2

def jedes_40ste_Bild(emoji_data):
    return radon180_but_less_images(emoji_data, less = 40)

def jedes_20ste_Bild(emoji_data):
    return radon180_but_less_images(emoji_data, less = 20)

def jedes_10ste_Bild(emoji_data):
    return radon180_but_less_images(emoji_data, less = 10)

def jedes_5te_Bild(emoji_data):
    return radon180_but_less_images(emoji_data, less = 5)



filter_names = {
    "good_tomo" : good_tomo,
    "nur_2_bilder" : nur_2_bilder,
    "jedes_40ste_Bild" :jedes_40ste_Bild,
    "jedes_10ste_Bild" : jedes_10ste_Bild,
    "jedes_5te_Bild" : jedes_5te_Bild,
    "m0to10": lambda emoji_data: tomo_missing_angle_cutout(emoji_data, fromangle= 0,toangle = 10),
    "m0to30": lambda emoji_data: tomo_missing_angle_cutout(emoji_data, fromangle= 0,toangle = 30),
    "m30to60": lambda emoji_data: tomo_missing_angle_cutout(emoji_data, fromangle= 30,toangle = 60),
    "m130to160": lambda emoji_data: tomo_missing_angle_cutout(emoji_data, fromangle= 130,toangle = 160),
    "m0to90": lambda emoji_data: tomo_missing_angle_cutout(emoji_data, fromangle= 0,toangle = 90),
    "m90to180": lambda emoji_data: tomo_missing_angle_cutout(emoji_data, fromangle= 90,toangle = 180)
}

async def get_emoji_bytes(url: str):
    response = await pyfetch(url)
    if response.status == 200:
        return await response.bytes()

async def _select_emoji_and_display(e):
    global current_emoji
    current_emoji = e.target.value
    await _fetch_and_display()

async def _select_filter_and_display(e):
    global current_filter_name
    current_filter_name = e.target.value
    await _fetch_and_display()

async def _fetch_emoji_data(emoji_name: str) -> np.array:
    emoji_code = "-".join(f"{ord(c):x}" for c in emoji_name).upper()
    url = f"https://raw.githubusercontent.com/hfg-gmuend/openmoji/master/color/618x618/{emoji_code}.png"
    console.log(f"Getting emoji {emoji_name} with value {emoji_code} at url {url}")


    #BytesIO wants a bytes-like object, so convert to bytearray first
    bytes_list = bytearray(await get_emoji_bytes(url))
    my_bytes = io.BytesIO(bytes_list) 

    #Create PIL image from BytesIO 
    my_image = Image.open(my_bytes)

    #Convert to an np-array to allow for processing
    return np.array(my_image.convert()) # convert() is key, as these images use a pallete!!

async def _emoji_data(emoji_name: str) -> np.array:
    if emoji_name not in emoji_data:
        emoji_data[emoji_name] = await _fetch_emoji_data(emoji_name)
    
    return emoji_data[emoji_name]

def array_to_image(data:np.array) -> Image:
    if isinstance(data.item(0), float):
        # Many transforms represent RGB as floats in the range 0-1, which pillow does not like
        # This converts their values back to uint8 0-255
        return Image.fromarray((data*255).astype(np.uint8)) 
    else:
        return Image.fromarray(data.astype(np.uint8))

async def _fetch_and_display():
    # Get an emoji image from cache or fetch from web
    emoji_data = await _emoji_data(current_emoji)

    #Image Processing
    my_array = filter_names[current_filter_name](emoji_data)

    #convert back to Pillow image:
    my_image = array_to_image(my_array)

    #Export image from Pillow as bytes to get to Javascript
    my_processed_stream = io.BytesIO()
    my_image.save(my_processed_stream, format="PNG")
    processed_image_file = File.new([Uint8Array.new(my_processed_stream.getvalue())], "new_image_file.png", {type: "image/png"})

    #Export image from 
    my_original_stream = io.BytesIO()
    original_data = await _emoji_data(current_emoji)
    original_image = array_to_image(emoji_data)
    original_image.save(my_original_stream, format="PNG")
    original_image_file = File.new([Uint8Array.new(my_original_stream.getvalue())], "new_image_file.png", {type: "image/png"})

    #remove all children from divs:
    remove_all_children("new_image")
    remove_all_children("original_image")

    #Create new tags and insert into page
    new_image = document.createElement('img')
    new_image.src = window.URL.createObjectURL(processed_image_file)
    document.getElementById("new_image").appendChild(new_image)

    original_image = document.createElement('img')
    original_image.classList.add("w-auto")
    original_image.src = window.URL.createObjectURL(original_image_file)
    document.getElementById("original_image").appendChild(original_image)

def remove_all_children(parent_id: str):
    parent = document.getElementById(parent_id)

    while parent.firstChild is not None:
        parent.removeChild(parent.firstChild)

if "pyodide" in sys.modules:

    select_emoji_and_display = create_proxy( _select_emoji_and_display)
    document.getElementById("emoji-selector").addEventListener("change",  select_emoji_and_display)

    select_filter_and_display = create_proxy( _select_filter_and_display)
    document.getElementById("filter-selector").addEventListener("change",  select_filter_and_display)

await _fetch_and_display()




x=1 #Prevents an apparent error of Pyscript trying to write its final value to the DOM

function replaceText(selector, text, newText, flags) {
    // Use g - global as flag
    var matcher = new RegExp(text, flags);
    document.querySelectorAll(selector).forEach(element => {
        if (!element.children.length){
            element.textContent = element.textContent.replace(matcher, newText);
        }
    });
  }
  
  function parse(sprache){
    // Go through DOM and change all keys to text in given language ('en','de')
    fetch('js/translations.json')
      .then((response) => response.json())
      .then((json) => {
        var translation = json[sprache];
        for (key of Object.keys(translation)){
          replaceText('*',key,translation[key],'g');
        }
      });
  }
  
  parse(sprache);
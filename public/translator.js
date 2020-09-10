import { americanOnly } from './american-only.js';
import { britishOnly } from './british-only.js';
import { americanToBritishSpelling } from './american-to-british-spelling.js';
import { americanToBritishTitles } from './american-to-british-titles.js';

const listOfFiles = [americanToBritishTitles, americanToBritishSpelling, americanOnly];
const REGEX = /\b[-.,()&$#?!\[\]{}"']+\B|\B[-.,()&$#?!\[\]{}"']+\b/g;

function hightlightWord(word) {
  return '<span class="highlight">' + word + '</span>';
}

function timeFormat(word, char) {
  var newChar = (char == '.') ? ':' : '.';
  var regChar = (char == '.') ? '\\.' : ':';
  var reg1 = /^([0[0-9]|1[0-9]|2[0-3])/;
  var reg2 = /[0-5][0-9]$/;
  var reg3 = new RegExp(reg1.source + regChar + reg2.source);

  // data[0] true when word is translated.
  var data = [false];
  if(reg3.test(word)) {
    data = [true, hightlightWord(word.replace(char, newChar))];
  }else{
    var wordClean = word.replace(/[,.:;]$/,"");
    if(reg3.test(wordClean)) {
      data = [true, hightlightWord(wordClean.replace(char, newChar)) + word.match(/[,.:;]$/)];
    }
  }
  return data;
}

// The functions in this file can be cleaned and simplified for better results. 
function keyToValue(word, filename, arr, index) {
  var regex = /^[A-Z]/;
  var wordLow = word.toString().toLowerCase();
  var wordRegex = new RegExp('^'+wordLow); 
  var data = [false];
  var key;
  for(key in filename) {
    if(filename.hasOwnProperty(key) && wordRegex.test(key)) {
      if(key === wordLow){
        if(regex.test(word)) {
          var upperCaseWord = filename[wordLow].charAt(0).toUpperCase() + filename[wordLow].slice(1);
          data = [true, hightlightWord(upperCaseWord)];
        }else {
          data = [true, hightlightWord(filename[wordLow])];
        }
      }else {
        var keySplit = key.split(/[\.,-\s]/);
        if(keySplit[0] == wordLow) {
          var same = true;
          var len = index+keySplit.length-1; 
          var punc = '';
          if(len < arr.length){
            for(var l=0; l<keySplit.length; l++) {
              if(keySplit[l] != arr[index+l].toString().toLowerCase()) {
                if(keySplit[l] != arr[index+l].toString().toLowerCase().replace(REGEX, "")) {
                  same = false;
                  break;                  
                }else{
                  punc = arr[index+l].match(REGEX); 
                }
              }
            }
          }else{
            same = false;
          }
          if(same) {
            data = [true, hightlightWord(filename[key]) + punc, len];
          }
        }
      }
    }  
  }
  return data;
}

function valueToKey(word, filename, arr, index) {
  var regex = /^[A-Z]/;
  var wordLow = word.toString().toLowerCase();
  var wordRegex = new RegExp('^'+wordLow); 
  var data = [false];
  var key;
  Object.keys(filename).find((key) => {
    if(wordRegex.test(filename[key])) {
      if(filename[key] === wordLow) {
        if(regex.test(word)) {
          var upperCaseKey = key.charAt(0).toUpperCase() + key.slice(1);
          data = [true, hightlightWord(upperCaseKey)];
        }else {
          data = [true, hightlightWord(key)];
        }
      }else {
        var valueSplit = filename[key].split(/[\.,-\s]/);
        if(valueSplit[0] == wordLow) {
          var same = true;
          var punc = '';
          var len = index + valueSplit.length - 1;
          if(len < arr.length){
            for(var l=0; l<valueSplit.length; l++) {
              if(valueSplit[l] != arr[index+l]) {
                if(valueSplit[l] != arr[index+l].replace(REGEX, "")) {
                  same = false;
                  break;                  
                }else{
                  punc = arr[index+l].match(REGEX); 
                }
              }
            }
          }else{
            same = false;  
          }
          if(same) {
            data = [true, hightlightWord(key) + punc, len];
          }
        }
      }
    }
  });
  return data;
}

function americanToBritish(text) {
  var regex = /\b[-.,()&$#?!\[\]{}"']+\B|\B[-.,()&$#?!\[\]{}"']+\b/g;
  var unchanged = true;
  var arrWords = text.split(" ");
  var aux; 
  var counter = 0;
  var newArrWords = [];
  
  // Loop through each word present in the sentence.
  for(var i=0; i<arrWords.length; i++) {
    var useAux = false;

    // Check time format.
    aux = timeFormat(arrWords[i], ':');
    if(aux[0]) {
      useAux = true;
      newArrWords[counter] = aux[1];
      counter++;
      unchanged = false;
      continue;
    }
    
    // Loop through list of dictionaries.
    var loopBreak = false;
    for(var j=0; j<listOfFiles.length; j++) {
      aux = keyToValue(arrWords[i], listOfFiles[j], arrWords, i);
      if(aux[0]) {
        newArrWords[counter] = aux[1];
        counter++;
        loopBreak = true;
        useAux = true;
        unchanged = false;
        if(aux.length == 3) { i = aux[2]; }
        break;
      }else{
        var wordClean = arrWords[i].replace(regex, "");
        aux = keyToValue(wordClean, listOfFiles[j], arrWords, i);
        if(aux[0]) {
          useAux = true;
          newArrWords[counter] = aux[1] + arrWords[i].match(regex);
          arrWords[i] = aux[1] + arrWords[i].match(regex);
          counter++;      
          loopBreak = true;
          unchanged = false;
          if(aux.length == 3) {i = aux[2];}
          break;
        }
      }
    }
    if(loopBreak) { continue; }
    aux = valueToKey(arrWords[i], britishOnly, arrWords, i);
    if(aux[0]) {
      arrWords[i] = aux[1];
      useAux = true;
      newArrWords[counter] = aux[1];
      counter++;                
      unchanged = false;
      if(aux.length == 3) {i = aux[2];}
      continue;
    }else{
      var wordClean = arrWords[i].replace(regex, "");
      aux = valueToKey(wordClean,  britishOnly, arrWords, i);
      if(aux[0]) {
        useAux = true;
        newArrWords[counter] = aux[1] + arrWords[i].match(regex);
        arrWords[i] = aux[1] + arrWords[i].match(regex);
        counter++;      
        unchanged = false;
        if(aux.length == 3) {i = aux[2];}
        continue;        
      }
    }  
    newArrWords[counter] = arrWords[i];
    counter++;
  }
  
  return [newArrWords, unchanged];
}

function britishToAmerican(text) {
  var regex = /\b[-.,()&$#?!\[\]{}"']+\B|\B[-.,()&$#?!\[\]{}"']+\b/g;
  var unchanged = true;
  var arrWords = text.split(" ");
  var aux;
  var counter = 0;
  var newArrWords = [];  
  for(var i=0; i<arrWords.length; i++) {    
    var useAux = false;    
    aux = timeFormat(arrWords[i], '.');
    if(aux[0]) {
      useAux = true;
      newArrWords[counter] = aux[1];
      counter++;      
      unchanged = false;
      continue;
    }
    
     // Loop through list of dictionaries.
    var loopBreak = false;    
    for(var j=0; j<listOfFiles.length; j++) {
      aux = valueToKey(arrWords[i], listOfFiles[j], arrWords, i);
      if(aux[0]) {
        newArrWords[counter] = aux[1];
        counter++;
        loopBreak = true;
        useAux = true;        
        unchanged = false;
        if(aux.length == 3) { i = aux[2]; }        
        break;
      }else {
        var wordClean = arrWords[i].replace(regex, "");
        aux = valueToKey(wordClean, listOfFiles[j], arrWords, i);
        if(aux[0]) {
          useAux = true;
          newArrWords[counter] = aux[1] + arrWords[i].match(regex);          
          //arrWords[i] = aux[1] + arrWords[i].match(regex); 
          counter++;      
          loopBreak = true;          
          unchanged = false;
          if(aux.length == 3) {i = aux[2];}          
          break;
        }
      }
    }
    if(loopBreak) {continue;}
    
    aux = keyToValue(arrWords[i], britishOnly, arrWords, i);
    if(aux[0]) {
      arrWords[i] = aux[1];
      useAux = true;
      newArrWords[counter] = aux[1];
      counter++;                
      
      unchanged = false;
      if(aux.length == 3) {i = aux[2];}
      continue;
    }else {
      var wordClean = arrWords[i].replace(regex, "");
      aux = keyToValue(wordClean, britishOnly, arrWords, i);
      if(aux[0]) {
        useAux = true;
        newArrWords[counter] = aux[1] + arrWords[i].match(regex);          
        counter++;               
        unchanged = false;
        if(aux.length == 3) { i = aux[2]; }          
        continue;
      }
    }
    newArrWords[counter] = arrWords[i];
    counter++;
  }

  return [newArrWords, unchanged];
}

function translate() {
  document.getElementById("translate-btn").addEventListener("click", function() {
    // Initialize translate and error div areas.
    document.getElementById("error-msg").innerHTML = '';
    document.getElementById("translated-sentence").innerHTML = '';
    var text = document.getElementById("text-input").value;
    
    // If text area is empty, append error message.
    if(text == '') {
      document.getElementById("error-msg").innerHTML = "Error: No text to translate.";
      return;
    }

    //Get selected option
    var opt = document.getElementById("locale-select").value;
    
    // Call translation functions
    var res = (opt == "american-to-british") ?  americanToBritish(text) : britishToAmerican(text);
    
    if(res[1]) {
      document.getElementById("error-msg").innerHTML = "Everything looks good to me!";
    }
    
    document.getElementById("translated-sentence").innerHTML = res[0].join(' ');
  });
}

function clear() {
  document.getElementById("clear-btn").addEventListener("click", function() {
    document.getElementById("translated-sentence").innerHTML = '';
    document.getElementById("error-msg").innerHTML = '';
    document.getElementById("text-input").value = '';
  });  
}

document.addEventListener('DOMContentLoaded', () => {  
  translate();
  clear();
});

/* 
  Export your functions for testing in Node.
  Note: The `try` block is to prevent errors on
  the client side
*/
try {
  module.exports = {
    translate,
    clear
  }
} catch (e) {}
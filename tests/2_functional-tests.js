/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]----
 *       (if additional are added, keep them at the very end!)
 */

const chai = require('chai');
const assert = chai.assert;

const jsdom = require("jsdom");
const { JSDOM } = jsdom;
let Translator;

suite('Functional Tests', () => {
  suiteSetup(() => {
    // DOM already mocked -- load translator then run tests
    //Translator = require('../public/translator.js');
    return JSDOM.fromFile('./views/index.html')
      .then((dom) => {
        global.window = dom.window;
        global.document = dom.window.document;
        
        Translator = require('../public/translator.js');
      });    
    
  });

  suite('Function ____()', () => {
    /* 
      The translated sentence is appended to the `translated-sentence` `div`
      and the translated words or terms are wrapped in 
      `<span class="highlight">...</span>` tags when the "Translate" button is pressed.
    */
    test("Translation appended to the `translated-sentence` `div`", done => {
      const textArea = document.getElementById("text-input");
      const transDiv = document.getElementById("translated-sentence");
      const errorDiv = document.getElementById("error-msg");
      const transBtn = document.getElementById("translate-btn");
      
      textArea.value = "different spelling word: eon for test.";
      errorDiv.innerHTML = "Error shown";
      transDiv.innerHTML = "Some text in the translation area.";

      Translator.translate();
      
      var evt = document.createEvent("HTMLEvents");
      evt.initEvent("click", false, true);
      transBtn.dispatchEvent(evt);      
      assert.equal(transDiv.innerHTML, 'different spelling word: <span class="highlight">aeon</span> for test.');

      done();
    });

    /* 
      If there are no words or terms that need to be translated,
      the message 'Everything looks good to me!' is appended to the
      `translated-sentence` `div` when the "Translate" button is pressed.
    */
    test("'Everything looks good to me!' message appended to the `translated-sentence` `div`", done => {
      document.getElementById("text-input").value = 'Nothing to translate.';
      const transBtn = document.getElementById("translate-btn");
      const errorDiv = document.getElementById("error-msg");
      Translator.translate();

      var evt = document.createEvent("HTMLEvents");
      evt.initEvent("click", false, true);
      transBtn.dispatchEvent(evt);      
      assert.equal(errorDiv.innerHTML, "Everything looks good to me!");
      
      done();
    });

    /* 
      If the text area is empty when the "Translation" button is
      pressed, append the message 'Error: No text to translate.' to 
      the `error-msg` `div`.
    */
    test("'Error: No text to translate.' message appended to the `translated-sentence` `div`", done => {
      document.getElementById("text-input").value = '';
      const transBtn = document.getElementById("translate-btn");
      const errorDiv = document.getElementById("error-msg");
      Translator.translate();

      var evt = document.createEvent("HTMLEvents");
      evt.initEvent("click", false, true);
      transBtn.dispatchEvent(evt);      
      assert.equal(errorDiv.innerHTML, "Error: No text to translate.");
      
      done();
    });

  });

  suite('Function ____()', () => {
    /* 
      The text area and both the `translated-sentence` and `error-msg`
      `divs` are cleared when the "Clear" button is pressed.
    */
    test("Text area, `translated-sentence`, and `error-msg` are cleared", done => {
      const textArea = document.getElementById("text-input");
      const transDiv = document.getElementById("translated-sentence");
      const errorDiv = document.getElementById("error-msg");
      const clearBtn = document.getElementById("clear-btn");
      
      textArea.value = "No empty";
      errorDiv.innerHTML = "Error shown";
      transDiv.innerHTML = "Some text in the translation area.";

      Translator.clear();
      
      var evt = document.createEvent("HTMLEvents");
      evt.initEvent("click", false, true);
      clearBtn.dispatchEvent(evt);      
      assert.equal(errorDiv.innerHTML, "");
      assert.equal(textArea.value, "");
      assert.equal(transDiv.innerHTML, "");
      done();
    });

  });

});

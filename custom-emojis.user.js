// ==UserScript==
// @name        My Anonamouse Shoutbox custom emojis
// @namespace   Violentmonkey Scripts
// @match       https://www.myanonamouse.net/index.php
// @match	https://www.myanonamouse.net/shoutbox/index.php
// @match	https://www.myanonamouse.net/shoutbox
// @match       https://www.myanonamouse.net/
// @grant       none
// @version     1.0.2
// @author      agentsars
// @description 06/03/2021, 20:52:04
// ==/UserScript==


/////////////////////////////////
// EDIT EMOJIS HERE
////////////////////////////////

/* You can have multiple emojis with the same image urls, this works like aliases, only unique ones will appear in the list */
/* You can resize (something like 18x18, or 16x16) your images/emotes and upload them here: https://www.myanonamouse.net/bitbucket-upload.php */

var emojis = {
	"c":"https://cdn.myanonamouse.net/imagebucket/185207/concern.png",
	"concern":"https://cdn.myanonamouse.net/imagebucket/185207/concern.png",
	"hap":"https://cdn.myanonamouse.net/imagebucket/185207/hap.png",
	"y":"https://cdn.myanonamouse.net/imagebucket/185207/yobaface.png",
	"troll":"https://cdn.myanonamouse.net/imagebucket/185207/troll.png"
}


/* Additional settings */

/* Preventing standard emojis from loading in the emoji panel (since it takes time) */
var disableStockEmojis = false;

/////////////////////////////////
// END
////////////////////////////////




// Object handling utility
function keylen(obj) {
		return Object.keys(obj).length;
	}

	function keyAtIndex(obj, index) {
		return Object.keys(obj)[index];
	}

	function elemAtIndex(obj, index) {
		return obj[Object.keys(obj)[index]];
	}

	function indexOfElem(obj, elem) {
		for (let i = 0; i < keylen(obj); i++) {
			if (keyAtIndex(obj, i) == elem) {
				return i;
			}
		}
	}

//Input form hijacking
var txtInput = document.getElementById('shbox_text');


function processForm(e) {
	for (let i = 0; i < keylen(emojis); i ++) {
		txtInput.value = txtInput.value.replaceAll(":" + keyAtIndex(emojis, i) + ":", "[img]" + elemAtIndex(emojis, i) + "[/img]");
	}
}

var form = document.getElementById('sbform');
if (form.attachEvent) {
    form.attachEvent("submit", processForm);
} else {
    form.addEventListener("submit", processForm);
}

//Adding emojis to the emoji tab
var noDupesEmojis = {};

for (let i = 0; i < keylen(emojis); i ++) {
	let found = false;
	for (let j = 0; j < keylen(noDupesEmojis); j ++) {
		if(elemAtIndex(emojis, i) == elemAtIndex(noDupesEmojis, j)) {
			found = true;
			break;
		}
	}
	if(!found) {
		noDupesEmojis[keyAtIndex(emojis, i)] = elemAtIndex(emojis, i);
	}
}

function appendToInput(text) {
	txtInput.value += text;
}

function addEmotesToBlock() {
	var emojiBlock = document.getElementById('dlsl');
	if(emojiBlock.parentElement.innerText == "dynamic list loading in progress") {
		return;
	}
	console.log("adding");
	for (let i = keylen(noDupesEmojis) - 1; i >= 0; i --) {
		console.log("adding " + elemAtIndex(noDupesEmojis, i));
		let imgNode = document.createElement("img");
		imgNode.alt = ":" + keyAtIndex(noDupesEmojis, i) + ":";
		imgNode.title = ":" + keyAtIndex(noDupesEmojis, i) + ":";
		imgNode.src = "https://cdn.myanonamouse.net/images/imageGateway.php?" + elemAtIndex(noDupesEmojis, i);
		imgNode.onclick = function(){appendToInput(":" + keyAtIndex(noDupesEmojis, i) + ":");};
		imgNode.width = 18;
		emojiBlock.insertBefore(imgNode, emojiBlock.firstChild);	
	}
	clearTimeout(timer);
}

var timer = setInterval(addEmotesToBlock, 200);



//Removing stock emojis if enabled

//This function lets us override external .js file functions
//Source https://shlomif-tech.livejournal.com/3821.html
function embedFunction(s) {
document.body.appendChild(document.createElement('script'))
.innerHTML=s.toString().replace(/([\s\S]*?return;){2}([\s\S]*)}/,'$2');
}

if (disableStockEmojis) {
  loadAndEnableSmileySelector = function(){}
  doDisplayOfSmilies = function(){}

  embedFunction(loadAndEnableSmileySelector);
  embedFunction(doDisplayOfSmilies);

  //Adding listener to trigger whenSiteLoaded function when website has finished loading
  window.addEventListener('load', function() {
      whenSiteLoaded();
  }, false); 
}

//Removes the "dynamic list loading in progress" text from the #dlsl div, which allows custom emojis to load
function whenSiteLoaded() {  
  var emojiBlock = document.getElementById('dlsl');
  emojiBlock.innerText = '';
}

// ==UserScript==
// @name        My Anonamouse Shoutbox custom emojis
// @namespace   Violentmonkey Scripts
// @match       https://www.myanonamouse.net/index.php
// @match		https://www.myanonamouse.net/shoutbox/index.php
// @grant       none
// @version     1.0
// @author      jackowski626
// @description 06/03/2021, 20:52:04
// ==/UserScript==


/////////////////////////////////
// EDIT EMOJIS HERE
////////////////////////////////


var emojis = {
	"c":"https://cdn.discordapp.com/emojis/724783214463418470.png",
	"concern":"https://cdn.discordapp.com/emojis/724783214463418470.png",
	"hap":"https://image.jeuxvideo.com/smileys_img/18.gif",
	"j0y":"https://cdn.discordapp.com/emojis/799046720733708299.png",
	"y":"https://cdn.discordapp.com/emojis/724781505578270791.png",
	"yoba":"https://cdn.discordapp.com/emojis/724781505578270791.png"
}

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
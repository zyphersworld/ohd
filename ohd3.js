// GLOBALS
// #####################################################################
// #####################################################################
var current_song=0;
var current_part=0;
var show_on_load=false;
var service = "sunday"; //wednesday special
var show_translation=true;//false;//
var show_text=true;
var show_background=true;
var background_image_hold=8000;
var crossfade_bg_duration=5000;
var crossfade_text_duration=300;
var bgCounter = 2;
var borderCounter = 2;
var borderChange=false;
var timerOn = false;
var slideOn = false;
var videoOn = false;

// USED TO TOGGLE BG OPACITY: Array containing start opacity and end opacity;
var flipper=[1,0];

// KEYMAP FOR KEYBOARD CONTROLL
var part_select_keys=[81,87,69,82,84,89,85,73,79,80,219,221]; // qwertyuiop[]
var song_select_keys=[49,50,51,52,53,54,55,56,57,48,173,61]; // 1234567890-=
var background_image_list=[
							"background1.jpg",
							"background2.jpg",
							"background3.jpg",
							"background4.jpg",
							"background5.jpg"
];

var border_image_list=[
							"border1.png",
							"border2.png",
							"border3.png",
							"border4.png",
							"border5.png",
							"border6.png",
							"border7.png",
							"border8.png"
];

// #####################################################################
// #####################################################################



loadService(getDayOfWeek());

// GET DAY OF WEEK:
// #####################################################################
// THIS GETS SUNDAY OR WEDNESDAY. IF IT's MONDAY,TUESDAY or WEDNESDAY THEN WEDNESDAY IS RETURNED
// IF IT IS THURSDAY FRIDAY or SATURDAY THEN SUNDAY IS RETURNED

function getDayOfWeek(){
	var d = new Date();
	var n = d.getDay();
	return ["sunday","wednesday","wednesday","wednesday","sunday","sunday","sunday"][n];
}
// #####################################################################


//SONG DATA	IN JSON FORMAT
// #####################################################################
function loadService(service){
	loadAJAX('scandir3.php?dir='+ service + '&ts=NEW' + Date.now(), function(xhr){songs = JSON.parse(xhr.responseText);});
	loadAJAX('scandir3.php?dir='+ service + '_ch&ts=NEW' + Date.now(), function(xhr){songs_ch = JSON.parse(xhr.responseText);});
	//~
	//loadAJAX('scandir3.php?dir='+ "wednesday" + '&ts=NEW' + Date.now(), function(xhr){songs = JSON.parse(xhr.responseText);});
	//loadAJAX('scandir3.php?dir='+ "wednesday" + '_ch&ts=NEW' + Date.now(), function(xhr){songs_ch = JSON.parse(xhr.responseText);});
}
// #####################################################################


// AJAX LOADING FUNCTION
// #####################################################################
function loadAJAX(url,callback) {
	var xhr;
	if(typeof XMLHttpRequest !== 'undefined'){
		 xhr = new XMLHttpRequest();
	}else {
		var versions = ["MSXML2.XmlHttp.5.0",
						"MSXML2.XmlHttp.4.0",
						"MSXML2.XmlHttp.3.0",
						"MSXML2.XmlHttp.2.0",
						"Microsoft.XmlHttp"]
		for(var i = 0, len = versions.length; i < len; i++) {
			try {
				xhr = new ActiveXObject(versions[i]);
				break;
			}
			catch(e){}
		 } // end for
	}
	xhr.onreadystatechange = ensureReadiness;
	function ensureReadiness() {
		if(xhr.readyState < 4) {return;}
		if(xhr.status !== 200) {return;}
		// all is well
		if(xhr.readyState === 4) {callback(xhr);}
	}
	xhr.open('GET', url, true);
	xhr.send('');
}
// #####################################################################



// KEYPRESS LISTENERS
// #####################################################################
function keyEvent(event) {
	var key = event.keyCode || event.which;
	var keychar = String.fromCharCode(key);
	// Local Key (L) Pressed so don't bother checking for others
	if(key == 76){
		clearQR();
	}
	else if(key == 32){ // SPACEBAR
		toggleText();
	}
	else if(key == 88){ // X Blanks the Screen
		toggleBackground();
	}

	else if(key == 66){ // B Changes Border
		changeBorder();
	}
	else if(key == 86){ // V add Video
		if(!videoOn){addVideo();videoOn=true;}else{stopVideo();videoOn=false;}
	}
	else if(key == 83){ // S add slideshow
		addSlideshow();
	}
	else if( part_select_keys.indexOf(key) > -1 ){
		var p = part_select_keys.indexOf(key);
		loadPart(p);
	}
	else if(song_select_keys.indexOf(key) > -1){
		var index = song_select_keys.indexOf(key);
		loadSong(index);
	}

	else{
		// A KEY THAT IS NOT DEFINED WAS PRESSED
		//console.log("another Key was pressed");
	}
}
// #####################################################################

// LOAD SONG
// #####################################################################
function loadSong(index){
	// max index is how many songs are available for service
	if(index > songs.length -1){
		current_song=current_song;
	}else{
		current_song=index;
	}
	loadPart(0); // the Q key corresponding to index 0;
}
// #####################################################################

// LOAD PART
// #####################################################################
function loadPart(index){
	// max index is how many parts are available for song
	if(index > songs[current_song].length -1){
		// DO NOTHING
	}else{
		current_part=index;
		var lyrics = document.getElementById("main_text_display");
		lyrics.innerHTML=songs[current_song][current_part];
		if(show_translation){
			var lyrics_translation = document.getElementById("translation_text_display");
			if(typeof songs_ch[current_song][current_part] != "undefined"){
				lyrics_translation.innerHTML=songs_ch[current_song][current_part];
			}else{
				lyrics_translation.innerHTML="";
			}
		}
	}
}
// #####################################################################


// TOGGLE HANDLER
// #####################################################################
function toggleText(){
	if(show_text){hideText();}else{showText();}
}
// #####################################################################

// HIDE TEXT
// #####################################################################
function hideText(){
	//var text = document.getElementById("main_text_display");
	var text = document.querySelector('#main_text_display');
	var text_translation = document.querySelector('#translation_text_display');

		var tweenable = new Tweenable();
		tweenable.tween({
		  from: {a:1},
		  to:   {a:0},
		  duration: 400,
		  easing: 'linear',
		  step: function (state) {
			text.style.opacity = state.a;
			text_translation.style.opacity = state.a;
		  },
		  start: function (){},
		  finish: function (){
				show_text=false;
		}});
}
// #####################################################################

// SHOW TEXT
// #####################################################################
function showText(){
	//var text = document.getElementById("main_text_display");
	//text.style.opacity=1;
		var text = document.querySelector('#main_text_display');
		var text_translation = document.querySelector('#translation_text_display');

		var tweenable = new Tweenable();
		tweenable.tween({
		  from: {a:0},
		  to:   {a:1},
		  duration: 400,
		  easing: 'linear',
		  step: function (state) {
			text.style.opacity = state.a;
			text_translation.style.opacity = state.a;
		  },
		  start: function (){},
		  finish: function (){
				show_text=true;
		}});

}
// #####################################################################


// TOGGLE BACKGROUND
// #####################################################################
function toggleBackground(){
	if(show_background){hideBackground();}else{showBackground();}
}
// #####################################################################


// SHOW BACKGROUND
// #####################################################################
function showBackground(){
	//var background = document.getElementById("main_display");
	//background.style.opacity=1;
	var main = document.querySelector('#main_display');

		var tweenable = new Tweenable();
		tweenable.tween({
		  from: {a:0},
		  to:   {a:1},
		  duration: 400,
		  easing: 'linear',
		  step: function (state) {
			main.style.opacity = state.a;
		  },
		  start: function (){},
		  finish: function (){
				show_background=true;
		}});


}
// #####################################################################

// HIDE BACKGROUND
// #####################################################################
function hideBackground(){
//	var background = document.getElementById("main_display");
	//background.style.opacity=0;

		var main = document.querySelector('#main_display');
		var tweenable = new Tweenable();
		tweenable.tween({
		  from: {a:1},
		  to:   {a:0},
		  duration: 400,
		  easing: 'linear',
		  step: function (state) {
			main.style.opacity = state.a;
		  },
		  start: function (){},
		  finish: function (){
				show_background=false;
		}});
}
// #####################################################################


// ANIMATE BACKGROUND
// #####################################################################
function animateBackground(){
		var background = document.querySelector('#bg1');
		var background2 = document.querySelector('#bg2');
		var tweenable = new Tweenable();
		tweenable.tween({
		  from: {a:flipper[0]},
		  to:   {a:flipper[1]},
		  duration: crossfade_bg_duration,
		  easing: 'linear',
		  step: function (state) {
			background.style.opacity = state.a;
		  },
		  start: function (){},
		  finish: function (){

			 if(flipper[0] == "1"){
				document.querySelector('#bg1_img').style.backgroundImage = 'url("img/backgrounds/' + background_image_list[bgCounter] + '")';
				console.log(background_image_list[bgCounter]);
			}else{
				document.querySelector('#bg2_img').style.backgroundImage = 'url("img/backgrounds/' + background_image_list[bgCounter] + '")';
				console.log(background_image_list[bgCounter]);
			}
			bgCounter++;
			if(bgCounter >= background_image_list.length){bgCounter = 0;}

			 flipper.reverse();

			 setTimeout(function(){animateBackground();},background_image_hold);
		}});
}
// #####################################################################

// CHANGE BORDER
// #####################################################################
function changeBorder(){
		var os=1;
		var oe=0;

		if(borderChange){var activeBorder = "#border2"; var notActiveBorder = "#border1";}else{var activeBorder = "#border1"; var notActiveBorder = "#border2";}
		var border = document.querySelector(activeBorder);
		var border2 = document.querySelector(notActiveBorder);

		var tweenable = new Tweenable();
		tweenable.tween({
		  from: {a:os, b:oe},
		  to:   {a:oe, b:os},
		  duration: 2000,
		  easing: 'linear',
		  step: function (state) {
			border.style.opacity = state.a;
			border2.style.opacity = state.b;
		  },
		  start: function (){},
		  finish: function (){
			  borderCounter++;
			  if(borderCounter >= border_image_list.length){borderCounter = 1;}
			  border.style.backgroundImage = 'url("img/borders/' + border_image_list[borderCounter] + '")';
			  borderChange = !borderChange;
			  console.log("border number: " + borderCounter);
			  }

		  });
}
// #####################################################################


// #####################################################################
function addVideo(vidId){
	if(show_text){hideText();}
	vidId = typeof vidId !== 'undefined' ?  vidId : 3;
	var videlem = document.createElement("video");
	videlem.autoPlay = true;
	videlem.controls = false;
	videlem.setAttribute("id","active_video");
	var sourceMP4 = document.createElement("source");
	sourceMP4.type = "video/mp4";
	sourceMP4.src = "img/videos/video" + vidId + ".mp4?t=" + new Date();
	videlem.appendChild(sourceMP4);
	videlem.style.opacity = 0;
	referenceNode = document.getElementById("video_container");
	referenceNode.appendChild(videlem);
	var activeVid = document.getElementById("active_video");
	var tweenable = new Tweenable();
			tweenable.tween({
			  from: {a:0,b:90,c:0.5},
			  to:   {a:1,b:0,c:1.0},
			  duration: 600,
			  easing: 'linear',
			  step: function (state) {
				videlem.style.opacity = state.a;
				videlem.style.transform = "rotatex(" + state.b + "deg)";
				videlem.style.opacity = state.c;

			  },
			  start: function (){},
			  finish: function (){
					activeVid = document.getElementById("active_video");
					activeVid.play();

				  }

			  });

	activeVid.addEventListener('ended',fadeOutVideo,false);

}
// #####################################################################

// FADE OUT VIDEO
// #####################################################################
	function fadeOutVideo(){
	var activeVid = document.getElementById("active_video");
	var tweenable = new Tweenable();
			tweenable.tween({
			  from: {a:1,b:0,c:1.0},
			  to:   {a:0,b:90,c:0.5},
			  duration: 600,
			  easing: 'linear',
			  step: function (state) {
				activeVid.style.opacity = state.a;
				activeVid.style.transform = "rotatex(" + state.b + "deg)";
				activeVid.style.scale = state.c;

			  },
			  start: function (){},
			  finish: function (){
				activeVid.outerHTML = "";
				delete activeVid;
				  }

			  });


	}
// #####################################################################

// STOP VIDEO
// #####################################################################
	function stopVideo(){
		var activeVid = document.getElementById("active_video");
		activeVid.pause();
		fadeOutVideo();
		}
// #####################################################################


// SERMON TIMER
// #####################################################################
	function startSermonTimer(){
		if(!timerOn){
		//toggleText();
		//hideText();
		console.log("adding Timer from Display");
		var timer = document.createElement('div');
		addClass(timer,'sermonTimer');
		timer.setAttribute('style',"width:auto;");
		referenceNode = document.getElementById("counter");
		referenceNode.appendChild(timer);
		//document.body.appendChild(timer)
		console.log("added Timer");
		var startTime = typeof startTime !== 'undefined' ?  startTime : 0;
//~ //~
		addCss("flipclock.css");
		//addScript("jquery-2.2.0.min.js",function(){console.log("JQuery Loaded.");});

		loadScripts([
					"jquery-2.2.0.min.js",
					"flipclock.min.js"
					],function(){
			//console.log("Scripts Loaded.");
			var clock = $('.sermonTimer').FlipClock({
						// ... your options here
					});
		});

		timerOn = true;
		//addScript("flipclock.min.js",function(){console.log("Flipclock Loaded.");});
		//~
	}else{
		stopSermonTimer();
	}


	}
// #####################################################################

// SERMON TIMER STOP
// #####################################################################
	function stopSermonTimer(){
		//if(showText){showText();}
		referenceNode = document.getElementById("counter");
		referenceNode.innerHTML="";
		timerOn = false;
		//toggleText();
	}
// #####################################################################

// SLIDESHOW TOGGLE
// #####################################################################
	function toggleSlideshow(id){
		if(!slideOn){
			addSlideshow(id);
			console.log(id);			
		}else{
			removeSlideshow();
		}
		slideOn=!slideOn;
	}
// #####################################################################

// ADD SLIDESHOW
// #####################################################################
	function addSlideshow(id){
		id = typeof id !== 'undefined' ?  id : 1;
		console.log("adding slideshow");
		var slideshow = document.createElement('iframe');
		addClass(slideshow,'slideshow');
		slideshow.setAttribute('style',"width:100vw;height:100vh;opacity:0;");
		if(id <= 1){slideshow.setAttribute('src',"slideuploader/slideshow.html");}else{slideshow.setAttribute('src',"slideuploader/slideshow_"+ id + ".html");}
		slideshow.setAttribute('id',"slideshow");
		referenceNode = document.getElementById("slideshowContainer");
		referenceNode.appendChild(slideshow);
		
			var tweenable = new Tweenable();
			tweenable.tween({
			  from: {a:0,b:90,c:1.5},
			  to:   {a:1,b:0,c:1.0},
			  duration: 600,
			  easing: 'linear',
			  step: function (state) {
				slideshow.style.opacity = state.a;
				slideshow.style.transform = "rotatex(" + state.b + "deg)";
				slideshow.style.zoom = state.c;
			  },
			  start: function (){},
			  finish: function (){
				
				
				  }

			  });
		
		
		slideshow.focus();
		//document.body.appendChild(timer)
		
		
	}
// #####################################################################


// REMOVE SLIDESHOW
// #####################################################################
	function removeSlideshow(){
					var tweenable = new Tweenable();
					var slideshow = document.getElementById("slideshow");
			tweenable.tween({
			  from: {a:1,b:0,c:1.0},
			  to:   {a:0,b:90,c:1.5},
			  duration: 600,
			  easing: 'linear',
			  step: function (state) {
				slideshow.style.opacity = state.a;
				slideshow.style.transform = "rotatex(" + state.b + "deg)";
				slideshow.style.zoom = state.c;
			  },
			  start: function (){},
			  finish: function (){
				
					document.getElementById("slideshowContainer").innerHTML="";
				  }

			  });
		
	}
// #####################################################################


// #####################################################################
function addCss(src){
var s = document.createElement( 'link' );
  s.setAttribute( 'rel','stylesheet');
  s.setAttribute( 'href', src );
  //s.onload=callback;
  //document.body.appendChild( s );
  document.getElementsByTagName("head")[0].appendChild(s)
}
// #####################################################################


// #####################################################################
function addScript( src,callback) {
  var s = document.createElement( 'script' );
  s.setAttribute( 'src', src );
  s.onload=callback;
  document.body.appendChild( s );
}
// #####################################################################

// #####################################################################
function loadScripts(array,callback){
    var loader = function(src,handler){
        var script = document.createElement("script");
        script.src = src;
        script.onload = script.onreadystatechange = function(){
        script.onreadystatechange = script.onload = null;
        	handler();
        }
        var head = document.getElementsByTagName("head")[0];
        (head || document.body).appendChild( script );
    };
    (function(){
        if(array.length!=0){
        	loader(array.shift(),arguments.callee);
        }else{
        	callback && callback();
        }
    })();
}
// #####################################################################



// #####################################################################
function refreshPage(){
	window.location.reload();
}
// #####################################################################

// #####################################################################
function hideSlideshow(){
	var slideOpacity = document.getElementById("slideshow").style.opacity;
	if(slideOpacity <= 0){document.getElementById("slideshow").style.opacity=1;}else{document.getElementById("slideshow").style.opacity=0;}
}
// #####################################################################

// #####################################################################
function clearQR(){
		var element = document.getElementById("qrcode");
		element.outerHTML = "";
		delete element;
		setTimeout(function(){animateBackground();},background_image_hold);
}
// #####################################################################



function hasClass(el, name) {
   return new RegExp('(\\s|^)'+name+'(\\s|$)').test(el.className);
}
function addClass(el, name)
{
   if (!hasClass(el, name)) { el.className += (el.className ? ' ' : '') +name; }
}
function removeClass(el, name)
{
   if (hasClass(el, name)) {
      el.className=el.className.replace(new RegExp('(\\s|^)'+name+'(\\s|$)'),' ').replace(/^\s+|\s+$/g, '');
   }
}

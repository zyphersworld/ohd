// O.H.D REMOTE CONTROL PAGE
// Author: Chris Greene
// Copyright 2016 All Rights Reserved


// SLEEP LOCK
// #############################################################################
    var noSleep = new NoSleep();
    var wakeLockEnabled = false;
    //~ var toggleEl = document.querySelector("#dontSleep");
    //~ toggleEl.addEventListener('click', function() {
      //~ if (!wakeLockEnabled) {
        //~ noSleep.enable(); // keep the screen on!
        //~ wakeLockEnabled = true;
        //~ toggleEl.value = "Wake Lock Enabled";
        //~ toggleEl.style.backgroundColor = "#afa";
        //~ toggleEl.style.color = "#040";
      //~ } else {
        //~ noSleep.disable(); // let the screen turn off.
        //~ wakeLockEnabled = false;
        //~ toggleEl.value = "Wake Lock Disabled";
        //~ toggleEl.style.backgroundColor = "#888";
         //~ toggleEl.style.color = "#000";
      //~ }
    //~ }, false);
// #############################################################################
	// Get the modal
	var modal = document.getElementById('myModal');
	// Get the <span> element that closes the modal
	var span = document.getElementsByClassName("close")[0];
	// When the user clicks on <span> (x), close the modal
	span.onclick = function() {
		$(modal).fadeToggle(400);
		
		
	}
	// When the user clicks anywhere outside of the modal, close it
	window.onclick = function(event) {
		if (event.target == modal) {
			$(modal).fadeToggle(400);
			
			
		}
	}

	var songs;
	var currentSong = 0;
	var currentPart = 0;
	var playingVid=false;

	var activePartHistory;

	//var socket = io.connect('http://10.0.0.11:8090');
	//var socket = io.connect('http://192.168.0.129:8090',{'forceNew':true});
	// ** TESTING SOMETHING HERE ** //
	// forceNew is not explicitly set
	var socket = io.connect('http://192.168.0.129:8090');

	// Load Service
	loadService(getDayOfWeek());


	function getDayOfWeek(){
		//var d = new Date("09 Feb 2016");// a wednesday
		//var d = new Date("14 Feb 2016");// a sunday
		var d = new Date();
		var n = d.getDay();
		return ["sunday","wednesday","wednesday","wednesday","sunday","sunday","sunday"][n];
	}

	//SONG DATA	IN JSON FORMAT
	function loadService(service){
		loadAJAX('scandir3.php?dir=' + service + '&ts=NEW' + Date.now(), function(xhr){songs = JSON.parse(xhr.responseText);init();});
	}


	function loadAJAX(url,callback) {
        var xhr;

        if(typeof XMLHttpRequest !== 'undefined') xhr = new XMLHttpRequest();
        else {
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
            if(xhr.readyState < 4) {
                return;
            }

            if(xhr.status !== 200) {
                return;
            }

            // all is well
            if(xhr.readyState === 4) {
                callback(xhr);

            }
        }

        xhr.open('GET', url, true);
        xhr.send('');
}



  socket.on('connected', function (data) {
    socket.emit('clearQR');
  });


  function toggleText(){
	// TODO TOGGLE BUTTON COLOR TO SHOW STATE
	  socket.emit("toggleText");
  }

  function blank(){
		socket.emit("blank");
  }

  function song(id){
	  console.log("LOADING SONG: " + id);
	  currentSong = id;
	  socket.emit('updateSong',{song:id,part:part});
  }

  function part(id,part){
	  //song(id);
	  //console.log("LOADING PART: " + part + " of song " + currentSong);
	  socket.emit('updatePart',{song:id,part:part});
  }


	function init(){
	  var songsLength = songs.length;

	  for(var i=0; i < songsLength;i++){

			var songDiv = document.createElement("div");
			songDiv.className = "song";
			document.getElementById("parts").appendChild(songDiv);
			currentSong = i;
			var partsLength = songs[i].length;

			for(var a=0; a < partsLength;a++){
				currentPart = a;
				if(currentPart < 1){

					var title = document.createElement("div");
					title.className = "songTitle";
					title.setAttribute("data-song",currentSong);
					title.setAttribute("data-part",currentPart);
					title.innerHTML = songs[currentSong][currentPart];
					songDiv.appendChild(title);
				}
				else{
					var songPart = document.createElement("div");
					songPart.className="songPart";
					songPart.setAttribute("data-song", currentSong);
					songPart.setAttribute("data-part", currentPart);
					songPart.innerHTML = songs[currentSong][currentPart];
					songDiv.appendChild(songPart);
				}
			}

			document.getElementById("parts").appendChild(songDiv);

	}

	// ### EVENT LISTENERS #####################################################

	// SONG PART
	$(document).on("click touchend",".songPart",function(e){
		var s = $(this).attr("data-song");
		var p = $(this).attr("data-part");
		part(s,p);
		//part(currentSong,currentPart);
		activePart( $(this) );
		$(this).addClass("active");
		console.log("song: " + s + " || " + "part: " + p);

	});

	// TITLE
	$(document).on("click touchstart",".songTitle",function(e){
		var s = $(this).attr("data-song");
		var p = $(this).attr("data-part");
		part(s,p);
	});

	// Video Select
	$(document).on("click",".vidSelection",function(e){
		var id = $(this).attr("data-id");
		playVideo(id);
	});

	// Slide Select
	$(document).on("click",".slideSelection",function(e){
		var id = $(this).attr("data-id");
		toggleSlideshow(id);
	});

	$(document).on("click touchstart",".maincontrols",function(e){
		e.preventDefault();
		var button = $(this).attr("id");

		switch (button) {

			case "dontSleep":
			  if (!wakeLockEnabled) {
				noSleep.enable(); // keep the screen on!
				wakeLockEnabled = true;
				//$(this).value = "Wake Lock Enabled";
				$(this).addClass('activeButton');
				//$(this).css({backgroundColor : "#cec",color:"#040"});
				//$(this).style.color = "#040";
			  } else {
					noSleep.disable(); // let the screen turn off.
					wakeLockEnabled = false;
					//$(this).value = "Wake Lock Disabled";
					$(this).removeClass('activeButton');
					//$(this).css({backgroundColor : "#aaa",color:"#000"});
				}

			break;

			case "textFadeButton":
				toggleText();
				$(this).toggleClass('activeButton');
				break;

			case "screenFadeButton":
				blank();
				$(this).toggleClass('activeButton');
				break;

			case "videoPlayButton":
				//playVideo();
				//$(this).toggleClass('activeButton');
				
				//$(modal).removeClass("hideModal");
				//$(modal).addClass("showModal");
				$(modal).fadeToggle(400);
				modalText = document.getElementById("modalMessage");
				var text = '<a href="#" class="vidSelection" data-id="3">30 second Countdown</a><br />';
				text += '<a href="#" class="vidSelection" data-id="4">Crusade</a><br />';
				text += '<a href="#" class="vidSelection" data-id="5">Crusade</a><br />';
				//text += '<a href="#" class="vidSelection" data-id="2">Hallelujah</a><br />';
				modalText.innerHTML = text;				
				break;

			case "timerButton":
				sermonTimer();
				$(this).toggleClass('activeButton');
				break;
				
			case "slidesButton":
				//toggleSlideshow();
				//$(this).toggleClass('activeButton');
				$(modal).fadeToggle(400);
				modalText = document.getElementById("modalMessage");
				var text = '<a href="#" class="slideSelection" data-id="1">Default</a><br />';
				text += '<a href="#" class="slideSelection" data-id="2">Special</a><br />';
				//text += '<a href="#" class="slideSelection" data-id="3">After Service</a><br />';
				modalText.innerHTML = text;	
				break;

			case "scriptureButton":
				void(0);
				//$(this).toggleClass('activeButton');
				break;

			case "customMessageButton":
				void(0);
				//$(this).toggleClass('activeButton');
				break;

			case "loadServiceButton":
				void(0);
				//$(this).toggleClass('activeButton');
				break;
				
			case "refreshPageButton":
				socket.emit("refreshPage");
				break;	
			
			case "refreshControlPageButton":
				location.reload(true);
				break;

		  default:
				break;
		}
	});


} // END init();

// PLAY VIDEO ##################################################################
	function playVideo(id){
		if(!playingVid){
			//var e = document.getElementById("vidSelection");
			//var vidId = e.options[e.selectedIndex].value;
			var vidId = id;
			//var vidId = 9;
			socket.emit('playVideo',{'vidId':vidId});
			playingVid=true;
		}else{
			stopVideo();
			playingVid=false;
		}
	}

// STOP VIDEO ##################################################################
	function stopVideo(){
		socket.emit('stopVideo',{});
	}

// SET ACTIVE PART ##################################################################
	function activePart(e){
		if(activePartHistory){
			$(activePartHistory).removeClass("active");
		}
		activePartHistory = e;
	}
// TIMER ##################################################################
	function sermonTimer(){
		socket.emit('sermonTimer');
	}


// Slides ##################################################################
	function toggleSlideshow(id){
		//var e = document.getElementById("slideSelection");
		//var slideId = e.options[e.selectedIndex].value;
		
		var slideId = id;
		socket.emit('slideshow',parseInt(slideId));
		console.log("slideshow toggle: " + slideId);
	}



//~ // Get the modal
//~ var modal = document.getElementById('myModal');

//~ // Get the button that opens the modal
//~ var btn = document.getElementById("videoPlayButton");

//~ // Get the <span> element that closes the modal
//~ var span = document.getElementsByClassName("close")[0];

//~ // When the user clicks on the button, open the modal 
//~ btn.onclick = function() {
    //~ modal.style.display = "block";
//~ }

//~ // When the user clicks on <span> (x), close the modal
//~ span.onclick = function() {
    //~ modal.style.display = "none";
//~ }

//~ // When the user clicks anywhere outside of the modal, close it
//~ window.onclick = function(event) {
    //~ if (event.target == modal) {
        //~ modal.style.display = "none";
    //~ }
//~ }

// HELPER FUNCTIONS ##################################################################


	//~ function hasClass(el, name) {
	   //~ return new RegExp('(\\s|^)'+name+'(\\s|$)').test(el.className);
	//~ }
	//~ function addClass(el, name)
	//~ {
	   //~ if (!hasClass(el, name)) { el.className += (el.className ? ' ' : '') +name; }
	//~ }
	//~ function removeClass(el, name)
	//~ {
	   //~ if (hasClass(el, name)) {
		  //~ el.className=el.className.replace(new RegExp('(\\s|^)'+name+'(\\s|$)'),' ').replace(/^\s+|\s+$/g, '');
	   //~ }
	//~ }

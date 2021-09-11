	//var socket = io.connect('http://10.0.0.11:8090');
	var socket = io.connect('http://192.168.0.129:8090');
	//var socket = io.connect('http://localhost:8090');

	socket.on('connected', function (data) {
		console.log(data);
	    //socket.emit('my other event', { my: 'data' });
	});

	socket.on('updateSong', function (data) {
		loadSong(data["song"]);
	});

	socket.on('updatePart', function (data) {
		loadSong(data["song"]);
		loadPart(data["part"]);
	});

	socket.on('clearQR', function(data) {
		//document.getElementById("qrcode").innerHTML="boo";
		clearQR();
		console.log("clear QR");
	});

	socket.on('toggleText', function(data) {
		toggleText();
	});

	socket.on('toggleBackground', function(data) {
		toggleBackground();
	});

	socket.on('playVideo', function(data){
		addVideo(data['vidId']);
	});

	socket.on('stopVideo', function(data){
		stopVideo();
	});

	socket.on('startSermonTimer', function(data){
		startSermonTimer();
	});
	
	socket.on('toggleSlideshow', function(data){
		toggleSlideshow(data["id"]);
		console.log(data["id"]);
	});
	
	socket.on('hideSlideshow', function(data){
		hideSlideshow();
		
	});
	
	socket.on("refreshPage", function(){
		refreshPage();
	});

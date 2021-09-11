<!doctype html>
<!--[if lt IE 7 ]> <html class="ie ie6 ie-lt10 ie-lt9 ie-lt8 ie-lt7 no-js" lang="en"> <![endif]-->
<!--[if IE 7 ]>    <html class="ie ie7 ie-lt10 ie-lt9 ie-lt8 no-js" lang="en"> <![endif]-->
<!--[if IE 8 ]>    <html class="ie ie8 ie-lt10 ie-lt9 no-js" lang="en"> <![endif]-->
<!--[if IE 9 ]>    <html class="ie ie9 ie-lt10 no-js" lang="en"> <![endif]-->
<!--[if gt IE 9]><!--><html class="no-js" lang="en"><!--<![endif]-->
<!-- the "no-js" class is for Modernizr. -->
<head>
	<title>SLIDE CONTROL</title>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<script src="jquery-2.2.0.min.js"></script>
	<script src="socket.io.min.js"></script>
	<script src="clicker.js"></script>
<!--
	<script src="Sortable.min.js"></script>
-->
	<style>
        #thumbnails{
            width:80%;
			margin:0px auto;
			text-align:center;
        }

        #thumbnails img{
			display:inline-block;
            width:200px;
            margin:0px 10px;
            padding:8px;
            border:solid 2px black;
            border-radius: 15px;
            float:left;
        }
        
        p{
			text-align:left;
			width:100px;
			display:inline-block;
			float:left;
			font-size:1em;
			font-family:sans;
			padding:5px;
		}
		
		.thumbnail-container{
			
			display:inline-block;
			margin: 10px 5px 10px 5px;
			background:#cccccc;
			vertical-align:top;
		}
		
		#thumbnails-container{
			text-align:left;
			
		}
	</style>
</head>

<body>
<div class="wrapper"><!-- not needed? up to you: http://camendesign.com/code/developpeurs_sans_frontieres -->
<h1>Slideshow Control</h1>
<button id="resumeAuto">Auto</button>
<button id="hideSlideshow">Hide Slideshow</button>
<div id="thumbnails">
	<div id="thumbnails-container">
<?php
$directory = '/opt/lampp/htdocs/ohd3/img/slides/';
$directory_notes = '/opt/lampp/htdocs/ohd3/slideuploader/notes/';
$images = array_diff(scandir($directory), array('..', '.'));
$notes = array_diff(scandir($directory_notes), array('..', '.'));
// THIS SORTS FILENAMES NATURALLY SO WE DONT END UP WITH 0,10,11,1,20,2
natsort($images);
// NEEDED TO RE-INDEX ARRAY BECAUSE natsort() KEEPS THE KEY VALUES
$images = array_values($images);
foreach($images as $key => $value){
	if(!file_exists($directory_notes . $value . ".txt")){$note = "";}else{
		$note = file_get_contents($directory_notes . $value . ".txt");
	}
	echo "<div class='thumbnail-container'><p>$note</p><img class='thumbnail' data-id='$key' src='img/slides/" . $value . "' /></div>";
}
?>
<script>
	//var socket = io.connect('http://10.0.0.11:8099');
	var socket = io.connect('http://192.168.0.129:8099');
	var socket2 = io.connect('http://192.168.0.129:8090');
	//var socket = io.connect('http://localhost:8090');

	socket.on('connected', function (data) {
		console.log(data);
	    //socket.emit('my other event', { my: 'data' });
	});
	
	
$(document).on("click touchstart",".thumbnail",function(e){
		var s = $(this).attr("data-id");
		socket.emit("loadSlide",{"slide":s});

	});

$(document).on("click","#resumeAuto",function(e){
		socket.emit("toggleAuto",{});

	});

$(document).on("click","#hideSlideshow",function(e){
		socket2.emit("hideSlideshow",{});

	});	



</script>
</div>
</div>
</div>

</body>
</html>

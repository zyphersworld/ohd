<?
header('Content-Type: text/plain; charset=utf-8');
require("Encoding.php");
$day = $_GET["dir"];

getSongs($day);

function getSongs($dir){
//$root = $_SERVER["DOCUMENT_ROOT"] . "/overheads/";
$dir = $_SERVER["DOCUMENT_ROOT"] . "/overheads/" . $dir;
$files = scandir($dir);
asort($files);
$songArray;
$serviceArray = Array();


foreach($files as $song){
	if($song != "." && $song != ".."){
		$text = file_get_contents("$dir/$song",FILE_TEXT);
		$songArray[$song]=formatSong($text);
	}
}

foreach($songArray as $key => $value){
	$data = trim(preg_replace('/[\t\n\r]+/', '', $value));

	// CLEAN UP EXTRA SPACE AT END OF ARRAY ENTRIES
	//array_push($serviceArray,explode("<split>",$data)); // this leaves an extra space in last result ???
	array_push($serviceArray,array_map('trim', explode('<split>', $data)));

}

$result = json_encode(array_slice($serviceArray,0), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
echo $result;

//~ WRITE JSON FILE
//if(	file_put_contents($_SERVER["DOCUMENT_ROOT"] . "/overheads/" . $_GET['dir'] . ".json",$result)){echo "file written";}else{echo "no good";};
//if(	file_put_contents($_SERVER["DOCUMENT_ROOT"] . "/json/" . $_GET['dir'] . ".json",$result)){echo "file written";}else{echo "no good";};
}

// FORMAT STRING FUNCTION ######################################################
function formatSong($songData){



	// !!! GARBLES CHINESE CHARS !!!!  - TODO INVESTIGATE// UTF-8?? UNICODE?? 2-byte chars??
	// CONVERT LINE ENDINGS TO UNIFORM /n
	//$songData = preg_replace("/\r\n|\n|\x0b|\f|\r|\x85|\x2028|\x2029/","\n",$songData);

	// REMOVES EMPTY LAST LINES
	$songData = trim($songData);

	// Unicode Character 'HORIZONTAL ELLIPSIS' (U+2026)
	//$songData = preg_replace("/x2026/",". . .",$songData);

	// GET RID OF STUPID CARIAGE RETURNS
	$songData = preg_replace("/\r/","",$songData);

	// REMOVE EMPTY LINES
	$songData = preg_replace("/\n\n+/","<br><br>",$songData);

	// REPLACE LINE FEEDS WITH A "<BR>" TAG
	$songData = preg_replace("/\n/","<br>",$songData);

	//GET RID OF Verse,Chorus,Bridge,Tag,pre-chorus etc ...
	$songData = preg_replace("/(\()?(pre)?(-)?(\s)?((chorus)|(verse)|(bridge))(\s)?(\d)?(:)?(\))?(\s)?(\d)?(\s)?(:)?(\))?(\s)?/i","",$songData);
	$songData = preg_replace("/\d<br>/","<br><br>",$songData);
	$songData = preg_replace("/<br>(\s)?<br>(\s)?<br>/","<br><br>",$songData);

	// REPLACE DOUBLE <BR>'s WITH <SPLIT>
	$songData = preg_replace("/<br>(\s)?<br>/","<split>",$songData);

	// CLEAN UP EXTRA SPACE
	$songData = trim(preg_replace('/[\t\n\r\s]+/', ' ', $songData));

	$songData = Encoding::toUTF8($songData);
	$songData = rtrim($songData);

	return $songData;
}

?>

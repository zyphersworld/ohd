//~ $( document ).ready(function() {
//~
	//~ $(document).on("touchstart",".songPart",function(e){
		//~ if ($(this).data('clicked_once')) {
			//~ // element has been tapped (hovered), reset 'clicked_once' data flag and return true
			//~ $(this).data('clicked_once', false);
			//~ return true;
		//~ } else {
			//~ // element has not been tapped (hovered) yet, set 'clicked_once' data flag to true
			//~ e.preventDefault();
			//~ //$(this).trigger("mouseenter"); //optional: trigger the hover state, as preventDefault(); breaks this.
			//~ $(this).data('clicked_once', true);
		//~ }
//~
		//~ part(currentSong,currentPart);
		//~ activePart($(this));
//~
	//~ });
//~
	//~ $(document).on("click",".songPart",function(e){
		//~ part(currentSong,currentPart);
		//~ activePart( $(this) );
		//~ $(this).addClass("active");
		//~ console.log("CLICKED");
//~
	//~ });
//~
//~ });
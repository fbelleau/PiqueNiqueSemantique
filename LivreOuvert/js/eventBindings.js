/* eventBindings.js */

//Fonction qui est callee une seule fois dans $document.ready() function et qui bind les events sur les bons objets

function eventBindings(){
	// Event swipe pour le searchbar 
	$("#header").bind( "swipedown", function() {
		$('#searchMenu').toggle();
	});
	$("#header").bind( "swipeup", function() {
		$('#searchMenu').toggle();
	});
	
	//TypeAhead triggered when typing in the searchbar
	$("#sBar").on("keyup", function() {
		var $ul = $('#typeAhead');
		// $input = $( data.input ),
		value = $( this ).val();
		
		html = "";
		$ul.html( "" );
		if ( value && value.length > 3 ) {
			$ul.html( "<li><div class='ui-loader'><span class='ui-icon ui-icon-loading'></span></div></li>" );
			$ul.listview( "refresh" );           
			// tAheadQuery("hex");
			tAheadQuery($('#sBar').val(),$("#dbPick input[type='radio']:checked").val());
		}         

	 });

	// Bind l'evenement de click sur les résultats du typeAhead
	$(document).on("click", ".typeAheadResult", function(){
		var label = $(this).text();
		endpoint = $("#dbPick input[type='radio']:checked").val();
		$('#sBar').val(label)
		idURI=$(this).attr("iri");
		describeContent($(this).attr("iri"),endpoint);
	});

	// Parents/childs Result click
	$(document).on("click", ".hasDescription", function(){
		$('#content').html("");
		oboFormat();
		oboDescribe($(this).attr("iri"));
	});

	// Fait afficher la barre de recherche en appuyant sur la loupe
	$('#searchButton').click( function(){
		$('#searchMenu').toggle();
	});

	// LeftPanel Radio Button Event change pincture
	$("input[type='radio']").bind( "change", function(event, ui) {
		var src = "img/"+this.value + ".png";
		$("#logoHead").attr("src", src);
		refreshPage();
		$('#searchMenu').show();
	});


        // // Trigger pour autocomplete
        //$("#sBar").click( function(){
        //  $('#content').html("");
        //  $('#content').append("<ul data-role=\"listview\" id=\"typeAhead\"></ul>");
        //  $('#typeAhead').listview();
        //  $('#footer').hide();
        //});


        //swipe  left and right to change current namespace (biodb)
        //
        // NEED an array to iterate on and come back at the beginnin for the right and left neighbour
        // Also need to replace selection in the left panel
        
        // // swipeleft
        // $("#header").bind( "swipeleft", function() {          
        //   $('#searchMenu').toggle();
        //   tAheadQuery($('#sBar').val(),"pdb");
        //   var src = "img/" + "pdb.png";
        //   $("#logoHead").attr("src", src);
        //   refreshPage();
        //   $('#searchMenu').show();
                    
        // });

        // // swiperight
        // $("#header").bind( "swiperight", function() {
        //   var src = "img/" + "uniprot.png";
        //   $("#logoHead").attr("src", src);
        //   refreshPage();
        //   $('#searchMenu').show();

        //   $('#searchMenu').toggle();
        // });


        // // Trigger pour autocomplete
        //$("#sBar").click( function(){
        //  $('#content').html("");
        //  $('#content').append("<ul data-role=\"listview\" id=\"typeAhead\"></ul>");
        //  $('#typeAhead').listview();
        //  $('#footer').hide();
        //});

      // //Toggle off search bar when scrolling not working
      // function toggleOffSearchbar(){
      //   $('#searchMenu').toggle();
      // };

}

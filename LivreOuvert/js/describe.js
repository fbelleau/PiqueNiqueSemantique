
function printObj(key, obj) {
	var content="";
	if (typeof(obj)=="string"){
		var objString="<p";
		if (key=="@id") {
			objString+=" iri=\""+obj+"\" class=\"idClickable\"";
		}
		objString+=" style=\"margin-left:15px\">"+capitalize(obj)+"</p>";
		return objString;
	}
	else {
		$.each(obj, function(key, value){
			content += printObj(key, value);
		});
		return content;
	}
}
function describe(id) {
	$.getJSON(encodeURI("http:rest.bio2rdf.org/describe/"+id+"/?callback=?"), function(data, textStatus){
			$("#content").append("<h1>"+data["rdfs:label"]+"</h1>");
			$.each(data, function(key, value) {
				if ( key[0] != "@" && key != "rdfs:label" && key !="dc:identifier") {
					$("#content").append("<hr></hr><h3>"+capitalize(key.replace("bouquin:",""))+"</h3>"+printObj(key, value));
				}
			});
		if (/auteur/g.test(data["@id"])==true) {
			$("#content").append("<div id=\"livres\" data-role=\"collapsibleset\" style=\"margin-left:5px\"></div>")
			$("#livres").collapsibleset();
			$("#livres").append("<div id=\"oeuvres\"data-role=\"collapsible\"><h3>Oeuvres</h3></div>");
			$.getJSON(encodeURI("http:rest.bio2rdf.org/auteurLivres/"+id+"/?callback=?"), function(data2, textStatus2){
				var collapsibleContent="";
				$.each(data2["@graph"], function(i, value){
					collapsibleContent+="<p class=\"idClickable\" iri=\""+value["@id"]+"\">"+value["rdfs:label"]+"</p>";
				});
				$("#oeuvres").append(collapsibleContent).trigger("create");
				$("#livres").collapsibleset("refresh");
				$("#livres").trigger("updatelayout");
				
				
			});
		}
	});
}
	

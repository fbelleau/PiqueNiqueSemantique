/* Describe and Generate Pages Information on Authors and Books */

// var domain="http://rest.bio2rdf.org/describe/";
//var domain="http://10.80.3.6:9000/describe/"


authorWikiQuery = [
"  select $img $abs",
"  where {",
// "      <http://dbpedia.org/resource/__kword__> <http://xmlns.com/foaf/0.1/depiction> $img ;",
"      <http://dbpedia.org/resource/__kword__> <http://dbpedia.org/ontology/thumbnail> $img ;",
"      <http://dbpedia.org/ontology/abstract> $abs .",
"      FILTER langMatches( lang($abs), \"fr\" ) ",
"  }"
].join("\n");



function auteurWiki(id){

  var resource = id.split(":");
  
  sparqlQuery = authorWikiQuery.replace("__kword__",resource[1]);

  sparqlURL = encodeURI("http://dbpedia.org/sparql?query="+sparqlQuery+"&callback=?&output=json")

  $.getJSON(sparqlURL,
	    function(data,textstatus){

	      $.each(data.results.bindings, function(i, binding){
                
                $("#extContent").append("<img src=\"" + binding.img.value + "\" style=\"display: block; margin: 0 auto; width:200px\"/>");
                $("#extContent").append("<p>" + binding.abs.value + "</p>");

	      });

	    });
  
}


function bouquinAmazon (id){
  
  var resource = id.split(":");
  var amazonURL = "http://10.80.3.6:9000/amazone/" + resource[1] + "/?callback=?";
  
  // $.getJSON(encodeURI(domain+"describe/"+id+"/?callback=?"), function(data, textStatus){
  $.getJSON(encodeURI(amazonURL), function(data,textstatus){

    $.each(data, function(key, val){
      // alert(val);  
      $("#extContent").append("<img src=\"" + val + "\" style=\"display: block; margin: 0 auto; width:200px\"/>");
    });
    
  });
   

}


function printObj(key, obj) {
  var content="";
  if (typeof(obj)=="string"){
    var objString="<p";
    if (key=="@id") {
      objString+=" iri=\""+obj+"\" class=\"idClickable\" style=\"color:blue;\"";
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

  var domain="http://10.80.3.6:9000/"
  // var domain="http://rest.bio2rdf.org/";

  $.getJSON(encodeURI(domain+"describe/"+id+"/?callback=?"), function(data, textStatus){
    $("#content").append("<h1>"+data["rdfs:label"]+"</h1>");
    $.each(data, function(key, value) {
      if ( key[0] != "@" && key != "rdfs:label" ){
      // if ( key[0] != "@" && key != "rdfs:label" && key !="dc:identifier") {
	$("#content").append("<hr></hr><h3>"+capitalize(key.replace("bouquin:",""))+"</h3>"+printObj(key, value));
      }
    });

    if (/auteur/g.test(data["@id"])==true) {
      $("#content").append("<div id=\"livres\" data-role=\"collapsibleset\" style=\"margin-left:5px\"></div>")
      $("#livres").collapsibleset();
      $("#livres").append("<div id=\"oeuvres\"data-role=\"collapsible\"><h3>Oeuvres</h3></div>");
      $.getJSON(encodeURI(domain+"auteurLivres/"+id+"/?callback=?"), function(data2, textStatus2){
	var collapsibleContent="";
	$.each(data2["@graph"], function(i, value){
	  collapsibleContent+="<p class=\"idClickable\" style=\"color:blue;\" iri=\""+value["@id"]+"\">"+value["rdfs:label"]+"</p>";
	});
	$("#oeuvres").append(collapsibleContent).trigger("create");
	$("#livres").collapsibleset("refresh");
	$("#livres").trigger("updatelayout");	
      });
      
      auteurWiki(id);            
    }else if (/isbn/g.test(data["@id"])==true){
    
      bouquinAmazon(id);
      // $("#extContent").append("<img src=\"" + binding.img.value + "\" style=\"display: block; margin: 0 auto;\"/>");
    }
    

  });


}




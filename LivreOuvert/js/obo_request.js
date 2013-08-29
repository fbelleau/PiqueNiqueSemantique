/* go_request.js */

// Format la div content de index.html pour le describe de GO
function oboFormat(){
  $('#content').append("<div id=\"label\"></div>");
  $('#content').append("<hr></hr>");
  $('#content').append("<h4 id=\"comments\"></h4>");
  $('#content').append("<hr></hr>");
  $('#content').append("<div id=\"properties\" data-role=\"collapsible-set\"></div>");
  $('#properties').collapsibleset();
}

function oboRequest(query) {
  var endpoint = "http://obo.bio2rdf.org/sparql?query=";
  var format = "&callback=?&output=json";
  var urlString = endpoint+query+format;
  var encodedURL = encodeURI(urlString);
  var sparqlURL = encodedURL.replace(/#/g,"%23"); // EncodeURI does not encode HASH #
  return sparqlURL;
}

function oboDescribe(itemID) {
  var $label = $('#label');
  var $comments = $('#comments');

  var querySparql = [
    "construct{",
    "?s <http:\/\/www.w3.org\/1999\/02\/22-rdf-syntax-ns#type> ?type .",
    "?s <http:\/\/www.w3.org\/2000\/01\/rdf-schema#label> ?label .",
    "?s <http:\/\/www.w3.org\/2000\/01\/rdf-schema#comments> ?hasDefinition  .",
    "}",
    "where {",
    "?s <http:\/\/www.w3.org\/1999\/02\/22-rdf-syntax-ns#type> ?type .",
    "?s <http:\/\/www.w3.org\/2000/01\/rdf-schema#label> ?label .",
    "?s <http://purl.obolibrary.org/obo/IAO_0000115> ?hasDefinition .",
    // "?s2 <http:\/\/www.w3.org\/2000\/01\/rdf-schema#label> ?hasDefinition .",
    "filter (?s = <_kWoRd_>)}"].join("\n").replace(/_kWoRd_/g,itemID);
  var sparqlURL = oboRequest(querySparql);
  $.getJSON(sparqlURL,
	    function(data,textstatus){
	      $.each( data.results.bindings, function(i, binding){
		switch (binding.p.value) {
		case "http://www.w3.org/2000/01/rdf-schema#label":
		  $label.html("<h2>"+capitalize(binding.o.value)+"</h2>");
		  break;
		case "http://www.w3.org/2000/01/rdf-schema#comments":
		  $comments.text(binding.o.value);
		  break;
		}
		//if ( binding.p.value == "http://www.w3.org/2000/01/rdf-schema#label") {
	      });
	      //$label.html("<h2>"+data.results.bindings[0].o.value+"</h2>");
	      //$comments.text(data.results.bindings[1].o.value);
	    });
  oboChilds(itemID);
  oboParents(itemID);
  oboXrefs(itemID);
  oboSynonyms(itemID);
}


function oboParents(itemID) {
  
  var propertiesHtml = "<div id=\"parents\" data-role=\"collapsible\"><h3>Parents</h3>";
  var querySparql = [
    "construct {",
    "?s2 rdfs:label ?label .",
    "}",
    "where {",
    "?s1 <http:\/\/www.w3.org\/2000\/01\/rdf-schema#subClassOf> ?s2 .",
    "?s2 rdfs:label ?label.",
    "filter (?s1 = <"+ itemID +">) .}"].join("\n").replace(/_kWoRd_/g,itemID);

  var sparqlURL = oboRequest(querySparql);
  $.getJSON(sparqlURL,
	    function(data,textstatus){
	      $.each(data.results.bindings, function(i,binds) {
		propertiesHtml += "<p class=\"hasDescription\" iri=\""+ binds.s.value +"\">"+capitalize(binds.o.value)+"</p>";
	      });
	      propertiesHtml += "</div>";
	      $('#properties').append(propertiesHtml);
	      $('#parents').collapsible();
	      $('#properties').collapsibleset("refresh");
	      $('#properties').trigger("updatelayout");
	    });
}

function oboChilds(itemID) {
  var propertiesHtml = "<div id=\"childs\" data-role=\"collapsible\"><h3>Childs</h3>";
  var querySparql = [
    "construct {",
    "?s1 rdfs:label ?label .",
    "}",
    "where {",
    "?s1 <http:\/\/www.w3.org\/2000\/01\/rdf-schema#subClassOf> ?s2 .",
    "?s1 rdfs:label ?label .",
    "filter (?s2 = <"+ itemID +">) .}"].join("\n").replace(/_kWoRd_/g,itemID);
  var sparqlURL = oboRequest(querySparql);
  $.getJSON(sparqlURL,
	    function(data,textstatus){
	      $.each(data.results.bindings, function(i,binds) {
		propertiesHtml += "<p class=\"hasDescription\" iri=\""+ binds.s.value +"\">"+capitalize(binds.o.value)+"</p>";
	      });
	      propertiesHtml += "</div>";
	      $('#properties').append(propertiesHtml);
	      $('#childs').collapsible();
	      $('#properties').collapsibleset("refresh");
	      $('#properties').trigger("updatelayout");
	    });

}

function oboXrefs(itemID) {

  var propertiesHtml = "<div id=\"xRefs\" data-role=\"collapsible\"><h3>xRefs</h3>";
  var querySparql = [
    "construct {",
    "?s <http:\/\/www.geneontology.org\/formats\/oboInOwl#hasDbXref> ?hasDbXref .",
    "}",
    "where {",
    "?s <http:\/\/www.geneontology.org\/formats\/oboInOwl#hasDbXref> ?s2 .",
    "?s2 <http:\/\/www.w3.org\/2000\/01\/rdf-schema#label> ?hasDbXref .",
    "filter (?s = <_kWoRd_>)}"].join("\n").replace(/_kWoRd_/g,itemID);
  var sparqlURL = oboRequest(querySparql);
  $.getJSON(sparqlURL,
	    function(data,textstatus){
	      $.each(data.results.bindings, function(i,binds) {
		propertiesHtml += "<p>"+capitalize(binds.o.value)+"</p>";
	      });
	      propertiesHtml += "</div>";
	      $('#properties').append(propertiesHtml);
	      $('#xRefs').collapsible();
	      $('#properties').collapsibleset("refresh");
	      $('#properties').trigger("updatelayout");
	    });

}

function oboSynonyms(itemID) {
  var propertiesHtml = "<div id=\"synonyms\" data-role=\"collapsible\"><h3>Synonyms</h3>";
  var querySparql = [
    "construct {",
    "?s ?p ?o .",
    "}",
    "where {",
    "?s ?p ?s2 .",
    "?s2 <http:\/\/www.w3.org\/2000\/01\/rdf-schema#label> ?o .",
    "filter (?s = <_kWoRd_>)",
    "filter ((?p = <http:\/\/www.geneontology.org\/formats\/oboInOwl#hasExactSynonym>) ",
    "OR (?p = <http:\/\/www.geneontology.org\/formats\/oboInOwl#hasNarrowSynonym>)",
    "OR (?p = <http:\/\/www.geneontology.org\/formats\/oboInOwl#hasRelatedSynonym>)",
    ")}"].join("\n").replace(/_kWoRd_/g,itemID);

  var sparqlURL = oboRequest(querySparql);
  $.getJSON(sparqlURL,
	    function(data,textstatus){
	      $.each(data.results.bindings, function(i,binds) {
		propertiesHtml += "<p>"+capitalize(binds.o.value)+"</p>";
	      });
	      propertiesHtml += "</div>";
	      $('#properties').append(propertiesHtml);
	      $('#synonyms').collapsible();
	      $('#properties').collapsibleset("refresh");
	      $('#properties').trigger("updatelayout");
	    });

}

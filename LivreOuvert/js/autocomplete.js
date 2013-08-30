// /* autocomplete.js */
// // See this for ajax version (didn't work tough)
// // http://dailyjs.com/2010/11/26/linked-data-and-javascript/
// // but html table rendering was taken from it

function typeAheadContent(){
  refreshPage();
  $('#searchMenu').show(); 
  $('#content').append("<ul data-role=\"listview\" id=\"typeAhead\"></ul>");
  $('#typeAhead').listview();        
}


var typeAHeadGeneral = [
  "select ?s1 as ?c1, ?o1 as ?c2, ?sc, ?rank, ?g ", // 1
  "where { ",                     // 2
  "  { ",                         // 3
  "    { ",                       // 4
  "      select ?s1, ( ?sc * 3e-1 ) as ?sc, ?o1, ( sql:rnk_scale ( <LONG::IRI_RANK> ( ?s1 ) ) ) as ?rank, ?g ", // 5
  "      where {          ", // 5
  "            ?s1 ?s1textp ?o1 .", // 6
  "            ?o1 bif:contains '\"_kWoRd_*\"' option ( score ?sc ) .    ", // 7
  "      }",                      // 8
  "      order by desc ( ?sc * 3e-1 + sql:rnk_scale ( <LONG::IRI_RANK> ( ?s1 ) ) ) limit 100 offset 0 ", // 9
  "    }",                        // 10
  "  }",                          // 11
  "}"];                           // 12


// var indent = Array(9).join(' ');
// var pubmedFilter = indent.concat("?s2 <http://purl.org/dc/terms/abstract> ?s1");
// var chebiOboFilter = indent.concat("filter(regex(str(?s1), \"^http://purl.org/obo/owl/CHEBI\"))");
// var goOboFilter = indent.concat("filter(regex(str(?s1), \"^http://purl.org/obo/owl/GO\"))");
// // var chebiOboFilter2 = indent.concat("filter(!isBlank(?s1)");


function tAheadQuery(word, endpointName){


  typeAheadContent();
  word = word;

  var endpoint = "";
  // var endpoint = "http://pdb.bio2rdf.org/sparql?query=";

  var typeAHeadArray = typeAHeadGeneral.slice(0); //  typeAHeadPubmed.slice(0);

  switch(endpointName){
    
  case 'auteur':

    endpoint = "http://virtuoso-9.bio2rdf.org/sparql?query=";
    typeAHeadArray.splice(8,0,"filter(regex(str(?s1), \"auteur:\")) .");
    break;

  case 'titre':

    endpoint = "http://virtuoso-9.bio2rdf.org/sparql?query=";
    typeAHeadArray.splice(8,0,"filter(regex(str(?s1), \"isbn:\")) .");
    break;

  // case 'sujet':

  //   endpoint = "http://virtuoso-9.bio2rdf.org/sparql?query=";
  //   typeAHeadArray.splice(8,0,"filter(regex(str(?s1), \"^http://purl.obolibrary.org/obo/GO\")) .");
  //   break;
    

  default:
    // alert("No Avalaible Endpoint");
    break;

  }

  var queryTxt = typeAHeadArray.join("\n");
  queryTxt = queryTxt.replace(/_kWoRd_/g,word);
  
  console.log(queryTxt);
  console.log(endpoint);
  // alert(endpoint);

  // var format = "&callback=?&output=json"; // FOR UNIPROT
  var format = "&callback=?&format=json";
  
  var urlString = endpoint+queryTxt+format;

  var sparqlURL = encodeURI(urlString);
  sparqlURL = sparqlURL.replace(/\+/g,'%2B');
  // alert(sparqlURL);

  var $ul = $('#typeAhead');
  var html = "";
  $ul.html( "" );
 
  $.getJSON(sparqlURL, function(data,textstatus){
    $.each(data.results.bindings, function(i,row){
      // alert(row["c2"].value);
      if(typeof row["c2"]!='undefined'){
        // alert(row["c2"].value);
        // alert(row["c1"].value);
        html += "<li class=\"typeAheadResult\" iri=\"" + row["c1"].value + "\">" + capitalize(row["c2"].value)  + "</li>";
        // html += "<li class=\"typeAheadResult\">" + capitalize(row["c2"].value)  + "</li>";
        
      }
    });
    
    $ul.html( html );
    $ul.listview( "refresh" );
    $ul.trigger( "updatelayout");

  });

}

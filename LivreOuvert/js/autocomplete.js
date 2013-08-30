// /* autocomplete.js */
// // See this for ajax version (didn't work tough)
// // http://dailyjs.com/2010/11/26/linked-data-and-javascript/
// // but html table rendering was taken from it

//var domain="http://rest.bio2rdf.org/auto/";
//var domain="http://10.80.3.6:9000/auto/"

function typeAheadContent(){
  refreshPage();
  $('#searchMenu').show(); 
  $('#content').append("<ul data-role=\"listview\" id=\"typeAhead\"></ul>");
  $('#typeAhead').listview();        
}

function tAheadQuery(word, endpointName){

  // var domain="http://rest.bio2rdf.org/auto/";
  var domain="http://10.80.3.6:9000/auto/"
  
  typeAheadContent();

  var endpoint = "";

  switch(endpointName){
    
  case 'auteur':
    query = domain + "Auteur/" + word + "?callback=?";
    break;

  case 'titre':
    query = domain + "Livre/" + word + "?callback=?";
    break;
   

  default:
    // alert("No Avalaible Endpoint");
    break;

  }

 
  // console.log(query);

  sparqlURL = encodeURI(query);

  var $ul = $('#typeAhead');
  var html = "";
  $ul.html( "" );
 
  // $.getJSON(encodeURI(query), function(data,textstatus){
  $.getJSON(sparqlURL, function(data,textstatus){
    $.each(data.results.bindings, function(i,row){
      if(typeof row["o1"]!='undefined' && (row["o1"].value.indexOf("[Auteur]") != -1 || row["o1"].value.indexOf("[Livre]") != -1) ){
        html += "<li class=\"typeAheadResult\" iri=\"" + row["s1"].value + "\">" + capitalize(row["o1"].value)  + "</li>";        
      }
    });
    
    $ul.html( html );
    $ul.listview( "refresh" );
    $ul.trigger( "updatelayout");

  });

}




// var typeAHeadGeneral = [
//   "select ?s1 as ?c1, ?o1 as ?c2, ?sc, ?rank, ?g ", // 1
//   "where { ",                     // 2
//   "  { ",                         // 3
//   "    { ",                       // 4
//   "      select ?s1, ( ?sc * 3e-1 ) as ?sc, ?o1, ( sql:rnk_scale ( <LONG::IRI_RANK> ( ?s1 ) ) ) as ?rank, ?g ", // 5
//   "      where {          ", // 5
//   "            ?s1 ?s1textp ?o1 .", // 6
//   "            ?o1 bif:contains '\"_kWoRd_*\"' option ( score ?sc ) .    ", // 7
//   "      }",                      // 8
//   "      order by desc ( ?sc * 3e-1 + sql:rnk_scale ( <LONG::IRI_RANK> ( ?s1 ) ) ) limit 100 offset 0 ", // 9
//   "    }",                        // 10
//   "  }",                          // 11
//   "}"];                           // 12


// // var indent = Array(9).join(' ');
// // var pubmedFilter = indent.concat("?s2 <http://purl.org/dc/terms/abstract> ?s1");
// // var chebiOboFilter = indent.concat("filter(regex(str(?s1), \"^http://purl.org/obo/owl/CHEBI\"))");
// // var goOboFilter = indent.concat("filter(regex(str(?s1), \"^http://purl.org/obo/owl/GO\"))");
// // // var chebiOboFilter2 = indent.concat("filter(!isBlank(?s1)");

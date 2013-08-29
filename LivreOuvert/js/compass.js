// /* compass.js */

var simpleRequest = [
  "select ?s1 as ?c1, ?o1 as ?c2, ?sc, ?rank, ?g ", // 1
  "where { ",                     // 2
  "  { ",                         // 3
  "    { ",                       // 4
  "      select ?s1, ( ?sc * 3e-1 ) as ?sc, ?o1, ( sql:rnk_scale ( <LONG::IRI_RANK> ( ?s1 ) ) ) as ?rank, ?g ", // 5
  "      where {          ", // 5
  "            ?s1 ?s1textp ?o1 .", // 6
  "            ?o1 bif:contains '\"prot*\"' option ( score ?sc ) .    ", // 7
  "      }",                      // 8
  "      order by desc ( ?sc * 3e-1 + sql:rnk_scale ( <LONG::IRI_RANK> ( ?s1 ) ) ) limit 100 offset 0 ", // 9
  "    }",                        // 10
  "  }",                          // 11
  "}"];                           // 12



function launchSimpleRequest(){

  var queryTxt = simpleRequest.join("\n");
  var endpoint = "http://obo.bio2rdf.org/sparql"

  console.log(queryTxt);
  console.log(endpoint);

  var format = "&callback=?&format=json";
  
  var urlString = endpoint+queryTxt+format;

  var sparqlURL = encodeURI(urlString);
  sparqlURL = sparqlURL.replace(/\+/g,'%2B');

  // var $ul = $('#typeAhead');
  // var html = "";
  // $ul.html( "" );
 
  $.getJSON(sparqlURL, function(data,textstatus){
    $.each(data.results.bindings, function(i,row){

      if(typeof row["c2"]!='undefined'){

        alert(row["c2"].value);
        alert(row["c1"].value);

        // html += "<li class=\"typeAheadResult\" iri=\"" + row["c1"].value + "\">" + capitalize(row["c2"].value)  + "</li>";
        
      }      
    });
    
    // $ul.html( html );
    // $ul.listview( "refresh" );
    // $ul.trigger( "updatelayout");

  });

}


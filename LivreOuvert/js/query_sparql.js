// /* query-sparql.js */
// // See this for ajax version (didn't work tough)
// // http://dailyjs.com/2010/11/26/linked-data-and-javascript/
// // but html table rendering was taken from it


var typeAHeadGeneral = [
  "select ?s1 as ?c1, ?o1 as ?c2, ?sc, ?rank, ?g ", // 1
  "where { ",                     // 2
  "  { ",                         // 3
  "    { ",                       // 4
  "      select ?s1, ( ?sc * 3e-1 ) as ?sc, ?o1, ( sql:rnk_scale ( <LONG::IRI_RANK> ( ?s1 ) ) ) as ?rank, ?g ", // 5
  // "      where {         ?s1 a <http://bio2rdf.org/bio2rdf_vocabulary:type> .", // 5
  "      where {          ", // 5
  // "      where { ?s ?p0 ?s1    .     ", // 5
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



function tAheadQuery(word,endpointName){
  // alert(endpointName);
  
  word = word;

  var endpoint = "";
   // var endpoint = "http://pdb.bio2rdf.org/sparql?query=";

  var typeAHeadArray = typeAHeadGeneral.slice(0); //  typeAHeadPubmed.slice(0);

  switch(endpointName){

  case 'go':  
    endpoint = "http://obo.bio2rdf.org/sparql?query=";
    typeAHeadArray.splice(8,0,"filter(regex(str(?s1), \"^http://purl.org/obo/owl/GO\")) .");
    break;

  case 'do':  
    endpoint = "http://obo.bio2rdf.org/sparql?query=";
    // typeAHeadArray.splice(6,0,"?s1 a <http://doid.bio2rdf.org/resource> .");
    typeAHeadArray[0] = "select $s as $c1, $o1 as $c2, $sc, $rank";
    typeAHeadArray[4] =       "select $s, ( $sc * 3e-1 ) as $sc, $o1, ( sql:rnk_scale ( <LONG::IRI_RANK> ( $s1 ) ) ) as $rank";
    typeAHeadArray.splice(6,0,"$s1 owl:sameAs $s .");
    typeAHeadArray.splice(8,0,"filter(regex(str(?s1), \"^http://bio2rdf.org/doid\")). ");
    break;
    // http://purl.org/obo/owl/DOID#DOID_2841#


  case 'chebi':
    endpoint = "http://obo.bio2rdf.org/sparql?query=";
    typeAHeadArray.splice(8,0,"filter(regex(str(?s1), \"^http://purl.org/obo/owl/CHEBI\"))");
    // typeAHeadArray.splice(8,0,"filter(!isBlank(?s1)");
    break;
  // case 'pubmed':    
  //   endpoint = "http://quebec.pubmed.bio2rdf.org/sparql?query=";
  //   typeAHeadArray[0] = "select ?title as ?c2, ?s2 as ?c1, ( bif:search_excerpt ( bif:vector ( '_kWoRd_*' ) , ?o1 ) ), ?sc, ?rank, ?g ";
  //   typeAHeadArray[4] = "select ?title, ?s2, ( ?sc * 3e-1 ) as ?sc, ?o1, ( sql:rnk_scale ( <LONG::IRI_RANK> ( ?s1 ) ) ) as ?rank, ?g";
  //   // // typeAHeadArray.splice(9,0,"group by ?title");
  //   typeAHeadArray.splice(8,0,"?s2 <http://purl.org/dc/terms/title> ?title"); // pubmed database
  //   typeAHeadArray.splice(8,0,"?s2 <http://purl.org/dc/terms/abstract> ?s1 ."); // pubmed database
  //   break;
  // case 'pdb':
  //   endpoint = "http://pdb.bio2rdf.org/sparql?query=";
  //   // typeAHeadArray = typeAHeadPDB.slice(0);
  //   // typeAHeadArray.splice(8,0,pdbFilter);
  //   break;


  case 'bio2rdf':
    endpoint = "http://schema.bio2rdf.org/sparql?query=";

    // upFilterURI = "FILTER(regex(?s1, \"^http://purl.uniprot.org/core\")) .";
    upFilterTypeClass = "FILTER(regex(?o1, \":type\"))" ;
    typeAHeadArray.splice(8,0,upFilterTypeClass);    
    // typeAHeadArray = typeAheadPubmed.slice(0); //  typeAHeadPubmed.slice(0);

    break;

  case 'uniprot':
    endpoint = "http://schema.bio2rdf.org/sparql?query=";
    
    upFilterURI = "FILTER(regex(?s1, \"^http://purl.uniprot.org/core\")) .";
    upFilterTypeClass = "FILTER(regex(?o1, \"uniprot:type\"))" ;
    
    typeAHeadArray.splice(8,0,upFilterURI);
    typeAHeadArray.splice(8,0,upFilterTypeClass);

    break;

  case 'biopax':
    endpoint = "http://schema.bio2rdf.org/sparql?query=";

    upFilterURI = "FILTER(regex(?s1, \"^http://www.biopax.org/release/biopax-level3.owl\")) .";
    upFilterTypeClass = "FILTER(regex(?o1, \"biopax3:\"))" ;

    // Eventuellement :: sur le filter
    //     upFilterTypeClass = "FILTER(regex(?o1, \"::\"))" ;

    typeAHeadArray.splice(8,0,upFilterURI);
    typeAHeadArray.splice(8,0,upFilterTypeClass);

    break;

  case 'sio':
    endpoint = "http://schema.bio2rdf.org/sparql?query=";

    upFilterURI = "FILTER(regex(?s1, \"^http://semanticscience.org/resource/\")) .";
    upFilterTypeClass = "FILTER(regex(?o1, \"sio:\"))" ;

    typeAHeadArray.splice(8,0,upFilterURI);
    typeAHeadArray.splice(8,0,upFilterTypeClass);

    break;

  case 'sadi':
    endpoint = "http://schema.bio2rdf.org/sparql?query=";

    upFilterURI = "FILTER(regex(?s1, \"^http://sadi-service\")) .";
    upFilterTypeClass = "FILTER(regex(?o1, \"sadi:sadi\"))" ;

    typeAHeadArray.splice(8,0,upFilterURI);
    typeAHeadArray.splice(8,0,upFilterTypeClass);
    
    break;


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
           
  
  
// function tAheadQuery(word){

//   var endpoint = "http://obo.bio2rdf.org/sparql?query=";
  
//   var queryTxt = " \
// select ?s ?o \
// where { \
// ?s rdfs:label ?o .  \
// ?o bif:contains " + word + " \
// } \
// ";
//   alert(queryTxt);
//   // var format = "&callback=?&output=json"; // FOR UNIPROT
//   var format = "&callback=?&format=json";

//   var urlString = endpoint+queryTxt+format;
//   var sparqlURL = encodeURI("http://obo.bio2rdf.org/sparql?default-graph-uri=&query=select+%3Fs+%3Fp+%3Fo+where+%7B%3Fs+%3Fp+%3Fo+.+%3Fo+bif%3Acontains+%22HEX%22+.%7D&format=json&timeout=0&debug=on");

//   alert(urlString);

//   $.getJSON(sparqlURL, function(data,textstatus){
//     console.log(data);  
//     alert(data);
//   });
  

// }


// function fillInPage(){
//   var namespace="go";
//   var id="0004396";
//   sparqlURL = buildQueryDescribe(namespace,id);
  
// }


// function getSparql(kword) {

//   sparqlURL = buildQuery(kword); 

//   $.getJSON(sparqlURL,
//             function(data,textstatus){
//               console.log(data);
	      
//               var table = $("#cSet");

//               // get the sparql variables from the 'head' of the data.
//               var headerVars = data.head.vars; 

//               // using the vars, make some table headers and add them to the table;
//               //var trHeaders = getTableHeaders(headerVars);
//               //table.append(trHeaders);  

//               // grab the actual results from the data.                                          
//               var bindings = data.results.bindings;
	      
//               // for each result, make a table row and add it to the table.
//               for(rowIdx in bindings){
//                 table.append(getTableRow(headerVars, bindings[rowIdx]));
// 		$( "#cSet" ).collapsibleset( "refresh" );
		
//               } 
	      
//             });
  
// }

// function buildQueryDescribe(namespace,kword){

//   //var endpoint = "http://"+namespace+".bio2rdf.org/sparql?query=";
//   var queryTxt = "\
// select ?s1p as ?Entity count ( * ) as ?Count where \
// { \
// ?s1 ?s1textp ?o1 .\
// ?o1 bif:contains '" + kword + "' .\
// ?s1 ?s1p ?s1o .\
// }\
// group by ?s1p order by desc 2 limit 20 offset 0  \
// ";
//   var queryTxt = "\
// construct {\
// ?s <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> ?type .\
// ?s <http://www.w3.org/2000/01/rdf-schema#label> ?label .\
// ?s <http://www.w3.org/2000/01/rdf-schema#comments> ?hasDefinition  .\
// }\
// where {\
// ?s <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> ?type .\
// ?s <http://www.w3.org/2000/01/rdf-schema#label> ?label .\
// ?s <http://www.geneontology.org/formats/oboInOwl#hasDefinition> ?s2 .\
// ?s2 <http://www.w3.org/2000/01/rdf-schema#label> ?hasDefinition .\
// filter (?s = <http://purl.org/obo/owl/GO#GO_0004396>)
// } 
// "

// var format = "&callback=?&output=json"; // FOR UNIPROT
// var urlString = endpoint+queryTxt+format;
// var sparqlURL = encodeURI(urlString);

// return sparqlURL;
// }


// function buildQuery(kword){

//   var endpoint = "http://cu.pharmgkb.bio2rdf.org/sparql?query=";
//   var queryTxt = "\
// select ?s1p as ?Entity count ( * ) as ?Count where \
// { \
// ?s1 ?s1textp ?o1 .\
// ?o1 bif:contains '" + kword + "' .\
// ?s1 ?s1p ?s1o .\
// }\
// group by ?s1p order by desc 2 limit 20 offset 0  \
// ";
//   var format = "&callback=?&output=json"; // FOR UNIPROT
//   var urlString = endpoint+queryTxt+format;
//   var sparqlURL = encodeURI(urlString);

//   return sparqlURL;
// }


// function getTableHeaders(headerVars) { // NOT REQUIRED HERE
//   var trHeaders = $("<tr></tr>");
//   for(var i in headerVars) {
//     trHeaders.append( $("<th>" + headerVars[i] + "</th>") );
//   }
//   return trHeaders;
// }

// function getTableRow(headerVars, rowData) {
//   //var tr = $("<div data-role=collapsible></div>");
//   var tr = $("<div data-role=\"collapsible\"></div>")
//   for(var i in headerVars) {
//     tr.append(getTableCell(headerVars[i], rowData));
//   }
//   return tr;
// }

// function getTableCell(fieldName, rowData) {
//   var td = $("<h3></h3>");
//   var fieldData = rowData[fieldName];
//   td.html(fieldData["value"]);
//   return td;
// }





// ##################################
// Old way of doing it in the index.html 
// ##################################


        // Trigger pour autocomplete
        // $("#sBar").click( function(){
        //   $('#content').html("");
        //   $('#content').append("<ul data-role=\"listview\" id=typeAhead></ul>");
        //   $('#typeAhead').listview();
        //   $('#footer').hide();
        // });
        // $("#sBar").on("keyup", function() {
        //   var $ul = $('#typeAhead'),
        //   // $input = $( data.input ),
        //   value = $( this ).val(),
          
        //   html = "";
        //   $ul.html( "" );
         

        //   if ( value && value.length > 2 ) {
        //     $ul.html( "<li><div class='ui-loader'><span class='ui-icon ui-icon-loading'></span></div></li>" );
        //     $ul.listview( "refresh" );
            
        //     tAheadQuery("hexo", "go");
        //     // tAheadQuery($('#sBar').val(),$('#sBar').val());
            
        //   }
        // }

          // $.ajax({
          //   url: "http://jquery.bio2rdf.org/iriautocomplete",
          //   dataType: "jsonp",
          //   crossDomain: true,
          //   data: {
          //     lbl: $('#sBar').val(),
          //     // endpoint: $('#endpointSelect option:selected').val()
          //     endpoint: $("#dbPick input[type='radio']:checked").val()
          //   }
          // })
          //   .then( function ( response ) {
          //     $.each( response, function ( i, jSonObject ) {
          //       $.each (jSonObject, function (i, val){
          //         //Comme le service jquery retourne GO et GO via obo dans le même JSON
          //         // J'ai décider de parser seulement ceux via OBO, en accord avec CHEBI
          //         var iriFilter =/\/purl.org\/obo\/owl\//g;
          //         if (iriFilter.test(val.iri) == true) {
          //           html += "<li class=\"typeAheadResult\" iri=\"" + val.iri + "\">" + capitalize(val.lbl) + "</li>";
          //         }
          //       });
          //     });
          //     $ul.html( html );
          //     $ul.listview( "refresh" );
          //     $ul.trigger( "updatelayout");
          //   });

 

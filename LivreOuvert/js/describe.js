
function printObj(obj) {
	var content="";
	if (typeof(obj)=="string"){
		return obj+" ";
	}
	else {
	//if (obj instanceof Array) {
	//  $.each(obj, function(i, items) {
	//    var content +=printObj(items);
	//  });
	//  return content;
	//}
	//else {
		$.each(obj, function(key, value){
			content += printObj(value);
		});
		return content;
	}
}
function describe(uri) {
	$.getJSON(encodeURI(uri), function(data, status){
			//$("#isbn").text("ISBN: "+data["@id"]);
			//alert(data["@id"]);
			$("#book").append("<h1>"+data["rdfs:label"]+"</h1>");
			$("#book").append("<hr></hr>");
			//var uriList="<ul>";
			$.each(data, function(key, value) {
				if ( key != "@context" && key != "rdfs:label") {
					$("#book").append("<h3>"+key+": "+(printObj(value)+"</h3>"));
				//  if (typeof(value)=="object") {
				//    if (value instanceof Array) {
				//      $("#book").append("<h3>"+key+": </h3>")
				//      $.each(value, function(i, obj) {
				//        $("#book").append("<h3>    "+obj["@id"]+"</h3>");
				//      });
				//    }
				//    else {
				//      $.each(value, function(key2, val2) {
				//        $("#book").append("<h3>"+key+": "+val2+"</h3>");
				//      });
				//    }
				//  }
				//  else { //is a string
				//    $("#book").append("<h3>"+key+": "+value+"</h3>");
				//  }
				}
			});
			
	});
}

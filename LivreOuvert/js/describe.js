
function printObj(obj) {
	var content="";
	if (typeof(obj)=="string"){
		return "<p style=\"margin-left:15px\">"+obj+"</p>";
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
			//if (key=="@id") {
			content += printObj(value);
		});
		return content;
	}
}
function describe(uri) {
	$.getJSON(encodeURI(uri), function(data, status){
			//$("#isbn").text("ISBN: "+data["@id"]);
			//alert(data["@id"]);
			$("#content").append("<h1>"+data["rdfs:label"]+"</h1>");
			$("#content").append("<hr></hr>");
			//var uriList="<ul>";
			$.each(data, function(key, value) {
				if ( key != "@context" && key != "rdfs:label") {
					$("#content").append("<h3>"+key+"</h3>"+printObj(value));
				//  if (typeof(value)=="object") {
				//    if (value instanceof Array) {
				//      $("#content").append("<h3>"+key+": </h3>")
				//      $.each(value, function(i, obj) {
				//        $("#content").append("<h3>    "+obj["@id"]+"</h3>");
				//      });
				//    }
				//    else {
				//      $.each(value, function(key2, val2) {
				//        $("#content").append("<h3>"+key+": "+val2+"</h3>");
				//      });
				//    }
				//  }
				//  else { //is a string
				//    $("#content").append("<h3>"+key+": "+value+"</h3>");
				//  }
				}
			});
			
	});
}

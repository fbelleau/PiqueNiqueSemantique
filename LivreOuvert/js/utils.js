/* utils.js */
// Fonction utilitaire qui met la premiere lettre du mot en majuscule
function capitalize(s)
{
	return s[0].toUpperCase() + s.slice(1);
}
// Fonction qui cache la mise en page qui varie et qui supprime tout ce qui est dans content
function refreshPage() {
	$("#content").html("");
	$("#searchMenu").hide();
	$("#logo").hide(); // EVENTUELEMENT METTRE LE LOGO DU ENDPOINT
	$("#describeHeader").hide();
	$(".navigationButton").attr("disabled", false);
}

// Fait la mise en page pour le describe
function describeContent(id,endpoint){

	refreshPage();
	$("#describeHeader").show();
	$("#navigationButtons").show();
	oboFormat();
	oboDescribe(id);
	
//	switch(endpoint){
//	case 'bio2rdf':
//		bioDispatch(id);
//		break;
//	case 'go':
//		oboFormat();
//		oboDescribe(id);
//		break;
//	case 'do':
//		oboFormat();
//		oboDescribe(id);
//		break;
//	case 'chebi':
//		oboFormat();
//		oboDescribe(id);
//		break;
//	default: 
//		// alert("No Avalaible Endpoint");
//		break;
//	}
}

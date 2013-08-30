/* utils.js */
// Fonction utilitaire qui met la premiere lettre du mot en majuscule
function capitalize(s)
{
  return s[0].toUpperCase() + s.slice(1);
}
// Fonction qui cache la mise en page qui varie et qui supprime tout ce qui est dans content
function refreshPage() {
  $("#content").html("");
  // $("#searchMenu").hide();
  $("#logo").hide(); // EVENTUELEMENT METTRE LE LOGO DU ENDPOINT
  $("#describeHeader").hide();
  $(".navigationButton").attr("disabled", false);
}

// Fait la mise en page pour le describe
function describeContent(id,endpoint){

  refreshPage();
  $("#describeHeader").show();
  $("#navigationButtons").show();
  
	/*uri = "http://192.168.130.107:9000/describeAuteur/" + id + "/?callback=?"*/
	//uri = "http://192.168.130.107:9000/describe/" + id + "/?callback=?"

  describe(id);

}

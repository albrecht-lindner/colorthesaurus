String.prototype.contains = function(it) { return this.indexOf(it) != -1; };

function showResult(str){
	if (str.length==0){ 
		document.getElementById("searchresult").innerHTML="";
		document.getElementById("searchresult").style.border="0px";
		return;
	}
	
	str = str.toLowerCase();
	var search_output = "";
	var all_entries = colorDB().get();
//	console.warn(all_entries.length);
	for (i=1; i<all_entries.length; i++){
		var name = all_entries[i].name.toLowerCase();
//		console.warn(str + " in " + name + "?");
		if (name.contains(str)){
			var id = all_entries[i].id;
			var language = all_entries[i].id;
			var lid = id % 100;
			var lcode = languageDB({lid:lid}).first().lcode;
			var r = all_entries[i].srgbR;
			var g = all_entries[i].srgbG;
			var b = all_entries[i].srgbB;
			var textcolor = "black;"
			if (r+g+b < 3*127){
				textcolor = "white";
			}
			if (search_output == ""){
				search_output += "<div class = \"searchitem\" onClick=\"searchDone(" + id + ")\" style=\"background-color:"+ rgbToHex(r, g, b) +"; color:" + textcolor + "\">" + name + " (" + lcode + ")</div>";
			}
			else{
				search_output += "<div class = \"searchitem\" onClick=\"searchDone(" + id + ")\" style=\"background-color:"+ rgbToHex(r, g, b) +"; color:" + textcolor + "\">" + name + " (" + lcode + ")</div>";
			}
		}
	}
	
	if (search_output.length == 0){ 
		document.getElementById("searchresult").innerHTML="";
		document.getElementById("searchresult").style.border="0px";
	}
	else{
		document.getElementById("searchresult").innerHTML = search_output;
		document.getElementById("searchresult").style.border = "1px solid black";
//		console.warn(search_output);
	}
}

function searchDone(id){
	document.getElementById("searchfield").value = "";
	document.getElementById("searchresult").innerHTML = "";
	document.getElementById("searchresult").style.border = "none";
	displayColor(id);
}

function checkKey(keyEvent){
	if (keyEvent.which == 13){
		console.warn("enter in search field");
		return false;
	}
	if (keyEvent.which == 27){
		console.warn("clear search field");
		document.getElementById("searchfield").value = "";
		document.getElementById("searchresult").innerHTML = "";
		document.getElementById("searchresult").style.border = "none";
	}
}
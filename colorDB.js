// display color with the unique id ID
function displayColor(curr_ID){
//	if new color, add to history
	if (myhistory[myhistory.length-1] != curr_ID){
		myhistory[myhistory.length] = curr_ID;
	}
	
	var curr_color = colorDB({id:curr_ID});
	console.log(JSON.stringify(curr_color.get()));
	curr_srgbR = curr_color.first().srgbR;
	curr_srgbG = curr_color.first().srgbG;
	curr_srgbB = curr_color.first().srgbB;
	curr_labL  = curr_color.first().labL;
	curr_labA  = curr_color.first().labA;
	curr_labB  = curr_color.first().labB;
	curr_name = curr_color.first().name;
	curr_enname = curr_color.first().enname;
	curr_hex = rgbToHex(curr_srgbR, curr_srgbG, curr_srgbB);
	curr_lid = curr_ID % 100;
	curr_language = languageDB({lid:curr_lid}).first().language;
	
	if (curr_lid){
		last_lid = curr_lid;
	}
//	console.log(JSON.stringify(curr_language.get()));
	
//write color info
	displayColorInfo();
//	document.getElementById("col_patch").innerHTML = "<p style=\"background-color:rgb("+curr_srgbR+","+curr_srgbG+","+curr_srgbB+")\">"+curr_color.first().name+"</p>\n";	
	
//write info on neighboring colors of same language
	displayNeighboringColors();
	
//write info on similar colors of other languages
	displaySimilarColors()

//display history
	displayHistory()
	
//set document foreground color
	setFGColor();
	
//	update document color layout
	document.getElementById("colorinfo_div").style.backgroundColor = curr_hex;
	document.getElementById("neighborinfo_div").style.backgroundColor = curr_hex;
	document.getElementById("similarinfo_div").style.backgroundColor = curr_hex;
	document.getElementById("history_div").style.backgroundColor = curr_hex;
	
//	document.getElementById("searchfield").value = curr_name;
}

// find closest (dE) color to given RGB values and display it values
function displayColorRGB(r, g, b){
	console.log("rgb = " + r + " " + g + " " + b);
	var lab = sRGB2Lab(r, g, b);
	console.log("lab = " + lab);
	new_ID = closestColor(last_lid, lab[0], lab[1], lab[2]);
	displayColor(new_ID);
}

// display info on current color in top left swatch
function displayColorInfo(){
	str = "";
	str += "<tr><td class=\"rightalign\" name=\"separation\">Name</td><td class=\"leftalign\">" + curr_name + "</td></tr>\n";
	str += "<tr><td class=\"rightalign\" name=\"separation\">Language</td><td class=\"leftalign\">" + curr_language + "</td></tr>\n";
	str += "<tr><td class=\"rightalign\" name=\"separation\">English&nbsp;Name</td><td class=\"leftalign\">" + curr_enname + "</td></tr>\n";
	str += "<tr><td class=\"rightalign\" name=\"separation\">sRGB</td><td class=\"leftalign\">" + curr_srgbR + ", " + curr_srgbG + ", " + curr_srgbB + "</td></tr>\n";
	str += "<tr><td class=\"rightalign\" name=\"separation\">RGB HEX</td><td class=\"leftalign\">" + curr_hex + "</td></tr>\n";
	str += "<tr><td class=\"rightalign\" name=\"separation\">CIE-Lab</td><td class=\"leftalign\">" + curr_labL + ", " + curr_labA + ", " + curr_labB + "</td></tr>\n";
	
	document.getElementById("colorinfo_table").innerHTML = str;
}

// display closest (dE) colors of the same language along different directions
function displayNeighboringColors(){
	var str = "<tr style=\"background-color: "+ rgbToHex(curr_srgbR, curr_srgbG, curr_srgbB) +"; text-align: center; font-size:large;\"><td colspan=\"6\">Neighboring colors of the same language</td></tr>\n";
	str += "<tr style=\"background-color: "+ rgbToHex(curr_srgbR, curr_srgbG, curr_srgbB) +"; text-align: center;\"><td style=\"width:16.6%\">Lightness &uarr;</td><td style=\"width:16.6%\">Lightness &darr;</td><td style=\"width:16.6%\">Chroma &uarr;</td><td style=\"width:16.6%\">Chroma &darr;</td><td style=\"width:16.6%\">Hue angle &uarr;</td><td style=\"width:16.6%\">Hue angle &darr;</td></tr>\n";
	str += "<tr>"
	var n;
	for (n=1; n<=6; n++){
		var vecL, vecA, vecB, decChroma;
		decChroma = 0;
		switch (n) {
		case 1: //increase Lightness
			vecL = 1; vecA = 0; vecB = 0;
			break;
		case 2: //decrease Lightness
			vecL = -1; vecA = 0; vecB = 0;
			break;
		case 3: //increase Chroma
			vecL = 0; vecA = curr_labA; vecB = curr_labB;
			break;
		case 4: //decrease Chroma
			vecL = 0; vecA = -curr_labA; vecB = -curr_labB;
			decChroma = 1;
			break;
		case 5: //increase Hue angle
			vecL = 0; vecA = -curr_labB; vecB = curr_labA;
			break;
		case 6: //decrease Hue angle
			vecL = 0; vecA = curr_labB; vecB = -curr_labA;
			break;
		}
		closest_ID = closestColorInCone(curr_lid, curr_labL, curr_labA, curr_labB, vecL, vecA, vecB, decChroma);
//		console.log(n + " -> " + closest_ID);
		if (closest_ID != 0){
			var closest_color = colorDB({id:closest_ID});
//			console.log(JSON.stringify(closest_color.get()));
			var closest_srgbR = closest_color.first().srgbR;
			var closest_srgbG = closest_color.first().srgbG;
			var closest_srgbB = closest_color.first().srgbB;
			var closest_name = closest_color.first().name;
			var closest_enname = closest_color.first().enname;
			if (curr_lid == 2){
				str += "<td class=\"colorpatch\" style=\"background-color:"+ rgbToHex(closest_srgbR, closest_srgbG, closest_srgbB) +";\" onClick=\"displayColor("+ closest_ID +")\">"+ closest_name + "</td>\n";
			}
			else{
				str += "<td class=\"colorpatch\" style=\"background-color:"+ rgbToHex(closest_srgbR, closest_srgbG, closest_srgbB) +";\" onClick=\"displayColor("+ closest_ID +")\">"+ closest_name + "<br>("+ closest_enname +")</td>\n";
			}
		}
		else{
			str += "<td class=\"colorpatch\" style=\"background-color: gray; text-align: center\">no data</td>\n";
		}
		
		
	}
	str += "</tr>"
	document.getElementById("neighbors").innerHTML = str;
}

// display closest (dE) colors of the same language
function displaySimilarColors(){
	var str = "<tr style=\"background-color: "+ rgbToHex(curr_srgbR, curr_srgbG, curr_srgbB) +"; text-align: center; font-size:large;\"><td colspan=\"9\">Similar colors in other languages</td></tr>\n";
	str += "<tr>";
	var L;
	for (L=1; L<=10; L++){
		if (L != curr_lid){
			closest_ID = closestColor(L, curr_labL, curr_labA, curr_labB);
			var closest_color = colorDB({id:closest_ID});
//			console.log(JSON.stringify(closest_color.get()));
			var closest_srgbR = closest_color.first().srgbR;
			var closest_srgbG = closest_color.first().srgbG;
			var closest_srgbB = closest_color.first().srgbB;
			var closest_name = closest_color.first().name;
			var closest_LID = closest_ID % 100;
			var closest_language = languageDB({lid:closest_LID});
			
			str += "<td class=\"colorpatch\" style=\"background-color:"+ rgbToHex(closest_srgbR, closest_srgbG, closest_srgbB) +"; width:11.1%;\" onClick=\"displayColor("+ closest_ID +")\">"+ closest_name + " ("+ closest_language.first().lcode +")</td>\n";
		}
	}
	str += "</tr>"
	document.getElementById("similar").innerHTML = str;
}

//style=\"width:16.6%\"

// find closest color of language LID with given LAB values
function closestColor(LID, labL, labA, labB){ //find closest color of language LID for given Lab values
	var all_colors = colorDB({lid:LID}).get();
//	console.log(JSON.stringify(all_colors));
	
	var deltaE2 = 1000000;
	var ideltaE2 = 0;
	var result = 0;
	var i;
	for (i=0; i<all_colors.length; i++){
		iL = all_colors[i].labL;
		iA = all_colors[i].labA;
		iB = all_colors[i].labB;
		ideltaE2 = norm2((iL-labL), (iA-labA), (iB-labB));
		if (ideltaE2 < deltaE2){
			deltaE2 = ideltaE2;
			result = all_colors[i].id;
		}
	}
	return result;
}

// find closest color of language LID with given LAB values within a cone defined by the vector vecLAB
// chroma case is special as you have to stop searching at the neutral axis
function closestColorInCone(LID, labL, labA, labB, vecL, vecA, vecB, decChroma){
	var all_colors = colorDB({lid:LID}).get();
	var cosAlpha = Math.cos(22.5/180*Math.PI);
	var deltaE2 = 1000000;
	var ideltaE2 = 0;
	var result = 0;
//	console.log("------");
	var i;
	for (i=0; i<all_colors.length; i++){
		var ivecL = all_colors[i].labL - labL;
		var ivecA = all_colors[i].labA - labA;
		var ivecB = all_colors[i].labB - labB;
		ideltaE2 = norm2(ivecL, ivecA, ivecB);
		if (ideltaE2 < deltaE2 && ideltaE2 > 0){
			if (decChroma != 0){
				tmp = dotProdNorm(labL, labA, labB, ivecL, ivecA, ivecB);
				if (tmp < 0){
					continue;
				}
			}
			tmp = dotProdNorm(ivecL, ivecA, ivecB, vecL, vecA, vecB);
			if (tmp < cosAlpha && tmp > 0){
				deltaE2 = ideltaE2;
				result = all_colors[i].id;
//				console.log("(" + ivecL + ", " + ivecA  + ", " + ivecB + ")  (" + vecL + ", " + vecA + ", " + vecB + ")");
				debug = 1;
//				console.log(dotProdNorm(ivecL, ivecA, ivecB, vecL, vecA, vecB));
				debug = 0;
			}
		}
	}
	return result;
}

// display the history
function displayHistory(){
	var N = myhistory.length-1;
	var N_start = Math.max(N-50, 0);
	
//	console.log("history (" + N_stop + "): " + myhistory);
	var i;
	str = "";
	for (i=N_start; i<=N-1; i++){
//		console.log(i);
		str += "<col style=\"width: 20px\">";
	}
	str += "\n<tr>";
	for (i=N_start; i<=N-1; i++){
		var hist_ID = myhistory[i];
		var hist_color = colorDB({id:hist_ID});
		var hist_srgbR = hist_color.first().srgbR;
		var hist_srgbG = hist_color.first().srgbG;
		var hist_srgbB = hist_color.first().srgbB;
		var hist_hex = rgbToHex(hist_srgbR, hist_srgbG, hist_srgbB);
		str += "<td class=\"colorpatch\" style=\"background-color:"+ hist_hex +";\" onClick=\"displayColor("+ hist_ID +")\"></td>\n";
	}
	str += "</tr>";
//	console.log(str);
	document.getElementById("history").innerHTML = str;
//	document.getElementById("history").innerHTML = myhistory;
}

// updates the foreground color according to the current color swatch for better contrast
function setFGColor(){
	if (curr_srgbR + curr_srgbG + curr_srgbB < 127*3){
		document.body.style.color = "white";
		for (i=0; i<document.getElementsByName("separation").length; i++){
			document.getElementsByName("separation")[i].style.borderRight = "1px solid white";
		}
		for (i=0; i<document.getElementsByClassName("colorpatch").length; i++){
			document.getElementsByClassName("colorpatch")[i].style.borderColor = "white";
		}
	}
	else{
		document.body.style.color = "black";
		for (i=0; i<document.getElementsByName("separation").length; i++){
			document.getElementsByName("separation")[i].style.borderRight = "1px solid black";
		}
		for (i=0; i<document.getElementsByClassName("colorpatch").length; i++){
			document.getElementsByClassName("colorpatch")[i].style.borderColor = "black";
		}
	}
}

// some small helper functions
function rgbToHex(r, g, b) {
	return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}

function norm(x, y, z){
	return (Math.sqrt(Math.pow(x, 2.0) + Math.pow(y, 2.0) + Math.pow(z, 2.0)));
}

function norm2(x, y, z){
	return (Math.pow(x, 2.0) + Math.pow(y, 2.0) + Math.pow(z, 2.0));
}

function dotProdNorm(x1, y1, z1, x2, y2, z2){
	return ((x1*x2 + y1*y2 + z1*z2)/norm(x1, y1, z1)/norm(x2, y2, z2));
}

function rgbToHex(r, g, b) {
	return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function sRGB2Lab(r, g, b){
	var xyz = sRGB2XYZ(r/255, g/255, b/255);
	console.log("xyz " + xyz);
	var lab = XYZ2Lab(xyz[0], xyz[1], xyz[2]);
	return lab;
}

function sRGB2XYZ(r, g, b){
//	console.log("rgb = " + r + " " + g + " " + b);
	var r = sRGB2sRGBlin(r);
	var g = sRGB2sRGBlin(g);
	var b = sRGB2sRGBlin(b);
//	console.log("linrgb = " + r + " " + g + " " + b);
	var x = 0.4124*r + 0.3576*g + 0.1805*b;
	var y = 0.2126*r + 0.7152*g + 0.0722*b;
	var z = 0.0193*r + 0.1192*g + 0.9505*b;
	return [x, y, z];
}

function sRGB2sRGBlin(x){
	if (x <= 0.04045){
		return x/12.92;
	}
	else{
		return Math.pow((x+0.055)/1.055, 2.4);
	}
}

function XYZ2Lab(x, y, z){
	var xn = 0.9504;
	var yn = 1.0;
	var zn = 1.0889;
	var l = 116*f_lab(y/yn) - 16;
	var a = 500*(f_lab(x/xn) - f_lab(y/yn));
	var b = 200*(f_lab(y/yn) - f_lab(z/zn));
	return [l, a, b];
}

function f_lab(x){
	if (x > Math.pow(6/29, 3)){
		return Math.pow(x, 1/3);
	}
	else{
		1/3*Math.pow(29/6, 3)*x + 4/29;
	}
}



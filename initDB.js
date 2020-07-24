//history
myhistory = [];

//color DB
var colorNames = getColorNames();
var colorValues = getColorValues();
console.log("importing " + colorValues.length + " values");

var colorDB = TAFFY([]);
for (i=0; i<colorValues.length; i++){
	var cid = colorValues[i][0];
	var r = colorValues[i][1];
	var g = colorValues[i][2];
	var b = colorValues[i][3];
	var l = colorValues[i][4];
	var la = colorValues[i][5];
	var lb = colorValues[i][6];
	var lid = cid % 100;
	var nid = Math.floor(cid/100);
	var name = colorNames[nid-1][lid-1];
	var enname = colorNames[nid-1][1];
	if (nid==10){
		console.log(i+": "+cid+" ("+nid+" "+ lid+"): name="+name+" enname="+enname+" r="+r+" g="+g+" b="+b);
	}
	colorDB.insert({id:cid,name:name,enname:enname,srgbR:r,srgbG:g,srgbB:b,labL:l,labA:la,labB:lb,lid:lid});
}

//colorDB = colorDB;

//language DB
var languageDB = TAFFY([{lid:1,language:"Chinese",lcode:"cn"},{lid:2,language:"English",lcode:"en"},{lid:3,language:"French",lcode:"fr"},{lid:4,language:"German",lcode:"de"},{lid:5,language:"Italian",lcode:"it"},{lid:6,language:"Japanese",lcode:"jp"},{lid:7,language:"Korean",lcode:"ko"},{lid:8,language:"Portuguese",lcode:"pt"},{lid:9,language:"Russian",lcode:"ru"},{lid:10,language:"Spanish",lcode:"sp"}]);
languageDB = languageDB;

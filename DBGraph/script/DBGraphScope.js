
//scope Graph parameters
var scopeSamples = 4096;
var scopeLines = 1000;

//scope Graph Display Parameters
var scpWidthBig = 1 * scopeSamples; //Width of Full scale scope graph
var scpHeightBig = scopeLines; //Height of Full scale scope graph
var scpWidthSmall = 1800; //Width of Displayed scope graph
var scpHeightSmall = 350; //Height of Displayed scope graph

var scpDisplayOriginX = 0; //X coordinate of displayed area on Full scale graph
var scpDisplayOriginY = 0; //Y coordinate of displayed area on Full scale graph
var scpDisplayWidth = scpWidthBig; //Width of displayed area Full scale scope graph
var scpDisplayHeight = scpHeightBig; //Height of displayed area Full scale scope graph

var scpPositionX;
var scpPositionY;

var DIV_scope; //

var CNV_scope;
var CNV_scopeOrig;
var CNV_scopeZoom;

var CNV_ctx_scope;
var CNV_ctx_scopeOrig;
var CNV_ctx_scopeZoom;

var DIV_scopeNav;

var scpZoomOutButton;

function scpInit() {
	var DIV_scope = document.getElementById("scope");
	DIV_scope.style.width = scpWidthSmall + "px";
	DIV_scope.style.height = scpHeightSmall + 20 + "px";
	
	CNV_scope = document.createElement('canvas');
	CNV_scope.setAttribute("id", "CanvasScope");
	CNV_scope.width = scpWidthSmall;
	CNV_scope.height = scpHeightSmall;
	DIV_scope.appendChild(CNV_scope);
	CNV_ctx_scope = CNV_scope.getContext('2d');
	
	CNV_scopeZoom = document.createElement('canvas');
	CNV_scopeZoom.setAttribute("id", "CanvasScopeZoom");
	CNV_scopeZoom.width = scpWidthSmall;
	CNV_scopeZoom.height = scpHeightSmall;
	DIV_scope.appendChild(CNV_scopeZoom);
	CNV_ctx_scopeZoom = CNV_scopeZoom.getContext('2d');
	
	CNV_scopeOrig = document.createElement('canvas');
	CNV_scopeOrig.setAttribute("id", "CanvasScopeOrig");
	CNV_scopeOrig.width = scpWidthBig;
	CNV_scopeOrig.height = scpHeightBig;
	DIV_scope.appendChild(CNV_scopeOrig);
	CNV_ctx_scopeOrig = CNV_scopeOrig.getContext('2d');
	
	DIV_scopeNav = document.createElement('div');
	DIV_scopeNav.setAttribute("id", "scopeNav");
	DIV_scopeNav.style.width = scpWidthSmall + "px";
	DIV_scopeNav.style.height = 20 + "px";
	DIV_scopeNav.style.borderBottom  = "1px solid white";
	DIV_scopeNav.style.paddingTop = "1px";
	DIV_scopeNav.style.backgroundColor = "#000000";
	DIV_scopeNav.style.color = "white";
	
	scpZoomOutButton = document.createElement("img");
	scpZoomOutButton.style.float = "right";
	scpZoomOutButton.src = "../images/ZoomOff.png";
	scpZoomOutButton.style.cursor = "pointer";
	DIV_scopeNav.appendChild(scpZoomOutButton);   
	
	DIV_scope.appendChild(DIV_scopeNav);
	var XVal;
	var YVal;
}
var start;
function drawscope (data) {
	start = window.performance.now();
	CNV_ctx_scopeOrig.lineWidth = 3;
	CNV_ctx_scopeOrig.strokeStyle = "red";
	CNV_ctx_scope.clearRect(0, 0, scpWidthSmall, scpHeightSmall);
	CNV_ctx_scopeOrig.clearRect(0, 0, scpWidthBig, scpHeightBig);
	//CNV_ctx_scopeOrig.drawImage(CNV_scopeOrig, 0, 0, scpWidthBig, scpHeightBig, 0, -1, scpWidthBig, scpHeightBig);
	CNV_ctx_scopeOrig.beginPath();
	XVal = 0;
	YVal = scpHeightBig - 5 - data[0] * 2;
	CNV_ctx_scopeOrig.moveTo(XVal, YVal);
	for (var i = 1; i < scpWidthBig; i++) {
		XVal = 5 * i;
		YVal = scpHeightBig - 5 - data[i * 5] * 2;
		CNV_ctx_scopeOrig.lineTo(XVal, YVal);
		if(parseFloat(i) / 500 == Math.round(parseFloat(i) / 500)) {
			CNV_ctx_scopeOrig.stroke();
			CNV_ctx_scopeOrig.closePath();
			CNV_ctx_scopeOrig.beginPath();
			CNV_ctx_scopeOrig.moveTo(XVal, YVal);
		}
	}
	CNV_ctx_scopeOrig.stroke();
	CNV_ctx_scopeOrig.closePath();
	CNV_ctx_scope.drawImage(CNV_scopeOrig, 1 * wtrDisplayOriginX, scpDisplayOriginY, 1 * wtrDisplayWidth, scpDisplayHeight, 0, 0, scpWidthSmall, scpHeightSmall);

	document.getElementById("XVal3").value = window.performance.now() - start;
}
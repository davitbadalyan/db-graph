window.onload = pageLoaded;

//Waterfall Graph parameters
var waterfallSamples = 4096;
var waterfallLines = 1000;

//Waterfall Graph Display Parameters
var wtrWidthBig = waterfallSamples; //Width of Full scale Waterfall graph
var wtrHeightBig = waterfallLines; //Height of Full scale Waterfall graph
var wtrWidthSmall = 1800; //Width of Displayed Waterfall graph
var wtrHeightSmall = 350; //Height of Displayed Waterfall graph

var wtrDisplayOriginX = 0; //X coordinate of displayed area on Full scale graph
var wtrDisplayOriginY = 0; //Y coordinate of displayed area on Full scale graph
var wtrDisplayWidth = wtrWidthBig; //Width of displayed area Full scale Waterfall graph
var wtrDisplayHeight = wtrHeightBig; //Height of displayed area Full scale Waterfall graph

var WtrPositionX;
var WtrPositionY;
var WtrDrawRate = 5;
function pageLoaded() {
	var DIV_preload = document.getElementById("preload");
	var DIV_content = document.getElementById("content");
	DIV_preload.style.display = "none";
	DIV_content.style.display = "block";
	pageInit();
	scpInit();
	getWtrPosition();
	window.onload = start;
	setInterval(function(){ drawWaterfall (null); }, 50);
}

var DIV_waterfall; //

var CNV_waterfall;
var CNV_waterfallOrig;
var CNV_waterfallZoom;

var CNV_ctx_waterfall;
var CNV_ctx_waterfallOrig;
var CNV_ctx_waterfallZoom;

var DIV_waterfallNav;

var wtrZoomOutButton;
var imgData;

function pageInit() {
	var DIV_waterfall = document.getElementById("waterfall");
	DIV_waterfall.style.width = wtrWidthSmall + "px";
	DIV_waterfall.style.height = wtrHeightSmall + 20 + "px";
	
	CNV_waterfall = document.createElement('canvas');
	CNV_waterfall.setAttribute("id", "CanvasWaterfall");
	CNV_waterfall.width = wtrWidthSmall;
	CNV_waterfall.height = wtrHeightSmall;
	DIV_waterfall.appendChild(CNV_waterfall);
	CNV_ctx_waterfall = CNV_waterfall.getContext('2d');
	
	CNV_waterfallZoom = document.createElement('canvas');
	CNV_waterfallZoom.setAttribute("id", "CanvasWaterfallZoom");
	CNV_waterfallZoom.width = wtrWidthSmall;
	CNV_waterfallZoom.height = wtrHeightSmall;
	DIV_waterfall.appendChild(CNV_waterfallZoom);
	CNV_ctx_waterfallZoom = CNV_waterfallZoom.getContext('2d');
	
	CNV_waterfallOrig = document.createElement('canvas');
	CNV_waterfallOrig.setAttribute("id", "CanvasWaterfallOrig");
	CNV_waterfallOrig.width = wtrWidthBig;
	CNV_waterfallOrig.height = wtrHeightBig;
	DIV_waterfall.appendChild(CNV_waterfallOrig);
	CNV_ctx_waterfallOrig = CNV_waterfallOrig.getContext('2d');
	imgData = CNV_ctx_waterfallOrig.createImageData(wtrWidthBig, 1);
	
	DIV_waterfallNav = document.createElement('div');
	DIV_waterfallNav.setAttribute("id", "waterfallNav");
	DIV_waterfallNav.style.width = wtrWidthSmall + "px";
	DIV_waterfallNav.style.height = 20 + "px";
	DIV_waterfallNav.style.borderBottom  = "1px solid white";
	DIV_waterfallNav.style.paddingTop = "1px";
	DIV_waterfallNav.style.backgroundColor = "#000000";
	DIV_waterfallNav.style.color = "white";
	
	wtrZoomOutButton = document.createElement("img");
	wtrZoomOutButton.style.float = "right";
	wtrZoomOutButton.src = "../images/ZoomOff.png";
	wtrZoomOutButton.style.cursor = "pointer";
	DIV_waterfallNav.appendChild(wtrZoomOutButton);   
	
	DIV_waterfall.appendChild(DIV_waterfallNav);
	
	InitMouseEvents();
}
var draw = 0;
var Zoom = false;
var start = window.performance.now();
var interval = (400 / 100);

function drawWaterfall (data) {
	data = randomData(wtrWidthBig, 0, 10, 80);	
	drawscope(data);
	start = window.performance.now();
	
	CNV_ctx_waterfallOrig.drawImage(CNV_waterfallOrig, 0, 0, wtrWidthBig, wtrHeightBig, 0, -1, wtrWidthBig, wtrHeightBig);
	if (Zoom || draw == WtrDrawRate) {
		CNV_ctx_waterfall.clearRect(0, 0, wtrWidthSmall, wtrHeightSmall);
		CNV_ctx_waterfall.drawImage(CNV_waterfallOrig, wtrDisplayOriginX, wtrDisplayOriginY, wtrDisplayWidth, wtrDisplayHeight - 1, 0, 0, wtrWidthSmall, wtrHeightSmall);
		draw = 0;
	}
	else{
		draw++;
	}
	//var interval = (400 / 100);
	//imgData=CNV_ctx_waterfallOrig.createImageData(wtrWidthBig, 1);
	
	for(i=0; i< imgData.data.length; i+=4) {
		RGBVal = waveLengthToRGB(380 + interval * (data[i/4]));
		imgData.data[i+0]=RGBVal[0];
		imgData.data[i+1]=RGBVal[1];
		imgData.data[i+2]=RGBVal[2];
		imgData.data[i+3]=255;
		}
	CNV_ctx_waterfallOrig.putImageData(imgData,0,wtrHeightBig-1);
	
	document.getElementById("XVal2").value = window.performance.now() - start;
}

function getWtrPosition()
{
	var offset = getOffset(CNV_waterfall);
	WtrPositionX = offset.left; //canvas.offsetLeft;
	WtrPositionY = offset.top; //canvas.offsetTop;
}
/** Taken from Earl F. Glynn's web page:
	* <a href="http://www.efg2.com/Lab/ScienceAndEngineering/Spectra.htm">Spectra Lab Report</a>
	* */
	function waveLengthToRGB(Wavelength) {
		var factor;
		var Red,Green,Blue;
		var Gamma = 0.80;
		var IntensityMax = 255;
		/*if((Wavelength >= 380) && (Wavelength<440)){
			Red = -(Wavelength - 440) / (440 - 380);
			Green = 0.0;
			Blue = 1.0;
		}else*/ 
		if((Wavelength >= 380) && (Wavelength<440)){
			Red = 0.0;
			Green = 0.0;
			Blue = (Wavelength - 380) / (440 - 380);;
		}else if((Wavelength >= 440) && (Wavelength<490)){
			Red = 0.0;
			Green = (Wavelength - 440) / (490 - 440);
			Blue = 1.0;
		}else if((Wavelength >= 490) && (Wavelength<510)){
			Red = 0.0;
			Green = 1.0;
			Blue = -(Wavelength - 510) / (510 - 490);
		}else if((Wavelength >= 510) && (Wavelength<580)){
			Red = (Wavelength - 510) / (580 - 510);
			Green = 1.0;
			Blue = 0.0;
		}else if((Wavelength >= 580) && (Wavelength<645)){
			Red = 1.0;
			Green = -(Wavelength - 645) / (645 - 580);
			Blue = 0.0;
		}else if((Wavelength >= 645) && (Wavelength<781)){
			Red = 1.0;
			Green = 0.0;
			Blue = 0.0;
		}else{
			Red = 0.0;
			Green = 0.0;
			Blue = 0.0;
		}

		// Let the intensity fall off near the vision limits
		if((Wavelength >= 380) && (Wavelength<420)){
			factor = 0.3 + 0.7*(Wavelength - 380) / (420 - 380);
		}else if((Wavelength >= 420) && (Wavelength<701)){
			factor = 1.0;
		}else if((Wavelength >= 701) && (Wavelength<781)){
			factor = 0.3 + 0.7*(780 - Wavelength) / (780 - 700);
		}else{
			factor = 0.0;
		}


		var rgb =[];

		// Don't want 0^x = 1 for x <> 0
		rgb[0] = (Red==0.0)   ? 0 : (Math.round(IntensityMax * Math.pow(Red   * factor, Gamma)));
		rgb[1] = (Green==0.0) ? 0 : (Math.round(IntensityMax * Math.pow(Green * factor, Gamma)));
		rgb[2] = (Blue==0.0)  ? 0 : (Math.round(IntensityMax * Math.pow(Blue  * factor, Gamma)));
		
		/*if((Wavelength >= 300) && (Wavelength<380)){
			rgb[0] = 0;
			rgb[1] = 0;
			rgb[2] = Math.round((Wavelength - 300) / 80) * 255;
		}*/
		
		return rgb;
}

//function 
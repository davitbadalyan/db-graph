function InitMouseEvents() {
	window.addEventListener("mousemove", function(event){windowMouseMove(CNV_waterfallZoom, CNV_ctx_waterfallZoom, event)}, false);
	window.addEventListener("mouseup", function(event){windowMouseUp(CNV_waterfallZoom, CNV_ctx_waterfallZoom, event)}, false);
	window.addEventListener("resize", function(event){onWindowResize(event)}, false);
	
	CNV_waterfallZoom.addEventListener("mousedown", function(event){mouseDownWtr(CNV_waterfallZoom, CNV_ctx_waterfallZoom, event)}, false);
	CNV_waterfallZoom.addEventListener("mousemove", function(event){mouseMoveWtr(CNV_waterfallZoom, CNV_ctx_waterfallZoom, event)}, false);
	CNV_waterfallZoom.addEventListener("mouseup", function(event){mouseUpWtr(CNV_waterfallZoom, CNV_ctx_waterfallZoom, event)}, false);
	CNV_waterfallZoom.addEventListener("mouseout", function(event){mouseOutWtr(CNV_waterfallZoom, CNV_ctx_waterfallZoom, event)}, false);
	CNV_waterfallZoom.addEventListener("mouseover", function(event){mouseOverWtr(CNV_waterfallZoom, CNV_ctx_waterfallZoom, event)}, false);
	
	wtrZoomOutButton.addEventListener("mouseup", function(event){ZoomOff(event)}, false);
}

var mouseClickedWtr = false;
var mouseOutInZoomWtr = false;
var mouseClickWtrX1 = 0;
var mouseClickWtrY1 = 0;
var mouseClickWtrX2 = 0;
var mouseClickWtrY2 = 0;
var mouseWtrReleaseOutX = 0;
var mouseWtrReleaseOutY = 0;

function windowMouseMove(canvas, ctx, event){
	if(mouseOutInZoomWtr){
		mouseWtrReleaseOutX = event.pageX - WtrPositionX;
		mouseWtrReleaseOutY = event.pageY - WtrPositionY;
		if (event.pageX - WtrPositionX > wtrWidthSmall){
			mouseWtrReleaseOutX = wtrWidthSmall;
		} else if(event.pageX - WtrPositionX < 0){
			mouseWtrReleaseOutX = 0;
		}
		if (event.pageY - WtrPositionY > wtrHeightSmall){
			mouseWtrReleaseOutY = wtrHeightSmall;
		} else if(event.pageY - WtrPositionY < 0){
			mouseWtrReleaseOutY = 0;
		}
		
		wtrDrawZoomArea(canvas, ctx, (mouseWtrReleaseOutX-mouseClickWtrX1), (mouseWtrReleaseOutY-mouseClickWtrY1));
	}
}

function windowMouseUp(canvas, ctx, event){
	if( event.button == 0 && mouseOutInZoomWtr){
		mouseOutInZoomWtr = false;
		mouseClickedWtr = false;
		canvas.style.cursor = "default";
		document.body.style.cursor = "default";
		ctx.clearRect(0, 0, wtrWidthSmall, wtrHeightSmall);
		mouseClickWtrX2 = mouseWtrReleaseOutX;
		mouseClickWtrY2 = mouseWtrReleaseOutY;
		defineZoomArea();
		canvas.style.cursor = "default";
		document.body.style.cursor = "default";
		CNV_ctx_waterfall.clearRect(0, 0, wtrWidthSmall, wtrHeightSmall);
		CNV_ctx_waterfall.drawImage(CNV_waterfallOrig, wtrDisplayOriginX, wtrDisplayOriginY, wtrDisplayWidth, wtrDisplayHeight - 1, 0, 0, wtrWidthSmall, wtrHeightSmall);
		Zoom = true;
	}
}

function mouseDownWtr(canvas, ctx, event) {
	if(event.button == 0){
		mouseClickedWtr = true;
		canvas.style.cursor = "zoom-in";
		document.body.style.cursor = "zoom-in";
		mouseClickWtrX1 = event.pageX-WtrPositionX;
		mouseClickWtrY1 = event.pageY-WtrPositionY;
	}
}

function mouseUpWtr(canvas, ctx, event) {
	if(event.button == 0 && mouseClickedWtr) {
		mouseClickedWtr = false;
		mouseClickWtrX2 = event.pageX-WtrPositionX;
		mouseClickWtrY2 = event.pageY-WtrPositionY;
		canvas.style.cursor = "default";
		document.body.style.cursor = "default";
		ctx.clearRect(0, 0, wtrWidthSmall, wtrHeightSmall);
		defineZoomArea();
		CNV_ctx_waterfall.clearRect(0, 0, wtrWidthSmall, wtrHeightSmall);
		CNV_ctx_waterfall.drawImage(CNV_waterfallOrig, wtrDisplayOriginX, wtrDisplayOriginY, wtrDisplayWidth, wtrDisplayHeight - 1, 0, 0, wtrWidthSmall, wtrHeightSmall);
		Zoom = true;
	}
}

function mouseMoveWtr(canvas, ctx, event) {
	if(mouseClickedWtr){
		wtrDrawZoomArea(canvas, ctx, (event.pageX-WtrPositionX-mouseClickWtrX1), (event.pageY-WtrPositionY-mouseClickWtrY1));
	}
}

function mouseOutWtr(canvas, ctx, event) {
	if (mouseClickedWtr){
		mouseOutInZoomWtr = true;
	}
}

function mouseOverWtr(canvas, ctx, event) {
	if (mouseClickedWtr){
		mouseOutInZoomWtr = false;
	}
}

function ZoomOff(event) {
	wtrDisplayOriginX = 0; //X coordinate of displayed area on Full scale graph
	wtrDisplayOriginY = 0; //Y coordinate of displayed area on Full scale graph
	wtrDisplayWidth = wtrWidthBig; //Width of displayed area Full scale Waterfall graph
	wtrDisplayHeight = wtrHeightBig; //Height of displayed area Full scale Waterfall graph
	CNV_ctx_waterfall.clearRect(0, 0, wtrWidthSmall, wtrHeightSmall);
	CNV_ctx_waterfall.drawImage(CNV_waterfallOrig, wtrDisplayOriginX, wtrDisplayOriginY, wtrDisplayWidth, wtrDisplayHeight - 1, 0, 0, wtrWidthSmall, wtrHeightSmall);
	Zoom = false;
}
function getOffset(obj) {
	var offsetLeft = 0;
	var offsetTop = 0;
	do {
		if (!isNaN(obj.offsetLeft)) {
			offsetLeft += obj.offsetLeft;
	}
		if (!isNaN(obj.offsetTop)) {
			offsetTop += obj.offsetTop;
		}   
	} while(obj = obj.offsetParent );
	return {left: offsetLeft, top: offsetTop};
}

function wtrDrawZoomArea(canvas, ctx, AreaWidth, AreaHeight) {
	if (canvas.getContext) {
		ctx.clearRect(0, 0, wtrWidthSmall, wtrHeightSmall);
		ctx.globalAlpha=0.2;
		ctx.fillStyle = 'white';
		ctx.fillRect(mouseClickWtrX1, mouseClickWtrY1, AreaWidth, AreaHeight);
		ctx.strokeStyle = 'Red';
		ctx.stroke();
	}
}

function defineZoomArea(){
	var X = Math.min(mouseClickWtrX1, mouseClickWtrX2);
	var Y = Math.min(mouseClickWtrY1, mouseClickWtrY2);
	var Width = Math.abs(mouseClickWtrX2 - mouseClickWtrX1);
	var Height = Math.abs(mouseClickWtrY2 - mouseClickWtrY1);
	var RatioV = (wtrDisplayWidth/ wtrWidthSmall);
	var RatioH = (wtrDisplayHeight/wtrHeightSmall);
	
	var wtrDisplayOriginX_pr = wtrDisplayOriginX + RatioV * X;
	var wtrDisplayOriginY_pr = wtrDisplayOriginY + RatioH * Y;
	var wtrDisplayWidth_pr  = RatioV * Width;
	var wtrDisplayHeight_pr = RatioH * Height;
	
	if (wtrDisplayOriginX_pr >= 0 && wtrDisplayOriginY_pr >= 0 && wtrDisplayWidth_pr > 0 && wtrDisplayHeight_pr > 0) {
		wtrDisplayOriginX = wtrDisplayOriginX + RatioV * X;
		wtrDisplayOriginY = wtrDisplayOriginY + RatioH * Y;
		wtrDisplayWidth  = RatioV * Width;
		wtrDisplayHeight = RatioH * Height;
	}
	
	document.getElementById("XVal2").value = wtrDisplayOriginX;
	document.getElementById("YVal2").value = wtrDisplayOriginY;
	document.getElementById("XVal3").value = wtrDisplayWidth;
	document.getElementById("YVal3").value = wtrDisplayHeight;
}

function onWindowResize(){
	getWtrPosition();
}
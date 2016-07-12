var translation = false;
var index = 0;
var XPos1, XPos2;
var tr = 0;
var updn = 1.0;
function randomData(Samples, MinNoise, MaxNoise, MaxSignal) {
	if (index == 0){
		translation = false;
		index++;
	} else if (index == 10) {
		translation = true;
		XPos1 = tr * Samples / 10; 
		XPos2 = (tr + 1) * Samples / 10;
		index++;
		tr = tr + updn;
		
		//document.getElementById("XVal2").value = tr;
		//document.getElementById("YVal2").value = updn;
	} else if (index == 20) {
		translation = false;
		index++;
	} else if (index == 30) {
		index = 0;
		translation = false;
	} else {
		index++;
	}
	updn = (tr ==9 || tr == 0)? (-1 * updn) : (updn);

	var randomSamples = new Float32Array(Samples);
	for(i=0; i< Samples; i++) {
		//if ((i > Samples/5 && i < 1.2*Samples/5) || (i > 4*Samples/5 && i < 1.1*4*Samples/5)) {
		//	randomSamples[i] = Math.random() * (MaxNoise - MinNoise) + MinNoise;
		//} else 
		if (translation){
			if((i > XPos1 && i < XPos2)) {
				randomSamples[i] = Math.random() * 0.2 * MaxSignal + MaxSignal; //MaxSignal * 0.8;
			}
			else {
				randomSamples[i] = Math.random() * (MaxNoise - MinNoise) + MinNoise;
			}
		} else {
				randomSamples[i] = Math.random() * (MaxNoise - MinNoise) + MinNoise;		  
		}
	}
	return randomSamples;
}

let capture;
let chroma = 0;
let chromaMin = 1;
let chromaMax = 0;

let sound;

function preload() {
	sound = loadSound("girlLaugh.mp3");
}

function setup() {
	createCanvas(windowWidth * 0.9, windowHeight * 0.9);

	capture = createCapture(VIDEO);
	capture.hide();

	sound.play();
	sound.loop();
}

function draw() {
	background(255);
	fill(0);
	noStroke();

	getAudioContext().resume();

	capture.loadPixels();
	for (let x = 0; x < capture.width; x++) {
		for (let y = 0; y < capture.height; y++) {
			let i = (x + y * capture.width) * 4;
			let r = capture.pixels[i + 0];
			let g = capture.pixels[i + 1];
			let b = capture.pixels[i + 2];
			let a = capture.pixels[i + 3];

			let luma = 0.299 * r + 0.587 * g + 0.114 * b;

			capture.pixels[i + 0] = luma;
			capture.pixels[i + 1] = luma;
			capture.pixels[i + 2] = luma;

			chroma += luma;
		}
	}
	chromaAvg = chroma / (width * height);

	let chromaVolume = Math.floor(map(chromaAvg, 0, 50, 100, 0));
	if (chromaVolume < 50)
		volume = 0;
	else
		volume = map(chromaVolume, 50, 100, 0, 1);
	
	// console.log(chromaAvg + " / " + chromaVolume + " / " + volume);

	sound.setVolume(volume);
	chroma = 0;

	capture.updatePixels();

	push();
	// flip camera horizontally
	translate(width, 0);
	scale(-1, 1);
	image(capture, 0, 0, width, height);
	pop();
}


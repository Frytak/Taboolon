/** @format */

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d', { willReadFrequently: true });
const inputImage = document.getElementById('inputImage');
const inputImageLabel = document.querySelector('.inputImage > label');
const reader = new FileReader();
const image = new Image();
let root = document.querySelector(':root');
let downScale;

// Loading image
inputImage.addEventListener('change', (e) => {
	let img = document.createElement('img');

	reader.onload = () => {
		image.src = reader.result;

		image.onload = () => {
			img.src = image.src;

			// Show image that will be transformed
			inputImageLabel.replaceChildren(img);

			console.log(image.width, image.height);
			// Set image label for initial size
			let inputImageInitSize = document.getElementById('inputImageInitSize');
			let text = document.createTextNode(`Initial dimensions: ${image.width} x ${image.height}`);
			inputImageInitSize.replaceChildren(text);

			// Set image label for downscale size
			let inputImageTransSize = document.getElementById('inputImageTransSize');
			text = document.createTextNode(`After transformation: ${Math.floor(image.width / downScale)} x ${Math.floor(image.height / downScale)}`);
			inputImageTransSize.replaceChildren(text);

			canvas.width = image.width / downScale;
			canvas.height = image.height / downScale;
		};
	};

	// Read in the image file as a data URL
	if (inputImage.files[0]) {
		reader.readAsDataURL(inputImage.files[0]);
	} else {
		img.src = '';
	}
});

const transform = document.getElementById('transform');
const scaleControls = document.getElementById('scaleControls');

// Changing the scale
scaleControls.childNodes.forEach((button) => {
	button.addEventListener('click', (e) => {
		// If the imege is loaded add the new size
		if (!image.src) return;

		downScale = e.target.innerText.slice(0, -1);
		canvas.width = image.width / downScale;
		canvas.height = image.height / downScale;

		let inputImageTransSize = document.getElementById('inputImageTransSize');
		text = document.createTextNode(`After transformation: ${Math.floor(image.width / downScale)} x ${Math.floor(image.height / downScale)}`);
		inputImageTransSize.replaceChildren(text);

		// Delete the class of selected and add it to the new one
		if (button.classList.contains('selected')) return;

		scaleControls.childNodes.forEach((button) => {
			if (button.classList === undefined) return;
			button.classList.remove('selected');
		});
		e.target.classList.add('selected');
	});
});

let arrows = [document.getElementById('firstArrow'), document.getElementById('secondArrow'), document.getElementById('thirdArrow')];
let table = document.createElement('table');

// Transforming the image
transform.addEventListener('click', () => {
	let pixels = [];
	table.innerHTML = '';

	arrows.forEach((arrow) => {
		arrow.classList.remove('disableAnimation');
	});

	// Timeout so the animation has time to load
	window.setTimeout(() => {
		// Draw the image on the canvas
		ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
		// Get the new scaled image data
		const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

		// Get all the rows
		let rows = [];
		for (let j = 0; j < canvas.width * canvas.height * 4; j += 4) {
			rows.push({
				r: imageData[j],
				g: imageData[j + 1],
				b: imageData[j + 2],
				t: imageData[j + 3]
			});
		}

		// Asign rows to their height
		for (let i = 0; i < canvas.width * canvas.height; i += canvas.width) {
			pixels.push(rows.slice(i, i + canvas.width));
		}

		// Draw to the table
		for (let i = 0; i < canvas.height; i++) {
			let tr = document.createElement('tr');
			table.appendChild(tr);

			for (let j = 0; j < canvas.width; j++) {
				let td = document.createElement('td');
				td.appendChild(document.createTextNode('⠀'));
				td.style.backgroundColor = `rgb(${pixels[i][j].r}, ${pixels[i][j].g}, ${pixels[i][j].b})`;
				tr.appendChild(td);
			}
		}

		console.log(table);

		arrows.forEach((arrow) => {
			arrow.classList.add('disableAnimation');
		});
	}, 50);
});

let copyTable = document.getElementById('copyTable');
copyTable.addEventListener('click', () => {
	navigator.clipboard.write([new ClipboardItem({ 'text/html': new Blob([table.outerHTML], { type: 'text/html' }) })]);
});

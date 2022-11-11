/** @format */

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let button = document.getElementById('copy');
let table = document.getElementById('table');
let img = new Image();
let pixels = [];
let text = document.getElementById('text');

console.log(table);

let downScale = 12;

img.src = './cat.jpg';
img.width = img.width / downScale;
img.height = img.height / downScale;

canvas.width = img.width;
canvas.height = img.height;

window.onload = function () {
	ctx.drawImage(img, 0, 0, img.width, img.height);
	// img = ctx.getImageData(0, 0, canvas.width, canvas.height);
	// console.log(img);

	const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

	let rows = [];
	for (let j = 0; j < canvas.width * 4 * canvas.height * canvas.width; j += 4) {
		rows.push({
			r: imageData[j],
			g: imageData[j + 1],
			b: imageData[j + 2],
			t: imageData[j + 3]
		});
	}

	for (let i = 0; i < rows.length / canvas.width; i += canvas.width) {
		pixels.push(rows.slice(i, i + canvas.width));
	}

	console.log(imageData, pixels);

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
};

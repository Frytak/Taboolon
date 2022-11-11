var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var table = document.getElementById('table');
var img = new Image();
const pixels = [];


let downScale = 12;

img.src = "./yeah.jpg";
img.width = img.width / downScale;
img.height = img.height / downScale;

canvas.width = img.width;
canvas.height = img.height;

window.onload = function() {
    ctx.drawImage(img, 0, 0, img.width, img.height);
    img = ctx.getImageData(0, 0, canvas.width, canvas.height);
    console.log(img)

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

    for (let i = 0; i < canvas.height; i++) {
        pixels.push({row: [], rowDiv: document.createElement('tr')});
        for (let j = 0; j < canvas.width * 4; j += 4) {
            pixels[i].row.push({
                r: imageData[i * j],
                g: imageData[i * (j+1)],
                b: imageData[i * (j+2)],
                t: imageData[i * (j+3)],
                cell: document.createElement('td')
            });
        }
    }

    for (let i = 0; i < canvas.height; i++) {
        table.appendChild(pixels[i].rowDiv);

        for (let j = 0; j < canvas.width; j++) {
            //pixels[i].row[j].cell.appendChild(document.createTextNode(i + ' ' + j));
            pixels[i].row[j].cell.style.backgroundColor = `rgb(${pixels[i].row[j].r}, ${pixels[i].row[j].g}, ${pixels[i].row[j].b})`;
            pixels[i].rowDiv.appendChild(pixels[i].row[j].cell);
        }
    }

    console.log(pixels);


}
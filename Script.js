const newProjectBtn = document.getElementById('new-project');
const openProjectBtn = document.getElementById('open-project');
const saveProjectBtn = document.getElementById('save-button');
const canvas = document.getElementById('my-canvas');
const context = canvas.getContext('2d');
const backgroundImage = document.getElementById('background-image');
let points = [];
let projectName = '';
canvas.style.position = 'absolute';
canvas.style.top = backgroundImage.offsetTop + 'px';
canvas.style.left = backgroundImage.offsetLeft + 'px';

// New Button logic and configuration
newProjectBtn.addEventListener('click', function () {
    points = [];
    const imageInput = document.createElement('input');
    imageInput.type = 'file';
    imageInput.accept = 'image/*';
    imageInput.addEventListener('change', function (event) {
        const image = new Image();
        image.src = URL.createObjectURL(event.target.files[0]);

        image.onload = function () {
            canvas.width = image.width;
            canvas.height = image.height;
            backgroundImage.src = image.src;
            redrawCanvas();
        };
    });
    // trigger a click event on the imageInput to open the file picker dialog
    imageInput.click();
});


// Load Button logic and configuration
openProjectBtn.addEventListener('click', function () {
    points = [];
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = function () {
        context.clearRect(0, 0, canvas.width, canvas.height);
        const file = this.files[0];
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function () {
            const data = JSON.parse(reader.result);
            const image = new Image();
            image.onload = function () {
                canvas.width = image.width;
                canvas.height = image.height;
                backgroundImage.src = image.src;
                points = data.points;
                redrawCanvas();
            };
            image.src = data.image;
        };
    };
    input.click();
});

canvas.addEventListener('click', function (event) {
    const x = event.offsetX;
    const y = event.offsetY;

    if (event.ctrlKey) {
        for (let i = 0; i < points.length; i++) {
            const point = points[i];
            const distance = Math.sqrt((x - point.x) ** 2 + (y - point.y) ** 2);
            if (distance <= 5) {
                const confirmDelete = confirm('Are you sure you want to delete?');
                if (confirmDelete) {
                    points.splice(i, 1);
                    redrawCanvas(); // redraw the canvas with the updated points array
                }
                break;
            }
        }
    } else {
        let clickedCircle = false;

        for (let i = 0; i < points.length; i++) {
            const point = points[i];
            const distance = Math.sqrt((x - point.x) ** 2 + (y - point.y) ** 2);

            if (distance <= 5) {
                // check if document.execCommand() is available before using it
                if (document.queryCommandSupported('copy')) {
                    const code = `<block  type="CreateVector" x="0" y="0"><value name="VALUE-0"><block type="Number"><field name="NUM">${point.xCoord}</field></block></value><value name="VALUE-1"><block type="Number"><field name="NUM">${point.yCoord}</field></block></value><value name="VALUE-2"><block type="Number"><field name="NUM">${point.zCoord}</field></block></value></block>`;
                    const temp = document.createElement('textarea');
                    temp.textContent = code;
                    document.body.appendChild(temp);
                    temp.select();
                    document.execCommand('copy');
                    document.body.removeChild(temp);
                    console.log('Text copied to clipboard');

                    const coords = `X: ${point.xCoord}, Y: ${point.yCoord}, Z: ${point.zCoord} - Copied to Clipboard`;
                    alert(coords);
                } else {
                    console.warn('Copy command is not available.');
                }

                clickedCircle = true;
                break;
            }
        }

        if (!clickedCircle) {
            const coords = prompt('Please enter the X, Y, and Z coordinates (separated by spaces):');
            const [xCoord, yCoord, zCoord] = coords.split(' ');
            points.push({ x, y, xCoord, yCoord, zCoord });

            context.beginPath();
            context.arc(x, y, 5, 0, 2 * Math.PI);
            context.fillStyle = 'red';
            context.fill();
        }
    }
});
  
function redrawCanvas() {
    // Draws the image
    context.drawImage(backgroundImage, 0, 0);
  
    // Draws the circles
    for (let i = 0; i < points.length; i++) {
      const point = points[i];
      context.beginPath();
      context.arc(point.x, point.y, 5, 0, 2 * Math.PI);
      context.fillStyle = 'red';
      context.fill();
    }
  }

  canvas.addEventListener('mousemove', function (event) {
    const x = event.offsetX;
    const y = event.offsetY;
    let circleHovered = false;
  
    for (let i = 0; i < points.length; i++) {
        const point = points[i];
        context.beginPath();
        context.arc(point.x, point.y, 5, 0, 2 * Math.PI);
      
        if (context.isPointInPath(x, y)) {
            context.fillStyle = '#18ff03';
            circleHovered = true;
        } else {
            context.fillStyle = 'red';
        }
        
        context.fill();
    }
  
    if (circleHovered) {
        canvas.style.cursor = 'pointer';
    } else {
        canvas.style.cursor = 'default';
    }
});

// Save Button Function
saveProjectBtn.addEventListener('click', async function () {
    context.drawImage(backgroundImage, 0, 0);
    const data = {
        points: points,
        image: canvas.toDataURL()
    };
    const json = JSON.stringify(data);
    const blob = new Blob([json], { type: 'application/json' });

    // Check if the browser supports the "showSaveFilePicker" method
    if ('showSaveFilePicker' in window) {
        const options = {
            suggestedName: `Map Coordinates.json`,
            types: [{
                description: 'JSON file',
                accept: { 'application/json': ['.json'] },
            }],
        };
        try {
            const handle = await window.showSaveFilePicker(options);
            const writable = await handle.createWritable();
            await writable.write(blob);
            await writable.close();
            console.log('File saved successfully!');
        } catch (err) {
            console.error(err);
        }
    } else {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Map Coordinates.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        console.log('File saved successfully!');
    }

    for (let i = 0; i < points.length; i++) {
        const point = points[i];
        context.beginPath();
        context.arc(point.x, point.y, 5, 0, 2 * Math.PI);
        context.fillStyle = 'red';
        context.fill();
      }
});

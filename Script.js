const newProjectBtn = document.getElementById('new-import');
const newSubmitBtn = document.getElementById('new-submit');
const openProjectBtn = document.getElementById('open-project');
const saveProjectBtn = document.getElementById('save-button');
var helpButton = document.getElementById("help-button");
var helpContent = document.getElementById("help-content");
var newButton = document.getElementById("new-button");
var newOptions = document.getElementById("new-options");
var hideSave = document.getElementById("hidesave");
const canvas = document.getElementById('my-canvas');
const context = canvas.getContext('2d');
const scrollX = canvas.scrollLeft;
const scrollY = canvas.scrollTop;
const backgroundImage = document.getElementById('background-image');
let points = [];
let projectName = '';
let menuOpen = false;
canvas.style.position = 'absolute';
canvas.style.top = backgroundImage.offsetTop + 'px';
canvas.style.left = backgroundImage.offsetLeft + 'px';
const gameModeSelect = document.getElementById('game-mode');
const mapSelect = document.getElementById('map');



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
            newOptions.style.display = "none";
            hideSave.style.display = "inline-block";
        };
    });
    // trigger a click event on the imageInput to open the file picker dialog
    imageInput.click();
});

// New Collection Submit button logic and configuration
newSubmitBtn.addEventListener('click', function () {
  points = [];
  const selectedGameMode = gameModeSelect.value;
  const selectedMap = mapSelect.value;
  const imagePath = "Map Images/" + selectedGameMode + "/" + selectedMap + ".png";
  const image = new Image();
  image.src = imagePath;

  image.onload = function () {
    canvas.width = image.width;
    canvas.height = image.height;
    backgroundImage.src = image.src;
    redrawCanvas();
    newOptions.style.display = "none";
    hideSave.style.display = "inline-block";
  };
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
                hideSave.style.display = "inline-block";
            };
            image.src = data.image;
        };
    };
    input.click();
});

canvas.addEventListener('click', function (event) {
    const x = event.offsetX;
    const y = event.offsetY;
    const scrollX = canvas.scrollLeft;
    const scrollY = canvas.scrollTop;
    const truex = event.clientX + window.scrollX;
    const truey = event.clientY + window.scrollY;
  
    if (event.ctrlKey) {
      for (let i = 0; i < points.length; i++) {
        const point = points[i];
        const distance = Math.sqrt((x - point.x) ** 2 + (y - point.y) ** 2);
        if (distance <= 6) {
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
  
        if (distance <= 6) {
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
  
      if (!clickedCircle && !menuOpen) {
        menuOpen = true;
        const lastSelectedValue = localStorage.getItem('lastSelectedValue');
        const style = document.createElement('style');
        style.textContent = `
          option:checked {
            background-color: transparent;
            color: inherit;
          }

        `;
        document.head.appendChild(style);

        const inputContainer = document.createElement('div');
        inputContainer.style.position = 'absolute';
        inputContainer.style.top = `${truey}px`;
        inputContainer.style.left = `${truex}px`;
        inputContainer.style.backgroundColor = '#292929';
        inputContainer.style.border = '3px solid #141414';
        inputContainer.style.padding = '9px';
        console.log('scrollX:', scrollX, 'scrollY:', scrollY);
      
        const inputLabel = document.createElement('label');
        inputLabel.textContent = 'Enter Coordinates: ';
        const inputField = document.createElement('input');
        inputField.type = 'text';
      
        const selectLabel = document.createElement('label');
        selectLabel.textContent = 'Coordinate Type: ';
        selectLabel.style.lineHeight = "2";
        const selectField = document.createElement('select');
        selectField.style.fontWeight = "bold";
        const option1 = document.createElement('option');
        option1.value = '#ff0000';
        option1.textContent = 'Spawn';
        option1.style.backgroundColor = '#ff3526';
        option1.style.fontWeight = "bold";
        const option2 = document.createElement('option');
        option2.value = '#eaff00';
        option2.textContent = 'MCOM';
        option2.style.backgroundColor = '#eaff00';
        option2.style.fontWeight = "bold";
        const option3 = document.createElement('option');
        option3.value = '#03f7ff';
        option3.textContent = 'Other';
        option3.style.backgroundColor = '#03f7ff';
        option3.style.fontWeight = "bold";
      
        selectField.appendChild(option1);
        selectField.appendChild(option2);
        selectField.appendChild(option3);

        if (lastSelectedValue) {
          selectField.value = lastSelectedValue;
        }

        selectField.style.backgroundColor = selectField.value
      
        selectField.addEventListener('change', function() {
          selectField.style.backgroundColor = selectField.value;
          localStorage.setItem('lastSelectedValue', selectField.value);
        });
      
        const submitButton = document.createElement('button');
        submitButton.textContent = 'Submit';
        submitButton.style.backgroundColor = "#00ffff";
        submitButton.style.fontFamily = "BatlefieldFont";
        submitButton.style.fontSize = "18px";
        submitButton.style.marginTop = "5px";
        submitButton.addEventListener('click', function () {
          const xCoord = inputField.value.split(' ')[0];
          const yCoord = inputField.value.split(' ')[1];
          const zCoord = inputField.value.split(' ')[2];
          const selectedItem = selectField.value;
      
          points.push({ x, y, xCoord, yCoord, zCoord, selectedItem });
      
          context.beginPath();
          context.arc(x, y, 6, 0, 2 * Math.PI);
          context.fillStyle = selectedItem;
          context.fill();
      
          inputContainer.remove();
          menuOpen = false;
        });

        inputField.addEventListener('keydown', function(event) {
          if (event.key === 'Enter') {
            event.preventDefault(); // prevent the default behavior of the Enter key
            submitButton.click(); // simulate a click event on the Submit button
          }
        });
      
        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Cancel';
        cancelButton.style.backgroundColor = "#00ffff";
        cancelButton.style.fontFamily = "BatlefieldFont";
        cancelButton.style.fontSize = "18px";
        cancelButton.style.marginTop = "5px";
        cancelButton.style.marginLeft = "10px";
        cancelButton.addEventListener('click', function () {
          inputContainer.remove();
          menuOpen = false;
        });
      
        inputContainer.appendChild(inputLabel);
        inputContainer.appendChild(inputField);
        inputContainer.appendChild(document.createElement('br'));
        inputContainer.appendChild(selectLabel);
        inputContainer.appendChild(selectField);
        inputContainer.appendChild(document.createElement('br'));
        inputContainer.appendChild(submitButton);
        inputContainer.appendChild(cancelButton);
      
        document.body.appendChild(inputContainer);

        inputField.focus();
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
      context.arc(point.x, point.y, 6, 0, 2 * Math.PI);
      context.fillStyle = point.selectedItem;
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
        context.arc(point.x, point.y, 6, 0, 2 * Math.PI);
      
        if (context.isPointInPath(x, y)) {
            context.fillStyle = '#18ff03';
            circleHovered = true;
        } else {
            context.fillStyle = point.selectedItem;
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
        context.arc(point.x, point.y, 6, 0, 2 * Math.PI);
        context.fillStyle = point.selectedItem;
        context.fill();
      }
});

helpButton.addEventListener("click", function() {
    if (helpContent.style.display === "none") {
      helpContent.style.display = "block";
    } else {
      helpContent.style.display = "none";
    }
  });

  
newButton.addEventListener("click", function() {
  if (newOptions.style.display === "none") {
    newOptions.style.display = "block";
  } else {
    newOptions.style.display = "none";
  }
});

gameModeSelect.addEventListener('change', function() {
  const selectedGameMode = gameModeSelect.value;
  mapSelect.innerHTML = '';

  if (selectedGameMode === 'select') {
    const mapOptions = ['Please select a game mode'];
    for (const mapOption of mapOptions) {
      const optionElement = document.createElement('option');
      optionElement.value = mapOption;
      optionElement.textContent = mapOption;
      mapSelect.appendChild(optionElement);
    }
  } else if (selectedGameMode === 'conquest') {
    const mapOptions = ['Arica Harbor Medium', 'Arica Harbor Small', 'Breakaway Small', "Caspian Border Medium", "Caspian Border Small", "Discarded Small", "Exposure Medium", "Manifest Medium", "Orbital Medium", "Renewal Medium", "Renewal Small", "Spearhead Medium", "Stranded Medium", "Stranded Small"];
    for (const mapOption of mapOptions) {
      const optionElement = document.createElement('option');
      optionElement.value = mapOption;
      optionElement.textContent = mapOption;
      mapSelect.appendChild(optionElement);
    }
  } else if (selectedGameMode === 'tdm') {
    const mapOptions = ['Coming Soon...'];
    for (const mapOption of mapOptions) {
      const optionElement = document.createElement('option');
      optionElement.value = mapOption;
      optionElement.textContent = mapOption;
      mapSelect.appendChild(optionElement);
    }
  } else if (selectedGameMode === 'ffa') {
    const mapOptions = ['Coming Soon...'];
    for (const mapOption of mapOptions) {
      const optionElement = document.createElement('option');
      optionElement.value = mapOption;
      optionElement.textContent = mapOption;
      mapSelect.appendChild(optionElement);
    }
  }
});

mapSelect.addEventListener('change', function() {
  const selectedGameMode = gameModeSelect.value;
  const selectedMapOption = mapSelect.value;
  const imagePath = `Map Images/${selectedGameMode}/${selectedMapOption}.png`;
});

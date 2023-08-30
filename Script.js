const newProjectBtn = document.getElementById("new-upload");
const newSubmitBtn = document.getElementById("new-submit");
const loadSubmitBtn = document.getElementById("load-submit");
const openProjectBtn = document.getElementById("open-project");
const saveProjectBtn = document.getElementById("save-button");
const loadProjectBtn = document.getElementById("load-button");
const importBtn = document.getElementById("import-button");
var helpButton = document.getElementById("help-button");
var listButton = document.getElementById("list-button");
var loadButton = document.getElementById("load-button");
var helpContent = document.getElementById("help-content");
var newButton = document.getElementById("new-button");
var newOptions = document.getElementById("new-options");
var loadOptions = document.getElementById("load-options");
var credits = document.getElementById("credits");
var newSubmit = document.getElementById("new-submit");
var hideSave = document.getElementById("hidesave");
var listContainer = document.getElementById("pointListContainer");
var loadSubmit = document.getElementById("load-submit");
var openProject = document.getElementById("open-project");
var saveButton = document.getElementById("save-button");
var importButton = document.getElementById("import-button");
var loadButtonContainer = document.querySelector(".load-button-container");
var canvasWrapper = document.getElementById("canvas-wrapper");
const canvas = document.getElementById("my-canvas");
const context = canvas.getContext("2d");
const scrollX = canvas.scrollLeft;
const scrollY = canvas.scrollTop;
const backgroundImage = document.getElementById("background-image");
let points = [];
let projectName = "";
let menuOpen = false;
let errorAdded = false;
canvas.style.position = "absolute";
canvas.style.top = backgroundImage.offsetTop + "px";
canvas.style.left = backgroundImage.offsetLeft + "px";
const gameModeSelect = document.getElementById("game-mode");
const saveSelect = document.getElementById("game-mode-save");
const mapSelect = document.getElementById("map");
const mapSaveSelect = document.getElementById("map-save");
const pointList = document.getElementById("pointList");
canvas.width = "0px";
canvas.height = "0px";
let drag = false;
const delta = 10;
let startX;
let startY;

// New Button logic and configuration
newProjectBtn.addEventListener("click", function () {
  const imageInput = document.createElement("input");
  imageInput.type = "file";
  imageInput.accept = "image/*";
  imageInput.addEventListener("change", function (event) {
    const image = new Image();
    image.src = URL.createObjectURL(event.target.files[0]);

    image.onload = function () {
      points = [];
      canvas.width = image.width;
      canvas.height = image.height;
      backgroundImage.src = image.src;
      redrawCanvas();
      updateMenuButtons()
      newOptions.style.display = "none";
      newButton.style.backgroundColor = "cyan";
    };
  });
  // trigger a click event on the imageInput to open the file picker dialog
  imageInput.click();
});

// New Collection Submit button logic and configuration
newSubmitBtn.addEventListener("click", function () {
  newSubmit.style.backgroundColor = "rgb(148, 148, 148)";
  newSubmit.innerHTML = "Loading";
  points = [];
  const selectedGameMode = gameModeSelect.value;
  const selectedMap = mapSelect.value;
  const supportedExtensions = ["png", "jpg", "jpeg"]; // List of supported file extensions

  // Find the appropriate extension from the supportedExtensions array
  const selectedExtension = supportedExtensions.find((ext) =>
    checkImageExists(`Map Images/${selectedGameMode}/${selectedMap}.${ext}`)
  );

  if (selectedExtension) {
    const imagePath = `Map Images/${selectedGameMode}/${selectedMap}.${selectedExtension}`;
    const image = new Image();
    image.src = imagePath;

    image.onerror = function () {
      newSubmit.innerHTML = "Submit";
      newSubmit.style.backgroundColor = "rgb(74, 74, 74)";
    };

    image.onload = function () {
      canvas.width = image.width;
      canvas.height = image.height;
      backgroundImage.src = image.src;
      redrawCanvas();
      updateMenuButtons()
      newOptions.style.display = "none";
      newButton.style.backgroundColor = "cyan";
      newSubmit.innerHTML = "Submit";
      newSubmit.style.backgroundColor = "rgb(74, 74, 74)";
    };
  } else {
    // Handle the case when the image file is not found with any of the supported extensions.
    console.log("Image not found for the selected options.");
    newSubmit.innerHTML = "Submit";
    newSubmit.style.backgroundColor = "rgb(74, 74, 74)";
  }
});

// Load file from collection and drop down list
loadSubmitBtn.addEventListener("click", function () {
  loadSubmit.style.backgroundColor = "rgb(148, 148, 148)";
  loadSubmit.innerHTML = "Loading";
  const selectedSave = saveSelect.value;
  const selectedSaveOption = mapSaveSelect.value;
  fetch(`Map Coordinate Files/${selectedSave}/${selectedSaveOption}.json`)
    .then((response) => response.json())
    .then((data) => {
      const image = new Image();
      image.onload = function () {
        canvas.width = image.width;
        canvas.height = image.height;
        backgroundImage.src = image.src;
        points = data.points;
        redrawCanvas();
        updateMenuButtons()
        loadOptions.style.display = "none";
        loadButton.style.backgroundColor = "cyan";
        loadSubmit.innerHTML = "Submit";
        loadSubmit.style.backgroundColor = "rgb(74, 74, 74)";
      };
      image.src = data.image;
    })
    .catch((error) => {
      console.error(error);
      loadSubmit.innerHTML = "Submit";
      loadSubmit.style.backgroundColor = "rgb(74, 74, 74)";
    });
});

// Load Button logic and configuration
openProjectBtn.addEventListener("click", function () {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "application/json";
  let isAborted = false;
  input.onchange = function () {
    context.clearRect(0, 0, canvas.width, canvas.height);
    const file = this.files[0];
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function () {
      if (!isAborted) {
        points = [];
        const data = JSON.parse(reader.result);
        const image = new Image();
        image.onload = function () {
          canvas.width = image.width;
          canvas.height = image.height;
          backgroundImage.src = image.src;
          points = data.points;
          redrawCanvas();
          updateMenuButtons()
          loadOptions.style.display = "none";
          hideSave.style.display = "inline-block";
          loadButton.style.backgroundColor = "cyan";
        };
        image.src = data.image;
      }
    };
  };
  input.click();
});

// Import coordinates from save file
importBtn.addEventListener("click", function () {
  importButton.style.backgroundColor = "rgb(0, 155, 155)";
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "application/json";
  let isAborted = false;
  input.onchange = function () {
    const file = this.files[0];
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function () {
      if (!isAborted) {
        const loadedData = JSON.parse(reader.result);
        loadedData.points.forEach(loadedPoint => {
          const isDuplicate = points.some(existingPoint => {
            return (
              existingPoint.x === loadedPoint.x &&
              existingPoint.y === loadedPoint.y
            );
          });

          if (!isDuplicate) {
            points.push(loadedPoint);
          }
        });
        redrawCanvas();
        updateMenuButtons();
      }
      importButton.style.backgroundColor = "cyan";
    };
    reader.onerror = function () {
      importButton.style.backgroundColor = "cyan";
    };
  };
  input.oncancel = function () {
    importButton.style.backgroundColor = "cyan";
  };

  input.click();
});


canvas.addEventListener("mousedown", function (event) {
    startX = event.pageX;
    startY = event.pageY;
});

canvas.addEventListener("mouseup", function (event) {
  const diffX = Math.abs(event.pageX - startX);
  const diffY = Math.abs(event.pageY - startY);
    if (diffX < delta && diffY < delta) {
      // click event
      drag = false
    }else{
      drag = true
    }
});

canvas.addEventListener("touchstart", function (event) {
  startX = event.touches[0].clientX;
  startY = event.touches[0].clientY;
});

canvas.addEventListener("touchmove", function (event) {
event.preventDefault(); // Prevent scrolling
const diffX = Math.abs(event.touches[0].clientX - startX);
const diffY = Math.abs(event.touches[0].clientY - startY);
  if (diffX > delta || diffY > delta) {
    // drag event
    drag = true;
  }
});

canvas.addEventListener("touchend", function (event) {
const diffX = Math.abs(event.changedTouches[0].clientX - startX);
const diffY = Math.abs(event.changedTouches[0].clientY - startY);
  if (diffX < delta && diffY < delta) {
    // tap event
    drag = false;
  }
});

canvas.addEventListener("click", handleClick);
canvas.addEventListener("touchend", handleClick);

function handleClick(event) {
  if(!drag){
    let x, y;
    if (event.type === 'touchend') {
      const touch = event.changedTouches[0];
      var rect = canvas.getBoundingClientRect();
      var scaleX = canvas.width / rect.width;
      var scaleY = canvas.height / rect.height;
      x = (touch.clientX - rect.left) * scaleX;
      y = (touch.clientY - rect.top) * scaleY;
    } else {
      x = event.offsetX;
      y = event.offsetY;
    }
    const scrollX = canvas.scrollLeft;
    const scrollY = canvas.scrollTop;
    const truex = event.clientX + window.scrollX || event.changedTouches[0].pageX + window.scrollX;
    const truey = event.clientY + window.scrollY || event.changedTouches[0].pageY + window.scrollY;
    let clickedCircle = false;
    console.log("Touch event coordinates: ", x, y);
    console.log("Canvas offset values: ", canvas.offsetLeft, canvas.offsetTop);
    for (let i = 0; i < points.length; i++) {
      const point = points[i];
      const distance = Math.sqrt((x - point.x) ** 2 + (y - point.y) ** 2);

      if (distance <= 6 && !menuOpen) {
        selectedPointIndex = i;
        for (let j = 0; j < points.length; j++) {
          const li = document.getElementById(`li-${j}`);
          li.style.backgroundColor = j === selectedPointIndex ? "#27941f" : "#000000";
        }
        for (let i = 0; i < points.length; i++) {
          context.beginPath();
          context.arc(point.x, point.y, 6, 0, 2 * Math.PI);
            defaultlistcolour()
            context.fillStyle = "#18ff03";
            context.fill();
        }
        const li = document.getElementById(`li-${selectedPointIndex}`);
        console.log(li);
        li.style.backgroundColor = "#27941f";
        li.scrollIntoView({ behavior: "smooth", block: "center", scrollBehavior:"100ms"});

        menuOpen = true;
        // check if document.execCommand() is available before using it
        copyToClipboard(point);
        clickedCircle = true;
        const menu = document.createElement("div");
        menu.style.position = "absolute";
        menu.style.top = "50%";
        menu.style.left = "50%";
        menu.style.transform = "translate(-50%, -50%)";
        menu.style.backgroundColor = "#292929";
        menu.style.border = "3px solid #141414";
        menu.style.padding = "14px";
        menu.style.display = "flex";
        menu.style.flexDirection = "column";
        menu.style.alignItems = "center";
        menu.style.justifyContent = "center";
        menu.style.zIndex = 2

        const coordinatesLabel = document.createElement("label");
        coordinatesLabel.style.color = "#00ffff";
        coordinatesLabel.style.marginBottom = "14px";
        coordinatesLabel.textContent = "Copied to Clipboard:";

        const coordinatesField = document.createElement("input");
        coordinatesField.type = "text";
        coordinatesField.value = `X: ${point.xCoord}, Y: ${point.yCoord}, Z: ${point.zCoord}`;
        coordinatesField.style.width = "100%";
        coordinatesField.style.marginBottom = "9px";
        coordinatesField.style.textAlign = "center";
        coordinatesField.style.backgroundColor = "#141414";
        coordinatesField.style.color = "#fff";
        coordinatesField.style.border = "none";
        coordinatesField.style.padding = "9px";
        coordinatesField.style.borderRadius = "3px";
        coordinatesField.readOnly = true;

        const noteLabel = document.createElement("label");
        noteLabel.style.color = "#ffffff";
        noteLabel.style.marginBottom = "14px";
        noteLabel.style.userSelect = "text";
        noteLabel.textContent = `${point.note}`;

        const buttonContainer = document.createElement("div");
        buttonContainer.style.display = "flex";
        buttonContainer.style.width = "100%";
        buttonContainer.style.justifyContent = "space-between";

        const closeButton = document.createElement("button");
        closeButton.textContent = "Close";
        closeButton.style.backgroundColor = "#00ffff";
        closeButton.style.fontFamily = "BatlefieldFont";
        closeButton.style.fontSize = "18px";
        closeButton.style.marginTop = "5px";
        closeButton.style.borderRadius = "4px";
        closeButton.style.display = "inline-block";
        closeButton.style.border = "3px";
        closeButton.addEventListener("click", function () {
          menu.remove();
          menuOpen = false;
          defaultlistcolour()
          redrawCanvas()
        });

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.style.backgroundColor = "#ff3838";
        deleteButton.style.fontFamily = "BatlefieldFont";
        deleteButton.style.fontSize = "18px";
        deleteButton.style.marginTop = "5px";
        deleteButton.style.borderRadius = "4px";
        deleteButton.style.display = "inline-block";
        deleteButton.style.border = "3px";
        deleteButton.addEventListener("click", function () {
          // Create a new menu element
          const confirmMenu = document.createElement("div");
          confirmMenu.style.position = "absolute";
          confirmMenu.style.top = "0";
          confirmMenu.style.left = "0";
          confirmMenu.style.width = "100%";
          confirmMenu.style.height = "100%";
          confirmMenu.style.backgroundColor = "rgba(0, 0, 0, 0.85)";
          confirmMenu.style.display = "flex";
          confirmMenu.style.justifyContent = "center";
          confirmMenu.style.alignItems = "center";
          confirmMenu.style.flexDirection = "column";
          confirmMenu.style.backdropFilter = "blur(10px)";
          confirmMenu.style.zIndex = 3

          // Create a message container element
          const messageContainer = document.createElement("div");
          messageContainer.style.textAlign = "center";
          messageContainer.style.marginBottom = "20px";

          // Create a message element
          const message = document.createElement("div");
          message.textContent = "Are you sure you want to delete?";
          message.style.fontFamily = "BatlefieldFont";
          message.style.fontSize = "24px";
          message.style.color = "#fff";

          // Create a confirm button
          const confirmButton = document.createElement("button");
          confirmButton.textContent = "Yes";
          confirmButton.style.backgroundColor = "#ff3838";
          confirmButton.style.fontFamily = "BatlefieldFont";
          confirmButton.style.fontSize = "24px";
          confirmButton.style.borderRadius = "4px";
          confirmButton.style.border = "3px";
          confirmButton.style.marginRight = "10px";
          confirmButton.style.padding = "2px 13px";
          confirmButton.addEventListener("click", function () {
            // User confirmed deletion, perform the deletion process
            points.splice(i, 1);
            redrawCanvas();
            confirmMenu.remove();
            menu.remove();
            menuOpen = false;
            defaultlistcolour()
          });

          // Create a cancel button
          const cancelButton = document.createElement("button");
          cancelButton.textContent = "No";
          cancelButton.style.backgroundColor = "#4CAF50";
          cancelButton.style.fontFamily = "BatlefieldFont";
          cancelButton.style.fontSize = "24px";
          cancelButton.style.borderRadius = "4px";
          cancelButton.style.border = "3px";
          cancelButton.style.padding = "2px 13px";
          cancelButton.addEventListener("click", function () {
            // User canceled deletion, remove the confirm menu
            confirmMenu.remove();
          });

          // Create a button container
          const buttonContainer = document.createElement("div");
          buttonContainer.style.display = "flex";
          buttonContainer.style.justifyContent = "center";
          buttonContainer.style.alignItems = "center";
          buttonContainer.style.flexDirection = "row"; // Add this line to display buttons horizontally
          buttonContainer.style.gap = "1.5rem"

          // Add the message and buttons to their respective containers
          messageContainer.appendChild(message);
          buttonContainer.appendChild(confirmButton);
          buttonContainer.appendChild(cancelButton);
          confirmMenu.appendChild(messageContainer);
          confirmMenu.appendChild(buttonContainer);

          // Add the confirm menu to the page
          document.body.appendChild(confirmMenu);
        });

        buttonContainer.appendChild(deleteButton);
        buttonContainer.appendChild(closeButton);

        menu.appendChild(coordinatesLabel);
        menu.appendChild(coordinatesField);
        menu.appendChild(noteLabel);
        menu.appendChild(buttonContainer);

        document.body.appendChild(menu);
        
        break;
      }
    }

    if (!clickedCircle && !menuOpen) {
      menuOpen = true;
      const lastSelectedValue = localStorage.getItem("lastSelectedValue");
      const style = document.createElement("style");
      style.textContent = `
            option:checked {
              background-color: transparent;
              color: inherit;
            }
  
          `;
      document.head.appendChild(style);

      const inputContainer = document.createElement("div");
      inputContainer.style.position = "absolute";
      inputContainer.style.top = `${truey}px`;
      inputContainer.style.left = `${truex}px`;
      inputContainer.style.backgroundColor = "#292929";
      inputContainer.style.border = "3px solid #141414";
      inputContainer.style.padding = "9px";
      inputContainer.style.zIndex = 2
      console.log("scrollX:", scrollX, "scrollY:", scrollY);

      const inputLabel = document.createElement("label");
      inputLabel.textContent = "Enter Coordinates: ";
      const inputField = document.createElement("input");
      inputField.type = "text";

      const descriptionLabel = document.createElement("label");
      descriptionLabel.textContent = "Optional Note: ";
      const descriptionField = document.createElement("input");
      descriptionField.type = "text";
      descriptionField.style.marginLeft = "37px";

      const selectLabel = document.createElement("label");
      selectLabel.textContent = "Coordinate Type: ";
      selectLabel.style.lineHeight = "2";
      const selectField = document.createElement("select");
      selectField.style.fontWeight = "bold";
      selectField.style.marginLeft = "16px";

      const options = [
        { value: "#ff0000", label: "Spawn", backgroundColor: "#ff3526" },
        { value: "#eaff00", label: "MCOM", backgroundColor: "#eaff00" },
        { value: "#03f7ff", label: "Other", backgroundColor: "#03f7ff" },
      ];

      options.forEach((option) => {
        const optionElement = document.createElement("option");
        optionElement.value = option.value;
        optionElement.textContent = option.label;
        optionElement.style.backgroundColor = option.backgroundColor;
        optionElement.style.color = "black";
        optionElement.style.fontWeight = "bold";
        selectField.appendChild(optionElement);
      });

      if (lastSelectedValue) {
        selectField.value = lastSelectedValue;
      }

      selectField.style.backgroundColor = selectField.value;
      selectField.style.color = "black";

      selectField.addEventListener("change", function () {
        selectField.style.backgroundColor = selectField.value;
        localStorage.setItem("lastSelectedValue", selectField.value);
      });

      const submitButton = document.createElement("button");
      submitButton.textContent = "Submit";
      submitButton.style.backgroundColor = "#00ffff";
      submitButton.style.fontFamily = "BatlefieldFont";
      submitButton.style.fontSize = "18px";
      submitButton.style.marginTop = "15px";
      submitButton.style.borderRadius = "4px";
      submitButton.style.border = "3px";
      submitButton.addEventListener("click", function () {
        const [xCoord, yCoord, zCoord] = inputField.value.split(" ");
        const selectedItem = selectField.value;
        const note = descriptionField.value

        if (
          !xCoord ||
          !yCoord ||
          !zCoord ||
          isNaN(xCoord) ||
          isNaN(yCoord) ||
          isNaN(zCoord)
        ) {
          // check if any input is empty or contains non-numeric characters
          if (!errorAdded) {
            // check if error has already been added
            const error = document.createElement("div");
            error.textContent = "Please enter valid coordinates";
            error.style.color = "red";
            error.style.marginTop = "15px";
            inputContainer.appendChild(error);
            errorAdded = true; // set errorAdded to true
          }
          return; // stop the function from continuing
        }

        points.push({ x, y, xCoord, yCoord, zCoord, selectedItem, note });

        context.beginPath();
        context.arc(x, y, 6, 0, 2 * Math.PI);
        context.fillStyle = selectedItem;
        context.fill();

        inputContainer.remove();
        menuOpen = false;
        errorAdded = false;

        updatePointList()

      });

      inputField.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
          event.preventDefault(); // prevent the default behavior of the Enter key
          submitButton.click(); // simulate a click event on the Submit button
        }
      });

      const cancelButton = document.createElement("button");
      cancelButton.textContent = "Cancel";
      cancelButton.style.backgroundColor = "#00ffff";
      cancelButton.style.fontFamily = "BatlefieldFont";
      cancelButton.style.fontSize = "18px";
      cancelButton.style.marginTop = "15px";
      cancelButton.style.marginLeft = "10px";
      cancelButton.style.borderRadius = "4px";
      cancelButton.style.border = "3px";
      cancelButton.addEventListener("click", function () {
        inputContainer.remove();
        menuOpen = false;
        errorAdded = false;
      });

      inputContainer.appendChild(inputLabel);
      inputContainer.appendChild(inputField);
      inputContainer.appendChild(document.createElement("br"));
      inputContainer.appendChild(selectLabel);
      inputContainer.appendChild(selectField);
      inputContainer.appendChild(document.createElement("br"));
      inputContainer.appendChild(descriptionLabel);
      inputContainer.appendChild(descriptionField);
      inputContainer.appendChild(document.createElement("br"));
      inputContainer.appendChild(submitButton);
      inputContainer.appendChild(cancelButton);

      document.body.appendChild(inputContainer);

      inputField.focus();
    }
  }
};

// function to handle copying point data to the clipboard

async function copyToClipboard(point) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(`<block  type="CreateVector" x="0" y="0"><value name="VALUE-0"><block type="Number"><field name="NUM">${point.xCoord}</field></block></value><value name="VALUE-1"><block type="Number"><field name="NUM">${point.yCoord}</field></block></value><value name="VALUE-2"><block type="Number"><field name="NUM">${point.zCoord}</field></block></value></block>`).then(
      () => {
        console.log(`X: ${point.xCoord}, Y: ${point.yCoord}, Z: ${point.zCoord} - Copied to Clipboard`);
      },
      () => {
        console.warn('Copy command failed.');
      }
    )
  } else {
    console.warn('Clipboard API not supported.');
  }
}

function redrawCanvas() {
  credits.style.display = "none";
  document.getElementById("background-placeholer").style.display = "none";
  // Draws the image
  context.drawImage(backgroundImage, 0, 0);
  updatePointList();

  // Draws the circles
  for (let i = 0; i < points.length; i++) {
    const point = points[i];
    context.beginPath();
    context.arc(point.x, point.y, 6, 0, 2 * Math.PI);
    context.fillStyle = point.selectedItem;
    context.fill();
  }
}

function defaultlistcolour(){
  const allListItems = document.querySelectorAll('li');
  
  allListItems.forEach(li => {
    li.style.backgroundColor = 'black';
  });
  }

function updateMenuButtons(){
  hideSave.style.display = "inline-block";
  loadButtonContainer.style.paddingRight = "0px";
  canvasWrapper.style.display = "inline-block"
}

canvas.addEventListener("mousemove", function (event) {
  
  const x = event.offsetX;
  const y = event.offsetY;
  let circleHovered = false;

  if (!menuOpen){
  for (let i = 0; i < points.length; i++) {
    const point = points[i];
    context.beginPath();
    context.arc(point.x, point.y, 6, 0, 2 * Math.PI);

    if (context.isPointInPath(x, y)) {
      defaultlistcolour()
      context.fillStyle = "#18ff03";
      circleHovered = true;
      const li = document.getElementById(`li-${i}`);
      
      li.style.backgroundColor = "#27941f";
      li.scrollIntoView({ behavior: "smooth", block: "center", scrollBehavior:"100ms"});
    } else {
      context.fillStyle = point.selectedItem;
      const li = document.getElementById(`li-${i}`);
      
    }

    context.fill();
  }
}

  if (circleHovered) {
    canvas.style.cursor = "pointer";
  } else {
    canvas.style.cursor = "default";
  }
});

// Save Button Function
saveProjectBtn.addEventListener("click", async function () {
  saveButton.style.backgroundColor = "rgb(0, 155, 155)";
  await new Promise(resolve => setTimeout(resolve, 10));
  context.drawImage(backgroundImage, 0, 0);
  
  // Create a new canvas for compressing the image as JPEG
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;
  const tempContext = tempCanvas.getContext("2d");
  tempContext.drawImage(backgroundImage, 0, 0);

  const jpegDataUrl = tempCanvas.toDataURL("image/jpeg", 0.95);

  const data = {
    points: points,
    image: jpegDataUrl,
  };
  const json = JSON.stringify(data);
  const blob = new Blob([json], { type: "application/json" });

  // Check if the browser supports the "showSaveFilePicker" method
  if ("showSaveFilePicker" in window) {
    const options = {
      suggestedName: `Map Coordinates.json`,
      types: [
        {
          description: "JSON file",
          accept: { "application/json": [".json"] },
        },
      ],
    };
    try {
      const handle = await window.showSaveFilePicker(options);
      const writable = await handle.createWritable();
      await writable.write(blob);
      await writable.close();
      console.log("File saved successfully!");
    } catch (err) {
      console.error(err);
    }
  } else {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Map Coordinates.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    console.log("File saved successfully!");
  }

  for (let i = 0; i < points.length; i++) {
    const point = points[i];
    context.beginPath();
    context.arc(point.x, point.y, 6, 0, 2 * Math.PI);
    context.fillStyle = point.selectedItem;
    context.fill();
  }
  saveButton.style.backgroundColor = "cyan";
});

helpButton.addEventListener("click", function () {
  if (helpContent.style.display === "none") {
    closebuttons()
    helpContent.style.display = "block";
    helpContent.style.height = "0";
    helpContent.style.height = helpContent.scrollHeight + "px";
    helpButton.style.backgroundColor = "rgb(161, 117, 0)";
  } else {
    closebuttons()
  }
});

listButton.addEventListener("click", function () {
  if (points.length > 0) {
  if (listContainer.style.display === "none") {
    closebuttons()
    listContainer.style.display = "block";
    listButton.style.backgroundColor = "rgb(0, 155, 155)";
  } else {
    closebuttons()
  }
}
});

newButton.addEventListener("click", function () {
  if (newOptions.style.display === "none") {
    closebuttons()
    newOptions.style.display = "block";
    newOptions.style.height = "0";
    newOptions.style.height = newOptions.scrollHeight + "px";
    newButton.style.backgroundColor = "rgb(0, 155, 155)";
  } else {
    closebuttons()
  }
});

loadButton.addEventListener("click", function () {
  if (loadOptions.style.display === "none") {
    closebuttons()
    loadOptions.style.display = "block";
    loadOptions.style.height = "0";
    loadOptions.style.height = loadOptions.scrollHeight + "px";
    loadButton.style.backgroundColor = "rgb(0, 155, 155)";
  } else {
    closebuttons()
  }
});

function closebuttons() {
  loadOptions.style.height = "0";
  loadOptions.style.display = "none";
  newOptions.style.height = "0";
  newOptions.style.display = "none";
  helpContent.style.display = "none";
  helpContent.style.height = "0";
  listContainer.style.display = "none";
  loadButton.style.backgroundColor = "cyan";
  newButton.style.backgroundColor = "cyan";
  helpButton.style.backgroundColor = "rgb(255, 174, 0)";
  listButton.style.backgroundColor = "cyan";
}

gameModeSelect.addEventListener("change", function () {
  const selectedGameMode = gameModeSelect.value;
  mapSelect.innerHTML = "";

  if (selectedGameMode === "select") {
    const mapOptions = ["Please select a game mode"];
    for (const mapOption of mapOptions) {
      const optionElement = document.createElement("option");
      optionElement.value = mapOption;
      optionElement.textContent = mapOption;
      mapSelect.appendChild(optionElement);
    }
  } else if (selectedGameMode === "Conquest") { //List of Map Image Files - Update manually
    const mapOptions = [
      "Arica Harbor Medium",
      "Arica Harbor Small",
      "Breakaway Small",
      "Caspian Border Medium",
      "Caspian Border Small",
      "Discarded Small",
      "Exposure Medium",
      "Flashpoint Medium",
      "Manifest Medium",
      "Orbital Medium",
      "Reclaimed Small",
      "Renewal Medium",
      "Renewal Small",
      "Spearhead Medium",
      "Stranded Medium",
      "Stranded Small",
    ];
    for (const mapOption of mapOptions) {
      const optionElement = document.createElement("option");
      optionElement.value = mapOption;
      optionElement.textContent = mapOption;
      mapSelect.appendChild(optionElement);
    }
  } else if (selectedGameMode === "TDM") { //List of Map Image Files - Update manually
    const mapOptions = [
      "Breakaway Large",
      "Exposure Large-Medium",
      "Exposure Small",
      "Renewal Large",
      "Renewal Medium-Small",
      "Stranded",
    ];
    for (const mapOption of mapOptions) {
      const optionElement = document.createElement("option");
      optionElement.value = mapOption;
      optionElement.textContent = mapOption;
      mapSelect.appendChild(optionElement);
    }
  } else if (selectedGameMode === "FFA") { //List of Map Image Files - Update manually
    const mapOptions = [
      "Exposure",
      "Renewal",
      "Stranded",
    ];
    for (const mapOption of mapOptions) {
      const optionElement = document.createElement("option");
      optionElement.value = mapOption;
      optionElement.textContent = mapOption;
      mapSelect.appendChild(optionElement);
    }
  }
});

mapSelect.addEventListener("change", function () {
  const selectedGameMode = gameModeSelect.value;
  const selectedMapOption = mapSelect.value;
  const supportedExtensions = ["png", "jpg", "jpeg"]; // List of supported file extensions

  // Find the appropriate extension from the supportedExtensions array
  const selectedExtension = supportedExtensions.find((ext) =>
    checkImageExists(`Map Images/${selectedGameMode}/${selectedMapOption}.${ext}`)
  );

  // If a valid extension is found, set the imagePath accordingly
  if (selectedExtension) {
    const imagePath = `Map Images/${selectedGameMode}/${selectedMapOption}.${selectedExtension}`;
  } else {
    console.log("Image not found for the selected options.");
  }
});

// Helper function to check if the image file exists
function checkImageExists(imagePath) {
  const http = new XMLHttpRequest();
  http.open("HEAD", imagePath, false);
  http.send();
  return http.status !== 404;
}
saveSelect.addEventListener("change", function () {
  const selectedSave = saveSelect.value;
  mapSaveSelect.innerHTML = "";

  if (selectedSave === "select") {
    const mapSaveOptions = ["Please select a game mode"];
    for (const mapSaveOption of mapSaveOptions) {
      const optionElement = document.createElement("option");
      optionElement.value = mapSaveOption;
      optionElement.textContent = mapSaveOption;
      mapSaveSelect.appendChild(optionElement);
    }
  } else if (selectedSave === "Conquest") { //List of Save Files - Update manually
    const mapSaveOptions = [
      "Breakaway Small",
      "Stranded Small",
      "Stranded Medium",
      "Renewal Small",
      "Renewal Medium",
    ];
    for (const mapSaveOption of mapSaveOptions) {
      const optionElement = document.createElement("option");
      optionElement.value = mapSaveOption;
      optionElement.textContent = mapSaveOption;
      mapSaveSelect.appendChild(optionElement);
    }
  } else if (selectedSave === "TDM") { //List of Save Files - Update manually
    const mapSaveOptions = [
      "Exposure Large-Medium",
      "Renewal Medium-Small",
      "Stranded",
    ];
    for (const mapSaveOption of mapSaveOptions) {
      const optionElement = document.createElement("option");
      optionElement.value = mapSaveOption;
      optionElement.textContent = mapSaveOption;
      mapSaveSelect.appendChild(optionElement);
    }
  } else if (selectedSave === "FFA") { //List of Save Files - Update manually
    const mapSaveOptions = [
      "Exposure",
      "Renewal",
      "Stranded",
    ];
    for (const mapSaveOption of mapSaveOptions) {
      const optionElement = document.createElement("option");
      optionElement.value = mapSaveOption;
      optionElement.textContent = mapSaveOption;
      mapSaveSelect.appendChild(optionElement);
    }
  }
});

mapSaveSelect.addEventListener("change", function () {
  const selectedSave = saveSelect.value;
  const selectedSaveOption = mapSaveSelect.value;
});

function updatePointList() {
  pointList.innerHTML = "";

  points.forEach((point, index) => {
    const { xCoord, yCoord, zCoord, note } = point;

    const li = document.createElement("li");
    li.id = `li-${index}`;

li.addEventListener("mouseenter", () => {
  if (!menuOpen){
  defaultlistcolour()
  // Change the color of the corresponding circle
  context.fillStyle = "#18ff03";
  context.beginPath();
  context.arc(point.x, point.y, 15, 0, 2 * Math.PI);
  context.fill();
  li.style.backgroundColor = "#27941f";
  }
});

li.addEventListener("mouseleave", () => {
  if (!menuOpen){
  // Restore the color of the corresponding circle
  li.style.backgroundColor = "black";
  setTimeout(() => {
    redrawCanvas();
  }, 10);
  }
});

li.addEventListener("mousedown", (event) => {
  // Store the starting point of the mouse click
  const startPoint = {
    x: event.clientX,
    y: event.clientY,
  };

  li.addEventListener("mouseup", (event) => {
    // Calculate the distance between the starting and ending points of the mouse click
    const endPoint = {
      x: event.clientX,
      y: event.clientY,
    };
    const distanceX = Math.abs(endPoint.x - startPoint.x);
    const distanceY = Math.abs(endPoint.y - startPoint.y);

    // If the mouse click started and ended on the background, open the menu
    if (distanceX < 3 && distanceY < 3) {
      if (!menuOpen){
      const clickedElement = event.target;
      const isBackgroundClicked = clickedElement === event.currentTarget;
      const isLabelClicked = clickedElement.tagName.toLowerCase() === 'label';
      if (isBackgroundClicked || isLabelClicked) {
          selectedPointIndex = index;
            for (let j = 0; j < points.length; j++) {
              const li = document.getElementById(`li-${j}`);
              li.style.backgroundColor = j === selectedPointIndex ? "#27941f" : "#000000";
            }
            for (let i = 0; i < points.length; i++) {
              context.beginPath();
              context.arc(point.x, point.y, 6, 0, 2 * Math.PI);
                defaultlistcolour()
                context.fillStyle = "#18ff03";
                context.fill();
            }
            const li = document.getElementById(`li-${selectedPointIndex}`);
            console.log(li);
            li.style.backgroundColor = "#27941f";

            menuOpen = true;
            // check if document.execCommand() is available before using it
            copyToClipboard(point);
            clickedCircle = true;
            const menu = document.createElement("div");
            menu.style.position = "absolute";
            menu.style.top = "50%";
            menu.style.left = "50%";
            menu.style.transform = "translate(-50%, -50%)";
            menu.style.backgroundColor = "#292929";
            menu.style.border = "3px solid #141414";
            menu.style.padding = "14px";
            menu.style.display = "flex";
            menu.style.flexDirection = "column";
            menu.style.alignItems = "center";
            menu.style.justifyContent = "center";
            menu.style.zIndex = 2

            const coordinatesLabel = document.createElement("label");
            coordinatesLabel.style.color = "#00ffff";
            coordinatesLabel.style.marginBottom = "14px";
            coordinatesLabel.textContent = "Copied to Clipboard:";

            const coordinatesField = document.createElement("input");
            coordinatesField.type = "text";
            coordinatesField.value = `X: ${point.xCoord}, Y: ${point.yCoord}, Z: ${point.zCoord}`;
            coordinatesField.style.width = "100%";
            coordinatesField.style.marginBottom = "9px";
            coordinatesField.style.textAlign = "center";
            coordinatesField.style.backgroundColor = "#141414";
            coordinatesField.style.color = "#fff";
            coordinatesField.style.border = "none";
            coordinatesField.style.padding = "9px";
            coordinatesField.style.borderRadius = "3px";
            coordinatesField.readOnly = true;

            const noteLabel = document.createElement("label");
            noteLabel.style.color = "#ffffff";
            noteLabel.style.marginBottom = "14px";
            noteLabel.style.userSelect = "text";
            noteLabel.textContent = `${point.note}`;

            const buttonContainer = document.createElement("div");
            buttonContainer.style.display = "flex";
            buttonContainer.style.width = "100%";
            buttonContainer.style.justifyContent = "space-between";

            const closeButton = document.createElement("button");
            closeButton.textContent = "Close";
            closeButton.style.backgroundColor = "#00ffff";
            closeButton.style.fontFamily = "BatlefieldFont";
            closeButton.style.fontSize = "18px";
            closeButton.style.marginTop = "5px";
            closeButton.style.borderRadius = "4px";
            closeButton.style.display = "inline-block";
            closeButton.style.border = "3px";
            closeButton.addEventListener("click", function () {
              menu.remove();
              menuOpen = false;
              defaultlistcolour()
              redrawCanvas()
            });

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.style.backgroundColor = "#ff3838";
            deleteButton.style.fontFamily = "BatlefieldFont";
            deleteButton.style.fontSize = "18px";
            deleteButton.style.marginTop = "5px";
            deleteButton.style.borderRadius = "4px";
            deleteButton.style.display = "inline-block";
            deleteButton.style.border = "3px";
            deleteButton.addEventListener("click", function () {
              // Create a new menu element
              const confirmMenu = document.createElement("div");
              confirmMenu.style.position = "absolute";
              confirmMenu.style.top = "0";
              confirmMenu.style.left = "0";
              confirmMenu.style.width = "100%";
              confirmMenu.style.height = "100%";
              confirmMenu.style.backgroundColor = "rgba(0, 0, 0, 0.85)";
              confirmMenu.style.display = "flex";
              confirmMenu.style.justifyContent = "center";
              confirmMenu.style.alignItems = "center";
              confirmMenu.style.flexDirection = "column";
              confirmMenu.style.backdropFilter = "blur(10px)";
              confirmMenu.style.zIndex = 3

              // Create a message container element
              const messageContainer = document.createElement("div");
              messageContainer.style.textAlign = "center";
              messageContainer.style.marginBottom = "20px";

              // Create a message element
              const message = document.createElement("div");
              message.textContent = "Are you sure you want to delete?";
              message.style.fontFamily = "BatlefieldFont";
              message.style.fontSize = "24px";
              message.style.color = "#fff";

              // Create a confirm button
              const confirmButton = document.createElement("button");
              confirmButton.textContent = "Yes";
              confirmButton.style.backgroundColor = "#ff3838";
              confirmButton.style.fontFamily = "BatlefieldFont";
              confirmButton.style.fontSize = "24px";
              confirmButton.style.borderRadius = "4px";
              confirmButton.style.border = "3px";
              confirmButton.style.marginRight = "10px";
              confirmButton.style.padding = "2px 13px";
              confirmButton.addEventListener("click", function () {
                // User confirmed deletion, perform the deletion process
                points.splice(selectedPointIndex, 1);
                redrawCanvas();
                confirmMenu.remove();
                menu.remove();
                menuOpen = false;
                defaultlistcolour()
            
              });

              // Create a cancel button
              const cancelButton = document.createElement("button");
              cancelButton.textContent = "No";
              cancelButton.style.backgroundColor = "#4CAF50";
              cancelButton.style.fontFamily = "BatlefieldFont";
              cancelButton.style.fontSize = "24px";
              cancelButton.style.borderRadius = "4px";
              cancelButton.style.border = "3px";
              cancelButton.style.padding = "2px 13px";
              cancelButton.addEventListener("click", function () {
                // User canceled deletion, remove the confirm menu
                confirmMenu.remove();
              });

              // Create a button container
              const buttonContainer = document.createElement("div");
              buttonContainer.style.display = "flex";
              buttonContainer.style.justifyContent = "center";
              buttonContainer.style.alignItems = "center";
              buttonContainer.style.flexDirection = "row"; // Add this line to display buttons horizontally
              buttonContainer.style.gap = "1.5rem"

              // Add the message and buttons to their respective containers
              messageContainer.appendChild(message);
              buttonContainer.appendChild(confirmButton);
              buttonContainer.appendChild(cancelButton);
              confirmMenu.appendChild(messageContainer);
              confirmMenu.appendChild(buttonContainer);

              // Add the confirm menu to the page
              document.body.appendChild(confirmMenu);
            });

            buttonContainer.appendChild(deleteButton);
            buttonContainer.appendChild(closeButton);

            menu.appendChild(coordinatesLabel);
            menu.appendChild(coordinatesField);
            menu.appendChild(noteLabel);
            menu.appendChild(buttonContainer);

            document.body.appendChild(menu);
          }
        }
      }
    })
});

    const xCoordLabel = document.createElement("label");
    xCoordLabel.textContent = "X: ";
    xCoordLabel.htmlFor = `xCoordInput-${index}`;

    const xCoordInput = document.createElement("input");
    xCoordInput.type = "number";
    xCoordInput.value = xCoord;
    xCoordInput.addEventListener("input", () => {
      points[index].xCoord = parseFloat(xCoordInput.value); 
    });

    const yCoordLabel = document.createElement("label");
    yCoordLabel.textContent = "Y: ";
    yCoordLabel.htmlFor = `yCoordInput-${index}`;

    const yCoordInput = document.createElement("input");
    yCoordInput.type = "number";
    yCoordInput.value = yCoord;
    yCoordInput.addEventListener("input", () => {
      points[index].yCoord = parseFloat(yCoordInput.value);
    });

    const zCoordLabel = document.createElement("label");
    zCoordLabel.textContent = "Z: ";
    zCoordLabel.htmlFor = `zCoordInput-${index}`;

    const zCoordInput = document.createElement("input");
    zCoordInput.type = "number";
    zCoordInput.value = zCoord;
    zCoordInput.addEventListener("input", () => {
      points[index].zCoord = parseFloat(zCoordInput.value);
    });

    const noteLabel = document.createElement("label");
    noteLabel.textContent = "Note: ";
    noteLabel.htmlFor = `noteInput-${note}`;

    const noteInput = document.createElement("input");
    noteInput.type = "text";
    noteInput.value = note;
    noteInput.addEventListener("input", () => {
      points[index].note = noteInput.value;
    });

    xCoordInput.classList.add("listbox");
    yCoordInput.classList.add("listbox");
    zCoordInput.classList.add("listbox");
    noteInput.classList.add("listboxnote");
    xCoordLabel.classList.add("listlabel");
    yCoordLabel.classList.add("listlabel");
    zCoordLabel.classList.add("listlabel");
    noteLabel.classList.add("listlabel");

    li.appendChild(xCoordLabel);
    li.appendChild(xCoordInput);
    li.appendChild(yCoordLabel);
    li.appendChild(yCoordInput);
    li.appendChild(zCoordLabel);
    li.appendChild(zCoordInput);
    li.appendChild(noteLabel);
    li.appendChild(noteInput);

    pointList.appendChild(li);
  });
}

window.addEventListener('beforeunload', function(event) {
  event.preventDefault();
  event.returnValue = ''; // Required for Chrome
  return 'Are you sure you want to leave?';
});
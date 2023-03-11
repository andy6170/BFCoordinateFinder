const newProjectBtn = document.getElementById("new-upload");
const newSubmitBtn = document.getElementById("new-submit");
const loadSubmitBtn = document.getElementById("load-submit");
const openProjectBtn = document.getElementById("open-project");
const saveProjectBtn = document.getElementById("save-button");
const loadProjectBtn = document.getElementById("load-button");
var helpButton = document.getElementById("help-button");
var loadButton = document.getElementById("load-button");
var helpContent = document.getElementById("help-content");
var newButton = document.getElementById("new-button");
var newOptions = document.getElementById("new-options");
var loadOptions = document.getElementById("load-options");
var newSubmit = document.getElementById("new-submit");
var hideSave = document.getElementById("hidesave");
var loadSubmit = document.getElementById("load-submit");
var openProject = document.getElementById("open-project");
var saveButton = document.getElementById("save-button");
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
canvas.width = "0px";
canvas.height = "0px";

// New Button logic and configuration
newProjectBtn.addEventListener("click", function () {
  points = [];
  const imageInput = document.createElement("input");
  imageInput.type = "file";
  imageInput.accept = "image/*";
  imageInput.addEventListener("change", function (event) {
    const image = new Image();
    image.src = URL.createObjectURL(event.target.files[0]);

    image.onload = function () {
      canvas.width = image.width;
      canvas.height = image.height;
      backgroundImage.src = image.src;
      redrawCanvas();
      newOptions.style.display = "none";
      hideSave.style.display = "inline-block";
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
  const imagePath =
    "Map Images/" + selectedGameMode + "/" + selectedMap + ".png";
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
    newOptions.style.display = "none";
    hideSave.style.display = "inline-block";
    newButton.style.backgroundColor = "cyan";
    newSubmit.innerHTML = "Submit";
    newSubmit.style.backgroundColor = "rgb(74, 74, 74)";
  };
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
        hideSave.style.display = "inline-block";
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
  points = [];
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
        const data = JSON.parse(reader.result);
        const image = new Image();
        image.onload = function () {
          canvas.width = image.width;
          canvas.height = image.height;
          backgroundImage.src = image.src;
          points = data.points;
          redrawCanvas();
          hideSave.style.display = "inline-block";
          loadOptions.style.display = "none";
          loadButton.style.backgroundColor = "cyan";
        };
        image.src = data.image;
      }
    };
  };
  input.click();
});

const delta = 10;
let startX;
let startY;

canvas.addEventListener("mousedown", function (event) {
  startX = event.pageX;
  startY = event.pageY;
});

canvas.addEventListener("mouseup", function (event) {
  const diffX = Math.abs(event.pageX - startX);
  const diffY = Math.abs(event.pageY - startY);

  if (diffX < delta && diffY < delta) {
    // click event

    const x = event.offsetX;
    const y = event.offsetY;
    const scrollX = canvas.scrollLeft;
    const scrollY = canvas.scrollTop;
    const truex = event.clientX + window.scrollX;
    const truey = event.clientY + window.scrollY;
    let clickedCircle = false;
    for (let i = 0; i < points.length; i++) {
      const point = points[i];
      const distance = Math.sqrt((x - point.x) ** 2 + (y - point.y) ** 2);

      if (distance <= 6 && !menuOpen) {
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

          // Create a message container element
          const messageContainer = document.createElement("div");
          messageContainer.style.textAlign = "center";
          messageContainer.style.marginBottom = "20px";

          // Create a message element
          const message = document.createElement("div");
          message.textContent = "Are you sure you want to delete?";
          message.style.fontFamily = "BatlefieldFont";
          message.style.fontSize = "18px";
          message.style.color = "#fff";

          // Create a confirm button
          const confirmButton = document.createElement("button");
          confirmButton.textContent = "Yes";
          confirmButton.style.backgroundColor = "#ff3838";
          confirmButton.style.fontFamily = "BatlefieldFont";
          confirmButton.style.fontSize = "18px";
          confirmButton.style.borderRadius = "4px";
          confirmButton.style.border = "3px";
          confirmButton.style.marginRight = "10px";
          confirmButton.addEventListener("click", function () {
            // User confirmed deletion, perform the deletion process
            points.splice(i, 1);
            redrawCanvas();
            confirmMenu.remove();
            menu.remove();
            menuOpen = false;
          });

          // Create a cancel button
          const cancelButton = document.createElement("button");
          cancelButton.textContent = "No";
          cancelButton.style.backgroundColor = "#4CAF50";
          cancelButton.style.fontFamily = "BatlefieldFont";
          cancelButton.style.fontSize = "18px";
          cancelButton.style.borderRadius = "4px";
          cancelButton.style.border = "3px";
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
      console.log("scrollX:", scrollX, "scrollY:", scrollY);

      const inputLabel = document.createElement("label");
      inputLabel.textContent = "Enter Coordinates: ";
      const inputField = document.createElement("input");
      inputField.type = "text";

      const selectLabel = document.createElement("label");
      selectLabel.textContent = "Coordinate Type: ";
      selectLabel.style.lineHeight = "2";
      const selectField = document.createElement("select");
      selectField.style.fontWeight = "bold";

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
      submitButton.style.marginTop = "5px";
      submitButton.style.borderRadius = "4px";
      submitButton.style.border = "3px";
      submitButton.addEventListener("click", function () {
        const [xCoord, yCoord, zCoord] = inputField.value.split(" ");
        const selectedItem = selectField.value;

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

        points.push({ x, y, xCoord, yCoord, zCoord, selectedItem });

        context.beginPath();
        context.arc(x, y, 6, 0, 2 * Math.PI);
        context.fillStyle = selectedItem;
        context.fill();

        inputContainer.remove();
        menuOpen = false;
        errorAdded = false;
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
      cancelButton.style.marginTop = "5px";
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
      inputContainer.appendChild(submitButton);
      inputContainer.appendChild(cancelButton);

      document.body.appendChild(inputContainer);

      inputField.focus();
    }
  }
});

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
  document.getElementById("background-placeholer").style.display = "none";
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

canvas.addEventListener("mousemove", function (event) {
  const x = event.offsetX;
  const y = event.offsetY;
  let circleHovered = false;

  for (let i = 0; i < points.length; i++) {
    const point = points[i];
    context.beginPath();
    context.arc(point.x, point.y, 6, 0, 2 * Math.PI);

    if (context.isPointInPath(x, y)) {
      context.fillStyle = "#18ff03";
      circleHovered = true;
    } else {
      context.fillStyle = point.selectedItem;
    }

    context.fill();
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
  context.drawImage(backgroundImage, 0, 0);
  const data = {
    points: points,
    image: canvas.toDataURL(),
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
    helpContent.style.display = "block";
    helpButton.style.backgroundColor = "rgb(161, 117, 0)";
  } else {
    helpContent.style.display = "none";
    helpButton.style.backgroundColor = "rgb(255, 174, 0)";
  }
});

newButton.addEventListener("click", function () {
  if (newOptions.style.display === "none") {
    newOptions.style.display = "block";
    loadOptions.style.display = "none";
    newButton.style.backgroundColor = "rgb(0, 155, 155)";
    loadButton.style.backgroundColor = "cyan";
  } else {
    newOptions.style.display = "none";
    newButton.style.backgroundColor = "cyan";
  }
});

loadButton.addEventListener("click", function () {
  if (loadOptions.style.display === "none") {
    loadOptions.style.display = "block";
    newOptions.style.display = "none";
    loadButton.style.backgroundColor = "rgb(0, 155, 155)";
    newButton.style.backgroundColor = "cyan";
  } else {
    loadOptions.style.display = "none";
    loadButton.style.backgroundColor = "cyan";
  }
});

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
  } else if (selectedGameMode === "Conquest") {
    const mapOptions = [
      "Arica Harbor Medium",
      "Arica Harbor Small",
      "Breakaway Small",
      "Caspian Border Medium",
      "Caspian Border Small",
      "Discarded Small",
      "Exposure Medium",
      "Manifest Medium",
      "Orbital Medium",
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
  } else if (selectedGameMode === "TDM") {
    const mapOptions = ["Coming Soon..."];
    for (const mapOption of mapOptions) {
      const optionElement = document.createElement("option");
      optionElement.value = mapOption;
      optionElement.textContent = mapOption;
      mapSelect.appendChild(optionElement);
    }
  } else if (selectedGameMode === "FFA") {
    const mapOptions = ["Coming Soon..."];
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
  const imagePath = `Map Images/${selectedGameMode}/${selectedMapOption}.png`;
});

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
  } else if (selectedSave === "Conquest") {
    const mapSaveOptions = [
      "Arica Harbor Medium",
      "Arica Harbor Small",
      "Breakaway Small",
      "Caspian Border Medium",
      "Caspian Border Small",
      "Discarded Small",
      "Exposure Medium",
      "Manifest Medium",
      "Orbital Medium",
      "Renewal Medium",
      "Renewal Small",
      "Spearhead Medium",
      "Stranded Medium",
      "Stranded Small",
    ];
    for (const mapSaveOption of mapSaveOptions) {
      const optionElement = document.createElement("option");
      optionElement.value = mapSaveOption;
      optionElement.textContent = mapSaveOption;
      mapSaveSelect.appendChild(optionElement);
    }
  } else if (selectedSave === "TDM") {
    const mapSaveOptions = ["Coming Soon..."];
    for (const mapSaveOption of mapSaveOptions) {
      const optionElement = document.createElement("option");
      optionElement.value = mapSaveOption;
      optionElement.textContent = mapSaveOption;
      mapSaveSelect.appendChild(optionElement);
    }
  } else if (selectedSave === "FFA") {
    const mapSaveOptions = ["Coming Soon..."];
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

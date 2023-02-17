<!DOCTYPE html>
<html>
<head>
    <title>Battlefield Coordinate Finder 9000</title>
    <link href="style.css" rel="stylesheet" type="text/css">
</head>
<body>
    <h1>Battlefield Coordinate Finder 9000</h1>
    <p style="line-height: 0.5;">_____________________________________________________________________________</p>
    <p><strong>Controls:</strong></p>
    <p>Click on a space to create a position</p>
    <p>Click on a position to view the location and copy to clipboard</p>
    <p>Ctrl + Click on a position to delete</p>
    <p style="line-height: 2;"><strong>Collection:</strong> Map image files <a href="https://github.com/andy6170/BFCoordinateFinder/tree/main/Map%20Images/Conquest">here</a> Map save files <a href="https://github.com/andy6170/BFCoordinateFinder/tree/main/Map%20Coordinate%20Files">here</a></p>
    <p style="line-height: 0;">_____________________________________________________________________________</p>
    <p style="line-height: 1;">Please select an option below:</p>
    <button id="new-project">New</button>
    <button id="open-project">Open </button>
    <button id="save-button">Save</button>
    <br>
    <!--<p>________________________________</p> -->
    <div id="canvas-wrapper">
        <img src="image.jpg" id="background-image">
        <canvas id="my-canvas"></canvas>
      </div>
    <!-- Add the canvas element with the correct id -->
    <canvas id="my-canvas"></canvas>

    <!-- Add the image input element with the correct id -->
    <input type="file" id="image-input" style="display:none">

    <!-- Add the alert container with the correct class -->
    <div class="alert"></div>

    <!-- Include your script.js file -->
    <script src="./Script.js"></script>

    <!-- Add the blockly library -->
    <script src="https://unpkg.com/blockly/blockly.min.js"></script>

    <!-- Add the blockly blocks library -->
    <script src="https://unpkg.com/blockly/blocks.min.js"></script>

    <!-- Add the blockly JavaScript generator library -->
    <script src="https://unpkg.com/blockly/javascript.min.js"></script>

    <p style="line-height: 10;">Created by andy6170</p>

    <!-- Add the blockly toolbox definition -->
    <xml id="toolbox" style="display: none">
        <block type="math_number">
            <field name="NUM">0</field>
        </block>
        <block type="create_vector"></block>
    </xml>
</body>
</html>

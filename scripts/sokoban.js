"use strict";
var gameBoard;
var currLevel = 0; // current level no.
var currPlayerPos = {i : 0, j : 0}; // current x.y coord position of player
var boxesArr = new Array();
var steps = 0;
var boxPushes = 0;
/* For checking when the player complete the game level */
var currentDone = 0; // how many boxes rearch target
var totalTasks; // how many targets contains in the current level

function init()
{ 
	// // Update pull-down menu (level selection)
	// var select = $('#level')[0]; // DOM
	// $('#level').empty(); // Jquery object clear
	// select.options.length = LEVELS.length; // read how many levels in database
	//
	// for (var i=0;i<select.options.length;i++) // update no. of levels on pull-down menu
	// {
	// 	var levelName = "Level 0" + (i+1).toString();
	// 	select.options[i] = new Option(levelName, i+1);
	// }
	setGameBoard();
}
//
// function selectLevel(sel)
// {
// 	currLevel = sel.value - 1;
// }

/* Create a new GameBoard Matrix with 2D array */
function setGameBoard()
{
	resetBoard();
	drawBoard();
	drawPlayerBoxes();
	setControl();
}

function drawBoard()
{
	// Clear everything
	$("#gameBoard").empty();
	boxesArr = [];
	currPlayerPos = {i : 0, j : 0};

	gameBoard = LEVELS[currLevel].map;
	for(var x in gameBoard)
	{
		var row = document.createElement("tr"); 
		for (var y in gameBoard[x])
		{
			var cellClass;
			var cell = document.createElement("td");
			if(gameBoard[x][y] == P)
			{
				currPlayerPos.i = x;
				currPlayerPos.j = y;
			}
			else if (gameBoard[x][y] == B)
			{
				boxesArr.push({x: x, y: y});
			}
			switch (gameBoard[x][y])
			{
				case P:
				case B:
				case F:
					cellClass = "Floor " + "x" + x + "y" + y; 
					break;
				case W:
					cellClass = "Wall " + "x" + x + "y" + y; 
					break;
				case G:
					cellClass = "Goal " + "x" + x + "y" + y;
					break;
				default: cellClass = " "; break;
			}
			$(cell).attr('class',cellClass);
			$(cell).appendTo($(row));
		}
		$(row).appendTo($("#gameBoard"));
	}
	totalTasks = boxesArr.length;
}

function drawPlayerBoxes()
{
	/* Player */
	// Draw player on initialized position (HTML)
	var playerCellClass = ".x" + currPlayerPos.i + "y" + currPlayerPos.j;
	$(playerCellClass).attr('id', 'Player');
	// // update current POS
	// currPlayerPos.i = playerStartPos.x;
	// currPlayerPos.j = playerStartPos.y;

	/* Boxes */
	for (var i in boxesArr)
	{
		var boxCellClass = ".x" + boxesArr[i].x + "y" + boxesArr[i].y;
		$(boxCellClass).attr('id', 'Box');
	}
}

function setControl()
{
	window.addEventListener("keydown", function (event) 
    {
	  	if (event.defaultPrevented) 
	  	{
	   		 return; // Do nothing if the event was already processed
	  	}

	  	switch (event.key) 
	  	{
		    case "ArrowDown":
		      move("DOWN");
		      break;
		    case "ArrowUp":
	          move("UP");
		      break;
		    case "ArrowLeft":
		      move("LEFT");
		      break;
		    case "ArrowRight":
		      move("RIGHT");
		      break;
		    default:
		      return; // Quit when this doesn't handle the key event.
	  	}
		  event.preventDefault(); // Cancel the default action to avoid it being handled twice
	}, true);
}

//TODO: walking through the map
function move(direction)
{
	var x = currPlayerPos.i;
	var y = currPlayerPos.j;
	switch(direction)
	{
		case "DOWN":
			x = parseInt(currPlayerPos.i) + 1;
			break;
		case "UP":
			x = parseInt(currPlayerPos.i)- 1;
			break;
		case "LEFT":
			y = parseInt(currPlayerPos.j) - 1;
			break;
		case "RIGHT":
			y = parseInt(currPlayerPos.j) + 1;
			break;
	}
	// If the target position is passable
	if(gameBoard[x][y].isPassable)
	{
		var targetCellClass = ".x" + x + "y" + y;
		console.log(targetCellClass);
		var movePlayer = true;
		// if the target destination is a box
		if ($(targetCellClass).attr('id') == "Box")
		{
			console.log("pushing");
			if (push(direction, x, y) == false) // Push the box
			{
				movePlayer = false;
			}
			changePlayerImage(direction);
		}
		if (movePlayer)
		{
			// move player to target position
			steps++;
			$("#steps-taken").text(steps);	

			$("#Player").removeAttr('style');
			$("#Player").removeAttr('id');
		
			$(targetCellClass).attr('id', 'Player');
			changePlayerImage(direction);
			// update player image according to the walking direction
			updatePlayerPos(x,y);
		}
		
	}		
}

// Update player's position when moved
function updatePlayerPos(x, y)
{
	currPlayerPos.i = x;
	currPlayerPos.j = y;
}

function changePlayerImage(direction)
{
	var imgSrc = "url('resources/player-" + direction.toLowerCase() + ".png')";
	$("#Player").css('content', imgSrc);
}

// Push box
function push(direction,x,y)
{
	// desired position for pushing box
	var newX = x;
	var newY = y; 

	switch (direction)
	{
		case "DOWN":
			newX = parseInt(x)+1; newY = y;
		break;
		case "UP":
			newX = parseInt(x)-1; newY = y;
		break;
		case "LEFT":
			newX = parseInt(x); newY = parseInt(y)-1;
		break;
		case "RIGHT":
			newX = x; newY = parseInt(y)+1;
		break;
	}
	var targetCellClass = ".x" + newX + "y" + newY;
	var currentCellClass = ".x" + x + "y" + y;
	console.log("target: " + targetCellClass);
	console.log("current: " + currentCellClass);

	// If box is pushed out from the target tile,
	if (gameBoard[x][y] == G && currentDone > 0)
	{
		currentDone -= 1;
	}
	// If box is pushed into the target tile,
	if(gameBoard[newX][newY] == G)
	{
		currentDone += 1;
	}
	// check if the game completed or not
	checkEndGame();

	// Check if the box can be pushed or not
	if (gameBoard[newX][newY].isPassable && $(targetCellClass).attr('id') != "Box")
	{
		$(currentCellClass).removeAttr('id');
		$(targetCellClass).attr('id', 'Box');
		boxPushes ++;
        $("#box-pushes").text(boxPushes);
        return true;
	}
	else
	{
		console.log('The Box cannot be pushed.');
		return false;
	}
}

function checkEndGame()
{
	if (currentDone == totalTasks)
	{
		// WIN : Complete level
		$("#msg").css("display","inline-block");
		$(".next-level").css("display", "inline-block");
	}
}

function nextLevel()
{
	if(currLevel < LEVELS.length-1)
	{
        currLevel++;
        setGameBoard();
	}
}

function resetGame()
{
	currLevel = 0;
	setGameBoard();
}

function resetBoard()
{
	steps = 0;
    $("#steps-taken").text(steps);
	boxPushes = 0;
    $("#box-pushes").text(boxPushes);
	currentDone = 0;
	$("#level-text").text("Level " + parseInt(currLevel + 1) + "/" + LEVELS.length);
    $("#msg").css("display","none");
    $(".next-level").css("display", "none");
}
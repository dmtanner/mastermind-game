$(function() {
	$('.color-guess-panel').draggable();
});
var gameApp = angular.module("game", []);
gameApp.controller("Board", ["$http", function($http) {
	this.loaded = false;
	console.log("sending post");
	var view = this;
	$http.post("/mastermind/start", {code_length: 4, max_guesses: 12}).success(function(data) {
		console.log("Post success!");
		view.sequenceComplexity = data.code_length;
		view.guessCap = data.max_guesses;
		view.loaded = true;
		view.gameID = data.id;
		view.activeRow = 0;
		view.gameBoard = new Array(view.guessCap);
		view.gameBoard[view.activeRow] = new Array();
		view.gameResponses = new Array(view.guessCap);
		view.gameCode = new Array(view.guessCap);
		view.gameOver = false;
		console.log(view);
	}).error(function(data) {
		console.log("Post failure :(");
		//prompt a refresh
	});

	this.getNumber = function(number) {
		var returnArray = [];
		for (var i = 0; i < number; i++) {
			returnArray.push(i);
		}
		return returnArray;
	};
	this.getColor = function(rowIndex, circleNumber) {
		if (rowIndex > this.activeRow || this.gameBoard[rowIndex] === null || this.gameBoard[rowIndex] === undefined || this.gameBoard[rowIndex].length < circleNumber) {
			return false;
		}
		var color = this.gameBoard[rowIndex][circleNumber];
		if (color === "R") {
			return "color-guess-red";
		} else if (color === "O") {
			return "color-guess-orange";
		} else if (color === "Y") {
			return "color-guess-yellow";
		} else if (color === "G") {
			return "color-guess-green";
		} else if (color === "B") {
			return "color-guess-blue";
		} else if (color === "V") {
			return "color-guess-violet";
		} else if (color === "W") {
			return "color-guess-white";
		} else if (color === "K") {
			return "color-guess-black";
		}
	};
	this.getResponseColor = function(rowIndex, responseCircleNumber) {
		if (rowIndex >= this.activeRow || this.gameBoard[rowIndex] === null || this.gameBoard[rowIndex] === undefined || this.gameBoard[rowIndex].length < responseCircleNumber) {
			return false;
		}
		var color = this.gameResponses[rowIndex][responseCircleNumber];
		if (color === "R") {
			return "color-response-red";
		} else if (color === "W") {
			return "color-response-white";
		}
		
	};
	this.getWinningColor = function(circleNumber) {
		if (this.gameCode[0] === undefined || this.gameCode[0] === null) {
			console.log("returning false because the game is still in progress");
			return false;
		}
		console.log("this is being called");
		var color = this.gameCode[circleNumber];
		if (color === "R") {
			return "color-guess-red";
		} else if (color === "O") {
			return "color-guess-orange";
		} else if (color === "Y") {
			return "color-guess-yellow";
		} else if (color === "G") {
			return "color-guess-green";
		} else if (color === "B") {
			return "color-guess-blue";
		} else if (color === "V") {
			return "color-guess-violet";
		} else if (color === "W") {
			return "color-guess-white";
		} else if (color === "K") {
			return "color-guess-black";
		}
	};
	this.redGuess = function() {
		if (this.gameBoard[this.activeRow].length < this.sequenceComplexity) {
			this.gameBoard[this.activeRow].push("R");
		}
	};
	this.orangeGuess = function() {
		if (this.gameBoard[this.activeRow].length < this.sequenceComplexity) {
			this.gameBoard[this.activeRow].push("O");
		}
	};
	this.yellowGuess = function() {
		if (this.gameBoard[this.activeRow].length < this.sequenceComplexity) {
			this.gameBoard[this.activeRow].push("Y");
		}
	};
	this.greenGuess = function() {
		if (this.gameBoard[this.activeRow].length < this.sequenceComplexity) {
			this.gameBoard[this.activeRow].push("G");
		}
	};
	this.blueGuess = function() {
		if (this.gameBoard[this.activeRow].length < this.sequenceComplexity) {
			this.gameBoard[this.activeRow].push("B");
		}
	};
	this.violetGuess = function() {
		if (this.gameBoard[this.activeRow].length < this.sequenceComplexity) {
			this.gameBoard[this.activeRow].push("V");
		}
	};
	this.whiteGuess = function() {
		if (this.gameBoard[this.activeRow].length < this.sequenceComplexity) {
			this.gameBoard[this.activeRow].push("W");
		}
	};
	this.blackGuess = function() {
		if (this.gameBoard[this.activeRow].length < this.sequenceComplexity) {
			this.gameBoard[this.activeRow].push("K");
		}
	};
	this.resetRow = function() {
		this.gameBoard[this.activeRow] = new Array();
		console.log("Resetting");
		console.log(JSON.stringify(this));
	};
	this.submitGuess = function() {
		console.log(this);
		var guessString = "";
		for (var i = 0; i < this.sequenceComplexity; i++) {
			guessString += this.gameBoard[this.activeRow][i];
		}
		
		var view = this;
		$http.post("/mastermind/"+this.gameID+"/guess", {guess: guessString}).success(function(data) {
			
			view.gameResponses[view.activeRow] = new Array(4);
			var rightColor = data.right_color;
			var rightPlace = data.right_place;
			for (var i = 0; i < 4; i++) {
				if (rightPlace > i) {
					view.gameResponses[view.activeRow][i] = "R";
				} else if (rightColor > i) {
					view.gameResponses[view.activeRow][i] = "W";
				} else {
					view.gameResponses[view.activeRow][i] = "X";
				}
			}
			if (rightPlace === 4) {
				alert("You won! Congradumacations :)\nIt took you " + (view.activeRow + 1) + " guesses.");
				view.activeRow++;
				view.gameCode = data.code.split("");
				view.gameOver = true;
				view.loaded = false;
			} else if (view.activeRow === view.guessCap - 1) {
				alert("You lost. Better luck next time!");
				view.gameCode = data.code.split("");
				console.log(JSON.toString(view));
				view.gameOver = true;			
			} else {
				view.activeRow++;
				view.gameBoard[view.activeRow] = new Array();
			}
			console.log(JSON.stringify(view));
		});
	};
	this.isGuessReady = function() {
		return (this.gameBoard !== undefined && this.gameBoard[this.activeRow] !== undefined && this.gameBoard[this.activeRow].length === this.sequenceComplexity);
	};
	this.isActiveRow = function(rowNumber) {
		return this.activeRow === rowNumber;
	};
	this.isReachedRow = function(rowNumber) {
		return this.activeRow > rowNumber;
	};
	this.isInactiveRow = function(rowNumber) {
		return this.activeRow < rowNumber;
	};
}]);

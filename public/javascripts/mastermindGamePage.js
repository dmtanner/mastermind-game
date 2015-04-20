var gameApp = angular.module("game", []);
gameApp.controller("Board", ["$http", function($http) {
	this.loaded = false;
	console.log("sending post");
	$http.post("/mastermind/start", {code_length: 4, max_guesses: 12}).success(function(data) {
		console.log("Post success!");
		this.sequenceComplexity = data.code_length;
		this.guessCap = data.max_guesses;
		this.loaded = true;
		this.gameID = data.id;
	}).error(function(data) {
		console.log("Post failure :(");
		//prompt a refresh
	});
	this.activeRow = 0;
	this.gameBoard = new Array(this.guessCap);
	this.gameBoard[this.activeRow] = new Array();
	this.gameResponses = new Array(this.guessCap);
	this.gameResponses[this.activeRow] = new Array();
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
		} else if (color === "Y") {
			return "color-guess-yellow";
		} else if (color === "G") {
			return "color-guess-green";
		} else if (color === "B") {
			return "color-guess-blue";
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
		var guessString = "";
		for (var i = 0; i < this.sequenceComplexity; i++) {
			guessString += this.gameBoard[this.activeRow][i];
		}
		$http.post("/mastermind/"+this.gameID+"/guess", {guess: guessString}).success(function(data) {
			this.gameResponse.push([]);
			this.activeRow++;
			this.gameBoard[this.activeRow] = new Array();

		});
	};
	this.isGuessReady = function() {
		return (this.gameBoard[this.activeRow].length === this.sequenceComplexity);
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
$('.color-guess-panel').draggable();
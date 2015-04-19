var gameApp = angular.module("game", []);
gameApp.controller("Board", function() {
	this.activeRow = 0;
	this.sequenceComplexity = 4;
	this.guessCap = 8;
	this.gameBoard = new Array(this.guessCap);
	this.gameBoard[this.activeRow] = new Array();
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
		this.activeRow++;
		this.gameBoard[this.activeRow] = new Array();
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
});
$('.color-guess-panel').draggable();
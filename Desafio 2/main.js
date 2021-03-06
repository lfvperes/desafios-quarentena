const CellColors = [
	'transparent',
	'blue',
	'green',
	'red',
	'purple',
	'maroon',
	'turquoise',
	'black',
];

// Cell class declaration
class Cell {
	constructor (root, x, y, map) {
    // Create a div element
		const element = document.createElement('div');
    // Add class cell and hidden to the created div element
		element.classList.add('cell', 'hidden');
    // Append div on root element
		root.appendChild(element);

		element.addEventListener('click', () => map.cellLeftClick(this));
		element.addEventListener('contextmenu', event => {
			event.preventDefault();
			map.cellRightClick(this);
			return false;
		});

		this.element = element;
		this.visited = false;
		this.isFlagged = false;
		this.isBomb = false;
		this.value = 0;
		this.x = x;
		this.y = y;
	}

	reveal () {
		if (this.visited) return;
    // Replace class hidden with class revealed on the div element
		this.element.classList.replace('hidden', 'revealed');
		if (this.isBomb) {
			this.element.classList.add('bomb');
		} else if (this.isFlagged) {
			this.element.classList.add('wrong-flag');
		} else {
			this.element.innerText = this.value;
			this.element.style.color = CellColors[this.value] || 'black';
		}
		this.visited = true;
	}

	toggleFlag() {
		this.isFlagged = !this.isFlagged;
		(this.isFlagged) ? this.element.classList.add('flag') : this.element.classList.remove('flag');
	}

  // *************************************************************************************
  // Here you need to implement toggleFlag function that depending on isFlagged variable
  // will apply or remove the css class 'flag' from the this instantite element
  // and will invert the flag
  // (This function is called inside cellRightClick function that are in the Map class,
  // you dont need to worry with that)
  // *************************************************************************************
}

class Map {
	constructor (root, width, height, numberOfBombs) {
		this.cells = [];
		this.width = width;
		this.height = height;
		this.bombCount = numberOfBombs;
		this.hasMapBeenClickedYet = false;
		this.isGameOver = false;
		this.visibleCells = 0;
		this.lives = 3;

		for (let row = 0; row < height; row ++) {
			this.cells.push([]);
			for (let column = 0; column < width; column ++) {
				this.cells[row].push(new Cell(root, column, row, this));
			}
		}

		root.style.gridTemplateColumns = `repeat(${width}, max-content)`;
		
		let lives = document.createElement('div');
		lives.id = "lives";
		for (let life = 0; life < 3; life++) {
			let img = document.createElement('img');
			img.className = "life";
			img.id = life + 1;
			img.src = "assets/smiley.png";
			lives.appendChild(img);
		}
		document.body.insertBefore(lives, root);
	}

	// Used to verify if the given position is outside the map bounds
	doesPositionExist (x, y) {
		if (x < 0 || y < 0 || x >= this.width || y >= this.height) return false;
		return true;
	}

	// Iterates over each neighbor of a cell, calling `callback` with a cell as argument.
	forEachNeighbor (cell, callback) {
		for (let newY = cell.y - 1; newY <= cell.y + 1; newY ++) {
			for (let newX = cell.x - 1; newX <= cell.x + 1; newX ++) {
				if (!this.doesPositionExist(newX, newY)) continue;
				if (newX === cell.x && newY === cell.y) continue;
				callback(this.cells[newY][newX]);
			}
		}
	}

	countBombsAroundCell (cell) {
		let bombs = 0;
		this.forEachNeighbor(cell, neighbor => {
			if (neighbor.isBomb) bombs ++;
		});
		return bombs;
	}

	placeAllNumbersInMap () {
		for (let row = 0; row < this.height; row ++){
			for (let column = 0; column < this.width; column ++){
				const cell = this.cells[row][column];
				if (cell.isBomb) continue;
				cell.value = this.countBombsAroundCell(cell);
			}
		}
	}

	// Finds proper positions to bombs
	placeAllBombsInMap (clickX, clickY) {
		const generateBombSomewhere = async () => {
			let x, y;
			do {
				x = Math.floor(Math.random() * this.width);
				y = Math.floor(Math.random() * this.height);
			} while (
				this.cells[y][x].isBomb ||
				(Math.abs(x - clickX) <= 1 && Math.abs(y - clickY) <= 1)
			);

			this.cells[y][x].isBomb = true;
		}

		for (let i = 0; i < this.bombCount; i ++) {
			generateBombSomewhere();
		}
	}

	// Funtion called when player left clicks a cell
	cellLeftClick (clickedCell) {
		if (this.isGameOver) return;
		if (clickedCell.isFlagged) return;
		if (clickedCell.visited) return;
		if (!this.hasMapBeenClickedYet) {
			this.placeAllBombsInMap(clickedCell.x, clickedCell.y);
			this.placeAllNumbersInMap();
			this.hasMapBeenClickedYet = true;
		}
		if (clickedCell.isBomb) {
			clickedCell.element.style.backgroundColor = 'red';
			if (this.lives > 0) {
				document.getElementById(this.lives).src = "assets/frowny.png";
				this.lives--;
				clickedCell.reveal();
			} else if (this.lives === 0) {
				this.gameOver();
			}
			
			return;
		}
		clickedCell.reveal();
		this.visibleCells ++;
		if (this.didPlayerWin()) {
			setTimeout(() => alert('Congratulations, you won!'));
		}

		// If the cell is empty, open all surrounding cells.
		if (clickedCell.value === 0 && !clickedCell.isFlagged) {
			this.forEachNeighbor(clickedCell, cell => this.cellLeftClick(cell));
		}
	}

	didPlayerWin () {
		return this.visibleCells >= this.width * this.height - this.bombCount;
	}

	cellRightClick (clickedCell) {
		if (this.isGameOver) return;
		if (clickedCell.visited) return;
		clickedCell.toggleFlag();
	}

	gameOver () {
		for (let row = 0; row < this.height; row ++) {
			for (let column = 0; column < this.width; column ++) {
				const cell = this.cells[row][column];
				if (cell.isBomb || cell.isFlagged) cell.reveal();
			}
		}
		this.isGameOver = true;
	}
}

class Level {
	constructor (isSelected, width, height, numberOfBombs){
		this.isSelected = isSelected;
		this.width = width;
		this.height = height;
		this.numberOfBombs = numberOfBombs;
	}
}

class Menu {
	constructor (root) {
		//this.isPlaying = false;

		const beginner = new Level(false, 9, 9, 10);
		const intermediate = new Level(false, 16, 16, 40);
		const expert = new Level(false, 16, 30, 99);
		const insane = new Level(false, 50, 30, 300);
		var custom = new Level(false, 10, 10, 10);
		this.levels = {beginner, intermediate, expert, insane, custom};
		this.root = root;

		root.classList.add('start-menu');
		var options = document.createElement('div');
		options.id = 'options';
		for (let level in this.levels) {
			let button = document.createElement('button');
			button.id = level;
			button.innerText = level;
			options.appendChild(button);
			this.root.appendChild(options);
			button.addEventListener('click', () => {
				this.levels[button.id].isSelected = true;
				this.levels.custom.isSelected ? this.customSizes() : this.startGame();
			});
		}

		var sizes = document.createElement('div');
		sizes.id = 'sizes';
		for (let number in this.levels.custom) {
			if (number != 'isSelected') {
				let p = document.createElement('p');
				//p.className = "custom-size";
				p.innerText = number;

				let input = document.createElement('input');
				input.className = "custom-size";
				input.id = number;
				input.type = "number";
				input.value = this.levels.custom[number];
				
				sizes.appendChild(p);
				sizes.appendChild(input);
				this.root.appendChild(sizes);
			}
		}
	}

	// tirar ids desnecessarios
	
	customSizes () {
		for (let number in this.levels.custom) {
			if (number != 'isSelected') {
				this.levels.custom[number] = document.getElementById(number).value;
			}
		}
		this.startGame();
	}

	startGame () {
		this.root.classList.remove('start-menu');
		this.root.removeChild(options);
		this.root.removeChild(sizes);
		for (let level in this.levels) {
			if (this.levels[level].isSelected) {
				new Map(
					this.root, 
					this.levels[level].width, 
					this.levels[level].height, 
					this.levels[level].numberOfBombs
				);
			}
		}
	}
}

var game = new Menu(document.getElementById('root'));
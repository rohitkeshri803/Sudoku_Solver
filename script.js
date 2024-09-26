const SIZE = 9;
const EMPTY = 0;
let board = [];
const inputs = [];

window.onload = () => {
    createBoardUI();
    document.getElementById('generate').addEventListener('click', generatePuzzle);
    document.getElementById('solve').addEventListener('click', () => solveSudoku(board));
};

function createBoardUI() {
    const boardContainer = document.getElementById('board');
    for (let i = 0; i < SIZE * SIZE; i++) {
        let input = document.createElement('input');
        input.type = 'text';
        input.maxLength = 1;
        boardContainer.appendChild(input);
        inputs.push(input);
    }
}

function generatePuzzle() {
    board = generateSudokuBoard();
    removeNumbersFromBoard(40); // Remove 40 numbers to make the puzzle
    displayBoard(board);
}

function generateSudokuBoard() {
    const board = Array.from({ length: SIZE }, () => Array(SIZE).fill(EMPTY));
    fillDiagonalRegions(board);
    solveSudoku(board); // Use solver to generate a valid full board
    return board;
}

function fillDiagonalRegions(board) {
    for (let i = 0; i < SIZE; i += 3) {
        fillBox(board, i, i);
    }
}

function fillBox(board, row, col) {
    let num;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            do {
                num = randomNumber();
            } while (!isSafeInBox(board, row, col, num));
            board[row + i][col + j] = num;
        }
    }
}

function isSafeInBox(board, row, col, num) {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[row + i][col + j] === num) {
                return false;
            }
        }
    }
    return true;
}

function randomNumber() {
    return Math.floor(Math.random() * 9) + 1;
}

function solveSudoku(board) {
    let emptySpot = findEmptyLocation(board);
    if (!emptySpot) return true;

    const [row, col] = emptySpot;
    for (let num = 1; num <= 9; num++) {
        if (isSafe(board, row, col, num)) {
            board[row][col] = num;
            if (solveSudoku(board)) {
                displayBoard(board);
                return true;
            }
            board[row][col] = EMPTY;
        }
    }
    return false;
}

function findEmptyLocation(board) {
    for (let row = 0; row < SIZE; row++) {
        for (let col = 0; col < SIZE; col++) {
            if (board[row][col] === EMPTY) {
                return [row, col];
            }
        }
    }
    return null;
}

function isSafe(board, row, col, num) {
    return isSafeInRow(board, row, num) &&
        isSafeInCol(board, col, num) &&
        isSafeInBox(board, row - (row % 3), col - (col % 3), num);
}

function isSafeInRow(board, row, num) {
    return !board[row].includes(num);
}

function isSafeInCol(board, col, num) {
    return !board.map(row => row[col]).includes(num);
}

function removeNumbersFromBoard(count) {
    let i = 0;
    while (i < count) {
        let row = Math.floor(Math.random() * SIZE);
        let col = Math.floor(Math.random() * SIZE);
        if (board[row][col] !== EMPTY) {
            board[row][col] = EMPTY;
            i++;
        }
    }
}

function displayBoard(board) {
    for (let i = 0; i < SIZE * SIZE; i++) {
        let row = Math.floor(i / SIZE);
        let col = i % SIZE;
        inputs[i].value = board[row][col] === EMPTY ? '' : board[row][col];
    }
}

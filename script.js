let grid = Array(4).fill().map(() => Array(4).fill(0));
let score = 0;

function generateNumber() {
    let emptyCells = [];
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (grid[i][j] === 0) {
                emptyCells.push({i, j});
            }
        }
    }
    if (emptyCells.length > 0) {
        let randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        grid[randomCell.i][randomCell.j] = Math.random() < 0.9 ? 2 : 4;
    }
}

function move(direction) {
    let moved = false;
    if (direction === 'left' || direction === 'right') {
        for (let i = 0; i < 4; i++) {
            let row = grid[i];
            let newRow = row.filter(cell => cell !== 0);
            if (direction === 'left') {
                for (let j = 0; j < newRow.length - 1; j++) {
                    if (newRow[j] === newRow[j+1]) {
                        newRow[j] *= 2;
                        score += newRow[j];
                        newRow.splice(j+1, 1);
                        moved = true;
                    }
                }
                while (newRow.length < 4) newRow.push(0);
            } else {
                for (let j = newRow.length - 1; j > 0; j--) {
                    if (newRow[j] === newRow[j-1]) {
                        newRow[j] *= 2;
                        score += newRow[j];
                        newRow.splice(j-1, 1);
                        moved = true;
                    }
                }
                while (newRow.length < 4) newRow.unshift(0);
            }
            if (newRow.join(',') !== row.join(',')) moved = true;
            grid[i] = newRow;
        }
    } else if (direction === 'up' || direction === 'down') {
        for (let j = 0; j < 4; j++) {
            let column = [grid[0][j], grid[1][j], grid[2][j], grid[3][j]];
            let newColumn = column.filter(cell => cell !== 0);
            if (direction === 'up') {
                for (let i = 0; i < newColumn.length - 1; i++) {
                    if (newColumn[i] === newColumn[i+1]) {
                        newColumn[i] *= 2;
                        score += newColumn[i];
                        newColumn.splice(i+1, 1);
                        moved = true;
                    }
                }
                while (newColumn.length < 4) newColumn.push(0);
            } else {
                for (let i = newColumn.length - 1; i > 0; i--) {
                    if (newColumn[i] === newColumn[i-1]) {
                        newColumn[i] *= 2;
                        score += newColumn[i];
                        newColumn.splice(i-1, 1);
                        moved = true;
                    }
                }
                while (newColumn.length < 4) newColumn.unshift(0);
            }
            if (newColumn.join(',') !== column.join(',')) moved = true;
            for (let i = 0; i < 4; i++) {
                grid[i][j] = newColumn[i];
            }
        }
    }
    if (moved) {
        generateNumber();
    }
    
    if (moved) {
        setTimeout(() => {
            generateNumber();
            updateUI();
            if (hasWon()) {
                document.getElementById('you-win').classList.remove('hidden');
            } else if (isGameOver()) {
                document.getElementById('game-over').classList.remove('hidden');
            }
        }, 150);
    }
    return moved;
}

function isGameOver() {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (grid[i][j] === 0) return false;
            if (i < 3 && grid[i][j] === grid[i+1][j]) return false;
            if (j < 3 && grid[i][j] === grid[i][j+1]) return false;
        }
    }
    return true;
}

function hasWon() {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (grid[i][j] === 2048) return true;
        }
    }
    return false;
}

function updateUI() {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            let cell = document.getElementById(`cell-${i}-${j}`);
            let newValue = grid[i][j];
            let oldValue = parseInt(cell.textContent) || 0;

            if (newValue !== oldValue) {
                if (newValue !== 0) {
                    cell.textContent = newValue;
                    cell.className = `grid-cell cell-${newValue}`;
                    if (oldValue === 0) {
                        cell.classList.add('cell-new');
                    } else {
                        cell.classList.add('cell-merged');
                    }
                } else {
                    cell.textContent = '';
                    cell.className = 'grid-cell';
                }
            }
        }
    }
    document.getElementById('score').textContent = score;

    // Rimuovi le classi di animazione dopo un breve ritardo
    setTimeout(() => {
        document.querySelectorAll('.cell-new, .cell-merged').forEach(cell => {
            cell.classList.remove('cell-new', 'cell-merged');
        });
    }, 200);
}

function init() {
    generateNumber();
    generateNumber();
    updateUI();
}

document.addEventListener('keydown', (event) => {
    let moved = false;
    switch(event.key) {
        case 'ArrowLeft':
            moved = move('left');
            break;
        case 'ArrowRight':
            moved = move('right');
            break;
        case 'ArrowUp':
            moved = move('up');
            break;
        case 'ArrowDown':
            moved = move('down');
            break;
    }
    if (moved) {
        updateUI();
        if (hasWon()) {
            document.getElementById('you-win').classList.remove('hidden');
        } else if (isGameOver()) {
            document.getElementById('game-over').classList.remove('hidden');
        }
    }
});

//New Game

function resetGame() {
    stopAutoPlay();
    grid = Array(4).fill().map(() => Array(4).fill(0));
    score = 0;
    document.getElementById('game-over').classList.add('hidden');
    document.getElementById('you-win').classList.add('hidden');
    init();
}

document.getElementById('reset-button').addEventListener('click', resetGame);

// Autoplay

let autoPlayInterval;

function startAutoPlay() {
    const directions = ['ArrowLeft', 'ArrowDown', 'ArrowRight', 'ArrowDown'];
    let index = 0;

    autoPlayInterval = setInterval(() => {
        document.dispatchEvent(new KeyboardEvent('keydown', { key: directions[index] }));
        index = (index + 1) % directions.length;
    }, 10); // Cambia la direzione ogni 500 ms
}

function stopAutoPlay() {
    clearInterval(autoPlayInterval);
}

// Chiama startAutoPlay() per iniziare il gioco automatico
// Chiama stopAutoPlay() per fermarlo


init();
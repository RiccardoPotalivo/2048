let grid = Array(4).fill().map(() => Array(4).fill(0));
let isGameEnded = false;
let score = 0;

// sound effects
function playMergeSound() {
    const sound = document.getElementById('mergeSound');
    sound.currentTime = 0;  // Riavvolge l'audio all'inizio
    sound.play().catch(e => console.log("Audio play failed:", e));
}

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
    if (isGameEnded) return false;
    let moved = false;
    let merged = false;

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
                        merged = true;
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
                        merged = true;
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
                        merged = true;
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
                        merged = true;
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
        setTimeout(() => {
            generateNumber();
            updateUI();

            if (merged) {
                playMergeSound();
            }
            if (hasWon()) {
                document.getElementById('you-win').classList.remove('hidden');
                isGameEnded = true;
            } else if (isGameOver()) {
                document.getElementById('game-over').classList.remove('hidden');
                isGameEnded = true;
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

// Comandi Pc

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

// Comandi Smartphone

let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

document.addEventListener('touchstart', function(event) {
    // console.log(event.target.id);
    if (event.target.id !== 'game-over') {
        touchStartX = event.changedTouches[0].screenX;
        touchStartY = event.changedTouches[0].screenY;
        // Previeni l'azione predefinita del browser per il touchstart
        event.preventDefault();
    }
}, { passive: false });

document.addEventListener('touchend', function(event) {
    if (event.target.id !== 'game-over') {
        touchEndX = event.changedTouches[0].screenX;
        touchEndY = event.changedTouches[0].screenY;
        handleSwipe();
        // Previeni l'azione predefinita del browser per il touchend
        event.preventDefault();
    }
}, { passive: false });

function handleSwipe() {
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    const minSwipeDistance = 50; // Distanza minima per considerare uno swipe

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Swipe orizzontale
        if (Math.abs(deltaX) > minSwipeDistance) {
            if (deltaX > 0) {
                move('right');
            } else {
                move('left');
            }
        }
    } else {
        // Swipe verticale
        if (Math.abs(deltaY) > minSwipeDistance) {
            if (deltaY > 0) {
                move('down');
            } else {
                move('up');
            }
        }
    }
}

//New Game

function resetGame() {
    grid = Array(4).fill().map(() => Array(4).fill(0));
    score = 0;
    isGameEnded = false;
    document.getElementById('game-over').classList.add('hidden');
    document.getElementById('you-win').classList.add('hidden');
    init();
}

document.getElementById('reset-button').addEventListener('click', resetGame);
document.getElementById('reset-button').addEventListener('touchend', function(event) {
    event.preventDefault();
    event.stopPropagation();
    resetGame();
}, { passive: false });

document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && isGameEnded) {
        resetGame();
        return;
    }

    if (isGameEnded) return;

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
    }
});

// Disabilita lo zoom 

// document.addEventListener('touchmove', function (event) {
//     if (event.scale !== 1) {
//         event.preventDefault();
//     }
// }, { passive: false });

// let lastTouchEnd = 0;
// document.addEventListener('touchend', function (event) {
//     const now = (new Date()).getTime();
//     if (now - lastTouchEnd <= 300) {
//         event.preventDefault();
//     }
//     lastTouchEnd = now;
// }, false);

// Funzioni di gioco per pc e smartphone

// function move(direction) {
//     if (isGameEnded) return false;
//     let moved = false;
    
//     if (moved) {
//         setTimeout(() => {
//             generateNumber();
//             updateUI();
//             if (hasWon()) {
//                 document.getElementById('you-win').classList.remove('hidden');
//                 isGameEnded = true;
//             } else if (isGameOver()) {
//                 document.getElementById('game-over').classList.remove('hidden');
//                 isGameEnded = true;
//             }
//         }, 150);
//     }
//     return moved;
// }


init();
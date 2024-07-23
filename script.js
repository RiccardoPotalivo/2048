let grid = Array(4).fill().map(() => Array(4).fill(0));
let isGameEnded = false;
let score = 0;
const cellSize = 100; // Dimensione di una cella in pixel
const gapSize = 10;   // Dimensione dello spazio tra le celle in pixel

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

    if (direction === 'left') {
        for (let i = 0; i < 4; i++) {
            let row = grid[i];
            let newRow = row.filter(cell => cell !== 0);
            let mergedRow = [];
            
            for (let j = 0; j < newRow.length; j++) {
                if (j < newRow.length - 1 && newRow[j] === newRow[j+1]) {
                    mergedRow.push(newRow[j] * 2);
                    score += newRow[j] * 2;
                    j++;
                    merged = true;
                } else {
                    mergedRow.push(newRow[j]);
                }
            }
            
            while (mergedRow.length < 4) mergedRow.push(0);
            
            if (mergedRow.join(',') !== row.join(',')) {
                moved = true;
                for (let j = 0; j < 4; j++) {
                    if (grid[i][j] !== mergedRow[j]) {
                        let cell = document.getElementById(`cell-${i}-${j}`);
                        let targetJ = mergedRow.indexOf(grid[i][j]);
                        if (targetJ !== -1 && targetJ < j) {
                            let distance = (j - targetJ) * (cellSize + gapSize);
                            cell.style.transition = 'transform 0.2s ease-in-out';
                            cell.style.transform = `translateX(-${distance}px)`;
                        }
                    }
                }
            }
            
            grid[i] = mergedRow;
        }
    }

    else if (direction === 'right') {
        for (let i = 0; i < 4; i++) {
            let row = grid[i];
            let newRow = row.filter(cell => cell !== 0);
            let mergedRow = [];
            
            for (let j = newRow.length - 1; j >= 0; j--) {
                if (j > 0 && newRow[j] === newRow[j-1]) {
                    mergedRow.unshift(newRow[j] * 2);
                    score += newRow[j] * 2;
                    j--;
                    merged = true;
                } else {
                    mergedRow.unshift(newRow[j]);
                }
            }
            
            while (mergedRow.length < 4) mergedRow.unshift(0);
            
            if (mergedRow.join(',') !== row.join(',')) {
                moved = true;
                for (let j = 3; j >= 0; j--) {
                    if (grid[i][j] !== mergedRow[j]) {
                        let cell = document.getElementById(`cell-${i}-${j}`);
                        let targetJ = 3 - mergedRow.slice().reverse().indexOf(grid[i][j]);
                        if (targetJ !== -1 && targetJ > j) {
                            let distance = (targetJ - j) * (cellSize + gapSize);
                            cell.style.transition = 'transform 0.2s ease-in-out';
                            cell.style.transform = `translateX(${distance}px)`;
                        }
                    }
                }
            }
            
            grid[i] = mergedRow;
        }
    }

    else if (direction === 'up') {
        for (let j = 0; j < 4; j++) {
            let column = [grid[0][j], grid[1][j], grid[2][j], grid[3][j]];
            let newColumn = column.filter(cell => cell !== 0);
            let mergedColumn = [];
            
            for (let i = 0; i < newColumn.length; i++) {
                if (i < newColumn.length - 1 && newColumn[i] === newColumn[i+1]) {
                    mergedColumn.push(newColumn[i] * 2);
                    score += newColumn[i] * 2;
                    i++;
                    merged = true;
                } else {
                    mergedColumn.push(newColumn[i]);
                }
            }
            
            while (mergedColumn.length < 4) mergedColumn.push(0);
            
            if (mergedColumn.join(',') !== column.join(',')) {
                moved = true;
                for (let i = 0; i < 4; i++) {
                    if (grid[i][j] !== mergedColumn[i]) {
                        let cell = document.getElementById(`cell-${i}-${j}`);
                        let targetI = mergedColumn.indexOf(grid[i][j]);
                        if (targetI !== -1 && targetI < i) {
                            let distance = (i - targetI) * (cellSize + gapSize);
                            cell.style.transition = 'transform 0.2s ease-in-out';
                            cell.style.transform = `translateY(-${distance}px)`;
                        }
                    }
                }
            }
            
            for (let i = 0; i < 4; i++) {
                grid[i][j] = mergedColumn[i];
            }
        }
    }

    else if (direction === 'down') {
        for (let j = 0; j < 4; j++) {
            let column = [grid[0][j], grid[1][j], grid[2][j], grid[3][j]];
            let newColumn = column.filter(cell => cell !== 0);
            let mergedColumn = [];
            
            for (let i = newColumn.length - 1; i >= 0; i--) {
                if (i > 0 && newColumn[i] === newColumn[i-1]) {
                    mergedColumn.unshift(newColumn[i] * 2);
                    score += newColumn[i] * 2;
                    i--;
                    merged = true;
                } else {
                    mergedColumn.unshift(newColumn[i]);
                }
            }
            
            while (mergedColumn.length < 4) mergedColumn.unshift(0);
            
            if (mergedColumn.join(',') !== column.join(',')) {
                moved = true;
                for (let i = 3; i >= 0; i--) {
                    if (grid[i][j] !== mergedColumn[i]) {
                        let cell = document.getElementById(`cell-${i}-${j}`);
                        let targetI = 3 - mergedColumn.slice().reverse().indexOf(grid[i][j]);
                        if (targetI !== -1 && targetI > i) {
                            let distance = (targetI - i) * (cellSize + gapSize);
                            cell.style.transition = 'transform 0.2s ease-in-out';
                            cell.style.transform = `translateY(-${distance}px)`;
                        }
                    }
                }
            }
            
            for (let i = 0; i < 4; i++) {
                grid[i][j] = mergedColumn[i];
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
        }, 250);  // Aumentato il ritardo per permettere alle animazioni di completarsi
    } else {
        // Se non c'è stato movimento, resettiamo comunque le trasformazioni
        resetTransforms();
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

function resetTransforms() {
    document.querySelectorAll('.grid-cell').forEach(cell => {
        cell.style.transition = 'none';
        cell.style.transform = 'none';
    });
}

function updateUI() {
    // console.log(window.innerWidth)

    // Resettiamo tutte le trasformazioni
    resetTransforms();


    const gridContainer = document.querySelector('.grid-container');

    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            let cell = document.getElementById(`cell-${i}-${j}`);
            let newValue = grid[i][j];
            let oldValue = parseInt(cell.textContent) || 0;

            if (newValue !== oldValue) {
                if (newValue !== 0) {
                    // Crea un nuovo elemento per l'animazione
                    let animatedCell = document.createElement('div');
                    animatedCell.className = `grid-cell cell-${newValue} cell-animated`;
                    animatedCell.textContent = newValue;

                    // Posiziona l'elemento animato nella posizione corretta
                    animatedCell.style.position = 'absolute';
                    animatedCell.style.width = `${cellSize}px`;
                    animatedCell.style.height = `${cellSize}px`;
                    animatedCell.style.left = `${j * (cellSize + gapSize)}px`;
                    animatedCell.style.top = `${i * (cellSize + gapSize)}px`;

                    // Aggiungi l'elemento animato al container
                    gridContainer.appendChild(animatedCell);

                    // Aggiorna la cella originale
                    cell.textContent = newValue;
                    cell.className = `grid-cell cell-${newValue}`;

                    // Avvia l'animazione
                    setTimeout(() => {
                        animatedCell.style.transform = 'scale(1.1)';
                        animatedCell.style.opacity = '0';
                    }, 50);

                    // Rimuovi l'elemento animato dopo l'animazione
                    setTimeout(() => {
                        gridContainer.removeChild(animatedCell);
                    }, 300);

                } else {
                    cell.textContent = '';
                    cell.className = 'grid-cell';
                }
            }
        }
    }
    document.getElementById('score').textContent = score;

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
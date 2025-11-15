const createPlayer = (name, mark) => ({ name, mark });

const board = document.querySelector(".board");
const player1Container = document.querySelector(".player1");
const player2Container = document.querySelector(".player2");
const reset = document.getElementById("reset");
const winDialog = document.querySelector(".win-dialog");
const winStatus = document.getElementById("win-status");

const player1 = createPlayer("Player 1", "X");
const player2 = createPlayer("Player 2", "O");

function Gameboard() {
    const frag = document.createDocumentFragment();
        
    let activePlayer = player1;
    let boardState = Array(9).fill(null);
    let gameOver = false;

    const winningCombos = [
    [0,1,2],[3,4,5],[6,7,8], 
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]          
    ];

    function checkWinner(state) {
        for (const [a,b,c] of winningCombos) {
            if (state[a] && state[a] === state[b] && state[a] === state[c]) {
            return state[a];
            }
        }
        return null;
    }

    for (let i = 0; i < 9; i++) {
        const tile = document.createElement("div");
        tile.className = "tile";
        tile.setAttribute("data-index", i + 1);
        tile.setAttribute("role", "button");
        tile.setAttribute("aria-label", `Grid cell ${i + 1}, empty`);

        frag.appendChild(tile);

        tile.addEventListener("click", () => {
            
            if (tile.textContent !== "") {
                return; 
            }

            tile.textContent = activePlayer.mark;
            tile.setAttribute("aria-label", `Grid cell ${i + 1}, ${activePlayer.mark}`);
            boardState[i] = activePlayer.mark;

            const winnerMark = checkWinner(boardState);
            if (winnerMark) {
                console.log(`Winner: ${winnerMark} — ${winnerMark === player1.mark ? player1.name : player2.name}`);
                gameOver = true;
                if (winnerMark === player1.mark) {
                    winDialog.showModal();
                    winStatus.textContent = "Player 1 Wins!";
                } else {
                    winDialog.showModal();
                    winStatus.textContent = "Player 2 Wins!";
                }
                return;
            }

            if (activePlayer === player1) {
                activePlayer = player2;
                player1Container.classList.remove("selected");
                player2Container.classList.add("selected");
            } else {
                activePlayer = player1;
                player2Container.classList.remove("selected");
                player1Container.classList.add("selected");
            }

             if (!boardState.includes(null)) {
                winDialog.showModal();
                winStatus.textContent = "Draw!";
                return;
            }
        });
    }

    board.appendChild(frag);

  reset.addEventListener("click", () => resetGame());

  replay.addEventListener("click" , () => {
    resetGame();
    winDialog.close();
  })

  const resetGame = () => {
    const tiles = board.querySelectorAll(".tile");
    
    tiles.forEach(tile => {
        tile.textContent = "";
        const index = tile.getAttribute("data-index");
        tile.setAttribute("aria-label", `Grid cell ${index}, empty`);
    });

    for (let i = 0; i < boardState.length; i++) {
        boardState[i] = null;
    }

    boardState = Array(9).fill(null);
    gameOver = false;
    activePlayer = player1;

    player1Container.classList.add("selected");
    player2Container.classList.remove("selected");
  }
}

Gameboard();

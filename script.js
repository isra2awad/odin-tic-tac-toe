const Displaycontroller = (() => {
  const renderMessage = (message) => {
    document.querySelector("#message").innerHTML = message;
  };
  return {
    renderMessage,
  };
})();

const Gameboard = (() => {
  let gameboard = ["", "", "", "", "", "", "", "", ""];

  const render = () => {
    let gameboardElement_div = "";
    gameboard.forEach((square, index) => {
      gameboardElement_div += `<div class="square" id="square-${index}">${square}</div>`;
    });
    document.querySelector("#gameboard").innerHTML = gameboardElement_div;
    const squares = document.querySelectorAll(".square");
    squares.forEach((square) => {
      square.addEventListener("click", Game.handleClick);
    });
  };

  const restart = () => {
    for (let index = 0; index < gameboard.length; index++) {
      gameboard[index] = "";
      Gameboard.render();
    }
  };
  const update = (index, value) => {
    gameboard[index] = value;
    render();
  };

  const getGameboard = () => gameboard;

  return {
    render,
    update,
    restart,
    getGameboard,
  };
})();

const createPlayer = (name, mark) => {
  return {
    name,
    mark,
  };
};

const Game = (() => {
  let players = [];
  let currentPlayerIndex;
  let gameOver;
  const start = () => {
    gameOver = false;
    players = [
      createPlayer(document.querySelector("#player1").value, "x"),
      createPlayer(document.querySelector("#player2").value, "O"),
    ];
    currentPlayerIndex = 0;
    gameOver = false;
    Gameboard.render();
  };
  const handleClick = (event) => {
    if (gameOver) {
      return;
    }
    let index = parseInt(event.target.id.split("-")[1]);
    if (Gameboard.getGameboard()[index] !== "") return;

    Gameboard.update(index, players[currentPlayerIndex].mark);
    if (
      checkForWin(Gameboard.getGameboard(), players[currentPlayerIndex].mark)
    ) {
      gameOver = true;
      Displaycontroller.renderMessage(
        `${players[currentPlayerIndex].name} Won!`
      );
    } else if (checkForTie(Gameboard.getGameboard())) {
      gameOver = true;
      Displaycontroller.renderMessage("it is a tie !");
    }

    currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
  };

  const restart = () => {
    for (let i = 0; i < 9; i++) {
      Gameboard.update(i, "");
      Gameboard.render();
      document.querySelector("#message").innerHTML = "";
    }
  };
  return {
    start,
    handleClick,
    restart,
  };
})();

function checkForTie(board) {
  return board.every((cell) => cell !== "");
}

function checkForWin(board) {
  const winningCombination = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [2, 4, 6],
    [0, 4, 8],
  ];

  for (let i = 0; i < winningCombination.length; i++) {
    const [a, b, c] = winningCombination[i];
    if (board[a] && board[a] === board[b] && board[b] === board[c]) {
      return true;
    }
  }
  return false;
}

const startButton = document.querySelector("#start-button");
startButton.addEventListener("click", () => {
  Game.start();
});

const restartButton = document.querySelector("#restart-button");
restartButton.addEventListener("click", () => {
  Game.restart();
});

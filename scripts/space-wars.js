function createSpaceWars() {
  const currentUser = sessionStorage.getItem("CurrentUser");
  const getAllUsers = JSON.parse(localStorage.getItem("users"));
  const checkBestScore = getAllUsers.find((user) => user.login === currentUser);
  let bestScore = checkBestScore.bestScore.spaceWars ? checkBestScore.bestScore.spaceWars : 0;

  if (checkBestScore.bestScore.spaceWars === undefined) {
    checkBestScore.bestScore.spaceWars = 0;
    const usersString = JSON.stringify(getAllUsers);
    localStorage.setItem("users", usersString);
  }

  const board = document.createElement("canvas");
  board.classList.add("board");
  const startBtn = document.createElement("button");
  startBtn.innerHTML = "Start Game";
  startBtn.classList.add("start-btn");

  let tileSize = 32;
  let rows = 16;
  let columns = 16;

  let boardWidth = tileSize * columns;
  let boardHeigth = tileSize * rows;
  let context;
  board.width = boardWidth;
  board.height = boardHeigth;

  let shipWidth = tileSize * 2;
  let shipHeigth = tileSize;
  let shipX = (tileSize * columns) / 2 - tileSize;
  let shipY = tileSize * rows - tileSize * 2;

  let ship = {
    x: shipX,
    y: shipY,
    width: shipWidth,
    height: shipHeigth,
  };

  let shipImg;
  let shipVelocityX = tileSize;

  let alienArray = [];
  let allienWidth = tileSize * 2;
  let allienHeigth = tileSize;
  let alienX = tileSize;
  let alienY = tileSize;
  let alienImg;

  let alienRows = 2;
  let alienColumns = 3;
  let alienCount = 0;
  let alienVelocityX = 2;

  let bulletArray = [];
  let bulletVelocityY = -10;

  let score = 0;
  let gameOver = true;

  // window.addEventListener("load", addGame);
  document.onload = addGame();
  function addGame() {
    const minigameWindow = document.querySelector(".play-minigames");

    context = board.getContext("2d");

    //load images
    shipImg = new Image();
    shipImg.src = "../scripts/space-wars/img/player.png";
    shipImg.onload = function (params) {
      context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);
    };

    alienImg = new Image();
    alienImg.src = "../scripts/space-wars/img/alien.png";
    createAliens();

    requestAnimationFrame(update);
    document.addEventListener("keydown", moveShip);
    document.addEventListener("keyup", shoot);

    startBtn.addEventListener(
      "click",
      () => {
        gameOver = false;
      },
      { once: true }
    );
    startBtn.removeEventListener("keydown", moveShip);

    minigameWindow.appendChild(board);
    minigameWindow.appendChild(startBtn);
  }

  function update() {
    requestAnimationFrame(update);

    if (gameOver) {
      return;
    }

    context.clearRect(0, 0, board.width, board.height);
    //ship
    context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);

    //alien
    for (let i = 0; i < alienArray.length; i++) {
      let alien = alienArray[i];
      if (alien.alive) {
        alien.x += alienVelocityX;

        //if alien touches the borders
        if (alien.x + alien.width >= board.width || alien.x <= 0) {
          alienVelocityX *= -1;
          alien.x += alienVelocityX * 4;

          for (let j = 0; j < alienArray.length; j++) {
            alienArray[j].y += allienHeigth;
          }
        }

        context.drawImage(alienImg, alien.x, alien.y, alien.width, alien.height);

        if (alien.y >= ship.y) {
          gameOver = true;
          setBestScore(score);
        }
      }
    }

    //bullets
    for (let i = 0; i < bulletArray.length; i++) {
      let bullet = bulletArray[i];
      bullet.y += bulletVelocityY;
      context.fillStyle = "white";
      context.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);

      for (let j = 0; j < alienArray.length; j++) {
        let alien = alienArray[j];
        if (!bullet.used && alien.alive && detectCollision(bullet, alien)) {
          bullet.used = true;
          alien.alive = false;
          alienCount--;
          score += 100;
        }
      }
    }

    //clear bullets
    while (bulletArray.length > 0 && (bulletArray[0].used || bulletArray[0].y < 0)) {
      bulletArray.shift();
    }

    //next level
    if (alienCount == 0) {
      score += alienColumns * alienRows * 100;
      alienColumns = Math.min(alienColumns + 1, columns / 2 - 2);
      alienRows = Math.min(alienRows + 1, rows - 4);
      if (alienVelocityX > 0) {
        alienVelocityX += 0.2;
      } else {
        alienVelocityX -= 0.2;
      }
      alienArray = [];
      bulletArray = [];
      createAliens();
    }

    //score
    context.fillStyle = "white";
    context.font = "16px courier";
    context.fillText(score, 5, 20);
  }

  function moveShip(e) {
    if (gameOver) {
      return;
    }

    if (e.code == "ArrowLeft" && ship.x - shipVelocityX >= 0) {
      ship.x -= shipVelocityX;
    } else if (e.code == "ArrowRight" && ship.x + shipVelocityX + ship.width <= board.width) {
      ship.x += shipVelocityX; //move right one tile
    }
  }

  function createAliens() {
    for (let i = 0; i < alienColumns; i++) {
      for (let j = 0; j < alienRows; j++) {
        let alien = {
          img: alienImg,
          x: alienX + i * allienWidth,
          y: alienY + j * allienHeigth,
          width: allienWidth,
          height: allienHeigth,
          alive: true,
        };

        alienArray.push(alien);
      }
    }
    alienCount = alienArray.length;
  }

  function shoot(e) {
    if (gameOver) {
      return;
    }

    if (e.code == "Space") {
      //shoot
      let bullet = {
        x: ship.x + (shipWidth * 15) / 32,
        y: ship.y,
        width: tileSize / 8,
        height: tileSize / 2,
        used: false,
      };
      bulletArray.push(bullet);
    }
  }

  function detectCollision(a, b) {
    return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
  }

  function setBestScore(currentScore) {
    if (currentScore > bestScore) {
      bestScore = currentScore;
      checkBestScore.bestScore.spaceWars = bestScore;
      const usersString = JSON.stringify(getAllUsers);
      localStorage.setItem("users", usersString);
    }
  }
}

createSpaceWars();

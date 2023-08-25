function createClicker() {
  const currentUser = sessionStorage.getItem("CurrentUser");
  const getAllUsers = JSON.parse(localStorage.getItem("users"));
  const checkBestScore = getAllUsers.find((user) => user.login === currentUser);
  let bestScore = checkBestScore.bestScore.clicker ? checkBestScore.bestScore.clicker : 0;
  let clickCount = 0;
  let startInterval;
  let clickerTimer;

  if (checkBestScore.bestScore.clicker === undefined) {
    checkBestScore.bestScore.clicker = 0;
    const usersString = JSON.stringify(getAllUsers);
    localStorage.setItem("users", usersString);
  }

  const clickButton = document.createElement("button");
  clickButton.className = "clicker-click-btn";
  clickButton.innerHTML = "Click to start!";

  const clickerInfo = document.createElement("div");
  clickerInfo.className = "clicker-info";

  const resetBtn = document.createElement("button");
  resetBtn.className = "clicker-reset-btn";
  resetBtn.innerHTML = "Reset";

  const getBestScore = document.createElement("p");
  getBestScore.className = "click-count";
  getBestScore.innerHTML = `Best score: ${bestScore}`;

  const minigameWindow = document.querySelector(".play-minigames");
  minigameWindow.appendChild(clickButton);
  minigameWindow.appendChild(clickerInfo);
  clickerInfo.appendChild(resetBtn);
  clickerInfo.appendChild(getBestScore);

  clickButton.addEventListener("click", startGame, { once: true });
  resetBtn.addEventListener("click", resetGame);

  function startGame() {
    let startTimer = 3;
    startInterval = setInterval(() => {
      clickButton.innerHTML = `${startTimer}`;
      startTimer--;
      if (startTimer == -1) {
        clickButton.innerHTML = `Start!!!`;
        clearInterval(startInterval);
        clickButton.addEventListener("click", startCliker);
        clickerTimer = setTimeout(() => {
          clickButton.removeEventListener("click", startCliker);
          setBestScore(clickCount);
        }, 5000);
      }
    }, 1000);
  }

  function resetGame() {
    clickButton.innerHTML = "Click to start!";
    clickCount = 0;
    clearInterval(startInterval);
    clearTimeout(clickerTimer);
    clickButton.removeEventListener("click", startCliker);
    clickButton.addEventListener("click", startGame, { once: true });
  }

  function startCliker() {
    clickCount++;
    clickButton.innerHTML = `${clickCount}`;
  }

  function setBestScore(currentScore) {
    if (currentScore > bestScore) {
      bestScore = currentScore;
      checkBestScore.bestScore.clicker = bestScore;
      const usersString = JSON.stringify(getAllUsers);
      localStorage.setItem("users", usersString);
      getBestScore.innerHTML = `Best score: ${bestScore}`;
    }
    getBestScore.innerHTML = `Best score: ${bestScore}`;
  }
}

createClicker();

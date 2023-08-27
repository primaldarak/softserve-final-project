"use strict";
document.addEventListener("DOMContentLoaded", () => {
  const CURRENT_USER = "CurrentUser";
  const USERS = "users";
  const users = JSON.stringify([]);

  const loginWindow = document.querySelector(".login-window");
  const loginInput = document.querySelector("#login-input");
  const loginButton = document.querySelector("#login-btn");
  const welcome = document.querySelector(".welcome");
  const scoreboardBtn = document.querySelector(".header-center .scoreboard-btn");
  const scoreboardWindow = document.querySelector(".scoreboard-window");
  const scoreboard = document.querySelector(".scoreboard");
  const scoreboardInfo = document.querySelector(".scoreboard-info");
  const selectedGameScore = document.querySelector("#scoreboard-select");
  const logoutBtn = document.querySelector(".header-center .logout-btn");
  const minigamesSection = document.querySelector(".minigames-section");
  const minigamesColection = document.querySelector(".minigames-collection");
  const playBtn = [...document.querySelectorAll(`.minigame-btn[data-game]`)];
  const minigameShowWindow = document.querySelector(".show-minigames");

  if (localStorage.getItem(USERS) === null) {
    localStorage.setItem(USERS, users);
  }

  if (sessionStorage.getItem(CURRENT_USER) === null) {
    sessionStorage.setItem(CURRENT_USER, "");
  }

  if (sessionStorage.getItem(CURRENT_USER).length !== 0) {
    const currentUser = sessionStorage.getItem(CURRENT_USER);
    welcome.innerHTML = `Welcome, ${currentUser}`;
    loginWindow.classList.add("hide");
    document.querySelector(".header-center .logout-btn").classList.remove("hide");
    minigamesSection.classList.remove("hide");
    scoreboardBtn.classList.remove("hide");
  }

  function loginUser() {
    const loginInputValue = document.querySelector("#login-input").value;
    const users = JSON.parse(localStorage.getItem(USERS));
    const userChecker = users.find((user) => user.login === loginInputValue);
    const errorMessage = document.querySelector(".login-error");

    if (loginInputValue.length === 0) {
      errorMessage.innerHTML = "Enter valid login";
      return;
    }
    errorMessage.innerHTML = "";

    if (!userChecker) {
      const userData = {
        login: loginInputValue,
        bestScore: {},
      };
      users.push(userData);
      const usersString = JSON.stringify(users);
      localStorage.setItem(USERS, usersString);
    }
    sessionStorage.setItem(CURRENT_USER, loginInputValue);

    loginWindow.classList.add("animate__backOutUp");
    minigamesColection.classList.add("animate__backInUp");
    const showCollectionTimeout = setTimeout(() => {
      loginWindow.classList.toggle("hide");
      logoutBtn.classList.remove("hide");
      scoreboardBtn.classList.remove("hide");
      minigamesSection.classList.remove("hide");
      minigamesColection.classList.remove("animate__backOutDown");
      welcome.innerHTML = `Welcome, ${loginInputValue}`;
    }, 600);

    loginInput.value = "";
  }

  loginButton.addEventListener("click", loginUser);
  loginInput.addEventListener("keydown", function (e) {
    if (e.code === "Enter") {
      loginUser();
    }
  });

  selectedGameScore.addEventListener("change", refreshScoreboard);
  function refreshScoreboard() {
    const users = JSON.parse(localStorage.getItem(USERS));
    scoreboardInfo.innerHTML = ``;

    users.forEach((e, i) => {
      if (e.bestScore[selectedGameScore.value] == undefined) {
        e.bestScore[selectedGameScore.value] = 0;
      }
      const score = document.createElement("p");
      score.innerHTML = `${i + 1}. ${e.login} - ${e.bestScore[`${selectedGameScore.value}`]}`;
      scoreboardInfo.appendChild(score);
    });
  }

  scoreboardBtn.addEventListener("click", function showScoreboard() {
    if (!minigameShowWindow.classList.contains("hide")) {
      minigameShowWindow.classList.add("animate__backOutDown");
      scoreboardWindow.classList.add("animate__backInDown");
      const scoreboardTimeout = setTimeout(() => {
        minigamesSection.classList.add("hide");
        scoreboardWindow.classList.remove("hide");
        setTimeout(() => {
          scoreboardBtn.classList.add("hide");
          minigameShowWindow.classList.remove("animate__backOutDown");
          scoreboardWindow.classList.remove("animate__backInDown");
        }, 1000);
      }, 650);
    } else if (!minigamesColection.classList.contains("hide")) {
      minigamesColection.classList.add("animate__backOutDown");
      scoreboardWindow.classList.add("animate__backInDown");
      const scoreboardTimeout = setTimeout(() => {
        minigamesSection.classList.add("hide");
        scoreboardWindow.classList.remove("hide");
        setTimeout(() => {
          scoreboardBtn.classList.add("hide");
          minigamesColection.classList.remove("animate__backOutDown");
          scoreboardWindow.classList.remove("animate__backInDown");
        }, 1000);
      }, 650);
    }
  });

  logoutBtn.addEventListener("click", function logout() {
    sessionStorage.setItem(CURRENT_USER, "");
    const docTitle = document.querySelector("title");

    if (!minigameShowWindow.classList.contains("hide")) {
      minigameShowWindow.classList.add("animate__backOutDown");
    }

    loginWindow.classList.remove("animate__backOutUp");
    loginWindow.classList.add("animate__backInDown");

    const logoutTimeout = setTimeout(() => {
      scoreboardWindow.classList.add("hide");
      minigamesColection.classList.remove("hide");
      minigamesSection.classList.add("hide");
      welcome.innerHTML = `Welcome`;
      docTitle.innerHTML = `Mini games`;
      logoutBtn.classList.add("hide");
      loginWindow.classList.remove("hide");
      minigameShowWindow.classList.add("hide");
      minigameShowWindow.classList.remove("animate__backOutDown");
    }, 650);

    minigamesColection.classList.remove("animate__backInUp");
    minigamesColection.classList.add("animate__backOutDown");
  });

  playBtn.forEach((e) => {
    e.addEventListener("click", function createGame() {
      const gameName = e.getAttribute("data-game");
      const gameTitle = e.getAttribute("name");

      const docTitle = document.querySelector("title");
      docTitle.innerHTML = `${gameTitle}`;

      const createScript = document.createElement("script");
      createScript.setAttribute("src", `./scripts/${gameName}.js`);

      minigamesColection.classList.add("animate__backOutLeft");
      minigameShowWindow.classList.add("animate__backInRight");
      const showMinigameTimeout = setTimeout(() => {
        minigamesColection.classList.add("hide");
        minigameShowWindow.classList.remove("hide");
        setTimeout(() => {
          minigamesColection.classList.remove("animate__backOutLeft");
          minigameShowWindow.classList.remove("animate__backInRight");
        }, 1000);
      }, 400);

      document.querySelector(".play-minigames").innerHTML = "";

      document.body.appendChild(createScript);
    });
  });

  const returnBtn = document.querySelectorAll(".return-to-collection");
  returnBtn.forEach((e) =>
    e.addEventListener("click", () => {
      if (!minigameShowWindow.classList.contains("hide")) {
        minigameShowWindow.classList.add("animate__backOutRight");
        minigamesColection.classList.add("animate__backInLeft");
        scoreboardWindow.classList.add("animate__backOutUp");

        const returnMinigameTimeout = setTimeout(() => {
          minigamesSection.classList.remove("hide");
          minigamesColection.classList.remove("hide");
          minigameShowWindow.classList.add("hide");
          scoreboardWindow.classList.add("hide");
          setTimeout(() => {
            scoreboardBtn.classList.remove("hide");
            minigamesColection.classList.remove("animate__backInLeft");
            minigameShowWindow.classList.remove("animate__backOutRight");
            scoreboardWindow.classList.remove("animate__backOutUp");
          }, 1000);
        }, 400);
      } else if (!minigamesColection.classList.contains("hide")) {
        scoreboardWindow.classList.add("animate__backOutUp");
        minigamesColection.classList.add("animate__backInUp");
        const returnMinigameTimeout = setTimeout(() => {
          minigamesSection.classList.remove("hide");
          scoreboardWindow.classList.add("hide");
          setTimeout(() => {
            scoreboardBtn.classList.remove("hide");
            minigamesColection.classList.remove("animate__backInUp");
            scoreboardWindow.classList.remove("animate__backOutUp");
          }, 1000);
        }, 400);
      }
    })
  );

  function preloadImages(array) {
    if (!preloadImages.list) {
      preloadImages.list = [];
    }
    let list = preloadImages.list;
    for (let i = 0; i < array.length; i++) {
      let img = new Image();
      img.onload = function () {
        let index = list.indexOf(this);
        if (index !== -1) {
          // remove image from the array once it's loaded
          // for memory consumption reasons
          list.splice(index, 1);
        }
      };
      list.push(img);
      img.src = array[i];
    }
  }

  preloadImages(["./img/player.png", "./img/alien.png", "./img/space.png"]);

  refreshScoreboard();
});

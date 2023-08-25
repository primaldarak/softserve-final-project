"use strict";
document.addEventListener("DOMContentLoaded", () => {
  const CURRENT_USER = "CurrentUser";
  const USERS = "users";
  const users = JSON.stringify([]);

  const loginWindow = document.querySelector(".login-window");
  const loginInput = document.querySelector("#login-input");
  const loginButton = document.querySelector("#login-btn");
  const welcome = document.querySelector(".welcome");
  const logoutBtn = document.querySelector(".header-center .logout");
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
    document.querySelector(".header-center .logout").classList.remove("hide");
    minigamesSection.classList.remove("hide");
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
    const showCollectionTimeout = setTimeout(() => {
      loginWindow.classList.toggle("hide");
      document.querySelector(".header-center .logout").classList.remove("hide");
      minigamesSection.classList.remove("hide");
      minigamesColection.classList.remove("animate__backOutDown");
      welcome.innerHTML = `Welcome, ${loginInputValue}`;
    }, 600);
    minigamesColection.classList.add("animate__backInUp");

    loginInput.value = "";
  }

  loginButton.addEventListener("click", loginUser);
  loginInput.addEventListener("keydown", function (e) {
    if (e.code === "Enter") {
      loginUser();
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
      document.querySelector(".header-center .logout").classList.remove("hide");
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

  const returnBtn = document.querySelector(".return-to-collection");
  returnBtn.addEventListener("click", () => {
    minigameShowWindow.classList.add("animate__backOutRight");
    minigamesColection.classList.add("animate__backInLeft");
    const returnMinigameTimeout = setTimeout(() => {
      minigamesColection.classList.remove("hide");
      minigameShowWindow.classList.add("hide");
      setTimeout(() => {
        minigamesColection.classList.remove("animate__backInLeft");
        minigameShowWindow.classList.remove("animate__backOutRight");
      }, 1000);
    }, 400);
  });
});

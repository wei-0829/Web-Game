/********************************************
 * settings.js
 * - 使用 userList 中 score/balls
 ********************************************/

window.addEventListener("DOMContentLoaded", () => {
  checkLoginStatus();
  initializeCurrentUserScoreBalls();
  updateDisplay();

  // 綁定樣式按鈕
  const styleMap = {
    darkStyle: "dark",
    lightStyle: "light",
    pinkStyle: "pink",
    blueStyle: "blue",
    lightGreenStyle: "lightGreen",
  };
  Object.entries(styleMap).forEach(([btnId, styleKey]) => {
    const btn = document.getElementById(btnId);
    if (btn) {
      btn.addEventListener("click", () => switchStyle(styleKey));
    }
  });

  // 加值點數
  document.getElementById("addPoints").addEventListener("click", () => {
    const input = prompt("請輸入加值點數：");
    if (input === null) return;
    const addedPoints = parseInt(input, 10);
    if (isNaN(addedPoints) || addedPoints <= 0) {
      alert("輸入的點數無效！");
    } else {
      addScore(addedPoints);
      alert(`成功加值 ${addedPoints} 點！`);
      updateDisplay();
    }
  });

  // 登出
  document.getElementById("logout").addEventListener("click", () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
    alert("已登出！");
    window.location.href = "index.html";
  });

  // 前往柏青哥
  document.getElementById("goPachinko").addEventListener("click", () => {
    window.location.href = "pckg.html";
  });

  // 前往拉霸機
  document.getElementById("goSlotMachine").addEventListener("click", () => {
    window.location.href = "slot.html";
  });

  // 前往排行榜
  document.getElementById("goLeaderboard").addEventListener("click", () => {
    window.location.href = "leaderboard.html";
  });
});

function updateDisplay() {
  document.getElementById("playerScore").textContent = getCurrentScore();
  document.getElementById("playerBalls").textContent = getCurrentBalls();
}

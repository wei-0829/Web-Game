/********************************************
 * leaderboard.js
 * - 顯示排行榜: 從 userList 直接取 score
 ********************************************/

window.addEventListener("DOMContentLoaded", () => {
  checkLoginStatus();

  const leaderboardTable = document.getElementById("leaderboardTable");
  // 從 common.js 取得排序後的使用者列表
  const leaderboardData = getLeaderboardData(); // userList sorted by score desc

  // 動態生成排行榜表格
  leaderboardData.forEach((user, index) => {
    const row = document.createElement("tr");

    const rankCell = document.createElement("td");
    rankCell.textContent = index + 1; 
    row.appendChild(rankCell);

    const nameCell = document.createElement("td");
    nameCell.textContent = user.username;
    row.appendChild(nameCell);

    const scoreCell = document.createElement("td");
    scoreCell.textContent = user.score;
    row.appendChild(scoreCell);

    leaderboardTable.appendChild(row);
  });
});

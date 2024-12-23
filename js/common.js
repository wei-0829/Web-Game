/********************************************
 * common.js 
 * - 放置共用功能，例如：
 *   1) 使用者登入檢查
 *   2) userList 讀寫 (score/balls)
 *   3) 樣式切換
 *   4) 漢堡選單控制
 *   5) 排行榜取得
 ********************************************/

/* ========== 1) 登入檢查 ========== */
function checkLoginStatus() {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  if (isLoggedIn !== "true") {
    // 未登入導向登入頁面
    window.location.href = "index.html";
  }
}

/* ========== 2) userList 相關操作 ========== */
/** 
 * 取得當前 userList （所有已註冊用戶） 
 * @returns {Array} userList: [{username, password, score, balls}, ...]
 */
function getUserList() {
  return JSON.parse(localStorage.getItem("userList")) || [];
}

/**
 * 將更新後的 userList 寫回 localStorage
 */
function setUserList(newList) {
  localStorage.setItem("userList", JSON.stringify(newList));
}

/** 
 * 取得「目前登入的使用者」物件 
 * @returns {object | undefined} e.g. {username, password, score, balls}
 */
function getCurrentUser() {
  const username = localStorage.getItem("username");
  if (!username) return undefined;
  const userList = getUserList();
  return userList.find(u => u.username === username);
}

/**
 * 更新目前使用者的 user 物件 (score/balls 等)
 * @param {object} updatedUser
 */
function setCurrentUser(updatedUser) {
  const userList = getUserList();
  const idx = userList.findIndex(u => u.username === updatedUser.username);
  if (idx !== -1) {
    userList[idx] = updatedUser;
    setUserList(userList);
  }
}

/* ========== 分數相關操作 (針對目前登入者) ========== */
/** 初始分數 & 球數 (若尚未有值) */
function initializeCurrentUserScoreBalls() {
  const user = getCurrentUser();
  if (!user) return; // 尚未登入
  
  if (typeof user.score !== "number") user.score = 50000;
  if (typeof user.balls !== "number") user.balls = 0;
  setCurrentUser(user);
}

/** 取得目前登入者的分數 */
function getCurrentScore() {
  const user = getCurrentUser();
  return user ? user.score : 0;
}

/** 取得目前登入者的球數 */
function getCurrentBalls() {
  const user = getCurrentUser();
  return user ? user.balls : 0;
}

/** 更新分數 */
function updateCurrentScore(newScore) {
  if (newScore < 0) newScore = 0; // 不允許負數
  const user = getCurrentUser();
  if (!user) return;
  
  user.score = newScore;
  setCurrentUser(user);
}

/** 更新球數 */
function updateCurrentBalls(newBalls) {
  if (newBalls < 0) newBalls = 0; // 不允許負數
  const user = getCurrentUser();
  if (!user) return;
  
  user.balls = newBalls;
  setCurrentUser(user);
}

/** 增加分數 */
function addScore(amount) {
  const cur = getCurrentScore();
  updateCurrentScore(cur + amount);
}

/** 扣除分數 */
function deductScore(amount) {
  const cur = getCurrentScore();
  if (cur >= amount) {
    updateCurrentScore(cur - amount);
  } else {
    console.warn("分數不足，無法扣除");
  }
}

/** 增加球數 */
function addBalls(amount) {
  const cur = getCurrentBalls();
  updateCurrentBalls(cur + amount);
}

/** 扣除球數 */
function deductBalls(amount) {
  const cur = getCurrentBalls();
  if (cur >= amount) {
    updateCurrentBalls(cur - amount);
  } else {
    console.warn("球數不足，無法扣除");
  }
}

/* ========== 3) 樣式切換 ========== */
const stylePresets = {
  pink:        { backgroundColor: "#FFE4E1" },
  blue:        { backgroundColor: "#ADD8E6" },
  lightGreen:  { backgroundColor: "#E0FFE0" },
  dark:        { backgroundColor: "#222222" },
  light:       { backgroundColor: "#FFFFFF" },
};

function applyStyle(style) {
  if (!style) return;
  document.body.style.backgroundColor = style.backgroundColor;
}

function saveStyleToLocalStorage(styleKey) {
  localStorage.setItem("selectedStyle", styleKey);
}

function loadStyleFromLocalStorage() {
  const styleKey = localStorage.getItem("selectedStyle") || "dark";
  return stylePresets[styleKey];
}

function initializeStyle() {
  applyStyle(loadStyleFromLocalStorage());
}

function switchStyle(styleKey) {
  const selectedStyle = stylePresets[styleKey];
  if (selectedStyle) {
    applyStyle(selectedStyle);
    saveStyleToLocalStorage(styleKey);
  }
}

/* ========== 4) 漢堡選單功能 ========== */
/**
 * 讓左側欄在小尺寸螢幕可隱藏/顯示
 * 也可在大螢幕隨時 toggle
 */
function toggleSidebar() {
  const navbar = document.querySelector('.navbar');
  navbar.classList.toggle('active'); 
}

/* ========== 5) 排行榜 (改為直接從 userList 取「目前分數」) ========== */
/** 取得所有使用者（依分數降序） */
function getLeaderboardData() {
  const userList = getUserList();
  // 以 "score" 排序（大 -> 小）
  userList.sort((a, b) => b.score - a.score);
  return userList;
}

/* DOMContentLoaded 時初始化樣式 */
window.addEventListener("DOMContentLoaded", () => {
  initializeStyle();
});

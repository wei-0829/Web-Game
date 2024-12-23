/********************************************
 * login.js
 * - 登入/註冊，userList 中增添 score & balls
 ********************************************/

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const loginErrorMessage = document.getElementById("loginErrorMessage");
const registerErrorMessage = document.getElementById("registerErrorMessage");
const loginContainer = document.getElementById("loginContainer");
const registerContainer = document.getElementById("registerContainer");

// 註冊
registerForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const username = document.getElementById("registerUsername").value.trim();
  const password = document.getElementById("registerPassword").value.trim();
  const confirmPassword = document.getElementById("confirmPassword").value.trim();

  if (!username || !password || !confirmPassword || password !== confirmPassword) {
    alert("所有欄位均為必填，且密碼需一致！");
    registerErrorMessage.style.display = "block";
    return;
  }

  let userList = getUserList(); // from common.js
  const isExist = userList.some(u => u.username === username);
  if (isExist) {
    alert("該使用者已存在，請使用其他帳號！");
    registerErrorMessage.textContent = "該使用者已存在，請使用其他帳號！"; // 更新錯誤訊息文字
    return;
  }

  // 初始化該使用者的 score & balls
  const newUser = {
    username,
    password,
    score: 50000,
    balls: 0
  };
  userList.push(newUser);
  setUserList(userList); // 寫回 localStorage

  alert(`註冊成功！\n帳號: ${username}`);
  toggleForm("login");
});

// 登入
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const username = document.getElementById("loginUsername").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  if (!username || !password) {
    loginErrorMessage.style.display = "block";
    return;
  }

  const userList = getUserList();
  const currentUser = userList.find(u => u.username === username && u.password === password);

  if (currentUser) {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("username", currentUser.username);

    alert(`登入成功！\n帳號: ${username}`);
    window.location.href = "settings.html";
  } else {
    alert("帳號或密碼錯誤！");
    loginErrorMessage.textContent = "帳號或密碼錯誤！"; // 更新錯誤訊息文字
  }
});

// 切換登入/註冊顯示
function toggleForm(form) {
  if (form === "register") {
    loginContainer.style.display = "none";
    registerContainer.style.display = "block";
  } else {
    loginContainer.style.display = "block";
    registerContainer.style.display = "none";
  }
}

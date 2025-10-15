document.getElementById("loginForm").addEventListener("submit", async function (e) {
  e.preventDefault(); // prevent page reload

  // A small helper to show messages to the user
  const messageEl = document.getElementById("loginMessage");
  const showMessage = (message, isError = false) => {
    messageEl.textContent = message;
    messageEl.style.color = isError ? "red" : "green";
  };

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !password) {
    showMessage("Please fill in both fields.", true);
    return;
  }

  try {
    // 💡 SUGGESTION: Replace simulated login with a real backend API call.
    // The backend would handle authentication and return user data (like role).
    // For now, we'll keep the simulation but structure it for an easy transition.

    const findUser = (username, password) => {
      // 1. Check hardcoded default users
      const defaultUsers = {
        student: { password: "1234", role: "student" },
        teacher: { password: "1234", role: "teacher" },
        admin: { password: "1234", role: "admin" },
      };
      if (defaultUsers[username] && defaultUsers[username].password === password) {
        return { username, role: defaultUsers[username].role };
      }

      // 2. If not found, check registered users in localStorage
      const registeredUsers = JSON.parse(localStorage.getItem("users")) || [];
      const user = registeredUsers.find(u => u.username === username && u.password === password);
      if (user) {
        return user;
      }

      return null; // User not found
    };

    const user = findUser(username, password);

    if (!user) {
      showMessage("Invalid credentials!", true);
      return;
    }

    showMessage("Login successful! Redirecting...");

    // Save role & username in localStorage
    localStorage.setItem("role", user.role);
    localStorage.setItem("username", user.username);

    // 💡 SUGGESTION: Use a map for cleaner redirection logic
    const dashboardMap = {
      student: "backend/dashboard-student.html",
      teacher: "backend/dashboard-teacher.html",
      admin: "backend/dashboard-admin.html",
    };
    
    // Redirect to the correct dashboard, with a fallback
    window.location.href = dashboardMap[user.role] || "dashboard.html";
  } catch (error) {
    console.error("Error:", error);
    showMessage("Something went wrong!", true);
  }
});

document.getElementById("registerForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const role = document.getElementById("role").value;

  if (!username || !password || !role) {
    alert("Please fill in all fields.");
    return;
  }

  // 🔹 In a real application, you would send this data to a backend server.
  // For this simulation, we'll use localStorage.
  const users = JSON.parse(localStorage.getItem("users")) || [];

  // Check if username already exists
  const userExists = users.some(user => user.username === username);
  if (userExists) {
    alert("Username already exists. Please choose a different one.");
    return;
  }

  // Add new user to the array
  users.push({ username, password, role });

  // Save updated users array back to localStorage
  localStorage.setItem("users", JSON.stringify(users));

  console.log("New user registered:", { username, role });
  console.log("All users:", users);

  // Show a success message and redirect to login.
  alert("Registration successful! You can now log in.");
  window.location.href = "index.html";
});
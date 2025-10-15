document.addEventListener("DOMContentLoaded", () => {
  // Get user info from localStorage
  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username");

  // Redirect to login if no role is found
  if (!role) {
    window.location.href = "../index.html";
    return; // Stop further execution
  }

  // --- Shared Dashboard Logic ---

  // 1. Personalize the welcome message
  const welcomeMessage = document.getElementById("welcomeMessage");
  if (welcomeMessage && username) {
    // Capitalize the first letter of the username for display
    const capitalizedUsername = username.charAt(0).toUpperCase() + username.slice(1);
    welcomeMessage.textContent = `Welcome, ${capitalizedUsername}!`;
  }
  
  // 2. Handle Logout
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.clear();
      window.location.href = "../index.html"; // Go back to the login page
    });
  }

  // --- Role-Specific Logic ---

  // This block will only run if the user is a teacher
  if (role === "teacher") {
    const generateQrBtn = document.getElementById("generateQrBtn");
    const qrcodeContainer = document.getElementById("qrcode");

    if (generateQrBtn && qrcodeContainer) {
      if (typeof QRCode === "undefined") {
        console.error("QRCode library is not loaded! Make sure the script is included in the teacher dashboard HTML.");
        return;
      }

      const qrCode = new QRCode(qrcodeContainer, { width: 200, height: 200 });

      generateQrBtn.addEventListener("click", () => {
        // In a real app, you might get classId from a dropdown or user context
        const qrData = JSON.stringify({ classId: "CS101", timestamp: Date.now() });
        qrCode.makeCode(qrData);
        qrcodeContainer.style.display = "block"; // Show the QR code
        console.log("Generated QR Code with data:", qrData);
      });
    }
  }

  // You can add more `if (role === "...")` blocks here for students and admins.
});

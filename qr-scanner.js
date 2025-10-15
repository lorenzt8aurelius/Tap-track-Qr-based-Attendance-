// qr-scanner.js

// Set your backend API URL here
const BACKEND_API_URL = 'https://your-backend-url.com/api/attendance';

// Get Supabase user info from localStorage (saved during login)

// TEMP: Mock user for testing
const user = { id: "test-user-123" };


// Function to send attendance to backend
function sendAttendance(sessionCode) {
  const payload = {
    user_id: user.id,
    session_code: sessionCode
  };

  fetch(BACKEND_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
    .then(response => {
      if (!response.ok) throw new Error("Failed to send attendance.");
      return response.json();
    })
    .then(data => {
      document.getElementById('result').innerText = "✅ Attendance Recorded!";
      console.log("Success:", data);
    })
    .catch(error => {
      document.getElementById('result').innerText = "❌ Error: " + error.message;
      console.error("Error:", error);
    });
}

// When QR is successfully scanned
function onScanSuccess(decodedText, decodedResult) {
  console.log(`QR Code Scanned: ${decodedText}`);

  // Stop scanner after successful scan
  html5QrcodeScanner.clear().then(() => {
    sendAttendance(decodedText); // QR must contain session_code
  }).catch(error => {
    console.error("Error clearing QR Scanner:", error);
  });
}

// Start QR Scanner
const html5QrcodeScanner = new Html5QrcodeScanner(
  "qr-reader",
  { fps: 10, qrbox: 250 },
  false
);
html5QrcodeScanner.render(onScanSuccess);

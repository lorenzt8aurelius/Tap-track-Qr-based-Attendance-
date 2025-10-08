import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// 🧩 Supabase project details
const SUPABASE_URL = "https://sqqxipliixocghdcqxsw.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNxcXhpcGxpaXhvY2doZGNxeHN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3NDQ1NDYsImV4cCI6MjA3NTMyMDU0Nn0.-oLDH3J6l_b0BZ-ijiJv_R6KuALG8zLAXGFhQeiKIHc";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// 🔐 Check login status
const { data: sessionData } = await supabase.auth.getSession();
if (!sessionData.session) {
  window.location.href = "login.html";
}

const tableBody = document.querySelector("#attendanceTable tbody");
const statusBanner = document.querySelector("#status");
const logoutBtn = document.querySelector("#logoutBtn");

// 🚪 Logout function
logoutBtn.addEventListener("click", async () => {
  await supabase.auth.signOut();
  localStorage.clear();
  window.location.href = "login.html";
});

// 📊 Fetch and display attendance data
async function loadAttendance() {
  statusBanner.style.display = "none";
  tableBody.innerHTML = "<tr><td colspan='5'>Loading...</td></tr>";

  const { data, error } = await supabase
    .from("attendance_records")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    statusBanner.style.display = "block";
    statusBanner.textContent = "❌ Error: " + error.message;
    return;
  }

  if (!data || data.length === 0) {
    tableBody.innerHTML = "<tr><td colspan='5'>No records found.</td></tr>";
    return;
  }

  tableBody.innerHTML = "";
  data.forEach((record) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${record.student_name || "N/A"}</td>
      <td>${new Date(record.created_at).toLocaleDateString()}</td>
      <td>${record.time_in || "-"}</td>
      <td>${record.time_out || "-"}</td>
      <td>${record.session_code || "-"}</td>
    `;
    tableBody.appendChild(row);
  });
}

// Run it
loadAttendance();

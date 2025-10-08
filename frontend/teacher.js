import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = "https://sqqxipliixocghdcqxsw.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNxcXhpcGxpaXhvY2doZGNxeHN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3NDQ1NDYsImV4cCI6MjA3NTMyMDU0Nn0.-oLDH3J6l_b0BZ-ijiJv_R6KuALG8zLAXGFhQeiKIHc";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const tableBody = document.querySelector("#attendanceTable tbody");
const logoutBtn = document.querySelector("#logoutBtn");

// 🧠 Check login
const { data: sessionData } = await supabase.auth.getSession();
if (!sessionData.session) {
  window.location.href = "login.html";
}

// 🚀 Fetch attendance
async function loadAttendance() {
  const { data, error } = await supabase.from("attendance").select("*");

  if (error) {
    console.error("Error fetching:", error);
    tableBody.innerHTML = `<tr><td colspan="5">Error loading data</td></tr>`;
    return;
  }

  if (!data.length) {
    tableBody.innerHTML = `<tr><td colspan="5">No attendance records yet.</td></tr>`;
    return;
  }

  tableBody.innerHTML = "";
  data.forEach(row => {
    tableBody.innerHTML += `
      <tr>
        <td>${row.user_id}</td>
        <td>${row.session_code || "-"}</td>
        <td>${row.date || "-"}</td>
        <td>${row.time_in || "-"}</td>
        <td>${row.time_out || "-"}</td>
      </tr>
    `;
  });
}

loadAttendance();

// 🚪 Logout
logoutBtn.addEventListener("click", async () => {
  await supabase.auth.signOut();
  localStorage.clear();
  window.location.href = "login.html";
});

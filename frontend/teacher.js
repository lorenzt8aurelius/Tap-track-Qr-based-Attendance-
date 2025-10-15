import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = "https://sqqxipliixocghdcqxsw.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNxcXhpcGxpaXhvY2doZGNxeHN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3NDQ1NDYsImV4cCI6MjA3NTMyMDU0Nn0.-oLDH3J6l_b0BZ-ijiJv_R6KuALG8zLAXGFhQeiKIHc";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const table = document.querySelector("#attendanceTable tbody");
const logoutBtn = document.getElementById("logoutBtn");
const markBtn = document.getElementById("markAttendanceBtn");
const statusBanner = document.getElementById("status");

// ✅ Load attendance records
async function loadAttendance() {
  const { data: sessionData } = await supabase.auth.getSession();
  const session = sessionData.session;
  if (!session) {
    window.location.href = "login.html";
    return;
  }

  const user = session.user;
  const { data, error } = await supabase
    .from("attendance")
    .select("*")
    .eq("user_id", user.id)
    .order("date", { ascending: false });

  if (error) {
    console.error("Error loading attendance:", error);
    statusBanner.textContent = "❌ Failed to load records.";
    statusBanner.style.display = "block";
    return;
  }

  table.innerHTML = data
    .map(
      (row) => `
        <tr>
          <td>${row.user_id}</td>
          <td>${row.session_code || "-"}</td>
          <td>${row.date || "-"}</td>
          <td>${row.time_in || "-"}</td>
          <td>${row.time_out || "-"}</td>
        </tr>`
    )
    .join("");
}

// ✅ Mark attendance (insert new record)
markBtn.addEventListener("click", async () => {
  const { data: sessionData } = await supabase.auth.getSession();
  const session = sessionData.session;
  if (!session) {
    window.location.href = "login.html";
    return;
  }

  const user = session.user;

  const now = new Date();
  const date = now.toISOString().split("T")[0];
  const timeIn = now.toTimeString().split(" ")[0];
  const sessionCode = `S-${Math.floor(1000 + Math.random() * 9000)}`; // Random 4-digit code

  const { error } = await supabase.from("attendance").insert([
    {
      user_id: user.id,
      session_code: sessionCode,
      date: date,
      time_in: timeIn,
    },
  ]);

  if (error) {
    console.error("Insert failed:", error);
    alert("❌ Failed to mark attendance.");
    return;
  }

  alert("✅ Attendance recorded!");
  loadAttendance();
});

// ✅ Logout
logoutBtn.addEventListener("click", async () => {
  await supabase.auth.signOut();
  localStorage.removeItem("session");
  window.location.href = "login.html";
});

// Auto-load
loadAttendance();

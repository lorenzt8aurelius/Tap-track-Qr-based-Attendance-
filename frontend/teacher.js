import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = "https://sqqxipliixocghdcqxsw.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNxcXhpcGxpaXhvY2doZGNxeHN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3NDQ1NDYsImV4cCI6MjA3NTMyMDU0Nn0.-oLDH3J6l_b0BZ-ijiJv_R6KuALG8zLAXGFhQeiKIHc";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const table = document.querySelector("#attendanceTable tbody");
const logoutBtn = document.getElementById("logoutBtn");

async function loadAttendance() {
  const session = JSON.parse(localStorage.getItem("session"));
  if (!session) {
    window.location.href = "login.html";
    return;
  }

  const userId = session.user.id;
  const { data, error } = await supabase
    .from("attendance")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    console.error(error);
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

logoutBtn.addEventListener("click", async () => {
  await supabase.auth.signOut();
  localStorage.removeItem("session");
  window.location.href = "login.html";
});

loadAttendance();

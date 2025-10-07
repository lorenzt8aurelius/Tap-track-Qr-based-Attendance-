// teacher.js
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// 🔧 Replace with your actual Supabase credentials
const SUPABASE_URL = "https://YOUR-PROJECT-REF.supabase.co";
const SUPABASE_KEY = "YOUR-ANON-KEY";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ⚙️ Fetch attendance records
async function loadAttendance() {
  try {
    const { data, error } = await supabase
      .from("attendance")
      .select(`
        id,
        session_code,
        date,
        time_in,
        time_out,
        users(email)
      `)
      .order("date", { ascending: false });

    if (error) throw error;

    const tableBody = document.querySelector("#attendance-table tbody");
    tableBody.innerHTML = "";

    data.forEach((record) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${record.users?.email || "Unknown"}</td>
        <td>${record.session_code}</td>
        <td>${record.date}</td>
        <td>${record.time_in || "-"}</td>
        <td>${record.time_out || "-"}</td>
      `;
      tableBody.appendChild(row);
    });

  } catch (err) {
    console.error("Error loading attendance:", err.message);
  }
}

// 🚀 Run on page load
document.addEventListener("DOMContentLoaded", loadAttendance);

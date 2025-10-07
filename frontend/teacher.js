(() => {
  const statusEl = document.getElementById('status');
  const tbody = document.querySelector('#attendanceTable tbody');
  const logoutBtn = document.getElementById('logoutBtn');

  const ENDPOINTS = [
    'https://localhost:5000/api/attendance/list',
    'https://localhost:7000/api/attendance/list'
  ];

  function setStatus(message, type = 'info') {
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.className = `status-banner ${type}`;
    statusEl.style.display = message ? 'block' : 'none';
  }

  function renderRows(records) {
    if (!Array.isArray(records) || records.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:#666;">No attendance records yet.</td></tr>`;
      return;
    }
    tbody.innerHTML = records.map(r => `
      <tr>
        <td>${r.studentName ?? r.student_name ?? ''}</td>
        <td>${r.date ?? ''}</td>
        <td>${r.time_in ?? ''}</td>
        <td>${r.time_out ?? ''}</td>
        <td>${r.session_code ?? ''}</td>
      </tr>
    `).join('');
  }

  function getSampleRows() {
    return [
      { studentName: 'Juan Dela Cruz', date: new Date().toLocaleDateString(), time_in: '08:00', time_out: '15:00', session_code: 'MATH101' },
      { studentName: 'Maria Santos', date: new Date().toLocaleDateString(), time_in: '08:05', time_out: '15:02', session_code: 'MATH101' }
    ];
  }

  async function fetchWithFallback(urls) {
    let lastError;
    for (const url of urls) {
      try {
        const resp = await fetch(url, { headers: { 'Content-Type': 'application/json' } });
        if (resp.ok) {
          return await resp.json();
        }
        lastError = new Error(`HTTP ${resp.status}`);
      } catch (e) {
        lastError = e;
      }
    }
    throw lastError ?? new Error('All endpoints failed');
  }

  async function init() {
    try {
      logoutBtn?.addEventListener('click', () => {
        try {
          localStorage.clear();
        } catch {}
        window.location.href = '../All files/login.html';
      });

      setStatus('Loading attendance...');
      let data;
      try {
        data = await fetchWithFallback(ENDPOINTS);
      } catch (e) {
        console.warn('Attendance API failed, showing sample rows:', e);
        data = getSampleRows();
        setStatus('Showing sample data (backend not reachable)', 'warning');
      }
      renderRows(data);
      if (statusEl?.classList.contains('info')) statusEl.style.display = 'none';
    } catch (e) {
      console.error(e);
      setStatus('Unexpected error loading dashboard', 'error');
      renderRows(getSampleRows());
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();



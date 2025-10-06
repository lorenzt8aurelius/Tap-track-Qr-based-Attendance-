using System;

namespace NEW_QR_BASED_ATTENDANCE.Models
{
    public class AttendanceRecord
    {
        public int AttendanceId { get; set; }
        public DateTime Date { get; set; } = DateTime.Now;
        public DateTime? CheckInTime { get; set; }
        public DateTime? CheckOutTime { get; set; }

        // ✅ Foreign key
        public int PersonId { get; set; }

        // ✅ Navigation
        public Person? Person { get; set; }
    }
}

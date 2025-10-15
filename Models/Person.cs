using System.Collections.Generic;

namespace NEW_QR_BASED_ATTENDANCE.Models
{
    public class Person
    {
        public int PersonId { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string PersonCode { get; set; } = string.Empty;

        // ✅ Relationship to AttendanceRecord
        public ICollection<AttendanceRecord> AttendanceRecords { get; set; } = new List<AttendanceRecord>();
    }
}

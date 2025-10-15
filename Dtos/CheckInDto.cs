namespace NEW_QR_BASED_ATTENDANCE.Dtos
{
    public class CheckInDto
    {
        public string PersonCode { get; set; } = null!;
        public string? Location { get; set; }
        public string? Notes { get; set; }
    }
}

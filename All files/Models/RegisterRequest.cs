namespace Backend.Models
{
    public class RegisterRequest
    {
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string? Name { get; set; }
        public string? Role { get; set; } // "student", "teacher", "admin"
    }
}

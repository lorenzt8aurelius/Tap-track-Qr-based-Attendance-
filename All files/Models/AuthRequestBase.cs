namespace Backend.Models
{
    public abstract class AuthRequestBase
    {
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
    }
}

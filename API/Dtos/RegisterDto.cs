using System.ComponentModel.DataAnnotations;

namespace API.Dtos
{
    public class RegisterDto
    {
        [Required]
        public string DisplayName { get; set; }
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        [Required]
        [RegularExpression("(?=^.{8,30}$)(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;&quot;:;'?/&gt;.&lt;,]).*$", ErrorMessage = "Password must have at least 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character.")]
        public string Password { get; set; }
    }
}
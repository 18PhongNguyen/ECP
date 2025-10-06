using System.ComponentModel.DataAnnotations;

namespace API.Dtos
{
    public class ResetPasswordDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Token { get; set; }

        [Required]
        [RegularExpression("(?=^.{8,30}$)(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/>.&lt;,]).*$", 
            ErrorMessage = "Password must have at least 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character.")]
        public string NewPassword { get; set; }
    }
}

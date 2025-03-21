using System.Text.Json;

namespace API.Errors
{
    public class ApiException : ApiResponse
    {
        public ApiException(
            int statusCode,
            string message = null,
            string details = null, 
            string path = null) 
        : base(statusCode, message, path)
        {
            Details = details;
        }

        public string Details { get; set; }
        public override string ToString()
        {
            var options = new JsonSerializerOptions {PropertyNamingPolicy = JsonNamingPolicy.CamelCase};
            return JsonSerializer.Serialize(this, options);
        }
    }
}
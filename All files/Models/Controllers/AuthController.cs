using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Backend.Models;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IHttpClientFactory _httpFactory;
        private readonly IConfiguration _config;
        private readonly string _supabaseUrl;
        private readonly string _anonKey;
        private readonly string _serviceRoleKey;

        public AuthController(IHttpClientFactory httpFactory, IConfiguration config)
        {
            _httpFactory = httpFactory;
            _config = config;
            _supabaseUrl = (_config["Supabase:Url"] ?? "").TrimEnd('/');
            _anonKey = _config["Supabase:AnonKey"] ?? "";
            _serviceRoleKey = _config["Supabase:ServiceRoleKey"] ?? "";
        }

        // POST: api/auth/register
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest req)
        {
            if (string.IsNullOrWhiteSpace(req.Email) || string.IsNullOrWhiteSpace(req.Password))
                return BadRequest(new { error = "Email and password are required." });

            var client = _httpFactory.CreateClient();
            client.DefaultRequestHeaders.Clear();
            client.DefaultRequestHeaders.Add("apikey", _anonKey);
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _anonKey);

            var signupUrl = $"{_supabaseUrl}/auth/v1/signup";

            var signupPayload = new
            {
                email = req.Email,
                password = req.Password,
                data = new { name = req.Name ?? "", role = req.Role ?? "student" } // metadata stored in auth user
            };

            var signupResp = await client.PostAsJsonAsync(signupUrl, signupPayload);

            if (!signupResp.IsSuccessStatusCode)
            {
                var err = await signupResp.Content.ReadAsStringAsync();
                return BadRequest(new { error = "Signup failed", details = err });
            }

            // parse returned user id if available
            var signupJson = await signupResp.Content.ReadFromJsonAsync<JsonElement?>();
            string? userId = null;
            if (signupJson.HasValue && signupJson.Value.TryGetProperty("user", out var userEl) &&
                userEl.TryGetProperty("id", out var idEl))
            {
                userId = idEl.GetString();
            }

            // If confirmation is enabled, signup may return user but no session. Handle that client-side.
            if (string.IsNullOrEmpty(userId))
            {
                return Ok(new { message = "Signup succeeded; verify email if required.", raw = signupJson });
            }

            // Insert row into public.users table via PostgREST (server-side). Use service_role key.
            var restClient = _httpFactory.CreateClient();
            restClient.DefaultRequestHeaders.Clear();
            restClient.DefaultRequestHeaders.Add("apikey", _serviceRoleKey);
            restClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _serviceRoleKey);
            restClient.DefaultRequestHeaders.Add("Prefer", "return=representation");

            var insertUrl = $"{_supabaseUrl}/rest/v1/users";

            var userRow = new
            {
                id = userId,
                email = req.Email,
                name = req.Name ?? "",
                role = req.Role ?? "student"
            };

            var insertResp = await restClient.PostAsJsonAsync(insertUrl, userRow);

            if (!insertResp.IsSuccessStatusCode)
            {
                var err = await insertResp.Content.ReadAsStringAsync();
                // You may want to rollback auth user on failure in production.
                return StatusCode((int)insertResp.StatusCode, new { error = "Failed to create users row", details = err });
            }

            var created = await insertResp.Content.ReadAsStringAsync();
            return Ok(new { message = "Registered and user row created", created });
        }

        // POST: api/auth/login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest req)
        {
            if (string.IsNullOrWhiteSpace(req.Email) || string.IsNullOrWhiteSpace(req.Password))
                return BadRequest(new { error = "Email and password are required." });

            var client = _httpFactory.CreateClient();
            client.DefaultRequestHeaders.Clear();
            client.DefaultRequestHeaders.Add("apikey", _anonKey);
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _anonKey);

            var loginUrl = $"{_supabaseUrl}/auth/v1/token?grant_type=password";
            var loginPayload = new { email = req.Email, password = req.Password };

            var loginResp = await client.PostAsJsonAsync(loginUrl, loginPayload);
            var body = await loginResp.Content.ReadAsStringAsync();

            if (!loginResp.IsSuccessStatusCode)
            {
                // return whatever the auth server returned
                return Unauthorized(new { error = "Login failed", details = body });
            }

            // success -> contains access_token, refresh_token, expires_in, user, etc.
            var obj = JsonDocument.Parse(body).RootElement;
            return Ok(obj);
        }

        // GET: api/auth/dashboard
        [HttpGet("dashboard")]
        public async Task<IActionResult> GetDashboard([FromHeader(Name = "Authorization")] string? authHeader)
        {
            if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
                return Unauthorized(new { error = "Missing or invalid authorization header" });

            var token = authHeader.Substring("Bearer ".Length);

            var client = _httpFactory.CreateClient();
            client.DefaultRequestHeaders.Clear();
            client.DefaultRequestHeaders.Add("apikey", _anonKey);
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var userUrl = $"{_supabaseUrl}/auth/v1/user";
            var userResp = await client.GetAsync(userUrl);

            if (!userResp.IsSuccessStatusCode)
                return Unauthorized(new { error = "Invalid token" });

            var userJson = await userResp.Content.ReadAsStringAsync();
            var userObj = JsonDocument.Parse(userJson).RootElement;

            // Get user data from users table
            var restClient = _httpFactory.CreateClient();
            restClient.DefaultRequestHeaders.Clear();
            restClient.DefaultRequestHeaders.Add("apikey", _anonKey);
            restClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var usersUrl = $"{_supabaseUrl}/rest/v1/users?select=*&id=eq.{userObj.GetProperty("id").GetString()}";
            var usersResp = await restClient.GetAsync(usersUrl);

            var dashboardData = new
            {
                user = userObj,
                profile = usersResp.IsSuccessStatusCode ? await usersResp.Content.ReadAsStringAsync() : null
            };

            return Ok(dashboardData);
        }
    }
}

using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using stockapi.Entities;
using stockapi.Services;
using stockapi.Models.Accounts;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace stockapi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountsController : BaseController
    {
        private readonly IAccountService _accountService;
        private readonly IMapper _mapper;

        public AccountsController(
            IAccountService accountService,
            IMapper mapper)
        {
            _accountService = accountService;
            _mapper = mapper;
        }

        [HttpGet("isEmailRegistered")]
        public bool isEmailRegistered(string email)
        {
            bool result = _accountService.isEmailRegistered(email);
            return !result;
        }

        [HttpPost("authenticate")]
        public ActionResult<AuthenticateResponse> Authenticate(AuthenticateRequest model)
        {
            var response = _accountService.Authenticate(model, ipAddress());
            setTokenCookie(response.RefreshToken, "refreshToken", DateTime.UtcNow.AddDays(7));
            setTokenCookie(response.JwtToken, "jwt", DateTime.UtcNow.AddDays(1));
            return Ok(response);
        }

        [Authorize]
        [HttpPost("refresh-token")]
        public ActionResult<AuthenticateResponse> RefreshToken()
        {
            var refreshToken = Request.Cookies["refreshToken"];
            var response = _accountService.RefreshToken(refreshToken, ipAddress());
            setTokenCookie(response.RefreshToken, "refreshToken", DateTime.UtcNow.AddDays(7));
            setTokenCookie(response.JwtToken, "jwt", DateTime.UtcNow.AddDays(1));
            return Ok(response);
        }

        [Authorize]
        [HttpPost("revoke-token")]
        public IActionResult RevokeToken(RevokeTokenRequest model)
        {
            // accept token from request body or cookie
            var token = model.Token ?? Request.Cookies["refreshToken"];

            if (string.IsNullOrEmpty(token))
                return BadRequest(new { message = "Token is required." });

            // users can revoke their own tokens and admins can revoke any tokens
            if (!Account.OwnsToken(token) && Account.Role != Role.Admin)
                return Unauthorized(new { message = "Unauthorized" });

            _accountService.RevokeToken(token, ipAddress());
            return Ok(new { message = "Token revoked" });
        }

        [HttpPost("register")]
        public IActionResult Register(RegisterRequest model)
        {
            //_accountService.Register(model, Request.Headers["origin"]);
            _accountService.Register(model, "");
            return Ok(new { message = "На указанный вами e-mail отправлено письмо с подтверждением" });
        }

        [HttpPost("verify-email")]
        public IActionResult VerifyEmail(VerifyEmailRequest model)
        {
            _accountService.VerifyEmail(model.Token);
            return Ok(new { message = "Верификация прошла успешно, теперь вы можете войти в систему" });
        }

        [HttpPost("forgot-password")]
        public IActionResult ForgotPassword(ForgotPasswordRequest model)
        {
            if (model.Email != null && _accountService.isEmailRegistered(model.Email))
            {
                _accountService.ForgotPassword(model, "");
                return Ok(new { message = "Пожалуйста проверьте свой Email для получения инструкций по сбросу пароля" });
            }
            else
            {
                return Ok(new { message = "Указанный Email не зарегистрирован в системе" });
            }
        }

        [HttpPost("validate-reset-token")]
        public IActionResult ValidateResetToken(ValidateResetTokenRequest model)
        {
            _accountService.ValidateResetToken(model);
            return Ok(new { message = "Token is valid" });
        }

        [HttpPost("reset-password")]
        public IActionResult ResetPassword(ResetPasswordRequest model)
        {
            _accountService.ResetPassword(model);
            return Ok(new { message = "Сброс пароля прошел успешно, теперь вы можете войти в систему" });
        }

        [Authorize(Role.Admin)]
        [HttpGet("GetAll")]
        public ActionResult<IEnumerable<AccountResponse>> GetAll()
        {
            var accounts = _accountService.GetAll();
            return Ok(accounts);
        }

        [Authorize]
        [HttpGet("{id:int}")]
        public ActionResult<AccountResponse> GetById(int id)
        {
            // users can get their own account and admins can get any account
            if (id != Account.Id && Account.Role != Role.Admin)
                return Unauthorized(new { message = "Unauthorized" });

            var account = _accountService.GetById(id);
            return Ok(account);
        }

        [Authorize]
        [HttpGet("GetCurrentUser")]
        public ActionResult<AccountResponse> GetCurrentUser()
        {
            var account = _accountService.GetById(Account.Id);
            return Ok(account);
        }

        [Authorize(Role.Admin)]
        [HttpPost]
        public ActionResult<AccountResponse> Create(CreateRequest model)
        {
            var account = _accountService.Create(model);
            return Ok(account);
        }

        [Authorize(Role.Admin)]
        [HttpPut("{id:int}")]
        public ActionResult<AccountResponse> Update(int id, UpdateRequest model)
        {
            var account = _accountService.Update(id, model);
            return Ok(account);
        }

        [Authorize]
        [HttpPost("Update")]
        public ActionResult<AccountResponse> UpdateCurrentUser(UpdateRequest model)
        {
            // only admins can update role and email
            if (Account.Role != Role.Admin)
            {
                model.Email = null;
                model.Role = null;
            }

            var account = _accountService.Update(Account.Id, model);
            return Ok(account);
        }

        [Authorize]
        [HttpDelete("{id:int}")]
        public IActionResult Delete(int id)
        {
            // users can delete their own account and admins can delete any account
            if (id != Account.Id && Account.Role != Role.Admin)
                return Unauthorized(new { message = "Unauthorized" });

            _accountService.Delete(id);
            return Ok(new { message = "Аккаунт успешно удален" });
        }

        [Route("ExternalLogin/{provider}")]
        [HttpGet]
        public IActionResult ExternalLogin(string provider)
        {
            var properties = new AuthenticationProperties { RedirectUri = "https://usa-invest.ru/api/accounts/ExternalLoginCallback" };
            return Challenge(properties, provider);
        }

        [Route("ExternalLoginCallback")]
        [HttpGet]
        public async Task<IActionResult> ExternalLoginCallback(string returnUrl = null, string remoteError = null)
        {
            var result = await HttpContext.AuthenticateAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            if (result.Succeeded != true)
            {
                return Unauthorized(new { message = "External authentication error" });
            }
            var externalUser = result.Principal;
            if (externalUser == null)
            {
                return Unauthorized("External authentication error");
            }

            var claims = externalUser.Claims.ToList();

            // try to determine the unique id of the external user - the most common claim type for that are the sub claim and the NameIdentifier
            // depending on the external provider, some other claim type might be used
            //var userIdClaim = claims.FirstOrDefault(x => x.Type == JwtClaimTypes.Subject);
            var userIdClaim = claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized(new { message = "Unknown userId" });
            }

            var externalUserId = userIdClaim.Value;
            var externalProvider = userIdClaim.Issuer;
            var userEmailClaim = claims.FirstOrDefault(x => x.Type == ClaimTypes.Email);
            var externalUserEmail = userEmailClaim?.Value;
            var userNameClaim = claims.FirstOrDefault(x => x.Type == ClaimTypes.Name);
            if (userNameClaim == null)
            {
                userNameClaim = claims.FirstOrDefault(x => x.Type == ClaimTypes.GivenName);
            }
            var externalUserName = userNameClaim.Value;

            Claim userPhotoUriClaim;
            string externalUserPhoto;
            if (externalProvider == "Vkontakte")
            {
                userPhotoUriClaim = claims.FirstOrDefault(x => x.Type == "urn:vkontakte:photo:link");
                externalUserPhoto = userPhotoUriClaim.Value;
            }
            else
            {
                externalUserPhoto = null;
            }


            ExternalLoginRequest request = new ExternalLoginRequest
            {
                ExternalUserId = externalUserId,
                Email = externalUserEmail,
                Name = externalUserName,
                Provider = externalProvider,
                ExternalPhotoLink = externalUserPhoto
            };
            var response = _accountService.ExternalLogin(request, ipAddress());
            setTokenCookie(response.RefreshToken, "refreshToken", DateTime.UtcNow.AddDays(7));
            setTokenCookie(response.JwtToken, "jwt", DateTime.UtcNow.AddDays(1));

            return Redirect("https://usa-invest.ru");
        }

        [Authorize]
        [HttpGet("SignOut")]
        public async Task<IActionResult> SignOut()
        {
            Response.Cookies.Delete("jwt");
            Response.Cookies.Delete("refreshToken");
            if (Account.LoginMethod == LoginMethod.External)
            {
                await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            }
            return Ok();
        }

        // helper methods

        private void setTokenCookie(string token, string name, DateTime expires)
        {
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Expires = expires,
                IsEssential = true
            };
            Response.Cookies.Append(name, token, cookieOptions);
        }

        private string ipAddress()
        {
            if (Request.Headers.ContainsKey("X-Forwarded-For"))
                return Request.Headers["X-Forwarded-For"];
            else
                return HttpContext.Connection.RemoteIpAddress.MapToIPv4().ToString();
        }
    }
}

using System;
using System.IO;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using stockapi.Entities;
using stockapi.Models.Subscription;
using stockapi.Services;

namespace stockapi.Controllers
{
    [Route("api/my")]
    [ApiController]
    public class PersonalInvestmentController : BaseController
    {
        private readonly ISubscriptionService _subscriptionService;
        private readonly IStockService _stockService;

        public PersonalInvestmentController(ISubscriptionService subscriptionService, IStockService stockService)
        {
            _subscriptionService = subscriptionService;
            _stockService = stockService;
        }

        [Authorize]
        [HttpGet("BuySubscription/{subscriptionType}")]
        public void BuySubscription(string subscriptionType)
        {
            string returnUrl = _subscriptionService.BuySubscription(Account.Id, subscriptionType);
            Response.Redirect(returnUrl);
        }

        [HttpPost("PaymentNotifications")]
        public ActionResult PaymentSubscriptionNotifications()
        {
            string result = _subscriptionService.PaymentSubscriptionNotifications(Request);
            return Ok(result);
        }

        [Authorize(Role.Admin)]
        [HttpGet("GetAllSubscriptions")]
        public IActionResult GetAllSubscriptions()
        {
            var subscriptions = _subscriptionService.GetAllSubscriptions();
            return Ok(subscriptions);
        }

        [Authorize(Role.Admin)]
        [HttpPost("SetSubscriptionEndDate")]
        public IActionResult SetSubscriptionEndDate(int id, int numberOfMonths)
        {
            _subscriptionService.SetSubscriptionEndDate(id, numberOfMonths);

            return Ok(new { message = $"Подписка продлена на {numberOfMonths} месяцев" });
        }

        [Authorize(Role.Admin)]
        [HttpPost("CreatePromocode")]
        public IActionResult CreatePromocode(CreatePromoCodeRequest model)
        {
            DateTime date;
            if (!DateTime.TryParse(model.ExpirationDate, out date))
                return BadRequest(new { message = "Неверный формат даты" });

            var response = _subscriptionService.CreatePromocode(model.AdditionalDays, date);
            return Ok(response);
        }

        [Authorize(Role.Admin)]
        [HttpGet("GetAllPromocodes")]
        public IActionResult GetAllPromocodes()
        {
            var promocodes = _subscriptionService.GetAllPromocodes();
            return Ok(promocodes);
        }

        [Authorize]
        [HttpPost("UsePromocode/{code}")]
        public IActionResult UsePromocode(string code)
        {
            _subscriptionService.UsePromocode(Account.Id, code);

            return Ok(new { message = "Промокод активирован"});
        }

        [Authorize]
        [HttpGet("CheckSubscription")]
        public IActionResult CheckSubscriptionEndDate()
        {
            var response = _subscriptionService.CheckSubscriptionEndDate(Account.Id);
            return Ok(response);
        }

        [Authorize]
        [HttpGet("investmentPortfolio")]
        public async Task<ActionResult> GetInvestmentPortfolio()
        {
            var response = await _stockService.GetInvestmentPortfolio(Account.Id);

            return Ok(response);
        }

        [Authorize]
        [HttpPost("addToPortfolio")]
        public IActionResult AddStockToPortfolio (Stock stock)
        {
            _stockService.AddStockToPortfolio(Account.Id, stock);

            return Ok(new { message = $"Акция добавлена в портфель" });
        }

        [Authorize]
        [HttpPost("editPortfolio")]
        public async Task<ActionResult> EditStocksInPortfolio(Stock[] stocks)
        {
            // обновляем данные портфеля
            foreach(var stock in stocks)
            {
                _stockService.EditStocksInPortfolio(Account.Id, stock);
            }

            // запрашиваем обновленные данные портфеля
            var response = await _stockService.GetInvestmentPortfolio(Account.Id);

            return Ok(response);
        }

        [Authorize]
        [HttpPost("deleteFromPortfolio/{ticker}")]
        public IActionResult DeleteStockFromPortfolio(string ticker)
        {
            _stockService.DeleteStockFromPortfolio(Account.Id, ticker.ToUpper());

            return Ok(new { message = $"Акции {ticker} удалены из портфеля" }) ;
        }

        [Authorize]
        [HttpPost("clearPortfolio")]
        public IActionResult ClearInvestmentPortfolio()
        {
            _stockService.ClearInvestmentPortfolio(Account.Id);

            return Ok(new { message = "Портфель очищен" });
        }

        [Authorize(Role.Admin)]
        [HttpGet("GetLogs")]
        public IActionResult GetLogs()
        {
            if (System.IO.File.Exists("log.txt"))
                return Ok(System.IO.File.ReadAllLines("log.txt"));
            else
                return Ok("File does not exist");
        }
    }
}

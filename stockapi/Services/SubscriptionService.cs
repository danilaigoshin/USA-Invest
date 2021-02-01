using AutoMapper;
using stockapi.Entities;
using stockapi.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using Yandex.Checkout.V3;
using System.Text.Json;
using Microsoft.Extensions.Options;
using System.Text;
using stockapi.Models;
using System.Text.Encodings.Web;
using System.Net;
using Microsoft.AspNetCore.Http;
using System.Net.Http;

namespace stockapi.Services
{
    public interface ISubscriptionService
    {
        public string BuySubscription(int accountId, string subscriptionType);
        public IEnumerable<Subscription> GetAllSubscriptions();
        public string PaymentSubscriptionNotifications(HttpRequest request);
        public DateTime CheckSubscriptionEndDate(int id);
        public void SetSubscriptionEndDate(int id, int numberOfMonths);
        public PromoCode CreatePromocode(int additionalDays, DateTime expirationDate);
        public IEnumerable<PromoCode> GetAllPromocodes();
        public void UsePromocode(int id, string code);
    }

    public class SubscriptionService : ISubscriptionService
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        private readonly AppSettings _appSettings;
        private readonly Client _client;
        public SubscriptionService(
            DataContext context,
            IMapper mapper,
            IOptions<AppSettings> appSettings)
        {
            _context = context;
            _mapper = mapper;
            _appSettings = appSettings.Value;
            _client = new Client(_appSettings.YooMoneyShopId, _appSettings.YooMoneySecretKey);
        }

        public string BuySubscription(int accountId, string subscriptionType)
        {
            string subscriptionTypes = System.IO.File.ReadAllText("SubscriptionTypes.json");
            int subscriptionCost;
            int subscriptionDuration;
            string subscriptionDescription;

            using (JsonDocument doc = JsonDocument.Parse(subscriptionTypes))
            {
                JsonElement root = doc.RootElement;
                JsonElement jsSubsType = root.GetProperty(subscriptionType);

                subscriptionCost = jsSubsType.GetProperty("cost").GetInt32();
                subscriptionDuration = jsSubsType.GetProperty("duration").GetInt32();
                subscriptionDescription = jsSubsType.GetProperty("description").GetString();
            }

            if (subscriptionCost == 0 || subscriptionDuration == 0)
                throw new AppException("Ошибка в указании типа подписки");

            // 1. Сохраняем информацию о покупке в БД и формируем ссылку для оплаты
            
            Subscription newSubscription = new Subscription
            {
                UserId = accountId,
                Type = subscriptionType,
                Duration = subscriptionDuration,
                Cost = subscriptionCost,
                OrderDate = DateTime.Now
            };

            _context.Subscriptions.Add(newSubscription);
            _context.SaveChanges();

            int invoiceId = _context.Subscriptions.SingleOrDefault(x => 
                x.UserId == newSubscription.UserId && 
                x.OrderDate == newSubscription.OrderDate)
                .Id;
            RobokassaItemModel[] robokassaItems = new RobokassaItemModel[] { 
                new RobokassaItemModel {
                    name = subscriptionDescription,
                    quantity = 1,
                    sum = subscriptionCost,
                    tax = "none"
                }
            };

            RobokassaReceiptModel robokassaReceipt = new RobokassaReceiptModel {
                items = robokassaItems
            };

            var robokassaInfo = GenerateRobokassaLink(subscriptionCost, subscriptionDescription, invoiceId, robokassaReceipt);

            newSubscription.OrderId = robokassaInfo.signatureValue;
            _context.Subscriptions.Update(newSubscription);
            _context.SaveChanges();

            // 2. Перенаправляем пользователя на страницу оплаты
            string url = robokassaInfo.link;

            return url;
        }

        private (string link, string signatureValue) GenerateRobokassaLink(decimal amount, string description, int invoiceId, RobokassaReceiptModel receipt)
        {
            bool isTest = true;

            string roboShopName = _appSettings.RobokassaShopName;

            string roboFirstPassw = _appSettings.RobokassaFirstPassw;

            JsonSerializerOptions jsonOptions = new JsonSerializerOptions
            {
                Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
                IgnoreNullValues = true
            };

            string jsStringReceipt = JsonSerializer.Serialize<RobokassaReceiptModel>(receipt, jsonOptions);

            // кодировать Receipt нужно 1 раз для расчета сигнатуры и 2 раза для добавления в ссылку, 
            // т.к. браузер автоматически декодирует его (так сказали в техподдержке робокассы)
            string signatureReceipt = WebUtility.UrlEncode(jsStringReceipt);
            string urlReceipt = WebUtility.UrlEncode(signatureReceipt);

            string
                amountStr = amount.ToString("0.00", System.Globalization.CultureInfo.InvariantCulture),
                invoiceIdStr = invoiceId.ToString(),
                srcBase = $"{roboShopName}:{amountStr}:{invoiceIdStr}:{signatureReceipt}:{roboFirstPassw}";
                //srcBase = $"{roboShopName}:{amountStr}:{invoiceIdStr}:{roboFirstPassw}";

            string signatureValue = generateSHA256Hash(srcBase);
            string authPaymentString;

            if (isTest)
            {
                authPaymentString = "https://auth.robokassa.ru/Merchant/Index.aspx" + "?isTest=1" +
                    "&MrchLogin=" + roboShopName +
                    "&OutSum=" + amountStr +
                    "&InvId=" + invoiceIdStr +
                    "&Receipt=" + urlReceipt +
                    "&Description=" + description +
                    "&SignatureValue=" + signatureValue +
                    "&Culture=ru";
            }
            else
            {
                authPaymentString = "https://auth.robokassa.ru/Merchant/Index.aspx" +
                    "?MrchLogin=" + roboShopName +
                    "&OutSum=" + amountStr +
                    "&InvId=" + invoiceIdStr +
                    "&Receipt=" + urlReceipt +
                    "&Description=" + description +
                    "&SignatureValue=" + signatureValue +
                    "&Culture=ru";
            }
            return (authPaymentString, signatureValue);
        }

        public string PaymentSubscriptionNotifications(HttpRequest request)
        {
            string result = "";
            string roboSecondPassw = _appSettings.RobokassaSecondPassw;

            // HTTP параметры
            string strOutSum = GetHttpPrm(request, "OutSum");
            string strInvId = GetHttpPrm(request, "InvId");
            string strSignatureValue = GetHttpPrm(request, "SignatureValue");

            string strSignatureValueBase = string.Format("{0}:{1}:{2}",
                                             strOutSum, strInvId, roboSecondPassw);

            // вычисляем SignatureValue и сравниваем с тем, что прислала Робокасса
            string strMySignatureValue = generateSHA256Hash(strSignatureValueBase);

            if (strMySignatureValue.ToUpper() != strSignatureValue.ToUpper())
            {
                result = "bad sign";
                return result;
            }

            result = $"OK{strInvId}";

            if (true)
            {
                // обновим запись о статусе подписки в БД
                Subscription paidSubscription = _context.Subscriptions.SingleOrDefault(x => x.Id == Convert.ToInt32(strInvId));
                paidSubscription.PaymentDate = DateTime.Now;

                _context.Subscriptions.Update(paidSubscription);
                _context.SaveChanges();

                // установим срок окончания подписки для пользователя
                SetSubscriptionEndDate(paidSubscription.UserId, paidSubscription.Duration);

                string emailClient = GetHttpPrm(request, "EMail");
                SendSecondReceipt(Convert.ToInt32(strInvId), Convert.ToInt32(strOutSum), emailClient);
            }
            else
            {
                // удалим запись о статусе подписки в БД если оплата отменена
                Subscription unpaidSubscription = _context.Subscriptions.SingleOrDefault(x => x.Id == Convert.ToInt32(strInvId));

                _context.Subscriptions.Remove(unpaidSubscription);
                _context.SaveChanges();
            }
            return result;
        }

        private async void SendSecondReceipt (int invId, int outSum, string emailClient)
        {
            string subscriptionTypes = System.IO.File.ReadAllText("SubscriptionTypes.json");
            Subscription paidSubscription = _context.Subscriptions.SingleOrDefault(x => x.Id == invId);
            string subscriptionType = paidSubscription.Type;
            string subscriptionDescription;

            using (JsonDocument doc = JsonDocument.Parse(subscriptionTypes))
            {
                JsonElement root = doc.RootElement;
                JsonElement jsSubsType = root.GetProperty(subscriptionType);

                subscriptionDescription = jsSubsType.GetProperty("description").GetString();
            }

            RobokassaItemModel[] robokassaItems = new RobokassaItemModel[] {
                new RobokassaItemModel {
                    name = subscriptionDescription,
                    quantity = 1,
                    sum = outSum,
                    tax = "none",
                    payment_method = "full_payment"
                }
            };

            RobokassaClientModel robokassaClient = new RobokassaClientModel {
                email = emailClient
            };

            RobokassaPaymentModel[] robokassaPayments = new RobokassaPaymentModel[] {
                new RobokassaPaymentModel{
                    type = 2,
                    sum = outSum
                }
            };

            RobokassaVatModel[] robokassaVats = new RobokassaVatModel[] {
                new RobokassaVatModel {
                    type = "none",
                    sum = 0
                }
            };

            string roboShopName = _appSettings.RobokassaShopName;
            RobokassaResultReceiptModel robokassaResultReceipt = new RobokassaResultReceiptModel {
                merchantId = roboShopName,
                originId = invId,
                id = invId + 1,
                operation = "sell",
                url = "https:__usa-invest.ru", // запрос придется кодировать в base64, так что сразу заменим "/" на "_"
                total = outSum,
                items = robokassaItems,
                client = robokassaClient,
                payments = robokassaPayments,
                vats = robokassaVats
            };

            JsonSerializerOptions jsonOptions = new JsonSerializerOptions
            {
                Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
                IgnoreNullValues = true
            };

            string jsStrSecondReceipt = JsonSerializer.Serialize<RobokassaResultReceiptModel>(robokassaResultReceipt, jsonOptions);
            var secondReciptBytes = Encoding.UTF8.GetBytes(jsStrSecondReceipt);
            string firstBase64string = Convert.ToBase64String(secondReciptBytes).Replace("=","");

            string signature = generateSHA256Hash(firstBase64string + _appSettings.RobokassaFirstPassw);
            var signatureBytes = Encoding.UTF8.GetBytes(signature);
            string signatureBase64 = Convert.ToBase64String(signatureBytes).Replace("=", "");

            string finalBase64Request = firstBase64string + "." + signatureBase64;

            try
            {
                var stringContent = new StringContent(finalBase64Request, Encoding.UTF8, "text/plain");
                var response = await new HttpClient().PostAsync("https://ws.roboxchange.com/RoboFiscal/Receipt/Attach", stringContent);

                string strResponse = await response.Content.ReadAsStringAsync();

                Log($" Method = SendSecondReceipt, InvoiceId = {invId}, SecondReceipt = {jsStrSecondReceipt}, Response = {strResponse}");
            }
            catch (Exception ex)
            {
                Log($" EXCEPTION: Method = SendSecondReceipt, Ex.message = {ex.Message}, InvoiceId = {invId}, SecondReceipt = {jsStrSecondReceipt}");
            }
        }

        public IEnumerable<Subscription> GetAllSubscriptions()
        {
            var subscriptions = _context.Subscriptions;
            return subscriptions.ToList();
        }

        public void SetSubscriptionEndDate (int id, int numberOfMonths)
        {
            var account = GetAccount(id);

            // если мы даем подписку обычному пользователю, то меняем его роль на UserWithSub
            if (account.Role == Role.User)
            {
                account.Role = Role.UserWithSub;
                account.SubscriptionEndDate = DateTime.Now.AddMonths(numberOfMonths);
            }
            else if (account.Role == Role.UserWithSub)
            {
                account.SubscriptionEndDate = account.SubscriptionEndDate.Value.AddMonths(numberOfMonths);
            }

            _context.Accounts.Update(account);
            _context.SaveChanges();
        }

        public PromoCode CreatePromocode (int additionalDays, DateTime expirationDate)
        {
            string code = GenerateRandomString(10);
            PromoCode newPromoCode = new PromoCode
            {
                Code = code,
                AdditionalDays = additionalDays,
                ExpirationDate = expirationDate
            };

            _context.PromoCodes.Add(newPromoCode);
            _context.SaveChanges();
            return newPromoCode;
        }

        public IEnumerable<PromoCode> GetAllPromocodes()
        {
            var promocodes = _context.PromoCodes;
            return promocodes.ToList();
        }

        public void UsePromocode (int id, string code)
        {
            var account = GetAccount(id);
            PromoCode promo = _context.PromoCodes.SingleOrDefault(x => x.Code == code);
            
            if (promo == null || promo.ExpirationDate < DateTime.Now)
                throw new AppException("Промокод недействителен");

            if (account.Role == Role.User)
            {
                account.Role = Role.UserWithSub;
                account.SubscriptionEndDate = DateTime.Now.AddDays(promo.AdditionalDays);
            }
            else if (account.Role == Role.UserWithSub)
            {
                account.SubscriptionEndDate = account.SubscriptionEndDate.Value.AddDays(promo.AdditionalDays);
            }

            _context.PromoCodes.Remove(promo);
            _context.Accounts.Update(account);
            _context.SaveChanges();
        }

        public DateTime CheckSubscriptionEndDate (int id)
        {
            var account = GetAccount(id);

            if (account.Role == Role.User)
            {
                throw new AppException("Нет действующей подписки");
            }
            else if (account.Role == Role.UserWithSub)
            {
                if (account.SubscriptionEndDate >= DateTime.Now)
                {
                    return account.SubscriptionEndDate.Value;
                }
                else
                {
                    account.Role = Role.User;
                    account.SubscriptionEndDate = null;
                    account.Updated = DateTime.UtcNow;

                    _context.Accounts.Update(account);
                    _context.SaveChanges();
                    throw new AppException("Срок действия подписки истек");
                }
            }
            else // if account.Role == Admin
            {
                return DateTime.MaxValue;
            }
        }

        // helper methods

        private Account GetAccount(int id)
        {
            var account = _context.Accounts.Find(id);
            if (account == null) throw new KeyNotFoundException("Аккаунт не найден");
            return account;
        }

        private string GenerateRandomString(int length)
        {
            using var rngCryptoServiceProvider = new RNGCryptoServiceProvider();
            var randomBytes = new byte[length];
            rngCryptoServiceProvider.GetBytes(randomBytes);
            // convert random bytes to hex string
            return BitConverter.ToString(randomBytes).Replace("-", "");
        }

        private string GetHttpPrm(HttpRequest request, string sName)
        {
            string sValue;
            sValue = request.Form[sName].ToString();

            if (string.IsNullOrEmpty(sValue))
                sValue = request.Query[sName].ToString();

            if (string.IsNullOrEmpty(sValue))
                sValue = String.Empty;

            return sValue;
        }
        private string generateSHA256Hash(string stringToHash)
        {
            using (SHA256CryptoServiceProvider sha256 = new SHA256CryptoServiceProvider())
            {
                byte[] bSignature = sha256.ComputeHash(Encoding.ASCII.GetBytes(stringToHash));
                StringBuilder sbSignature = new StringBuilder();
                foreach (byte b in bSignature)
                    sbSignature.AppendFormat("{0:x2}", b);
                return sbSignature.ToString();
            }
        }

        private void Log(string msg)
        {
            System.IO.File.AppendAllLines("log.txt", new[] { $"{DateTime.UtcNow} {msg}" });
        }
    }
}

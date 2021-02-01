using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net;
using System.Text.Encodings.Web;
using System.Text.Json;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using ScrapySharp.Extensions;
using ScrapySharp.Network;
using stockapi.Entities;
using stockapi.Helpers;
using stockapi.Models;
using stockapi.Services;

namespace stockapi.Controllers
{
    [Route("api/[controller]")]
    public class StocksController : BaseController
    {
        private DataContext _context;
        private readonly ISubscriptionService _subscriptionService;
        private readonly AppSettings _appSettings;

        public StocksController(DataContext context, ISubscriptionService subscriptionService, IOptions<AppSettings> appSettings)
        {
            _context = context;
            _subscriptionService = subscriptionService;
            _appSettings = appSettings.Value;
        }

        [Route("Search")]
        [HttpGet]
        public async Task<IActionResult> Search(string company)
        {
            WebRequest request = WebRequest.Create("https://www.gurufocus.com/reader/_api/_search?text=" + company);
            WebResponse response = await request.GetResponseAsync();
            string result = null;
            using (Stream stream = response.GetResponseStream())
            {
                using (StreamReader reader = new StreamReader(stream))
                {
                    result = reader.ReadToEnd();
                }
            }
            response.Close();

            List<CompanyGurufocusModel> companyGurufocus = new List<CompanyGurufocusModel>();
            if (result != null)
                companyGurufocus = JsonSerializer.Deserialize<List<CompanyGurufocusModel>>(result);

            List<Company> listCompany = new List<Company>();

            if (companyGurufocus != null)
            {
                int idComp = 0;
                foreach (var comp in companyGurufocus)
                {
                    string compType = comp.type;
                    JsonElement compData = comp.data;

                    if (compType != "stock")
                        continue;

                    string exchange = compData.GetProperty("exchange").GetString();

                    if (exchange != "NYSE" && exchange != "NAS")
                        continue;

                    string ticker = compData.GetProperty("symbol").GetString();
                    string compName = compData.GetProperty("company").GetString();

                    listCompany.Add(new Company
                    {
                        Id = idComp++,
                        Name = compName,
                        Ticker = ticker
                    });
                }
            }
            return Ok(listCompany);
        }

        [Route("Sectors/all")]
        [HttpGet]
        public string GetAllCategories ()
        {
            string[] categories = { "healthcare", "technology", "financial", "industrials", "communicationservices" };
            return GetAllSectors(categories);
        }

        [Authorize(Entities.Role.Admin, Entities.Role.UserWithSub)]
        [Route("Ideas/all")]
        [HttpGet]
        public string GetAllIdeas()
        {
            string[] categories = { "dividends", "biotech", "growrecommendations"};
            _subscriptionService.CheckSubscriptionEndDate(Account.Id);

            return GetAllSectors(categories);
        }

        private string GetAllSectors (string[] categories)
        {
            List<Company> listCompanies = new List<Company>();
            listCompanies = _context.Companies.Where(x => categories.Contains(x.Category))
                .Include(comp => comp.FutureForecast)
                .AsEnumerable()
                .GroupBy(stock => stock.Ticker)
                .Select(y => y.First())
                .ToList();
            JsonSerializerOptions jsonOptions = new JsonSerializerOptions
            {
                WriteIndented = true,
                Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping
            };
            return JsonSerializer.Serialize<List<Company>>(listCompanies, jsonOptions);
        }

        [Route("{category}")]
        [HttpGet]
        public IActionResult GetCategory(string category)
        {
            category = category.ToLower();

            string[] ideas = { "dividends", "biotech", "growrecommendations", "venture" };

            if (ideas.Contains(category))
            {
                _subscriptionService.CheckSubscriptionEndDate(Account.Id);
            }

            List<Company> listCompanies = new List<Company>();
            listCompanies = _context.Companies.Where(x => x.Category == category).Include(comp => comp.FutureForecast).ToList();
            JsonSerializerOptions jsonOptions = new JsonSerializerOptions
            {
                WriteIndented = true,
                Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping
            };
            return Ok(JsonSerializer.Serialize<List<Company>>(listCompanies, jsonOptions));
        }

        [Route("{category}")]
        [HttpPost]
        public async Task<IActionResult> PostCategory(string category)
        {
            ScrapingBrowser browser = new ScrapingBrowser();
            List<WebPage> listPages = new List<WebPage>();
            List<string> tickers = new List<string>();
            category = category.ToLower();

            // удаляем все компании этой категории из БД, т.к. постоянно может быть разный набор подходящих компаний
            var categoryCompanies = _context.Companies.Where(x => x.Category == category);
            _context.Companies.RemoveRange(categoryCompanies);
            _context.SaveChanges();

            if (category == "venture")
            {
                string otherCompanies = System.IO.File.ReadAllText("OtherCompanies.json");
                using (JsonDocument doc = JsonDocument.Parse(otherCompanies))
                {
                    JsonElement root = doc.RootElement;
                    JsonElement categoryTickers = root.GetProperty(category);

                    for (int i = 0; i < categoryTickers.GetArrayLength(); i++)
                    {
                        tickers.Add(categoryTickers[i].GetString());
                    }
                }
            }
            else
            {
                string CompaniesUri = System.IO.File.ReadAllText("companieslist.json");
                using (JsonDocument doc = JsonDocument.Parse(CompaniesUri))
                {
                    JsonElement root = doc.RootElement;
                    JsonElement categoryLinks = root.GetProperty(category);

                    for (int i = 0; i < categoryLinks.GetArrayLength(); i++)
                    {
                        listPages.Add(browser.NavigateToPage(new Uri(categoryLinks[i].GetString())));
                    }
                }

                if (listPages != null)
                {
                    foreach (WebPage page in listPages)
                    {
                        var Table1 = page.Html.CssSelect(".screener-link-primary");

                        foreach (var c in Table1)
                        {
                            tickers.Add(c.InnerText);
                        }
                    }
                }
            }
            
            List<Company> companies = new List<Company>();
            if (tickers != null)
            {
                tickers = tickers.GroupBy(x => x).Select(x => x.First()).ToList();

                foreach (var ticker in tickers)
                {
                    Company company = await AboutCompany(ticker);
                    if (company != null)
                    {
                        if (category == "growrecommendations" ||
                            category == "biotech" ||
                            category == "dividends")
                        {
                            var stockInfo = await isStockSuitable(company, category);
                            bool checkConditions = stockInfo.conditions;
                            if (!checkConditions)
                                continue;
                            company.Status = stockInfo.status;
                            company.FutureForecast = new StockFutureForecast { PriceDifference = (int)stockInfo.forecastDifference,
                                                                               Date = stockInfo.forecastYear };
                        }
                        else if (category != "venture")
                        {
                            var stockInfo = await isStockSuitable(company);
                            company.Status = stockInfo.status;
                        }
                        company.Category = category;
                        companies.Add(company);

                        _context.Companies.Add(company);
                    }
                }
            }
            _context.SaveChanges();
            return Ok();
        }

        [Route("AboutCompany")]
        public async Task<Company> AboutCompany(string ticker)
        {
            // тикер должен быть написан большими буквами, иначе возможны ошибки в запросах к другим сайтам
            ticker = ticker.ToUpper();
            string result = null;
            string compName = "";
            string sector = "";
            int financialStrength = 0;
            int profitabilityRank = 0;
            int valuationRank = 0;
            double price = 0;
            string stockId = "";

            WebRequest request = WebRequest.Create($"https://www.gurufocus.com/reader/_api/stocks/{ticker}/summary");
            WebResponse response;
            try
            {
                response = await request.GetResponseAsync();
                using (Stream stream = response.GetResponseStream())
                {
                    using (StreamReader reader = new StreamReader(stream))
                    {
                        result = reader.ReadToEnd();
                    }
                }
                response.Close();

                using (JsonDocument doc = JsonDocument.Parse(result))
                {
                    JsonElement root = doc.RootElement;
                    sector = root.GetProperty("sector").GetString();
                    compName = root.GetProperty("company").GetString();
                    financialStrength = root.GetProperty("rank_balancesheet").GetInt32();
                    profitabilityRank = root.GetProperty("rank_profitability").GetInt32();
                    stockId = root.GetProperty("stockid").GetString();
                    price = root.GetProperty("price").GetDouble();
                }

                valuationRank = GetValuationRank(ticker);
            }
            catch
            {
                return null;
            }

            //грузим описание и лого с сайта Тинькофф
            ScrapingBrowser browser = new ScrapingBrowser();
            WebPage webPage = browser.NavigateToPage(new Uri($"https://www.tinkoff.ru/invest/stocks/{ticker}/"));

            string compDescription = "";
            var divs = webPage.Html.CssSelect("div");
            var divInfo = divs.FirstOrDefault(x => x.Attributes["data-qa-file"]?.Value == "SecurityInfoPure");
            if (divInfo != null)
            {
                // копируем описание компании и удаляем оттуда ненужную строку
                compDescription = divInfo.InnerText.Replace("Официальный сайт компании", "");
            }

            // проверим есть ли лого компании на сервере, если нет - загрузим
            string logoLink = "";
            CloudinaryDotNet.Account cloudinaryAccount= new CloudinaryDotNet.Account(
              _appSettings.CloudinaryCloudName,
              _appSettings.CloudinaryApiKey,
              _appSettings.CloudinaryApiSecret);

            Cloudinary cloudinary = new Cloudinary(cloudinaryAccount);
            var checkLogoInCloud = cloudinary.GetResource(ticker);
            if (checkLogoInCloud.StatusCode != HttpStatusCode.OK)
            {
                var divLogo = webPage.Html.CssSelect(".Avatar-module__root_size_xl_1IN66");
                var spanLogo = divLogo.CssSelect(".Avatar-module__image_2WFrC");
                List<string> logoUrls = new List<string>();
                foreach (var c in spanLogo)
                {
                    logoUrls.Add(c.Attributes["style"]?.Value);
                }

                if (logoUrls?.Count != 0)
                {
                    logoLink = logoUrls.First();
                    // заменяем ненужную часть ссылки на https и удаляем последний символ ")"
                    logoLink = logoLink.Replace("background-image:url(", "https:");
                    logoLink = logoLink.Remove(logoLink.Length - 1);
                }
                else
                {
                    logoLink = $"https://storage.googleapis.com/iex/api/logos/{ticker}.png";
                }

                var uploadParams = new ImageUploadParams()
                {
                    File = new FileDescription(ticker + ".png", logoLink),
                    PublicId = ticker
                };
                var uploadResult = cloudinary.Upload(uploadParams);
                logoLink = uploadResult.SecureUrl.ToString();
            }
            else
            {
                logoLink = checkLogoInCloud.SecureUrl.ToString();
            }


            return new Company
            {
                FinancialStrength = financialStrength,
                ProfitabilityRank = profitabilityRank,
                ValuationRank = valuationRank,
                Sector = sector,
                Name = compName,
                Description = compDescription,
                Ticker = ticker,
                LogoUrl = logoLink,
                StockId = stockId,
                Price = price
            };
        }

        [Route("CompSummary")]
        [HttpGet]
        public async Task<IActionResult> CompSummary(string ticker)
        {
            string result = null;
            WebRequest request = WebRequest.Create($"https://www.gurufocus.com/reader/_api/stocks/{ticker}/summary");
            WebResponse response;
            JsonElement root = new JsonElement();
            try
            {
                response = await request.GetResponseAsync();
                using (Stream stream = response.GetResponseStream())
                {
                    using (StreamReader reader = new StreamReader(stream))
                    {
                        result = reader.ReadToEnd();
                    }
                }
                response.Close();

                using (JsonDocument doc = JsonDocument.Parse(result))
                {
                    root = doc.RootElement.Clone();
                    Company aboutComp = AboutCompany(ticker).Result;
                    string resultJson = "";
                    resultJson = "{\"aboutComp\":" + JsonSerializer.Serialize<Company>(aboutComp) + "," + "\"summary\":" + root.ToString() + "}";
                    JsonDocument docRes = JsonDocument.Parse(resultJson);
                    return Ok(docRes.RootElement);
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        private async Task<(bool conditions, string status, double forecastDifference, string forecastYear)> isStockSuitable(Company company, string category = "other")
        {
            WebRequest request = WebRequest.Create($"https://www.gurufocus.com/reader/_api/chart/{company.StockId}/valuation");
            WebResponse response;
            string result = "";
            bool checkCondition1 = false;
            bool checkCondition2 = false;
            string stockStatus = "";
            double priceDifference = 0;
            string forecastYear = "";
            try
            {
                response = await request.GetResponseAsync();
                using (Stream stream = response.GetResponseStream())
                {
                    using (StreamReader reader = new StreamReader(stream))
                    {
                        result = reader.ReadToEnd();
                    }
                }
                response.Close();

                string dateStockStr;
                DateTime dateStock = DateTime.Today;
                double priceStock = 0;
                double nearestPrice = 0;
                DateTime prevDateStock = DateTime.Today;
                double prevPriceStock = 0;

                using (JsonDocument doc = JsonDocument.Parse(result))
                {
                    JsonElement root = doc.RootElement;
                    JsonElement medps = root.GetProperty("medps");
                    foreach (JsonElement stockPriceArray in medps.EnumerateArray())
                    {
                        foreach (JsonElement stockPrice in stockPriceArray.EnumerateArray())
                        {
                            if (stockPrice.ValueKind == JsonValueKind.String)
                            {
                                dateStockStr = stockPrice.GetString();
                                dateStock = DateTime.Parse(dateStockStr);
                            }
                            else
                            {
                                stockPrice.TryGetDouble(out priceStock);
                            }
                        }
                        if ((dateStock.Year == DateTime.Today.Year && dateStock.Month >= DateTime.Today.Month && nearestPrice == 0) ||
                            (dateStock.Year > DateTime.Today.Year && nearestPrice == 0))
                        {
                            nearestPrice = priceStock;
                            //double difference = Math.Abs((nearestPrice - company.Price) / company.Price) * 100;
                            double avgPriceChange = (nearestPrice - prevPriceStock) / (dateStock - prevDateStock).Days;
                            double expectedTodayPrice = prevPriceStock + avgPriceChange * (DateTime.Today - prevDateStock).Days;
                            double difference = Math.Abs((expectedTodayPrice - company.Price) / company.Price) * 100;

                            if (difference < 5)
                            {
                                checkCondition1 = true;
                                stockStatus = "Справедливо оценена";
                            }
                            else
                            {
                                if (difference < 20)
                                {
                                    if (company.Price < expectedTodayPrice)
                                    {
                                        stockStatus = "Недооценена";
                                        checkCondition1 = true;
                                    }
                                    else
                                    {
                                        stockStatus = "Переоценена";
                                    }
                                }
                                else
                                {
                                    if (company.Price < expectedTodayPrice)
                                    {
                                        stockStatus = "Сильно недооценена";
                                        checkCondition1 = true;
                                    }
                                    else
                                    {
                                        stockStatus = "Сильно переоценена";
                                    }
                                }
                            }
                        }
                        else if (nearestPrice == 0)
                        {
                            prevDateStock = dateStock;
                            prevPriceStock = priceStock;
                        }
                    }
                    int yearDifference = dateStock.Year - DateTime.Today.Year;
                    priceDifference = ((priceStock - company.Price) / company.Price) * 100;
                    forecastYear = dateStock.Year.ToString() + "-" + dateStock.Month;
                    switch (category)
                    {
                        case "growrecommendations":
                            if (priceStock > company.Price && (priceDifference / yearDifference) >= 15)
                                checkCondition2 = true;
                            break;
                        case "dividends":
                        case "biotech":
                            if (priceStock > company.Price)
                                checkCondition2 = true;
                            break;
                        default:
                            break;
                    }
                }
            }
            catch
            {
                return (false, stockStatus, priceDifference, forecastYear);
            }
            if (checkCondition1 == true && checkCondition2 == true)
                return (true, stockStatus, priceDifference, forecastYear);
            else
                return (false, stockStatus, priceDifference, forecastYear);
        }

        [Route("GetValRank")]
        [HttpGet]
        public int GetValuationRank(string ticker)
        {
            ScrapingBrowser browser = new ScrapingBrowser();
            WebPage page;
            try
            {
                page = browser.NavigateToPage(new Uri($"https://www.gurufocus.com/stock/{ticker}/summary"));
            }
            catch
            {
                return 0;
            }
            int ValRank = 0;
            var divs = page.Html.CssSelect("div");
            var divRatios = divs.FirstOrDefault(x => x.Attributes["id"]?.Value == "ratios");
            if (divRatios != null)
            {
                var tdElements = divRatios.CssSelect("td");
                Regex rgx = new Regex(@"\d/\d");
                var tdValRank = tdElements.FirstOrDefault(x => rgx.IsMatch(x.InnerText));
                if (tdValRank != null)
                {
                    int.TryParse(tdValRank.InnerText.Split('/').FirstOrDefault(), out ValRank);
                }
            }
            return ValRank;
        }

        [Route("getchart")]
        [HttpGet]
        public async Task<IActionResult> GetChart (string stockId)
        {
            WebRequest request = WebRequest.Create($"https://www.gurufocus.com/reader/_api/chart/{stockId}/valuation");
            WebResponse response;
            string result = "";

            try
            {
                response = await request.GetResponseAsync();
                using (Stream stream = response.GetResponseStream())
                {
                    using (StreamReader reader = new StreamReader(stream))
                    {
                        result = reader.ReadToEnd();
                    }
                }
                response.Close();

                using (JsonDocument doc = JsonDocument.Parse(result))
                {
                    JsonElement root = doc.RootElement.Clone();
                    return Ok(root);
                }
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Route("getindicators")]
        [HttpGet]
        public IActionResult GetIndicatorsVsIndustry(string ticker)
        {
            ticker = ticker.ToUpper();
            string[] indicators = new string[] { "Cash-To-Debt", "Equity-to-Asset", "Debt-to-Equity", "Interest Coverage",
                "Operating Margin %", "Net Margin %", "ROE %", "ROA %", "ROC (Joel Greenblatt) %", "3-Year Revenue Growth Rate",
                "PE Ratio", "Forward PE Ratio", "PB Ratio", "PS Ratio", "PEG Ratio", "Current Ratio", "Quick Ratio"};
            string[] indicatorsWidth = new string[] { "cash2debt_width", "equity2asset_width", "debt2equity_width", "interest_coverage_width",
                "oprt_margain_width", "net_margain_width", "roe_width", "roa_width", "ROC_JOEL_width", "rwn_growth_3y_width",
                "pe_width", "forwardPE_width", "pb_width", "ps_width", "peg_width", "current_ratio_width", "quick_ratio_width"};
            Dictionary<string, double> dictIndicators = new Dictionary<string, double>(indicators.Length);
            ScrapingBrowser browser = new ScrapingBrowser();
            WebPage page;
            try
            {
                page = browser.NavigateToPage(new Uri($"https://www.gurufocus.com/stock/{ticker}/summary"));
                // вытаскиваем табличные строки с индикаторами
                var trIndicators = page.Html.CssSelect(".stock-indicators-table-row");

                for (int i = 0; i < indicators.Length; i++)
                {
                    foreach (var trIndicator in trIndicators)
                    {
                        if (trIndicator.InnerText.Contains(indicators[i]))
                        {
                            var progressBar = trIndicator.CssSelect(".indicator-progress-bar");
                            var divVsIndustry = progressBar?.First().FirstChild;
                            // интересующий нас параметр vsIndustry отображен в ширине индикатора, 
                            // а он в свою очередь записан в аттрибуте style вместе с другими параметрами
                            string strProgressBar = divVsIndustry?.Attributes["style"]?.Value;
                            string strVsIndustry = strProgressBar?.Substring(0, strProgressBar.IndexOf(';'));
                            double vsIndustryValue;
                            // удаляем лишнее из строки strVsIndustry и преобразовываем в значение double
                            NumberStyles style = NumberStyles.AllowDecimalPoint;
                            CultureInfo culture = CultureInfo.CreateSpecificCulture("en-GB");
                            Double.TryParse(strVsIndustry?.Replace("width:", "").Replace("%", ""), style, culture, out vsIndustryValue);
                            vsIndustryValue = Math.Round(vsIndustryValue, 2);
                            dictIndicators.Add(indicatorsWidth[i], vsIndustryValue);
                            break;
                        }
                    }
                }
                JsonSerializerOptions jsonOptions = new JsonSerializerOptions
                {
                    WriteIndented = true
                };
                return Ok(JsonSerializer.Serialize<Dictionary<string, double>>(dictIndicators, jsonOptions));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Route("getfinancials/{ticker}")]
        [HttpGet]
        public IActionResult GetFinancials (string ticker)
        {
            ScrapingBrowser browser = new ScrapingBrowser();
            WebPage page;
            try
            {
                page = browser.NavigateToPage(new Uri($"https://www.gurufocus.com/financials/{ticker}"));
            }
            catch
            {
                return BadRequest();
            }
            string[] financialData = new string[] { "Revenue", "Net Income", "Cash, Cash Equivalents, Marketable Securities",
                "Cash and cash equivalents", "Short-term investments", "Long-Term Debt & Capital Lease Obligation", "Short-Term Debt & Capital Lease Obligation"}; 
            FinYearGurufocusModel finYearGurufocusModel = new FinYearGurufocusModel();
            FinQuartGurufocusModel finQuartGurufocusModel = new FinQuartGurufocusModel();

            var tdFiscalPer = page.Html.CssSelect("td").FirstOrDefault(x => x.Attributes["title"]?.Value == "Fiscal Period");
            if (tdFiscalPer != null)
            {
                var trFiscPer = tdFiscalPer.ParentNode;
                var tdFiscalperiods = trFiscPer.CssSelect("td").Where(x => x.Attributes["title"]?.Value != null);
                
                // вытаскиваем кварталы
                string[] quarters = new string [5];
                for (int i = 0; i < quarters.Length; i++)
                {
                    string dateQuarterly = tdFiscalperiods.ToList()[i+6]?.GetAttributeValue("title", "");
                    dateQuarterly = dateQuarterly.Substring(0, 5); // берем первые 5 символов (MMMyy), т.к. только они значащие
                    string monthQuart = DateTime.ParseExact(dateQuarterly, "MMMyy", CultureInfo.InvariantCulture).Month.ToString();
                    string yearQuart = DateTime.ParseExact(dateQuarterly, "MMMyy", CultureInfo.InvariantCulture).Year.ToString();
                    quarters[i] = monthQuart + "/" + yearQuart;
                }
                finQuartGurufocusModel.Quarterly = quarters;

                // берем первый период, чтобы знать с какого года вести отсчет (всего можем предоставить данные за 4 года)
                string startDate = tdFiscalperiods.ToList()[1].GetAttributeValue("title","");
                finYearGurufocusModel.startYear = DateTime.ParseExact(startDate, "MMMyy", CultureInfo.InvariantCulture).Year;
            }

            bool noMarketSec = false;
            foreach (var param in financialData)
            {
                var tds = page.Html.CssSelect("td");
                var td = tds.FirstOrDefault(x => x.Attributes["title"]?.Value == param);
                if (td != null)
                {
                    var tr = td.ParentNode;
                    var financialValues = tr.CssSelect("td").Where(x => x.Attributes["title"]?.Value != null);
                    List<HtmlAgilityPack.HtmlNode> listValues = financialValues.ToList();

                    double[] dYearValues = new double[4];
                    double[] dQuartValues = new double[5];
                    NumberStyles style = NumberStyles.Number | NumberStyles.AllowCurrencySymbol;
                    CultureInfo culture = CultureInfo.CreateSpecificCulture("en-GB");
                    for (int i = 0; i < dYearValues.Length; i++)
                    {
                        Double.TryParse(listValues[i+1].Attributes["title"].Value, style, culture, out dYearValues[i]);
                    }
                    
                    for (int i = 0; i < dQuartValues.Length; i++)
                    {
                        Double.TryParse(listValues[i+5].Attributes["title"].Value, style, culture, out dQuartValues[i]);
                    }

                    dYearValues = dYearValues.Select(d => Math.Round(d, 1)).ToArray();
                    dQuartValues = dQuartValues.Select(d => Math.Round(d, 1)).ToArray();

                    switch (param)
                    {
                        case "Revenue":
                            finYearGurufocusModel.RevenueData = dYearValues;
                            finQuartGurufocusModel.RevenueData = dQuartValues;
                            break;
                        case "Net Income":
                            finYearGurufocusModel.IncomeData = dYearValues;
                            finQuartGurufocusModel.IncomeData = dQuartValues;
                            break;
                        case "Cash, Cash Equivalents, Marketable Securities":
                            finYearGurufocusModel.CashData = dYearValues;
                            finQuartGurufocusModel.CashData = dQuartValues;
                            break;
                        case "Cash and cash equivalents":
                            if (finYearGurufocusModel.CashData == null)
                            {
                                finYearGurufocusModel.CashData = dYearValues;
                                finQuartGurufocusModel.CashData = dQuartValues;
                                noMarketSec = true;
                            }
                            break;
                        case "Short-term investments":
                            if (noMarketSec)
                            {
                                for (int i = 0; i < finYearGurufocusModel.CashData?.Length; i++)
                                {
                                    finYearGurufocusModel.CashData[i] += dYearValues[i];
                                    finQuartGurufocusModel.CashData[i] += dQuartValues[i];
                                }
                                finQuartGurufocusModel.CashData[4] += dQuartValues[4];
                            }
                            break;
                        case "Long-Term Debt & Capital Lease Obligation":
                            finYearGurufocusModel.DebtData = dYearValues;
                            finQuartGurufocusModel.DebtData = dQuartValues;
                            break;
                        case "Short-Term Debt & Capital Lease Obligation":
                            for (int i = 0; i < finYearGurufocusModel.DebtData?.Length; i++)
                            {
                                finYearGurufocusModel.DebtData[i] += dYearValues[i];
                                finQuartGurufocusModel.DebtData[i] += dQuartValues[i];
                            }
                            finQuartGurufocusModel.DebtData[4] += dQuartValues[4];
                            break;
                    }
                }
            }
            string result;
            JsonSerializerOptions jsonOptions = new JsonSerializerOptions
            {
                WriteIndented = true,
                Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping
            };
            result = JsonSerializer.Serialize<FinYearGurufocusModel>(finYearGurufocusModel, jsonOptions);
            result = "{\"yearData\":" + JsonSerializer.Serialize<FinYearGurufocusModel>(finYearGurufocusModel,jsonOptions) +
                "," + "\"quarterlyData\":" + JsonSerializer.Serialize<FinQuartGurufocusModel>(finQuartGurufocusModel, jsonOptions) + "}";
            JsonDocument doc = JsonDocument.Parse(result);
            return Ok(doc.RootElement);
        }
        
        [Route("analysts-recommendations/{ticker}")]
        [HttpGet]
        public async Task<IActionResult> AnalystsRecommendations (string ticker)
        {
            ticker = ticker.ToUpper();
            WebRequest request = WebRequest.Create($"https://finnhub.io/api/v1/stock/recommendation?symbol={ticker}&token=bup5se748v6sjkjikmf0");
            WebResponse response;
            string result = "";

            try
            {
                response = await request.GetResponseAsync();
                using (Stream stream = response.GetResponseStream())
                {
                    using (StreamReader reader = new StreamReader(stream))
                    {
                        result = reader.ReadToEnd();
                    }
                }
                response.Close();

                using (JsonDocument doc = JsonDocument.Parse(result))
                {
                    JsonElement root = doc.RootElement.Clone();
                    return Ok(root);
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Route("GetPrices/{ticker}")]
        [HttpGet]
        public async Task<IActionResult> GetPrices(string ticker)
        {
            ticker = ticker.ToUpper();
            WebRequest request = WebRequest.Create($"https://www.gurufocus.com/modules/chart/chart_json_morn.php?symbol={ticker}");
            WebResponse response;
            string result = "";

            try
            {
                response = await request.GetResponseAsync();
                using (Stream stream = response.GetResponseStream())
                {
                    using (StreamReader reader = new StreamReader(stream))
                    {
                        result = reader.ReadToEnd();
                    }
                }
                response.Close();

                using (JsonDocument doc = JsonDocument.Parse(result))
                {
                    JsonElement root = doc.RootElement.Clone();
                    return Ok(root);
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    } 
}

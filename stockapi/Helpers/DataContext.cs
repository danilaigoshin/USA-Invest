using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using stockapi.Entities;

namespace stockapi.Helpers
{
    public class DataContext : DbContext
    {
        protected readonly IConfiguration Configuration;

        public DataContext(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        protected override void OnConfiguring(DbContextOptionsBuilder options)
        {
            // connect to sql server database
            // 2 тип подключения для развертывания через Docker
            string serverName = Environment.GetEnvironmentVariable("SQLCONNECT");
            if (serverName == null)
            {
                options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection"));
            }
            else
            {
                options.UseSqlServer(Configuration.GetConnectionString("ProdConnection"));
            }

        }

        public DbSet<Account> Accounts { get; set; }
        public DbSet<Company> Companies { get; set; }
        public DbSet<StockFutureForecast> StockFutureForecast { get; set; }
        public DbSet<PromoCode> PromoCodes { get; set; }
        public DbSet<Subscription> Subscriptions { get; set; }
    }
}

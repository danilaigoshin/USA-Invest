using AutoMapper;
using stockapi.Entities;
using stockapi.Models.Accounts;
using stockapi.Models.Subscription;

namespace stockapi.Helpers
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<Account, AccountResponse>()
                .ForMember("SubscriptionEndDate", opt => opt.MapFrom(
                    src => src.SubscriptionEndDate.HasValue ? src.SubscriptionEndDate.Value.ToShortDateString() : null));

            CreateMap<Account, AuthenticateResponse>();

            CreateMap<RegisterRequest, Account>();

            CreateMap<CreateRequest, Account>();

            CreateMap<UpdateRequest, Account>()
                .ForAllMembers(x => x.Condition(
                    (src, dest, prop) =>
                    {
                        // ignore null & empty string properties
                        if (prop == null) return false;
                        if (prop.GetType() == typeof(string) && string.IsNullOrEmpty((string)prop)) return false;

                        // ignore null role
                        if (x.DestinationMember.Name == "Role" && src.Role == null) return false;

                        return true;
                    }
                ));

            CreateMap<ExternalLoginRequest, Account>();

            CreateMap<Stock, PortfolioStockResponse>();

        }
    }
}

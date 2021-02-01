FROM mcr.microsoft.com/dotnet/core/aspnet:3.1-buster-slim AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/core/sdk:3.1-buster AS build
WORKDIR /src
COPY ["stockapi.csproj", ""]
RUN dotnet restore "./stockapi.csproj"
COPY . .
RUN dotnet build "stockapi.csproj" -c Release -o /app

FROM build AS publish
RUN dotnet publish "stockapi.csproj" -c Release -o /app

FROM base AS final
WORKDIR /app
COPY --from=publish /app .
ENTRYPOINT ["dotnet", "stockapi.dll"]
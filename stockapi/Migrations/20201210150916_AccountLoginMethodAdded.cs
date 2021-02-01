using Microsoft.EntityFrameworkCore.Migrations;

namespace stockapi.Migrations
{
    public partial class AccountLoginMethodAdded : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "LoginMethod",
                table: "Accounts",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LoginMethod",
                table: "Accounts");
        }
    }
}

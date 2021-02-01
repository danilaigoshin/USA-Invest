using Microsoft.EntityFrameworkCore.Migrations;

namespace stockapi.Migrations
{
    public partial class AccountExternalPhotoLinkAdded : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ExternalPhotoLink",
                table: "Accounts",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ExternalPhotoLink",
                table: "Accounts");
        }
    }
}

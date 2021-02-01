using Microsoft.EntityFrameworkCore.Migrations;

namespace stockapi.Migrations
{
    public partial class StockClassEdited : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsDividend",
                table: "Stock",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "Sector",
                table: "Stock",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsDividend",
                table: "Stock");

            migrationBuilder.DropColumn(
                name: "Sector",
                table: "Stock");
        }
    }
}

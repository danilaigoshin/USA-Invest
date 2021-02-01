using Microsoft.EntityFrameworkCore.Migrations;

namespace stockapi.Migrations
{
    public partial class StockClassModifiedOwnedKey : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Stock_Accounts_AccountId",
                table: "Stock");

            migrationBuilder.AlterColumn<int>(
                name: "AccountId",
                table: "Stock",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Stock_Accounts_AccountId",
                table: "Stock",
                column: "AccountId",
                principalTable: "Accounts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Stock_Accounts_AccountId",
                table: "Stock");

            migrationBuilder.AlterColumn<int>(
                name: "AccountId",
                table: "Stock",
                type: "int",
                nullable: true,
                oldClrType: typeof(int));

            migrationBuilder.AddForeignKey(
                name: "FK_Stock_Accounts_AccountId",
                table: "Stock",
                column: "AccountId",
                principalTable: "Accounts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}

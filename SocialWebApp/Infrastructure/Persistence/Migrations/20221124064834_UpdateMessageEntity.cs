using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Persistence.Migrations
{
    public partial class UpdateMessageEntity : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Photo",
                table: "Message");

            migrationBuilder.AddColumn<int>(
                name: "Type",
                table: "Message",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Type",
                table: "Message");

            migrationBuilder.AddColumn<string>(
                name: "Photo",
                table: "Message",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}

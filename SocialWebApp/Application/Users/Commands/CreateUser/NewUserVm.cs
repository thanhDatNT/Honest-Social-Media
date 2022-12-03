namespace Application.Users.Commands.CreateUser;

public class NewUserVm
{
    public int? Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string UserName { get; set; }
    public DateTime? Dob { get; set; }
    public string Email { get; set; }
    public int Gender { get; set; }
    public string PhoneNo { get; set; }
    public DateTime? CreatedAt { get; set; } = DateTime.Now;
    public DateTime? UpdatedAt { get; set; } = DateTime.Now;
}
namespace Application.Users.Queries.Login
{
    public class LoginUserDto
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string UserName { get; set; }
        public DateTime Dob { get; set; }
        public string Email { get; set; }
        public string Avatar { get; set; }
        public string Cover { get; set; }
        public int Gender { get; set; }
        public string PhoneNo { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GrubyKlient
{
    class User
    {
        public string UserId { get; set; }
        public string PermissionsLevelName { get; set; }
        public string FirstName { get; set; }
        public string SecondName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public int HotelId { get; set; }

        public User(string userid, string permlvlname, string firstname, string secondname, string lastname, string email, string passwd, int hotelid)
        {
            UserId = userid;
            PermissionsLevelName = permlvlname;
            FirstName = firstname;
            SecondName = secondname;
            LastName = lastname;
            Email = email;
            PasswordHash = passwd;
            HotelId = hotelid;
        }
    }
}

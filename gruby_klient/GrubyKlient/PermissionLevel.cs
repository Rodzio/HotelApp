using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GrubyKlient
{
    public class PermissionLevel
    {
        public string Name { get; set; }
        public bool ManageHotels { get; set; }
        public bool ManageRooms { get; set; }
        public bool ManageGuests { get; set; }
        public bool ManageEmployees { get; set; }
        public bool ManageReservations { get; set; }

        public PermissionLevel() { }
        public PermissionLevel(string name, bool manageHotels, bool manageRooms, bool manageGuests, bool manageEmployees, bool manageReservations)
        {
            Name = name;
            ManageHotels = manageHotels;
            ManageRooms = manageRooms;
            ManageGuests = manageGuests;
            ManageEmployees = manageEmployees;
            ManageReservations = manageReservations;
        }

    }
}

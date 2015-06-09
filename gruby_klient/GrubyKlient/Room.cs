using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GrubyKlient
{
    public class Room
    {
        public int HotelId { get; set; }
        public int RoomNumber { get; set; }
        public string TemplateId { get; set; }

        public Room() { }
        public Room(int hotelId, int roomNumber, string templateId)
        {
            HotelId = hotelId;
            RoomNumber = roomNumber;
            TemplateId = templateId;
        }
    }
}

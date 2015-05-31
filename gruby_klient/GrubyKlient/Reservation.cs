using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GrubyKlient
{
    public class Reservation
    {
        public int ReservationId { get; set; }
        public int HotelId { get; set; }
        public int RoomNumber { get; set; }
        public string UserId { get; set; }
        public string ReservationCheckIn { get; set; }
        public string ReservationCheckOut { get; set; }

        public Reservation(int reservationId, int hotelId, int roomNumber, string userId, string reservationCheckIn, string reservationCheckOut)
        {
            ReservationId = reservationId;
            HotelId = hotelId;
            RoomNumber = roomNumber;
            UserId = userId;
            ReservationCheckIn = reservationCheckIn;
            ReservationCheckOut = reservationCheckOut;
        }
    }
}

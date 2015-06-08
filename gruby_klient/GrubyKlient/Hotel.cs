using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GrubyKlient
{
    public class Hotel
    {
        public int HotelId { get; set; }
        public string HotelName { get; set; }
        public string HotelCountry { get; set; }
        public string HotelCity { get; set; }
        public string HotelStreet { get; set; }
        public int HotelRating { get; set; }
        public string HotelEmail { get; set; }
        public string HotelPhone { get; set; }

        public Hotel() { }
        public Hotel(int hotelId, string hotelName, string hotelCountry, string hotelCity, string hotelStreet, int hotelRating, string hotelEmail, string hotelPhone)
        {
            HotelId = hotelId;
            HotelName = hotelName;
            HotelCountry = hotelCountry;
            HotelCity = hotelCity;
            HotelStreet = hotelStreet;
            HotelRating = hotelRating;
            HotelEmail = hotelEmail;
            HotelPhone = hotelPhone;
        }
    }
}

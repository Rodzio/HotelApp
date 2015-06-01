using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Security.Cryptography;
using System.Threading.Tasks;
using WebSocketSharp;
using Newtonsoft.Json.Linq;

namespace GrubyKlient
{
    public class ServerAPIInterface
    {
        // Singleton pattern
        private static readonly ServerAPIInterface instance = new ServerAPIInterface();
        public static ServerAPIInterface Instance
        {
            get 
            {
                return instance;
            }
        }

        static ServerAPIInterface() { }
        private ServerAPIInterface() {
            isRunning = false;
            shouldStop = false;
            connectionEstablished = false;
            wsRequests = new List<string>();
        }

        // --
        #region PacketClasses
        public class GenericResponseEventArgs : EventArgs
        {
            private readonly bool result;
            private readonly string error;

            public GenericResponseEventArgs(bool result, string error)
            {
                this.result = result;
                this.error = error;
            }
        }
        public class HotelGetPacketEventArgs : EventArgs
        {
            private readonly List<Hotel> hotels;

            public List<Hotel> Hotels { get { return hotels; } }
            public HotelGetPacketEventArgs(List<Hotel> hotels)
            {
                this.hotels = hotels;
            }
        }
        public class TemplateGetPacketEventArgs : EventArgs
        {
            private readonly List<Template> templates;

            public List<Template> Templates { get { return templates; } }
            public TemplateGetPacketEventArgs(List<Template> templates)
            {
                this.templates = templates;
            }
        }
        public class ReservationGetPacketEventArgs : EventArgs
        {
            private readonly List<Reservation> reservations;

            public List<Reservation> Reservations { get { return reservations; } }
            public ReservationGetPacketEventArgs(List<Reservation> reservations)
            {
                this.reservations = reservations;
            }
        }
        public class RoomGetPacketEventArgs : EventArgs
        {
            private readonly List<Room> rooms;

            public List<Room> Rooms { get { return rooms; } }
            public RoomGetPacketEventArgs(List<Room> rooms)
            {
                this.rooms = rooms;
            }
        }
        public class PermissionLevelsGetPacketEventArgs : EventArgs
        {
            private readonly List<PermissionLevel> permissions;

            public List<PermissionLevel> Permissions { get { return permissions; } }
            public PermissionLevelsGetPacketEventArgs(List<PermissionLevel> permissions)
            {
                this.permissions = permissions;
            }
        }
        public class LoginPacketEventArgs : EventArgs
        {
            private readonly bool authenticationOk;

            public bool AuthenticationOk { get { return authenticationOk; } }
            public LoginPacketEventArgs(bool authenticationOk)
            {
                this.authenticationOk = authenticationOk;
            }
        }
        public class RegisterPacketEventArgs : EventArgs
        {
            private readonly bool registered;
            private readonly string message;

            public bool Registered { get { return registered; } }
            public string Message { get { return message; } }
            public RegisterPacketEventArgs(bool registered, string message)
            {
                this.registered = registered;
                this.message = message;
            }
        }
        #endregion

        #region HotelPackets
        public delegate void hotelAddPacketReceiveHandler(object sender, GenericResponseEventArgs e);
        public event hotelAddPacketReceiveHandler onHotelAddPacketReceiveHandler;

        public delegate void hotelUpdatePacketReceiveHandler(object sender, GenericResponseEventArgs e);
        public event hotelUpdatePacketReceiveHandler onHotelUpdatePacketReceiveHandler;

        public delegate void hotelDeletePacketReceiveHandler(object sender, GenericResponseEventArgs e);
        public event hotelDeletePacketReceiveHandler onHotelDeletePacketReceiveHandler;

        public delegate void hotelGetPacketReceiveHandler(object sender, HotelGetPacketEventArgs e);
        public event hotelGetPacketReceiveHandler onHotelGetPacketReceiveHandler;
        #endregion

        #region RoomPackets
        public delegate void roomAddPacketReceiveHandler(object sender, GenericResponseEventArgs e);
        public event roomAddPacketReceiveHandler onRoomAddPacketReceiveHandler;

        public delegate void roomUpdatePacketReceiveHandler(object sender, GenericResponseEventArgs e);
        public event roomUpdatePacketReceiveHandler onRoomUpdatePacketReceiveHandler;

        public delegate void roomDeletePacketReceiveHandler(object sender, GenericResponseEventArgs e);
        public event roomDeletePacketReceiveHandler onRoomDeletePacketReceiveHandler;

        public delegate void roomGetPacketReceiveHandler(object sender, RoomGetPacketEventArgs e);
        public event roomGetPacketReceiveHandler onRoomGetPacketReceiveHandler;
        #endregion

        #region PermissionsPackets
        public delegate void permissionLevelAddPacketReceiveHandler(object sender, GenericResponseEventArgs e);
        public event permissionLevelAddPacketReceiveHandler onPermissionLevelAddPacketReceiveHandler;

        public delegate void permissionLevelUpdatePacketReceiveHandler(object sender, GenericResponseEventArgs e);
        public event permissionLevelUpdatePacketReceiveHandler onPermissionLevelUpdatePacketReceiveHandler;
        
        public delegate void permissionLevelDeletePacketReceiveHandler(object sender, GenericResponseEventArgs e);
        public event permissionLevelDeletePacketReceiveHandler onPermissionLevelDeletePacketReceiveHandler;

        public delegate void permissionLevelsGetPacketReceiveHandler(object sender, PermissionLevelsGetPacketEventArgs e);
        public event permissionLevelsGetPacketReceiveHandler onPermissionLevelsGetPacketReceiveHandler;
        #endregion

        #region ReservationPackets
        public delegate void reservationAddPacketReceiveHandler(object sender, GenericResponseEventArgs e);
        public event reservationAddPacketReceiveHandler onReservationAddPacketReceiveHandler;

        public delegate void reservationUpdatePacketReceiveHandler(object sender, GenericResponseEventArgs e);
        public event reservationUpdatePacketReceiveHandler onReservationUpdatePacketReceiveHandler;

        public delegate void reservationDeletePacketReceiveHandler(object sender, GenericResponseEventArgs e);
        public event reservationDeletePacketReceiveHandler onReservationDeletePacketReceiveHandler;

        public delegate void reservationGetPacketReceiveHandler(object sender, ReservationGetPacketEventArgs e);
        public event reservationGetPacketReceiveHandler onReservationGetPacketReceiveHandler;
        #endregion

        #region TemplatePackets
        public delegate void templateAddPacketReceiveHandler(object sender, GenericResponseEventArgs e);
        public event templateAddPacketReceiveHandler onTemplateAddPacketReceiveHandler;

        public delegate void templateUpdatePacketReceiveHandler(object sender, GenericResponseEventArgs e);
        public event templateUpdatePacketReceiveHandler onTemplateUpdatePacketReceiveHandler;

        public delegate void templateDeletePacketReceiveHandler(object sender, GenericResponseEventArgs e);
        public event templateDeletePacketReceiveHandler onTemplateDeletePacketReceiveHandler;

        public delegate void templateGetPacketReceiveHandler(object sender, TemplateGetPacketEventArgs e);
        public event templateGetPacketReceiveHandler onTemplateGetPacketReceiveHandler;
        #endregion

        #region OtherPackets
        public delegate void loginPacketReceiveHandler(object sender, LoginPacketEventArgs e);
        public event loginPacketReceiveHandler onLoginPacketReceiveHandler;

        public delegate void RegisterPacketReceiveHandler(object sender, RegisterPacketEventArgs e);
        public event RegisterPacketReceiveHandler onRegisterPacketReceiveHandler;
        #endregion

        private static bool isRunning;
        private bool shouldStop;
        private bool connectionEstablished;
        private WebSocket ws;
        private List<string> wsRequests;

        public void StartThreadWork()
        {
            // Make sure to never start another thread with this
            if (!isRunning)
                isRunning = true;
            else
                return;

            ws = new WebSocket("ws://127.0.0.1:9009");
            //ws = new WebSocket("ws://83.145.169.112:9009");
            ws.OnMessage += ws_OnMessage;
            ws.Connect();
            RequestHelloHandshake();

            while (true)
            {
                if (shouldStop)
                    break;

                Thread.Sleep(100);
            }

            ws.Close();
        }

        public void StopThread()
        {
            shouldStop = true;
        }


        // Websocket callbacks
        void ws_OnMessage(object sender, MessageEventArgs e)
        {
            dynamic jsonObj = JObject.Parse(e.Data);
            if (!wsRequests.Contains(jsonObj.requestId.ToString()))
                return;

            wsRequests.Remove(jsonObj.requestId.ToString());

            Console.WriteLine(jsonObj.command);

            switch ((string)jsonObj.command)
            {
                case "hello":
                    connectionEstablished = true;
                break;

                case "login":
                    bool logged = jsonObj.result;
                    if (onLoginPacketReceiveHandler != null)
                        onLoginPacketReceiveHandler(this, new LoginPacketEventArgs(logged));
                    /*
                    if (onLoginPacketReceiveHandler != null)
                        onLoginPacketReceiveHandler(this, new LoginPacketEventArgs(true));*/
                break;
                    
                case "register":
                    bool registered = jsonObj.result;
                    string message = "";
                    if(registered)
                        message = jsonObj.message;

                    if (onRegisterPacketReceiveHandler != null)
                        onRegisterPacketReceiveHandler(this, new RegisterPacketEventArgs(registered, message));
                break;

                case "permissionLevel":
                {
                    bool result = jsonObj.result;
                    if (jsonObj.action == "get")
                    {
                        if (result)
                        {

                            List<PermissionLevel> permissions = new List<PermissionLevel>();

                            int count = jsonObj.count;
                            for (int i = 0; i < count; i++)
                            {
                                permissions.Add(new PermissionLevel((string)jsonObj.list[i].UserPermissionsLevelName,
                                    (bool)jsonObj.list[i].ManageHotels,
                                    (bool)jsonObj.list[i].ManageRooms,
                                    (bool)jsonObj.list[i].ManageGuests,
                                    (bool)jsonObj.list[i].ManageEmployees,
                                    (bool)jsonObj.list[i].ManageReservations));
                            }

                            if (onPermissionLevelsGetPacketReceiveHandler != null)
                                onPermissionLevelsGetPacketReceiveHandler(this, new PermissionLevelsGetPacketEventArgs(permissions));
                        }
                    }
                    else if (jsonObj.action == "add")
                    {
                        string error = "";
                        if (result)
                            error = jsonObj.error;

                        if (onPermissionLevelAddPacketReceiveHandler != null)
                            onPermissionLevelAddPacketReceiveHandler(this, new GenericResponseEventArgs(result, error));
                    }
                    else if (jsonObj.action == "update")
                    {
                        string error = "";
                        if (result)
                            error = jsonObj.error;

                        if (onPermissionLevelUpdatePacketReceiveHandler != null)
                            onPermissionLevelUpdatePacketReceiveHandler(this, new GenericResponseEventArgs(result, error));
                    }
                    else if (jsonObj.action == "delete")
                    {
                        string error = "";
                        if (result)
                            error = jsonObj.error;

                        if (onPermissionLevelDeletePacketReceiveHandler != null)
                            onPermissionLevelDeletePacketReceiveHandler(this, new GenericResponseEventArgs(result, error));
                    }
                
                }
                break;


                case "hotel":
                {
                    bool result = jsonObj.result;
                    if (jsonObj.action == "get")
                    {
                        if (result)
                        {
                            List<Hotel> hotels = new List<Hotel>();

                            int count = jsonObj.count;
                            for (int i = 0; i < count; i++)
                            {
                                hotels.Add(new Hotel((int)jsonObj.list[i].HotelId,
                                    (string)jsonObj.list[i].HotelName,
                                    (string)jsonObj.list[i].HotelCountry,
                                    (string)jsonObj.list[i].HotelCity,
                                    (string)jsonObj.list[i].HotelStreet,
                                    (int)jsonObj.list[i].HotelRating,
                                    (string)jsonObj.list[i].HotelEmail,
                                    (string)jsonObj.list[i].HotelPhone));
                            }

                            if (onHotelGetPacketReceiveHandler != null)
                                onHotelGetPacketReceiveHandler(this, new HotelGetPacketEventArgs(hotels));
                        }
                    }
                    else if (jsonObj.action == "add")
                    {
                        string error = "";
                        if (result)
                            error = jsonObj.error;

                        if (onHotelAddPacketReceiveHandler != null)
                            onHotelAddPacketReceiveHandler(this, new GenericResponseEventArgs(result, error));

                    }
                    else if (jsonObj.action == "update")
                    {
                        string error = "";
                        if (result)
                            error = jsonObj.error;

                        if (onHotelUpdatePacketReceiveHandler != null)
                            onHotelUpdatePacketReceiveHandler(this, new GenericResponseEventArgs(result, error));

                    }
                    else if (jsonObj.action == "delete")
                    {
                        string error = "";
                        if (result)
                            error = jsonObj.error;

                        if (onHotelDeletePacketReceiveHandler != null)
                            onHotelDeletePacketReceiveHandler(this, new GenericResponseEventArgs(result, error));

                    }
                }
                break;


                case "template":
                {
                    bool result = jsonObj.result;
                    if (jsonObj.action == "get")
                    {
                        if (result)
                        {
                            List<Template> templates = new List<Template>();

                            int count = jsonObj.count;
                            for (int i = 0; i < count; i++)
                            {
                                templates.Add(new Template((string)jsonObj.list[i].TemplateId,
                                    (string)jsonObj.list[i].RoomTemplateName,
                                    (float)jsonObj.list[i].RoomTemplateCost,
                                    (string)jsonObj.list[i].RoomTemplateDescription));
                            }

                            if (onTemplateGetPacketReceiveHandler != null)
                                onTemplateGetPacketReceiveHandler(this, new TemplateGetPacketEventArgs(templates));
                        }
                    }
                    else if (jsonObj.action == "add")
                    {
                        string error = "";
                        if (result)
                            error = jsonObj.error;

                        if (onTemplateAddPacketReceiveHandler != null)
                            onTemplateAddPacketReceiveHandler(this, new GenericResponseEventArgs(result, error));

                    }
                    else if (jsonObj.action == "update")
                    {
                        string error = "";
                        if (result)
                            error = jsonObj.error;

                        if (onTemplateUpdatePacketReceiveHandler != null)
                            onTemplateUpdatePacketReceiveHandler(this, new GenericResponseEventArgs(result, error));

                    }
                    else if (jsonObj.action == "delete")
                    {
                        string error = "";
                        if (result)
                            error = jsonObj.error;

                        if (onTemplateDeletePacketReceiveHandler != null)
                            onTemplateDeletePacketReceiveHandler(this, new GenericResponseEventArgs(result, error));

                    }
                }
                break;

                case "reservation":
                {
                    bool result = jsonObj.result;
                    if (jsonObj.action == "get")
                    {
                        if (result)
                        {
                            List<Reservation> reservations = new List<Reservation>();

                            int count = jsonObj.count;
                            for (int i = 0; i < count; i++)
                            {
                                reservations.Add(new Reservation((int)jsonObj.list[i].ReservationId,
                                    (int)jsonObj.list[i].HotelId,
                                    (int)jsonObj.list[i].RoomNumber,
                                    (string)jsonObj.list[i].UserId,
                                    (string)jsonObj.list[i].ReservationCheckIn,
                                    (string)jsonObj.list[i].ReservationCheckOut));
                            }

                            if (onReservationGetPacketReceiveHandler != null)
                                onReservationGetPacketReceiveHandler(this, new ReservationGetPacketEventArgs(reservations));
                        }
                    }
                    else if (jsonObj.action == "add")
                    {
                        string error = "";
                        if (result)
                            error = jsonObj.error;

                        if (onReservationAddPacketReceiveHandler != null)
                            onReservationAddPacketReceiveHandler(this, new GenericResponseEventArgs(result, error));

                    }
                    else if (jsonObj.action == "update")
                    {
                        string error = "";
                        if (result)
                            error = jsonObj.error;

                        if (onReservationUpdatePacketReceiveHandler != null)
                            onReservationUpdatePacketReceiveHandler(this, new GenericResponseEventArgs(result, error));

                    }
                    else if (jsonObj.action == "delete")
                    {
                        string error = "";
                        if (result)
                            error = jsonObj.error;

                        if (onReservationDeletePacketReceiveHandler != null)
                            onReservationDeletePacketReceiveHandler(this, new GenericResponseEventArgs(result, error));

                    }
                }
                break;

                case "room":
                {
                    bool result = jsonObj.result;
                    if (jsonObj.action == "get")
                    {
                        if (result)
                        {
                            List<Room> rooms = new List<Room>();

                            int count = jsonObj.count;
                            for (int i = 0; i < count; i++)
                            {
                                rooms.Add(new Room((int)jsonObj.list[i].HotelId,
                                    (int)jsonObj.list[i].RoomNumber,
                                    (string)jsonObj.list[i].TemplateId));
                            }

                            if (onRoomGetPacketReceiveHandler != null)
                                onRoomGetPacketReceiveHandler(this, new RoomGetPacketEventArgs(rooms));
                        }
                    }
                    else if (jsonObj.action == "add")
                    {
                        string error = "";
                        if (result)
                            error = jsonObj.error;

                        if (onRoomAddPacketReceiveHandler != null)
                            onRoomAddPacketReceiveHandler(this, new GenericResponseEventArgs(result, error));

                    }
                    else if (jsonObj.action == "update")
                    {
                        string error = "";
                        if (result)
                            error = jsonObj.error;

                        if (onRoomUpdatePacketReceiveHandler != null)
                            onRoomUpdatePacketReceiveHandler(this, new GenericResponseEventArgs(result, error));

                    }
                    else if (jsonObj.action == "delete")
                    {
                        string error = "";
                        if (result)
                            error = jsonObj.error;

                        if (onRoomDeletePacketReceiveHandler != null)
                            onRoomDeletePacketReceiveHandler(this, new GenericResponseEventArgs(result, error));

                    }
                }
                break;
            }
        }

        // Here declare functions that send packets to API server
        private void RequestHelloHandshake() // This one's private for internal use only
        {
            dynamic jsonObj = new JObject();
            jsonObj.command = "hello";
            jsonObj.requestId = Guid.NewGuid().ToString();
            ws.Send(jsonObj.ToString());

            wsRequests.Add(jsonObj.requestId.ToString());
        }

        public void RequestLogin(string username, string pwd)
        {
            if (!connectionEstablished)
                return;

            dynamic jsonObj = new JObject();
            jsonObj.command = "login";
            jsonObj.requestId = Guid.NewGuid().ToString();
            jsonObj.loginData = JObject.FromObject(new { userEmail = username, userPasswordHash = /*Hash.GetSHA512*/(pwd) });
            ws.Send(jsonObj.ToString());

            wsRequests.Add(jsonObj.requestId.ToString());
        }

        public void RequestRegisterUser(string username, string firstName, string secondName, string lastName, string email, string pwd, string permissionLevel)
        {
            if (!connectionEstablished)
                return;

            dynamic jsonObj = new JObject();
            jsonObj.command = "register";
            jsonObj.requestId = Guid.NewGuid().ToString();
            jsonObj.registerData = JObject.FromObject(new { 
                userId = username, 
                userFirstName = firstName, 
                userSecondName = secondName,
                userLastName = lastName, 
                userEmail = email, 
                userPasswordHash = Hash.GetSHA512(pwd),
                userPermissionLevel = permissionLevel,
                userHotelId = "null",
            });
            ws.Send(jsonObj.ToString());

            wsRequests.Add(jsonObj.requestId.ToString());
        }

        public void RequestHotels()
        {
            if (!connectionEstablished)
                return;

            dynamic jsonObj = new JObject();
            jsonObj.command = "hotel";
            jsonObj.requestId = Guid.NewGuid().ToString();
            jsonObj.action = "get";
            ws.Send(jsonObj.ToString());

            wsRequests.Add(jsonObj.requestId.ToString());
        }

        public void RequestAddHotel(string name, string country, string city, string street, int rating, string email, string phone)
        {
            if (!connectionEstablished)
                return;

            dynamic jsonObj = new JObject();
            jsonObj.command = "hotel";
            jsonObj.requestId = Guid.NewGuid().ToString();
            jsonObj.action = "add";
            jsonObj.HotelName = name;
            jsonObj.HotelCountry = country;
            jsonObj.HotelCity = city;
            jsonObj.HotelStreet = street;
            jsonObj.HotelRating = rating;
            jsonObj.HotelEmail = email;
            jsonObj.HotelPhone = phone;
            ws.Send(jsonObj.ToString());

            wsRequests.Add(jsonObj.requestId.ToString());
        }


        public void RequestUpdateHotel(int id, string name, string country, string city, string street, int rating, string email, string phone)
        {
            if (!connectionEstablished)
                return;

            dynamic jsonObj = new JObject();
            jsonObj.command = "hotel";
            jsonObj.requestId = Guid.NewGuid().ToString();
            jsonObj.action = "update";
            jsonObj.HotelId = id;
            jsonObj.HotelName = name;
            jsonObj.HotelCountry = country;
            jsonObj.HotelCity = city;
            jsonObj.HotelStreet = street;
            jsonObj.HotelRating = rating;
            jsonObj.HotelEmail = email;
            jsonObj.HotelPhone = phone;
            ws.Send(jsonObj.ToString());

            wsRequests.Add(jsonObj.requestId.ToString());
        }

        public void RequestDeleteHotel(int id)
        {
            if (!connectionEstablished)
                return;

            dynamic jsonObj = new JObject();
            jsonObj.command = "hotel";
            jsonObj.requestId = Guid.NewGuid().ToString();
            jsonObj.action = "delete";
            jsonObj.HotelId = id;
            ws.Send(jsonObj.ToString());

            wsRequests.Add(jsonObj.requestId.ToString());
        }

        public void RequestPermissionLevels()
        {
            if (!connectionEstablished)
                return;

            dynamic jsonObj = new JObject();
            jsonObj.command = "permissionLevel";
            jsonObj.requestId = Guid.NewGuid().ToString();
            jsonObj.action = "get";
            ws.Send(jsonObj.ToString());

            wsRequests.Add(jsonObj.requestId.ToString());
        }

        public void RequestAddPermissionLevel(string name, bool manageHotels, bool manageRooms, bool manageGuests, bool manageEmployees, bool manageReservations)
        {
            if (!connectionEstablished)
                return;

            dynamic jsonObj = new JObject();
            jsonObj.command = "permissionLevel";
            jsonObj.requestId = Guid.NewGuid().ToString();
            jsonObj.action = "add";
            jsonObj.UserPermissionsLevelName = name;
            jsonObj.ManageHotels = manageHotels;
            jsonObj.ManageRooms = manageRooms;
            jsonObj.ManageGuests = manageGuests;
            jsonObj.ManageEmployees = manageEmployees;
            jsonObj.ManageReservations = manageReservations;
            ws.Send(jsonObj.ToString());

            wsRequests.Add(jsonObj.requestId.ToString());
        }

        public void RequestUpdatePermissionLevel(string name, bool manageHotels, bool manageRooms, bool manageGuests, bool manageEmployees, bool manageReservations)
        {
            if (!connectionEstablished)
                return;

            dynamic jsonObj = new JObject();
            jsonObj.command = "permissionLevel";
            jsonObj.requestId = Guid.NewGuid().ToString();
            jsonObj.action = "update";
            jsonObj.UserPermissionsLevelName = name;
            jsonObj.ManageHotels = manageHotels;
            jsonObj.ManageRooms = manageRooms;
            jsonObj.ManageGuests = manageGuests;
            jsonObj.ManageEmployees = manageEmployees;
            jsonObj.ManageReservations = manageReservations;
            ws.Send(jsonObj.ToString());

            wsRequests.Add(jsonObj.requestId.ToString());
        }

        public void RequestDeletePermissionLevel(string name)
        {
            if (!connectionEstablished)
                return;

            dynamic jsonObj = new JObject();
            jsonObj.command = "permissionLevel";
            jsonObj.requestId = Guid.NewGuid().ToString();
            jsonObj.action = "delete";
            jsonObj.UserPermissionsLevelName = name;
            ws.Send(jsonObj.ToString());

            wsRequests.Add(jsonObj.requestId.ToString());
        }

        public void RequestRooms()
        {
            if (!connectionEstablished)
                return;

            dynamic jsonObj = new JObject();
            jsonObj.command = "room";
            jsonObj.requestId = Guid.NewGuid().ToString();
            jsonObj.action = "get";
            ws.Send(jsonObj.ToString());

            wsRequests.Add(jsonObj.requestId.ToString());
        }

        public void RequestAddRoom(int hotelId, int roomNumber, string templateId)
        {
            if (!connectionEstablished)
                return;

            dynamic jsonObj = new JObject();
            jsonObj.command = "room";
            jsonObj.requestId = Guid.NewGuid().ToString();
            jsonObj.action = "add";
            jsonObj.HotelId = hotelId;
            jsonObj.RoomNumber = roomNumber;
            jsonObj.TemplateId = templateId;
            ws.Send(jsonObj.ToString());

            wsRequests.Add(jsonObj.requestId.ToString());
        }

        public void RequestUpdateRoom(int hotelId, int roomNumber, string templateId)
        {
            if (!connectionEstablished)
                return;

            dynamic jsonObj = new JObject();
            jsonObj.command = "room";
            jsonObj.requestId = Guid.NewGuid().ToString();
            jsonObj.action = "update";
            jsonObj.HotelId = hotelId;
            jsonObj.RoomNumber = roomNumber;
            jsonObj.TemplateId = templateId;
            ws.Send(jsonObj.ToString());

            wsRequests.Add(jsonObj.requestId.ToString());
        }

        public void RequestDeleteRoom(int hotelId, int roomNumber)
        {
            if (!connectionEstablished)
                return;

            dynamic jsonObj = new JObject();
            jsonObj.command = "room";
            jsonObj.requestId = Guid.NewGuid().ToString();
            jsonObj.action = "delete";
            jsonObj.HotelId = hotelId;
            jsonObj.RoomNumber = roomNumber;
            ws.Send(jsonObj.ToString());

            wsRequests.Add(jsonObj.requestId.ToString());
        }

        public void RequestReservations()
        {
            if (!connectionEstablished)
                return;

            dynamic jsonObj = new JObject();
            jsonObj.command = "reservation";
            jsonObj.requestId = Guid.NewGuid().ToString();
            jsonObj.action = "get";
            ws.Send(jsonObj.ToString());

            wsRequests.Add(jsonObj.requestId.ToString());
        }

        public void RequestAddReservation(int hotelId, int roomNumber, string userId, string reservationCheckIn, string reservationCheckOut)
        {
            if (!connectionEstablished)
                return;

            dynamic jsonObj = new JObject();
            jsonObj.command = "reservation";
            jsonObj.requestId = Guid.NewGuid().ToString();
            jsonObj.action = "add";
            jsonObj.HotelId = hotelId;
            jsonObj.RoomNumber = roomNumber;
            jsonObj.UserId = userId;
            jsonObj.ReservationCheckIn = reservationCheckIn;
            jsonObj.ReservationCheckOut = reservationCheckOut;
            ws.Send(jsonObj.ToString());

            wsRequests.Add(jsonObj.requestId.ToString());
        }

        public void RequestUpdateReservation(int reservationId, int hotelId, int roomNumber, string userId, string reservationCheckIn, string reservationCheckOut)
        {
            if (!connectionEstablished)
                return;

            dynamic jsonObj = new JObject();
            jsonObj.command = "reservation";
            jsonObj.requestId = Guid.NewGuid().ToString();
            jsonObj.action = "update";
            jsonObj.ReservationId = reservationId;
            jsonObj.HotelId = hotelId;
            jsonObj.RoomNumber = roomNumber;
            jsonObj.UserId = userId;
            jsonObj.ReservationCheckIn = reservationCheckIn;
            jsonObj.ReservationCheckOut = reservationCheckOut;
            ws.Send(jsonObj.ToString());

            wsRequests.Add(jsonObj.requestId.ToString());
        }


        public void RequestDeleteReservation(int reservationId)
        {
            if (!connectionEstablished)
                return;

            dynamic jsonObj = new JObject();
            jsonObj.command = "reservation";
            jsonObj.requestId = Guid.NewGuid().ToString();
            jsonObj.action = "delete";
            jsonObj.ReservationId = reservationId;
            ws.Send(jsonObj.ToString());

            wsRequests.Add(jsonObj.requestId.ToString());
        }


        public void RequestTemplates()
        {
            if (!connectionEstablished)
                return;

            dynamic jsonObj = new JObject();
            jsonObj.command = "template";
            jsonObj.requestId = Guid.NewGuid().ToString();
            jsonObj.action = "get";
            ws.Send(jsonObj.ToString());

            wsRequests.Add(jsonObj.requestId.ToString());
        }

        public void RequestAddTemplate(string templateId, string roomTemplateName, float roomTemplateCost, string roomTemplateDescription)
        {
            if (!connectionEstablished)
                return;

            dynamic jsonObj = new JObject();
            jsonObj.command = "template";
            jsonObj.requestId = Guid.NewGuid().ToString();
            jsonObj.action = "add";
            jsonObj.TemplateId = templateId;
            jsonObj.RoomTemplateName = roomTemplateName;
            jsonObj.RoomTemplateCost = roomTemplateCost;
            jsonObj.RoomTemplateDescription = roomTemplateDescription;
            ws.Send(jsonObj.ToString());

            wsRequests.Add(jsonObj.requestId.ToString());
        }

        public void RequestUpdateTemplate(string templateId, string roomTemplateName, float roomTemplateCost, string roomTemplateDescription)
        {
            if (!connectionEstablished)
                return;

            dynamic jsonObj = new JObject();
            jsonObj.command = "template";
            jsonObj.requestId = Guid.NewGuid().ToString();
            jsonObj.action = "update";
            jsonObj.TemplateId = templateId;
            jsonObj.RoomTemplateName = roomTemplateName;
            jsonObj.RoomTemplateCost = roomTemplateCost;
            jsonObj.RoomTemplateDescription = roomTemplateDescription;
            ws.Send(jsonObj.ToString());

            wsRequests.Add(jsonObj.requestId.ToString());
        }


        public void RequestDeleteTemplate(string templateId)
        {
            if (!connectionEstablished)
                return;

            dynamic jsonObj = new JObject();
            jsonObj.command = "template";
            jsonObj.requestId = Guid.NewGuid().ToString();
            jsonObj.action = "delete";
            jsonObj.TemplateId = templateId;
            ws.Send(jsonObj.ToString());

            wsRequests.Add(jsonObj.requestId.ToString());
        }

    }
}

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
        public delegate void hotelAddPacketReceiveHandler(object sender, GenericResponseEventArgs e);
        public event hotelAddPacketReceiveHandler onHotelAddPacketReceiveHandler;

        public delegate void permissionLevelAddPacketReceiveHandler(object sender, GenericResponseEventArgs e);
        public event permissionLevelAddPacketReceiveHandler onPermissionLevelAddPacketReceiveHandler;

        public class HotelGetPacketEventArgs : EventArgs
        {
            private readonly List<Hotel> hotels;

            public List<Hotel> Hotels { get { return hotels; } }
            public HotelGetPacketEventArgs(List<Hotel> hotels)
            {
                this.hotels = hotels;
            }
        }
        public delegate void hotelGetPacketReceiveHandler(object sender, HotelGetPacketEventArgs e);
        public event hotelGetPacketReceiveHandler onHotelGetPacketReceiveHandler;

        public class PermissionLevelsGetPacketEventArgs : EventArgs
        {
            private readonly List<PermissionLevel> permissions;

            public List<PermissionLevel> Permissions { get { return permissions; } }
            public PermissionLevelsGetPacketEventArgs(List<PermissionLevel> permissions)
            {
                this.permissions = permissions;
            }
        }
        public delegate void permissionLevelsGetPacketReceiveHandler(object sender, PermissionLevelsGetPacketEventArgs e);
        public event permissionLevelsGetPacketReceiveHandler onPermissionLevelsGetPacketReceiveHandler;

        public class LoginPacketEventArgs : EventArgs
        {
            private readonly bool authenticationOk;

            public bool AuthenticationOk { get { return authenticationOk; } }
            public LoginPacketEventArgs(bool authenticationOk)
            {
                this.authenticationOk = authenticationOk;
            }
        }
        public delegate void loginPacketReceiveHandler(object sender, LoginPacketEventArgs e);
        public event loginPacketReceiveHandler onLoginPacketReceiveHandler;

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
        public delegate void RegisterPacketReceiveHandler(object sender, RegisterPacketEventArgs e);
        public event RegisterPacketReceiveHandler onRegisterPacketReceiveHandler;

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

            ws = new WebSocket("ws://83.145.169.112:9009");
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
    }
}

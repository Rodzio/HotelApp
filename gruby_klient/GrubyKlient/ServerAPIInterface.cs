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
            jsonObj.loginData = JObject.FromObject(new { userEmail = username, userPasswordHash = (pwd) /* Hash.GetSHA512(pwd) */ });
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
                userPermissionLevel = permissionLevel
            });
            ws.Send(jsonObj.ToString());

            wsRequests.Add(jsonObj.requestId.ToString());
        }
    }
}

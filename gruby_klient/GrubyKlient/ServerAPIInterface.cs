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

        private static bool isRunning;
        private bool shouldStop;
        private WebSocket ws;
        private List<string> wsRequests;

        public void StartThreadWork()
        {
            // Make sure to never start another thread with this
            if (!isRunning)
                isRunning = true;
            else
                return;

            ws = new WebSocket("ws://echo.websocket.org");
            ws.OnMessage += ws_OnMessage;
            ws.Connect();

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

            if(jsonObj.command == "login")
            {
                dynamic loginData = JObject.Parse(jsonObj.loginData.ToString());
                string pwd = loginData.password;
                if (onLoginPacketReceiveHandler != null)
                    onLoginPacketReceiveHandler(this, new LoginPacketEventArgs(true));
            }
        }

        // Here declare functions that send packets to API server
        public void RequestLogin(string username, string pwd)
        {
            dynamic jsonObj = new JObject();
            jsonObj.command = "login";
            jsonObj.requestId = Guid.NewGuid().ToString();
            jsonObj.loginData = JObject.FromObject(new { email = username, password = Hash.GetSHA512(pwd) });
            ws.Send(jsonObj.ToString());

            wsRequests.Add(jsonObj.requestId.ToString());
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

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
            testFlag = false;
            shouldStop = false;
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

        private volatile bool testFlag;
        private static bool isRunning;
        private bool shouldStop;

        public void StartThreadWork()
        {
            // Make sure to never start another thread with this
            if (!isRunning)
                isRunning = true;
            else
                return;

            while (true)
            {
                if (shouldStop)
                    return;

                if (testFlag)
                {
                    if (onLoginPacketReceiveHandler != null)
                        onLoginPacketReceiveHandler(this, new LoginPacketEventArgs(true));

                    testFlag = false;
                }
                Thread.Sleep(100);
            }
        }

        public void StopThread()
        {
            shouldStop = true;
        }

        // Here declare functions that send packets to API server
        public void RequestLogin(string username, string pwd)
        {
            // Just casually setting up test flag for now...
            testFlag = true;
        }
    }
}

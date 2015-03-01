using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Resources;
using System.Globalization;
using System.Threading;

namespace GrubyKlient
{
    public partial class Login : Form
    {
        public Login()
        {
            CenterToScreen();
            InitializeComponent();
            LocalizeComponents();
        }

        private void LocalizeComponents()
        {
            ResourceManager locale = new ResourceManager("GrubyKlient.Strings", typeof(Login).Assembly);
            Thread.CurrentThread.CurrentUICulture = new CultureInfo("pl-PL");
            this.labelUser.Text = locale.GetString("username") + ":";
            this.labelPwd.Text = locale.GetString("password") + ":";
            this.groupBox.Text = locale.GetString("login");
            this.buttonLogin.Text = locale.GetString("signin");
            this.Text = "HotelApp - " + locale.GetString("login");
        }
    }
}

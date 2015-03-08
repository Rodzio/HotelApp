using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace GrubyKlient
{
    public partial class MainForm : Form
    {
        private Login login;

        public MainForm()
        {
            CenterToScreen();
            InitializeComponent();

            login = new Login();
            login.FormClosed += login_FormClosed;
            login.ShowDialog(this);
        }

        void login_FormClosed(object sender, FormClosedEventArgs e)
        {
            if(login.DialogResult != DialogResult.OK)
                Close();
        }
    }
}

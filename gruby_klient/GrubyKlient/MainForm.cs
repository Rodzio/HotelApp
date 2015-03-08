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
        public MainForm()
        {
            CenterToScreen();
            InitializeComponent();

            Login login = new Login();
            if(login.ShowDialog(this) != DialogResult.OK)
                Application.Exit();
        }
    }
}

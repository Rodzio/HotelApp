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
        private AddUserForm addUserForm;

        public MainForm()
        {
            CenterToScreen();
            InitializeComponent();

            ServerAPIInterface.Instance.onPermissionLevelsGetPacketReceiveHandler += API_onPermissionLevelsGetPacketReceiveHandler;
            ServerAPIInterface.Instance.onHotelGetPacketReceiveHandler += API_onHotelGetPacketReceiveHandler;

            login = new Login();
            login.FormClosed += login_FormClosed;
            login.ShowDialog(this);
        }

        void API_onHotelGetPacketReceiveHandler(object sender, ServerAPIInterface.HotelGetPacketEventArgs e)
        {
            HotelsData.Instance.Hotels = e.Hotels;
        }

        void API_onPermissionLevelsGetPacketReceiveHandler(object sender, ServerAPIInterface.PermissionLevelsGetPacketEventArgs e)
        {
            HotelsData.Instance.PermissionLevels = e.Permissions;
        }

        void login_FormClosed(object sender, FormClosedEventArgs e)
        {
            if(login.DialogResult != DialogResult.OK)
                Close();
            else
            {
                // Requesting data
                ServerAPIInterface.Instance.RequestPermissionLevels();
                ServerAPIInterface.Instance.RequestHotels();
                //ServerAPIInterface.Instance.RequestAddHotel("as", "edrf", "ertr", "erret", 3, "erf", "esdrfg");
            }
        }

        private void listView1_SelectedIndexChanged(object sender, EventArgs e)
        {

        }

        private void buttonAddUser_Click(object sender, EventArgs e)
        {
            addUserForm = new AddUserForm();
            addUserForm.ShowDialog(this);
        }
    }
}

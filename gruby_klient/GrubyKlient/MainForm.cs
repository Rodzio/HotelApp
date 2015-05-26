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
        private AddHotelForm addHotelForm;

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

                //initHotelsList();
                if (dataGridViewHotels.Columns.Count == 0)
                {
                    dataGridViewHotels.Columns.Add("hotelId", "ID");
                    dataGridViewHotels.Columns.Add("hotelName", "Name");
                    dataGridViewHotels.Columns.Add("hotelCountry", "Country");
                    dataGridViewHotels.Columns.Add("hotelCity", "City");
                    dataGridViewHotels.Columns.Add("hotelStreet", "Street");
                    dataGridViewHotels.Columns.Add("hotelRating", "Rating");
                    dataGridViewHotels.Columns.Add("hotelEmail", "E-mail");
                    dataGridViewHotels.Columns.Add("hotelPhone", "Phone number");
                }

                foreach (var hotel in HotelsData.Instance.Hotels)
                {
                    string[] row = new string[] {
                    hotel.HotelId.ToString(),
                    hotel.HotelName,
                    hotel.HotelCountry,
                    hotel.HotelCity,
                    hotel.HotelStreet,
                    hotel.HotelRating.ToString(),
                    hotel.HotelEmail,
                    hotel.HotelPhone
                };
                    dataGridViewHotels.Rows.Add(row);
                }
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

        private void tabControl1_SelectedIndexChanged(object sender, EventArgs e)
        {
            if (tabControl1.SelectedIndex == 4)
                updateHotelsList();
        }

        private void buttonAddHotel_Click(object sender, EventArgs e)
        {
            addHotelForm = new AddHotelForm();
            addHotelForm.ShowDialog(this);
        }

        //nightly; placeholder functions
        public void initHotelsList()
        {
            if (dataGridViewHotels.Columns.Count == 0)
            {
                dataGridViewHotels.Columns.Add("hotelId", "ID");
                dataGridViewHotels.Columns.Add("hotelName", "Name");
                dataGridViewHotels.Columns.Add("hotelCountry", "Country");
                dataGridViewHotels.Columns.Add("hotelCity", "City");
                dataGridViewHotels.Columns.Add("hotelStreet", "Street");
                dataGridViewHotels.Columns.Add("hotelRating", "Rating");
                dataGridViewHotels.Columns.Add("hotelEmail", "E-mail");
                dataGridViewHotels.Columns.Add("hotelPhone", "Phone number");
            }

            foreach (var hotel in HotelsData.Instance.Hotels)
            {
                string[] row = new string[] {
                    hotel.HotelId.ToString(),
                    hotel.HotelName,
                    hotel.HotelCountry,
                    hotel.HotelCity,
                    hotel.HotelStreet,
                    hotel.HotelRating.ToString(),
                    hotel.HotelEmail,
                    hotel.HotelPhone
                };
                dataGridViewHotels.Rows.Add(row);
            }
        }

        public void updateHotelsList()
        {
            // look for changes
            List<Hotel> temp = HotelsData.Instance.Hotels;
            ServerAPIInterface.Instance.RequestHotels();

            if (temp != HotelsData.Instance.Hotels)
            {
                dataGridViewHotels.Rows.Clear();

                foreach (var hotel in HotelsData.Instance.Hotels)
                {
                    string[] row = new string[] {
                        hotel.HotelId.ToString(),
                        hotel.HotelName,
                        hotel.HotelCountry,
                        hotel.HotelCity,
                        hotel.HotelStreet,
                        hotel.HotelRating.ToString(),
                        hotel.HotelEmail,
                        hotel.HotelPhone
                    };
                    dataGridViewHotels.Rows.Add(row);
                }
            }
        }
    }
}

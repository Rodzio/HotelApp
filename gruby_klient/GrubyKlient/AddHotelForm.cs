using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Globalization;
using System.Linq;
using System.Resources;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace GrubyKlient
{
    public partial class AddHotelForm : Form
    {
        private bool update;
        private int id;
        public AddHotelForm()
        {
            CenterToParent();
            InitializeComponent();
            LocalizeComponents();

            ServerAPIInterface.Instance.onHotelAddPacketReceiveHandler += API_onHotelAddPacketReceiveHandler;
            ServerAPIInterface.Instance.onHotelUpdatePacketReceiveHandler += API_onHotelUpdatePacketReceiveHandler;

            update = false;
        }

        private void API_onHotelUpdatePacketReceiveHandler(object sender, ServerAPIInterface.GenericResponseEventArgs e)
        {
            this.Invoke(() =>
            {
                this.Close();
            });
        }

        public AddHotelForm(int id, string hotelname, string country, string city, string street, int rating, string email, string phone)
        {
            CenterToParent();
            InitializeComponent();
            LocalizeComponents();

            ServerAPIInterface.Instance.onHotelAddPacketReceiveHandler += API_onHotelAddPacketReceiveHandler;
            ServerAPIInterface.Instance.onHotelUpdatePacketReceiveHandler += API_onHotelUpdatePacketReceiveHandler;

            textBoxHotelName.Text = hotelname;
            textBoxCountry.Text = country;
            textBoxCity.Text = city;
            textBoxStreet.Text = street;
            textBoxRating.Text = rating.ToString();
            textBoxHotelEmail.Text = email;
            textBoxPhone.Text = phone;
            this.id = id;

            update = true;
        }

        private void API_onHotelAddPacketReceiveHandler(object sender, ServerAPIInterface.GenericResponseEventArgs e)
        {
            this.Invoke(() =>
            {
                this.Close();
            });
        }

        private void buttonCancel_Click(object sender, EventArgs e)
        {
            this.Dispose();
        }

        private void LocalizeComponents()
        {
            ResourceManager locale = new ResourceManager("GrubyKlient.Strings", typeof(Login).Assembly);
            Thread.CurrentThread.CurrentUICulture = new CultureInfo("pl-PL");
            this.labelHotelName.Text = locale.GetString("name");
            this.labelCountry.Text = locale.GetString("country");
            this.labelCity.Text = locale.GetString("city");
            this.labelStreet.Text = locale.GetString("street");
            this.labelPhone.Text = locale.GetString("phone");
            this.buttonCancel.Text = locale.GetString("cancel");
            this.buttonSave.Text = locale.GetString("save");
            this.Text = "HotelApp - " + locale.GetString("addHotel");
        }

        private void buttonSave_Click(object sender, EventArgs e)
        {
            if (!update)
            {
                ServerAPIInterface.Instance.RequestAddHotel(
                    textBoxHotelName.Text,
                    textBoxCountry.Text,
                    textBoxCity.Text,
                    textBoxStreet.Text,
                    int.Parse(textBoxRating.Text),
                    textBoxHotelEmail.Text,
                    textBoxPhone.Text
                );
                this.buttonSave.Enabled = false;
            }
            else
            {
                ServerAPIInterface.Instance.RequestUpdateHotel(
                    this.id,
                    textBoxHotelName.Text,
                    textBoxCountry.Text,
                    textBoxCity.Text,
                    textBoxStreet.Text,
                    int.Parse(textBoxRating.Text),
                    textBoxHotelEmail.Text,
                    textBoxPhone.Text
                );
                this.buttonSave.Enabled = false;
            }
        }
    }
}

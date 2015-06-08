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
    public partial class AddRoomForm : Form
    {
        private bool update;

        public AddRoomForm()
        {
            CenterToParent();
            InitializeComponent();

            foreach (var template in HotelsData.Instance.Templates)
                this.comboBoxTemplates.Items.Add(template.TemplateId);

            foreach (var hotel in HotelsData.Instance.Hotels)
                this.comboBox2.Items.Add(hotel.HotelId);            

            ServerAPIInterface.Instance.onRoomAddPacketReceiveHandler += API_onRoomAddPacketReceiveHandler;            
        }

        public AddRoomForm(int hotelid, int roomnumber, string template)
        {
            CenterToParent();
            InitializeComponent();

            foreach (var templat in HotelsData.Instance.Templates)
                this.comboBoxTemplates.Items.Add(templat.TemplateId);

            foreach (var hotel in HotelsData.Instance.Hotels)
                this.comboBox2.Items.Add(hotel.HotelId);

            ServerAPIInterface.Instance.onRoomUpdatePacketReceiveHandler += API_onRoomUpdatePacketReceiveHandler;

            comboBox2.Text = hotelid.ToString();
            comboBoxTemplates.Text = template;
            textBox1.Text = roomnumber.ToString();

            update = true;
        }

        private void API_onRoomUpdatePacketReceiveHandler(object sender, ServerAPIInterface.GenericResponseEventArgs e)
        {
            this.Invoke(() =>
            {
                this.Close();
            });
        }

        void API_onRoomAddPacketReceiveHandler(object sender, ServerAPIInterface.GenericResponseEventArgs e)
        {
            this.Invoke(() =>
            {
                this.Close();
            });
        }

        private void buttonCancel_Click(object sender, EventArgs e)
        {
            this.Close();
        }

        private void buttonSave_Click(object sender, EventArgs e)
        {
            if (!update)
            {
                ServerAPIInterface.Instance.RequestAddRoom(
                    int.Parse(comboBox2.Text),
                    int.Parse(textBox1.Text),
                    comboBoxTemplates.Text
                );
                this.buttonSave.Enabled = false;
            }
            else
            {
                ServerAPIInterface.Instance.RequestUpdateRoom(
                    int.Parse(comboBox2.Text),
                    int.Parse(textBox1.Text),
                    comboBoxTemplates.Text
                );
                this.buttonSave.Enabled = false;
            }
        }
    }
}

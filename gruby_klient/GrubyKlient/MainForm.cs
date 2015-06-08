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
        private AddHotelForm addHotelForm, updateHotelForm;
        private AddRoomForm addRoomForm, updateRoomForm;
        private bool initUsers, initHotels, initRooms, initReservations;

        public MainForm()
        {
            this.StartPosition = FormStartPosition.CenterScreen;
            InitializeComponent();
            
            ServerAPIInterface.Instance.onPermissionLevelsGetPacketReceiveHandler += API_onPermissionLevelsGetPacketReceiveHandler;
            ServerAPIInterface.Instance.onTemplateGetPacketReceiveHandler += API_onTemplateGetPacketReceiveHandler;
                        
            ServerAPIInterface.Instance.onHotelAddPacketReceiveHandler += API_onHotelAddPacketReceiveHandler;
            ServerAPIInterface.Instance.onHotelDeletePacketReceiveHandler += API_onHotelDeletePacketReceiveHandler;
            ServerAPIInterface.Instance.onRoomGetPacketReceiveHandler += API_onRoomGetPacketReceiveHandler;
            ServerAPIInterface.Instance.onHotelGetPacketReceiveHandler += API_onHotelGetPacketReceiveHandler;
            ServerAPIInterface.Instance.onReservationGetPacketReceiveHandler += API_onReservationGetPacketReceiveHandler;

            login = new Login();
            login.FormClosed += login_FormClosed;
            login.ShowDialog(this);
            initHotels = true;
            initRooms = true;
            initReservations = true;
            
        }

        private void API_onReservationGetPacketReceiveHandler(object sender, ServerAPIInterface.ReservationGetPacketEventArgs e)
        {
            this.Invoke(() =>
            {
                HotelsData.Instance.Reservations = e.Reservations;
                try
                {
                    
                    initReservationsList();
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex);
                }
            });
        }

        private void API_onTemplateGetPacketReceiveHandler(object sender, ServerAPIInterface.TemplateGetPacketEventArgs e)
        {
            this.Invoke(() =>
            {
                HotelsData.Instance.Templates = e.Templates;
            });
        }

        private void API_onRoomGetPacketReceiveHandler(object sender, ServerAPIInterface.RoomGetPacketEventArgs e)
        {
            
            this.Invoke(() =>
            {
                HotelsData.Instance.Rooms = e.Rooms;
                try
                {

                    initRoomsList();
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex);
                }
            });
        }

        private void API_onHotelDeletePacketReceiveHandler(object sender, ServerAPIInterface.GenericResponseEventArgs e)
        {
            this.Invoke(() =>
            {
                MessageBox.Show("Hotel deleted successfully!");
            });
        }

        private void API_onHotelAddPacketReceiveHandler(object sender, ServerAPIInterface.GenericResponseEventArgs e)
        {
            this.Invoke(() =>
            {
                updateHotelsList();
            });
        }

        void API_onHotelGetPacketReceiveHandler(object sender, ServerAPIInterface.HotelGetPacketEventArgs e)
        {
            
            this.Invoke(() =>
            {
                HotelsData.Instance.Hotels = e.Hotels;
                initHotelsList();
            });
        }

        void API_onPermissionLevelsGetPacketReceiveHandler(object sender, ServerAPIInterface.PermissionLevelsGetPacketEventArgs e)
        {
            this.Invoke(() =>
            {
                HotelsData.Instance.PermissionLevels = e.Permissions;
            });
        }

        void login_FormClosed(object sender, FormClosedEventArgs e)
        {
            if(login.DialogResult != DialogResult.OK)
                Close();
            else
            {
                // Requesting data
                ServerAPIInterface.Instance.RequestPermissionLevels();
                ServerAPIInterface.Instance.RequestTemplates();
                ServerAPIInterface.Instance.RequestHotels();
                ServerAPIInterface.Instance.RequestRooms();
                ServerAPIInterface.Instance.RequestReservations();
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

            if (initHotels)
            {
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

                initHotels = false;
            }
        }

        public void updateHotelsList()
        {
            Console.WriteLine("update list");
            ServerAPIInterface.Instance.RequestHotels();

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

        public void deleteHotel()
        {
            DialogResult result = MessageBox.Show(
                "Do you really want to delete " + dataGridViewHotels.SelectedRows[0].Cells[1].Value.ToString() + " ?",
                "Delete hotel?",
                MessageBoxButtons.YesNo
            );

            if (result == DialogResult.Yes)
                ServerAPIInterface.Instance.RequestDeleteHotel(
                    int.Parse((string)dataGridViewHotels.SelectedRows[0].Cells[0].Value)
                );

        }

        private void buttonDeleteHotel_Click(object sender, EventArgs e)
        {
            deleteHotel();
        }

        // VERY nightly, such sad function
        private void buttonEditHotel_Click(object sender, EventArgs e)
        {
            updateHotelForm = new AddHotelForm(
                int.Parse((string)dataGridViewHotels.SelectedRows[0].Cells[0].Value),
                dataGridViewHotels.SelectedRows[0].Cells[1].Value.ToString(),
                dataGridViewHotels.SelectedRows[0].Cells[2].Value.ToString(),
                dataGridViewHotels.SelectedRows[0].Cells[3].Value.ToString(),
                dataGridViewHotels.SelectedRows[0].Cells[4].Value.ToString(),
                int.Parse(dataGridViewHotels.SelectedRows[0].Cells[5].Value.ToString()),
                dataGridViewHotels.SelectedRows[0].Cells[6].Value.ToString(),
                dataGridViewHotels.SelectedRows[0].Cells[7].Value.ToString());
            updateHotelForm.ShowDialog(this);
        }

        

        private void buttonRefresh_Click(object sender, EventArgs e)
        {
            try
            {
                updateHotelsList();
                updateRoomsList();
                updateReservationsList();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
            }
        }

        private void buttonAddRoom_Click(object sender, EventArgs e)
        {
            addRoomForm = new AddRoomForm();
            addRoomForm.ShowDialog(this);
        }

        private void buttonEditRoom_Click(object sender, EventArgs e)
        {
            updateRoomForm = new AddRoomForm(
                int.Parse((string)dataGridViewRooms.SelectedRows[0].Cells[0].Value),
                int.Parse((string)dataGridViewRooms.SelectedRows[0].Cells[1].Value),
                dataGridViewRooms.SelectedRows[0].Cells[2].Value.ToString()
            );
            updateRoomForm.ShowDialog(this);
        }

        public void initRoomsList()
        {
            if (dataGridViewRooms.Columns.Count == 0)
            {
                dataGridViewRooms.Columns.Add("roomHotel", "Hotel");
                dataGridViewRooms.Columns.Add("roomNumber", "Number");
                dataGridViewRooms.Columns.Add("roomType", "Type");
            }

            if (initRooms)
            {
                foreach (var room in HotelsData.Instance.Rooms)
                {
                    string[] row = new string[] {
                    room.HotelId.ToString(),
                    room.RoomNumber.ToString(),
                    room.TemplateId
                };
                    dataGridViewRooms.Rows.Add(row);
                }

                initRooms = false;
            }
        }

        public void updateRoomsList()
        {
            ServerAPIInterface.Instance.RequestRooms();

            dataGridViewRooms.Rows.Clear();

            foreach (var room in HotelsData.Instance.Rooms)
            {
                string[] row = new string[] {
                    room.HotelId.ToString(),
                    room.RoomNumber.ToString(),
                    room.TemplateId
                };
                dataGridViewRooms.Rows.Add(row);
            }
        }

        public void initReservationsList()
        {
            if (dataGridViewReservations.Columns.Count == 0)
            {
                dataGridViewReservations.Columns.Add("reservationId", "Reservation ID");
                dataGridViewReservations.Columns.Add("hotelId", "Hotel ID");
                dataGridViewReservations.Columns.Add("roomNumber", "Room number");
                dataGridViewReservations.Columns.Add("userId", "User ID");
                dataGridViewReservations.Columns.Add("reservationCheckIn", "Check in");
                dataGridViewReservations.Columns.Add("reservationCheckOut", "Check out");
            }

            if (initReservations)
            {
                foreach (var reservation in HotelsData.Instance.Reservations)
                {
                    string[] row = new string[] {
                    reservation.ReservationId.ToString(),
                    reservation.HotelId.ToString(),
                    reservation.RoomNumber.ToString(),
                    reservation.UserId.ToString(),
                    reservation.ReservationCheckIn.ToString(),
                    reservation.ReservationCheckOut.ToString(),
                };
                    dataGridViewReservations.Rows.Add(row);
                }

                initReservations = false;
            }
        }

        public void updateReservationsList() {
            ServerAPIInterface.Instance.RequestReservations();
            dataGridViewReservations.Rows.Clear();

            foreach (var reservation in HotelsData.Instance.Reservations)
            {
                string[] row = new string[] {
                reservation.ReservationId.ToString(),
                reservation.HotelId.ToString(),
                reservation.RoomNumber.ToString(),
                reservation.UserId.ToString(),
                reservation.ReservationCheckIn.ToString(),
                reservation.ReservationCheckOut.ToString(),
            };
                dataGridViewReservations.Rows.Add(row);
            }
        }
    }
}

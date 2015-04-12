﻿using System;
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
    public partial class AddUserForm : Form
    {
        public AddUserForm()
        {
            CenterToParent();
            InitializeComponent();
            LocalizeComponents();
        }

        private void buttonCancel_Click(object sender, EventArgs e)
        {
            this.Dispose();
        }

        private void LocalizeComponents()
        {
            ResourceManager locale = new ResourceManager("GrubyKlient.Strings", typeof(Login).Assembly);
            Thread.CurrentThread.CurrentUICulture = new CultureInfo("pl-PL");
            this.labelUserName.Text = locale.GetString("username");
            this.labelFirstName.Text = locale.GetString("firstName");
            this.labelSecondName.Text = locale.GetString("secondName");
            this.labelLastName.Text = locale.GetString("lastName");
            this.labelPassword.Text = locale.GetString("password");
            this.labelPasswordVerify.Text = locale.GetString("passwordVerify");
            this.labelPermissionsLevel.Text = locale.GetString("permissionsLevel");
            this.buttonCancel.Text = locale.GetString("cancel");
            this.buttonSave.Text = locale.GetString("save");
            this.Text = "HotelApp - " + locale.GetString("addUser");
        }

        private void buttonSave_Click(object sender, EventArgs e)
        {
            ServerAPIInterface.Instance.RequestRegisterUser(
                textBoxUserName.Text,
                textBoxFirstName.Text,
                textBoxSecondName.Text,
                textBoxLastName.Text,
                textBoxEmail.Text,
                textBoxPassword.Text,
                comboBoxPermissionsLevel.Text
            );
            this.buttonSave.Enabled = false;
        }
    }
}

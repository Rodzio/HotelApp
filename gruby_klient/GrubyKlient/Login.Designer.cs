namespace GrubyKlient
{
    partial class Login
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.groupBox = new System.Windows.Forms.GroupBox();
            this.textBoxPwd = new System.Windows.Forms.TextBox();
            this.textBoxUser = new System.Windows.Forms.TextBox();
            this.labelPwd = new System.Windows.Forms.Label();
            this.labelUser = new System.Windows.Forms.Label();
            this.buttonLogin = new System.Windows.Forms.Button();
            this.groupBox.SuspendLayout();
            this.SuspendLayout();
            // 
            // groupBox
            // 
            this.groupBox.Controls.Add(this.textBoxPwd);
            this.groupBox.Controls.Add(this.textBoxUser);
            this.groupBox.Controls.Add(this.labelPwd);
            this.groupBox.Controls.Add(this.labelUser);
            this.groupBox.Controls.Add(this.buttonLogin);
            this.groupBox.Location = new System.Drawing.Point(13, 13);
            this.groupBox.Name = "groupBox";
            this.groupBox.Size = new System.Drawing.Size(365, 124);
            this.groupBox.TabIndex = 0;
            this.groupBox.TabStop = false;
            this.groupBox.Text = "Login";
            // 
            // textBoxPwd
            // 
            this.textBoxPwd.Location = new System.Drawing.Point(151, 50);
            this.textBoxPwd.Name = "textBoxPwd";
            this.textBoxPwd.PasswordChar = '*';
            this.textBoxPwd.Size = new System.Drawing.Size(133, 20);
            this.textBoxPwd.TabIndex = 9;
            // 
            // textBoxUser
            // 
            this.textBoxUser.Location = new System.Drawing.Point(151, 20);
            this.textBoxUser.Name = "textBoxUser";
            this.textBoxUser.Size = new System.Drawing.Size(133, 20);
            this.textBoxUser.TabIndex = 8;
            // 
            // labelPwd
            // 
            this.labelPwd.AutoSize = true;
            this.labelPwd.Location = new System.Drawing.Point(44, 53);
            this.labelPwd.Name = "labelPwd";
            this.labelPwd.Size = new System.Drawing.Size(56, 13);
            this.labelPwd.TabIndex = 7;
            this.labelPwd.Text = "Password:";
            // 
            // labelUser
            // 
            this.labelUser.AutoSize = true;
            this.labelUser.Location = new System.Drawing.Point(44, 23);
            this.labelUser.Name = "labelUser";
            this.labelUser.Size = new System.Drawing.Size(61, 13);
            this.labelUser.TabIndex = 6;
            this.labelUser.Text = "User name:";
            // 
            // buttonLogin
            // 
            this.buttonLogin.Anchor = System.Windows.Forms.AnchorStyles.None;
            this.buttonLogin.Location = new System.Drawing.Point(151, 89);
            this.buttonLogin.Name = "buttonLogin";
            this.buttonLogin.Size = new System.Drawing.Size(75, 23);
            this.buttonLogin.TabIndex = 5;
            this.buttonLogin.Text = "Sign in";
            this.buttonLogin.UseVisualStyleBackColor = true;
            // 
            // Login
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(390, 149);
            this.Controls.Add(this.groupBox);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedSingle;
            this.MaximizeBox = false;
            this.MinimizeBox = false;
            this.Name = "Login";
            this.Text = "HotelApp - Login";
            this.groupBox.ResumeLayout(false);
            this.groupBox.PerformLayout();
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.GroupBox groupBox;
        private System.Windows.Forms.TextBox textBoxUser;
        private System.Windows.Forms.Label labelPwd;
        private System.Windows.Forms.Label labelUser;
        private System.Windows.Forms.Button buttonLogin;
        private System.Windows.Forms.TextBox textBoxPwd;

    }
}


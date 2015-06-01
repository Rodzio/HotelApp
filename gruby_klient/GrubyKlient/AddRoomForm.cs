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
        public AddRoomForm()
        {
            CenterToParent();
            InitializeComponent();

            foreach (var template in HotelsData.Instance.Templates)
                this.comboBoxTemplates.Items.Add(template.RoomTemplateName);

            this.comboBoxTemplates.SelectedIndex = 0;
        }
    }
}

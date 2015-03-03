using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Threading;

namespace GrubyKlient
{
    static class Program
    {
        [STAThread]
        static void Main()
        {
            Thread workerThread = new Thread(ServerAPIInterface.Instance.StartThreadWork);
            workerThread.Start();

            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);

            MainForm mainForm = new MainForm();
            mainForm.FormClosed += mainForm_FormClosed;
            Application.Run(mainForm);
        }

        static void mainForm_FormClosed(object sender, FormClosedEventArgs e)
        {
            ServerAPIInterface.Instance.StopThread();
        }
    }
}

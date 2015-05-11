using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GrubyKlient
{
    class HotelsData
    {
        // Singleton pattern
        private static readonly HotelsData instance = new HotelsData();
        public static HotelsData Instance
        {
            get 
            {
                return instance;
            }
        }

        static HotelsData() { }
        private HotelsData() {
        }

        // --

        public List<PermissionLevel> PermissionLevels { get; set; }
        public List<Hotel> Hotels { get; set; }
    }
}

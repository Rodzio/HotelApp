using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GrubyKlient
{
    public class Template
    {
        public string TemplateId { get; set; }
        public string RoomTemplateName { get; set; }
        public float RoomTemplateCost { get; set; }
        public string RoomTemplateDescription { get; set; }

        public Template(string templateId, string roomTemplateName, float roomTemplateCost, string roomTemplateDescription)
        {
            TemplateId = templateId;
            RoomTemplateCost = roomTemplateCost;
            RoomTemplateName = roomTemplateName;
            RoomTemplateDescription = roomTemplateDescription;
        }
    }
}

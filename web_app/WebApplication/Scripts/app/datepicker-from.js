var from = $('#from-date').datepicker({
    format: "yyyy/mm/dd",
    clearBtn: true,
    orientation: "bottom auto",
    multidate: false,
    calendarWeeks: true,
    startDate: "Today",
    todayHighlight: true
}).on('changeDate', function (e) {

        var newDate = new Date(e.date)
        newDate.setDate(newDate.getDate() + 1);
        to.o.startDate = newDate;
        to._o.startDate = newDate;
        to.viewDate = newDate;
        to.o.defaultViewDate = newDate;
        to.dates[0] = newDate;
        $('#to-date').datepicker('setDate', newDate);
    
    from.hide();
    $('#to-date')[0].focus();
}).data('datepicker');


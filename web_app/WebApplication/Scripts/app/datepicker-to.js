var to = $('#to-date').datepicker({
    format: "yyyy/mm/dd",
    clearBtn: true,
    orientation: "bottom auto",
    multidate: false,
    calendarWeeks: true
}).on('changeDate', function (e) {
    to.hide();
}).data('datepicker');
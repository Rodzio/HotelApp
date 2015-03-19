$(document).ready(function() {
    $('li img').on('click', function() {
        var src = $(this).attr('src');
        var img = '<img src="' + src + '" class="img-responsive"/>';
        $('#modal-window').modal();
        $('#modal-window').on('shown.bs.modal', function() {
            $('#modal-window .modal-body').html(img);
        });
        $('#modal-window').on('hidden.bs.modal', function() {
            $('#modal-window .modal-body').html('');
        });
    });
})
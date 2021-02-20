define(["jquery"], function($) {
    var $videoModal = $('#videoModal');

    $videoModal.on('show.bs.modal', function(e) {
        var $btn_origin = $(e.relatedTarget);
        $videoModal.find('iframe').attr('src', "https://www.youtube-nocookie.com/embed/6CPuoGZ1LH0?start="
            + ($btn_origin.data('start') || '0') + "&end=" + ($btn_origin.data('end') || '382'));
    });
    $videoModal.on('hide.bs.modal', function(e) {
        $videoModal.find('iframe').attr('src', "");
    });
})
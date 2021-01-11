define(["jquery", "./components/lang", "moment"], function($, lang, moment) {
    var editor;
    var $readModal = $('#articleReadModal');
    $("#addArticle").one('click', function() {
        /*var ie = '';
        if (window.document.documentMode) {
            ie = '.es5'; // detect IE browser
        } */
        //$.ajaxSetup({ cache: true });
        //require('/js/quill' + ie + '.js').done(createTextEditor);
        //$.ajaxSetup({ cache: false });
        import(/* webpackChunkName: "quill" */ 'quill').then(module => {
            const Quill = module.default;
            
            editor = new Quill('#editcontent', {
                theme: 'snow',
                modules: {
                    'toolbar': [
                        [/*{ 'font': fonts }, */{ 'size': [] }],
                        [ 'bold', 'italic', 'underline', 'strike' ],
                        [{ 'color': [] }, { 'background': [] }],
                        [{ 'script': 'super' }, { 'script': 'sub' }],
                        ['blockquote', 'code-block' ],
                        [{ 'list': 'ordered' }, { 'list': 'bullet'}, { 'indent': '-1' }, { 'indent': '+1' }],
                        [ {'direction': 'rtl'}, { 'align': [] }],
                        [ 'link', 'image', 'video' ],
                        [ 'clean' ]
                    ]
                }
            });
        });
    });
    $('#editArticle').on("submit", function() {
        $("#article_content").val(editor.root.innerHTML);
        $("#article_text").val(editor.getText());
    });
    $readModal.on('show.bs.modal', function(e) {
        $.getJSON("/blogarticle/" + $(e.relatedTarget).data("id"))
        .done(function(content) {
            $readModal.find('.modal-title').html(content.title);
            $readModal.find('.footer-content').html('<span class="oi oi-pencil"></span>&nbsp;' + lang("by") + " <b>" + content.author + "</b> "
                                                    + moment(content.created_at).calendar().toLowerCase() + ' - ' + content.email);
            $readModal.find('.modal-body').html(content.content);
        }).fail(function(content) {
            $readModal.find('.modal-body').html(content.error ? content.error : lang("Article failed to load."));
        })

    });
    $('#articleReadModal').on('hidden.bs.modal', function(e) {
        $readModal.find('.modal-body').html('<div class="form-loader"><img src="/images/loader.svg"></div>');
        $readModal.find('.modal-title').html(lang('Loading...'));
        $readModal.find('.footer-content').html("");
    });
});
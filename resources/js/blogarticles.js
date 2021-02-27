define(["jquery", "./components/lang", "moment/moment",
"./components/article-filters", "./bootstrap", "bootstrap",
"./dependencies/jquery.ajaxSubmit", "./components/moment-fr"],
function($, lang, moment, filters) {
    if (window.location.pathname.indexOf("blog") < 1) return ;
    var editor;
    var $readModal = $('#articleReadModal');
    var $editModal = $('#editArticleModal');
    var $imgModal = $("#articleImgUploadModal");

    var modal_initialized = false;
    if (locale != "en-us" && typeof moment_locale !== "undefined") {
        moment.updateLocale(locale.split("-")[0], moment_locale);
    }
    var quillcontent = "";


    filters.init({list: '.list-services'});

    $readModal.on('show.bs.modal', function(e) {
        getArticleHTML($(e.relatedTarget).parents("tr").data("id") || $(e.relatedTarget).parents("li").data("id"))
        .done(function(content) {
            $readModal.find('.modal-title').html(content.title);
            $readModal.find('.footer-content').html('<span class="oi oi-pencil"></span>&nbsp;' + lang("by") + " <b>" + content.author + "</b> "
                                                    + moment(content.created_at).calendar().toLowerCase() + ' - ' + content.email);
            $readModal.find('.modal-body').html(content.content);
        }).fail(function(content) {
            $readModal.find('.modal-body').html(content.error ? content.error : lang("Article failed to load."));
        })
    });

    $imgModal.on('show.bs.modal', function(e) {
        $("#img-preview").html('<img src="/images/blog/' + ($(e.relatedTarget).data("cover_img") ? $(e.relatedTarget).data("cover_img") : "article.jpg") + '" height="39" alt="article cover image">');
        $imgModal.find('form').attr('action', '/admin/blogarticle/' + $(e.relatedTarget).data("id") + '/image-upload');
    });

    $(".articledeletebtn").on('click', function(e) {
        if (!confirm("Supprimer définitivement l'article ?")) return ;
        $.ajax({
            url: '/admin/blogarticle/' + $(e.currentTarget).parents('tr').data('id'),
            type: 'DELETE'
        }).done(function() {
            $(e.currentTarget).parents('tr').remove();
        }).fail(console.error);
    });
    $('#articleReadModal').on('hidden.bs.modal', function(e) {
        $readModal.find('.modal-body').html('<div class="form-loader"><img src="/images/loader.svg" alt="' + lang('Loading...') + '")>/div>');
        $readModal.find('.modal-title').html(lang('Loading...'));
        $readModal.find('.footer-content').html("");
    });

    $editModal.on('show.bs.modal', function(e) {
        console.warn('clicked');
        if (!modal_initialized) {
                modal_initialized = true;
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
                            [{'direction': 'rtl'}, { 'align': [] }],
                            [ 'link', 'image', 'video' ],
                            [ 'clean' ]
                        ]
                    }
                });
                if (typeof quillcontent != 'undefined' && quillcontent.length) {
                    editor.container.firstChild.innerHTML = quillcontent;
                }
            });
        }
        var $td = $(e.relatedTarget);
        var $tr = $td.parents('tr');
        if (!$tr.length || !$tr.data("id")) return initEditModal();
        getArticleHTML($tr.data("id"))
        .done(function(content) {
            $("#article_id").val($tr.data('id'));
            $("#article_author").html($tr.children('.name').html());
            $("#article_title").val($tr.children('.title').html());
            $("#article_type").val($tr.children('.type').html());
            $("#article_tags").val($tr.children('.tags').html());
            $('#article_cover_img').data('cover_img', content.cover_img || "/images/blog/article.jpg").data('id', content.id);

            if (typeof editor != 'undefined') {
                editor.container.firstChild.innerHTML = content.content;
                quillcontent = "";
            } else {
                quillcontent = content;
            }
        }).fail(function(content) {
            $editModal.find('.modal-body').html(content.error ? content.error : lang("Article failed to load."));
        });
    });

    function initEditModal() {
        $("#article_id, #article_title, #article_type, #article_tags").val("");
        $("#article_author").html($('#navbarDropdown').text().trim());
        if (typeof editor != 'undefined') {
            editor.container.firstChild.innerHTML = "";
            quillcontent = "";
        } else {
            quillcontent = "";
        }
    }

    $(".last-created-article, .created_at, .updated_at").each(function(i, e) {
        e.innerHTML = moment(e.innerHTML).calendar();
    })

    function getArticleHTML(id) {
        return $.getJSON("/blogarticle/" + id)
    }

    $("#editArticle").ajaxSubmit({
        before: function(e) {
            $("#article_content").val(editor.root.innerHTML);
            $("#article_text").val(editor.getText());
        },
        url: function() {
            var id = $("#article_id").val();
            return "/admin/blogarticle" + (id.length ? "/" + id : "");
        },
        success: function (e, a, x) {
            $('#addModule input, #addModule textarea').val('');
            $('#selectLinkModule').append(`<option value="${e.id}">${e.name}</option>`);
            $("#unlinkedLogTable").find('tr[data-id="' + e.telit_id + '"]').remove();
            var $tr = $('tr[data-id="' + e.id + '"');
            if ($tr.length) {
                $tr.find('.title').html(e.title);
                $tr.find('.type').html(e.type);
                $tr.find('.text').html(e.text);
                $tr.find('.updated_at').html(moment(e.updated_at).calendar());
            } else {
                $("#adminTable").append(`
                <tr data-id="${e.id}">
                    <td class="type">${e.type}</td>
                    <td class="title">${e.title}</td>
                    <td class="text">${e.text.substring(0, 32)}</td>
                    <td class="likes">${e.likes || 0}</td>
                    <td class="created_at">${moment(e.created_at).calendar()}</td>
                    <td class="updated_at">${moment(e.updated_at).calendar()}</td>
                    <td class="name">${$('#navbarDropdown').text().trim()}</td>
                    <td>
                        <div class="btn-group btn-vertical">
                            <button type="button" title="Modifier" name="modify" class="btn btn-primary articlemodifybtn" data-toggle="modal" data-target="#editArticleModal"><span class="oi oi-pencil"></span></button>
                            <button type="button" title="Read" name="read" class="btn btn-primary articlereadbtn" data-toggle="modal" data-target="#articleReadModal"><span class="oi oi-eye"></span></button>
                            <button type="button" title='@lang("Delete")' name="delete" class="btn btn-danger articledeletebtn"><span class="oi oi-x"></span></button>
                        </div>
                    </td>
                </tr>`);
            }
            $editModal.modal('hide');
        }
    });
});
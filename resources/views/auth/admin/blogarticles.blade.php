@extends('layouts.app')

@section('content')
<a href="{{ route('welcome') }}" class="btn btn-secondary" style="margin-left: 1rem; margin-top: 1rem">
    <span class="oi oi-arrow-left"></span> @lang("Back to general analysis")
</a>
<a href="{{ route('su_admin') }}" class="btn btn-secondary" style="margin-left: 1rem; margin-top: 1rem">
    <span class="oi oi-arrow-circle-left"></span> @lang("Back to admin")
</a>
<br>
<br>
<div class="container">
        <div class="card">
            <div class="card-header row align-items-end">
                <div class="col text-left">@lang("What's new ?")</div>
                <div class="col text-right">
                    <button type="button" class="btn btn-light" title='@lang("Add")' id="addArticle" name="addArticle" data-toggle="modal" data-target="#editArticleModal">
                        <span class="oi oi-plus"></span>&nbsp;@lang("Add")
                    </button>
                </div>
            </div>
            <div class="card-body">
                <table id="adminTable" class="table stripe">
                    <thead>
                        <tr>
                            <th scope="col">@lang("Type")</th>
                            <th scope="col">@lang("Title")</th>
                            <th scope="col">@lang("Desc")</th>
                            <th scope="col">@lang("Likes")</th>
                            <th scope="col">@lang("Date")</th>
                            <th scope="col">@lang("Date modified")</th>
                            <th scope="col">@lang("Written by")</th>
                            <th scope="col">@lang("Actions")</th>
                        </tr>
                    </thead>
                    <tbody> 
                    @foreach ($blogarticles as $article)
                        <tr data-id="{{$article->id}}">
                            <td class="type">@lang($article->type)</td>
                            <td class="title">{{$article->title}}</td>
                            <td class="text">{{$article->text}}</td>
                            <td class="likes">{{$article->likes}}</td>
                            <td class="created_at">{{$article->created_at}}</td>
                            <td class="updated_at">{{$article->updated_at}}</td>
                            <td class="name">{{$article->name}}</td>
                            <td>
                                <div class="btn-group btn-vertical">
                                    <button type="button" title='@lang("Read")' name="read" class="btn btn-primary articlereadbtn" data-toggle="modal" data-target="#articleReadModal"><span class="oi oi-eye"></span></button>
                                    <button type="button" title='@lang("Modify")' name="modify" class="btn btn-primary articlemodifybtn" data-toggle="modal" data-target="#editArticleModal"><span class="oi oi-pencil"></span></button>
                                    <button type="button" title='@lang("Delete")' name="delete" class="btn btn-danger articledeletebtn"><span class="oi oi-x"></span></button>
                                </div>
                            </td>
                        </tr>
                    @endforeach
                    </tbody>
                </table>
                <small class="form-text text-muted">@lang("Clicking on a name in the table allows you to see the company's logs. Clicking on a logo or a color allows you to modify its values.")</small>
            </div>
        </div>
    </div>
</div>


<!-- Modal edit article -->
<div class="modal fade" id="editArticleModal" tabindex="-1" role="dialog" aria-labelledby="articleModalEditLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-scrollable modal-lg" role="document">
        <div class="modal-content">
            <form id="editArticle" action="{{ route('postblogarticle') }}" method="post">
                <div class="modal-header">
                    <h5 class="modal-title" id="articleModalEditLabel">@lang("Modify an article")</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    @csrf
                    <button class="btn btn-primary float-right" data-toggle="modal" data-target="#articleImgUploadModal">@lang("Change cover image")</button>
                    <div class="form-group">
                        <label for="author">@lang("Author")&nbsp;&nbsp; <b id="article_author">{{$self->name}}</b></label>
                    </div>
                    <div class="form-group">
                        <label for="article_type">@lang("Type")</label>
                        <select class="form-control" name="article_type" id="article_type">
                            <option value="ARTICLE">@lang("ARTICLE")</option>
                            <option value="BUGFIX">@lang("BUGFIX")</option>
                            <option value="MAJOR_UPDATE">@lang("MAJOR_UPDATE")</option>
                            <option value="MINOR_UPDATE">@lang("MINOR_UPDATE")</option>
                            <option value="TUTORIAL">@lang("TUTORIAL")</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="article_tags">@lang("Tags")</label>
                        <input type="text" class="form-control" id="article_tags" name="article_tags" maxlength="128" aria-describedby="article_tags" placeholder="@lang('Tags')">
                    </div>
                    <div class="form-group">
                        <label for="article_title">@lang("Title")</label>
                        <input type="text" class="form-control" id="article_title" name="article_title" maxlength="128" aria-describedby="article_title" placeholder="@lang('Title')">
                    </div>
                    <div class="form-group">
                        <label for="editcontent">@lang("Content")</label>
                        <div class="form-control" name="editcontent" id="editcontent" aria-describedby="editcontent" placeholder="@lang('Content')">
                        </div>
                        <input type="hidden" id="article_content" name="article_content" />
                        <input type="hidden" id="article_text" name="article_text" />
                        <input type="hidden" id="article_id" name="article_id" />
                    </div>
                    <div class="form-loader" hidden>
                        <img src="/images/loader.svg">
                    </div>
                    <div class="form-message"></div>
                </div>
                <div class="modal-footer">
                    <button type="submit" class="btn btn-primary"><span class="oi oi-pencil"></span>&nbsp;@lang("Save article")</button>    
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">@lang("Close")</button>
                </div>
            </form>
        </div>
    </div>
</div>


<!-- Modal read article -->
<div class="modal fade" id="articleReadModal" tabindex="-1" role="dialog" aria-labelledby="articleReadModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-scrollable modal-xl" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="articleReadModalLabel">@lang("Loading...")</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="form-loader">
                    <img src="/images/loader.svg">
                </div>
            </div>
            <div class="modal-footer">
                <span class="footer-content"></span>
                <button type="button" class="btn btn-secondary" data-dismiss="modal">@lang("Close")</button>
            </div>
        </div>
    </div>
</div>


<!-- Modal upload image -->
<div class="modal fade" id="articleImgUploadModal" tabindex="-1" role="dialog" aria-labelledby="articleImgUploadModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-scrollable modal-xl" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="articleImgUploadModalLabel">@lang("Loading...")</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <h3>@lang("Actual logo")</h3>

                <img src="images/companylogos/" height="39" alt="article cover image">
                <br>
                <form action="{{  $su_applied ? route('image.upload.post', ['company' => $_company->id]) : route('image.upload.post') }}" method="POST" enctype="multipart/form-data">
                    @csrf
                    <div class="input-group">
                        <div class="custom-file">
                            <input type="file" class="custom-file-input" id="compnay-logo-input" aria-describedby="inputGroupFile">
                            <label class="custom-file-label" for="compnay-logo-input">@lang("Choose file")</label>
                        </div>
                        <div class="input-group-append">
                            <button class="btn btn-success" type="button" id="inputGroupFile">@lang("Change cover image")</button>
                        </div>
                    </div>
                </form>
                <div class="form-loader">
                    <img src="/images/loader.svg">
                </div>
            </div>
            <div class="modal-footer">
                <span class="footer-content"></span>
                <button type="button" class="btn btn-secondary" data-dismiss="modal">@lang("Close")</button>
            </div>
        </div>
    </div>
</div>


@endsection
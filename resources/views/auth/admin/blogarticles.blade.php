@extends('layouts.app')

@section('content')
<a href="/consultation" class="btn btn-secondary" style="margin-left: 1rem; margin-top: 1rem">
    <span class="oi oi-arrow-left"></span> @lang("Back to general analysis")
</a>
<a href="/admin" class="btn btn-secondary" style="margin-left: 1rem; margin-top: 1rem">
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
                            <th scope="col">@lang("Date created")</th>
                            <th scope="col">@lang("Date modified")</th>
                            <th scope="col">@lang("Written by")</th>
                            <th scope="col">@lang("Actions")</th>
                        </tr>
                    </thead>
                    <tbody>
                    @foreach ($blogarticles as $article)
                        @if($self->name && $self->name == $article->name)
                        <tr class="highlight">
                        @else
                        <tr data-id="{{$article->id}}">
                        @endif
                            <td>{{$article->type}}</td>
                            <td>{{$article->title}}</td>
                            <td>{{$article->text}}</td>
                            <td>{{$article->likes}}</td>
                            <td>{{$article->created_at}}</td>
                            <td>{{$article->updated_at}}</td>
                            <td>{{$article->name}}</td>
                            <td>
                                <button type="button" data-id="{{$article->id}}" title='@lang("Modify")' name="modify" class="btn btn-primary articlemodifybtn" data-toggle="modal" data-target="#company-modules-modal"><span class="oi oi-box"></span></button>
                                <button type="button" data-id="{{$article->id}}" title='@lang("Read")' name="read" class="btn btn-primary articlereadbtn" data-toggle="modal" data-target="#articleReadModal"><span class="oi oi-eye"></span></button>
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
            <div class="modal-header">
                <h5 class="modal-title" id="articleModalEditLabel">@lang("Modify an article")</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <form id="editArticle" action="{{ route('blogarticle') }}" method="post">
                    @csrf
                    <div class="form-group">
                        <label for="author">@lang("Author")&nbsp;&nbsp; <b>{{$self->name}}</b></label>
                    </div>
                    <div class="form-group">
                        <label for="article_type">@lang("Type")</label>
                        <select class="form-control" name="article_type" id="article_type">
                            <option value="ARTICLE">@lang("ARTICLE")</option>
                            <option value="BUGFIX">@lang("BUGFIX")</option>
                            <option value="MAJOR_UPADTE">@lang("MAJOR_UPADTE")</option>
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
                    </div>
                    <button type="submit" class="btn btn-primary"><span class="oi oi-pencil"></span>&nbsp;@lang("Save article")</button>
                    <div class="form-loader" hidden>
                        <img src="/images/loader.svg">
                    </div>
                    <div class="form-message"></div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">@lang("Close")</button>
            </div>
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


@endsection
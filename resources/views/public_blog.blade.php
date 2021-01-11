@extends('layouts.public')

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
                    <tr data-id="{{$article->id}}">
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
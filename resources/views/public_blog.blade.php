@extends('layouts.public')

@section('content')
<div>
<a href="{{ route('welcome') }}" class="btn btn-secondary">
    <span class="oi oi-arrow-left"></span> @lang("Back to general analysis")
</a>
@if (!empty($self) && $self->su_admin === 1)
<a href="{{ route('blogarticles.admin') }}" class="btn btn-secondary">
    <span class="oi oi-star"></span> @lang("Articles editor")
</a>
@endif
<br/>
<br/>
</div>
<div class="container">
    <div class="row">
        <div class="col-12">
            <p class="chapo">@lang("Find PASDT content here. Blog articles, communication, corrections, new features, tutorials.")</p>
            <form class="filters-buttons">
                <input type="checkbox" name="filter" id="tous-btn" checked="">
                <label for="tous-btn" id="filt"><span>Tous</span></label>
                
                <input type="checkbox" name="f-ARTICLE" data-group="ARTICLE" id="f-ARTICLE">
                <label for="f-ARTICLE"><span>Article</span></label>
                
                <input type="checkbox" name="f-BUGFIX" data-group="BUGFIX" id="f-BUGFIX">
                <label for="f-BUGFIX"><span>Bugfix</span></label>
                
                <input type="checkbox" name="f-MAJOR_UPDATE" data-group="MAJOR_UPDATE" id="f-MAJOR_UPDATE">
                <label for="f-MAJOR_UPDATE"><span>Mise à jour majeure</span></label>

                <input type="checkbox" name="f-MINOR_UPDATE" data-group="MINOR_UPDATE" id="f-MINOR_UPDATE">
                <label for="f-MINOR_UPDATE"><span>Mise à jour mineure</span></label>
                
                <input type="checkbox" name="f-TUTORIAL" data-group="TUTORIAL" id="f-TUTORIAL">
                <label for="f-TUTORIAL"><span>Tutoriel</span></label>
            </form>
            
            <ul class="row list-services">
                @foreach ($blogarticles as $article)
                <li class="col-sm-6 col-md-4" data-id="{{ $article->id }}" id="article-{{ $article->id }}" data-groups="[&quot;{{$article->type}}&quot;]">
                    <div class="card">
                        <img class="card-img-top" src="{{ asset('images/blog/' . ($article->cover_img ? $article->id : 'article') . '.jpg') }}" alt="Card image cap">
                        <div class="card-img-overlay"  data-id="{{$article->id}}" data-toggle="modal" data-target="#articleReadModal">
                            <p style="float: left; text-align: left">
                                <!--<span class="oi oi-heart"></span>&nbsp;{{ $article->likes}}
                                <br> -->
                                <span class="last-created-article">{{ $article->created_at }}</span>
                                <br>
                                @lang("by") {{ $article->name }}
                            </p>
                            <p style="float: right;"><i>
                                #{{ $article->type }}
                            @if (!empty($article->tags))
                                <br>
                                #{{ $article->tags }}
                            @endif
                            </i></p>
                        </div>
                        <div class="card-body">
                            <h5 class="card-title">{{ $article->title }}</h5>
                            <p class="card-text">{{ $article->text }}</p>
                        </div>
                    </div>
                </li>
                @endforeach
            </ul>   
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
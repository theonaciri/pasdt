@extends('layouts.app')

@section('content')
<br>
<div class="container">
    <div class="row justify-content-center">
        <div class="col-12">
            <div class="card">
                <div class="card-header container">
                    <div class="row">
                        <div class="col-md-6">@lang("Last alerts")</div>
                        <div class="col-md-6" style="text-align:right">
                            <div class="form-check form-check-inline">
                                <input class="form-check-input" type="checkbox" id="toggleMailStatus" {{ $user->receive_mails ? "checked" : "" }}>
                                <label class="form-check-label" for="toggleMailStatus">
                                    <span class="oi oi-envelope-closed"></span>&nbsp;@lang("Receive mails")
                                </label>
                            </div>

                            @if (preg_match('~MSIE|Internet Explorer~i', $_SERVER['HTTP_USER_AGENT']) || (strpos($_SERVER['HTTP_USER_AGENT'], 'Trident/7.0; rv:11.0') !== false))
                            @else
                            <div class="form-check form-check-inline">
                                <input class="form-check-input" type="checkbox" id="toggleNotifStatus">
                                <label class="form-check-label" for="toggleNotifStatus">
                                    <span class="oi oi-bell"></span>&nbsp;@lang("Activate notifications (keep this tab open)")
                                </label>
                            </div>
                            @endif
                        </div>
                        <div class="col-12 alert alert-danger d-none" id="notif-error" role="alert">
                            @lang("You must first autorise browser notifications.")
                        </div>
                        <div class="col-12 alert alert-danger d-none" id="mail-error" role="alert">
                            @lang("Your account is badly configured, contact the administrator.")
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <table id="notifTable" class="adminTable">
                        <thead>
                            <tr>
                                <th>@lang("Module")</th>
                                <th>@lang("Type")</th>
                                <th>@lang("Value")</th>
                                <th>@lang("Commentary")</th>
                                <th>@lang("Occurences")</th>
                                <th>@lang("1<sup>st</sup> occurence")</th>
                                <th>@lang("Duration")</th>
                                <th>@lang("State")</th>
                                <th>@lang("Actions")</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach ($notifs as $notif)
                            @if ($notif->resolved)
                                <tr class="success" data-id="{{$notif->id}}" data-module_id="{{$notif->module_id}}">
                            @elseif (strpos($notif->type, 'CRIT') > -1 || strpos($notif->type, 'NO_LOG') > -1)
                                <tr class="highlight" data-id="{{$notif->id}}" data-module_id="{{$notif->module_id}}">
                            @else
                                <tr data-id="{{$notif->id}}" data-module_id="{{$notif->module_id}}">
                            @endif
                                <td class="name">{{$notif->name}}</td>
                                <td class="type">{{$notif->type}}</td>
                            @if(strpos($notif->type, 'TEMP') > -1)
                                <td class="value">
                                    <span class="moment-now d-none">
                                        <span class="oi oi-fire"></span>
                                        @lang("during") {{$notif->value}}
                                    </span>
                                    {{$notif->value}}&nbsp;°C
                                </td>
                            @elseif(strpos($notif->type, 'NO_LOG') > -1)
                                <td class="value">
                                    @lang("Last log"):
                                    <span class="nolog-value">{{$notif->value}}</span>
                                </td>
                            @else
                                <td class="value">{{$notif->value}}&nbsp;V</td>
                            @endif
                                <td class="comment">
                                    <span class="comment-text">{{$notif->comment}}</span>
                                    <span class="oi oi-pencil"></span>
                                </td>
                                <td class="occurences">{{$notif->occurences}}</td>
                                <td class="created_at" data-toggle="tooltip" data-placement="top" title='@lang("First occurence the") {{$notif->created_at}}'>{{$notif->created_at}}</td>
                                <td class="resolved_at" data-toggle="tooltip" data-placement="top" title="{{$notif->resolved_at}}">{{$notif->resolved_at}}</td>
                                <td class="resolved">
                                @if (!empty($notif->resolved) && $notif->resolved == 1)
                                    <span class="oi oi-circle-check" data-toggle="tooltip" data-placement="top" title='@lang("Solved since the") {{$notif->resolved_at}}'></span>
                                @else
                                    <span class="oi oi-warning" data-toggle="tooltip" data-placement="top" title='@lang("Ongoing since the") {{$notif->created_at}}'></span>
                                @endif
                                </td>
                                <td class="button">
                                    <div class="btn-group btn-vertical" role="group" aria-label='@lang("Notification buttons")'>
                                        <button type="button" title='@lang("Seen")' name="seen" class="btn btn-primary vubtn" data-toggle="tooltip" data-placement="top"><span class="oi oi-eye"></span></button>
                                        <button type="button" title='@lang("See the related alerts")' name="see_related_alerts" class="btn btn-secondary view-notif" data-toggle="tooltip" data-placement="top"><span class="oi oi-spreadsheet"></span></button>
                                        <button type="button" title='@lang("See the generated email")' name="see_gen_mail" class="btn btn-secondary rendermailbtn" data-toggle="tooltip" data-placement="top"><span class="oi oi-envelope-closed"></span></button>
                                    </div>
                                </td>
                            </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>
<br>
<div class="container">
    <div class="row justify-content-center">
        <div class="col-12">
            <div class="card">
                <div class="card-header">@lang("List of users of your group") {{ $company->name }} </div>
                <div class="card-body">
                    <table id="userTable" class="adminTable">
                        <thead>
                            <tr>
                                <th>@lang("ID")</th>
                                <th>@lang("Name")</th>
                                <th>@lang("Mail")</th>
                                <th>@lang("Created the")</th>
                                <th>@lang("Modified the")</th>
                                @if ($self->su_admin)
                                <th>@lang("Actions")</th>
                                @endif
                            </tr>
                        </thead>
                        <tbody>
                            @foreach ($users as $user)
                            @if($user->is_client_company)
                                <tr id="user{{$user->id}}" class="highlight">
                            @else
                                <tr id="user{{$user->id}}">
                            @endif
                                <td class="id">{{$user->id}}</td>
                                <td class="name">{{$user->name}}</td>
                                <td class="email">{{$user->email}}</td>
                                <td class="created_at">{{$user->created_at}}</td>
                                <td class="updated_at">{{$user->updated_at}}</td>
                                @if ($self->su_admin)
                                <td class="button">
                                    <div class="btn-group btn-vertical" role="group" aria-label="user buttons">
                                        <button type="button" title='@lang("Modify")' name="modify" class="btn btn-primary modifbtn modif-btn-user" data-toggle="modal" data-target="#edit-user-modal"><span class="oi oi-pencil"></span></button>
                                        <a class="deleteLink" href="{{route('deleteUser', ['user' => $user->id])}}"><button type="button" title='@lang("Revoke")' name="revoke" class="btn btn-danger revoquserbtn"><span class="oi oi-circle-x"></span></button></a>
                                    </div>
                                </td>
                                @endif
                            </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>

<br>

<div class="container">
    <div class="row justify-content-center">
        <div class="col-12">
            <div class="card">
                <div class="card-header container">
                    <div class="row">
                        <div class="col-md-6">
                            @lang("List of modules of your group")
                        </div>
                        <div class="col-md-6" style="text-align:right">
                            <button class="btn btn-primary"><span class="oi oi-map-marker"></span>&nbsp; Tout voir sur la carte</button>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <p>@lang("To add monitoring for a module, contact our team.")</p>
                    <div class="col-12 alert alert-danger d-none" id="mail-module-error" role="alert">
                        @lang("Your account is badly configured, contact the administrator.")
                    </div>
                    <table class="adminTable">
                        <thead>
                            <tr>
                                <th>@lang("ID")</th>
                                <th>@lang("Name")</th>
                                <th>@lang("Subscription")</th>
                                <th>@lang("Actions")</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach ($modules as $module)
                            @if($module->telit_status == "active")
                                <tr class="highlight">
                            @else
                                <tr>
                            @endif
                                <td class="id">{{$module->module_id}}</td>
                                <td class="name">{{$module->name}}</td>
                                <td class="email">{{$module->telit_ratePlan}}</td>
                                <td class="button flex-row">
                                    <div class="form-check form-check-inline">
                                        <input class="form-check-input module-mail-btn" type="checkbox" id="module-mail-{{$loop->index}}" style="min-width: 1rem" {{ $module->send_mails === 1 ? "checked" : "" }}>
                                        <label class="form-check-label" for="module-mail-{{$loop->index}}" style="min-width: fit-content">
                                            <span class="oi oi-envelope-closed"></span>&nbsp;@lang("Activate mails")
                                        </label>
                                    </div>

                                    <button type="button" title='@lang("Modify")' name="modify" class="btn btn-primary modifbtn" data-toggle="modal" data-target="#jsonModal">JSON</button>
                                    <!--<button type="button" title='@lang("Revoke")' name="revoke" class="btn btn-primary revoqmodulebtn" data-id="{{$module->id}}" data-company="{{$_company->id}}">X</button>-->
                                </td>
                            </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>
@if (false)
<br>
<div class="container">
    <div class="row justify-content-center">
        <div class="col-12">
            <div class="card">
                <div class="card-header">@lang("Monthly reports") </div>
                <div class="card-body">
                    <table class="adminTable">
                        <thead>
                            <tr>
                                <th>@lang("Month")</th>
                                <th>@lang("Filename")</th>
                                <th>@lang("Actions")</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="id">@lang("November")</td>
                                <td class="name">pasdt-report-nav-2020.pdf</td>
                                <td class="button">
                                    <button type="button" title='@lang("Modify")' name="modify" class="btn btn-primary modifbtn" data-toggle="modal" data-target="#jsonModal"><span class="oi oi-data-transfer-download"></span>&nbsp;@lang("Download")</button>
                                    <!--<button type="button" title='@lang("Revoke")' name="revoke" class="btn btn-primary revoqmodulebtn" data-id="{{$module->id}}" data-company="{{$_company->id}}">X</button>-->
                                </td>
                            </tr>
                            <tr>
                                <td class="id">@lang("October")</td>
                                <td class="name">pasdt-report-oct-2020.pdf</td>
                                <td class="button">
                                    <button type="button" title='@lang("Modify")' name="modify" class="btn btn-primary modifbtn" data-toggle="modal" data-target="#jsonModal"><span class="oi oi-data-transfer-download"></span>&nbsp;@lang("Download")</button>
                                    <!--<button type="button" title='@lang("Revoke")' name="revoke" class="btn btn-primary revoqmodulebtn" data-id="{{$module->id}}" data-company="{{$_company->id}}">X</button>-->
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>
@endif
<br>

<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-6">
            <div class="card">
                <div class="card-header">@lang("Your subscription") </div>
                <div class="card-body">
                    @if (true)
                        <h4>@lang("Active")</h4>
                    @else
                        <a class="" href="checkout">@lang("Add a subscription")</a>
                    @endif
                    @if (false)
                    <table class="adminTable">
                        <thead>
                            <tr>
                                <th>@lang("ID")</th>
                                <th>@lang("Name")</th>
                                <th>@lang("Status")</th>
                                <th>@lang("Subscription")</th>
                                <th>@lang("Created the")</th>
                                <th>@lang("Finished the")</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach ($subscriptions as $sub)
                                <tr>
                                <td class="id">{{$sub->id}}</td>
                                <td class="name">{{$sub->name}}</td>
                                <td class="email">{{$sub->stripe_status}}</td>
                                <td class="email">{{$sub->stripe_plan}}</td>
                                <td class="email">{{$sub->created_at}}</td>
                                <td class="email">{{$sub->ends_at}}</td>
                                <td class="button">
                                    <button type="button" title='@lang("Modify")' name="modify" class="btn btn-primary modifbtn" data-toggle="modal" data-target="#subModal_{{$sub->id}}">@lang("Invoice")</button>
                                    <button type="button" title='@lang("Revoke")' name="revoke" class="btn btn-primary revoqbtn">X</button>
                                </td>
                            </tr>
                            @endforeach
                        </tbody>
                    </table>
                    @endif
                </div>
            </div>
        </div>
        <div class="col-md-6">
            <div class="card">
                <div class="card-header">@lang("Select the language")</div>
                <div class="card-body">
                    @if ($message = Session::get('success-locale'))
                    <div class="alert alert-success alert-block">
                        <button type="button" class="close" data-dismiss="alert">×</button>
                        <strong>{{ $message }}</strong>
                    </div>
                    @endif
                    @if (count($errors) > 0)
                    <div class="alert alert-danger">
                        <strong>Whoops!</strong> @lang("There has been some problem with your image.")}}
                        <ul>
                            @foreach ($errors->all() as $error)
                            <li>{{ $error }}</li>
                            @endforeach
                        </ul>
                    </div>
                    @endif
                    <form id="localeform" action="{{  $su_applied ? route('user.change.locale', ['company' => $_company->id]) : route('user.change.locale') }}" method="POST" enctype="multipart/form-data">
                        @csrf
                        <div class="input-group">
                            <select class="custom-select" id="inputGroupSelect04" aria-label="@lang('Select the language')">
                                <optgroup label="{{ __('Fully supported languages') }}">
                                    @foreach ($official_locales as $key => $loc)
                                    <option value="{{$key}}" {{ $phplocale == $key ? "selected" : ''}}>{{$loc}}</option>
                                    @endforeach
                                </optgroup>
                                <optgroup label="{{ __('Supported languages') }}">
                                    @foreach ($locales as $key => $loc)
                                    <option value="{{$key}}" {{ $phplocale == $key ? "selected" : ''}}>{{$loc}}</option>
                                    @endforeach
                                </optgroup>
                            </select>
                            <div class="input-group-append">
                                <button type="submit" class="btn btn-success submit-lang">@lang("Change the language")</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
<br>


<div class="container" id="customize-client">
    <div class="row justify-content-center">
        <!-- IMG UPLOAD -->
        <div class="col-md-6">
            <div class="card">
                <div class="card-header">@lang("Change the logo of") {{ $company->name }} </div>
                <div class="card-body">
                    <h3>@lang("Actual logo")</h3>

                    <img src="images/companylogos/{{ $company->logo }}" height="39" alt="client logo">
                    <br>
                    <br>
                @if($self->is_client_company)
                    @if ($message = Session::get('success'))
                    <div class="alert alert-success alert-block">
                        <button type="button" class="close" data-dismiss="alert">×</button>
                        <strong>{{ $message }}</strong>
                    </div>
                    <!-- <img src="images/companylogos/{{ Session::get('image') }}"> -->
                    @endif
                    @if (count($errors) > 0)
                    <div class="alert alert-danger">
                        <strong>Whoops!</strong> @lang("There has been some problem with your image.")}}
                        <ul>
                            @foreach ($errors->all() as $error)
                            <li>{{ $error }}</li>
                            @endforeach
                        </ul>
                    </div>
                    @endif
                    <form action="{{  $su_applied ? route('image.upload.post', ['company' => $_company->id]) : route('image.upload.post') }}" method="POST" enctype="multipart/form-data">
                        @csrf
                        <div class="input-group">
                            <div class="custom-file">
                                <input type="file" class="custom-file-input" id="compnay-logo-input" aria-describedby="inputGroupFileAddon04">
                                <label class="custom-file-label" for="compnay-logo-input">@lang("Choose file")</label>
                            </div>
                            <div class="input-group-append">
                                <button class="btn btn-success" type="button" id="inputGroupFileAddon04">@lang("Update the logo")</button>
                            </div>
                        </div>
                    </form>
                @endif
                </div>
            </div>
        </div>
        <!-- COLOR UPDATE -->
        <div class="col-md-6">
            <div class="card">
                <div class="card-header">@lang("Modify the colors") @lang("of") {{ $company->name }} </div>
                <div class="card-body">
                    <h3>@lang("Current colors")</h3>
                    <br>
                    @if($self->is_client_company)
                        @if ($message = Session::get('colorsuccess'))
                        <div class="alert alert-success alert-block">
                            <button type="button" class="close" data-dismiss="alert">×</button>
                            <strong>{{ $message }}</strong>
                        </div>
                        <!-- <img src="images/companylogos/{{ Session::get('image') }}"> -->
                        @endif
                        @if (count($errors) > 0)
                        <div class="alert alert-danger">
                            <strong>Whoops!</strong> @lang("There have been some problems with your colors.")
                            <ul>
                                @foreach ($errors->all() as $error)
                                <li>{{ $error }}</li>
                                @endforeach
                            </ul>
                        </div>
                        @endif
                        <form action="{{ $su_applied ? route('company.colors.post', ['company' => $_company->id]) : route('company.colors.post') }}" method="POST" enctype="multipart/form-data">
                            @csrf
                            <div class="input-group mb-3">
                                <input type="color" name="colors" id="colors" class="form-control" value="{{ strlen($company->colors) ? $company->colors : '#f8fafc'}}" placeholder="@lang('Modify the colors')" aria-label="@lang('Modify the colors')">
                                <div class="input-group-append">
                                    <button class="btn btn-success" type="submit">@lang("Modify the colors")</button>
                            </div>
                        </form>
                    @endif
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Modal -->
<div class="modal fade" id="jsonModal" tabindex="-1" role="dialog" aria-labelledby="ModalJSONLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="ModalJSONLabel">JSON</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <pre></pre>
        </div>
    </div>
</div>

<!-- Modal -->
<div class="modal fade" id="modalRenderMail" tabindex="-1" role="dialog" aria-labelledby="modalRenderMail" aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="renderMailTitle">@lang("Email")</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body bodymail"></div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">@lang("Close")</button>
            </div>
        </div>
    </div>
</div>

<!-- Modal -->
<div class="modal fade" id="modalComment" tabindex="-1" role="dialog" aria-labelledby="modalComment" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <form action="/notif//comment" id="commentform" method="post">
                @csrf
                <div class="modal-header">
                    <h5 class="modal-title" id="commentTitle">@lang("Edit the comment")</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="container">
                    <br>
                    <div class="form-group">
                        <label for="textarea-comment">{{__("Comment on the alert")}}</label>
                        <textarea class="form-control" name="comment" id="comment" rows="2" maxlength="255"></textarea>
                        <span id="count"></span>
                    </div>
                    <div class="col-12 alert alert-danger message-error d-none" role="alert">
                        @lang("Failed to post your comment.")}} @lang("Refresh the page or contact the administrator.")}}
                    </div>
                </div>
                <div class="modal-footer">
                    <div class="form-loader" hidden>
                        <img src="/images/loader.svg" height="37" width="37">
                    </div>
                    <button type="submit" class="btn btn-primary"><span class="oi oi-pencil"></span>&nbsp;@lang("Enregistrer le commentaire")</button>
                </div>
            </form>
        </div>
    </div>
</div>

<!-- Modal -->
<div class="modal fade" id="edit-user-modal" tabindex="-1" role="dialog" aria-labelledby="ModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="ModalLabel"> @lang("Edit the account")</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <form method="POST" id="modifyUserForm" action="{{ route('users.modify', ['user'=>10]) }}">
                @csrf
                <div class="modal-body">

                    <div class="form-group row">
                        <label for="name" class="col-md-4 col-form-label text-md-right">@lang('Name')</label>

                        <div class="col-md-6">
                            <input id="name" type="text" class="form-control @error('name') is-invalid @enderror" name="name" value="{{ old('name') }}" required autocomplete="name" autofocus>

                            @error('name')
                            <span class="invalid-feedback" role="alert">
                                <strong>{{ $message }}</strong>
                            </span>
                            @enderror
                        </div>
                    </div>

                    <div class="form-group row">
                        <label for="email" class="col-md-4 col-form-label text-md-right">@lang('E-Mail Address')</label>

                        <div class="col-md-6">
                            <input id="email" type="email" class="form-control @error('email') is-invalid @enderror" name="email" value="{{ old('email') }}" required autocomplete="email">

                            @error('email')
                            <span class="invalid-feedback" role="alert">
                                <strong>{{ $message }}</strong>
                            </span>
                            @enderror
                        </div>
                    </div>

                    <div class="form-group row">
                        <label for="password" class="col-md-4 col-form-label text-md-right">@lang('New Password')</label>

                        <div class="col-md-6">
                            <input id="password" type="password" class="form-control @error('password') is-invalid @enderror" name="password" required autocomplete="new-password">

                            @error('password')
                            <span class="invalid-feedback" role="alert">
                                <strong>{{ $message }}</strong>
                            </span>
                            @enderror
                        </div>
                    </div>

                    <div class="form-group row">
                        <label for="password-confirm" class="col-md-4 col-form-label text-md-right">@lang("Confirm Password")</label>

                        <div class="col-md-6">
                            <input id="password-confirm" type="password" class="form-control" name="password_confirmation" required autocomplete="new-password">
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">@lang("Close")</button>
                    <button type="submit" class="btn btn-primary">@lang("Save")</button>
                </div>
            </form>
        </div>
    </div>
</div>
@endsection

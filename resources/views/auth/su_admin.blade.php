@extends('layouts.app')

@section('content')
<a href="/consultation" class="btn btn-secondary" style="margin-left: 1rem; margin-top: 1rem">
    <span class="oi oi-arrow-left"></span> @lang("Back to general analysis")
</a>
<br>
<br>
<div class="container">
    <div class="row justify-content-center">
        <div class="col-12">
            <div class="card">
                <div class="card-header row align-items-end">
                    <div class="col text-left">@lang("List of companies")</div>
                    <div class="col text-right">
                        <button type="button" class="btn btn-light" title='@lang("Add")' name="addCompany" data-toggle="modal" data-target="#createCompanyModal">
                            @lang("Add company") <span class="oi oi-plus"></span>
                        </button>
                    </div>
                </div>
                <div class="card-body">
                    <table id="adminTable" class="table stripe">
                        <thead>
                            <tr>
                                <th scope="col">@lang("Logo")</th>
                                <th scope="col">@lang("Color")</th>
                                <th scope="col">@lang("Name")</th>
                                <th scope="col">@lang("Users")</th>
                                <th scope="col">@lang("Modules")</th>
                                <th scope="col">@lang("Delete")</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach ($companies as $company)
                            @if($self->is_client_company && $self->company_id == $company->id)
                            <tr class="highlight" data-id="{{$company->id}}">
                                @else
                            <tr data-id="{{$company->id}}">
                                @endif
                                <td class="logo" style="cursor:pointer" data-toggle="tooltip" data-placement="top" title='@lang("Modify the logo") @lang("of") {{$company->name}}'>
                                    @if (!empty($company->logo))
                                    <img src="images/companylogos/{{$company->logo}}" height="39" alt="{{$company->name}}" />
                                    @endif
                                </td>
                                <td class="colors" style="cursor:pointer" data-toggle="tooltip" data-placement="top" title='@lang("Modify the colors") @lang("of") {{$company->name}}'>
                                    @if (!empty($company->colors))
                                    <div style="width: 39px; height: 39px; border-radius: 5px; background-color: {{$company->colors}}"></div>
                                    @endif
                                </td>
                                <td class="name" style="cursor:pointer" data-toggle="tooltip" data-placement="top" title='@lang("See the logs") @lang("of") {{$company->name}}'>
                                    {{$company->name}}
                                </td>
                                <td>
                                    <button type="button" data-id="{{$company->id}}" title='@lang("See")' name="see" class="btn btn-primary companybtn" data-toggle="modal" data-target="#companyUsersModal">
                                        <span class="oi oi-people"></span>
                                    </button>
                                </td>
                                <td>
                                    <button type="button" data-id="{{$company->id}}" title='@lang("Modify")' name="modify" class="btn btn-primary companymodulesbtn" data-toggle="modal" data-target="#company-modules-modal"><span class="oi oi-box"></span></button>
                                </td>
                                <td>
                                    <button type="button" data-id="{{$company->id}}" title='@lang("Delete")' name="delete" class="btn btn-danger companydeletebtn" data-toggle="modal" data-target="#company-delete-modal"><span class="oi oi-circle-x"></span></button>
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
</div>

<!--
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header">{{ __("Formulaire de création d'entreprise") }}</div>

                <div class="card-body">
                    <form method="POST" action="{{ route('company_create') }}">
                        @csrf
                        <div class="form-group row">
                            <label for="name" class="col-md-4 col-form-label text-md-right">{{ __("Nom de l'organisme") }}</label>

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
                            <label for="name" class="col-md-4 col-form-label text-md-right">{{ __("Nom de l'utilisateur client") }}</label>

                            <div class="col-md-6">
                                <input id="clientname" type="text" class="form-control @error('clientname') is-invalid @enderror" name="clientname" value="{{ old('clientname') }}" required autocomplete="clientname" autofocus>

                                @error('name')
                                    <span class="invalid-feedback" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                @enderror
                            </div>
                        </div>

                        <div class="form-group row">
                            <label for="email" class="col-md-4 col-form-label text-md-right">{{ __('Adresse e-mail') }}</label>

                            <div class="col-md-6">
                                <input id="email" type="email" class="form-control @error('email') is-invalid @enderror" name="email" value="{{ old('email') }}" required autocomplete="email">

                                @error('email')
                                    <span class="invalid-feedback" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                @enderror
                            </div>
                        </div>

                        <input id="admin" type="hidden" name="admin" value="{{ $self->company_id }}" required autocomplete="admin">

                        <div class="form-group row">
                            <label for="password" class="col-md-4 col-form-label text-md-right">{{ __('Mot de passe') }}</label>

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
                            <label for="password-confirm" class="col-md-4 col-form-label text-md-right">{{ __('Confirmation du mot de passe') }}</label>

                            <div class="col-md-6">
                                <input id="password-confirm" type="password" class="form-control" name="password_confirmation" required autocomplete="new-password">
                            </div>
                        </div>

                        <div class="form-group row mb-0">
                            <div class="col-md-6 offset-md-4">
                                <button type="submit" class="btn btn-primary">
                                    {{ __("Demande d'accès") }}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
-->
<!--
<br>
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-12">
            <div class="card">
                <div class="card-header">{{ __("Liste des logs reçus sans module affilié") }}</div>
                <div class="card-body">
                    <table id="unlinkedLogTable" class="table">
                        <thead>
                            <tr>
                                <th scope="col">Nom</th>
                                <th scope="col">Message</th>
                                <th scope="col">Reçu le</th>
                            </tr>
                        </thead>
                        <tbody>
                            {{-- @foreach ($unlinked_logs as $log)
                            <tr data-id="{{$log->cardId}}" style="background-color: {{$colors[intval($log->cardId) % count($colors)]}}60">
                                <td>{{$log->cardId}}</td>
                                <td>{{$log->msg}}</td>
                                <td>{{$log->created_at}}</td>
                            </tr>
                            @endforeach --}}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>
-->

<!-- Modal -->
<div class="modal fade" id="createCompanyModal" tabindex="-1" role="dialog" aria-labelledby="ModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <form id="createCompany" method="POST" action="{{ route('company.create') }}">
            @csrf
                <!-- rajouter controle admin -->
                <div class="modal-header">
                    <h5 class="modal-title">@lang("Add company")</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">

                    <div class="row ">
                        <label for="name" class="col-md-3 col-form-label text-md-right">@lang("Name")</label>

                        <div class="col-md-8">
                            <input id="name" type="text" class="form-control @error('name') is-invalid @enderror" name="name" value="{{ old('name') }}" required autocomplete=" " autofocus>

                            @error('name')
                            <span class="invalid-feedback" role="alert">
                                <strong>{{ $message }}</strong>
                            </span>
                            @enderror
                        </div>
                    </div>
                    <div class="row m-3">
                        <label for="color" class="col-md-3 col-form-label text-md-right">@lang("Color")</label>
                        <input type="color" name="colors" id="colors" class="col-md-8 form-control" value="#f8fafc">
                    </div>

                    <div class="row">
                        <label for="image" class="col-md-3 col-form-label text-md-right">@lang("Logo")</label>
                        <input type="file" name="image" class="col">
                    </div>
                </div>
                <div class="modal-footer">
                    <input class="btn btn-primary" type="submit" value='@lang("Add company")'>
                    <button type="button" class="btn btn-secondary" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">@lang("Cancel")</span>
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>

<!-- Modal -->
<div class="modal fade" id="companyUsersModal" tabindex="-1" role="dialog" aria-labelledby="ModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">@lang("User list") @lang("of") <span></span></h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <table id="usersTable" class="table">
                <thead>
                    <tr>
                        <th scope="col">@lang("Name")</th>
                        <th scope="col">@lang("Email")</th>
                    </tr>
                </thead>
                <tbody>

                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="3">
                            <a href="{{ url('/register') }}" id="btnAddUser" class="btn btn-primary btn-block">@lang("Add user")</a>
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>
    </div>
</div>

<!-- Modal -->
<div class="modal fade" id="companyDeleteModal" tabindex="-1" role="dialog" aria-labelledby="ModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">@lang("Deletion")</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <table id="deleteTable" class="table">
                <thead>
                    <tr>
                        <th scope="col">@lang("Name")</th>
                        <th scope="col">@lang("Email")</th>
                    </tr>
                </thead>
                <tbody>

                </tbody>
            </table>
        </div>
    </div>
</div>

<!-- Modal -->
<div class="modal fade" id="companyModulesModal" tabindex="-1" role="dialog" aria-labelledby="ModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document" style="max-width: 1450px;">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">@lang("Module list") @lang("of") <span></span></h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="container" style="max-width: 1440px">
                <div class="row justify-content-md-center">
                    <div class="container col-lg-9 modal-divided">
                        <br>
                        <h4>@lang("Active modules")</h4>
                        <hr>
                        <table id="moduleTable" style="width: 100%" class="table">
                            <thead>
                                <tr>
                                    <th scope="col">@lang("Name")</th>
                                    <th scope="col">@lang("Telit number")</th>
                                    <th scope="col">@lang("Module ID")</th>
                                    <th scope="col">@lang("Actions")</th>
                                </tr>
                            </thead>
                            <tbody></tbody>
                        </table>
                    </div>
                    <div class="addmodule container col-lg-3 modal-divided">
                        <br>
                        <h4>@lang("Link a module")</h4>
                        <hr>
                        <form id="linkmodule" method="post">
                            @csrf
                            <div class="dropdown">
                                <div class="form-group">
                                    <label for="selectLinkModule">@lang("Link a module not yet assigned to any company")</label>
                                    <select class="form-control" id="selectLinkModule">
                                        @foreach ($list_modules as $module)
                                        <option value="{{$module->id}}">{{$module->name}}</option>
                                        @endforeach
                                    </select>
                                </div>
                            </div>
                            <button type="submit" class="btn btn-primary"><span class="oi oi-link-intact"></span>&nbsp;@lang("Link the module")</button>
                        </form>
                        <hr>
                        <h4>@lang("Add a module")</h4>
                        <small class="form-text text-muted">@lang("First check if the module does not exist on the top list or if it is affiliated with another company. <br> The module will be added to the top list.")</small>
                        <form id="addModule" action="{{ route('module.post') }}" method="post">
                            @csrf
                            <div class="form-group">
                                <label for="modulename">@lang("Module name")</label>
                                <input type="text" class="form-control" id="modulename" name="name" aria-describedby="modulename" placeholder='@lang("Module name")'>
                            </div>
                            <div class="form-group">
                                <label for="pasdt_module_number">@lang("Module ID")</label>
                                <input type="text" class="form-control" id="pasdt_module_number" name="pasdt_module_number" aria-describedby="pasdt_module_number" placeholder="XXXX-XXXX">
                            </div>
                            <div class="form-group">
                                <label for="telit_json">@lang("Raw Telit JSON data")</label>
                                <textarea class="form-control" name="telit_json" id="telit_json" rows="3" placeholder="{&#10  format: json&#10}"></textarea>
                                <small id="textHelp" class="form-text text-muted">@lang("These data are accessible in the Telit portal.<br>Connections -> eye icon on the left -> 'Actions' on the top right -> View JSON.")</small>
                            </div>
                            <input type="hidden" class="form-control" id="telit_number" name="telit_number" aria-describedby="telit_number">
                            <!--<input type="hidden" name="company_id" id="company_id" val="" />-->
                            <button type="submit" class="btn btn-primary"><span class="oi oi-plus"></span>&nbsp;@lang("Add the module")</button>
                            <div class="form-loader" hidden>
                                <img src="/images/loader.svg">
                            </div>
                            <div class="form-message"></div>
                        </form>
                        <br />
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>


<!-- Modal Detail telit-->
<div class="modal fade" id="moduleModal" tabindex="-1" role="dialog" aria-labelledby="moduleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-scrollable" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="moduleModalLabel">@lang("Telit module")</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <button class="btn btn-primary toggle-map">@lang("Show on the map")</button>
                <div class="modal-map"></div>
                <br>
                <hr>
                <br>
                <div class="modal-pre"></div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">@lang("Close")</button>
            </div>
        </div>
    </div>
</div>

<!-- Modal edit module -->
<div class="modal fade" id="editModuleModal" tabindex="-1" role="dialog" aria-labelledby="moduleModalEditLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-scrollable" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="moduleModalEditLabel">@lang("Modify a module")</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <form id="editModule" action="{{ route('module.post') }}" method="put">
                    @csrf
                    <div class="form-group">
                        <label for="editmodulename">@lang("Module name")</label>
                        <input type="text" class="form-control" id="editmodulename" name="name" aria-describedby="editmodulename" placeholder="Nom du module">
                    </div>
                    <div class="form-group">
                        <label for="editpasdt_module_number">@lang("Module ID")</label>
                        <input type="text" class="form-control" id="editpasdt_module_number" name="pasdt_module_number" aria-describedby="pasdt_module_number" placeholder="XXXX-XXXX">
                    </div>
                    <div class="form-group">
                        <label for="edittelit_json">@lang("Raw Telit JSON data")</label>
                        <textarea class="form-control" name="telit_json" id="edittelit_json" rows="3" placeholder="{&#10  format: json&#10}"></textarea>
                        <small id="textHelp" class="form-text text-muted">@lang("These data are accessible in the Telit portal.<br>Connections -> eye icon on the left -> 'Actions' on the top right -> View JSON.")</small>
                    </div>
                    <input type="hidden" class="form-control" id="edittelit_number" name="telit_number" aria-describedby="telit_number">
                    <input type="hidden" name="company_id" id="editcompany_id" val="" />
                    <button type="submit" class="btn btn-primary"><span class="oi oi-pencil"></span>&nbsp;@lang("Modify the module")</button>
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


@endsection
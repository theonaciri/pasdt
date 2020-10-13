@extends('layouts.app')

@section('content')
<a href="/consultation" class="btn btn-secondary"><span class="oi oi-arrow-left"></span> Retour à l'analyse</a>
<br>
<br>
<div class="container">
    <div class="row justify-content-center">
        <div class="col-12">
            <div class="card">
                <div class="card-header">{{ __("Liste des entreprises") }} </div>
                <div class="card-body">
                    <table id="adminTable" class="table stripe">
                        <thead>
                            <tr>
                                <th scope="col">Logo</th>
                                <th scope="col">Couleur</th>
                                <th scope="col">Nom</th>
                                <th scope="col">Utilisateurs</th>
                                <th scope="col">Modules</th>
                                <th scope="col">Supprimer</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach ($companies as $company)
                            @if($self->is_client_company && $self->company_id == $company->id)
                            <tr class="highlight" data-id="{{$company->id}}">
                                @else
                            <tr data-id="{{$company->id}}">
                                @endif
                                <td class="logo" style="cursor:pointer" title="Cliquer pour modifier le logo de {{$company->name}}">
                                    @if (!empty($company->logo))
                                    <img src="images/companylogos/{{$company->logo}}" height="39" alt="" />
                                    @endif
                                </td>
                                <td class="colors" style="cursor:pointer" title="Cliquer pour modifier les couleurs de {{$company->name}}">
                                    @if (!empty($company->colors))
                                    <div style="width: 39px; height: 39px; border-radius: 5px; background-color: {{$company->colors}}"></div>
                                    @endif
                                </td>
                                <td class="name" style="cursor:pointer" title="Cliquer pour voir les logs de {{$company->name}}">{{$company->name}}</td>
                                <td class="button" title="Utilisateurs de {{$company->name}}">
                                    <button type="button" data-id="{{$company->id}}" title="Voir" name="Voir" class="btn btn-primary companybtn" data-toggle="modal" data-target="#companyUsersModal"><span class="oi oi-people"></span></button>
                                </td>
                                <td class="button" title="Ajouter, voir des modules de {{$company->name}}">
                                    <button type="button" data-id="{{$company->id}}" title="Modifier" name="Modifier" class="btn btn-primary companymodulesbtn" data-toggle="modal" data-target="#company-modules-modal"><span class="oi oi-box"></span></button>
                                </td>
                                <td class="button" title="Supprimer {{$company->name}}">
                                    <button type="button" data-id="{{$company->id}}" title="Supprimer" name="Supprimer" class="btn btn-danger companydeletebtn" data-toggle="modal" data-target="#company-delete-modal"><span class="oi oi-circle-x"></span></button>
                                </td>
                            </tr>
                            @endforeach
                        </tbody>
                    </table>
                    <small class="form-text text-muted">Cliquer sur un nom du tableau permet de voir les logs de l'entreprise. Cliquer sur un logo ou une couleur permet de modifier ces valeurs.</small>
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
<div class="modal fade" id="companyUsersModal" tabindex="-1" role="dialog" aria-labelledby="ModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Liste d'utilisateurs de </h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <table id="usersTable" class="table">
                <thead>
                    <tr>
                        <th scope="col">Nom</th>
                        <th scope="col">Email</th>
                    </tr>
                </thead>
                <tbody>

                </tbody>
            </table>
        </div>
    </div>
</div>

<!-- Modal -->
<div class="modal fade" id="companyDeleteModal" tabindex="-1" role="dialog" aria-labelledby="ModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Suppression</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <table id="deleteTable" class="table">
                <thead>
                    <tr>
                        <th scope="col">Nom</th>
                        <th scope="col">Email</th>
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
                <h5 class="modal-title">Liste des modules de </h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="container" style="max-width: 1440px">
                <div class="row justify-content-md-center">
                    <div class="container col-lg-9 modal-divided">
                        <br>
                        <h4>Modules actifs</h4>
                        <hr>
                        <table id="moduleTable" style="width: 100%" class="table">
                            <thead>
                                <tr>
                                    <th scope="col">Nom</th>
                                    <th scope="col">Numéro de carte</th>
                                    <th scope="col">Numéro Telit</th>
                                    <th scope="col">Numéro de module</th>
                                    <th scope="col">Détails</th>
                                </tr>
                            </thead>
                            <tbody></tbody>
                        </table>
                    </div>
                    <div class="addmodule container col-lg-3 modal-divided">
                        <br>
                        <h4>Lier un module</h4>
                        <hr>
                        <form id="linkmodule" method="post">
                            @csrf
                            <div class="dropdown">
                                <div class="form-group">
                                    <label for="selectLinkModule">Lier un module encore assigné à aucune entreprise</label>
                                    <select class="form-control" id="selectLinkModule">
                                        @foreach ($list_modules as $module)
                                        <option value="{{$module->id}}">{{$module->name}}</option>
                                        @endforeach
                                    </select>
                                </div>
                            </div>
                            <button type="submit" class="btn btn-primary"><span class="oi oi-link-intact"></span> Lier le module</button>
                        </form>
                        <hr>
                        <h4>Ajouter un module</h4>
                        <small class="form-text text-muted">Rechercher d'abord si le module n'existe pas d'abord sur la liste du dessus ou s'il est affilié à une autre entreprise.<br>Le module sera ajouté à liste du dessus.</small>
                        <form id="addModule" action="{{ route('module.post') }}" method="post">
                            @csrf
                            <div class="form-group">
                                <label for="modulename">Nom du module</label>
                                <input type="text" class="form-control" id="modulename" name="name" aria-describedby="modulename" placeholder="Nom du module">
                            </div>
                            <div class="form-group">
                                <label for="pasdt_module_number">N° de module</label>
                                <input type="text" class="form-control" id="pasdt_module_number" name="pasdt_module_number" aria-describedby="pasdt_module_number" placeholder="XXXX-XXXX">
                            </div>
                            <div class="form-group">
                                <label for="telit_json">Données brutes JSON Telit</label>
                                <textarea class="form-control" name="telit_json" id="telit_json" rows="3" placeholder="{&#10  format: json&#10}"></textarea>
                                <small id="textHelp" class="form-text text-muted">Ces données sont accessibles dans le portail Telit.<br>Connections -> icone œil à gauche -> Actions en haut à droite -> View JSON.</small>
                            </div>
                            <input type="hidden" class="form-control" id="telit_number" name="telit_number" aria-describedby="telit_number">
                            <!--<input type="hidden" name="company_id" id="company_id" val="" />-->
                            <button type="submit" class="btn btn-primary"><span class="oi oi-plus"></span> Ajouter le module</button>
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
                <h5 class="modal-title" id="moduleModalLabel">Module Telit</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <button class="btn btn-primary toggle-map">Afficher la carte</button>
                <div class="modal-map"></div>
                <br>
                <hr>
                <br>
                <div class="modal-pre"></div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Fermer</button>
            </div>
        </div>
    </div>
</div>

<!-- Modal edit module -->
<div class="modal fade" id="editModuleModal" tabindex="-1" role="dialog" aria-labelledby="moduleModalEditLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-scrollable" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="moduleModalEditLabel">Édition du module</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <h4>Éditer un module</h4>
                <small class="form-text text-muted">Editer un module.</small>
                <form id="editModule" action="{{ route('module.post') }}" method="put">
                    @csrf
                    <div class="form-group">
                        <label for="editmodulename">Nom du module</label>
                        <input type="text" class="form-control" id="editmodulename" name="name" aria-describedby="editmodulename" placeholder="Nom du module">
                    </div>
                    <div class="form-group">
                        <label for="pasdt_module_number">N° de module</label>
                        <input type="text" class="form-control" id="editpasdt_module_number" name="pasdt_module_number" aria-describedby="pasdt_module_number" placeholder="XXXX-XXXX">
                    </div>
                    <div class="form-group">
                        <label for="edittelit_json">Données brutes JSON Telit</label>
                        <textarea class="form-control" name="telit_json" id="edittelit_json" rows="3" placeholder="{&#10  format: json&#10}"></textarea>
                        <small id="textHelp" class="form-text text-muted">Ces données sont accessibles dans le portail Telit.<br>Connections -> icone œil à gauche -> Actions en haut à droite -> View JSON.</small>
                    </div>
                    <input type="hidden" class="form-control" id="edittelit_number" name="telit_number" aria-describedby="telit_number">
                    <input type="hidden" name="company_id" id="editcompany_id" val="" />
                    <button type="submit" class="btn btn-primary"><span class="oi oi-pencil"></span> Éditer le module</button>
                    <div class="form-loader" hidden>
                        <img src="/images/loader.svg">
                    </div>
                    <div class="form-message"></div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Fermer</button>
            </div>
        </div>
    </div>
</div>


@endsection
@extends('layouts.app')

@section('content')
<br>

<div class="container">
    <div class="row justify-content-center">
        <div class="col-12">
            <div class="card">
                <div class="card-header">{{ __("Se connecter en tant que :") }} </div>
                <div class="card-body">
                	<table id="adminTable">
                        <thead>
                            <tr>
                                <th>Nom</th>
                                <th>Liste d'utilisateurs</th>
                                <th>Liste des modules</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach ($companies as $company)
                            @if($self->is_client_company && $self->company_id == $company->id)
                                <tr class="highlight">
                            @else
                                <tr>
                            @endif
                                <td class="name">{{$company->name}}</td>
                                <td class="button">
                                    <button type="button" data-id="{{$company->id}}" title="Modifier" name="Modifier" class="btn btn-primary companybtn" data-toggle="modal" data-target="#company-user-modal">M</button>
                                </td>
                                <td class="button">
                                    <button type="button" data-id="{{$company->id}}" title="Modifier" name="Modifier" class="btn btn-primary companymodulesbtn" data-toggle="modal" data-target="#company-modules-modal">M</button>
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
                                <input id="name" type="text" class="form-control @error('name') is-invalid @enderror" name="name" value="{{ old('name') }}" required autocomplete="name" autofocus>

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
            <table id="usersTable">
                <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Email</th>
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
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Liste des modules de </h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="addmodule container">
                <br>
                <h4>Ajouter un module</h4>
                <form id="addModule" action="{{ route('module.post') }}" method="post">
                    @csrf
                    <div class="form-group">
                        <label for="modulename">Nom du module</label>
                        <input type="text" class="form-control" id="modulename" name="name" aria-describedby="modulename" placeholder="Nom du module">
                    </div>
                    <div class="form-group">
                        <label for="pasdt_card_number">N° de carte PASDT lié</label>
                        <input type="text" class="form-control" id="pasdt_card_number" name="pasdt_card_number" aria-describedby="pasdt_card_number" placeholder="00XXXXXXX">
                    </div>
                    <div class="form-group">
                        <label for="telit_json">Données brutes JSON Telit</label>
                        <textarea class="form-control" name="telit_json" id="telit_json" rows="3" placeholder="{&#10  format: json&#10}"></textarea>
                        <small id="textHelp" class="form-text text-muted">Ces données sont accessibles dans le portail Telit.<br>Connections -> icone œil à gauche -> Actions en haut à droite -> View JSON.</small>
                    </div>
                    <input type="hidden" name="company_id" id="company_id" val="" />
                    <button type="submit" class="btn btn-primary">Envoyer</button>
                    <div class="form-loader" hidden>
                        <img src="/images/loader.svg">
                    </div>
                    <div class="form-message"></div>
                </form>
            </div>
            <hr>
            <table id="moduleTable">
                <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Numéro de carte</th>
                        <th>Détails</th>
                    </tr>
                </thead>
                <tbody>
                    
                </tbody>
            </table>
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
        <div class="modal-map"></div>
        <div class="modal-pre"></div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Fermer</button>
      </div>
    </div>
  </div>
</div>

    
@endsection

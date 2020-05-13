@extends('layouts.app')

@section('content')
@if (session('status'))
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header">Analyse de logs PASDT</div>

                <div class="card-body">
                    <div class="alert alert-success" role="alert">
                        {{ session('status') }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endif

<div class="container">
    <div class="row justify-content-center">
        <div class="col-12">
            <ul class="nav nav-tabs" id="myTab" role="tablist">
                <li class="nav-item">
                    <a class="nav-link {{ (empty(request('tab')) || request('tab') === 'synthesis') ? 'active' : '' }}" id="synth-tab" data-toggle="tab" href="#synthesis" role="tab" aria-controls="synthesis" aria-selected="true">Synthèse anomalies PASDT</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link {{ request('tab') === 'home' ? 'active' : '' }}" id="home-tab" data-toggle="tab" href="#home" role="tab" aria-controls="home" aria-selected="true">Analyse de logs</a>
                </li>
                <!--<li class="nav-item">
                    <a class="nav-link" id="graphs-tab" data-toggle="tab" href="#graphs" role="tab" aria-controls="graphs" aria-selected="false">Graphes</a>
                </li>-->
                <li class="nav-item">
                    <a class="nav-link {{ request('tab') === 'graph-lives' ? 'active' : '' }}" id="graphs-live-tab" data-toggle="tab" href="#graphs-live" role="tab" aria-controls="graphs-live" aria-selected="false">Graphes de températures en direct</a>
                </li>
            
            </ul>
        
            <div class="tab-content" id="myTabContent">
                <div class="tab-pane fade {{ (empty(request('tab')) || request('tab') === 'synthesis') ? 'show active' : '' }}" id="synthesis" role="tabpanel" aria-labelledby="synthesis-table">
                    <div class="container">
                        <table id="synthesis-table" class="table table-bordered">
                            <thead>
                                <tr>
                                    <th class="th-multiselect">Nom du module</th>
                                    <th class="th-multiselect">Dernière anomalie</th>
                                    <th>Date dernière anomalie</th>
                                    <th>Dernière température</th>
                                    <th>Date dernière temp.</th>
                                </tr>
                            </thead>
                            <tfoot>
                                <tr>
                                    <th class="th-multiselect">Nom du module</th>
                                    <th class="th-multiselect">Dernière anomalie</th>
                                    <th>Date dernière anomalie</th>
                                    <th>Température min.</th>
                                    <th>Date dernière temp.</th>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                    <button class="color-modal-button btn btn-outline-info">Code couleurs</button>
                </div>
                <div class="tab-pane fade {{ request('tab') === 'home' ? 'show active' : '' }}" id="home" role="tabpanel" aria-labelledby="home-tab">
                  <div class="container">
                        <!--<button type="button" class="btn togglebtn toggle-buttons" data-toggle="button" aria-pressed="false" title="Montrer plus ou moins d'options de recherche"><span class="oi oi-minus"></span><span class="oi oi-plus"></span>&nbsp;<span class="oi oi-magnifying-glass"></span></button>-->
                        <div id="date_filter" class="input-group">
                            <div class="date-interval-container row">
                              <input name="dateinterval" id="dateinterval_logtable" class="col-md-10"/>
                              <button class="btn btn-secondary clear-cal col-md-2" title="Vider le calendrier">X</button>
                            </div>
                            <button type="button" class="btn togglebtn" data-toggle="button" aria-pressed="false" id="noday">
                              Uniquement les anomalies
                            </button>
                            <button type="button" class="btn togglebtn" data-toggle="button" aria-pressed="false" id="notemp">
                              Uniquement les températures
                            </button>
                        </div>
                        <table id="main-table" class="table table-bordered" style="width: 100% !important;">
                            
                        @if (isset($logs) && false)
                        <thead>
                                <tr>
                                    <th class="th-date">Date</th>
                                    <th class="th-multiselect" >Nom du module</th>
                                    <!--<th>Client</th>-->
                                    <th class="th-message">Message</th>
                                    <th class="select-temp">Température</th>
                                    <th>Batterie</th>
                                </tr>
                            </thead>
                            <tbody>
                              @foreach ($logs["data"] as $log)
                                @if($loop->even)
                                  <tr role="row" class="even">
                                @else
                                  <tr role="row" class="odd">
                                @endif
                                    <td class="sorting_1">{{$log[0]}}<td>
                                    <td>{{$log[1]}}</td>
                                    <td>{{$log[2]}}</td>
                                    <td>{{$log[3]}}</td>
                                    <td>{{$log[4]}}</td>
                                  </tr>
                              @endforeach
                            </tbody>
                            @else
                            <thead>
                                <tr>
                                    <th class="th-date">Date</th>
                                    <th class="th-multiselect" >Nom du module</th>
                                    <!--<th>Client</th>-->
                                    <th class="th-message">Message</th>
                                    <th class="select-temp">Température</th>
                                    <th>Batterie</th>
                                </tr>
                            </thead>
                            @endif
                            <tfoot>
                                <tr>
                                    <th class="th-date" rowspan="1" colspan="1" data-column="0"><input type="text" class="form-control" placeholder="Rechercher Date"></th>
                                    <th class="th-multiselect" id="module-name" rowspan="1" colspan="1" data-column="1">
                                      <div class="dropdown bootstrap-select show-tick form-control">
                                        <select class="selectpicker form-control">
                                      </div>
                                    </th>
                                    <!--<th>Client</th>-->
                                    <th class="th-input-message" rowspan="1" colspan="1" data-column="2"><input type="text" class="form-control" placeholder="Rechercher Anomalie"></th>
                                    <th class="select-temp" rowspan="1" colspan="1" data-column="3"><input type="text" class="form-control" placeholder="Rechercher Température min."></th>
                                    <th class="select-bat" rowspan="1" colspan="1" data-column="4"><input type="text" class="form-control" placeholder="Rechercher Batterie"></th>
                                </tr>
                            </tfoot>
                        </table>
                        <p>Le tableau est actualisé toutes les 5 minutes</p>
                    </div>
                    <button class="color-modal-button btn btn-outline-info">Code couleurs</button>
                  </div>
                  <div class="tab-pane fade {{ request('tab') === 'graphs-live' ? 'show active' : '' }}" id="graphs-live" role="tabpanel" aria-labelledby="graphs-live-tab">
                    <div class="row">
                      <div class="col col-md-3">
                        <div class="form-group">
                        <label for="themeSelect">Thème</label>
                        <select class="form-control" id="themeSelect">
                          <option value="defaultTheme">Défaut</option>
                          <option value="darkBlue">Bleu sombre</option>
                        </select>
                      </div>
                    </div>
                    <div class="col col-md-9">
                      <div class="form-group">
                        <label for="graphModuleSelect">Module</label>
                        <select class="form-control" id="graphModuleSelect">
                        </select>
                      </div>
                    </div>
                  </div>
                  <div id="anychart" style="width: 640px; height: 480px;"></div>
                </div>
              </div>
            </div>
    </div>
</div>

<!-- Modal -->
<div class="modal fade" id="moduleModal" tabindex="-1" role="dialog" aria-labelledby="moduleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
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
        <div class="modal-address"></div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Fermer</button>
      </div>
    </div>
  </div>
</div>


<div class="modal fade" id="colorModal" tabindex="-1" role="dialog" aria-labelledby="colorModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="colorModalLabel">Code couleurs</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-header">
          <h5 class="modal-title" id="colorModalLabel">Code couleur des logs</h5>
      </div>
      <div class="modal-body row color-div-container">
          <div class="col-md-6 dt-grey" title="Gris">Température 1</div>
          <div class="col-md-6 dt-red" title="Rouge">Température 2</div>
          <div class="col-md-6 dt-blue" title="Bleu">Défaut pression</div>
          <div class="col-md-6 dt-green" title="Vert">Défaut gaz</div>
          <div class="col-md-6 dt-black" title="Noir">Défaut pression * Défaut température 1</div>
          <div class="col-md-6 dt-black" title="Noir">Défaut température 2 * Défaut température 1</div>
          <div class="col-md-6 dt-black" title="Noir">Autre</div>
      </div>
      <div class="modal-header">
          <h5 class="modal-title" id="colorModalLabel">Code couleur de la température</h5>
      </div>
      <div class="modal-body row color-div-container">
          <div class="col-md-6 dt-red" title="Rouge">> à 90°C</div>
          <div class="col-md-6 dt-orange" title="Orange">> à 80°C</div>
          <div class="col-md-6 dt-green" title="Vert">< à 80°C</div>
      </div>

      <div class="modal-header">
          <h5 class="modal-title" id="colorModalLabel">Code couleur de la batterie</h5>
      </div>
      <div class="modal-body row color-div-container">
          <div class="col-md-6 dt-red" title="Rouge">< à 11V</div>
          <div class="col-md-6 dt-orange" title="Orange">< à 12V</div>
          <div class="col-md-6 dt-green" title="Vert">> à 12 V</div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Fermer</button>
      </div>
    </div>
  </div>
</div>
<script>
@if (isset($logs))
var prelogs = {!!json_encode($logs)!!};
@endif
@if (isset($synth))
var presynths = {!!json_encode($synth, JSON_HEX_QUOT|JSON_HEX_APOS)!!};
@endif
</script>
@endsection

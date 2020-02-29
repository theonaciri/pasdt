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
                    <a class="nav-link {{ request('tab') === 'graphs' ? 'active' : '' }}" id="realtime-graphs-tab" data-toggle="tab" href="#realtime-graphs" role="tab" aria-controls="graphs" aria-selected="false">Graphes de températures</a>
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
                                </tr>
                            </thead>
                            <tfoot>
                                <tr>
                                    <th class="th-multiselect">Nom du module</th>
                                    <th class="th-multiselect">Dernière anomalie</th>
                                    <th>Date dernière anomalie</th>
                                    <th>Température min.</th>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
                <div class="tab-pane fade {{ request('tab') === 'home' ? 'show active' : '' }}" id="home" role="tabpanel" aria-labelledby="home-tab">
                    <div class="container">
                        <div id="date_filter" class="input-group">
                            <span id="date-label-from" class="date-label">Du&nbsp;:&nbsp;</span><input class="date_range_filter date form-control" type="text" id="datepicker_from" />
                            <span id="date-label-to" class="date-label">&nbsp;au&nbsp;:&nbsp;</span><input class="date_range_filter date form-control" type="text" id="datepicker_to" />
                            &nbsp;
                            <button type="button" class="btn togglebtn" data-toggle="button" aria-pressed="false" id="noday">
                              Uniquement les anomalies
                            </button>
                            <button type="button" class="btn togglebtn" data-toggle="button" aria-pressed="false" id="notemp">
                              Uniquement les températures
                            </button>
                        </div>
                        <table id="main-table" class="table table-bordered" style="width: 100% !important;">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th class="th-multiselect" >Nom du module</th>
                                    <!--<th>Client</th>-->
                                    <th class="th-message">Message</th>
                                    <th>Températures</th>
                                </tr>
                            </thead>
                            <tfoot>
                                <tr>
                                    <th>Date</th>
                                    <th class="th-multiselect" id="module-id">Nom du module</th>
                                    <!--<th>Client</th>-->
                                    <th class="th-input-message">Message</th>
                                    <th class="select-temp">Température min.</th>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
                <div class="tab-pane fade {{ request('tab') === 'graphs' ? 'show active' : '' }}" id="graphs" role="tabpanel" aria-labelledby="realtime-graphs-tab">
                    <div class="" id="chart-events" style="width: 90%;"></div>
                    <!--<div id="my_dataviz" width="960" height="500"></div>
                    <div id="tester" style="width:600px;height:250px;"></div>
                    <button type="button" id="visib" class="btn btn-secondary" style="display: none; position: absolute; top: 300px; right: 0">
                      Transformateur 12 declenchement * defaut temperature 2<br>
                      Carte n° 005606224<br>
                      Le 20/06/2019 à 09:40:31
                    </button>
                    <img id="imgid" src="images/screendata.png" />
                -->
                </div>
                <div class="tab-pane fade" id="realtime-graphs" role="tabpanel" aria-labelledby="realtime-graphs-tab">
                    <canvas id="myChart" width="400" height="300"></canvas>
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
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Fermer</button>
      </div>
    </div>
  </div>
</div>

@endsection

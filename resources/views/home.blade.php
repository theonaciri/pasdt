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
                    <a class="nav-link active" id="home-tab" data-toggle="tab" href="#home" role="tab" aria-controls="home" aria-selected="true">Analyse de logs PASDT</a>
                </li>
                <!--<li class="nav-item">
                    <a class="nav-link" id="graphs-tab" data-toggle="tab" href="#graphs" role="tab" aria-controls="graphs" aria-selected="false">Graphes</a>
                </li>-->
                <li class="nav-item">
                    <a class="nav-link" id="realtime-graphs-tab" data-toggle="tab" href="#realtime-graphs" role="tab" aria-controls="graphs" aria-selected="false">Graphes de températures</a>
                </li>
            
            </ul>
        
            <div class="tab-content" id="myTabContent">
                <div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                    <div class="container">
                        <p id="date_filter">
                            <div class="input-group mb-3">
                                <span id="date-label-from" class="date-label">De&nbsp;:&nbsp;</span><input class="date_range_filter date" type="text" id="datepicker_from" />
                                <span id="date-label-to" class="date-label">&nbsp;à&nbsp;:&nbsp;</span><input class="date_range_filter date" type="text" id="datepicker_to" />
                                &nbsp;
                                <button type="button" class="btn" data-toggle="button" aria-pressed="false" autocomplete="off" id="noday">
                                  Uniquement les anomalies
                                </button>
                            </div>
                        </p>
                        <table id="main-table" class="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>ID de la carte</th>
                                    <th>Type d'événement</th>
                                    <th>Message</th>
                                    <th>Température</th>
                                </tr>
                            </thead>
                            <tfoot>
                                <tr>
                                    <th>Date</th>
                                    <th>ID de la carte</th>
                                    <th>Type d'événement</th>
                                    <th>Message</th>
                                    <th>Température</th>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
                <div class="tab-pane fade" id="graphs" role="tabpanel" aria-labelledby="graphs-tab">
                    

                    <div class="" id="chart-events" style="width: 90%;"></div>
                    <!--<div id="my_dataviz" width="960" height="500"></div>
                    <!--
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

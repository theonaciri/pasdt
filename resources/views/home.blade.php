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
</div>
@endif
<div class="container">
    <div class="row justify-content-center">
        <div class="col-12">
            <ul class="nav nav-tabs" id="myTab" role="tablist">
                <li class="nav-item">
                    <a class="nav-link active" id="home-tab" data-toggle="tab" href="#home" role="tab" aria-controls="home" aria-selected="true">Analyse de logs PASDT</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" id="graphs-tab" data-toggle="tab" href="#graphs" role="tab" aria-controls="graphs" aria-selected="false">Graphes</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" id="realtime-graphs-tab" data-toggle="tab" href="#realtime-graphs" role="tab" aria-controls="graphs" aria-selected="false">Graphes temps-réel</a>
                </li>
            </ul>
            <div class="tab-content" id="myTabContent">
                <div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                    <div class="container">
                        <p id="date_filter">
                            <div class="input-group mb-3">
                                <span id="date-label-from" class="date-label">De:&nbsp;</span><input class="date_range_filter date" type="text" id="datepicker_from" />
                                <span id="date-label-to" class="date-label">&nbsp;à :&nbsp;</span><input class="date_range_filter date" type="text" id="datepicker_to" />
                                &nbsp;
                                <button type="button" class="btn" data-toggle="button" aria-pressed="false" autocomplete="off" id="noday">
                                  Cacher les logs Ack, Day & Test
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
                    <div id="my_dataviz" width="960" height="500"></div>
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
                    <h1>Path Transitions</h1>
<p>This is a working example from: <a href="https://bost.ocks.org/mike/path/">https://bost.ocks.org/mike/path/</a></p>
<p><b>Scroll down to see the graph</b></p>
<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vestibulum massa in ornare auctor. Nunc tincidunt cursus ipsum ac egestas. Morbi quis mi id leo vulputate vestibulum et nec diam. Duis fringilla mauris in erat vehicula, sed euismod libero scelerisque. Sed eget justo vel lectus aliquet tempus. Integer ut placerat orci. Cras nunc felis, vulputate ac posuere vitae, vestibulum nec diam. Proin molestie, quam ut mattis vehicula, eros elit sodales felis, et viverra ligula massa a nisi. Curabitur condimentum vulputate convallis. Duis aliquam molestie venenatis. Ut feugiat eleifend rutrum. Fusce rutrum sapien at ligula pretium facilisis vel ut diam.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vestibulum massa in ornare auctor. Nunc tincidunt cursus ipsum ac egestas. Morbi quis mi id leo vulputate vestibulum et nec diam. Duis fringilla mauris in erat vehicula, sed euismod libero scelerisque. Sed eget justo vel lectus aliquet tempus. Integer ut placerat orci. Cras nunc felis, vulputate ac posuere vitae, vestibulum nec diam. Proin molestie, quam ut mattis vehicula, eros elit sodales felis, et viverra ligula massa a nisi. Curabitur condimentum vulputate convallis. Duis aliquam molestie venenatis. Ut feugiat eleifend rutrum. Fusce rutrum sapien at ligula pretium facilisis vel ut diam.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vestibulum massa in ornare auctor. Nunc tincidunt cursus ipsum ac egestas. Morbi quis mi id leo vulputate vestibulum et nec diam. Duis fringilla mauris in erat vehicula, sed euismod libero scelerisque. Sed eget justo vel lectus aliquet tempus. Integer ut placerat orci. Cras nunc felis, vulputate ac posuere vitae, vestibulum nec diam. Proin molestie, quam ut mattis vehicula, eros elit sodales felis, et viverra ligula massa a nisi. Curabitur condimentum vulputate convallis. Duis aliquam molestie venenatis. Ut feugiat eleifend rutrum. Fusce rutrum sapien at ligula pretium facilisis vel ut diam.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vestibulum massa in ornare auctor. Nunc tincidunt cursus ipsum ac egestas. Morbi quis mi id leo vulputate vestibulum et nec diam. Duis fringilla mauris in erat vehicula, sed euismod libero scelerisque. Sed eget justo vel lectus aliquet tempus. Integer ut placerat orci. Cras nunc felis, vulputate ac posuere vitae, vestibulum nec diam. Proin molestie, quam ut mattis vehicula, eros elit sodales felis, et viverra ligula massa a nisi. Curabitur condimentum vulputate convallis. Duis aliquam molestie venenatis. Ut feugiat eleifend rutrum. Fusce rutrum sapien at ligula pretium facilisis vel ut diam.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vestibulum massa in ornare auctor. Nunc tincidunt cursus ipsum ac egestas. Morbi quis mi id leo vulputate vestibulum et nec diam. Duis fringilla mauris in erat vehicula, sed euismod libero scelerisque. Sed eget justo vel lectus aliquet tempus. Integer ut placerat orci. Cras nunc felis, vulputate ac posuere vitae, vestibulum nec diam. Proin molestie, quam ut mattis vehicula, eros elit sodales felis, et viverra ligula massa a nisi. Curabitur condimentum vulputate convallis. Duis aliquam molestie venenatis. Ut feugiat eleifend rutrum. Fusce rutrum sapien at ligula pretium facilisis vel ut diam.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vestibulum massa in ornare auctor. Nunc tincidunt cursus ipsum ac egestas. Morbi quis mi id leo vulputate vestibulum et nec diam. Duis fringilla mauris in erat vehicula, sed euismod libero scelerisque. Sed eget justo vel lectus aliquet tempus. Integer ut placerat orci. Cras nunc felis, vulputate ac posuere vitae, vestibulum nec diam. Proin molestie, quam ut mattis vehicula, eros elit sodales felis, et viverra ligula massa a nisi. Curabitur condimentum vulputate convallis. Duis aliquam molestie venenatis. Ut feugiat eleifend rutrum. Fusce rutrum sapien at ligula pretium facilisis vel ut diam.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vestibulum massa in ornare auctor. Nunc tincidunt cursus ipsum ac egestas. Morbi quis mi id leo vulputate vestibulum et nec diam. Duis fringilla mauris in erat vehicula, sed euismod libero scelerisque. Sed eget justo vel lectus aliquet tempus. Integer ut placerat orci. Cras nunc felis, vulputate ac posuere vitae, vestibulum nec diam. Proin molestie, quam ut mattis vehicula, eros elit sodales felis, et viverra ligula massa a nisi. Curabitur condimentum vulputate convallis. Duis aliquam molestie venenatis. Ut feugiat eleifend rutrum. Fusce rutrum sapien at ligula pretium facilisis vel ut diam.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vestibulum massa in ornare auctor. Nunc tincidunt cursus ipsum ac egestas. Morbi quis mi id leo vulputate vestibulum et nec diam. Duis fringilla mauris in erat vehicula, sed euismod libero scelerisque. Sed eget justo vel lectus aliquet tempus. Integer ut placerat orci. Cras nunc felis, vulputate ac posuere vitae, vestibulum nec diam. Proin molestie, quam ut mattis vehicula, eros elit sodales felis, et viverra ligula massa a nisi. Curabitur condimentum vulputate convallis. Duis aliquam molestie venenatis. Ut feugiat eleifend rutrum. Fusce rutrum sapien at ligula pretium facilisis vel ut diam.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vestibulum massa in ornare auctor. Nunc tincidunt cursus ipsum ac egestas. Morbi quis mi id leo vulputate vestibulum et nec diam. Duis fringilla mauris in erat vehicula, sed euismod libero scelerisque. Sed eget justo vel lectus aliquet tempus. Integer ut placerat orci. Cras nunc felis, vulputate ac posuere vitae, vestibulum nec diam. Proin molestie, quam ut mattis vehicula, eros elit sodales felis, et viverra ligula massa a nisi. Curabitur condimentum vulputate convallis. Duis aliquam molestie venenatis. Ut feugiat eleifend rutrum. Fusce rutrum sapien at ligula pretium facilisis vel ut diam.</p>
<p>This chart, for example, shows your scrolling activity while reading this document over the last three minutes:</p>
<p>

<div class="slidecontainer">
  <p>Custom range slider:</p>
  <input type="range" min="100" max="100000" value="500" class="slider" id="myRange">
</div>
<div id="demo">Value: </div>
<div id="graphlive"></div>
                </div>
            </div>
        </div>
    </div>
</div>

@endsection

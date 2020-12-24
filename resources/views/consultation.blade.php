@extends('layouts.app')

@section('content')
@if (session('status'))
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header">@lang("Log analysis") PASDT</div>

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
                    <a class="nav-link {{ (empty(request('tab')) || request('tab') === 'synthesis') ? 'active' : '' }}" id="synth-tab" data-toggle="tab" href="#synthesis" role="tab" aria-controls="synthesis" aria-selected="true">@lang("Summary of anomalies") PASDT</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link {{ request('tab') === 'home' ? 'active' : '' }}" id="home-tab" data-toggle="tab" href="#home" role="tab" aria-controls="home" aria-selected="false">@lang("Log analysis")</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link {{ request('tab') === 'graph-lives' ? 'active' : '' }}" id="graphs-live-tab" data-toggle="tab" href="#graphs-live" role="tab" aria-controls="graphs-live" aria-selected="false">@lang("Temperature graphs")</a>
                </li>
            </ul> <!-- ul -->
            <div class="tab-content" id="myTabContent">
                <div class="tab-pane fade {{ (empty(request('tab')) || request('tab') === 'synthesis') ? 'show active' : '' }}" id="synthesis" role="tabpanel" aria-labelledby="synthesis-table">
                    <div class="container">
                        <table id="synthesis-table" class="table table-bordered" style="width: 100%">
                            <thead>
                                <tr>
                                    <th data-priority="1" class="th-multiselect">@lang("Module name")</th>
                                    <th data-priority="3" class="th-multiselect">@lang("Last anomaly")</th>
                                    <th data-priority="5">@lang("Last anomaly date")</th>
                                    <th data-priority="4">@lang("Last temp.")</th>
                                    <th data-priority="6">@lang("Last temp. date")</th>
                                    <th data-priority="2">@lang("Details")</th>
                                </tr>
                            </thead>
                            @if (isset($synth))
                            <tbody>
                            @foreach ($synth as $s)
                                @if($loop->even)
                                <tr role="row" class="even">
                                @else
                                <tr role="row" class="odd">
                                @endif
                                    <td class="sorting_1">{{$s->name ?? ""}}</td>
                                    <td>{{$s->msg ?? ""}}</td>
                                    <td>{{$s->created_at ?? ""}}</td>
                                    <td>{{$s->maxtemp ?? ""}}</td>
                                    <td>{{$s->temp_created_at ?? ""}}</td>
                                    <td><button class="btn btn-secondary openModuleModal"><span class="oi oi-plus"></span></button></td>
                                </tr>
                                @break($loop->index === 9)
                            @endforeach
                            </tbody>
                            @endif
                            <tfoot>
                                <tr>
                                    <th class="th-multiselect"><input type="text" class="form-control" placeholder="{{ __('Search') . ' ' . __('Module name') }}" /></th>
                                    <th class="th-multiselect"><input type="text" class="form-control" placeholder="{{ __('Search') . ' ' . __('Last anomaly') }}" /></th>
                                    <th><input type="text" class="form-control" placeholder="{{ __('Search') . ' ' . __('Last anomaly date') }}" /></th>
                                    <th><input type="text" class="form-control" placeholder="{{ __('Search') . ' ' . __('Last temp.') }}" /></th>
                                    <th><input type="text" class="form-control" placeholder="{{ __('Search') . ' ' . __('Last temp. date') }}" /></th>
                                    <th><input type="text" class="form-control" placeholder="{{ __('Search') . ' ' . __('Details') }}" /></th>
                                </tr>
                            </tfoot>
                        </table>
                        <p>
                            @lang("This table is refreshed every 5 minutes.")
                            <br>
                            @lang("Last refresh")&nbsp;:&nbsp;<span id="synth-date-sync"></span>.
                        </p>
                        <button class="btn btn-outline-info color-modal-button" data-toggle="modal" data-target="#colorModal"><span class="oi oi-info"></span>&nbsp;&nbsp;@lang("Color code")</button>
                        <button id="synth-refresh-btn" class="btn btn-outline-info api-refresh-btn" disabled>
                            <span class="oi oi-loop-circular"></span>&nbsp;&nbsp;@lang("Force refresh")
                        </button>
                    </div>
                </div> <!-- Synth tab -->
                <div class="tab-pane fade {{ request('tab') === 'home' ? 'show active' : '' }}" id="home" role="tabpanel" aria-labelledby="home-tab">
                    <div class="container">
                        <div id="date_filter" class="input-group">
                            <div class="date-interval-container row">
                                <input name="dateinterval" id="dateinterval_logtable" class="col-md-10"/>
                                <button class="btn btn-secondary clear-cal col-md-2" title='@lang("Empty the calendar")'><span class="oi oi-x"></span></button>
                            </div>
                            <button type="button" class="btn togglebtn" data-toggle="button" aria-pressed="false" id="noday">
                                @lang("Only anomalies")
                            </button>
                            <button type="button" class="btn togglebtn" data-toggle="button" aria-pressed="false" id="notemp">
                                @lang("Only temperatures")
                            </button>
                        </div>
                        <table id="main-table" class="table table-bordered responsive nowrap" style="width: 100%">
                        @if (isset($logs) && false)
                            <thead>
                                <tr>
                                    <th data-priority="2" class="th-date">@lang("Date")</th>
                                    <th data-priority="1" class="th-multiselect">@lang("Module name")</th>
                                    <!--<th>Client</th>-->
                                    <th data-priority="4" class="th-message">@lang("Message")</th>
                                    <th data-priority="3" class="select-temp">@lang("Temperature")</th>
                                    <th data-priority="5">@lang("Battery")</th>
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
                                    <th class="th-date">@lang("Date")</th>
                                    <th class="th-multiselect">@lang("Module name")</th>
                                    <!--<th>Client</th>-->
                                    <th class="th-message">@lang("Message")</th>
                                    <th class="select-temp">@lang("Temperature")</th>
                                    <th>@lang("Battery")</th>
                                </tr>
                            </thead>
                        @endif
                            <tfoot>
                                <tr>
                                    <th class="th-date" rowspan="1" colspan="1" data-column="0"><input type="text" class="form-control" placeholder='@lang("Search by") @lang("Date")'></th>
                                    <th class="th-multiselect" id="module-name" rowspan="1" colspan="1" data-column="1">
                                        <div class="dropdown bootstrap-select show-tick form-control">
                                            <select class="selectpicker form-control"></select>
                                        </div>
                                    </th>
                                    <!--<th>Client</th>-->
                                    <th class="th-input-message" rowspan="1" colspan="1" data-column="2"><input type="text" class="form-control" placeholder='@lang("Search by") @lang("Anomalie")'></th>
                                    <th class="select-temp" rowspan="1" colspan="1" data-column="3"><input type="text" class="form-control" placeholder='@lang("Search by") @lang("min. temperature")'></th>
                                    <th class="select-bat" rowspan="1" colspan="1" data-column="4"><input type="text" class="form-control" placeholder='@lang("Search by") @lang("Max. Battery")'></th>
                                </tr>
                            </tfoot>
                        </table>
                        <p>
                            @lang("This table is refreshed every 5 minutes.")
                            <br>
                            @lang("Last refresh")&nbsp;:&nbsp;<span id="logs-date-sync"></span>.
                        </p>
                        <button id="logs-refresh-btn" class="btn btn-outline-info api-refresh-btn" disabled>
                            <span class="oi oi-loop-circular"></span>&nbsp;&nbsp;@lang("Force refresh")
                        </button>
                    </div>
                </div> <!-- Home tab -->
                <div class="tab-pane fade {{ request('tab') === 'graphs-live' ? 'show active' : '' }}" id="graphs-live" role="tabpanel" aria-labelledby="graphs-live-tab">
                    <div class="row header-graph">
                        <div class="col col-md-3">
                            <div class="form-group">
                                <label for="themeSelect">@lang("Theme")</label>
                                <select class="form-control" id="themeSelect">
                                    <option value="darkBlue">@lang("Dark blue")</option>
                                    <option value="defaultTheme">@lang("Light blue")</option>
                                </select>
                            </div>
                        </div>
                        <div class="col col-md-9">
                            <div class="form-group">
                                <label for="graphModuleSelect">@lang("Module")</label>
                                <select class="form-control" id="graphModuleSelect">
                                @foreach ($synth as $s)
                                    @if (!empty($s->id) && !empty($s->temp_created_at))
                                    <option value="{{$s->id}}" {{ request()->get('moduleid') === $s->module_id ? 'selected' : ''}}>
                                        [{{$s->module_id}}] {{$s->name}}
                                    </option>
                                    @endif
                                @endforeach
                                @foreach ($synth as $s)
                                    @if (!empty($s->id) && empty($s->temp_created_at))
                                    <option value="{{$s->id}}" disabled>
                                        [{{$s->module_id}}] {{$s->name}}
                                    </option>
                                    @endif
                                @endforeach
                                </select>
                            </div>
                        </div>
                    </div>
                    @if (preg_match('~MSIE|Internet Explorer~i', $_SERVER['HTTP_USER_AGENT']) || (strpos($_SERVER['HTTP_USER_AGENT'], 'Trident/7.0; rv:11.0') !== false))
                    <p>Le graph n'est pas disponible sur Internet Explorer, utilisez Firefox, Chrome ou Safari.</p>
                    @endif

                    <div id="anychart" style="width: 640px; height: 480px;"></div>
                    <br>
                    <button class="btn btn-outline-info color-modal-button" data-toggle="modal" data-target="#moduleGraphColorModal"><span class="oi oi-info"></span>&nbsp;&nbsp;@lang("Color code")</button>
                </div> <!-- graph-live tab -->
            </div> <!-- Tab content -->
        </div>
    </div>
</div>

<!-- Modal -->
<div class="modal fade" id="moduleModal" tabindex="-1" role="dialog" aria-labelledby="moduleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="moduleModalLabel">@lang("Telit Module")</h5>
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
                <div class="modal-address"></div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">@lang("Close")</button>
            </div>
        </div>
    </div>
</div>

<!-- Modal Graph color code -->
<div class="modal fade" id="moduleGraphColorModal" tabindex="-1" role="dialog" aria-labelledby="moduleGraphColorModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="moduleGraphColorModalLabel">@lang("Legend")</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body" data-high="{{ config('pasdt.thresholds.TEMP_HIGH.value') }}" data-xhigh="{{ config('pasdt.thresholds.TEMP_CRIT_HIGH.value') }}">
                <p><span class="dot" style="background-color:green"></span>&nbsp;&nbsp;@lang("Normal temperature") (&lt;&nbsp;<span class="temp_high">{{ config('pasdt.thresholds.TEMP_HIGH.value') }}</span>&nbsp;°C)</p>
                <p><span class="dot" style="background-color:#ffda00"></span>&nbsp;&nbsp;@lang("High temperature") (&lt;&nbsp;<span class="temp_xhigh">{{ config('pasdt.thresholds.TEMP_CRIT_HIGH.value') }}</span>&nbsp;°C)</p>
                <p><span class="dot" style="background-color:red"></span>&nbsp;&nbsp;@lang("Critically high temperature") (&gt;=&nbsp;<span class="temp_xhigh">{{ config('pasdt.thresholds.TEMP_CRIT_HIGH.value') }}</span>&nbsp;°C)</p>
                <p><span class="dot" style="background-color:DodgerBlue"></span>&nbsp;&nbsp;@lang(":days last days average", ["days" => 30]) </p>
                <p><span class="dot" style="background-color:cyan"></span>&nbsp;&nbsp;@lang("Projection :days days in the future", ["days" => 30]) </p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">@lang("Close")</button>
            </div>
        </div>
    </div>
</div>


<div class="modal fade" id="colorModal" tabindex="-1" role="dialog" aria-labelledby="colorModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="colorModalLabel">@lang("Color code")</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-header">
                <h5 class="modal-title">@lang("Logs color code")</h5>
            </div>
            <div class="modal-body row color-div-container">
                <div class="col-md-6 dt-grey" title="Gris">@lang("defaut temperature") 1</div>
                <div class="col-md-6 dt-red" title="Rouge">@lang("defaut temperature") 2</div>
                <div class="col-md-6 dt-blue" title="Bleu">@lang("defaut pression")</div>
                <div class="col-md-6 dt-green" title="Vert">@lang("defaut gaz")</div>
                <div class="col-md-6 dt-black" title="Noir">@lang("defaut pression") * @lang("defaut temperature") 1</div>
                <div class="col-md-6 dt-black" title="Noir">@lang("defaut temperature") 1 * @lang("defaut temperature") 2</div>
                <div class="col-md-6 dt-black" title="Noir">@lang("Other")</div>
            </div>
            <div class="modal-header">
                <h5 class="modal-title">@lang("Temperature color code")</h5>
            </div>
            <div class="modal-body row color-div-container">
                <div class="col-md-6 dt-red" title="Rouge">&gt; @lang("than") 90°C</div>
                <div class="col-md-6 dt-orange" title="Orange">&gt; @lang("than") 80°C</div>
                <div class="col-md-6 dt-green" title="Vert">&lt; @lang("than") 80°C</div>
            </div>

            <div class="modal-header">
                <h5 class="modal-title">@lang("Battery color code")</h5>
            </div>
            <div class="modal-body row color-div-container">
                <div class="col-md-6 dt-red" title="Rouge">&lt; @lang("than") 11V</div>
                <div class="col-md-6 dt-orange" title="Orange">&lt; @lang("than") 12V</div>
                <div class="col-md-6 dt-green" title="Vert">&gt; @lang("than") 12 V</div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">@lang("Close")</button>
            </div>
        </div>
    </div>
</div>
<script>
    var prelogs, presynths = null;
    @if (isset($logs))
        var prelogs = null || {!!json_encode($logs)!!};
    @endif
    try {
        var prelogs = JSON.parse(sessionStorage.getItem("prelogs")) || prelogs;
    } catch (e) {}

    @if (isset($synth))
        var presynths = {!!json_encode($synth, JSON_HEX_QUOT|JSON_HEX_APOS)!!};
    @endif
    try {
        var presynths = JSON.parse(sessionStorage.getItem("presynths")) || presynths;
    } catch (e) {}
</script>
@endsection

@extends('layouts.app')

@section('content')
<br>

<div class="container">
    <div class="row justify-content-center">
        <div class="col-12">
            <div class="card">
                <div class="card-header">{{ __("Se connecter en tant que :") }} </div>
                <div class="card-body">
					<ul>
						@foreach($companies as $company)
						<li style="">
							<a href="/home?company={{$company->id}}">{{$company->name}}</a>
						</li>
						@endforeach
					</ul>
				</div>
			</div>
		</div>
	</div>
</div>

    
@endsection

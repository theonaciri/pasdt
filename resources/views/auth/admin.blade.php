@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-12">
            <div class="card">
                {{$user->company}}
                <div class="card-header">{{ __("Liste de vos utilisateurs") }}</div>
                <div class="card-body">
                    <table id="adminTable">
                    <thead>
                        <tr>
                            <td>Id</td>
                            <th>Nom</th>
                            <th>Mail</th>
                            <th>Créé le</th>
                            <th>Modifié le</th>
                            <th>Actions</th>
                            </tr>
                    </thead>
                    <tbody>
                    @foreach ($users as $user)
                        <tr>
                            <td class="id">{{$user->id}}</td>
                            <td class="name">{{$user->name}}</td>
                            <td class="email">{{$user->email}}</td>
                            <td class="created_at">{{$user->created_at}}</td>
                            <td class="updated_at">{{$user->updated_at}}</td>
                            <td class="button">
                                <button type="button" title="Modifier" name="Modifier" class="btn btn-primary" data-toggle="modal" data-target="#edit-user-modal">M</button>
                                <button type="button" title="Révoquer" name="Révoquer" class="btn btn-primary revoqbtn">X</button>
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

<!-- Modal -->
<div class="modal fade" id="edit-user-modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Editer le compte</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        ...
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary">Save changes</button>
      </div>
    </div>
  </div>
</div>
@endsection

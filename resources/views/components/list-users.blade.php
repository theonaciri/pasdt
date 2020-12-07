<div class="card-body">
    <div id="user-error" class="alert alert-danger d-none">
        <strong>Whoops!</strong> <span class="error-msg">@lang("Error")</span>
    </div>
    <table id="userTable" class="adminTable">
        <thead>
            <tr>
                <th>@lang("ID")</th>
                <th>@lang("Name")</th>
                <th>@lang("Mail")</th>
                <th>@lang("Created the")</th>
                <th>@lang("Modified the")</th>
                @if ($self->su_admin)
                <th>@lang("Actions")</th>
                @endif
            </tr>
        </thead>
        <tbody>
        @foreach ($users as $user)
        @if($user->is_client_company)
            <tr id="user{{$user->id}}" class="highlight">
        @else
            <tr id="user{{$user->id}}">
        @endif
                <td class="id">{{$user->id}}</td>
                <td class="name">{{$user->name}}</td>
                <td class="email">{{$user->email}}</td>
                <td class="created_at">{{$user->created_at}}</td>
                <td class="updated_at">{{$user->updated_at}}</td>
            @if ($self->su_admin)
                <td class="button">
                    <div class="btn-group btn-vertical" role="group" aria-label="user buttons">
                        <button type="button" title="@lang('Modify')" name="modify" class="btn btn-primary modifbtn modif-btn-user" data-toggle="modal" data-target="#edit-user-modal"><span class="oi oi-pencil"></span></button>
                        <a class="btn btn-danger deleteLink" title="@lang('Delete')" href="{{route('deleteUser', ['usertoDelete' => $user->id])}}">
                            <span class="oi oi-circle-x"></span>
                        </a>
                    </div>
                </td>
            @endif
            </tr>
            @endforeach
        </tbody>
    </table>
</div>
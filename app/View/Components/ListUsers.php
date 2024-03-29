<?php

namespace App\View\Components;

use Illuminate\View\Component;

class ListUsers extends Component
{
    /**
     * Create a new component instance.
     *
     * @return void
     */

    public $users;

    public function __construct($users)
    {
        $this->users = $users;
    }

    /**
     * Get the view / contents that represent the component.
     *
     * @return \Illuminate\Contracts\View\View|string
     */
    public function render()
    {
        return view('components.list-users');
    }
}

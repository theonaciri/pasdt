<?php
namespace App\Providers;
use Illuminate\Support\ServiceProvider;

class ComposerServiceProvider extends ServiceProvider {
    public function boot() {
        view()->composer("*","App\Http\ViewComposers\TestViewComposer");
    }
}
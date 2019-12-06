<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Auth::routes();

Route::get('/home', 'HomeController@index')->name('home');

Route::get('/client', 'ClientController@index')->name('client');

Route::get('/su_admin', 'AdminController@su_admin')->name('su_admin');

Route::get('/user/delete/{user}', 'ClientController@deleteUser')->name('deleteUser');

Route::get('/password/change', 'Auth\ChangePasswordController@index')->name('password_change');
Route::post('image-upload', 'ImageUploadController@imageUploadPost')->name('image.upload.post');
Route::post('set-company-colors', 'CompanyController@setColorsPost')->name('company.colors.post');


Route::get('/logs', 'LogController@getAllData')->name('log.get.all');
Route::get('/modules', 'ModuleController@getAllModules')->name('modules.get.all');
Route::get('/module/{module}', 'ModuleController@getModule')->name('module.get');
Route::get('/module/{module}/json', 'ModuleController@getModuleJson')->name('module.get.json');


Route::get('/subscription', 'SubscriptionController@index')->name('update-payment-method');
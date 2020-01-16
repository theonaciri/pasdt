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
Route::get('/company/{id}/users', 'CompanyController@getUsers')->name('company.users.get');
Route::get('/company/{id}/modules', 'CompanyController@getModules')->name('company.modules.get');
Route::post('/company/{company}/module/{module}', 'CompanyController@linkModule')->name('company.module.link');
Route::put('/company/{company}/module/{module}/unlink', 'CompanyController@unlinkModule')->name('company.module.unlink');


Route::get('/logs', 'LogController@getAllData')->name('log.get.all');
Route::get('/logs/synth', 'LogController@getSynthesisData')->name('log.get.synth');

Route::get('/modules', 'ModuleController@getAllModules')->name('modules.get.all');
Route::post('/module', 'ModuleController@postModule')->name('module.post');
Route::put('/module/{module}', 'ModuleController@putModule')->name('module.put');
Route::delete('/module/{module}', 'ModuleController@deleteModule')->name('module.delete');
Route::get('/module/{module}', 'ModuleController@getModule')->name('module.get');
Route::get('/module/{module}/json', 'ModuleController@getModuleJson')->name('module.get.json');

Route::get('/checkout', 'ClientController@checkout')->name('checkout');
Route::get('/checkout', 'ClientController@checkout')->name('company_create');
Route::post('/add-sub', 'ClientController@addSub')->name('addSub');
Route::get('/subscription', 'SubscriptionController@index')->name('update-payment-method');


Route::get('/authtelit', 'ModuleController@contactTelit')->name('telit.auth');
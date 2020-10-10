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
/*
Route::get('/', function () {
    return view('welcome');
});
*/

Auth::routes();
Route::get('/', 'HomeController@index')->name('welcome');
Route::get('/consultation', 'HomeController@consultation')->name('consultation');

/* USER */
Route::get('/client', 'ClientController@index')->name('client');
Route::get('/su_admin', 'AdminController@su_admin')->name('su_admin');
Route::get('/user/delete/{user}', 'ClientController@deleteUser')->name('deleteUser');
Route::get('/password/change', 'Auth\ChangePasswordController@index')->name('password_change');
Route::get('/users/get', 'AdminController@getUsers')->name('users.get');
Route::post('/users/modify/{user}', 'ClientController@modifUser')->name('users.modify');

/* COMPANY */
Route::post('image-upload', 'ImageUploadController@imageUploadPost')->name('image.upload.post');
Route::post('set-company-colors', 'CompanyController@setColorsPost')->name('company.colors.post');
Route::get('/company/{id}/users', 'CompanyController@getUsers')->name('company.users.get');
Route::get('/company/{id}/modules', 'CompanyController@getModules')->name('company.modules.get');
Route::post('/company/{company}/module/{module}', 'CompanyController@linkModule')->name('company.module.link');
Route::put('/company/{company}/module/{module}/unlink', 'CompanyController@unlinkModule')->name('company.module.unlink');

/* LOGS */
Route::get('/logs', 'LogController@getAllData')->name('log.get.all');
Route::get('/logs/get', 'LogController@getData')->name('log.get');
Route::get('/logs/temp', 'LogController@getTempData')->name('log.get.temp');
Route::get('/logs/synth', 'LogController@getSynthesisData')->name('log.get.synth');
Route::get('/logs/OverspeedToTelit/{pasdt_str}', 'LogController@convertOverspeedToTelit')->name('log.convert.over.to.telit');
Route::get('/logs/TelitToOverspeed/{pasdt_str}', 'LogController@convertTelitToOverspeed')->name('log.convert.telit.to.over');

/* NOTIFICATIONS */
Route::post('/notif/{notif}/acknowledge', 'LogController@acknowledgeNotif')->name('notif.acknowledge');

/* MODULE */
Route::get('/modules', 'ModuleController@getAllModules')->name('modules.get.all');
Route::post('/module', 'ModuleController@postModule')->name('module.post');
Route::put('/module/{module}', 'ModuleController@putModule')->name('module.put');
Route::delete('/module/{module}', 'ModuleController@deleteModule')->name('module.delete');
Route::get('/module/{module}', 'ModuleController@getModule')->name('module.get');
Route::get('/module/module_id/{module:module_id}', 'ModuleController@getModuleByModuleId')->name('module.getByModuleId');
Route::get('/module/{module}/json', 'ModuleController@getModuleJson')->name('module.get.json');
Route::get('/module', 'ModuleController@index')->name('module');

/* CHECKOUT */
Route::get('/checkout', 'ClientController@checkout')->name('checkout');
Route::get('/checkout', 'ClientController@checkout')->name('company_create');
Route::post('/add-sub', 'ClientController@addSub')->name('addSub');
Route::get('/subscription', 'SubscriptionController@index')->name('update-payment-method');

/* TELIT */
Route::get('/telit-json/{telit_id}', 'ModuleController@getTelitJson')->name('telit.json');
Route::get('/module/{telit_id}/update', 'ModuleController@updateOrInsertModule')->name('telit.module.update_insert');
Route::get('/modules/update', 'ModuleController@updateModules')->name('telit.modules.update');
Route::get('/telit-connections/{limit}', 'ModuleController@getTelitListConnections')->name('telit.connecion.list');
Route::get('/save-telit-modules', 'ModuleController@saveTelitModules')->name('telit.save.modules');

/* CSRF */
Route::get('/csrf', "Auth\CSRFController@refresh");


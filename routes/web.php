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

// Route::get('/nolog', 'NotificationController@noData')->name('get.nolog.post');
// Route::post('/nolog', 'NotificationController@noData')->name('store.nolog.post');

Route::group(['middleware' => ['locale']], function() {
	Auth::routes();
});

Route::get('/', 'HomeController@index')->name('welcome');
Route::get('/consultation', 'HomeController@consultation')->name('consultation')->middleware('auth');

/* USER */
Route::get('/client', 'ClientController@index')->name('client');
Route::get('/su_admin', 'AdminController@su_admin')->name('su_admin')->middleware('auth');
Route::get('/user/delete/{usertoDelete}', 'ClientController@deleteUser')->name('deleteUser')->middleware('auth');
Route::get('/password/change', 'Auth\ChangePasswordController@index')->name('password_change')->middleware('auth');
Route::get('/users/get', 'AdminController@getUsers')->name('users.get')->middleware('auth');
// if users.modify is change, need to change "$form.attr('action', '/users/modify/' + user_id.toString());" in client.js
Route::post('/users/modify/{user}', 'ClientController@modifUser')->name('users.modify')->middleware('auth');
Route::post('/user/mailnotifs/{activation}', 'ClientController@toggleMailNotifs')->name('user.toggle.mail.notifs')->middleware('auth');
Route::post('/user/change_locale', 'ClientController@changeLocale')->name('user.change.locale')->middleware('auth');

/* NOTIFICATIONS */
Route::get('/notifs/count/{seen?}', 'NotificationController@APIgetNotifsCount')->name('notifs.get_notifs_count')->middleware('auth');
Route::get('/notifs/count_last/{seen?}', 'NotificationController@APIgetNotifsCountAndLast')->name('notifs.get_notifs_count_and_last')->middleware('auth');
Route::get('/notifs/{seen?}', 'NotificationController@APIgetNotifs')->name('notifs.get_notifs')->middleware('auth');
Route::get('/notif/{notif}/renderMail', 'NotificationController@renderMail')->name('notifs.render_mail')->middleware('auth');
Route::post('/notif/{notif}/acknowledge', 'NotificationController@acknowledgeNotif')->name('notif.acknowledge')->middleware('auth');
Route::post('/notif/{notif}/comment', 'NotificationController@postComment')->name('notif.comment')->middleware('auth');

/* COMPANY */
Route::post('/createCompany', 'CompanyController@createCompany')->name('company.create')->middleware('auth');
Route::post('image-upload', 'ImageUploadController@imageUploadPost')->name('image.upload.post')->middleware('auth');
Route::post('set-company-colors', 'CompanyController@setColorsPost')->name('company.colors.post')->middleware('auth');
Route::get('/company/{id}/users', 'CompanyController@getUsers')->name('company.users.get')->middleware('auth');
Route::get('/company/{id}/modules', 'CompanyController@getModules')->name('company.modules.get')->middleware('auth');
Route::post('/company/{company}/module/{module}', 'CompanyController@linkModule')->name('company.module.link')->middleware('auth');
Route::put('/company/{company}/module/{module}/unlink', 'CompanyController@unlinkModule')->name('company.module.unlink')->middleware('auth');
Route::delete('/company/{company}', 'CompanyController@deleteCompany')->name('company.delete')->middleware('auth');

/* LOGS */
Route::get('/logs', 'LogController@getAllData')->name('log.get.all')->middleware('auth');
Route::get('/logs/get', 'LogController@getData')->name('log.get')->middleware('auth');
Route::get('/logs/temp', 'LogController@getTempData')->name('log.get.temp')->middleware('auth');
Route::get('/logs/synth', 'LogController@getSynthesisData')->name('log.get.synth')->middleware('auth');
Route::get('/logs/OverspeedToTelit/{pasdt_str}', 'LogController@convertOverspeedToTelit')->name('log.convert.over.to.telit')->middleware('auth');
Route::get('/logs/TelitToOverspeed/{pasdt_str}', 'LogController@convertTelitToOverspeed')->name('log.convert.telit.to.over')->middleware('auth');

/* MODULE */
Route::get('/modules', 'ModuleController@getAllModules')->name('modules.get.all')->middleware('auth');
Route::post('/module', 'ModuleController@postModule')->name('module.post')->middleware('auth');
Route::post('/module/{module}/thresholds', 'ModuleController@setThresholds')->name('module.thresholds.post')->middleware('auth');
Route::get('/module/{module}/thresholds', 'ModuleController@getThresholds')->name('module.thresholds.get')->middleware('auth');
Route::put('/module/{module}', 'ModuleController@putModule')->name('module.put')->middleware('auth');
Route::delete('/module/{module}', 'ModuleController@deleteModule')->name('module.delete')->middleware('auth');
Route::get('/module/{module}', 'ModuleController@getModule')->name('module.get')->middleware('auth');
Route::get('/module/module_id/{module:module_id}', 'ModuleController@getModule')->name('module.getByModuleId')->middleware('auth');
Route::get('/module/{module}/json', 'ModuleController@getModuleJson')->name('module.get.json')->middleware('auth');
Route::get('/module', 'ModuleController@index')->name('module')->middleware('auth');
Route::put('/module/{module}/toggle-mail/{state}', 'ModuleController@toggleMailModule')->name('toggleMailModule')->middleware('auth');

/* CHECKOUT */
Route::get('/checkout', 'ClientController@checkout')->name('checkout')->middleware('auth');
Route::get('/checkout', 'ClientController@checkout')->name('company_create')->middleware('auth');
Route::post('/add-sub', 'ClientController@addSub')->name('addSub')->middleware('auth');
Route::get('/subscription', 'SubscriptionController@index')->name('update-payment-method')->middleware('auth');

/* TELIT */
Route::get('/telit-json/{telit_id}', 'ModuleController@getTelitJson')->name('telit.json')->middleware('auth');
Route::get('/module/{telit_id}/update', 'ModuleController@updateOrInsertModule')->name('telit.module.update_insert')->middleware('auth');
Route::get('/modules/update', 'ModuleController@updateModules')->name('telit.modules.update')->middleware('auth');
Route::get('/telit-connections/{limit}', 'ModuleController@getTelitListConnections')->name('telit.connecion.list')->middleware('auth');
Route::get('/save-telit-modules', 'ModuleController@saveTelitModules')->name('telit.save.modules')->middleware('auth');

/* CSRF */
Route::get('/csrf', "Auth\CSRFController@refresh")->middleware('auth');

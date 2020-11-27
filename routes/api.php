<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});
/*
Route::middleware('auth:api')->get('/store-log', function (Request $request) {
	return $response = $client->request('POST', '/api/user', [
	    'headers' => [
	        'Authorization' => 'Bearer '.$token,
	        'Accept' => 'application/json',
	    ],
	]);
});


*/
//Route::middleware('auth:api')->post('/store-data', 'LogController@storeData')->name('store.log.post');
Route::post('/log', 'LogController@storeData')->name('store.log.post');
Route::post('/logbatch', 'LogController@storeDataBatch')->name('store.logbatch.post');
Route::post('/nolog', 'NotificationController@noData')->name('api.store.nolog.post');
Route::get('/nolog', 'NotificationController@noData')->name('api.get.nolog.post');

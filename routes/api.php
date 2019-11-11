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
Route::post('/store-data', 'LogController@storeData')->name('store.log.post');


Route::get('/salut', function() {
	return 'ok';
});

Route::get('/ok', 'LogController@salut');
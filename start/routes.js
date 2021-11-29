'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.on('/').render('welcome')
Route.group( function() {

    Route.post('register','AuthController.register')
    Route.post('login','AuthController.login')
    Route.post('logout','AuthController.logout').middleware(['auth'])
    Route.post('refreshToken', 'AuthController.refreshToken')  
}).prefix('/users').namespace('Users')
Route.group(function() {
    
    Route.post('send', 'AuthController.sendOtp')
    Route.post('verify','AuthController.verifyOtp')
}).prefix('otp').namespace('Users')

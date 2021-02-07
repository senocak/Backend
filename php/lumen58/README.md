# Lumen
- [Offical Document](https://lumen.laravel.com/docs/5.8)
## Installation

- composer global require "laravel/lumen-installer"
- php -S localhost:8000 -t public
- composer require tymon/jwt-auth:"^1.0@dev" 
    - Intallation of the **JWT** documentation can be found [here](https://iwader.co.uk/post/tymon-jwt-auth-with-lumen-5-2)
    - After JWT is installed and configurated in your project, follow the following commands to make lumen compatible
- Add the following commands in **App/Providers/AppServiceProvider.php**
    ```
        use Illuminate\Support\Facades\Schema; //NEW: Import Schema
        public function boot(){
            Schema::defaultStringLength(191); //NEW: Increase StringLength
        }
    ```
- run the command to create a new migration file for the User model,
    ```
    $ php artisan make:migration User
    ```
- User migration file will be created under **/database/migrations/** as **-datetime-__user.php**
- Insert the following commands for the user table schema
    ```
        Schema::create('users', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name');
            $table->string('email')->unique();
            $table->string('password');
            //$table->rememberToken();
            $table->timestamps();
        });
    ```
- run the command to create a new seeder file created migration file above,
    ```
        $ php artisan make:seeder UserSeeder
    ```
- Seeder file will be created under **/database/seeds/** as **UserSeeder.php**
- Insert the following commands for seeding for the User model table,
    ```
        use App\User;
        User::create([
            "name"=>"Lorem Ipsum",
            "email"=>"lorem@ipsum.com",
            "password"=>'$2y$10$u4.HmpmEjDj9VcDNeFZ9M.jlzet9V3ofsid5Xp5u275.pd6.L5qKO' //12345678
        ]);
    ```
- Insert the following command the activate the seeder file which is created now,
    ```
        $this->call('UserSeeder');
    ```
- See the everything is ok.
    ```
        $ php artisan migrate:fresh --seed
    ```
- For the authorizated users to access the function, use following command,
    ```
        $router->group(['middleware' => 'auth'], function ($router) {
            //Your routing codes must be here
            //For Example: $router->get('/deneme', 'ExampleController@deneme');
        });
    ```
- Intallation of the Lumen Generator can be found [here](https://github.com/flipboxstudio/lumen-generator)

- To run the project
    ```
        $ composer update
        // Rename the .env.example file to .env
        $ php artisan key:generate 
        $ php artisan migrate:fresh --seed
        $ php artisan serve
    ```

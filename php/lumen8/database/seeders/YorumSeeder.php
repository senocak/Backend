<?php

namespace Database\Seeders;

use App\Models\Yorum;
use Illuminate\Database\Seeder;

class YorumSeeder extends Seeder{
    public function run(){
        for ($i=49; $i<59; $i++)
            Yorum::create(array(
                'id' => \Illuminate\Support\Str::uuid(),
                'yorum' => "Cum nihil vero alias iure voluptatem reiciendis aut incidunt. Quo rerum molestias rerum cum ut eos itaque. Animi velit enim et voluptatum sunt.",
                'onay' => 1,
                'yazi_id' => "0ac425b3-800c-4fed-82f4-3e6d3c9da7$i",
                "email"=>"lorem$i@ipsum$i.com"
            ));
    }
}

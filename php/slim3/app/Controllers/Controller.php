<?php
namespace App\Controllers;
use Slim\Http\UploadedFile;
class Controller{
    protected $container;
    public function __construct($container){
        $this->container = $container;
    }
    public function __get($property){
        if ($this->container->{$property}) {
            return $this->container->{$property};
        }
    }
    public function url_duzenle($text){ 
        $search = array(' ','ö','ü','ı','ğ','ç','ş','/','?','Ö','Ü','I','Ğ','Ç','Ş','&');
        $replace = array('_','o','u','i','g','c','s','_','_','o','u','i','g','c','s','_');
        $new_text = str_replace($search,$replace,trim($text));
        return $new_text;
    }
    public function kucuk($text2){ 
        $search2 = array('A','B','C','Ç','D','E','F','G','H','I','İ','J','K','L','M','N','O','Ö','P','R','S','Ş','T','U','Ü','V','Y','Z','X','W');
        $replace2 = array('a','b','c','ç','d','e','f','g','h','ı','i','j','k','l','m','n','o','ö','p','r','s','ş','t','u','ü','v','y','z','x','w');
        $new_text2 = str_replace($search2,$replace2,trim($text2));
        return $new_text2;
    }
    public function moveUploadedFile($directory, UploadedFile $uploadedFile,$name){
        $extension = pathinfo($uploadedFile->getClientFilename(), PATHINFO_EXTENSION);
        $basename = bin2hex(random_bytes(8)); // see http://php.net/manual/en/function.random-bytes.php
        $filename = sprintf('%s.%0.8s', $name, $extension);
        $uploadedFile->moveTo($directory . DIRECTORY_SEPARATOR . $filename);
        return $filename;
    }
}
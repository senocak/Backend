@extends('main')
@section('body')
    <style>
        .pagination {display: inline-block;}
        .pagination a {color: black;float: left;padding: 8px 16px;text-decoration: none;}
    </style>
    @foreach ($yazilar as $item)
        <?php
            $kelime=300;
            $icerik=strip_tags($item->icerik);
            if(strlen($icerik)>=$kelime){
                if(preg_match('/(.*?)\s/i',substr($icerik,$kelime),$dizi))$icerik=substr($icerik,0,$kelime+strlen($dizi[0]))."...";
            }else{
                $icerik.="";
            }
        ?>
        <article class="topcontent">
            <header><h2><a href="/yazi/{{ $item->url }}" title="First Post">{{ $item->baslik }}</a></h2></header>
            <footer>
                <p class="post-info">
                    <a target="_blank" href="/kategori/{{ $item->kategori->url }}">{{ $item->kategori->baslik }}</a> | 
                    <x style="color:black;">{{ count($item->yorum) }} Yorum</x> | 
                    <x style="color:black;">{{ $item->created_at }}</x>
                </p> 
            </footer>
            <content>
                <p> {!! $icerik !!}</p>
            </content>
        </article>
    @endforeach
    <div class="pagination">
        @for ($i = 1; $i <= ceil($toplam/$limit); $i++)
            @if ($i == $current)
                <a style="color: #fff!important;background-color: #f44336!important;">{{ $i }}</a>
            @else
                <a href="/sayfa/{{ $i }}" >{{ $i }}</a>
            @endif
        @endfor
    </div>
@endsection
@section('kategoriler')
        @foreach ($kategoriler as $item)
            <li><a href="/kategori/{{ $item->url }}">{{ $item->baslik }}</a></li>
        @endforeach
@endsection
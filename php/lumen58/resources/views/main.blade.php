<html lang="en">
<head>
	<title>HTML5 & CSS3</title>
	<meta charset="utf-8"/>
  <link href='http://fonts.googleapis.com/css?family=Lato:300,400' rel='stylesheet' type='text/css'>
	<link rel="stylesheet" type="text/css" href="/css/style.css">
	<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <style>
        article>li{
            list-style-type: none;
        }
        article>h2{
            text-decoration: underline;
        }
    </style>
</head>

<body class="body">
	<header class="mainHeader">
    <p></p>
		<nav><ul>
			<li class="active"><a href="#">Home</a></li>
			<li><a href="#">Portfolio</a></li>
			<li><a href="#">About</a></li>
			<li><a href="#">Contact</a></li>
		</ul></nav>
	</header>

	<div class="mainContent">
		<div class="content">
			@yield('body')			 
		</div>
	</div>

	<aside class="top-sidebar">
		<article>
			<h2>Anıl Şenocak</h2>
			<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor</p>
		</article>
	</aside>
	<aside class="middle-sidebar">
		<article>
			<h2>Kategoriler</h2>
            @yield("kategoriler")
		</article>
	</aside>

	<aside class="bottom-sidebar">
		<article>
			<h2>Bottom Sidebar</h2>
			<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor</p>
		</article>
	</aside>

	<footer class="mainFooter">
    <p>Copyright &copy 2013 | <a href="#" title="google.com"> https://www.example.com</a></p>
	</footer>

</body>
</html>

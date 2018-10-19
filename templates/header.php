<?php ?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
    <meta name="description" content="panke.gallery seeks to open up a dialogue between established and emerging artists whose work comes out of the connections between digital or net-based art and club culture, especially in the recent history of Berlin. Its program of exhibitions and events takes place in a gallery space within the premises of panke.club.">
    <meta name="author" content="panke.gallery – Verein für künstlerisch-kulturelle Bildung e.V.">


    <link rel="icon" href="img/favicon.ico">

    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" rel="stylesheet">
    <script src="https://use.fontawesome.com/0370a2e3a9.js"></script>

    <title>panke.gallery</title>

    <!-- Bootstrap core CSS -->
    <?php echo '<link href="http://'. $_SERVER['SERVER_NAME'].'/css/bootstrap.min.css" rel="stylesheet">'; ?>
    <!-- Custom styles for this template -->
    <?php echo '<link href="http://'. $_SERVER['SERVER_NAME'].'/css/panke-main.css" rel="stylesheet">'; ?>

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>

    <!-- Bootstrap (local since upgrade to 4) -->
    <!--script src="http://getbootstrap.com/dist/js/bootstrap.min.js"></script-->
    <?php echo '<script src="http://'. $_SERVER['SERVER_NAME'].'/js/bootstrap.min.js" type="text/javascript"></script>'; ?>

    <!-- Custom scripts -->
    <?php echo '<script src="http://'. $_SERVER['SERVER_NAME'].'/js/js.cookie.js" type="text/javascript"></script>'; ?>
    <?php echo '<script src="http://'. $_SERVER['SERVER_NAME'].'/js/panke.js" type="text/javascript"></script>'; ?>



    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/html5shiv/3.7.3/html5shiv.min.js"></script>
      <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->


<!-- Matomo -->
<script type="text/javascript">
  var _paq = _paq || [];
  /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
  _paq.push(['trackPageView']);
  _paq.push(['enableLinkTracking']);
  (function() {
    var u="https://piwik.wunderjewel.de/";
    _paq.push(['setTrackerUrl', u+'piwik.php']);
    _paq.push(['setSiteId', '2']);
    var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
    g.type='text/javascript'; g.async=true; g.defer=true; g.src=u+'piwik.js'; s.parentNode.insertBefore(g,s);
  })();
</script>
<!-- End Matomo Code -->


</head>

<body>
    <div class="off-canvas">
        <?php include('templates/nav.php'); ?>
    </div>
    <div class="container theme-blue">
        <header> <!-- Start Header -->
            <div class="row">
                <div class="col-md-4 col-sm-3 col-xs-6">
                    <a href="/" title="Go to Homepage"><p class="logotype">panke.gallery</p></a>
                </div>
                <div class="col-md-8 col-sm-9 text-right hidden-xs">
                    <?php include('templates/nav.php'); ?>
                </div>
                <div class="col-xs-6 text-right visible-xs-block">
                    <a class="toggle-menu">
                        <span class="menu-icon glyphicon glyphicon-menu-hamburger"></span>
                    </a>
                </div>.
            </div>
        </header> <!-- End Header -->

<?php

/* Site for panke.gallery. */

define('__ROOT__', dirname(dirname(__FILE__)));
require_once 'lib/functions.php';


/* ==================  Load Header ===== ================= */

include('templates/header.php');


/* ==================  Load Page Content ================= */

$page = $_GET['p'];

/* Prepare and create fallback for events and exhibitions */

if ($page == 'exhibition')
    if (isset($_GET['e'])) $exhibition = $_GET['e']; else $page = 'exhibitions';

if ($page == 'event')
    if (isset($_GET['e'])) $event = $_GET['e']; else $page = 'events';

if (!isset($page) OR $page=='')
    $page = 'home';

/* Create URL */

switch ($page){

    case exhibition: $path='templates/exhibitions/'.$exhibition.'.php';
    break;

    case event: $path='templates/events/'.$event.'.php';
    break;

    default: $path='templates/'.$page.'.php';
    break;

}

/* Load template */

if(file_exists($path)){
    include $path;
} else{
    include ('templates/home.php');
}

/* ==================  Load Footer ======================= */

include('templates/footer.php');

?>

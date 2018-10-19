<?php

date_default_timezone_set('Europe/Berlin');

$dateOpening = mktime(0,0,0,3,31,2018);
$dateClosing = mktime(0,0,0,4,19,2018);
$weekdaysOpen = array(3,4,5,6);
$hourOpened = 15;
$hourClosed = 20;


function checkWeekday($weekdaysOpen) {
  $dayOfWeek = date('w');
  return in_array($dayOfWeek, $weekdaysOpen, false);
}

function checkTheDate($dateOpening, $dateClosing) {
  if ($dateOpening <= strtotime('now')){
    return (strtotime('now') <= $dateClosing) ? true : false;
  }
  else{
    return false;
  }
}

function checkHour($hourOpened, $hourClosed){
  if (date('H') >= $hourOpened) {
    return (date('H') < $hourClosed)? true : false;
  }
  else{
    return false;
  }
}

if (checkWeekday($weekdaysOpen) AND checkTheDate($dateOpening, $dateClosing) AND checkHour($hourOpened, $hourClosed)) {
    $status = 'open';
}else {
    $status = 'closed';
}

/* If open */

if ($status == 'open' OR $_GET['debugX']=='true'){

?>

<html>
  <head>
    <title>Streaming Ausstellung</title>
  </head>

  <body>

  <div>

    <?php
        include('templates/streaming/stream.php');

    ?>

  </div>

  </body>

</html>

<?php

  }else{


  /* Site for panke.gallery. */

define('__ROOT__', dirname(dirname(__FILE__)));
require_once 'lib/functions.php';


/* ==================  Load Header ===== ================= */

include('templates/header.php');


/* ==================  Load Page Content ================= */


include('templates/streaming/sorry.php');


/* ==================  Load Footer ======================= */

include('templates/footer.php');


  } /* end else sorry */




?>

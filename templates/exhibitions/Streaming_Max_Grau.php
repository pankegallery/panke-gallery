<section class="head">
	<style>
iframe.Stream { width: 870px; height: 489px; }
#MaxGrau {
    font-family: "Courier", New Courier, monospace;
    letter-spacing: 0.1em;
	font-size: 0.9em;
	font-weight: 300;


}
</style>
    <!-- Start Title and Featured Image -->
    <div class="row headline">
        <div class="col-md-12 col-sm-12 col-xs-12">

            <!-- Adjust title of exhibition here
    ================================================== -->

            <h2 class="h2Max">Streaming MAX GRAU</h2>
            <br>
            <p class="metaMax">"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."</p>
        </div>
    </div>
</section>
<!-- End Head -->

<!-- Adjust Dates and Short Decription here ================================================== -->
 <iframe
     class="Stream"
    src="http://player.twitch.tv/?channel=pankegallery"
    frameborder="1"
    scrolling="0">
  </iframe>
  	<br>
  	<br>
<h2 class="h2MaxBody">
    Past Sessions
  </h2>
   <br>
   <table align="center" text-align="justify" cellpadding="10" id="MaxGrau">

  <tr>
	    <td><iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/BnB8T9eaFtA?rel=0" frameborder="0" allow="encrypted-media" allow="fullscreen"></iframe></td></tr>
	    <td width="560">
<?php
      if (!file_exists("MaxGrauArchive/textDummy.txt"))
         {
            echo "Datei nicht vorhanden.";
            exit;
         }

         $dz=fopen("MaxGrauArchive/textDummy.txt","r");

         if(!$dz)
           {
             echo "Datei konnte nicht geöffnet werden.";
             exit;
           }

		   $link = "../../MaxGrauArchive/textDummy.txt";

           $zeile=fgets($dz,300);

            echo "<a href='".$Link."'>$zeile</a>";

            fclose($dz);
?>
</td>
   <tr> <td><iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/tAi93kCaUuc?rel=0" frameborder="0" allow="encrypted-media" ></iframe></td> </tr>
   <tr> <td>
<?php
      if (!file_exists("MaxGrauArchive/textDummy.txt"))
         {
            echo "Datei nicht vorhanden.";
            exit;
         }

         $dz=fopen("MaxGrauArchive/textDummy.txt","r");

         if(!$dz)
           {
             echo "Datei konnte nicht geöffnet werden.";
             exit;
           }

		   $link = "../../MaxGrauArchive/textDummy.txt";

           $zeile=fgets($dz,300);

            echo "<a href='".$Link."'>$zeile</a><br>";

            fclose($dz);
?></td> </tr>
</table>

</section>

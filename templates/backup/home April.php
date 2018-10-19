<section class="news">
    <!-- Start News -->
    <div class="row headline">
        <div class="col-md-12 col-sm-12 col-xs-12">

            <!-- Adjust Headline if needed================================================= -->

            <h2>panke.gallery recommends</h2>

        </div>
    </div>

    <div class="row">
        <div class="col-md-12 col-sm-12 col-xs-12">
            
            <!-- To add news, just copy the article item ================================= -->

            <article class="news-item">
                <a href="http://router.gallery/exhibition004.html"><h3>PLAY CELLS</h3></a>
                <p class="meta">artist: <a href="#">Nicole Cerrone </a> curated by <a href="http://www.chiarapassa.it/home.html">Chira Passa</a>
                    <br><a href="http://www.router.gallery">router.gallery</a> Location: panke.gallery | Vernissage 22 February 2017 at 7&thinsp;–&thinsp;10pm</p>
            </article>

        </div>
    </div>

    <!-- Add NEWS/EVENTS here      
 ================================================== -->
    <div class="row headline">
     <div class="col-md-12 col-sm-12 col-xs-12">
            <br>

                    <h2>panke.gallery presents</h2> 
                    
                </div>
            </div>
            
            <div class="row">
                <div class="col-md-12 col-sm-12 col-xs-12">
	                                         <article class="news-item">
                        <a href="<?php get_url('event','soundnight01'); ?>">
                            <h3>panke.gallery first Sound Night</h3>
                            <p>Live performances by TÕLE, RCO, Jee Young Sim + Sinead Meaney (Gg1 Records) | entry 5€</p>
                            <p class="meta">30 March 2017 at from 21:00&thinsp;–&thinsp;open end after opening</p>
                         </a>
                    </article>                    </a>
 
	                        
                </div>
            </div>


</section>
<!-- End News -->


<!--  =================================================================================================================
==========                                                                                                   ==========
==========                             Soon or running / Date secific                                        ==========
==========                                                                                                   ==========
=================================================================================================================== -->


<!-- Show this exhibition only until 4 February  -->
<?php if(mktime(0,0,0,4,12,2017) > strtotime('now')) { ?>

    <section class="currently">
        <!-- Start Currently -->
        <div class="row headline">
            <div class="col-md-12 col-sm-12 col-xs-12">

                <!-- Show soon opening until opening date, then currently running -->
                <?php if(mktime(0,0,0,3,30,2017) > strtotime('now')) { ?>

                    <h2>Upcoming</h2>

                <?php } else { ?>

                    <h2>Current</h2>

                <?php } ?>
                <!-- End date-specific headline -->

            </div>
        </div>
        <!-- Adjust Headline and add Exhibitions here
    ================================================== -->



        <article class="exhibition-item">
            <a href="<?php get_url('exhibition', 'claire_edition'); ?>">
	            <div class="row">
                    <div class="col-md-12 col-sm-12 col-xs-12">
                        <h3>Edition #001 – SHUSH TONES by Claire Tolan<br></h3><p>30 March &thinsp;–&thinsp;07 Aril 2017 | Vernissage 30 March at 19:00&thinsp;–&thinsp;21:00</p>	
                        <p class="meta">20:00 performance lecture by Claire Tolan </p>
                        <br>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-12 col-sm-12 col-xs-12">
                        <div class="image-wrapperVertical">
                            <img src="../img/edition/posterWeb.png" height="auto" />
                        </div>
                      
                      <p class="meta">edition #001 is designed by Anna-Luise Lorenz and Ingmar Spiller</p>

                    </div>
                </div>
            </a>
        </article>


    </section>
    <!-- End Currently -->
<?php } ?>
<!-- End date-specific block -->
 <section class="upcoming">  <!-- Start Upcoming -->
            <div class="row headline">
                <div class="col-md-12 col-sm-12 col-xs-12">

                    <h2>Upcoming</h2>

                </div>
            </div>
            <!-- Adjust Headline and add Exhibitions here
        ================================================== -->
         <article class="exhibition-item">
                <a href="<?php get_url('exhibition', 'work-game'); ?>">
                   
                    <div class="row">
                        <div class="col-md-12 col-sm-12 col-xs-12">
                            <h3>Work | Game &mdash; </h3><p>	27 April&thinsp;–&thinsp;17 Mai 2017 | Vernissage 27 April at 19:00 &amp;</p>
                             <p class="meta">Game becomes Work and Work becomes Game.</p>

                        </div>
                    </div>
                     <div class="row">
                    <div class="col-md-12 col-sm-12 col-xs-12">
                        <div class="image-wrapperVertical">
                            <img src="../img/workgame/work-game-poster_web.png" height="auto" />
                        </div>
                      
                      <p class="meta">exhibition with <strong>Sebastian L&uuml;tgert</strong> and <strong>Sebastian Schmieg</strong></p>

                </a>    
            </article>

                 
           

        </section> <!-- End Upcoming -->


        <section class="news"> <!-- Start News -->
            <div class="row headline">
                <div class="col-md-12 col-sm-12 col-xs-12">

                    <!-- Adjust Headline here
    ================================================== -->
                    <h2>router.gallery proudly presents</h2>

                </div>
            </div>

            <div class="row">
                <div class="col-md-12 col-sm-12 col-xs-12">

                    <!-- Add NEWS/EVENTS here
    ================================================== -->

                    <article class="news-item">
                        <a href="http://router.gallery/exhibition003.html"><h3>METAMODERNE NOW AND NEVER</h3></a>
                        <p class="meta">curated by <a href="http://www.floriankuhlmann.com">Florian Kuhlmann</a> <br>off-site router.gallery opening on 20 January 2017 at ACUD Berlin, Veteranenstraße, Berlin-Mitte at 19:00<br>
                        &amp; opening on 21 January 2017 at panke.gallery at 20:00 </p>
                    </article>

            <div class="row headline">
                <div class="col-md-12 col-sm-12 col-xs-12">

                    <h2>panke.gallery recommends</h2><br />

            <div class="row">
                <div class="col-md-12 col-sm-12 col-xs-12">

                    <article class="news-item">
                        <a href="#"><h3>Make it fit! Hyper mobile art in travel baggage size!</h3></a>
                        <p class="meta">New works by students of the new media class Kunsthochschule Kassel. Installation, performance and interventions.<br />Opening on 4 February 2017 at 19:00</p>
                    </article>


                </div>
            </div>


        </section> <!-- End News -->

        <!-- Show this exhibition only until 4 February  -->
        <?php if(mktime(0,0,0,2,4,2017) > strtotime('now')) { ?>

        <section class="currently">  <!-- Start Currently -->
            <div class="row headline">
                <div class="col-md-12 col-sm-12 col-xs-12">

                    <!-- Show soon opening until opening date, then currently running -->
                    <?php if(mktime(0,0,0,1,21,2017) > strtotime('now')) { ?>

                        <h2>Opening soon</h2>

                    <?php } else { ?>

                        <h2>Current</h2>

                    <?php } ?>
                    <!-- End date-specific headline -->

                </div>
            </div>
            <!-- Adjust Headline and add Exhibitions here
    ================================================== -->

            <article class="exhibition-item">
                <a href="<?php get_url('exhibition', 'grand-opening'); ?>">
                    <div class="row">

                        <div class="col-md-6 col-sm-6 col-xs-12">
                            <div class="image-wrapper 3-col">
                                <img src="http://www.kunsthauslangenthal.ch/system/html/Keller-2f5e0ffd.jpg" />
                            </div>
                            <p>Daniel Keller</p>
                        </div>
                        <div class="col-md-6 col-sm-6 col-xs-12">
                            <div class="image-wrapper 3-col">
                                <img src="https://img.discogs.com/kz-klafLnFHt2Okne3fPop2eXWQ=/fit-in/300x300/filters:strip_icc():format(jpeg):mode_rgb():quality(40)/discogs-images/R-93285-1155060470.jpeg.jpg" />
                            </div>
                            <p>Daniel Pflumm</p>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-12 col-sm-12 col-xs-12">
                            <h3>panke.gallery opening exhibition<small>21 January&thinsp;–&thinsp;3 February 2017 | Vernissage 21 January at 20:00 &amp; Afterparty 22:00</small></h3>
                        </div>
                    </div>

                </a>
            </article>


        </section> <!-- End Currently -->
        <?php } ?><!-- End date-specific block -->

         <section class="upcoming">  <!-- Start Upcoming -->
            <div class="row headline">
                <div class="col-md-12 col-sm-12 col-xs-12">

                    <h2>Upcoming</h2>

                </div>
            </div>
            <!-- Adjust Headline and add Exhibitions here
    ================================================== -->

            <article class="exhibition-item">
                <a href="<?php get_url('exhibition', 'transmediale'); ?>">
                    <div class="row">
                        <div class="col-md-12 col-sm-12 col-xs-12">
                            <div class="image-wrapper 1-col">
                                <img src="../img/FlyerTest.png" />
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-12 col-sm-12 col-xs-12">
                            <h3>Netzkunst im Berlin der 1990er – eine kritische Bestandsaufnahme<small>9&thinsp;–&thinsp;22 February 2017 | Vernissage 9 February at 19:00</small></h3>
                        </div>
                    </div>
                </a>
            </article>


        </section> <!-- End Upcoming -->


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
                        <div class="image-wrapper 1-col">
                            <img src="../img/edition/claireWebPoster.png" />
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-12 col-sm-12 col-xs-12">
                        <h3>Edition 001 – SHUSH TONES by Claire Tolan<small>10 March &thinsp;–&thinsp;12 Aril 2017 | Vernissage 30 March at 19:00</small></h3>
                    </div>
                </div>
            </a>
        </article>


    </section>
    <!-- End Currently -->
<?php } ?>
<!-- End date-specific block -->

<!--  =================================================================================================================
==========                                                                                                   ==========
==========                             Upcoming / Non-date specific                                          ==========
==========                                                                                                   ==========
=================================================================================================================== -->

        <!--
        <section class="upcoming">  <!-- Start Upcoming
            <div class="row headline">
                <div class="col-md-12 col-sm-12 col-xs-12">

                    <h2>Upcoming</h2>

                </div>
            </div>

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


        </section> <!-- End Upcoming --
        -->

<!--  =================================================================================================================
==========                                                                                                   ==========
==========                             Past exhibitions                                                      ==========
==========                                                                                                   ==========
=================================================================================================================== -->


        <section class="past">  <!-- Start Past -->
            <div class="row headline">
                <div class="col-md-12 col-sm-12 col-xs-12">

                        <h2>Past</h2>

                </div>
            </div>

            <div class="row">
                <div class="col-md-12 col-sm-12 col-xs-12">
                    <article class="exhibition-item">
                        <a href="<?php get_url('exhibition', 'grand-opening'); ?>">
                            <div class="image-wrapper 3-col ">
                                <img src="/img/docu/panke-gallery-2.JPG" />
                            </div>
                            <h3>panke.gallery opening exhibition - Daniel Keller and Daniel Pflumm -<small>21 January&thinsp;–&thinsp;3 February 2017 |</small></h3>
                        </a>
                    </article>
                     <article class="exhibition-item">
                        <a href="<?php get_url('exhibition', 'transmediale'); ?>">
                            <div class="image-wrapper 3-col ">
                                <img src="/img/dokuBestand/Netart01_C_008.png" />
                            </div>
                            <h3>&mdash; 1990s Berlin Net Art &mdash; Towards a Critical Evaluation<small>9 February&thinsp;–&thinsp;22 February 2017 |</small></h3>
                        </a>
                    </article>
                </div>
            </div>

        </section> <!-- End Past -->

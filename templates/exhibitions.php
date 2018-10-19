

<!--  =================================================================================================================
==========                                                                                                   ==========
==========                             Soon or running / Date secific                                        ==========
==========                                                                                                   ==========
=================================================================================================================== -->



<!-- Show this exhibition only until ... -->
<?php if(mktime(0,0,0,23,11,2018) >= strtotime('now')) { ?>

    <section class="currently"> <!-- Start Currently -->
        <div class="row headline">
            <div class="col-md-12 col-sm-12 col-xs-12">

                <!-- Show soon opening until opening date, then currently running -->
                <?php if(mktime(0,0,0,03,10,2018) > strtotime('now')) { ?>
                    <h2>Upcoming</h2>
                <?php } else { ?>
                    <h2>Current</h2>
                <?php } ?>
                <!-- End date-specific headline -->

            </div>
        </div>

        <div class="row">
            <div class="col-md-12 col-sm-12 col-xs-12">

                <article class="exhibition-item">
                    <a href="<?php get_url('exhibition','zentrum-netzkunst'); ?>">
                        <img src="../img/netzkunst/ZentrumNetzkunst_2048.jpg" alt="Zentrum der Netzkunst – Flyer" class="img-fluid"/>
                        <h3>Berlin, Zentrum der Netzkunst – damals und heute <small>4 October&thinsp;–&thinsp;23 November 2018</small></h3>
                    </a>
                </article>


            </div>
        </div>

    </section>
    <!-- End Currently -->
<?php } ?>
<!-- End date-specific block -->


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
                        <a href="<?php get_url('exhibition','medienkoerper'); ?>">
                            <img src="../img/medienK/grass_gross.jpg" alt="Flyer" class="img-fluid"/>
                            <h3>Medienk&ouml;rper<strong> &mdash; Yvon Chabrowski</strong> &amp; <strong>Dani Ploeger</strong> <small>9 Juni&thinsp;–&thinsp;21 Juni 2018</small></h3>
                        </a>
                    </article>

                    <article class="exhibition-item">
                        <a href="<?php get_url('exhibition','ALEXIETY'); ?>">
                            <img src="../img/alexiety/Flyer.png" alt="Flyer" class="img-fluid"/>
                            <h3>Alexiety<strong> &mdash; !Mediengruppe Bitnik</strong> &amp; <strong>Low Jack</strong> and <strong>Omsk Social Club</strong><small>9 May&thinsp;–&thinsp;2 June 2018</small></h3>
                        </a>
                    </article>

                    <article class="exhibition-item">
                        <a href="<?php get_url('exhibition', 'streamInstreamOut'); ?>">
                            <img src="../img/streamInOut/streamfb.png" class="img-fluid" />
                            <h3>STREAM IN - STREAM OUT &mdash; Karl Heinz Jeron and Jules LaPlace<small>31 March&thinsp;–&thinsp;19 April 2018</small></h3>
                        </a>
                    </article>

	                <article class="exhibition-item">
                        <a href="<?php get_url('exhibition', 'blackScre'); ?>">
                            <img src="../img/blackScre/TV-BlackScre.png" class="img-fluid" />
                            <h3>BLACK SCRE &mdash; Kim Asendorf and Ole Fach<small>03 February&thinsp;–&thinsp;22 February 2018</small></h3>
                        </a>
                    </article>

                    <article class="exhibition-item">
                        <a href="<?php get_url('exhibition','InternetFame'); ?>">
                            <img class="img-fluid" src="../img/InternetFame/if_soc.jpg" />
                            <h3>Internet Fame &mdash; group show by clusterduck collective and panke.gallery &mdash; The Wrong Biennial<small>13 January&thinsp;–&thinsp;26 Janauary 2018</small></h3>
                        </a>
                    </article>

                    <article class="exhibition-item">
                        <a href="<?php get_url('exhibition', 'idnStreetArt'); ?>">
                            <img class="img-fluid" src="../img/idn/idn_jodi_6.png" />
                            <h3>#idnStreetArt — JODI and ! @SeX#─────██████████════█<small>29 September&thinsp;–&thinsp;25 October 2017</small></h3>
                        </a>
                    </article>


                    <article class="exhibition-item">
                        <a href="<?php get_url('exhibition', 'theinternetexpress'); ?>">
                            <img class="img-fluid" src="../img/iexpress/Totale.JPG" />
                            <h3>Launch of The Internet . Express &mdash; Jonas Lund <small>9 September&thinsp;–&thinsp;10 September 2017</small></h3>
                        </a>
                    </article>

                    <article class="exhibition-item">
                        <a href="<?php get_url('exhibition', 'concrete_dynamic'); ?>">
                            <img class="img-fluid" src="../img/concrete/front.png" />
                            <h3>concrete::dynamic &mdash; Alma Alloro and Horst Bartnig<small>22 June&thinsp;–&thinsp;13 July 2017</small></h3>
                        </a>
                    </article>

                    <article class="exhibition-item">
                        <a href="<?php get_url('exhibition', 'work-game'); ?>">
                            <img class="img-fluid" src="../img/docuWorkGame/_M__8682_1.jpg" />
                            <h3>Work | Game &mdash; Sebastian Schmieg and Sebastian Lütgert <small>27 April&thinsp;–&thinsp;17 May 2017</small></h3>
                        </a>
                    </article>
                    <article class="exhibition-item">
                        <a href="<?php get_url('exhibition', 'claire_edition'); ?>">
                            <img class="img-fluid" src="../img/edition/LastPic.png" />
                            <h3>Edition 001 – SHUSH TONES by Claire Tolan<small>10 March&thinsp;–&thinsp;07 Aril 2017</small></h3>
                        </a>
                    </article>
                    <article class="exhibition-item">
                        <a href="<?php get_url('exhibition', 'transmediale'); ?>">
                            <img class="img-fluid" src="/img/dokuBestand/Bestandsaufnahme.png" />
                            <h3>1990s Berlin Net Art &mdash; Towards a Critical Evaluation<small>9 February&thinsp;–&thinsp;22 February 2017</small></h3>
                        </a>
                    </article>
                    <article class="exhibition-item">
                        <a href="<?php get_url('exhibition', 'grand-opening'); ?>">
                            <img class="img-fluid" src="/img/docu/panke-gallery-2.JPG" />
                            <h3>panke.gallery opening exhibition &mdash; Daniel Keller and Daniel Pflumm <small>21 January&thinsp;–&thinsp;3 February 2017</small></h3>
                        </a>
                    </article>
                </div>
            </div>

        </section> <!-- End Past -->

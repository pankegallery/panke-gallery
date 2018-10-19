<section class="news">
    <!-- Start News -->
    <div class="row headline">
        <div class="col-md-12 col-sm-12 col-xs-12">

            <!-- Adjust Headline here
    ================================================== -->
            <h2>Upcoming events of panke.gallery</h2>

        </div>
    </div>

    <div class="row">
        <div class="col-md-12 col-sm-12 col-xs-12">

            <!-- Add NEWS/EVENTS here
    ================================================== -->
            <article class="news-item">
                <a href="<?php get_url('event','LAplaysitself'); ?>">
                    <h3>Los Santos Plays Itself</h3>
                    <p class="meta">performance by <strong>Sebastian L&uuml;tgert</strong> featuring <strong>Robert Luxemburg</strong> as <strong>Kim Fowley Jr</strong>
                        <br />29.4.2017 at 5p.m.&thinsp;–&thinsp;9p.m. and 06.5.2017 at 5p.m.&thinsp;–&thinsp;9p.m.</p>
                </a>
            </article>

            <article class="news-item">
                <a href="<?php get_url('event','leisure'); ?>">
                    <h3>How to Beat Everyone in Your Office at Table Tennis — Talk by Leisure Inc.</h3>
                    <p class="meta">with <strong>Sebastian Schmieg</strong> and <strong>Silvio Lorusso</strong> – in cooperation with <strong>scopesessions</strong>
                        <br />11.5.2017 at 8p.m.&thinsp;–&thinsp;11p.m.</p>
                </a>
            </article>

        </div>
    </div>


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
                <a href="http://router.gallery/exhibition005.html"><h3>The Creation Of Adam</h3></a>
                <p class="meta">artists: <strong>Sandro Botticelli, Jan van Eyck, Vincent Van Gogh, Francisco Goya, Edvard Munch, Pablo Picasso, Rembrandt and Leonardo da Vinci</strong> curated by <a href="http://nikoprincen.com/">Niko Princen</a>
                    <br><a href="http://www.router.gallery">router.gallery</a> Location: panke.gallery | Vernissage 27 April 2017 at 7&thinsp;–&thinsp;open end</p>
            </article>

        </div>
    </div>

    <!-- Add NEWS/EVENTS here
 ================================================== -->


</section>
<!-- End News -->


<!--  =================================================================================================================
==========                                                                                                   ==========
==========                             Soon or running / Date secific                                        ==========
==========                                                                                                   ==========
=================================================================================================================== -->


<!-- Show this exhibition only until 17 May  -->
<?php if(mktime(0,0,0,5,18,2017) > strtotime('now')) { ?>

    <section class="currently">
        <!-- Start Currently -->
        <div class="row headline">
            <div class="col-md-12 col-sm-12 col-xs-12">

                <!-- Show soon opening until opening date, then currently running -->
                <?php if(mktime(0,0,0,3,26,2017) > strtotime('now')) { ?>

                    <h2>Upcoming</h2>

                    <?php } else { ?>

                        <h2>Current</h2>

                        <?php } ?>
                            <!-- End date-specific headline -->

            </div>
        </div>
        <!-- Adjust Headline and add Exhibitions here -->




        <article class="exhibition-item">
            <a href="<?php get_url('exhibition', 'work-game'); ?>">

                <div class="row">
                    <div class="col-md-12 col-sm-12 col-xs-12">
                        <h3>Work | Game &mdash; Game becomes Work and Work becomes Game</h3>
                        <p class="meta">27 April&thinsp;–&thinsp;17 Mai 2017 | VERNISSAGE 27 April at 19:00&thinsp;–&thinsp;22:00 &amp; | Afterparty with ROLUX-FOX </p>

                    </div>
                </div>
                <div class="row">
                    <div class="col-md-12 col-sm-6 col-xs-6">
                        <div class="image-wrapper">
                            <img src="../img/workgame/work-game-poster_web.png" height="auto" />
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-12 col-sm-6 col-xs-6">
                        <p class="meta">an exhibition with <strong>Sebastian L&uuml;tgert</strong> and <strong>Sebastian Schmieg</strong></p>
                        <p class="meta">29.4.2017 at 5p.m.&thinsp;–&thinsp;9p.m. performance by <strong><a href="http://www.rolux.org">Sebastian L&uuml;tgert</a></strong>
                        <br />06.5.2017 at 5p.m.&thinsp;–&thinsp;9p.m. performance by <strong><a href="http://www.rolux.org">Sebastian L&uuml;tgert</a></strong>
                        <br />11.5.2017 at 8p.m.&thinsp;–&thinsp;11p.m. talk with <strong><a href="http://www.sebastianschmieg.com">Sebastian Schmieg</a> </strong> and <strong><a href="http://www.silviolorusso.com">Silvio Lorusso</a></strong></p>
                    </div>
                </div>

            </a>





        </article>


    </section>
    <!-- End Currently -->
    <?php } ?>
        <!-- End date-specific block -->

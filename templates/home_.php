
<!--  =================================================================================================================
==========                                                                                                   ==========
==========                             Soon or running / Date secific                                        ==========
==========                                                                                                   ==========
=================================================================================================================== -->


 <section class="news">
    <!-- Start News -->
    <!--========================== NEWS/EVENTS -->
    <div class="row headline">
        <div class="col-md-12 col-sm-12 col-xs-12">

            <h2>Upcoming events of panke.gallery</h2>

        </div>
    </div>

    <div class="row">
        <div class="col-md-12 col-sm-12 col-xs-12">


        </div>
    </div>

    <!--========================== END NEWS/EVENTS -->

<!-- Show this exhibition only until ...  -->
<?php if(mktime(0,0,0,10,26,2017) > strtotime('now')) { ?>

    <section class="currently">
        <!-- Start Currently -->
        <div class="row headline">
            <div class="col-md-12 col-sm-12 col-xs-12">

                <!-- Show soon opening until opening date, then currently running -->
                <?php if(mktime(0,0,0,9,29,2017) > strtotime('now')) { ?>
                    <h2>Upcoming</h2>
                <?php } else { ?>
                    <h2>Current</h2>
                <?php } ?>
                <!-- End date-specific headline -->

            </div>
        </div>

        <article class="exhibition-item">
            <a href="<?php get_url('exhibition','idnStreetArt'); ?>">

                <div class="row">
                    <div class="col-md-12 col-sm-12 col-xs-12">
                        <h3>#idnStreetArt</h3>
                        <p>panke.gallery proudly presents <strong>JODI</strong> and <strong>! @SeX#─────██████████════█</strong>.</p>

                        <div class="image-wrapper">
                            <a href="http://panke.gallery/exhibition/idnStreetArt"><img src="/img/idn/idn_jodi_6.png" /></a>
                        </div>
                        <p class="meta">29 September&thinsp;–&thinsp;25 October 2017 | opening times: Thu, Fri 1&thinsp;-&thinsp;7 pm and Sat 3&thinsp;-&thinsp;8 pm and for special events<br>
                        <strong>Vernissage</strong> 25 September from 19:00&thinsp;–&thinsp;22:00 (free entry) | Afterparty from 22:00 - open end (3€ entry) with bboosskkaa, vaiper.presidential.race and copyshop3000 </p>
                    </div>
                </div>

            </a>
        </article>

    </section> <!-- End Currently -->
    <?php } ?>
    <!-- End date-specific block -->




    <div class="row headline">
        <div class="col-md-12 col-sm-12 col-xs-12">

            <h2>panke.gallery recommends</h2>

        </div>
    </div>

    <div class="row">
        <div class="col-md-12 col-sm-12 col-xs-12">

            <!-- To add recommendations, just copy the article item ================================= -->

            <article class="news-item">
                <a href="http://router.gallery/exhibition006.html"><h3>BEAUTIFUL INTERFACES: THE PRIVACY PARADOX</h3></a>
                <p>
                    artists: <a href="http://jenniferlynmorone.com/"> Jennifer Lyn Morone</a>, <a href="http://deweyhagborg.com/"> Heather Dewey Hagborg</a>, <a href="http://turboavedon.com/"> LaTurbo Avedon</a>, <a href="http://www.annyfanny.info/"> Annie Rose Malamet</a> and <a href="http://carlagannis.com/"> Carla Gannis</a>

                    <br>curated by <a href="http://produccionaleatoria.com/">Helena Acosta</a> and <a href="http://miyovanstenis.com/">Miyo Van Stenis</a>
                </p>
                <div class="image-wrapper">
                    <img src="http://router.gallery/images/BI_2017.png" />
                </div>
                <p class="meta">
                    <a href="http://www.router.gallery">router.gallery</a> at panke.gallery | Vernissage 27 June 2017 at 19:0&thinsp;–&thinsp;open end
                </p>
            </article>

        </div>
    </div>

    <!-- Add NEWS/EVENTS here
 ================================================== -->


</section>
<!-- End News -->

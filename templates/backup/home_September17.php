<section class="news">
    <!-- Start News -->
    <!--========================== NEWS/EVENTS
    <div class="row headline">
        <div class="col-md-12 col-sm-12 col-xs-12">

            <h2>Upcoming events of panke.gallery</h2>

        </div>
    </div>

    <div class="row">
        <div class="col-md-12 col-sm-12 col-xs-12">

            <article class="news-item">
                <a href="<?php get_url('event','LAplaysitself'); ?>">
                    <h3>Los Santos Plays Itself</h3>
                    <p class="meta">performance by <strong>Sebastian L&uuml;tgert</strong> featuring <strong>Robert Luxemburg</strong> as <strong>Kim Fowley Jr</strong>
                        <br />29.4.2017 at 5p.m.&thinsp;–&thinsp;9p.m. and 06.5.2017 at 5p.m.&thinsp;–&thinsp;9p.m.</p>
                </a>
            </article>

        </div>
    </div>
 ================================================== -->



<!--  =================================================================================================================
==========                                                                                                   ==========
==========                             Soon or running / Date secific                                        ==========
==========                                                                                                   ==========
=================================================================================================================== -->


<!-- Show this exhibition only until ...  -->
<?php if(mktime(0,0,0,9,12,2017) > strtotime('now')) { ?>

    <section class="currently">
        <!-- Start Currently -->
        <div class="row headline">
            <div class="col-md-12 col-sm-12 col-xs-12">

                <!-- Show soon opening until opening date, then currently running -->
                <?php if(mktime(0,0,0,9,9,2017) > strtotime('now')) { ?>

                        <h2>Upcoming</h2>

                <?php } else { ?>

                    <h2>Current</h2>

                <?php } ?>
                <!-- End date-specific headline -->

            </div>
        </div>

        <article class="exhibition-item">
            <a href="<?php get_url('event','express'); ?>">

                <div class="row">
                    <div class="col-md-12 col-sm-12 col-xs-12">
                        <h3>The Internet . Express</h3>
                        <p>launch of the new net-art sculpture by Jonas Lund. The sculpture is based on his work &#x201c;The Internet . Express&#x201d; (2017)</p>

                        <div class="image-wrapper">
                            <img src="https://jonaslund.biz/wp-content/uploads/2017/03/Screen-Shot-2017-03-12-at-21.14.21--1400x913.png" />
                        </div>
                        <p class="meta">9 September 2017 from 19:00&thinsp;–&thinsp;21:00</p>
                    </div>
                </div>

            </a>
        </article>

        <article class="exhibition-item">
            <a href="<?php get_url('event','exstrange'); ?>">
                <div class="row">
                    <div class="col-md-12 col-sm-12 col-xs-12">
                        <h3>#exstrange</h3>
                        <p>#exstrange exhibition catalogbook launch </p>

                        <div class="image-wrapper">
                            <img src="http://exstrange.com/wp-content/themes/exstrange-theme/images/logo-exstrange-animated-01.gif" />
                        </div>
                        <p class="meta">10 September 2017 from 11:00&thinsp;–&thinsp;18:00</p>
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

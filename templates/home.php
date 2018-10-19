
<!--  =================================================================================================================
==========                                                                                                   ==========
==========                             Events and recommendations (no images)                                ==========
==========                                                                                                   ==========
=================================================================================================================== -->


<section class="news">
    <!-- Start News
    <div class="row headline">
        <div class="col-md-12 col-sm-12 col-xs-12">
            <h2>panke.gallery recommends</h2>
        </div>
    </div>

    <div class="row">
        <div class="col-md-12 col-sm-12 col-xs-12">



        </div>
    </div>
     -->

    <!-- Start Events  -->
    <div class="row headline">
        <div class="col-md-12 col-sm-12 col-xs-12">
            <h2>Upcoming events of panke.gallery</h2>
        </div>
    </div>

    <div class="row">
        <div class="col-md-12 col-sm-12 col-xs-12">
	        <article class="news-item">
                <a href="https://netzkunst.berlin">
                    <h3>berlin infrastructure</h3>
                    <p>15:00&thinsp;-&thinsp;17:00 workshop<br>
                    Nadja Buttendorf<br>
                    17:00&thinsp;-&thinsp;19:00 panel<br>
                    Diana MacCarty, Pit Schulz (Moderation: Sakrowski)<br>
                    19:00&thinsp;-&thinsp;21:00 discussion<br>
                    Joachim Blank, tba</p>
                    <p class="meta">27 October 2018</p>
                </a>
            </article>

	      		<!--	<article class="news-item">
                <a href="<?php get_url('exhibition','MaxGrauStream'); ?>">
				<h3>Max Grau</h3>
                <p class="meta">[<s>workingtitle</s>]<br>
					[sudo keylogger /Users/machs/Büro/Ausstellungen/2018/2018_Panke/log.txt]<br>
					a Web-Performance-Series by <a href="https://www.max-grau.de"><strong>Max Grau</strong></a>
                           <br> next LIVE streams - <strong>tba after the 20 October 2018 </strong> </p></a>
            </article> -->

        </div>
    </div>

</section>


<!--  =================================================================================================================
==========                                                                                                   ==========
==========                             Soon or running / Date secific                                        ==========
==========                                                                                                   ==========
=================================================================================================================== -->

<!-- Show this exhibition only until ...  -->
<?php if(mktime(0,0,0,20,8,2018) > strtotime('now')) { ?>

    <section class="currently">
        <!-- Start Currently -->
        <div class="row headline">
            <div class="col-md-12 col-sm-12 col-xs-12">

                <!-- Show soon opening until opening date, then currently running -->
                <?php if(mktime(0,0,0,10,3,2018) > strtotime('now')) { ?>
                    <h2>Upcoming</h2>
                <?php } else { ?>
                    <h2>Current</h2>
                <?php } ?>
                <!-- End date-specific headline -->

            </div>
        </div>

        <article class="exhibition-item">

                <div class="row">
                    <div class="col-md-12 col-sm-8 col-xs-12">

                    <a href="<?php get_url('exhibition','zentrum-netzkunst'); ?>">
                        <div class="image-wrapper">
                          <img src="../img/netzkunst/ZentrumNetzkunst_2048.jpg" alt="Berlin, Zentrum der Netzkunst - damals und heute"  />
                        </div>
					</a>

                    <h3>Berlin, Zentrum der Netzkunst – damals und heute</h3>

                        <p class="meta">Group Show with <strong><a href="http://www.nadjabuttendorf.com"> Nadja Buttendorf</a> | <a href="http://simondenny.net"> Simon Denny</a> | <a href="https://harmvandendorpel.com/">Harm van den Dorpel</a> | <a href="http://www.constantdullaart.com">Constant Dullaart</a> | <a href="http://www.fuenfnullzwei.de">Holger Friese</a> | <a href="https://www.evagrubinger.com/">Eva Grubinger</a> | <a href="https://web.archive.org/web/19990429102029/http://www.icf.de:80/overview.html">Internationale Stadt Berlin</a> | <a href="https://web.archive.org/web/19990218073155/http://www.icf.de:80/jodi/message.html">Jodi</a> | <a href="https://jonaslund.biz/">Jonas Lund</a> | <a href="http://www.rolux.org">Sebastian L&uuml;tgert</a> | <a href="http://katjanovi.net/">Katja Novitskova</a> | <a href="http://www.sebastianschmieg.com">Sebastian Schmieg</a> | <a href="http://artwarez.org/">Cornelia Sollfrank</a> and t.b.a.</strong> <br>
								<br>
								<strong>Vernissage</strong> 4 October from 19:00&thinsp;–&thinsp; open end (free entry)<br>
                       4 October&thinsp;–&thinsp;23 November 2018 | opening times: Wed, Thu, Fri, Sat 15:00&thinsp;-&thinsp;19:00 and for special events<br>

	                        <br>
	                        curated by <a href="https://www.curatingyoutube.net">Sakrowski</a> and Tabea Rossol<br>
	                        funded by <a href="https://www.berlin.de/sen/kultur/">Berlin Senatsverwaltung für Kultur und Europa</a></p>
           					</div>
                </div>

        </article>
   </section> <!-- End Currently/Upcoming -->
<?php } ?>     <!-- End date-specific block -->



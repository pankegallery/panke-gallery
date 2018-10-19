
<!--  =================================================================================================================
==========                                                                                                   ==========
==========                             Events and recommendations (no images)                                ==========
==========                                                                                                   ==========
=================================================================================================================== -->
 
 
<section class="news">
    <!-- Start News -->
    <div class="row headline">
        <div class="col-md-12 col-sm-12 col-xs-12">
            <h2>panke.gallery recommends</h2>
        </div>
    </div>

    <div class="row">
        <div class="col-md-12 col-sm-12 col-xs-12">
            <article class="news-item">
                <a href="http://router.gallery/exhibition007.html"><h3>Public Library/Memory of the World</h3></a>
                <p class="meta">Libarian: Nenad Romic | <a href="http://www.router.gallery">router.gallery</a> at panke.gallery</p>
            </article>
        </div>
    </div>  
    
    
    <!-- Start Events 
    <div class="row headline">
        <div class="col-md-12 col-sm-12 col-xs-12">
            <h2>Upcoming events of panke.gallery</h2>
        </div>
    </div>

    <div class="row">
        <div class="col-md-12 col-sm-12 col-xs-12">
            <article class="news-item">
                <a href="<?php get_url('event','soundnight03'); ?>"><h3>SOUND NIGHT III</h3></a>
                <p class="meta">Wilted Woman (Live), MOMA (Live), Sparkasse Wedding (Live Set), DJ SchluchT, b2b, DJ Blue Stork | 3 Februar | 22:00 til open end (5€)</p>    
            </article>
        </div>
    </div>
    -->
</section>
     
     
<!--  =================================================================================================================
==========                                                                                                   ==========
==========                             Soon or running / Date secific                                        ==========
==========                                                                                                   ==========
=================================================================================================================== -->

<!-- Show this exhibition only until ...  -->
<?php if(mktime(0,0,0,4,20,2018) > strtotime('now')) { ?>

    <section class="currently">
        <!-- Start Currently -->
        <div class="row headline">
            <div class="col-md-12 col-sm-12 col-xs-12">

                <!-- Show soon opening until opening date, then currently running -->
                <?php if(mktime(0,0,0,3,31,2018) > strtotime('now')) { ?>
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
                    
                    			<br><h3>steam page - <a href="http://www.panke.gallery/stream">http://www.panke.gallery/stream</a> - only at the gallery opening times</h3>
                    			<h3>ASCIIBlaster - <a href="https://asdf.us/asciiblaster/">https://asdf.us/asciiblaster/</a></h3>
                    			<h3>IRC server - <a href="http://irc.asdf.us">http://irc.asdf.us</a></h3><br>



                            <a href="<?php get_url('exhibition','streamInstreamOut'); ?>">

                    
                        <div class="image-wrapper">
                           <img src="/img/streamInOut/streamfb.png" />
                        </div> 
			</a>

                            <h3>STREAM IN - STREAM OUT</h3>
                        
                        <p class="meta">a duo show with Karl Heinz Jeron and Jules LaPlace<br>

                        
                        31 March&thinsp;–&thinsp;19 April 2018 | opening times: Wed, Thu, Fri and Sat 3&thinsp;-&thinsp;8 pm and for special events<br>
	                        <strong>Vernissage</strong> 31 March from 19:00&thinsp;–&thinsp;21:00 (free entry)<br></p> 
           					</div>
                </div>
                
        </article>
        
        <br>
        
        <article class="exhibition-item">
           <div class="row">
                    <div class="col-md-12 col-sm-8 col-xs-4">
	                     <a href="<?php get_url('event','soundnight04'); ?>">
	            <div class="image-wrapper">
                            <img src="/img/soundnight/soundnight4/fbcover6.png" />
                        </div> 

	             </a>

                        <h3>panke.gallery SOUND NIGHT 4 &mdash; itskiny &mdash; Monotrail &mdash; RCO &mdash; Ioana Vreme Moser &amp; Klaas H&uuml;bner</h3>
                            <p class="meta">31 March 2018 <strong>Doors:</strong> 21:00 (5€) START: 22:00<br>
                    </div>
                    
                </div>
                           
                
            
        </article>
        
    </section> <!-- End Currently/Upcoming -->
<?php } ?>     <!-- End date-specific block -->


        
<!--  =================================================================================================================
==========                                                                                                   ==========
==========                             Soon or running / Date secific                                        ==========
==========                                                                                                   ==========
=================================================================================================================== -->

<!-- Show this exhibition only until ...  -->
<?php if(mktime(0,0,0,2,22,2018) >= strtotime('now')) { ?>

    <section class="currently">
        <!-- Start Currently -->
        <div class="row headline">
            <div class="col-md-12 col-sm-12 col-xs-12">

                <!-- Show soon opening until opening date, then currently running -->
                <?php if(mktime(0,0,0,2,3,2018) >= strtotime('now')) { ?>
                    <h2>Upcoming</h2>
                <?php } else { ?>
                    <h2>Current</h2>
                <?php } ?>
                <!-- End date-specific headline -->

            </div>
        </div>

        <article class="exhibition-item">
            <a href="<?php get_url('exhibition','blackScre'); ?>">

                <div class="row">
                    <div class="col-md-12 col-sm-12 col-xs-12">
                        <h3>BLACK SCRE</h3>
                        <p>a sound installation by <strong>Kim Asendorf</strong> (DAM Gallery) and  <strong>Ole Fach</strong></p>
                        <p class="meta">3 Februar&thinsp;–&thinsp;22 Februar 2018 | opening times: Thu, Fri 3&thinsp;-&thinsp;7 pm and Sat 3&thinsp;-&thinsp;8 pm and for special events<br>
	                   <strong>Vernissage</strong> 03 Februar from 19:00&thinsp;–&thinsp;21:00 (free entry)<br>
                        </p> 
                        <img src="../img/blackScre/TV-BlackScre.png" class="img-fluid" /> 
                        
                    </div>
                </div>
                
            </a>
        </article>
        
    </section> <!-- End Currently/Upcoming -->
<?php } ?>     <!-- End date-specific block -->


        




<!--  =================================================================================================================
==========                                                                                                   ==========
==========                             Soon or running / Date secific                                        ==========
==========                                                                                                   ==========
=================================================================================================================== -->
 
 
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
  
                        
        </div>
    </div>
    
    -->
       
    <!--========================== END NEWS/EVENTS -->

<!-- Show this exhibition only until ...  -->
<?php if(mktime(0,0,0,1,26,2018) > strtotime('now')) { ?>

    <section class="currently">
        <!-- Start Currently -->
        <div class="row headline">
            <div class="col-md-12 col-sm-12 col-xs-12">

                <!-- Show soon opening until opening date, then currently running -->
                <?php if(mktime(0,0,0,1,13,2018) > strtotime('now')) { ?>
                    <h2>Upcoming</h2>
                <?php } else { ?>
                    <h2>Current</h2>
                <?php } ?>
                <!-- End date-specific headline -->

            </div>
        </div>

        <article class="exhibition-item">
            <a href="<?php get_url('exhibition','InternetFame'); ?>">

                <div class="row">
                    <div class="col-md-12 col-sm-12 col-xs-12">
                        <h3>Internet Fame</h3>
                        <p>panke.gallery proudly presents <strong>Internet Fame</strong> a group show in the frame of <strong>the wrong digital art biennale</strong>. Curated by the clusterduck collective and panke.gallery</p>
                        <br>
                        <p>The <em>Internet Fame</em> exhibition-project is hosting a special evening of performances and life music, exploring the shifting grounds of Fame in the age of interconnection.
                        <strong>Much Fame, Very Party</strong> 20 Januar Doors from 19:00&thinsp;–&thinsp;Start 21:00 til open end <br> with <strong> <a href="http://byrkelou.com/">Byre Lou</a> || <a href="http://maracassiani.tumblr.com/">Mara Oscar Cassiani </a>|| <a href="https://soundcloud.com/aghnie">Aghnie </a>|| <a href="https://soundcloud.com/ce-bon-vieux-julio">Meta Julio</a>  || <a href="http://giek-1.com/">Giek_1 </a> || <a href="https://soundcloud.com/user-808215774">SELAM X</a> || <a href="https://soundcloud.com/ojos-negros">S x m b r a</a> || and <a href="https://soundcloud.com/harakiri-hustle">Harakiri Hustle</a> </strong> <br> (entry free offer from 5 - 10€)</p>

                        <div class="image-wrapperVertical">
                            <a href="https://www.facebook.com/events/161002084521011/"><img src="/img/InternetFame/MFVP_V2_low.jpg" /></a>
                        </div> 
                        <p class="meta">13 Januar&thinsp;–&thinsp;26 Januar 2018 | opening times: Wed, Thu, Fri and Sat 3&thinsp;-&thinsp;8 pm and for special events<br>
	                        </p> 
                    </div>
                </div>
                
            </a>
        </article>
        
        <article class="exhibition-item">
            <a href="<?php get_url('exhibition','#'); ?>">

                <div class="row">
                    <div class="col-md-12 col-sm-12 col-xs-12">
                        <h3>BLACK SCRE</h3>
                        <p>panke.gallery proudly presents <strong>BLACK SCRE</strong> a sound installation by <strong>Kim Asendorf</strong> (DAM Gallery) and  <strong>Ole Fach</strong>.
	                        <br>
	                        At the end of the screen there is no visual content left.<br> 
For the Panke.Gallery, Asendorf and Fach have designed a bizarre, fictive and site specific multimedia device landscape. The devices transmit only selected and computed acoustic signals and show no visual content, except pure black. They are declaring the visual channel for redundant. In this seemingly familiar world, the visitor moves through an unreal soundscape and gets an vague impression of life after screen.
</p>

                        <div class="image-wrapper">
                            <a href="#"><img src="/img/blackScre/TV-BlackScre.png" /></a>
                        </div> 
                        <p class="meta">3 Februar&thinsp;–&thinsp;22 Februar 2018 | opening times: Thu, Fri 3&thinsp;-&thinsp;7 pm and Sat 3&thinsp;-&thinsp;8 pm and for special events<br>
	                        <strong>Vernissage</strong> 03 Februar from 19:00&thinsp;–&thinsp;21:00 (free entry)<br>
                        </p> 
                    </div>
                </div>
                
            </a>
        </article>
        
        <article class="exhibition-item">
            <a href="<?php get_url('event','soundnight03'); ?>">

                <div class="row">
                    <div class="col-md-12 col-sm-12 col-xs-12">
                        <h3>SOUND NIGHT 3</h3>
                        <p>panke.gallery proudly presents <strong>SOUND NIGHT 3</strong> with <strong><a href="https://wiltedwoman.bandcamp.com">Wilted Woman</a></strong> (Live) <strong><a href="https://musicofmodernart.blogspot.de/?m=1">MOMA</a></strong> (Live) <strong><a href="https://sparkasse.wedding">Sparkasse Wedding</a></strong>(Live Set)<strong><a href=" http://jollo.org/LNT/home/ShlucHT/">DJ SchluchT</a></strong> b2b <strong><a href=" https://soundcloud.com/potdl">DJ Blue Stork</a></strong></p>    

                       
                        <p class="meta">3 Februar –– Start 22:00 til open end (5€)
	                        
                        </p> 
                         <div class="image-wrapperVertical">
                            <a href="<?php get_url('event','soundnight03'); ?>"><img src="/img/soundnight/soundnight03/Sn3.png" /></a>
                        </div> 
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
                <a href="http://router.gallery/exhibition007.html"><h3>Public Library/Memory of the World</h3></a>
                <p>
                    Libarian: <a href="http://kom.uni.st"> Nenad Romic</a>                    
                </p>
                <div class="image-wrapper">
                    <img src="http://router.gallery/images/lsb.png" />
                </div>
                <p class="meta">
                    Vernissage <a href="http://www.router.gallery">router.gallery</a> at panke.gallery | Vernissage 29 November 2017 19:00 
                </p>
            </article>
            
                
        </div>
    </div>

    <!-- Add NEWS/EVENTS here      
 ================================================== -->


</section>
<!-- End News -->

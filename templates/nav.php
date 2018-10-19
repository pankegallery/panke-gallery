                    <?php $page = $page = $_GET['p']; ?>
                    <nav id="nav-main">
                        <ul>
                            <li><a <?php if($page == 'exhibitions' || $page == 'exhibition') echo 'class="highlight-color"'; ?> href="<?php get_url('exhibitions'); ?>">Exhibitions</a></li>
                            <li><a <?php if($page == 'events' || $page == 'event') echo 'class="highlight-color"'; ?> href="<?php get_url('events'); ?>">Events</a></li>
                            <li><a <?php if($page == 'info') echo 'class="highlight-color"'; ?> href="<?php get_url('info'); ?>">Info</a></li>
                            <li><a <?php if($page == 'contact') echo 'class="highlight-color"'; ?> href="<?php get_url('contact'); ?>">Contact</a></li>
                        </ul>

                    </nav>
                    <nav id="nav-satellite">
                        <ul>
                            <li><a <?php if($page == 'edition') echo 'class="highlight-color"'; ?> href="<?php get_url('edition'); ?>">Edition</a></li>
                            <li><a href="http://router.gallery" target="_blank">Router</a></li>
<!--                            <li><a href="http://reading.panke.gallery" target="_blank">Reading</a></li>-->
                        </ul>
                    </nav>

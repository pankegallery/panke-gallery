<?php

function make_url(){

    switch(func_num_args()){
        case 1:
            $page = func_get_arg(0);
        break;

        case 2:
            $page = func_get_arg(0);
            $subpage = func_get_arg(1);
        break;
    }

//    ======  CLassic URL, no rewrite =====

//    $url = $_SERVER['PHP_SELF'];
//    $url .= '?p=';
//    $url .= $page;
//
//    switch($page){
//        case event:
//        case exhibition:
//            $url .= '&e=';
//            $url .= $subpage;
//        break;
//    }

//    ======  CLassic URL, no rewrite =====

    $url = 'http://'.$_SERVER['SERVER_NAME'];
    $url .= '/';
    $url .= $page;

    switch($page){
        case event:
        case exhibition:
            $url .= '/';
            $url .= $subpage;
        break;
    }



    return $url;
};

function get_url(){

    switch(func_num_args()){
        case 1:
            $page = func_get_arg(0);
            echo make_url($page);
        break;

        case 2:
            $page = func_get_arg(0);
            $subpage = func_get_arg(1);
            echo make_url($page, $subpage);
        break;
    }

}

?>

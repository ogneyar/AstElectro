import $ from 'jquery'

export default function scrollUp(to = 0){
    if (window.pageYOffset !== to) { // window.pageYOffset - высота прокрутки с верху
        $('html, body').animate(
            {scrollTop: to}, 
            700, 
            function(){}
        )
    }
}
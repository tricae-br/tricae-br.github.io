$( document ).ready(function() {

    //Accordion
    $('.ui.accordion')
        .accordion()
    ;

    //Popup
    $('.element-pop')
        .popup()
    ;

    //Tab
    $('.tabular .item')
        .tab()
    ;

    //Loader
    $('.loaderActive').click(function(){
        $('body').append('<div class="lay-dimmer fixed"><div class="ui active loader"></div></div>');
    });

});


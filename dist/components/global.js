$( document ).ready(function() {
    //Message - Button Close
    $('.message .close').on('click', function() {
        $(this).closest('.message').fadeOut();
    });

    //Dropdown
    $('select.dropdown')
        .dropdown()
    ;

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

});


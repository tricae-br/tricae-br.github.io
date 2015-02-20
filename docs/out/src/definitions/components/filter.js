$( document ).ready(function() {
    $('.filter-box input:checked').parent().parent().addClass('active');

    $('.filter-box input').click(function(){
        $(this).parent().parent().toggleClass('active');
    });
});
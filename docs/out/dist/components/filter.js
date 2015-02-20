$( document ).ready(function() {
    $('.filter input:checked').parent().parent().addClass('active');

    $('.filter input').click(function(){
        $(this).parent().parent().toggleClass('active');
    });
});
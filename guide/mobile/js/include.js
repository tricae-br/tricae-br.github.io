$( document ).ready(function() {
    $("#menuLateral").load("http://tricae-br.github.io/guide/mobile/partial/menu-lateral.html");
    $("#header").load("http://tricae-br.github.io/guide/mobile/partial/header.html");
    $("#menuList").load("http://tricae-br.github.io/guide/mobile/partial/menu-list.html");

    //Menu
    $('#menuLateral').show();
    $('#menuLateral').mmenu();
});


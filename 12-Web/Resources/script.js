$.get("Resources/navbar.html", function(data){
    $("#myNavBarSite").replaceWith(data);
});
$.get("/Resources/footer.html", function(data){
    $("#myFooterSite").replaceWith(data);
});
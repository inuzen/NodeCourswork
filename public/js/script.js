$(".about").on('click', (e) => {
  e.preventDefault();
  $('.modal').toggle();
});

$("#link").on('focus', (e) => {
      $("#link").text("");
});
$("#link").on('blur', (e) => {

      if(!$("#link").text())
        $("#link").text("Paste a link to market");
});


$(".category-title").mouseover(function() {
    $(this).removeClass("ellipsis");
    var maxscroll = $(this).width();
    var speed = maxscroll * 15;
    $(this).animate({
        scrollLeft: maxscroll
    }, speed, "linear");
});

$(".category-title").mouseout(function() {
    $(this).stop();
    $(this).addClass("ellipsis");
    $(this).animate({
        scrollLeft: 0
    }, 'slow');
});

$( function() {
  $('.tab').click(function(){
    let tab_id = $(this).attr('data-tab');

    $('.tab').removeClass('current');
    $('.item-container').removeClass('current');

  $(this).addClass('current');
  $("#"+tab_id).addClass('current');
});

$(".btn-card-delete").each(function () {

$(this).on('click', () => {
  $.ajax({
      url: "/delete",
      type: "POST",
      dataType: "text",
      data: {id: $(this).attr("data-id")},
      success: function (data) {
        console.log("deleted");
      }
  });
});
});

$("#add_btn").on('click', () => {
  let link = $("#link").text()
  $.ajax({
    url: "/add",
    type: "POST",
    dataType: "text",
    data: {link: link},
    succes: function (data) {
      console.log(data);
    }

  });

});
} );

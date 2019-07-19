$(".about").on('click', (e) => {
  e.preventDefault();
  $('.modal').toggle();
});

$("#link").on('focus', (e) => {
      $("#link").text("");
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

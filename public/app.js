var comment_form;

//  =============   comment button   =============================
$(document).on("click", ".comment-btn", function(e) {
  e.preventDefault();
  //var target = e.target;
  $('.comment-btn').hide();
  console.log("this:" + this);
  //  id of article
  var thisId = $(this).parent().attr("data-id");
  
  // make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })  
    .then(function(data) {      

      comment_form = 
        `<form id='comment_form'>
            <input id='new-comment-title' name='title' placeholder='title'>
            <input id='new-comment-body' name='body' placeholder='comment...' />
            <button data-id="${thisId}" id='savenote'>Save Note</button>
            <button class="btn btn-danger" id="close">X</button>
          </form>`;    
      
       // If there's a note in the article
       if (data.comment && data.comment.body !== "") {
           
        $("#" + thisId + "").append(`<h5 id='comment-title'>${data.comment.title}</h5>`);
        $("#" + thisId + "").append(`<p id='comment-body'>${data.comment.body}</p>`);  
        $("#new-comment-title").val(`${data.comment.title}`);
        $("#new-comment-body").text(`${data.comment.body}`);      
      } 

      $("#" + thisId + "").append(comment_form);   
    });
});


//================      Save Comment button    ======================
$(document).on("click", "#savenote", function(e) {
  e.preventDefault();
  // Article Id
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,    
    data: {
      // Value taken from title input
      title: $("#new-comment-title").val(),
      // Value taken from note textarea
      body: $("#new-comment-body").val()
    },
    success: location.reload()
  })    
    .then(function(data) {
      console.log(data);
    });

  $("#new-comment-title").val("");
  $("#new-comment-body").val("");
});


//================      Close Comment button    ======================
$(document).on("click", "#savenote", function(e) {
    e.preventDefault();
    //var target = e.target;
    comment_form = null;
    $('.comment-btn').show();
});

//================      Save Article button    ======================
$(".save").on("click", function(e) {
  e.preventDefault();
  $(".comment-btn").show();
  var thisId = $(this).parent().attr("data-id");
  $.ajax({
      method: "PUT",
      url: "/articles/" + thisId,
      success: location.reload()
  }).done(function(data) {
    console.log(data);
   
  })
});


//================      Delete Article button    ======================
$(".delete").on("click", function(e) {
  e.preventDefault();
  var thisId = $(this).parent().attr("data-id");  
  $.ajax({
    method: "PUT",
      url: "/articles/delete/" + thisId,
    success: location.reload()
  }).done(function(data) {
    console.log(data);
  })
});

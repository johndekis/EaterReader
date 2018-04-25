//comment button
$(document).on("click", ".comment-btn", function() {
  // Empty the comments from the note section
  //console.log($(this));

  //$(".comments").empty();
  // Save the id from the p tag
  var thisId = $(this).parent().attr("data-id");
  $('[data-id=' + thisId + '].comments').empty();

  //console.log(thisId);

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log(data._id);
     //console.log(thisId);
      //console.log(data);
      // The title of the article
      $("#" + thisId + "").append("<p>" + data.title + "<p>");

      // An input to enter a new title
      $("#" + thisId + "").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#" + thisId + "").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#" + thisId + "").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      // If there's a note in the article
      if (data.comment) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.comment.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.comment.body);
      }
    });
});

//save comment button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("[data-id=" + data._id + "].comments").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});

//Handle Save Article button
$(".save").on("click", function() {
  var thisId = $(this).parent().attr("data-id");
  $.ajax({
      method: "PUT",
      url: "/articles/" + thisId,
      success: location.reload()
  }).done(function(data) {
    console.log(data);
   
  })
});

//Handle Delete Article button
$(".delete").on("click", function() {
  var thisId = $(this).parent().attr("data-id");
  //console.log(thisId);
  $.ajax({
    method: "PUT",
      url: "/articles/delete/" + thisId,
    success: location.reload()
  }).done(function(data) {
  
  })
});

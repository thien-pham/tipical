console.log("working!");
$('#sub').click(function(event){
  console.log('yup');
  $.get('https://arcane-retreat-92908.herokuapp.com/').then((val)=>{
  $.ajax({
        url: "https://arcane-retreat-92908.herokuapp.com/",
        type: 'GET',
        dataType: 'json',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Basic bHVpZ2lAZ21haWwuY29tOmFiYzEyMzQ1');
        },
        data: '{ "comment" }',
      success: function (){alert('Thanks for your comment!'); 
    }});
// });
  //beforeSend: function (xhr) {
  //    xhr.setRequestHeader ("Authorization", "Basic " + btoa(username + ":" + password));
  //},
  //$.submit()
});});

console.log("working!");
$('#sub').click(function(event){
 event.preventDefault();
 console.log($('#postData').val());
 $.ajaxSetup({
   headers: { 'Authorization': "Basic root:root" }
 });
 $.ajax({
           type: "POST",
           url: "/posts",
           data: {"body": "Testing!","location": [0,0]}
 });
});
let populateList = function(val){
  let html = '';
  val.forEach((val)=>{
    html+=`
      <div class="ui message grey column">
        <div class="ui menu">
          <p class="header item">${val.points.length}</p>
          <p class = "header item">${val.location}</p>
          <p class = "header item">${val.username}</p>
          <p class="header item floated right">${val.date}</p>
        </div>
        <div><p>${val.body}</p></div>
      </div>

    `;
  });
  $('#posts').html(html);
};

$("#sub").on('click',(event)=>{
  event.preventDefault();
  // $.get('https://arcane-retreat-92908.herokuapp.com/user_posts').then((val)=>{
  //   console.log("rendering default view");
  //   populateList(val);
  // });
  let username = $("#uname").val();
  let pw = $("#pw").val();

  fetch('https://arcane-retreat-92908.herokuapp.com/user_posts', {
      method: 'get',
      headers: {
          'Accept':'application/json',
          'Content-Type':'application/json',
          'Authorization' : `Basic ${btoa(username + ":" + pw)}`
      }
  })
  .then(result => {
    return result.json();
  }).then((result)=>{
    populateList(result);
  });
});

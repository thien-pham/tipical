console.log('test!');
$.get('https://arcane-retreat-92908.herokuapp.com/').then((val)=>{
  val.forEach((val)=>{
    console.log(val);
    $('.container').append(`
      <div class="ui message grey column">
        <div class='ui menu'>
          <p class="header item">
            ${val.location[0]}, ${val.location[1]}
          </p>
          <p class="header item floated right">
          ${val.date}
          </p>
        </div>
      <div>
      <p>
        ${val.body}
      </p>
    </div>`);
  });
});

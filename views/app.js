console.log('test!');
let renderList = function(lat,lon){
  console.log(`lat: ${lat}, lon: ${lon}`);
  if(lat == undefined || lon == undefined){
    $.get('https://arcane-retreat-92908.herokuapp.com/').then((val)=>{
      console.log("rendering default view");
      populateList(val);

    });
  }else{
    $.get(`https://arcane-retreat-92908.herokuapp.com/?lat=${lat}&lon=${lon}`).then((val)=>{
      console.log("rendering Secondary view");
      populateList(val);

    });
  }
};

renderList();

let populateList = function(val){
  val.forEach((val)=>{
    console.log(val);
    $('.container').append(`
      <div class="ui message grey column">
        <div class='ui menu'>
        <p class="header item">
          ${val.points.length}
        </p>
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
};

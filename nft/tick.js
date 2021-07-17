var price = document.getElementById("displaySlot");
var updTime = document.getElementById("updTime");
var Arrow = document.querySelector('.arrowUp');
var curPrice;
var prePrice = 0;

function getPrice (){
  var url = "https://api.coindesk.com/v1/bpi/currentprice.json";
  var symbol = "USD";
  fetch(url)
    .then(function(response){
    return response.json();
  })
    .then(function(data){
    curPrice = data.bpi[symbol].rate;
    if(curPrice>prePrice){
      Arrow.classList.remove('arrowDown');
      Arrow.classList.add('arrowUp');
    } else if(curPrice<prePrice){
      Arrow.classList.remove('arrowUp');
      Arrow.classList.add('arrowDown');
    }
    price.innerHTML = data.bpi[symbol].symbol + curPrice + " ";
    updTime.innerHTML = new Date().toLocaleString();
    prePrice = curPrice;
  });
}
setInterval(getPrice,1000);

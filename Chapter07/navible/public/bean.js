$(document).ready(function(){
  var buffer_string = JSON.parse("[" + $('#buffer_value').html() + "]");
  console.log("buffer:  [192, 5, 0, 32, 130, 0, 0, 0, 141, 176]")
  console.log("buffer: ", buffer_string);

  // Do some stuff to translate it.

  human_readable_value = new BeanData(buffer_string)['data'];

  console.log("HRV: " + human_readable_value)
 $('#human_readable_value').html(JSON.stringify(human_readable_value));
})

$(document).on('change', '#rgb input', function() {
  setLED();
})

function setLED() {
  var r = $('#rgb input[name=red]')[0].value;
  var g = $('#rgb input[name=green]')[0].value;
  var b = $('#rgb input[name=blue]')[0].value;

  var messageBuilder = new BeanMessage();
  var hex_value = messageBuilder.setLED(r, g, b).toString('hex');
  console.log(r,g,b,hex_value)
  $('#rgb input[name=new_value]').val(hex_value)
}

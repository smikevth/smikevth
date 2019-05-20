define(function(){

  var intro1 = "Hi. I'm %Smi+th+%.0"
  var intro2 = " I make websites.";
  var kevin = "Kev+in+";
  var $stage;
  var $output;
  var strongOpen = false;
  var spanOpen = false;
  var emOpen = false;
  var timeouts = [];
  var spd = 100;
  var pause1 = 1000; //delay before start of kev into smith
  var pause2 = 3000; //delay before start of intro2
  var pause3 = 1000; //delay at end of intro, before projects fade in

  function init(){
    setSelectors();
    parseIntro1();
  }

  function setSelectors() {
    $stage = $("#stage");
    $output = $stage.find(".intro");
  }

  function parseIntro1() {
    for(var i=0; i<intro1.length; i++) {
      switch(intro1[i]) {
        case "%":
          if(!strongOpen) {
            strongOpen = !strongOpen;
            appendString("#stage .intro", "<strong></strong>", spd*i);
          }
          else {
            strongOpen = !strongOpen;
          }
          break;
        case "S":
          appendString("#stage .intro strong", "S", spd*i);
          appendString("#stage .intro strong", "<span class='kev'></span>", spd*i);

          parseKevin();
          break;
        case "+":
          if(!spanOpen) {
            spanOpen = !spanOpen;
            appendString("#stage .intro strong", "<span class='th'></span>", spd*i);
          }
          else {
            spanOpen = !spanOpen;
          }
          break;
        case "0":
          parseIntro2(i);
          break;
        default:
          if(strongOpen) {
            if(emOpen) {
              appendString("#stage .intro strong em", intro1[i], spd*i);
            }
            else if(spanOpen) {
              appendString("#stage .intro strong .th", intro1[i], spd*i);
            }
            else {
              appendString("#stage .intro strong", intro1[i], spd*i);
            }
          }
          else {
            appendString("#stage .intro", intro1[i], spd*i);
          }
      }
    }
  }

  function parseKevin() {
    for(var i=0; i<kevin.length; i++) {
      if(kevin[i] =="+") {
        if(!emOpen) {
          emOpen = !emOpen;
          appendString("#stage .intro strong .kev", "<em></em>", spd*9+(spd*i));
        }
        else {
          emOpen = !emOpen;
        }
      }
      else {
        if(emOpen) {
          appendString("#stage .intro strong .kev em", kevin[i], spd*9+(spd*i));
        }
        else {
          appendString("#stage .intro strong .kev", kevin[i], spd*9+(spd*i));
        }
      }
    }
  }

  function parseIntro2() {
    for(var i=0; i<intro2.length; i++) {
      appendString("#stage .intro", intro2[i], spd*14+pause1+pause2+(spd*i));
    }
    let timeout = setTimeout(function(){
      $output.addClass("smikevth");
    }, spd*14+pause1);
    timeouts.push(timeout);
  }

  function appendString(target, str, delay) {
    let timeout = setTimeout(function(){
      $(target).append(str)
    }, delay);
    timeouts.push(timeout);
  }

  function destroy() {

  }

  return {
    init: init,
    destroy: destroy
  }
});

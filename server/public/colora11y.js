function display_entered_alternative_colors(){
    e1=document.getElementById("entered-c1");
    e1.id="display-entered-1";

    e2=document.getElementById("entered-c2");
    e2.id="display-entered-2";

    e3=document.getElementById("entered-c3");
    e3.id="display-entered-3";

    e4=document.getElementById("entered-c4");
    e4.id="display-entered-4";

    e5=document.getElementById("entered-c5");
    e5.id="display-entered-5";

   a1=document.getElementById("alternative-c1");
   a1.id="new1";

   a2=document.getElementById("alternative-c2");
   a2.id="new2";

   a3=document.getElementById("alternative-c3");
   a3.id="new3";

   a4=document.getElementById("alternative-c4");
   a4.id="new4";

   a5=document.getElementById("alternative-c5");
   a5.id="new5";
}

function clear_input() {
  var form = document.getElementById("form")
  form.reset()
}
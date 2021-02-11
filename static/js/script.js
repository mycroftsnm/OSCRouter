var x=y=0;
var flag=0;
var flag2=0;




function myFunction() {
    if(!flag){
      x++;
      y++;
      var  hr = document.createElement("HR");

      window[`line${x}`] = document.createElement("div");
      window[`line${x}`].classList.add("margin");
      window[`line${x}`].name = window[`line${x}`];

      window[`secondline${x}`] = document.createElement("div");
      window[`secondline${x}`].classList.add("margin");
      window[`secondline${x}`].id = `secondline${x}`;


      document.getElementById('formu').appendChild( window[`line${x}`]);
      document.getElementById('formu').appendChild(window[`secondline${x}`]);

      window[`line${x}`].appendChild(hr);

      num = document.createElement("input");
      num.name = "num";
      num.id= "num_id";
      num.type="hidden";

      bind_name = document.createElement("input");
      bind_name.placeholder = "Name";
      bind_name.name = `bind_name${x}`;
      bind_name.id = `bind_name${x}`;
      bind_name.classList.add("input_entry")

      in_address = document.createElement("input");
      in_address.placeholder = "Input address";
      in_address.classList.add("input_entry");
      in_address.name = `in_address${x}`;
      in_address.id = `in_address${x}`;

      protocol =  document.createElement("select");
      protocol.onchange= function(){ myFunction3()};
      protocol.id = `protocol${x}`
      midi = document.createElement("option");
      osc = document.createElement("option");
      midi.innerHTML = "MIDI";
      osc.innerHTML = "OSC";
      osc.value = 'osc';
      midi.value = 'midi';

      protocol.classList.add("selector");
      protocol.add(midi);
      protocol.add(osc);




      min_in_value = document.createElement("input");
      min_in_value.name = `min_in_value_name${x}`;
      min_in_value.id = `min_in_value${x}`;
      min_in_value.placeholder = "Min in";
      min_in_value.type="number";
      min_in_value.classList.add("min_max");

      max_in_value = document.createElement("input");
      max_in_value.name = `max_in_value_name${x}`;
      max_in_value.id = `max_in_value${x}`;
      max_in_value.placeholder = "Max in";
      max_in_value.type="number";
      max_in_value.classList.add("min_max");


      window[`line${x}`].appendChild(num);
      window[`line${x}`].appendChild(window['bind_name']);
      window[`secondline${x}`].appendChild(in_address);
      window[`secondline${x}`].appendChild(min_in_value);
      window[`secondline${x}`].appendChild(max_in_value);



      window[`line${x}`].appendChild(protocol);

      arrow = document.createElement("label");
      arrow.innerHTML= "&rarr;";
      window[`secondline${x}`].appendChild(arrow);

      flag=1;
      flag2=0;


    }
}



function myFunction3(){
    if(!flag2){

        document.getElementById('num_id').value=x;


        out_address = document.createElement("input");
        out_address.name = `out_address${x}`;
        out_address.id = `out_address${x}`;
        out_address.placeholder = "Output address";
        out_address.classList.add("entry");

        out_port = document.createElement("input");
        out_port.name = `out_port${x}`;
        out_port.id = `out_port${x}`;
        out_port.placeholder = "Output port";
        out_port.classList.add("entry");

        out_ip = document.createElement("input");
        out_ip.name = `out_ip${x}`;
        out_ip.id = `out_ip${x}`;
        out_ip.placeholder = "Output ip";
        out_ip.classList.add("entry");

        window[`cant${x}`] = document.createElement("input");
        window[`cant${x}`].name = `cant${x}`;
        window[`cant${x}`].id= `cant${x}`;
        window[`cant${x}`].type="hidden";
        window[`cant${x}`].value=0;

        window[`argument_div${x}`] = document.createElement("div");
        window[`argument_div${x}`].classList.add('argument_div');
        window[`secondline${x}`].appendChild(window[`argument_div${x}`]);



        window[`add_argument${x}`] = document.createElement("button");
        window[`add_argument${x}`].type = "button";
        window[`add_argument${x}`].setAttribute('number',x);
        window[`add_argument${x}`].setAttribute('cant', 0);
        window[`add_argument${x}`].classList.add("btn","btn-outline-primary","btn-sm","margin");
        window[`add_argument${x}`].onclick= function() {
            a = parseInt(this.getAttribute('cant'));
            this.setAttribute('cant',a+1);

            document.getElementById(`cant${this.getAttribute('number')}`).value = a+1;

            myFunction5(this.getAttribute('number'),this.getAttribute('cant'));
        }
        window[`add_argument${x}`].innerHTML = "Argument +";

///////////////////////////////////////////////////////////////////////////////
        window[`remove_argument${x}`] = document.createElement("button");
        window[`remove_argument${x}`].type = "button";
        window[`remove_argument${x}`].setAttribute('number',x);
        window[`remove_argument${x}`].classList.add("btn","btn-outline-danger","btn-sm","margin");
        window[`remove_argument${x}`].onclick= function() {

            cant = parseInt(window[`add_argument${this.getAttribute('number')}`].getAttribute('cant'));

            document.getElementById(`${this.getAttribute('number')}argument${cant}`).remove();

            window[`add_argument${this.getAttribute('number')}`].setAttribute('cant',cant-1)

            document.getElementById(`cant${this.getAttribute('number')}`).value = cant-1;
        }

        window[`remove_argument${x}`].innerHTML = "-";



        window[`output_div${x}`] = document.createElement("div");
        window[`output_div${x}`].classList.add('argument_div');
        window[`output_div${x}`].appendChild(out_address);
        window[`output_div${x}`].appendChild(out_ip);
        window[`output_div${x}`].appendChild(out_port);
        window[`output_div${x}`].appendChild(window[`add_argument${x}`]);
        window[`output_div${x}`].appendChild(window[`remove_argument${x}`]);
        window[`line${x}`].appendChild(window[`cant${x}`]);
        window[`line${x}`].appendChild(window[`output_div${x}`]);

        flag=0;
        flag2=1;
    }
}

function myFunction5(x_value,cant){

    osc_argument = document.createElement("input");
    osc_argument.name = `${x_value}argument${cant}`;
    osc_argument.id = `${x_value}argument${cant}`;
    osc_argument.classList.add('argument_entry');
    osc_argument.placeholder="argument";




    window[`argument_div${x_value}`].appendChild(osc_argument);
    //window[`secondline${x_value}`].appendChild(osc_argument);
}



function autofill(preset_name, listen_ip, listen_port, out_ip, out_port, default_out_ip, default_out_port,
 preset_number, name, in_address, in_min, in_max, out_address){

    myFunction();
    myFunction3();
    console.log(preset_number);
    document.getElementById(`preset_name`).value = preset_name;
    document.getElementById(`listen_ip`).value = listen_ip;
    document.getElementById(`listen_port`).value = listen_port;
    document.getElementById(`out_ip${preset_number}`).value = out_ip;
    document.getElementById(`out_port${preset_number}`).value = out_port;
    document.getElementById(`default_out_ip`).value = default_out_ip;
    document.getElementById(`default_out_port`).value = default_out_port;
    document.getElementById(`bind_name${preset_number}`).value = name;
    document.getElementById(`in_address${preset_number}`).value = in_address;
    document.getElementById(`min_in_value${preset_number}`).value = in_min;
    document.getElementById(`max_in_value${preset_number}`).value = in_max;
    document.getElementById(`out_address${preset_number}`).value = out_address;

    document.getElementById(`protocol${preset_number}`).value = "osc";

}


function fill_argument(preset_number, argument_number ,msg){

    window[`add_argument${preset_number}`].click();
    document.getElementById(`${preset_number}argument${argument_number}`).value = msg;


}
/*    document.getElementById('preset_name').value=preset_name;
    document.getElementById('listen_ip').value=listen_ip;
    document.getElementById('listen_port').value=listen_port;
    document.getElementById('out_ip').value=out_ip;
    document.getElementById('out_port').value=out_port;*/

function removeBind (){

    var r = confirm ("Remove last bind?");
    if (r == true){
        window[`line${x}`].remove();
        window[`secondline${x}`].remove();
        x -= 1;
        flag = 0;
    }
}
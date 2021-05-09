var x=0;
var flag=0;
var flag2=0;



class Bind {
  constructor(id) {
    this.id = id;
    this.arg_id = 0;
    this.first_line = document.createElement("div");
    this.first_line.classList.add("line");
    this.second_line = document.createElement("div");

    this.arg_qty = document.createElement("input");
    this.arg_qty.id = `arg_qty${this.id}`;
    this.arg_qty.name = `arg_qty${this.id}`;
    this.arg_qty.type = "hidden";
    this.first_line.appendChild(this.arg_qty);

    this.name = document.createElement("input");
    this.name.id = `bind_name${this.id}`;
    this.name.name = `bind_name${this.id}`;
    this.name.placeholder = "Name";
    this.name.classList.add("name");

    this.out_ip = document.createElement("input");
    this.out_ip.id = `out_ip${this.id}`;
    this.out_ip.name = `out_ip${this.id}`;
    this.out_ip.placeholder = "Out ip";
    this.out_ip.classList.add("ip");

    this.out_port = document.createElement("input");
    this.out_port.id = `out_port${this.id}`;
    this.out_port.name = `out_port${this.id}`;
    this.out_port.placeholder = "Out port";
    this.out_port.classList.add("port");

    let remove_bind_btn = document.createElement("button");
    remove_bind_btn.type = "button";
    remove_bind_btn.innerHTML = "Remove Bind";
    remove_bind_btn.classList.add("remove_bind");
    remove_bind_btn.onclick = () => {
        this.second_line.remove();
        this.first_line.remove();
    }
    this.first_line.appendChild(document.createElement("hr"));
    this.first_line.appendChild(remove_bind_btn);
    this.first_line.appendChild(this.name);
    this.first_line.appendChild(this.out_ip);
    this.first_line.appendChild(this.out_port);

    this.in_address = document.createElement("input");
    this.in_address.id = `in_address${this.id}`;
    this.in_address.name = `in_address${this.id}`;
    this.in_address.placeholder = "In address";
    this.in_address.classList.add("name");

    this.min_in_value = document.createElement("input");
    this.min_in_value.id = `min_in_value${this.id}`;
    this.min_in_value.name = `min_in_value${this.id}`;
    this.min_in_value.placeholder = "Min in";
    this.min_in_value.type="number";
    this.min_in_value.classList.add("min_max");

    this.max_in_value = document.createElement("input");
    this.max_in_value.id = `max_in_value${this.id}`;
    this.max_in_value.name = `max_in_value${this.id}`;
    this.max_in_value.placeholder = "Max in";
    this.max_in_value.type="number";
    this.max_in_value.classList.add("min_max");

    this.second_line.appendChild(this.in_address);
    this.second_line.appendChild(this.min_in_value);
    this.second_line.appendChild(this.max_in_value);

    this.protocol = document.createElement("select");
    this.protocol.id = `protocol${x}`
    this.protocol.classList.add("selector");
    this.protocol.onchange = () => {this.select_protocol()};
    let midi = document.createElement("option");
    let osc = document.createElement("option");
    midi.innerHTML = "MIDI";
    osc.innerHTML = "OSC";
    osc.value = 'osc';
    midi.value = 'midi';
    this.protocol.add(midi);
    this.protocol.add(osc);

    document.getElementById('formu').appendChild(this.first_line);
    document.getElementById('formu').appendChild(this.second_line);

    this.first_line.appendChild(this.protocol);
  }
  select_protocol()
  {
    if(this.protocol.value == 'osc')
    {
        this.arg_container = document.createElement("div");
        this.arg_container.classList.add("container");

        this.out_address = document.createElement("input");
        this.out_address.id = `out_address${this.id}`;
        this.out_address.name = `out_address${this.id}`;
        this.out_address.placeholder = "Out address";
        this.out_address.classList.add("out_address");

        let add_arg_btn = document.createElement("button");
        add_arg_btn.type = "button";
        add_arg_btn.id = `add_arg_btn${this.id}`;
        add_arg_btn.innerHTML = "agregar";
        add_arg_btn.onclick = () => {this.add_arg(this.arg_id)};

        this.second_line.appendChild(this.out_address);
        this.first_line.appendChild(add_arg_btn);
    }
  }
  add_arg(arg_id)
  {
    let box = document.createElement("div");
    box.classList.add("box");
    box.id = `${this.id}box${arg_id}`;

    this.arg = document.createElement("input");
    this.arg.id = `${this.id}arg${arg_id}`;
    this.arg.name = `${this.id}arg${arg_id}`;
    this.arg.placeholder = "OSC argument";

    let remove_arg_btn = document.createElement("button");
    remove_arg_btn.type = "button";
    remove_arg_btn.innerHTML = "-";
    remove_arg_btn.id = (`${this.id}remove_arg${arg_id}`);
    remove_arg_btn.onclick = () => {this.remove_arg(box.id)};

    box.appendChild(this.arg);
    box.appendChild(remove_arg_btn);

    this.arg_container.appendChild(box);
    this.second_line.appendChild(this.arg_container);


    this.arg_id++;
    this.arg_qty.value = this.arg_id;
  }

  remove_arg(box)
  {
    document.getElementById(box).remove();
  }

  autofill(name, out_ip, out_port, in_address, in_min, in_max, out_address)
  {
    this.name.value = name;
    this.out_ip.value = out_ip;
    this.out_port.value = out_port;
    this.in_address.value = in_address;
    this.min_in_value.value = in_min;
    this.max_in_value.value = in_max;
    this.protocol.value = 'osc';
    (() => {this.select_protocol()})();
    this.out_address.value = out_address;
    x++;
  }

  autofill_args(arg_num, arg_value)
  {

    (() => {this.add_arg(arg_num)})();
    this.arg.value = arg_value;
    console.log(this.arg.value);
  }

}
function myFunction(){
    let bind = new Bind(x);

    x++;
    document.getElementById("bind_qty").value = x;
}



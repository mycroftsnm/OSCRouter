#!/usr/bin/env python
from pythonosc.dispatcher import Dispatcher
from pythonosc import osc_server
from pythonosc import osc_message_builder
from pythonosc import udp_client
from flask import render_template, redirect, url_for
from flask import Flask
from flask import request
from flask_sqlalchemy import SQLAlchemy
import threading
import os
# import pdfkit for future pdf render, not implemented yet
import argparse
import time

dbdir = "sqlite:///" + os.path.abspath(os.getcwd()) + "/database.db"

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = dbdir
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)

class Router(db.Model):
    __tablename__ = "routes"
    id = db.Column(db.Integer, primary_key=True)
    preset_name = db.Column(db.String)
    name = db.Column(db.String)
    in_address = db.Column(db.String)
    in_min = db.Column(db.Float)
    in_max = db.Column(db.Float)
    out_address = db.Column(db.String)
    listen_ip = db.Column(db.String)
    listen_port = db.Column(db.Integer)
    out_ip = db.Column(db.String)
    out_port = db.Column(db.Integer)
    default_out_ip = db.Column(db.String)
    default_out_port = db.Column(db.Integer)
    osc_bundle = db.relationship("OscBundle", backref="router", lazy='dynamic')
    last = db.Column(db.Boolean)

    def __init__(self, preset_name, name, in_address, out_address, last, in_min, in_max, listen_ip, listen_port, out_ip,
                 out_port, default_out_ip, default_out_port):
        self.preset_name = preset_name
        self.in_address = in_address
        self.out_address = out_address
        self.in_min = in_min
        self.in_max = in_max
        self.listen_ip = listen_ip
        self.listen_port = listen_port
        self.out_ip = out_ip
        self.out_port = out_port
        self.default_out_ip = default_out_ip
        self.default_out_port = default_out_port
        self.name = name
        self.last = last


class OscBundle(db.Model):
    __tablename__ = "osc_bundles"
    id = db.Column(db.Integer, primary_key=True)
    argument = db.Column(db.String)
    router_id = db.Column(db.Integer, db.ForeignKey('routes.id'))

    def __init__(self, argument):
        self.argument = argument


@app.route('/list', methods=['GET', 'POST'])
def index1():
    presets = [r.preset_name for r in Router.query.all()]
    return render_template('list.html', presets=list(dict.fromkeys(presets)))


@app.route('/')
def gotolist():
    return redirect(url_for('index1'))


@app.route('/new', methods=['GET', 'POST'])
@app.route('/preset/<preset_name>', methods=['GET', 'POST'])
def index(preset_name=''):
    preset = Router.query.filter_by(preset_name=preset_name)
    for x in preset.all():
        print(x.name)
    #bundle = Osc_bundle.query.filter_by(router_id=preset.id - 1).all()

    if request.method == 'POST':
        total = request.form['num']
        last_preset_active = Router.query.filter_by(last=True).all()
        for bind in last_preset_active:
            bind.last = False
        old_preset = Router.query.filter_by(preset_name=request.form['preset_name'])
        if old_preset.first() is not None:
            for old_bind in old_preset.all():
                OscBundle.query.filter_by(router_id=old_bind.id).delete()
            old_preset.delete()

        for x in range(1, int(total)+1):

            name = request.form['bind_name' + str(x)]
            in_address = request.form['in_address' + str(x)]
            min_in = request.form['min_in_value_name' + str(x)]
            max_in = request.form['max_in_value_name' + str(x)]
            out_address = request.form['out_address' + str(x)]
            preset_name = request.form['preset_name']
            listen_ip = request.form['listen_ip']
            listen_port = request.form['listen_port']
            bundle = request.form['cant' + str(x)]
            out_ip = request.form['out_ip' + str(x)]
            out_port = request.form['out_port' + str(x)]
            default_out_ip = request.form['default_out_ip']
            default_out_port = request.form['default_out_port']
            new_post = Router(preset_name=preset_name, name=name, in_address=in_address, in_min=min_in, in_max=max_in,
                              out_address=out_address, listen_ip=listen_ip, listen_port=listen_port, out_ip=out_ip,
                              out_port=out_port, default_out_ip=default_out_ip, default_out_port=default_out_port,
                              last=True)

            db.session.add(new_post)
            for y in range(1, int(bundle) + 1):
                argument = request.form[str(x) + 'argument' + str(y)]
                new = OscBundle(argument=argument)
                db.session.add(new)
                new_post.osc_bundle.append(new)
        db.session.commit()
        theserver = udp_client.SimpleUDPClient("127.0.0.1", 3722)
        theserver.send_message("/reloadoscserver", 1)

            #options = {'page-size': 'A3'}
            #url = render_template('index.html', presets=preset.all(), Osc_bundle=Osc_bundle)
            #pdfkit.from_string(url, 'salidita2.pdf', options=options)
    if preset.first() is None:
        return render_template('new.html')
    else:
        return render_template('index.html', presets=preset.all(), Osc_bundle=OscBundle)


def web():
    app.run('0.0.0.0', 5000)


if __name__ == '__main__':

    parser = argparse.ArgumentParser(description='An OSC router.')
    parser.add_argument("-c", "--config", help="Runs the web server to configure router.", action="store_true")
    args = parser.parse_args()

    t = threading.Thread(target=web)
    t.daemon = True
    if args.config:
        t.start()
        print("After setting an active preset, rerun pedalerx")

    # app.run(host='192.168.1.103', debug=True)

    db.create_all()

    dispatcher = Dispatcher()
    mapped = []

    def map_all():
        preset = Router.query.filter_by(last=True).all()
        # a preset has multiple binds.
        quantity = 0
        mapped.clear()
        for bind in preset:

            def send(address, args, *in_messages):
                print(in_messages[0])
                bind = args[0]
                print(bind.in_address)
                msg = osc_message_builder.OscMessageBuilder(address=bind.out_address)
                bundles = OscBundle.query.filter_by(router_id=bind.id).all()

                for bundle in bundles:

                    lst = str(bundle.argument).split(",")
                    count = len(lst)

                    if count == 3:
                        argument_type = lst[0]
                        min_value = lst[1]
                        max_value = lst[2]
                    elif count == 2:
                        argument_type = lst[0]
                        min_value = max_value = lst[1]
                    else:
                        print("ERROR: osc syntax")
                        break
                    
                    if argument_type == 'i':
                        min_value = int(min_value)
                        max_value = int(max_value)
                    elif argument_type == 'f':
                        min_value = float(min_value)
                        max_value = float(max_value)

                    if in_messages[0] == bind.in_max:

                        valor = max_value

                    elif in_messages[0] == bind.in_min:
                        valor = min_value

                    else:
                        if argument_type != 's':
                            valor = (((max_value-min_value)/(bind.in_max-bind.in_min))*(float(in_messages[0])-bind
                                                                                        .in_min)) + min_value
                        else:
                            valor = max_value

                    msg.add_arg(valor)

                msg = msg.build()
                if bind.out_ip:
                    ip = bind.out_ip
                else:
                    ip = bind.default_out_ip
                if bind.out_port:
                    port = bind.out_port
                else:
                    port = bind.default_out_port
                receptor = udp_client.SimpleUDPClient(ip, port)
                receptor.send(msg)
            mapped.append([])
            map = dispatcher.map(bind.in_address, send, bind)
            mapped[quantity].append(bind.in_address)
            mapped[quantity].append(map)
            quantity += 1


    def reload(address, *in_messages):
        print('reload')
        server.shutdown()

        for a_map in mapped:
            dispatcher.unmap(a_map[0], a_map[1])

        time.sleep(1)
        map_all()
        time.sleep(1)
        server.serve_forever()

    map_all()
    dispatcher.map('/reloadoscserver', reload)
    server = osc_server.ThreadingOSCUDPServer(("0.0.0.0", 3722), dispatcher)
    print("Serving on {}".format(server.server_address))
    server.serve_forever()


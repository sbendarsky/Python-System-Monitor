import psutil
from flask import Flask, render_template, send_from_directory, jsonify

app = Flask(__name__, static_folder='static')


@app.route('/images/background.jpeg')
def serve_static():
    return send_from_directory('static/images', 'background.jpeg')


@app.route("/data")
def data():
    cpu_usage = psutil.cpu_percent()
    mem_usage = psutil.virtual_memory().percent
    msg = "OK"
    if cpu_usage > 80 or mem_usage > 80:
        msg = "Warning"
    return jsonify(cpu_usage=cpu_usage, mem_usage=mem_usage, msg=msg)


@app.route("/")
def index():
    cpu_usage = psutil.cpu_percent()
    mem_usage = psutil.virtual_memory().percent
    return render_template("index.html", cpu_usage=cpu_usage, mem_usage=mem_usage)


if __name__ == "__main__":
    app.run(debug=True)

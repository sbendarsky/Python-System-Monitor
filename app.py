import psutil
from flask import Flask, render_template, send_from_directory

app = Flask(__name__, static_folder='images')


@app.route('/images/background.jpeg')
def serve_static():
    filename = 'background.jpeg'
    return send_from_directory('images', filename)


@app.route("/")
def index():
    cpu_usage = psutil.cpu_percent()
    mem_usage = psutil.virtual_memory().percent
    msg = "OK"
    if cpu_usage > 80 or mem_usage > 80:
        msg = "Warning"
    return render_template("index.html", cpu_usage=cpu_usage, mem_usage=mem_usage, msg=msg)


if __name__ == "__main__":
    app.run()

import psutil
from flask import Flask, render_template, send_from_directory, jsonify, request, redirect, session
from flask_session.__init__ import Session
import os

key = os.urandom(8)
app = Flask(__name__, static_folder='static')
app.secret_key = key
app.config['SESSION_TYPE'] = 'filesystem'
Session(app)


@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        data = request.get_json()  # Get JSON data from the request
        username = data.get("username")
        password = data.get("password")
        if username == "admin" and password == "admin":
            session["logged_in"] = True
            return jsonify(message="Login success"), 200
        else:
            return jsonify(message="Invalid username or password"), 401

    # If the user is already logged in, redirect them to the dashboard
    if session.get("logged_in"):
        return redirect("/")

    # Render the login page
    return render_template("login.html")




@app.route('/images/background.jpeg')
def serve_static():
    return send_from_directory('static/images', 'background.jpeg')


@app.route("/logout")
def logout():
    session.pop("logged_in", None)
    return redirect("/login")


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
    if not session.get("logged_in"):
        return redirect("/login")
    cpu_usage = psutil.cpu_percent()
    mem_usage = psutil.virtual_memory().percent
    return render_template("index.html", cpu_usage=cpu_usage, mem_usage=mem_usage)


if __name__ == "__main__":
    app.run(debug=True)

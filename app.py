import psutil
from flask import Flask

app = Flask(__name__)


@app.route("/")
def index():
    cpu_usage = psutil.cpu_percent()
    mem_usage = psutil.virtual_memory().percent
    if cpu_usage > 80 or mem_usage > 80:
        return "Warning, High CPU or Memory utilization detected! CPU usage is {}. Memory usage is {}".format(cpu_usage,
                                                                                                              mem_usage)
    return "CPU usage is {}. Memory usage is {}".format(cpu_usage, mem_usage)


if __name__ == "__main__":
    app.run()

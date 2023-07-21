FROM python:3.9-buster

WORKDIR /app

COPY requirements.txt requirements.txt

RUN pip3 install -r requirements.txt

COPY . .

ENV HOST=0.0.0.0

EXPOSE 5000

CMD ["python3", "app.py"]

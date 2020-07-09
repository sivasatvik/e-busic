import time
from flask import Flask
from flask import request
from flask import jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/time', methods=['POST'])
def get_current_time():
  print(request.data)
  response = jsonify({'some': 'data'})
  response.headers.add('Access-Control-Allow-Origin', '*')
  return response
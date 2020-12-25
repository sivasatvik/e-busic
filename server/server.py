import time
from flask import Flask
from flask import request
from flask import jsonify
from flask_cors import CORS
import nltk
import pickle

#nltk.download('punkt')

app = Flask(__name__)
CORS(app)

@app.route('/time', methods=['POST'])
def get_current_time():
  #print(request.data)
  parse_content(request.data)
  response = jsonify({'emotion': 'xyz'})
  response.headers.add('Access-Control-Allow-Origin', '*')
  return response


def parse_content(data):
  #print(data)
  chap = data.decode()
  chap = chap.replace("\n", " ")
  chap = chap.replace("\t", "")
  chap = ' '.join(chap.split())
  chap_list = nltk.tokenize.sent_tokenize(chap)
  sentence_clf_model = pickle.load(open('model/sentence_model.pkl','rb'))
  sentence_nb_clf_model = pickle.load(open('model/sentence_nb_model.pkl','rb'))
  for i in chap_list:
    print(i)
    print(sentence_clf_model.predict([i]))
    #print(sentence_nb_clf_model.predict([i]))
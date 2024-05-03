import pathlib
import textwrap
import os
import requests

import google.generativeai as genai

from IPython.display import display
from IPython.display import Markdown

from flask import Flask, request, jsonify


def to_markdown(text):
  text = text.replace('•', '  *')
  return Markdown(textwrap.indent(text, '> ', predicate=lambda _: True))

app = Flask(__name__)

@app.route('/gemini', methods=['POST', 'GET', 'OPTIONS'])
def process():
  if request.method == 'GET':
    return process_get()
  if request.method == 'POST':
    return process_post()
  if request.method == 'OPTIONS':
    return process_options()
  
def process_get():
  response = jsonify({"response": "Beep boop...buildingggg!"})
  return wrap_headers(response)

def process_post():
  return generate_gemini()

def process_options():
  response = jsonify({"response": "Options request received"})
  return wrap_headers(response)

def generate_gemini():
  key = os.getenv("GEMINI_API_KEY")
  if key is None:
    print("GEMINI_API_KEY is not set")
    return
  genai.configure(api_key=key)
  model = genai.GenerativeModel('gemini-1.5-pro-latest')
  msg = request.get_json()
  prompt = msg['value']
  response = tool_call(key, prompt)
  #response = model.generate_content(prompt)
  response = to_markdown(response.text)
  response = jsonify({"response": response._repr_markdown_()})
  return wrap_headers(response)

def tool_call(key, text):
  # (test prompt) text = "Add a Box component to the UI with the following props: background: \"light-1\", pad: \"medium\", margin: \"small\", direction: \"row\", justify: \"center\", align: \"center\", gap: \"small\", wrap: true"
  url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={}".format(key)
  schema = [
    {
      "name": "AddItem",
      "description": "Adds a grommet object to the UI",
      "parameters": {
        "type": "object",
        "properties": {
          "component": {
            "type": "string",
            "description": "The name of the grommet component to add"
          },
          "props": {
            "type": "object",
            "description": "The props of the grommet component to add"
          }
        },
        "required": [
          "component",
          "props"
        ]
      }
    }
  ]
  ''' NOTE: I ran out of time, so I could not finish implementing the other tools. The commented out code is the schema declerations.,
    {
      "name": "RemoveItem",
      "description": "Removes a grommet object from the UI",
      "parameters": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "description": "The id of the grommet object to remove"
          }
        },
        "required": [
          "id"
        ]
      }
    },
    {
      "name": "ModifyItem",
      "description": "Modifies an existing object in the UI by updating its props. They will be referenced in the prompt through their id value.",
      "parameters": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "description": "The id of the grommet object to modify"
          },
          "props": {
            "type": "object",
            "description": "The new props of the grommet object"
          }
        },
        "required": [
          "id",
          "props"
        ]
      }
    }'''
  
  
  headers = {
    'Content-Type': 'application/json',
  }
  body = {
    "contents": {
      "role": "user",
      "parts": {
        "text": text
      }
    },
    "tools": [{
      "function_declarations": schema
    }]
  }
  response = requests.post(url, headers=headers, json=body)
  return response


def wrap_headers(response):
  response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
  response.headers.add('Access-Control-Allow-Methods', 'GET, POST,OPTIONS')
  response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  return response

if __name__ == "__main__":
  app.run(port=8080)
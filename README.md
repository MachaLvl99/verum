# VERUM - Live UI prototyping using natural language

[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)


## Table of Contents

- [What is it?](#what-is-it)
- [Setup](#installation)
- [Usage](#usage)

## What is it?
*⚠️Caution!* This is a working proof of concept and not intended for production use (yet).

Verum is a live UI prototyping tool that allows you to prompt for components that you can easily implement in your own app. 

## Setup

*IMPORTANT* This code calls `GEMINI_API_KEY` and NOT `API_KEY`. You can change the variable name if you wish in `service.py`, but **do not hard-code your 
API keys in your script!**
set up your environment vars in your terminal
```
export GEMINI_API_KEY="YOUR_API_KEY"
```

Find a good spot to clone the repo

```
git clone https://github.com/MachaLvl99/verum.git
```

Start up your localhosts

python:
```
cd .../verum/python-server
python service.py
```
react:
```
cd .../verum/verum
npm start
```
and voila!

## Usage

Go to `http://localhost:3000` and try it out!

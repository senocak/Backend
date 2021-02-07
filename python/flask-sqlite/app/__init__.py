from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from dotenv import load_dotenv
import os
from flask_cors import CORS, cross_origin

basedir = os.path.abspath(os.path.dirname(__file__))
load_dotenv()


db = SQLAlchemy()
flask_bcrypt = Bcrypt()


def create_app():
    app = Flask(__name__)
    CORS(app)
    app.config["DEBUG"] = True
    app.config["SQLALCHEMY_DATABASE_URI"] = 'sqlite:///' + os.path.join(basedir, 'flask.db')
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    #app.config["SQLALCHEMY_ECHO"] = True
    #app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024
    app.config['UPLOAD_FOLDER'] = "images/"
    db.init_app(app)
    flask_bcrypt.init_app(app)
    return app

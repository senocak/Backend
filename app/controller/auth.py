from flask import Blueprint, request
from app.service.auth_helper import Auth
from ..service.user_service import save_new_user

auth = Blueprint('auth', __name__)


@auth.route('/api/register', methods=["POST"])
def post_new_user():
    data = request.json
    return save_new_user(data=data)


@auth.route('/api/login', methods=["POST"])
def auth_login():
    post_data = request.json
    return Auth.login_user(data=post_data)


@auth.route('/api/logout', methods=["POST"])
def auth_logout():
    auth_header = request.headers.get('Authorization')
    return Auth.logout_user(auth_header)

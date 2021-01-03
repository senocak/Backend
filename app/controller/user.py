from flask import Blueprint, request, abort, jsonify, Response, make_response
from app.util.decorator import admin_token_required, token_required
from ..service.user_service import get_all_users, get_a_user

user = Blueprint('user', __name__)


@user.route('/api/users', methods=["GET"])
@admin_token_required
def get_all_registered_users():
    return jsonify([
        {
            'id': user.public_id,
            'username': user.username,
            'email': user.email,
            'registered_on': user.registered_on,
            'admin': user.admin
        }
        for user in get_all_users()
    ])


@user.route('/api/user/<id>', methods=["GET"])
@token_required
def get_single_user(id):
    user = get_a_user(id)
    if not user:
        return {'mesaj': "Kullanıcı Bulunamadı"}, 404
    else:
        return jsonify([
            {
                'id': user.public_id,
                'username': user.username,
                'email': user.email,
                'registered_on': user.registered_on,
                'admin': user.admin
            }
            for user in get_all_users()
        ])

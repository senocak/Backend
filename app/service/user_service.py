import uuid
import datetime
from app import db
from app.model.user import User


def save_new_user(data):
    user = User.query.filter_by(email=data['email']).first()
    if not user:
        new_user = User(
            public_id=str(uuid.uuid4()),
            email=data['email'],
            username=data['username'],
            password=data['password'],
            registered_on=datetime.datetime.utcnow()
        )
        save_changes(new_user)
        return generate_token(new_user)
    else:
        return {'mesaj': 'Kullanıcı zaten kayıtlı'}, 409


def get_all_users():
    return User.query.all()


def get_a_user(public_id):
    return User.query.filter_by(public_id=public_id).first()


def generate_token(user):
    try:
        auth_token = User.encode_auth_token(user.id)
        return {'Authorization': auth_token.decode()}, 201
    except Exception as e:
        return {'mesaj': 'Beklenmedik bir hata oluştu: Hata: ' + str(e)}, 401


def save_changes(data):
    db.session.add(data)
    db.session.commit()

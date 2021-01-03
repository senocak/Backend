from app.model.user import User
from ..service.blacklist_service import save_token


class Auth:
    @staticmethod
    def login_user(data):
        try:
            user = User.query.filter_by(email=data.get('email')).first()
            if user and user.check_password(data.get('password')):
                auth_token = User.encode_auth_token(user.id)
                if auth_token:
                    return {'Authorization': auth_token.decode()}, 200
            else:
                return {'mesaj': 'email yada şifre eşleşmedi.'}, 401
        except Exception as e:
            return {'mesaj': 'Bilinmeyen Exception: ' + str(e)}, 500

    @staticmethod
    def logout_user(auth_token):
        resp = User.decode_auth_token(auth_token)
        if not isinstance(resp, str):
            return save_token(token=auth_token)
        else:
            return {'mesaj': resp}, 403

    @staticmethod
    def get_logged_in_user(new_request):
        auth_token = new_request.headers.get('Authorization')
        if auth_token:
            resp = User.decode_auth_token(auth_token)
            if not isinstance(resp, str):
                user = User.query.filter_by(id=resp).first()
                response_object = {
                    'data': {
                        'user_id': user.id,
                        'email': user.email,
                        'admin': user.admin,
                        'registered_on': str(user.registered_on)
                    }
                }
                return response_object, 200
            return {'mesaj': resp}, 403
        else:
            return {'mesaj': 'Token geçerli değil'}, 401

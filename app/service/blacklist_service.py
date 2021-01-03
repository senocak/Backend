from app import db
from app.model.blacklist import BlacklistToken


def save_token(token):
    blacklist_token = BlacklistToken(token=token)
    try:
        db.session.add(blacklist_token)
        db.session.commit()
        return {'mesaj': 'Çıkış Başarılı.'}, 200
    except Exception as e:
        return {'mesaj': str(e)}, 500

import uuid

from sqlalchemy.orm import relationship
from . import db, flask_bcrypt
import datetime
import os
import jwt

from .exception import BadRequest

key = os.getenv('KEY', 'cosmosboard2')


class User(db.Model):
    __tablename__ = "user"

    id = db.Column(db.String(255), primary_key=True, unique=True, default=str(uuid.uuid4()))
    email = db.Column(db.String(255), unique=True, nullable=False)
    registered_on = db.Column(db.DateTime, nullable=False)
    admin = db.Column(db.Boolean, nullable=False, default=False)
    sifre_hash = db.Column(db.String(100))

    @property
    def sifre(self):
        raise AttributeError('sifre: write-only field')

    @sifre.setter
    def sifre(self, sifre):
        self.sifre_hash = flask_bcrypt.generate_password_hash(sifre).decode('utf-8')

    def __repr__(self):
        return "<User '{}'>".format(self.email)

    def sifre_kontrol(self, sifre):
        return flask_bcrypt.check_password_hash(self.sifre_hash, sifre)

    @staticmethod
    def token_sifrele(user_id):
        try:
            payload = {
                'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1, seconds=5),
                'iat': datetime.datetime.utcnow(),
                'sub': user_id
            }
            return jwt.encode(payload, key, algorithm='HS256')
        except Exception as e:
            return e

    @staticmethod
    def token_sifre_coz(auth_token):
        try:
            payload = jwt.decode(auth_token, key)
            is_blacklisted_token = KaraListe.check_blacklist(auth_token)
            if is_blacklisted_token:
                raise BadRequest('Token kara listede.')
            else:
                return payload['sub']
        except jwt.ExpiredSignatureError:
            raise BadRequest('Token expired olmuş.')
        except jwt.InvalidTokenError:
            raise BadRequest('Token geçersiz.')


class KaraListe(db.Model):
    __tablename__ = 'kara_liste'

    id = db.Column(db.String, primary_key=True, unique=True)
    token = db.Column(db.String(500), unique=True, nullable=False)
    blacklisted_on = db.Column(db.DateTime, nullable=False, default=datetime.datetime.utcnow())

    def __init__(self, token):
        self.id = str(uuid.uuid4())
        self.token = token
        self.blacklisted_on = datetime.datetime.now()

    def __repr__(self):
        return '<id: token: {}'.format(self.token)

    @staticmethod
    def check_blacklist(auth_token):
        res = KaraListe.query.filter_by(token=str(auth_token)).first()
        if res:
            return True
        else:
            return False

    @classmethod
    def save_token(cls, token):
        KaraListe.save_changes(KaraListe(token=token))
        return {'mesaj': 'Çıkış Başarılı.'}, 200

    @classmethod
    def save_changes(cls, data):
        db.session.add(data)
        db.session.commit()


class Kategori(db.Model):
    __tablename__ = 'kategori'

    id = db.Column(db.String, primary_key=True, unique=True)
    baslik = db.Column(db.String(50), nullable=False)
    url = db.Column(db.String(50), nullable=False)
    created_on = db.Column(db.DateTime)

    def __init__(self, baslik, url):
        self.baslik = baslik
        self.url = url
        self.id = str(uuid.uuid4())
        self.created_on = datetime.datetime.utcnow()

    def __repr__(self):
        return {"id": self.id, "url": self.url, "baslik": self.baslik}

    @classmethod
    def ekle(cls, data):
        db.session.add(data)
        Kategori.commit()

    @classmethod
    def commit(cls):
        db.session.commit()

    @classmethod
    def sil(cls, data):
        db.session.delete(data)
        Kategori.commit()


class Yazi(db.Model):
    __tablename__ = 'yazi'

    id = db.Column(db.String, primary_key=True, unique=True)
    baslik = db.Column(db.String(500), nullable=False)
    url = db.Column(db.String(50), nullable=False)
    icerik = db.Column(db.TEXT, nullable=False)
    created_on = db.Column(db.DateTime, nullable=False)

    kategori_id = db.Column(db.String, db.ForeignKey("kategori.id"), nullable=False)
    kategori = relationship("Kategori", backref=db.backref('yazi', lazy='dynamic'))

    def __init__(self, baslik, url, icerik, kategori_id):
        self.id = str(uuid.uuid4())
        self.baslik = baslik
        self.url = url
        self.icerik = icerik
        self.kategori_id = kategori_id
        self.created_on = datetime.datetime.utcnow()

    def __repr__(self):
        return {"id": self.id, "baslik": self.baslik, "url": self.url, "icerik": self.icerik, "kategori_id": self.kategori_id}

    @classmethod
    def ekle(cls, data):
        db.session.add(data)
        Yazi.commit()

    @classmethod
    def sil(cls, data):
        db.session.delete(data)
        Yazi.commit()

    @classmethod
    def commit(cls):
        db.session.commit()

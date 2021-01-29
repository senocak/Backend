from flask import request
from app.exception import NotFound, BadRequest, Conflict, UnAuthorized, getStatus
from app.models import User, Kategori, Yazi, KaraListe
import re
import uuid
import datetime
from app import db
from functools import wraps
from slugify import slugify


class Middleware:
    @classmethod
    def token_required(cls, f):
        @wraps(f)
        def decorated(*args, **kwargs):
            data, status = AuthServis.middleware_kullanici_cek(request)
            if not data.get('id') and not data.get('email'):
                return data, status
            return f(*args, **kwargs)

        return decorated

    @classmethod
    def admin_token_required(cls, f):
        @wraps(f)
        def decorated(*args, **kwargs):
            data, status = AuthServis.middleware_kullanici_cek(request)
            token = data.get('data')
            if not token:
                return data, status
            admin = token.get('admin')
            if not admin:
                return {'mesaj': 'Yetkisiz token.'}, 401
            return f(*args, **kwargs)

        return decorated


class AuthServis:
    @staticmethod
    def giris(data):
        user = User.query.filter_by(email=data.get('email')).first()
        if user and user.sifre_kontrol(data.get('sifre')):
            auth_token = User.token_sifrele(user.id)
            if auth_token:
                return auth_token.decode()
        else:
            raise BadRequest("email yada şifre eşleşmedi.")

    @staticmethod
    def cikis(auth_token):
        if auth_token is None:
            raise NotFound("Token vermeniz gerekir")
        User.token_sifre_coz(auth_token)
        KaraListe.save_token(token=auth_token)

    @staticmethod
    def middleware_kullanici_cek(new_request):
        auth_token = new_request.headers.get('Authorization')
        try:
            if auth_token is None or auth_token is "null":
                raise UnAuthorized("Token bulunamadı")
            return AuthServis.tokena_gore_kullanici(auth_token), 200
        except Exception as e:
            return {'mesaj': str(e)}, getStatus(e)

    @staticmethod
    def tokena_gore_kullanici(token):
        resp = User.token_sifre_coz(token)
        user = User.query.filter_by(id=resp).first()
        if user is None:
            raise NotFound('Token geçerli değil')
        return {
            'id': user.id,
            'email': user.email,
            'admin': user.admin,
            'registered_on': str(user.registered_on)
        }

    @classmethod
    def kayit(cls, self):
        user = User.query.filter_by(email=self['email']).first()
        if not user:
            new_user = User(
                id=str(uuid.uuid4()),
                email=self['email'],
                sifre=self['sifre'],
                registered_on=datetime.datetime.utcnow()
            )
            AuthServis.degisiklikleri_kaydet(new_user)
            return AuthServis.token_uret(new_user)
        else:
            raise Conflict("Kullanıcı Zaten Kayıtlı")

    @classmethod
    def token_uret(cls, user):
        try:
            auth_token = User.token_sifrele(user.id)
            return auth_token.decode()
        except Exception as e:
            raise UnAuthorized("Beklenmedik bir hata oluştu. Hata: " + str(e))

    @classmethod
    def degisiklikleri_kaydet(cls, data):
        db.session.add(data)
        db.session.commit()

    @classmethod
    def kullanici_data_dogrulama(cls, data):
        if data is None or 'email' not in data or 'sifre' not in data:
            raise AttributeError("Email ve Şifre zorunlu alanlar")
        if not re.match(r"[^@]+@[^@]+\.[^@]+", data["email"]):
            raise AttributeError('Email geçerli değil')
        if len(data["sifre"]) < 6 or len(data["sifre"]) > 20:
            raise AttributeError('Şifre min 6 max 20 karakter olmalı')


class KategoriServis:
    @classmethod
    def tum_kategoriler(cls):
        return Kategori.query.all()

    @classmethod
    def tek_kategori(cls, tip, deger):
        kategori = None
        if deger is None or not deger.strip():
            raise BadRequest("Id bulunamadı")
        if tip == "id":
            kategori = Kategori.query.filter_by(id=deger).first()
        elif tip == "url":
            kategori = Kategori.query.filter_by(url=deger).first()
        if kategori is None:
            raise NotFound("Kategori Bulunamadı")
        return kategori

    @classmethod
    def kategori_data_dogrula(cls, kategori):
        if kategori is None or 'baslik' not in kategori or kategori["baslik"] == "" or not kategori["baslik"]:
            raise AttributeError('Başlık alanı zorunlu')
        if len(kategori["baslik"]) < 3 or len(kategori["baslik"]) > 100:
            raise AttributeError('Başlık min 3, max 100 karakter olmalı')

    @classmethod
    def kategori_ekle(cls, kategori_data):
        slug = slugify(kategori_data["baslik"])
        kategori = Kategori.query.filter_by(url=slug).first()
        if kategori:
            raise Conflict("Kategori zaten kayıtlı")
        kategori = Kategori(
            url=slug,
            baslik=kategori_data["baslik"]
        )
        Kategori.ekle(kategori)
        return {"id": kategori.id, "url": kategori.url, "baslik": kategori.baslik}

    @classmethod
    def kategori_guncelle(cls, kategori_url, data):
        kategori = KategoriServis.tek_kategori("url", kategori_url)
        KategoriServis.kategori_data_dogrula(data)
        baslik = data["baslik"].strip()
        kategori.baslik = baslik
        kategori.url = slugify(baslik)
        Kategori.commit()
        return kategori.__repr__()

    @classmethod
    def kategori_sil(cls, kategori_id):
        kategori = KategoriServis.idye_gore_kategori(kategori_id)
        Kategori.sil(kategori)
        return {'mesaj': 'Kategori Silindi'}

    @classmethod
    def idye_gore_kategori(cls, kategori_id):
        kategori = Kategori.query.filter_by(id=kategori_id).first()
        if kategori is None or not kategori:
            raise NotFound("Kategori Bulunamadı.")
        return kategori


class YaziServis:
    @classmethod
    def tum_yazilar(cls):
        return Yazi.query.all()

    @classmethod
    def tum_yazilar_sayfalama(cls, sayfa, adet):
        return Yazi.query.paginate(page=sayfa, per_page=adet)

    @classmethod
    def tek_yazi_with_url(cls, yazi_url):
        yazi = Yazi.query.filter_by(url=yazi_url).first()
        if yazi is None:
            raise NotFound("Yazı Bulunamadı.")
        return yazi

    @classmethod
    def ekle(cls, data):
        if data is None:
            raise AttributeError('Yazı verisi bulunamadı.')
        if 'baslik' not in data or data["baslik"] == "" or not data["baslik"]:
            raise AttributeError('Başlık alanı zorunlu')
        if len(data["baslik"]) < 3 or len(data["baslik"]) > 100:
            raise AttributeError('Başlık min 3, max 100 karakter olmalı')
        if 'icerik' not in data or data["icerik"] == "" or not data["icerik"]:
            raise AttributeError('İçerik alanı zorunlu')
        if len(data["icerik"]) < 3 or len(data["icerik"]) > 10000:
            raise AttributeError('İçerik min 3, max 10.000 karakter olmalı')
        if 'kategori_id' not in data or data["kategori_id"] == "" or not data["kategori_id"]:
            raise AttributeError("Kategori id\'si geçerli değil.")
        try:
            uuid.UUID(data["kategori_id"])
        except Exception as e:
            raise AttributeError("Kategori id\'si valid uuid değil.")
        slug = slugify(data["baslik"])
        yazi = Yazi.query.filter_by(url=slug).first()
        if yazi:
            raise Conflict("Yazı zaten kayıtlı")
        kategori = KategoriServis.tek_kategori("id", data["kategori_id"])
        yazi = Yazi(
            url=slug,
            baslik=data["baslik"],
            icerik=data["icerik"],
            kategori_id=kategori.id
        )
        Yazi.ekle(yazi)
        return yazi.__repr__()

    @classmethod
    def guncelle(cls, yazi_url, data):
        if data is None or bool(data) is False:
            raise AttributeError('Yazı verisi bulunamadı.')
        if 'baslik' in data and (len(data["baslik"]) < 3 or len(data["baslik"]) > 100):
            raise AttributeError('Başlık min 3, max 100 karakter olmalı')
        if 'icerik' in data and (len(data["icerik"]) < 3 or len(data["icerik"]) > 10000):
            raise AttributeError('İçerik min 3, max 10.000 karakter olmalı')
        kategori = None
        if 'kategori_id' in data:
            kategori = KategoriServis.idye_gore_kategori(data["kategori_id"])
            try:
                uuid.UUID(data["kategori_id"])
            except Exception as e:
                raise AttributeError("Kategori id\'si valid uuid değil.")
        yazi = YaziServis.tek_yazi_with_url(yazi_url)
        if 'baslik' in data:
            baslik = data["baslik"].strip()
            yazi.baslik = baslik
            yazi.url = slugify(baslik)
        if 'icerik' in data:
            yazi.icerik = data["icerik"]
        if 'kategori_id' in data:
            yazi.kategori_id = kategori.id
        Yazi.commit()
        return yazi.__repr__()

    @classmethod
    def sil(cls, url):
        yazi = YaziServis.tek_yazi_with_url(url)
        Yazi.sil(yazi)
        return {'mesaj': 'Yazı Silindi'}


class UserService:
    @classmethod
    def tum_kullanicilar(cls):
        return User.query.all()

    @classmethod
    def tek_kullanici(cls, id, auth_token):
        auth_token_user = User.query.filter_by(id=User.token_sifre_coz(auth_token)).first()
        id_user = User.query.filter_by(id=id).first()
        if auth_token_user is None or id_user is None or id_user != auth_token_user:
            raise NotFound("Kullanıcı bulunamadı")
        return id_user


class SeedServis:
    @classmethod
    def seed(cls):
        Kategori.query.delete()
        Kategori.ekle(Kategori(url="Kategori_url_" + str(uuid.uuid4()), baslik="Kategori_baslik_" + str(uuid.uuid4())))
        Kategori.ekle(Kategori(url="Kategori_url_" + str(uuid.uuid4()), baslik="Kategori_baslik_" + str(uuid.uuid4())))

        Yazi.query.delete()
        Yazi.ekle(
            Yazi(
                baslik="Yazi_baslik_" + str(uuid.uuid4()),
                url=slugify("Yazi_baslik_" + str(uuid.uuid4())),
                icerik="Yazi_icerik_" + str(uuid.uuid4()),
                kategori_id=Kategori.query.first().id
            )
        )
        Yazi.ekle(
            Yazi(
                baslik="Yazi_baslik_" + str(uuid.uuid4()),
                url=slugify("Yazi_baslik_" + str(uuid.uuid4())),
                icerik="Yazi_icerik_" + str(uuid.uuid4()),
                kategori_id=Kategori.query.first().id
            )
        )
        Yazi.ekle(
            Yazi(
                baslik="Yazi_baslik_" + str(uuid.uuid4()),
                url=slugify("Yazi_baslik_" + str(uuid.uuid4())),
                icerik="Yazi_icerik_" + str(uuid.uuid4()),
                kategori_id=Kategori.query.first().id
            )
        )

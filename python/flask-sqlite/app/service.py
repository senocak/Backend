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
            raise AttributeError("Kategori id\'si valid uuid değil. Error: " + str(e))
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
                raise AttributeError("Kategori id\'si valid uuid değil. Error: " + str(e))
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
        Kategori.ekle(Kategori(url="spring-boot", baslik="Spring Boot"))

        Yazi.query.delete()
        Yazi.ekle(
            Yazi(
                baslik="Artıları ve Eksileri",
                url=slugify("artileri-ve-eksileri"),
                icerik="<div class='blog-post-content'><p>Spring Boot is an open-source micro-framework used to build Spring applications with the help of microservices. Created by Pivotal Software, Inc., it can be used for both traditional WAR deployments and standalone Java applications. Spring Boot helps developers to start coding right away without wasting time on preparing and configuring the environment. In contrast to other Java frameworks, it provides flexible XML configurations, robust batch processing, database transactions, easy workflow, along with a wide variety of tools for development.</p><p>It generally functions by providing defaults for the codes and annotation configuration that will help you to instantly start any new Spring project in real-time. It also follows the ‘Opinionated Defaults Configuration’ strategy to eliminate boilerplate and other configurations designed to improve unit testing, development, and integration test procedures.</p><h2>Do You Need to Learn Spring First?</h2><p>With the development of Spring Boot, the Spring framework has become substantially more user-friendly. There is no need to use the old framework unless you have a good reason for doing so.</p><p>Since Spring Boot is an integration framework, it makes sense to learn how to configure your libraries using it. Though the process is generally simple, these libraries often need some configuration.</p><p><img class='aligncenter wp-image-26068 size-full' src='https://scand.com/wp-content/uploads/2020/06/spring-KV2.jpg' alt='' width='1110' height='300' srcset='https://scand.com/wp-content/uploads/2020/06/spring-KV2.jpg 1110w, https://scand.com/wp-content/uploads/2020/06/spring-KV2-489x132.jpg 489w, https://scand.com/wp-content/uploads/2020/06/spring-KV2-1024x277.jpg 1024w, https://scand.com/wp-content/uploads/2020/06/spring-KV2-768x208.jpg 768w' sizes='(max-width: 1110px) 100vw, 1110px'></p><h2>Why Is Spring Boot Popular?</h2><p>Firstly, it is based on Java, which is one of the world’s most popular programming languages. Besides that, Spring Boot can help you to quickly build any applications without having to worry about their safe and correct configuration. ⠀</p><p>Spring Boot has a huge user community which means you can find free learning materials and courses. Spring Boot is multi-threaded. This is useful when performing long or repetitive operations. When the main thread is consumed, others are used concurrently.</p><p>Some additional benefits include:</p><ul><li>Reduces the time spent on development and increases the overall efficiency of the development team.</li><li>Helps to autoconfigure all components for a production-grade Spring app.</li><li>Facilitates the creation and testing of Java-based applications by providing a default setup for unit and integration tests.</li><li>Helps to avoid all the manual work of writing boilerplate code, annotations, and complex XML configurations.</li><li>Comes with embedded HTTP servers like Jetty and Tomcat to test web applications.</li><li>The integration of Spring Boot with the Spring ecosystem which includes Spring Data, Spring Security, Spring ORM, and Spring JDBC is easy.</li><li>Provides many plugins that developers can use to work with embedded and in-memory databases smoothly and readily.</li><li>Allows for easily connecting with database and queue services like Oracle, PostgreSQL, MySQL, MongoDB, Redis, Solr, ElasticSearch, Rabbit MQ, ActiveMQ, and many more.</li><li>Provides admin support – you can manage via remote access to the application.</li></ul><ul><li>Eases the dependency and comes with Embedded Servlet Container.</li><li>Offers flexibility in configuring XML configurations, Java Beans, and Database Transaction.</li></ul><ul><li>Offers easy access to Command Line Interface which makes the development and testing of Spring Boot apps built with Java or Groovy agile.</li></ul><h2><img class='aligncenter wp-image-26069 size-full' src='https://scand.com/wp-content/uploads/2020/06/spring-KV3.jpg' alt='' width='1110' height='300' srcset='https://scand.com/wp-content/uploads/2020/06/spring-KV3.jpg 1110w, https://scand.com/wp-content/uploads/2020/06/spring-KV3-489x132.jpg 489w, https://scand.com/wp-content/uploads/2020/06/spring-KV3-1024x277.jpg 1024w, https://scand.com/wp-content/uploads/2020/06/spring-KV3-768x208.jpg 768w' sizes='(max-width: 1110px) 100vw, 1110px'></h2><h2>Disadvantages of Spring Boot</h2><p>The biggest challenge many developers face when using Spring Boot is the lack of control. The opinionated style installs many additional dependencies (that often go unused) which increases the deployment file size.</p><p>The Spring Boot artifact may be run directly in Docker containers. This is useful to get when you need to quickly create microservices. Yet, some developers argue that since Spring Boot was designed to be lightweight and agile, it should therefore not be used for monolithic applications.</p><p>Though Spring Boot comes with some basic tools for logs and your app health monitoring, these aren’t sufficient. Tools like Retrace help teams to monitor Java apps with ease. This tool helps to detect slow SQL queries, provides performance and CPU usage reports and shows the most common errors by interpreting the logs.</p><p>On top of that, it can be quite challenging to update your legacy Spring code. You can overcome this problem by using tools such as the Spring Boot CLI (Command Line Interface) that will help you convert your legacy code.</p><p>Some other disadvantages are:</p><ul><li>If you have never worked with Spring before and want to learn about proxies, dependency injection, and AOP programming, it is not recommended to start with Spring Boot because it doesn’t cover most of these details.</li><li>You really have to understand a lot of the underlying Spring systems (and a bit of Spring history too), along with some advanced topics in order to modify and troubleshoot it.</li><li>Spring Boot works well with microservices. The Spring Boot artifacts can be deployed directly into Docker containers. However, some developers don’t recommend the framework for building large and monolithic apps.</li><li>If you are not familiar with other projects of the Spring ecosystem like Spring Security, Spring AMQP, Spring Integration, etc), using them with Spring Boot will make you miss many concepts that you would grasp if you had started using them independently.</li></ul><h2></h2><h2>Bottom Line</h2><p>The Spring Boot framework was designed to help developers reduce the time on development and improve performance by providing a default unit setup and integration tests. If you want to start your <a href='/technologies/java/'>Java app development</a> project quickly, you can just accept all the default property values and skip the XML configuration.</p><p>Spring Boot is simply an extension of Spring itself to make the development, testing, and deployment more convenient. If you are experiencing problems with your <a href='/technologies/spring-boot/'>Spring Boot application development</a> project, you can <a href='/contact-us/'>get a free consultation</a> at SCAND. We have a team of seasoned developers to help make your project more efficient!</p></div>",
                kategori_id=Kategori.query.first().id
            )
        )

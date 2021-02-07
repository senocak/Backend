import uuid
from http import HTTPStatus
from flask import Blueprint, request, jsonify, send_file
from app.exception import NotFound, BadRequest, getStatus
from app.service import Middleware, AuthServis, KategoriServis, YaziServis, UserService, SeedServis
from werkzeug.utils import secure_filename

routes = Blueprint('routes', __name__)
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}


@routes.route('/', methods=['GET'])
def index():
    return jsonify('Hello World')


@routes.route('/kayit', methods=["POST"])
def tokena_gore_kullanici():
    status = HTTPStatus.CREATED.real
    data = request.json
    try:
        AuthServis.kullanici_data_dogrulama(data)
        token = AuthServis.kayit(data)
        response = {
            "Kullanıcı": AuthServis.tokena_gore_kullanici(token),
            "Token": token
        }
    except Exception as e:
        response = {'Hata': str(e)}
        status = getStatus(e)
    return response, status


@routes.route('/giris', methods=["POST"])
def giris():
    data = request.json
    status = HTTPStatus.OK.real
    try:
        AuthServis.kullanici_data_dogrulama(data)
        token = AuthServis.giris(data)
        response = {
            "Kullanıcı": AuthServis.tokena_gore_kullanici(token),
            "Token": token
        }
    except Exception as e:
        response = {'Hata': str(e)}
        status = getStatus(e)
    return response, status


@routes.route('/cikis', methods=["POST"])
@Middleware.token_required
def cikis():
    status = HTTPStatus.OK.real
    try:
        auth_token = request.headers.get('Authorization')
        AuthServis.cikis(auth_token)
        response = {'mesaj': "Çıkış Başarılı"}
    except Exception as e:
        response = {'Hata': str(e)}
        status = getStatus(e)
    return response, status


@routes.route('/kullanicilar', methods=["GET"])
@Middleware.admin_token_required
def tum_kullanicilar():
    return jsonify([
        {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'registered_on': user.registered_on,
            'admin': user.admin
        }
        for user in UserService.tum_kullanicilar()
    ])


@routes.route('/kullanici/<k_id>', methods=["GET"])
@Middleware.token_required
def tek_kullanici(k_id):
    status = HTTPStatus.OK.real
    try:
        auth_token = request.headers.get('Authorization')
        user = UserService.tek_kullanici(k_id, auth_token)
        response = {
            'id': user.id,
            'email': user.email,
            'registered_on': user.registered_on,
            'admin': user.admin
        }
    except Exception as e:
        response = {'Hata': str(e)}
        status = getStatus(e)
    return response, status


@routes.route('/yazilar', methods=["GET"])
def tum_yazilar_sayfalama():
    status = HTTPStatus.OK.real
    try:
        sayfa = request.args.get('sayfa', 1, type=int)
        adet = request.args.get('adet', 10, type=int)
        if sayfa < 1 or adet < 1:
            sayfa = 1
            adet = 1
        yazilar = []
        sayfalanmis_yazilar = YaziServis.tum_yazilar_sayfalama(sayfa, adet)
        for p in sayfalanmis_yazilar.items:
            kategori = {"id": p.kategori.id, "url": p.kategori.url, "baslik": p.kategori.baslik}
            post = {"id": p.id, "baslik": p.baslik, "url": p.url, "icerik": p.icerik, "kategori": kategori}
            yazilar.append(post)
        if adet > len(yazilar):
            adet = len(yazilar)
        yazilar.append({"sayfa": sayfa, "adet": adet})
        response = jsonify(yazilar)
    except Exception as e:
        response = {'Hata': str(e)}
        status = getStatus(e)
    return response, status


@routes.route('/yazi/<yazi_url>', methods=["GET"])
def tek_yazi(yazi_url):
    status = HTTPStatus.OK.real
    try:
        single_post = YaziServis.tek_yazi_with_url(yazi_url)
        response = jsonify({
            "id": single_post.id,
            "baslik": single_post.baslik,
            "url": single_post.url,
            "icerik": single_post.icerik,
            "created_on": single_post.created_on,
            "kategori": {
                "id": single_post.kategori.id,
                "baslik": single_post.kategori.baslik,
                "url": single_post.kategori.url,
                "created_on": single_post.kategori.created_on
            }
        })
    except Exception as e:
        response = {'Hata': str(e)}
        status = getStatus(e)
    return response, status


@routes.route('/kategoriler', methods=["GET"])
def tum_kategoriler():
    status = HTTPStatus.OK.real
    try:
        kategoriler = []
        all_kategoriler = KategoriServis.tum_kategoriler()
        for k in all_kategoriler:
            kategoriler.append({"id": k.id, "url": k.url, "baslik": k.baslik})
        response = jsonify(kategoriler)
    except Exception as e:
        response = {'Hata': str(e)}
        status = getStatus(e)
    return response, status


@routes.route('/kategori/<kategori_id>', methods=["GET"])
def idye_gore_kategori(kategori_id):
    yazi = request.args.get('yazi')
    status = HTTPStatus.OK.real
    try:
        kategori = KategoriServis.idye_gore_kategori(kategori_id)
        response = {
                'id': kategori.id,
                'url': kategori.url,
                'baslik': kategori.baslik
            }
        if yazi == "1":
            response["yazilar"] = [
                    {'id': p.id, 'baslik': p.baslik, "icerik": p.icerik}
                    for p in kategori.yazi
                ]
    except Exception as e:
        response = {'Hata': str(e)}
        status = getStatus(e)
    return response, status


@routes.route('/admin/kategori', methods=["POST"])
@Middleware.token_required
def kategori_ekle():
    status = HTTPStatus.CREATED.real
    try:
        kategori = request.json
        KategoriServis.kategori_data_dogrula(kategori)
        response = KategoriServis.kategori_ekle(kategori)
    except Exception as e:
        response = {'Hata': str(e)}
        status = getStatus(e)
    return response, status


@routes.route('/admin/kategori/<kategori_url>', methods=["PATCH"])
@Middleware.token_required
def kategori_guncelle(kategori_url):
    status = HTTPStatus.OK.real
    try:
        response = KategoriServis.kategori_guncelle(kategori_url, request.json)
    except Exception as e:
        response = {'Hata': str(e)}
        status = getStatus(e)
    return response, status


@routes.route('/admin/kategori/<kategori_id>', methods=["DELETE"])
@Middleware.token_required
def kategori_sil(kategori_id):
    status = HTTPStatus.NO_CONTENT.real
    try:
        response = KategoriServis.kategori_sil(kategori_id)
    except Exception as e:
        response = {'Hata': str(e)}
        status = getStatus(e)
    return response, status


@routes.route('/admin/yazi', methods=["POST"])
@Middleware.token_required
def yazi_ekle():
    status = HTTPStatus.CREATED.real
    try:
        response = YaziServis.ekle(request.json)
    except Exception as e:
        response = {'Hata': str(e)}
        status = getStatus(e)
    return response, status


@routes.route('/admin/yazi/<yazi_url>', methods=["PATCH"])
@Middleware.token_required
def yazi_guncelle(yazi_url):
    status = HTTPStatus.OK.real
    try:
        response = YaziServis.guncelle(yazi_url, request.json)
    except Exception as e:
        response = {'Hata': str(e)}
        status = getStatus(e)
    return response, status


@routes.route('/admin/yazi/<url>', methods=["DELETE"])
@Middleware.token_required
def yazi_sil(url):
    status = HTTPStatus.NO_CONTENT.real
    try:
        response = YaziServis.sil(url)
    except Exception as e:
        response = {'Hata': str(e)}
        status = getStatus(e)
    return response, status


@routes.route('/resim', methods=['POST'])
@Middleware.token_required
def resim_ekle():
    status = HTTPStatus.OK.real
    try:
        if 'resim' not in request.files:
            raise BadRequest("Resim alanı zorunlu")
        file = request.files['resim']
        if file.filename == '':
            raise BadRequest("Resim alanı boş geçilemez")
        if file is None or \
                '.' not in file.filename or \
                file.filename.rsplit('.', 1)[1].lower() not in ALLOWED_EXTENSIONS:
            raise NotFound("Geçersiz resim.")
        # ext = file.filename.rsplit('.', 1)[1].lower()
        file.filename = str(uuid.uuid4()) + ".png"
        filename = secure_filename(file.filename)
        file.save("images/" + secure_filename(filename))
        response = {"resim": filename}
    except Exception as e:
        response = {'Hata': str(e)}
        status = getStatus(e)
    return response, status


@routes.route('/resim/<resim_id>', methods=['GET'])
def resim(resim_id):
    status = HTTPStatus.OK.real
    try:
        response = send_file("../images/" + resim_id + ".png", mimetype='image/gif')
    except Exception as e:
        response = {'Hata': str(e)}
        status = getStatus(e)
    return response, status


@routes.route('/seed', methods=["GET"])
# @Middleware.token_required
def seed():
    status = HTTPStatus.CREATED.real
    try:
        SeedServis.seed()
        response = {'mesaj': "Seed OK"}
    except Exception as e:
        response = {'Hata': str(e)}
        status = getStatus(e)
    return response, status

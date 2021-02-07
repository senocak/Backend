const   router              = require("express").Router(),
        AyarController      = require("./controller/AyarController"),
        ApiController       = require("./controller/ApiController");

router.get("/api/yazilar", ApiController.getTumYazilar);    // ?sayfa=1
router.get("/api/yazilar/:yazi_url", ApiController.getYazi);
router.post("/api/yazilar/ekle", ApiController.authenticateJWT, ApiController.postYaziEkle);
router.put("/api/yazilar/:yazi_url", ApiController.authenticateJWT, ApiController.putYaziDuzenle);
router.delete("/api/yazilar/:yazi_url", ApiController.authenticateJWT, ApiController.deleteYaziSil);

router.get("/api/yorumlar", ApiController.getYorumlar); // ?populate=true
router.get("/api/yorumlar/:yazi_url", ApiController.getYorumForYazi); // ?populate=true
router.post("/api/yorumlar/:yazi_url", ApiController.postYorumForYazi);
router.delete("/api/yorumlar/:yorum_id", ApiController.authenticateJWT, ApiController.deleteYorumForYazi);

router.post("/api/login", ApiController.postLogin);
router.post("/api/profile", ApiController.authenticateJWT, ApiController.postProfile);

router.get("/api/kategoriler", ApiController.getTumKategoriler);
router.get("/api/kategoriler/:kategori_url", ApiController.getKategori); //  ?sayfa=1
router.post("/api/kategoriler/ekle", ApiController.authenticateJWT, ApiController.postKategoriEkle);
router.put("/api/kategoriler/:kategori_url", ApiController.authenticateJWT, ApiController.putKategoriDuzenle);
router.delete("/api/kategoriler/:kategori_url", ApiController.authenticateJWT, ApiController.deleteKategoriSil);

router.get("/api/ckeditor/resimler", ApiController.authenticateJWT, AyarController.getResimler);
router.post("/api/ckeditor/resimler", ApiController.authenticateJWT, AyarController.postResimEkle);
router.delete("/api/ckeditor/resimler", ApiController.authenticateJWT, AyarController.deleteResim);

router.get("/api/ayar/stackoverflow/:username", AyarController.fetchStackoverflow);
router.get("/api/ayar/github/:username", AyarController.fetchGithub);

module.exports = router;
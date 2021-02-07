let Blog = {
    template: `
<div>
    <section id="header" style="margin: 0px;">
        <p>
            <router-link :to="{ name: 'blogKategoriler', params: {kategori_url: 'all' } }"  class="nav-link Flintstone">All</router-link>
            <router-link v-for="(kategori, index) in kategoriler" :key="index" :to="{ name: 'blogKategoriler', params: {kategori_url: kategori.url } }"  class="nav-link Flintstone">{{ kategori.baslik }}</router-link>
        </p>
    </section>
    <div v-if="yazilar">
        <img src="/assets/loading.png" v-if="yazilar.length < 1">
        <section class="summary" v-for="(yazi, index) in yazilar" :key="index">
            <h2>
                <router-link :to="{ name: 'blogYazi', params: {yazi_url: yazi.url } }" class="Flintstone">{{ yazi.baslik }}</router-link>
            </h2>
            <time>{{ getHumanDate(yazi.created_at) }}</time> |
            <time>{{ yazi.kategori.baslik }}</time> |
            <time>{{ yazi.yorum.length }} Yorum</time> |
            <time v-for="(etiket, index) in yazi.etiketler.split(',')" :key="index" class="badge" v-if="etiket">{{ etiket }}</time>
            <article class="card-text" style="text-align: justify;">{{ strippedContent(yazi.icerik.substring(0, 500)) }}...</article>
        </section>
        <section id="paginator">

            <a v-if="currentPage != 1" v-on:click="getYazilar(kategori_url, 1)"><span><i class="fas fa-angle-double-left"></i></span></a>
            <a v-if="currentPage-1 > 0" v-on:click="getYazilar(kategori_url, currentPage-1)"><span><i class="fas fa-angle-left"></i></span></a>

            <a  v-for="index in last_page"
                :key="index"
                v-bind:class="[index === currentPage ? 'selected' : '']"
                v-on:click="getYazilar(kategori_url, index)"
            >{{ index }}</a>

            <a v-if="currentPage != last_page" v-on:click="getYazilar(kategori_url, last_page)"><span><i class="fas fa-angle-double-right"></i></span></a>
            <a v-if="currentPage < last_page" v-on:click="getYazilar(kategori_url, currentPage+1)"><span><i class="fas fa-angle-right"></i></span></a>

        </section>
    </div>
    <div v-else-if="yazi">

        <section class="summary">
            <h2>
                <router-link :to="{ name: 'blogYazi', params: {yazi_url: yazi.url } }" class="Flintstone">{{ yazi.baslik }}</router-link>
            </h2>
            <time>{{ getHumanDate(yazi.created_at) }}</time> |
            <time>{{ yazi.kategori.baslik }}</time> |
            <time>{{ yazi.yorum.length }} Yorum</time> |
            <time v-for="(etiket, index) in yazi.etiketler.split(',')" :key="index">{{ etiket }}</time>
            <img :src="'/kategoriler/'+yazi.kategori.resim" :alt="yazi.baslik" class="profile-img" style="border-radius: unset;">
            <p class="card-text" style="text-align: justify;" v-html="yazi.icerik"></p>

        </section>
    </div>
    <div v-else>
        <h1>else</h1>
    </div>
</div>
`,
    data() {
        return {
            kategoriler: [],
            yazilar: [],
            yazi: [],
            kategori_url: null,
            yazi_url: null,
            currentPage: 1,
            last_page: 1,
            page: 1
        };
    },
    created() {
        //console.log(this.$store.getters.token)
        this.$watch("$route",() => {
                this.kategori_url = this.$route.params.kategori_url ? this.$route.params.kategori_url : null;
                this.yazi_url = this.$route.params.yazi_url ? this.$route.params.yazi_url : null;
                if (this.kategori_url){
                    if (this.kategori_url == "all" || this.kategori_url == "" || this.kategori_url == null){
                        this.getYazilar(null, 1)
                    }else{
                        this.getYazilar(this.kategori_url, this.page)
                    }
                }else if (this.yazi_url){
                    this.getYazi(this.yazi_url)
                }
            },
            { immediate: true });
    },
    mounted() {
        this.getKategoriler()
        if (!this.$route.params.kategori_url && !this.$route.params.yazi_url){
            this.getYazilar(null, this.page)
        }
    },
    methods: {
        async getKategoriler() {
            const res = await axios.get(`${this.$root.api_base}/kategoriler`, {crossdomain: true})
            this.kategoriler = res.data
        },
        async getYazilar(kategori_url = null, page = 1) {
            let api = kategori_url
                ? `${this.$root.api_base}/kategori/${kategori_url}/yazilar?page=${page}`
                : `${this.$root.api_base}/yazilar?page=${page}`
            const res = await axios.get(api, {crossdomain: true})
            this.yazilar = res.data.data
            this.currentPage = res.data.current_page
            this.last_page = res.data.last_page
            this.yazi = null
        },
        async getYazi(yazi_url) {
            const res = await axios.get(`${this.$root.api_base}/yazi/${yazi_url}`, {crossdomain: true})
            this.yazi = res.data
            this.yazilar = null
            this.currentPage = 1
            this.last_page = 1
        },
        getHumanDate: function (date) {
            return moment(date).locale("tr").fromNow();
        },
        strippedContent: function(string) {
            return string.replace(/<\/?[^>]+>/ig, " ");
        }
    }
};

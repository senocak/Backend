let Login = {
    template: `
<div class="Login ">
    <form class="form" @submit.prevent="login">
      <div v-for="e in error" :key="e.id" class="alert alert-warning alert-dismissible fade show" role="alert" style="color: #721c24 !important;background-color: #f8d7da !important;border-color: #f5c6cb !important;">
        {{ e.mesaj }}
        <button type="button" class="close" data-dismiss="alert" aria-label="Close" @click="deleteErrors">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>

      <div :class="{'is-waiting': sending}">
        <div class="form-group">
          <label for="login-email">Email adresiniz</label>
          <input v-model.trim="email" class="input" type="email" placeholder="E-mail adresiniz" tabindex="1" required :disabled="sending">
        </div>

        <div class="form-group">
          <label for="login-pass" class="d-block">Şifreniz</label>
          <input v-model.trim="sifre" class="input" type="password" placeholder="Şifreniz" tabindex="2" required :disabled="sending">
        </div>

          <button class="btn btn-primary" tabindex="3" :disabled="sending">Login</button>
      </div>
    </form>
</div>
`,
    data() {
        return {
            sending: false,
            email: 'anil@bilgimedya.com.tr',
            sifre: 'anil@bilgimedya.com.tr',
            error: []
        };
    },
    created() {
        if (this.$store.getters.isAuthenticated === true){
            this.$router.push(this.$route.query.redirect || '/admin/yazilar')
        }
    },
    methods: {
        async login() {
            this.error = []
            this.sending = true
            await axios.post(`${this.$root.api_base}/login`, {
                email: this.email,
                sifre: this.sifre
            })
            .then(response => {
                this.$store.dispatch('login', {
                    "email": this.email,
                    "api_token": response.data.access_token
                })
                this.$router.push(this.$route.query.redirect || '/admin/yazilar')
            },(error) => {
                if(error.response.status === 500)this.error.push({"id":0, "mesaj": error.response.data.hata + " Hata: " + error.response.data.mesaj})
                if(error.response.data.hata.email)this.error.push({"id":0, "mesaj":error.response.data.hata.email[0]})
                if(error.response.data.hata.sifre)this.error.push({"id":1, "mesaj":error.response.data.hata.sifre[0]})
            })
            .catch((e) => {
                this.error.push({"id":0, "mesaj": `Beklenmedik bir hata oluştu. ${e}`})
            })
            .finally(() => {
                this.sending = false
            })
        },
        deleteErrors(){
            this.error = []
        }
    }
};

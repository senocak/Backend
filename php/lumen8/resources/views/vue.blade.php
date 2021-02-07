
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="author" content="Anıl Şenocak">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <title>Anıl Şenocak</title>
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/css/all.min.css" rel="stylesheet">
        <meta http-equiv="x-ua-compatible" content="ie=edge">
        <link rel="stylesheet" href="/assets/main.css">
        <link rel="stylesheet" href="/assets/prism.css">
    </head>
    <body>
        <div id="app" style="    width: 50%;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;">
            <section id="header">
                <div class="header-icons">
                    <a href="https://github.com/senocak" title="Github" target="_blank"><i class="fab fa-github"></i></a>
                    <a href="https://www.linkedin.com/in/anilsenocak27" title="LinkedIn" target="_blank"><i class="fab fa-linkedin"></i></a>
                    <a href="https://stackoverflow.com/users/11922928/anıl-Şenocak" title="StackOverflow" target="_blank"><i class="fab fa-stack-overflow"></i></a>
                    <router-link to="/login"><i class="fa fa-user"></i></router-link>
                    <a onclick="toggle()"><i class="fas fa-bullseye"></i></a>
                    <input style="visibility: hidden;" type="checkbox" id="theme_checkbox">
                </div>
                <h1>
                    <router-link to="/" class="Flintstone glitch" data-text="Anıl Şenocak">Anıl Şenocak</router-link>
                </h1>
                <h2 class="tagline Flintstone">Programmer, MetalHead, Tech Enthusiast</h2>
                <p>
                    <router-link class="nav-link Flintstone" to="/">Home</router-link>
                    <router-link class="nav-link Flintstone" to="/blog">Blogs</router-link>
                    <router-link class="nav-link Flintstone" to="/about">Resume</router-link>
                </p>
            </section>
            <transition name="slither" mode="out-in">
                <router-view></router-view>
            </transition>
            <section id="footer"></section>
        </div>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.6.10/vue.min.js"></script>
        <script src="https://npmcdn.com/vue-router/dist/vue-router.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/vuex/2.1.1/vuex.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/axios/0.19.0/axios.min.js"></script>
        <script src="https://momentjs.com/downloads/moment.js"></script>
        <script src="/assets/prism.js"></script>
        <script src="/pages/home.vue.js"></script>
        <script src="/pages/blog.vue.js"></script>
        <script src="/pages/about.vue.js"></script>
        <script src="/pages/login.vue.js"></script>
        <script>
            Vue.mixin({
                mounted () {
                    Prism.highlightAll();
                }
            })
            const router = new VueRouter({
                routes: [
                    { path: '/', component: Home, name:"home" },
                    { path: '/blog', component: Blog, name:"blog" },
                    { path: '/blog/kategoriler/:kategori_url?', component: Blog, name:"blogKategoriler", props: true },
                    { path: '/blog/yazi/:yazi_url?', component: Blog, name:"blogYazi", props: true },
                    { path: '/about', component: About, meta: { requiresAuth: true } },
                    { path: '/login', component: Login }
                ],
                mode: 'history',
                base: '/'
            })
            router.beforeEach((to, from, next) => {
                if (to.matched.some(record => record.meta.requiresAuth)) {

                    if (!store.getters.isAuthenticated) {
                        next({
                            path: '/login',
                            query: { redirect: to.fullPath }
                        })
                    } else {
                        next()
                    }
                } else {
                    next()
                }

                if (to.matched.some(record => record.meta.guestOnly)) {
                    if (store.getters.isAuthenticated) {
                        next({path: '/'})
                    } else {
                        next()
                    }
                } else {
                    next()
                }

            })
            let store = new Vuex.Store({
                state: {
                    isAuthenticated: !!localStorage.getItem('token'),
                },
                getters: {
                    isAuthenticated(state) {
                        return state.isAuthenticated;
                    },
                    email(state) {
                        if (!state.isAuthenticated) return false;
                        return localStorage.getItem('email');
                    },
                    token(state) {
                        if (!state.isAuthenticated) return false;
                        return localStorage.getItem('token');
                    }
                },
                mutations: {
                    authenticate (state, payload) {
                        state.isAuthenticated = true;
                        localStorage.setItem('token', payload.api_token);
                        localStorage.setItem('email', payload.email);
                    },
                    updateUser (state, payload) {
                        localStorage.setItem('email', payload.email);
                    },
                    logout(state) {
                        state.isAuthenticated = false;
                        localStorage.removeItem('token');
                        localStorage.removeItem('email');
                    }
                },
                actions: {
                    login (context, payload) {
                        context.commit('authenticate', payload);
                    },
                    updateUser (context, payload) {
                        context.commit('updateUser', payload);
                    },
                    logout (context) {
                        context.commit('logout');
                    },
                }
            })
            let app = new Vue({
                el: '#app',
                router,
                data() {
                    return {
                        authstatus: false,
                        api_base: "http://localhost:8000/api"
                    };
                },
                store
            })
            toggle()
            function toggle(){
                const hasLocalStorage = localStorage.getItem('theme')
                const toggle = document.getElementById('theme_checkbox')
                const html = document.documentElement

                if (toggle.checked) {
                    toggle.checked = false
                    html.classList.add('dark')
                    html.classList.remove('light')
                    localStorage.setItem('theme', 'dark')
                } else {
                    toggle.checked = true
                    html.classList.remove('dark')
                    html.classList.add('light')
                    localStorage.setItem('theme', 'light')
                }
            }
        </script>
    </body>
</html>

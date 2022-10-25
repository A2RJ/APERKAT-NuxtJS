<template>
  <div>
    <!-- Page Wrapper -->
    <div v-show="!isLoggedIn">
      <Nuxt />
    </div>
    <div id="wrapper" v-show="isLoggedIn">
      <!-- Sidebar -->
      <Sidebar></Sidebar>
      <!-- Content Wrapper -->
      <div id="content-wrapper" class="d-flex flex-column">
        <!-- Main Content -->
        <div id="content">
          <!-- Topbar -->
          <Topbar></Topbar>
          <!-- Begin Page Content -->
          <div class="container-fluid">
            <!-- Page Heading -->
            <KeepAlive>
              <transition name="slide-bottom">
                <Nuxt />
              </transition>
            </KeepAlive>
          </div>
          <!-- /.container-fluid -->
        </div>
        <!-- End of Main Content -->
        <!-- Footer -->
      </div>
      <!-- End of Content Wrapper -->
    </div>
    <!-- End of Page Wrapper -->
  </div>
</template>

<script>
import Sidebar from "@/components/Sidebar.vue";
import Topbar from "@/components/Topbar.vue";
import Footer from "@/components/Footer.vue";
import { mapState, mapMutations } from "vuex";

export default {
  transition: "slide-bottom",

  data() {
    return {
      isLoggedIn: this.$store.state.auth.loggedIn,
    };
  },
  computed: {
    ...mapState(["isAuth", "level"]),
  },
  methods: {
    ...mapMutations(["SET_IS_AUTH", , "SET_LEVEL"]),
  },
  components: {
    Sidebar: Sidebar,
    Topbar: Topbar,
    Footer: Footer,
  },
  mounted() {
    !(function (t) {
      "use strict";
      t("#sidebarToggle, #sidebarToggleTop").on("click", function (o) {
        t("body").toggleClass("sidebar-toggled"),
          t(".sidebar").toggleClass("toggled"),
          t(".sidebar").hasClass("toggled") &&
            t(".sidebar .collapse").collapse("hide");
      }),
        t(window).resize(function () {
          t(window).width() < 768 && t(".sidebar .collapse").collapse("hide");
        }),
        t("body.fixed-nav .sidebar").on(
          "mousewheel DOMMouseScroll wheel",
          function (o) {
            if (768 < t(window).width()) {
              var e = o.originalEvent,
                l = e.wheelDelta || -e.detail;
              (this.scrollTop += 30 * (l < 0 ? 1 : -1)), o.preventDefault();
            }
          }
        ),
        t(document).on("scroll", function () {
          100 < t(this).scrollTop()
            ? t(".scroll-to-top").fadeIn()
            : t(".scroll-to-top").fadeOut();
        }),
        t(document).on("click", "a.scroll-to-top", function (o) {
          var e = t(this);
          t("html, body")
            .stop()
            .animate(
              { scrollTop: t(e.attr("href")).offset().top },
              1e3,
              "easeInOutExpo"
            ),
            o.preventDefault();
        });
    })(jQuery);
  },
};
</script>

<style>
html {
  font-family: "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}

.page-enter-active,
.page-leave-active {
  transition: opacity 0.5s;
}
.page-enter,
.page-leave-to {
  opacity: 0;
}

.layout-enter-active,
.layout-leave-active {
  transition: opacity 0.5s;
}
.layout-enter,
.layout-leave-to {
  opacity: 0;
}

.slide-bottom-enter-active,
.slide-bottom-leave-active {
  transition: opacity 0.25s ease-in-out, transform 0.25s ease-in-out;
}
.slide-bottom-enter,
.slide-bottom-leave-to {
  opacity: 0;
  transform: translate3d(0, 15px, 0);
}
.bounce-enter-active {
  transform-origin: top;
  animation: bounce-in 0.8s;
}
.bounce-leave-active {
  transform-origin: top;
  animation: bounce-out 0.5s;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes bounce-out {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(0);
  }
}
</style>

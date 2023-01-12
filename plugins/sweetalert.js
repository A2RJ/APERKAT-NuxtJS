import Vue from "vue";
import VueSweetalert2 from "vue-sweetalert2";
import "./../static/vendor/sweetalert/sweetalert2.css";

const options = {
  confirmButtonColor: "#41b882",
  cancelButtonColor: "#ff7674",
};

Vue.use(VueSweetalert2, options);

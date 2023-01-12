<template>
  <div>
    <pencairan-lpj-keuangan v-if="userLogin == 120 || userLogin == 121" />
    <grafik v-else />
  </div>
</template>
<script>
import { mapActions, mapState } from "vuex";
import pencairanLpjKeuangan from "../components/pencairanLpjKeuangan.vue";

export default {
  middleware: ["authorized"],
  components: { pencairanLpjKeuangan },
  async asyncData({ store }) {
    await Promise.all([
      store.dispatch(
        "subordinate/getGrafik",
        store.$auth.$state.user[0].id_user
      ),
    ]);
    return;
  },
  data() {
    return {
      userLogin: this.$store.state.auth.user[0].id_user,
    };
  },
  computed: {
    ...mapState("subordinate", {
      grafik: (state) => state.grafik,
    }),
  },
  mounted() {
    // this.send();
  },
  methods: {
    ...mapActions("subordinate", ["getGrafik"]),

    /**
     * Buat tombol on of notifikasi whatsapp di aperkat khusus admin
     */

    // async send() {
    //   try {
    //     const data = await this.$sendNotification();
    //     console.log(data);
    //   } catch (error) {
    //     console.log(error);
    //   }
    // },
  },
};
</script>

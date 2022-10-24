// app, route, store, redirect
export default ({ app, route, store }, inject) => {
  inject("user", () => {
    const auth = store.state.auth.user;
    return {
      id_user: auth[0].id_user,
      fullname: auth[0].fullname,
      email: auth[0].email,
      role: auth[1].level,
    };
  });

  inject("isAuthorized", (role) => {
    if (!role) throw new Error("Role is required");
    if (typeof role === "string") role = [role];
    return role.includes(store.state.auth.user[1].level);
  });

  inject("route", () => {
    return route.path;
  });

  inject("lastId", () => {
    if (!route.params && route.params.id) throw new Error("Id is required");
    return route.params.id;
  });

  inject("isYourSubmission", async () => {
    if (!route.params && route.params.id) throw new Error("Id is required");
    const { data } = await app.$axios.get(`/pengajuan/${route.params.id}`);
    if (!data.data) return { status: "invalid" };
    const { id_user: pengajuanIdUser } = data.data;

    return pengajuanIdUser === store.state.auth.user[0].id_user
      ? { status: "valid" }
      : { status: "invalid" };
  });

  inject("isHasAccess", async () => {
    if (!route.params && route.params.id) throw new Error("Id is required");
    const { data } = await app.$axios.get(
      `/pengajuan/checkIfHasAccess/${route.params.id}/${store.state.auth.user[0].id_user}`
    );
    return data;
  });
};

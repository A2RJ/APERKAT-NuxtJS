export default async function ({ app, route, redirect }) {
  const isAuthorized =
    app.$isAuthorized("dirKeuangan") || app.$isAuthorized("prodi");

  if (!isAuthorized) {
    return redirect("/");
  }
}

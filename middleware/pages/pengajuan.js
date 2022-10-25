export default async function ({ app, route, redirect }) {
  const keuangan = app.$isAuthorized("dirKeuangan");
  const prodi = app.$isAuthorized("prodi");
  const isAuthorized = keuangan || prodi;
  if (!isAuthorized) {
    return redirect("/");
  }
}

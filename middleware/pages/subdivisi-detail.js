export default async function ({ app, route, redirect }) {
  const isHasAccess = await app.$isHasAccess();
  if (!isHasAccess) {
    return redirect("/");
  }
}

import * as Realm from "realm-web";

const app = new Realm.App({ id: import.meta.env.VITE_REALM_APP_ID });

export async function getMongoCollection() {
  // Anonymous login (we enabled it in App Services)
  const user = await app.logIn(Realm.Credentials.anonymous());

  // "mongodb-atlas" is the default linked data source name
  const mongo = user.mongoClient("mongodb-atlas");
  return mongo.db("demo").collection("posts");
}

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const fetch = require("isomorphic-fetch");
const crypto = require("crypto");
const ethers = require("ethers");
const TicketMasterInterface = require("./TicketMaster.json");
const { Firestore } = require("@google-cloud/firestore");

const serviceAccount = require("./admin.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = new Firestore();

const TM_ADDRESS = "0x5BCefE9f11D2C70171a7a2Cc284A846C13AAB082";
const INFURA_KEY = "e835057bad674697959be47dcac5028e";
const ALCHEMY_KEY = "qBX0xHXWTh77uA-Yqo7I1xBdxO5wJKqx";
const pp = "d386e3dac68bcd13d229a89eef9fc4ee2610ab7c708d0c9ba91998752fa9462c";

const baseURI =
  "ipfs://QmUafLeh6p11WrB9Ew79xw5QPXq8wbzywvViVJ51dVjN92/ticket-meta";

const infuraUrl = `https://rinkeby.infura.io/v3/${INFURA_KEY}`;

const provider = ethers.getDefaultProvider("rinkeby", {
  infura: INFURA_KEY,
  alchemy: ALCHEMY_KEY,
});

let owner = new ethers.Wallet(pp);
owner = owner.connect(provider);
const contract = new ethers.Contract(
  TM_ADDRESS,
  TicketMasterInterface.abi,
  provider
);
const contractSigner = contract.connect(owner);

const QR = "QR";
exports.buyTicket = functions.https.onCall(async (data, context) => {
  console.log(context.auth);
  //   const tx = await contractSigner.createTicket(owner.address, "chicken");
  //   const receipt = await tx.wait();
  //   for (const event of receipt.events) {
  //     console.log(event);
  //   }
  const shasum = crypto.createHash("sha256");
  shasum.update("ticketmaster1" + context.auth.uid);
  const qr = shasum.digest("hex");
  console.log("what");
  const snapshots = await db.collection(QR).get();
  const ticketId = snapshots.size === 0 ? 1 : snapshots.size;
  db.collection(QR).doc(context.auth.uid).set({ qr, ticketId });
  console.log(qr);
  return qr;
});

exports.getUserTicket = functions.https.onCall(async (data, context) => {
  const ticket = await db.collection(QR).doc(context.auth.uid).get();
  return ticket.data();
});

exports.boopTicket = functions.https.onCall(async (data, context) => {
  const querySnapshot = await db.collection(QR).where("qr", "==", data).get();
  querySnapshot.forEach(async (doc) => {
    const ticketId = doc.data().ticketId;
    const tx = await contractSigner.boopTicket(
      ticketId,
      `${baseURI}/tm-${ticketId}.json`
    );
    const receipt = await tx.wait();
    for (const event of receipt.events) {
      console.log(event);
    }
  });

  return true;
});

const baseUrl = "https://discord.com/api";
const client_id = "847701412002660362";
const client_secret = "tIdB27NpG88weILAwAtEMr0OpIh5CnNO";
const redirect_uri = "http://localhost:3000/callback";
exports.discordAuth = functions.https.onCall(async (data, context) => {
  const { code, grant_type, refresh_token } = data;
  const tokens = await fetch(baseUrl + "/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      code,
      client_id,
      client_secret,
      grant_type,
      redirect_uri,
      refresh_token,
    }),
  }).then((r) => r.json());

  const dUser = await fetch(`${baseUrl}/users/@me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${tokens.access_token}`,
    },
  }).then((r) => r.json());
  const shasum = crypto.createHash("sha256");
  shasum.update(dUser.email);
  const password = shasum.digest("hex");

  let userRecord;
  userRecord = await admin
    .auth()
    .createUser({
      email: dUser.email,
      displayName: dUser.username,
      password,
    })
    .catch(async (e) => {
      return (userRecord = await admin.auth().getUserByEmail(dUser.email));
    });

  const token = await admin.auth().createCustomToken(userRecord.uid);
  return { tokens, dUser, userRecord, token };
});

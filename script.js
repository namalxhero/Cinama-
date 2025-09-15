import { Client, Account, Storage, ID } from "https://cdn.jsdelivr.net/npm/appwrite@13.0.0/+esm";

// ------------------ Appwrite Config ------------------
const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("68c820a000390034bdae") // Project ID
  .setKey("standard_0266e38d4b2cc97e9d3a6d4dda3e65e8ce015592fcbc042bab0a206e4fd15c8d41e8f0a35afc867b8cb41ea8fe48bb821af3c06ce266bdb13eaefd521fc49c9c19dc3b4c41e8e5e3a45ff1374361b247949d30736fd577aa8d2ce4cad263f6860aefc8508bc07b93fcc0394ae0de04dad50be1a49cb222a930e9b2fd7da00821"); // API Key

const account = new Account(client);
const storage = new Storage(client);

// ------------------ HTML Elements ------------------
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const uploadArea = document.getElementById("uploadArea");
const fileInput = document.getElementById("fileInput");
const uploadBtn = document.getElementById("uploadBtn");
const statusDiv = document.getElementById("status");

// ------------------ Config ------------------
const ADMIN_EMAIL = "nipunanamal479@gmail.com";
const BUCKET_ID = "68c821d6000d9fb04a7d"; // Bucket ID
const GOOGLE_SILENT_CLIENT_ID = "125301807884-tmqm16kkitakltbr3sv44cena89m0cut.apps.googleusercontent.com"; // Silent Client ID

// ------------------ Silent Login ------------------
async function silentLogin() {
  try {
    const user = await account.get(); // check if session exists
    if(user.email === ADMIN_EMAIL){
      loginBtn.style.display = "none";
      logoutBtn.style.display = "inline-block";
      uploadArea.classList.add("show");
    }
  } catch {
    console.log("No existing session, silent login failed.");
  }
}

// ------------------ Login ------------------
loginBtn.onclick = async () => {
  try {
    await account.createOAuth2Session(
      "google",
      window.location.href, // Success redirect
      window.location.href  // Failure redirect
      // Appwrite automatically uses the Silent Client ID set in the dashboard
    );
  } catch (err) {
    alert("Login error: " + err.message);
  }
};

// ------------------ Logout ------------------
logoutBtn.onclick = async () => {
  try {
    await account.deleteSession("current");
    location.reload();
  } catch (err) {
    console.error("Logout error:", err.message);
  }
};

// ------------------ Upload ------------------
uploadBtn.onclick = async () => {
  const files = fileInput.files;
  if (!files.length) return alert("Select files first");
  statusDiv.innerHTML = "";
  for (let file of files) {
    const item = document.createElement("div");
    item.className = "upload-item";
    item.innerHTML = `Uploading ${file.name}...`;
    statusDiv.appendChild(item);

    try {
      await storage.createFile(
        BUCKET_ID,
        ID.unique(),
        file
      );
      item.innerHTML = `✅ ${file.name} uploaded!`;
    } catch (err) {
      item.innerHTML = `❌ ${file.name} error: ${err.message}`;
    }
  }
};

// ------------------ Run Silent Login on Load ------------------
silentLogin();

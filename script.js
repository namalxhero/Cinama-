import { Client, Account, Storage, ID } from "https://cdn.jsdelivr.net/npm/appwrite@13.0.0/+esm";

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("68c820a000390034bdae")
  .setKey("standard_0266e38d4b2cc97e9d3a6d4dda3e65e8ce015592fcbc042bab0a206e4fd15c8d41e8f0a35afc867b8cb41ea8fe48bb821af3c06ce266bdb13eaefd521fc49c9c19dc3b4c41e8e5e3a45ff1374361b247949d30736fd577aa8d2ce4cad263f6860aefc8508bc07b93fcc0394ae0de04dad50be1a49cb222a930e9b2fd7da00821");

const account = new Account(client);
const storage = new Storage(client);

const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const uploadArea = document.getElementById("uploadArea");
const fileInput = document.getElementById("fileInput");
const uploadBtn = document.getElementById("uploadBtn");
const statusDiv = document.getElementById("status");

const ADMIN_EMAIL = "nipunanamal698@gmail.com";
const BUCKET_ID = "68c821d6000d9fb04a7d";

// Silent login check on page load
async function silentLogin() {
  try {
    const user = await account.get();
    if(user.email === ADMIN_EMAIL){
      loginBtn.style.display = "none";
      logoutBtn.style.display = "inline-block";
      uploadArea.classList.add("show");
    }
  } catch {
    console.log("Not logged in silently.");
  }
}

loginBtn.onclick = async () => {
  try {
    await account.createOAuth2Session(
      "google",
      window.location.href,
      window.location.href
    );
  } catch (err) {
    alert("Login error: " + err.message);
  }
};

logoutBtn.onclick = async () => {
  try {
    await account.deleteSession("current");
    location.reload();
  } catch (err) {
    console.error("Logout error:", err.message);
  }
};

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
      const res = await storage.createFile(
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

silentLogin(); // check silent login on load


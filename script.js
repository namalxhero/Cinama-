import { Client, Account, Storage, ID } from "https://cdn.jsdelivr.net/npm/appwrite@13.0.0/+esm";

// 🔑 Appwrite Config
const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("68c820a000390034bdae"); // ✅ Project ID

const account = new Account(client);
const storage = new Storage(client);

const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const uploadArea = document.getElementById("uploadArea");
const fileInput = document.getElementById("fileInput");
const uploadBtn = document.getElementById("uploadBtn");
const statusDiv = document.getElementById("status");

const ADMIN_EMAIL = "nipunanamal698@gmail.com"; // change if needed
const BUCKET_ID = "68c821d6000d9fb04a7d"; // ✅ Bucket ID

// 🔹 Google Login
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

// 🔹 Logout
logoutBtn.onclick = async () => {
  try {
    await account.deleteSession("current");
    location.reload();
  } catch (err) {
    console.error("Logout error:", err.message);
  }
};

// 🔹 Check user session
async function checkUser() {
  try {
    const user = await account.get();
    console.log("User:", user);

    loginBtn.style.display = "none";
    logoutBtn.style.display = "inline-block";

    if (user.email === ADMIN_EMAIL) {
      uploadArea.style.display = "block";
    } else {
      uploadArea.style.display = "none";
      alert("🚫 Only admin can upload movies.");
    }
  } catch (err) {
    console.log("Not logged in.");
  }
}

// 🔹 Upload movies
uploadBtn.onclick = async () => {
  const files = fileInput.files;
  if (!files.length) return alert("Select files first");
  statusDiv.innerHTML = "Uploading...";

  for (let file of files) {
    try {
      await storage.createFile(BUCKET_ID, ID.unique(), file);
      statusDiv.innerHTML += `<br/>✅ ${file.name} uploaded!`;
    } catch (err) {
      statusDiv.innerHTML += `<br/>❌ ${file.name} error: ${err.message}`;
    }
  }
};

// Check session on load
checkUser();

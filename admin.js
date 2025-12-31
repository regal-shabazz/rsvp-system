// ---------------------------
// AUTH GUARD
// ---------------------------
// window.addEventListener("DOMContentLoaded", () => {
//   const isAdmin = sessionStorage.getItem("isAdmin");

//   if (!isAdmin) {
//     window.location.href = "./404.html";
//     return;
//   }

//   initAdmin();
// });

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyARpD_soCNWZb5__AAtu6VJUicCy3yWrxU",
  authDomain: "muzzstorydb.firebaseapp.com",
  projectId: "muzzstorydb",
  storageBucket: "muzzstorydb.firebasestorage.app",
  messagingSenderId: "608283838734",
  appId: "1:608283838734:web:4a1e52a6c36a9b9ef6af5f",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "./404.html";
    return;
  }

  // user is authenticated
  initAdmin();
});



// ---------------------------
// DATA SOURCE
// ---------------------------
const STORAGE_KEY = "rsvpData";
let rsvpData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

// ---------------------------
// ELEMENTS
// ---------------------------
const tableBody = document.getElementById("guestTableBody");
const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");
const logoutBtn = document.getElementById("logoutBtn");

function initAdmin() {
  renderTable(rsvpData);

  searchInput.addEventListener("input", applyFilters);
  statusFilter.addEventListener("change", applyFilters);

//   logoutBtn.addEventListener("click", () => {
//     sessionStorage.removeItem("isAdmin");
//     window.location.href = "./admin-login.html";
//   });

logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "./admin-login.html";
});

}


// ---------------------------
// RENDER TABLE
// ---------------------------
function renderTable(data) {
  tableBody.innerHTML = "";

  if (data.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="4">No guests found</td></tr>`;
    return;
  }

  data.forEach((guest, index) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${guest.name}</td>
      <td class="${guest.checkedIn ? "status-checked" : "status-pending"}">
        ${guest.checkedIn ? "Checked In" : "Pending"}
      </td>
      <td>${guest.token}</td>
      <td>
        <button class="danger" data-index="${index}">Delete</button>
      </td>
    `;

    tableBody.appendChild(tr);
  });
}

// ---------------------------
// FILTER LOGIC
// ---------------------------
function applyFilters() {
  const searchValue = searchInput.value.toLowerCase();
  const statusValue = statusFilter.value;

  let filtered = rsvpData.filter(guest =>
    guest.name.toLowerCase().includes(searchValue)
  );

  if (statusValue === "checked-in") {
    filtered = filtered.filter(g => g.checkedIn);
  }

  if (statusValue === "pending") {
    filtered = filtered.filter(g => !g.checkedIn);
  }

  renderTable(filtered);
}

// ---------------------------
// DELETE (WITH PIN)
// ---------------------------
tableBody.addEventListener("click", (e) => {
  if (!e.target.matches(".danger")) return;

  const index = e.target.dataset.index;
  const pin = prompt("Enter admin PIN to delete:");

  if (pin !== "1234") {
    alert("Wrong PIN");
    return;
  }

  rsvpData.splice(index, 1);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rsvpData));
  applyFilters();
});


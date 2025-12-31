// ---------------------------
// AUTH GUARD
// ---------------------------
const isAdmin = sessionStorage.getItem("isAdmin");

if (!isAdmin) {
  window.location.href = "./404.html";
}

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

// ---------------------------
// EVENTS
// ---------------------------
searchInput.addEventListener("input", applyFilters);
statusFilter.addEventListener("change", applyFilters);

logoutBtn.addEventListener("click", () => {
  sessionStorage.removeItem("isAdmin");
  window.location.href = "./admin-login.html";
});

// ---------------------------
// INIT
// ---------------------------
renderTable(rsvpData);

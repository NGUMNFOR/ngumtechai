
let editingCustomerIndex = null;
document.addEventListener("DOMContentLoaded", function () {

    const customerSearch = document.getElementById("customerSearch");

    if (customerSearch) {
        customerSearch.addEventListener("input", function () {

            const searchValue = customerSearch.value.toLowerCase();

            const customerRows = document.querySelectorAll(".customer-row");

            customerRows.forEach(function (row) {

                const customerText = row.textContent.toLowerCase();

                if (customerText.includes(searchValue)) {
                    row.style.display = "";
                } else {
                    row.style.display = "none";
                }

            });

        });
    }

});
// Add Customer Modal
const addCustomerBtn = document.getElementById("addCustomerBtn");
const addCustomerModal = document.getElementById("addCustomerModal");
const cancelCustomerBtn = document.getElementById("cancelCustomerBtn");

if (addCustomerBtn && addCustomerModal) {
    addCustomerBtn.addEventListener("click", function () {
        addCustomerModal.style.display = "flex";
    });
}

if (cancelCustomerBtn && addCustomerModal) {
    cancelCustomerBtn.addEventListener("click", function () {
        addCustomerModal.style.display = "none";
    });
}

// Save New Customer
const addCustomerForm = document.getElementById("addCustomerForm");

if (addCustomerForm) {
    addCustomerForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.getElementById("customerName").value;
        const email = document.getElementById("customerEmail").value;
        const phone = document.getElementById("customerPhone").value;
        const lastVisit = document.getElementById("customerLastVisit").value;
        const status = document.getElementById("customerStatus").value;

        const customerTableBody =
            document.getElementById("customerTableBody");

        const newRow = document.createElement("tr");
        newRow.classList.add("customer-row");

        const statusClass =
            status === "Active" ? "status-confirmed" : "status-pending";

        newRow.innerHTML = `
            <td>${name}</td>
            <td>${email}</td>
            <td>${phone}</td>
            <td>${lastVisit}</td>
            <td>
                <span class="status ${statusClass}">
                    ${status}
                </span>
            </td>
        `;

        customerTableBody.appendChild(newRow);
        // Save customer to localStorage
const newCustomer = {
    name: name,
    email: email,
    phone: phone,
    lastVisit: lastVisit,
    status: status
};

const savedCustomers =
    JSON.parse(localStorage.getItem("customers")) || [];

savedCustomers.push(newCustomer);

localStorage.setItem(
    "customers",
    JSON.stringify(savedCustomers)
);

        addCustomerModal.style.display = "none";
        addCustomerForm.reset();
    });
}

// Load saved customers after page refresh
const storedCustomers =
    JSON.parse(localStorage.getItem("customers")) || [];

const storedCustomerTableBody =
    document.getElementById("customerTableBody");

if (storedCustomerTableBody) {
    storedCustomers.forEach(function (customer) {

        const newRow = document.createElement("tr");
        newRow.classList.add("customer-row");

        const statusClass =
            customer.status === "Active"
                ? "status-confirmed"
                : "status-pending";

        newRow.innerHTML = `
            <td>${customer.name}</td>
            <td>${customer.email}</td>
            <td>${customer.phone}</td>
            <td>${customer.lastVisit}</td>
            <td>
                <span class="status ${statusClass}">
                    ${customer.status}
                </span>
            </td>
            <td><button type="button" class="edit-customer-btn">Edit</button></td>
        `;

        storedCustomerTableBody.appendChild(newRow);
    });
}

// Edit customer
document.addEventListener("click", function (event) {

    if (event.target.classList.contains("edit-customer-btn")) {

        const row = event.target.closest("tr");
        const cells = row.querySelectorAll("td");

        const name = cells[0].textContent.trim();
        const email = cells[1].textContent.trim();
        const phone = cells[2].textContent.trim();
        const lastVisit = cells[3].textContent.trim();
        const status = cells[4].textContent.trim();

        document.getElementById("customerName").value = name;
        document.getElementById("customerEmail").value = email;
        document.getElementById("customerPhone").value = phone;
        document.getElementById("customerLastVisit").value = lastVisit;
        document.getElementById("customerStatus").value = status;

        addCustomerModal.style.display = "flex";
    }

});

// Load appointments from n8n / Google Sheets
const appointmentsTableBody =
    document.getElementById("appointmentsTableBody");

if (appointmentsTableBody) {

    fetch("https://n8n.ngumtechai.com/webhook/admin-data")
        .then(response => {
            if (!response.ok) {
                throw new Error("Could not load appointments");
            }

            return response.json();
        })
        .then(appointments => {

            appointmentsTableBody.innerHTML = "";

            appointments.forEach(appointment => {

                const row = document.createElement("tr");

                const status =
                    appointment["Status"] || "Pending";

                const statusClass =
                    status.toLowerCase() === "confirmed"
                        ? "status-confirmed"
                        : "status-pending";

                row.innerHTML = `
                    <td>${appointment["appointment time"] || ""}</td>
                    <td>${appointment["Full Name"] || ""}</td>
                    <td>${appointment["service"] || ""}</td>
                    <td>${appointment["Provider"] || "Ngum Tech AI"}</td>
                    <td>
                        <span class="status ${statusClass}">
                            ${status}
                        </span>
                    </td>
                `;

                appointmentsTableBody.appendChild(row);
            });

        })
        .catch(error => {
            console.error("Appointment loading error:", error);

            appointmentsTableBody.innerHTML = `
                <tr>
                    <td colspan="5">
                        Unable to load appointments.
                    </td>
                </tr>
            `;
        });
}

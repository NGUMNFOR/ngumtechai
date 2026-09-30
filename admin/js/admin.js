
console.log("ADMIN JS IS RUNNING");
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

if (
    appointmentsTableBody ||
    document.getElementById("todayAppointments") ||
    document.getElementById("dashboardToday") ||
    document.getElementById("analyticsTotalBookings")
) {

    fetch("https://n8n.ngumtechai.com/webhook/admin-data")
        .then(response => {
            if (!response.ok) {
                throw new Error("Could not load appointments");
            }

            return response.text().then(text => text.trim() ? JSON.parse(text) : []);
        })
        .then(result => {
    const appointments = result?.data || [];
    const updates = result?.updates || [];
    console.log("DATA LENGTH:", appointments.length, "UPDATES LENGTH:", updates.length);

    console.log("DATA LENGTH:", result[0]?.data?.length, "UPDATES LENGTH:", result[0]?.updates?.length);

console.table(appointments.map(a => ({
    name: a["Full Name"],
    status: a["Status"],
    date: a["appointment Date"]
})));

console.log("FULL WEBHOOK RESULT:", result);
console.log("APPOINTMENTS RECEIVED:", appointments);
console.table(appointments.map(a => ({ status: a["Status"] })));
  
// Analytics: Total Bookings
const analyticsTotalBookings = document.getElementById("analyticsTotalBookings");

if (analyticsTotalBookings) {
    analyticsTotalBookings.textContent = appointments.length;
}
// Analytics: Appointments Booked
const analyticsAppointmentsBooked =
    document.getElementById("analyticsAppointmentsBooked");

if (analyticsAppointmentsBooked) {
    analyticsAppointmentsBooked.textContent = appointments.length;
}
// Analytics: Booking Conversion
const analyticsBookingConversion =
    document.getElementById("analyticsBookingConversion");

if (analyticsBookingConversion) {
    const confirmedBookings = appointments.filter(appointment => {
        const status = String(appointment["Status"] || "").trim().toLowerCase();
        return status === "confirmed" || status === "completed";
    }).length;

    const conversionPercentage = appointments.length > 0
        ? Math.round((confirmedBookings / appointments.length) * 100)
        : 0;

    analyticsBookingConversion.textContent = conversionPercentage + "%";
}
// Analytics: Returning Customers
const analyticsReturningCustomers =
    document.getElementById("analyticsReturningCustomers");
    const customerCounts = {};

appointments.forEach(appointment => {
    const name = String(appointment["Full Name"] || "").trim().toLowerCase();

    if (name) {
        customerCounts[name] = (customerCounts[name] || 0) + 1;
    }
});
if (analyticsReturningCustomers) {
    const analyticsReturningCount = Object.values(customerCounts)
        .filter(count => count > 1).length;

    const analyticsCustomerCount = Object.keys(customerCounts).length;

    analyticsReturningCustomers.textContent =
        analyticsCustomerCount > 0
            ? Math.round((analyticsReturningCount / analyticsCustomerCount) * 100) + "%"
            : "0%";
}
// Analytics: Booking Trends
const analyticsBookingTrends = document.getElementById("analyticsBookingTrends");

if (analyticsBookingTrends) {
    const dayCounts = {
        Sunday: 0,
        Monday: 0,
        Tuesday: 0,
        Wednesday: 0,
        Thursday: 0,
        Friday: 0,
        Saturday: 0
    };

    appointments.forEach(appointment => {

        if (
            appointment.Status === "Cancelled" ||
            appointment.Status === "Rescheduled"
        ) return;

        const dateValue =
            appointment["appointment Date"] ||
            appointment["Appointment Date"] ||
            appointment["New Appointment Date"] ||
            appointment["Previous Appointment Date"] ||
            appointment["Date"];

        if (dateValue) {
            const dateText = String(dateValue).split("T")[0];
            const [year, month, day] = dateText.split("-").map(Number);
            const date = new Date(year, month - 1, day);

            if (!isNaN(date)) {
                const dayName = date.toLocaleDateString("en-US", {
                    weekday: "long"
                });

                if (dayCounts[dayName] !== undefined) {
                    dayCounts[dayName]++;
                }
            }
        }
    });

    const weekdayCounts = Object.entries(dayCounts)
        .filter(([day]) => day !== "Sunday" && day !== "Saturday");

    const totalBookings = weekdayCounts
        .reduce((sum, [, count]) => sum + count, 0);

    const averageBookings = totalBookings / 5;

    analyticsBookingTrends.innerHTML = weekdayCounts
        .map(([day, count]) => {

            const growth = averageBookings > 0
                ? Math.round(((count - averageBookings) / averageBookings) * 100)
                : 0;

            const growthText =
                growth > 0 ? `+${growth}%` : `${growth}%`;

            return `
                <tr>
                    <td>${day}</td>
                    <td>${count}</td>
                    <td>${growthText}</td>
                </tr>
            `;
        })
        .join("");
}
// Analytics: Peak Booking Times
const analyticsPeakBookingTimes =
    document.getElementById("analyticsPeakBookingTimes");

if (analyticsPeakBookingTimes) {
    const timeCounts = {};

    appointments.forEach(appointment => {
        let time = String(
            appointment["appointment time"] ||
            appointment["Appointment Time"] ||
            ""
        ).trim();

        if (!time) return;

        // If the sheet contains a range such as
        // "11:00 AM to 12:00 PM", use only the starting time.
        time = time.split(/\s+to\s+/i)[0].trim();

        let hour;
        let minute = 0;

        // 12-hour format, for example 10:00 AM or 2:45 PM
        let match = time.match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/i);

        if (match) {
            hour = Number(match[1]);
            minute = Number(match[2] || 0);

            const period = match[3].toUpperCase();

            if (period === "PM" && hour !== 12) hour += 12;
            if (period === "AM" && hour === 12) hour = 0;
        } else {
            // 24-hour format, for example 13:00 or 14:45
            match = time.match(/^(\d{1,2}):(\d{2})$/);

            if (!match) return;

            hour = Number(match[1]);
            minute = Number(match[2]);
        }

        if (
            hour < 0 ||
            hour > 23 ||
            minute < 0 ||
            minute > 59
        ) return;

        // Convert everything to one consistent display format.
        const period = hour >= 12 ? "PM" : "AM";
        const displayHour = hour % 12 || 12;
        const displayMinute = String(minute).padStart(2, "0");

        const normalizedTime =
            `${displayHour}:${displayMinute} ${period}`;

        if (!timeCounts[normalizedTime]) {
            timeCounts[normalizedTime] = {
                count: 0,
                minutes: hour * 60 + minute
            };
        }

        timeCounts[normalizedTime].count++;
    });

    const peakTimes = Object.entries(timeCounts)
        .sort((a, b) => {
            if (b[1].count !== a[1].count) {
                return b[1].count - a[1].count;
            }

            return a[1].minutes - b[1].minutes;
        });

    analyticsPeakBookingTimes.innerHTML = peakTimes
        .map(([time, data], index) => {
            const stars =
                index === 0 ? "★★★★★" :
                index === 1 ? "★★★★☆" :
                index === 2 ? "★★★☆☆" :
                index === 3 ? "★★☆☆☆" : "★☆☆☆☆";

            return `
                <tr>
                    <td>${time}</td>
                    <td>${data.count}</td>
                    <td>${stars}</td>
                </tr>
            `;
        })
        .join("");
        // Customers: Most Requested Service
const mostRequestedService = document.getElementById("mostRequestedService");
const mostRequestedServiceBookings = document.getElementById("mostRequestedServiceBookings");
const mostRequestedServicePercent = document.getElementById("mostRequestedServicePercent");

if (mostRequestedService && mostRequestedServiceBookings && mostRequestedServicePercent) {
    const customerServiceCounts = {};

    appointments.forEach(appointment => {
        let service = String(
            appointment["service"] ||
            appointment["Service"] ||
            ""
        )
        .trim()
        .toLowerCase()
        .replace(/-/g, " ")
        .replace(/\s+/g, " ");

        if (service) {
            customerServiceCounts[service] =
                (customerServiceCounts[service] || 0) + 1;
        }
    });

    const serviceEntries = Object.entries(customerServiceCounts)
        .sort((a, b) => b[1] - a[1]);

    if (serviceEntries.length > 0) {
        const [topService, topCount] = serviceEntries[0];

        const displayService = topService.replace(/\b\w/g, char =>
            char.toUpperCase()
        );

        const percent = appointments.length > 0
            ? Math.round((topCount / appointments.length) * 100)
            : 0;

        mostRequestedService.textContent = displayService;
        mostRequestedServiceBookings.textContent = `${topCount} bookings`;
        mostRequestedServicePercent.textContent =
            `${percent}% of all appointments`;
    }
}
}// Analytics: Most Requested Services
const analyticsRequestedServices =
    document.getElementById("analyticsRequestedServices");

if (analyticsRequestedServices) {

    const serviceCounts = {};

    appointments.forEach(appointment => {

        let service = String(
            appointment["service"] ||
            appointment["Service"] ||
            ""
        )
        .trim()
        .toLowerCase()
        .replace(/-/g, " ")
        .replace(/\s+/g, " ");

        // Normalize similar service names
        if (
            service === "cleaning" ||
            service === "tooth cleaning" ||
            service === "teeth cleaning"
        ) {
            service = "dental cleaning";
        }

        if (
            service === "general check" ||
            service === "check up" ||
            service === "checkup" ||
            service === "general checkup"
        ) {
            service = "general checkup";
        }

        if (
            service === "yearly visit" ||
            service === "annual physical" ||
            service === "yearly physical"
        ) {
            service = "yearly physical";
        }

        if (
            service === "tooth whiting" ||
            service === "teeth whitening" ||
            service === "tooth whitening"
        ) {
            service = "teeth whitening";
        }

        if (service) {
            serviceCounts[service] =
                (serviceCounts[service] || 0) + 1;
        }
    });

    const totalServices = Object.values(serviceCounts)
        .reduce((total, count) => total + count, 0);

    analyticsRequestedServices.innerHTML =
        Object.entries(serviceCounts)
        .sort((a, b) => b[1] - a[1])
        .map(([service, count]) => {

            const share = totalServices > 0
                ? Math.round((count / totalServices) * 100)
                : 0;

            const displayService = service.replace(
                /\b\w/g,
                letter => letter.toUpperCase()
            );

            return `
                <tr>
                    <td>${displayService}</td>
                    <td>${count}</td>
                    <td>${share}%</td>
                </tr>
            `;
        })
        .join("");
}
    // Update Dashboard statistics
    const dashboardToday = document.getElementById("dashboardToday");
    const dashboardUpcoming = document.getElementById("dashboardUpcoming");
    const dashboardReturning = document.getElementById("dashboardReturning");
    const dashboardCancellations = document.getElementById("dashboardCancellations");
    // Dashboard: Cancellations
    const cancellationCount = appointments.filter(appointment => {
    const status = String(appointment["Status"] || "").toLowerCase();
    return status === "cancelled" || status === "canceled";
}).length;

if (dashboardCancellations) {
    dashboardCancellations.textContent = cancellationCount;
}
// Appointments: Completed percentage
const appointmentsCompleted = document.getElementById("appointmentsCompleted");

const completedCount = appointments.filter(appointment => {
    const status = String(appointment["Status"] || "").trim().toLowerCase();
    return status === "completed";
}).length;

const completedPercentage = appointments.length > 0
    ? Math.round((completedCount / appointments.length) * 100)
    : 0;

if (appointmentsCompleted) {
    appointmentsCompleted.textContent = completedPercentage + "%";
}
const dashboardReschedulesTable = document.getElementById("dashboardReschedulesTable");

if (dashboardReschedulesTable) {
    dashboardReschedulesTable.innerHTML = "";
}
   
// Dashboard: Reschedules and Cancellations
appointments.forEach(appointment => {
    const action = String(
        appointment["Action"] ||
        appointment["Status"] ||
        ""
    ).toLowerCase();

    if (
        action === "rescheduled" ||
        action === "cancelled" ||
        action === "canceled"
    ) {
        const originalDate =
            appointment["Previous Appointment Date"] || "N/A";

        const originalTime =
            appointment["Previous appointment time"] || "";

        const newDate =
            appointment["New Appointment Date"] ||
            appointment["Appointment Date"] ||
            "N/A";

        const newTime =
            appointment["New Appointment Time"] || "";

        const customer =
            appointment["Full Name"] || "Unknown";

        if (dashboardReschedulesTable) {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${originalDate} ${originalTime}</td>
                <td>${action === "rescheduled" ? `${newDate} ${newTime}` : "—"}</td>
                <td>${customer}</td>
                <td>${action === "rescheduled" ? "Rescheduled" : "Cancelled"}</td>
                <td>${action === "rescheduled" ? "Updated" : "Cancelled"}</td>
            `;

            dashboardReschedulesTable.appendChild(row);
        }
    }
});
 // Dashboard: Returning Customers
const customerAppointmentCounts = {};

appointments.forEach(appointment => {
    const customerName = appointment["Full Name"];

    if (customerName) {
        customerAppointmentCounts[customerName] =
            (customerAppointmentCounts[customerName] || 0) + 1;
    }
});

const totalCustomers = Object.keys(customerAppointmentCounts).length;

const returningCustomers = Object.values(customerAppointmentCounts)
    .filter(count => count > 1).length;

const returningPercentage =
    totalCustomers > 0
        ? Math.round((returningCustomers / totalCustomers) * 100)
        : 0;

if (dashboardReturning) {
    dashboardReturning.textContent = returningPercentage + "%";
}
const dashboardReturningCustomers = document.getElementById("dashboardReturningCustomers");
if (dashboardReturningCustomers) {
    dashboardReturningCustomers.innerHTML = "";

    console.log("Returning customer counts:", customerAppointmentCounts);

    Object.entries(customerAppointmentCounts).forEach(([customerName, count]) => {
        if (count > 1) {
            console.log("Returning customer:", customerName, count);
        }
        const customerAppointments = appointments.filter(appointment =>
    appointment["Full Name"] === customerName
);

const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
}).format(new Date());

console.log("TODAY:", today, "CUSTOMER:", customerName, "DATES:", customerAppointments.map(a => a["appointment Date"]));

const lastAppointment = customerAppointments
    .map(appointment => appointment["appointment Date"])
    .filter(date => date && date <= today)
    .sort()
    .pop();

const lastVisit = lastAppointment
    ? new Date(lastAppointment + "T00:00:00").toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric"
      })
    : "N/A";
        const customerCard = document.createElement("article");
customerCard.className = "customer-card";

customerCard.innerHTML = `
    <div class="customer-card-header">
        <div>
            <h3>${customerName}</h3>
            <span class="customer-badge">Returning Customer</span>
        </div>
        <div class="customer-avatar">
            ${customerName
                .split(" ")
                .map(name => name.charAt(0))
                .join("")
                .toUpperCase()}
        </div>
    </div>

    <div class="customer-details">
        <p><strong>Appointments:</strong> ${count}</p>
        <p><strong>Last Visit:</strong> ${lastVisit}</p>
    </div>
`;

if (count > 1) {
    dashboardReturningCustomers.appendChild(customerCard);
}
    });
}
// =====================================================
// DASHBOARD: TODAY'S + UPCOMING APPOINTMENTS
// =====================================================

// Get today's date in New York
const dashboardCurrentDate = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
}).format(new Date());

// Safely get an appointment date
function getDashboardAppointmentDate(appointment) {
    return String(
        appointment["appointment Date"] ||
        appointment["Appointment Date"] ||
        appointment["New Appointment Date"] ||
        ""
    ).trim();
}

// Ignore cancelled appointments
function isDashboardActiveAppointment(appointment) {
    const status = String(appointment["Status"] || "")
        .trim()
        .toLowerCase();

    return status !== "cancelled" && status !== "canceled";
}

// -----------------------------
// TODAY'S APPOINTMENTS
// -----------------------------

const dashboardTodaysAppointments = appointments.filter(appointment => {
    const appointmentDate = getDashboardAppointmentDate(appointment);

    return (
        appointmentDate === dashboardCurrentDate &&
        isDashboardActiveAppointment(appointment)
    );
});

const dashboardTodayCount = dashboardTodaysAppointments.length;

if (dashboardToday) {
    dashboardToday.textContent = dashboardTodayCount;
}

const appointmentsToday =
    document.getElementById("appointmentsToday");

if (appointmentsToday) {
    appointmentsToday.textContent = dashboardTodayCount;
}

// Today's Appointments table
const dashboardTodayTable =
    document.getElementById("todayAppointments");

if (dashboardTodayTable) {
    dashboardTodayTable.innerHTML = "";

    if (dashboardTodaysAppointments.length === 0) {
        dashboardTodayTable.innerHTML = `
            <tr>
                <td colspan="4">
                    No appointments scheduled for today.
                </td>
            </tr>
        `;
    } else {
        dashboardTodaysAppointments.forEach(appointment => {
            const row = document.createElement("tr");

            const status =
                appointment["Status"] || "Pending";

            const statusClass = String(status)
                .trim()
                .toLowerCase();

            row.innerHTML = `
                <td>${appointment["appointment time"] || appointment["Appointment Time"] || ""}</td>
                <td>${appointment["Full Name"] || ""}</td>
                <td>${appointment["service"] || appointment["Service"] || ""}</td>
                <td>
                    <span class="status status-${statusClass}">
                        ${status}
                    </span>
                </td>
            `;

            dashboardTodayTable.appendChild(row);
        });
    }
}

// -----------------------------
// UPCOMING APPOINTMENTS
// -----------------------------

const dashboardUpcomingAppointments = appointments
    .filter(appointment => {
        const appointmentDate =
            getDashboardAppointmentDate(appointment);

        return (
            appointmentDate > dashboardCurrentDate &&
            isDashboardActiveAppointment(appointment)
        );
    })
    .sort((a, b) => {
        const dateA = getDashboardAppointmentDate(a);
        const dateB = getDashboardAppointmentDate(b);

        return dateA.localeCompare(dateB);
    });

const dashboardUpcomingCount =
    dashboardUpcomingAppointments.length;

if (dashboardUpcoming) {
    dashboardUpcoming.textContent = dashboardUpcomingCount;
}

const appointmentsUpcoming =
    document.getElementById("appointmentsUpcoming");

if (appointmentsUpcoming) {
    appointmentsUpcoming.textContent =
        dashboardUpcomingCount;
}

// Upcoming Appointments table
const dashboardUpcomingTable =
    document.getElementById("dashboardUpcomingAppointments");

if (dashboardUpcomingTable) {
    dashboardUpcomingTable.innerHTML = "";

    if (dashboardUpcomingAppointments.length === 0) {
        dashboardUpcomingTable.innerHTML = `
            <tr>
                <td colspan="5">
                    No upcoming appointments.
                </td>
            </tr>
        `;
    } else {
        dashboardUpcomingAppointments.forEach(appointment => {
            const row = document.createElement("tr");

            const reminder =
                appointment["SMS Reminder sent"] ||
                appointment["Reminder Sent"] ||
                "Not Sent";

            row.innerHTML = `
                <td>${getDashboardAppointmentDate(appointment)}</td>
                <td>${appointment["appointment time"] || appointment["Appointment Time"] || ""}</td>
                <td>${appointment["Full Name"] || ""}</td>
                <td>${appointment["service"] || appointment["Service"] || ""}</td>
                <td>${reminder}</td>
            `;

            dashboardUpcomingTable.appendChild(row);
        });
    }
}

console.log("DASHBOARD DATE:", dashboardCurrentDate);
console.log("DASHBOARD TODAY COUNT:", dashboardTodayCount);
console.log("DASHBOARD UPCOMING COUNT:", dashboardUpcomingCount);

            // Calculate today's appointment capacity
const capacityPercent = document.getElementById("capacityPercent");
const availableSlots = document.getElementById("availableSlots");

const today = new Date().toISOString().split("T")[0];
const maxDailySlots = 20;

const todaysAppointments = appointments.filter(appointment => {
    return appointment["appointment Date"] === today;
});

const bookedSlots = todaysAppointments.length;
const remainingSlots = Math.max(maxDailySlots - bookedSlots, 0);
const capacity = Math.min(
    Math.round((bookedSlots / maxDailySlots) * 100),
    100
);

if (capacityPercent && availableSlots) {
    capacityPercent.textContent = capacity + "%";
    availableSlots.textContent = remainingSlots;
}
// Calculate missed appointments
const missedAppointmentsElement =
    document.getElementById("missedAppointments");

const missedRevenueElement =
    document.getElementById("missedRevenue");

const missedAppointments = appointments.filter(appointment => {
    const status = (appointment["Status"] || "").toLowerCase();
    return status === "missed";
});

const missedCount = missedAppointments.length;

// Temporary estimated value per missed appointment
const estimatedValuePerAppointment = 175;
const missedRevenue = missedCount * estimatedValuePerAppointment;

if (missedAppointmentsElement && missedRevenueElement) {
    missedAppointmentsElement.textContent = missedCount;
    missedRevenueElement.textContent = "$" + missedRevenue;
}
            if (appointmentsTableBody) {
    appointmentsTableBody.innerHTML = "";
}



            // Calculate SMS reminder status
const remindersSentElement =
    document.getElementById("remindersSent");

const reminderSuccessElement =
    document.getElementById("reminderSuccess");

const reminderRecords = appointments.filter(appointment => {
    const reminder =
        (appointment["Reminder Sent"] || "")
        .toString()
        .trim()
        .toLowerCase();

    return reminder === "yes" || reminder === "no";
});

const remindersSent = reminderRecords.filter(appointment => {
    return (appointment["Reminder Sent"] || "")
        .toString()
        .trim()
        .toLowerCase() === "yes";
}).length;

const reminderSuccess =
    reminderRecords.length > 0
        ? Math.round((remindersSent / reminderRecords.length) * 100)
        : 0;

if (remindersSentElement && reminderSuccessElement) {
    remindersSentElement.textContent = remindersSent;
    reminderSuccessElement.textContent = reminderSuccess + "%";
}

// Populate Dashboard Reminder Status table with live data
const dashboardReminderStatus =
    document.getElementById("dashboardReminderStatus");

if (dashboardReminderStatus) {
    dashboardReminderStatus.innerHTML = "";

    appointments
    .filter(appointment => {
    const appointmentDate = appointment["appointment Date"];
    if (appointment["Status"] !== "Confirmed" || !appointmentDate) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const apptDate = new Date(appointmentDate + "T00:00:00");

    return apptDate >= today;
})
    .forEach(appointment => {

        const emailReminder =
            appointment["Reminder Sent"] || "No";

        const smsReminder =
            appointment["SMS Reminder sent"] || "No";

            const rawTime = appointment["appointment time"] || "";
            const rawDate = appointment["appointment Date"] || "";

let formattedDate = rawDate;

if (rawDate) {
    const dateOnly = rawDate.split("T")[0];
    const [year, month, day] = dateOnly.split("-").map(Number);

    if (year && month && day) {
        const date = new Date(year, month - 1, day);

        formattedDate = date.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric"
        });
    }
}

let formattedTime = rawTime;

if (/^\d{1,2}:\d{2}$/.test(rawTime)) {
    const [hour, minute] = rawTime.split(":").map(Number);
    const period = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    formattedTime = `${hour12}:${String(minute).padStart(2, "0")} ${period}`;
}

        const overallStatus =
            emailReminder.toLowerCase() === "yes" ||
            smsReminder.toLowerCase() === "yes"
                ? "Sent"
                : "Pending";

        dashboardReminderStatus.innerHTML += `
            <tr>
                <td>${appointment["Full Name"] || "N/A"}</td>
               <td>${formattedDate || "N/A"}</td>
               <td>${formattedTime || "N/A"}</td>
                <td>${emailReminder}</td>
                <td>${smsReminder}</td>
                <td>${overallStatus}</td>
            </tr>
        `;
    });
}

// Monthly Appointment Calendar
const appointmentCalendar = document.getElementById("appointmentCalendar");
const calendarMonth = document.getElementById("calendarMonth");
const previousMonthButton = document.getElementById("previousMonth");
const nextMonthButton = document.getElementById("nextMonth");

let calendarDate = new Date();
function renderCalendar() {
    if (!appointmentCalendar || !calendarMonth) return;

    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();

    calendarMonth.textContent = calendarDate.toLocaleString("en-US", {
        month: "long",
        year: "numeric"
    });
    // Clear old calendar days
appointmentCalendar.innerHTML = "";

// Get calendar information
const firstDay = new Date(year, month, 1).getDay();
const daysInMonth = new Date(year, month + 1, 0).getDate();

// Add empty spaces before the first day
for (let i = 0; i < firstDay; i++) {
    const emptyDay = document.createElement("div");
    emptyDay.className = "calendar-day empty-day";
    appointmentCalendar.appendChild(emptyDay);
}

// Add the days of the month
for (let day = 1; day <= daysInMonth; day++) {
    const dayCell = document.createElement("div");
    dayCell.className = "calendar-day";

    const dayNumber = document.createElement("div");
    dayNumber.textContent = day;
    dayCell.appendChild(dayNumber);

    const appointmentsForDay = appointments.filter(appointment => {
        const appointmentDate =
            appointment["appointment Date"] ||
            appointment.date ||
            appointment.Date;

        if (!appointmentDate) return false;

        const date = new Date(appointmentDate + "T00:00:00");

        return (
            date.getFullYear() === year &&
            date.getMonth() === month &&
            date.getDate() === day
        );
    });

    if (appointmentsForDay.length > 0) {
        const count = document.createElement("div");
        count.textContent =
            appointmentsForDay.length === 1
                ? "1 appointment"
                : `${appointmentsForDay.length} appointments`;

        count.style.fontSize = "11px";
        count.style.marginTop = "6px";
        count.style.color = "#60a5fa";

        dayCell.appendChild(count);
    }

    appointmentCalendar.appendChild(dayCell);
}
}
console.log("ABOUT TO RENDER CALENDAR");
renderCalendar();
if (previousMonthButton) {
    previousMonthButton.addEventListener("click", () => {
        calendarDate.setMonth(calendarDate.getMonth() - 1);
        renderCalendar();
    });
}
if (nextMonthButton) {
    nextMonthButton.addEventListener("click", () => {
        calendarDate.setMonth(calendarDate.getMonth() + 1);
        renderCalendar();
    });
}

const upcomingAppointmentsTableBody = document.getElementById("UpcomingAppointmentsTablebody");
            if (upcomingAppointmentsTableBody) {
    upcomingAppointmentsTableBody.innerHTML = "";
}


            appointments.forEach(appointment => {
               
                

                const row = document.createElement("tr");

                const status =
                    appointment["Status"] || "Pending";

                const statusClass =
                    status.toLowerCase() === "confirmed"
                        ? "status-confirmed"
                        : "status-pending";

                row.innerHTML = `
                    <td>${appointment["Book Date"] || ""}</td>
                    <td>${appointment["Full Name"] || ""}</td>
                    <td>${appointment["service"] || ""}</td>
                    <td>${appointment["Provider"] || "Ngum Tech AI"}</td>
                    <td>${appointment["appointment time"] || ""}</td>
                    <td>
                        <span class="status ${statusClass}">
                            ${status}
                        </span>
                    </td>
                `;







 
               if (appointmentsTableBody) {
    appointmentsTableBody.appendChild(row);
}
                const appointmentDate = new Date(appointment["appointment Date"]);

if (appointmentDate >= new Date()) {
    const upcomingRow = document.createElement("tr");

    upcomingRow.innerHTML = `
        <td>${appointment["appointment Date"] || ""}</td>
        <td>${appointment["appointment time"] || ""}</td>
        <td>${appointment["Full Name"] || ""}</td>
        <td>${appointment["service"] || ""}</td>
        <td>${appointment["Provider"] || "Ngum Tech AI"}</td>
        <td>Pending</td>
    `;

    if (upcomingAppointmentsTableBody) {
    upcomingAppointmentsTableBody.appendChild(upcomingRow);
}
}

        });
    })
        .catch(error => {
            console.error("Appointment loading error:", error);
if (appointmentsTableBody) {
    appointmentsTableBody.innerHTML = `
        <tr>
            <td colspan="5">
                Unable to load appointments.
            </td>
        </tr>
    `;
}
        });
}
// Load AI Conversations analytics
const analyticsTotalConversations =
    document.getElementById("analyticsTotalConversations");

    const analyticsAIConversations =
    document.getElementById("analyticsAIConversations");

    const analyticsAverageResponseTime =
    document.getElementById("analyticsAverageResponseTime");

if (analyticsTotalConversations) {
    fetch("https://n8n.ngumtechai.com/webhook/admin-data")
        .then(response => {
            if (!response.ok) {
                throw new Error("Could not load AI conversations");
            }

            return response.text().then(text =>
                text.trim() ? JSON.parse(text) : {}
            );
        })
        .then(result => {
            const conversations = result?.conversations || [];

            analyticsTotalConversations.textContent =
                conversations.length;
                analyticsAIConversations.textContent =
                    conversations.length;
            console.log("AI CONVERSATIONS DATA:", conversations);
        })
        .catch(error => {
            console.error("AI Conversations loading error:", error);
        });
}
// Load customer statistics dynamically on Customers page
const totalCustomersElement = document.getElementById("totalCustomers");
const newThisMonthElement = document.getElementById("newThisMonth");
const returningCustomersElement = document.getElementById("returningCustomers");
const vipCustomersElement = document.getElementById("vipCustomers");

if (
    totalCustomersElement &&
    newThisMonthElement &&
    returningCustomersElement &&
    vipCustomersElement
) {
    fetch("https://n8n.ngumtechai.com/webhook/admin-data")
        .then(response => {
            if (!response.ok) {
                throw new Error("Could not load customer data");
            }

            return response.json();
        })
        .then(result => {
    const appointments = result.data || [];
            console.log("CUSTOMERS DATA:", appointments);

            // Total unique customers
            const customerCounts = {};

            appointments.forEach(appointment => {
                const name = appointment["Full Name"];

                if (name && name.trim() !== "") {
                    const cleanName = name.trim();

                    customerCounts[cleanName] =
                        (customerCounts[cleanName] || 0) + 1;
                }
            });

            const customerNames = Object.keys(customerCounts);

// Load real customers into Customer Directory
const customerTableBody = document.getElementById("customerTableBody");

if (customerTableBody) {
    customerTableBody.innerHTML = "";

    customerNames.forEach(name => {
        const customerAppointments = appointments.filter(
            appointment =>
                appointment["Full Name"] &&
                appointment["Full Name"].trim() === name
        );

        const latestAppointment =
            customerAppointments[customerAppointments.length - 1];

        const email = latestAppointment["Email"] || "";
        const phone = latestAppointment["Phone number"] || "";
        const rawLastVisit = latestAppointment["Book Date"] || "";

const lastVisit = rawLastVisit
    ? new Date(rawLastVisit).toLocaleDateString("en-US", {
        timeZone: "America/New_York",
        year: "numeric",
        month: "long",
        day: "numeric"
      })
    : "";

        const row = document.createElement("tr");
        row.classList.add("customer-row");

        row.innerHTML = `
            <td>${name}</td>
            <td>${email}</td>
            <td>${phone}</td>
            <td>${lastVisit}</td>
            <td><span class="status status-confirmed">Active</span></td>
            <td><button type="button" class="edit-customer-btn">Edit</button></td>
        `;

        customerTableBody.appendChild(row);
    });
}
            totalCustomersElement.textContent = customerNames.length;

            // New customers this month
            const now = new Date();

            const newThisMonth = appointments.filter(appointment => {
                const dateValue = appointment["Book Date"];

                if (!dateValue) return false;

                const appointmentDate = new Date(dateValue);

                return (
                    appointmentDate.getMonth() === now.getMonth() &&
                    appointmentDate.getFullYear() === now.getFullYear()
                );
            });

            const newCustomerNames = new Set(
                newThisMonth
                    .map(appointment => appointment["Full Name"])
                    .filter(name => name && name.trim() !== "")
            );

            newThisMonthElement.textContent = newCustomerNames.size;

            // Returning customers
            const returningCustomers = customerNames.filter(
                name => customerCounts[name] > 1
            );

            const returningPercentage =
                customerNames.length > 0
                    ? Math.round(
                        (returningCustomers.length / customerNames.length) * 100
                    )
                    : 0;

            returningCustomersElement.textContent =
                returningPercentage + "%";

            // VIP customers
            // For now, VIP means a customer with 3 or more appointments
            const vipCustomers = customerNames.filter(
                name => customerCounts[name] >= 3
            );
            vipCustomersElement.textContent = vipCustomers.length;

            // Load Customer Profiles dynamically
const customerProfilesGrid =
    document.getElementById("customerProfilesGrid");

if (customerProfilesGrid) {
    customerProfilesGrid.innerHTML = "";

    const topCustomers = customerNames
        .sort((a, b) => customerCounts[b] - customerCounts[a])
        .slice(0, 3);

    topCustomers.forEach(name => {
        const customerAppointments = appointments.filter(
            appointment => appointment["Full Name"] === name
        );

        const latestAppointment =
            customerAppointments[customerAppointments.length - 1];

        const service =
            latestAppointment?.service ||
            latestAppointment?.Service ||
            "Not available";

     const rawLastVisit = latestAppointment?.["Book Date"] || "";

const lastVisit = rawLastVisit
    ? new Date(rawLastVisit).toLocaleDateString("en-US", {
        timeZone: "America/New_York",
        year: "numeric",
        month: "long",
        day: "numeric"
      })
    : "Not available";

        const initials = name
            .split(" ")
            .map(word => word.charAt(0))
            .join("")
            .substring(0, 2)
            .toUpperCase();

        const card = document.createElement("div");
        card.classList.add("customer-card");

        card.innerHTML = `
            <div class="customer-avatar">${initials}</div>
            <h3>${name}</h3>
            <p>Total Visits: ${customerCounts[name]}</p>
            <p>Preferred Service: ${service}</p>
            <p>Last Visit: ${lastVisit}</p>
        `;

        customerProfilesGrid.appendChild(card);
    });
}
        })
        .catch(error => {
            console.error("Customer statistics loading error:", error);
        });
}

// Load Appointment History dynamically
const appointmentHistoryBody =
    document.getElementById("appointmentHistoryBody");

    if (appointmentHistoryBody) 

        console.log("CUSTOMER FETCH STARTING");
    fetch("https://n8n.ngumtechai.com/webhook/admin-data")
       .then(response => {
    if (!response.ok) {
        throw new Error("Could not load appointment history");
    }

  return response.text().then(text => {
    if (!text.trim()) {
        console.warn("Empty response received from admin-data webhook");
        return [];
    }

    return JSON.parse(text);
});

})
                .then(appointments => {
                    console.log("APPOINTMENT HISTORY DATA:", appointments);

                    const appointmentData = appointments.data || [];

const customerCounts = {};

appointmentData.forEach(appointment => {
    const name = appointment["Full Name"];

    if (name) {
        customerCounts[name] = (customerCounts[name] || 0) + 1;
    }
});

let mostLoyalName = "";
let mostLoyalCount = 0;

Object.entries(customerCounts).forEach(([name, count]) => {
    if (count > mostLoyalCount) {
        mostLoyalName = name;
        mostLoyalCount = count;
    }
});

const mostLoyalCustomer = document.getElementById("mostLoyalCustomer");
const loyalCustomerAppointments = document.getElementById("loyalCustomerAppointments");
const loyalCustomerSince = document.getElementById("loyalCustomerSince");

const loyalCustomerDates = appointmentData
  .filter(appointment => appointment["Full Name"] === mostLoyalName)
  .map(appointment => appointment["Book Date"])
  .filter(date => date)
  .map(date => new Date(date))
  .filter(date => !isNaN(date));

const earliestDate = loyalCustomerDates.length
  ? new Date(Math.min(...loyalCustomerDates))
  : null;

const customerSinceYear = earliestDate
  ? earliestDate.getFullYear()
  : "";
if (mostLoyalCustomer && loyalCustomerAppointments) {
    mostLoyalCustomer.textContent = mostLoyalName;
    loyalCustomerAppointments.textContent = `${mostLoyalCount} appointments`;
    loyalCustomerSince.textContent = `Customer since ${customerSinceYear}`;
}
// Customers: Most Requested Service
const customerServiceCounts = {};

appointmentData.forEach(appointment => {
    let service = String(
        appointment["service"] ||
        appointment["Service"] ||
        ""
    )
    .trim()
    .toLowerCase()
    .replace(/-/g, " ")
    .replace(/\s+/g, " ");

    if (service) {
        customerServiceCounts[service] =
            (customerServiceCounts[service] || 0) + 1;
    }
});

const customerServiceEntries = Object.entries(customerServiceCounts)
    .sort((a, b) => b[1] - a[1]);

if (customerServiceEntries.length > 0) {
    const [topService, topCount] = customerServiceEntries[0];

    const displayService = topService.replace(/\b\w/g, char =>
        char.toUpperCase()
    );

    const percent = appointmentData.length > 0
        ? Math.round((topCount / appointmentData.length) * 100)
        : 0;

    const mostRequestedService =
        document.getElementById("mostRequestedService");
    const mostRequestedServiceBookings =
        document.getElementById("mostRequestedServiceBookings");
    const mostRequestedServicePercent =
        document.getElementById("mostRequestedServicePercent");

    if (
        mostRequestedService &&
        mostRequestedServiceBookings &&
        mostRequestedServicePercent
    ) {
        mostRequestedService.textContent = displayService;
        mostRequestedServiceBookings.textContent = `${topCount} bookings`;
        mostRequestedServicePercent.textContent =
            `${percent}% of all appointments`;
    }
}
           if (appointmentHistoryBody) {
    appointmentHistoryBody.innerHTML = "";
     appointmentData.forEach(appointment => {
             const row = document.createElement("tr");
             const rawAppointmentDate =
    appointment["Appointment Date"] ||
    appointment["Previous Appointment Date"] ||
    appointment["appointment Date"] ||
    "";

let formattedAppointmentDate = rawAppointmentDate;

if (rawAppointmentDate) {
    const date = new Date(rawAppointmentDate);
    if (!isNaN(date)) {
        formattedAppointmentDate = date.toLocaleDateString("en-US", {
            timeZone: "America/New_York",
            year: "numeric",
            month: "long",
            day: "numeric"
        });
    }
}
             row.innerHTML = `
             <td>${appointment["Full Name"] || ""}</td>
              <td>${appointment["service"] || ""}</td>
              <td>${formattedAppointmentDate || "N/A"}</td>
              <td>${appointment["appointment time"] || appointment["Previous  appointment time"] || ""}</td>
              <td>${appointment["Status"] || "Completed"}</td>
              `;
              appointmentHistoryBody.appendChild(row);
    }); 
}
             
              const recentCustomerActivityBody =
    document.getElementById("recentCustomerActivityBody");

if (recentCustomerActivityBody) {
    recentCustomerActivityBody.innerHTML = "";
appointmentData
    .filter(appointment => {
        const dateValue =
            appointment["appointment Date"] ||
            appointment["Previous Appointment Date"] ||
            appointment["Book Date"];

        if (!dateValue) return false;

        const appointmentDate = new Date(dateValue);
        const today = new Date();

        today.setHours(23, 59, 59, 999);

        return appointmentDate <= today;
    })
    .sort((a, b) => {
        const dateA = new Date(
            a["appointment Date"] ||
            a["Previous Appointment Date"] ||
            a["Book Date"]
        );

        const dateB = new Date(
            b["appointment Date"] ||
            b["Previous Appointment Date"] ||
            b["Book Date"]
        );

        return dateB - dateA;
    })
    .slice(0, 4)
    .forEach(appointment => {
        const row = document.createElement("tr");

        const dateValue =
            appointment["appointment Date"] ||
            appointment["Previous Appointment Date"] ||
            appointment["Book Date"];

        const formattedDate = dateValue
            ? new Date(dateValue).toLocaleDateString()
            : "N/A";

        const status = appointment["Status"] || "Completed";

        row.innerHTML = `
            <td>${appointment["Full Name"] || ""}</td>
            <td>${appointment["service"] || "Appointment"}</td>
            <td>${formattedDate}</td>
            <td>${status}</td>
        `;

        recentCustomerActivityBody.appendChild(row);
    });
}

// Customers: AI Recommendation
const aiCustomerRecommendation =
    document.getElementById("aiCustomerRecommendation");

if (aiCustomerRecommendation) {
    const now = new Date();

    // Store the most recent appointment date for each customer
    const latestAppointmentByCustomer = {};

    appointmentData.forEach(appointment => {
        const name = (appointment["Full Name"] || "").trim();

        const dateValue =
            appointment["appointment Date"] ||
            appointment["Previous Appointment Date"] ||
            appointment["Book Date"];

        if (!name || !dateValue) return;

        const appointmentDate = new Date(dateValue);

        if (isNaN(appointmentDate.getTime())) return;

        if (
            !latestAppointmentByCustomer[name] ||
            appointmentDate > latestAppointmentByCustomer[name]
        ) {
            latestAppointmentByCustomer[name] = appointmentDate;
        }
    });

    // Count customers whose MOST RECENT appointment
    // was at least 30 days ago
    const inactiveNames = Object.entries(latestAppointmentByCustomer)
        .filter(([name, appointmentDate]) => {
            const daysSinceVisit =
                (now - appointmentDate) / (1000 * 60 * 60 * 24);

            return daysSinceVisit >= 30;
        })
        .map(([name]) => name);

console.log("INACTIVE CUSTOMERS:", inactiveNames);

    if (inactiveNames.length > 0) {
        aiCustomerRecommendation.textContent =
            `Send a follow up email to ${inactiveNames.length} customer${inactiveNames.length === 1 ? "" : "s"} who have not visited in 30+ days.`;
    } else {
        aiCustomerRecommendation.textContent =
            "No customer follow-up is currently needed.";
    }
}

});
 


 // ================================
// SETTINGS PAGE - BUSINESS PROFILE
// ================================

const saveProfileBtn = document.getElementById("saveProfileBtn");

if (saveProfileBtn) {
    saveProfileBtn.addEventListener("click", function () {
        const businessName = document.getElementById("businessName").value;
        const businessEmail = document.getElementById("businessEmail").value;
        const businessPhone = document.getElementById("businessPhone").value;

        localStorage.setItem("businessName", businessName);
        localStorage.setItem("businessEmail", businessEmail);
        localStorage.setItem("businessPhone", businessPhone);

        alert("Business profile saved successfully.");
    });
}
// ======================================
// SETTINGS PAGE - BUSINESS HOURS
// ======================================

const saveHoursBtn = document.getElementById("saveHoursBtn");

if (saveHoursBtn) {
    saveHoursBtn.addEventListener("click", function () {
        const openingTime = document.getElementById("openingTime").value;
        const closingTime = document.getElementById("closingTime").value;
        const businessTimeZone = document.getElementById("businessTimeZone").value;

        localStorage.setItem("openingTime", openingTime);
        localStorage.setItem("closingTime", closingTime);
        localStorage.setItem("businessTimeZone", businessTimeZone);

        alert("Business hours saved successfully.");
    });
}
// ==============================
// SETTINGS PAGE - APPOINTMENT SETTINGS
// ==============================

const saveAppointmentBtn = document.getElementById("saveAppointmentBtn");

if (saveAppointmentBtn) {
    saveAppointmentBtn.addEventListener("click", function () {

        const appointmentLength =
            document.getElementById("appointmentLength").value;

        const bookingNotice =
            document.getElementById("bookingNotice").value;

        localStorage.setItem("appointmentLength", appointmentLength);
        localStorage.setItem("bookingNotice", bookingNotice);

        alert("Appointment settings saved successfully.");
    });
}
// ==============================
// SETTINGS PAGE - NOTIFICATIONS
// ==============================

const saveNotificationsBtn = document.getElementById("saveNotificationsBtn");

if (saveNotificationsBtn) {
    saveNotificationsBtn.addEventListener("click", function () {
        const emailConfirmations = document.getElementById("emailConfirmations").checked;
const appointmentReminders = document.getElementById("appointmentReminders").checked;
const dailyAdminSummary = document.getElementById("dailyAdminSummary").checked;

localStorage.setItem("emailConfirmations", emailConfirmations);
localStorage.setItem("appointmentReminders", appointmentReminders);
localStorage.setItem("dailyAdminSummary", dailyAdminSummary);

alert("Notification settings saved successfully.");
    });
}
// Restore saved notification settings
const emailConfirmationsBox = document.getElementById("emailConfirmations");
const appointmentRemindersBox = document.getElementById("appointmentReminders");
const dailyAdminSummaryBox = document.getElementById("dailyAdminSummary");

if (emailConfirmationsBox && localStorage.getItem("emailConfirmations") !== null) {
    emailConfirmationsBox.checked =
        localStorage.getItem("emailConfirmations") === "true";
}

if (appointmentRemindersBox && localStorage.getItem("appointmentReminders") !== null) {
    appointmentRemindersBox.checked =
        localStorage.getItem("appointmentReminders") === "true";
}

if (dailyAdminSummaryBox && localStorage.getItem("dailyAdminSummary") !== null) {
    dailyAdminSummaryBox.checked =
        localStorage.getItem("dailyAdminSummary") === "true";
}
// ==============================
// SETTINGS PAGE - AI AUTOMATION
// ==============================

const saveAISettingsBtn = document.getElementById("saveAISettingsBtn");

if (saveAISettingsBtn) {
    saveAISettingsBtn.addEventListener("click", function () {
        const aiSchedulingAssistant = document.getElementById("aiSchedulingAssistant").checked;
const aiAlternativeTimes = document.getElementById("aiAlternativeTimes").checked;
const aiBusinessInsights = document.getElementById("aiBusinessInsights").checked;

localStorage.setItem("aiSchedulingAssistant", aiSchedulingAssistant);
localStorage.setItem("aiAlternativeTimes", aiAlternativeTimes);
localStorage.setItem("aiBusinessInsights", aiBusinessInsights);

alert("AI settings saved successfully.");
    });
}
const aiSchedulingAssistantBox = document.getElementById("aiSchedulingAssistant");
const aiAlternativeTimesBox = document.getElementById("aiAlternativeTimes");
const aiBusinessInsightsBox = document.getElementById("aiBusinessInsights");

if (aiSchedulingAssistantBox && localStorage.getItem("aiSchedulingAssistant") !== null) {
    aiSchedulingAssistantBox.checked =
        localStorage.getItem("aiSchedulingAssistant") === "true";
}

if (aiAlternativeTimesBox && localStorage.getItem("aiAlternativeTimes") !== null) {
    aiAlternativeTimesBox.checked =
        localStorage.getItem("aiAlternativeTimes") === "true";
}

if (aiBusinessInsightsBox && localStorage.getItem("aiBusinessInsights") !== null) {
    aiBusinessInsightsBox.checked =

    localStorage.getItem("aiBusinessInsights") === "true";
}
 
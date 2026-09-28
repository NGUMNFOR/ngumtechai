
const loginForm = document.getElementById("adminLoginForm");

loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    console.log("Sending login request to n8n...");

    const response = await fetch("https://n8n.ngumtechai.com/webhook-test/admin-login", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        email: email,
        password: password
    })
});

const text = await response.text();
console.log("Raw n8n response:", text);

const data = JSON.parse(text);

if (data.success === true) {
    window.location.href = "../index.html";
} else {
    alert(data.message || "Invalid email or password.");
}
console.log("HTTP status:", response.status);
});
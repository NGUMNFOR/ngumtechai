const menuToggle = document.getElementById("menuToggle");
const navLinks = document.querySelector(".nav-links");

menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
});
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show");
        }
    });
}, {
    root: null,
    threshold: 0.3
});

document.querySelectorAll("section:not(.hero)").forEach((section) => {
    observer.observe(section);
});
const sections = document.querySelectorAll("section");
const navItems = document.querySelectorAll(".nav-links a");

window.addEventListener("scroll", () => {
    let current = "";

    sections.forEach((section) => {
        const sectionTop = section.offsetTop - 120;
        const sectionHeight = section.offsetHeight;

        if (window.scrollY >= sectionTop &&
            window.scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute("id");
        }
    });

    navItems.forEach((link) => {
        link.classList.remove("active");

        if (link.getAttribute("href") === "#" + current) {
            link.classList.add("active");
        }
    });
});
// Scroll Progress Bar
window.addEventListener("scroll", () => {

    const scrollTop = document.documentElement.scrollTop;

    const scrollHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;

    const progress = (scrollTop / scrollHeight) * 100;

    document.querySelector(".progress-bar").style.width =
        progress + "%";

});
const counters = document.querySelectorAll(".counter");

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {

            const counter = entry.target;
            const target = +counter.dataset.target;
            let count = 0;

            const updateCounter = () => {
                const increment = Math.ceil(target / 50);

                if (count < target) {
                    count += increment;

                    if (count > target) count = target;

                    counter.innerText = count;

                    setTimeout(updateCounter, 30);
                }
            };

            updateCounter();

            counterObserver.unobserve(counter);
        }
    });
}, {
    threshold: 0.15
});

counters.forEach(counter => {
    counterObserver.observe(counter);
});
// ==============================
// Chat Widget
// ==============================

const chatToggle = document.getElementById("chatToggle");
const chatBox = document.getElementById("chatBox");
const closeChat = document.getElementById("closeChat");

if (chatToggle && chatBox && closeChat) {

    chatToggle.addEventListener("click", () => {
        chatBox.classList.add("active");
        chatToggle.style.display = "none";
    });

    closeChat.addEventListener("click", () => {
        chatBox.classList.remove("active");
        chatToggle.style.display = "flex";
    });

}
// Chat option buttons
const chatOptions = document.querySelectorAll(".chat-option");

chatOptions.forEach(button => {
    button.addEventListener("click", () => {

        const message = document.querySelector(".bot-message");

        if (button.textContent.includes("Learn")) {
            message.innerHTML = `
                🤖 We offer:
                <br><br>
                • AI Chatbots
                <br>
                • AI Voice Receptionists
                <br>
                • Workflow Automation
            `;
        }

        if (button.textContent.includes("Book")) {
            message.innerHTML = `
                📅 Great!
                <br><br>
                Please email us at:
                <br>
                info@ngumtechai.com
            `;
        }

        if (button.textContent.includes("Ask")) {
            message.innerHTML = `
                💬 Please send us your question using the contact form below, and we'll respond as soon as possible.
            `;
        }

    });
});
// ===============================
// Chat Conversation
// ===============================

const chatInput = document.getElementById("chatInput");
const sendMessage = document.getElementById("sendMessage");
const chatBody = document.getElementById("chatBody");

function addUserMessage(message) {
    chatBody.innerHTML += `
        <div class="user-message">
            ${message}
        </div>
    `;
}

function addBotMessage(message) {
    chatBody.innerHTML += `
        <div class="bot-message">
            ${message}
        </div>
    `;

    chatBody.scrollTop = chatBody.scrollHeight;
}

function getBotReply(message) {

    message = message.toLowerCase();

    if (message.includes("hello") || message.includes("hi")) {
        return "👋 Hello! Welcome to Ngum Tech AI. How can I help you today?";
    }

    if (message.includes("service")) {
        return "We specialize in AI Chatbots, AI Voice Receptionists, Workflow Automation, AI Consulting, Business Process Automation, and Custom AI Solutions.";
    }

    if (message.includes("chatbot")) {
        return "Our AI chatbots can answer customer questions 24/7, capture leads, book appointments, and automate customer support.";
    }

    if (message.includes("voice")) {
        return "Our AI Voice Receptionists answer calls, schedule appointments, qualify leads, and provide customer support using natural conversations.";
    }

    if (message.includes("automation")) {
        return "We automate repetitive business tasks using AI and platforms like n8n, helping businesses save time and reduce costs.";
    }

    if (message.includes("price") || message.includes("cost")) {
        return "Pricing depends on your project requirements. We offer customized solutions for every business. Book a free consultation to receive a personalized quote.";
    }

    if (message.includes("demo")) {
        return "Absolutely! We'd love to demonstrate how AI can transform your business. Please fill out the contact form, and we'll schedule a free demo.";
    }

    if (message.includes("appointment")) {
        return "Yes! We can build AI systems that automatically schedule appointments and integrate with Google Calendar or Microsoft Outlook.";
    }

    if (message.includes("n8n")) {
        return "Yes! We build advanced AI workflows using n8n to automate emails, CRMs, scheduling, document processing, and much more.";
    }

    if (message.includes("location")) {
        return "Ngum Tech AI serves clients remotely across the United States and internationally.";
    }

    if (message.includes("contact")) {
        return "You can contact us using the form on this page or email us directly at info@ngumtechai.com.";
    }

    if (message.includes("thank")) {
        return "😊 You're very welcome! Let me know if there's anything else I can help you with.";
    }

    return "I'm here to help! You can ask me about AI Chatbots, AI Voice Agents, Workflow Automation, pricing, demos, or how AI can improve your business.";
}

sendMessage.addEventListener("click", () => {

    const message = chatInput.value.trim();

    if (message === "") return;

    addUserMessage(message);

    chatInput.value = "";

    const typing = document.createElement("div");
    typing.className = "bot-message";
    typing.id = "typing";
    typing.innerHTML = "🤖 Ngum Tech AI is typing...";

    chatBody.appendChild(typing);
    chatBody.scrollTop = chatBody.scrollHeight;
fetch("https://ngumnfor.app.n8n.cloud/webhook/ngum-tech-ai-chat", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        message: message
    })
})
.then(response => {
    if (!response.ok) {
        throw new Error(`Webhook error: ${response.status}`);
    }

    return response.json();
})
.then(data => {
    const typingMessage = document.getElementById("typing");

    if (typingMessage) {
        typingMessage.remove();
    }

    addBotMessage(
        data.reply || "Sorry, I could not generate a response."
    );
}).catch(error => {
    console.error("Chatbot error:", error);

    const typingMessage = document.getElementById("typing");

    if (typingMessage) {
        typingMessage.remove();
    }

    addBotMessage(getBotReply(message));
});

});

chatInput.addEventListener("keypress", function(e){

    if(e.key === "Enter"){

        sendMessage.click();

    }

});
// =========================
// HEALTHCARE DEMO MODAL
// =========================

const healthcareDemoButton = document.getElementById("healthcare-demo-button");
const healthcareDemoModal = document.getElementById("healthcare-demo-modal");
const healthcareDemoClose = document.getElementById("healthcare-demo-close");
const healthcareDemoChat = document.getElementById("healthcare-demo-chat");
const healthcareOptions = document.querySelectorAll(".healthcare-option");

function openHealthcareDemo() {
    if (!healthcareDemoModal) return;

    healthcareDemoModal.classList.add("active");
    document.body.classList.add("modal-open");
}

function closeHealthcareDemo() {
    if (!healthcareDemoModal) return;

    healthcareDemoModal.classList.remove("active");
    document.body.classList.remove("modal-open");
}

if (healthcareDemoButton) {
    healthcareDemoButton.addEventListener("click", openHealthcareDemo);
}

if (healthcareDemoClose) {
    healthcareDemoClose.addEventListener("click", closeHealthcareDemo);
}

if (healthcareDemoModal) {
    healthcareDemoModal.addEventListener("click", (event) => {
        if (event.target === healthcareDemoModal) {
            closeHealthcareDemo();
        }
    });
}

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeHealthcareDemo();
    }
});

healthcareOptions.forEach((button) => {
    button.addEventListener("click", () => {
        const question = button.textContent.trim();

        let reply = "";

        if (question.includes("business hours")) {
            reply =
                "Ngum HealthCare is open Monday through Friday from 8:00 AM to 5:30 PM. We are closed on Saturdays and Sundays.";
        } else if (question.includes("insurance")) {
            reply =
                "Yes. Ngum HealthCare accepts all kinds of insurance. Please bring your insurance information to your appointment.";
        } else if (question.includes("book an appointment")) {
            reply =
                "I can help with that. Please provide your preferred date, preferred time, full name, email address, and phone number.";
        }

        healthcareDemoChat.insertAdjacentHTML(
            "beforeend",
            `
            <div class="demo-user-message">
                ${question}
            </div>

            <div class="demo-bot-message">
                ${reply}
            </div>
            `
        );

        healthcareDemoChat.scrollTop = healthcareDemoChat.scrollHeight;
    });
});
// ==========================
// RESTAURANT DEMO MODAL
// ==========================

const restaurantDemoButton = document.getElementById("restaurant-demo-button");
const restaurantDemoModal = document.getElementById("restaurant-demo-modal");
const restaurantDemoClose = document.getElementById("restaurant-demo-close");
const restaurantDemoChat = document.getElementById("restaurant-demo-chat");
const restaurantOptions = document.querySelectorAll(".restaurant-option");

function openRestaurantDemo() {
    if (!restaurantDemoModal) return;

    restaurantDemoModal.classList.add("active");
    document.body.classList.add("modal-open");
}

function closeRestaurantDemo() {
    if (!restaurantDemoModal) return;

    restaurantDemoModal.classList.remove("active");
    document.body.classList.remove("modal-open");
}

if (restaurantDemoButton) {
    restaurantDemoButton.addEventListener("click", openRestaurantDemo);
}

if (restaurantDemoClose) {
    restaurantDemoClose.addEventListener("click", closeRestaurantDemo);
}

if (restaurantDemoModal) {
    restaurantDemoModal.addEventListener("click", (event) => {
        if (event.target === restaurantDemoModal) {
            closeRestaurantDemo();
        }
    });
}
restaurantOptions.forEach((button) => {
    button.addEventListener("click", () => {
        const question = button.textContent.trim();

        let reply = "";

        if (question.includes("What food do you serve")) {
            reply =
                "Our AI Restaurant Assistant can answer menu questions instantly, recommend dishes, explain ingredients, and help customers make ordering decisions.";
        } else if (question.includes("business hours")) {
            reply =
                "The AI assistant can automatically answer questions about restaurant hours, location, reservations, and holiday schedules 24/7.";
        } else if (question.includes("place an order")) {
            reply =
                "The AI can collect customer details, take food orders, send them to the restaurant, and even integrate with delivery and payment systems.";
        }

        restaurantDemoChat.insertAdjacentHTML(
            "beforeend",
            `
            <div class="demo-user-message">
                ${question}
            </div>

            <div class="demo-bot-message">
                ${reply}
            </div>
            `
        );

        restaurantDemoChat.scrollTop = restaurantDemoChat.scrollHeight;
    });
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeRestaurantDemo();
    }
});
// ==========================
// APPOINTMENT BOOKING DEMO
// ==========================

const appointmentDemoButton = document.getElementById("appointment-demo-button");
const appointmentDemoModal = document.getElementById("appointment-demo-modal");
const appointmentDemoClose = document.getElementById("appointment-demo-close");
const appointmentDemoChat = document.getElementById("appointment-demo-chat");
const appointmentOptions = document.querySelectorAll(".appointment-option");

function openAppointmentDemo() {
    if (!appointmentDemoModal) return;

    appointmentDemoModal.classList.add("active");
    document.body.classList.add("modal-open");
}

function closeAppointmentDemo() {
    if (!appointmentDemoModal) return;

    appointmentDemoModal.classList.remove("active");
    document.body.classList.remove("modal-open");
}

if (appointmentDemoButton) {
    appointmentDemoButton.addEventListener("click", openAppointmentDemo);
}

if (appointmentDemoClose) {
    appointmentDemoClose.addEventListener("click", closeAppointmentDemo);
}

if (appointmentDemoModal) {
    appointmentDemoModal.addEventListener("click", (event) => {
        if (event.target === appointmentDemoModal) {
            closeAppointmentDemo();
        }
    });
}

appointmentOptions.forEach((button) => {
    button.addEventListener("click", () => {
        const question = button.textContent.trim();

        let reply = "";

        if (question.includes("Check available times")) {
            reply =
                "Our next available appointments are tomorrow at 10:00 AM, 1:30 PM, and 3:00 PM.";
        } else if (question.includes("Book an appointment")) {
            reply =
                "Great! Please provide your name, email address, and preferred appointment time to complete your booking.";
        } else if (question.includes("Reschedule")) {
            reply =
                "No problem. Please provide your current appointment date and the new date you'd like, and I'll help you reschedule.";
        }

        appointmentDemoChat.insertAdjacentHTML(
            "beforeend",
            `
            <div class="demo-user-message">
                ${question}
            </div>

            <div class="demo-bot-message">
                ${reply}
            </div>
            `
        );

        appointmentDemoChat.scrollTop = appointmentDemoChat.scrollHeight;
    });
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeAppointmentDemo();
    }
});
// ==========================
// CUSTOMER SUPPORT AI DEMO
// ==========================

const supportDemoButton = document.getElementById("support-demo-button");
const supportDemoModal = document.getElementById("support-demo-modal");
const supportDemoClose = document.getElementById("support-demo-close");
const supportDemoChat = document.getElementById("support-demo-chat");
const supportOptions = document.querySelectorAll(".support-option");

function openSupportDemo() {
    if (!supportDemoModal) return;

    supportDemoModal.classList.add("active");
    document.body.classList.add("modal-open");
}

function closeSupportDemo() {
    if (!supportDemoModal) return;

    supportDemoModal.classList.remove("active");
    document.body.classList.remove("modal-open");
}

if (supportDemoButton) {
    supportDemoButton.addEventListener("click", openSupportDemo);
}

if (supportDemoClose) {
    supportDemoClose.addEventListener("click", closeSupportDemo);
}

if (supportDemoModal) {
    supportDemoModal.addEventListener("click", (event) => {
        if (event.target === supportDemoModal) {
            closeSupportDemo();
        }
    });
}

supportOptions.forEach((button) => {
    button.addEventListener("click", () => {
        const question = button.textContent.trim();

        let reply = "";

        if (question.includes("What services do you offer")) {
            reply =
                "Ngum Tech AI provides AI receptionists, appointment-booking automation, customer-support chatbots, workflow automation, and custom AI solutions for businesses.";
        } else if (question.includes("How much does AI automation cost")) {
            reply =
                "Pricing depends on the workflow, integrations, and level of customization. We begin with a consultation to understand your goals and recommend the right solution.";
        } else if (question.includes("schedule a consultation")) {
            reply =
                "Great! You can use the Book a Demo button to send your details and request a consultation with Ngum Tech AI.";
        }

        supportDemoChat.insertAdjacentHTML(
            "beforeend",
            `
            <div class="demo-user-message">
                ${question}
            </div>

            <div class="demo-bot-message">
                ${reply}
            </div>
            `
        );

        supportDemoChat.scrollTop = supportDemoChat.scrollHeight;
    });
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeSupportDemo();
    }
});
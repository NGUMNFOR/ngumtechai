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
function showTypingIndicator(chatContainer) {
    const typingMessage = document.createElement("div");

    typingMessage.className = "demo-bot-message demo-typing-message";
    typingMessage.innerHTML = `
        <span>AI is typing</span>
        <span class="typing-dots">
            <span>.</span>
            <span>.</span>
            <span>.</span>
        </span>
    `;

    chatContainer.appendChild(typingMessage);
    chatContainer.scrollTop = chatContainer.scrollHeight;

    return typingMessage;
}
// =========================
// HEALTHCARE DEMO MODAL
// =========================

const healthcareDemoButton = document.getElementById("healthcare-demo-button");
const healthcareDemoModal = document.getElementById("healthcare-demo-modal");
const healthcareDemoClose = document.getElementById("healthcare-demo-close");
const healthcareDemoChat = document.getElementById("healthcare-demo-chat");
const healthcareOptions = document.querySelectorAll(".healthcare-option");
const healthcareMessageInput = document.getElementById("healthcare-message-input");
const healthcareSendButton = document.getElementById("healthcare-send-button");
const supportDemoButton = document.getElementById("support-demo-button");
const supportDemoClose = document.getElementById("support-demo-close");
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
if (supportDemoClose) {
    supportDemoClose.addEventListener("click", () => {
        const supportDemoModal = document.getElementById("support-demo-modal");

        if (supportDemoModal) {
            supportDemoModal.classList.remove("active");
            document.body.classList.remove("modal-open");
        }
    });
}
if (supportDemoButton) {
    supportDemoButton.addEventListener("click", () => {
        const supportDemoModal = document.getElementById("support-demo-modal");

        if (supportDemoModal) {
            supportDemoModal.classList.add("active");
            document.body.classList.add("modal-open");
        }
    });
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
if (
    healthcareSendButton &&
    healthcareMessageInput &&
    healthcareDemoChat
) {
    healthcareSendButton.addEventListener("click", () => {
        const message = healthcareMessageInput.value.trim();

        if (!message) return;

        healthcareDemoChat.insertAdjacentHTML(
            "beforeend",
            `
            <div class="demo-user-message">
                ${message}
            </div>
            `
        );

        healthcareMessageInput.value = "";

        const typingMessage = showTypingIndicator(healthcareDemoChat);

        setTimeout(() => {
            typingMessage.remove();

         let reply =
    "Thanks for your message. I can help with business hours, insurance, and appointment booking.";

const lowerMessage = message.toLowerCase();

if (
    lowerMessage === "hello" ||
    lowerMessage === "hi" ||
    lowerMessage === "hey" ||
    lowerMessage.includes("good morning") ||
    lowerMessage.includes("good afternoon") ||
    lowerMessage.includes("good evening")
) {
    reply =
        "Hello! Welcome to Ngum HealthCare. How may I assist you today?";
} else if (
    lowerMessage.includes("hour") ||
    lowerMessage.includes("open")
) {
    reply =
        "Ngum HealthCare is open Monday through Friday from 8:00 AM to 5:30 PM. We are closed on Saturdays and Sundays.";
} else if (lowerMessage.includes("insurance")) {
    reply =
        "Yes, Ngum HealthCare accepts different types of insurance. Please contact the clinic to confirm whether your specific plan is accepted.";
} else if (
    lowerMessage.includes("appointment") ||
    lowerMessage.includes("book")
) {
    reply =
        "I can help with that. Please provide your preferred date, preferred time, full name, email address, and phone number.";
}

            healthcareDemoChat.insertAdjacentHTML(
                "beforeend",
                `
                <div class="demo-bot-message">
                    ${reply}
                </div>
                `
            );

            healthcareDemoChat.scrollTop =
                healthcareDemoChat.scrollHeight;
        }, 800);
    });

    healthcareMessageInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            healthcareSendButton.click();
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
    `
);

healthcareDemoChat.scrollTop = healthcareDemoChat.scrollHeight;

const typingMessage = showTypingIndicator(healthcareDemoChat);

setTimeout(() => {
    typingMessage.remove();

    healthcareDemoChat.insertAdjacentHTML(
        "beforeend",
        `
        <div class="demo-bot-message">
            ${reply}
        </div>
        `
    );

    healthcareDemoChat.scrollTop = healthcareDemoChat.scrollHeight;
}, 1200);
    });
});
// ==============================
// CUSTOMER SUPPORT DEMO OPTIONS
// ==============================

const supportDemoChat = document.getElementById("support-demo-chat");
const supportOptions = document.querySelectorAll(".support-option");
const supportMessageInput = document.getElementById("support-message-input");
const supportSendButton = document.getElementById("support-send-button");
supportSendButton.addEventListener("click", () => {
    const message = supportMessageInput.value.trim();

    if (!message) return;

    supportDemoChat.insertAdjacentHTML(
        "beforeend",
        `
        <div class="demo-message user-message">
            ${message}
        </div>
        `
    );

    let reply = "";

    const text = message.toLowerCase();

    if (text.includes("hello") || text.includes("hi") || text.includes("hey")) {
        reply = "Hello! Welcome to Ngum Tech AI. How may I help you today?";
    } else if (text.includes("services")) {
        reply = "We provide AI receptionists, appointment booking, customer support chatbots, workflow automation and business consulting.";
    } else if (text.includes("cost") || text.includes("price")) {
        reply = "Our pricing depends on your business needs. We'd be happy to schedule a free consultation.";
    } else if (text.includes("consultation") || text.includes("book")) {
        reply = "Great! Please use the Book a Demo button and we'll contact you shortly.";
    } else {
        reply = "Thank you for your message. One of our AI specialists will be happy to assist you.";
    }

    const typingMessage = showTypingIndicator(supportDemoChat);

setTimeout(() => {
    typingMessage.remove();

    supportDemoChat.insertAdjacentHTML(
        "beforeend",
        `
        <div class="demo-bot-message">
            ${reply}
        </div>
        `
    );

    supportDemoChat.scrollTop = supportDemoChat.scrollHeight;
}, 1200);

    supportMessageInput.value = "";
});
supportOptions.forEach((button) => {
    button.addEventListener("click", () => {
        const question = button.textContent.trim();

        let reply = "";

        if (question.includes("services")) {
            reply =
                "We offer AI receptionists, appointment booking automation, customer support chatbots, workflow automation, and business consulting.";
        } else if (question.includes("cost")) {
            reply =
                "The cost depends on the size and complexity of the automation. We can provide a customized quote after a short consultation.";
        } else if (question.includes("consultation")) {
            reply =
                "Great! Please use the Book a Demo button or contact form to schedule your consultation.";
        } else {
            reply =
                "Thank you for your question. Our team can help you choose the right AI automation solution for your business.";
        }

        if (!supportDemoChat) return;

        supportDemoChat.insertAdjacentHTML(
            "beforeend",
            `
            <div class="demo-message user-message">
                ${question}
            </div>
            <div class="demo-message bot-message">
                ${reply}
            </div>
            `
        );

        supportDemoChat.scrollTop = supportDemoChat.scrollHeight;
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
const restaurantMessageInput = document.getElementById("restaurant-message-input");
const restaurantSendButton = document.getElementById("restaurant-send-button");

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
restaurantSendButton.addEventListener("click", () => {

    const message = restaurantMessageInput.value.trim();

    if (!message) return;

    restaurantDemoChat.insertAdjacentHTML(
        "beforeend",
        `
        <div class="demo-user-message">
            ${message}
        </div>
        `
    );

    restaurantMessageInput.value = "";

    const typingMessage = showTypingIndicator(restaurantDemoChat);

    setTimeout(() => {

        typingMessage.remove();

        let reply = "";
        const text = message.toLowerCase();

        if (
            text.includes("hello") ||
            text.includes("hi") ||
            text.includes("hey")
        ) {
            reply = "Hello! Welcome to our Restaurant AI Assistant. How may I help you today?";
        }
        else if (text.includes("menu") || text.includes("food")) {
            reply = "We can answer menu questions, recommend meals, and provide ingredient information.";
        }
        else if (text.includes("hours")) {
            reply = "Our restaurant is open Monday–Sunday from 9:00 AM to 9:00 PM.";
        }
        else if (text.includes("order")) {
            reply = "Great! Please tell me what you'd like to order, and I'll guide you through the process.";
        }
        else if (text.includes("delivery")) {
            reply = "Yes! We offer both pickup and delivery depending on your location.";
        }
        else {
            reply = "I'm happy to help with menu questions, business hours, placing orders, and delivery information.";
        }

        restaurantDemoChat.insertAdjacentHTML(
            "beforeend",
            `
            <div class="demo-bot-message">
                ${reply}
            </div>
            `
        );

        restaurantDemoChat.scrollTop = restaurantDemoChat.scrollHeight;

    }, 1200);

});

restaurantMessageInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        restaurantSendButton.click();
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
const appointmentMessageInput = document.getElementById("appointment-message-input");
const appointmentSendButton = document.getElementById("appointment-send-button");


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
appointmentSendButton.addEventListener("click", () => {
    const message = appointmentMessageInput.value.trim();

    if (!message) return;

    appointmentDemoChat.insertAdjacentHTML(
        "beforeend",
        `
        <div class="demo-message user-message">
            ${message}
        </div>
        `
    );

    const text = message.toLowerCase();
    let reply = "";

    if (text.includes("hello") || text.includes("hi") || text.includes("hey")) {
        reply = "Hello! Welcome to the Appointment Booking AI demo. How may I assist you today?";
    } else if (text.includes("available") || text.includes("time")) {
        reply = "I can help you check available appointment times. Please tell me your preferred day and time.";
    } else if (text.includes("book") || text.includes("appointment")) {
        reply = "Great! Please provide your name, preferred date, and preferred time.";
    } else if (text.includes("reschedule")) {
        reply = "Certainly. Please provide your current appointment time and the new time you prefer.";
    } else {
        reply = "I can help you check availability, book an appointment, or reschedule an existing appointment.";
    }

    const typingMessage = showTypingIndicator(appointmentDemoChat);

setTimeout(() => {
    typingMessage.remove();

    appointmentDemoChat.insertAdjacentHTML(
        "beforeend",
        `
        <div class="demo-bot-message">
            ${reply}
        </div>
        `
    );

    appointmentDemoChat.scrollTop = appointmentDemoChat.scrollHeight;
}, 1200);

    appointmentMessageInput.value = "";
});
// ===============================
// Google Analytics Event Tracking
// ===============================

const navBookDemo = document.getElementById("navBookDemo");
const heroBookDemo = document.getElementById("heroBookDemo");

function trackBookDemo(location) {
    if (typeof gtag === "function") {
        gtag("event", "book_demo_click", {
            event_category: "Engagement",
            event_label: location
        });
    }
}

if (navBookDemo) {
    navBookDemo.addEventListener("click", () => {
        trackBookDemo("Navigation");
    });
}

if (heroBookDemo) {
    heroBookDemo.addEventListener("click", () => {
        trackBookDemo("Hero");
    });
}
// =================================
// Demo Booking Modal
// =================================

const bookingModal = document.getElementById("bookingModal");
const bookingClose = document.getElementById("bookingClose");
const navBookDemoButton = document.getElementById("navBookDemo");
const heroBookDemoButton = document.getElementById("heroBookDemo");

function openBookingModal(event) {
    event.preventDefault();

    if (bookingModal) {
        bookingModal.classList.add("active");
        document.body.style.overflow = "hidden";
    }
}

function closeBookingModal() {
    if (bookingModal) {
        bookingModal.classList.remove("active");
        document.body.style.overflow = "";
    }
}

if (navBookDemoButton) {
    navBookDemoButton.addEventListener("click", openBookingModal);
}

if (heroBookDemoButton) {
    heroBookDemoButton.addEventListener("click", openBookingModal);
}

if (bookingClose) {
    bookingClose.addEventListener("click", closeBookingModal);
}

if (bookingModal) {
    bookingModal.addEventListener("click", (event) => {
        if (event.target === bookingModal) {
            closeBookingModal();
        }
    });
}

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeBookingModal();
    }
});
// =================================
// Show custom fields for "Other"
// =================================

const businessType = document.getElementById("businessType");
const otherBusinessType = document.getElementById("otherBusinessType");

const aiSolution = document.getElementById("aiSolution");
const otherAiSolution = document.getElementById("otherAiSolution");

if (businessType && otherBusinessType) {
    businessType.addEventListener("change", () => {
        if (businessType.value === "Other") {
            otherBusinessType.style.display = "block";
            otherBusinessType.required = true;
        } else {
            otherBusinessType.style.display = "none";
            otherBusinessType.required = false;
            otherBusinessType.value = "";
        }
    });
}

if (aiSolution && otherAiSolution) {
    aiSolution.addEventListener("change", () => {
        if (aiSolution.value === "Other") {
            otherAiSolution.style.display = "block";
            otherAiSolution.required = true;
        } else {
            otherAiSolution.style.display = "none";
            otherAiSolution.required = false;
            otherAiSolution.value = "";
        }
    });
}
/* ==========================================
   FAQ ACCORDION
========================================== */

const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach((item) => {
    const button = item.querySelector(".faq-question");

    button.addEventListener("click", () => {

        if (item.classList.contains("active")) {
            item.classList.remove("active");
        } else {

            faqItems.forEach((faq) => {
                faq.classList.remove("active");
            });

            item.classList.add("active");
        }

    });
});
// ==========================================
// Track Strategy Session Form Submission
// ==========================================

const strategySessionForm = document.querySelector(".contact-form");

if (strategySessionForm) {
    strategySessionForm.addEventListener("submit", () => {
        if (typeof gtag === "function") {
            gtag("event", "strategy_session_form_submit", {
                form_name: "Free AI Strategy Session"
            });
        }
    });
}



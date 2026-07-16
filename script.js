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
    threshold: 0.8
});

document.querySelectorAll("section:not(.hero)").forEach((section) => {
    section.classList.add("hidden");
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
// Existing JavaScript
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
const statsSection = document.querySelector(".stats");

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
    threshold: 0.5
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
    
    setTimeout(() => {
    
        document.getElementById("typing").remove();
    
        addBotMessage(getBotReply(message));
    
    }, 1000);

});

chatInput.addEventListener("keypress", function(e){

    if(e.key === "Enter"){

        sendMessage.click();

    }

});

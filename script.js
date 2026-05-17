/**
 * NILSON IT - CORE ENGINE v5.1
 * Integrated: Enrollment, Syllabus Engine, and Authentication
 */

// 1. DATA CONFIGURATION
const MASTER_ADMIN = "admin@nilsonit.com";
const MASTER_PASS = "nilson2026";

// Syllabus Content Database
let currentSyllabusCourse = "";
let currentSyllabusPrice = "";

const SYLLABUS_DATA = {
    "Full Stack Development": [
        "Module 1: Frontend Mastery (HTML5, CSS3, Modern JS)",
        "Module 2: React.js & State Management (Redux/Context)",
        "Module 3: Backend with Node.js & Express",
        "Module 4: Database Design (MongoDB & PostgreSQL)",
        "Module 5: Real-world Capstone Project & Deployment"
    ],
    "Advanced Cloud Arch": [
        "Module 1: Cloud Fundamentals & Networking",
        "Module 2: AWS/Azure Core Services (Compute & Storage)",
        "Module 3: Infrastructure as Code (Terraform/Ansible)",
        "Module 4: Cloud Security & Identity Management",
        "Module 5: Architecting for High Availability"
    ],
    "UI/UX Masterclass": [
        "Module 1: Design Thinking & User Research",
        "Module 2: Wireframing & Prototyping in Figma",
        "Module 3: Visual Design & Design Systems",
        "Module 4: Usability Testing & Iteration",
        "Module 5: Portfolio Building & Client Handoff"
    ],
    "Cyber Security Pro": [
        "Module 1: Ethical Hacking & Pentesting",
        "Module 2: Network Security & Firewall Config",
        "Module 3: Cryptography & Secure Communication",
        "Module 4: Incident Response & Digital Forensics",
        "Module 5: Compliance Frameworks (ISO 27001)"
    ],
    "Data Science & AI": [
        "Module 1: Python for Data Science",
        "Module 2: Statistical Analysis & Visualization",
        "Module 3: Machine Learning Algorithms",
        "Module 4: Deep Learning & Neural Networks",
        "Module 5: Big Data Processing with Spark"
    ],
    "Mastering DevOps": [
        "Module 1: Linux Administration & Scripting",
        "Module 2: Containerization with Docker",
        "Module 3: Orchestration with Kubernetes",
        "Module 4: CI/CD Pipelines (Jenkins/GitHub Actions)",
        "Module 5: Monitoring & Logging (ELK Stack)"
    ],
    "React Native Expert": [
        "Module 1: Mobile UI Architecture",
        "Module 2: Cross-platform Navigation",
        "Module 3: Working with Native Device Features",
        "Module 4: Push Notifications & Offline Storage",
        "Module 5: App Store & Play Store Deployment"
    ],
    "Web3 & Solidity": [
        "Module 1: Blockchain Fundamentals",
        "Module 2: Ethereum & Smart Contract Logic",
        "Module 3: Solidity Programming Deep Dive",
        "Module 4: DApp Frontend Integration (Ethers.js)",
        "Module 5: Defi Protocols & Security Auditing"
    ],
    "IT Project Management": [
        "Module 1: Agile & Scrum Frameworks",
        "Module 2: Project Planning & Resource Allocation",
        "Module 3: Risk Management & Quality Assurance",
        "Module 4: Stakeholder Communication",
        "Module 5: Leadership & Team Dynamics"
    ]
};

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    checkAuthStatus();
    refreshCaptcha();
    setupPasswordToggle();
}

// 2. SYLLABUS ENGINE
function openSyllabus(courseName, price) {
    const title = document.getElementById('syllabusTitle');
    const content = document.getElementById('syllabusContent');
    const overlay = document.getElementById('syllabusOverlay');

    currentSyllabusCourse = courseName;
    currentSyllabusPrice = price;

    if (title && content && overlay) {
        title.innerText = courseName;
        
        // Fetch data or provide fallback
        const modules = SYLLABUS_DATA[courseName] || ["Curriculum details are being updated."];
        
        content.innerHTML = `<ul style="list-style: none; padding: 0;">
            ${modules.map(mod => `
                <li style="padding: 12px; border-bottom: 1px solid #f1f5f9; color: #475569;">
                    <i class="fa-solid fa-circle-play" style="color: #2563eb; margin-right: 12px; font-size: 0.9rem;"></i>
                    ${mod}
                </li>
            `).join('')}
        </ul>`;

        overlay.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
}

function closeSyllabus() {
    const overlay = document.getElementById('syllabusOverlay');
    if (overlay) {
        overlay.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
}

// 3. ENROLLMENT LOGIC
function openEnroll(courseName, price) {
    const nameDisplay = document.getElementById('selectedCourseName');
    const priceDisplay = document.getElementById('selectedCoursePrice');
    const overlay = document.getElementById('enrollOverlay');

    if (nameDisplay && priceDisplay && overlay) {
        nameDisplay.innerText = courseName;
        priceDisplay.innerText = '₹' + parseInt(price).toLocaleString('en-IN');
        
        overlay.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
}

function closeEnroll() {
    const overlay = document.getElementById('enrollOverlay');
    if (overlay) {
        overlay.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
}

function handleEnroll(e) {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('nilsonUser'));
    
    if (!user) {
        alert("Please Sign In first to proceed with enrollment.");
        closeEnroll();
        toggleModal();
        return;
    }

    alert(`✅ Application Received! \nYou've successfully enrolled in ${document.getElementById('selectedCourseName').innerText}. Check your email for login credentials.`);
    closeEnroll();
}

// 4. AUTHENTICATION LOGIC
function toggleModal() {
    const modal = document.getElementById('authModal');
    if (modal) {
        modal.classList.toggle('hidden');
        if (!modal.classList.contains('hidden')) refreshCaptcha();
    }
}

function switchMode(mode) {
    const title = document.getElementById('modalTitle');
    const confirmGroup = document.getElementById('confirmPassGroup');
    const toggleLink = document.getElementById('toggleText');
    const authForm = document.getElementById('authForm');

    if (mode === 'signup') {
        title.innerText = "Create Account";
        authForm.dataset.mode = "signup";
        confirmGroup.classList.remove('hidden');
        toggleLink.innerHTML = `Already have an account? <a href="#" onclick="switchMode('login')" style="color: #2563eb; font-weight: 700; text-decoration: none;">Sign In</a>`;
    } else {
        title.innerText = "Sign In";
        authForm.dataset.mode = "login";
        confirmGroup.classList.add('hidden');
        toggleLink.innerHTML = `New here? <a href="#" onclick="switchMode('signup')" style="color: #2563eb; font-weight: 700; text-decoration: none;">Create Account</a>`;
    }
}

document.getElementById('authForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const mode = this.dataset.mode;
    const email = document.getElementById('loginEmail').value;
    const pass = document.getElementById('loginPass').value;
    const captchaInput = document.getElementById('captchaInput').value;
    const captchaActual = document.getElementById('captchaText').innerText;

    if (captchaInput.toUpperCase() !== captchaActual.toUpperCase()) {
        alert("❌ Invalid Captcha. Try again.");
        refreshCaptcha();
        return;
    }

    if (mode === 'signup') {
        let users = JSON.parse(localStorage.getItem('nilson_users')) || [];
        users.push({ email, pass });
        localStorage.setItem('nilson_users', JSON.stringify(users));
        alert("Account Created! You can now sign in.");
        switchMode('login');
    } else {
        let users = JSON.parse(localStorage.getItem('nilson_users')) || [];
        const user = users.find(u => u.email === email && u.pass === pass);

        if (email === MASTER_ADMIN && pass === MASTER_PASS) {
            localStorage.setItem('nilsonUser', JSON.stringify({ name: "Admin", role: "admin" }));
            location.reload();
        } else if (user) {
            localStorage.setItem('nilsonUser', JSON.stringify({ name: email.split('@')[0], role: "student" }));
            location.reload();
        } else {
            alert("❌ Invalid email or password.");
        }
    }
});

// 5. HELPERS
function refreshCaptcha() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const capBox = document.getElementById('captchaText');
    if (capBox) capBox.innerText = code;
}

function setupPasswordToggle() {
    const icons = document.querySelectorAll('.toggle-pass');
    icons.forEach(icon => {
        icon.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            if (input.type === "password") {
                input.type = "text";
                this.classList.replace('fa-eye-slash', 'fa-eye');
            } else {
                input.type = "password";
                this.classList.replace('fa-eye', 'fa-eye-slash');
            }
        });
    });
}

function checkAuthStatus() {
    const user = JSON.parse(localStorage.getItem('nilsonUser'));
    const authZone = document.getElementById('authZone');
    const profile = document.getElementById('userProfile');
    const welcome = document.getElementById('welcomeText');

    if (user && authZone && profile) {
        authZone.classList.add('hidden');
        profile.classList.remove('hidden');
        welcome.innerText = `Hi, ${user.name}`;
    }
}

function logout() {
    localStorage.removeItem('nilsonUser');
    location.reload();
}
// MOBILE MENU TOGGLE

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
        navLinks.classList.toggle("active");
    });
}
// CLOSE MOBILE MENU AFTER CLICKING LINK

const navItems = document.querySelectorAll(".nav-links a");

navItems.forEach(item => {

    item.addEventListener("click", () => {

        navLinks.classList.remove("active");

    });

});

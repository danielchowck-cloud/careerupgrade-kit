const panels = {
  resume: {
    label: "Resume Upgrade",
    title: "One-page resume built for recruiter screening.",
    points: [
      "Clear profile summary for target roles.",
      "Internship, project, CCA, and part-time work rewritten.",
      "Achievement-focused bullets with action verbs.",
    ],
  },
  linkedin: {
    label: "LinkedIn Starter Profile",
    title: "A profile that shows direction instead of just 'student' or 'fresh graduate'.",
    points: [
      "Headline aligned to target roles.",
      "About section with credible positioning.",
      "Experience, project, and skills sections rewritten for recruiter search.",
    ],
  },
  interview: {
    label: "Interview Starter Pack",
    title: "Prepared answers without sounding memorized.",
    points: [
      "\"Tell me about yourself\" script.",
      "10 common internship and fresh graduate interview answers.",
      "5 STAR-format story examples based on real background.",
    ],
  },
  tracker: {
    label: "Application Tracker",
    title: "A simple system for applying with more control.",
    points: [
      "Track companies, roles, dates, and follow-ups.",
      "Record resume version and interview stage.",
      "Reduce random applications and missed follow-ups.",
    ],
  },
};

const panel = document.querySelector("#kit-panel");
const buttons = document.querySelectorAll(".kit-item");
const params = new URLSearchParams(window.location.search);
const source = params.get("src") || params.get("source") || "direct";

function setupMobileNav() {
  const topbar = document.querySelector(".topbar");
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector("#site-nav");

  if (!topbar || !toggle || !nav) {
    return;
  }

  toggle.addEventListener("click", () => {
    const isOpen = topbar.classList.toggle("nav-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.addEventListener("click", (event) => {
    if (!event.target.closest("a")) {
      return;
    }

    topbar.classList.remove("nav-open");
    toggle.setAttribute("aria-expanded", "false");
  });
}

setupMobileNav();

document.querySelectorAll('input[name="source"]').forEach((field) => {
  field.value = source;
});
document.querySelectorAll('input[name="page_url"]').forEach((field) => {
  field.value = window.location.href;
});
document.querySelectorAll('input[name="referrer"]').forEach((field) => {
  field.value = document.referrer || "none";
});

const form = document.querySelector(".lead-form");

document.querySelectorAll(".lead-form").forEach((leadForm) => {
  leadForm.addEventListener("submit", () => {
    const name = leadForm.elements.name?.value.trim() || "New applicant";
    const timestamp = new Date().toLocaleString("en-SG", {
      timeZone: "Asia/Singapore",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

    if (leadForm.elements._subject) {
      leadForm.elements._subject.value = `${leadForm.elements._subject.value} - ${name} - ${timestamp}`;
    }
  });
});

function renderPanel(key) {
  if (!panel) {
    return;
  }

  const item = panels[key];
  panel.innerHTML = `
    <p class="panel-label">${item.label}</p>
    <h3>${item.title}</h3>
    <ul>${item.points.map((point) => `<li>${point}</li>`).join("")}</ul>
  `;
}

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    buttons.forEach((candidate) => candidate.classList.remove("active"));
    button.classList.add("active");
    renderPanel(button.dataset.panel);
  });
});

document.querySelector("#copy-share")?.addEventListener("click", async () => {
  const message = document.querySelector("#share-message")?.textContent.trim().replace(/\s+/g, " ");
  const status = document.querySelector("#copy-status");

  if (!message || !status) {
    return;
  }

  try {
    await navigator.clipboard.writeText(message);
    status.textContent = "Message copied.";
  } catch {
    status.textContent = "Copy failed. Select the message text manually.";
  }
});

function setupStripePaymentLink() {
  const button = document.querySelector("#stripe-pay-button");
  const note = document.querySelector("#stripe-setup-note");

  if (!button) {
    return;
  }

  const config = window.CUK_STRIPE_CONFIG || {};
  const paymentLink = (config.paymentLink || "").trim();
  const amountLabel = config.amountLabel || "SGD 9.90";

  if (paymentLink && paymentLink.startsWith("https://buy.stripe.com/")) {
    button.href = paymentLink;
    button.textContent = `Pay ${amountLabel} With Stripe`;
    button.classList.remove("disabled");
    button.removeAttribute("aria-disabled");

    if (note) {
      note.textContent = "After payment, Stripe will show the next step for submitting your materials.";
    }
  } else {
    button.addEventListener("click", (event) => event.preventDefault());
  }
}

setupStripePaymentLink();

const targetData = [
  ["Technology, AI & Data", "Software Engineering Intern", "internship", "Projects, GitHub, coding tests, teamwork evidence"],
  ["Technology, AI & Data", "Data Analytics Intern", "internship", "Excel, SQL, Python, dashboards, business insight"],
  ["Technology, AI & Data", "AI / Machine Learning Intern", "internship", "Model projects, Python, data cleaning, experimentation"],
  ["Technology, AI & Data", "Cybersecurity Intern", "internship", "Security fundamentals, labs, incident thinking"],
  ["Technology, AI & Data", "Cloud / DevOps Intern", "internship", "Linux, scripting, cloud basics, deployment projects"],
  ["Technology, AI & Data", "Product Analyst Intern", "internship", "User research, metrics, product thinking"],
  ["Technology, AI & Data", "Junior Software Engineer", "first-job", "Coding tests, GitHub, product thinking, collaboration"],
  ["Technology, AI & Data", "Junior Data Analyst", "first-job", "SQL, dashboards, reporting, communication"],
  ["Banking, Finance, Insurance & Accounting", "Investment Banking Intern", "internship", "Financial modelling, research, deal awareness"],
  ["Banking, Finance, Insurance & Accounting", "Wealth Management Intern", "internship", "Client service, markets interest, communication"],
  ["Banking, Finance, Insurance & Accounting", "Risk & Compliance Intern", "internship", "Regulation, controls, documentation, judgement"],
  ["Banking, Finance, Insurance & Accounting", "Finance Operations Intern", "internship", "Accuracy, reconciliation, process discipline"],
  ["Banking, Finance, Insurance & Accounting", "Audit / Accounting Intern", "internship", "Accounting modules, Excel, documentation accuracy"],
  ["Banking, Finance, Insurance & Accounting", "Finance Analyst", "first-job", "Excel, reporting, variance analysis, business communication"],
  ["Banking, Finance, Insurance & Accounting", "Audit Associate", "first-job", "Accounting fundamentals, detail orientation, client documentation"],
  ["Professional Services, Consulting & Advisory", "Consulting Intern", "internship", "Structured thinking, research, slides, stakeholder interviews"],
  ["Professional Services, Consulting & Advisory", "Business Analyst Intern", "internship", "Problem solving, process mapping, Excel, presentation"],
  ["Professional Services, Consulting & Advisory", "Strategy Intern", "internship", "Market sizing, competitor research, recommendation writing"],
  ["Professional Services, Consulting & Advisory", "Research Analyst Intern", "internship", "Desk research, synthesis, writing, presentation"],
  ["Professional Services, Consulting & Advisory", "Graduate Business Analyst", "first-job", "Client-ready communication, analysis, structured recommendations"],
  ["Engineering, Semiconductor & Manufacturing", "Mechanical Engineering Intern", "internship", "CAD, design projects, problem solving"],
  ["Engineering, Semiconductor & Manufacturing", "Electrical / Electronics Intern", "internship", "Circuit, testing, lab, troubleshooting evidence"],
  ["Engineering, Semiconductor & Manufacturing", "Semiconductor Process Intern", "internship", "Process thinking, lab work, data discipline"],
  ["Engineering, Semiconductor & Manufacturing", "Manufacturing Excellence Intern", "internship", "Lean, process mapping, improvement mindset"],
  ["Engineering, Semiconductor & Manufacturing", "Quality Engineering Intern", "internship", "Root cause, documentation, test evidence"],
  ["Engineering, Semiconductor & Manufacturing", "Graduate Engineer", "first-job", "Technical projects, safety, execution reliability"],
  ["Supply Chain, Logistics & Operations", "Procurement Intern", "internship", "Supplier research, negotiation, Excel tracking"],
  ["Supply Chain, Logistics & Operations", "Supply Chain Analyst Intern", "internship", "Forecasting, inventory, data analysis"],
  ["Supply Chain, Logistics & Operations", "Operations Excellence Intern", "internship", "Process improvement, coordination, reporting"],
  ["Supply Chain, Logistics & Operations", "Logistics Planning Intern", "internship", "Planning, routing, stakeholder coordination"],
  ["Supply Chain, Logistics & Operations", "Warehouse / Fulfilment Intern", "internship", "Inventory, accuracy, safety, process discipline"],
  ["Supply Chain, Logistics & Operations", "Operations Executive", "first-job", "Execution, follow-up, cross-team communication"],
  ["Marketing, Sales & Business", "Digital Marketing Intern", "internship", "Campaigns, analytics, content, audience insight"],
  ["Marketing, Sales & Business", "Business Development Intern", "internship", "Prospecting, research, communication, follow-up"],
  ["Marketing, Sales & Business", "Product Marketing Intern", "internship", "Positioning, competitor research, launch support"],
  ["Marketing, Sales & Business", "Market Research Intern", "internship", "Survey, competitor analysis, presentation"],
  ["Marketing, Sales & Business", "Customer Success Intern", "internship", "Customer communication, onboarding, issue tracking"],
  ["Marketing, Sales & Business", "Sales Coordinator", "first-job", "Customer follow-up, quotations, reporting"],
  ["Healthcare, Biomedical & Pharma", "Biomedical Science Intern", "internship", "Lab skills, documentation, research discipline"],
  ["Healthcare, Biomedical & Pharma", "Clinical Operations Intern", "internship", "Coordination, compliance, patient-care awareness"],
  ["Healthcare, Biomedical & Pharma", "Pharmaceutical Commercial Intern", "internship", "Market research, product knowledge, ethics"],
  ["Healthcare, Biomedical & Pharma", "Medical Affairs Intern", "internship", "Scientific communication, literature review, compliance"],
  ["Healthcare, Biomedical & Pharma", "Healthcare Admin Executive", "first-job", "Service mindset, records, operational accuracy"],
  ["Hospitality, Tourism & Events", "Hotel Operations Intern", "internship", "Guest service, shift reliability, problem handling"],
  ["Hospitality, Tourism & Events", "Events Management Intern", "internship", "Vendor coordination, timelines, on-site execution"],
  ["Hospitality, Tourism & Events", "Customer Experience Intern", "internship", "Service recovery, communication, feedback handling"],
  ["Hospitality, Tourism & Events", "Tourism Marketing Intern", "internship", "Campaign support, visitor insight, content"],
  ["Hospitality, Tourism & Events", "Guest Relations Executive", "first-job", "Customer experience, problem solving, presentation"],
  ["Human Resources, Admin & Education", "HR Intern", "internship", "Recruitment coordination, confidentiality, people skills"],
  ["Human Resources, Admin & Education", "Talent Acquisition Intern", "internship", "Sourcing, screening, scheduling, candidate care"],
  ["Human Resources, Admin & Education", "Learning & Development Intern", "internship", "Training support, facilitation, content"],
  ["Human Resources, Admin & Education", "Education Programme Intern", "internship", "Teaching support, programme coordination"],
  ["Human Resources, Admin & Education", "HR Coordinator", "first-job", "Recruitment support, records, employee communication"],
  ["Legal, Policy, Public Sector & ESG", "Legal Intern", "internship", "Research, drafting, precision, confidentiality"],
  ["Legal, Policy, Public Sector & ESG", "Policy Research Intern", "internship", "Research, writing, stakeholder awareness"],
  ["Legal, Policy, Public Sector & ESG", "Sustainability / ESG Intern", "internship", "Reporting, research, metrics, stakeholder work"],
  ["Legal, Policy, Public Sector & ESG", "Public Sector Programme Intern", "internship", "Programme support, writing, citizen-service mindset"],
  ["Legal, Policy, Public Sector & ESG", "Policy Research Assistant", "first-job", "Research, synthesis, writing, public-sector awareness"],
  ["Design, Media & Communications", "Graphic Design Intern", "internship", "Portfolio, visual judgment, client feedback"],
  ["Design, Media & Communications", "UX / UI Design Intern", "internship", "Figma, user flows, prototypes, usability thinking"],
  ["Design, Media & Communications", "Content Marketing Intern", "internship", "Writing samples, social content, analytics"],
  ["Design, Media & Communications", "Corporate Communications Intern", "internship", "Writing, messaging, stakeholder handling"],
  ["Design, Media & Communications", "Communications Executive", "first-job", "Writing, media monitoring, stakeholder communication"],
  ["Built Environment, Real Estate & Facilities", "Architecture Intern", "internship", "Design portfolio, CAD, model-making, site awareness"],
  ["Built Environment, Real Estate & Facilities", "Quantity Surveying Intern", "internship", "Costing, measurement, contracts, documentation"],
  ["Built Environment, Real Estate & Facilities", "Facilities Management Intern", "internship", "Site coordination, maintenance, service quality"],
  ["Built Environment, Real Estate & Facilities", "Sustainability / Green Building Intern", "internship", "Energy, carbon, green building, data reporting"],
  ["Built Environment, Real Estate & Facilities", "Project Coordinator", "first-job", "Scheduling, contractor coordination, documentation"],
  ["Maritime, Aviation & Transport", "Maritime Operations Intern", "internship", "Port operations, documentation, safety, coordination"],
  ["Maritime, Aviation & Transport", "Aviation Operations Intern", "internship", "Ground operations, safety, service discipline"],
  ["Maritime, Aviation & Transport", "Transport Planning Intern", "internship", "Planning, analytics, stakeholder coordination"],
  ["Maritime, Aviation & Transport", "Fleet / Logistics Intern", "internship", "Routing, scheduling, asset tracking"],
  ["Maritime, Aviation & Transport", "Operations Coordinator", "first-job", "Dispatch, coordination, incident follow-up"],
  ["Energy, Utilities & Sustainability", "Energy Analyst Intern", "internship", "Energy data, Excel, reporting, sustainability awareness"],
  ["Energy, Utilities & Sustainability", "Renewable Energy Intern", "internship", "Solar, project support, technical documentation"],
  ["Energy, Utilities & Sustainability", "Utilities Operations Intern", "internship", "Safety, reliability, process monitoring"],
  ["Energy, Utilities & Sustainability", "Carbon / Climate Intern", "internship", "Carbon accounting, research, ESG reporting"],
  ["Energy, Utilities & Sustainability", "Sustainability Analyst", "first-job", "Reporting, stakeholder engagement, data accuracy"],
  ["Retail, FMCG & E-Commerce", "Retail Operations Intern", "internship", "Store operations, merchandising, customer insight"],
  ["Retail, FMCG & E-Commerce", "E-Commerce Intern", "internship", "Marketplace operations, product listings, analytics"],
  ["Retail, FMCG & E-Commerce", "Category Management Intern", "internship", "Assortment, pricing, competitor checks, Excel"],
  ["Retail, FMCG & E-Commerce", "Merchandising Intern", "internship", "Stock, visual merchandising, sales reporting"],
  ["Retail, FMCG & E-Commerce", "E-Commerce Executive", "first-job", "Platform operations, sales reporting, campaign execution"],
  ["Food, Agritech & Consumer Services", "Food Science Intern", "internship", "Product testing, QA, lab documentation"],
  ["Food, Agritech & Consumer Services", "Quality Assurance Intern", "internship", "Food safety, inspection, documentation"],
  ["Food, Agritech & Consumer Services", "Agritech Intern", "internship", "Operations, sensors/data, sustainability, field work"],
  ["Food, Agritech & Consumer Services", "Consumer Insights Intern", "internship", "Survey, taste test, market research"],
  ["Food, Agritech & Consumer Services", "QA / Operations Executive", "first-job", "Quality checks, documentation, process discipline"],
  ["Social Services, Non-Profit & Community", "Community Outreach Intern", "internship", "Beneficiary engagement, programme coordination"],
  ["Social Services, Non-Profit & Community", "Social Service Research Intern", "internship", "Research, interviews, ethics, reporting"],
  ["Social Services, Non-Profit & Community", "Fundraising / Partnerships Intern", "internship", "Donor research, proposals, communication"],
  ["Social Services, Non-Profit & Community", "Volunteer Management Intern", "internship", "Scheduling, engagement, stakeholder care"],
  ["Social Services, Non-Profit & Community", "Programme Executive", "first-job", "Case notes, community coordination, service mindset"],
  ["Science, Research & Academia", "Research Assistant Intern", "internship", "Literature review, experiments, data collection"],
  ["Science, Research & Academia", "Lab Operations Intern", "internship", "Lab safety, equipment, documentation"],
  ["Science, Research & Academia", "Psychology Research Intern", "internship", "Survey design, interviews, data analysis"],
  ["Science, Research & Academia", "Environmental Research Intern", "internship", "Field work, data, sustainability reporting"],
  ["Science, Research & Academia", "Research Assistant", "first-job", "Research design, writing, analysis, ethics"],
].map(([industry, role, stage, evidence]) => ({ industry, role, stage, evidence }));

const marketUpdated = "27 Jun 2026";

const featuredOpenings = [
  ["Apex Financial Services Internship", "APEX WEALTH MANAGEMENT LLP", "Banking, Finance, Insurance & Accounting", "internship", "https://www.mycareersfuture.gov.sg/job/banking-finance/apex-financial-services-internship-apex-wealth-management-e98e8d0d7fd1a4d2b91a7e34c3c0570d", "26 Jun 2026"],
  ["Finance Intern", "ACE ASCENTIA PTE. LTD.", "Banking, Finance, Insurance & Accounting", "internship", "https://www.mycareersfuture.gov.sg/job/banking-finance/finance-intern-ace-ascentia-1f0866a1e8b79ab7a5d2b4256fe4da54", "26 Jun 2026"],
  ["Intern, Brand & Communications", "MSIG ASIA PTE. LTD.", "Design, Media & Communications", "internship", "https://www.mycareersfuture.gov.sg/job/advertising/intern-brand-communications-msig-asia-c8c274ff21a23a8a9483807268af58be", "26 Jun 2026"],
  ["Digital Marketing Intern", "WHITE SOCIETY PTE. LTD.", "Marketing, Sales & Business", "internship", "https://www.mycareersfuture.gov.sg/job/advertising/digital-marketing-intern-white-society-4c1c5204ecb33cd55a2836e2d48a5a29", "26 Jun 2026"],
  ["Marketing Intern", "LUME ROOFTOP PTE. LTD.", "Hospitality, Tourism & Events", "internship", "https://www.mycareersfuture.gov.sg/job/marketing/marketing-intern-lume-rooftop-f8128616cc229996b27450cfd2ea82c9", "26 Jun 2026"],
  ["Fashion Marketing Intern", "Q RETAIL PTE. LTD.", "Retail, FMCG & E-Commerce", "internship", "https://www.mycareersfuture.gov.sg/job/customer-service/fashion-marketing-intern-q-retail-75ed44ce20b21da2812586e4fb98553d", "26 Jun 2026"],
  ["HR Assistant Internship (3 - 5 months, September intake) #HCT", "RECRUIT EXPRESS PTE LTD", "Healthcare, Biomedical & Pharma", "internship", "https://www.mycareersfuture.gov.sg/job/healthcare/hr-assistant-internship-hct-recruit-express-6eaa29515b3b901ae97d198105725a48", "26 Jun 2026"],
  ["Human Resources Intern", "LUMENS PTE. LTD.", "Human Resources, Admin & Education", "internship", "https://www.mycareersfuture.gov.sg/job/human-resources/human-resources-intern-lumens-1884fc0cdd9886ed2b2e6982b1b4ecdd", "26 Jun 2026"],
  ["HR Intern", "INITIA INTERNATIONAL PTE. LTD.", "Human Resources, Admin & Education", "internship", "https://www.mycareersfuture.gov.sg/job/human-resources/hr-intern-initia-international-ca9f303a9a08ef9e4a7683e1b36aff8b", "26 Jun 2026"],
  ["Marketing & Digital Design Intern", "2KBROS PTE. LTD.", "Design, Media & Communications", "internship", "https://www.mycareersfuture.gov.sg/job/design/marketing-digital-design-intern-2kbros-21ce175e151908229fad9644e4e5c2b5", "25 Jun 2026"],
  ["Intern, Human Resource (part-time/full-time)", "MANULIFE (SINGAPORE) PTE. LTD.", "Banking, Finance, Insurance & Accounting", "internship", "https://www.mycareersfuture.gov.sg/job/human-resources/intern-human-resource-manulife-ac27ed938f858bea5ffb555e1dcf7237", "25 Jun 2026"],
  ["HR & Corporate Communications Intern", "PSA MARINE (PTE) LTD", "Maritime, Aviation & Transport", "internship", "https://www.mycareersfuture.gov.sg/job/human-resources/hr-corporate-communications-intern-psa-marine-ae5ec695f141654c0e48854ec171da64", "25 Jun 2026"],
  ["Software Engineering Intern - IN26005", "ACTIVATE INTERACTIVE PTE LTD", "Technology, AI & Data", "internship", "https://www.mycareersfuture.gov.sg/job/information-technology/software-engineering-intern-in26005-activate-interactive-0bcdafac0051e76d012852b7defc4b77", "24 Jun 2026"],
  ["Data Analyst Intern", "PSA MARINE (PTE) LTD", "Technology, AI & Data", "internship", "https://www.mycareersfuture.gov.sg/job/others/data-analyst-intern-psa-marine-966c1abd654da9373b31e452604d3de0", "22 Jun 2026"],
  ["Logistic Intern", "NISHIN BABY PTE. LTD.", "Supply Chain, Logistics & Operations", "internship", "https://www.mycareersfuture.gov.sg/job/logistics/logistic-intern-nishin-baby-896e360c2d2a76f5423fd7d3b5fabb0d", "23 Jun 2026"],
  ["Quality Intern", "CYRUS TECHNOLOGY (S) PTE. LTD.", "Engineering, Semiconductor & Manufacturing", "internship", "https://www.mycareersfuture.gov.sg/job/precision-engineering/quality-intern-cyrus-technology-05ed542e7718157272150f4871ce2692", "22 Jun 2026"],
  ["Accounts Intern", "EVERSENDAI ENGINEERING PTE LTD", "Banking, Finance, Insurance & Accounting", "internship", "https://www.mycareersfuture.gov.sg/job/accounting/accounts-intern-eversendai-engineering-a54d656502afae5598ae08c1b9a72f1b", "13 Jun 2026"],
  ["Sustainability Intern", "BUREAU VERITAS SINGAPORE PTE. LTD.", "Energy, Utilities & Sustainability", "internship", "https://www.mycareersfuture.gov.sg/job/consulting/sustainability-intern-bureau-veritas-singapore-2bf4a35145d2df21b335a73cc08fd465", "28 May 2026"],
  ["Regulatory Affairs & Quality Assurance Intern (Uni Undergrad)", "RESPIREE PTE. LTD.", "Healthcare, Biomedical & Pharma", "internship", "https://www.mycareersfuture.gov.sg/job/others/regulatory-affairs-quality-assurance-intern-respiree-e4882584f17887b7394cd110fd814493", "28 May 2026"],
  ["Intern, Communications & Marketing (Social Media & Storytelling)", "HABITAT FOR HUMANITY SINGAPORE LTD", "Social Services, Non-Profit & Community", "internship", "https://www.mycareersfuture.gov.sg/job/design/intern-communications-marketing-habitat-humanity-singapore-5ec051aaeb89685ce494eaff761a365c", "19 Jun 2026"],
  ["Science Tutor [Pri/ Sec]", "SEARCH AVENUE PRIVATE LIMITED", "Science, Research & Academia", "first-job", "https://www.mycareersfuture.gov.sg/job/education-training/science-tutor-pri-sec-search-avenue-1efdbdb9321c1dc9ff14728cef09f503", "27 Jun 2026"],
  ["Hotel Bell Attendant [Central]", "SEARCH AVENUE PRIVATE LIMITED", "Hospitality, Tourism & Events", "first-job", "https://www.mycareersfuture.gov.sg/job/customer-service/hotel-bell-attendant-central-search-avenue-2b339b56bf12077f9a855bcc42a32878", "27 Jun 2026"],
  ["Customer Service Officer - Education Centre", "SEARCH AVENUE PRIVATE LIMITED", "Human Resources, Admin & Education", "first-job", "https://www.mycareersfuture.gov.sg/job/customer-service/customer-service-officer-education-centre-search-avenue-a80190362dbbb20e360982f37239df89", "27 Jun 2026"],
  ["Operations & Development Executive (with class 3 driving license)", "ZOPPPO PTE. LTD.", "Supply Chain, Logistics & Operations", "first-job", "https://www.mycareersfuture.gov.sg/job/general-work/operations-development-executive-zopppo-e44aaebcb7b34cac06f6f3517d57891e", "27 Jun 2026"],
  ["Entry Level Marketing Trainee (Personal Development + Travel Opportunities)", "ROYAL ORG PTE. LTD.", "Marketing, Sales & Business", "first-job", "https://www.mycareersfuture.gov.sg/job/marketing/entry-level-marketing-trainee-royal-org-ea4fd80db29eb5c5456d490aa6301823", "27 Jun 2026"],
  ["Air Cargo Operations Executive [Entry Level / Shift Work] - WCAN", "WECRUIT PTE. LTD.", "Maritime, Aviation & Transport", "first-job", "https://www.mycareersfuture.gov.sg/job/logistics/air-cargo-operations-executive-entry-level-shift-work-wcan-wecruit-37c0578eab474b6ed24289cd18ef6f0f", "26 Jun 2026"],
  ["Customer Engineer (New College Graduates Hires)", "APPLIED MATERIALS SOUTH EAST ASIA PTE. LTD.", "Engineering, Semiconductor & Manufacturing", "first-job", "https://www.mycareersfuture.gov.sg/job/engineering/customer-engineer-applied-materials-south-east-asia-1b6fb16d64710f6e3069768b361dc0be", "26 Jun 2026"],
  ["Audit Associate / Audit Senior #79283", "ANRADUS PTE. LTD.", "Banking, Finance, Insurance & Accounting", "first-job", "https://www.mycareersfuture.gov.sg/job/accounting/audit-associate-audit-senior-79283-anradus-c1b21d192a92a32e95d3c536d846ae9a", "26 Jun 2026"],
  ["Project coordinator", "GREATLINK CONTRACT PTE. LTD.", "Built Environment, Real Estate & Facilities", "first-job", "https://www.mycareersfuture.gov.sg/job/building-construction/project-coordinator-greatlink-contract-3f44d1e8c5a1d6d195db5181aaeca890", "26 Jun 2026"],
  ["Guest Services Officer", "TPC HOTEL PTE. LTD.", "Hospitality, Tourism & Events", "first-job", "https://www.mycareersfuture.gov.sg/job/hospitality/guest-services-officer-tpc-hotel-3dc543d5380d3f9556f07c3eee792418", "26 Jun 2026"],
  ["Service Engineer (Electro-Mechanical Equipment) #78111", "ANRADUS PTE. LTD.", "Engineering, Semiconductor & Manufacturing", "first-job", "https://www.mycareersfuture.gov.sg/job/engineering/service-engineer-78111-anradus-5d6902c0ec9e285eb2b3e3106438da46", "26 Jun 2026"],
  ["Customer Service Officer (Non-sales)", "D L RESOURCES PTE LTD", "Banking, Finance, Insurance & Accounting", "first-job", "https://www.mycareersfuture.gov.sg/job/banking-finance/customer-service-officer-d-l-resources-adaa4154a9140e11d9b410d948bb6411", "25 Jun 2026"],
  ["Admin/HR Executive", "SKYLIGHT ELECTRICAL ENGINEERING PTE. LTD.", "Human Resources, Admin & Education", "first-job", "https://www.mycareersfuture.gov.sg/job/admin/adminhr-executive-skylight-electrical-engineering-88adf05b53e6cdb1ff5aea2aaf2f9ca5", "24 Jun 2026"],
  ["Data & AI Analyst", "LINK 2 LINK ASIA PACIFIC PTE. LTD.", "Technology, AI & Data", "first-job", "https://www.mycareersfuture.gov.sg/job/information-technology/data-ai-analyst-link-2-link-asia-pacific-9784b9f636b85f4a27074014e94a1940", "18 Jun 2026"],
  ["Junior Data Analyst", "A. MGR CO. PTE. LTD.", "Technology, AI & Data", "first-job", "https://www.mycareersfuture.gov.sg/job/accounting/junior-data-analyst-a-mgr-cf64c5171b8bb742913012ee4cf13290", "15 Jun 2026"],
  ["Research Assistant (Social Service) - JL", "APBA TG HUMAN RESOURCE PTE. LTD.", "Social Services, Non-Profit & Community", "first-job", "https://www.mycareersfuture.gov.sg/job/admin/research-assistant-jl-apba-tg-human-resource-22b7d738b96338367848a6dd2452e714", "15 Jun 2026"],
  ["Research Assistant - Pharmacology (PC2)", "CHUGAI PHARMABODY RESEARCH PTE. LTD.", "Science, Research & Academia", "first-job", "https://www.mycareersfuture.gov.sg/job/sciences/research-assistant-pharmacology-chugai-pharmabody-research-4741b5ff8c7bd30f4a1c40baa47a6ed5", "9 Jun 2026"],
  ["Merchandising / Category Support Executive", "ELEVON CONSULTING PTE. LTD.", "Retail, FMCG & E-Commerce", "first-job", "https://www.mycareersfuture.gov.sg/job/purchasing/merchandising-category-support-executive-elevon-consulting-89f03ab9ac80426e6dbff1b92fcf0e79", "23 Jun 2026"],
  ["Technical Writer (HTML5 / Fresh Graduate is Welcome / US MNC)", "WANCO MANPOWER PTE LTD", "Design, Media & Communications", "first-job", "https://www.mycareersfuture.gov.sg/job/engineering/technical-writer-wanco-manpower-deaced81b6a06b9b9eaa40c69dbe4570", "22 Jun 2026"],
  ["Youth Specialist (Residential)", "BOYS' TOWN", "Social Services, Non-Profit & Community", "first-job", "https://www.mycareersfuture.gov.sg/job/social-services/youth-specialist-boys-town-aae95d961635bae253bac00dbb36e4da", "22 Jun 2026"],
].map(([title, company, industry, stage, url, posted]) => ({
  title,
  company,
  industry,
  stage,
  source: "MyCareersFuture",
  checked: "27 Jun 2026",
  posted,
  url,
}));

function unique(values) {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b));
}

function populateSelect(select, values, placeholder) {
  if (!select) {
    return;
  }

  select.innerHTML = `<option value="">${placeholder}</option>${values.map((value) => `<option>${value}</option>`).join("")}`;
}

function rolesForIndustry(industry, stage = "") {
  return unique(
    targetData
      .filter((item) => (!industry || item.industry === industry) && (!stage || item.stage === stage))
      .map((item) => item.role)
  );
}

function liveSearchUrl(role, stage = "internship") {
  if (stage === "first-job") {
    const query = encodeURIComponent(`${role} fresh graduate entry level`);
    return `https://www.mycareersfuture.gov.sg/search?employmentType=Full%20Time&page=0&positionLevels=Fresh%2Fentry%20level&search=${query}&sortBy=new_posting_date`;
  }

  const query = encodeURIComponent(role.replace(/\bInternship\b/i, "Intern"));
  return `https://www.mycareersfuture.gov.sg/search?employmentType=Internship%2FAttachment&page=0&search=${query}&sortBy=new_posting_date`;
}

function prefillOpportunityRequest(role, stage = "internship") {
  const targetPath = document.querySelector("#target-path");
  const requestStage = document.querySelector("#request-stage");

  if (targetPath) {
    targetPath.value = role;
  }

  if (requestStage) {
    requestStage.value = stage === "first-job"
      ? "Fresh graduate applying for first job"
      : "Current student applying for internships";
  }

  document.querySelector("#request")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function setupVerifiedOpenings() {
  const openingGrid = document.querySelector("#opening-grid");
  const openingStage = document.querySelector("#opening-stage");
  const openingInterest = document.querySelector("#opening-interest");
  const openingChoice = document.querySelector("#opening-choice");
  const openingLiveSearch = document.querySelector("#opening-live-search");
  const openingEmpty = document.querySelector("#opening-empty");

  if (!openingGrid || !openingStage || !openingInterest || !openingChoice || !openingEmpty) {
    return;
  }

  function setSelectOptions(select, options, placeholder, labelFor = (option) => option) {
    select.innerHTML = "";

    const placeholderOption = document.createElement("option");
    placeholderOption.value = "";
    placeholderOption.textContent = placeholder;
    select.append(placeholderOption);

    options.forEach((option) => {
      const optionEl = document.createElement("option");
      optionEl.value = option.value ?? option;
      optionEl.textContent = labelFor(option);
      select.append(optionEl);
    });
  }

  function currentStageOpenings() {
    return featuredOpenings.filter((opening) => opening.stage === openingStage.value);
  }

  function currentInterestOpenings() {
    return currentStageOpenings().filter((opening) => opening.industry === openingInterest.value);
  }

  function selectedOpening() {
    if (!openingChoice.value) {
      return null;
    }

    const opening = featuredOpenings[Number(openingChoice.value)];

    if (!opening || opening.stage !== openingStage.value || opening.industry !== openingInterest.value) {
      return null;
    }

    return opening;
  }

  function updateLiveSearch(opening = null) {
    const stage = openingStage.value || "internship";
    const query = opening?.title || openingInterest.value || (stage === "first-job" ? "graduate" : "intern");

    if (openingLiveSearch) {
      openingLiveSearch.href = liveSearchUrl(query, stage);
      openingLiveSearch.textContent = stage === "first-job"
        ? "Open graduate-only live search"
        : "Open internship-only live search";
    }
  }

  function updateInterestOptions() {
    setSelectOptions(
      openingInterest,
      unique(currentStageOpenings().map((opening) => opening.industry)),
      "Select interest area"
    );
  }

  function updateOpeningOptions() {
    const options = currentInterestOpenings().map((opening) => ({
      value: featuredOpenings.indexOf(opening),
      label: `${opening.title} - ${opening.company}`,
    }));

    setSelectOptions(openingChoice, options, "Select an opening", (option) => option.label);
  }

  function renderOpenings() {
    const opening = selectedOpening();

    updateLiveSearch(opening);

    if (!opening) {
      openingGrid.innerHTML = "";
      openingEmpty.hidden = false;
      return;
    }

    openingEmpty.hidden = true;
    openingGrid.innerHTML = `
      <article class="opening-card">
        <span>${opening.industry}</span>
        <h3>${opening.title}</h3>
        <p>${opening.company}</p>
        <p>${opening.stage === "first-job" ? "Graduate / entry-level job" : "Internship opening"} posted ${opening.posted} and checked ${opening.checked} via ${opening.source}.</p>
        <div class="listing-actions">
          <a class="text-button" href="${opening.url}" target="_blank" rel="noreferrer">View opening</a>
          <button class="text-button use-opening" data-stage="${opening.stage}" data-role="${opening.title}" type="button">Use this opening</button>
          <a class="button primary" href="#request">Request help</a>
        </div>
      </article>
    `;
  }

  openingGrid.addEventListener("click", (event) => {
    const button = event.target.closest(".use-opening");

    if (!button) {
      return;
    }

    prefillOpportunityRequest(button.dataset.role, button.dataset.stage);
  });

  openingStage.addEventListener("change", () => {
    updateInterestOptions();
    updateOpeningOptions();
    renderOpenings();
  });

  openingInterest.addEventListener("change", () => {
    updateOpeningOptions();
    renderOpenings();
  });

  openingChoice.addEventListener("change", renderOpenings);

  updateInterestOptions();
  updateOpeningOptions();
  renderOpenings();
}

function setupFinder() {
  const finderStage = document.querySelector("#finder-stage");
  const finderIndustry = document.querySelector("#finder-industry");
  const finderRole = document.querySelector("#finder-role");
  const listingGrid = document.querySelector("#listing-grid");
  const resultsEmpty = document.querySelector("#results-empty");
  const marketCount = document.querySelector("#market-count");
  const marketUpdatedEl = document.querySelector("#market-updated");

  if (!finderStage || !finderIndustry || !finderRole || !listingGrid || !resultsEmpty) {
    return;
  }

  if (marketCount) {
    marketCount.textContent = `${targetData.length} Singapore internship and first-job targets`;
  }

  if (marketUpdatedEl) {
    marketUpdatedEl.textContent = `Daily refresh marker: ${marketUpdated}. Live source links open current MyCareersFuture searches.`;
  }

  function updateFinderRoles() {
    populateSelect(finderRole, rolesForIndustry(finderIndustry.value, finderStage.value), "All roles in this industry");
  }

  function filteredTargets() {
    if (!finderStage.value || !finderIndustry.value) {
      return [];
    }

    return targetData.filter(
      (item) => item.stage === finderStage.value
        && item.industry === finderIndustry.value
        && (!finderRole.value || item.role === finderRole.value)
    );
  }

  function renderListings() {
    const targets = filteredTargets();

    if (!targets.length) {
      listingGrid.innerHTML = "";
      resultsEmpty.hidden = false;
      return;
    }

    resultsEmpty.hidden = true;
    listingGrid.innerHTML = targets
      .map(
        (item) => `
          <article class="listing-card">
            <span>${item.industry}</span>
            <h3>${item.role}</h3>
            <p>${item.stage === "first-job" ? "Fresh graduate first-job" : "Internship"} target. CareerUpgrade Kit reviews resume, LinkedIn, cover-letter angle, and interview story against this role.</p>
            <p><strong>Evidence to prepare:</strong> ${item.evidence}.</p>
            <div class="listing-actions">
              <button class="text-button use-target" data-stage="${item.stage}" data-role="${item.role}" type="button">Use this target</button>
              <a class="text-button" href="${liveSearchUrl(item.role, item.stage)}" target="_blank" rel="noreferrer">View live search</a>
              <a class="button primary" href="#request">Request help</a>
            </div>
          </article>
        `
      )
      .join("");
  }

  populateSelect(finderIndustry, unique(targetData.map((item) => item.industry)), "Select industry");

  finderStage.addEventListener("change", () => {
    updateFinderRoles();
    renderListings();
  });

  finderIndustry.addEventListener("change", () => {
    updateFinderRoles();
    renderListings();
  });

  finderRole.addEventListener("change", renderListings);

  listingGrid.addEventListener("click", (event) => {
    const button = event.target.closest(".use-target");

    if (!button) {
      return;
    }

    prefillOpportunityRequest(button.dataset.role, button.dataset.stage);
  });

  renderListings();
}

setupFinder();
setupVerifiedOpenings();

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
      "Track CareerUpgradeKit apply-link clicks and target roles.",
      "Record resume version, follow-up status, and interview stage.",
      "Reduce random applications without asking customers to manually report every job.",
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
const trackedApplyStorageKey = "careerupgradekit_apply_link_clicks";
const paymentOptionsUrl = "https://careerupgradekit.com/payment.html";

function updateFormRedirect(leadForm) {
  const nextField = leadForm.elements._next;
  const selectedHelp = leadForm.elements.help_needed?.value || "";
  const config = window.CUK_STRIPE_CONFIG || {};

  if (!nextField) {
    return;
  }

  if (selectedHelp.toLowerCase().includes("full application kit") && config.fullKitPaymentLink) {
    nextField.value = config.fullKitPaymentLink;
    return;
  }

  if (selectedHelp.toLowerCase().includes("starter career review") && config.starterPaymentLink) {
    nextField.value = config.starterPaymentLink;
    return;
  }

  nextField.value = paymentOptionsUrl;
}

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

    updateFormRedirect(leadForm);
    syncTrackedApplyFields();
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
  const config = window.CUK_STRIPE_CONFIG || {};
  const paymentButtons = [
    {
      button: document.querySelector("#stripe-starter-pay-button") || document.querySelector("#stripe-pay-button"),
      note: document.querySelector("#stripe-starter-setup-note") || document.querySelector("#stripe-setup-note"),
      paymentLink: config.starterPaymentLink || config.paymentLink,
      amountLabel: "SGD 9.90",
    },
    {
      button: document.querySelector("#stripe-full-kit-pay-button"),
      note: document.querySelector("#stripe-full-kit-setup-note"),
      paymentLink: config.fullKitPaymentLink,
      amountLabel: "SGD 19.90",
    },
  ];

  paymentButtons.forEach(({ button, note, paymentLink, amountLabel }) => {
    if (!button) {
      return;
    }

    const stripeLink = (paymentLink || "").trim();

    if (stripeLink && stripeLink.startsWith("https://buy.stripe.com/")) {
      button.href = stripeLink;
      button.textContent = `Pay ${amountLabel} With Stripe`;
      button.classList.remove("disabled");
      button.removeAttribute("aria-disabled");

      if (note) {
        note.textContent = "After payment, Stripe will show the next step for submitting your materials.";
      }
    } else {
      button.addEventListener("click", (event) => event.preventDefault());
    }
  });
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

const marketUpdated = "16 Jul 2026";

const featuredOpenings = [
  ["Partnerships Intern", "ANYWHEEL PTE. LTD.", "Marketing, Sales & Business", "internship", "https://www.mycareersfuture.gov.sg/job/marketing/partnerships-intern-anywheel-792d39fe8bb9dec90a35ab5e38c7f0b5", "15 Jul 2026"],
  ["Marketing Intern", "KINO BIOTECH PTE. LTD.", "Marketing, Sales & Business", "internship", "https://www.mycareersfuture.gov.sg/job/marketing/marketing-intern-kino-biotech-ca6b08aa636d462aca5baa285200d36e", "15 Jul 2026"],
  ["AI Intern", "ADDCEL ENGINEERING PTE. LTD.", "Technology, AI & Data", "internship", "https://www.mycareersfuture.gov.sg/job/information-technology/ai-intern-addcel-engineering-897416aaee8a7791c7e122afb71a568d", "15 Jul 2026"],
  ["Business Operations Intern (Education Business)", "MINDFLEX EDUCATION PTE. LTD.", "Supply Chain, Logistics & Operations", "internship", "https://www.mycareersfuture.gov.sg/job/admin/business-operations-intern-mindflex-education-6384b867e51dca369508e0c10ab48e2e", "15 Jul 2026"],
  ["Surgical Veterinary Intern", "BEECROFT ANIMAL SPECIALIST SERVICES PTE. LTD.", "Healthcare, Biomedical & Pharma", "internship", "https://www.mycareersfuture.gov.sg/job/environment/surgical-veterinary-intern-beecroft-animal-specialist-services-6eb8f577ed3145ec0b0d369d195823ed", "15 Jul 2026"],
  ["IoT Engineering Intern", "BIOLOGIC TECHNIK PRIVATE LIMITED", "Engineering, Semiconductor & Manufacturing", "internship", "https://www.mycareersfuture.gov.sg/job/engineering/iot-engineering-intern-biologic-technik-6f72b476016ce360d32af8c83cbd6e35", "15 Jul 2026"],
  ["HR & Corporate Branding Intern", "RECRUIT EXPRESS PTE LTD", "Professional Services, Consulting & Advisory", "internship", "https://www.mycareersfuture.gov.sg/job/consulting/hr-corporate-branding-intern-recruit-express-60713360acdf623f43b822fc10088855", "15 Jul 2026"],
  ["Intern, Finance Associate", "HUMMINGBIRD BIOSCIENCE PTE. LTD.", "Banking, Finance, Insurance & Accounting", "internship", "https://www.mycareersfuture.gov.sg/job/accounting/intern-finance-associate-hummingbird-bioscience-cd00b23aabc6ebbb148f2c3ea0680fd1", "14 Jul 2026"],
  ["People Intern (HR)", "MIGHTY JAXX INTERNATIONAL PTE. LTD.", "Human Resources, Admin & Education", "internship", "https://www.mycareersfuture.gov.sg/job/human-resources/people-intern-mighty-jaxx-international-a74c907a73c136bf8ce436d3b3044dff", "14 Jul 2026"],
  ["Finance Intern (Aug to Dec 26)", "HONG YE GROUP PTE. LTD.", "Banking, Finance, Insurance & Accounting", "internship", "https://www.mycareersfuture.gov.sg/job/accounting/finance-intern-hong-ye-group-69e39ec5fded3ae187bb02d4f4399fca", "13 Jul 2026"],
  ["Operations Intern", "CINTRA CONSULTANCY PTE. LTD.", "Supply Chain, Logistics & Operations", "internship", "https://www.mycareersfuture.gov.sg/job/admin/operations-intern-cintra-consultancy-d22856856f001fbdf7da641f0cac97ef", "13 Jul 2026"],
  ["Events Intern", "ONE RQ PTE. LTD.", "Hospitality, Tourism & Events", "internship", "https://www.mycareersfuture.gov.sg/job/events/events-intern-one-rq-5f577442bdf77d315d24adc0470d9bf5", "7 Jul 2026"],
  ["Intern, Communications", "ASIA-EUROPE FOUNDATION", "Design, Media & Communications", "internship", "https://www.mycareersfuture.gov.sg/job/advertising/intern-communications-asia-europe-foundation-d34d6f2d4dcee717cd17d7268c771262", "6 Jul 2026"],
  ["Events Management Intern (Part-time)", "JK & REAL CORPORATION PRIVATE LIMITED", "Hospitality, Tourism & Events", "internship", "https://www.mycareersfuture.gov.sg/job/events/events-management-intern-jk-real-corporation-59bce8c16445999710049683c4578841", "6 Jul 2026"],
  ["Technical Services Analyst", "EPIC HEALTHCARE SYSTEMS PTE. LTD.", "Technology, AI & Data", "first-job", "https://www.mycareersfuture.gov.sg/job/healthcare/technical-services-analyst-epic-healthcare-systems-3b45ff58bda627561393b6ec6612ae2f", "16 Jul 2026"],
  ["Admin & Sales Coordinator", "PLETHUNO MARKETING", "Marketing, Sales & Business", "first-job", "https://www.mycareersfuture.gov.sg/job/sales/admin-sales-coordinator-plethuno-marketing-d9c9220c724743ce20f60b357856094c", "16 Jul 2026"],
  ["Process Engineer (Entry Level)", "RECRUITPEDIA PTE. LTD.", "Engineering, Semiconductor & Manufacturing", "first-job", "https://www.mycareersfuture.gov.sg/job/engineering/process-engineer-recruitpedia-fac4bda014d72a7ca72f0e05d24c5641", "15 Jul 2026"],
  ["Site Engineer x 5 (Entry Level)", "RECRUIT EXPERT PTE. LTD.", "Built Environment, Real Estate & Facilities", "first-job", "https://www.mycareersfuture.gov.sg/job/building-construction/site-engineer-x-5-recruit-expert-618bc44212b094a4dd6d81cbf2477565", "15 Jul 2026"],
  ["Finance Analyst (1 Year Contract)", "RECRUITPEDIA PTE. LTD.", "Banking, Finance, Insurance & Accounting", "first-job", "https://www.mycareersfuture.gov.sg/job/accounting/finance-analyst-recruitpedia-3e3936d8d230cb536245dafcec66b106", "15 Jul 2026"],
  ["Accounts Assistant", "LI JIA PROPERTY PTE. LTD.", "Banking, Finance, Insurance & Accounting", "first-job", "https://www.mycareersfuture.gov.sg/job/accounting/accounts-assistant-li-jia-property-8edd847b77ca53818a7c7f1df59db08b", "15 Jul 2026"],
  ["HR Recruitment Coordinator (Central, Entry Level)", "RECRUIT EXPRESS SERVICES PTE. LTD.", "Professional Services, Consulting & Advisory", "first-job", "https://www.mycareersfuture.gov.sg/job/consulting/hr-recruitment-coordinator-recruit-express-services-e2054ed96f841091cb8e0c32578fb7e8", "15 Jul 2026"],
  ["Clinical Research Assistant (2-year) - Nursing #HHL", "RECRUIT EXPRESS PTE LTD", "Healthcare, Biomedical & Pharma", "first-job", "https://www.mycareersfuture.gov.sg/job/sciences/clinical-research-assistant-nursing-hhl-recruit-express-0c36127451793783de1cba03d6f45f44", "15 Jul 2026"],
  ["Research Assistant/Fellow, Faculty of Dentistry", "NATIONAL UNIVERSITY OF SINGAPORE", "Science, Research & Academia", "first-job", "https://www.mycareersfuture.gov.sg/job/sciences/research-assistantfellow-faculty-dentistry-national-university-singapore-8de2d9bb33e02d60934a263b64f8f438", "15 Jul 2026"],
  ["Inside Sales Coordinator #78315", "ANRADUS PTE. LTD.", "Marketing, Sales & Business", "first-job", "https://www.mycareersfuture.gov.sg/job/admin/inside-sales-coordinator-78315-anradus-cf47c3584515bd00bfb50d89b0dd95b1", "15 Jul 2026"],
  ["Sales Coordinator (Marine)", "DIRECT SEARCH ASIA PTE. LTD.", "Maritime, Aviation & Transport", "first-job", "https://www.mycareersfuture.gov.sg/job/logistics/sales-coordinator-direct-search-asia-a31eea845f5ed6345cf239c01690ce58", "15 Jul 2026"],
  ["Air Export Customer Service Executive [Entry Level / Flexible Timing] - WCAN", "WECRUIT PTE. LTD.", "Maritime, Aviation & Transport", "first-job", "https://www.mycareersfuture.gov.sg/job/logistics/air-export-customer-service-executive-entry-level-flexible-timing-wcan-wecruit-943718b7012889ff4f38716562929521", "15 Jul 2026"],
  ["*entry level* HR Assistant #ESY", "RECRUIT EXPRESS PTE LTD", "Human Resources, Admin & Education", "first-job", "https://www.mycareersfuture.gov.sg/job/human-resources/entry-level-hr-assistant-esy-recruit-express-183c79be06a31f787e2f8ad12ad8c511", "13 Jul 2026"],
  ["Graduate / Associate Technical Business Analyst (Innovation)", "GUY CARPENTER & COMPANY PRIVATE LIMITED", "Professional Services, Consulting & Advisory", "first-job", "https://www.mycareersfuture.gov.sg/job/consulting/graduate-associate-technical-business-analyst-guy-carpenter-company-c0e0fc4de87a6c7b39b86f66a25f193f", "8 Jul 2026"],
  ["Regional Strategy and Operations Analyst - Regional Logistics (2026 Graduate)", "SHOPEE SINGAPORE PRIVATE LIMITED", "Supply Chain, Logistics & Operations", "first-job", "https://www.mycareersfuture.gov.sg/job/information-technology/regional-strategy-operations-analyst-regional-logistics-shopee-singapore-2f50c30476240658912823e257d6a7e3", "25 Jun 2026"],
].map(([title, company, industry, stage, url, posted]) => ({
  title,
  company,
  industry,
  stage,
  source: "MyCareersFuture",
  checked: "16 Jul 2026",
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

function trackedApplyClicks() {
  try {
    const parsed = JSON.parse(localStorage.getItem(trackedApplyStorageKey) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveTrackedApplyClick(link) {
  const item = {
    role: link.dataset.role || "Unknown role",
    company: link.dataset.company || "",
    industry: link.dataset.industry || "",
    stage: link.dataset.stage || "",
    source: link.dataset.source || "CareerUpgradeKit",
    url: link.href,
    clicked_at: new Date().toISOString(),
  };
  const nextItems = [item, ...trackedApplyClicks()].slice(0, 10);

  try {
    localStorage.setItem(trackedApplyStorageKey, JSON.stringify(nextItems));
  } catch {
    return;
  }

  syncTrackedApplyFields();
}

function syncTrackedApplyFields() {
  const clicks = trackedApplyClicks();
  const summary = clicks
    .map((item) => `${item.clicked_at} | ${item.role}${item.company ? ` | ${item.company}` : ""} | ${item.url}`)
    .join("\n");
  const latest = clicks[0]
    ? `${clicks[0].role}${clicks[0].company ? ` | ${clicks[0].company}` : ""} | ${clicks[0].url}`
    : "";

  document.querySelectorAll('input[name="tracked_application_links"]').forEach((field) => {
    field.value = summary;
  });
  document.querySelectorAll('input[name="latest_tracked_application_link"]').forEach((field) => {
    field.value = latest;
  });
}

document.addEventListener("click", (event) => {
  const link = event.target.closest("a[data-apply-track]");

  if (!link) {
    return;
  }

  saveTrackedApplyClick(link);
});

syncTrackedApplyFields();

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
        <p>${opening.stage === "first-job" ? "Graduate / entry-level job" : "Internship opening"} listed ${opening.posted} and checked ${opening.checked} via ${opening.source}.</p>
        <div class="listing-actions">
          <a class="text-button" href="${opening.url}" target="_blank" rel="noreferrer" data-apply-track="verified-opening" data-role="${opening.title}" data-company="${opening.company}" data-industry="${opening.industry}" data-stage="${opening.stage}" data-source="${opening.source}">Open tracked apply link</a>
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
              <a class="text-button" href="${liveSearchUrl(item.role, item.stage)}" target="_blank" rel="noreferrer" data-apply-track="live-search" data-role="${item.role}" data-industry="${item.industry}" data-stage="${item.stage}" data-source="MyCareersFuture search">Open tracked live search</a>
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

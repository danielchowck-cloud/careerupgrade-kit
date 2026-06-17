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

const marketUpdated = "18 Jun 2026";

const featuredOpenings = [
  ["Administrative Intern/Staff", "MORI HAMADA SINGAPORE LLP", "Human Resources, Admin & Education", "internship", "https://www.mycareersfuture.gov.sg/job/admin/administrative-internstaff-mori-hamada-singapore-2b69838f6635486186086eaa2d9d5baf", "17 Jun 2026"],
  ["Editorial Intern", "VANILLA LUXURY PTE. LTD.", "Design, Media & Communications", "internship", "https://www.mycareersfuture.gov.sg/job/advertising/editorial-intern-vanilla-luxury-14588e9a668986b3e898c5c3dbe81724", "17 Jun 2026"],
  ["Content Creation Intern", "BLIND MICE MEDIA PTE. LTD.", "Design, Media & Communications", "internship", "https://www.mycareersfuture.gov.sg/job/advertising/content-creation-intern-blind-mice-media-77a4cd3ab5f4b11cf0021fd0469ab005", "17 Jun 2026"],
  ["Business Development Intern", "BLIND MICE MEDIA PTE. LTD.", "Marketing, Sales & Business", "internship", "https://www.mycareersfuture.gov.sg/job/general-management/business-development-intern-blind-mice-media-84597f05aba5ed06f7967ee18ed4b698", "17 Jun 2026"],
  ["Marketing Intern", "KINO BIOTECH PTE. LTD.", "Healthcare, Biomedical & Pharma", "internship", "https://www.mycareersfuture.gov.sg/job/marketing/marketing-intern-kino-biotech-7c86111d1d44dfc7f00fd500ef976e71", "17 Jun 2026"],
  ["Intern, Events & Partnerships", "SINGAPORE RED CROSS SOCIETY", "Social Services, Non-Profit & Community", "internship", "https://www.mycareersfuture.gov.sg/job/customer-service/intern-events-partnerships-singapore-red-cross-society-8e0baacbddca2796a02feef9b0f082e3", "17 Jun 2026"],
  ["Sales Intern", "AIKIT PTE. LTD.", "Retail, FMCG & E-Commerce", "internship", "https://www.mycareersfuture.gov.sg/job/sales/sales-intern-aikit-78a547d2514cffc3c9e107439e1a9a40", "17 Jun 2026"],
  ["Marketing Intern", "AIKIT PTE. LTD.", "Food, Agritech & Consumer Services", "internship", "https://www.mycareersfuture.gov.sg/job/marketing/marketing-intern-aikit-800624d6461eafa6886ddd81ab0a7e4a", "17 Jun 2026"],
  ["Business Operations Intern (Education Business)", "MINDFLEX EDUCATION PTE. LTD.", "Human Resources, Admin & Education", "internship", "https://www.mycareersfuture.gov.sg/job/admin/business-operations-intern-mindflex-education-308ae8ce7e6ec50476079f55dd0906ec", "17 Jun 2026"],
  ["Accounting Intern (Audit Support)", "AEGIS BUILDING & ENGINEERING PTE LTD", "Banking, Finance, Insurance & Accounting", "internship", "https://www.mycareersfuture.gov.sg/job/accounting/accounting-intern-aegis-building-engineering-ae01f5a33b2d664ae551988221593dbb", "17 Jun 2026"],
  ["Compliance Intern", "BRIGHT POINT CAPITAL PTE. LTD.", "Legal, Policy, Public Sector & ESG", "internship", "https://www.mycareersfuture.gov.sg/job/admin/compliance-intern-bright-point-capital-16c796e5c29ae434182b1473c94a0482", "17 Jun 2026"],
  ["Data Engineer Intern", "BRIGHT POINT CAPITAL PTE. LTD.", "Technology, AI & Data", "internship", "https://www.mycareersfuture.gov.sg/job/engineering/data-engineer-intern-bright-point-capital-1ffba858c5a07d5d1a502bf6b50aa37b", "17 Jun 2026"],
  ["HR Intern", "APPLIED MATERIALS SOUTH EAST ASIA PTE. LTD.", "Engineering, Semiconductor & Manufacturing", "internship", "https://www.mycareersfuture.gov.sg/job/human-resources/hr-intern-applied-materials-south-east-asia-7bba27a98f7005bc2818517d1e30f4e5", "17 Jun 2026"],
  ["IRCCT Commodities Intern (1 year)", "COMMERZBANK AKTIENGESELLSCHAFT", "Banking, Finance, Insurance & Accounting", "internship", "https://www.mycareersfuture.gov.sg/job/banking-finance/ircct-commodities-intern-commerzbank-aktiengesellschaft-919ed181de4a0e19a0cfab4379daa2a4", "17 Jun 2026"],
  ["Field Operations Intern (Robotics)", "KABAM PTE. LTD.", "Engineering, Semiconductor & Manufacturing", "internship", "https://www.mycareersfuture.gov.sg/job/engineering/field-operations-intern-kabam-eded0737dd5ca9145db4adaaa1f43b49", "17 Jun 2026"],
  ["Mechatronics Intern", "KABAM PTE. LTD.", "Technology, AI & Data", "internship", "https://www.mycareersfuture.gov.sg/job/information-technology/mechatronics-intern-kabam-94f380cef69e207ec9caa61aa678a2d0", "17 Jun 2026"],
  ["Marketing Communications Intern", "QUAICH PTE. LTD.", "Hospitality, Tourism & Events", "internship", "https://www.mycareersfuture.gov.sg/job/design/marketing-communications-intern-quaich-774e316fe7f77e5d3dd13fd2b7ac217c", "17 Jun 2026"],
  ["HR Intern", "NTUC FAIRPRICE CO-OPERATIVE LTD", "Retail, FMCG & E-Commerce", "internship", "https://www.mycareersfuture.gov.sg/job/human-resources/hr-intern-ntuc-fairprice-co-operative-00119f59fc04a583280b8daaadfbc13d", "17 Jun 2026"],
  ["Intern - Global Markets (6 months)", "HL BANK", "Banking, Finance, Insurance & Accounting", "internship", "https://www.mycareersfuture.gov.sg/job/banking-finance/intern-global-markets-hl-bank-a179bb786209264fb88cd42128545bf8", "17 Jun 2026"],
  ["Intern, Marketing (Blood Donor Programme)", "SINGAPORE RED CROSS SOCIETY", "Healthcare, Biomedical & Pharma", "internship", "https://www.mycareersfuture.gov.sg/job/marketing/intern-marketing-singapore-red-cross-society-4287e9c73e4a67fc789f771ad4715a60", "17 Jun 2026"],
  ["Intern, Partnerships", "SINGAPORE RED CROSS SOCIETY", "Social Services, Non-Profit & Community", "internship", "https://www.mycareersfuture.gov.sg/job/admin/intern-partnerships-singapore-red-cross-society-8d509a845e60ed6778ac8c48f5d04aa8", "17 Jun 2026"],
  ["Event Executive Interns (3/6/12 months)", "MAXHUNT RESOURCE PTE. LTD.", "Hospitality, Tourism & Events", "internship", "https://www.mycareersfuture.gov.sg/job/events/event-executive-interns-maxhunt-resource-b0134a49ee72a6505ae0850cfd3c31d1", "17 Jun 2026"],
  ["AI Digital Solutions Lifecycle Management Intern", "AI FOUNDRY PTE. LTD.", "Technology, AI & Data", "internship", "https://www.mycareersfuture.gov.sg/job/consulting/ai-digital-solutions-lifecycle-management-intern-ai-foundry-ea484f90b291dada6e99e0f76bdde282", "16 Jun 2026"],
  ["Machine Learning Engineer Intern (Computer Vision & AI) (August 2026)", "CYNAPSE PTE. LTD.", "Technology, AI & Data", "internship", "https://www.mycareersfuture.gov.sg/job/information-technology/machine-learning-engineer-intern-cynapse-ea1982f524ee35ba11927ddb57610011", "16 Jun 2026"],
  ["AI Research & Development Intern (August 2026)", "CYNAPSE PTE. LTD.", "Science, Research & Academia", "internship", "https://www.mycareersfuture.gov.sg/job/information-technology/ai-research-development-intern-cynapse-1457d7d441e32af2c41f0e1e121f78d3", "16 Jun 2026"],
  ["Digital Marketing Executive [PPA2-001-05]", "EQUE PTE. LTD.", "Marketing, Sales & Business", "first-job", "https://www.mycareersfuture.gov.sg/job/banking-finance/digital-marketing-executive-ppa2-001-05-eque-43848aa74fc28f93485a1d49f8b26560", "18 Jun 2026"],
  ["Financial Advisory Trainee [PPA2-001-05]", "EQUE PTE. LTD.", "Banking, Finance, Insurance & Accounting", "first-job", "https://www.mycareersfuture.gov.sg/job/banking-finance/financial-advisory-trainee-ppa2-001-05-eque-99127b4999aa23e43b1da74d8288a8cc", "18 Jun 2026"],
  ["Corporate Services Executive [PPA2-001-05]", "EQUE PTE. LTD.", "Professional Services, Consulting & Advisory", "first-job", "https://www.mycareersfuture.gov.sg/job/admin/corporate-services-executive-ppa2-001-05-eque-0cc2d56d3350a4e937c60cf5871eba8a", "18 Jun 2026"],
  ["Warehouse Associate", "SUPERWRAP PTE. LTD.", "Supply Chain, Logistics & Operations", "first-job", "https://www.mycareersfuture.gov.sg/job/logistics/warehouse-associate-superwrap-cca38084190ab1deac0b5dc3e48b0f55", "18 Jun 2026"],
  ["Marketing & Event Executive (Training Provided)", "STAR RECRUITER", "Hospitality, Tourism & Events", "first-job", "https://www.mycareersfuture.gov.sg/job/advertising/marketing-event-executive-star-recruiter-347c35eec7caf418a7df177867fcd469", "18 Jun 2026"],
  ["Data Advisory Analyst", "EYEOTA PTE. LTD.", "Technology, AI & Data", "first-job", "https://www.mycareersfuture.gov.sg/job/customer-service/data-advisory-analyst-eyeota-f12ccb1bf3e63a02ae7dec2cab1f4860", "17 Jun 2026"],
  ["Accounts Officer - Accounts Payable & Revenue Audit", "CONRAD SINGAPORE ORCHARD", "Banking, Finance, Insurance & Accounting", "first-job", "https://www.mycareersfuture.gov.sg/job/accounting/accounts-officer-%E2%80%93-accounts-payable-revenue-audit-conrad-singapore-orchard-e7aa59ddf496a10484466c0b7fdfa1f0", "17 Jun 2026"],
  ["Audit Associate", "ENROME ADVISORY PTE. LTD.", "Banking, Finance, Insurance & Accounting", "first-job", "https://www.mycareersfuture.gov.sg/job/accounting/audit-associate-enrome-advisory-5cd21bd0cfc4826da06ae95842b2f491", "15 Jun 2026"],
  ["Electrical Engineer (Fresh Graduate)", "WSP CONSULTANCY PTE. LTD.", "Engineering, Semiconductor & Manufacturing", "first-job", "https://www.mycareersfuture.gov.sg/job/engineering/electrical-engineer-wsp-consultancy-930cf3cbde113fec2315d819eefd84b7", "16 Jun 2026"],
  ["Graduate Engineer Trainee", "ASIA CORPORATE JET PTE. LTD.", "Maritime, Aviation & Transport", "first-job", "https://www.mycareersfuture.gov.sg/job/engineering/graduate-engineer-trainee-asia-corporate-jet-cd5be92777a85b553113cfc2439f4296", "15 Jun 2026"],
  ["Assistant Operations Executive", "TRU-MARINE PTE. LTD.", "Maritime, Aviation & Transport", "first-job", "https://www.mycareersfuture.gov.sg/job/admin/assistant-operations-executive-tru-marine-d20b39f38e9ec858e507595c52aeabbf", "17 Jun 2026"],
  ["Patient Service Associate / Clinic Operations Executive #HDC", "RECRUIT EXPRESS PTE LTD", "Healthcare, Biomedical & Pharma", "first-job", "https://www.mycareersfuture.gov.sg/job/admin/patient-service-associate-clinic-operations-executive-hdc-recruit-express-7e7587412b69cb4fc7149ab1dba25576", "17 Jun 2026"],
  ["Admin & Operations Executive (Immediate Hiring, Education Business)", "MINDFLEX EDUCATION PTE. LTD.", "Human Resources, Admin & Education", "first-job", "https://www.mycareersfuture.gov.sg/job/admin/admin-operations-executive-mindflex-education-1efece46e253595c00e5fa9848a197aa", "17 Jun 2026"],
  ["Operations Executive", "PHILLIP SECURITIES PTE LTD", "Banking, Finance, Insurance & Accounting", "first-job", "https://www.mycareersfuture.gov.sg/job/banking-finance/operations-executive-phillip-securities-4286b99a59240136f51ef2f5bc6ccdc9", "16 Jun 2026"],
  ["Human Resource Executive (Full Time)", "STRATIFY CONSULTING LLP", "Human Resources, Admin & Education", "first-job", "https://www.mycareersfuture.gov.sg/job/human-resources/human-resource-executive-stratify-consulting-1b3cf063df810af7613ee91ff2b55f14", "17 Jun 2026"],
  ["Clinical Trial Project Coordinator (Pharma MNC, Bukit Merah) UP 3.4K #HYT", "RECRUIT EXPRESS PTE LTD", "Healthcare, Biomedical & Pharma", "first-job", "https://www.mycareersfuture.gov.sg/job/admin/clinical-trial-project-coordinator-34k-hyt-recruit-express-1e5a2b7b2aab598ba925011fc26a8a4e", "17 Jun 2026"],
  ["Clinical Trial / Research Assistant (Pharma MNC, Bukit Merah) UP 3.4K #HYT", "RECRUIT EXPRESS PTE LTD", "Science, Research & Academia", "first-job", "https://www.mycareersfuture.gov.sg/job/admin/clinical-trial-research-assistant-34k-hyt-recruit-express-a3dd11b42e9e0111ba0ca52f6641c5fa", "17 Jun 2026"],
  ["Research Assistant (Social Service) - JL", "APBA TG HUMAN RESOURCE PTE. LTD.", "Social Services, Non-Profit & Community", "first-job", "https://www.mycareersfuture.gov.sg/job/admin/research-assistant-jl-apba-tg-human-resource-22b7d738b96338367848a6dd2452e714", "15 Jun 2026"],
  ["Legal Associate", "AGP LAW LLC", "Legal, Policy, Public Sector & ESG", "first-job", "https://www.mycareersfuture.gov.sg/job/legal/legal-associate-agp-law-ac065038014b37120a23a6fe47f416c8", "12 Jun 2026"],
  ["E-commerce Executive", "RISING DAY PTE. LTD.", "Retail, FMCG & E-Commerce", "first-job", "https://www.mycareersfuture.gov.sg/job/general-work/e-commerce-executive-rising-day-d235f862be4ac57b0160e44f2b2a4393", "17 Jun 2026"],
  ["Programme Executive (YDC)", "THE SALVATION ARMY", "Social Services, Non-Profit & Community", "first-job", "https://www.mycareersfuture.gov.sg/job/social-services/programme-executive-salvation-army-3ccbec8484d465cbddb736435878aba9", "17 Jun 2026"],
].map(([title, company, industry, stage, url, posted]) => ({
  title,
  company,
  industry,
  stage,
  source: "MyCareersFuture",
  checked: "18 Jun 2026",
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

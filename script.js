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

const marketUpdated = "11 Jun 2026";

const featuredOpenings = [
  ["Data Analyst Intern", "Lumens", "Technology, AI & Data", "internship", "https://www.mycareersfuture.gov.sg/job/design/data-analyst-intern-lumens-b08645f5c20da7600e43cac34d3943ee"],
  ["Data Analyst Intern", "PSA Marine", "Maritime, Aviation & Transport", "internship", "https://www.mycareersfuture.gov.sg/job/data-analyst-intern-psa-marine-966c1abd654da9373b31e452604d3de0"],
  ["AI Analyst Intern", "One Tech Stop", "Technology, AI & Data", "internship", "https://www.mycareersfuture.gov.sg/job/ai-analyst-intern-one-tech-stop-d32b86b85284b8ed93b219b8d32a3c8d"],
  ["Marketing Intern", "Heilo", "Marketing, Sales & Business", "internship", "https://www.mycareersfuture.gov.sg/job/marketing-intern-heilo-92e54edf1f509bf09e3accff57705297"],
  ["Corporate Finance Intern", "Soochow Singapore Capital Markets", "Banking, Finance, Insurance & Accounting", "internship", "https://www.mycareersfuture.gov.sg/job/corporate-finance-intern-soochow-singapore-capital-markets-efd22c085f2b5fe2c8c1b63332412ca3"],
  ["Software Engineering Intern", "Respiree", "Technology, AI & Data", "internship", "https://www.mycareersfuture.gov.sg/job/software-engineering-intern-respiree-f02b039184daf939e2de8924d7e68fab"],
  ["HR Intern", "Stamford American International School", "Human Resources, Admin & Education", "internship", "https://www.mycareersfuture.gov.sg/job/hr-intern-stamford-american-international-school-783619d7b49fcc50b8ddf237ef31e56f"],
  ["IoT Engineering Intern", "Biologic Technik", "Engineering, Semiconductor & Manufacturing", "internship", "https://www.mycareersfuture.gov.sg/job/iot-engineering-intern-biologic-technik-6f72b476016ce360d32af8c83cbd6e35"],
  ["Finance Intern", "Ace Ascentia", "Banking, Finance, Insurance & Accounting", "internship", "https://www.mycareersfuture.gov.sg/job/banking-finance/finance-intern-ace-ascentia-35e4e093b2f5c2e1d44e4e6ec29a02d8"],
  ["Electrical Engineering Intern", "China Railway Electrification Engineering Group", "Engineering, Semiconductor & Manufacturing", "internship", "https://www.mycareersfuture.gov.sg/job/electrical-engineering-intern-china-railway-electrification-engineering-group-co-54ddd17822c74415c4fb50af9942a82b"],
  ["Information Technology Intern", "HIGOGAME", "Technology, AI & Data", "internship", "https://www.mycareersfuture.gov.sg/job/information-technology/information-technology-intern-higogame-71e10ce33f2b655f40233070d58377ec"],
  ["Social Media Intern", "C. K. Tang", "Retail, FMCG & E-Commerce", "internship", "https://www.mycareersfuture.gov.sg/job/marketing/social-media-intern-ck-tang-0fbeacaad4bf2c5a3917b607cadb4536"],
  ["Intern, Sub-Branch", "Bank of China", "Banking, Finance, Insurance & Accounting", "internship", "https://www.mycareersfuture.gov.sg/job/intern-bank-china-708d8acd97e7e8bed0ebe32e740afd3c"],
  ["Business & Operations Intern", "Infinix Hospitality Management", "Hospitality, Tourism & Events", "internship", "https://www.mycareersfuture.gov.sg/job/others/business-operations-intern-infinix-hospitality-management-bf349ad5e7802049702a21b0ded82f97"],
  ["Product Marketing Design Intern", "Superstar Teacher", "Design, Media & Communications", "internship", "https://www.mycareersfuture.gov.sg/job/design/product-marketing-design-intern-superstar-teacher-ab862fb450a43fc0641346164e7b941b"],
  ["Research Intern", "GWS Living Art", "Science, Research & Academia", "internship", "https://www.mycareersfuture.gov.sg/job/design/research-intern-gws-living-art-1871b21d6b6d3598a1b37b86589898a3"],
  ["Creative Intern", "Hustle Institute", "Design, Media & Communications", "internship", "https://www.mycareersfuture.gov.sg/job/creative-intern-hustle-institute-12d1fb02f9d65a11ac64ce8b8954ed73"],
  ["Graphic Design Intern", "Republic Singapore Yacht Club", "Design, Media & Communications", "internship", "https://www.mycareersfuture.gov.sg/job/advertising/graphic-design-intern-republic-singapore-yacht-club-43871a0f282b710fa3fc52f1c55e68b5"],
  ["Sales and Marketing Intern", "AC P Computer Training & Consultancy", "Marketing, Sales & Business", "internship", "https://www.mycareersfuture.gov.sg/job/marketing/sales-marketing-intern-ac-p-computer-training-consultancy-61a3ed0a75795e03d136a09b06b93782"],
  ["Intern, Fashion Merchandiser / Merchandising", "Q Retail", "Retail, FMCG & E-Commerce", "internship", "https://www.mycareersfuture.gov.sg/job/customer-service/intern-fashion-merchandisermerchandising-q-retail-edb0e651f1954c4b9539423fecc92627"],
  ["Content Creator Intern", "Academy Video Productions", "Design, Media & Communications", "internship", "https://www.mycareersfuture.gov.sg/job/content-creator-intern-academy-video-productions-5607e6062293235b3664e6156c2e3ac0"],
  ["Fund Management Support Intern", "Galilee Investment Management", "Banking, Finance, Insurance & Accounting", "internship", "https://www.mycareersfuture.gov.sg/job/banking-finance/fund-management-support-intern-galilee-investment-management-76c4a01dae0c693cfbf74e37da5557af"],
  ["Finance / Accounting Intern", "Tanbury Consulting", "Banking, Finance, Insurance & Accounting", "internship", "https://www.mycareersfuture.gov.sg/job/financeaccounting-intern-tanbury-consulting-e453b166eb7f7464cf994dddfdc5f531"],
  ["Data and AI Engineering Intern", "TVS Motor Company Singapore Branch", "Technology, AI & Data", "internship", "https://www.mycareersfuture.gov.sg/job/data-ai-engineering-intern-tvs-motor-company-singapore-branch-4b87c3a83ecd49883baf2c466fc7c310"],
  ["Compliance Intern", "FOMO Pay", "Banking, Finance, Insurance & Accounting", "internship", "https://www.mycareersfuture.gov.sg/job/banking-finance/compliance-intern-fomo-pay-640ac25e26e5e6332bae40731eff23ea"],
  ["Technical Product & QA Intern", "ChainUp", "Technology, AI & Data", "internship", "https://www.mycareersfuture.gov.sg/job/information-technology/technical-product-qa-intern-chainup-e51f105894d6e786f60ac77334eb67a0"],
  ["Employer Engagement and Placements Intern", "Generation: You Employed Singapore", "Human Resources, Admin & Education", "internship", "https://www.mycareersfuture.gov.sg/job/human-resources/employer-engagement-placements-intern-generation-employed-singapore-84bb4b5395c125efae5996ea43b8e70f"],
  ["Sustainability Intern", "Bureau Veritas Singapore", "Energy, Utilities & Sustainability", "internship", "https://www.mycareersfuture.gov.sg/job/sustainability-intern-bureau-veritas-singapore-2bf4a35145d2df21b335a73cc08fd465"],
  ["Vessel Operator Intern", "Tongli Shipping", "Maritime, Aviation & Transport", "internship", "https://www.mycareersfuture.gov.sg/job/vessel-operator-intern-tongli-shipping-9fc0b3fb0e5d3440cad011c7d9b883fa"],
  ["Healthcare Business Development Intern", "Recruit Express", "Healthcare, Biomedical & Pharma", "internship", "https://www.mycareersfuture.gov.sg/job/healthcare-business-development-intern-hdc-recruit-express-5379d7cddaa88f739b135522685e2526"],
  ["Fresh Graduate Regional Sales Engineer", "Personnel Link Jobhub", "Marketing, Sales & Business", "first-job", "https://www.mycareersfuture.gov.sg/job/fresh-graduate-regional-sales-engineer-personnel-link-jobhub-06b8e7741216857aab0944f37d3d0779"],
  ["Software Engineer (Fresh Graduate)", "BlackScore", "Technology, AI & Data", "first-job", "https://www.mycareersfuture.gov.sg/job/information-technology/software-engineer-blackscore-05f609408597a69f1d4f1bdbf9d65590"],
  ["Software Engineer: C / C++ Development (New College Graduate)", "Applied Materials South East Asia", "Engineering, Semiconductor & Manufacturing", "first-job", "https://www.mycareersfuture.gov.sg/job/information-technology/software-engineer-c-c-development-applied-materials-south-east-asia-b0687dbc1417caf6a6ef9cbe830ded55"],
  ["Management Associate", "FNDR Headhunting", "Professional Services, Consulting & Advisory", "first-job", "https://www.mycareersfuture.gov.sg/job/education-training/management-associate-fndr-headhunting-44fe0f4de495d12ce2a807f264b531a3"],
  ["Procurement Ops Executive - Entry Level", "Sciente International", "Supply Chain, Logistics & Operations", "first-job", "https://www.mycareersfuture.gov.sg/job/banking-finance/procurement-ops-executive-entry-level-sciente-international-df19a2265b991093dbdfefb2a4534eeb"],
  ["Electrical Engineer (Fresh Graduates)", "Shinryo Corporation", "Built Environment, Real Estate & Facilities", "first-job", "https://www.mycareersfuture.gov.sg/job/electrical-engineer-shinryo-corporation-48602895209a2dbb7d374443d16aef88"],
  ["Mechanical Engineer (Fresh Graduates)", "Shinryo Corporation", "Engineering, Semiconductor & Manufacturing", "first-job", "https://www.mycareersfuture.gov.sg/job/mechanical-engineer-shinryo-corporation-caae1dbd68d41fd251aee20125191602"],
  ["Human Resource Executive (Entry Level)", "Recruit Express Services", "Human Resources, Admin & Education", "first-job", "https://www.mycareersfuture.gov.sg/job/consulting/human-resource-executive-recruit-express-services-522dab035d15d1615005404f5c891303"],
].map(([title, company, industry, stage, url]) => ({
  title,
  company,
  industry,
  stage,
  source: "MyCareersFuture",
  checked: "11 Jun 2026",
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
    return `https://www.mycareersfuture.gov.sg/search?employmentType=Full%20Time&page=0&search=${query}&sortBy=new_posting_date`;
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
        <p>${opening.stage === "first-job" ? "Graduate / entry-level job" : "Internship opening"} checked ${opening.checked} via ${opening.source}.</p>
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

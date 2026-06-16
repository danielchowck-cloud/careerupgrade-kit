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

const marketUpdated = "17 Jun 2026";

const featuredOpenings = [
  ["AI Digital Solutions Lifecycle Management Intern", "AI FOUNDRY PTE. LTD.", "Technology, AI & Data", "internship", "https://www.mycareersfuture.gov.sg/job/consulting/ai-digital-solutions-lifecycle-management-intern-ai-foundry-ea484f90b291dada6e99e0f76bdde282", "16 Jun 2026"],
  ["Project Management Officer (PMO) / Quality Assurance (QA) Intern", "CYNAPSE PTE. LTD.", "Technology, AI & Data", "internship", "https://www.mycareersfuture.gov.sg/job/information-technology/project-management-officer-quality-assurance-intern-cynapse-9a07398235708805c067849eb4b6d907", "16 Jun 2026"],
  ["Client Success & Engagement Intern", "FPT ASIA PACIFIC PTE. LTD.", "Technology, AI & Data", "internship", "https://www.mycareersfuture.gov.sg/job/information-technology/client-success-engagement-intern-fpt-asia-pacific-5136854c1bdb9f7d17612b658b4c1326", "16 Jun 2026"],
  ["Digital Marketing Intern | Branding & Engagement", "REVUP PROSERVICES PTE. LTD.", "Marketing, Sales & Business", "internship", "https://www.mycareersfuture.gov.sg/job/marketing/digital-marketing-intern-branding-engagement-revup-proservices-fc38edec6601de9243c5440ba5fd5e28", "16 Jun 2026"],
  ["Digital Marketing Intern | Social Media & Content Creation", "REVUP PROSERVICES PTE. LTD.", "Marketing, Sales & Business", "internship", "https://www.mycareersfuture.gov.sg/job/marketing/digital-marketing-intern-social-media-content-creation-revup-proservices-b811ea6c1038f5add01da6e60f8ba63a", "16 Jun 2026"],
  ["Marketing Communications Intern", "REVUP PROSERVICES PTE. LTD.", "Design, Media & Communications", "internship", "https://www.mycareersfuture.gov.sg/job/marketing/marketing-communications-intern-revup-proservices-09fd5e95aa274575f1126c938d001073", "16 Jun 2026"],
  ["Business Operations Intern (Education Business)", "MINDFLEX EDUCATION PTE. LTD.", "Human Resources, Admin & Education", "internship", "https://www.mycareersfuture.gov.sg/job/admin/business-operations-intern-mindflex-education-d429b42beb135c2216111c96e37fd9ac", "16 Jun 2026"],
  ["Legal Intern", "NIROZE IDROOS LLC", "Legal, Policy, Public Sector & ESG", "internship", "https://www.mycareersfuture.gov.sg/job/legal/legal-intern-niroze-idroos-a98b5340d34edd9e55f5696523981f69", "16 Jun 2026"],
  ["AI Research & Development Intern (August 2026)", "CYNAPSE PTE. LTD.", "Science, Research & Academia", "internship", "https://www.mycareersfuture.gov.sg/job/information-technology/ai-research-development-intern-cynapse-1457d7d441e32af2c41f0e1e121f78d3", "16 Jun 2026"],
  ["Data Analyst Intern", "REAL ESTATE ANALYTICS PTE. LTD.", "Technology, AI & Data", "internship", "https://www.mycareersfuture.gov.sg/job/information-technology/data-analyst-intern-real-estate-analytics-a49f60c3e01f9e66f990722bc9e07fc4", "15 Jun 2026"],
  ["Communications Intern (6 months)", "BECTON DICKINSON HOLDINGS PTE. LTD.", "Design, Media & Communications", "internship", "https://www.mycareersfuture.gov.sg/job/admin/communications-intern-becton-dickinson-holdings-226fcd74bbef6f5026a4fc17eca8e234", "15 Jun 2026"],
  ["Fashion Retail Operations Intern (Part-Time or Full-Time)", "COLLARO MENSWEAR PRIVATE LIMITED", "Retail, FMCG & E-Commerce", "internship", "https://www.mycareersfuture.gov.sg/job/logistics/fashion-retail-operations-intern-collaro-menswear-ceed66eb6e37d1d1a9108499b6a0f809", "15 Jun 2026"],
  ["Software Engineer Intern", "GEMSTONE SYSTEMS PTE. LTD.", "Technology, AI & Data", "internship", "https://www.mycareersfuture.gov.sg/job/engineering/software-engineer-intern-gemstone-systems-5074cb478b28036403323bfa26dbf187", "15 Jun 2026"],
  ["Finance Intern (Aug to Dec 26)", "HONG YE GROUP PTE. LTD.", "Banking, Finance, Insurance & Accounting", "internship", "https://www.mycareersfuture.gov.sg/job/accounting/finance-intern-hong-ye-group-8248e9b856c951d70e2fec2ee4bf03b1", "15 Jun 2026"],
  ["Apex Personal Finance Intern", "APEX WEALTH MANAGEMENT LLP", "Banking, Finance, Insurance & Accounting", "internship", "https://www.mycareersfuture.gov.sg/job/banking-finance/apex-personal-finance-intern-apex-wealth-management-0163a12898981682282d03e4fbc3af50", "15 Jun 2026"],
  ["Business Analyst Intern (Capital Markets) - Vietnamese Speaking", "KGI SECURITIES (SINGAPORE) PTE. LTD.", "Banking, Finance, Insurance & Accounting", "internship", "https://www.mycareersfuture.gov.sg/job/banking-finance/business-analyst-intern-vietnamese-speaking-kgi-securities-4c1aea32a5eab92e4fef4b6e9a438fc1", "15 Jun 2026"],
  ["Business Analyst Intern (Operations & Technology)", "BIOQUEST ADVISORY PTE. LTD.", "Professional Services, Consulting & Advisory", "internship", "https://www.mycareersfuture.gov.sg/job/consulting/business-analyst-intern-bioquest-advisory-2da9fedf368fbec77c4b9f149f3ff8cc", "15 Jun 2026"],
  ["Intern, Facilities Management", "HYPERSCAL SOLUTIONS PTE. LTD.", "Built Environment, Real Estate & Facilities", "internship", "https://www.mycareersfuture.gov.sg/job/real-estate/intern-facilities-management-ntuc-health-co-operative-dff7e8eab5bb160751a188a894c068ad", "10 Jun 2026"],
  ["Food Tech Intern", "PROTEIN PLUS GROUP PTE. LTD.", "Food, Agritech & Consumer Services", "internship", "https://www.mycareersfuture.gov.sg/job/food-and-beverage/food-tech-intern-protein-plus-group-7aa7823fc3531d58cd824dcd4a00f025", "02 Jun 2026"],
  ["Intern - Logistics Ops Warehouse Process Improvement", "APPLIED MATERIALS SOUTH EAST ASIA PTE. LTD.", "Supply Chain, Logistics & Operations", "internship", "https://www.mycareersfuture.gov.sg/job/logistics/intern-logistics-ops-warehouse-process-improvement-applied-materials-south-east-asia-a87645ba86a649ad76d3126336ca6d60", "02 Jun 2026"],
  ["Sustainability Intern", "BUREAU VERITAS SINGAPORE PTE. LTD.", "Energy, Utilities & Sustainability", "internship", "https://www.mycareersfuture.gov.sg/job/consulting/sustainability-intern-bureau-veritas-singapore-2bf4a35145d2df21b335a73cc08fd465", "28 May 2026"],
  ["Full Stack Software Developer (Polytechnic Graduates)", "SIMPLIFYNEXT PTE. LTD.", "Technology, AI & Data", "first-job", "https://www.mycareersfuture.gov.sg/job/consulting/full-stack-software-developer-simplifynext-306d06f0563529e2e5de6ecc9e932a0c", "16 Jun 2026"],
  ["Junior Data Analyst", "A. MGR CO. PTE. LTD.", "Technology, AI & Data", "first-job", "https://www.mycareersfuture.gov.sg/job/accounting/junior-data-analyst-a-mgr-cf64c5171b8bb742913012ee4cf13290", "15 Jun 2026"],
  ["Accounts Executive", "SL METALS PTE. LTD.", "Banking, Finance, Insurance & Accounting", "first-job", "https://www.mycareersfuture.gov.sg/job/accounting/accounts-executive-sl-metals-91acd17b7a670c5ad30416a7f47af8e3", "16 Jun 2026"],
  ["EO Associate Engineer (EEE Dip/ Entry level welcome)", "ES RECRUITMENT PTE. LTD.", "Engineering, Semiconductor & Manufacturing", "first-job", "https://www.mycareersfuture.gov.sg/job/engineering/eo-associate-engineer-es-recruitment-8b03b9fee4d59aaaa14eb99ef34ce503", "16 Jun 2026"],
  ["Associate Engineer, QA", "SILICON BOX PTE. LTD.", "Engineering, Semiconductor & Manufacturing", "first-job", "https://www.mycareersfuture.gov.sg/job/engineering/associate-engineer-qa-silicon-box-bfdfc8d937ba84b6a947cca6768e4e7b", "16 Jun 2026"],
  ["Mechanical Engineer (Fresh Grad)", "WSP CONSULTANCY PTE. LTD.", "Built Environment, Real Estate & Facilities", "first-job", "https://www.mycareersfuture.gov.sg/job/engineering/mechanical-engineer-wsp-consultancy-cd1ffbfe929a8f08d81ccc6df63054a3", "16 Jun 2026"],
  ["Junior UAT Project Management Officer/Business Analyst (Bank)", "ADECCO PERSONNEL PTE LTD", "Professional Services, Consulting & Advisory", "first-job", "https://www.mycareersfuture.gov.sg/job/banking-finance/junior-uat-project-management-officerbusiness-analyst-adecco-personnel-f47b5658d01ea67a336c9879e0e36982", "16 Jun 2026"],
  ["Junior Marketing & Sales Executive (Fresh Graduate Friendly)", "J&N VENTURES", "Marketing, Sales & Business", "first-job", "https://www.mycareersfuture.gov.sg/job/marketing/junior-marketing-sales-executive-jn-ventures-ba386d073acf9b3af6729a128815f696", "16 Jun 2026"],
  ["Corporate Communications Executive - JL", "APBA TG HUMAN RESOURCE PTE. LTD.", "Design, Media & Communications", "first-job", "https://www.mycareersfuture.gov.sg/job/marketing/corporate-communications-executive-jl-apba-tg-human-resource-3933bd4916a12598f783521d4060aa40", "15 Jun 2026"],
  ["HR Coordinator (12-mth contract | Up to $3k | Central)", "BGC GROUP PTE. LTD.", "Human Resources, Admin & Education", "first-job", "https://www.mycareersfuture.gov.sg/job/admin/hr-coordinator-bgc-group-1ccfab0ac66b6b0f3ba28759e58c39f8", "15 Jun 2026"],
  ["Project Coordinator (Logistics | Elevator Projects)", "RECRUIT LYNC PTE. LTD.", "Built Environment, Real Estate & Facilities", "first-job", "https://www.mycareersfuture.gov.sg/job/building-construction/project-coordinator-recruit-lync-176bd47bf10cc79d86d64e950d95965f", "15 Jun 2026"],
  ["*Entry Level* Operations Executive (Slot Settlement) - Maritime #NJN", "RECRUIT EXPRESS PTE LTD", "Maritime, Aviation & Transport", "first-job", "https://www.mycareersfuture.gov.sg/job/logistics/entry-level-operations-executive-maritime-njn-recruit-express-53df0074ad49f1d05e612851ccfc852a", "15 Jun 2026"],
  ["E-commerce Executive", "RISING DAY PTE. LTD.", "Retail, FMCG & E-Commerce", "first-job", "https://www.mycareersfuture.gov.sg/job/admin/e-commerce-executive-rising-day-1daec4802519ca7404434b34cb392382", "11 Jun 2026"],
  ["Flavour Laboratory Assistant & QA/QC Executive", "UNIVA AROMATICS PTE LTD", "Food, Agritech & Consumer Services", "first-job", "https://www.mycareersfuture.gov.sg/job/sciences/flavour-laboratory-assistant-qaqc-executive-univa-aromatics-661c411a2a54adbdfd7fb67fd2258181", "12 Jun 2026"],
  ["Programme Executive (YDC)", "HYPERSCAL SOLUTIONS PTE. LTD.", "Social Services, Non-Profit & Community", "first-job", "https://www.mycareersfuture.gov.sg/job/social-services/programme-executive-salvation-army-8280747311647a23e1be4c68f64372c2", "16 Jun 2026"],
  ["Junior Fund Accountant", "PROTEGE FUND SERVICES PTE. LTD.", "Banking, Finance, Insurance & Accounting", "first-job", "https://www.mycareersfuture.gov.sg/job/accounting/junior-fund-accountant-protege-fund-services-b40dea8b6b125b701bc7a7c014cccf00", "15 Jun 2026"],
  ["Research Editor", "DOW JONES AER COMPANY, INC. (Singapore Branch)", "Science, Research & Academia", "first-job", "https://www.mycareersfuture.gov.sg/job/others/research-editor-dow-jones-aer-company-339d283fe69d2a075cead13388634e8a", "05 Jun 2026"],
  ["Research Analyst", "DC BYTE ASIA PTE. LTD.", "Built Environment, Real Estate & Facilities", "first-job", "https://www.mycareersfuture.gov.sg/job/general-management/research-analyst-dc-byte-asia-4168a52bfe4eac73961124d6cfe969e2", "02 Jun 2026"],
  ["Sales Recruitment Executive (Healthcare/ Entry-Level) #HCG", "RECRUIT EXPRESS PTE LTD", "Healthcare, Biomedical & Pharma", "first-job", "https://www.mycareersfuture.gov.sg/job/healthcare/sales-recruitment-executive-hcg-recruit-express-9defec68d4b53f01dfaef3a90789fcf2", "15 Jun 2026"],
].map(([title, company, industry, stage, url, posted]) => ({
  title,
  company,
  industry,
  stage,
  source: "MyCareersFuture",
  checked: "17 Jun 2026",
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

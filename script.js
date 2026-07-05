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

const marketUpdated = "6 Jul 2026";

const featuredOpenings = [
  ["Marketing & Digital Design Intern", "2KBROS PTE. LTD.", "Design, Media & Communications", "internship", "https://www.mycareersfuture.gov.sg/job/design/marketing-digital-design-intern-2kbros-21ce175e151908229fad9644e4e5c2b5", "3 Jul 2026"],
  ["Social Media and Content Intern", "ELYSIUM ACCORD PTE. LTD.", "Design, Media & Communications", "internship", "https://www.mycareersfuture.gov.sg/job/advertising/social-media-content-intern-elysium-accord-4c206c69b240eaa66941255357ec7047", "3 Jul 2026"],
  ["TikTok Creator & Production Intern", "NEXUS BRIDGE AI PTE. LTD.", "Design, Media & Communications", "internship", "https://www.mycareersfuture.gov.sg/job/tiktok-creator-production-intern-nexus-bridge-ai-61b4214dd25eae1830d93a1a324c3c1f", "3 Jul 2026"],
  ["Project Management Officer (PMO) / Quality Assurance (QA) Intern", "CYNAPSE PTE. LTD.", "Technology, AI & Data", "internship", "https://www.mycareersfuture.gov.sg/job/information-technology/project-management-officer-quality-assurance-intern-cynapse-81ba2079facc9eaa3af3175371fe827a", "3 Jul 2026"],
  ["AI Research & Development Intern (August 2026)", "CYNAPSE PTE. LTD.", "Technology, AI & Data", "internship", "https://www.mycareersfuture.gov.sg/job/information-technology/ai-research-development-intern-cynapse-9f2b4d7ffea45f1d47d7175204fd9439", "3 Jul 2026"],
  ["Machine Learning Engineer Intern (Computer Vision & AI) (August 2026)", "CYNAPSE PTE. LTD.", "Technology, AI & Data", "internship", "https://www.mycareersfuture.gov.sg/job/information-technology/machine-learning-engineer-intern-cynapse-37917bdb0ffbf4faee3baaf11e7b8213", "3 Jul 2026"],
  ["HR Intern for 6-month", "MSI GLOBAL PRIVATE LIMITED", "Human Resources, Admin & Education", "internship", "https://www.mycareersfuture.gov.sg/job/admin/hr-intern-6-month-msi-global-90154fb165be1aabf430a2f3d2119cc1", "3 Jul 2026"],
  ["Administrative Assistant Intern (Asia-Pacific Sales Centre)", "S. F. EXPRESS (SINGAPORE) PRIVATE LIMITED", "Supply Chain, Logistics & Operations", "internship", "https://www.mycareersfuture.gov.sg/job/admin/administrative-assistant-intern-sf-supply-chain-international-b208f852a93622071ec6a5139bb4f2dc", "3 Jul 2026"],
  ["Business & Operations Intern", "INFINIX HOSPITALITY MANAGEMENT PTE. LTD.", "Supply Chain, Logistics & Operations", "internship", "https://www.mycareersfuture.gov.sg/job/business-operations-intern-infinix-hospitality-management-d8bbc2c5189f59ac137bd4e0f64c7582", "3 Jul 2026"],
  ["Marketing Intern (Social Media) (Parttime available too)", "SURREY HILLS HOLDINGS (PRIVATE LIMITED)", "Marketing, Sales & Business", "internship", "https://www.mycareersfuture.gov.sg/job/marketing/marketing-intern-surrey-hills-holdings-1733ecd36a1364e3f3c541fae056737a", "3 Jul 2026"],
  ["Digital Marketing Intern", "WHITE SOCIETY PTE. LTD.", "Marketing, Sales & Business", "internship", "https://www.mycareersfuture.gov.sg/job/advertising/digital-marketing-intern-white-society-15d5c5fbab3660feb3a620a57ace34b1", "3 Jul 2026"],
  ["Marketing Intern", "SASH NATURAL PTE. LTD.", "Marketing, Sales & Business", "internship", "https://www.mycareersfuture.gov.sg/job/marketing/marketing-intern-sash-natural-f15c2832722c48cc1759891db2821ed8", "3 Jul 2026"],
  ["Legal Research Intern", "INTERNATIONAL CHAMBER OF COMMERCE, REGIONAL OFFICE, ASIA", "Legal, Policy, Public Sector & ESG", "internship", "https://www.mycareersfuture.gov.sg/job/legal/legal-research-intern-international-chamber-commerce-regional-office-asia-3948bcbe95b3289f583ab0f4a3c28acd", "3 Jul 2026"],
  ["LEGAL INTERN", "AGP LAW LLC", "Legal, Policy, Public Sector & ESG", "internship", "https://www.mycareersfuture.gov.sg/job/admin/legal-intern-agp-law-77ae7a8d0415d7ef52f4cf3bcfd844f4", "3 Jul 2026"],
  ["Intern - Fundraising & Events", "REACH COMMUNITY SERVICES LTD.", "Hospitality, Tourism & Events", "internship", "https://www.mycareersfuture.gov.sg/job/events/intern-%E2%80%93-fundraising-events-reach-community-services-cd59f2a442b5e3ce3842236575256a29", "3 Jul 2026"],
  ["Intern - Marketing & Communications (Content Creation)", "REACH COMMUNITY SERVICES LTD.", "Social Services, Non-Profit & Community", "internship", "https://www.mycareersfuture.gov.sg/job/social-services/intern-%E2%80%93-marketing-communications-reach-community-services-cce2bfe7dc1b9bd286ba27393f0496a8", "3 Jul 2026"],
  ["Quality Management Intern", "LUCENCE DIAGNOSTICS PTE. LTD.", "Healthcare, Biomedical & Pharma", "internship", "https://www.mycareersfuture.gov.sg/job/others/quality-management-intern-lucence-diagnostics-9613d1681fdae50d0aa8e422bfdf0483", "3 Jul 2026"],
  ["Merchandising Intern (6 months)", "SHILLA TRAVEL RETAIL PTE. LTD.", "Retail, FMCG & E-Commerce", "internship", "https://www.mycareersfuture.gov.sg/job/purchasing/merchandising-intern-shilla-travel-retail-1a758f05e6ce9c496f078388fea481e5", "2 Jul 2026"],
  ["Research Intern", "NVIDIA SINGAPORE DEVELOPMENT PTE. LTD.", "Science, Research & Academia", "internship", "https://www.mycareersfuture.gov.sg/job/engineering/research-intern-nvidia-singapore-development-2a133fb6254de71ccfb02023fca5e183", "2 Jul 2026"],
  ["Software Engineer Intern (Mapping / Calibration)", "MOTIONAL SINGAPORE PTE. LIMITED", "Technology, AI & Data", "internship", "https://www.mycareersfuture.gov.sg/job/engineering/software-engineer-intern-motional-singapore-7724bed20e92da39780a7a3fd283707d", "2 Jul 2026"],
  ["SALES & MARKETING (Entry-Level)", "SIMPLE RECRUIT", "Marketing, Sales & Business", "first-job", "https://www.mycareersfuture.gov.sg/job/marketing/sales-marketing-simple-recruit-eaf9ac53fe128a66fafa01d7846c7996", "3 Jul 2026"],
  ["Global Sales [ Entry level, No experience needed ]", "ROYAL ORG PTE. LTD.", "Marketing, Sales & Business", "first-job", "https://www.mycareersfuture.gov.sg/job/events/global-sales-%F0%9F%8C%9F-entry-level-experience-needed-royal-org-3d171858f3210dad6230743e5dfee795", "3 Jul 2026"],
  ["Marketing & Outreach Executive (Entry-Level)", "SIMPLE RECRUIT", "Marketing, Sales & Business", "first-job", "https://www.mycareersfuture.gov.sg/job/customer-service/marketing-outreach-executive-simple-recruit-2f6c03d84bd6d772ca07677552238885", "3 Jul 2026"],
  ["Marketing & Sales Trainee (Entry level | Immediate)", "SIMPLE RECRUIT", "Marketing, Sales & Business", "first-job", "https://www.mycareersfuture.gov.sg/job/marketing-sales-trainee-simple-recruit-ae7fc261295c8e93076bb5113c5e6d24", "3 Jul 2026"],
  ["Project Engineer (M&E | Automation | Entry Level)", "HR FOCUS", "Engineering, Semiconductor & Manufacturing", "first-job", "https://www.mycareersfuture.gov.sg/job/engineering/project-engineer-hr-focus-6f051d86e53e90e6b1a76c84943db0a7", "3 Jul 2026"],
  ["Site Engineer(Fresh Graduate)", "KASZON PTE. LTD.", "Built Environment, Real Estate & Facilities", "first-job", "https://www.mycareersfuture.gov.sg/job/building-construction/site-engineer-kaszon-a3226e73967d3523d20a03f3358ec661", "2 Jul 2026"],
  ["Entry Level Brand Ambassador (No Experience Required)", "ROYAL ORG PTE. LTD.", "Marketing, Sales & Business", "first-job", "https://www.mycareersfuture.gov.sg/job/%F0%9F%A7%A8entry-level-brand-ambassador-royal-org-7a5d78591990e976382884683ec4497a", "3 Jul 2026"],
  ["Full-Time Sales & Marketing Executive (Career Growth | Weekly Pay)", "AUDERE MARKETING PTE. LTD.", "Marketing, Sales & Business", "first-job", "https://www.mycareersfuture.gov.sg/job/marketing/%F0%9F%93%88-full-time-sales-marketing-executive-audere-marketing-18081a51a88de59d24a93ead82933b71", "1 Jul 2026"],
  ["Entry Level* 8 - 9 Months Pricing Analyst #NJN", "RECRUIT EXPRESS PTE LTD", "Technology, AI & Data", "first-job", "https://www.mycareersfuture.gov.sg/job/information-technology/entry-level-8-9-months-pricing-analyst-njn-recruit-express-8ecfc7b1e341dde4cefaa81820b1ecaa", "1 Jul 2026"],
  ["Graduate Cloud Infrastructure Engineer (Fresh Graduates Welcome!)", "TALENTSIS PTE. LTD.", "Technology, AI & Data", "first-job", "https://www.mycareersfuture.gov.sg/job/engineering/graduate-cloud-infrastructure-engineer-talentsis-6d473e6e143ffd1152401cf366eb8f53", "1 Jul 2026"],
  ["English Editor (Cover Letter Required)", "MDPI PTE. LTD.", "Design, Media & Communications", "first-job", "https://www.mycareersfuture.gov.sg/job/others/english-editor-mdpi-d0fdef55600fcc136d4e6dbf4ff45436", "1 Jul 2026"],
  ["Account Executive (Campaigns)", "CONFIRM GOOD PTE. LTD.", "Design, Media & Communications", "first-job", "https://www.mycareersfuture.gov.sg/job/account-executive-confirm-good-f0ec7c20eefce2f312627994555f83ae", "3 Jul 2026"],
  ["English Language Teacher (Preschool / Primary Level)", "SEARCH AVENUE PRIVATE LIMITED", "Human Resources, Admin & Education", "first-job", "https://www.mycareersfuture.gov.sg/job/education-training/english-language-teacher-search-avenue-8e33638a0cd067f6a7806bed05adcf2e", "2 Jul 2026"],
  ["ERP Sales Executive (ERP & AI Automation)", "MSC CONSULTING (S) PTE. LTD.", "Technology, AI & Data", "first-job", "https://www.mycareersfuture.gov.sg/job/information-technology/erp-sales-executive-fresh-graduates-welcome-msc-consulting-2a7d512fd7eac875a38c926270b59431", "30 Jun 2026"],
  ["Test Engineer (Fresh Graduate Welcome / MNC Semiconductor)", "WANCO MANPOWER PTE LTD", "Engineering, Semiconductor & Manufacturing", "first-job", "https://www.mycareersfuture.gov.sg/job/engineering/test-engineer-wanco-manpower-e09e3cb377ea062e2786284ac6245b9b", "23 Jun 2026"],
  ["Technical Sales Engineer (Fresh Graduate)", "KARMSUND MARITIME SINGAPORE PTE. LTD.", "Engineering, Semiconductor & Manufacturing", "first-job", "https://www.mycareersfuture.gov.sg/job/engineering/technical-sales-engineer-karmsund-maritime-singapore-b93c15efe89b9d57f8a0e0f1869ca9e0", "23 Jun 2026"],
].map(([title, company, industry, stage, url, posted]) => ({
  title,
  company,
  industry,
  stage,
  source: "MyCareersFuture",
  checked: "6 Jul 2026",
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
        <p>${opening.stage === "first-job" ? "Graduate / entry-level job" : "Internship opening"} listed ${opening.posted} and checked ${opening.checked} via ${opening.source}.</p>
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

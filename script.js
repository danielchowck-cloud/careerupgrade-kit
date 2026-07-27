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

const marketUpdated = "28 Jul 2026";

const featuredOpenings = [
  ["Marketing Intern (Social Media)", "CONFIRM GOOD", "Design, Media & Communications", "internship", "https://www.mycareersfuture.gov.sg/job/advertising/marketing-intern-confirm-good-117a86a301a2ac79b4daa7acba5706f2", "Posted 27 Jul 2026", "MyCareersFuture"],
  ["Data Scientist Intern (AI Analyst Intern)", "ONE TECH STOP", "Technology, AI & Data", "internship", "https://www.mycareersfuture.gov.sg/job/information-technology/data-scientist-intern-one-tech-stop-2b121bc509dcce4e301d5c91b77bd688?event=Search&source=MCF", "Posted 27 Jul 2026", "MyCareersFuture"],
  ["Data Scientist Intern (AI Engineer Intern)", "ONE TECH STOP", "Technology, AI & Data", "internship", "https://www.mycareersfuture.gov.sg/job/information-technology/data-scientist-intern-one-tech-stop-bd7febfd9af0863776669e07bfac23dd?event=Search&source=MCF", "Posted 27 Jul 2026", "MyCareersFuture"],
  ["Embodied AI Engineer Intern", "HONG YE GROUP", "Engineering, Semiconductor & Manufacturing", "internship", "https://www.mycareersfuture.gov.sg/job/engineering/embodied-ai-engineer-intern-hong-ye-group-13f53d385b06f36fb8684c6ba7ac5932?event=Search&source=MCF", "Posted 27 Jul 2026", "MyCareersFuture"],
  ["HR & Admin Intern (6 Months)", "YY CIRCLE", "Human Resources, Admin & Education", "internship", "https://www.mycareersfuture.gov.sg/job/human-resources/hr-admin-intern-yy-circle-c1d705a648a7985e5aa6c4b02822e74f?event=Search&source=MCF", "Posted 27 Jul 2026", "MyCareersFuture"],
  ["Finance & Accounting Intern - P&G Management Internship Program (Summer 2027)", "Procter & Gamble I'ntl Operations SA Singapore Branch", "Banking, Finance, Insurance & Accounting", "internship", "https://sg.jobstreet.com/summer-internship-program-jobs", "Listed 20h ago", "JobStreet SG"],
  ["Product Supply Intern - P&G Management Internship Program (Summer 2027)", "Procter & Gamble I'ntl Operations SA Singapore Branch", "Supply Chain, Logistics & Operations", "internship", "https://sg.jobstreet.com/summer-internship-program-jobs", "Listed 20h ago", "JobStreet SG"],
  ["Talent Acquisiton & Employer Brand Intern", "Red Alpha Cybersecurity", "Human Resources, Admin & Education", "internship", "https://sg.jobstreet.com/summer-internship-program-jobs", "Listed 40m ago", "JobStreet SG"],
  ["Accounting Intern - Immediate Hiring", "SMCC OVERSEAS SINGAPORE", "Banking, Finance, Insurance & Accounting", "internship", "https://sg.jobstreet.com/summer-internship-program-jobs", "Listed 4d ago", "JobStreet SG"],
  ["HR Intern", "Recruit Express", "Human Resources, Admin & Education", "internship", "https://sg.indeed.com/viewjob?jk=a72934bead7931bb", "Posted 13 Jul 2026", "Indeed Singapore"],
  ["Intern, Asset Management (Retail & Commercial Assets)", "CapitaLand", "Built Environment, Real Estate & Facilities", "internship", "https://jobs.singaporeglobalnetwork.gov.sg/jobs/capitaland?internshipOnly=true", "Live SGN listing", "Singapore Global Network"],
  ["Project Intern, Client Coverage", "Clifford Capital", "Banking, Finance, Insurance & Accounting", "internship", "https://jobs.singaporeglobalnetwork.gov.sg/jobs/clifford-capital?internshipOnly=true", "Live SGN listing", "Singapore Global Network"],
  ["Internship - Plant Automation, Singapore (January to June 2027)", "GSK", "Engineering, Semiconductor & Manufacturing", "internship", "https://jobs.singaporeglobalnetwork.gov.sg/jobs/gsk?internshipOnly=true", "Live SGN listing", "Singapore Global Network"],
  ["Data Science Intern (Semester 2026) - P&G Management Internship Program", "Procter & Gamble Co.", "Technology, AI & Data", "internship", "https://jobs.singaporeglobalnetwork.gov.sg/jobs/procter-gamble?internshipOnly=true", "Live SGN listing", "Singapore Global Network"],
  ["Digital Marketing Intern #78817", "ANRADUS", "Marketing, Sales & Business", "internship", "https://www.mycareersfuture.gov.sg/job/marketing/digital-marketing-intern-78817-anradus-43b0cf59c87eb9814aaf907400aa6947", "Posted 25 Jul 2026", "MyCareersFuture"],
  ["Wedding & Event Decoration Intern", "INDIAN COOKED FOOD CATERING SERVICE", "Hospitality, Tourism & Events", "internship", "https://www.mycareersfuture.gov.sg/job/events/wedding-event-decoration-intern-indian-cooked-food-catering-service-4ed0d6585746ed847b27e9b816ccd0aa?event=Search&source=MCF", "Posted 25 Jul 2026", "MyCareersFuture"],
  ["AV, Lighting & Sound Intern (Events)", "INDIAN COOKED FOOD CATERING SERVICE", "Hospitality, Tourism & Events", "internship", "https://www.mycareersfuture.gov.sg/job/events/av-lighting-sound-intern-indian-cooked-food-catering-service-70e160d1885a5ca57289975808fdb97e", "Posted 25 Jul 2026", "MyCareersFuture"],
  ["F&B / Culinary Intern (South & North Indian Cuisine)", "INDIAN COOKED FOOD CATERING SERVICE", "Food, Agritech & Consumer Services", "internship", "https://www.mycareersfuture.gov.sg/job/food-and-beverage/fb-culinary-intern-indian-cooked-food-catering-service-1b114731136f7f0938892f219309cf66", "Posted 25 Jul 2026", "MyCareersFuture"],
  ["Human Resource Intern | Weekdays | Office Hour", "ABER CARE", "Human Resources, Admin & Education", "internship", "https://www.mycareersfuture.gov.sg/job/admin/human-resource-intern-weekdays-office-hour-aber-care-45939b8017b53a740b98eca03e738b6d?event=Search&source=MCF", "Posted 25 Jul 2026", "MyCareersFuture"],
  ["Social Media and Community Intern", "SLEEK RD MANAGEMENT", "Design, Media & Communications", "internship", "https://www.mycareersfuture.gov.sg/job/marketing/social-media-community-intern-sleek-rd-management-7a3d8bc9a099b5a048e1d5d00fa080d9", "Posted 24 Jul 2026", "MyCareersFuture"],
  ["Sales & Marketing Internship (Build Skills that Open Doors)", "BELIEVE EXTRAORDINARY", "Marketing, Sales & Business", "internship", "https://www.mycareersfuture.gov.sg/job/sales/sales-marketing-internship-believe-extraordinary-387828d9631c3c0032fcaa0a75775d56?event=Search&source=MCF", "Posted 24 Jul 2026", "MyCareersFuture"],
  ["UI & UX Strategy Consultant - Internship", "MAVERICKS CONSULTING", "Professional Services, Consulting & Advisory", "internship", "https://www.mycareersfuture.gov.sg/job/consulting/ui-ux-strategy-consultant-internship-mavericks-consulting-753e674bfc98e03b7061b2fd8ef5bf36", "Posted 24 Jul 2026", "MyCareersFuture"],
  ["Internship for Corporate & Institutional Banking", "EMIRATES NBD BANK", "Banking, Finance, Insurance & Accounting", "internship", "https://www.mycareersfuture.gov.sg/job/accounting/internship-corporate-institutional-banking-emirates-nbd-bank-4fcfc822c0c8c9e8c127f9d1586838e0?event=Search&source=MCF", "Posted 24 Jul 2026", "MyCareersFuture"],
  ["Human Resources Intern", "BIG 3 GROUP", "Human Resources, Admin & Education", "internship", "https://www.mycareersfuture.gov.sg/job/human-resources/human-resources-intern-big-3-group-6d73413c8a17a204ee9a0c1725c5a1ce?event=Search&source=MCF", "Posted 24 Jul 2026", "MyCareersFuture"],
  ["Interior Design Internship l 6 months", "HACHEM SINGAPORE", "Built Environment, Real Estate & Facilities", "internship", "https://www.mycareersfuture.gov.sg/job/design/interior-design-internship-l-6-months-hachem-singapore-c8eb69f596e78c0e7b0fee1d5babd572", "Posted 22 Jul 2026", "MyCareersFuture"],
  ["HR IT Intern (6 to 12 Months Internship)", "MSI GLOBAL", "Human Resources, Admin & Education", "internship", "https://www.mycareersfuture.gov.sg/job/hr-intern-msi-global-e856e1d85887e687590cbf7bd908d769", "Posted 17 Jul 2026", "MyCareersFuture"],
  ["Accounting Intern", "Lotusia Pte. Ltd.", "Banking, Finance, Insurance & Accounting", "internship", "https://sg.jobstreet.com/job/93553929", "Posted 2d ago", "JobStreet SG"],
  ["Operations Intern", "Roffe International", "Supply Chain, Logistics & Operations", "internship", "https://sg.jobstreet.com/job/93551499", "Posted 1d ago", "JobStreet SG"],
  ["HR Intern, HR Shared Services", "STATS CHIPPAC MANAGEMENT PTE. LTD.", "Human Resources, Admin & Education", "internship", "https://sg.jobstreet.com/job/93553901", "Posted 2d ago", "JobStreet SG"],
  ["Marketing Intern (Japanese Market)", "OLA PARTY PTE. LTD.", "Marketing, Sales & Business", "internship", "https://sg.jobstreet.com/job/93497932", "Posted 4d ago", "JobStreet SG"],
  ["Trading Internship - OCBC", "OCBC Bank", "Banking, Finance, Insurance & Accounting", "internship", "https://sg.jobstreet.com/job/93444225", "Posted 2d ago", "JobStreet SG"],
  ["Travel Retail Commercial Intern", "Coty", "Retail, FMCG & E-Commerce", "internship", "https://sg.indeed.com/viewjob?jk=6086b8d2d8ef3d15", "Posted 3 Jul 2026", "Indeed Singapore"],
  ["Internship 2026", "Pacific International Lines", "Maritime, Aviation & Transport", "internship", "https://sg.indeed.com/viewjob?jk=03b75854e43e3ca8", "Live listing", "Indeed Singapore"],
  ["Intern, Workspace Marketing", "CapitaLand", "Marketing, Sales & Business", "internship", "https://jobs.singaporeglobalnetwork.gov.sg/jobs/capitaland?internshipOnly=true", "Posted less than 1 day ago", "Singapore Global Network"],
  ["Intern, SOC Analyst", "Ensign InfoSecurity", "Technology, AI & Data", "internship", "https://jobs.singaporeglobalnetwork.gov.sg/jobs/ensign-infosecurity?internshipOnly=true", "Posted 2d ago", "Singapore Global Network"],
  ["Financial Literacy Intern (July- Oct 2026)", "UOB", "Banking, Finance, Insurance & Accounting", "internship", "https://jobs.singaporeglobalnetwork.gov.sg/jobs/uob?internshipOnly=true", "Live SGN listing", "Singapore Global Network"],
  ["Project Intern, Financial Risk Analytics (August to December 2026)", "Clifford Capital", "Banking, Finance, Insurance & Accounting", "internship", "https://jobs.singaporeglobalnetwork.gov.sg/jobs/clifford-capital?internshipOnly=true", "Posted 30+ days ago", "Singapore Global Network"],
  ["Internship - Process Engineering (Pilot Plant), Singapore (January to June 2027)", "GSK", "Healthcare, Biomedical & Pharma", "internship", "https://jobs.singaporeglobalnetwork.gov.sg/jobs/gsk?internshipOnly=true", "Posted 15d ago", "Singapore Global Network"],
  ["Intern, Tenant Management, Singapore (Funan) (Summer 2026)", "CapitaLand", "Built Environment, Real Estate & Facilities", "internship", "https://jobs.singaporeglobalnetwork.gov.sg/jobs/capitaland?internshipOnly=true", "Posted 30+ days ago", "Singapore Global Network"],
  ["IT Security Intern (6 months)", "Sea", "Technology, AI & Data", "internship", "https://jobs.singaporeglobalnetwork.gov.sg/jobs/sea?internshipOnly=true", "Posted 9d ago", "Singapore Global Network"],
  ["Repair Operations Intern", "Razer", "Supply Chain, Logistics & Operations", "internship", "https://jobs.singaporeglobalnetwork.gov.sg/jobs/razer?internshipOnly=true", "Posted 30+ days ago", "Singapore Global Network"],
  ["Sales & Marketing (Entry Level)", "SIMPLE RECRUIT", "Marketing, Sales & Business", "first-job", "https://www.mycareersfuture.gov.sg/job/marketing/%F0%9F%8C%8F-sales-marketing-simple-recruit-7c5cd770486aa328ab3bd9b5876f1dad", "Posted 27 Jul 2026", "MyCareersFuture"],
  ["Full-Time Marketing & Events Executive", "AUDERE MARKETING", "Marketing, Sales & Business", "first-job", "https://www.mycareersfuture.gov.sg/job/marketing/%F0%9F%92%A1-full-time-marketing-events-executive-audere-marketing-641e5856fed0a470a1667beea65fb48f?event=RecommendedJobJD&source=MCF", "Posted 27 Jul 2026", "MyCareersFuture"],
  ["Entry Level Marketing", "ALTIUS ORG", "Marketing, Sales & Business", "first-job", "https://www.mycareersfuture.gov.sg/job/advertising/marketing-%E2%9D%A4%EF%B8%8F-altius-org-0e6e5671355df8a930c0f093504c19fd", "Posted 27 Jul 2026", "MyCareersFuture"],
  ["Client Relations Associate (Entry-Level, Travel Perks)", "SIMPLE RECRUIT", "Marketing, Sales & Business", "first-job", "https://www.mycareersfuture.gov.sg/job/customer-service/client-relations-associate-%E2%9C%88%EF%B8%8F-simple-recruit-74ed254a7c192be84e9341230a27335a", "Posted 27 Jul 2026", "MyCareersFuture"],
  ["Management Trainee (Entry Level Welcome)", "Fort Financial", "Banking, Finance, Insurance & Accounting", "first-job", "https://sg.jobstreet.com/fresh-graduate-entry-level-jobs/in-Singapore", "Listed 1d ago", "JobStreet SG"],
  ["Accounts & Admin Executive (Entry-Level)", "Dynamix Cosmo", "Banking, Finance, Insurance & Accounting", "first-job", "https://sg.jobstreet.com/fresh-graduate-entry-level-jobs/in-Singapore", "Listed 18h ago", "JobStreet SG"],
  ["Fresh Graduates Welcome | Business Development Executive", "PrecisionWorks", "Marketing, Sales & Business", "first-job", "https://sg.jobstreet.com/fresh-graduate-entry-level-jobs/in-Singapore", "Listed 18h ago", "JobStreet SG"],
  ["Recruitment Consultant (Entry Level | Training Provided)", "Achieve Career Consultant", "Human Resources, Admin & Education", "first-job", "https://sg.jobstreet.com/fresh-graduate-entry-level-jobs/in-Singapore", "Listed 20h ago", "JobStreet SG"],
  ["Technology Business Analyst - Fresh Graduates", "Accenture", "Technology, AI & Data", "first-job", "https://sg.indeed.com/q-fresh-graduate-jobs.html", "Live Indeed listing", "Indeed Singapore"],
  ["Program Manager (Fresh Graduate)", "HP", "Technology, AI & Data", "first-job", "https://sg.indeed.com/q-fresh-graduate-jobs.html", "Live Indeed listing", "Indeed Singapore"],
  ["Graduate Intern", "Dell Technologies", "Technology, AI & Data", "first-job", "https://jobs.singaporeglobalnetwork.gov.sg/jobs/dell-technologies", "Posted 1d ago", "Singapore Global Network"],
  ["Marketing Brand Trainee: Entry Level + Fast Track Growth", "ROYAL ORG", "Marketing, Sales & Business", "first-job", "https://www.mycareersfuture.gov.sg/job/marketing/marketing-brand-trainee-entry-level-fast-track-growth-royal-org-2403104f52376bb968afc6c5c1549c8e", "Posted 25 Jul 2026", "MyCareersFuture"],
  ["Sales Catalyst (Entry Level)", "RYO GLOBAL", "Marketing, Sales & Business", "first-job", "https://www.mycareersfuture.gov.sg/job/marketing/sales-catalyst-ryo-global-2528f36307c8c91536fd27cea886f94a", "Posted 25 Jul 2026", "MyCareersFuture"],
  ["ORD Personnel Welcome - Business Development Associate", "WAVEWORKS", "Marketing, Sales & Business", "first-job", "https://www.mycareersfuture.gov.sg/job/marketing/%F0%9F%87%B8%F0%9F%87%AC-ord-personnel-welcome-%E2%80%93-business-development-associate-waveworks-fe9683cdf2f23250fe0300344e7a2370?event=Search&source=MCF", "Posted 25 Jul 2026", "MyCareersFuture"],
  ["Fresh Grad / Entry Level Brand Executive", "MAX MARKETING", "Marketing, Sales & Business", "first-job", "https://www.mycareersfuture.gov.sg/job/admin/%F0%9F%8D%80-fresh-grad-entry-level-brand-executive-max-marketing-ca57c13e74835f56b7f9833d3be0c188?event=Search&source=MCF", "Posted 24 Jul 2026", "MyCareersFuture"],
  ["Junior Marketing Associate Needed | Entry Level, Fresh Grad, ORD", "MAX MARKETING", "Marketing, Sales & Business", "first-job", "https://www.mycareersfuture.gov.sg/job/%F0%9F%92%AB-junior-marketing-associate-needed-entry-level-fresh-grad-ord-max-marketing-9f5f818127227f2833533c5c15c7f0c8", "Posted 24 Jul 2026", "MyCareersFuture"],
  ["Start Fresh in Banking - No Experience Needed! (3.6k Basic + Comms)", "Talents Connect", "Banking, Finance, Insurance & Accounting", "first-job", "https://sg.jobstreet.com/job/93457416?origin=cardTitle&ref=search-standalone&type=standard", "Posted 4d ago", "JobStreet SG"],
  ["Staff Nurse (No Experience Required)", "RN Care Pte. Ltd.", "Healthcare, Biomedical & Pharma", "first-job", "https://sg.jobstreet.com/job/93276525?origin=cardTitle&ref=search-standalone&type=standard", "Posted 12d ago", "JobStreet SG"],
  ["Sales Coordinator", "M.C. Packaging Group", "Marketing, Sales & Business", "first-job", "https://sg.jobstreet.com/fresh-graduate-contract-jobs", "Posted 1d ago", "JobStreet SG"],
  ["Inventory Assistant", "Seo Eng Joo Frozen Food Pte Ltd", "Supply Chain, Logistics & Operations", "first-job", "https://sg.jobstreet.com/fresh-graduate-no-experience-jobs/full-time", "Posted 22h ago", "JobStreet SG"],
  ["Business Development Assistant", "Seo Eng Joo Frozen Food Pte Ltd", "Food, Agritech & Consumer Services", "first-job", "https://sg.jobstreet.com/fresh-graduate-no-experience-jobs/full-time", "Posted 21h ago", "JobStreet SG"],
  ["Graduate, Trading", "Leonteq Securities (Singapore)", "Banking, Finance, Insurance & Accounting", "first-job", "https://sg.jobstreet.com/job/93553869", "Posted 1d ago", "JobStreet SG"],
  ["Graduate Sales & Marketing", "Euphoria Organization Pte Ltd", "Marketing, Sales & Business", "first-job", "https://sg.jobstreet.com/job/93554019", "Posted 1d ago", "JobStreet SG"],
  ["Brand Activation & Sales Executive - Hands-On Experience (Entry level)", "ROYAL ORG PTE LTD", "Marketing, Sales & Business", "first-job", "https://sg.jobstreet.com/job/93551382", "Posted 2d ago", "JobStreet SG"],
  ["HR Administrator (Human Resources) - Fresh Graduate are welcome to apply", "PERSONNEL LINK JOBHUB", "Human Resources, Admin & Education", "first-job", "https://www.mycareersfuture.gov.sg/job/human-resources/hr-administrator-fresh-graduate-welcome-apply-personnel-link-jobhub-cee8e3463af6df872dfca436405bfd06", "Posted 24 Jul 2026", "MyCareersFuture"],
  ["Data & AI Engineer", "JCO ANALYTICS", "Technology, AI & Data", "first-job", "https://www.mycareersfuture.gov.sg/job/consulting/data-ai-engineer-jco-analytics-02ed85856a801cc67c8fbdd8ecb220b7?event=Search&source=MCF", "Posted 24 Jul 2026", "MyCareersFuture"],
  ["Brand Activation & Sales Executive - Hands-On Experience (Entry Level)", "ROYAL ORG", "Marketing, Sales & Business", "first-job", "https://www.mycareersfuture.gov.sg/job/marketing/brand-activation-sales-executive-%E2%80%93-hands-on-experience-royal-org-84e8193fb17cc8ede2a60b2956f2606f", "Posted 24 Jul 2026", "MyCareersFuture"],
  ["Science Teacher (Primary / Secondary)", "SEARCH AVENUE", "Science, Research & Academia", "first-job", "https://www.mycareersfuture.gov.sg/job/education-training/science-teacher-search-avenue-c38d7805902cbade8b9a964e910a1d48", "Posted 24 Jul 2026", "MyCareersFuture"],
  ["ACMV Designer", "SQUIRE MECH", "Built Environment, Real Estate & Facilities", "first-job", "https://www.mycareersfuture.gov.sg/job/building-construction/acmv-designer-squire-mech-b2477ca8c5d1cc7e5a6d458fef89d4d3", "Posted 24 Jul 2026", "MyCareersFuture"],
  ["EV Network Development Analyst", "NES GLOBAL", "Energy, Utilities & Sustainability", "first-job", "https://www.mycareersfuture.gov.sg/job/others/ev-network-development-analyst-nes-global-fa08b9ce839defd667450c3d55b34d84", "Posted 24 Jul 2026", "MyCareersFuture"],
  ["Validation Test Engineer (Fresh Graduate Welcome / MNC)", "WANCO MANPOWER PTE LTD", "Engineering, Semiconductor & Manufacturing", "first-job", "https://www.mycareersfuture.gov.sg/job/engineering/validation-test-engineer-wanco-manpower-21870555f50a485aed33dc40700ffff5", "Posted 17 Jul 2026", "MyCareersFuture"],
  ["Software Engineer (Fresh Graduate)", "XIAOMI TECHNOLOGIES SINGAPORE PTE. LTD.", "Technology, AI & Data", "first-job", "https://www.mycareersfuture.gov.sg/job/software-engineer-xiaomi-technologies-singapore-6c2146f7c07598f47117f5334f5cf954", "Posted 15 Jul 2026", "MyCareersFuture"],
  ["Computer Software Engineer (Fresh Graduate)", "XIAOMI TECHNOLOGIES SINGAPORE PTE. LTD.", "Technology, AI & Data", "first-job", "https://www.mycareersfuture.gov.sg/job/engineering/computer-software-engineer-xiaomi-technologies-singapore-a334e7c7e047ee107535d99979b09c8d?event=RecommendedJobJD&source=MCF", "Posted 15 Jul 2026", "MyCareersFuture"],
  ["Marketing Associate (Fresh Grad/Entry Level)", "Above and Beyond Partners", "Marketing, Sales & Business", "first-job", "https://sg.indeed.com/viewjob?jk=da93341c213cfce4", "Live listing", "Indeed Singapore"],
  ["Management Trainee ( Entry Level Welcome )", "Fort Financial Pte. Ltd.", "Banking, Finance, Insurance & Accounting", "first-job", "https://sg.indeed.com/viewjob?jk=2230feb75ed612de", "Live listing", "Indeed Singapore"],
  ["Backend Software Engineer Graduate (Social) - 2026 Start (BS/MS)", "TikTok Pte. Ltd.", "Technology, AI & Data", "first-job", "https://sg.jobstreet.com/it-software-engineer-fresh-graduate-jobs", "Live JobStreet result", "JobStreet SG"],
  ["Accounts Officer", "Axon Management Consultants Pte Ltd", "Banking, Finance, Insurance & Accounting", "first-job", "https://sg.jobstreet.com/fresh-graduate-no-experience-jobs/full-time", "Posted 12d ago", "JobStreet SG"],
].map(([title, company, industry, stage, url, posted, source]) => ({
  title,
  company,
  industry,
  stage,
  source,
  checked: "28 Jul 2026",
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

function sourceSearchLinks(role, stage = "internship") {
  const stageQuery = stage === "first-job"
    ? encodeURIComponent(`${role} fresh graduate entry level`)
    : encodeURIComponent(`${role} internship`);
  const jobStreetQuery = stage === "first-job"
    ? encodeURIComponent(`${role} fresh graduate`)
    : encodeURIComponent(`${role} internship`);
  const sgnQuery = stage === "first-job"
    ? encodeURIComponent(`${role} graduate`)
    : encodeURIComponent(`${role} intern`);

  return [
    ["MyCareersFuture", liveSearchUrl(role, stage)],
    ["Indeed SG", `https://sg.indeed.com/jobs?q=${stageQuery}&sort=date`],
    ["JobStreet SG", `https://sg.jobstreet.com/${jobStreetQuery}-jobs?sortmode=ListedDate`],
    ["Singapore Global Network", `https://jobs.singaporeglobalnetwork.gov.sg/jobs?query=${sgnQuery}${stage === "internship" ? "&internshipOnly=true" : ""}`],
  ];
}

function renderSourceLinks(role, stage) {
  return sourceSearchLinks(role, stage)
    .map(
      ([source, url]) => `<a class="text-button" href="${url}" target="_blank" rel="noreferrer" data-apply-track="live-search" data-role="${role}" data-stage="${stage}" data-source="${source} search">${source}</a>`
    )
    .join("");
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
    marketUpdatedEl.textContent = `Daily refresh marker: ${marketUpdated}. Live source links open current MyCareersFuture, Indeed SG, JobStreet SG, and Singapore Global Network searches.`;
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
              ${renderSourceLinks(item.role, item.stage)}
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

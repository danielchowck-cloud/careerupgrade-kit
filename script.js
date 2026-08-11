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

const marketUpdated = "12 Aug 2026";

const featuredOpenings = [
  ["Financial Intern", "ACE ASCENTIA PTE. LTD.", "Banking, Finance, Insurance & Accounting", "internship", "https://www.mycareersfuture.gov.sg/job/banking-finance/financial-intern-ace-ascentia-b1d79786073e9599b33768f10d2607f7?event=Search&source=MCF", "Posted 11 Aug 2026; closing 25 Aug 2026", "MyCareersFuture"],
  ["Contract / Intern Graphic Designer Assistant", "SAVILLS PROPERTY MANAGEMENT PTE. LTD.", "Design, Media & Communications", "internship", "https://www.mycareersfuture.gov.sg/job/advertising/contract-intern-graphic-designer-assistant-savills-property-management-19f96c59e84fed298a3d62fccbe6d3de?event=Search&source=MCF", "Posted 11 Aug 2026; closing 10 Sep 2026", "MyCareersFuture"],
  ["Intern, Occupational Health & Safety", "Grab", "Healthcare, Biomedical & Pharma", "internship", "https://jobs.singaporeglobalnetwork.gov.sg/jobs?internshipOnly=true", "Posted less than 1 day ago", "Singapore Global Network"],
  ["Teaching & Lab Intern", "ACHIEVERS DREAM LEARNING CENTRE PTE. LTD.", "Science, Research & Academia", "internship", "https://www.mycareersfuture.gov.sg/job/sciences/teaching-lab-intern-achievers-dream-learning-centre-dcf05015f686f1980229a476c65369b9", "Posted 10 Aug 2026; closing 24 Aug 2026", "MyCareersFuture"],
  ["Marine Operations & Technical Support Intern", "HAIDA UNITED MARINE SERVICES PTE. LTD.", "Maritime, Aviation & Transport", "internship", "https://www.mycareersfuture.gov.sg/job/admin/marine-operations-technical-support-intern-haida-united-marine-services-fcc9dc49ebdd0233717d9df277107d28?event=Search&source=MCF", "Posted 10 Aug 2026; closing 24 Aug 2026", "MyCareersFuture"],
  ["Marketing Intern", "Fu Yu Corporation Ltd", "Marketing, Sales & Business", "internship", "https://sg.jobstreet.com/job/93817352", "Listed 06 Aug 2026; posted 3d ago; internship role", "JobStreet SG"],
  ["Intern - Group Health, Safety, Security & Environment", "Sembcorp Industries Ltd", "Energy, Utilities & Sustainability", "internship", "https://sg.jobstreet.com/job/93790840", "Listed 05 Aug 2026; posted 1d ago; internship role", "JobStreet SG"],
  ["Finance Intern (Full Time 6 Months)", "Aramco Trading Singapore", "Banking, Finance, Insurance & Accounting", "internship", "https://sg.indeed.com/viewjob?jk=afac09de12865ccc", "Listed 04 Aug 2026; internship role", "Indeed Singapore"],
  ["Hiring The Ministry Of Football Intern (Part time / Full time)!", "THE MINISTRY OF FOOTBALL PRIVATE LIMITED", "Hospitality, Tourism & Events", "internship", "https://www.mycareersfuture.gov.sg/job/admin/hiring-ministry-football-intern-ministry-football-25d4ba658d2cd2b67f51c2d596963c13?event=Search&source=MCF", "Posted 08 Aug 2026; closing 07 Sep 2026", "MyCareersFuture"],
  ["Intern, Data Analytics, Talent Attraction", "NTUC HEALTH CO-OPERATIVE LTD", "Technology, AI & Data", "internship", "https://www.mycareersfuture.gov.sg/job/intern-data-analytics-talent-attraction-ntuc-health-co-operative-ae70823f5fb946913200e6cbe71898f3", "Posted 07 Aug 2026; closing 06 Sep 2026", "MyCareersFuture"],
  ["Recruitment Intern #TNJHJ", "RECRUIT EXPRESS PTE LTD", "Human Resources, Admin & Education", "internship", "https://www.mycareersfuture.gov.sg/job/human-resources/recruitment-intern-tnjhj-recruit-express-7f96059676709ca889209ae874ef1b8c", "Posted 07 Aug 2026; closing 06 Sep 2026", "MyCareersFuture"],
  ["Brand Marketing Intern, SEA (Role based in Singapore)", "PAULA'S CHOICE SINGAPORE SEA PTE. LTD.", "Marketing, Sales & Business", "internship", "https://www.mycareersfuture.gov.sg/job/events/brand-marketing-intern-sea-paulas-choice-singapore-sea-68ed1632d23e22522d3716937bed5528", "Posted 07 Aug 2026; closing 06 Sep 2026", "MyCareersFuture"],
  ["Product Marketing Intern", "Advance Intelligence Group", "Marketing, Sales & Business", "internship", "https://jobs.singaporeglobalnetwork.gov.sg/jobs/advance-intelligence-group?internshipOnly=true", "Posted 1 day ago", "Singapore Global Network"],
  ["Graduate Intern", "Dell Technologies", "Technology, AI & Data", "internship", "https://jobs.singaporeglobalnetwork.gov.sg/jobs/dell-technologies", "Posted 1 day ago", "Singapore Global Network"],
  ["Intern - Listing Compliance (August 2026 to December 2026)", "SGX", "Legal, Policy, Public Sector & ESG", "internship", "https://sg.indeed.com/viewjob?jk=5d649090c5708ff7", "Crawled 09 Aug 2026; internship role", "Indeed Singapore"],
  ["Internship: Group Human Resources, Talent Acquisition Experience, Talent Sourcing [Aug to Dec 2026]", "OCBC Bank", "Human Resources, Admin & Education", "internship", "https://jobs.singaporeglobalnetwork.gov.sg/jobs/ocbc?internshipOnly=true", "Posted 1 day ago", "Singapore Global Network"],
  ["Industry Consultant Intern (6 Months | $1,600)", "ADECCO PERSONNEL PTE LTD", "Professional Services, Consulting & Advisory", "internship", "https://www.mycareersfuture.gov.sg/job/consulting/industry-consultant-intern-adecco-personnel-31dd315a631272af7a69a607d85c00ec?event=Search&source=MCF", "Posted 06 Aug 2026; closing 05 Sep 2026", "MyCareersFuture"],
  ["Product Intern", "AUGMENTUS PTE. LTD.", "Engineering, Semiconductor & Manufacturing", "internship", "https://www.mycareersfuture.gov.sg/job/engineering/product-intern-augmentus-d5adaf877abab0b2f58b9e091f7d57ba", "Posted 06 Aug 2026; closing 05 Sep 2026", "MyCareersFuture"],
  ["Data Engineer / BI (Intern)", "LHN GROUP PTE. LTD.", "Technology, AI & Data", "internship", "https://www.mycareersfuture.gov.sg/job/information-technology/data-engineer-bi-lhn-group-2d03e87b77042cdbc53598558b49a62e?event=Search&source=MCF", "Posted 05 Aug 2026; closing 04 Sep 2026", "MyCareersFuture"],
  ["Intern (Human Capital)", "YTL POWERSERAYA PTE. LIMITED", "Human Resources, Admin & Education", "internship", "https://www.mycareersfuture.gov.sg/job/others/intern-ytl-powerseraya-43b91ed89d0bfe8db61cc569ca172e37?event=Search&source=MCF", "Posted 05 Aug 2026; closing 04 Sep 2026", "MyCareersFuture"],
  ["Video Editor Intern", "CINTRA CONSULTANCY PTE. LTD.", "Design, Media & Communications", "internship", "https://www.mycareersfuture.gov.sg/job/advertising/video-editor-intern-cintra-consultancy-f3bcfd55234864a3cfc1c098dcef954b", "Posted 05 Aug 2026; closing 04 Sep 2026", "MyCareersFuture"],
  ["Social Service Intern (Active Ageing Centre)", "REACH COMMUNITY SERVICES LTD.", "Social Services, Non-Profit & Community", "internship", "https://www.mycareersfuture.gov.sg/job/social-services/social-service-intern-reach-community-services-ab7d8d05d4d6663678ef0145f0f56072?event=Search&source=MCF", "Posted 05 Aug 2026; closing 04 Sep 2026", "MyCareersFuture"],
  ["Creative Content & Social Media Intern", "KINRY FOOD INGREDIENTS PTE. LTD.", "Design, Media & Communications", "internship", "https://www.mycareersfuture.gov.sg/job/design/creative-content-social-media-intern-kinry-food-ingredients-e3dab2d44c44461ce101ab49c85d581d", "Posted 05 Aug 2026; closing 04 Sep 2026", "MyCareersFuture"],
  ["Business Development Intern", "ANYWHEEL PTE. LTD.", "Marketing, Sales & Business", "internship", "https://www.mycareersfuture.gov.sg/job/marketing/business-development-intern-anywheel-13aa3d4508ca035399195e64682a614c?event=Search&source=MCF", "Posted 05 Aug 2026; closing 04 Sep 2026", "MyCareersFuture"],
  ["Investment Analyst Intern [Path to Full Time Offer]", "SILVERSTREAK ANALYTICS PTE. LTD.", "Banking, Finance, Insurance & Accounting", "internship", "https://www.mycareersfuture.gov.sg/job/banking-finance/investment-analyst-intern-path-full-time-offer-silverstreak-analytics-b24ba1ce993db0b38b3fa879d28670f0?event=Search&source=MCF", "Posted 03 Aug 2026; closing 17 Aug 2026", "MyCareersFuture"],
  ["Quantitative Research Intern", "FRAGMENT WORKS PTE. LTD.", "Technology, AI & Data", "internship", "https://www.mycareersfuture.gov.sg/job/information-technology/quantitative-research-intern-fragment-works-f114cba55a2cec520ab249a7f2479bdd?event=RecommendedJobJD&source=MCF", "Posted 31 Jul 2026; closing 30 Aug 2026", "MyCareersFuture"],
  ["Intern - Language Research & AI Training", "X STAR TECHNOLOGY PTE. LTD.", "Technology, AI & Data", "internship", "https://www.mycareersfuture.gov.sg/job/others/intern-language-research-ai-training-x-star-technology-ffd7f6a4513dce952e29b32835764bc9?event=Search&source=MCF", "Posted 04 Aug 2026; closing 03 Sep 2026", "MyCareersFuture"],
  ["Business Development Intern", "FOMO PAY PTE. LTD.", "Professional Services, Consulting & Advisory", "internship", "https://www.mycareersfuture.gov.sg/job/professional-services/business-development-intern-fomo-pay-3d2a316ea9fa2339620d0deb2ddf9a4b?event=RecommendedJobJD&source=MCF", "Posted 03 Aug 2026; closing 02 Sep 2026", "MyCareersFuture"],
  ["Content Marketing (Internship / Part-time)", "YOTCHA LLP", "Design, Media & Communications", "internship", "https://www.mycareersfuture.gov.sg/job/advertising/content-marketing-yotcha-cc729176738931d40ffe13a04f70853a", "Posted 04 Aug 2026; closing 03 Sep 2026", "MyCareersFuture"],
  ["Editorial Intern", "CONFIRM GOOD PTE. LTD.", "Design, Media & Communications", "internship", "https://www.mycareersfuture.gov.sg/job/advertising/editorial-intern-confirm-good-4c301a7c6abac0ed3d7e72d4d71c1371", "Posted 27 Jul 2026; closing 26 Aug 2026", "MyCareersFuture"],
  ["Marketing & Events Coordinator Intern", "YY CIRCLE (SG) PRIVATE LIMITED", "Marketing, Sales & Business", "internship", "https://www.mycareersfuture.gov.sg/job/marketing/marketing-events-coordinator-intern-yy-circle-2b102dde37fab996fbbc3e9deb16d01f?event=Search&source=MCF", "Posted 03 Aug 2026; closing 02 Sep 2026", "MyCareersFuture"],
  ["Marketing Intern", "JR FOODS PTE. LTD.", "Food, Agritech & Consumer Services", "internship", "https://www.mycareersfuture.gov.sg/job/marketing/marketing-intern-jr-foods-e0e9d41ee08d88da57bb3a01958cea55", "Posted 03 Aug 2026; closing 02 Sep 2026", "MyCareersFuture"],
  ["HR Intern (3 to 6 months)", "INTERNATIONAL SOS SINGAPORE PTE. LTD.", "Human Resources, Admin & Education", "internship", "https://www.mycareersfuture.gov.sg/job/human-resources/hr-intern-international-sos-singapore-28ae35249634df3d0f2eb5000aa72b7c?event=RecommendedJobJD&source=MCF", "Posted 03 Aug 2026; closing 02 Sep 2026", "MyCareersFuture"],
  ["Internship, HR Assistant (Medical Industry) - 3 months, 6 months", "HCT RECRUIT EXPRESS PTE. LTD.", "Healthcare, Biomedical & Pharma", "internship", "https://www.mycareersfuture.gov.sg/job/human-resources/internship-hr-assistant-%E2%80%93-3-months-6-months-hct-recruit-express-caa5d8ed77c4fbd82d50270dcfa80765?event=Search&source=MCF", "Posted 03 Aug 2026; closing 02 Sep 2026", "MyCareersFuture"],
  ["Strategy & Market Research Internship", "Global Angle Pte Ltd", "Professional Services, Consulting & Advisory", "internship", "https://sg.jobstreet.com/job/93093735", "Listed 02 Jul 2026; job period from Aug 2026", "JobStreet SG"],
  ["Marketing & Communications Intern", "The Red Pencil (Singapore)", "Social Services, Non-Profit & Community", "internship", "https://sg.jobstreet.com/job/93403924", "Listed Jul 2026; preferred start second week of Aug 2026", "JobStreet SG"],
  ["Intern or Part-Time, Restructuring and Insolvency", "Alvarez & Marsal", "Professional Services, Consulting & Advisory", "internship", "https://sg.indeed.com/viewjob?jk=fcb70b855a13c902", "Date posted 04 Aug 2026", "Indeed Singapore"],
  ["Business Development (Merchant Development) Intern", "FoodLine", "Retail, FMCG & E-Commerce", "internship", "https://sg.indeed.com/viewjob?jk=39b3b388e4dd331c", "Posted 01 Aug 2026", "Indeed Singapore"],
  ["Intern, Business Relationship Management, ESG product, Singapore", "FITCH RATINGS", "Legal, Policy, Public Sector & ESG", "internship", "https://sg.indeed.com/viewjob?jk=d4ffc45c81b9e67e", "Posted 15 Jul 2026", "Indeed Singapore"],
  ["Risk System Project Delivery Intern (Aug to Feb 2027)", "UOB", "Banking, Finance, Insurance & Accounting", "internship", "https://jobs.singaporeglobalnetwork.gov.sg/jobs/uob?internshipOnly=true", "Posted 4 days ago", "Singapore Global Network"],
  ["Private Bank Intern (Aug - Dec 2026)", "UOB", "Banking, Finance, Insurance & Accounting", "internship", "https://jobs.singaporeglobalnetwork.gov.sg/jobs/uob?internshipOnly=true", "Posted last week", "Singapore Global Network"],
  ["Commercial Banking Credit Intern (Jan 2027-May 2027)", "UOB", "Banking, Finance, Insurance & Accounting", "internship", "https://jobs.singaporeglobalnetwork.gov.sg/jobs/uob?internshipOnly=true", "Posted 5 days ago", "Singapore Global Network"],
  ["Software & DevOps Engineer (Fresh Graduate Welcome)", "TALENTSIS PTE. LTD.", "Technology, AI & Data", "first-job", "https://www.mycareersfuture.gov.sg/job/engineering/software-devops-engineer-talentsis-652e6bcf768c4ecdae2a43d4e88f63ce", "Posted 06 Aug 2026; closing 05 Sep 2026", "MyCareersFuture"],
  ["Engineering Assistant - MNC (Service / Entry Level) #HZO", "RECRUIT EXPRESS PTE LTD", "Engineering, Semiconductor & Manufacturing", "first-job", "https://www.mycareersfuture.gov.sg/job/engineering/engineering-assistant-mnc-hzo-recruit-express-1a491825ca58e95ca4f9d07c7bbd7bc4?event=Search&source=MCF", "Posted 11 Aug 2026; closing 10 Sep 2026", "MyCareersFuture"],
  ["Quantity Surveyor (Tender)", "SB PROCUREMENT PTE. LTD.", "Built Environment, Real Estate & Facilities", "first-job", "https://www.mycareersfuture.gov.sg/job/building-construction/quantity-surveyor-sb-procurement-cc6ceb5ec1a142e5eb483c519b0c4f62", "Posted 11 Aug 2026; closing 10 Sep 2026; fresh graduates welcome", "MyCareersFuture"],
  ["Fresh Graduate Opportunity - Sales & Marketing Executive", "ASCEND MARKETING SOLUTIONS PTE. LTD.", "Marketing, Sales & Business", "first-job", "https://www.mycareersfuture.gov.sg/job/marketing/fresh-graduate-opportunity-%E2%80%93-sales-marketing-executive-ascend-marketing-solutions-32a37d82e4438673995dedbcfbfa2a85", "Posted 10 Aug 2026; closing 17 Aug 2026", "MyCareersFuture"],
  ["Fresh Graduate Opportunity - Financial Services Consultant", "ET MARKETING", "Banking, Finance, Insurance & Accounting", "first-job", "https://www.mycareersfuture.gov.sg/job/banking-finance/fresh-graduate-opportunity-%E2%80%93-financial-services-consultant-et-marketing-af70243c1cc4c8634e87a7e2fbe6d0de", "Posted 03 Aug 2026; closing 02 Sep 2026", "MyCareersFuture"],
  ["Software Engineer (Fresh Graduate)", "Xiaomi Technologies Singapore", "Technology, AI & Data", "first-job", "https://www.mycareersfuture.gov.sg/job/software-engineer-xiaomi-technologies-singapore-6c2146f7c07598f47117f5334f5cf954", "Posted 15 Jul 2026; closing 14 Aug 2026", "MyCareersFuture"],
  ["Senior / Chemist", "Singapore Refining Company Private Limited (SRC)", "Science, Research & Academia", "first-job", "https://sg.indeed.com/viewjob?jk=90aa821d448fd00f", "Entry level; closing 16 Aug 2026", "Indeed Singapore"],
  ["[Fresh Graduates] Financial Services Consultant", "PLACEMENT PROFESSIONALS", "Banking, Finance, Insurance & Accounting", "first-job", "https://www.mycareersfuture.gov.sg/job/banking-finance/fresh-graduates-financial-services-consultant-placement-professionals-8e8f95f88d4b848753a1865620c7bcb2", "Posted 08 Aug 2026; closing 07 Sep 2026", "MyCareersFuture"],
  ["(ENTRY LEVEL) Junior Campaign Executive", "ASCEND MARKETING SOLUTIONS PTE. LTD.", "Marketing, Sales & Business", "first-job", "https://www.mycareersfuture.gov.sg/job/marketing/junior-campaign-executive-ascend-marketing-solutions-f67792b10f5f35c19c0cb7a3410ff53d?event=Search&source=MCF", "Posted 08 Aug 2026; fresh/entry level", "MyCareersFuture"],
  ["Service Engineer x2, Basic $2800-$3500+$500, Fresh Experience Welcome", "ATOMRECRUIT PTE. LTD.", "Engineering, Semiconductor & Manufacturing", "first-job", "https://www.mycareersfuture.gov.sg/job/engineering/service-engineerx2-basic-2800-3500500-fresh-experience-welcome-atomrecruit-2b918c44bbb829d94c3616cf70c2c289?event=Search&source=MCF", "Posted 08 Aug 2026; closing 15 Aug 2026", "MyCareersFuture"],
  ["Events Management [No exp required]", "ROYAL ORG PTE. LTD.", "Hospitality, Tourism & Events", "first-job", "https://www.mycareersfuture.gov.sg/job/marketing/events-management-no-exp-required-royal-org-57bb98005a57ffdefbb29c9b10e982b2?event=Search&source=MCF", "Posted 08 Aug 2026; closing 22 Aug 2026", "MyCareersFuture"],
  ["Pharma MNC - Biotechnologist (Training provided) #HTJ", "RECRUIT EXPRESS PTE LTD", "Healthcare, Biomedical & Pharma", "first-job", "https://www.mycareersfuture.gov.sg/job/pharma-mnc-biotechnologist-htj-recruit-express-0f774eb7c1044bf616909b7a16b914c0", "Posted 08 Aug 2026; closing 07 Sep 2026", "MyCareersFuture"],
  ["Fresh Graduates Welcome | Business Development Executive", "PrecisionWorks", "Marketing, Sales & Business", "first-job", "https://sg.jobstreet.com/job/93721694", "Posted 6d ago; fresh graduates welcome", "JobStreet SG"],
  ["Sales & Customer Account Engineer / Project Engineer (Fresh Graduates Welcome)", "Racer Technology Pte Ltd", "Engineering, Semiconductor & Manufacturing", "first-job", "https://sg.jobstreet.com/job/93574393", "Posted 13d ago; entry-level candidates welcome", "JobStreet SG"],
  ["Assistant Manager / Executive, Property Management (2-Years Contract)", "CapitaLand", "Built Environment, Real Estate & Facilities", "first-job", "https://jobs.singaporeglobalnetwork.gov.sg/jobs/capitaland", "Posted 1 day ago", "Singapore Global Network"],
  ["Customer Experience / Client Relations Executive", "AURUM M CAPITAL", "Hospitality, Tourism & Events", "first-job", "https://www.mycareersfuture.gov.sg/job/admin/customer-experience-client-relations-executive-aurum-m-capital-0e588b6163b888370ec2e0bb8a4663e5", "Posted 08 Aug 2026; closing 07 Sep 2026", "MyCareersFuture"],
  ["IT Engineer (Open to Fresh Graduates)", "TALENTSIS PTE. LTD.", "Technology, AI & Data", "first-job", "https://www.mycareersfuture.gov.sg/job/information-technology/engineer-talentsis-5020f312efa67d085deb78927925e080?event=Search&source=MCF", "Posted 05 Aug 2026; closing 04 Sep 2026", "MyCareersFuture"],
  ["Quantity Surveyor #79863", "ANRADUS PTE. LTD.", "Built Environment, Real Estate & Facilities", "first-job", "https://www.mycareersfuture.gov.sg/job/building-construction/quantity-surveyor-79863-anradus-00c63defd01ca2e76718d1b940dfee2f", "Posted 06 Aug 2026; fresh/entry level", "MyCareersFuture"],
  ["Sales Associate Trainee (Open To Fresh Graduates, 1 Year Fixed Term Contract)", "BECTON DICKINSON HOLDINGS PTE. LTD.", "Retail, FMCG & E-Commerce", "first-job", "https://www.mycareersfuture.gov.sg/job/sales/sales-associate-trainee-becton-dickinson-holdings-f59d9640377383745a6623ed64a2a18e?event=Search&source=MCF", "Posted 05 Aug 2026; closing 04 Sep 2026", "MyCareersFuture"],
  ["Fresh Graduate Sales & Marketing", "ZENVORA NOVA ENTERPRISE", "Marketing, Sales & Business", "first-job", "https://www.mycareersfuture.gov.sg/job/advertising/fresh-graduate-%F0%9F%A7%91%E2%80%8D%F0%9F%8E%93-sales-marketing-zenvora-nova-enterprise-cb5b3a8d67d57c44e41219c42fc43a73?event=RecommendedJobJD&source=MCF", "Posted 03 Aug 2026; closing 17 Aug 2026", "MyCareersFuture"],
  ["Site Engineer (Fresh Graduate)", "RICH CONSTRUCTION COMPANY PTE. LTD.", "Built Environment, Real Estate & Facilities", "first-job", "https://www.mycareersfuture.gov.sg/job/building-construction/site-engineer-rich-construction-company-49e902e5ad378fd349be35820f3cb734?event=RecommendedJobJD&source=MCF", "Posted 03 Aug 2026; closing 17 Aug 2026", "MyCareersFuture"],
  ["Events Customer Service (Sales) (Entry Level)", "EMINENCE ORGANIZATION PTE. LTD.", "Hospitality, Tourism & Events", "first-job", "https://www.mycareersfuture.gov.sg/job/consulting/%F0%9F%8C%88-events-customer-service-%F0%9F%8C%88-eminence-organization-a8330ba9bc53d2c20d8f56a93a6a43c1", "Posted 04 Aug 2026; fresh/entry level", "MyCareersFuture"],
  ["Sales Representative (Entry-level, Travel Opportunities)", "ROYAL ORG PTE. LTD.", "Marketing, Sales & Business", "first-job", "https://www.mycareersfuture.gov.sg/job/marketing/sales-representative-royal-org-6c7b648474b81fb116bca3d563f95e32", "Posted 04 Aug 2026; closing 03 Sep 2026", "MyCareersFuture"],
  ["Business Development Associate", "ONE PERCENT SG PTE. LTD.", "Marketing, Sales & Business", "first-job", "https://www.mycareersfuture.gov.sg/job/marketing/business-development-associate-one-percent-sg-815b27ebbbfaeac1fbe42019f9e327cf?event=Search&source=MCF", "Posted 04 Aug 2026; closing 03 Sep 2026", "MyCareersFuture"],
  ["Customer Experience Specialist", "AVARON PTE. LTD.", "Hospitality, Tourism & Events", "first-job", "https://www.mycareersfuture.gov.sg/job/customer-service/customer-experience-specialist-avaron-4147207e9bc1379176ea2d2ac2813168", "Posted 04 Aug 2026; fresh/entry level", "MyCareersFuture"],
  ["Backend Engineer Graduate (Search Architecture) - 2026 Start (BS / MS)", "BYTEDANCE PTE. LTD.", "Technology, AI & Data", "first-job", "https://www.mycareersfuture.gov.sg/job/information-technology/backend-engineer-graduate-2026-start-bytedance-ab8abcbe73e29af5facfce3c64fe1fc3", "Posted 25 Jul 2026; graduate role", "MyCareersFuture"],
  ["Network Engineer (Fresh Graduate)", "EXORDIOR TECHNOLOGIES PTE. LTD.", "Technology, AI & Data", "first-job", "https://sg.indeed.com/viewjob?jk=ef8d09bcb22ba8c3", "Full-time fresh-graduate listing crawled 09 Aug 2026", "Indeed Singapore"],
  ["Software DevOps Engineer (Fresh Graduate)", "TALENTSIS PTE. LTD.", "Technology, AI & Data", "first-job", "https://www.mycareersfuture.gov.sg/job/engineering/software-devops-engineer-talentsis-04762bfd9400720bfd45f6f5ae10037f", "Fresh graduate; crawled today", "MyCareersFuture"],
  ["Business Analyst / Junior Consultant", "SCIENTE INTERNATIONAL PTE. LTD.", "Professional Services, Consulting & Advisory", "first-job", "https://www.mycareersfuture.gov.sg/job/business-analyst-sciente-international-e22e77d6af432df28b66590c6b533d89", "Fresh/entry level; crawled yesterday", "MyCareersFuture"],
  ["Assistant Editor (PhD Graduates)", "MDPI PTE. LTD.", "Science, Research & Academia", "first-job", "https://www.mycareersfuture.gov.sg/job/sciences/assistant-editor-mdpi-f1fee2f03b4bf70e5c2d62287e8ffbfb", "Fresh/entry level; crawled today", "MyCareersFuture"],
  ["Commercial Graduate Programme", "RWE Supply & Trading Asia-Pacific Pte. Ltd.", "Energy, Utilities & Sustainability", "first-job", "https://sg.indeed.com/viewjob?jk=8adcd9cc25a260b7", "Application deadline 16 Aug 2026; start date Sep 2027", "Indeed Singapore"],
  ["Finance Specialist (Fresh Graduate/Entry-level)", "BITMAIN DEVELOPMENT PTE. LTD.", "Banking, Finance, Insurance & Accounting", "first-job", "https://sg.indeed.com/viewjob?jk=34469d6b0611584d", "Full-time fresh-graduate listing crawled today", "Indeed Singapore"],
  ["Tax Specialist (Fresh Graduate/Entry-level)", "BITMAIN DEVELOPMENT PTE. LTD.", "Banking, Finance, Insurance & Accounting", "first-job", "https://sg.indeed.com/viewjob?jk=59fdc4fcaf19a904", "Permanent fresh-graduate listing crawled 5 days ago", "Indeed Singapore"],
  ["Management Trainee (Fresh Graduate Programme)", "AIA Group Limited", "Banking, Finance, Insurance & Accounting", "first-job", "https://sg.indeed.com/viewjob?jk=6aa6f0fa9a904abf", "Fresh graduate programme crawled 2 days ago", "Indeed Singapore"],
  ["AI Algorithm Engineer (Entry-Level / Fresh Graduates)", "Reolink", "Technology, AI & Data", "first-job", "https://sg.indeed.com/viewjob?jk=d46495c2d6efdfd4", "Fresh graduate listing crawled 3 days ago", "Indeed Singapore"],
  ["Management Trainee (Entry Level Welcome)", "Fort Financial Pte. Ltd.", "Banking, Finance, Insurance & Accounting", "first-job", "https://sg.indeed.com/viewjob?jk=2230feb75ed612de", "Permanent fresh-graduate listing crawled 5 days ago", "Indeed Singapore"],
  ["Client Success's Associates", "Private Advertiser", "Marketing, Sales & Business", "first-job", "https://sg.jobstreet.com/job/93732332", "Listed 1h ago; fresh graduates welcome", "JobStreet SG"],
  ["Warehouse Executive / Warehouse Customer Service Executive ID6120", "Job Express Services Pte Ltd", "Supply Chain, Logistics & Operations", "first-job", "https://sg.jobstreet.com/Job-Express-Services-jobs/in-Kaki-Bukit-East-Region", "Listed 5 days ago; fresh graduates welcome", "JobStreet SG"],
  ["Accounts Executive / Assistant", "Mavenside Consulting Pte. Ltd.", "Banking, Finance, Insurance & Accounting", "first-job", "https://sg.jobstreet.com/job-in-kaki-bukit-jobs/in-Tai-Seng-North%2BEast-Region", "Listed 2 days ago; fresh graduates welcome", "JobStreet SG"],
  ["Community Content Designer", "Razer", "Design, Media & Communications", "first-job", "https://jobs.singaporeglobalnetwork.gov.sg/jobs/razer", "Posted 2 days ago", "Singapore Global Network"],
  ["Associate Researcher / Researcher, R&D", "Procter & Gamble Co.", "Science, Research & Academia", "first-job", "https://jobs.singaporeglobalnetwork.gov.sg/jobs/procter-gamble", "Posted 4 days ago", "Singapore Global Network"],
].map(([title, company, industry, stage, url, posted, source]) => ({
  title,
  company,
  industry,
  stage,
  source,
  checked: "12 Aug 2026",
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

  const jobStreetPath = stage === "first-job"
    ? "fresh-graduate-entry-level-jobs"
    : "internship-jobs";

  return [
    ["MyCareersFuture", liveSearchUrl(role, stage)],
    ["Indeed SG", `https://sg.indeed.com/jobs?q=${stageQuery}&l=Singapore&sort=date`],
    ["JobStreet SG", `https://sg.jobstreet.com/${jobStreetPath}?keywords=${jobStreetQuery}&sortmode=ListedDate`],
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

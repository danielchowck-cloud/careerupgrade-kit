const targetData = [
  ["Technology, AI & Data", "Software Engineering Intern", "internship", "Projects, GitHub, coding tests, teamwork evidence"],
  ["Technology, AI & Data", "Data Analytics Intern", "internship", "Excel, SQL, Python, dashboards, business insight"],
  ["Technology, AI & Data", "AI / ML Intern", "internship", "Model projects, Python, data cleaning, experimentation"],
  ["Technology, AI & Data", "Cybersecurity Intern", "internship", "Security fundamentals, labs, incident thinking"],
  ["Technology, AI & Data", "Product Analyst Intern", "internship", "User research, metrics, product thinking"],
  ["Technology, AI & Data", "Junior Data Analyst", "first-job", "SQL, dashboards, reporting, communication"],
  ["Banking, Finance & Accounting", "Investment Banking Intern", "internship", "Financial modelling, research, deal awareness"],
  ["Banking, Finance & Accounting", "Wealth Management Intern", "internship", "Client service, markets interest, communication"],
  ["Banking, Finance & Accounting", "Risk & Compliance Intern", "internship", "Regulation, controls, documentation, judgement"],
  ["Banking, Finance & Accounting", "Audit / Accounting Associate", "first-job", "Accounting modules, Excel, detail orientation"],
  ["Engineering, Semiconductor & Manufacturing", "Mechanical Engineering Intern", "internship", "CAD, design projects, problem solving"],
  ["Engineering, Semiconductor & Manufacturing", "Semiconductor Process Intern", "internship", "Process thinking, lab work, data discipline"],
  ["Engineering, Semiconductor & Manufacturing", "Quality Engineering Intern", "internship", "Root cause, documentation, test evidence"],
  ["Engineering, Semiconductor & Manufacturing", "Graduate Engineer", "first-job", "Technical projects, safety, execution reliability"],
  ["Supply Chain, Logistics & Operations", "Procurement Intern", "internship", "Supplier research, negotiation, Excel tracking"],
  ["Supply Chain, Logistics & Operations", "Supply Chain Analyst Intern", "internship", "Forecasting, inventory, data analysis"],
  ["Supply Chain, Logistics & Operations", "Operations Executive", "first-job", "Execution, follow-up, cross-team communication"],
  ["Marketing, Sales & Business", "Digital Marketing Intern", "internship", "Campaigns, analytics, content, audience insight"],
  ["Marketing, Sales & Business", "Business Development Intern", "internship", "Prospecting, research, communication, follow-up"],
  ["Marketing, Sales & Business", "Sales Coordinator", "first-job", "Customer follow-up, quotations, reporting"],
  ["Healthcare, Biomedical & Pharma", "Biomedical Science Intern", "internship", "Lab skills, documentation, research discipline"],
  ["Healthcare, Biomedical & Pharma", "Healthcare Admin Executive", "first-job", "Service mindset, records, operational accuracy"],
  ["Hospitality, Tourism & Events", "Hotel Operations Intern", "internship", "Guest service, shift reliability, problem handling"],
  ["Hospitality, Tourism & Events", "Events Management Intern", "internship", "Vendor coordination, timelines, on-site execution"],
  ["Human Resources, Admin & Education", "HR Intern", "internship", "Recruitment coordination, confidentiality, people skills"],
  ["Human Resources, Admin & Education", "Education Programme Intern", "internship", "Teaching support, programme coordination"],
  ["Legal, Policy, Public Sector & ESG", "Legal Intern", "internship", "Research, drafting, precision, confidentiality"],
  ["Legal, Policy, Public Sector & ESG", "Sustainability / ESG Intern", "internship", "Reporting, research, metrics, stakeholder work"],
  ["Design, Media & Communications", "Graphic Design Intern", "internship", "Portfolio, visual judgment, client feedback"],
  ["Design, Media & Communications", "Content Marketing Intern", "internship", "Writing samples, social content, analytics"],
].map(([industry, role, stage, evidence]) => ({ industry, role, stage, evidence }));

const params = new URLSearchParams(window.location.search);
const source = params.get("src") || params.get("source") || "direct";
const form = document.querySelector(".lead-form");
const checkerStage = document.querySelector("#checker-stage");
const checkerIndustry = document.querySelector("#checker-industry");
const checkerRole = document.querySelector("#checker-role");
const checkerResume = document.querySelector("#checker-resume");
const checkerLinkedin = document.querySelector("#checker-linkedin");
const checkerCover = document.querySelector("#checker-cover");
const finderStage = document.querySelector("#finder-stage");
const finderIndustry = document.querySelector("#finder-industry");
const finderRole = document.querySelector("#finder-role");
const listingGrid = document.querySelector("#listing-grid");
const resultsEmpty = document.querySelector("#results-empty");
const targetPath = document.querySelector("#target-path");
const requestStage = document.querySelector("#request-stage");

document.querySelector('input[name="source"]').value = source;
document.querySelector('input[name="page_url"]').value = window.location.href;
document.querySelector('input[name="referrer"]').value = document.referrer || "none";

function unique(values) {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b));
}

function scoreValue(value) {
  return { weak: 16, medium: 26, strong: 34 }[value] || 16;
}

function selectedCheckerTarget() {
  return targetData.find((item) => item.role === checkerRole.value) || targetData[1];
}

function scoreCopy(score) {
  if (score >= 82) {
    return {
      title: "Strong base. Now make it target-specific.",
      copy: "Your materials look prepared. The next step is polishing role keywords, evidence, and interview stories for the exact opportunity.",
    };
  }

  if (score >= 62) {
    return {
      title: "Good direction, but not fully application-ready.",
      copy: "You likely need targeted resume bullets, stronger LinkedIn positioning, and a more specific cover-letter angle before applying.",
    };
  }

  return {
    title: "You have a target, but your application is not ready yet.",
    copy: "Start with resume and LinkedIn rewriting before applying. A stronger application can improve screening chances before interview stage.",
  };
}

function updateChecker() {
  const target = selectedCheckerTarget();
  const score = Math.min(96, 10 + scoreValue(checkerResume.value) + scoreValue(checkerLinkedin.value) + scoreValue(checkerCover.value));
  const ats = Math.min(96, score + (checkerResume.value === "strong" ? 5 : -4));
  const linkedin = Math.min(96, score + (checkerLinkedin.value === "strong" ? 4 : -8));
  const interview = Math.min(96, score + (checkerCover.value === "strong" ? 2 : -2));
  const content = scoreCopy(score);

  document.querySelector("#hero-target").textContent = target.role;
  document.querySelector("#hero-score").textContent = `${score}%`;
  document.querySelector("#hero-ats").textContent = `${ats}%`;
  document.querySelector("#hero-linkedin").textContent = `${linkedin}%`;
  document.querySelector("#hero-interview").textContent = `${interview}%`;
  document.querySelector("#hero-action").textContent = `Prepare evidence for ${target.evidence.toLowerCase()}.`;
  document.querySelector("#preview-score").textContent = `${score}%`;
  document.querySelector("#preview-title").textContent = content.title;
  document.querySelector("#preview-copy").textContent = content.copy;
}

function populateSelect(select, values, placeholder) {
  select.innerHTML = `<option value="">${placeholder}</option>${values.map((value) => `<option>${value}</option>`).join("")}`;
}

function rolesForIndustry(industry, stage = "") {
  return unique(
    targetData
      .filter((item) => (!industry || item.industry === industry) && (!stage || item.stage === stage))
      .map((item) => item.role)
  );
}

function populateChecker() {
  const industries = unique(targetData.map((item) => item.industry));
  populateSelect(checkerIndustry, industries, "Select industry");
  checkerIndustry.value = "Technology, AI & Data";
  populateSelect(checkerRole, rolesForIndustry(checkerIndustry.value), "Select role");
  checkerRole.value = "Data Analytics Intern";
  updateChecker();
}

function populateFinder() {
  populateSelect(finderIndustry, unique(targetData.map((item) => item.industry)), "Select industry");
}

function updateFinderRoles() {
  populateSelect(finderRole, rolesForIndustry(finderIndustry.value, finderStage.value), "Select role");
}

function filteredTargets() {
  if (!finderStage.value || !finderIndustry.value || !finderRole.value) {
    return [];
  }

  return targetData.filter(
    (item) => item.stage === finderStage.value && item.industry === finderIndustry.value && item.role === finderRole.value
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
          <p>${item.stage === "first-job" ? "Fresh graduate first-job" : "Internship"} target. We review resume, LinkedIn, cover-letter angle, and interview story against this role.</p>
          <p><strong>Evidence to prepare:</strong> ${item.evidence}.</p>
          <div class="listing-actions">
            <button class="text-button use-target" data-stage="${item.stage}" data-role="${item.role}" type="button">Use this target</button>
            <a class="button primary" href="#request">Request help</a>
          </div>
        </article>
      `
    )
    .join("");
}

checkerIndustry.addEventListener("change", () => {
  populateSelect(checkerRole, rolesForIndustry(checkerIndustry.value), "Select role");
  checkerRole.selectedIndex = 1;
  updateChecker();
});

[checkerStage, checkerRole, checkerResume, checkerLinkedin, checkerCover].forEach((select) => {
  select.addEventListener("change", updateChecker);
});

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

  targetPath.value = button.dataset.role;
  requestStage.value = button.dataset.stage === "first-job"
    ? "Fresh graduate applying for first job"
    : "Current student applying for internships";
  document.querySelector("#request").scrollIntoView({ behavior: "smooth", block: "start" });
});

form.addEventListener("submit", () => {
  const name = form.elements.name.value.trim() || "New applicant";
  const timestamp = new Date().toLocaleString("en-SG", {
    timeZone: "Asia/Singapore",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  form.elements._subject.value = `CareerUpgrade Kit paid beta request - ${name} - ${timestamp}`;
});

populateChecker();
populateFinder();
renderListings();

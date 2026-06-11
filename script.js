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
const listingTargets = [
  ["Technology, AI & Data", "Software Engineering Intern", "internship", "Projects, GitHub, coding tests, teamwork evidence"],
  ["Technology, AI & Data", "Data Analytics Intern", "internship", "Excel, SQL, Python, dashboards, business insight"],
  ["Technology, AI & Data", "AI / ML Intern", "internship", "Model projects, Python, data cleaning, experimentation"],
  ["Technology, AI & Data", "Cybersecurity Intern", "internship", "Security fundamentals, labs, incident thinking"],
  ["Technology, AI & Data", "Product Analyst Intern", "internship", "User research, metrics, product thinking"],
  ["Banking, Finance & Accounting", "Investment Banking Intern", "internship", "Financial modelling, research, deal awareness"],
  ["Banking, Finance & Accounting", "Wealth Management Intern", "internship", "Client service, markets interest, communication"],
  ["Banking, Finance & Accounting", "Risk & Compliance Intern", "internship", "Regulation, controls, documentation, judgement"],
  ["Banking, Finance & Accounting", "Finance Operations Intern", "internship", "Accuracy, reconciliation, process discipline"],
  ["Banking, Finance & Accounting", "Audit / Accounting Associate", "first-job", "Accounting modules, Excel, detail orientation"],
  ["Engineering, Semiconductor & Manufacturing", "Mechanical Engineering Intern", "internship", "CAD, design projects, problem solving"],
  ["Engineering, Semiconductor & Manufacturing", "Semiconductor Process Intern", "internship", "Process thinking, lab work, data discipline"],
  ["Engineering, Semiconductor & Manufacturing", "Manufacturing Excellence Intern", "internship", "Lean, process mapping, improvement mindset"],
  ["Engineering, Semiconductor & Manufacturing", "Quality Engineering Intern", "internship", "Root cause, documentation, test evidence"],
  ["Engineering, Semiconductor & Manufacturing", "Graduate Engineer", "first-job", "Technical projects, safety, execution reliability"],
  ["Supply Chain, Logistics & Operations", "Procurement Intern", "internship", "Supplier research, negotiation, Excel tracking"],
  ["Supply Chain, Logistics & Operations", "Supply Chain Analyst Intern", "internship", "Forecasting, inventory, data analysis"],
  ["Supply Chain, Logistics & Operations", "Operations Excellence Intern", "internship", "Process improvement, coordination, reporting"],
  ["Supply Chain, Logistics & Operations", "Logistics Planning Intern", "internship", "Planning, routing, stakeholder coordination"],
  ["Supply Chain, Logistics & Operations", "Operations Executive", "first-job", "Execution, follow-up, cross-team communication"],
  ["Marketing, Sales & Business", "Digital Marketing Intern", "internship", "Campaigns, analytics, content, audience insight"],
  ["Marketing, Sales & Business", "Business Development Intern", "internship", "Prospecting, research, communication, follow-up"],
  ["Marketing, Sales & Business", "Product Marketing Intern", "internship", "Positioning, competitor research, launch support"],
  ["Marketing, Sales & Business", "Market Research Intern", "internship", "Survey, competitor analysis, presentation"],
  ["Marketing, Sales & Business", "Sales Coordinator", "first-job", "Customer follow-up, quotations, reporting"],
  ["Healthcare, Biomedical & Pharma", "Biomedical Science Intern", "internship", "Lab skills, documentation, research discipline"],
  ["Healthcare, Biomedical & Pharma", "Clinical Operations Intern", "internship", "Coordination, compliance, patient-care awareness"],
  ["Healthcare, Biomedical & Pharma", "Pharmaceutical Commercial Intern", "internship", "Market research, product knowledge, ethics"],
  ["Healthcare, Biomedical & Pharma", "Healthcare Admin Executive", "first-job", "Service mindset, records, operational accuracy"],
  ["Hospitality, Tourism & Events", "Hotel Operations Intern", "internship", "Guest service, shift reliability, problem handling"],
  ["Hospitality, Tourism & Events", "Events Management Intern", "internship", "Vendor coordination, timelines, on-site execution"],
  ["Hospitality, Tourism & Events", "Customer Experience Intern", "internship", "Service recovery, communication, feedback handling"],
  ["Human Resources, Admin & Education", "HR Intern", "internship", "Recruitment coordination, confidentiality, people skills"],
  ["Human Resources, Admin & Education", "Learning & Development Intern", "internship", "Training support, facilitation, content"],
  ["Human Resources, Admin & Education", "Education Programme Intern", "internship", "Teaching support, programme coordination"],
  ["Legal, Policy, Public Sector & ESG", "Legal Intern", "internship", "Research, drafting, precision, confidentiality"],
  ["Legal, Policy, Public Sector & ESG", "Policy Research Intern", "internship", "Research, writing, stakeholder awareness"],
  ["Legal, Policy, Public Sector & ESG", "Sustainability / ESG Intern", "internship", "Reporting, research, metrics, stakeholder work"],
  ["Design, Media & Communications", "Graphic Design Intern", "internship", "Portfolio, visual judgment, client feedback"],
  ["Design, Media & Communications", "Content Marketing Intern", "internship", "Writing samples, social content, analytics"],
  ["Design, Media & Communications", "Corporate Communications Intern", "internship", "Writing, messaging, stakeholder handling"],
].map(([industry, role, stage, evidence]) => ({ industry, role, stage, evidence }));

document.querySelector('input[name="source"]').value = source;
document.querySelector('input[name="page_url"]').value = window.location.href;
document.querySelector('input[name="referrer"]').value = document.referrer || "none";

const form = document.querySelector(".lead-form");
const targetPath = document.querySelector("#target-path");
const targetSituation = document.querySelector('textarea[name="target_role_or_situation"]');
const finderStage = document.querySelector("#finder-stage");
const finderIndustry = document.querySelector("#finder-industry");
const finderRole = document.querySelector("#finder-role");
const listingGrid = document.querySelector("#listing-grid");
const listingCount = document.querySelector("#listing-count");
const listingUpdated = document.querySelector("#listing-updated");
const trackerForm = document.querySelector("#tracker-form");
const trackerBoard = document.querySelector("#tracker-board");
const trackerCompany = document.querySelector("#tracker-company");
const trackerRole = document.querySelector("#tracker-role");
const trackerStatus = document.querySelector("#tracker-status");
const trackerKey = "careerupgrade-kit-application-tracker";

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

  form.elements._subject.value = `CareerUpgrade Kit beta request - ${name} - ${timestamp}`;
});

function renderPanel(key) {
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

function stageLabel(stage) {
  return stage === "first-job" ? "First job" : "Internship";
}

function unique(values) {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b));
}

function setTarget(industry, role) {
  const selectedTarget = `${industry} - ${role}`;
  const matchingOption = [...targetPath.options].find((option) => selectedTarget.includes(option.textContent.split(",")[0]));
  targetPath.value = matchingOption ? matchingOption.value : "Other or not sure yet";

  targetSituation.value = selectedTarget;
  document.querySelector("#request").scrollIntoView({ behavior: "smooth", block: "start" });
  targetPath.focus({ preventScroll: true });
}

function populateFinderOptions() {
  const industries = unique(listingTargets.map((item) => item.industry));
  finderIndustry.insertAdjacentHTML(
    "beforeend",
    industries.map((industry) => `<option>${industry}</option>`).join("")
  );
  updateRoleOptions();
}

function updateRoleOptions() {
  const selectedIndustry = finderIndustry.value;
  const roles = unique(
    listingTargets
      .filter((item) => selectedIndustry === "all" || item.industry === selectedIndustry)
      .map((item) => item.role)
  );

  finderRole.innerHTML = `<option value="all">All roles</option>${roles.map((role) => `<option>${role}</option>`).join("")}`;
}

function filteredTargets() {
  return listingTargets.filter((item) => {
    const stageMatch = finderStage.value === "all" || item.stage === finderStage.value;
    const industryMatch = finderIndustry.value === "all" || item.industry === finderIndustry.value;
    const roleMatch = finderRole.value === "all" || item.role === finderRole.value;
    return stageMatch && industryMatch && roleMatch;
  });
}

function renderListings() {
  const targets = filteredTargets();
  listingCount.textContent = `${targets.length} target${targets.length === 1 ? "" : "s"}`;
  listingUpdated.textContent = `R1 sample list updated ${new Date().toLocaleDateString("en-SG", {
    timeZone: "Asia/Singapore",
    day: "2-digit",
    month: "short",
    year: "numeric",
  })}`;

  listingGrid.innerHTML = targets
    .slice(0, 12)
    .map(
      (item) => `
        <article class="listing-card">
          <span>${item.industry}</span>
          <h3>${item.role}</h3>
          <p>${stageLabel(item.stage)} target. We review the resume, LinkedIn, cover-letter angle, and interview story against this role.</p>
          <p><strong>Evidence to prepare:</strong> ${item.evidence}.</p>
          <div class="listing-actions">
            <button class="text-button choose-target" data-industry="${item.industry}" data-role="${item.role}" type="button">Use this target</button>
            <button class="text-button add-tracker" data-role="${item.role}" type="button">Track application</button>
          </div>
        </article>
      `
    )
    .join("");
}

function loadTracker() {
  try {
    return JSON.parse(localStorage.getItem(trackerKey)) || [];
  } catch {
    return [];
  }
}

function saveTracker(items) {
  localStorage.setItem(trackerKey, JSON.stringify(items));
}

function renderTracker() {
  const items = loadTracker();

  if (!items.length) {
    trackerBoard.innerHTML = `<div class="tracker-empty">No applications tracked yet. Add a target role above or use the tracker form.</div>`;
    return;
  }

  trackerBoard.innerHTML = items
    .map(
      (item, index) => `
        <article class="tracker-item">
          <span>${item.status}</span>
          <h3>${item.role}</h3>
          <p>${item.company}</p>
          <button class="text-button remove-tracker" data-index="${index}" type="button">Remove</button>
        </article>
      `
    )
    .join("");
}

finderStage.addEventListener("change", renderListings);
finderIndustry.addEventListener("change", () => {
  updateRoleOptions();
  renderListings();
});
finderRole.addEventListener("change", renderListings);

listingGrid.addEventListener("click", (event) => {
  const targetButton = event.target.closest(".choose-target");
  const trackerButton = event.target.closest(".add-tracker");

  if (targetButton) {
    setTarget(targetButton.dataset.industry, targetButton.dataset.role);
  }

  if (trackerButton) {
    const items = loadTracker();
    items.unshift({
      company: "Company to confirm",
      role: trackerButton.dataset.role,
      status: "Preparing resume",
    });
    saveTracker(items);
    renderTracker();
    document.querySelector("#tracker").scrollIntoView({ behavior: "smooth", block: "start" });
  }
});

trackerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const items = loadTracker();
  items.unshift({
    company: trackerCompany.value.trim(),
    role: trackerRole.value.trim(),
    status: trackerStatus.value,
  });
  saveTracker(items);
  trackerForm.reset();
  renderTracker();
});

trackerBoard.addEventListener("click", (event) => {
  const removeButton = event.target.closest(".remove-tracker");

  if (!removeButton) {
    return;
  }

  const items = loadTracker();
  items.splice(Number(removeButton.dataset.index), 1);
  saveTracker(items);
  renderTracker();
});

document.querySelector("#copy-share").addEventListener("click", async () => {
  const message = document.querySelector("#share-message").textContent.trim().replace(/\s+/g, " ");
  const status = document.querySelector("#copy-status");

  try {
    await navigator.clipboard.writeText(message);
    status.textContent = "Message copied.";
  } catch {
    status.textContent = "Copy failed. Select the message text manually.";
  }
});

populateFinderOptions();
renderListings();
renderTracker();

const targetData = [
  ["Technology, AI & Data", "Software Engineering Intern", "internship", "Projects, GitHub, coding tests, teamwork evidence"],
  ["Technology, AI & Data", "Data Analytics Intern", "internship", "Excel, SQL, Python, dashboards, business insight"],
  ["Technology, AI & Data", "AI / ML Intern", "internship", "Model projects, Python, data cleaning, experimentation"],
  ["Technology, AI & Data", "Cybersecurity Intern", "internship", "Security fundamentals, labs, incident thinking"],
  ["Technology, AI & Data", "Product Analyst Intern", "internship", "User research, metrics, product thinking"],
  ["Technology, AI & Data", "Junior Data Analyst", "first-job", "SQL, dashboards, reporting, communication"],
  ["Technology, AI & Data", "Junior Software Engineer", "first-job", "Coding tests, GitHub, product thinking, collaboration"],
  ["Banking, Finance & Accounting", "Investment Banking Intern", "internship", "Financial modelling, research, deal awareness"],
  ["Banking, Finance & Accounting", "Wealth Management Intern", "internship", "Client service, markets interest, communication"],
  ["Banking, Finance & Accounting", "Risk & Compliance Intern", "internship", "Regulation, controls, documentation, judgement"],
  ["Banking, Finance & Accounting", "Audit / Accounting Associate", "first-job", "Accounting modules, Excel, detail orientation"],
  ["Banking, Finance & Accounting", "Finance Analyst", "first-job", "Excel, reporting, variance analysis, business communication"],
  ["Engineering, Semiconductor & Manufacturing", "Mechanical Engineering Intern", "internship", "CAD, design projects, problem solving"],
  ["Engineering, Semiconductor & Manufacturing", "Semiconductor Process Intern", "internship", "Process thinking, lab work, data discipline"],
  ["Engineering, Semiconductor & Manufacturing", "Quality Engineering Intern", "internship", "Root cause, documentation, test evidence"],
  ["Engineering, Semiconductor & Manufacturing", "Graduate Engineer", "first-job", "Technical projects, safety, execution reliability"],
  ["Supply Chain, Logistics & Operations", "Procurement Intern", "internship", "Supplier research, negotiation, Excel tracking"],
  ["Supply Chain, Logistics & Operations", "Supply Chain Analyst Intern", "internship", "Forecasting, inventory, data analysis"],
  ["Supply Chain, Logistics & Operations", "Operations Executive", "first-job", "Execution, follow-up, cross-team communication"],
  ["Marketing, Sales & Business", "Digital Marketing Intern", "internship", "Campaigns, analytics, content, audience insight"],
  ["Marketing, Sales & Business", "Business Development Intern", "internship", "Prospecting, research, communication, follow-up"],
  ["Marketing, Sales & Business", "Product Marketing Intern", "internship", "Market research, positioning, content, launch support"],
  ["Marketing, Sales & Business", "Sales Coordinator", "first-job", "Customer follow-up, quotations, reporting"],
  ["Marketing, Sales & Business", "Marketing Executive", "first-job", "Campaign planning, content, metrics, stakeholder updates"],
  ["Healthcare, Biomedical & Pharma", "Biomedical Science Intern", "internship", "Lab skills, documentation, research discipline"],
  ["Healthcare, Biomedical & Pharma", "Clinical Operations Intern", "internship", "Patient operations, accuracy, compliance, service mindset"],
  ["Healthcare, Biomedical & Pharma", "Healthcare Admin Executive", "first-job", "Service mindset, records, operational accuracy"],
  ["Hospitality, Tourism & Events", "Hotel Operations Intern", "internship", "Guest service, shift reliability, problem handling"],
  ["Hospitality, Tourism & Events", "Events Management Intern", "internship", "Vendor coordination, timelines, on-site execution"],
  ["Hospitality, Tourism & Events", "Guest Relations Executive", "first-job", "Customer experience, problem solving, presentation"],
  ["Human Resources, Admin & Education", "HR Intern", "internship", "Recruitment coordination, confidentiality, people skills"],
  ["Human Resources, Admin & Education", "Education Programme Intern", "internship", "Teaching support, programme coordination"],
  ["Human Resources, Admin & Education", "HR Coordinator", "first-job", "Recruitment support, records, employee communication"],
  ["Legal, Policy, Public Sector & ESG", "Legal Intern", "internship", "Research, drafting, precision, confidentiality"],
  ["Legal, Policy, Public Sector & ESG", "Sustainability / ESG Intern", "internship", "Reporting, research, metrics, stakeholder work"],
  ["Legal, Policy, Public Sector & ESG", "Policy Research Assistant", "first-job", "Research, writing, synthesis, public-sector awareness"],
  ["Design, Media & Communications", "Graphic Design Intern", "internship", "Portfolio, visual judgment, client feedback"],
  ["Design, Media & Communications", "Content Marketing Intern", "internship", "Writing samples, social content, analytics"],
  ["Design, Media & Communications", "Communications Executive", "first-job", "Writing, media monitoring, stakeholder communication"],
].map(([industry, role, stage, evidence]) => ({ industry, role, stage, evidence }));

const params = new URLSearchParams(window.location.search);
const source = params.get("src") || params.get("source") || "direct";

function unique(values) {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b));
}

function scoreValue(value) {
  return { weak: 16, medium: 26, strong: 34 }[value] || 16;
}

function setHiddenField(name, value) {
  document.querySelectorAll(`input[name="${name}"]`).forEach((field) => {
    field.value = value;
  });
}

function setupForms() {
  setHiddenField("source", source);
  setHiddenField("page_url", window.location.href);
  setHiddenField("referrer", document.referrer || "none");

  document.querySelectorAll(".lead-form").forEach((form) => {
    form.addEventListener("submit", () => {
      const name = form.elements.name?.value.trim() || "New applicant";
      const timestamp = new Date().toLocaleString("en-SG", {
        timeZone: "Asia/Singapore",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });

      if (form.elements._subject) {
        form.elements._subject.value = `${form.elements._subject.value} - ${name} - ${timestamp}`;
      }
    });
  });
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

function setupChecker() {
  const checkerIndustry = document.querySelector("#checker-industry");
  const checkerRole = document.querySelector("#checker-role");
  const checkerResume = document.querySelector("#checker-resume");
  const checkerLinkedin = document.querySelector("#checker-linkedin");
  const checkerCover = document.querySelector("#checker-cover");
  const checkerStage = document.querySelector("#checker-stage");

  if (!checkerIndustry || !checkerRole || !checkerResume || !checkerLinkedin || !checkerCover) {
    return;
  }

  function selectedCheckerTarget() {
    return targetData.find((item) => item.role === checkerRole.value) || {
      role: "Resume + LinkedIn preparation",
      evidence: "resume clarity, LinkedIn positioning, cover-letter direction, and interview stories",
    };
  }

  function scoreCopy(score) {
    if (score >= 82) {
      return {
        title: "Strong base. Now make it sharper and more specific.",
        copy: "Your materials look prepared. The next step is polishing evidence, LinkedIn positioning, cover-letter direction, and interview stories.",
      };
    }

    if (score >= 62) {
      return {
        title: "Good direction, but your profile can be stronger.",
        copy: "You likely need clearer resume bullets, stronger LinkedIn positioning, and a more specific cover-letter angle.",
      };
    }

    return {
      title: "Your career profile needs strengthening before you rely on it.",
      copy: "Start with resume and LinkedIn rewriting, then add cover-letter direction and interview stories when you are ready.",
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

  populateSelect(checkerIndustry, unique(targetData.map((item) => item.industry)), "Select industry");
  populateSelect(checkerRole, rolesForIndustry(checkerIndustry.value), "Select role");

  checkerIndustry.addEventListener("change", () => {
    populateSelect(checkerRole, rolesForIndustry(checkerIndustry.value), "Select role");
    checkerRole.selectedIndex = 1;
    updateChecker();
  });

  [checkerStage, checkerRole, checkerResume, checkerLinkedin, checkerCover].forEach((select) => {
    select?.addEventListener("change", updateChecker);
  });

  updateChecker();
}

function setupFinder() {
  const finderStage = document.querySelector("#finder-stage");
  const finderIndustry = document.querySelector("#finder-industry");
  const finderRole = document.querySelector("#finder-role");
  const listingGrid = document.querySelector("#listing-grid");
  const resultsEmpty = document.querySelector("#results-empty");
  const targetPath = document.querySelector("#target-path");
  const requestStage = document.querySelector("#request-stage");

  if (!finderStage || !finderIndustry || !finderRole || !listingGrid || !resultsEmpty) {
    return;
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
            <p>${item.stage === "first-job" ? "Fresh graduate first-job" : "Internship"} target. CareerUpgrade Kit reviews resume, LinkedIn, cover-letter angle, and interview story against this role.</p>
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

    if (targetPath) {
      targetPath.value = button.dataset.role;
    }

    if (requestStage) {
      requestStage.value = button.dataset.stage === "first-job"
        ? "Fresh graduate applying for first job"
        : "Current student applying for internships";
    }

    document.querySelector("#request")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  renderListings();
}

setupForms();
setupChecker();
setupFinder();

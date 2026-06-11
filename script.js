const panels = {
  resume: {
    label: "Resume Upgrade",
    title: "Resume tailored to the internship path.",
    points: [
      "Clear profile summary for the selected internship category.",
      "Projects, CCAs, part-time work, and coursework rewritten as evidence.",
      "Bullets shaped for a fast hiring-manager scan.",
    ],
  },
  linkedin: {
    label: "LinkedIn Starter Profile",
    title: "A profile that signals direction before the recruiter opens the resume.",
    points: [
      "Headline aligned to the target internship path.",
      "About section that explains the student's interest and evidence.",
      "Project, activity, and skills sections rewritten for recruiter search.",
    ],
  },
  interview: {
    label: "Interview Starter Pack",
    title: "Interview stories built from the student's real evidence.",
    points: [
      "\"Tell me about yourself\" script for the target role.",
      "10 common internship and fresh graduate interview answers.",
      "5 STAR-format stories for teamwork, initiative, problem-solving, and feedback.",
    ],
  },
  cover: {
    label: "Cover Letter Direction",
    title: "A practical angle for explaining why this internship fits.",
    points: [
      "Opening angle for the target internship or employer type.",
      "Evidence points to connect school work and experience to the role.",
      "Short guidance for referrals, email applications, and follow-ups.",
    ],
  },
};

const panel = document.querySelector("#kit-panel");
const buttons = document.querySelectorAll(".kit-item");
const params = new URLSearchParams(window.location.search);
const source = params.get("src") || params.get("source") || "direct";

document.querySelector('input[name="source"]').value = source;
document.querySelector('input[name="page_url"]').value = window.location.href;
document.querySelector('input[name="referrer"]').value = document.referrer || "none";

const form = document.querySelector(".lead-form");

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

function avatarFallback(img, fallbackClass) {
  const initials = (img.dataset.name || "")
    .replace(/\(.*?\)/g, "")
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const div = document.createElement("div");
  div.className = fallbackClass || "avatar-fallback";
  div.textContent = initials;
  img.replaceWith(div);
}

document.addEventListener("DOMContentLoaded", () => {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";

  document.querySelectorAll("nav a").forEach((link) => {
    const linkPage = link.getAttribute("href").split("#")[0] || "index.html";
    if (linkPage === currentPage) {
      link.classList.add("active");
    }
  });

  const navToggle = document.getElementById("nav-toggle");
  if (navToggle) {
    document.querySelectorAll("nav a").forEach((link) => {
      link.addEventListener("click", () => {
        navToggle.checked = false;
      });
    });
  }

  document.querySelectorAll("dialog.member-dialog").forEach((dialog) => {
    dialog.addEventListener("click", (e) => {
      if (e.target === dialog) {
        dialog.close();
      }
    });
  });

  renderGallery();
  initRecruitPopup();
});

const RECRUIT_POPUP_DISMISS_KEY = "recruitPopupDismissedDate";

function initRecruitPopup() {
  const popup = document.getElementById("recruit-popup");
  if (!popup) return;

  if (localStorage.getItem(RECRUIT_POPUP_DISMISS_KEY) !== new Date().toDateString()) {
    popup.showModal();
  }
}

function dismissRecruitPopupToday() {
  localStorage.setItem(RECRUIT_POPUP_DISMISS_KEY, new Date().toDateString());
  const popup = document.getElementById("recruit-popup");
  if (popup) popup.close();
}

const GALLERY_DATA = {
  2026: [
    { folder: "2026. 02. 20. 학위수여식", count: 4 },
    { folder: "2026. 03. 30. 딸기파티", count: 2 },
    { folder: "2026. 04. 22. - 04.24. 한국화학공학회 봄 총회", count: 3 },
    { folder: "2026. 05. 12. 스승의 날", count: 4 },
    { folder: "2026. 05. 13. - 05. 15. 한국공업화학회 봄 총회", count: 4 },
    { folder: "2026. 05. 24. 상준 결혼식", count: 3 },
  ],
  2025: [
    { folder: "2025. 02. 14. 학위수여식", count: 16, exts: { 4: "png" } },
    { folder: "2025. 04. 01. 딸기파티", count: 2 },
    { folder: "2025. 04. 03. 벚꽃 구경", count: 2 },
    { folder: "2025. 04. 25. 춘계 한국화학공학회", count: 1 },
    { folder: "2025. 05. 14. 스승의 날", count: 1 },
    { folder: "2025. 05. 19. 이재형 교수님 방문 기념 회식", count: 2 },
    { folder: "2025. 07. 22. 교수님 생신", count: 2 },
    { folder: "2025. 08. 18. - 08. 21. KIChE 공정시스템 여름학교 및 하계 심포지엄", count: 2 },
    { folder: "2025. 08. 27. - 08. 28. 제2회 공정한 만남 워크샵", count: 2 },
    { folder: "2025. 10. 15. - 10. 18. 한국화학공학회 가을 총회", count: 11 },
    { folder: "2025. 11. 02. - 11. 06. AIChE 2025 Annual Meeting", count: 8 },
    { folder: "2025. 11. 11. 2025 생화공 체육대회 (족구 우승)", count: 2 },
    { folder: "2025. 12. 22. KAIST-NTU Joint Workshop", count: 1 },
    { folder: "2025. 12. 23. 2025년도 송년회", count: 1 },
  ],
  2024: [{ folder: null, name: "2024", count: 13 }],
};

function galleryImgPath(year, folder, file) {
  const parts = ["images", "gallery", String(year)];
  if (folder) parts.push(folder);
  parts.push(file);
  return parts.map(encodeURIComponent).join("/");
}

function renderGallery() {
  const root = document.getElementById("gallery-root");
  if (!root) return;

  Object.keys(GALLERY_DATA)
    .sort((a, b) => b - a)
    .forEach((year, idx) => {
      const albums = GALLERY_DATA[year];
      const details = document.createElement("details");
      details.className = "gallery-year";
      if (idx === 0) details.open = true;

      const yearLabel = year === "2024" ? "-2024" : year;
      const summary = document.createElement("summary");
      summary.innerHTML = `<span class="arrow">▸</span> ${yearLabel}`;
      details.appendChild(summary);

      const grid = document.createElement("div");
      grid.className = "album-grid";

      [...albums].reverse().forEach((album, ai) => {
        const label = album.name || album.folder;
        const dialogId = `dlg-gallery-${year}-${ai}`;

        const card = document.createElement("div");
        card.className = "album-card";
        card.setAttribute("role", "button");
        card.setAttribute("tabindex", "0");
        card.addEventListener("click", () => document.getElementById(dialogId).showModal());
        card.addEventListener("keydown", (e) => {
          if (e.key === "Enter") document.getElementById(dialogId).showModal();
        });

        const thumbExt = (album.exts && album.exts[1]) || "jpg";
        const thumbImg = document.createElement("img");
        thumbImg.className = "album-thumb";
        thumbImg.src = galleryImgPath(year, album.folder, `1.${thumbExt}`);
        thumbImg.alt = label;
        thumbImg.dataset.name = label;
        thumbImg.addEventListener("error", function () {
          avatarFallback(this, "album-thumb-fallback");
        });
        card.appendChild(thumbImg);

        const caption = document.createElement("div");
        caption.className = "album-caption";
        caption.textContent = label;
        card.appendChild(caption);

        grid.appendChild(card);

        const dialog = document.createElement("dialog");
        dialog.id = dialogId;
        dialog.className = "member-dialog wide-dialog";

        const closeBtn = document.createElement("button");
        closeBtn.className = "dialog-close";
        closeBtn.textContent = "✕";
        closeBtn.addEventListener("click", () => dialog.close());
        dialog.appendChild(closeBtn);

        const heading = document.createElement("h3");
        heading.textContent = label;
        dialog.appendChild(heading);

        const photosWrap = document.createElement("div");
        photosWrap.className = "dialog-photos";
        for (let i = 1; i <= album.count; i++) {
          const ext = (album.exts && album.exts[i]) || "jpg";
          const img = document.createElement("img");
          img.className = "dialog-photo";
          img.src = galleryImgPath(year, album.folder, `${i}.${ext}`);
          img.alt = `${label} ${i}`;
          img.addEventListener("error", function () {
            this.remove();
          });
          photosWrap.appendChild(img);
        }
        dialog.appendChild(photosWrap);

        dialog.addEventListener("click", (e) => {
          if (e.target === dialog) dialog.close();
        });

        document.body.appendChild(dialog);
      });

      details.appendChild(grid);
      root.appendChild(details);
    });
}

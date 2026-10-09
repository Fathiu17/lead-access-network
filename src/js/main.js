/* ==========================================================================
   LEAD ACCESS NETWORK (LAN)
   main.js — vanilla JavaScript, no dependencies
   - Mobile navigation toggle
   - Category filtering (?category= aware)
   - Live search filtering
   ========================================================================== */
(function () {
  "use strict";

  /* ------------------------------------------------------------------
     1. Mobile navigation
     ------------------------------------------------------------------ */
  function initNavigation() {
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.getElementById("primary-nav");
    if (!toggle || !nav) return;

    function closeNav() {
      nav.classList.remove("is-open");
      toggle.classList.remove("is-active");
      toggle.setAttribute("aria-expanded", "false");
    }

    function openNav() {
      nav.classList.add("is-open");
      toggle.classList.add("is-active");
      toggle.setAttribute("aria-expanded", "true");
    }

    toggle.addEventListener("click", function () {
      if (nav.classList.contains("is-open")) {
        closeNav();
      } else {
        openNav();
      }
    });

    /* Close after tapping a link (mobile only) */
    nav.addEventListener("click", function (event) {
      var link = event.target.closest("a");
      if (link && window.innerWidth < 1024) closeNav();
    });

    /* Close on Escape */
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeNav();
    });

    /* Reset state when resizing to desktop */
    var resizeTimer;
    window.addEventListener("resize", function () {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(function () {
        if (window.innerWidth >= 1024) closeNav();
      }, 120);
    });
  }

  /* ------------------------------------------------------------------
     2. Posts: category filter + live search
     ------------------------------------------------------------------ */
  function initPostFilters() {
    var grid = document.getElementById("post-grid");
    if (!grid) return;

    var cards = Array.prototype.slice.call(
      grid.querySelectorAll(".post-card")
    );
    var buttons = Array.prototype.slice.call(
      document.querySelectorAll(".filter-btn")
    );
    var searchInput = document.getElementById("post-search");
    var emptyState = document.getElementById("no-results");
    var countEl = document.getElementById("post-count");
    var pager = document.getElementById("post-pagination");

    var activeCategory = "All";

    function normalise(value) {
      return String(value || "")
        .toLowerCase()
        .replace(/\s+/g, " ")
        .trim();
    }

    function setActiveCategory(category) {
      var matched = false;

      buttons.forEach(function (btn) {
        var isMatch = btn.getAttribute("data-filter") === category;
        if (isMatch) matched = true;
        btn.classList.toggle("is-active", isMatch);
        btn.setAttribute("aria-pressed", isMatch ? "true" : "false");
      });

      activeCategory = matched ? category : "All";

      /* Safety: if nothing matched, re-highlight "All" */
      if (!matched) {
        buttons.forEach(function (btn) {
          var isAll = btn.getAttribute("data-filter") === "All";
          btn.classList.toggle("is-active", isAll);
          btn.setAttribute("aria-pressed", isAll ? "true" : "false");
        });
      }
    }

    function render() {
      var query = normalise(searchInput ? searchInput.value : "");
      var visible = 0;

      cards.forEach(function (card) {
        var category = card.getAttribute("data-category") || "";
        var matchesCategory =
          activeCategory === "All" || category === activeCategory;
        var haystack = normalise(card.textContent);
        var matchesQuery = query === "" || haystack.indexOf(query) !== -1;

        var show = matchesCategory && matchesQuery;
        card.hidden = !show;
        if (show) visible += 1;
      });

      if (emptyState) emptyState.hidden = visible !== 0;

      if (countEl) {
        countEl.textContent =
          visible + (visible === 1 ? " post" : " posts");
      }

      /* Hide server-side pagination while client-side filtering is active */
      var filtering = query !== "" || activeCategory !== "All";
      if (pager) pager.hidden = filtering;
    }

    /* --- Category buttons --- */
    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        setActiveCategory(btn.getAttribute("data-filter"));

        if (window.history && window.history.replaceState) {
          var url = new URL(window.location.href);
          if (activeCategory === "All") {
            url.searchParams.delete("category");
          } else {
            url.searchParams.set("category", activeCategory);
          }
          window.history.replaceState({}, "", url.toString());
        }

        render();
      });
    });

    /* --- Live search --- */
    if (searchInput) {
      searchInput.addEventListener("input", render);

      /* Clear with Escape */
      searchInput.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
          searchInput.value = "";
          render();
        }
      });
    }

    /* --- Initial state from ?category= --- */
    var initialCategory = null;
    try {
      initialCategory = new URLSearchParams(window.location.search).get(
        "category"
      );
    } catch (err) {
      initialCategory = null;
    }

    setActiveCategory(initialCategory || "All");
    render();
  }

  /* ------------------------------------------------------------------
     3. Boot
     ------------------------------------------------------------------ */
  function boot() {
    initNavigation();
    initPostFilters();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();

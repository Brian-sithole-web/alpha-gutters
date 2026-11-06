/* Site behaviour for the public pages.
   openMenu is the mobile menu handler.
   startSlider advances the home hero.
   openLightbox shows a larger project photo.
   showFormResult reads the contact form redirect. */

(function () {
  var menuButton = document.querySelector(".nav-toggle");
  var navigation = document.querySelector(".site-nav");

  function openMenu() {
    var isOpen = navigation.classList.toggle("is-open");
    menuButton.setAttribute("aria-expanded", isOpen ? "true" : "false");
  }

  if (menuButton && navigation) {
    menuButton.addEventListener("click", openMenu);
  }

  var slider = document.querySelector("[data-slider]");
  if (slider) {
    var slides = slider.querySelectorAll(".slide");
    var currentSlide = 0;
    var timerId = null;

    function showSlide(nextIndex) {
      currentSlide = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, index) {
        var isCurrent = index === currentSlide;
        slide.classList.toggle("is-active", isCurrent);
        slide.setAttribute("aria-hidden", isCurrent ? "false" : "true");
      });
    }

    function startSlider() {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }
      timerId = window.setInterval(function () {
        showSlide(currentSlide + 1);
      }, 6500);
    }

    slider.addEventListener("click", function (event) {
      var control = event.target.closest("[data-slide]");
      if (!control) {
        return;
      }
      window.clearInterval(timerId);
      showSlide(currentSlide + Number(control.getAttribute("data-slide")));
      startSlider();
    });

    showSlide(0);
    startSlider();
  }

  var lightbox = document.getElementById("lightbox");
  var lightboxImage = document.getElementById("lightbox-image");
  var lightboxCaption = document.getElementById("lightbox-caption");

  function openLightbox(trigger) {
    var source = trigger.querySelector("img");
    if (!lightbox || !source) {
      return;
    }
    lightboxImage.src = source.src;
    lightboxImage.alt = source.alt;
    lightboxCaption.textContent = trigger.getAttribute("data-caption") || source.alt;
    if (typeof lightbox.showModal === "function") {
      lightbox.showModal();
    }
  }

  document.querySelectorAll("[data-lightbox]").forEach(function (trigger) {
    trigger.addEventListener("click", function () {
      openLightbox(trigger);
    });
  });

  var closeButton = document.querySelector(".lightbox-close");
  if (closeButton && lightbox) {
    closeButton.addEventListener("click", function () {
      lightbox.close();
    });
  }

  var formStatus = document.getElementById("form-status");
  function showFormResult() {
    if (!formStatus) {
      return;
    }
    var sent = new URLSearchParams(window.location.search).get("sent");
    if (sent === "1") {
      formStatus.hidden = false;
      formStatus.textContent = "Thank you. Your enquiry is on its way to Alpha Gutters. We reply during business hours.";
    }
    if (sent === "0") {
      formStatus.hidden = false;
      formStatus.classList.add("is-error");
      formStatus.textContent = "That enquiry could not be sent. Call +27 83 562 1024 or email info@alpha-gutters.co.za.";
    }
  }

  showFormResult();
})();

// swiper-script.js
const swiper = new Swiper(".mySwiper", {
  slidesPerView: 5,
  spaceBetween: 30,
  slidesPerGroup: 5, // Match the group size to the number of visible slides
  loop: true,
  loopFillGroupWithBlank: false, // No blanks needed if group size matches

  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },

  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },

  breakpoints: {
    1024: { slidesPerView: 5, slidesPerGroup: 5 },
    768: { slidesPerView: 3, slidesPerGroup: 3 },
    480: { slidesPerView: 1, slidesPerGroup: 1 },
  }
});

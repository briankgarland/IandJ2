window.addEventListener('load', function () {
    const swiper = new Swiper('.swiper', {
        // Optional parameters
        direction: 'horizontal',
        loop: true,
        slidesPerView: 1,
        spaceBetween: 0,
        autoplay: {
            delay: 2000,
          },
        breakpoints: {
            // when window width is >= 480px
            480: {
              slidesPerView: 2,
            },
            // when window width is >= 640px
            640: {
              slidesPerView: 3,
            },
            // when window width is >= 992px
            992: {
                slidesPerView: 4,
                },
            // when window width is >= 1200px
            1200: {
                slidesPerView: 5,
                },
          },
        // If we need pagination
        // pagination: {
        // el: '.swiper-pagination',
        // },
    
        // Navigation arrows
        // navigation: {
        // nextEl: '.swiper-button-next',
        // prevEl: '.swiper-button-prev',
        // },
    
        // And if we need scrollbar
        // scrollbar: {
        // el: '.swiper-scrollbar',
        // },
    });
});
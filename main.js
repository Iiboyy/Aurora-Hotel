// Active Nasbar
  document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
    link.addEventListener('click', function() {
      document.querySelector('.navbar-nav .nav-link.active')?.classList.remove('active');
      this.classList.add('active');
    });
  });

  // Carrousel Testimonials
  document.addEventListener('DOMContentLoaded', function() {
    const track = document.querySelector('.carousel-track');
    const slides = Array.from(track.children);
    const nextButton = document.querySelector('.carousel-btn.next');
    const prevButton = document.querySelector('.carousel-btn.prev');
    const indicators = document.querySelectorAll('.carousel-indicator');
    
    const slideWidth = slides[0].getBoundingClientRect().width;
    let currentIndex = 0;
    
    // Arrange slides next to one another
    const setSlidePosition = (slide, index) => {
        slide.style.left = slideWidth * index + 'px';
    };
    slides.forEach(setSlidePosition);
    
    // Move to slide function
    const moveToSlide = (track, currentSlide, targetSlide) => {
        track.style.transform = 'translateX(-' + targetSlide.style.left + ')';
        currentSlide.classList.remove('current-slide');
        targetSlide.classList.add('current-slide');
    };
    
    // Update indicators
    const updateIndicators = (currentIndicator, targetIndicator) => {
        currentIndicator.classList.remove('active');
        targetIndicator.classList.add('active');
    };
    
    // When click next button
    nextButton.addEventListener('click', () => {
        const nextIndex = (currentIndex + 1) % slides.length;
        const currentSlide = slides[currentIndex];
        const nextSlide = slides[nextIndex];
        const currentIndicator = indicators[currentIndex];
        const nextIndicator = indicators[nextIndex];
        
        moveToSlide(track, currentSlide, nextSlide);
        updateIndicators(currentIndicator, nextIndicator);
        currentIndex = nextIndex;
    });
    
    // When click prev button
    prevButton.addEventListener('click', () => {
        const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
        const currentSlide = slides[currentIndex];
        const prevSlide = slides[prevIndex];
        const currentIndicator = indicators[currentIndex];
        const prevIndicator = indicators[prevIndex];
        
        moveToSlide(track, currentSlide, prevSlide);
        updateIndicators(currentIndicator, prevIndicator);
        currentIndex = prevIndex;
    });
    
    // When click indicator
    indicators.forEach(indicator => {
        indicator.addEventListener('click', e => {
            const targetIndex = parseInt(e.target.getAttribute('data-index'));
            if (targetIndex === currentIndex) return;
            
            const currentSlide = slides[currentIndex];
            const targetSlide = slides[targetIndex];
            const currentIndicator = indicators[currentIndex];
            const targetIndicator = indicators[targetIndex];
            
            moveToSlide(track, currentSlide, targetSlide);
            updateIndicators(currentIndicator, targetIndicator);
            currentIndex = targetIndex;
        });
    });
    
    // Auto slide every 5 seconds
    setInterval(() => {
        const nextIndex = (currentIndex + 1) % slides.length;
        const currentSlide = slides[currentIndex];
        const nextSlide = slides[nextIndex];
        const currentIndicator = indicators[currentIndex];
        const nextIndicator = indicators[nextIndex];
        
        moveToSlide(track, currentSlide, nextSlide);
        updateIndicators(currentIndicator, nextIndicator);
        currentIndex = nextIndex;
    }, 5000);
});

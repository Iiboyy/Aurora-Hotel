// Active Nasbar
  document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
    link.addEventListener('click', function() {
      document.querySelector('.navbar-nav .nav-link.active')?.classList.remove('active');
      this.classList.add('active');
    });
  });
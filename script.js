document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.project-card');

  if('IntersectionObserver' in window){
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const card = entry.target;
          const delay = parseInt(card.dataset.index || 0) * 80;
          setTimeout(() => card.classList.add('visible'), delay);
          observer.unobserve(card);
        }
      });
    }, { threshold: 0.1 });

    cards.forEach(card => observer.observe(card));
  } else{
    cards.forEach(card => card.classList.add('visible'));
  }
});
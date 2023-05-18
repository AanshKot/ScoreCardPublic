document.addEventListener('DOMContentLoaded', function() {
    // Get all section elements
    const sections = document.querySelectorAll('.section');
  
    // Function to handle scrolling
    function scrollToSection(index) {
      if (index >= 0 && index < sections.length) {
        sections[index].scrollIntoView({ behavior: 'smooth' });
      }
    }
  
    // Event listener for mousewheel and keydown events
    document.addEventListener('mousewheel', handleScroll);
    document.addEventListener('keydown', handleScroll);
  
    // Function to handle scroll events
    function handleScroll(event) {
      event.preventDefault();
  
      // Calculate the next or previous section index based on scroll direction
      const scrollDelta = Math.sign(event.deltaY || event.key === 'ArrowDown' ? 1 : -1);
      const currentSectionIndex = Array.from(sections).findIndex(section => section.getBoundingClientRect().top >= 0);
      const nextSectionIndex = currentSectionIndex + scrollDelta;
  
      scrollToSection(nextSectionIndex);
    }
  });
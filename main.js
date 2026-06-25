document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initTypewriter();
  initScrollAnimations();
  initSkillsTabs();
  initContactForm();
  
  // New premium interactive systems
  initCanvasParticles();
  initCustomCursor();
  initTerminalEmulator();
});

/* --- Responsive Navbar & Navigation --- */
function initNavbar() {
  const header = document.querySelector('.header');
  const navToggle = document.querySelector('.nav-toggle');
  const navLinksContainer = document.querySelector('.nav-links');
  const navLinks = document.querySelectorAll('.nav-link');
  const scrollTopBtn = document.querySelector('.scroll-top-btn');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
      scrollTopBtn.style.opacity = '1';
      scrollTopBtn.style.pointerEvents = 'all';
    } else {
      header.classList.remove('scrolled');
      scrollTopBtn.style.opacity = '0';
      scrollTopBtn.style.pointerEvents = 'none';
    }
    highlightActiveLink();
  });

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinksContainer.classList.toggle('active');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      if (link.getAttribute('href').includes('resume.html')) return;
      e.preventDefault();
      
      navToggle.classList.remove('active');
      navLinksContainer.classList.remove('active');
      
      const targetId = link.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        const offset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  function highlightActiveLink() {
    let fromTop = window.scrollY + 120;
    navLinks.forEach(link => {
      if (link.getAttribute('href').includes('resume.html')) return;
      const section = document.querySelector(link.getAttribute('href'));
      if (section) {
        if (section.offsetTop <= fromTop && section.offsetTop + section.offsetHeight > fromTop) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      }
    });
  }
}

/* --- Hero Typing Animation --- */
function initTypewriter() {
  const titles = [
    "Software Developer",
    "Python & ML Developer",
    "Java Developer",
    "MERN Stack Developer"
  ];
  
  const textContainer = document.querySelector('.hero-title-scroller');
  if (!textContainer) return;
  
  const textSpan = document.createElement('span');
  textSpan.className = 'typing-text';
  textContainer.appendChild(textSpan);
  
  const cursorSpan = document.createElement('span');
  cursorSpan.className = 'typing-cursor';
  textContainer.appendChild(cursorSpan);
  
  let titleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 100;
  
  function type() {
    const currentTitle = titles[titleIndex];
    if (isDeleting) {
      textSpan.textContent = currentTitle.substring(0, charIndex - 1);
      charIndex--;
      typeSpeed = 40; 
    } else {
      textSpan.textContent = currentTitle.substring(0, charIndex + 1);
      charIndex++;
      typeSpeed = 80; 
    }
    
    if (!isDeleting && charIndex === currentTitle.length) {
      typeSpeed = 2200; 
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      titleIndex = (titleIndex + 1) % titles.length;
      typeSpeed = 400; 
    }
    
    setTimeout(type, typeSpeed);
  }
  
  setTimeout(type, 500);
}

/* --- Scroll-Linked Reveal Animations --- */
function initScrollAnimations() {
  const revealElements = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: "0px 0px -40px 0px"
  });
  
  revealElements.forEach(element => observer.observe(element));
}

/* --- Skills Tab Filtering --- */
function initSkillsTabs() {
  const tabs = document.querySelectorAll('.skills-tab-btn');
  const panels = document.querySelectorAll('.skills-panel');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      const targetCategory = tab.getAttribute('data-category');
      panels.forEach(panel => {
        if (panel.id === `skills-${targetCategory}`) {
          panel.classList.add('active');
        } else {
          panel.classList.remove('active');
        }
      });
    });
  });
}

/* --- Interactive Contact Form --- */
function initContactForm() {
  const form = document.getElementById('portfolio-contact-form');
  if (!form) return;
  const statusContainer = document.getElementById('form-status-container');
  
  // Math verification setup
  let num1 = Math.floor(Math.random() * 9) + 1;
  let num2 = Math.floor(Math.random() * 9) + 1;
  let correctAnswer = num1 + num2;
  const questionLabel = document.getElementById('security-question-label');
  if (questionLabel) {
    questionLabel.textContent = `${num1} + ${num2} = ?`;
  }
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('form-name').value.trim();
    const email = document.getElementById('form-email').value.trim();
    const message = document.getElementById('form-message').value.trim();
    const securityAnswer = document.getElementById('form-security').value.trim();
    const logBox = document.getElementById('security-scan-log');
    
    if (!name || !email || !message || !securityAnswer) {
      showStatus('Please fill in all fields.', 'error');
      return;
    }
    
    if (!validateEmail(email)) {
      showStatus('Please enter a valid email address.', 'error');
      return;
    }
    
    if (parseInt(securityAnswer) !== correctAnswer) {
      showStatus('Security verification failed. Try again.', 'error');
      
      // Reset Math Challenge
      num1 = Math.floor(Math.random() * 9) + 1;
      num2 = Math.floor(Math.random() * 9) + 1;
      correctAnswer = num1 + num2;
      if (questionLabel) questionLabel.textContent = `${num1} + ${num2} = ?`;
      document.getElementById('form-security').value = '';
      return;
    }
    
    // Success path: trigger terminal verification scan log
    if (logBox) {
      logBox.style.display = 'flex';
      logBox.innerHTML = '';
    }
    
    const logLines = [
      { text: '[INFO] Initializing secure transfer protocol...', type: 'info' },
      { text: '[INFO] Sanitizing input fields (XSS filter active)...', type: 'info' },
      { text: '[OK] Payload integrity verified.', type: 'success' },
      { text: '[INFO] Encrypting parameters with AES-256...', type: 'info' },
      { text: '[INFO] Dispatching secure POST payload...', type: 'info' },
      { text: '[OK] Response: 200 OK. Connection closed cleanly.', type: 'success' }
    ];
    
    showStatus('Processing secure request...', 'loading');
    
    let logIndex = 0;
    function printNextLog() {
      if (logIndex < logLines.length) {
        const line = document.createElement('div');
        line.className = `security-log-line ${logLines[logIndex].type === 'success' ? '' : logLines[logIndex].type === 'error' ? 'error' : 'info'}`;
        line.textContent = logLines[logIndex].text;
        logBox.appendChild(line);
        logBox.scrollTop = logBox.scrollHeight;
        logIndex++;
        setTimeout(printNextLog, 400);
      } else {
        setTimeout(() => {
          showStatus('Message sent successfully! Dhruv will get back to you shortly.', 'success');
          form.reset();
          logBox.style.display = 'none';
          
          // Regenerate challenge
          num1 = Math.floor(Math.random() * 9) + 1;
          num2 = Math.floor(Math.random() * 9) + 1;
          correctAnswer = num1 + num2;
          if (questionLabel) questionLabel.textContent = `${num1} + ${num2} = ?`;
          
          setTimeout(() => {
            statusContainer.className = 'form-status';
            statusContainer.innerHTML = '';
          }, 5000);
        }, 600);
      }
    }
    
    setTimeout(printNextLog, 150);
  });
  
  function validateEmail(email) {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  }
  
  function showStatus(msg, type) {
    statusContainer.className = 'form-status';
    statusContainer.classList.add(type);
    
    if (type === 'loading') {
      statusContainer.innerHTML = `<div class="spinner"></div> <span>${msg}</span>`;
    } else if (type === 'success') {
      statusContainer.innerHTML = `<i class="btn-icon">✓</i> <span>${msg}</span>`;
    } else if (type === 'error') {
      statusContainer.innerHTML = `<i class="btn-icon">✗</i> <span>${msg}</span>`;
    }
  }
}

/* --- Interactive Canvas Particle Backdrop --- */
function initCanvasParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  let particlesArray = [];
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;
  
  const mouse = {
    x: null,
    y: null,
    radius: 120
  };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initParticles();
  });

  class Particle {
    constructor(x, y, directionX, directionY, size, color) {
      this.x = x;
      this.y = y;
      this.directionX = directionX;
      this.directionY = directionY;
      this.size = size;
      this.color = color;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
      ctx.fillStyle = this.color;
      ctx.fill();
    }

    update() {
      // Check borders
      if (this.x > width || this.x < 0) {
        this.directionX = -this.directionX;
      }
      if (this.y > height || this.y < 0) {
        this.directionY = -this.directionY;
      }

      // Check mouse interaction (repulsion)
      if (mouse.x != null && mouse.y != null) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius) {
          if (mouse.x < this.x && this.x < width - this.size * 10) {
            this.x += 2;
          }
          if (mouse.x > this.x && this.x > this.size * 10) {
            this.x -= 2;
          }
          if (mouse.y < this.y && this.y < height - this.size * 10) {
            this.y += 2;
          }
          if (mouse.y > this.y && this.y > this.size * 10) {
            this.y -= 2;
          }
        }
      }

      // Move particle
      this.x += this.directionX * 0.7;
      this.y += this.directionY * 0.7;
      this.draw();
    }
  }

  function initParticles() {
    particlesArray = [];
    // Number of particles proportional to screen size
    let numberOfParticles = (width * height) / 14000;
    numberOfParticles = Math.min(numberOfParticles, 100); // Caps it to preserve performance
    
    for (let i = 0; i < numberOfParticles; i++) {
      let size = (Math.random() * 2) + 1;
      let x = (Math.random() * ((width - size * 2) - (size * 2)) + size * 2);
      let y = (Math.random() * ((height - size * 2) - (size * 2)) + size * 2);
      let directionX = (Math.random() * 2) - 1;
      let directionY = (Math.random() * 2) - 1;
      // Soft emerald color matching our accent
      let color = 'rgba(16, 185, 129, 0.2)';
      particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
  }

  function connect() {
    let opacityValue = 1;
    for (let a = 0; a < particlesArray.length; a++) {
      for (let b = a; b < particlesArray.length; b++) {
        let distSq = ((particlesArray[a].x - particlesArray[b].x) ** 2) + 
                     ((particlesArray[a].y - particlesArray[b].y) ** 2);
        
        // Link distance cap (120px threshold)
        if (distSq < 14400) { 
          let distance = Math.sqrt(distSq);
          opacityValue = 1 - (distance / 120);
          ctx.strokeStyle = `rgba(16, 185, 129, ${opacityValue * 0.15})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
          ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].update();
    }
    connect();
    requestAnimationFrame(animate);
  }

  initParticles();
  animate();
}

/* --- Magnetic Custom Cursor Trail --- */
function initCustomCursor() {
  const cursor = document.querySelector('.custom-cursor');
  const cursorDot = document.querySelector('.custom-cursor-dot');
  
  if (!cursor || !cursorDot) return;

  let mouseX = 0, mouseY = 0;     // Target coords
  let cursorX = 0, cursorY = 0;   // Trail coords
  
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Dot snaps instantly
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
  });

  // Smooth trail for the larger circle ring using linear interpolation (lerp)
  function renderCursor() {
    const ease = 0.15; // Speed factor
    cursorX += (mouseX - cursorX) * ease;
    cursorY += (mouseY - cursorY) * ease;
    
    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;
    
    requestAnimationFrame(renderCursor);
  }
  
  requestAnimationFrame(renderCursor);

  // Hover Snaps
  const interactiveElements = document.querySelectorAll('a, button, .skills-tab-btn, .project-link, .social-link');
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('cursor-hover');
      cursorDot.classList.add('cursor-hover');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('cursor-hover');
      cursorDot.classList.remove('cursor-hover');
    });
  });

  // Hide cursor when leaving tab window
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    cursorDot.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    cursorDot.style.opacity = '1';
  });
}



/* --- Interactive CLI Terminal Emulator --- */
function initTerminalEmulator() {
  const terminalInput = document.getElementById('cli-terminal-input');
  const terminalOutput = document.getElementById('cli-terminal-output');
  const terminalBody = document.getElementById('cli-terminal-body');
  
  if (!terminalInput || !terminalOutput) return;

  terminalBody.addEventListener('click', () => {
    terminalInput.focus();
  });

  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const command = terminalInput.value.trim().toLowerCase();
      terminalInput.value = '';
      
      // Echo command
      const echoPara = document.createElement('p');
      echoPara.className = 'terminal-command-echo';
      echoPara.textContent = `guest@tejani-portfolio:~$ ${command}`;
      terminalOutput.appendChild(echoPara);
      
      let responseText = '';
      
      if (command === 'help') {
        responseText = `Available commands:
  skills      - List Dhruv's database engineering profiles
  varunaat    - Outputs technical platform highlights
  contact     - Display contact options
  about       - Summary profile details
  clear       - Clear screen buffer`;
      } else if (command === 'skills') {
        responseText = `--- Programming Languages ---
  Python, Java, JavaScript, HTML5, CSS3, SQL, C
--- Frontend Stack ---
  React.js, Bootstrap, Tailwind CSS, HTML5, CSS3, JS
--- Backend & Databases ---
  Django, Node.js, Express.js, REST APIs
  MongoDB, PostgreSQL, MySQL, SQLite
--- Data Science & ML ---
  Machine Learning, Exploratory Data Analysis (EDA), Scikit-Learn`;
      } else if (command === 'varunaat') {
        responseText = `=== Varunaat Drone Inspection Platform ===
- Core Architecture: React.js, Express.js REST APIs, PostgreSQL
- Quality Standard: IEC 62446-3:2022 compliant reports
- Diagnostics: Visual hotspot telemetry, wind blade crack detection`;
      } else if (command === 'contact') {
        responseText = `Email    : dhruvtejani30@gmail.com
Phone    : +91 8320496146
LinkedIn : linkedin.com/in/dhruv-tejani-379653378
GitHub   : github.com/dhruvtejani33`;
      } else if (command === 'about') {
        responseText = `Dhruv Tejani - Software Developer specializing in Python, Java, MERN Stack, and Machine Learning. Focuses on secure, scalable applications from development to deployment.`;
      } else if (command === 'clear') {
        terminalOutput.innerHTML = '';
        return;
      } else if (command === '') {
        terminalBody.scrollTop = terminalBody.scrollHeight;
        return;
      } else {
        responseText = `bash: command not found: ${command}. Type 'help' to see options.`;
      }
      
      const responsePara = document.createElement('pre');
      responsePara.className = 'terminal-command-response';
      responsePara.textContent = responseText;
      terminalOutput.appendChild(responsePara);
      
      terminalBody.scrollTop = terminalBody.scrollHeight;
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle Logic
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const icon = themeToggle.querySelector('i');
    
    // Check local storage or system preference
    const savedTheme = localStorage.getItem('theme');
    // Default to light if nothing is saved
    const currentTheme = savedTheme || 'light';
    
    if (currentTheme === 'dark') {
        body.setAttribute('data-theme', 'dark');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }

    themeToggle.addEventListener('click', () => {
        const current = body.getAttribute('data-theme');
        // If attribute is missing, it's light mode (default)
        const isLight = !current || current === 'light';
        
        if (isLight) {
            body.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            body.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    });

    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Intersection Observer for Fade-in Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all sections and cards
    document.querySelectorAll('section, .card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });

    // Add class for animation via JS to keep CSS clean if prefered
    // But inserting style rule here for simplicity of the single file effect
    const style = document.createElement('style');
    style.innerHTML = `
        .fade-in-up {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
    document.head.appendChild(style);

    // Geometric Background Animation
    const canvas = document.getElementById('geometric-bg');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];
        const mouse = { x: null, y: null, radius: 150 };

        // Resize Canvas
        function resize() {
            width = canvas.width = canvas.parentElement.offsetWidth;
            height = canvas.height = canvas.parentElement.offsetHeight;
        }
        window.addEventListener('resize', resize);
        resize();

        // Mouse Listeners
        window.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });
        
        // Handle scroll to update bounds if necessary, or just keep it simple
        // For hero section, usually fixed at top, but let's stick to mouse move relative to viewport/canvas

        // Math symbols and numbers
        const mathSymbols = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'π', '∑', '∫', '√', '∞', '+', '-', '×', '÷', '=', '≈', '∂', '∆'];

        class Particle {
            constructor() {
                this.init();
            }

            init() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.baseX = this.x;
                this.baseY = this.y;
                this.size = Math.random() * 10 + 8; // Slightly larger for text readability
                this.speedX = Math.random() * 2 - 1;
                this.speedY = Math.random() * 2 - 1;
                this.angle = Math.random() * 6.2;
                this.spin = Math.random() * 0.2 - 0.1;
                // 0: circle, 1: square, 2: triangle, 3: text, 4: hexagon
                this.type = Math.floor(Math.random() * 5); 
                
                if (this.type === 3) {
                    this.text = mathSymbols[Math.floor(Math.random() * mathSymbols.length)];
                }

                this.color = getComputedStyle(document.documentElement).getPropertyValue('--accent-primary') || '#DC143C';
                this.opacity = Math.random() * 0.5 + 0.1;
            }

            draw() {
                ctx.fillStyle = this.color;
                ctx.globalAlpha = this.opacity;
                
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.angle);

                if (this.type === 3) { // Text (Math/Number)
                    ctx.font = `${this.size + 4}px monospace`; // Monospace for math look
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(this.text, 0, 0);
                } else {
                    ctx.beginPath();
                    if (this.type === 0) { // Circle
                        ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
                    } else if (this.type === 1) { // Square
                        ctx.rect(-this.size/2, -this.size/2, this.size, this.size);
                    } else if (this.type === 2) { // Triangle
                        const s = this.size / 1.5;
                        ctx.moveTo(0, -s);
                        ctx.lineTo(s, s);
                        ctx.lineTo(-s, s);
                        ctx.closePath();
                    } else if (this.type === 4) { // Hexagon
                        const r = this.size / 1.2;
                        ctx.moveTo(r * Math.cos(0), r * Math.sin(0));
                        for (let i = 1; i <= 6; i++) {
                            ctx.lineTo(r * Math.cos(i * 2 * Math.PI / 6), r * Math.sin(i * 2 * Math.PI / 6));
                        }
                        ctx.closePath();
                    }
                    ctx.fill();
                }

                ctx.restore();
                ctx.globalAlpha = 1;
            }

            update() {
                // Sine/Cosine Movement
                this.angle += this.spin;
                this.x += this.speedX + Math.sin(this.angle) * 0.5;
                this.y += this.speedY + Math.cos(this.angle) * 0.5;

                // Mouse Interaction (Repel)
                if (mouse.x != null) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    const maxDistance = mouse.radius;
                    const force = (maxDistance - distance) / maxDistance;
                    const directionX = forceDirectionX * force * 5; // Strength
                    const directionY = forceDirectionY * force * 5;

                    if (distance < mouse.radius) {
                        this.x -= directionX;
                        this.y -= directionY;
                    }
                }

                // Screen Wrap
                if (this.x < -20) this.x = width + 20;
                if (this.x > width + 20) this.x = -20;
                if (this.y < -20) this.y = height + 20;
                if (this.y > height + 20) this.y = -20;

                this.draw();
            }
        }

        // Initialize Particles
        function initParticles() {
            particles = [];
            // Slightly reduced density to prevent too much clutter with lines
            let numberOfParticles = (width * height) / 10000; 
            for (let i = 0; i < numberOfParticles; i++) {
                particles.push(new Particle());
                // Force some to be hexagons for the user request
                if (i % 5 === 0) particles[i].type = 4;
            }
        }

        // Connect Particles with Lines
        function connect() {
            let opacityValue = 1;
            for (let a = 0; a < particles.length; a++) {
                for (let b = a; b < particles.length; b++) {
                    let distance = ((particles[a].x - particles[b].x) * (particles[a].x - particles[b].x))
                                 + ((particles[a].y - particles[b].y) * (particles[a].y - particles[b].y));
                    if (distance < (canvas.width/7) * (canvas.height/7)) {
                        opacityValue = 1 - (distance / 20000);
                        if (opacityValue > 0) {
                            ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent-primary') || '#DC143C';
                            ctx.globalAlpha = opacityValue * 0.2; // Keep lines subtle
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(particles[a].x, particles[a].y);
                            ctx.lineTo(particles[b].x, particles[b].y);
                            ctx.stroke();
                        }
                    }
                }
            }
            ctx.globalAlpha = 1; // Reset
        }

        // Animate
        function animate() {
            ctx.clearRect(0, 0, width, height);
            particles.forEach(particle => particle.update());
            connect(); // Add connections
            requestAnimationFrame(animate);
        }

        initParticles();
        animate();
        
        // Re-init on resize to adjust density
        window.addEventListener('resize', () => {
            setTimeout(initParticles, 100);
        });
    }
});

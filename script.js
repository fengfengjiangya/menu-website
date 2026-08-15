// ========== 导航栏滚动效果 ==========
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ========== 导航链接激活状态 ==========
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

function setActiveLink() {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        const sectionHeight = section.offsetHeight;
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', setActiveLink);

// ========== 标签页切换 ==========
document.querySelectorAll('.card-tabs').forEach(tabsContainer => {
    const tabs = tabsContainer.querySelectorAll('.tab-item');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        });
    });
});

// ========== 滚动显示动画 (Intersection Observer) ==========
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            revealObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

// 为需要动画的元素添加 reveal 类
document.querySelectorAll('.price-card, .feature-card, .section-header, .cherry-product, .cherry-footer').forEach(el => {
    el.classList.add('reveal');
    revealObserver.observe(el);
});

// ========== 鼠标跟随光晕效果 ==========
document.querySelectorAll('.price-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});

// ========== 平滑滚动增强 ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            const offsetTop = targetElement.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ========== 购买按钮点击效果 ==========
document.querySelectorAll('.purchase-btn, .nav-btn, .btn-primary').forEach(btn => {
    btn.addEventListener('click', function(e) {
        // 创建涟漪效果
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: rippleEffect 0.6s ease-out;
            pointer-events: none;
            z-index: 100;
        `;
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// 添加涟漪动画关键帧
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes rippleEffect {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(styleSheet);

// ========== 价格卡片3D倾斜效果 ==========
document.querySelectorAll('.price-card').forEach(card => {
    let isHovering = false;
    
    card.addEventListener('mouseenter', () => {
        isHovering = true;
    });
    
    card.addEventListener('mouseleave', () => {
        isHovering = false;
        card.style.transform = '';
    });
    
    card.addEventListener('mousemove', (e) => {
        if (!isHovering) return;
        
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / centerY * -5;
        const rotateY = (x - centerX) / centerX * 5;
        
        const baseScale = card.classList.contains('card-purple') ? 'scale(1.02)' : 'scale(1)';
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) ${baseScale}`;
        card.style.transition = 'transform 0.1s ease';
    });
});

// ========== 数字递增动画 ==========
function animateNumber(element, target, duration = 1500) {
    const start = 0;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // 缓动函数
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(start + (target - start) * easeOutQuart);
        
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = target;
        }
    }
    
    requestAnimationFrame(update);
}

// 当价格区域进入视野时触发
const priceValueObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const priceEl = entry.target.querySelector('.price-value');
            if (priceEl && !priceEl.dataset.animated) {
                priceEl.dataset.animated = 'true';
                animateNumber(priceEl, 225, 1200);
            }
            priceValueObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const cherryFooter = document.querySelector('.cherry-footer');
if (cherryFooter) {
    priceValueObserver.observe(cherryFooter);
}

// ========== 特色服务卡片点击反馈 ==========
document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('click', function() {
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
        }, 150);
    });
});

// ========== 页面加载完成后触发初始动画 ==========
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// ========== 防止移动端地址栏隐藏导致的布局问题 ==========
let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);

window.addEventListener('resize', () => {
    vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
});

console.log('%c🎮 线上小玩具 - 专业脚本商城', 'color: #b084ff; font-size: 20px; font-weight: bold;');
console.log('%c专业脚本 · 稳定护航 · 品质值得信赖', 'color: #5b9dff; font-size: 14px;');

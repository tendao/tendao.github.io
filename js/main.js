(function() {
    'use strict';

    // const serviceContactHref = 'https://work.weixin.qq.com/kfid/dc24a73';
    const serviceContactHref = '#';
    function initFloatingContact() {
        if (document.querySelector('.floating-contact')) return;
        const widget = document.createElement('aside');
        widget.className = 'floating-contact';
        widget.setAttribute('aria-label', '联系方式');
        widget.innerHTML = `
        <!-- <a class="floating-contact__item floating-contact__phone" href="tel:13800138000">
            <span class="floating-contact__phone-text"><span>咨询热线</span><strong>13800138000</strong></span>
            <img src="img/phone-telephone.png" alt="" aria-hidden="true">
        </a> -->
        <a class="floating-contact__item floating-contact__wechat" href="${serviceContactHref}" target="_blank" rel="noopener" data-service-contact aria-label="微信咨询">
            <img src="img/im-bubble-pc-white.png" alt="" aria-hidden="true">
        </a>
        <div class="floating-contact__qr" aria-hidden="true">
            <img src="img/qrcode.png" alt="微信咨询二维码">
        </div>`;
        document.body.appendChild(widget);
    }
    initFloatingContact();

    // =============================================================
    // 汉堡菜单（移动端抽屉）
    // =============================================================
    const hamburger = document.getElementById('hamburgerBtn');
    const mobileOverlay = document.getElementById('mobileMenuOverlay');

    if (hamburger && mobileOverlay) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('is-active');
            mobileOverlay.classList.toggle('is-open');
            document.body.style.overflow = mobileOverlay.classList.contains('is-open') ? 'hidden' : '';
        });
        mobileOverlay.addEventListener('click', function(e) {
            if (e.target === this) {
                hamburger.classList.remove('is-active');
                mobileOverlay.classList.remove('is-open');
                document.body.style.overflow = '';
            }
        });
        // 暴露关闭方法（供外部调用）
        window.closeMobileMenu = function() {
            hamburger.classList.remove('is-active');
            mobileOverlay.classList.remove('is-open');
            document.body.style.overflow = '';
        };
    }

    // =============================================================
    // 悬浮咨询
    // =============================================================
    const consultToggle = document.getElementById('consultToggle');
    const consultPanel = document.getElementById('consultPanel');

    if (consultToggle && consultPanel) {
        consultToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            consultPanel.classList.toggle('is-open');
        });
        document.addEventListener('click', function(e) {
            if (!consultPanel.contains(e.target) && e.target !== consultToggle) {
                consultPanel.classList.remove('is-open');
            }
        });
    }

    // =============================================================
    // 顶部滚动阴影
    // =============================================================
    const header = document.querySelector('[data-site-header]');
    if (header) {
        window.addEventListener('scroll', function() {
            header.classList.toggle('scrolled', window.scrollY > 10);
        }, { passive: true });
    }

    // =============================================================
    // ESC 关闭所有弹窗
    // =============================================================
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (mobileOverlay && mobileOverlay.classList.contains('is-open')) {
                if (typeof window.closeMobileMenu === 'function') {
                    window.closeMobileMenu();
                }
            }
            if (document.getElementById('bottomMenuPopup') && document.getElementById('bottomMenuPopup').classList.contains('is-open')) {
                if (typeof window.closeBottomPopup === 'function') {
                    window.closeBottomPopup();
                }
            }
            if (consultPanel && consultPanel.classList.contains('is-open')) {
                consultPanel.classList.remove('is-open');
            }
            const langMenu = document.getElementById('langMenu');
            if (langMenu && langMenu.classList.contains('is-open')) {
                langMenu.classList.remove('is-open');
            }
        }
    });

    // =============================================================
    // 窗口 resize 处理
    // =============================================================
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            if (window.innerWidth > 768) {
                if (mobileOverlay && mobileOverlay.classList.contains('is-open')) {
                    if (typeof window.closeMobileMenu === 'function') {
                        window.closeMobileMenu();
                    }
                }
                if (document.getElementById('bottomMenuPopup') && document.getElementById('bottomMenuPopup').classList.contains('is-open')) {
                    if (typeof window.closeBottomPopup === 'function') {
                        window.closeBottomPopup();
                    }
                }
            }
        }, 200);
    });

    // =============================================================
    // 点击页面其他地方关闭桌面子菜单
    // =============================================================
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.nav-links')) {
            document.querySelectorAll('.nav-links > li.is-open').forEach(function(li) {
                li.classList.remove('is-open');
                const link = li.querySelector('a');
                if (link) link.setAttribute('aria-expanded', 'false');
            });
        }
    });

    console.log('✅ 辅助功能初始化完成');
})();
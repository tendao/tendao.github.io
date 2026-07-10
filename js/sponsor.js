/**
 * sponsor.js
 * 赞助打赏模态层 - 右键/长按触发
 * 可在任意页面引入使用
 * 
 * 使用方式:
 *   <!-- 在 HTML 中引入 -->
 *   <link rel="stylesheet" href="css/sponsor.css">
 *   <script src="js/sponsor.js"></script>
 * 
 *   <!-- 自定义配置（可选） -->
 *   <script>
 *     window.SPONSOR_CONFIG = {
 *       title: '☕️ 赞助支持',
 *       subtitle: '如果 MainTank 对您有帮助，欢迎打赏支持开源项目',
 *       footer: '感谢您的支持 ❤️',
 *       wechat: 'assets/qr-wechat.png',
 *       alipay: 'assets/qr-alipay.png',
 *       paypal: 'assets/qr-paypal.png'
 *     };
 *   </script>
 */
(function() {
    'use strict';

    // =============================================================
    // 1. 默认配置
    // =============================================================
    const DEFAULT_CONFIG = {
        title: '☕️ 赞助支持',
        subtitle: '如果对您有帮助，欢迎打赏支持',
        footer: '感谢您的支持 ❤️',
        wechat: 'assets/qr-wechat.png',
        alipay: 'assets/qr-alipayHK.png',
        paypal: 'assets/qr-paypal.png',
        wechatLabel: 'Wechat Pay',
        alipayLabel: 'Alipay HK',
        paypalLabel: 'PayPal',
        longPressDelay: 750, // 长按触发延迟（毫秒）
        moveThreshold: 15,    // 长按移动阈值（像素）
        excludeTags: ['input', 'textarea', 'select'] // 不触发右键/长按的元素标签
    };

    // 合并用户配置
    function getConfig() {
        const userConfig = window.SPONSOR_CONFIG || {};
        return Object.assign({}, DEFAULT_CONFIG, userConfig);
    }

    // =============================================================
    // 2. 创建模态层 DOM（如果不存在）
    // =============================================================
    function createModal() {
        const config = getConfig();
        const existing = document.getElementById('sponsorModal');
        if (existing) return existing;

        const modal = document.createElement('div');
        modal.id = 'sponsorModal';
        modal.className = 'sponsor-modal';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-label', '赞助打赏');

        modal.innerHTML = `
            <div class="sponsor-modal__overlay"></div>
            <div class="sponsor-modal__panel">
                <button class="sponsor-modal__close" id="sponsorClose" aria-label="关闭赞助窗口">✕</button>
                <h3 class="sponsor-modal__title" data-i18n="common.sponsor_title">${config.title}</h3>
                <p class="sponsor-modal__sub" data-i18n="common.sponsor_subtitle">${config.subtitle}</p>
                <div class="sponsor-modal__qrs">
                    <div class="sponsor-qr" data-payment="wechat">
                        <img src="${config.wechat}" alt="微信收款码" onerror="this.style.display='none';this.nextElementSibling.style.display='block';">
                        <span class="sponsor-qr__fallback">微信支付</span>
                        <p class="sponsor-qr__label" data-i18n="common.sponsor_wechatpay">${config.wechatLabel}</p>
                    </div>
                    <div class="sponsor-qr" data-payment="alipay">
                        <img src="${config.alipay}" alt="支付宝收款码" onerror="this.style.display='none';this.nextElementSibling.style.display='block';">
                        <span class="sponsor-qr__fallback">支付宝香港</span>
                        <p class="sponsor-qr__label" data-i18n="common.sponsor_alipay_hk">${config.alipayLabel}</p>
                    </div>
                    <div class="sponsor-qr" data-payment="paypal">
                        <img src="${config.paypal}" alt="PayPal 收款码" onerror="this.style.display='none';this.nextElementSibling.style.display='block';">
                        <span class="sponsor-qr__fallback">PayPal</span>
                        <p class="sponsor-qr__label" data-i18n="common.sponsor_paypal">${config.paypalLabel}</p>
                    </div>
                </div>
                <p class="sponsor-modal__footer" data-i18n="common.sponsor_footer">${config.footer}</p>
            </div>
        `;

        document.body.appendChild(modal);
        return modal;
    }

    // =============================================================
    // 3. 核心功能
    // =============================================================
    function initSponsor() {
        const config = getConfig();
        const modal = createModal();
        const closeBtn = document.getElementById('sponsorClose');
        let longPressTimer = null;
        let isLongPress = false;
        let touchStartX = 0, touchStartY = 0;

        // 检查元素是否应排除（输入框等）
        function shouldExclude(el) {
            if (!el) return false;
            const tag = el.tagName.toLowerCase();
            if (config.excludeTags.indexOf(tag) !== -1) return true;
            if (el.isContentEditable) return true;
            // 检查是否在赞助面板内部
            if (el.closest && el.closest('.sponsor-modal__panel')) return true;
            return false;
        }

        // 打开模态
        function openSponsor(e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            // 如果已经打开，不重复打开
            if (modal.classList.contains('is-open')) return;
            modal.classList.add('is-open');
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            // 重新触发面板动画
            const panel = modal.querySelector('.sponsor-modal__panel');
            if (panel) {
                panel.style.animation = 'none';
                requestAnimationFrame(() => {
                    panel.style.animation = '';
                });
            }
        }

        // 关闭模态
        function closeSponsor() {
            modal.classList.remove('is-open');
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }

        // 点击遮罩关闭
        modal.addEventListener('click', function(e) {
            if (e.target === modal || e.target.classList.contains('sponsor-modal__overlay')) {
                closeSponsor();
            }
        });

        // 关闭按钮
        if (closeBtn) {
            closeBtn.addEventListener('click', closeSponsor);
        }

        // ESC 关闭
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.classList.contains('is-open')) {
                closeSponsor();
            }
        });

        // ----- 桌面端：右键触发 -----
        document.addEventListener('contextmenu', function(e) {
            if (shouldExclude(e.target)) return;
            openSponsor(e);
        });

        // ----- 移动端：长按触发 -----
        document.addEventListener('touchstart', function(e) {
            if (e.touches.length !== 1) return;
            const touch = e.touches[0];
            touchStartX = touch.clientX;
            touchStartY = touch.clientY;
            isLongPress = false;

            // 检查触摸目标是否应排除
            const target = document.elementFromPoint(touchStartX, touchStartY);
            if (shouldExclude(target)) return;

            longPressTimer = setTimeout(function() {
                isLongPress = true;
                // 重新检查目标是否在赞助面板内
                const currentTarget = document.elementFromPoint(touchStartX, touchStartY);
                if (currentTarget && currentTarget.closest && currentTarget.closest('.sponsor-modal__panel')) {
                    return;
                }
                openSponsor(e);
            }, config.longPressDelay);
        }, { passive: true });

        document.addEventListener('touchmove', function(e) {
            if (e.touches.length !== 1) {
                clearTimeout(longPressTimer);
                return;
            }
            const touch = e.touches[0];
            const dx = touch.clientX - touchStartX;
            const dy = touch.clientY - touchStartY;
            if (Math.sqrt(dx*dx + dy*dy) > config.moveThreshold) {
                clearTimeout(longPressTimer);
            }
        }, { passive: true });

        document.addEventListener('touchend', function(e) {
            clearTimeout(longPressTimer);
            if (isLongPress) {
                e.preventDefault();
                // 阻止后续 click 事件导致误触
                const clickHandler = function(ev) {
                    ev.preventDefault();
                    ev.stopPropagation();
                    document.removeEventListener('click', clickHandler, true);
                };
                document.addEventListener('click', clickHandler, true);
                // 清理：如果 300ms 内没有触发，移除监听
                setTimeout(function() {
                    document.removeEventListener('click', clickHandler, true);
                }, 300);
            }
        }, { passive: false });

        // 暴露 API
        window.SPONSOR = {
            open: openSponsor,
            close: closeSponsor,
            toggle: function() {
                if (modal.classList.contains('is-open')) {
                    closeSponsor();
                } else {
                    openSponsor();
                }
            }
        };

        console.log('✅ 赞助打赏模块已激活（右键/长按触发）');
    }

    // =============================================================
    // 4. 启动
    // =============================================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSponsor);
    } else {
        initSponsor();
    }

})();
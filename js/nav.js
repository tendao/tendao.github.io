/**
 * nav.js
 * 导航菜单生成（桌面、移动抽屉、底部导航）
 * 支持多级子菜单，自动高亮当前页面
 */
(function() {
    'use strict';

    // =============================================================
    // 1. 菜单数据（移除所有硬编码 active）
    // =============================================================
    const navItems = [{
        id: 'home',
        labelKey: 'common.nav_home',
        url: 'index.html',
        match: ['openSourceMall.html','javaMallSystem.html','miniappMall.html','mallPrivateDeployment.html','visualDecoration.html','distributionSystem.html'],  // 额外匹配 html
        icon: '🏠'
    }, {
        id: 'product',
        labelKey: 'common.nav_product',
        url: 'micro.html',          // 父菜单也指向一个页面
        icon: '📦',
        children: [
            { labelKey: 'common.nav_microservice', url: 'micro.html' },
            { labelKey: 'common.nav_saas', url: 'saas.html' },
            // {
            //     labelKey: 'common.nav_more',
            //     children: [
            //         { labelKey: 'common.nav_ecommerce', url: '#' },
            //         { labelKey: 'common.nav_finance', url: '#' },
            //         { labelKey: 'common.nav_health', url: '#' }
            //     ]
            // }
        ]
    }, {
        id: 'solution',
        labelKey: 'common.nav_solution',
        url: 'product.html',          // 父菜单也指向一个页面
        icon: '💡',
        children: [
            { 
                labelKey: 'common.nav_ecommerce', 
                url: 'product.html',
                match: ['goodsCenter.html','orderFulfillment.html','marketingTools.html'],  // 额外匹配 html
            },
            { labelKey: 'common.nav_s2b2c', url: 's2b2c.html' },
            { 
                labelKey: 'common.nav_ai_mall', 
                url: 'aiMall.html',
                match: ['aiCustomerService.html','aiSearch.html','aiStatistics.html'],  // 额外匹配 html
            },
            // { labelKey: 'common.nav_finance', url: '#' },
            // { labelKey: 'common.nav_health', url: '#' },
            // { labelKey: 'common.nav_education', url: '#' }
        ]
    }, {
        id: 'about',
        labelKey: 'common.nav_about',
        url: 'chijiema.html',          // 父菜单也指向一个页面
        icon: '👤',
        // children: [
        //     { labelKey: 'common.nav_company', url: 'chijiema.html' },   // 与父菜单同 URL
        //     { labelKey: 'common.nav_team', url: '#' },
        //     { labelKey: 'common.nav_contact', url: '#' }
        // ]
    }, {
        id: 'video',
        labelKey: 'common.nav_video',
        url: 'videoList.html',
        match: ['videoPlay.html'],  // 额外匹配 videoPlay.html
        icon: '🎬'
    }, {
        id: 'quote',
        labelKey: 'common.nav_quote',
        url: 'quote.html',
        icon: '💰'
    }];

    // =============================================================
    // 2. 工具函数
    // =============================================================
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const isTouchDevice = () => ('ontouchstart' in window || navigator.maxTouchPoints > 0);

    // 翻译辅助
    function t(key) {
        if (window.__i18n && typeof window.__i18n.t === 'function') {
            return window.__i18n.t(key);
        }
        return key;
    }

    // 判断一个菜单项是否应高亮（自身或子菜单匹配当前路径）
    // function isItemActive(item) {
    //     // 如果当前项本身有 URL 且匹配
    //     if (item.url && item.url === currentPath) return true;
    //     // 检查子菜单（递归）
    //     if (item.children) {
    //         for (var i = 0; i < item.children.length; i++) {
    //             if (isItemActive(item.children[i])) return true;
    //         }
    //     }
    //     return false;
    // }
    function isItemActive(item) {

        // 取当前页面的文件名（不含目录）
        // const currentFile = window.location.pathname.split('/').pop() || 'index.html';

        // 1. 检查自身的 url 是否匹配
        if (item.url && item.url === currentPath) return true;
        // 2. 检查 match 数组（新增）
        if (item.match && Array.isArray(item.match) && item.match.indexOf(currentPath) !== -1) return true;
        // 3. 检查子菜单（递归）
        if (item.children) {
            for (var i = 0; i < item.children.length; i++) {
                if (isItemActive(item.children[i])) return true;
            }
        }
        return false;
    }

    // =============================================================
    // 3. 构建桌面导航
    // =============================================================
    function buildDesktopMenu(container) {
        container.innerHTML = '';
        navItems.forEach(function(item) {
            const li = document.createElement('li');
            li.setAttribute('role', 'none');

            const a = document.createElement('a');
            a.setAttribute('role', 'menuitem');

            const hasChildren = item.children && item.children.length > 0;
            const isActive = isItemActive(item);

            if (hasChildren) {
                a.setAttribute('aria-haspopup', 'true');
                a.setAttribute('aria-expanded', 'false');
                a.href = 'javascript:void(0)';
                // 触屏设备点击展开/折叠
                a.addEventListener('click', function(e) {
                    if (isTouchDevice()) {
                        e.preventDefault();
                        const parentLi = this.closest('li');
                        if (parentLi) {
                            const isOpen = parentLi.classList.contains('is-open');
                            // 关闭同级其他
                            const siblings = parentLi.parentElement.querySelectorAll('li.is-open');
                            siblings.forEach(function(s) {
                                if (s !== parentLi) s.classList.remove('is-open');
                            });
                            parentLi.classList.toggle('is-open');
                            this.setAttribute('aria-expanded', parentLi.classList.contains('is-open') ? 'true' : 'false');
                        }
                    }
                });
                // 鼠标悬停展开（桌面）
                li.addEventListener('mouseenter', function() {
                    if (!isTouchDevice()) {
                        const siblings = this.parentElement.querySelectorAll('li.is-open');
                        siblings.forEach(function(s) {
                            if (s !== this) s.classList.remove('is-open');
                        }, this);
                        this.classList.add('is-open');
                        const link = this.querySelector('a');
                        if (link) link.setAttribute('aria-expanded', 'true');
                    }
                });
                li.addEventListener('mouseleave', function(e) {
                    if (!isTouchDevice()) {
                        const related = e.relatedTarget;
                        if (related && this.contains(related)) return;
                        setTimeout(function() {
                            if (!li.matches(':hover')) {
                                li.classList.remove('is-open');
                                const link = li.querySelector('a');
                                if (link) link.setAttribute('aria-expanded', 'false');
                            }
                        }, 150);
                    }
                });
            } else {
                a.href = item.url || '#';
            }

            a.textContent = t(item.labelKey);
            if (isActive) {
                a.classList.add('active');
            }
            if (hasChildren) {
                const arrow = document.createElement('span');
                arrow.className = 'arrow';
                arrow.textContent = '▾';
                a.appendChild(arrow);
            }
            li.appendChild(a);

            if (hasChildren) {
                const subUl = document.createElement('ul');
                subUl.className = 'dropdown-menu';
                subUl.setAttribute('role', 'menu');
                buildSubMenu(subUl, item.children);
                li.appendChild(subUl);
            }

            container.appendChild(li);
        });
    }

    function buildSubMenu(container, items) {
        items.forEach(function(item) {
            const li = document.createElement('li');
            li.setAttribute('role', 'none');
            const a = document.createElement('a');
            a.setAttribute('role', 'menuitem');

            const hasChildren = item.children && item.children.length > 0;
            const isActive = isItemActive(item);

            if (hasChildren) {
                a.setAttribute('aria-haspopup', 'true');
                a.setAttribute('aria-expanded', 'false');
                a.href = 'javascript:void(0)';
                a.addEventListener('click', function(e) {
                    if (isTouchDevice()) {
                        e.preventDefault();
                        const parentLi = this.closest('li');
                        if (parentLi) {
                            const siblings = parentLi.parentElement.querySelectorAll('li.is-open');
                            siblings.forEach(function(s) {
                                if (s !== parentLi) s.classList.remove('is-open');
                            });
                            parentLi.classList.toggle('is-open');
                            this.setAttribute('aria-expanded', parentLi.classList.contains('is-open') ? 'true' : 'false');
                        }
                    }
                });
                li.addEventListener('mouseenter', function() {
                    if (!isTouchDevice()) {
                        const siblings = this.parentElement.querySelectorAll('li.is-open');
                        siblings.forEach(function(s) {
                            if (s !== this) s.classList.remove('is-open');
                        }, this);
                        this.classList.add('is-open');
                        const link = this.querySelector('a');
                        if (link) link.setAttribute('aria-expanded', 'true');
                    }
                });
                li.addEventListener('mouseleave', function(e) {
                    if (!isTouchDevice()) {
                        const related = e.relatedTarget;
                        if (related && this.contains(related)) return;
                        setTimeout(function() {
                            if (!li.matches(':hover')) {
                                li.classList.remove('is-open');
                                const link = li.querySelector('a');
                                if (link) link.setAttribute('aria-expanded', 'false');
                            }
                        }, 150);
                    }
                });
            } else {
                a.href = item.url || '#';
            }
            a.textContent = t(item.labelKey);
            if (isActive) {
                a.style.color = 'var(--sub-accent)';
                a.style.fontWeight = '600';
            }
            if (hasChildren) {
                const arrow = document.createElement('span');
                arrow.className = 'arrow';
                arrow.textContent = '▾';
                a.appendChild(arrow);
            }
            li.appendChild(a);
            if (hasChildren) {
                const subUl = document.createElement('ul');
                subUl.className = 'dropdown-menu';
                subUl.setAttribute('role', 'menu');
                buildSubMenu(subUl, item.children);
                li.appendChild(subUl);
            }
            container.appendChild(li);
        });
    }

    // =============================================================
    // 4. 构建移动端抽屉菜单
    // =============================================================
    function buildMobileMenu(container) {
        container.innerHTML = '';
        navItems.forEach(function(item) {
            const li = document.createElement('li');
            const hasChildren = item.children && item.children.length > 0;
            const isActive = isItemActive(item);

            if (hasChildren) {
                li.classList.add('has-sub');
                const btn = document.createElement('button');
                btn.className = 'mobile-menu-toggle';
                btn.setAttribute('aria-expanded', 'false');
                btn.type = 'button';
                btn.innerHTML = t(item.labelKey) + ' <span class="arrow">▾</span>';
                const subUl = document.createElement('ul');
                subUl.className = 'mobile-sub-menu';
                buildMobileSubMenu(subUl, item.children);
                li.appendChild(btn);
                li.appendChild(subUl);
                btn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const isOpen = subUl.classList.contains('is-open');
                    const parentLi = this.closest('li');
                    if (parentLi) {
                        const siblings = parentLi.parentElement.querySelectorAll('li.has-sub > .mobile-sub-menu.is-open');
                        siblings.forEach(function(s) {
                            if (s !== subUl) {
                                s.classList.remove('is-open');
                                const t = s.closest('li').querySelector('.mobile-menu-toggle');
                                if (t) t.setAttribute('aria-expanded', 'false');
                            }
                        });
                    }
                    subUl.classList.toggle('is-open');
                    this.setAttribute('aria-expanded', subUl.classList.contains('is-open') ? 'true' : 'false');
                });
                // 如果当前项或其子项高亮，默认展开子菜单
                if (isActive) {
                    subUl.classList.add('is-open');
                    btn.setAttribute('aria-expanded', 'true');
                }
            } else {
                const a = document.createElement('a');
                a.href = item.url || '#';
                a.textContent = t(item.labelKey);
                if (isActive) {
                    a.classList.add('active');
                }
                li.appendChild(a);
            }
            container.appendChild(li);
        });
    }

    function buildMobileSubMenu(container, items) {
        items.forEach(function(item) {
            const li = document.createElement('li');
            const hasChildren = item.children && item.children.length > 0;
            const isActive = isItemActive(item);

            if (hasChildren) {
                li.classList.add('has-sub');
                const btn = document.createElement('button');
                btn.className = 'mobile-menu-toggle';
                btn.setAttribute('aria-expanded', 'false');
                btn.type = 'button';
                btn.innerHTML = t(item.labelKey) + ' <span class="arrow">▾</span>';
                const subUl = document.createElement('ul');
                subUl.className = 'mobile-sub-menu';
                buildMobileSubMenu(subUl, item.children);
                li.appendChild(btn);
                li.appendChild(subUl);
                btn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const isOpen = subUl.classList.contains('is-open');
                    const parentLi = this.closest('li');
                    if (parentLi) {
                        const siblings = parentLi.parentElement.querySelectorAll('li.has-sub > .mobile-sub-menu.is-open');
                        siblings.forEach(function(s) {
                            if (s !== subUl) {
                                s.classList.remove('is-open');
                                const t = s.closest('li').querySelector('.mobile-menu-toggle');
                                if (t) t.setAttribute('aria-expanded', 'false');
                            }
                        });
                    }
                    subUl.classList.toggle('is-open');
                    this.setAttribute('aria-expanded', subUl.classList.contains('is-open') ? 'true' : 'false');
                });
                if (isActive) {
                    subUl.classList.add('is-open');
                    btn.setAttribute('aria-expanded', 'true');
                }
            } else {
                const a = document.createElement('a');
                a.href = item.url || '#';
                a.textContent = t(item.labelKey);
                if (isActive) {
                    a.style.color = 'var(--sub-accent)';
                    a.style.fontWeight = '600';
                }
                li.appendChild(a);
            }
            container.appendChild(li);
        });
    }

    // =============================================================
    // 5. 构建底部导航
    // =============================================================
    // function buildBottomNav(container) {
    //     container.innerHTML = '';
    //     navItems.forEach(function(item) {
    //         const hasChildren = item.children && item.children.length > 0;
    //         const isActive = isItemActive(item);

    //         const el = document.createElement(hasChildren ? 'button' : 'a');
    //         el.className = 'bottom-nav-item';

    //         if (hasChildren) {
    //             el.setAttribute('type', 'button');
    //             el.dataset.popup = item.id;
    //             const indicator = document.createElement('span');
    //             indicator.className = 'sub-indicator';
    //             indicator.textContent = '▾';
    //             const iconSpan = document.createElement('span');
    //             iconSpan.className = 'icon';
    //             iconSpan.textContent = item.icon || '📄';
    //             const labelSpan = document.createElement('span');
    //             labelSpan.className = 'label';
    //             labelSpan.textContent = t(item.labelKey);
    //             el.appendChild(iconSpan);
    //             el.appendChild(labelSpan);
    //             el.appendChild(indicator);
    //             el.addEventListener('click', function(e) {
    //                 e.preventDefault();
    //                 const key = this.dataset.popup;
    //                 if (key) {
    //                     renderPopupMenu(key);
    //                 }
    //             });
    //         } else {
    //             el.href = item.url || '#';
    //             const iconSpan = document.createElement('span');
    //             iconSpan.className = 'icon';
    //             iconSpan.textContent = item.icon || '📄';
    //             const labelSpan = document.createElement('span');
    //             labelSpan.className = 'label';
    //             labelSpan.textContent = t(item.labelKey);
    //             el.appendChild(iconSpan);
    //             el.appendChild(labelSpan);
    //             if (isActive) {
    //                 el.classList.add('active');
    //             }
    //         }
    //         container.appendChild(el);
    //     });
    // }
    function buildBottomNav(container) {
        container.innerHTML = '';
        navItems.forEach(function(item) {
            const hasChildren = item.children && item.children.length > 0;
            const isActive = isItemActive(item);   // 统一计算是否高亮

            const el = document.createElement(hasChildren ? 'button' : 'a');
            el.className = 'bottom-nav-item';

            if (hasChildren) {
                el.setAttribute('type', 'button');
                el.dataset.popup = item.id;
                const indicator = document.createElement('span');
                indicator.className = 'sub-indicator';
                indicator.textContent = '▾';
                const iconSpan = document.createElement('span');
                iconSpan.className = 'icon';
                iconSpan.textContent = item.icon || '📄';
                const labelSpan = document.createElement('span');
                labelSpan.className = 'label';
                labelSpan.textContent = t(item.labelKey);
                el.appendChild(iconSpan);
                el.appendChild(labelSpan);
                el.appendChild(indicator);

                // ✅ 新增：父菜单高亮
                if (isActive) {
                    el.classList.add('active');
                }

                el.addEventListener('click', function(e) {
                    e.preventDefault();
                    const key = this.dataset.popup;
                    if (key) {
                        renderPopupMenu(key);
                    }
                });
            } else {
                el.href = item.url || '#';
                const iconSpan = document.createElement('span');
                iconSpan.className = 'icon';
                iconSpan.textContent = item.icon || '📄';
                const labelSpan = document.createElement('span');
                labelSpan.className = 'label';
                labelSpan.textContent = t(item.labelKey);
                el.appendChild(iconSpan);
                el.appendChild(labelSpan);
                if (isActive) {
                    el.classList.add('active');
                }
            }
            container.appendChild(el);
        });
    }

    // =============================================================
    // 6. 底部弹出菜单（与之前相同，但使用新菜单数据）
    // =============================================================
    const bottomPopup = document.getElementById('bottomMenuPopup');
    const bottomOverlay = document.getElementById('bottomMenuOverlay');
    const popupList = document.getElementById('popupList');
    const popupTitle = document.getElementById('popupTitle');
    const popupClose = document.getElementById('popupCloseBtn');

    function renderPopupMenu(id) {
        let targetItem = null;
        navItems.forEach(function(item) {
            if (item.id === id) {
                targetItem = item;
            }
        });
        if (!targetItem || !targetItem.children) {
            if (targetItem && targetItem.url) {
                window.location.href = targetItem.url;
            }
            return;
        }
        popupTitle.textContent = t(targetItem.labelKey);
        popupList.innerHTML = '';
        targetItem.children.forEach(function(child) {
            const li = document.createElement('li');
            const hasChildren = child.children && child.children.length > 0;
            const isActive = isItemActive(child);

            if (hasChildren) {
                const toggle = document.createElement('button');
                toggle.className = 'popup-toggle';
                toggle.type = 'button';
                toggle.innerHTML = t(child.labelKey) + ' <span class="arrow">▾</span>';
                toggle.setAttribute('aria-expanded', 'false');
                const subUl = document.createElement('ul');
                subUl.className = 'popup-sub';
                child.children.forEach(function(grandchild) {
                    const subLi = document.createElement('li');
                    const a = document.createElement('a');
                    a.href = grandchild.url || '#';
                    a.textContent = t(grandchild.labelKey);
                    if (isItemActive(grandchild)) {
                        a.style.color = 'var(--sub-accent)';
                        a.style.fontWeight = '600';
                    }
                    subLi.appendChild(a);
                    subUl.appendChild(subLi);
                });
                li.appendChild(toggle);
                li.appendChild(subUl);
                toggle.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const isOpen = subUl.classList.contains('is-open');
                    const parentLi = this.closest('li');
                    if (parentLi) {
                        const siblings = parentLi.parentElement.querySelectorAll('li > .popup-sub.is-open');
                        siblings.forEach(function(s) {
                            if (s !== subUl) {
                                s.classList.remove('is-open');
                                const t = s.closest('li').querySelector('.popup-toggle');
                                if (t) t.setAttribute('aria-expanded', 'false');
                            }
                        });
                    }
                    subUl.classList.toggle('is-open');
                    this.setAttribute('aria-expanded', subUl.classList.contains('is-open') ? 'true' : 'false');
                });
                if (isActive) {
                    subUl.classList.add('is-open');
                    toggle.setAttribute('aria-expanded', 'true');
                }
            } else {
                const a = document.createElement('a');
                a.href = child.url || '#';
                a.textContent = t(child.labelKey);
                if (isActive) {
                    a.style.color = 'var(--sub-accent)';
                    a.style.fontWeight = '600';
                }
                li.appendChild(a);
            }
            popupList.appendChild(li);
        });
        bottomPopup.classList.add('is-open');
        bottomOverlay.classList.add('is-open');
        document.body.style.overflow = 'hidden';
        document.querySelectorAll('.bottom-nav-item').forEach(function(btn) {
            btn.classList.toggle('active', btn.dataset.popup === id);
        });
    }

    function closeBottomPopup() {
        bottomPopup.classList.remove('is-open');
        bottomOverlay.classList.remove('is-open');
        document.body.style.overflow = '';
    }

    if (popupClose) {
        popupClose.addEventListener('click', closeBottomPopup);
    }
    if (bottomOverlay) {
        bottomOverlay.addEventListener('click', function(e) {
            if (e.target === this) closeBottomPopup();
        });
    }

    // =============================================================
    // 7. 重建所有菜单（供语言切换调用）
    // =============================================================
    function rebuildNav() {
        const desktopContainer = document.querySelector('.nav-links');
        const mobileContainer = document.querySelector('.mobile-nav-list');
        const bottomContainer = document.querySelector('.bottom-nav-inner');
        if (desktopContainer) buildDesktopMenu(desktopContainer);
        if (mobileContainer) buildMobileMenu(mobileContainer);
        if (bottomContainer) buildBottomNav(bottomContainer);

        document.dispatchEvent(new CustomEvent('navRebuilt'));

        console.log('🔄 菜单已重新渲染（语言切换）');
    }

    // =============================================================
    // 8. 初始化
    // =============================================================
    function initNav() {
        rebuildNav();
        window.rebuildNav = rebuildNav;
        window.closeBottomPopup = closeBottomPopup;
        console.log('✅ 导航模块已初始化（自动高亮当前页面）');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initNav);
    } else {
        initNav();
    }



/* ===== 移动端标题栏 ===== */
//     function createMobileHeader() {
//         if (document.getElementById('mobileHeader')) return;
//         const header = document.createElement('div');
//         header.id = 'mobileHeader';
//         header.className = 'mobile-header';
//         header.style.display = 'none';
//         header.innerHTML = `
//             <button class="mobile-header__back" aria-label="返回">‹</button>
//             <span class="mobile-header__title"></span>
//         `;
//         // 插入到 body 最前面
//         document.body.insertBefore(header, document.body.firstChild);
//     }

//     function updateMobileHeader() {
//         const header = document.getElementById('mobileHeader');
//         if (!header) return;

//         const isMobile = window.innerWidth <= 768;
//         const currentPath = window.location.pathname.split('/').pop() || 'index.html';
//         const isHome = currentPath === 'index.html' || currentPath === '';

//         if (isMobile && !isHome) {
//             header.style.display = 'flex';
//             // 标题：从 document.title 提取
//             let title = document.title;
//             // 去掉常见的后缀
//             const suffixIndex = title.lastIndexOf(' - ');
//             if (suffixIndex > 0) {
//                 title = title.substring(0, suffixIndex);
//             }
//             if (!title.trim()) title = 'MainTank';
//             header.querySelector('.mobile-header__title').textContent = title;

//             const backBtn = header.querySelector('.mobile-header__back');
//             backBtn.onclick = function(e) {
//                 e.preventDefault();
//                 if (window.history.length > 1) {
//                     window.history.back();
//                 } else {
//                     window.location.href = 'index.html';
//                 }
//             };

//             document.body.classList.add('has-mobile-header');
//         } else {
//             header.style.display = 'none';
//             document.body.classList.remove('has-mobile-header');
//         }
//     }

//     // 初始化
//     createMobileHeader();
//     updateMobileHeader();

//     // 监听 resize
//     let headerResizeTimer;
//     window.addEventListener('resize', function() {
//         clearTimeout(headerResizeTimer);
//         headerResizeTimer = setTimeout(updateMobileHeader, 150);
//     });

//     // 监听语言切换（标题可能变化）
//     document.addEventListener('languageChanged', function() {
//         updateMobileHeader();
//     });

//     // 导航重建后，可能标题不变，但以防万一也更新
//     document.addEventListener('navRebuilt', function() {
//         updateMobileHeader();
//     });
// // 移动端标题栏控制
//     function initMobileHeader() {
//         const header = document.getElementById('mobileHeader');
//         if (!header) return;

//         const backBtn = document.getElementById('mobileBack');
//         const titleEl = document.getElementById('mobileTitle');
//         const menuBtn = document.getElementById('mobileMenuBtn');

//         // 判断是否为首页（根据当前路径或 data-page）
//         const isHome = window.location.pathname === '/' || 
//                        window.location.pathname.split('/').pop() === '' ||
//                        document.body.dataset.page === 'index';

//         // 返回按钮：非首页显示，首页隐藏
//         if (backBtn) {
//             if (isHome) {
//                 backBtn.style.display = 'none';
//             } else {
//                 backBtn.style.display = 'flex';
//                 backBtn.addEventListener('click', function() {
//                     window.history.back();
//                 });
//             }
//         }

//         // 标题：从 data-i18n 或 document.title 获取
//         if (titleEl) {
//             // 尝试从 data-i18n 获取
//             const pageTitleKey = document.body.dataset.pageTitleKey || 'page_title';
//             // 如果页面有 data-i18n 属性，尝试读取
//             const titleNode = document.querySelector('[data-i18n="' + pageTitleKey + '"]');
//             if (titleNode && titleNode.textContent) {
//                 titleEl.textContent = titleNode.textContent;
//             } else {
//                 // 否则从 document.title 截取
//                 let title = document.title;
//                 // 去掉站点名后缀，只保留主要标题
//                 const sep = title.indexOf(' - ');
//                 if (sep > 0) title = title.substring(0, sep);
//                 titleEl.textContent = title || 'MainTank';
//             }
//         }

//         // 菜单按钮：打开移动端抽屉菜单
//         if (menuBtn) {
//             const hamburger = document.getElementById('hamburgerBtn');
//             if (hamburger) {
//                 menuBtn.addEventListener('click', function(e) {
//                     e.stopPropagation();
//                     hamburger.click(); // 模拟点击汉堡菜单
//                 });
//             } else {
//                 // 如果没有 hamburgerBtn，自己实现
//                 menuBtn.addEventListener('click', function() {
//                     const overlay = document.getElementById('mobileMenuOverlay');
//                     if (overlay) {
//                         overlay.classList.toggle('is-open');
//                         document.body.style.overflow = overlay.classList.contains('is-open') ? 'hidden' : '';
//                     }
//                 });
//             }
//         }
//     }

//     // 页面加载完成后初始化
//     if (document.readyState === 'loading') {
//         document.addEventListener('DOMContentLoaded', initMobileHeader);
//     } else {
//         initMobileHeader();
//     }

})();
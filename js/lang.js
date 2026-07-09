(function() {
    'use strict';

    // =============================================================
    // 1. 内置后备翻译（含菜单项和页面标题）
    // =============================================================
    const FALLBACK_TRANSLATIONS = {
        common:{
            zh:{
                page_title: 'MainTank',
                nav_home: '首页',
                nav_product: '产品',
                nav_microservice: '微服务',
                nav_saas: '多租户',
                nav_s2b2c: '供应商商城',
                nav_more: '更多方案 >',
                nav_solution: '解决方案',
                nav_about: '关于',
                nav_quote: '报价',
                nav_company: '公司介绍',
                nav_team: '团队介绍',
                nav_contact: '联系我们',
                nav_ecommerce: '电商方案',
                nav_ai_mall: 'AI电商方案',
                nav_finance: '金融方案',
                nav_health: '医疗方案',
                nav_education: '教育方案',
                nav_product_function: '功能',
                nav_product_function_infra: '基础设施',
                nav_product_function_bpm: '工作流程',
                nav_product_function_pay: '支付功能',
                nav_product_function_member: '会员中心',
                nav_product_function_report: '数据报表',
                nav_product_function_devops: '研发运维',
                nav_product_common: '组件 >',
                nav_product_common_data: '数据权限',
                nav_product_common_tenant: '多租户',
                nav_product_service: '功能',
                nav_product_service_ai: 'AI大模型平台',
                nav_video: '影片',
                footer_text1: "© 2026 MainTank · 樱桃科技有限公司",
                footer_text2: "基于 Java 的 · H5 · App · PC"
            },
            en: {
                page_title: 'MainTank',
                nav_home: 'Home',
                nav_product: 'Products',
                nav_microservice: 'Microservices',
                nav_saas: 'SaaS Multi-tenant',
                nav_s2b2c: 'S2B2C',
                nav_more: 'More Solutions >',
                nav_solution: 'Solutions',
                nav_about: 'About',
                nav_quote: 'Pricing',
                nav_company: 'Company',
                nav_team: 'Team',
                nav_contact: 'Contact',
                nav_ecommerce: 'E-commerce',
                nav_finance: 'Finance',
                nav_health: 'Healthcare',
                nav_education: 'Education',
                nav_video: 'Videos',
                footer_text1: "© 2026 MainTank · 樱桃科技有限公司",
                footer_text2: "Based on Java · H5 · App · PC"
            },
            'zh-HK': {
                page_title: 'MainTank',
                nav_home: '首頁',
                nav_product: '產品',
                nav_microservice: '微服務',
                nav_saas: 'SaaS多租戶',
                nav_s2b2c: 'S2B2C',
                nav_more: '更多方案 >',
                nav_solution: '解決方案',
                nav_about: '關於',
                nav_quote: '報價',
                nav_company: '公司介紹',
                nav_team: '團隊介紹',
                nav_contact: '聯繫我們',
                nav_ecommerce: '電商方案',
                nav_finance: '金融方案',
                nav_health: '醫療方案',
                nav_education: '教育方案',
                nav_video: '影片',
                footer_text1: "© 2026 MainTank · 樱桃科技有限公司",
                footer_text2: "基於 Java 的 · H5 · App · PC"
            }
        }
    };

    // 合并 chijiema 数据
    // if (window.__LANG_CHIJIEMA) {
    //     FALLBACK_TRANSLATIONS.chijiema = window.__LANG_CHIJIEMA;
    // } else {
    //     console.warn('⚠️ window.__LANG_CHIJIEMA 未定义，使用空对象');
    //     FALLBACK_TRANSLATIONS.chijiema = {};
    // }
    const pageNs = document.body.dataset.page || 'home';
    const nsMap = {
        'index': 'home',
        // 'videoList': 'video',
        // 'videoPlay': 'video'
    };
    const nsKey = nsMap[pageNs] || pageNs;
    console.log("nsKey="+nsKey)
    // if (nsKey === 'about' && window.__LANG_ABOUT) {
    //     FALLBACK_TRANSLATIONS.about = window.__LANG_ABOUT;
    // } else 
    if (window['__LANG_' + nsKey.toUpperCase()]) {
        FALLBACK_TRANSLATIONS[nsKey] = window['__LANG_' + nsKey.toUpperCase()];
    } else {
        console.warn('⚠️ 未找到命名空间数据: ' + nsKey);
        FALLBACK_TRANSLATIONS[nsKey] = {};
    }
    
    // =============================================================
    // 2. 状态变量
    // =============================================================
    function initLanguage() {
        let savedLang = null;
        try {
            savedLang = localStorage.getItem('maintank-lang');
        } catch (e) {}
        if (savedLang && (savedLang === 'zh' || savedLang === 'en' || savedLang === 'zh-HK')) {
            loadLanguage(savedLang);
            return;
        }
        const browserLang = navigator.language || navigator.userLanguage;
        let detected = 'zh';
        if (browserLang.startsWith('zh')) {
            detected = browserLang.includes('HK') || browserLang.includes('TW') ? 'zh-HK' : 'zh';
        } else if (browserLang.startsWith('en')) {
            detected = 'en';
        }
        loadLanguage(detected);
    }

    let translations = {};
    let currentLang = 'zh';

    // =============================================================
    // 3. 获取当前页面命名空间（根据 data-page 属性）
    // =============================================================
    function getPageNamespace() {
        const page = document.body.dataset.page || 'home';
        // 映射：index -> home, chijiema -> about, 其他按原样
        const mapping = {
            'index': 'home'
            // ,'chijiema': 'about'
        };
        return mapping[page] || page;
    }

    // =============================================================
    // 4. 应用翻译到页面
    // =============================================================
    function applyTranslations() {
        // 更新所有 data-i18n 元素
        document.querySelectorAll('[data-i18n]').forEach(function(el) {
            const key = el.getAttribute('data-i18n');
            const value = translations[key];
            if (value !== undefined) {
                el.innerHTML = value;
            }
        });

        // 处理 placeholder
        document.querySelectorAll('[data-i18n-placeholder]').forEach(function(el) {
            const key = el.getAttribute('data-i18n-placeholder');
            // const value = getNestedValue(translations, key);
            const value = translations[key];
            if (value !== undefined) {
                el.placeholder = value;
            }
        });

        // 更新 meta 标签
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc && getNestedValue(translations, 'meta_description')) {
            metaDesc.content = getNestedValue(translations, 'meta_description');
        }
        const ogDesc = document.querySelector('meta[property="og:description"]');
        if (ogDesc && getNestedValue(translations, 'og_description')) {
            ogDesc.content = getNestedValue(translations, 'og_description');
        }
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle && getNestedValue(translations, 'og_title')) {
            ogTitle.content = getNestedValue(translations, 'og_title');
        }
        // 更新 title
        if (getNestedValue(translations, 'page_title')) {
            document.title = getNestedValue(translations, 'page_title');
        }

    }
    // 辅助：通过点号路径取值
    function getNestedValue(obj, path) {
        if (!path) return undefined;
        const parts = path.split('.');
        let current = obj;
        for (let i = 0; i < parts.length; i++) {
            if (current && typeof current === 'object' && parts[i] in current) {
                current = current[parts[i]];
            } else {
                return undefined;
            }
        }
        return current;
    }

    // =============================================================
    // 5. 更新语言切换 UI（含国旗）
    // =============================================================
    function updateLangUI() {
        const langToggle = document.getElementById('langToggle');
        if (langToggle) {
            const langText = langToggle.querySelector('.lang-text');
            const langFlag = langToggle.querySelector('.lang-flag');
            if (langText) {
                const map = {
                    'zh': getNestedValue(translations, 'common.lang_zh') || '简体中文',
                    'en': getNestedValue(translations, 'common.lang_en') || 'English',
                    'zh-HK': getNestedValue(translations, 'common.lang_zhHK') || '繁體中文（香港）'
                };
                langText.textContent = map[currentLang] || '简体中文';
            }
            if (langFlag) {
                let flagSVG = '';
                if (currentLang === 'zh') {
                    flagSVG = `<img src="assets/China.webp" alt="中国" width="30" height="30" style="border-radius:2px;object-fit:cover;" loading="lazy">`;
                } else if (currentLang === 'en') {
                    // flagSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18"><rect width="24" height="24" fill="#fff"/><g fill="#b22234"><rect y="0" width="24" height="2"/><rect y="4" width="24" height="2"/><rect y="8" width="24" height="2"/><rect y="12" width="24" height="2"/><rect y="16" width="24" height="2"/><rect y="20" width="24" height="2"/></g><rect width="10" height="12" fill="#3c3b6e"/><g fill="#fff"><circle cx="2.5" cy="2" r=".8"/><circle cx="7.5" cy="2" r=".8"/><circle cx="2.5" cy="6" r=".8"/><circle cx="7.5" cy="6" r=".8"/><circle cx="5" cy="10" r=".8"/><circle cx="2.5" cy="10" r=".8"/></g></svg>`;
                    flagSVG = `<img src="assets/English.jpeg" alt="English" width="30" height="30" style="border-radius:2px;object-fit:cover;" loading="lazy">`;
                } else if (currentLang === 'zh-HK') {
                    flagSVG = `<img src="assets/ChinaHK.jpeg" alt="中國香港" width="30" height="30" style="border-radius:2px;object-fit:cover;" loading="lazy">`;
                }
                langFlag.innerHTML = flagSVG;
            }
        }

        // 桌面端下拉菜单高亮
        const langMenu = document.getElementById('langMenu');
        if (langMenu) {
            langMenu.querySelectorAll('li').forEach(function(li) {
                li.classList.toggle('active', li.dataset.lang === currentLang);
            });
        }

        // 移动端语言选项高亮
        document.querySelectorAll('.mobile-lang-options button').forEach(function(btn) {
            btn.classList.toggle('active', btn.dataset.lang === currentLang);
        });
    }

    // =============================================================
    // 6. 加载语言（核心）
    // =============================================================
    function loadLanguage(lang) {
        // 获得页面名称，index转换为home前缀
        const pageNs = getPageNamespace();
        const namespaces = ['common', pageNs];
        // 去重
        const uniqueNs = [...new Set(namespaces)];

        // 合并后备翻译
        let fallbackMerged = {};
        uniqueNs.forEach(function(ns) {
            console.log('FALLBACK_TRANSLATIONS[' + ns + '][' + lang + ']');
            if (FALLBACK_TRANSLATIONS[ns][lang]) {
                Object.keys(FALLBACK_TRANSLATIONS[ns][lang]).forEach(function(key) {
                    // console.log(ns + '.' + key + '=FALLBACK_TRANSLATIONS['+ns+']['+lang+']['+key+']');
                    fallbackMerged[ns + '.' + key] = FALLBACK_TRANSLATIONS[ns][lang][key];
                });
            }
        });

        // 如果已经是当前语言且已有翻译，直接应用
        if (lang === currentLang && Object.keys(translations).length > 0) {
            applyTranslations();
            updateLangUI();
            if (typeof window.rebuildNav === 'function') {
                window.rebuildNav();
            }
            return;
        }

        // 使用 Promise 并行加载所有命名空间的 JSON
        const fetchPromises = uniqueNs.map(function(ns) {
            console.log('locales/' + ns + '/' + lang + '.json');
            return fetch('locales/' + ns + '/' + lang + '.json')
                .then(function(res) {
                    if (!res.ok) throw new Error('HTTP ' + res.status);
                    return res.json();
                })
                .then(function(data) {
                    // 为每个翻译键添加命名空间前缀
                    const prefixed = {};
                    Object.keys(data).forEach(function(key) {
                        prefixed[ns + '.' + key] = data[key];
                    });
                    return prefixed;
                })
                .catch(function() {
                    console.warn('⚠️ 加载 locales/' + ns + '/' + lang + '.json 失败，使用后备');
                    // 从 fallback 中提取该命名空间的键
                    const nsFallback = {};
                    Object.keys(fallbackMerged).forEach(function(fullKey) {
                        if (fullKey.startsWith(ns + '.')) {
                            nsFallback[fullKey] = fallbackMerged[fullKey];
                        }
                    });
                    return nsFallback;
                });
        });

        Promise.all(fetchPromises)
            .then(function(results) {
                // 合并所有命名空间的翻译
                const merged = {};
                results.forEach(function(obj) {
                    Object.assign(merged, obj);
                });
                translations = merged;
                currentLang = lang;
                applyTranslations();
                updateLangUI();
                if (typeof window.rebuildNav === 'function') {
                    window.rebuildNav();
                }
                try {
                    localStorage.setItem('maintank-lang', lang);
                } catch (e) {}
            })
            .catch(function(err) {
                console.error('语言加载失败:', err);
            });
    }

    // =============================================================
    // 7. 初始化
    // =============================================================
    function initLanguage() {
        let savedLang = null;
        try {
            savedLang = localStorage.getItem('maintank-lang');
        } catch (e) {}
        if (savedLang && (savedLang === 'zh' || savedLang === 'en' || savedLang === 'zh-HK')) {
            loadLanguage(savedLang);
            return;
        }
        // const browserLang = navigator.language || navigator.userLanguage;
        // let detected = 'zh';
        // if (browserLang.startsWith('zh')) {
        //     detected = browserLang.includes('HK') || browserLang.includes('TW') ? 'zh-HK' : 'zh';
        // } else if (browserLang.startsWith('en')) {
        //     detected = 'en';
        // }
        // loadLanguage(detected);
        // 自动检测浏览器语言
        const detected = detectBrowserLanguage();
        console.log('🌐 自动检测浏览器语言:', detected);
        loadLanguage(detected);
    }

    // =============================================================
    // 8. 检测浏览器语言（增强版）
    // =============================================================
    function detectBrowserLanguage() {
        const lang = navigator.language || navigator.userLanguage || 'zh-CN';
        // 标准化：处理 'zh-Hant', 'zh-Hans', 'zh-CN', 'zh-TW', 'zh-HK', 'en-US', 'en-GB' 等
        let normalized = lang.toLowerCase().replace('_', '-');
        // 先处理中文变体
        if (normalized.startsWith('zh')) {
            // 检查是否包含 'hk' 或 'tw' 或 'hant'（繁体）
            if (normalized.includes('hk') || normalized.includes('tw') || normalized.includes('hant')) {
                return 'zh-HK';
            }
            // 其他中文（含 'cn', 'sg', 'hans' 等）都视为简体
            return 'zh';
        } else if (normalized.startsWith('en')) {
            return 'en';
        }
        // 其他语言默认返回 en
        return 'en';
    }

    // =============================================================
    // 9. 绑定事件
    // =============================================================
    function bindEvents() {
        const langMenu = document.getElementById('langMenu');
        if (langMenu) {
            langMenu.querySelectorAll('li').forEach(function(item) {
                item.addEventListener('click', function() {
                    const lang = this.dataset.lang;
                    if (lang) {
                        loadLanguage(lang);
                        langMenu.classList.remove('is-open');
                    }
                });
            });
        }

        document.querySelectorAll('.mobile-lang-options button').forEach(function(btn) {
            btn.addEventListener('click', function() {
                const lang = this.dataset.lang;
                if (lang) {
                    loadLanguage(lang);
                }
            });
        });

        const langToggle = document.getElementById('langToggle');
        if (langToggle && langMenu) {
            langToggle.addEventListener('click', function(e) {
                e.stopPropagation();
                langMenu.classList.toggle('is-open');
            });
            document.addEventListener('click', function(e) {
                if (!langMenu.contains(e.target) && e.target !== langToggle) {
                    langMenu.classList.remove('is-open');
                }
            });
        }
    }

    // =============================================================
    // 9. 启动
    // =============================================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            initLanguage();
            bindEvents();
        });
    } else {
        initLanguage();
        bindEvents();
    }

    // // 在 loadLanguage 成功后触发 languageChanged 自定义事件
    // Promise.all(fetchPromises).then(function(results) {
    //     // ... 合并翻译数据 ...
    //     translations = merged;
    //     currentLang = lang;
    //     applyTranslations();
    //     updateLangUI();
    //     if (typeof window.rebuildNav === 'function') {
    //         window.rebuildNav();
    //     }
    //     // 触发语言切换事件，供视频播放页等模块监听
    //     document.dispatchEvent(new CustomEvent('languageChanged', {
    //         detail: { lang: currentLang }
    //     }));
    //     // 保存语言偏好
    //     try {
    //         localStorage.setItem('maintank-lang', lang);
    //     } catch (e) {}
    //     // ✅ 触发国际化就绪事件
    //     document.dispatchEvent(new CustomEvent('i18nReady', {
    //         detail: { lang: currentLang }
    //     }));
    // })
    // .catch(function(err) {
    //     console.error('语言加载失败:', err);
    // });
    

    // 暴露接口
    window.__i18n = {
        currentLang: function() { return currentLang; },
        t: function(key) {
            return translations[key] !== undefined ? translations[key] : key;
        },
        load: loadLanguage
    };

    console.log('🌐 国际化模块已初始化（含菜单、标题、国旗）');
})();
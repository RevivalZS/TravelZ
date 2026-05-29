// 旅游景点网站 - 主脚本

// API 配置
// 部署到线上后，把下面的地址改成你的后端实际地址
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? ''  // 本地开发，使用相对路径（同源）
    : 'https://web-production-a1c5d.up.railway.app';  // ← 改成你的线上后端地址

// 用户标识系统
const USER_ID_KEY = 'travelz_user_id';
const ADMIN_USER_ID = 'admin';  // 管理员用户ID

// 获取或创建用户ID
function getUserId() {
    let userId = localStorage.getItem(USER_ID_KEY);
    if (!userId) {
        // 生成随机用户ID
        userId = 'user_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem(USER_ID_KEY, userId);
    }
    return userId;
}

// 检查是否是管理员
function isAdmin() {
    return localStorage.getItem(USER_ID_KEY) === ADMIN_USER_ID;
}

// 设置为管理员（需要密码）
function setAdmin(password) {
    // 简单密码验证，你可以改成更复杂的
    if (password === 'travelz2024') {
        localStorage.setItem(USER_ID_KEY, ADMIN_USER_ID);
        return true;
    }
    return false;
}

// 初始化用户ID
const currentUserId = getUserId();

// 地理编码缓存
const geocodeCache = {};

// 图片缓存
const imageCache = {};

// 初始化数据
let placesData = [];
let currentFilter = 'all';

// DOM元素
const placesContainer = document.getElementById('places-container');
const filterTags = document.querySelectorAll('.tag');
const modal = document.getElementById('place-modal');
const closeModal = document.querySelector('.close-modal');
const shareForm = document.querySelector('.share-form');
const submitButton = document.getElementById('submit-place');
const shareMessage = document.getElementById('share-message');

// Leaflet地图实例
let modalMap = null;

// 初始化函数
async function init() {
    // 更新管理员按钮状态
    updateAdminButton();
    
    await loadPlacesData();
    renderPlaces();
    setupEventListeners();
}

// 更新管理员按钮显示
function updateAdminButton() {
    const adminBtn = document.getElementById('admin-btn');
    if (adminBtn) {
        if (isAdmin()) {
            adminBtn.textContent = '退出管理';
            adminBtn.style.backgroundColor = '#e74c3c';
            adminBtn.style.color = 'white';
            adminBtn.style.borderColor = '#e74c3c';
        } else {
            adminBtn.textContent = '管理员';
            adminBtn.style.backgroundColor = 'transparent';
            adminBtn.style.color = '#666';
            adminBtn.style.borderColor = '#ddd';
        }
    }
}

// 加载景点数据（从后端 API）
async function loadPlacesData() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/places`, {
            headers: {
                'X-User-ID': currentUserId
            }
        });
        if (response.ok) {
            const data = await response.json();
            // 后端返回 lat/lng 独立字段，转成前端期望的 coordinates 格式
            placesData = (data.places || []).map(p => ({
                ...p,
                coordinates: { lat: p.lat || 0, lng: p.lng || 0 }
            }));
        } else {
            console.warn('API 请求失败，使用示例数据');
            placesData = getSamplePlaces();
        }
    } catch (error) {
        console.error('加载数据失败:', error);
        placesData = getSamplePlaces();
    }
}

// 获取示例数据
function getSamplePlaces() {
    return [
        {
            id: 1,
            name: "张家界国家森林公园",
            location: "湖南张家界",
            description: "以奇特的石英砂岩峰林地貌闻名，电影《阿凡达》取景地之一。",
            image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            tags: ["自然", "徒步"],
            coordinates: { lat: 29.1171, lng: 110.4792 }
        },
        {
            id: 2,
            name: "故宫博物院",
            location: "北京",
            description: "明清两代的皇家宫殿，世界上现存规模最大、保存最为完整的木质结构古建筑群。",
            image: "https://images.pexels.com/photos/18549401/pexels-photo-18549401.jpeg?auto=compress&cs=tinysrgb&w=800",
            tags: ["历史", "文化"],
            coordinates: { lat: 39.9163, lng: 116.3972 }
        },
        {
            id: 3,
            name: "外滩",
            location: "上海",
            description: "上海最具代表性的城市景观，汇集了不同时期、不同风格的建筑。",
            image: "https://images.pexels.com/photos/32467111/pexels-photo-32467111.jpeg?auto=compress&cs=tinysrgb&w=800",
            tags: ["城市", "夜景"],
            coordinates: { lat: 31.2337, lng: 121.4905 }
        },
        {
            id: 4,
            name: "成都宽窄巷子",
            location: "四川成都",
            description: "体验成都慢生活的好去处，集美食、文化、休闲于一体。",
            image: "https://images.pexels.com/photos/5338329/pexels-photo-5338329.jpeg?auto=compress&cs=tinysrgb&w=800",
            tags: ["美食", "文化"],
            coordinates: { lat: 30.6634, lng: 104.0627 }
        }
    ];
}

// 渲染景点卡片
function renderPlaces() {
    if (!placesContainer) return;

    // 清空容器
    placesContainer.innerHTML = '';

    // 筛选景点
    const filteredPlaces = currentFilter === 'all'
        ? placesData
        : placesData.filter(place => place.tags.includes(currentFilter));

    if (filteredPlaces.length === 0) {
        placesContainer.innerHTML = `
            <div class="no-results" style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                <i class="fas fa-map-marker-alt" style="font-size: 3rem; color: #ccc; margin-bottom: 20px;"></i>
                <h3>暂无景点</h3>
                <p>暂时没有找到符合条件的景点，去分享一个吧！</p>
            </div>
        `;
        return;
    }

    // 创建景点卡片
    filteredPlaces.forEach(place => {
        const card = createPlaceCard(place);
        placesContainer.appendChild(card);
    });
}

// 创建单个景点卡片
function createPlaceCard(place) {
    const card = document.createElement('div');
    card.className = 'place-card';
    card.dataset.id = place.id;

    const imageUrl = getImageUrl(place);
    const fallbackUrl = getFallbackImage(place.id);
    const unsplashUrl = place.image || '';

    // 处理标签
    const tagsHtml = place.tags.map(tag =>
        `<span class="place-tag">${tag}</span>`
    ).join('');

    // 地图链接
    const mapLink = getMapLink(place);

    card.innerHTML = `
        <div class="image-container">
            <img src="${imageUrl}" alt="${place.name}" class="place-image" loading="lazy"
                 data-unsplash="${escapeHtml(unsplashUrl)}"
                 data-fallback="${escapeHtml(fallbackUrl)}"
                 onerror="handleImageError(this);">
            <div class="image-loading">加载中...</div>
        </div>
        <div class="place-info">
            <h3 class="place-name">${place.name}</h3>
            <div class="place-location">
                <i class="fas fa-map-marker-alt"></i>
                <span>${place.location}</span>
                ${hasValidCoordinates(place) ? `<span class="coords-badge" title="经纬度: ${place.coordinates.lat.toFixed(4)}, ${place.coordinates.lng.toFixed(4)}"><i class="fas fa-globe-asia"></i></span>` : ''}
            </div>
            <p class="place-description">${place.description}</p>
            <div class="place-tags">${tagsHtml}</div>
            <div class="card-actions">
                <button class="view-details" onclick="showPlaceDetails(${place.id})">
                    查看详情
                </button>
                <a href="${escapeHtml(mapLink)}" target="_blank" class="map-link-btn" title="在地图中查看位置">
                    <i class="fas fa-map"></i>
                </a>
                ${place.can_delete !== false ? `
                <button class="delete-btn" onclick="deletePlace(${place.id}, '${escapeHtml(place.name)}')" title="删除此景点">
                    <i class="fas fa-trash"></i>
                </button>
                ` : ''}
            </div>
        </div>
    `;

    // 图片加载完成后隐藏加载提示
    const img = card.querySelector('.place-image');
    const loading = card.querySelector('.image-loading');
    img.addEventListener('load', function() {
        if (loading) loading.style.display = 'none';
    });

    return card;
}

// 图片加载错误处理（多级回退）
function handleImageError(img) {
    const placeId = img.closest('.place-card')?.dataset?.id || '1';
    const fallbackImages = getFallbackImages(placeId);
    
    // 获取当前图片的 src
    const currentSrc = img.src;
    
    // 尝试下一个备选图片
    for (let i = 0; i < fallbackImages.length - 1; i++) {
        if (currentSrc.includes(fallbackImages[i]) || 
            currentSrc === fallbackImages[i]) {
            img.src = fallbackImages[i + 1];
            return;
        }
    }
    
    // 如果所有备选都失败，使用默认占位图
    img.onerror = null;  // 防止无限循环
    img.src = `https://via.placeholder.com/800x600/e74c3c/ffffff?text=Image+Not+Found`;
}

// HTML转义
function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// 检查是否有有效坐标
function hasValidCoordinates(place) {
    const coord = place.coordinates;
    if (!coord) return false;
    return !(coord.lat === 0 && coord.lng === 0) &&
           coord.lat >= -90 && coord.lat <= 90 &&
           coord.lng >= -180 && coord.lng <= 180;
}

// 获取地图链接（高德地图）
function getMapLink(place) {
    if (hasValidCoordinates(place)) {
        const { lat, lng } = place.coordinates;
        const name = encodeURIComponent(place.name);
        return `https://uri.amap.com/marker?position=${lng},${lat}&name=${name}`;
    }
    // 没有坐标时，用地点名搜索
    const query = encodeURIComponent(place.name + ' ' + place.location);
    return `https://uri.amap.com/search?keyword=${query}`;
}

// 地理编码：将城市名称转换为坐标
async function geocodeLocation(location) {
    if (!location || location.trim() === '') return null;
    
    // 检查缓存
    if (geocodeCache[location]) {
        return geocodeCache[location];
    }

    try {
        // 使用 Nominatim API（免费，无需 API key）
        const encodedLocation = encodeURIComponent(location);
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodedLocation}&limit=1`,
            {
                headers: {
                    'User-Agent': 'TravelZ-App/1.0'  // Nominatim 要求提供 User-Agent
                }
            }
        );

        if (!response.ok) return null;

        const data = await response.json();
        if (data && data.length > 0) {
            const result = {
                lat: parseFloat(data[0].lat),
                lng: parseFloat(data[0].lon),
                displayName: data[0].display_name
            };
            // 缓存结果
            geocodeCache[location] = result;
            return result;
        }
    } catch (error) {
        console.warn('地理编码失败:', error);
    }
    return null;
}

// 搜索城市图片（使用 Unsplash Source 或 Lorem Picsum）
async function searchCityImage(cityName) {
    if (!cityName || cityName.trim() === '') return null;
    
    // 检查缓存
    if (imageCache[cityName]) {
        return imageCache[cityName];
    }

    try {
        // 方案1：使用 Unsplash Source（免费，无需 API key，直接返回图片）
        // 格式：https://source.unsplash.com/800x600/?城市名,旅游
        const unsplashUrl = `https://source.unsplash.com/800x600/?${encodeURIComponent(cityName)},travel,city`;
        
        // 验证图片是否可用
        const response = await fetch(unsplashUrl, { method: 'HEAD' });
        if (response.ok) {
            imageCache[cityName] = unsplashUrl;
            return unsplashUrl;
        }
    } catch (error) {
        console.warn('Unsplash 图片获取失败，使用备选方案');
    }

    // 方案2：使用 Lorem Picsum（总是可用）
    // 根据城市名生成一个确定性的随机数，保证同一城市总是同一张图
    const hash = cityName.split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a;
    }, 0);
    const imageId = Math.abs(hash) % 1000 + 1;  // 1-1000
    const fallbackUrl = `https://picsum.photos/seed/${cityName}/800/600`;
    
    imageCache[cityName] = fallbackUrl;
    return fallbackUrl;
}

// 预定义的风景图片库（确保图片质量和相关性）
const TRAVEL_IMAGES = [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',  // 山景
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop',  // 自然风光
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&h=600&fit=crop',  // 湖泊
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&h=600&fit=crop',  // 日落
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=600&fit=crop',  // 森林
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop',  // 海滩
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&h=600&fit=crop',  // 雪山
    'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800&h=600&fit=crop',  // 瀑布
    'https://images.unsplash.com/photo-1504198453319-5ce911bafcde?w=800&h=600&fit=crop',  // 城市夜景
    'https://images.unsplash.com/photo-1480796927426-f609979314bd?w=800&h=600&fit=crop',  // 东京
    'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=800&h=600&fit=crop',  // 长城
    'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=800&h=600&fit=crop',  // 古镇
];

// 获取图片URL
function getImageUrl(place) {
    // 如果用户提供了自定义图片URL，优先使用
    if (place.image && place.image.trim() !== '') {
        return place.image;
    }
    
    // 根据景点ID从预定义图片库中选择（循环使用）
    const imageIndex = (place.id - 1) % TRAVEL_IMAGES.length;
    return TRAVEL_IMAGES[imageIndex];
}

// 获取备用图片列表（多个备选源）
function getFallbackImages(placeId) {
    const primaryIndex = (placeId - 1) % TRAVEL_IMAGES.length;
    return [
        TRAVEL_IMAGES[primaryIndex],
        TRAVEL_IMAGES[(primaryIndex + 1) % TRAVEL_IMAGES.length],
        `https://via.placeholder.com/800x600/00b894/ffffff?text=Travel+Spot`
    ];
}

// 获取备用图片
function getFallbackImage(placeId) {
    const images = getFallbackImages(placeId);
    return images[0];
}

// 获取默认图片
function getDefaultImage() {
    return TRAVEL_IMAGES[0];
}

// 显示景点详情
function showPlaceDetails(placeId) {
    const place = placesData.find(p => p.id === placeId);
    if (!place) return;

    const modalDetails = document.getElementById('modal-place-details');

    const imageUrl = getImageUrl(place);
    const mapLink = getMapLink(place);

    // 处理标签
    const tagsHtml = place.tags.map(tag =>
        `<span class="place-tag">${tag}</span>`
    ).join('');

    // 坐标信息
    const coordInfo = hasValidCoordinates(place)
        ? `<div class="coord-info">
            <i class="fas fa-globe-asia"></i>
            <span>${place.coordinates.lat.toFixed(4)}, ${place.coordinates.lng.toFixed(4)}</span>
           </div>`
        : '';

    // 地图区域
    const mapSection = hasValidCoordinates(place)
        ? `<div class="modal-map-container">
            <h3><i class="fas fa-map"></i> 位置地图</h3>
            <div id="modal-leaflet-map" class="leaflet-map-container"></div>
            <a href="${escapeHtml(mapLink)}" target="_blank" class="map-open-link">
                <i class="fas fa-external-link-alt"></i> 在高德地图中打开
            </a>
           </div>`
        : `<div class="modal-map-container no-coords">
            <i class="fas fa-map-marked-alt"></i>
            <p>暂无精确位置坐标</p>
            <a href="${escapeHtml(mapLink)}" target="_blank" class="map-open-link">
                <i class="fas fa-search"></i> 在高德地图中搜索
            </a>
           </div>`;

    modalDetails.innerHTML = `
        <div class="modal-place-content">
            <div class="modal-image-container">
                <img src="${escapeHtml(imageUrl)}" alt="${place.name}" 
                     onerror="handleImageError(this);">
            </div>
            <div class="modal-details">
                <h2 class="modal-place-name">${place.name}</h2>
                <div class="modal-place-location">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${place.location}</span>
                </div>
                ${coordInfo}
                <div class="place-tags">${tagsHtml}</div>
                <p class="modal-place-description">${place.description}</p>
                ${mapSection}
                <div class="modal-share-actions">
                    <button class="btn-share-wechat" onclick="sharePlaceToWeChat(${placeId})">
                        <i class="fab fa-weixin"></i> 分享到微信
                    </button>
                    <button class="btn-share-qq" onclick="sharePlaceToQQ(${placeId})">
                        <i class="fab fa-qq"></i> 分享到QQ
                    </button>
                    <button class="btn-share-link" onclick="copyPlaceLink(${placeId})">
                        <i class="fas fa-link"></i> 复制链接
                    </button>
                </div>
            </div>
        </div>
    `;

    modal.style.display = 'block';

    // 初始化Leaflet地图
    if (hasValidCoordinates(place)) {
        setTimeout(() => initModalMap(place), 100);
    }
}

// 分享景点到微信
function sharePlaceToWeChat(placeId) {
    const place = placesData.find(p => p.id === placeId);
    if (!place) return;

    const mapLink = getMapLink(place);
    const shareText = `推荐一个超棒的景点：${place.name}（${place.location}）\n${place.description}\n\n查看地图：${mapLink}\n\n来自「旅行足迹」分享`;

    // 复制内容并尝试打开微信
    navigator.clipboard.writeText(shareText).then(() => {
        showToast('分享内容已复制，正在打开微信...');
        openApp('weixin');
    }).catch(err => {
        const textarea = document.createElement('textarea');
        textarea.value = shareText;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast('分享内容已复制，正在打开微信...');
        openApp('weixin');
    });
}

// 分享景点到QQ
function sharePlaceToQQ(placeId) {
    const place = placesData.find(p => p.id === placeId);
    if (!place) return;

    const mapLink = getMapLink(place);
    const shareText = `推荐一个超棒的景点：${place.name}（${place.location}）\n${place.description}\n\n查看地图：${mapLink}\n\n来自「旅行足迹」分享`;

    // 复制内容并打开QQ分享页面
    navigator.clipboard.writeText(shareText).then(() => {
        showToast('分享内容已复制，正在打开QQ...');
        openApp('qq');
    }).catch(err => {
        const textarea = document.createElement('textarea');
        textarea.value = shareText;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast('分享内容已复制，正在打开QQ...');
        openApp('qq');
    });
}

// 复制景点链接
function copyPlaceLink(placeId) {
    const place = placesData.find(p => p.id === placeId);
    if (!place) return;

    const mapLink = getMapLink(place);
    const shareText = `${place.name} - ${place.location}\n${mapLink}`;

    navigator.clipboard.writeText(shareText).then(() => {
        showToast('景点链接已复制到剪贴板！');
    }).catch(err => {
        const textarea = document.createElement('textarea');
        textarea.value = shareText;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast('景点链接已复制到剪贴板！');
    });
}

// 初始化模态框中的地图
function initModalMap(place) {
    destroyModalMap();

    const mapEl = document.getElementById('modal-leaflet-map');
    if (!mapEl) return;

    const { lat, lng } = place.coordinates;

    try {
        modalMap = L.map(mapEl).setView([lat, lng], 13);

        // 使用高德地图瓦片（标准图层）
        L.tileLayer('http://wprd0{s}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scl=1&style=7', {
            attribution: '&copy; 高德地图',
            maxZoom: 18,
            subdomains: ['1', '2', '3', '4']
        }).addTo(modalMap);

        L.marker([lat, lng])
            .addTo(modalMap)
            .bindPopup(`<b>${place.name}</b><br>${place.location}`)
            .openPopup();

        // 让地图正确渲染（Leaflet在隐藏元素中初始化需要resize）
        setTimeout(() => {
            if (modalMap) modalMap.invalidateSize();
        }, 200);
    } catch (e) {
        console.warn('地图初始化失败:', e);
        const fallback = mapEl.parentElement.querySelector('.map-fallback-msg');
        if (fallback) fallback.style.display = 'flex';
    }
}

// 销毁模态框中的地图
function destroyModalMap() {
    if (modalMap) {
        modalMap.remove();
        modalMap = null;
    }
}

// 分享到微信（模拟）
function shareToWeChat(placeId) {
    const place = placesData.find(p => p.id === placeId);
    if (!place) return;

    alert(`已生成 "${place.name}" 的分享卡片，请使用微信扫描分享！\n\n提示：在实际部署中，这里会集成微信分享SDK。`);
}

// 复制分享链接
function copyShareLink(placeId) {
    const place = placesData.find(p => p.id === placeId);
    if (!place) return;

    const mapLink = getMapLink(place);
    const shareText = `推荐一个超棒的景点：${place.name}（${place.location}）\n${place.description}\n\n查看地图：${mapLink}\n\n来自「旅行足迹」分享`;

    navigator.clipboard.writeText(shareText).then(() => {
        alert('分享内容已复制到剪贴板！');
    }).catch(err => {
        console.error('复制失败:', err);
        alert('复制失败，请手动复制内容。');
    });
}

// 设置事件监听器
function setupEventListeners() {
    // 筛选标签点击
    filterTags.forEach(tag => {
        tag.addEventListener('click', () => {
            // 移除所有active类
            filterTags.forEach(t => t.classList.remove('active'));
            // 添加active类到点击的标签
            tag.classList.add('active');
            // 更新筛选条件
            currentFilter = tag.dataset.tag;
            // 重新渲染
            renderPlaces();
        });
    });

    // 关闭模态框
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            modal.style.display = 'none';
            destroyModalMap();
        });
    }

    // 点击模态框外部关闭
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
            destroyModalMap();
        }
    });

    // 分享表单提交
    if (submitButton && shareForm) {
        submitButton.addEventListener('click', handleShareSubmit);
    }

    // 表单回车提交
    shareForm?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
            handleShareSubmit();
        }
    });

    // 地点输入实时预览（防抖）
    const locationInput = document.getElementById('place-location');
    let locationTimeout = null;
    
    if (locationInput) {
        locationInput.addEventListener('input', (e) => {
            // 清除之前的定时器
            if (locationTimeout) {
                clearTimeout(locationTimeout);
            }
            
            // 设置新的定时器（500ms 后执行）
            locationTimeout = setTimeout(() => {
                const location = e.target.value.trim();
                if (location.length >= 2) {
                    updateLocationPreview(location);
                } else {
                    hideLocationPreview();
                }
            }, 500);
        });
    }
}

// 更新地点预览
async function updateLocationPreview(location) {
    const previewContainer = document.getElementById('map-preview-container');
    const locationHint = document.getElementById('location-hint');
    const mapPreview = document.getElementById('map-preview');
    const imagePreview = document.getElementById('image-preview');

    if (!previewContainer || !locationHint) return;

    // 显示加载状态
    locationHint.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 正在搜索位置...';
    previewContainer.style.display = 'block';

    try {
        // 并行获取地理编码和图片
        const [geoResult, cityImage] = await Promise.all([
            geocodeLocation(location),
            searchCityImage(location)
        ]);

        // 更新位置提示
        if (geoResult) {
            locationHint.innerHTML = `<i class="fas fa-map-marker-alt" style="color: #00b894;"></i> ${geoResult.displayName || location}`;
            
            // 初始化地图预览
            initMapPreview(mapPreview, geoResult.lat, geoResult.lng, location);
        } else {
            locationHint.innerHTML = '<i class="fas fa-exclamation-circle" style="color: #e74c3c;"></i> 未找到该位置，提交后可手动定位';
            mapPreview.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #999;">无法加载地图预览</div>';
        }

        // 更新图片预览
        if (cityImage) {
            imagePreview.innerHTML = `
                <img src="${cityImage}" alt="${location}" 
                     onerror="this.parentElement.innerHTML='<span class=\\'image-error\\'>图片加载失败</span>'"
                     onload="this.style.display='block'">
                <div style="margin-top: 10px; font-size: 0.85rem; color: #666;">
                    <i class="fas fa-image"></i> 自动获取的城市图片（可在上方覆盖自定义URL）
                </div>
            `;
        } else {
            imagePreview.innerHTML = '<span class="image-loading">正在搜索城市图片...</span>';
        }

    } catch (error) {
        console.error('预览更新失败:', error);
        locationHint.innerHTML = '<i class="fas fa-exclamation-triangle" style="color: #f39c12;"></i> 预览加载失败，但不影响提交';
    }
}

// 隐藏地点预览
function hideLocationPreview() {
    const previewContainer = document.getElementById('map-preview-container');
    const locationHint = document.getElementById('location-hint');
    
    if (previewContainer) {
        previewContainer.style.display = 'none';
    }
    if (locationHint) {
        locationHint.innerHTML = '';
    }
}

// 初始化地图预览
let previewMap = null;

function initMapPreview(container, lat, lng, locationName) {
    if (!container) return;

    // 清除之前的地图
    if (previewMap) {
        previewMap.remove();
        previewMap = null;
    }

    try {
        // 清空容器
        container.innerHTML = '';
        
        // 初始化 Leaflet 地图
        previewMap = L.map(container).setView([lat, lng], 12);
        
        // 使用高德地图瓦片（标准图层）
        L.tileLayer('http://wprd0{s}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scl=1&style=7', {
            attribution: '&copy; 高德地图',
            maxZoom: 18,
            subdomains: ['1', '2', '3', '4']
        }).addTo(previewMap);

        // 添加标记
        L.marker([lat, lng])
            .addTo(previewMap)
            .bindPopup(`<b>${locationName}</b>`)
            .openPopup();

        // 确保地图正确渲染
        setTimeout(() => {
            if (previewMap) {
                previewMap.invalidateSize();
            }
        }, 100);

    } catch (error) {
        console.error('地图预览初始化失败:', error);
        container.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #999;">地图加载失败</div>';
    }
}

// 处理分享提交
async function handleShareSubmit() {
    const nameInput = document.getElementById('place-name');
    const locationInput = document.getElementById('place-location');
    const descriptionInput = document.getElementById('place-description');
    const imageInput = document.getElementById('place-image');
    const tagCheckboxes = document.querySelectorAll('input[name="tags"]:checked');

    // 验证必填字段
    if (!nameInput.value.trim() || !locationInput.value.trim() || !descriptionInput.value.trim()) {
        showMessage('请填写所有必填字段！', 'error');
        return;
    }

    // 获取选中的标签
    const selectedTags = Array.from(tagCheckboxes).map(cb => cb.value);
    if (selectedTags.length === 0) {
        showMessage('请至少选择一个标签！', 'error');
        return;
    }

    // 显示加载状态
    const submitBtn = document.getElementById('submit-place');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 正在处理...';
    submitBtn.disabled = true;

    try {
        // 获取输入值
        const location = locationInput.value.trim();
        const imageUrl = imageInput.value.trim();

        // 并行执行地理编码和图片搜索
        const [geoResult, cityImage] = await Promise.all([
            geocodeLocation(location),
            imageUrl ? Promise.resolve(null) : searchCityImage(location)
        ]);

        // 构建新景点数据
        const newPlace = {
            name: nameInput.value.trim(),
            location: location,
            description: descriptionInput.value.trim(),
            image: imageUrl || cityImage || '',
            tags: selectedTags,
            lat: geoResult ? geoResult.lat : 0,
            lng: geoResult ? geoResult.lng : 0
        };

        const response = await fetch(`${API_BASE_URL}/api/places`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'X-User-ID': currentUserId
            },
            body: JSON.stringify(newPlace)
        });

        if (!response.ok) {
            const err = await response.json();
            showMessage(err.error || '提交失败，请重试', 'error');
            return;
        }

        const result = await response.json();

        // 清空表单
        nameInput.value = '';
        locationInput.value = '';
        descriptionInput.value = '';
        imageInput.value = '';
        tagCheckboxes.forEach(cb => cb.checked = false);

        // 显示成功消息（包含地理编码结果）
        let successMsg = '景点分享成功！已添加到推荐列表。';
        if (geoResult) {
            successMsg += `\n📍 已自动定位：${geoResult.displayName || location}`;
        }
        if (cityImage && !imageUrl) {
            successMsg += '\n🖼️ 已自动获取城市图片';
        }
        showMessage(successMsg, 'success');

        // 重新加载数据并渲染
        await loadPlacesData();
        currentFilter = 'all';
        filterTags.forEach(tag => {
            tag.classList.remove('active');
            if (tag.dataset.tag === 'all') {
                tag.classList.add('active');
            }
        });
        renderPlaces();

        // 滚动到景点区域
        document.getElementById('places').scrollIntoView({ behavior: 'smooth' });

    } catch (error) {
        console.error('提交失败:', error);
        showMessage('网络错误，请检查后端是否运行', 'error');
    } finally {
        // 恢复按钮状态
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// 显示消息
function showMessage(text, type) {
    if (!shareMessage) return;

    shareMessage.textContent = text;
    shareMessage.className = `message ${type}`;

    // 3秒后隐藏消息
    setTimeout(() => {
        shareMessage.textContent = '';
        shareMessage.className = 'message';
    }, 3000);
}

// 导出函数到全局作用域
window.showPlaceDetails = showPlaceDetails;
window.shareToWeChat = shareToWeChat;
window.copyShareLink = copyShareLink;
window.handleImageError = handleImageError;
window.deletePlace = deletePlace;
window.showAdminLogin = showAdminLogin;
window.logoutAdmin = logoutAdmin;
window.shareToWeChatPage = shareToWeChatPage;
window.shareToQQ = shareToQQ;
window.copyPageLink = copyPageLink;
window.showShareModal = showShareModal;
window.copyAndOpenApp = copyAndOpenApp;
window.openApp = openApp;
window.sharePlaceToWeChat = sharePlaceToWeChat;
window.sharePlaceToQQ = sharePlaceToQQ;
window.copyPlaceLink = copyPlaceLink;

// 分享整个页面到微信
function shareToWeChatPage() {
    const pageUrl = window.location.href;
    const pageTitle = '旅行足迹 - 发现世界的美好';
    const pageDesc = '记录你的旅行足迹，与朋友分享精彩瞬间';
    
    // 显示分享弹窗
    showShareModal('微信', pageUrl, pageTitle, pageDesc, 'weixin');
}

// 分享到QQ
function shareToQQ() {
    const pageUrl = window.location.href;
    const pageTitle = '旅行足迹 - 发现世界的美好';
    const pageDesc = '记录你的旅行足迹，与朋友分享精彩瞬间';
    
    // 显示分享弹窗
    showShareModal('QQ', pageUrl, pageTitle, pageDesc, 'qq');
}

// 显示分享弹窗
function showShareModal(platform, url, title, desc, type) {
    // 移除已有的弹窗
    const existing = document.querySelector('.share-modal');
    if (existing) existing.remove();
    
    // 创建弹窗
    const modal = document.createElement('div');
    modal.className = 'share-modal';
    modal.innerHTML = `
        <div class="share-modal-overlay" onclick="this.parentElement.remove()"></div>
        <div class="share-modal-content">
            <div class="share-modal-header">
                <i class="fab fa-${type === 'weixin' ? 'weixin' : 'qq'}" style="color: ${type === 'weixin' ? '#07c160' : '#12b7f5'}"></i>
                <span>分享到${platform}</span>
                <button class="share-modal-close" onclick="this.closest('.share-modal').remove()">&times;</button>
            </div>
            <div class="share-modal-body">
                <p class="share-tip">即将打开${platform}，分享内容将自动复制到剪贴板</p>
                <div class="share-preview">
                    <div class="share-preview-title">${title}</div>
                    <div class="share-preview-desc">${desc}</div>
                    <div class="share-preview-url">${url}</div>
                </div>
                <button class="share-copy-btn" onclick="copyAndOpenApp('${type}', '${url}', '${title}', '${desc}')">
                    <i class="fab fa-${type === 'weixin' ? 'weixin' : 'qq'}"></i> 打开${platform}并分享
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // 显示动画
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
}

// 复制内容并打开应用
function copyAndOpenApp(type, url, title, desc) {
    const shareText = `${title}\n${desc}\n\n${url}`;
    const platform = type === 'weixin' ? '微信' : 'QQ';
    
    // 先复制内容到剪贴板
    navigator.clipboard.writeText(shareText).then(() => {
        showToast('内容已复制，正在打开' + platform + '...');
        // 尝试打开应用
        openApp(type);
    }).catch(err => {
        // 降级方案
        const textarea = document.createElement('textarea');
        textarea.value = shareText;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast('内容已复制，正在打开' + platform + '...');
        openApp(type);
    });
    
    // 关闭弹窗
    document.querySelector('.share-modal')?.remove();
}

// 尝试打开应用
function openApp(type) {
    if (type === 'weixin') {
        // 微信 URL Scheme
        const appUrl = 'weixin://';
        
        // 尝试打开应用
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = appUrl;
        document.body.appendChild(iframe);
        
        // 1秒后移除iframe
        setTimeout(() => {
            document.body.removeChild(iframe);
        }, 1000);
    } else if (type === 'qq') {
        // QQ 使用分享链接页面
        const pageUrl = encodeURIComponent(window.location.href);
        const pageTitle = encodeURIComponent('旅行足迹 - 发现世界的美好');
        const pageDesc = encodeURIComponent('记录你的旅行足迹，与朋友分享精彩瞬间');
        
        const qqShareUrl = `https://connect.qq.com/widget/shareqq/index.html?url=${pageUrl}&title=${pageTitle}&desc=${pageDesc}`;
        window.open(qqShareUrl, '_blank', 'width=600,height=500');
    }
}

// 复制页面链接
function copyPageLink() {
    const pageUrl = window.location.href;
    
    navigator.clipboard.writeText(pageUrl).then(() => {
        showToast('页面链接已复制到剪贴板！');
    }).catch(err => {
        // 降级方案
        const textarea = document.createElement('textarea');
        textarea.value = pageUrl;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast('页面链接已复制到剪贴板！');
    });
}

// 管理员登录
function showAdminLogin() {
    if (isAdmin()) {
        // 已经是管理员，显示退出选项
        if (confirm('你已经是管理员，是否退出管理员模式？')) {
            localStorage.removeItem(USER_ID_KEY);
            location.reload();
        }
        return;
    }

    const password = prompt('请输入管理员密码：');
    if (password === null) return;  // 用户取消

    if (setAdmin(password)) {
        showToast('管理员登录成功！');
        setTimeout(() => location.reload(), 1000);
    } else {
        showToast('密码错误', 'error');
    }
}

// 退出管理员
function logoutAdmin() {
    localStorage.removeItem(USER_ID_KEY);
    location.reload();
}

// 删除景点
async function deletePlace(id, name) {
    if (!confirm(`确定要删除 "${name}" 吗？此操作不可恢复。`)) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/places/${id}`, {
            method: 'DELETE',
            headers: {
                'X-User-ID': currentUserId
            }
        });

        if (response.ok) {
            // 删除成功，刷新列表
            await loadPlacesData();
            renderPlaces();
            // 显示成功提示
            showToast(`"${name}" 已删除`);
        } else {
            const data = await response.json();
            showToast(data.error || '删除失败', 'error');
        }
    } catch (error) {
        console.error('删除失败:', error);
        showToast('网络错误，请检查后端是否运行', 'error');
    }
}

// 简单的提示框
function showToast(message, type = 'success') {
    // 移除已有的提示
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 24px;
        border-radius: 8px;
        color: white;
        font-size: 14px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        background: ${type === 'error' ? '#e74c3c' : '#2ecc71'};
    `;
    document.body.appendChild(toast);

    // 3秒后移除
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init);

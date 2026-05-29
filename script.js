// 旅游景点网站 - 主脚本

// API 配置
// 部署到线上后，把下面的地址改成你的后端实际地址
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? ''  // 本地开发，使用相对路径（同源）
    : 'https://web-production-a1c5d.up.railway.app';  // ← 改成你的线上后端地址

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
    await loadPlacesData();
    renderPlaces();
    setupEventListeners();
}

// 加载景点数据（从后端 API）
async function loadPlacesData() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/places`);
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
                <button class="delete-btn" onclick="deletePlace(${place.id}, '${escapeHtml(place.name)}')" title="删除此景点">
                    <i class="fas fa-trash"></i>
                </button>
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
    const unsplashUrl = img.dataset.unsplash;
    const fallbackUrl = img.dataset.fallback;
    const currentSrc = img.src;

    // 如果当前已经是回退图片，不再重试
    if (currentSrc === fallbackUrl || currentSrc.includes('picsum.photos')) {
        img.onerror = null;
        img.src = getDefaultImage();
        return;
    }

    // 如果当前不是Unsplash且有不重复的Unsplash URL，尝试Unsplash
    if (unsplashUrl && !currentSrc.includes('unsplash') && currentSrc !== unsplashUrl) {
        img.src = unsplashUrl;
        return;
    }

    // 否则使用picsum回退
    if (fallbackUrl && currentSrc !== fallbackUrl) {
        img.src = fallbackUrl;
        return;
    }

    // 最终回退
    img.onerror = null;
    img.src = getDefaultImage();
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

// 获取图片URL，优先使用本地图片
function getImageUrl(place) {
    // 如果有本地图片，优先使用
    const localImages = {
        1: 'images/zhangjiajie.jpg',
        2: 'images/forbidden-city.jpg',
        3: 'images/bund.jpg',
        4: 'images/chengdu.jpg',
        5: 'images/west-lake.jpg',
        6: 'images/chongqing.jpg'
    };

    if (localImages[place.id]) {
        return localImages[place.id];
    }

    // 否则使用原始URL
    return place.image || getFallbackImage(place.id);
}

// 获取备用图片
function getFallbackImage(placeId) {
    // 根据景点ID返回不同的备用图片
    const fallbackImages = {
        1: 'https://picsum.photos/800/600?random=1',
        2: 'https://picsum.photos/800/600?random=2',
        3: 'https://picsum.photos/800/600?random=3',
        4: 'https://picsum.photos/800/600?random=4',
        5: 'https://picsum.photos/800/600?random=5',
        6: 'https://picsum.photos/800/600?random=6'
    };

    return fallbackImages[placeId] || getDefaultImage();
}

// 获取默认图片
function getDefaultImage() {
    return 'https://picsum.photos/800/600?random=999';
}

// 显示景点详情
function showPlaceDetails(placeId) {
    const place = placesData.find(p => p.id === placeId);
    if (!place) return;

    const modalDetails = document.getElementById('modal-place-details');

    const imageUrl = getImageUrl(place);
    const fallbackUrl = getFallbackImage(place.id);
    const unsplashUrl = place.image || '';
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
            <div class="map-fallback-msg" style="display:none;">
                <i class="fas fa-map-marked-alt"></i>
                <p>互动地图加载中...</p>
            </div>
            <a href="${escapeHtml(mapLink)}" target="_blank" class="map-open-link">
                <i class="fas fa-external-link-alt"></i> 在高德地图中打开
            </a>
           </div>`
        : `<div class="modal-map-container no-coords">
            <i class="fas fa-map-marked-alt"></i>
            <p>暂无精确位置坐标</p>
            <a href="${escapeHtml(mapLink)}" target="_blank" class="btn-secondary">搜索位置</a>
           </div>`;

    modalDetails.innerHTML = `
        <img src="${escapeHtml(imageUrl)}" alt="${place.name}" class="modal-place-image"
             data-unsplash="${escapeHtml(unsplashUrl)}"
             data-fallback="${escapeHtml(fallbackUrl)}"
             onerror="handleImageError(this);">
        <h2>${place.name}</h2>
        <div class="place-location" style="margin-bottom: 10px;">
            <i class="fas fa-map-marker-alt"></i>
            <span>${place.location}</span>
        </div>
        ${coordInfo}
        <div class="place-tags" style="margin-bottom: 20px;">${tagsHtml}</div>
        <p style="margin-bottom: 20px; line-height: 1.8;">${place.description}</p>
        ${mapSection}
        <div style="display: flex; gap: 10px; margin-top: 30px;">
            <button class="btn-primary" onclick="shareToWeChat(${placeId})">
                <i class="fab fa-weixin"></i> 分享到微信
            </button>
            <button class="btn-secondary" onclick="copyShareLink(${placeId})">
                <i class="fas fa-link"></i> 复制链接
            </button>
        </div>
    `;

    modal.style.display = 'block';

    // 初始化Leaflet地图
    if (hasValidCoordinates(place)) {
        // 等DOM更新后再初始化地图
        setTimeout(() => initModalMap(place), 100);
    }
}

// 初始化模态框中的地图
function initModalMap(place) {
    destroyModalMap();

    const mapEl = document.getElementById('modal-leaflet-map');
    if (!mapEl) return;

    const { lat, lng } = place.coordinates;

    try {
        modalMap = L.map(mapEl).setView([lat, lng], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            maxZoom: 18
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

    // 提交到后端 API
    const newPlace = {
        name: nameInput.value.trim(),
        location: locationInput.value.trim(),
        description: descriptionInput.value.trim(),
        image: imageInput.value.trim() || '',
        tags: selectedTags,
        lat: 0,
        lng: 0
    };

    try {
        const response = await fetch(`${API_BASE_URL}/api/places`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
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

        // 显示成功消息
        showMessage('景点分享成功！已添加到推荐列表。', 'success');

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

// 删除景点
async function deletePlace(id, name) {
    if (!confirm(`确定要删除 "${name}" 吗？此操作不可恢复。`)) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/places/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            // 删除成功，刷新列表
            loadPlaces();
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

// 旅游景点网站 - 主脚本

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

// 初始化函数
async function init() {
    await loadPlacesData();
    renderPlaces();
    setupEventListeners();
}

// 加载景点数据
async function loadPlacesData() {
    try {
        // 尝试从本地存储加载
        const savedPlaces = localStorage.getItem('travelPlaces');
        
        if (savedPlaces) {
            placesData = JSON.parse(savedPlaces);
        } else {
            // 加载默认数据
            const response = await fetch('data/places.json');
            if (response.ok) {
                const data = await response.json();
                placesData = data.places || [];
                // 保存到本地存储
                localStorage.setItem('travelPlaces', JSON.stringify(placesData));
            } else {
                // 如果文件不存在，使用示例数据
                placesData = getSamplePlaces();
                localStorage.setItem('travelPlaces', JSON.stringify(placesData));
            }
        }
    } catch (error) {
        console.error('加载数据失败:', error);
        placesData = getSamplePlaces();
        localStorage.setItem('travelPlaces', JSON.stringify(placesData));
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
            image: "https://images.unsplash.com/photo-1547981609-4b6bf67b7d46?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            tags: ["历史", "文化"],
            coordinates: { lat: 39.9163, lng: 116.3972 }
        },
        {
            id: 3,
            name: "外滩",
            location: "上海",
            description: "上海最具代表性的城市景观，汇集了不同时期、不同风格的建筑。",
            image: "https://images.unsplash.com/photo-1503386435952-d7918b99d4c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            tags: ["城市", "夜景"],
            coordinates: { lat: 31.2337, lng: 121.4905 }
        },
        {
            id: 4,
            name: "成都宽窄巷子",
            location: "四川成都",
            description: "体验成都慢生活的好去处，集美食、文化、休闲于一体。",
            image: "https://images.unsplash.com/photo-1552465011-b4e30bf7349d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
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
    
    // 处理图片URL - 使用备用图片
    const imageUrl = getImageUrl(place);
    
    // 处理标签
    const tagsHtml = place.tags.map(tag => 
        `<span class="place-tag">${tag}</span>`
    ).join('');
    
    card.innerHTML = `
        <div class="image-container">
            <img src="${imageUrl}" alt="${place.name}" class="place-image" loading="lazy" onerror="this.onerror=null; this.src='${getFallbackImage(place.id)}';">
            <div class="image-loading">加载中...</div>
        </div>
        <div class="place-info">
            <h3 class="place-name">${place.name}</h3>
            <div class="place-location">
                <i class="fas fa-map-marker-alt"></i>
                <span>${place.location}</span>
            </div>
            <p class="place-description">${place.description}</p>
            <div class="place-tags">${tagsHtml}</div>
            <button class="view-details" onclick="showPlaceDetails(${place.id})">
                查看详情
            </button>
        </div>
    `;
    
    // 图片加载完成后隐藏加载提示
    const img = card.querySelector('.place-image');
    const loading = card.querySelector('.image-loading');
    img.onload = function() {
        if (loading) loading.style.display = 'none';
    };
    
    return card;
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
    return place.image || getDefaultImage();
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
    
    // 处理图片URL
    const imageUrl = place.image || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
    
    // 处理标签
    const tagsHtml = place.tags.map(tag => 
        `<span class="place-tag">${tag}</span>`
    ).join('');
    
    modalDetails.innerHTML = `
        <img src="${imageUrl}" alt="${place.name}" class="modal-place-image">
        <h2>${place.name}</h2>
        <div class="place-location" style="margin-bottom: 20px;">
            <i class="fas fa-map-marker-alt"></i>
            <span>${place.location}</span>
        </div>
        <div class="place-tags" style="margin-bottom: 20px;">${tagsHtml}</div>
        <p style="margin-bottom: 20px; line-height: 1.8;">${place.description}</p>
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
    
    const shareText = `推荐一个超棒的景点：${place.name}（${place.location}）\n${place.description}\n\n来自「旅行足迹」分享`;
    
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
        });
    }
    
    // 点击模态框外部关闭
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
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
function handleShareSubmit() {
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
    
    // 创建新景点
    const newPlace = {
        id: Date.now(), // 使用时间戳作为ID
        name: nameInput.value.trim(),
        location: locationInput.value.trim(),
        description: descriptionInput.value.trim(),
        image: imageInput.value.trim() || '',
        tags: selectedTags,
        coordinates: { lat: 0, lng: 0 } // 实际应用中可以通过地理编码获取
    };
    
    // 添加到数据
    placesData.unshift(newPlace);
    
    // 保存到本地存储
    localStorage.setItem('travelPlaces', JSON.stringify(placesData));
    
    // 清空表单
    nameInput.value = '';
    locationInput.value = '';
    descriptionInput.value = '';
    imageInput.value = '';
    tagCheckboxes.forEach(cb => cb.checked = false);
    
    // 显示成功消息
    showMessage('景点分享成功！已添加到推荐列表。', 'success');
    
    // 重新渲染景点（显示最新添加的）
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

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init);
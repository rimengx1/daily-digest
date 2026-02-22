

// ============================================
// 自动更新检查
// ============================================
function initUpdateChecker() {
  const CHECK_INTERVAL = 5 * 60 * 1000; // 5分钟
  
  // 加载保存的版本信息
  const loadVersion = () => {
    return localStorage.getItem('dd_last_modified') || '';
  };
  
  // 保存版本信息
  const saveVersion = (version) => {
    localStorage.setItem('dd_last_modified', version);
  };
  
  // 显示更新提示
  const showUpdateBar = () => {
    const bar = document.getElementById('updateBar');
    if (bar) bar.classList.remove('hidden');
  };
  
  // 隐藏更新提示
  const hideUpdateBar = () => {
    const bar = document.getElementById('updateBar');
    if (bar) bar.classList.add('hidden');
  };
  
  // 检查更新
  const checkForUpdate = async () => {
    try {
      const response = await fetch(window.location.href, { 
        method: 'HEAD',
        cache: 'no-cache'
      });
      
      const lastModified = response.headers.get('last-modified') || '';
      const storedModified = loadVersion();
      
      if (storedModified && lastModified && storedModified !== lastModified) {
        showUpdateBar();
      }
      
      if (lastModified) {
        saveVersion(lastModified);
      }
    } catch (error) {
      console.log('[Update] 检查失败:', error);
    }
  };
  
  // 更新最后更新时间显示
  const updateTimeDisplay = () => {
    const el = document.getElementById('lastUpdate');
    if (el) {
      const now = new Date();
      const timeStr = now.toLocaleString('zh-CN', { 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      el.textContent = `最后更新: ${timeStr}`;
    }
  };
  
  // 绑定按钮事件
  document.getElementById('refreshBtn')?.addEventListener('click', () => {
    window.location.reload();
  });
  
  document.getElementById('dismissUpdate')?.addEventListener('click', hideUpdateBar);
  
  // 启动检查
  checkForUpdate();
  setInterval(checkForUpdate, CHECK_INTERVAL);
  
  // 页面可见性变化时检查
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      checkForUpdate();
    }
  });
  
  // 更新显示时间
  updateTimeDisplay();
}

// ============================================
// 推送通知
// ============================================
function initPushNotification() {
  let isEnabled = false;
  
  // 检查当前状态
  const checkStatus = async () => {
    if (!('Notification' in window)) {
      console.log('[Push] 浏览器不支持通知');
      return;
    }
    
    const permission = Notification.permission;
    isEnabled = permission === 'granted';
    updateUI();
  };
  
  // 请求权限
  const requestPermission = async () => {
    if (!('Notification' in window)) {
      alert('您的浏览器不支持推送通知');
      return false;
    }
    
    const permission = await Notification.requestPermission();
    isEnabled = permission === 'granted';
    
    if (isEnabled) {
      showNotification('Daily Digest', '推送通知已开启！有更新时我们会通知您。');
    }
    
    updateUI();
    return isEnabled;
  };
  
  // 显示通知
  const showNotification = (title, body) => {
    if (!isEnabled) return;
    
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        registration.showNotification(title, {
          body,
          icon: './icon-192x192.png',
          tag: 'daily-digest-update',
          requireInteraction: false
        });
      });
    } else {
      new Notification(title, { body });
    }
  };
  
  // 更新UI
  const updateUI = () => {
    const toggle = document.getElementById('pushToggle');
    const status = document.getElementById('pushStatus');
    
    if (toggle) {
      toggle.classList.toggle('push-enabled', isEnabled);
      toggle.title = isEnabled ? '推送通知已开启' : '开启推送通知';
    }
    
    if (status) {
      status.textContent = isEnabled ? '已开启' : '未开启';
    }
  };
  
  // 绑定事件
  document.getElementById('pushToggle')?.addEventListener('click', () => {
    if (isEnabled) {
      showNotification('Daily Digest', '推送通知已开启');
    } else {
      requestPermission();
    }
  });
  
  document.getElementById('pushSettings')?.addEventListener('click', requestPermission);
  
  // 初始化
  checkStatus();
}

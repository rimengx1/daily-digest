// 数据存储
let formData = {
  date: '2026年2月15日',
  dateEn: 'February 15, 2026',
  rssArticles: [],
  aiNews: [],
  thoughts: [],
  recommendations: []
};

// 生成唯一ID
function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

// 保存到localStorage
function saveToStorage() {
  localStorage.setItem('dailyDigest_adminData', JSON.stringify(formData));
}

// 从localStorage加载数据
function loadFromStorage() {
  const saved = localStorage.getItem('dailyDigest_adminData');
  if (saved) {
    formData = JSON.parse(saved);
    if (!formData.rssArticles) formData.rssArticles = [];
  }
}

// 添加项目
function addItem(section) {
  const item = { id: generateId() };
  
  if (section === 'rssArticles') {
    item.title = '';
    item.summary = '';
    item.url = '';
    item.source = '';
    item.date = new Date().toISOString().split('T')[0];
  } else if (section === 'aiNews') {
    item.title = '';
    item.summary = '';
    item.url = '';
    item.date = new Date().toISOString().split('T')[0];
  } else if (section === 'thoughts') {
    item.content = '';
    item.time = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  } else if (section === 'recommendations') {
    item.title = '';
    item.source = '';
    item.url = '';
    item.date = new Date().toISOString().split('T')[0];
  }
  
  formData[section].push(item);
  renderItem(section, item, formData[section].length - 1);
  saveToStorage();
}

// 删除项目
function deleteItem(section, index) {
  formData[section].splice(index, 1);
  renderSection(section);
  saveToStorage();
}

// 更新项目数据
function updateItemData(section, index, card) {
  const item = formData[section][index];
  
  if (section === 'rssArticles') {
    item.title = card.querySelector('.field-title')?.value || '';
    item.source = card.querySelector('.field-source')?.value || '';
    item.summary = card.querySelector('.field-summary')?.value || '';
    item.url = card.querySelector('.field-url')?.value || '';
  } else if (section === 'aiNews') {
    item.title = card.querySelector('.field-title')?.value || '';
    item.summary = card.querySelector('.field-summary')?.value || '';
    item.url = card.querySelector('.field-url')?.value || '';
  } else if (section === 'thoughts') {
    item.content = card.querySelector('.field-content')?.value || '';
    item.time = card.querySelector('.field-time')?.value || '';
  } else if (section === 'recommendations') {
    item.title = card.querySelector('.field-title')?.value || '';
    item.source = card.querySelector('.field-source')?.value || '';
    item.url = card.querySelector('.field-url')?.value || '';
  }
  
  saveToStorage();
}

// 渲染单个项目
function renderItem(section, item, index) {
  const container = document.getElementById(section + 'List');
  if (!container) return;
  
  const card = document.createElement('div');
  card.className = 'item-card';
  card.dataset.index = index;
  
  let fieldsHtml = '';
  
  if (section === 'rssArticles') {
    fieldsHtml = `
      <input type="text" placeholder="文章标题" class="field-title" value="${escapeHtml(item.title || '')}">
      <input type="text" placeholder="来源网站" class="field-source" value="${escapeHtml(item.source || '')}">
      <textarea placeholder="文章摘要（简短描述）" class="field-summary">${escapeHtml(item.summary || '')}</textarea>
      <input type="url" placeholder="文章链接 https://..." class="field-url" value="${escapeHtml(item.url || '')}">
    `;
  } else if (section === 'aiNews') {
    fieldsHtml = `
      <input type="text" placeholder="文章标题" class="field-title" value="${escapeHtml(item.title || '')}">
      <textarea placeholder="文章摘要（简短描述）" class="field-summary">${escapeHtml(item.summary || '')}</textarea>
      <input type="url" placeholder="文章链接 https://..." class="field-url" value="${escapeHtml(item.url || '')}">
    `;
  } else if (section === 'thoughts') {
    fieldsHtml = `
      <textarea placeholder="写下你的思考..." class="field-content">${escapeHtml(item.content || '')}</textarea>
      <input type="text" placeholder="时间 14:30" class="field-time" value="${escapeHtml(item.time || '')}">
    `;
  } else if (section === 'recommendations') {
    fieldsHtml = `
      <input type="text" placeholder="文章标题" class="field-title" value="${escapeHtml(item.title || '')}">
      <input type="text" placeholder="来源网站" class="field-source" value="${escapeHtml(item.source || '')}">
      <input type="url" placeholder="文章链接 https://..." class="field-url" value="${escapeHtml(item.url || '')}">
    `;
  }
  
  card.innerHTML = `
    <div class="item-header">
      <span class="item-number">#${index + 1}</span>
      <button class="btn-delete" data-section="${section}" data-index="${index}">删除</button>
    </div>
    <div class="item-fields">${fieldsHtml}</div>
  `;
  
  container.appendChild(card);
  
  // 绑定删除事件
  const deleteBtn = card.querySelector('.btn-delete');
  deleteBtn.addEventListener('click', function() {
    const sec = this.dataset.section;
    const idx = parseInt(this.dataset.index);
    deleteItem(sec, idx);
  });
  
  // 绑定输入事件
  const inputs = card.querySelectorAll('input, textarea');
  inputs.forEach(input => {
    input.addEventListener('input', () => {
      updateItemData(section, index, card);
    });
  });
}

// 渲染整个区块
function renderSection(section) {
  const container = document.getElementById(section + 'List');
  if (!container) return;
  
  container.innerHTML = '';
  formData[section].forEach((item, index) => {
    renderItem(section, item, index);
  });
}

// 填充表单
function populateForm() {
  const dateZh = document.getElementById('dateZh');
  const dateEn = document.getElementById('dateEn');
  
  if (dateZh) dateZh.value = formData.date;
  if (dateEn) dateEn.value = formData.dateEn;
  
  renderSection('rssArticles');
  renderSection('aiNews');
  renderSection('thoughts');
  renderSection('recommendations');
}

// 收集表单数据
function collectFormData() {
  const dateZh = document.getElementById('dateZh');
  const dateEn = document.getElementById('dateEn');
  
  if (dateZh) formData.date = dateZh.value;
  if (dateEn) formData.dateEn = dateEn.value;
  
  // 更新所有项目数据
  ['rssArticles', 'aiNews', 'thoughts', 'recommendations'].forEach(section => {
    const container = document.getElementById(section + 'List');
    if (!container) return;
    
    const cards = container.querySelectorAll('.item-card');
    cards.forEach((card, index) => {
      updateItemData(section, index, card);
    });
  });
  
  return formData;
}

// 生成JSON
function generateJSON() {
  collectFormData();
  return JSON.stringify(formData, null, 2);
}

// 导出JSON
function exportJSON() {
  const json = generateJSON();
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `daily-digest-content-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// 复制JSON到剪贴板
async function copyJSON() {
  const json = generateJSON();
  try {
    await navigator.clipboard.writeText(json);
    alert('JSON已复制到剪贴板！');
  } catch (err) {
    const textarea = document.createElement('textarea');
    textarea.value = json;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    alert('JSON已复制到剪贴板！');
  }
}

// 导入JSON
function importJSON(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      if (data.aiNews && data.thoughts && data.recommendations) {
        formData = data;
        if (!formData.rssArticles) formData.rssArticles = [];
        populateForm();
        saveToStorage();
        alert('导入成功！');
      } else {
        alert('文件格式不正确');
      }
    } catch (err) {
      alert('导入失败：' + err.message);
    }
  };
  reader.readAsText(file);
}

// 显示预览
function showPreview() {
  const json = generateJSON();
  const preview = document.getElementById('jsonPreview');
  const modal = document.getElementById('previewModal');
  if (preview) preview.textContent = json;
  if (modal) modal.classList.add('active');
}

// 隐藏预览
function hidePreview() {
  const modal = document.getElementById('previewModal');
  if (modal) modal.classList.remove('active');
}

// HTML转义
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// 初始化
function init() {
  console.log('Admin init started');
  
  // 加载数据
  loadFromStorage();
  populateForm();
  
  // 绑定添加按钮
  document.querySelectorAll('.btn-add').forEach(btn => {
    btn.addEventListener('click', function() {
      const section = this.dataset.section;
      console.log('Add button clicked:', section);
      addItem(section);
    });
  });
  
  // 绑定日期输入
  const dateZh = document.getElementById('dateZh');
  const dateEn = document.getElementById('dateEn');
  
  if (dateZh) {
    dateZh.addEventListener('input', (e) => {
      formData.date = e.target.value;
      saveToStorage();
    });
  }
  
  if (dateEn) {
    dateEn.addEventListener('input', (e) => {
      formData.dateEn = e.target.value;
      saveToStorage();
    });
  }
  
  // 绑定导出按钮
  const exportBtn = document.getElementById('exportJson');
  if (exportBtn) exportBtn.addEventListener('click', exportJSON);
  
  // 绑定复制按钮
  const copyBtn = document.getElementById('copyJson');
  if (copyBtn) copyBtn.addEventListener('click', copyJSON);
  
  // 绑定导入按钮
  const importBtn = document.getElementById('importBtn');
  const importFile = document.getElementById('importJson');
  
  if (importBtn && importFile) {
    importBtn.addEventListener('click', () => {
      importFile.click();
    });
    importFile.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        importJSON(e.target.files[0]);
        e.target.value = '';
      }
    });
  }
  
  // 绑定预览按钮
  const previewBtn = document.getElementById('previewBtn');
  if (previewBtn) previewBtn.addEventListener('click', showPreview);
  
  // 绑定关闭弹窗
  const modalClose = document.querySelector('.modal-close');
  const modal = document.getElementById('previewModal');
  
  if (modalClose) modalClose.addEventListener('click', hidePreview);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target.id === 'previewModal') hidePreview();
    });
  }
  
  // 绑定复制弹窗内容
  const copyFromModal = document.getElementById('copyFromModal');
  if (copyFromModal) copyFromModal.addEventListener('click', copyJSON);
  
  // 绑定保存按钮
  const saveBtn = document.getElementById('saveBtn');
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      saveToStorage();
      alert('内容已保存！你可以导出JSON或复制JSON发给我。');
    });
  }
  
  console.log('Admin init completed');
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init);

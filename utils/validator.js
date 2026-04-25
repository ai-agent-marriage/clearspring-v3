/**
 * 表单验证工具类
 * 提供常用的表单验证功能
 * 安全增强：特殊字符过滤、长度限制、XSS 防护
 */

const Validator = {
  /**
   * XSS 危险字符列表
   */
  DANGEROUS_CHARS: [
    { pattern: /</g, replacement: '&lt;' },
    { pattern: />/g, replacement: '&gt;' },
    { pattern: /"/g, replacement: '&quot;' },
    { pattern: /'/g, replacement: '&#x27;' },
    { pattern: /\//g, replacement: '&#x2F;' },
    { pattern: /`/g, replacement: '&#x60;' },
    { pattern: /=/g, replacement: '&#x3D;' }
  ],

  /**
   * SQL 注入危险字符
   */
  SQL_INJECTION_CHARS: [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE|UNION|FROM|WHERE)\b)/gi,
    /(--|;|\/\*|\*\/)/g,
    /(\b(OR|AND)\b\s+\d+\s*=\s*\d+)/gi
  ],

  /**
   * 过滤 XSS 危险字符
   * @param {string} input - 输入字符串
   * @returns {string} - 过滤后的字符串
   */
  sanitizeInput(input) {
    if (!input || typeof input !== 'string') {
      return '';
    }
    
    let result = input;
    this.DANGEROUS_CHARS.forEach(({ pattern, replacement }) => {
      result = result.replace(pattern, replacement);
    });
    
    return result;
  },

  /**
   * 检测 SQL 注入尝试
   * @param {string} input - 输入字符串
   * @returns {boolean} - 是否包含 SQL 注入特征
   */
  detectSQLInjection(input) {
    if (!input || typeof input !== 'string') {
      return false;
    }
    
    return this.SQL_INJECTION_CHARS.some(pattern => pattern.test(input));
  },

  /**
   * 验证并过滤输入
   * @param {string} value - 输入值
   * @param {number} maxLength - 最大长度限制
   * @param {boolean} allowHTML - 是否允许 HTML 字符（默认 false）
   * @returns {Object} { valid: boolean, message: string, sanitizedValue: string }
   */
  validateAndSanitize(value, maxLength = 500, allowHTML = false) {
    if (!value) {
      return { valid: true, message: '', sanitizedValue: '' };
    }

    // 类型检查
    if (typeof value !== 'string') {
      return { valid: false, message: '输入必须是字符串', sanitizedValue: '' };
    }

    // 长度检查
    if (value.length > maxLength) {
      return { 
        valid: false, 
        message: `输入长度不能超过${maxLength}字符`, 
        sanitizedValue: '' 
      };
    }

    // SQL 注入检测
    if (this.detectSQLInjection(value)) {
      return { 
        valid: false, 
        message: '输入包含非法字符', 
        sanitizedValue: '' 
      };
    }

    // XSS 过滤
    const sanitizedValue = allowHTML ? value : this.sanitizeInput(value);

    return { valid: true, message: '', sanitizedValue };
  },

  /**
   * 验证单位名称（必填）
   * @param {string} value - 单位名称
   * @returns {Object} { valid: boolean, message: string }
   */
  validateCompany(value) {
    if (!value || !value.trim()) {
      return { valid: false, message: '请输入单位名称' };
    }
    if (value.trim().length < 2) {
      return { valid: false, message: '单位名称至少 2 个字符' };
    }
    // 添加长度限制（最多 100 字符）
    if (value.trim().length > 100) {
      return { valid: false, message: '单位名称不能超过 100 字符' };
    }
    // 特殊字符过滤检查
    if (this.detectSQLInjection(value)) {
      return { valid: false, message: '单位名称包含非法字符' };
    }
    return { valid: true, message: '' };
  },

  /**
   * 验证税号（必填，15/18/20 位格式）
   * @param {string} value - 税号
   * @returns {Object} { valid: boolean, message: string }
   */
  validateTaxNo(value) {
    if (!value || !value.trim()) {
      return { valid: false, message: '请输入税号' };
    }

    const taxNoRegex = /^[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}$|^[0-9A-HJ-NPQRTUWXY]{15,17}$/;
    if (!taxNoRegex.test(value.trim())) {
      return { valid: false, message: '税号格式不正确（15/18/20 位）' };
    }
    // 特殊字符过滤检查
    if (this.detectSQLInjection(value)) {
      return { valid: false, message: '税号包含非法字符' };
    }
    return { valid: true, message: '' };
  },

  /**
   * 验证手机号（可选，11 位格式）
   * @param {string} value - 手机号
   * @returns {Object} { valid: boolean, message: string }
   */
  validatePhone(value) {
    // 可选字段，为空时通过
    if (!value || !value.trim()) {
      return { valid: true, message: '' };
    }

    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(value.trim())) {
      return { valid: false, message: '手机号格式不正确（11 位）' };
    }
    // 特殊字符过滤检查
    if (this.detectSQLInjection(value)) {
      return { valid: false, message: '手机号包含非法字符' };
    }
    return { valid: true, message: '' };
  },

  /**
   * 验证金额（必填，数字格式，保留 2 位小数）
   * @param {number|string} value - 金额
   * @returns {Object} { valid: boolean, message: string }
   */
  validateAmount(value) {
    if (value === null || value === undefined || value === '') {
      return { valid: false, message: '请输入金额' };
    }

    const numValue = Number(value);
    if (isNaN(numValue) || numValue <= 0) {
      return { valid: false, message: '金额必须大于 0' };
    }

    // 验证是否为数字格式（允许保留 2 位小数）
    const amountRegex = /^\d+(\.\d{1,2})?$/;
    if (!amountRegex.test(String(value))) {
      return { valid: false, message: '金额格式不正确（保留 2 位小数）' };
    }

    return { valid: true, message: '' };
  },

  /**
   * 验证发票类型（必填，枚举值）
   * @param {string} value - 发票类型
   * @param {Array} allowedTypes - 允许的发票类型列表
   * @returns {Object} { valid: boolean, message: string }
   */
  validateInvoiceType(value, allowedTypes = ['增值税普通发票', '增值税专用发票']) {
    if (!value || !value.trim()) {
      return { valid: false, message: '请选择发票类型' };
    }

    if (!allowedTypes.includes(value.trim())) {
      return { valid: false, message: '发票类型不正确' };
    }
    return { valid: true, message: '' };
  },

  /**
   * 验证邮箱（可选）
   * @param {string} value - 邮箱地址
   * @returns {Object} { valid: boolean, message: string }
   */
  validateEmail(value) {
    // 可选字段，为空时通过
    if (!value || !value.trim()) {
      return { valid: true, message: '' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value.trim())) {
      return { valid: false, message: '邮箱格式不正确' };
    }
    // 长度限制（最多 100 字符）
    if (value.trim().length > 100) {
      return { valid: false, message: '邮箱地址不能超过 100 字符' };
    }
    return { valid: true, message: '' };
  },

  /**
   * 验证地址（可选）
   * @param {string} value - 地址
   * @returns {Object} { valid: boolean, message: string }
   */
  validateAddress(value) {
    // 可选字段，为空时通过
    if (!value || !value.trim()) {
      return { valid: true, message: '' };
    }

    if (value.trim().length < 5) {
      return { valid: false, message: '地址至少 5 个字符' };
    }
    // 长度限制（最多 200 字符）
    if (value.trim().length > 200) {
      return { valid: false, message: '地址不能超过 200 字符' };
    }
    // 特殊字符过滤检查
    if (this.detectSQLInjection(value)) {
      return { valid: false, message: '地址包含非法字符' };
    }
    return { valid: true, message: '' };
  },

  /**
   * 验证银行账号（可选）
   * @param {string} value - 银行账号
   * @returns {Object} { valid: boolean, message: string }
   */
  validateBankAccount(value) {
    // 可选字段，为空时通过
    if (!value || !value.trim()) {
      return { valid: true, message: '' };
    }

    const bankAccountRegex = /^\d{16,19}$/;
    if (!bankAccountRegex.test(value.trim())) {
      return { valid: false, message: '银行账号格式不正确（16-19 位）' };
    }
    return { valid: true, message: '' };
  },

  /**
   * 验证必填字段
   * @param {string} value - 字段值
   * @param {string} fieldName - 字段名称
   * @returns {Object} { valid: boolean, message: string }
   */
  validateRequired(value, fieldName = '该字段') {
    if (!value || !value.trim()) {
      return { valid: false, message: `请输入${fieldName}` };
    }
    // 特殊字符过滤检查
    if (this.detectSQLInjection(value)) {
      return { valid: false, message: `${fieldName}包含非法字符` };
    }
    return { valid: true, message: '' };
  },

  /**
   * 验证文本长度
   * @param {string} value - 文本值
   * @param {number} min - 最小长度
   * @param {number} max - 最大长度
   * @param {string} fieldName - 字段名称
   * @returns {Object} { valid: boolean, message: string }
   */
  validateLength(value, min, max, fieldName = '该字段') {
    if (!value) {
      return { valid: true, message: '' };
    }

    const length = value.trim().length;
    if (length < min) {
      return { valid: false, message: `${fieldName}至少${min}个字符` };
    }
    if (length > max) {
      return { valid: false, message: `${fieldName}最多${max}个字符` };
    }
    // 特殊字符过滤检查
    if (this.detectSQLInjection(value)) {
      return { valid: false, message: `${fieldName}包含非法字符` };
    }
    return { valid: true, message: '' };
  },

  /**
   * 验证数字范围
   * @param {number} value - 数字值
   * @param {number} min - 最小值
   * @param {number} max - 最大值
   * @param {string} fieldName - 字段名称
   * @returns {Object} { valid: boolean, message: string }
   */
  validateNumberRange(value, min, max, fieldName = '该字段') {
    const numValue = Number(value);
    if (isNaN(numValue)) {
      return { valid: false, message: `${fieldName}必须是数字` };
    }
    if (numValue < min || numValue > max) {
      return { valid: false, message: `${fieldName}必须在${min}-${max}之间` };
    }
    return { valid: true, message: '' };
  }
};

module.exports = Validator;

/**
 * ESLint + Prettier 配置——团队代码规范
 * 
 * @author Senior Developer
 * @version 1.0.0
 * @description 统一代码风格，自动修复常见问题
 */

// ========================================
// 1. 安装依赖
// ========================================

/**
 * 运行以下命令安装所需依赖：
 */

npm install --save-dev \
  eslint@latest \
  @typescript-eslint/parser@latest \
  @typescript-eslint/eslint-plugin@latest \
  eslint-plugin-react@latest \
  eslint-plugin-react-hooks@latest \
  eslint-plugin-jsx-a11y@latest \
  eslint-plugin-import@latest \
  eslint-config-prettier@latest \
  eslint-plugin-prettier@latest \
  prettier@latest \
  husky@latest \
  lint-staged@latest


// ========================================
// 2. .eslintrc.cjs 配置
// ========================================

// .eslintrc.cjs
module.exports = {
  root: true,
  
  // ===== 解析器 =====
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2024,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
    project: './tsconfig.json',
  },
  
  // ===== 环境 =====
  env: {
    browser: true,
    es2024: true,
    node: true,
  },
  
  // ===== 扩展规则集 =====
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'prettier', // 必须放在最后，禁用冲突规则
  ],
  
  // ===== 插件 =====
  plugins: [
    '@typescript-eslint',
    'react',
    'react-hooks',
    'jsx-a11y',
    'import',
    'prettier',
  ],
  
  // ===== 自定义规则 =====
  rules: {
    // ----- TypeScript 规则 -----
    '@typescript-eslint/no-explicit-any': 'error',          // 禁止any类型
    '@typescript-eslint/no-implicit-any': 'error',         // 禁止隐式any
    '@typescript-eslint/no-unused-vars': ['error', {        // 禁止未使用变量
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
    }],
    '@typescript-eslint/explicit-function-return-type': 'warn', // 要求函数显式返回类型
    '@typescript-eslint/no-floating-promises': 'error',     // 禁止浮动Promise
    '@typescript-eslint/await-thenable': 'error',          // 禁止await非Promise
    '@typescript-eslint/prefer-nullish-coalescing': 'warn', // 推荐使用??
    '@typescript-eslint/prefer-optional-chain': 'warn',     // 推荐使用?.
    '@typescript-eslint/no-non-null-assertion': 'warn',   // 谨慎使用!
    
    // ----- React 规则 -----
    'react/react-in-jsx-scope': 'off',                   // React 17+ 不需要import React
    'react/prop-types': 'off',                            // 使用TypeScript后不需要prop-types
    'react/display-name': 'off',
    'react/no-unknown-property': 'warn',
    'react/jsx-key': 'error',                             // 必须在数组渲染时提供key
    'react/jsx-boolean-value': ['error', 'never'],
    'react/jsx-curly-brace-presence': ['error', 'never'], // 简化JSX
    'react/self-closing-comp': 'warn',                    // 无子组件使用自闭合
    'react/prefer-stateless-function': 'off',
    
    // ----- React Hooks 规则 -----
    'react-hooks/rules-of-hooks': 'error',                // 强制Hooks规则
    'react-hooks/exhaustive-deps': 'warn',               // 检查useEffect依赖
    
    // ----- 代码质量规则 -----
    'no-console': ['warn', { allow: ['warn', 'error', 'info'] }], // 禁止console.log
    'no-alert': 'error',                                  // 禁止alert
    'no-debugger': 'error',                               // 禁止debugger
    'no-var': 'error',                                    // 禁止使用var
    'prefer-const': 'error',                              // 优先使用const
    'no-param-reassign': 'error',                         // 禁止修改函数参数
    'no-shadow': 'error',                                 // 禁止变量遮蔽
    'no-unused-expressions': 'error',                     // 禁止未使用表达式
    'no-useless-return': 'warn',                         // 禁止无用return
    'no-empty': ['error', { 'allowEmptyCatch': true }],  // 禁止空代码块
    
    // ----- 导入规则 -----
    'import/no-unresolved': 'error',                      // 禁止未解析的导入
    'import/named': 'error',                              // 禁止导入不存在的导出
    'import/default': 'error',                             // 禁止默认导入不存在
    'import/namespace': 'error',                          // 禁止命名空间导入不存在
    'import/no-extraneous-dependencies': 'warn',          // 禁止未声明的依赖
    'import/prefer-default-export': 'off',
    'import/no-default-export': 'off',
    'import/no-named-as-default-member': 'off',
    
    // ----- Prettier 集成 -----
    'prettier/prettier': ['error', {
      singleQuote: true,
      semi: false,
      tabWidth: 2,
      trailingComma: 'all',
      printWidth: 100,
      bracketSpacing: true,
      bracketSameLine: false,
      arrowParens: 'avoid',
      endOfLine: 'auto',
    }],
  },
  
  // ===== 全局变量 =====
  globals: {
    JSX: 'readonly',
  },
  
  // ===== 忽略模式 =====
  ignorePatterns: [
    'dist/',
    'dist-new/',
    'node_modules/',
    '*.config.cjs',
    '*.config.mjs',
    '*.config.ts',
    'build.js',
    'deploy_v35.py',
  ],
  
  // ===== 设置 =====
  settings: {
    react: {
      version: 'detect', // 自动检测React版本
    },
    'import/resolver': {
      typescript: {
        project: './tsconfig.json',
      },
      node: {
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
      },
    },
  },
};


// ========================================
// 3. .prettierrc.cjs 配置
// ========================================

// .prettierrc.cjs
module.exports = {
  // ----- 格式化规则 -----
  singleQuote: true,          // 使用单引号
  semi: false,               // 不使用分号
  tabWidth: 2,               // 2空格缩进
  trailingComma: 'all',       // 多行时尾部逗号
  printWidth: 100,           // 每行最大长度
  bracketSpacing: true,       // 对象括号空格
  bracketSameLine: false,     // 组件标签闭合符单独一行
  arrowParens: 'avoid',      // 单参数箭头函数省略括号
  endOfLine: 'auto',         // 自动检测换行符
  
  // ----- 解析器 -----
  parser: 'typescript',
};


// ========================================
// 4. .eslintignore & .prettierignore
// ========================================

// .eslintignore
dist/
dist-new/
node_modules/
build/
coverage/
*.config.cjs
*.config.mjs
*.config.ts
build.js
deploy_v35.py
vite.config.ts
postcss.config.js
tailwind.config.js


// .prettierignore
dist/
dist-new/
node_modules/
build/
coverage/
package-lock.json
*.md


// ========================================
// 5. package.json 脚本
// ========================================

/**
 * 在 package.json 中添加以下脚本：
 */

{
  "scripts": {
    // ----- 代码检查 -----
    "lint": "eslint . --ext .ts,.tsx,.js,.jsx",
    "lint:fix": "eslint . --ext .ts,.tsx,.js,.jsx --fix",
    "lint:watch": "eslint . --ext .ts,.tsx,.js,.jsx --watch",
    
    // ----- 格式化 -----
    "format": "prettier --write \"src/**/*.{ts,tsx,js,jsx,json,css,md}\"",
    "format:check": "prettier --check \"src/**/*.{ts,tsx,js,jsx,json,css,md}\"",
    
    // ----- 类型检查 -----
    "type-check": "tsc --noEmit",
    "type-check:watch": "tsc --noEmit --watch",
    
    // ----- 全部检查 -----
    "check": "npm run lint && npm run type-check && npm run format:check",
  }
}


// ========================================
// 6. Husky + lint-staged 配置（Git钩子）
// ========================================

/**
 * 安装 Husky：
 * npx husky install
 * npm pkg set scripts.prepare="husky install"
 * 
 * 添加 pre-commit 钩子：
 * npx husky add .husky/pre-commit "npx lint-staged"
 */

// .lintstagedrc.cjs
module.exports = {
  // TypeScript/JavaScript 文件
  '*.{ts,tsx,js,jsx}': [
    'eslint --fix',
    'prettier --write',
    'git add',
  ],
  
  // 配置文件
  '*.{json,md,css}': [
    'prettier --write',
    'git add',
  ],
  
  // 类型检查（仅暂存文件）
  '*.{ts,tsx}': [
    'tsc --noEmit --project tsconfig.json',
  ],
};


// ========================================
// 7. VSCode 配置（.vscode/settings.json）
// ========================================

/**
 * 在项目根目录创建 .vscode/settings.json：
 */

{
  // ----- ESLint -----
  "eslint.enable": true,
  "eslint.run": "onSave",
  "eslint.format.enable": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  
  // ----- Prettier -----
  "prettier.enable": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[javascriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  
  // ----- 编辑器设置 -----
  "editor.formatOnSave": true,
  "editor.codeActionsOnSaveTimeout": 500,
  "editor.suggest.snippetsPreventQuickSuggestions": false,
  "editor.inlineHint.enabled": true,
  
  // ----- TypeScript -----
  "typescript.preferences.preferTypeOnlyAutoImports": true,
  "typescript.suggest.autoImports": true,
  "typescript.updateImportsOnFileMove.enabled": "always",
  "typescript.preferences.importModuleSpecifierPreference": "non-relative",
  "typescript.preferences.importModuleSpecifierEnding": "minimal",
}


// ========================================
// 8. 推荐的 VSCode 插件（.vscode/extensions.json）
// ========================================

{
  "recommendations": [
    "dbaeumer.vscode-eslint",        // ESLint 集成
    "esbenp.prettier-vscode",       // Prettier 格式化
    "bradlc.vscode-tailwindcss",    // Tailwind CSS 智能提示
    "formulahendry.auto-close-tag",   // 自动关闭标签
    "formulahendry.auto-rename-tag", // 自动重命名标签
    "ms-vscode.vscode-typescript-next", // TypeScript 增强
    "antfu.iconify",                 // Iconify 图标预览
    "yoavbls.pretty-ts-errors",    // 美化TypeScript错误提示
  ]
}


// ========================================
// 9. 运行检查
// ========================================

/**
 * 步骤1：安装依赖（见上方）
 * 
 * 步骤2：运行 lint 检查所有文件
 * npm run lint
 * 
 * 步骤3：自动修复可修复问题
 * npm run lint:fix
 * 
 * 步骤4：格式化所有文件
 * npm run format
 * 
 * 步骤5：提交代码（自动触发 pre-commit 钩子）
 * git add .
 * git commit -m "feat: 添加ESLint+Prettier配置"
 * 
 * 步骤6：检查 CI/CD 是否通过
 */


export {}

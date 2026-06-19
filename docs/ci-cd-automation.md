/**
 * CI/CD 自动化配置——团队工程化
 * 
 * @author Senior Developer
 * @version 1.0.0
 * @description GitHub Actions 自动化部署流水线
 */

// =======================================
// 1. GitHub Actions —— 完整CI/CD流水线
// =======================================

/**
 * 文件路径：.github/workflows/ci-cd.yml
 * 
 * 功能：
 * 1. 代码检查（ESLint + Prettier）
 * 2. 类型检查（TypeScript）
 * 3. 单元测试（Jest + React Testing Library）
 * 4. 构建检查
 * 5. 自动部署到服务器
 */


name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

env:
  NODE_VERSION: '22'
  PYTHON_VERSION: '3.13'

jobs:
  # ===== Job 1: 代码质量检查 =====
  lint-and-type-check:
    name: 📊 代码质量检查
    runs-on: ubuntu-latest
    steps:
      - name: � checkout代码
        uses: actions/checkout@v4
        
      - name: � setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          
      - name: � install依赖
        run: npm ci --legacy-peer-deps
        
      - name: � ESLint检查
        run: npm run lint
        
      - name: � Prettier格式检查
        run: npm run format:check
        
      - name: � TypeScript类型检查
        run: npm run type-check
        
      - name: � 上传检查结果
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: lint-results
          path: |
            eslint-report.json
            prettier-report.txt


  # ===== Job 2: 单元测试 =====
  unit-tests:
    name: 🧪 单元测试
    runs-on: ubuntu-latest
    steps:
      - name: � checkout代码
        uses: actions/checkout@v4
        
      - name: � setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          
      - name: � install依赖
        run: npm ci --legacy-peer-deps
        
      - name: � 运行单元测试
        run: npm run test -- --coverage --watchAll=false
        
      - name: � 上传测试覆盖率
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: test-coverage
          path: coverage/
          
      - name: � 上传测试结果
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: test-results
          path: test-results/


  # ===== Job 3: 构建检查 =====
  build-check:
    name: 🔨 构建检查
    runs-on: ubuntu-latest
    steps:
      - name: � checkout代码
        uses: actions/checkout@v4
        
      - name: � setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          
      - name: � install依赖
        run: npm ci --legacy-peer-deps
        
      - name: 🔨 构建项目
        run: npm run build
        
      - name: � 检查构建产物大小
        run: |
          echo "## 构建产物大小" >> $GITHUB_STEP_SUMMARY
          du -sh dist-new/ >> $GITHUB_STEP_SUMMARY
          find dist-new -name "*.js" -exec du -sh {} \; | sort -rh | head -10 >> $GITHUB_STEP_SUMMARY
        
      - name: � 上传构建产物
        uses: actions/upload-artifact@v4
        with:
          name: build-artifacts
          path: dist-new/


  # ===== Job 4: 部署到服务器（仅main分支） =====
  deploy-to-server:
    name: 🚀 部署到服务器
    runs-on: ubuntu-latest
    needs: [lint-and-type-check, unit-tests, build-check]
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    steps:
      - name: � checkout代码
        uses: actions/checkout@v4
        
      - name: � setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          
      - name: � setup Python
        uses: actions/setup-python@v5
        with:
          python-version: ${{ env.PYTHON_VERSION }}
          
      - name: � install部署依赖
        run: pip install paramiko
        
      - name: 🚀 运行部署脚本
        env:
          SERVER_HOST: ${{ secrets.SERVER_HOST }}
          SERVER_USER: ${{ secrets.SERVER_USER }}
          SERVER_PASSWORD: ${{ secrets.SERVER_PASSWORD }}
        run: python deploy_v35.py
        
      - name: � 验证部署
        run: |
          sleep 5
          curl -I https://worldcupanalyzer.com/ | head -3


  # ===== Job 5: 通知 =====
  notify:
    name: 📢 通知
    runs-on: ubuntu-latest
    needs: [lint-and-type-check, unit-tests, build-check, deploy-to-server]
    if: always()
    steps:
      - name: � 发送Slack通知
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: |
            部署状态: ${{ job.status }}
            提交: ${{ github.sha }}
            作者: ${{ github.actor }}
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
        if: always()


// =======================================
// 2. 环境变量配置（GitHub Secrets）
// =======================================

/**
 * 在 GitHub 仓库设置中添加以下 Secrets：
 * 
 * Settings → Secrets and variables → Actions → New repository secret
 */

// ------ 必需的环境变量 ------
SERVER_HOST=119.45.46.29
SERVER_USER=root
SERVER_PASSWORD=Py^R~Ad/9L@%56c
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/xxx/xxx/xxx  # 可选


// =======================================
// 3. 保护分支策略
// =======================================

/**
 * 在 GitHub 仓库设置中启用分支保护：
 * 
 * Settings → Branches → Add branch protection rule
 * 
 * 对 main 分支设置：
 * ✅ Require a pull request before merging
 * ✅ Require status checks to pass before merging
 *    - lint-and-type-check
 *    - unit-tests
 *    - build-check
 * ✅ Require branches to be up to date before merging
 * ✅ Include administrators
 */


// =======================================
// 4. 自动化测试配置（Jest + RTL）
// =======================================

/**
 * 安装测试依赖：
 * npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom
 */

// ------ jest.config.ts ------
import type { Config } from 'jest';

const config: Config = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.tsx?$': '@swc/jest',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.tsx',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};

export default config;


// ------ src/test/setup.ts ------
import '@testing-library/jest-dom';


// ------ 示例测试：matchPredictor.test.ts ------
import { predictMatch } from '@/data/matchPredictor';
import { teams } from '@/data/teams';
import { matches } from '@/data/stadiums';

describe('matchPredictor', () => {
  it('应该正确预测强弱对决', () => {
    const homeTeam = teams.find(t => t.id === 'portugal');
    const awayTeam = teams.find(t => t.id === 'congo');
    const match = matches.find(m => m.id === 'm33');
    
    expect(homeTeam).toBeDefined();
    expect(awayTeam).toBeDefined();
    expect(match).toBeDefined();
    
    const prediction = predictMatch(homeTeam!, awayTeam!, match!);
    
    expect(prediction.predictedHomeGoals).toBeGreaterThan(prediction.predictedAwayGoals);
    expect(prediction.homeWinProb).toBeGreaterThan(prediction.awayWinProb);
    expect(prediction.scoreProbabilities.length).toBe(5);
  });
  
  it('xG应该在合理范围内', () => {
    const homeTeam = teams.find(t => t.id === 'england');
    const awayTeam = teams.find(t => t.id === 'croatia');
    const match = matches.find(m => m.id === 'm35');
    
    const prediction = predictMatch(homeTeam!, awayTeam!, match!);
    
    // xG应该在0.35-6.0范围内（v3.3配置）
    expect(prediction.homeXG).toBeGreaterThanOrEqual(0.35);
    expect(prediction.homeXG).toBeLessThanOrEqual(6.0);
    expect(prediction.awayXG).toBeGreaterThanOrEqual(0.35);
    expect(prediction.awayXG).toBeLessThanOrEqual(6.0);
  });
});


// =======================================
// 5. 自动化版本号管理
// =======================================

/**
 * 使用 semantic-release 自动管理版本号
 * 
 * 安装：npm install --save-dev semantic-release @semantic-release/github
 */

// ------ .releaserc.json ------
{
  "branches": ["main"],
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/github"
  ]
}

// ------ 在 package.json 中添加 ------
{
  "scripts": {
    "semantic-release": "semantic-release"
  }
}

// ------ 在 CI/CD 中添加部署后步骤 ------
  versioning:
    name: 🏷️ 版本管理
    runs-on: ubuntu-latest
    needs: [deploy-to-server]
    if: github.ref == 'refs/heads/main'
    steps:
      - name: � checkout代码
        uses: actions/checkout@v4
        with:
          fetch-depth: 0
          
      - name: 🏷️ 运行 semantic-release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: npx semantic-release


// =======================================
// 6. 性能监控（Lighthouse CI）
// =======================================

/**
 * 安装：npm install --save-dev @lhci/cli @lhci/server
 */

// ------ .lighthouserc.js ------
module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:4173/'],
      startServerCommand: 'npm run preview -- --port 4173',
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.8 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
        'categories:pwa': ['warn', { minScore: 0.5 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};

// ------ 在 CI/CD 中添加 ------
  performance-test:
    name: 💡 性能测试
    runs-on: ubuntu-latest
    needs: [build-check]
    steps:
      - name: � checkout代码
        uses: actions/checkout@v4
        
      - name: � setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          
      - name: � install依赖
        run: npm ci --legacy-peer-deps
        
      - name: 🔨 构建项目
        run: npm run build
        
      - name: 💡 运行 Lighthouse CI
        run: |
          npm install -g @lhci/cli
          lhci autorun


// =======================================
// 7. 安全扫描
// =======================================

/**
 * 在 CI/CD 中添加安全扫描步骤
 */

  security-scan:
    name: 🔒 安全扫描
    runs-on: ubuntu-latest
    steps:
      - name: � checkout代码
        uses: actions/checkout@v4
        
      - name: 🔒 运行 npm audit
        run: npm audit --audit-level=moderate
        
      - name: 🔒 运行 Snyk安全扫描
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
          
      - name: 🔒 上传安全扫描结果
        if: always()
        uses: github/codeql-action/upload-sarif@v3
        with:
          sarif_file: snyk.sarif


// =======================================
// 8. 依赖更新自动化（Dependabot）
// =======================================

/**
 * 文件路径：.github/dependabot.yml
 */

version: 2
updates:
  - package-ecosystem: npm
    directory: "/"
    schedule:
      interval: weekly
      day: monday
    open-pull-requests-limit: 5
    reviewers:
      - your-github-username
    assignees:
      - your-github-username
    labels:
      - dependencies
      - automated
    
  - package-ecosystem: github-actions
    directory: "/"
    schedule:
      interval: weekly
      day: monday


// =======================================
// 9. 完整的 .github/workflows/ci-cd.yml
// =======================================

/**
 * 将以下内容保存为 .github/workflows/ci-cd.yml
 */


export {}

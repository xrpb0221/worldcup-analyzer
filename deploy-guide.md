# 世界杯分析站 - 腾讯云 COS 部署指南

## 项目信息
- 域名：worldcupanalyzer.com
- 项目路径：D:\足球网站\worldcup-app
- 构建产物：D:\足球网站\worldcup-app\dist
- 技术栈：React + TypeScript + Vite（纯前端静态站）

---

## 第一步：创建腾讯云 COS 存储桶

1. 登录 [腾讯云控制台](https://console.cloud.tencent.com)
2. 搜索「对象存储 COS」进入控制台
3. 点击「存储桶列表」→「创建存储桶」
4. 填写配置：
   - **名称**：worldcup-analyzer（自定义）
   - **所属地域**：选离你最近的（如：北京、上海、广州）
   - **访问权限**：⚠️ 选择「公有读、私有写」
   - **存储类别**：标准存储
5. 点击创建

---

## 第二步：开启静态网站托管

1. 进入刚创建的存储桶
2. 左侧菜单 → 「基础配置」→「静态网站」
3. 点击「编辑」：
   - **静态网站**：开启
   - **默认索引文档**：index.html
   - **默认错误文档**：index.html（SPA单页应用必须设这个！）
4. 保存后，腾讯云会给你一个访问域名，格式：
   `https://worldcup-analyzer-1234567890.cos.ap-beijing.myqcloud.com`
   ⚠️ 记下这个地址，后面要用

---

## 第三步：上传网站文件

### 方法一：控制台上传（简单但慢）

1. 进入存储桶 → 「文件列表」
2. 点击「上传文件」
3. 把 `D:\足球网站\worldcup-app\dist` 下的所有文件拖进去
   - `index.html`（根目录）
   - `assets/` 文件夹（含 .js 和 .css 文件）
4. 确认上传

### 方法二：命令行上传（推荐，速度快）

1. 安装 COSCLI 工具：
   ```bash
   # 下载地址
   https://cosbrowser.cloud.tencent.com/software/coscli/coscli-windows-amd64.exe
   ```
   下载后重命名为 `coscli.exe`，放到任意目录（如 D:\）

2. 配置密钥：
   ```bash
   coscli config set -a 你的SecretId -s 你的SecretKey
   ```
   > 密钥获取：腾讯云 → 访问管理 → API密钥管理 → 创建密钥

3. 上传文件：
   ```bash
   coscli cp D:\足球网站\worldcup-app\dist\index.html cos://worldcup-analyzer/index.html
   coscli cp D:\足球网站\worldcup-app\dist\assets cos://worldcup-analyzer/assets/ -r
   ```

### 方法三：用 COS Browser 桌面端（最简单推荐！）

1. 下载 [COS Browser](https://cosbrowser.cloud.tencent.com/)
2. 用腾讯云账号登录
3. 找到你的存储桶
4. 直接把 dist 文件夹里的内容拖拽上传

---

## 第四步：配置自定义域名

1. 进入存储桶 → 「域名与传输管理」→「自定义域名」
2. 点击「添加域名」：
   - **域名**：worldcupanalyzer.com
   - **源站类型**：静态网站源站
3. 保存后，腾讯云会给你一个 CNAME 值，类似：
   `worldcup-analyzer-1234567890.cos.ap-beijing.myqcloud.com`
   ⚠️ 记下这个 CNAME 值

---

## 第五步：配置 DNS 解析

1. 去你注册域名的平台（阿里云域名管理）
2. 找到 worldcupanalyzer.com → DNS 解析设置
3. 添加记录：

   | 记录类型 | 主机记录 | 记录值 | TTL |
   |---------|---------|--------|-----|
   | CNAME | www | worldcup-analyzer-xxxx.cos.ap-beijing.myqcloud.com | 600 |
   | CNAME | @ | worldcup-analyzer-xxxx.cos.ap-beijing.myqcloud.com | 600 |

   > ⚠️ 把 `worldcup-analyzer-xxxx.cos.ap-beijing.myqcloud.com` 替换成第四步拿到的 CNAME 值

4. 等待 DNS 生效（通常 10 分钟 - 2 小时）

---

## 第六步：开启 HTTPS（免费）

1. 腾讯云 → SSL 证书服务 → 「申请免费证书」
2. 填写域名：worldcupanalyzer.com
3. 选择「DNS 验证」，按提示添加 DNS TXT 记录
4. 等证书签发（通常几分钟到几小时）
5. 签发后，回到存储桶的「自定义域名」
6. 上传证书，开启 HTTPS 强制跳转

---

## 第七步（可选）：开启 CDN 加速

1. 腾讯云 → CDN → 「添加域名」
2. 加速域名：worldcupanalyzer.com
3. 源站类型：COS 源站
4. 选择你的存储桶
5. 开启后，DNS 的 CNAME 改为 CDN 分配的域名
6. 这样全国访问都很快

---

## 验证部署

完成后访问以下地址检查：
- ✅ https://worldcupanalyzer.com
- ✅ https://www.worldcupanalyzer.com

---

## 日常更新

每次修改代码后，只需要：

```bash
# 1. 重新构建
cd D:\足球网站\worldcup-app
npm run build

# 2. 重新上传 dist 目录到 COS（覆盖旧文件）
# 用 COS Browser 拖拽最方便
```

---

## 费用估算

| 项目 | 费用 |
|------|------|
| COS 存储（约0.5MB） | < 1元/月 |
| COS 流量 | 按量计费，免费额度内基本不花钱 |
| CDN 加速 | 免费额度 10GB/月（新用户） |
| SSL 证书 | 免费 |
| **合计** | **约 1-5 元/月** |

---

## 常见问题

**Q: 访问子页面刷新404？**
A: 确保第二步中「默认错误文档」设为了 index.html，这是 SPA 应用的关键配置。

**Q: 域名解析后还是打不开？**
A: DNS 生效需要时间，可以用 `nslookup worldcupanalyzer.com` 检查是否解析成功。

**Q: .com 域名需要备案吗？**
A: 如果服务器在大陆就需要。COS 在大陆的节点需要备案。但 .com 域名在海外节点不需要备案。如果不想备案，创建存储桶时选「香港」地域即可。

**Q: 不想备案怎么办？**
A: 存储桶地域选「香港」或「新加坡」，.com 域名无需备案即可绑定使用。

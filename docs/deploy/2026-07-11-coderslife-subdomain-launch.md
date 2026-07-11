# CodersLife 子域名上线记录

## 变更概况

- 执行时间：2026-07-11 10:44-11:28 CST
- 新增入口：`https://coderslife.doitbenai.cloud`
- 站点目录：`/var/www/coderslife/current`
- 服务器地址：`121.40.117.240`
- 影响范围：新增 DNS A 记录、独立 Nginx 站点和独立 Let's Encrypt 证书
- 保持不变：`doitbenai.cloud`、`www.doitbenai.cloud` 及其他现有站点

## 决策说明

- 子域名复用现有静态发布目录，避免复制产物或形成两套发布流程。
- 使用独立 Nginx server block 和独立证书，避免扩展主域名证书时影响现有入口。
- HTTP 仅保留 ACME 验证路径，其余请求永久跳转 HTTPS。
- 本次不迁移或重定向根域名；根域名是否改为项目导航页留作后续独立变更。

## DNS

- 记录类型：A
- 主机记录：`coderslife`
- 记录值：`121.40.117.240`
- TTL：600 秒
- 权威 DNS：`dns23.hichina.com`、`dns24.hichina.com`

## 配置与证书

- 项目配置：`deploy/nginx-coderslife-subdomain.conf`
- 线上配置：`/etc/nginx/sites-available/coderslife.doitbenai.cloud`
- 启用链接：`/etc/nginx/sites-enabled/coderslife.doitbenai.cloud`
- 证书目录：`/etc/letsencrypt/live/coderslife.doitbenai.cloud/`
- 证书到期：2026-10-09
- 续期方式：Certbot webroot，路径 `/var/www/letsencrypt`

## 备份与回退

- 备份目录：`/root/backups/nginx/coderslife-subdomain-prechange-20260711/`
- Nginx 归档：`nginx-before.tar.gz`
- 归档 SHA-256：`908084e735e4d4880e8fe30902ebde3fb5d2312da9ba7a500f289aa8e1bf647e`
- HTTP 启动配置备份：`coderslife.doitbenai.cloud.http-bootstrap.conf`

回退时将新增的 enabled 链接和 available 配置移动到备份目录，然后执行：

```bash
nginx -t
systemctl reload nginx
```

随后在阿里云 DNS 停用或删除 `coderslife` A 记录。独立证书可以保留到自然失效，不需要物理删除。

## 验证结果

- 阿里云两台权威 DNS、Cloudflare DNS 和 Google DNS 均返回 `121.40.117.240`
- `http://coderslife.doitbenai.cloud/` 返回 301，并跳转 HTTPS
- `https://coderslife.doitbenai.cloud/` 返回 HTTP/2 200
- 页面标题为“程序员人生模拟器 V6”
- 证书 CN 和 SAN 均为 `coderslife.doitbenai.cloud`
- Certbot 自动续期 dry-run 成功
- Nginx 配置检查通过，服务状态为 active，变更后无 warning 级日志
- 原有五个公网入口回归检查均返回 HTTP 200

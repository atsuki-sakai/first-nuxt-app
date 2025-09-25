# マルチステージビルドによる最適化
# .nvmrcで指定されているNode.js 22.20.0を使用
FROM node:22.20.0-alpine AS base

# 本番用依存関係のインストール
FROM base AS deps
RUN apk add --no-cache libc6-compat python3 make g++
WORKDIR /app

# package.jsonファイルをコピー
COPY package*.json ./
# 古いpackage-lock.jsonを削除してnpmをアップデート
RUN rm -f package-lock.json && \
    npm install -g npm@latest && \
    npm install --omit=dev && \
    npm cache clean --force

# アプリケーションビルド用ステージ
FROM base AS builder
RUN apk add --no-cache python3 make g++
WORKDIR /app
COPY package*.json ./
# 古いpackage-lock.jsonを削除してクリーンインストール
RUN rm -f package-lock.json && \
    npm install -g npm@latest && \
    npm install

COPY . .

# アプリケーションをビルド
RUN npm run build

# 本番用イメージの作成
FROM base AS runner
WORKDIR /app

# 非rootユーザーの作成
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nuxt

# ビルド済みアプリケーションをコピー
COPY --from=builder --chown=nuxt:nodejs /app/.output /app/.output
COPY --from=deps --chown=nuxt:nodejs /app/node_modules /app/node_modules

USER nuxt

# ポートを公開
EXPOSE 3000

# 環境変数の設定
ENV PORT=3000
ENV HOST=0.0.0.0
ENV NODE_ENV=production

# アプリケーションを起動
CMD ["node", ".output/server/index.mjs"]
# GCP Cloud Run デプロイガイド

## 1. GCPプロジェクトの準備

### プロジェクト作成・選択
```bash
# 新しいプロジェクトを作成（オプション）
gcloud projects create YOUR_PROJECT_ID

# プロジェクトを選択
gcloud config set project YOUR_PROJECT_ID
```

### 必要なAPIの有効化
```bash
gcloud services enable \
  cloudbuild.googleapis.com \
  run.googleapis.com \
  artifactregistry.googleapis.com
```

### Artifact Registry リポジトリの作成
```bash
gcloud artifacts repositories create nuxt-app \
  --repository-format=docker \
  --location=asia-northeast1 \
  --description="Nuxt.js application images"
```

## 2. Workload Identity Federation設定（推奨）

### サービスアカウント作成
```bash
# Cloud Runデプロイ用サービスアカウント
gcloud iam service-accounts create github-actions-cloudrun \
  --description="Service account for GitHub Actions Cloud Run deployment" \
  --display-name="GitHub Actions Cloud Run"

# 必要な権限を付与
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member="serviceAccount:github-actions-cloudrun@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member="serviceAccount:github-actions-cloudrun@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/artifactregistry.writer"

gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member="serviceAccount:github-actions-cloudrun@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser"
```

### Workload Identity Pool設定
```bash
# Workload Identity Poolを作成
gcloud iam workload-identity-pools create "github" \
  --project="YOUR_PROJECT_ID" \
  --location="global" \
  --display-name="GitHub"

# プールの完全名を取得
WORKLOAD_IDENTITY_POOL_ID=$(gcloud iam workload-identity-pools describe "github" \
  --project="YOUR_PROJECT_ID" \
  --location="global" \
  --format="value(name)")

# GitHubプロバイダーを作成
gcloud iam workload-identity-pools providers create-oidc "github-provider" \
  --project="YOUR_PROJECT_ID" \
  --location="global" \
  --workload-identity-pool="github" \
  --display-name="GitHub provider" \
  --attribute-mapping="google.subject=assertion.sub,attribute.actor=assertion.actor,attribute.repository=assertion.repository" \
  --issuer-uri="https://token.actions.githubusercontent.com"

# サービスアカウントとの関連付け
gcloud iam service-accounts add-iam-policy-binding \
  "github-actions-cloudrun@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
  --project="YOUR_PROJECT_ID" \
  --role="roles/iam.workloadIdentityUser" \
  --member="principalSet://iam.googleapis.com/${WORKLOAD_IDENTITY_POOL_ID}/attribute.repository/YOUR_GITHUB_USERNAME/YOUR_REPO_NAME"
```

## 3. GitHub Secrets設定

GitHubリポジトリの Settings > Secrets and variables > Actions で以下のシークレットを設定：

### 必須シークレット
```
GCP_PROJECT_ID=YOUR_PROJECT_ID
WIF_PROVIDER=projects/PROJECT_NUMBER/locations/global/workloadIdentityPools/github/providers/github-provider
WIF_SERVICE_ACCOUNT=github-actions-cloudrun@YOUR_PROJECT_ID.iam.gserviceaccount.com
```

### PROJECT_NUMBERの取得方法
```bash
gcloud projects describe YOUR_PROJECT_ID --format="value(projectNumber)"
```

## 4. Cloud Run初期設定

### 初回手動デプロイ（オプション）
```bash
# ローカルでDockerイメージをビルド・プッシュ
docker build -t asia-northeast1-docker.pkg.dev/YOUR_PROJECT_ID/nuxt-app/nuxt-app:initial .
docker push asia-northeast1-docker.pkg.dev/YOUR_PROJECT_ID/nuxt-app/nuxt-app:initial

# Cloud Runサービスを作成
gcloud run deploy nuxt-app \
  --image asia-northeast1-docker.pkg.dev/YOUR_PROJECT_ID/nuxt-app/nuxt-app:initial \
  --region asia-northeast1 \
  --platform managed \
  --allow-unauthenticated \
  --port 3000 \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10
```

## 5. 環境変数設定（必要に応じて）

```bash
# Cloud Runサービスに環境変数を設定
gcloud run services update nuxt-app \
  --region asia-northeast1 \
  --set-env-vars "NODE_ENV=production,PORT=3000,HOST=0.0.0.0"
```

## 6. カスタムドメイン設定（オプション）

```bash
# ドメインマッピング
gcloud run domain-mappings create \
  --service nuxt-app \
  --domain your-domain.com \
  --region asia-northeast1
```

## トラブルシューティング

### よくある問題と解決策

**権限エラー**:
- サービスアカウントに必要な権限が付与されているか確認
- Workload Identity Federationの設定を再確認

**Docker push失敗**:
- Artifact Registryの認証確認: `gcloud auth configure-docker asia-northeast1-docker.pkg.dev`

**Cloud Runデプロイ失敗**:
- ログ確認: `gcloud run services logs read nuxt-app --region asia-northeast1`
- リソース設定（メモリ・CPU）を確認

### 有用なコマンド

```bash
# Cloud Runサービス一覧
gcloud run services list

# サービス詳細表示
gcloud run services describe nuxt-app --region asia-northeast1

# ログ確認
gcloud run services logs read nuxt-app --region asia-northeast1 --limit 100
```
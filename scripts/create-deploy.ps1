# 스크립트 실행 위치를 프로젝트 루트로 설정
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location (Join-Path $scriptPath "..")

Write-Host "🚀 배포용 압축파일 생성을 시작합니다..." -ForegroundColor Green

# 임시 deploy 디렉토리가 이미 존재하면 삭제
if (Test-Path "deploy_temp") {
    Write-Host "📁 기존 임시 디렉토리를 삭제합니다..." -ForegroundColor Yellow
    Remove-Item -Path "deploy_temp" -Recurse -Force
}

# 기존 압축파일이 존재하면 삭제
if (Test-Path "deploy.tar.gz") {
    Write-Host "📦 기존 압축파일을 삭제합니다..." -ForegroundColor Yellow
    Remove-Item -Path "deploy.tar.gz" -Force
}

# 임시 deploy 디렉토리 생성
Write-Host "📁 임시 디렉토리를 생성합니다..." -ForegroundColor Green
New-Item -ItemType Directory -Path "deploy_temp" -Force | Out-Null

# 제외할 파일/폴더 목록
$excludePatterns = @(
    ".github",
    ".git",
    ".next",
    "node_modules",
    "README.md",
    "deploy",
    "deploy_temp",
    ".env",
    ".env.local",
    ".env.development",
    ".env.production",
    "*.log",
    ".DS_Store",
    "Thumbs.db",
    ".vscode",
    ".idea",
    "coverage",
    ".nyc_output",
    "*.tgz",
    "*.tar.gz",
    "scripts",
    "CLAUDE.md",
    ".claude",
    "claude.json",
    ".claude.json"
)

# 복사할 파일 목록 생성 (제외 패턴 적용)
Write-Host "📂 파일을 복사합니다..." -ForegroundColor Green

# 모든 파일과 폴더를 가져오되 제외 패턴에 맞지 않는 것만
Get-ChildItem -Path "." -Recurse | Where-Object {
    $item = $_
    $relativePath = $item.FullName.Substring((Get-Location).Path.Length + 1)
    
    # 제외 패턴 확인
    $shouldExclude = $false
    foreach ($pattern in $excludePatterns) {
        if ($pattern -like "*.*") {
            # 파일 확장자 패턴
            if ($item.Name -like $pattern) {
                $shouldExclude = $true
                break
            }
        } else {
            # 폴더 패턴
            if ($relativePath -like "$pattern*" -or $item.Name -eq $pattern) {
                $shouldExclude = $true
                break
            }
        }
    }
    
    return -not $shouldExclude
} | ForEach-Object {
    $relativePath = $_.FullName.Substring((Get-Location).Path.Length + 1)
    $destinationPath = Join-Path "deploy_temp" $relativePath
    
    if ($_.PSIsContainer) {
        # 폴더인 경우
        if (-not (Test-Path $destinationPath)) {
            New-Item -ItemType Directory -Path $destinationPath -Force | Out-Null
        }
    } else {
        # 파일인 경우
        $destinationDir = Split-Path $destinationPath -Parent
        if (-not (Test-Path $destinationDir)) {
            New-Item -ItemType Directory -Path $destinationDir -Force | Out-Null
        }
        Copy-Item $_.FullName -Destination $destinationPath -Force
    }
}

# 배포용 README 생성
Write-Host "📝 배포용 README.md를 생성합니다..." -ForegroundColor Green
$readmeContent = @"
# 배포용 프로젝트

이 폴더는 배포를 위해 생성된 복제본입니다.

## 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start
```

## 주의사항

- 이 폴더는 자동 생성된 것으로, 직접 수정하지 마세요.
- 원본 프로젝트에서 수정 후 다시 배포용 압축파일을 생성하세요.
"@

$readmeContent | Out-File -FilePath "deploy_temp/README.md" -Encoding UTF8

# PowerShell에서 tar.gz 압축파일 생성 (tar 명령어가 있는 경우)
Write-Host "📦 압축파일을 생성합니다..." -ForegroundColor Green

# Windows 10 이상에서 tar 명령어 사용 (PowerShell Core 또는 Windows Subsystem for Linux)
try {
    # tar 명령어를 사용하여 압축
    & tar -czf "deploy.tar.gz" -C "deploy_temp" "."
    Write-Host "✅ tar.gz 압축파일이 생성되었습니다." -ForegroundColor Green
} catch {
    # tar 명령어가 없는 경우 zip 파일로 생성
    Write-Host "⚠️ tar 명령어를 찾을 수 없어 zip 파일로 생성합니다..." -ForegroundColor Yellow
    Compress-Archive -Path "deploy_temp/*" -DestinationPath "deploy.zip" -Force
    Write-Host "✅ zip 압축파일이 생성되었습니다." -ForegroundColor Green
}

# 임시 디렉토리 삭제
Write-Host "🧹 임시 디렉토리를 정리합니다..." -ForegroundColor Green
Remove-Item -Path "deploy_temp" -Recurse -Force

Write-Host "✅ 배포용 압축파일 생성이 완료되었습니다!" -ForegroundColor Green

# 생성된 파일 확인 및 안내
if (Test-Path "deploy.tar.gz") {
    Write-Host "📍 위치: $(Get-Location)/deploy.tar.gz" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "다음 단계:" -ForegroundColor Yellow
    Write-Host "1. tar -xzf deploy.tar.gz -C [배포할_디렉토리]"
    Write-Host "2. cd [배포할_디렉토리]"
    Write-Host "3. npm install"
    Write-Host "4. npm run build"
    Write-Host "5. 배포 환경으로 전송"
} elseif (Test-Path "deploy.zip") {
    Write-Host "📍 위치: $(Get-Location)/deploy.zip" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "다음 단계:" -ForegroundColor Yellow
    Write-Host "1. deploy.zip을 [배포할_디렉토리]에 압축 해제"
    Write-Host "2. cd [배포할_디렉토리]"
    Write-Host "3. npm install"
    Write-Host "4. npm run build"
    Write-Host "5. 배포 환경으로 전송"
} else {
    Write-Host "❌ 압축파일 생성에 실패했습니다." -ForegroundColor Red
} 
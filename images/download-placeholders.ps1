# PowerShell脚本下载占位图片
Write-Host "开始下载旅游网站占位图片..." -ForegroundColor Green

# 创建图片URL列表
$images = @(
    @{Name="zhangjiajie.jpg"; Url="https://picsum.photos/800/600?random=1"},
    @{Name="forbidden-city.jpg"; Url="https://picsum.photos/800/600?random=2"},
    @{Name="bund.jpg"; Url="https://picsum.photos/800/600?random=3"},
    @{Name="chengdu.jpg"; Url="https://picsum.photos/800/600?random=4"},
    @{Name="west-lake.jpg"; Url="https://picsum.photos/800/600?random=5"},
    @{Name="chongqing.jpg"; Url="https://picsum.photos/800/600?random=6"}
)

# 下载每张图片
foreach ($img in $images) {
    $outputPath = Join-Path $PSScriptRoot $img.Name
    Write-Host "正在下载: $($img.Name)..." -ForegroundColor Cyan
    
    try {
        # 使用Invoke-WebRequest下载图片
        Invoke-WebRequest -Uri $img.Url -OutFile $outputPath -UseBasicParsing
        Write-Host "✓ 下载完成: $($img.Name)" -ForegroundColor Green
    }
    catch {
        Write-Host "✗ 下载失败: $($img.Name) - $_" -ForegroundColor Red
    }
    
    # 稍微延迟一下，避免请求过快
    Start-Sleep -Milliseconds 500
}

Write-Host "`n所有图片下载完成！" -ForegroundColor Green
Write-Host "图片保存在: $PSScriptRoot" -ForegroundColor Yellow
Write-Host "`n如果还需要真实景点图片，请:" -ForegroundColor Cyan
Write-Host "1. 打开 images/download-images.html 文件" -ForegroundColor Cyan
Write-Host "2. 右键保存图片到 images/ 文件夹" -ForegroundColor Cyan
Write-Host "3. 使用正确的文件名" -ForegroundColor Cyan
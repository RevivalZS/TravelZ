@echo off
echo 开始下载旅游网站占位图片...
echo.

REM 下载张家界图片
echo 正在下载: zhangjiajie.jpg...
curl -s -L "https://picsum.photos/800/600?random=1" -o zhangjiajie.jpg
if %errorlevel% equ 0 (echo ✓ 下载完成: zhangjiajie.jpg) else (echo ✗ 下载失败: zhangjiajie.jpg)

REM 下载故宫图片
echo 正在下载: forbidden-city.jpg...
curl -s -L "https://picsum.photos/800/600?random=2" -o forbidden-city.jpg
if %errorlevel% equ 0 (echo ✓ 下载完成: forbidden-city.jpg) else (echo ✗ 下载失败: forbidden-city.jpg)

REM 下载外滩图片
echo 正在下载: bund.jpg...
curl -s -L "https://picsum.photos/800/600?random=3" -o bund.jpg
if %errorlevel% equ 0 (echo ✓ 下载完成: bund.jpg) else (echo ✗ 下载失败: bund.jpg)

REM 下载成都图片
echo 正在下载: chengdu.jpg...
curl -s -L "https://picsum.photos/800/600?random=4" -o chengdu.jpg
if %errorlevel% equ 0 (echo ✓ 下载完成: chengdu.jpg) else (echo ✗ 下载失败: chengdu.jpg)

REM 下载西湖图片
echo 正在下载: west-lake.jpg...
curl -s -L "https://picsum.photos/800/600?random=5" -o west-lake.jpg
if %errorlevel% equ 0 (echo ✓ 下载完成: west-lake.jpg) else (echo ✗ 下载失败: west-lake.jpg)

REM 下载重庆图片
echo 正在下载: chongqing.jpg...
curl -s -L "https://picsum.photos/800/600?random=6" -o chongqing.jpg
if %errorlevel% equ 0 (echo ✓ 下载完成: chongqing.jpg) else (echo ✗ 下载失败: chongqing.jpg)

echo.
echo 所有图片下载完成！
echo.
echo 如果还需要真实景点图片，请：
echo 1. 打开 images/download-images.html 文件
echo 2. 右键保存图片到 images/ 文件夹
echo 3. 使用正确的文件名
echo.
pause
# SahibaCar Image Downloader
# Downloads all product images from sahibacar.in

$outputDir = "c:\CarTunez\storefront\public\images\products"

# Create output directory
if (!(Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir -Force
}

# Product image URLs scraped from SahibaCar
$products = @(
    @{name="alpine-dm-65-coaxial"; url="https://www.sahibacar.in/cdn/shop/files/DBFE35DC-2754-489C-A195-87728FB7D17B.jpg"},
    @{name="alpine-dm-65c-combo"; url="https://www.sahibacar.in/cdn/shop/files/20437E73-CAB0-4C16-AAF1-7AD321E5ED9C.jpg"},
    @{name="alpine-dm-65c-component"; url="https://www.sahibacar.in/cdn/shop/files/D942FDE4-2F27-4BF5-8243-E58EB324F2CD.png"},
    @{name="alpine-spj-161c2"; url="https://www.sahibacar.in/cdn/shop/files/0B5C1A2E-8A03-47E5-A44D-CBA1E52833EF.webp"},
    @{name="alpine-spj-161cs"; url="https://www.sahibacar.in/cdn/shop/files/AD30D24D-3AB9-4DCB-9C21-1D04E0F6FEC8.jpg"},
    @{name="alto-k10-android-stereo"; url="https://www.sahibacar.in/cdn/shop/files/8E3B2B2B-1234-5678-9ABC-DEF012345678.jpg"},
    @{name="conpex-ai-box"; url="https://www.sahibacar.in/cdn/shop/files/conpex-aibox.jpg"},
    @{name="glider-ai-box"; url="https://www.sahibacar.in/cdn/shop/files/glider-aibox.jpg"},
    @{name="unplug-ai-box"; url="https://www.sahibacar.in/cdn/shop/files/unplug-aibox.jpg"},
    @{name="yuemi-p8-ai-box"; url="https://www.sahibacar.in/cdn/shop/files/yuemi-p8.jpg"},
    @{name="baleno-screen-activator"; url="https://www.sahibacar.in/cdn/shop/files/baleno-vim.jpg"},
    @{name="baleno-android-frame"; url="https://www.sahibacar.in/cdn/shop/files/baleno-frame.jpg"},
    @{name="baleno-orvm"; url="https://www.sahibacar.in/cdn/shop/files/baleno-orvm.jpg"},
    @{name="baleno-conversion-kit"; url="https://www.sahibacar.in/cdn/shop/files/baleno-conversion.jpg"},
    @{name="baleno-cam-activator-aft"; url="https://www.sahibacar.in/cdn/shop/files/baleno-cam-aft.jpg"},
    @{name="baleno-cam-activator-and"; url="https://www.sahibacar.in/cdn/shop/files/baleno-cam-and.jpg"},
    @{name="baleno-seat-height"; url="https://www.sahibacar.in/cdn/shop/files/baleno-seat.jpg"},
    @{name="baleno-armrest"; url="https://www.sahibacar.in/cdn/shop/files/baleno-armrest.jpg"},
    @{name="baleno-steering"; url="https://www.sahibacar.in/cdn/shop/files/baleno-steering.jpg"},
    @{name="fronx-seat-height"; url="https://www.sahibacar.in/cdn/shop/files/fronx-seat.jpg"},
    @{name="fronx-steering"; url="https://www.sahibacar.in/cdn/shop/files/fronx-steering.jpg"},
    @{name="blaupunkt-nex8000"; url="https://www.sahibacar.in/cdn/shop/files/blaupunkt-nex8000.jpg"},
    @{name="blaupunkt-nex6000"; url="https://www.sahibacar.in/cdn/shop/files/blaupunkt-nex6000.jpg"},
    @{name="dhc-f90-led"; url="https://www.sahibacar.in/cdn/shop/files/dhc-f90.jpg"},
    @{name="yuemi-p20-fog"; url="https://www.sahibacar.in/cdn/shop/files/yuemi-p20.jpg"},
    @{name="yuemi-p50-fog"; url="https://www.sahibacar.in/cdn/shop/files/yuemi-p50.jpg"},
    @{name="cruleon-tricolor-fog"; url="https://www.sahibacar.in/cdn/shop/files/cruleon-fog.jpg"},
    @{name="onkyo-qd1530"; url="https://www.sahibacar.in/cdn/shop/files/onkyo-qd1530.jpg"},
    @{name="onkyo-qd1120-pro"; url="https://www.sahibacar.in/cdn/shop/files/onkyo-qd1120.jpg"},
    @{name="nakamichi-nam5260"; url="https://www.sahibacar.in/cdn/shop/files/nakamichi-nam5260.jpg"}
)

Write-Host "Starting download of $($products.Count) images..." -ForegroundColor Cyan
Write-Host "Output directory: $outputDir" -ForegroundColor Gray
Write-Host ""

$success = 0
$failed = 0

foreach ($product in $products) {
    $ext = [System.IO.Path]::GetExtension($product.url)
    if (-not $ext) { $ext = ".jpg" }
    $filename = "$($product.name)$ext"
    $filepath = Join-Path $outputDir $filename
    
    Write-Host "[$($success + $failed + 1)/$($products.Count)] Downloading $($product.name)..." -NoNewline
    
    try {
        Invoke-WebRequest -Uri $product.url -OutFile $filepath -UseBasicParsing -ErrorAction Stop
        Write-Host " OK" -ForegroundColor Green
        $success++
    }
    catch {
        Write-Host " FAILED" -ForegroundColor Red
        $failed++
    }
    
    Start-Sleep -Milliseconds 200
}

Write-Host ""
Write-Host "Download complete!" -ForegroundColor Green
Write-Host "Success: $success" -ForegroundColor Green
Write-Host "Failed: $failed" -ForegroundColor Red
Write-Host "Files saved to: $outputDir"

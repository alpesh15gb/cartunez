const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://www.motorogue.in';
const CATEGORIES = [
    { name: 'CAR STEREOS', url: 'https://www.motorogue.in/products/stereos-headunit.html' },
    { name: 'CAR AMPLIFIERS', url: 'https://www.motorogue.in/products/amplifiers-equalizers.html' },
    { name: 'CAR SPEAKERS', url: 'https://www.motorogue.in/products/speakers-subwoofers.html' },
    { name: 'CAR LIGHTING', url: 'https://www.motorogue.in/products/car-accessories-lightings.html' }
];

async function scrapeCategory(category) {
    let products = [];
    let currentPage = 1;
    let url = category.url;

    while (url) {
        console.log(`Scraping ${category.name} - Page ${currentPage}...`);
        try {
            const { data } = await axios.get(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            });
            const $ = cheerio.load(data);
            $('.product-item').each((i, el) => {
                const box = $(el);
                const nameLink = box.find('.product-item-link').first();
                const name = nameLink.text().trim() || box.find('.product-name a').text().trim();
                const productUrl = nameLink.attr('href') || box.find('.product-name a').attr('href');
                const imageUrl = box.find('.product-image-photo').attr('src');
                
                const specialPrice = box.find('.special-price [data-price-amount]').attr('data-price-amount');
                const oldPrice = box.find('.old-price [data-price-amount]').attr('data-price-amount');
                const regularPrice = box.find('.price-container [data-price-amount]').attr('data-price-amount');

                const finalPrice = specialPrice || regularPrice;
                const mrp = oldPrice || finalPrice;

                if (name && finalPrice) {
                    products.push({
                        name: name,
                        url: productUrl || '',
                        imageUrl: imageUrl || '',
                        price: parseFloat(finalPrice),
                        discountPrice: specialPrice ? parseFloat(specialPrice) : null,
                        mrp: parseFloat(mrp),
                        category: category.name
                    });
                }
            });

            const nextBtn = $('.pages-item-next a').attr('href');
            if (nextBtn && nextBtn !== url) {
                url = nextBtn;
                currentPage++;
                // Limit to 5 pages per category for testing/safety
                if (currentPage > 5) break;
            } else {
                url = null;
            }
        } catch (error) {
            console.error(`Error scraping ${url}:`, error.message);
            break;
        }
    }
    return products;
}

async function scrapeAll() {
    let allProducts = [];
    for (const cat of CATEGORIES) {
        const products = await scrapeCategory(cat);
        allProducts = allProducts.concat(products);
    }

    const outputPath = path.join(__dirname, '../motorogue_products.json');
    fs.writeFileSync(outputPath, JSON.stringify(allProducts, null, 2));
    console.log(`Successfully scraped ${allProducts.length} products to ${outputPath}`);
}

scrapeAll();

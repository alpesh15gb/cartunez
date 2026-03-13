import requests
from bs4 import BeautifulSoup
import json
import time

BASE_URL = "https://nhone.in"
COLLECTIONS = [
    "/collections/car-headlight-bulb",
    "/collections/android-player",
    "/collections/cleaning-care"
]
LIMIT_PER_COLLECTION = 5 # For testing and fast import

def scrape_product(product_url):
    print(f"Scraping product: {product_url}")
    try:
        response = requests.get(product_url)
        soup = BeautifulSoup(response.content, "html.parser")
        
        title_tag = soup.select_one("h1.product__title")
        if not title_tag:
            title_tag = soup.select_one("h1") # Fallback
        
        if not title_tag:
            print(f"Could not find title for {product_url}")
            return None
            
        title = title_tag.text.strip()
        
        # Prices
        price_sale = soup.select_one("span.price-item--sale")
        price_regular = soup.select_one("span.price-item--regular")
        
        def parse_price(price_str):
            if not price_str: return 0.0
            # Extracts numbers from strings like "Rs. 2,499.00"
            digits = "".join(filter(str.isdigit, price_str))
            try:
                # Handle cases where Price shows as 199900 for 1999.00
                if ".00" in price_str:
                    return float(digits) / 100
                return float(digits)
            except:
                return 0.0

        sale_text = price_sale.text.strip() if price_sale else ""
        reg_text = price_regular.text.strip() if price_regular else ""
        
        current_price = parse_price(sale_text if sale_text else reg_text)
        original_price = parse_price(reg_text)
        
        # Logic to handle discountPrice correctly
        if original_price > current_price and current_price > 0:
            final_price = original_price
            discount_price = current_price
        else:
            final_price = current_price or original_price
            discount_price = None

        # Images
        image_elements = soup.select("ul.thumbnail-list li img")
        if not image_elements:
            image_elements = soup.select("div.product__media img")
            
        images = []
        for img in image_elements:
            src = img.get("src") or img.get("data-src")
            if src:
                if src.startswith("//"): src = "https:" + src
                # Clean up Shopify image URLs (remove size parameters)
                if "?" in src: src = src.split("?")[0]
                if src not in images:
                    images.append(src)

        # Description
        description_div = soup.select_one("div.product__description")
        description = str(description_div) if description_div else "No description available."

        return {
            "name": title,
            "description": description,
            "price": final_price,
            "discountPrice": discount_price,
            "images": images,
            "stockQuantity": 50, # Default for import
        }
    except Exception as e:
        print(f"Error scraping {product_url}: {e}")
        return None

def scrape_collection(collection_url):
    print(f"Scraping collection: {collection_url}")
    products = []
    page = 1
    
    while len(products) < LIMIT_PER_COLLECTION:
        url = f"{BASE_URL}{collection_url}?page={page}"
        response = requests.get(url)
        soup = BeautifulSoup(response.content, "html.parser")
        
        links = soup.select("h3.card__heading a")
        if not links:
            break
            
        for link in links:
            if len(products) >= LIMIT_PER_COLLECTION:
                break
                
            product_path = link.get("href")
            if product_path:
                product_data = scrape_product(BASE_URL + product_path)
                if product_data:
                    products.append(product_data)
                time.sleep(1) # Be nice
        
        # Check for next page
        next_button = soup.select_one("li a.pagination__item--next")
        if not next_button:
            break
        page += 1
        
    return products

if __name__ == "__main__":
    all_products = {}
    
    for collection in COLLECTIONS:
        category_name = collection.split("/")[-1].replace("-", " ").title()
        products = scrape_collection(collection)
        all_products[category_name] = products
        
    with open("nhone_products.json", "w") as f:
        json.dump(all_products, f, indent=2)
        
    print(f"Scrape complete! Saved to nhone_products.json")

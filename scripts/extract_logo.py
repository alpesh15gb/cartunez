import os
from PIL import Image
from rembg import remove

def process_logo():
    input_path = r"C:\Users\Alpesh\.gemini\antigravity\brain\69d3fedf-b931-471e-ad1d-f3b194451258\og_image_new_logo_1773373863088.png"
    output_path = r"d:\CarTunez\logo_transparent.png"
    
    print("Loading image...")
    input_image = Image.open(input_path)
    
    # Process with rembg
    print("Removing background...")
    # rembg often keeps the main subject, which is the logo + text
    output_image = remove(input_image)
    
    # Let's crop to the bounding box of the non-transparent pixels
    print("Cropping to content...")
    bbox = output_image.getbbox()
    if bbox:
        output_image = output_image.crop(bbox)
        
    # Adding some padding
    padding = 20
    padded = Image.new("RGBA", (output_image.width + padding*2, output_image.height + padding*2), (0,0,0,0))
    padded.paste(output_image, (padding, padding))
        
    print(f"Saving to {output_path}...")
    padded.save(output_path)
    
    # Web sizes
    web_logo = padded.resize((512, int(512 * padded.height / padded.width)), Image.Resampling.LANCZOS)
    web_logo.save(r"d:\CarTunez\web\public\logo.png")
    
    # Mobile app sizes
    padded.save(r"d:\CarTunez\mobile\assets\logo.png")
    padded.save(r"d:\CarTunez\mobile\assets\admin_logo.png")
    print("Logos distributed to web and mobile folders.")

if __name__ == "__main__":
    process_logo()

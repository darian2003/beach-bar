import qrcode
import json
import os
import secrets
import csv
from PIL import Image, ImageDraw, ImageFont
from datetime import datetime

# Configuration
BASE_URL = "https://localhost:5173"  # Replace with your actual base URL
OUTPUT_DIR = "qr-localhost"
MAPPING_FILE = "localhost-qr.json"
CSV_MAPPING_FILE = "localhost-qr.csv"
NUM_UMBRELLAS = 2

# QR Code settings
QR_SIZE = 300  # Size of QR code in pixels
PADDING = 10   # Padding around QR code (reduce for tighter borders)
TEXT_HEIGHT = 80  # Height reserved for text above QR code
FONT_SIZE = 70   # Font size for umbrella number

def generate_unique_token():
    """Generate a unique, URL-safe token"""
    return secrets.token_urlsafe(16)

def create_qr_with_number(url, umbrella_number):
    """Create QR code with umbrella number text above it"""
    # Generate QR code
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=10,
        border=2,  # QR code internal border (min 1 for scanning reliability)
    )
    qr.add_data(url)
    qr.make(fit=True)
    
    # Create QR code image
    qr_img = qr.make_image(fill_color="black", back_color="white")
    qr_img = qr_img.resize((QR_SIZE, QR_SIZE), Image.Resampling.LANCZOS)
    
    # Create new image with space for text
    total_width = QR_SIZE + (2 * PADDING)
    total_height = QR_SIZE + TEXT_HEIGHT + (2 * PADDING)
    final_img = Image.new('RGB', (total_width, total_height), 'white')
    
    # Create drawing context
    draw = ImageDraw.Draw(final_img)
    
    # Try to use a nice font, fall back to default if not available
    try:
        font = ImageFont.truetype("Arial.ttf", FONT_SIZE)
    except:
        try:
            font = ImageFont.truetype("/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf", FONT_SIZE)
        except:
            # Use default font as last resort
            font = ImageFont.load_default()
    
    # Draw umbrella number
    text = str(umbrella_number)
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    
    text_x = (total_width - text_width) // 2
    text_y = PADDING + (TEXT_HEIGHT - text_height) // 2
    
    draw.text((text_x, text_y), text, fill='black', font=font)
    
    # Paste QR code below text
    qr_position = (PADDING, PADDING + TEXT_HEIGHT)
    final_img.paste(qr_img, qr_position)
    
    return final_img

def main():
    """Main function to generate all QR codes and mapping file"""
    # Create output directory if it doesn't exist
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)
    
    # Dictionary to store token-to-umbrella mapping
    token_mapping = {}
    
    print(f"Generating {NUM_UMBRELLAS} QR codes...")
    
    for umbrella_num in range(1, NUM_UMBRELLAS + 1):
        # Generate unique token
        token = generate_unique_token()
        
        # Store mapping
        token_mapping[token] = umbrella_num
        
        # Create full URL
        full_url = BASE_URL + token
        
        # Create QR code with number
        qr_image = create_qr_with_number(full_url, umbrella_num)
        
        # Save image
        filename = f"umbrella_{umbrella_num:03d}.png"
        filepath = os.path.join(OUTPUT_DIR, filename)
        qr_image.save(filepath)
        
        # Progress indicator
        if umbrella_num % 10 == 0:
            print(f"Generated {umbrella_num}/{NUM_UMBRELLAS} QR codes...")
    
    # Save mapping to JSON file
    mapping_data = {
        "generated_at": datetime.now().isoformat(),
        "base_url": BASE_URL,
        "total_umbrellas": NUM_UMBRELLAS,
        "token_to_umbrella": token_mapping
    }
    
    with open(MAPPING_FILE, 'w') as f:
        json.dump(mapping_data, f, indent=2)
    
    # Save mapping to CSV file
    with open(CSV_MAPPING_FILE, 'w', newline='') as csvfile:
        fieldnames = ['umbrella_number', 'token', 'full_url', 'generated_at']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        
        # Write header
        writer.writeheader()
        
        # Write data
        generated_at = datetime.now().isoformat()
        for token, umbrella_num in token_mapping.items():
            writer.writerow({
                'umbrella_number': umbrella_num,
                'token': token,
                'full_url': BASE_URL + token,
                'generated_at': generated_at
            })
    
    print(f"\n✅ Successfully generated {NUM_UMBRELLAS} QR codes in '{OUTPUT_DIR}' directory")
    print(f"✅ Token mapping saved to '{MAPPING_FILE}'")
    print(f"✅ CSV mapping saved to '{CSV_MAPPING_FILE}'")
    
    # Print sample of mappings
    print("\nSample token mappings (first 5):")
    for i, (token, umbrella) in enumerate(list(token_mapping.items())[:5]):
        print(f"  Token: {token} -> Umbrella #{umbrella}")

if __name__ == "__main__":
    main()
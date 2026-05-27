from collections import deque
from pathlib import Path

from PIL import Image


SOURCE = Path(
    r"C:\Users\kinak\.codex\generated_images\019e3ba1-6c2c-7391-bb66-5cb2d594ba57\ig_097f747a9292d8bd016a16fbf79e448191998e91be7311a80e.png"
)

OUTPUTS = [
    ("assets/creature-fish.png", (0, 0)),
    ("assets/creature-amphibian.png", (1, 0)),
    ("assets/creature-reptile.png", (0, 1)),
    ("assets/creature-mammal.png", (1, 1)),
]


def remove_chroma_background(image: Image.Image) -> Image.Image:
    image = image.convert("RGBA")
    width, height = image.size
    pixels = image.load()
    queue = deque()
    seen = set()

    for x in range(width):
        queue.append((x, 0))
        queue.append((x, height - 1))
    for y in range(height):
        queue.append((0, y))
        queue.append((width - 1, y))

    while queue:
        x, y = queue.popleft()
        if x < 0 or y < 0 or x >= width or y >= height or (x, y) in seen:
            continue
        seen.add((x, y))
        r, g, b, a = pixels[x, y]
        is_key = g > 165 and g > r * 1.55 and g > b * 1.55
        if a and is_key:
            pixels[x, y] = (r, g, b, 0)
            queue.extend(((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)))

    return image


def fit_to_canvas(image: Image.Image, out_size=(310, 323), padding=16) -> Image.Image:
    bbox = image.getbbox()
    if bbox:
        image = image.crop(bbox)
    max_w = out_size[0] - padding * 2
    max_h = out_size[1] - padding * 2
    scale = min(max_w / image.width, max_h / image.height)
    resized = image.resize((round(image.width * scale), round(image.height * scale)), Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", out_size, (0, 0, 0, 0))
    x = (out_size[0] - resized.width) // 2
    y = out_size[1] - resized.height - 12
    canvas.alpha_composite(resized, (x, y))
    return canvas


def keep_largest_component(image: Image.Image) -> Image.Image:
    width, height = image.size
    pixels = image.load()
    seen = set()
    components = []

    for start_y in range(height):
        for start_x in range(width):
            if (start_x, start_y) in seen or pixels[start_x, start_y][3] == 0:
                continue
            queue = deque([(start_x, start_y)])
            seen.add((start_x, start_y))
            component = []
            while queue:
                x, y = queue.popleft()
                component.append((x, y))
                for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
                    if nx < 0 or ny < 0 or nx >= width or ny >= height or (nx, ny) in seen:
                        continue
                    seen.add((nx, ny))
                    if pixels[nx, ny][3] > 0:
                        queue.append((nx, ny))
            components.append(component)

    if not components:
        return image

    largest = set(max(components, key=len))
    for y in range(height):
        for x in range(width):
            if pixels[x, y][3] > 0 and (x, y) not in largest:
                r, g, b, _ = pixels[x, y]
                pixels[x, y] = (r, g, b, 0)
    return image


def main() -> None:
    sheet = Image.open(SOURCE).convert("RGBA")
    quadrant_w = sheet.width // 2
    quadrant_h = sheet.height // 2

    for output, (qx, qy) in OUTPUTS:
        crop = sheet.crop((qx * quadrant_w, qy * quadrant_h, (qx + 1) * quadrant_w, (qy + 1) * quadrant_h))
        transparent = keep_largest_component(remove_chroma_background(crop))
        final = fit_to_canvas(transparent)
        final.save(output)

    print(f"extracted {len(OUTPUTS)} generated creatures")


if __name__ == "__main__":
    main()

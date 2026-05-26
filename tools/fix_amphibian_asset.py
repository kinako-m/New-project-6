from pathlib import Path

from PIL import Image


def main() -> None:
    path = Path("assets/creature-amphibian.png")
    image = Image.open(path).convert("RGBA")
    width, height = image.size
    pixels = image.load()

    for y in range(height):
        for x in range(248, width):
            r, g, b, _ = pixels[x, y]
            pixels[x, y] = (r, g, b, 0)

    cropped = image.crop((28, 0, 248, height))
    canvas = Image.new("RGBA", (310, 323), (0, 0, 0, 0))
    canvas.alpha_composite(cropped, ((canvas.width - cropped.width) // 2, 0))
    canvas.save(path)
    print(f"fixed {path}")


if __name__ == "__main__":
    main()

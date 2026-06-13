from pathlib import Path

from PIL import Image, ImageDraw, ImageOps


SOURCE = Path("sample_q/converted")
OUTPUT = SOURCE / "contact-sheets"
THUMBNAIL = (300, 400)
COLUMNS = 4
ROWS = 4


def main() -> None:
    OUTPUT.mkdir(exist_ok=True)
    paths = sorted(SOURCE.glob("IMG_*.jpg"))
    page_size = COLUMNS * ROWS
    for sheet_index in range(0, len(paths), page_size):
        group = paths[sheet_index : sheet_index + page_size]
        sheet = Image.new("RGB", (COLUMNS * THUMBNAIL[0], ROWS * (THUMBNAIL[1] + 28)), "white")
        draw = ImageDraw.Draw(sheet)
        for index, path in enumerate(group):
            image = ImageOps.exif_transpose(Image.open(path)).convert("RGB")
            image.thumbnail(THUMBNAIL, Image.Resampling.LANCZOS)
            x = (index % COLUMNS) * THUMBNAIL[0]
            y = (index // COLUMNS) * (THUMBNAIL[1] + 28)
            sheet.paste(image, (x, y))
            draw.text((x + 4, y + THUMBNAIL[1] + 4), path.stem, fill="black")
        output = OUTPUT / f"sheet-{sheet_index // page_size + 1:02d}.jpg"
        sheet.save(output, quality=90)
        print(output)


if __name__ == "__main__":
    main()

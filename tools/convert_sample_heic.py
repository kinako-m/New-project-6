from pathlib import Path

import pillow_heif
from PIL import Image, ImageOps


SOURCE = Path("sample_q")
OUTPUT = SOURCE / "converted"


def convert(path: Path) -> None:
    heif_file = pillow_heif.read_heif(path)
    image = Image.frombytes(heif_file.mode, heif_file.size, heif_file.data, "raw")
    image = ImageOps.exif_transpose(image)
    image.thumbnail((2200, 2200), Image.Resampling.LANCZOS)
    image.convert("RGB").save(OUTPUT / f"{path.stem}.jpg", quality=92, optimize=True)


def main() -> None:
    OUTPUT.mkdir(exist_ok=True)
    paths = sorted(SOURCE.glob("*.HEIC"))
    for index, path in enumerate(paths, start=1):
        convert(path)
        print(f"{index}/{len(paths)} {path.name}")


if __name__ == "__main__":
    main()

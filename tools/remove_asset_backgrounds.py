from collections import deque
from statistics import median
from math import sqrt
from pathlib import Path
import shutil

from PIL import Image


def restore_original(path: Path) -> None:
    if path.parent.name == "branches":
        backup = Path("assets/original-backgrounds") / f"branches-{path.name}"
    elif path.parent.name == "finals":
        backup = Path("assets/original-backgrounds") / f"finals-{path.name}"
    else:
        backup = Path("assets/original-backgrounds") / f"assets-{path.name}"
    if backup.exists():
        shutil.copyfile(backup, path)


def keep_largest_opaque_component(image: Image.Image) -> Image.Image:
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


def remove_edge_background(path: Path, tolerance: float = 52) -> None:
    restore_original(path)
    image = Image.open(path).convert("RGBA")
    width, height = image.size
    pixels = image.load()
    edge_pixels = []
    for x in range(width):
        edge_pixels.extend((pixels[x, 0], pixels[x, height - 1]))
    for y in range(height):
        edge_pixels.extend((pixels[0, y], pixels[width - 1, y]))
    opaque_edge_pixels = [color for color in edge_pixels if color[3] > 0]
    if not opaque_edge_pixels:
        image.save(path)
        return
    background = tuple(round(median(color[index] for color in opaque_edge_pixels)) for index in range(3))
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
        distance = sqrt((r - background[0]) ** 2 + (g - background[1]) ** 2 + (b - background[2]) ** 2)
        if not a:
            queue.extend(((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)))
        elif distance <= tolerance:
            pixels[x, y] = (r, g, b, 0)
            queue.extend(((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)))

    keep_largest_opaque_component(image).save(path)


def main() -> None:
    paths = [
        *Path("assets").glob("creature-*.png"),
        *Path("assets/branches").glob("*.png"),
        *Path("assets/finals").glob("*.png"),
    ]
    for path in paths:
        remove_edge_background(path)
    print(f"transparent processed {len(paths)} files")


if __name__ == "__main__":
    main()

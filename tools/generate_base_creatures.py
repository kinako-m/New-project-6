from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter


SIZE = 512
OUT_SIZE = (310, 323)


def canvas():
    return Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))


def save(image: Image.Image, path: str) -> None:
    image = image.resize(OUT_SIZE, Image.Resampling.LANCZOS)
    image.save(path)


def ellipse(draw, box, fill, outline=None, width=1):
    draw.ellipse(box, fill=fill, outline=outline, width=width)


def shine(draw, box, alpha=90):
    draw.ellipse(box, fill=(255, 255, 255, alpha))


def eye(draw, cx, cy, r=32):
    ellipse(draw, (cx - r, cy - r, cx + r, cy + r), (255, 255, 248, 255), (31, 50, 37, 255), 5)
    ellipse(draw, (cx - r // 2, cy - r // 2, cx + r // 2, cy + r // 2), (22, 35, 26, 255))
    shine(draw, (cx - r // 4, cy - r // 3, cx + 2, cy - 2), 210)


def mouth(draw, box, fill=(92, 40, 35, 255)):
    draw.arc(box, 8, 172, fill=(38, 60, 40, 255), width=7)
    draw.arc((box[0] + 8, box[1] + 12, box[2] - 8, box[3] + 20), 16, 164, fill=fill, width=8)


def soft_shadow(image):
    shadow = Image.new("RGBA", image.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(shadow)
    d.ellipse((118, 420, 394, 456), fill=(25, 45, 35, 42))
    shadow = shadow.filter(ImageFilter.GaussianBlur(10))
    shadow.alpha_composite(image)
    return shadow


def fish():
    im = canvas()
    d = ImageDraw.Draw(im)
    d.polygon([(125, 250), (62, 198), (70, 302)], fill=(47, 151, 202, 255), outline=(24, 78, 111, 255))
    d.polygon([(340, 246), (438, 176), (422, 250), (438, 326)], fill=(35, 128, 190, 255), outline=(21, 75, 115, 255))
    ellipse(d, (105, 132, 377, 358), (65, 180, 219, 255), (19, 91, 126, 255), 6)
    ellipse(d, (152, 180, 332, 334), (111, 216, 229, 255))
    d.polygon([(222, 148), (292, 72), (312, 154)], fill=(43, 149, 202, 255), outline=(21, 75, 115, 255))
    d.polygon([(222, 350), (300, 416), (310, 340)], fill=(43, 149, 202, 255), outline=(21, 75, 115, 255))
    eye(d, 244, 190, 30)
    eye(d, 312, 196, 26)
    mouth(d, (276, 222, 354, 282))
    for x, y, r in [(150, 210, 12), (180, 176, 10), (188, 260, 9), (215, 224, 8)]:
        ellipse(d, (x - r, y - r, x + r, y + r), (20, 109, 156, 190))
    shine(d, (170, 148, 282, 210), 72)
    return soft_shadow(im)


def amphibian():
    im = canvas()
    d = ImageDraw.Draw(im)
    ellipse(d, (132, 132, 382, 356), (96, 191, 63, 255), (37, 94, 42, 255), 6)
    ellipse(d, (183, 218, 342, 374), (245, 214, 111, 255), (169, 136, 61, 255), 4)
    ellipse(d, (110, 264, 208, 394), (76, 169, 61, 255), (37, 94, 42, 255), 5)
    ellipse(d, (304, 262, 402, 392), (76, 169, 61, 255), (37, 94, 42, 255), 5)
    for x, y in [(132, 394), (162, 402), (194, 392), (318, 392), (352, 404), (382, 394)]:
        ellipse(d, (x - 14, y - 8, x + 14, y + 10), (89, 184, 55, 255), (37, 94, 42, 255), 3)
    eye(d, 214, 178, 36)
    eye(d, 300, 178, 36)
    mouth(d, (222, 222, 340, 294))
    for x, y, r in [(150, 218, 14), (174, 258, 10), (346, 244, 9), (278, 126, 8), (244, 130, 7)]:
        ellipse(d, (x - r, y - r, x + r, y + r), (30, 126, 49, 190))
    shine(d, (190, 130, 314, 180), 80)
    return soft_shadow(im)


def reptile():
    im = canvas()
    d = ImageDraw.Draw(im)
    d.polygon([(154, 172), (218, 92), (246, 164)], fill=(80, 169, 74, 255), outline=(38, 91, 44, 255))
    ellipse(d, (126, 150, 386, 360), (83, 171, 72, 255), (39, 92, 44, 255), 6)
    d.polygon([(116, 250), (56, 214), (88, 286)], fill=(74, 151, 68, 255), outline=(39, 92, 44, 255))
    d.polygon([(356, 250), (470, 194), (412, 282)], fill=(74, 151, 68, 255), outline=(39, 92, 44, 255))
    ellipse(d, (182, 230, 328, 358), (226, 193, 96, 255), (144, 115, 52, 255), 4)
    for x in range(174, 342, 34):
        d.polygon([(x, 154), (x + 18, 116), (x + 34, 154)], fill=(38, 118, 58, 255))
    eye(d, 222, 188, 30)
    eye(d, 300, 188, 28)
    mouth(d, (246, 222, 352, 286))
    for x, y, r in [(170, 234, 9), (190, 200, 8), (338, 236, 8), (276, 148, 7)]:
        ellipse(d, (x - r, y - r, x + r, y + r), (24, 103, 43, 185))
    for x, y in [(164, 362), (206, 366), (314, 364), (356, 360)]:
        ellipse(d, (x - 18, y - 8, x + 18, y + 10), (75, 154, 66, 255), (39, 92, 44, 255), 3)
    shine(d, (188, 154, 302, 198), 75)
    return soft_shadow(im)


def mammal():
    im = canvas()
    d = ImageDraw.Draw(im)
    ellipse(d, (128, 152, 382, 372), (197, 139, 86, 255), (105, 70, 44, 255), 6)
    ellipse(d, (104, 110, 190, 208), (197, 139, 86, 255), (105, 70, 44, 255), 5)
    ellipse(d, (320, 108, 406, 206), (197, 139, 86, 255), (105, 70, 44, 255), 5)
    ellipse(d, (126, 128, 386, 334), (220, 162, 99, 255), (105, 70, 44, 255), 6)
    ellipse(d, (194, 224, 324, 352), (248, 217, 151, 255), (153, 105, 60, 255), 4)
    d.polygon([(128, 260), (58, 300), (124, 320)], fill=(172, 113, 70, 255), outline=(105, 70, 44, 255))
    eye(d, 220, 190, 30)
    eye(d, 304, 190, 30)
    ellipse(d, (250, 220, 276, 240), (78, 48, 38, 255))
    mouth(d, (220, 220, 306, 294), (111, 57, 47, 255))
    for x, y in [(178, 370), (222, 374), (312, 372), (356, 368)]:
        ellipse(d, (x - 16, y - 8, x + 16, y + 10), (177, 116, 70, 255), (105, 70, 44, 255), 3)
    shine(d, (180, 142, 304, 188), 72)
    return soft_shadow(im)


def main():
    output = {
        "assets/creature-fish.png": fish(),
        "assets/creature-amphibian.png": amphibian(),
        "assets/creature-reptile.png": reptile(),
        "assets/creature-mammal.png": mammal(),
    }
    for path, image in output.items():
        save(image, path)
    print(f"generated {len(output)} base creature images")


if __name__ == "__main__":
    main()

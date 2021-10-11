#%%

from PIL import Image

HORZ_MARGIN = 54
VERT_MARGIN = 33
HORZ_OFFSET = 13.6
VERT_OFFSET = 25
CARD_WIDTH = 129
CARD_LENGTH = 200

im = Image.open("Uno Deck.png")

# images are 129px x 200px including a 14-25px border on all four sides.  Beginning coordinates
# are 54, 33

colors = ("red", "blue", "green", "yellow")
numbers = ("0", "1", "2", "3", "4", "5", "6", "7", "8", "9",)

top = VERT_MARGIN
for i, color in enumerate(colors):
    right = HORZ_MARGIN
    for j, number in enumerate(numbers):
        print("Processing " + number + " of " + color)

        box = (right, top, right + CARD_WIDTH, top + CARD_LENGTH)
        c_image = im.crop(box)
        c_image.save("images/" + color + "_" + number + ".png")
        right += CARD_WIDTH + HORZ_OFFSET
    top += CARD_LENGTH + VERT_OFFSET

# print("images/green_2.png")
# Simple pygame program

# Import and initialize the pygame library
import pygame
import random

pygame.init()

clock = pygame.time.Clock()

# Set up the drawing window
w, h = size = 200, 100
screen = pygame.display.set_mode(size)

DOTS = 10
positions = [(random.randint(0, w), random.randint(0, h),
             random.randint(-3, 3), random.randint(-3, 3)) for i in range(DOTS)]

# Run until the user asks to quit
running = True
while running:

    # Did the user click the window close button?
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        if event.type == pygame.MOUSEBUTTONDOWN:
            for i, (oldx, oldy, hs, vs) in enumerate(positions):
                positions[i] = (event.pos[0], event.pos[1], hs, vs)

    # Fill the background with white
    screen.fill((255, 255, 255))

    # Draw a solid blue circle in the center
    for (x, y, hs, vs), dot in zip(positions, range(DOTS)):
        if (x+hs)>w or (x+hs) < 0:
            hs = -hs
        else:
            hs += random.randint(-1, 1)
        hs = max([-10, min([hs, 10])])
        vs = max([-10, min([vs, 10])])
        if y+vs > h or y+vs < 0:
            vs = -vs
        else:
            vs += random.randint(-1, 1)
        x += hs
        y += vs
        color = [random.randint(0, 255) for c in range(3)]
        pygame.draw.circle(screen, color, (x, y), 5)
        positions[dot] = (x, y, hs, vs)

    # Flip the display
    pygame.display.flip()
    clock.tick(30)
    # running = False

# Done! Time to quit.
pygame.quit()
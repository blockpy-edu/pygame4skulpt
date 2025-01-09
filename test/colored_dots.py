# Simple pygame program

# Import and initialize the pygame library
import pygame
import random

pygame.init()

clock = pygame.time.Clock()

# Set up the drawing window
w, h = size = 200, 100
screen = pygame.display.set_mode(size)

# Run until the user asks to quit
running = True
while running:

    # Did the user click the window close button?
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    # Fill the background with white
    screen.fill((255, 255, 255))

    # Draw a solid blue circle in the center
    for i in range(50):
        x, y = random.randint(0, w), random.randint(0, h)
        color = [random.randint(0, 255) for c in range(3)]
        pygame.draw.circle(screen, color, (x, y), 5)

    # Flip the display
    pygame.display.flip()
    clock.tick(30)
    # running = False

# Done! Time to quit.
pygame.quit()
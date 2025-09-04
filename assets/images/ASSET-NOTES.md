# Asset Notes

This document provides guidance on replacing the placeholder images in the `assets/images/placeholders` directory.

## Replacing Placeholders

To replace a placeholder, simply overwrite the file with the new image. For example, to replace the main "about" image, replace `assets/images/placeholders/about-main.svg` with your new image file.

## Cumulative Layout Shift (CLS)

To avoid Cumulative Layout Shift (CLS), it is important to maintain the same dimensions as the placeholder images. The dimensions for each image are specified in the `assets/images/manifest.json` file.

If you need to use a different aspect ratio for an image, you will also need to update the corresponding CSS to avoid layout shifts.

## manifest.json recommendation

Current manifest already points to:
- icons/icon-192.png
- icons/icon-512.png

After uploading this package those paths will resolve. For maskable support, replace the second/third icon entry with:

{ "src": "icons/icon-512-maskable.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }

Keep the existing `any` icon entry as well.

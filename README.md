# Shawan Personal Identity v7

Compact visual gallery upgrade based on the working v6 version.

Upload photos:
- assets/profile.jpg
- assets/awards/award-01.jpg, award-02.jpg, ...
- assets/moments/moment-01.jpg, moment-02.jpg, ...
- assets/places/place-01.jpg, place-02.jpg, ...
- assets/builds/project-01.jpg, project-02.jpg, ...

Optional title example in data.js:
```js
achievementInfo: {
  "award-01.jpg": { title: "National Robotics Competition", meta: "2023 · 1st Place" }
}
```

Gallery: first 9 images, View all, fullscreen viewer, Previous/Next, ESC, keyboard arrows, mobile swipe, lazy loading, responsive layout.


## Custom logo
Put your preferred logo here:
`assets/logo.png`

The header will use it automatically. A transparent PNG is recommended.
You can also change the path in `data.js`:
`logo: "assets/logo.png"`

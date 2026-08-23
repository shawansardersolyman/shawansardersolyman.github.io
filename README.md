# Shawan Personal Identity v6 - Fixed

This version fixes the main loading problem: the old index.html contained a duplicate SITE object, which caused JavaScript to stop with a `SITE has already been declared` error.

## Photos
Profile: `assets/profile.jpg`

Auto galleries:
- `assets/awards/award-01.jpg`, `award-02.jpg`...
- `assets/moments/moment-01.jpg`, `moment-02.jpg`...
- `assets/places/place-01.jpg`, `place-02.jpg`...
- `assets/builds/project-01.jpg`, `project-02.jpg`...

## Social links
Edit only `data.js`. Example:
`{ name: "Facebook", icon: "facebook", url: "https://facebook.com/yourname" }`

The website will show only links that have a URL. URLs without `https://` are automatically normalized.

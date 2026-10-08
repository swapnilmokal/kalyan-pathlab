# GitHub Update — Kalyan Pathlab

Repository: `swapnilmokal/kalyan-pathlab`

## 1) सर्वात आधी हे files/folder upload करा

`icons/` folder पूर्ण upload करा:
- `logo.png`
- `icon-192.png`
- `icon-512.png`
- `icon-512-maskable.png`
- `admin-logo.png`
- `admin-icon-192.png`
- `qr.png`

यामुळे सध्याच्या `index.html`, `manifest.json` आणि `admin.html` मधील image references काम करू लागतील.

## 2) Professional CSS

`index.html` मध्ये `style.css` नंतर हे जोडा:

```html
<link rel="stylesheet" href="./professional-overrides.css">
```

`admin.html` मध्येही हवे असल्यास admin-style.css नंतर हाच link जोडा.

## 3) UX JavaScript

`index.html` मध्ये `</body>` च्या आधी:

```html
<script src="./ui-enhancements.js"></script>
```

## 4) काय सुधारले?

- Broken logo/PWA icons fix
- UPI QR asset जोडला
- Better touch targets
- Quick-action cards अधिक professional
- Hover/press feedback
- Share button साठी Web Share API + copy fallback
- Broken images साठी graceful fallback
- Mobile spacing आणि card polish

## 5) पुढील professional improvements (recommended)

### Priority 1
- Booking confirmation साठी WhatsApp + SMS fallback
- Booking ID copy button
- "माझी बुकिंग स्थिती" मध्ये स्पष्ट status timeline
- Test search मध्ये category + price + preparation माहिती
- "आज उपलब्ध home collection slots" दाखवणे

### Priority 2
- Patient ला report PDF download/share
- Google Maps directions button
- Repeat booking: मागील टेस्ट 1-click ने पुन्हा book
- Marathi default language आणि language preference persist
- Accessibility: keyboard focus, contrast, larger text option

### Priority 3
- Admin dashboard मध्ये CSV export
- Booking analytics
- Review moderation
- Audit log
- PWA offline shell + install prompt
- Privacy/consent page आणि data-retention policy

## विशेष निरीक्षण
`index.html` मध्ये `./icons/logo.png`, `./icons/icon-512.png`, `./icons/icon-192.png`, `./icons/qr.png` यांचे references आहेत; पण repository root listing मध्ये `icons/` folder दिसत नाही. हाच सध्याच्या broken icon display चा मुख्य कारण आहे.

`admin.html` देखील `./icons/admin-icon-192.png` आणि `./icons/admin-logo.png` वापरतो, त्यामुळे admin side साठीही ते assets आवश्यक आहेत.

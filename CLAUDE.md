# CLAUDE.md — Motivational Quote Web Page

## What This Project Is

A single-page web application that displays a random motivational quote on page load. No backend, no database, no external APIs. Just vanilla HTML, CSS, and JavaScript with hardcoded quote data.

When the user refreshes the browser, they see a new random quote.

---

## How to Build It

**1. Create the main HTML file:**

```bash
touch index.html
```

**2. The file contains:**
- A quote array (minimum 20 motivational quotes with authors)
- HTML structure with a centered layout
- CSS for styling (responsive, calming design)
- JavaScript to randomly select and display a quote on page load

**3. Test it:**

Open `index.html` in your browser. Refresh the page to see different quotes.

---

## Requirements

- **Stack:** HTML5, CSS3, vanilla JavaScript
- **Quote data:** Hardcoded in the page (no API calls, no external data sources)
- **Responsive:** Works on desktop, tablet, and mobile (320px+)
- **Browser support:** Modern browsers (Chrome, Firefox, Safari, Edge)
- **Performance:** Instant load (no network requests)

---

## Build Checklist

- [ ] Quote array with at least 20 motivational quotes
- [ ] Each quote has text and author attribution
- [ ] Quote selection uses `Math.random()` and loads on page render
- [ ] Typography is large, readable, centered (quote: 24–32px, author: 16–18px)
- [ ] Color scheme is calming and motivational
- [ ] Layout is responsive (flexbox or grid)
- [ ] Tested on mobile, tablet, and desktop
- [ ] No console errors

---

## How to Talk to This User

- This is a straightforward project. Build it directly without asking for clarifications.
- When done, tell them the file path and what they'll see.
- If something seems off, fix it yourself before showing them.

---

## File Structure

```
index.html          # Single file containing HTML, CSS, and JavaScript
```

(Optional: split into separate CSS and JS files for larger projects, but not required here.)

---

## Deployment (Optional)

Save `index.html` locally and open in a browser, or host on:
- GitHub Pages
- Netlify
- Vercel
- Any static site host

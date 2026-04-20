# SHIELD DATA — Website

Cyberpunk-styled corporate website for Shield Data IT firm.

## File Structure

```
shield-data/
├── index.html      ← Main page (upload this to host)
├── styles.css      ← All styles
├── script.js       ← All JavaScript & canvas animations
└── README.md       ← This file
```

## Features

- Live threat ticker (top bar)
- Animated radar canvas (hero)
- Global threat map canvas
- Particle network background
- Matrix rain on hero hover
- Glitch text animations
- 3D card tilt effect
- Terminal typewriter (about section)
- Tech stack orbit animation
- Scroll-reveal animations
- Custom cursor
- Responsive / mobile nav
- Contact form with success state

## Hosting on Netlify (Recommended — Free)

1. Go to **netlify.com** and sign up
2. Drag and drop the **entire `shield-data` folder** onto the deploy area
3. It goes live immediately on a Netlify subdomain
4. Go to **Site settings → Domain management → Add custom domain**
5. Enter your domain name
6. Netlify gives you nameservers — update them at your domain registrar
7. HTTPS is automatic (Let's Encrypt)

## Hosting on Cloudflare Pages (Free)

1. Push this folder to a GitHub repository
2. Go to **pages.cloudflare.com** → Create a project
3. Connect your GitHub repo
4. Build settings: no framework, output directory = `/` (root)
5. Add your domain in **Custom Domains** tab

## VPS / Self-Hosted (Nginx)

```bash
# Install Nginx
sudo apt update && sudo apt install nginx -y

# Copy files
sudo cp -r shield-data/* /var/www/html/

# Point your domain's A record → server IP
# HTTPS via Certbot
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com
```

## Customisation

### Change contact details
Edit `index.html` and search for:
- `hello@shielddata.io` → your email
- `+44 (0)20 7946 0800` → your phone
- `10 Finsbury Square, London EC2A` → your address

### Hook up the contact form
The form currently shows a success message on submit.
To send real emails, integrate [EmailJS](https://emailjs.com) (free tier available):

```js
// In script.js, replace submitForm() with:
window.submitForm = function() {
  emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', '#contactForm')
    .then(() => {
      document.getElementById('formInner').style.display = 'none';
      document.getElementById('formSuccess').classList.add('show');
    });
};
```

### Change colours
All colours are CSS variables at the top of `styles.css`:
```css
--cyan: #00f5ff;      /* Primary accent */
--magenta: #ff1f6e;   /* Alert / danger */
--gold: #f5c842;      /* AI / warm accent */
--green: #00ff88;     /* Success / online */
```

### Add real case studies
Find the `.cases-grid` section in `index.html` and duplicate/edit the `.case-card` blocks.

## Browser Support

Works in all modern browsers (Chrome, Firefox, Safari, Edge).
Custom cursor is disabled on mobile/touch devices automatically.

---

Built with vanilla HTML, CSS, and JavaScript. No frameworks, no build step, no dependencies.

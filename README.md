# Dijodijo: demo site (CD Exposure)

One-page mock homepage for **Dijodijo**, a home food business in Madibogo (near Mafikeng, North West), prepared by [CD Exposure](https://cdxposure.co.za) as a Kickstart package preview.

- Plain static HTML/CSS with a little vanilla JS. No front-end build step.
- `index.html` at the root, assets in `assets/` (relative paths) and `.nojekyll` included, so it runs on GitHub Pages as-is.
- Sections: hero, menu (plate R70, machocho and chips R20), gallery, how to order (WhatsApp), and location.
- The WhatsApp button opens [wa.me/27768695051](https://wa.me/27768695051?text=Hi%20Dijodijo%2C%20I%27d%20like%20to%20order) with the message *Hi Dijodijo, I'd like to order*.
- Animations are vanilla CSS/JS (hero entrance, scroll reveal, lightbox). They respect `prefers-reduced-motion`, and the page stays usable without JavaScript.
- `robots: noindex` is set while this is a demo. Remove it when the site goes live.
- Original customer photos are in `Photos/` (untouched). Optimised web copies used by the site are in `assets/img/`.

## Open it on your computer

Open `Dijodijo.sln` in Visual Studio and press F5. It will start a local server at [http://localhost:5080](http://localhost:5080) and open the site in your browser.

Or, from this folder, with the .NET 8 SDK:

```bash
dotnet run
```

The app serves the static files from this folder (the project root), not from a `wwwroot` folder, so the same files can go straight to GitHub Pages.

You can also open `index.html` directly in a browser.

## Placeholders to confirm before launch

- **Trading hours** — shown as “To be confirmed. Please ask when you order.” Add the real hours once Dijodijo confirms them.
- **Open Graph URL** — `og:url` and `og:image` currently assume a GitHub Pages address of `https://conrad911.github.io/Dijodijo/`. Update both to the live URL when the site is published.
- Menu items and prices are only what was confirmed: a plate at R70, and machocho and chips at R20. Do not add other items until they are confirmed.

## Deploy

Push the contents of this folder to a repo, then go to Settings → Pages → Deploy from branch → `main` / root. You do not need to publish the .NET project for GitHub Pages; it is only there so the site can be opened with F5 in Visual Studio.

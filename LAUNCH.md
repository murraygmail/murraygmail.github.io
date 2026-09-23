# LAUNCH — moving murraycantor.com from GoDaddy WordPress to GitHub Pages

Written for you to follow yourself. Nothing in this file has been done for you: no DNS
record has been touched, no repository created, no domain changed.

The order below is chosen so the live site never goes dark. The new site is built,
published and verified on its free `github.io` address **first**. The domain is moved
**last**, in one step, and can be moved back in one step.

Budget about an hour of your attention, plus a wait of up to a day for DNS.

---

## Before you start

You need:

- A GitHub account. Note your username; it appears in the DNS steps below as
  `USERNAME`.
- Your GoDaddy login for the domain `murraycantor.com`.
- This folder, expanded.

---

## Step 1 — Record what GoDaddy has now, so you can put it back

1. Sign in at godaddy.com, open **My Products**, find `murraycantor.com`, click **DNS**.
2. You are looking at the DNS records table. **Screenshot the whole table**, scrolling if
   it does not fit, and save the images somewhere you will find them again.
3. Write down separately, by hand, every `A` record and every `CNAME` record: the Type,
   the Name, the Value and the TTL. These are what you will restore if you back out.
4. If there is an option to **Export** or **Download** the zone file, use it too.

Do not change anything yet.

**This step is the back-out plan. Do not skip it.**

---

## Step 2 — Lower the TTL, a day ahead if you can

1. Still in the GoDaddy DNS table, edit each `A` record and the `www` `CNAME` record and
   set **TTL** to **600 seconds** (10 minutes), or the shortest GoDaddy offers.
2. Change nothing else. Save.
3. Wait at least as long as the *old* TTL before doing Step 6 — usually an hour, often a
   day.

This is what makes the eventual switch fast and the back-out fast. If you are impatient,
skip it; the cutover then simply takes longer to take effect.

---

## Step 3 — Create the repository and put the files in it

1. Go to github.com and click **New repository**.
2. Name it `murraycantor.github.io`, replacing `murraycantor` with your actual GitHub
   username — the name must be exactly `USERNAME.github.io`. Set it to **Public**. Do
   not add a README, a .gitignore or a licence.
3. Click **Create repository**.
4. On the empty repository page, click **uploading an existing file**.
5. Open this folder on your computer. Select these twelve files and no others:
   `index.html`, `book.html`, `riskyproject.html`, `writing.html`, `about.html`,
   `evolution-of-project-management.html`, `beyond-the-iron-triangle.html`,
   `quantitative-risk-management.html`, `404.html`, `site.css`, `sitemap.xml`,
   `robots.txt`. Drag them onto the upload area.

   **Then drag the `images/` folder in as well**, as a folder, so that it lands in the
   repository as `images/`. GitHub's drag-and-drop uploader accepts folders and keeps
   their name. Do not skip it: your photograph is in there, and this is how it reaches
   the site. The pages look for it at `images/murray-cantor.jpg`; if that path is wrong
   the picture will not appear.

   Leave `review-locally.command`, `NOTES.md` and `LAUNCH.md` behind. The repository is
   public, and `NOTES.md` lists everything on the site that is not yet confirmed. Keep
   those on your own computer.

   `images/README.txt` will ride along when you drag the `images/` folder, and the
   repository is public. After the upload, open `images/README.txt` in GitHub, click the
   trash icon, and commit the deletion. It is a note to yourself, and the site does not
   use it.
6. Type a message like `Initial site` and click **Commit changes**.

The twelve files must sit at the **top level** of the repository, with `images/` as the only
folder beside them. If you see a folder named `murraycantor-v` followed by a number in
the repository afterwards, you dragged the whole site folder instead of its contents:
delete that folder in GitHub and drag again.

---

## Step 4 — Turn on GitHub Pages and verify on the github.io address

1. In the repository, click **Settings**, then **Pages** in the left sidebar.
2. Under **Build and deployment**, set **Source** to **Deploy from a branch**, **Branch**
   to `main` and folder to `/ (root)`. Click **Save**.
3. Wait two or three minutes. Refresh the Pages settings page until it shows a green
   banner with your site's address: `https://USERNAME.github.io/`.
4. Open that address.

**Verify all of this before going further.** The domain is still pointing at GoDaddy, so
nothing is at risk yet.

- [ ] The home page loads and is styled — serif headings, warm off-white background. If
      it is unstyled black-on-white, `site.css` did not upload; go back to Step 3.
- [ ] Every navigation item works: Home, The book, RiskyProject, Writing, About.
- [ ] The footer links work on every page.
- [ ] `https://USERNAME.github.io/404.html` loads, and so does a made-up address like
      `https://USERNAME.github.io/nonsense` — the second one should show the same
      "Page not found" page.
- [ ] `https://USERNAME.github.io/sitemap.xml` loads and shows eight page addresses, and
      `https://USERNAME.github.io/robots.txt` loads. They will name `murraycantor.com`
      rather than the github.io address; that is correct, because they describe where the
      site is going to live.
- [ ] Your photograph appears twice: small, beside your name on the home page, and
      larger beside the opening paragraphs of the About page. It should be sharp, not
      blurry or stretched. If you see a blank space or a broken-image icon instead, the
      `images/` folder did not upload, or it did not keep its name — see
      `images/README.txt` in this folder on your computer.
- [ ] The pages look right on your phone as well as your laptop.
- [ ] No placeholder text remains on any page: nothing in square brackets, nothing that
      reads as a note to yourself rather than to a reader.

Take your time here. Everything after this point is harder to undo.

---

## Step 5 — Tell GitHub the domain, before you tell the domain about GitHub

1. Still in **Settings → Pages**, find **Custom domain**.
2. Type `murraycantor.com` — the bare domain, no `www`, no `https://`. Click **Save**.
3. GitHub adds a file named `CNAME` to the top level of your repository, containing the
   single line `murraycantor.com`. You do not need to create that file yourself; letting
   GitHub create it here is the whole point of doing it at this step. Leave it alone
   afterwards, and if you ever re-upload the site by drag and drop, do not delete it.
4. GitHub will show a **DNS check** warning saying the domain does not point at GitHub
   yet. That is expected and correct: it does not, yet. The `github.io` address keeps
   working throughout.
5. Leave **Enforce HTTPS** switched **off** for now. It is greyed out at this stage
   anyway.

Your live site is still the GoDaddy WordPress site. Nothing has broken.

---

## Step 6 — Move the DNS at GoDaddy

This is the cutover. It takes about five minutes to do and up to a day to be visible
everywhere.

The addresses below are GitHub's published values for apex domains, taken from GitHub's
own documentation:

> https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site

Check that page yourself before you type them in. GitHub has changed these before and
this document will not update itself.

**Four `A` records — Name `@`, TTL 600:**

| Type | Name | Value |
|---|---|---|
| A | @ | `185.199.108.153` |
| A | @ | `185.199.109.153` |
| A | @ | `185.199.110.153` |
| A | @ | `185.199.111.153` |

**Four `AAAA` records — Name `@`, TTL 600:**

| Type | Name | Value |
|---|---|---|
| AAAA | @ | `2606:50c0:8000::153` |
| AAAA | @ | `2606:50c0:8001::153` |
| AAAA | @ | `2606:50c0:8002::153` |
| AAAA | @ | `2606:50c0:8003::153` |

**One `CNAME` record for `www`:**

| Type | Name | Value |
|---|---|---|
| CNAME | www | `USERNAME.github.io.` |

Replace `USERNAME` with your GitHub username. The value is your GitHub Pages address, not
your own domain. Include the trailing dot if GoDaddy accepts one; it is harmless if it
strips it.

Now do it:

1. GoDaddy → **My Products** → `murraycantor.com` → **DNS**.
2. **Delete every existing `A` record with Name `@`.** These are what currently point the
   bare domain at GoDaddy's WordPress hosting. You wrote them down in Step 1.
3. Add the four `A` records from the table above, one at a time.
4. Add the four `AAAA` records from the table above, one at a time. If GoDaddy's form
   does not offer AAAA, look for "Add More Records" or an advanced view; if you truly
   cannot add them, the site still works over IPv4, so carry on.
5. Find the existing `www` record. If it is a `CNAME`, edit its value to
   `USERNAME.github.io.`. If it is an `A` record, delete it and add a `CNAME` instead.
6. **Leave every `MX` record exactly as it is.** Those are your email. Nothing in this
   move touches email, and deleting an MX record is how people lose their mail.
7. Leave `TXT` records alone, including any domain-verification records.
8. Save.

---

## Step 7 — Wait, then verify

1. Wait twenty minutes. Then check propagation at `https://dnschecker.org`, entering
   `murraycantor.com` and choosing record type `A`. You want to see the four
   `185.199.*.153` addresses appearing around the world. Give it up to 24 hours to be
   consistent everywhere.
2. Go back to **Settings → Pages** in the repository. The DNS check warning should have
   turned into a green tick reading "DNS check successful".
3. In a browser where you have not previously visited the site — a private window is
   enough — open `http://murraycantor.com`. You should see the new site.
4. Check `http://www.murraycantor.com` as well. It should reach the same site.
5. Walk the same checklist as Step 4, now on the real domain.

---

## Step 8 — Enforce HTTPS, but only now

1. GitHub issues a TLS certificate for the domain automatically once DNS points at it.
   This usually takes minutes and can take up to 24 hours.
2. Return to **Settings → Pages**. When the **Enforce HTTPS** checkbox is no longer
   greyed out, tick it.
3. Confirm `https://murraycantor.com` loads with a padlock, and that
   `http://murraycantor.com` redirects to it.

If you tick **Enforce HTTPS** before the certificate exists, visitors get a security
warning instead of your site. That is the reason this is the last step and not an
earlier one.

4. **One last edit, now that the domain is yours.** `index.html` and `about.html` each
   carry a social-card tag that is still a relative path:

       <meta property="og:image" content="images/murray-cantor.jpg">

   Change it, on both pages, to the full address:

       <meta property="og:image" content="https://murraycantor.com/images/murray-cantor.jpg">

   An HTML comment directly above the tag says the same thing, so you will see it when
   you open the file. This is the only path in the whole site that must be absolute:
   LinkedIn, Slack, X, Facebook and iMessage fetch the card picture from their own
   servers, where a relative path means nothing, so without this your links share with no
   picture. It could not be done before now — before the cutover that address pointed at
   the old WordPress site. Leave `og:image:width` and `og:image:height` alone.

- [ ] Both pages edited, re-uploaded, and a link to `https://murraycantor.com` pasted
      into a LinkedIn message box or an iMessage shows your portrait in the preview.
      (Preview caches are sticky. If it does not show at once, wait and try again.)

---

## Step 9 — Afterwards

1. **Do not cancel the GoDaddy hosting for at least a month.** The domain registration
   and the WordPress hosting are separate products; you need to keep the registration.
   Keeping the hosting a while longer costs a little and buys you the ability to back
   out.
2. Before you do eventually cancel, download anything still on the old site that you
   want: everything under `/wp-content/uploads/`, and any page text you have not yet
   copied across. Once the hosting is gone, so is that. The old portrait is in there, at
   `wp-content/uploads/2026/03/FullSizeRender@2x.png`; the new site does not use it — it
   uses the picture you sent on 3 September — but it is worth keeping a copy anyway.
3. Old addresses like `murraycantor.com/about/` will now show the "Page not found" page.
   That is expected. GitHub Pages cannot redirect. If a particular old address matters,
   ask for a small redirect file to be made for it. Three of the old article addresses
   now have pages here with the same names: `/evolution-of-project-management/`,
   `/faster-better-cheaper/` and `/quantitative-risk-management/` become
   `evolution-of-project-management.html`, `beyond-the-iron-triangle.html` and
   `quantitative-risk-management.html`.

---

## How to back out

If anything is wrong and you want the old site back, this takes about five minutes plus
the TTL wait.

1. GoDaddy → **My Products** → `murraycantor.com` → **DNS**.
2. Delete the four `A` records and four `AAAA` records you added in Step 6.
3. Re-create the original `A` records exactly as you recorded them in Step 1: same
   values, same TTL.
4. Restore the original `www` record from your Step 1 notes.
5. In the GitHub repository, **Settings → Pages**, clear the **Custom domain** field and
   save. This removes the `CNAME` file and stops GitHub answering for the domain.
6. Wait for the TTL you set in Step 2 — ten minutes if you did Step 2, otherwise up to a
   day — and check `murraycantor.com` in a private browser window.

The new site remains available at `https://USERNAME.github.io/` the whole time, so you
lose nothing by backing out and can try again later.

---

## What this document does not cover

It does not cover moving your email, buying or renewing the domain, or anything to do
with the old WordPress database. It also does not cover the redirects for individual old
article URLs, which need a decision about which ones are worth keeping.

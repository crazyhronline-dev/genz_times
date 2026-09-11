# ? GenZ Time — Next-Gen Hardware & Tech Intelligence Publication

> Ultra-fast, SEO-optimized tech publication and hardware review platform built for high-ranking Google E-E-A-T performance. Designed for seamless deployment on PHP 8+ / MySQL shared hosting (cPanel, Hostinger, LiteSpeed, Apache) with resilient JSON fallback.

---

## ?? Key Features

- **? Aerodynamic Chrono-GZ Brand Identity**: Ultra-crisp vector logo with letter-sensitive \GenZ Time\ typography and cyber neon aesthetics.
- **?? Dual Database Architecture**:
  - **MySQL Production Engine**: PDO-based relational database (\database.sql\ included) with prepared statements and foreign key integrity.
  - **Zero-Config Localhost Fallback**: Automatically falls back to \data/posts.json\ if MySQL is offline, ensuring instant localhost testing.
- **?? Real-Time SEO & 1-Click Auto-SEO**:
  - Instant 0–100% SEO Quality Score.
  - 1-Click high-ranking keyword generator targeting high-search-intent terms.
  - Automatic high-CTR meta titles and descriptions.
- **??? Integrated Plagiarism Scanner & Humanizer**:
  - Pre-publication originality analyzer with sentence-level uniqueness scoring.
  - 1-Click \"Remove Plagiarism & Humanize\" assistant to ensure authentic writing.
- **?? Google E-E-A-T Engine**:
  - Real-time scoring across all four Google Quality Rater pillars: **Experience, Expertise, Authoritativeness, and Trustworthiness**.
  - On-page E-E-A-T verification badge on published articles.
- **?? Full-Featured Admin CMS**:
  - Secure login portal at \/admin/login.php\ with password protection.
  - Publish, edit, and delete hardware reviews with image URL, categories, reading time, and tags.
- **?? Complete SEO Suite**:
  - Dynamic XML Sitemap (\/sitemap.php\).
  - Search engine friendly \obots.txt\.
  - JSON-LD Schema.org structured data (\NewsArticle\ and \Organization\).
  - Clean URL routing via \.htaccess\.

---

## ??? Tech Stack

- **Backend**: Native PHP 8.0+ (compatible with any shared hosting provider).
- **Database**: MySQL 5.7+ / MariaDB 10.3+ (or JSON file store).
- **Frontend**: Modern HTML5, CSS3 (Cyber Dark Slate theme), Space Grotesk & JetBrains Mono typography, FontAwesome 6.
- **Optional React Client**: Next.js 14+ / TypeScript / Tailwind CSS included in \src/\.

---

## ?? Quick Setup & Installation

### Localhost (PHP Built-in Server)
1. Clone the repository:
   \\\ash
   git clone https://github.com/sahilkr78780-hash/genz-time.git
   cd genz-time
   \\\
2. Start the PHP development server:
   \\\ash
   php -S 127.0.0.1:8000
   \\\
3. Open [http://127.0.0.1:8000](http://127.0.0.1:8000) in your browser.

---

### Shared Hosting Deployment (cPanel / Hostinger)
1. Upload all files to your \public_html\ directory.
2. Create a MySQL database and user in cPanel / hPanel.
3. Import \database.sql\ via phpMyAdmin **OR** run the web installer at:
   \\\
   https://yourdomain.com/install.php
   \\\
4. Update database credentials in \config/database.php\ (or leave as default if using localhost MySQL).
5. Access the Admin CMS at \/admin/login.php\ using default credentials:
   - **Username**: \dmin\
   - **Password**: \genztime2026\

---

## ?? Project Structure

\\\
genz-time/
+-- admin/                     # Admin CMS Portal
¦   +-- api.php                # Async API (SEO score, plagiarism scanner, E-E-A-T)
¦   +-- delete.php             # Post deletion handler
¦   +-- edit.php               # Post editing interface
¦   +-- index.php              # Admin dashboard
¦   +-- login.php              # Admin authentication
¦   +-- logout.php             # Session termination
¦   +-- publish.php            # Article publishing engine
+-- assets/                    # Static assets
¦   +-- css/style.css          # Cyber Dark Slate styling
¦   +-- img/                   # Brand logo concept visuals
+-- config/                    # Configuration
¦   +-- database.php           # PDO connection with socket probing
¦   +-- site.php               # Global constants & routing
+-- data/
¦   +-- posts.json             # Local fallback database
+-- includes/                  # Core PHP modules
¦   +-- auto-seo-helper.php    # 1-Click SEO keyword & metadata engine
¦   +-- db-helper.php          # Unified MySQL / JSON DAL
¦   +-- eeat-helper.php        # Google E-E-A-T scoring
¦   +-- footer.php             # Site footer
¦   +-- header.php             # Site navigation & masthead
¦   +-- logo.php               # Precision Chrono-GZ vector logo component
¦   +-- plagiarism-helper.php  # Originality analyzer & humanizer
¦   +-- seo-helper.php         # Schema.org JSON-LD & meta tags
+-- src/                       # Optional Next.js frontend
+-- .htaccess                  # Apache rewrite rules
+-- about.php                  # Lab methodology & about page
+-- blog.php                   # Article archive & category browser
+-- category.php               # Category filter view
+-- contact.php                # Contact & press inquiries
+-- database.sql               # Standalone MySQL dump with sample hardware reviews
+-- editorial-disclosure.php   # Google E-E-A-T editorial policy
+-- index.php                  # Homepage & live benchmark ticker
+-- install.php                # 1-Click web-based installer
+-- post.php                   # Article single view with comments
+-- privacy.php                # Privacy policy
+-- robots.txt                 # Search engine directives
+-- sitemap.php                # Dynamic XML sitemap
+-- terms.php                  # Terms of service
\\\

---

## ?? Admin Credentials

- **URL**: \/admin/login.php\
- **Username**: \dmin\
- **Password**: \genztime2026\

---

## ?? License

MIT License. Developed for **GenZ Time**.

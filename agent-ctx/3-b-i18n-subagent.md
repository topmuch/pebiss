Task ID: 3-b
Agent: i18n Subagent
Task: Add translation keys and update 6 files to use t() hook

Work Log:
- Added ~95 translation keys to both `fr` and `pt` dictionaries in i18n.ts
- Updated annuaire page: imported useTranslation, replaced all hardcoded French strings (title, subtitle, placeholders, filter labels, empty state, pagination)
- Updated annonces page: imported useTranslation, replaced header, filter labels, ad type labels, date formatting, empty state, pagination
- Updated entreprise detail page: imported useTranslation with locale, created DAY_KEYS helper for translated day names, replaced all French strings (not found, breadcrumb, meta, description, products/services, photos, hours, address, reviews, sidebar, contact labels, owner, opening/closed status)
- Updated dashboard-layout: imported useTranslation, moved navItems inside component to use t(), replaced "Retour au site" and "Déconnexion"
- Updated admin-layout: imported useTranslation, moved navItems inside component, replaced "Administration", "Administrateur", "Retour au site", "Déconnexion"
- Updated ad-banner: imported useTranslation, replaced "Fermer la publicité" aria-label, "Annonce" badge, alt text
- Lint passes with zero errors

Stage Summary:
- 7 files modified
- ~95 new translation keys added for both fr and pt
- All hardcoded French strings replaced with t() calls
- Date formatting uses locale-aware locale string (fr-FR vs pt-PT)
- DAY_NAMES array replaced with dynamic dayNames using DAY_KEYS + t()
- No existing functionality, CSS, or component structure was changed

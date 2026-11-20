# WEBIKA — plateforme

Site public, bibliothèque de 50 modèles, devis, assistant de création, comptes clients, espace client, administration et paiement Stripe.
Technologies : Next.js 15 (React, TypeScript), Supabase (base de données et connexion), Stripe (paiement).

## Ce qui fonctionne sans aucun compte
Toutes les pages publiques, les 50 démonstrations, l'assistant avec aperçu en direct, le devis et son PDF.
Les comptes, l'envoi des formulaires et le paiement s'activent quand les clés ci-dessous sont renseignées.

## Mise en route (environ 1 heure)

### 1. Supabase — base de données et comptes
1. Créer un projet sur supabase.com (région Europe).
2. SQL Editor > coller tout le fichier `supabase/schema.sql` > Run.
3. Project Settings > API : copier `Project URL`, la clé `anon` et la clé `service_role`.
4. Authentication > URL Configuration : mettre l'adresse du site dans « Site URL ».

### 2. Stripe — paiement
1. Developers > API keys : copier la clé secrète (`sk_...`).
2. Developers > Webhooks > Add endpoint : `https://VOTRE-DOMAINE/api/stripe/webhook`, événement `checkout.session.completed`. Copier le « Signing secret » (`whsec_...`).

### 3. Vercel — hébergement
1. Mettre ce dossier sur GitHub, puis sur vercel.com : Add New > Project > importer le dépôt.
2. Dans Environment Variables, ajouter chaque ligne du fichier `.env.example` avec sa valeur.
3. Deploy. Puis Settings > Domains pour brancher le nom de domaine.

### 4. Devenir administratrice
1. S'inscrire sur le site (page Inscription).
2. Dans Supabase > SQL Editor, exécuter avec votre e-mail :
   `update public.profiles set role = 'admin' where id = (select id from auth.users where email = 'vous@exemple.fr');`
3. La page `/admin` devient accessible.

## Tester sur son ordinateur
```
npm install
cp .env.example .env.local   # puis remplir les valeurs
npm run dev                  # http://localhost:3000
```

## Où modifier quoi
- Prix, packs, modèles, services, besoins : `lib/core.js`
- Couleurs et styles : `app/globals.css`
- Pages : dossier `app/` (un dossier par page)
- Base de données : `supabase/schema.sql`

## Pas encore fait
- Envoi des logos et photos depuis le site (stockage de fichiers)
- Gestion et résiliation d'un abonnement par le client (portail Stripe)
- E-mails automatiques (confirmation de commande, changement de statut)
- Versions anglaise et portugaise, Mobile Money
- Blog, pages détaillées par service, gestion des modèles depuis l'administration

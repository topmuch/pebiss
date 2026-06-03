import { create } from 'zustand';

export type Locale = 'pt' | 'fr';

interface I18nState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export const useI18n = create<I18nState>((set) => ({
  locale: (typeof window !== 'undefined' && (localStorage.getItem('pebiss-lang') as Locale)) || 'pt',
  setLocale: (locale: Locale) => {
    set({ locale });
    localStorage.setItem('pebiss-lang', locale);
    document.documentElement.lang = locale;
  },
}));

// French translations
const fr: Record<string, string> = {
  'home': 'Accueil',
  'directory': 'Annuaire',
  'ads': 'Annonces',
  'login': 'Connexion',
  'register': 'Inscription',
  'hero_badge': 'Plus de {count} annonces d\'entreprises',
  'hero_title_1': 'Trouvez, Explorez,',
  'hero_title_highlight': 'Découvrez',
  'hero_desc': 'Découvrez des lieux incroyables près de chez vous en quelques clics. Parcourez les meilleures annonces et connectez-vous avec des entreprises locales de confiance chaque jour.',
  'search_what': 'Ce que vous cherchez',
  'search_category': 'Catégorie',
  'search_location': 'Emplacement',
  'search_select_category': 'Sélectionner une catégorie',
  'search_placeholder': 'Ex : Restaurant, Boutique, Hôtel...',
  'search_button': 'Rechercher',
  'popular': 'Populaire :',
  'browse_categories': 'Parcourir par catégories',
  'recent_ads': 'Annonces récentes',
  'recent_ads_desc': 'Parcourez les annonces des villes populaires et proches. Trouvez ce dont vous avez besoin.',
  'see_all': 'Voir tout',
  'no_ads': 'Aucune annonce disponible',
  'no_ads_desc': 'Soyez le premier à inscrire votre entreprise sur Pebiss !',
  'register_business': 'Inscrire mon entreprise',
  'promoted': 'Promu',
  'explore': 'Explorer',
  'popular_categories': 'Découvrez nos catégories populaires',
  'popular_categories_desc': 'Explorez les secteurs les plus dynamiques du Sénégal',
  'about_title': 'Pourquoi nous sommes axés sur la qualité, inspirés par vous.',
  'about_desc': 'Explorez une plateforme de confiance qui vous connecte avec les meilleures villes et entreprises du Sénégal. Des annonces fiables, faciles à utiliser, pour tous vos besoins.',
  'about_complete': 'Annonces complètes',
  'about_complete_desc': 'Informations détaillées sur chaque entreprise',
  'about_reliable': 'Infos fiables',
  'about_reliable_desc': 'Données vérifiées et à jour',
  'about_intuitive': 'Interface intuitive',
  'about_intuitive_desc': 'Navigation simple et efficace',
  'about_cities': 'Villes diversifiées',
  'about_cities_desc': 'Couverture de tout le Sénégal',
  'about_approved': 'Approuvé localement',
  'about_approved_desc': 'La confiance des entrepreneurs sénégalais',
  'about_fluent': 'Expérience fluide',
  'about_fluent_desc': 'Résultats rapides et précis',
  'learn_more': 'En savoir plus',
  'stats_businesses': 'Entreprises référencées',
  'stats_categories': 'Catégories',
  'stats_cities': 'Villes couvertes',
  'stats_reviews': 'Avis clients',
  'years_exp': 'Années d\'expérience',
  'cta_title': 'Inscrivez votre entreprise',
  'cta_desc': 'Rejoignez des centaines d\'entreprises sénégalaises sur Pebiss. Attirez de nouveaux clients et développez votre activité.',
  'cta_button': 'Créer mon compte gratuitement',
  'cta_free': 'Inscription gratuite',
  'cta_visible': 'Visible immédiatement',
  'cta_no_card': 'Aucune carte requise',
  'mode': 'Mode & Textile',
  'cities': 'Villes & Régions',
  'restaurants': 'Restaurants',
  'btp': 'BTP & Construction',
  'mode_desc': 'Trouvez les meilleures boutiques et créateurs de mode',
  'cities_desc': 'Explorez les entreprises partout au Sénégal',
  'restaurants_desc': 'Les meilleures adresses culinaires vous attendent',
  'btp_desc': 'Des professionnels de la construction fiables',
  'footer_desc': 'Pebiss est le premier annuaire professionnel du Sénégal. Trouvez et référencez des entreprises facilement.',
  'quick_links': 'Liens rapides',
  'business_directory': 'Annuaire des entreprises',
  'professional_ads': 'Annonces professionnelles',
  'register_my_business': 'Inscrire mon entreprise',
  'connect': 'Se connecter',
  'contact': 'Contact',
  'legal': 'Mentions légales',
  'privacy': 'Politique de confidentialité',
  'terms': 'CGU',
  'copyright': '© 2025 Pebiss. Tous droits réservés.',
  'whatsapp_contact': 'Contacter sur WhatsApp',
  'my_dashboard': 'Mon tableau de bord',
  'admin_panel': 'Administration',
  'disconnect': 'Déconnexion',
  'business': 'annonce',
  'businesses': 'annonces',
  'select_language': 'Langue',
};

// Portuguese translations
const pt: Record<string, string> = {
  'home': 'Início',
  'directory': 'Diretório',
  'ads': 'Anúncios',
  'login': 'Entrar',
  'register': 'Registar',
  'hero_badge': 'Mais de {count} anúncios de empresas',
  'hero_title_1': 'Encontre, Explore,',
  'hero_title_highlight': 'Descubra',
  'hero_desc': 'Descubra lugares incríveis perto de si em poucos cliques. Navegue pelos melhores anúncios e conecte-se com empresas locais de confiança todos os dias.',
  'search_what': 'O que procura',
  'search_category': 'Categoria',
  'search_location': 'Localização',
  'search_select_category': 'Selecionar uma categoria',
  'search_placeholder': 'Ex: Restaurante, Loja, Hotel...',
  'search_button': 'Pesquisar',
  'popular': 'Popular:',
  'browse_categories': 'Navegar por categorias',
  'recent_ads': 'Anúncios recentes',
  'recent_ads_desc': 'Navegue pelos anúncios das cidades populares e próximas. Encontre o que precisa.',
  'see_all': 'Ver tudo',
  'no_ads': 'Nenhum anúncio disponível',
  'no_ads_desc': 'Seja o primeiro a registar a sua empresa no Pebiss!',
  'register_business': 'Registar a minha empresa',
  'promoted': 'Promovido',
  'explore': 'Explorar',
  'popular_categories': 'Descubra as categorias populares',
  'popular_categories_desc': 'Explore os setores mais dinâmicos do Senegal',
  'about_title': 'Porquê focamos na qualidade, inspirados por si.',
  'about_desc': 'Explore uma plataforma de confiança que o conecta com as melhores cidades e empresas do Senegal. Anúncios fiáveis, fáceis de usar, para todas as suas necessidades.',
  'about_complete': 'Anúncios completos',
  'about_complete_desc': 'Informações detalhadas sobre cada empresa',
  'about_reliable': 'Informações fiáveis',
  'about_reliable_desc': 'Dados verificados e atualizados',
  'about_intuitive': 'Interface intuitiva',
  'about_intuitive_desc': 'Navegação simples e eficiente',
  'about_cities': 'Cidades diversificadas',
  'about_cities_desc': 'Cobertura de todo o Senegal',
  'about_approved': 'Aprovado localmente',
  'about_approved_desc': 'A confiança dos empreendedores senegaleses',
  'about_fluent': 'Experiência fluida',
  'about_fluent_desc': 'Resultados rápidos e precisos',
  'learn_more': 'Saber mais',
  'stats_businesses': 'Empresas registadas',
  'stats_categories': 'Categorias',
  'stats_cities': 'Cidades cobertas',
  'stats_reviews': 'Avaliações de clientes',
  'years_exp': 'Anos de experiência',
  'cta_title': 'Registe a sua empresa',
  'cta_desc': 'Junte-se a centenas de empresas senegalesas no Pebiss. Atraia novos clientes e desenvolva a sua atividade.',
  'cta_button': 'Criar conta gratuitamente',
  'cta_free': 'Registo gratuito',
  'cta_visible': 'Visível imediatamente',
  'cta_no_card': 'Nenhum cartão necessário',
  'mode': 'Moda & Têxtil',
  'cities': 'Cidades & Regiões',
  'restaurants': 'Restaurantes',
  'btp': 'Construção Civil',
  'mode_desc': 'Encontre as melhores lojas e criadores de moda',
  'cities_desc': 'Explore as empresas em todo o Senegal',
  'restaurants_desc': 'Os melhores endereços culinários esperam por si',
  'btp_desc': 'Profissionais de construção fiáveis',
  'footer_desc': 'Pebiss é o primeiro diretório profissional do Senegal. Encontre e registe empresas facilmente.',
  'quick_links': 'Ligações rápidas',
  'business_directory': 'Diretório de empresas',
  'professional_ads': 'Anúncios profissionais',
  'register_my_business': 'Registar a minha empresa',
  'connect': 'Entrar',
  'contact': 'Contacto',
  'legal': 'Aviso legal',
  'privacy': 'Política de privacidade',
  'terms': 'CGU',
  'copyright': '© 2025 Pebiss. Todos os direitos reservados.',
  'whatsapp_contact': 'Contactar via WhatsApp',
  'my_dashboard': 'O meu painel',
  'admin_panel': 'Administração',
  'disconnect': 'Sair',
  'business': 'anúncio',
  'businesses': 'anúncios',
  'select_language': 'Idioma',
};

const translations: Record<Locale, Record<string, string>> = { fr, pt };

export function t(key: string, replacements?: Record<string, string | number>): string {
  // We need to get locale from the store - but since this is a plain function,
  // we'll need to handle this differently
  const locale = (typeof window !== 'undefined' && (localStorage.getItem('pebiss-lang') as Locale)) || 'pt';
  let text = translations[locale]?.[key] || translations['pt']?.[key] || key;
  if (replacements) {
    Object.entries(replacements).forEach(([k, v]) => {
      text = text.replace(`{${k}}`, String(v));
    });
  }
  return text;
}

export function useTranslation() {
  const { locale } = useI18n();
  return {
    locale,
    t: (key: string, replacements?: Record<string, string | number>): string => {
      let text = translations[locale]?.[key] || translations['pt']?.[key] || key;
      if (replacements) {
        Object.entries(replacements).forEach(([k, v]) => {
          text = text.replace(`{${k}}`, String(v));
        });
      }
      return text;
    },
    setLocale: useI18n.getState().setLocale,
  };
}

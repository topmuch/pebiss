import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@pebiss.sn' },
    update: {},
    create: {
      email: 'admin@pebiss.sn',
      password: adminPassword,
      name: 'Administrateur Pebiss',
      role: 'ADMIN',
    },
  });

  // Create categories
  const categoriesData = [
    { name: 'Restaurants & Alimentation', slug: 'restaurants-alimentation', icon: 'UtensilsCrossed' },
    { name: 'Technologie & Informatique', slug: 'technologie-informatique', icon: 'Monitor' },
    { name: 'Santé & Bien-être', slug: 'sante-bien-etre', icon: 'Heart' },
    { name: 'Commerce & Distribution', slug: 'commerce-distribution', icon: 'ShoppingBag' },
    { name: 'Transport & Logistique', slug: 'transport-logistique', icon: 'Truck' },
    { name: 'Immobilier', slug: 'immobilier', icon: 'Building2' },
    { name: 'Éducation & Formation', slug: 'education-formation', icon: 'GraduationCap' },
    { name: 'Services Financiers', slug: 'services-financiers', icon: 'Landmark' },
    { name: 'Tourisme & Hôtellerie', slug: 'tourisme-hotellerie', icon: 'Plane' },
    { name: 'BTP & Construction', slug: 'btp-construction', icon: 'HardHat' },
    { name: 'Agriculture & Agroalimentaire', slug: 'agriculture-agroalimentaire', icon: 'Wheat' },
    { name: 'Mode & Textile', slug: 'mode-textile', icon: 'Shirt' },
    { name: 'Arts & Culture', slug: 'arts-culture', icon: 'Palette' },
    { name: 'Énergie & Environnement', slug: 'energie-environnement', icon: 'Zap' },
    { name: 'Conseil & Services', slug: 'conseil-services', icon: 'Briefcase' },
    { name: 'Sport & Loisirs', slug: 'sport-loisirs', icon: 'Dumbbell' },
  ];

  for (const cat of categoriesData) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  // Create sample enterprises
  const enterprises = [
    {
      name: 'Dakar Digital Solutions',
      slug: 'dakar-digital-solutions',
      description: 'Votre partenaire technologique de confiance au Sénégal. Nous offrons des solutions numériques innovantes pour les entreprises, incluant le développement web, les applications mobiles et le consulting IT.',
      logo: '',
      coverImage: '',
      address: '45 Rue Carnot, Plateau',
      city: 'Dakar',
      region: 'Dakar',
      country: 'Sénégal',
      phone: '+221 33 823 45 67',
      email: 'contact@dakardigital.sn',
      website: 'https://dakardigital.sn',
      facebook: 'dakardigital',
      instagram: 'dakar_digital',
      keywords: 'technologie, informatique, développement web',
      categoryId: 'technologie-informatique',
    },
    {
      name: 'Saveurs du Sénégal',
      slug: 'saveurs-du-senegal',
      description: 'Restaurant gastronomique proposant les meilleurs plats de la cuisine sénégalaise traditionnelle. Thieboudienne, Yassa, Mafé et bien plus dans un cadre élégant au cœur de Dakar.',
      logo: '',
      coverImage: '',
      address: '12 Avenue Blaise Diagne, Dakar',
      city: 'Dakar',
      region: 'Dakar',
      country: 'Sénégal',
      phone: '+221 33 867 89 01',
      email: 'info@saveursdusenegal.sn',
      website: 'https://saveursdusenegal.sn',
      keywords: 'restaurant, cuisine, sénégalaise, thieboudienne',
      categoryId: 'restaurants-alimentation',
    },
    {
      name: 'Clinique Médicale Horizon',
      slug: 'clinique-medicale-horizon',
      description: 'Centre de soins modernes équipé des dernières technologies médicales. Notre équipe de médecins qualifiés offre des consultations, examens et soins de qualité à Dakar.',
      logo: '',
      coverImage: '',
      address: '78 Boulevard de la République, Dakar',
      city: 'Dakar',
      region: 'Dakar',
      country: 'Sénégal',
      phone: '+221 33 834 56 78',
      email: 'contact@cliniquehorizon.sn',
      website: '',
      keywords: 'santé, clinique, médecin, consultation',
      categoryId: 'sante-bien-etre',
    },
    {
      name: 'Sénégal Immobilier Premium',
      slug: 'senegal-immobilier-premium',
      description: 'Agence immobilière spécialisée dans la vente, la location et la gestion de biens immobiliers au Sénégal. Appartements, villas, bureaux et terrains.',
      logo: '',
      coverImage: '',
      address: '23 Rue Mohamed V, Plateau',
      city: 'Dakar',
      region: 'Dakar',
      country: 'Sénégal',
      phone: '+221 33 845 67 89',
      email: 'info@senegalinmo.sn',
      website: 'https://senegalinmo.sn',
      keywords: 'immobilier, location, vente, maison, appartement',
      categoryId: 'immobilier',
    },
    {
      name: 'TransExpress Logistique',
      slug: 'transexpress-logistique',
      description: 'Solutions de transport et logistique complètes pour les entreprises et particuliers. Livraison express, fret national et international, déménagement.',
      logo: '',
      coverImage: '',
      address: 'Route de l\'Aéroport, Dakar',
      city: 'Dakar',
      region: 'Dakar',
      country: 'Sénégal',
      phone: '+221 33 856 78 90',
      email: 'contact@transexpress.sn',
      keywords: 'transport, logistique, livraison, fret',
      categoryId: 'transport-logistique',
    },
    {
      name: 'Académie Excellence',
      slug: 'academie-excellence',
      description: "Centre de formation et d'éducation offrant des cours de soutien scolaire, des formations professionnelles et des ateliers de développement des compétences.",
      logo: '',
      coverImage: '',
      address: '15 Rue Pasteur, Saint-Louis',
      city: 'Saint-Louis',
      region: 'Saint-Louis',
      country: 'Sénégal',
      phone: '+221 33 967 89 01',
      email: 'info@academieexcellence.sn',
      keywords: 'éducation, formation, cours, soutien',
      categoryId: 'education-formation',
    },
    {
      name: 'Afrika Fashion House',
      slug: 'afrika-fashion-house',
      description: 'Maison de mode africaine proposant des créations uniques alliant tradition et modernité. Prêt-à-porter, sur mesure et accessoires pour hommes et femmes.',
      logo: '',
      coverImage: '',
      address: '34 Corniche Ouest, Dakar',
      city: 'Dakar',
      region: 'Dakar',
      country: 'Sénégal',
      phone: '+221 33 878 90 12',
      email: 'contact@afrikafashion.sn',
      website: 'https://afrikafashion.sn',
      instagram: 'afrikafashion',
      keywords: 'mode, textile, vêtements, african, fashion',
      categoryId: 'mode-textile',
    },
    {
      name: 'Banque Solidarité Finance',
      slug: 'banque-solidarite-finance',
      description: 'Institution financière offrant des services de microfinance, épargne, crédit et assurance pour les entrepreneurs et petites entreprises au Sénégal.',
      logo: '',
      coverImage: '',
      address: '56 Avenue Léopold Sédar Senghor, Dakar',
      city: 'Dakar',
      region: 'Dakar',
      country: 'Sénégal',
      phone: '+221 33 889 01 23',
      email: 'contact@solidaritefinance.sn',
      keywords: 'finance, banque, crédit, microfinance',
      categoryId: 'services-financiers',
    },
    {
      name: 'Sénégal Tour Expérience',
      slug: 'senegal-tour-experience',
      description: 'Agence de voyage et de tourisme proposant des circuits touristiques, des séjours et des excursions pour découvrir les merveilles du Sénégal.',
      logo: '',
      coverImage: '',
      address: '9 Rue de la Porte de l\'If, Gorée',
      city: 'Dakar',
      region: 'Dakar',
      country: 'Sénégal',
      phone: '+221 33 890 12 34',
      email: 'info@senegaltour.sn',
      website: 'https://senegaltour.sn',
      keywords: 'tourisme, voyage, excursion, circuit',
      categoryId: 'tourisme-hotellerie',
    },
    {
      name: 'BTP Sénégal Construction',
      slug: 'btp-senegal-construction',
      description: 'Entreprise de construction et de travaux publics spécialisée dans le bâtiment, les routes, les ponts et les infrastructures au Sénégal.',
      logo: '',
      coverImage: '',
      address: '100 Route des Collines, Thiès',
      city: 'Thiès',
      region: 'Thiès',
      country: 'Sénégal',
      phone: '+221 33 901 23 45',
      email: 'contact@btpsenegal.sn',
      keywords: 'btp, construction, travaux, infrastructure',
      categoryId: 'btp-construction',
    },
  ];

  for (const ent of enterprises) {
    const category = await prisma.category.findUnique({ where: { slug: ent.categoryId } });
    if (!category) continue;

    const enterprisePassword = await bcrypt.hash('ent123', 10);
    const user = await prisma.user.upsert({
      where: { email: `${ent.slug}@pebiss.sn` },
      update: {},
      create: {
        email: `${ent.slug}@pebiss.sn`,
        password: enterprisePassword,
        name: ent.name,
        role: 'ENTERPRISE',
        phone: ent.phone,
      },
    });

    await prisma.business.upsert({
      where: { slug: ent.slug },
      update: {},
      create: {
        ...ent,
        categoryId: category.id,
        ownerId: user.id,
      },
    });
  }

  // Create business hours for each business
  const businesses = await prisma.business.findMany();
  for (const business of businesses) {
    for (let day = 0; day <= 6; day++) {
      await prisma.businessHour.create({
        data: {
          dayOfWeek: day,
          openTime: '08:00',
          closeTime: '18:00',
          isClosed: day === 0, // Closed on Sunday
          businessId: business.id,
        },
      });
    }
  }

  // Create sample reviews
  const sampleReviews = [
    { rating: 5, comment: 'Excellent service, je recommande vivement !' },
    { rating: 4, comment: 'Très professionnel et ponctuel.' },
    { rating: 5, comment: 'Une équipe compétente et à l\'écoute.' },
    { rating: 4, comment: 'Bonne qualité de service, rapport qualité-prix correct.' },
    { rating: 3, comment: 'Service acceptable mais peut mieux faire.' },
  ];

  for (const business of businesses) {
    for (let i = 0; i < 3; i++) {
      await prisma.review.create({
        data: {
          rating: sampleReviews[i].rating,
          comment: sampleReviews[i].comment,
          businessId: business.id,
          userId: admin.id,
        },
      });
    }
  }

  // Create sample ads
  for (const business of businesses) {
    await prisma.ad.create({
      data: {
        title: `Promotion spéciale - ${business.name}`,
        description: `Découvrez nos offres exceptionnelles ! ${business.description?.substring(0, 100)}...`,
        type: 'PROMOTION',
        businessId: business.id,
        categoryId: business.categoryId,
      },
    });
  }

  console.log('Seed data created successfully!');
  console.log('Admin credentials: admin@pebiss.sn / admin123');
  console.log('Enterprise credentials: {slug}@pebiss.sn / ent123');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

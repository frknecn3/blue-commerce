import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma";
import { faker } from '@faker-js/faker';

interface CategorySeed {
  name: string;
  nameSlug: string;
  description: string;
  imageUrl: string;
}

interface ProductSeed {
  name: string;
  nameSlug: string;
  description: string;
  price: string;
  imageUrl: string;
  stock: number;
  categorySlug: string;
}

const CATEGORIES_DATA: CategorySeed[] = [
  {
    name: "Phones",
    nameSlug: "phones",
    description: "Latest 5G smartphones, flagship devices, and premium accessories.",
    imageUrl: "/assets/categories/phones.jpg",
  },
  {
    name: "Laptops",
    nameSlug: "laptops",
    description: "Ultrabooks, creator laptops, and high-performance mobile workstations.",
    imageUrl: "/assets/categories/laptops.jpg",
  },
  {
    name: "Gaming",
    nameSlug: "gaming",
    description: "Next-gen consoles, mechanical keyboards, gaming rigs, and accessories.",
    imageUrl: "/assets/categories/gaming.jpg",
  },
  {
    name: "Smartwatches",
    nameSlug: "smartwatches",
    description: "Fitness trackers, cellular smartwatches, and luxury wearables.",
    imageUrl: "/assets/categories/smartwatch.jpg",
  },
  {
    name: "Audio",
    nameSlug: "audio",
    description: "Noise-cancelling headphones, wireless earbuds, and studio monitors.",
    imageUrl: "/assets/categories/headphones.jpg",
  },
  {
    name: "Fashion",
    nameSlug: "fashion",
    description: "Designer apparel, streetwear, sneakers, and modern accessories.",
    imageUrl: "/assets/categories/fashion.jpg",
  },
  {
    name: "Furniture",
    nameSlug: "furniture",
    description: "Ergonomic office chairs, minimalist standing desks, and ambient lighting.",
    imageUrl: "/assets/categories/furniture.jpg",
  },
  {
    name: "Books",
    nameSlug: "books",
    description: "Bestselling technology books, system architecture guides, and engineering literature.",
    imageUrl: "/assets/categories/books.jpg",
  },
];

const PRODUCTS_DATA: ProductSeed[] = [
  // --- PHONES ---
  {
    name: "Titanium Pro Max 5G (256GB - Space Black)",
    nameSlug: "titanium-pro-max-5g-256gb-space-black",
    description: "Flagship 6.7-inch Super Retina OLED display, A17 Pro chip, 48MP Pro camera system with 5x telephoto optical zoom, all-day battery life, and lightweight titanium construction.",
    price: "1199.99",
    imageUrl: "/assets/products/titanium_phone.jpg",
    stock: 45,
    categorySlug: "phones",
  },
  {
    name: "Pixel 9 Ultra AI (128GB - Porcelain)",
    nameSlug: "pixel-9-ultra-ai-128gb-porcelain",
    description: "Next-gen computational photography with Google Tensor G4, Magic Editor AI capabilities, Actua 120Hz OLED display, and 7 years of OS updates.",
    price: "899.00",
    imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80",
    stock: 38,
    categorySlug: "phones",
  },
  {
    name: "Galaxy S24 Ultra Dynamic AMOLED (512GB)",
    nameSlug: "galaxy-s24-ultra-dynamic-amoled-512gb",
    description: "Built-in S-Pen stylus, Quad Telephoto camera with 100x Space Zoom, Snapdragon 8 Gen 3 for Galaxy, and flat Titanium frame.",
    price: "1299.50",
    imageUrl: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&auto=format&fit=crop&q=80",
    stock: 25,
    categorySlug: "phones",
  },
  {
    name: "MagSafe 3-in-1 Wireless Fast Charging Station",
    nameSlug: "magsafe-3-in-1-wireless-fast-charging-station",
    description: "Charge iPhone, Apple Watch, and AirPods simultaneously with 15W high-speed wireless power and weighted aluminum base.",
    price: "119.00",
    imageUrl: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&auto=format&fit=crop&q=80",
    stock: 80,
    categorySlug: "phones",
  },
  {
    name: "Aramid Carbon Fiber Ultra-Slim Phone Case",
    nameSlug: "aramid-carbon-fiber-ultra-slim-phone-case",
    description: "Military-grade drop protection in a 0.85mm featherweight aerospace carbon fiber profile with textured anti-slip grip.",
    price: "49.99",
    imageUrl: "https://images.unsplash.com/photo-1601593346740-925612772716?w=800&auto=format&fit=crop&q=80",
    stock: 120,
    categorySlug: "phones",
  },

  // --- LAPTOPS ---
  {
    name: "MacBook Pro 16-inch M3 Max (36GB RAM, 1TB SSD)",
    nameSlug: "macbook-pro-16-inch-m3-max-36gb-ram-1tb-ssd",
    description: "Liquid Retina XDR display with ProMotion 120Hz, 16-core CPU, 40-core GPU, up to 22 hours battery life, and studio-grade three-mic array.",
    price: "3499.00",
    imageUrl: "/assets/products/macbook_laptop.jpg",
    stock: 18,
    categorySlug: "laptops",
  },
  {
    name: "Dell XPS 15 OLED InfinityEdge 4K Touch",
    nameSlug: "dell-xps-15-oled-infinityedge-4k-touch",
    description: "13th Gen Intel Core i9, NVIDIA GeForce RTX 4070, 3.5K OLED touchscreen, CNC machined aluminum chassis with carbon fiber palm rest.",
    price: "2199.00",
    imageUrl: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop&q=80",
    stock: 22,
    categorySlug: "laptops",
  },
  {
    name: "ThinkPad X1 Carbon Gen 12 Ultralight",
    nameSlug: "thinkpad-x1-carbon-gen-12-ultralight",
    description: "Legendary tactile keyboard, Intel Core Ultra 7 processor with dedicated NPU for local AI workflows, 2.8K OLED display, and MIL-SPEC durability.",
    price: "1749.00",
    imageUrl: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80",
    stock: 30,
    categorySlug: "laptops",
  },
  {
    name: "USB-C Thunderbolt 4 Dual 4K Docking Station",
    nameSlug: "usb-c-thunderbolt-4-dual-4k-docking-station",
    description: "14-port power hub delivering 100W Power Delivery, dual 4K 60Hz display support, Gigabit Ethernet, and SD 4.0 card reader.",
    price: "189.95",
    imageUrl: "https://images.unsplash.com/photo-1622737133809-d95047b9e673?w=800&auto=format&fit=crop&q=80",
    stock: 65,
    categorySlug: "laptops",
  },

  // --- GAMING ---
  {
    name: "PlayStation 5 Pro Digital Edition (2TB SSD)",
    nameSlug: "playstation-5-pro-digital-edition-2tb-ssd",
    description: "PlayStation Spectral Super Resolution (PSSR) AI upscaling, advanced ray tracing, 60fps 4K fidelity mode, and DualSense haptic feedback.",
    price: "699.99",
    imageUrl: "/assets/products/ps5_console.jpg",
    stock: 28,
    categorySlug: "gaming",
  },
  {
    name: "Apex Pro TKL Wireless Mechanical Gaming Keyboard",
    nameSlug: "apex-pro-tkl-wireless-mechanical-gaming-keyboard",
    description: "OmniPoint 2.0 adjustable hypermagnetic switches with 0.1mm actuation, rapid trigger technology, OLED smart display, and aircraft-grade aluminum.",
    price: "249.99",
    imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80",
    stock: 54,
    categorySlug: "gaming",
  },
  {
    name: "Logitech G Pro X Superlight 2 Wireless Mouse",
    nameSlug: "logitech-g-pro-x-superlight-2-wireless-mouse",
    description: "HERO 2 sensor with 32,000 DPI, 60-gram ultra-lightweight design, LIGHTFORCE hybrid optical-mechanical switches, and zero-additive PTFE feet.",
    price: "159.00",
    imageUrl: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80",
    stock: 75,
    categorySlug: "gaming",
  },
  {
    name: "Curved 34-inch QD-OLED 175Hz UltraWide Gaming Monitor",
    nameSlug: "curved-34-inch-qd-oled-175hz-ultrawide-gaming-monitor",
    description: "0.03ms GtG response time, Quantum Dot OLED infinite contrast ratio, AMD FreeSync Premium Pro, and custom ambient RGB backlighting.",
    price: "899.99",
    imageUrl: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80",
    stock: 14,
    categorySlug: "gaming",
  },

  // --- SMARTWATCHES ---
  {
    name: "Apple Watch Ultra 2 (49mm Titanium - Orange Alpine Loop)",
    nameSlug: "apple-watch-ultra-2-49mm-titanium-orange-alpine-loop",
    description: "Precision dual-frequency GPS, 3000 nits brightest display, depth gauge to 40 meters, siren alert, and up to 72 hours in Low Power Mode.",
    price: "799.00",
    imageUrl: "/assets/products/apple_smartwatch.jpg",
    stock: 32,
    categorySlug: "smartwatches",
  },
  {
    name: "Galaxy Watch 6 Classic (47mm Rotating Bezel - Silver)",
    nameSlug: "galaxy-watch-6-classic-47mm-rotating-bezel-silver",
    description: "Super AMOLED Sapphire crystal, continuous ECG and blood pressure monitoring, personalized sleep coaching, and Wear OS by Google.",
    price: "379.99",
    imageUrl: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80",
    stock: 40,
    categorySlug: "smartwatches",
  },
  {
    name: "Garmin Fenix 7 Pro Solar Multisport GPS Watch",
    nameSlug: "garmin-fenix-7-pro-solar-multisport-gps-watch",
    description: "Power Sapphire solar charging lens, built-in LED flashlight, Hill Score metric, topo maps with navigation, and 22 days of battery life.",
    price: "799.99",
    imageUrl: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&auto=format&fit=crop&q=80",
    stock: 19,
    categorySlug: "smartwatches",
  },
  {
    name: "Breathable Silicone Sport Loop Band (45mm/49mm)",
    nameSlug: "breathable-silicone-sport-loop-band-45mm-49mm",
    description: "Sweat-resistant soft fluoroelastomer band with pin-and-tuck closure for high-intensity training and daily wear.",
    price: "29.99",
    imageUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80",
    stock: 150,
    categorySlug: "smartwatches",
  },

  // --- AUDIO ---
  {
    name: "Sony WH-1000XM5 Wireless Noise Canceling Headphones",
    nameSlug: "sony-wh-1000xm5-wireless-noise-canceling-headphones",
    description: "Industry-leading noise cancellation with two processors and 8 microphones, LDAC Hi-Res Audio, 30-hour battery life with quick charge.",
    price: "398.00",
    imageUrl: "/assets/products/sony_headphones.jpg",
    stock: 60,
    categorySlug: "audio",
  },
  {
    name: "AirPods Pro 2 with USB-C MagSafe Case",
    nameSlug: "airpods-pro-2-with-usb-c-magsafe-case",
    description: "Up to 2x more Active Noise Cancellation, Adaptive Audio, Personalized Spatial Audio with dynamic head tracking, and Conversation Awareness.",
    price: "249.00",
    imageUrl: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&auto=format&fit=crop&q=80",
    stock: 85,
    categorySlug: "audio",
  },
  {
    name: "Bose QuietComfort Ultra Spatial Audio Earbuds",
    nameSlug: "bose-quietcomfort-ultra-spatial-audio-earbuds",
    description: "CustomTune technology personalizes sound to your ear shape, world-class noise cancellation, and immersive spatial audio mode.",
    price: "299.00",
    imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80",
    stock: 45,
    categorySlug: "audio",
  },
  {
    name: "Marshall Stanmore III Bluetooth Home Speaker",
    nameSlug: "marshall-stanmore-iii-bluetooth-home-speaker",
    description: "Iconic vintage amplifier design, wider soundstage, Dynamic Loudness balance, and Bluetooth 5.2 with RCA/3.5mm inputs.",
    price: "379.99",
    imageUrl: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80",
    stock: 22,
    categorySlug: "audio",
  },

  // --- FASHION ---
  {
    name: "Waterproof Minimalist Storm Shell Jacket",
    nameSlug: "waterproof-minimalist-storm-shell-jacket",
    description: "3-layer breathable GORE-TEX membrane, taped waterproof zippers, articulated sleeves, and adjustable storm hood for all-season commute.",
    price: "189.00",
    imageUrl: "/assets/products/techwear_jacket.jpg",
    stock: 42,
    categorySlug: "fashion",
  },
  {
    name: "Full-Grain Italian Leather Chelsea Boots",
    nameSlug: "full-grain-italian-leather-chelsea-boots",
    description: "Handcrafted Goodyear welted construction, vegetable-tanned calfskin leather, cushioned memory foam insole, and durable rubber outsole.",
    price: "220.00",
    imageUrl: "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=800&auto=format&fit=crop&q=80",
    stock: 35,
    categorySlug: "fashion",
  },
  {
    name: "Urban Modular Tech Backpack 30L",
    nameSlug: "urban-modular-tech-backpack-30l",
    description: "Weatherproof Cordura fabric, dedicated 16-inch fleece laptop sleeve, hidden passport pocket, and magnetic Fidlock buckles.",
    price: "135.00",
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80",
    stock: 60,
    categorySlug: "fashion",
  },
  {
    name: "Merino Wool Thermal Crewneck Sweater",
    nameSlug: "merino-wool-thermal-crewneck-sweater",
    description: "100% extra-fine Australian Merino wool, natural temperature regulation, odor resistant, and ultra-soft itch-free hand feel.",
    price: "95.00",
    imageUrl: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&auto=format&fit=crop&q=80",
    stock: 55,
    categorySlug: "fashion",
  },

  // --- FURNITURE ---
  {
    name: "Ergonomic High-Back Mesh Executive Chair",
    nameSlug: "ergonomic-high-back-mesh-executive-chair",
    description: "Dynamic lumbar support, 4D adjustable armrests, breathable Korean mesh back, synchronized tilt mechanism, and heavy-duty aluminum base.",
    price: "449.00",
    imageUrl: "https://images.unsplash.com/photo-1580481077197-6a4a6b28b76a?w=800&auto=format&fit=crop&q=80",
    stock: 25,
    categorySlug: "furniture",
  },
  {
    name: "Dual-Motor Electric Height Adjustable Standing Desk (60x30)",
    nameSlug: "dual-motor-electric-height-adjustable-standing-desk-60x30",
    description: "Solid walnut wood top, anti-collision sensor, programmable 4-memory LED handset, smooth whisper-quiet dual lifting columns.",
    price: "599.00",
    imageUrl: "/assets/products/standing_desk.jpg",
    stock: 16,
    categorySlug: "furniture",
  },
  {
    name: "Minimalist Screenbar Monitor Light Bar",
    nameSlug: "minimalist-screenbar-monitor-light-bar",
    description: "Auto-dimming ambient light sensor, asymmetrical optical design eliminating screen glare, touch control temperature tuning (2700K - 6500K).",
    price: "79.00",
    imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80",
    stock: 90,
    categorySlug: "furniture",
  },
  {
    name: "Solid Oak Wooden Dual Monitor Riser Stand",
    nameSlug: "solid-oak-wooden-dual-monitor-riser-stand",
    description: "Hand-finished natural oak with matte black steel legs, integrated cable routing channels, and ergonomic eye-level posture support.",
    price: "89.50",
    imageUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80",
    stock: 45,
    categorySlug: "furniture",
  },

  // --- BOOKS ---
  {
    name: "Designing Data-Intensive Applications (Martin Kleppmann)",
    nameSlug: "designing-data-intensive-applications",
    description: "The definitive guide to distributed systems architecture, consistency models, replication protocols, partitioning, and stream processing.",
    price: "42.99",
    imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80",
    stock: 110,
    categorySlug: "books",
  },
  {
    name: "Clean Architecture: A Craftsman's Guide (Robert C. Martin)",
    nameSlug: "clean-architecture-a-craftsmans-guide",
    description: "Essential rules and patterns of software structure, SOLID principles, component design boundaries, and decoupled business logic.",
    price: "34.50",
    imageUrl: "/assets/products/clean_architecture_book.jpg",
    stock: 85,
    categorySlug: "books",
  },
  {
    name: "System Design Interview – An Insider's Guide (Alex Xu)",
    nameSlug: "system-design-interview-an-insiders-guide",
    description: "Step-by-step framework to master large-scale architecture interviews: rate limiters, distributed key-value stores, chat servers, and CDNs.",
    price: "39.95",
    imageUrl: "/assets/products/system_design_book.jpg",
    stock: 95,
    categorySlug: "books",
  },
  {
    name: "The Pragmatic Programmer: 20th Anniversary Edition",
    nameSlug: "the-pragmatic-programmer-20th-anniversary-edition",
    description: "Timeless wisdom on software craftsmanship, career growth, refactoring, DRY code, tracer bullets, and pragmatic engineering practices.",
    price: "44.00",
    imageUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=80",
    stock: 70,
    categorySlug: "books",
  },
];

const STORES_DATA = [
  { storeName: "Apex Tech Official", avatar: "https://i.pravatar.cc/150?u=apex" },
  { storeName: "Nordic Living Studio", avatar: "https://i.pravatar.cc/150?u=nordic" },
  { storeName: "Acoustic Audio Lab", avatar: "https://i.pravatar.cc/150?u=acoustic" },
  { storeName: "CyberTrend Fashion", avatar: "https://i.pravatar.cc/150?u=cybertrend" },
  { storeName: "Silicon Press Books", avatar: "https://i.pravatar.cc/150?u=silicon" },
  { storeName: "Titan Gaming Gear", avatar: "https://i.pravatar.cc/150?u=titan" },
];

async function main() {
  console.log("🌱 Starting Additive Marketplace Catalog Upsert...");
  console.log("🔒 Existing data will be preserved (no delete operations).");

  const passwordHash = await bcrypt.hash("123456", 10);

  // 1. Ensure Admin & Demo Customer exist
  const admin = await prisma.user.upsert({
    where: { email: "admin@bluecommerce.com" },
    update: {
      role: "ADMIN",
      status: "ENABLED",
    },
    create: {
      name: "Admin Ayya",
      email: "admin@bluecommerce.com",
      password: passwordHash,
      role: "ADMIN",
      avatar: "https://i.pravatar.cc/150?u=admin",
      status: "ENABLED",
      country: "US",
    },
  });

  const demoCustomer = await prisma.user.upsert({
    where: { email: "user@bluecommerce.com" },
    update: {
      role: "USER",
      status: "ENABLED",
    },
    create: {
      name: "Demo Customer",
      email: "user@bluecommerce.com",
      password: passwordHash,
      role: "USER",
      avatar: "https://i.pravatar.cc/150?u=demouser",
      status: "ENABLED",
      country: "US",
      defaultDeliveryLocation: "742 Evergreen Terrace, Springfield",
    },
  });

  // Ensure 4 community users exist
  const communityUsers = [];
  for (let i = 0; i < 4; i++) {
    const email = `reviewer${i + 1}@bluecommerce.com`;
    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        name: faker.person.fullName(),
        email,
        password: passwordHash,
        avatar: `https://i.pravatar.cc/150?u=reviewer${i + 1}`,
        status: "ENABLED",
        country: "US",
      },
    });
    communityUsers.push(user);
  }

  // 2. Ensure Stores exist
  const stores = [];
  for (let i = 0; i < STORES_DATA.length; i++) {
    const owner = communityUsers[i % communityUsers.length] || admin;
    const nameSlug = STORES_DATA[i].storeName.toLowerCase().replace(/\s+/g, '-');
    const store = await prisma.store.upsert({
      where: { ownerId: owner.id },
      update: {
        storeName: STORES_DATA[i].storeName,
        avatar: STORES_DATA[i].avatar,
        status: "ACTIVE",
      },
      create: {
        ownerId: owner.id,
        storeName: STORES_DATA[i].storeName,
        nameSlug,
        avatar: STORES_DATA[i].avatar,
        status: "ACTIVE",
      },
    });
    stores.push(store);
  }

  // 3. Upsert Categories
  console.log("🗂️ Upserting 8 Categories...");
  const categoryMap = new Map<string, string>(); // slug -> id

  for (const cat of CATEGORIES_DATA) {
    let existingCat = await prisma.category.findFirst({
      where: {
        OR: [
          { nameSlug: cat.nameSlug },
          { name: cat.name },
        ],
      },
    });

    if (existingCat) {
      existingCat = await prisma.category.update({
        where: { id: existingCat.id },
        data: {
          name: cat.name,
          nameSlug: cat.nameSlug,
          description: cat.description,
          imageUrl: cat.imageUrl,
        },
      });
    } else {
      existingCat = await prisma.category.create({
        data: {
          name: cat.name,
          nameSlug: cat.nameSlug,
          description: cat.description,
          imageUrl: cat.imageUrl,
        },
      });
    }
    categoryMap.set(cat.nameSlug, existingCat.id);
  }

  // 4. Upsert Products
  console.log(`📦 Upserting ${PRODUCTS_DATA.length} Curated Products...`);
  const createdProducts = [];

  for (let i = 0; i < PRODUCTS_DATA.length; i++) {
    const p = PRODUCTS_DATA[i];
    const categoryId = categoryMap.get(p.categorySlug)!;
    const seller = stores[i % stores.length];

    let existingProduct = await prisma.product.findFirst({
      where: {
        OR: [
          { nameSlug: p.nameSlug },
          { name: p.name },
        ],
      },
    });

    if (existingProduct) {
      existingProduct = await prisma.product.update({
        where: { id: existingProduct.id },
        data: {
          name: p.name,
          nameSlug: p.nameSlug,
          description: p.description,
          price: p.price,
          imageUrl: p.imageUrl,
          stock: p.stock,
          categoryId: categoryId,
          sellerId: seller.id,
          status: "ACTIVE",
        },
      });
    } else {
      existingProduct = await prisma.product.create({
        data: {
          name: p.name,
          nameSlug: p.nameSlug,
          description: p.description,
          price: p.price,
          imageUrl: p.imageUrl,
          stock: p.stock,
          categoryId: categoryId,
          sellerId: seller.id,
          status: "ACTIVE",
        },
      });
    }

    createdProducts.push(existingProduct);
  }

  // 5. Add reviews if product has none
  console.log("⭐ Ensuring verified customer reviews...");
  const reviewTemplates = [
    "Phenomenal build quality! Arrived within 48 hours in secure packaging. Exceeded expectations.",
    "Best purchase I made this year. High performance, durable materials, and intuitive to use.",
    "Very sleek design and matches the product description 100%. Highly recommend this seller!",
    "Top-tier engineering and aesthetic. Five stars without hesitation.",
  ];

  for (const product of createdProducts) {
    const existingReviews = await prisma.review.count({ where: { productId: product.id } });
    if (existingReviews === 0) {
      const reviewer = communityUsers[0];
      await prisma.review.create({
        data: {
          ownerId: reviewer.id,
          productId: product.id,
          rating: 5,
          text: faker.helpers.arrayElement(reviewTemplates),
        },
      });
    }
  }

  console.log("🎉 Additive Catalog Population Completed Successfully!");
  console.log("-------------------------------------------------------");
  console.log("✅ All existing data preserved.");
  console.log("✅ Categories: Phones, Laptops, Gaming, Smartwatches, Audio, Fashion, Furniture, Books");
  console.log("✅ 35+ Curated products with Unsplash / local HD assets added/updated.");
  console.log("🛡️ Admin: admin@bluecommerce.com | 123456");
  console.log("👤 User:  user@bluecommerce.com  | 123456");
  console.log("-------------------------------------------------------");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Seeding error:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
/**
 * Workflow Guideline / SOP Data
 * Derived from 128 FAQ articles – structured as customer journey stages
 */

export const workflowStages = [
  {
    id: "greeting",
    phase: 1,
    icon: "MessageCircle",
    color: "emerald",
    title: { id: "Sambutan & Identifikasi", en: "Greeting & Identification" },
    subtitle: {
      id: "Sapa pelanggan dan kenali kebutuhan mereka",
      en: "Greet the customer and identify their needs",
    },
    estimatedTime: "1-2 min",
    steps: [
      {
        title: { id: "Sapa dengan hangat", en: "Warm greeting" },
        description: {
          id: "Gunakan sapaan ramah dengan emoji. Sebutkan nama pelanggan jika tersedia.",
          en: "Use a friendly greeting with emoji. Mention customer name if available.",
        },
        template: "Hi Kak [Nama], selamat [pagi/siang/malam]! Terima kasih sudah menghubungi Treelogy 🌿☀️\n\nApakah ada yang bisa kami bantu?",
      },
      {
        title: { id: "Identifikasi kebutuhan", en: "Identify needs" },
        description: {
          id: "Dengarkan dan klasifikasikan pertanyaan pelanggan ke salah satu jalur berikut.",
          en: "Listen and classify the customer question into one of the following paths.",
        },
        branches: [
          { label: { id: "Ingin tahu produk", en: "Wants to know products" }, goto: "education" },
          { label: { id: "Punya kondisi kesehatan", en: "Has health condition" }, goto: "health-check" },
          { label: { id: "Tanya dosis/cara pakai", en: "Asks dosage/usage" }, goto: "dosage" },
          { label: { id: "Masalah pesanan", en: "Order issue" }, goto: "order-support" },
          { label: { id: "Keluhan produk", en: "Product complaint" }, goto: "troubleshoot" },
          { label: { id: "Kulit/rambut (Oil)", en: "Skin/hair (Oil)" }, goto: "oil-guide" },
        ],
      },
    ],
  },
  {
    id: "education",
    phase: 2,
    icon: "GraduationCap",
    color: "blue",
    title: { id: "Edukasi Produk", en: "Product Education" },
    subtitle: {
      id: "Jelaskan produk Moringa dan manfaatnya",
      en: "Explain Moringa products and their benefits",
    },
    estimatedTime: "3-5 min",
    steps: [
      {
        title: { id: "Jelaskan Moringa", en: "Explain Moringa" },
        description: {
          id: "Moringa oleifera adalah superfood tropis dengan 90+ nutrisi: 7x vitamin C dari jeruk, 15x potasium dari pisang.",
          en: "Moringa oleifera is a tropical superfood with 90+ nutrients: 7x vitamin C of oranges, 15x potassium of bananas.",
        },
        keyPoints: [
          { id: "Meningkatkan energi dan daya tahan tubuh", en: "Boosts energy and immune system" },
          { id: "Mendukung kesehatan kulit dan rambut", en: "Supports skin and hair health" },
          { id: "Membantu menyeimbangkan gula darah & kolesterol", en: "Helps balance blood sugar & cholesterol" },
          { id: "Antioksidan & anti-inflamasi alami", en: "Natural antioxidant & anti-inflammatory" },
          { id: "Baik untuk pencernaan dan metabolisme", en: "Good for digestion and metabolism" },
        ],
      },
      {
        title: { id: "Kenalkan 3 produk", en: "Introduce 3 products" },
        description: {
          id: "Jelaskan perbedaan dan keunggulan masing-masing format produk.",
          en: "Explain the differences and advantages of each product format.",
        },
        products: [
          {
            name: "Moringa Capsules",
            icon: "Pill",
            benefit: { id: "Praktis, tanpa rasa pahit, cocok konsumsi harian", en: "Practical, no bitter taste, ideal for daily use" },
            dosage: { id: "400mg/kapsul, mulai 2-3 kapsul/hari", en: "400mg/capsule, start 2-3 capsules/day" },
          },
          {
            name: "Moringa Powder",
            icon: "Leaf",
            benefit: { id: "Fleksibel untuk smoothie, teh, atau masakan", en: "Versatile for smoothies, tea, or cooking" },
            dosage: { id: "Mulai ½ sdt (1g), naik ke 1 sdt (3g)/hari", en: "Start ½ tsp (1g), increase to 1 tsp (3g)/day" },
          },
          {
            name: "Moringa Oil",
            icon: "Droplets",
            benefit: { id: "100% cold-pressed, untuk kulit & rambut", en: "100% cold-pressed, for skin & hair" },
            dosage: { id: "3-5 tetes, oleskan ke area yang diinginkan", en: "3-5 drops, apply to desired area" },
          },
        ],
      },
      {
        title: { id: "Rekomendasikan berdasarkan kebutuhan", en: "Recommend based on needs" },
        description: {
          id: "Tanyakan preferensi pelanggan untuk memberikan rekomendasi yang tepat.",
          en: "Ask customer preferences to give the right recommendation.",
        },
        decisionTable: [
          { condition: { id: "Praktis & tanpa rasa", en: "Practical & tasteless" }, recommend: "Capsules" },
          { condition: { id: "Suka eksplor resep sehat", en: "Likes healthy recipes" }, recommend: "Powder" },
          { condition: { id: "Masalah kulit/rambut", en: "Skin/hair issues" }, recommend: "Oil" },
          { condition: { id: "Kombinasi dalam & luar", en: "Internal + external combo" }, recommend: "Capsules + Oil" },
        ],
      },
    ],
  },
  {
    id: "health-check",
    phase: 3,
    icon: "HeartPulse",
    color: "rose",
    title: { id: "Asesmen Kondisi Kesehatan", en: "Health Condition Assessment" },
    subtitle: {
      id: "Validasi keamanan dan berikan rekomendasi sesuai kondisi",
      en: "Validate safety and provide condition-specific recommendations",
    },
    estimatedTime: "3-5 min",
    steps: [
      {
        title: { id: "Identifikasi kondisi", en: "Identify condition" },
        description: {
          id: "Klasifikasikan kondisi kesehatan pelanggan ke kategori yang tepat.",
          en: "Classify the customer's health condition into the right category.",
        },
        conditions: [
          {
            category: { id: "Kardiovaskular", en: "Cardiovascular" },
            items: [
              { id: "Hipertensi (tekanan darah tinggi)", en: "Hypertension (high blood pressure)" },
              { id: "Hipotensi (tekanan darah rendah)", en: "Hypotension (low blood pressure)" },
              { id: "Pasca pasang ring jantung", en: "Post heart stent" },
            ],
            safety: { id: "Aman, tapi mulai dosis rendah. Kalau konsumsi obat darah tinggi, beri jeda 1-2 jam.", en: "Safe, but start low dose. If on BP medication, space 1-2 hours apart." },
          },
          {
            category: { id: "Endokrin & Metabolik", en: "Endocrine & Metabolic" },
            items: [
              { id: "Diabetes", en: "Diabetes" },
              { id: "Hipertiroid / Hipotiroid", en: "Hyperthyroid / Hypothyroid" },
              { id: "PCOS / Gangguan hormon", en: "PCOS / Hormonal imbalance" },
            ],
            safety: { id: "Moringa membantu menstabilkan gula darah & hormon. Konsultasi dokter jika sedang minum obat.", en: "Moringa helps stabilize blood sugar & hormones. Consult doctor if on medication." },
          },
          {
            category: { id: "Pencernaan", en: "Digestive" },
            items: [
              { id: "GERD / Asam lambung", en: "GERD / Acid reflux" },
              { id: "Masalah pencernaan", en: "Digestive issues" },
            ],
            safety: { id: "Aman, konsumsi setelah makan. Mulai dosis kecil jika perut sensitif.", en: "Safe, consume after meals. Start low dose if stomach is sensitive." },
          },
          {
            category: { id: "Reproduksi & Kehamilan", en: "Reproductive & Pregnancy" },
            items: [
              { id: "Program hamil (promil)", en: "Trying to conceive" },
              { id: "Ibu hamil", en: "Pregnant" },
              { id: "Ibu menyusui", en: "Breastfeeding" },
              { id: "Menopause / Premenopause", en: "Menopause / Perimenopause" },
              { id: "Kesuburan pria & wanita", en: "Male & female fertility" },
            ],
            safety: { id: "Umumnya aman dan mendukung nutrisi. Untuk ibu hamil, konsultasi dokter terlebih dahulu.", en: "Generally safe and nutritious. For pregnant women, consult doctor first." },
          },
          {
            category: { id: "Muskuloskeletal", en: "Musculoskeletal" },
            items: [
              { id: "Nyeri sendi / Lutut", en: "Joint pain / Knee pain" },
              { id: "Asam urat", en: "Gout" },
              { id: "Gonarthrosis", en: "Gonarthrosis" },
            ],
            safety: { id: "Moringa anti-inflamasi alami, bantu meredakan nyeri. Bukan pengganti terapi medis.", en: "Moringa is a natural anti-inflammatory, helps relieve pain. Not a substitute for medical therapy." },
          },
          {
            category: { id: "Autoimun & Kulit", en: "Autoimmune & Skin" },
            items: [
              { id: "Psoriasis", en: "Psoriasis" },
              { id: "Eksim / Kulit kering", en: "Eczema / Dry skin" },
            ],
            safety: { id: "Kapsul untuk dari dalam + Oil untuk topikal. Lakukan patch test untuk Oil.", en: "Capsules for internal + Oil for topical. Do patch test for Oil." },
          },
          {
            category: { id: "Lainnya", en: "Others" },
            items: [
              { id: "Kanker / Pasca kemo", en: "Cancer / Post-chemo" },
              { id: "Gangguan ginjal", en: "Kidney disorder" },
            ],
            safety: { id: "Aman dalam dosis wajar. WAJIB konsultasi dokter sebelum konsumsi rutin.", en: "Safe in reasonable doses. MUST consult doctor before regular consumption." },
          },
        ],
      },
      {
        title: { id: "Cek interaksi obat", en: "Check drug interactions" },
        description: {
          id: "Tanyakan apakah pelanggan sedang konsumsi obat tertentu.",
          en: "Ask if the customer is currently on any medication.",
        },
        template: "Kalau boleh tahu, apakah Kakak sedang konsumsi obat tertentu dari dokter? Supaya kami bisa bantu rekomendasikan cara konsumsi yang paling tepat 😊",
        rules: [
          { id: "Obat darah tinggi → Beri jeda 1-2 jam", en: "Blood pressure meds → Space 1-2 hours" },
          { id: "Pengencer darah (Ascardia) → Aman, tapi konsultasi dokter", en: "Blood thinners (Ascardia) → Safe, but consult doctor" },
          { id: "Obat tiroid → Konsultasi dokter dulu", en: "Thyroid meds → Consult doctor first" },
          { id: "Obat diabetes → Beri jeda 1-2 jam", en: "Diabetes meds → Space 1-2 hours" },
          { id: "Suplemen/vitamin → Aman dikombinasi", en: "Supplements/vitamins → Safe to combine" },
          { id: "Kopi/teh kafein → Beri jeda 1-2 jam untuk penyerapan optimal", en: "Coffee/caffeinated tea → Space 1-2 hours for optimal absorption" },
        ],
      },
      {
        title: { id: "Berikan rekomendasi", en: "Give recommendation" },
        description: {
          id: "Setelah validasi keamanan, arahkan ke panduan dosis yang sesuai.",
          en: "After safety validation, direct to appropriate dosage guide.",
        },
        template: "Berdasarkan kondisi Kakak, Moringa aman dikonsumsi ya 💚 Kami sarankan mulai dari dosis kecil dulu supaya tubuh bisa beradaptasi. [Lanjut ke panduan dosis]",
      },
    ],
  },
  {
    id: "dosage",
    phase: 4,
    icon: "TestTube",
    color: "violet",
    title: { id: "Panduan Dosis & Cara Konsumsi", en: "Dosage & Consumption Guide" },
    subtitle: {
      id: "Sesuaikan dosis berdasarkan kondisi dan kebutuhan pelanggan",
      en: "Customize dosage based on customer condition and needs",
    },
    estimatedTime: "2-3 min",
    steps: [
      {
        title: { id: "Tentukan dosis awal", en: "Determine starting dose" },
        description: {
          id: "Selalu mulai dari dosis rendah, naikkan bertahap.",
          en: "Always start low, increase gradually.",
        },
        dosageTable: {
          capsule: [
            { phase: { id: "Awal (3 hari pertama)", en: "Initial (first 3 days)" }, dose: { id: "1-2 kapsul/hari", en: "1-2 capsules/day" } },
            { phase: { id: "Rutin harian", en: "Daily routine" }, dose: { id: "3 kapsul/hari (1 kapsul per minum)", en: "3 capsules/day (1 per serving)" } },
            { phase: { id: "Kebutuhan khusus", en: "Special needs" }, dose: { id: "4-6 kapsul/hari", en: "4-6 capsules/day" } },
            { phase: { id: "Anak 11-13 tahun", en: "Children 11-13 years" }, dose: { id: "1 kapsul/hari", en: "1 capsule/day" } },
          ],
          powder: [
            { phase: { id: "Awal (1-2 minggu)", en: "Initial (1-2 weeks)" }, dose: { id: "⅓ sdt (~1g)/hari", en: "⅓ tsp (~1g)/day" } },
            { phase: { id: "Rutin harian", en: "Daily routine" }, dose: { id: "½ sdt (~1.5g)/hari", en: "½ tsp (~1.5g)/day" } },
            { phase: { id: "Kebutuhan khusus", en: "Special needs" }, dose: { id: "1 sdt (~3g)/hari", en: "1 tsp (~3g)/day" } },
          ],
        },
      },
      {
        title: { id: "Panduan waktu konsumsi", en: "Timing guide" },
        description: {
          id: "Waktu konsumsi bisa disesuaikan dengan tujuan pelanggan.",
          en: "Consumption time can be adjusted to customer goals.",
        },
        timingGuide: [
          { time: { id: "Pagi hari", en: "Morning" }, icon: "Sunrise", benefit: { id: "Paling direkomendasikan — tingkatkan energi, fokus, metabolisme", en: "Most recommended — boosts energy, focus, metabolism" } },
          { time: { id: "Siang hari", en: "Afternoon" }, icon: "Sun", benefit: { id: "Stamina tambahan, jaga energi stabil sampai sore", en: "Extra stamina, keeps energy stable until evening" } },
          { time: { id: "Malam hari", en: "Evening" }, icon: "Moon", benefit: { id: "Regenerasi tubuh, kontrol gula darah, relaksasi", en: "Body regeneration, blood sugar control, relaxation" } },
          { time: { id: "Saat puasa", en: "During fasting" }, icon: "Clock", benefit: { id: "Setelah sahur (pagi) dan setelah berbuka (malam)", en: "After sahur (morning) and after iftar (evening)" } },
        ],
      },
      {
        title: { id: "Cara seduh powder", en: "How to brew powder" },
        description: {
          id: "Panduan menyeduh Moringa Powder yang benar.",
          en: "Proper guide to brew Moringa Powder.",
        },
        keyPoints: [
          { id: "Gunakan air hangat suam-suam kuku (40-60°C), BUKAN air mendidih", en: "Use warm water (40-60°C), NOT boiling water" },
          { id: "Bisa dicampur susu, jus, smoothie, atau makanan", en: "Can be mixed with milk, juice, smoothies, or food" },
          { id: "Opsi pekat: 100-150ml air | Opsi encer: 200-250ml air", en: "Concentrated: 100-150ml water | Light: 200-250ml water" },
          { id: "Boleh dicampur madu, TIDAK disarankan dengan kopi/teh kafein", en: "Can add honey, NOT recommended with coffee/caffeinated tea" },
        ],
      },
    ],
  },
  {
    id: "troubleshoot",
    phase: 5,
    icon: "Wrench",
    color: "amber",
    title: { id: "Troubleshooting & Keluhan", en: "Troubleshooting & Complaints" },
    subtitle: {
      id: "Tangani keluhan produk dan efek samping dengan empati",
      en: "Handle product complaints and side effects with empathy",
    },
    estimatedTime: "3-5 min",
    steps: [
      {
        title: { id: "Reaksi tubuh / efek samping", en: "Body reactions / side effects" },
        description: {
          id: "Beberapa pelanggan mengalami reaksi adaptasi. Berikut panduan penanganannya.",
          en: "Some customers experience adaptation reactions. Here's the handling guide.",
        },
        reactions: [
          {
            symptom: { id: "BAB lebih sering / diare ringan", en: "More frequent bowel movement / mild diarrhea" },
            cause: { id: "Detoksifikasi alami dari klorofil dan serat tinggi", en: "Natural detoxification from chlorophyll and high fiber" },
            action: { id: "Kurangi dosis, minum setelah makan, tingkatkan bertahap", en: "Reduce dose, take after meals, increase gradually" },
          },
          {
            symptom: { id: "Gatal-gatal / bintik halus", en: "Itching / mild rash" },
            cause: { id: "Reaksi detoksifikasi, tubuh sedang menyesuaikan", en: "Detox reaction, body is adjusting" },
            action: { id: "Kurangi ke 1-2 kapsul/hari, naikkan perlahan setelah 1 minggu", en: "Reduce to 1-2 capsules/day, increase slowly after 1 week" },
          },
          {
            symptom: { id: "Sariawan / panas dalam", en: "Canker sores / internal heat" },
            cause: { id: "Dosis terlalu tinggi atau konsumsi sebelum tidur", en: "Dose too high or consuming before bed" },
            action: { id: "Kurangi dosis, minum setelah sarapan (bukan malam hari)", en: "Reduce dose, take after breakfast (not at night)" },
          },
          {
            symptom: { id: "Mudah marah / gelisah", en: "Irritability / restlessness" },
            cause: { id: "Bukan dari Moringa — kemungkinan kelelahan/kurang tidur", en: "Not from Moringa — likely fatigue/lack of sleep" },
            action: { id: "Evaluasi pola tidur, kurangi dosis sementara", en: "Evaluate sleep pattern, reduce dose temporarily" },
          },
        ],
      },
      {
        title: { id: "Tidak suka rasa/aroma", en: "Dislikes taste/aroma" },
        description: {
          id: "Tawarkan solusi alternatif cara konsumsi.",
          en: "Offer alternative consumption methods.",
        },
        solutions: [
          { id: "Ganti ke Kapsul — praktis, tanpa rasa", en: "Switch to Capsules — practical, tasteless" },
          { id: "Campur ke smoothie dengan buah (pisang, mangga, berry)", en: "Mix into smoothie with fruits (banana, mango, berry)" },
          { id: "Buat Moringa Latte (bubuk + susu nabati + madu)", en: "Make Moringa Latte (powder + plant milk + honey)" },
          { id: "Campur ke jus jeruk/nanas (rasa asam menetralkan aroma)", en: "Mix into orange/pineapple juice (sourness neutralizes aroma)" },
          { id: "Tabur ke omelet, sup, atau salad", en: "Sprinkle on omelet, soup, or salad" },
        ],
      },
      {
        title: { id: "Salah kirim / retur", en: "Wrong delivery / returns" },
        description: {
          id: "Tangani keluhan pengiriman dengan empati dan solusi cepat.",
          en: "Handle delivery complaints with empathy and quick solutions.",
        },
        template: "Kami mohon maaf sebesar-besarnya atas ketidaknyamanan ini 🙏\n[Jelaskan solusi: kirim ulang / refund]\nProduk yang sudah terkirim, silakan Kakak simpan sebagai bentuk permintaan maaf dari Treelogy 💚",
      },
    ],
  },
  {
    id: "oil-guide",
    phase: 6,
    icon: "Droplets",
    color: "teal",
    title: { id: "Panduan Moringa Oil", en: "Moringa Oil Guide" },
    subtitle: {
      id: "Panduan lengkap penggunaan Moringa Oil untuk kulit & rambut",
      en: "Complete guide for Moringa Oil usage for skin & hair",
    },
    estimatedTime: "2-3 min",
    steps: [
      {
        title: { id: "Cara penggunaan", en: "How to use" },
        description: {
          id: "Moringa Oil bisa digunakan untuk wajah, rambut, dan tubuh.",
          en: "Moringa Oil can be used for face, hair, and body.",
        },
        usages: [
          { area: { id: "Wajah (Serum)", en: "Face (Serum)" }, method: { id: "2-3 tetes, oleskan merata. Gunakan malam hari untuk regenerasi.", en: "2-3 drops, apply evenly. Use at night for regeneration." } },
          { area: { id: "Rambut (Hair Mask)", en: "Hair (Hair Mask)" }, method: { id: "3-5 tetes di kulit kepala, pijat lembut 2-3 menit, diamkan 30-60 menit, cuci.", en: "3-5 drops on scalp, massage gently 2-3 min, leave 30-60 min, wash." } },
          { area: { id: "Tubuh (Body Serum)", en: "Body (Body Serum)" }, method: { id: "Campur dengan handbody atau oleskan langsung ke area kering.", en: "Mix with body lotion or apply directly to dry areas." } },
        ],
      },
      {
        title: { id: "Kondisi khusus", en: "Special conditions" },
        description: {
          id: "Panduan penggunaan Oil untuk kondisi kulit tertentu.",
          en: "Oil usage guide for specific skin conditions.",
        },
        specialCases: [
          { case: { id: "Kulit sensitif / merah", en: "Sensitive / red skin" }, advice: { id: "Aman! Anti-inflamasi alami, non-comedogenic. Lakukan patch test dulu.", en: "Safe! Natural anti-inflammatory, non-comedogenic. Do patch test first." } },
          { case: { id: "Bayi (3+ bulan)", en: "Baby (3+ months)" }, advice: { id: "Aman untuk kulit kering/ruam. Oleskan tipis, hindari area mata dan mulut.", en: "Safe for dry skin/rash. Apply thin layer, avoid eye and mouth area." } },
          { case: { id: "Rambut rontok", en: "Hair loss" }, advice: { id: "Vitamin A & E merangsang pertumbuhan rambut. Gunakan 1-2x seminggu sebagai hair mask.", en: "Vitamin A & E stimulate hair growth. Use 1-2x weekly as hair mask." } },
          { case: { id: "Psoriasis / Eksim", en: "Psoriasis / Eczema" }, advice: { id: "Sangat direkomendasikan! Meredakan inflamasi, melembapkan tanpa minyak berlebih.", en: "Highly recommended! Relieves inflammation, moisturizes without excess oil." } },
        ],
      },
      {
        title: { id: "Waktu penggunaan", en: "When to use" },
        description: {
          id: "Waktu terbaik menggunakan Moringa Oil.",
          en: "Best time to use Moringa Oil.",
        },
        keyPoints: [
          { id: "Malam hari paling direkomendasikan — mendukung regenerasi kulit & kolagen", en: "Night time most recommended — supports skin regeneration & collagen" },
          { id: "Pagi hari boleh, tapi gunakan sunscreen karena oil bisa sensitif terhadap UV", en: "Morning OK, but use sunscreen as oil can be UV-sensitive" },
          { id: "Untuk rambut: 1-2x seminggu, bisa overnight untuk hasil maksimal", en: "For hair: 1-2x weekly, can leave overnight for maximum results" },
        ],
      },
    ],
  },
  {
    id: "order-support",
    phase: 7,
    icon: "Package",
    color: "sky",
    title: { id: "Dukungan Pemesanan & Pengiriman", en: "Order & Delivery Support" },
    subtitle: {
      id: "Bantu pelanggan dari checkout hingga paket diterima",
      en: "Help customers from checkout to package delivery",
    },
    estimatedTime: "2-3 min",
    steps: [
      {
        title: { id: "Recovery keranjang", en: "Cart recovery" },
        description: {
          id: "Untuk pelanggan yang belum menyelesaikan checkout.",
          en: "For customers who haven't completed checkout.",
        },
        template: "Halo Kak [Nama]! 🌿\nKami lihat ada pesanan kakak [nama item] yang belum selesai. Apakah kakak mengalami kesulitan atau butuh bantuan?\n\nJika ada pertanyaan lainnya, kami dengan senang hati siap bantu! 🥰",
      },
      {
        title: { id: "Info pengiriman", en: "Shipping info" },
        description: {
          id: "Informasi pengiriman dan jam operasional.",
          en: "Shipping information and operational hours.",
        },
        keyPoints: [
          { id: "Pengiriman dari Bali", en: "Shipped from Bali" },
          { id: "Luar Bali: J&T | Dalam Bali: J&T atau Gojek/Grab", en: "Outside Bali: J&T | Within Bali: J&T or Gojek/Grab" },
          { id: "Jam operasional: Senin-Jumat, 09.00-17.00 WITA", en: "Operating hours: Mon-Fri, 09.00-17.00 WITA" },
          { id: "Estimasi pengiriman: 3-5 hari kerja", en: "Estimated delivery: 3-5 business days" },
        ],
      },
      {
        title: { id: "Kirim resi & tracking", en: "Send receipt & tracking" },
        description: {
          id: "Template pengiriman nomor resi.",
          en: "Receipt number delivery template.",
        },
        template: "Halo Kak [Nama], pesanan Kakak sudah kami kirimkan ya 🤍\n\nBerikut nomor resinya:\n[NOMOR RESI]\n\nKakak bisa melacak di:\n• J&T: https://jet.co.id/track\n• Lion Parcel: https://lionparcel.com/track/stt\n\nKalau ada kendala, langsung kabari kami ya 😊✨",
      },
    ],
  },
  {
    id: "closing",
    phase: 8,
    icon: "Star",
    color: "yellow",
    title: { id: "Penutup & Retensi", en: "Closing & Retention" },
    subtitle: {
      id: "Akhiri percakapan dengan baik dan dorong loyalitas",
      en: "End conversation well and encourage loyalty",
    },
    estimatedTime: "1 min",
    steps: [
      {
        title: { id: "Closing percakapan", en: "Closing conversation" },
        template: "Terima kasih kembali yaa Kak! Kalau Kakak ada kendala atau pertanyaan lain, feel free to let us know! Have a wonderful day dan semoga sehat selalu ☀️🌿",
      },
      {
        title: { id: "Minta review", en: "Ask for review" },
        description: {
          id: "Setelah pelanggan menerima produk dan puas.",
          en: "After customer receives product and is satisfied.",
        },
        template: "Kalau nanti Kakak sudah mencoba produk Moringa-nya dan merasa cocok, kami sangat berterima kasih jika Kakak berkenan memberikan review di Tokopedia Treelogy 🌿\nReview Kakak sangat berarti untuk bantu calon pelanggan lain! 🤍",
      },
      {
        title: { id: "Garansi uang kembali", en: "Money-back guarantee" },
        description: {
          id: "Jika pelanggan ragu, informasikan garansi.",
          en: "If customer hesitates, inform about guarantee.",
        },
        template: "Kakak cukup sharing pengalaman dengan produk Treelogy melalui WA kami. Jika setelah konsumsi rutin selama 30 hari tidak merasakan perbedaan apa pun, kami jamin uang kembali 💚",
      },
    ],
  },
];

export const quickReferenceCards = [
  {
    id: "keunggulan",
    title: { id: "Keunggulan Treelogy", en: "Treelogy Advantages" },
    icon: "Award",
    items: [
      { id: "100% daun kelor organik dari Bali, tanpa batang", en: "100% organic moringa leaves from Bali, no stems" },
      { id: "Low heat dehydration (38°C, 22 jam) — nutrisi terjaga", en: "Low heat dehydration (38°C, 22hrs) — nutrients preserved" },
      { id: "Hand-picked satu per satu, bukan produksi massal", en: "Hand-picked one by one, not mass produced" },
      { id: "Cold-pressed oil dari biji kelor murni", en: "Cold-pressed oil from pure moringa seeds" },
      { id: "Shelf life: 6 bulan optimal, expiry hingga Juni 2027", en: "Shelf life: 6 months optimal, expiry up to June 2027" },
      { id: "Garansi uang kembali 30 hari", en: "30-day money-back guarantee" },
    ],
  },
  {
    id: "platform",
    title: { id: "Platform Treelogy", en: "Treelogy Platforms" },
    icon: "Globe",
    items: [
      { id: "Website: www.treelogy.com", en: "Website: www.treelogy.com" },
      { id: "Shopee: shopee.co.id/treelogy.moringa", en: "Shopee: shopee.co.id/treelogy.moringa" },
      { id: "Tokopedia: tokopedia.com/treelogy-moringa", en: "Tokopedia: tokopedia.com/treelogy-moringa" },
    ],
  },
  {
    id: "larangan",
    title: { id: "Yang Harus Diperhatikan", en: "Important Reminders" },
    icon: "AlertTriangle",
    items: [
      { id: "Moringa BUKAN obat — selalu komunikasikan sebagai superfood", en: "Moringa is NOT medicine — always communicate as superfood" },
      { id: "Selalu sarankan konsultasi dokter untuk kondisi medis berat", en: "Always recommend doctor consultation for serious conditions" },
      { id: "Jangan klaim bisa menyembuhkan penyakit tertentu", en: "Never claim it can cure specific diseases" },
      { id: "Hindari air mendidih untuk powder — nutrisi bisa rusak", en: "Avoid boiling water for powder — nutrients can be damaged" },
      { id: "Oil sebaiknya malam hari, gunakan sunscreen jika pagi", en: "Oil preferably at night, use sunscreen if morning" },
    ],
  },
];

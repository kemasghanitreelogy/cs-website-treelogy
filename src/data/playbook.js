// Block types: "text", "bullets", "table", "warning", "note", "macro", "example"
// Each subsection has an array of blocks for rich, mixed content

export const playbookSections = [
  {
    id: "system-architecture",
    number: "1",
    title: { id: "Arsitektur Sistem", en: "System Architecture" },
    description: { id: "Peta channel, tier komunikasi, dan struktur internal", en: "Channel map, communication tiers, and internal structure" },
    subsections: [
      {
        id: "channel-ownership",
        title: { id: "1.1 Peta Kepemilikan Channel", en: "1.1 Channel Ownership Map" },
        blocks: [
          { type: "text", content: { id: "Setiap channel memiliki satu pemilik. Kepemilikan berarti: kita memantau, membalas, mencatat, dan mengeskalasi saat diperlukan.", en: "Each channel has a single owner. Ownership means: we monitor it, we reply, we log it, we escalate when needed." } },
          { type: "warning", content: { id: "Tidak ada channel yang dibagi tanpa protokol handoff (pengecualian: jika salah satu FOL sedang libur).", en: "No channel is shared without a handoff protocol (exception: if one FOL is on days off)." } },
          { type: "table", headers: ["Channel", "Owner", "Backup", "Response SLA"], rows: [
            ["Instagram & Facebook DM", "Frontline Ops Lead", "-", "< 1 hour (work hours)"],
            ["Instagram & Facebook Comments (Organic)", "Frontline Ops Lead", "-", "< 1 hour (work hours)"],
            ["Instagram & Facebook Ads Comments", "Frontline Ops Lead", "-", "< 2 hours (manual check)"],
            ["TikTok Comments / DM", "Frontline Ops Lead", "-", "< 2 hours (manual check)"],
            ["E-commerce Ratings Reply", "Frontline Ops Lead", "-", "< 3 hours"],
            ["WhatsApp B2C", "Anna", "-", "< 1 hour"],
            ["Website Order Tracking Number Blast", "-", "-", "< 3 days"],
            ["Shopee", "Rindang", "-", "< 1 hour"],
            ["Tokopedia", "Rindang", "-", "< 1 hour"],
            ["Shopify Orders Fulfillment", "Sales Team", "Ecom Specialist", "< 2 hours"],
            ["Email", "Frontline Ops Lead", "Ecom Specialist", "< 6 hours"],
          ] },
        ],
      },
      {
        id: "communication-tiers",
        title: { id: "1.2 Struktur Tier Komunikasi", en: "1.2 Communication Tier Structure" },
        blocks: [
          { type: "text", content: { id: "Semua komunikasi pelanggan masuk ke salah satu dari tiga tier. Tier menentukan urgensi, kedalaman nada, dan jalur eskalasi.", en: "All customer communication falls into one of three tiers. Tier determines urgency, tone depth, and escalation path." } },
          { type: "table", headers: ["Tier", "Handler", "Trigger", "Action"], rows: [
            ["Tier 1 (Inform)", "Frontline agents", "General questions, FAQ level inquiries, stock/availability/how to order", "Reply using macro, Log, No escalation needed"],
            ["Tier 2 (Support)", "All agents + Ecom/Sales support", "Product usage, dosage, results timeline, safety questions, complaint signals", "Reply using brand tone + playbook, Log, Monitor for follow-up"],
            ["Tier 3 (Escalate)", "Ecom Specialist → Founder", "Medical concerns, adverse/severe allergic reactions, legal risk, damaged product, high refund, sensitive topics", "Do NOT reply until internal confirmation. Escalate immediately"],
          ] },
        ],
      },
      {
        id: "internal-communication",
        title: { id: "1.3 Struktur Komunikasi Internal", en: "1.3 Internal Communication Structure" },
        blocks: [
          { type: "text", content: { id: "Untuk semua eskalasi dan handoff, gunakan rantai kontak ini. Jangan pernah melewati level kecuali situasinya mendesak.", en: "For all escalations and handoffs, use this contact chain. Never skip levels unless the situation is urgent." } },
          { type: "table", headers: ["Situation", "Who to Contact"], rows: [
            ["Product / Sales Issues", "Escalate to Ecom Specialist first"],
            ["Damaged Product / Refund", "Escalate to Ecom Specialist → handles internally or escalates to Factory/Founder"],
            ["Social Media / Content / KOL", "Escalate to Founder (Handled by Socmed Agency)"],
            ["Partnership", "Escalate to Sales Team (Currently handled by Oka)"],
            ["HR / Job Inquiries", "Escalate to HR"],
            ["Vendor / Print / Materials", "Escalate to Purchasing Manager"],
            ["Sensitive Medical / Legal Risk", "Escalate to Founder through Ecom Specialist"],
          ] },
        ],
      },
    ],
  },
  {
    id: "sop-framework",
    number: "2",
    title: { id: "Kerangka SOP", en: "SOP Framework" },
    description: { id: "Prosedur yang dapat ditindaklanjuti untuk setiap skenario", en: "Actionable procedures for every scenario" },
    subsections: [
      {
        id: "daily-monitoring",
        title: { id: "2.1 Protokol Monitoring Harian", en: "2.1 Daily Monitoring Protocol" },
        blocks: [
          { type: "heading", content: { id: "Rutinitas Pagi (Setiap Hari Termasuk Akhir Pekan)", en: "Morning Routine (Every Day Including Weekends)" } },
          { type: "bullets", items: {
            id: [
              "Buka Meta Business Suite Inbox. Cek SEMUA inbox: DM, komentar organik, komentar iklan",
              "Buka Instagram app langsung dan scroll tab Notifikasi — sering menangkap hal yang terlewat Meta Inbox",
              "Buka notifikasi TikTok dan feed komentar di video aktif",
              "Buka Facebook Page, cek semua komentar iklan manual via Ads Manager jika akses tersedia",
              "Buka WhatsApp B2C, cek dan assign percakapan terbuka",
              "Cek platform e-commerce: Shopee (Main + Sub), Tokopedia (semua akun)",
              "Cek inbox email, respons atau tandai untuk follow-up",
            ],
            en: [
              "Open Meta Business Suite Inbox. Check ALL inboxes: DM, organic comments, ads comments",
              "Open Instagram app directly and scroll Notifications tab — catches anything Meta Inbox misses",
              "Open TikTok notifications and comment feeds on active videos",
              "Open Facebook Page, check all ad comments manually via Ads Manager if access is available",
              "Open WhatsApp B2C, check and assign open conversations",
              "Check e-commerce platforms: Shopee (Main + Sub), Tokopedia (all accounts)",
              "Check email inbox, respond or flag for follow-up",
            ],
          } },
          { type: "note", content: { id: "Siklus pengecekan: Setiap 2 jam selama jam kerja (10:00 - 12:00 - 14:00 - 16:00 - 18:00 WITA). Di akhir pekan, minimum 2 kali cek: 10:00 dan 16:00. Monitor saja, tidak perlu balas penuh. Batch reply diterima saat akhir pekan/hari libur.", en: "Check cycle: Every 2 hours during working hours (10:00 - 12:00 - 14:00 - 16:00 - 18:00 WITA). On weekends, minimum 2 checks: 10:00 and 16:00. Monitor only, no reply in full. Batch reply is acceptable during weekend/days off." } },
          { type: "heading", content: { id: "Pemulihan Komentar Meta Ads (Masalah yang Diketahui)", en: "Meta Ads Comment Recovery (Known Issue)" } },
          { type: "warning", content: { id: "Meta secara aktif menyembunyikan komentar tertentu. Komentar ini TIDAK akan muncul di notifikasi Business Inbox.", en: "Meta actively hides certain comments. These will NOT appear in Business Inbox notifications." } },
          { type: "bullets", items: {
            id: [
              "Alasan filter: kata-kata kasar, akun baru dengan perilaku mencurigakan, sinyal spam",
              "Metode pemulihan: Buka setiap iklan aktif di Ads Manager secara manual. Navigasi ke \"Facebook/Instagram post with comments\" di level preview iklan",
              "Jika tidak ada akses Ads Manager: kirim setiap iklan yang kita lihat ke akun pribadi untuk mempertahankannya",
              "Cek Meta Ads Library iklan yang sedang berjalan — lakukan ini sekali sehari untuk semua iklan berjalan 5+ hari",
              "Sembunyikan komentar spam/kata kasar (biasanya spam judi online). JANGAN hapus kecuali benar-benar kasar — agar kita tetap bisa mengukur metrik iklan",
              "Jika menemukan komentar yang disembunyikan Meta tapi pertanyaannya genuine: tetap balas komentar agar muncul jika user kembali",
            ],
            en: [
              "Filter reason: profanity keywords, fresh accounts with suspicious behaviours, spam signals",
              "Recovery method: Manually open each active ad in Ads Manager. Navigate to \"Facebook/Instagram post with comments\" at the ad preview level",
              "If no access to Ads Manager: manually send every ads we see to our personal accounts to maintain them",
              "Check Meta Ads Library which ads are running — do this once daily for all ads running 5+ days",
              "Hide spam/profanity comments (usually online gambling spam). Do NOT delete unless truly abusive — so we can still measure ad metrics",
              "If we find a comment hidden by Meta but the question was genuine: reply to the comment anyway so it surfaces if the user returns",
            ],
          } },
        ],
      },
      {
        id: "dm-comment-handling",
        title: { id: "2.2 Penanganan DM & Komentar", en: "2.2 DM & Comment Handling SOP" },
        blocks: [
          { type: "heading", content: { id: "Instagram / Facebook DMs", en: "Instagram / Facebook DMs" } },
          { type: "bullets", items: {
            id: [
              "Like pesan (tidak semua, hanya yang sesuai) sebelum membalas",
              "Identifikasi Tier (1, 2, atau 3) sebelum menyusun respons",
              "Gunakan macro respons yang relevan sebagai dasar. Personalisasi. Jangan pernah copy-paste tanpa membaca nama customer dan konteks",
              "Selalu akhiri dengan penutup hangat. Jangan pernah mengakhiri tiba-tiba",
              "Setelah membalas: log ke Customer Questions Log segera (Sheet 1: Questions) atau Sheet 2: Reviews jika testimoni",
              "Screenshot dan upload ke folder Drive yang benar",
            ],
            en: [
              "Like the message (not all, only where applicable) before replying",
              "Identify Tier (1, 2, or 3) before crafting a response",
              "Use the relevant response macro as a base. Personalize it. Never copy/paste without reading the customer name and context",
              "Always end with a warm close. Never end abruptly",
              "After replying: log to Customer Questions Log immediately (Sheet 1: Questions) or Sheet 2: Reviews if testimonial",
              "Screenshot and upload to the correct Drive folder",
            ],
          } },
          { type: "warning", content: { id: "Jika pertanyaan sensitif (kondisi medis, kehamilan, reaksi alergi berat): JANGAN balas secara publik. Pindahkan ke DM dan terapkan Professional Alignment pivot dengan eskalasi ke Tier 2/3.", en: "If a question is sensitive (medical condition, pregnancy, adverse/severe allergic reaction): do NOT reply publicly. Move to DM and apply the Professional Alignment pivot with escalation to Tier 2/3." } },
          { type: "heading", content: { id: "Instagram & Facebook Komentar (Organik)", en: "Instagram & Facebook Comments (Organic)" } },
          { type: "bullets", items: {
            id: [
              "Selalu LIKE komentar sebelum membalas",
              "Balasan publik harus ringkas. Untuk apapun lebih dari 2 kalimat, undang ke DM",
              "Jangan pernah berdebat di publik. Jika komentar hostile atau menyebut kompetitor, pindahkan ke DM",
              "Sembunyikan komentar spam judi segera. Jangan merespons",
              "Log semua komentar yang relevan dan mengandung pertanyaan genuine atau testimoni",
            ],
            en: [
              "Always LIKE the comment before replying",
              "Keep public replies concise. For anything beyond 2 sentences, invite to DM",
              "Never argue publicly. If a comment is hostile or a competitor mention, move it to DM",
              "Hide spam gambling comments immediately. Do not respond",
              "Log all comments that are relevant and contain a genuine question or testimonial",
            ],
          } },
          { type: "macro", label: { id: "Template Undang ke DM", en: "Invite to DM Template" }, content: "\"Kami bantu lanjutkan di DM untuk penjelasan lebih detail ya, kak. 🌿\"" },
          { type: "heading", content: { id: "Komentar Meta Ads", en: "Meta Ads Comments" } },
          { type: "bullets", items: {
            id: [
              "Perlakukan seperti komentar organik dengan satu tambahan: selalu cek link iklan (URL) benar dan relevan sebelum membalas",
              "Tempel URL iklan di kolom URL sheet log",
              "Untuk komentar niat konversi (\"berapa harga?\" \"link belinya mana?\") — selalu balas dengan link produk yang benar",
              "JANGAN hapus komentar negatif di iklan segera. Balas dengan kehangatan, lalu eskalasi internal jika diperlukan",
            ],
            en: [
              "Treat like organic comments with one addition: always check the ad link (URL) is correct and relevant before replying",
              "Paste the ad URL in the URL column of the log sheet",
              "For conversion-intent comments (\"how much?\" \"where to buy?\") — always reply with the correct product link",
              "Do NOT delete negative comments on ads immediately. Reply with warmth, then escalate internally if needed",
            ],
          } },
        ],
      },
      {
        id: "ecommerce-whatsapp",
        title: { id: "2.3 E-Commerce & WhatsApp", en: "2.3 E-Commerce & WhatsApp Messages" },
        blocks: [
          { type: "heading", content: { id: "Shopee & Tokopedia", en: "Shopee & Tokopedia" } },
          { type: "bullets", items: {
            id: [
              "Balas dalam 1 jam selama jam kerja",
              "Gunakan macro standar dari Updated Macro Bank untuk pertanyaan FAQ. Sesuaikan nama dan referensi produk",
              "Untuk masalah pesanan (terlambat, hilang, item salah): cek melalui grup internal WhatsApp B2C. Jika tidak ada info, teruskan ke Ecom Manager sebelum membalas customer",
              "Untuk review/testimoni di platform: screenshot, log di Review Sheet, ekstrak golden nugget",
              "Jangan pernah menjanjikan tanggal restock atau pengiriman spesifik kecuali dikonfirmasi tim eskalasi",
            ],
            en: [
              "Reply within 1 hour during working hours",
              "Use standard macros from Updated Macro Bank for FAQ-level questions. Customize name and product reference",
              "For order issues (late, missing, wrong item): check through WhatsApp B2C internal groups. If no info found, forward to Ecom Manager before replying",
              "For reviews/testimonials on platform: screenshot, log in Review Sheet, extract golden nugget",
              "Never promise a specific restock or shipment date unless confirmed by escalation team",
            ],
          } },
          { type: "heading", content: { id: "WhatsApp Business", en: "WhatsApp Business" } },
          { type: "text", content: { id: "WhatsApp utamanya ditangani oleh Sales team. Frontline Ops membantu.", en: "WhatsApp is primarily handled by Sales team. Frontline Ops assists." } },
          { type: "macro", label: { id: "Jika menerima pesan Ecom di WA", en: "If you receive an Ecom message on WA" }, content: "\"Kami bantu cek dan teruskan ke tim terkait agar bisa segera dibantu ya, kak. 🌿\"" },
        ],
      },
      {
        id: "email-handling",
        title: { id: "2.4 Penanganan Email & Testimoni", en: "2.4 Email Inquiries & Testimonials" },
        blocks: [
          { type: "note", content: { id: "Volume email saat ini rendah. Perlakukan setiap email sebagai niat tinggi. Orang yang mengirim email biasanya pembeli serius atau pertanyaan pers/partnership.", en: "Email volume is currently low. Treat every email as high-intent. People who email are typically more serious buyers or press/partnership inquiries." } },
          { type: "bullets", items: {
            id: [
              "Cek inbox email di awal dan akhir setiap hari kerja",
              "Klasifikasikan segera: pertanyaan umum / produk / komplain / kolaborasi / media / karir",
              "Respons dalam 6 jam selama jam kerja. Email akhir pekan: balas hari kerja berikutnya pukul 10:00 WITA",
              "Untuk testimoni via email: minta izin untuk repost, log di Review Sheet, ekstrak golden nugget",
              "Untuk media/pers: tandai ke Founder sebelum membalas",
              "Untuk kolaborasi/partnership: redirect ke Sales Team",
            ],
            en: [
              "Check email inbox at start and end of each working day",
              "Classify immediately: general inquiry / product / complaint / collaboration / media / career",
              "Respond within 6 hours during working hours. Weekend emails: reply next working day by 10:00 WITA",
              "For testimonials via email: ask permission to repost, log in Review Sheet, extract golden nugget",
              "For media/press inquiries: flag to Founder before replying",
              "For collaboration/partnership: redirect to Sales Team",
            ],
          } },
          { type: "note", content: { id: "Nada email sedikit lebih formal dari DM. Tetap hangat dan premium tapi gunakan kalimat lengkap dan struktur email yang tepat (salam, isi, penutup). Sign off: \"Warm regards, Treelogy Team\". Balasan AI masih diterima tapi HARUS dicek manual sebelum dikirim.", en: "Email tone is slightly more formal than DM tone. Still warm and premium but use complete sentences and proper email structure (greeting, body, sign-off). Sign off as: \"Warm regards, Treelogy Team\". AI-generated reply is acceptable but MUST be manually checked before sending." } },
        ],
      },
      {
        id: "tracking-blast",
        title: { id: "2.5 WhatsApp Tracking Number Blast", en: "2.5 WhatsApp Tracking Number Blast" },
        blocks: [
          { type: "text", content: { id: "SOP ini mencakup notifikasi proaktif yang dikirim ke customer yang memesan via Shopify saat pesanan mereka dikirim.", en: "This SOP covers the proactive notification sent to customers who ordered via Shopify when their order ships." } },
          { type: "heading", content: { id: "Langkah-langkah", en: "Step-by-Step" } },
          { type: "bullets", items: {
            id: [
              "Ecom Specialist mengonfirmasi pesanan telah dikirim",
              "Ekspedisi membagikan: nama customer, nomor telepon, detail pesanan, nomor resi",
              "Sales Team/Frontline Ops Lead mengirim pesan WhatsApp berikut dalam sehari setelah menerima konfirmasi pengiriman",
            ],
            en: [
              "Ecom Specialist confirms order has been shipped out",
              "Expedition shares: customer name, phone number, order details, tracking number",
              "Sales Team/Frontline Ops Lead sends the following WhatsApp message within a day of receiving shipping confirmation",
            ],
          } },
          { type: "macro", label: { id: "Template Tracking Number Blast (ID)", en: "Tracking Number Blast Template (ID)" }, content: "Halo kak [Nama Customer]! 🙌🏼\n\nKami ingin menginformasikan bahwa pesanan kakak saat ini sudah dalam perjalanan. Berikut detail pengirimannya:\n\nEkspedisi: [J&T / JNE / dll]\nNo. resi: [nomor resi]\nTracking: [link tracking]\n\nKakak bisa pantau status pengirimannya langsung di website ekspedisi, dan jika ada kendala apapun selama pengiriman, silahkan langsung menghubungi kami supaya kami bisa bantu cek ke ekspedisi terkait agar paketnya bisa segera sampai ke tangan kakak ya.\n\nSaat nanti produknya sudah dicoba, akan sangat berarti bagi kami jika kakak berkenan untuk membagikan pengalaman kakak dengan kami.\n\nTerima kasih sudah mempercayakan kesehatan kakak dengan Treelogy, semoga paketnya segera sampai dan sehat selalu ya 🤍\n\n-Treelogy Team 🌿" },
          { type: "macro", label: { id: "Template Tracking Number Blast (EN)", en: "Tracking Number Blast Template (EN)" }, content: "Hi [Customer Name]! 🌿\n\nWe would like to inform you that your order is on its way. Here is the shipment details:\n\nCourier: [J&T / JNE / etc]\nTracking Number: [tracking number]\nTracking link: [link tracking]\n\nYou can monitor your delivery status directly on the courier's website. If anything comes up along the way, feel free to reach out and we will check with the courier right away to ensure your package reaches you promptly.\n\nOnce you've tried the product, it would be very meaningful if you could share your experience with us.\n\nThank you for entrusting your health to Treelogy. We hope your package arrives soon and that you stay healthy 🤍\n\n-Treelogy Team 🌿" },
          { type: "warning", content: { id: "Selalu double-check: nama yang benar, nomor resi yang benar, kurir yang benar sebelum mengirim. Jangan pernah kirim massal tanpa personalisasi.", en: "Always double-check: correct name, correct tracking number, correct courier before sending. Never send in bulk without personalizing." } },
        ],
      },
      {
        id: "complaint-resolution",
        title: { id: "2.6 Penyelesaian Komplain & Masalah", en: "2.6 Complaint & Issue Resolution" },
        blocks: [
          { type: "text", content: { id: "Komplain adalah pesan yang menyatakan ketidakpuasan, kerusakan, keterlambatan, item salah, reaksi alergi, atau permintaan refund.", en: "A complaint is any message expressing dissatisfaction, damage, delay, wrong item, adverse or allergic reaction, or refund request." } },
          { type: "warning", content: { id: "Jangan pernah menjanjikan resolusi sebelum cek dengan Ecom Specialist. Balasan pertama hanya boleh mengakui dan meyakinkan, JANGAN berkomitmen.", en: "Never promise a resolution before checking with Ecom Specialist. Your first reply must only acknowledge and reassure, NEVER commit." } },
          { type: "heading", content: { id: "Aturan Respons Segera", en: "Immediate Response Rule" } },
          { type: "bullets", items: {
            id: [
              "Akui komplain segera dengan kehangatan: \"Kami memahami kekhawatiran kakak terkait hal ini…\"",
              "JANGAN terlalu banyak minta maaf untuk sesuatu yang belum dikonfirmasi. Katakan: \"Kami mohon maaf atas kendalanya ya kak. Kami izin untuk verifikasi detail pesanan kamu terlebih dahulu untuk memastikan kendala ini ditangani dengan baik\"",
              "Teruskan semua detail ke Ecom Specialist: nama customer, nomor pesanan, ringkasan komplain, screenshot",
              "Ecom Specialist memutuskan jalur resolusi. Tunggu konfirmasi sebelum membalas dengan solusi",
              "Balas customer dengan resolusi yang sudah dikonfirmasi dalam SLA di bawah",
              "Log di Customer Questions atau Reviews Log (Friction Point: gunakan kategori yang relevan)",
            ],
            en: [
              "Acknowledge the complaint immediately with warmth: \"Kami memahami kekhawatiran kakak terkait hal ini…\"",
              "Do NOT over-apologize for something you have not confirmed. Say: \"Kami mohon maaf atas kendalanya ya kak. Kami izin untuk verifikasi detail pesanan kamu terlebih dahulu untuk memastikan kendala ini ditangani dengan baik\"",
              "Forward all details to Ecom Specialist: customer name, order number, complaint summary, screenshot",
              "Ecom Specialist decides the resolution path. Wait for confirmation before replying with solution",
              "Reply to customer with confirmed resolution within the SLA below",
              "Log in Customer Questions or Reviews Log (Friction Point: use relevant category)",
            ],
          } },
          { type: "table", headers: ["Complaint Type", "Escalation Path", "Resolution SLA"], rows: [
            ["Nutrition Fact / Product Related", "Ecom Specialist → Factory", "24 hours"],
            ["Late Shipping", "Ecom Specialist → Check courier", "12 hours"],
            ["Damaged Product / Wrong Item", "Ecom Specialist", "< 6 hours"],
            ["Refund Request", "Ecom Specialist → Founder (if >Rp500.000)", "24-48 hours"],
            ["Adverse Reaction", "Ecom Specialist → Founder", "< 2 hours"],
            ["Product Dissatisfaction", "Handle internally", "< 6 hours"],
          ] },
        ],
      },
      {
        id: "escalation-flow",
        title: { id: "2.7 Alur Eskalasi", en: "2.7 Escalation Flow" },
        blocks: [
          { type: "table", headers: ["Level", "Handler", "Scope"], rows: [
            ["Level 1", "Frontline Ops", "Standard product questions, FAQ, dosage, usage, availability, order tracking. Mild negative comments resolvable with info. Positive reviews."],
            ["Level 2", "Ecom Specialist", "All order-related complaints (damage, delay, wrong item, refund). Stock confirmation. Shopify order issues, payment questions."],
            ["Level 3", "Social Media Manager / Agency", "KOL, UGC, influencer, brand partnership requests. Story tagging. Content/campaign questions from external parties."],
            ["Level 4", "Founder (via Ecom Specialist)", "Adverse/allergic reaction claims with medical risk. Legal/regulatory threats. Media/press inquiries. Refunds >Rp500.000. Any brand reputation risk."],
          ] },
          { type: "warning", content: { id: "Jangan pernah eskalasi ke Founder tanpa pengecekan internal terlebih dahulu. Satu-satunya pengecualian adalah keadaan darurat medis segera ketika pengecekan internal tidak memungkinkan.", en: "Never escalate to Founder without internal checking first. The only exception is an immediate medical emergency when internal checking is not feasible." } },
        ],
      },
      {
        id: "vip-handling",
        title: { id: "2.8 Penanganan VIP Customer", en: "2.8 VIP Customer Handling" },
        blocks: [
          { type: "note", content: { id: "VIP = 5+ pembelian. Customer ini adalah advokat brand. Mereka layak mendapat tingkat kehangatan dan pengakuan personal yang berbeda secara nyata.", en: "VIP = 5+ purchases. These customers are brand advocates. They deserve a noticeably different level of warmth and personal recognition." } },
          { type: "heading", content: { id: "Cara Identifikasi", en: "How to Identify" } },
          { type: "bullets", items: {
            id: [
              "Cek kolom Customer Type di log: \"VIP (5x+ purchase)\"",
              "Cross-reference dengan riwayat pesanan tim Ecom jika perlu",
              "Jika ragu, perlakukan customer sebagai VIP (biaya kehangatan adalah nol untuk customer support)",
            ],
            en: [
              "Check Customer Type column in the log: \"VIP (5x+ purchase)\"",
              "Cross-reference with Ecom team order history if needed",
              "When in doubt, treat a customer like a VIP (the cost of warmth is zero for customer support)",
            ],
          } },
          { type: "heading", content: { id: "Protokol VIP", en: "VIP Protocols" } },
          { type: "bullets", items: {
            id: [
              "Panggil dengan nama depan, SELALU. Jika tahu preferensi produk mereka, sebutkan",
              "Untuk testimoni VIP: tandai untuk golden nugget extraction, log untuk potensi UGC repost atau penggunaan iklan",
              "Untuk komplain VIP: eskalasi SEGERA ke Ecom Specialist dengan flag VIP — ini mendapat resolusi prioritas",
              "Ritme follow-up: cek proaktif setelah siklus pembelian 3 bulan (setelah sistem follow-up dibangun)",
              "Jangan pernah gunakan macro copy-paste untuk VIP tanpa personalisasi berat",
            ],
            en: [
              "Address by first name, ALWAYS. If you know their product preference, reference it",
              "For VIP testimonials: flag for golden nugget extraction, log for potential UGC repost or ads use",
              "For VIP complaints: escalate IMMEDIATELY to Ecom Specialist with VIP flag — these get priority resolution",
              "Follow-up rhythm: proactively check in after 3-month purchase cycles (once follow-up system is built)",
              "Never use copy-pasted macro for VIPs without heavy personalization",
            ],
          } },
          { type: "macro", label: { id: "Template Pengakuan VIP - Returning Customer", en: "VIP Returning Customer Recognition Template" }, content: "\"Halo kak [Nama Customer]! Kami ikut senang bahwa produk kami dapat terasa manfaatnya untuk kesehatan tubuh kakak dan menjadi bagian dari rutinitas harian kakak. Terima kasih banyak sudah mempercayai Treelogy 🌞🌿\n\n[Lanjutkan dengan menjawab pertanyaan spesifik mereka secara personal]\"" },
          { type: "warning", content: { id: "Jangan pernah kirim ini sebagai pesan standalone. Harus menuju pertanyaan atau komentar mereka yang sebenarnya.", en: "Never send this as a standalone message. It must lead into their actual question or comment." } },
        ],
      },
      {
        id: "kol-partnership",
        title: { id: "2.9 KOL / Influencer / Partnership / Karir", en: "2.9 KOL / Influencer / Partnership / Career" },
        blocks: [
          { type: "heading", content: { id: "KOL & Influencer", en: "KOL & Influencer Inquiries" } },
          { type: "bullets", items: {
            id: [
              "Saat kreator atau influencer menghubungi: akui dengan hangat dalam 3 jam",
              "JANGAN negosiasi rate, syarat, atau scope konten sendiri. Redirect ke tim internal",
              "Log: origin, akun handle, estimasi followers (cek profil), tipe permintaan",
            ],
            en: [
              "When a creator or influencer reaches out: acknowledge warmly within 3 hours",
              "Do NOT negotiate rates, terms, or content scope on your own. Redirect to internal team",
              "Log the inquiry: origin, account handle, estimated following (check profile), type of request",
            ],
          } },
          { type: "macro", label: { id: "Template Respons KOL/Creator", en: "KOL/Creator Response Template" }, content: "\"Halo! Terima kasih sudah reach out ke Treelogy. 🌿\nUntuk kolaborasi dan partnership, tim kami dengan senang hati akan menghubungi kamu lebih lanjut.\"" },
          { type: "warning", content: { id: "Jangan pernah diskusikan budget, syarat gifting, atau kebutuhan konten. Itu bukan scope kita.", en: "Never discuss budget, gifting terms, or content requirements. That is not our scope." } },
          { type: "heading", content: { id: "Partnership & Konsinyasi", en: "Partnership & Consignment" } },
          { type: "text", content: { id: "Redirect ke Sales Team (Saat ini Oka): +62 857-7777-5431. Akui pertanyaan dengan hangat. JANGAN diskusikan harga, margin, atau MOQ.", en: "Redirect to Sales Team (Currently Oka): +62 857-7777-5431. Acknowledge the inquiry warmly. Do NOT discuss pricing, margins, or MOQ." } },
          { type: "heading", content: { id: "Pertanyaan Karir & Pekerjaan", en: "Career & Job Inquiries" } },
          { type: "bullets", items: {
            id: [
              "Jangan langsung menolak",
              "Konfirmasi ke HR apakah ada posisi terbuka atau mereka ingin menyimpan profil terlebih dahulu",
              "Balas dengan hangat dan langsung. Jangan bagikan detail tentang struktur perusahaan atau tim",
            ],
            en: [
              "Do not refuse immediately",
              "Confirm with HR whether there is an open position or they want to keep the profile first",
              "Reply warmly and direct. Do not share details about the company structure or team",
            ],
          } },
        ],
      },
      {
        id: "ugc-handling",
        title: { id: "2.10 UGC Handling & Reposting", en: "2.10 UGC Handling & Reposting" },
        blocks: [
          { type: "note", content: { id: "Ditangani oleh Agency. Frontline Ops membantu identifikasi dan logging.", en: "Handled by Agency. Frontline Ops assists with identification and logging." } },
          { type: "bullets", items: {
            id: [
              "Monitor: tag brand (@treelogy), mention hashtag, mention di stories",
              "Cek juga: komentar di mana customer mendeskripsikan hasil nyata atau membagikan foto",
              "Identifikasi UGC → Screenshot segera → Log di Review Sheet (rating sentimen, manfaat utama, golden nugget)",
              "Informasikan tim internal atau founder → Balas kreator asli untuk berterima kasih",
            ],
            en: [
              "Monitor: brand tags (@treelogy), hashtag mentions, mentions in stories",
              "Also check: comments where customers describe visible results or share photos",
              "Identify UGC → Screenshot immediately → Log in Review Sheet (sentiment rating, core benefit, golden nugget)",
              "Inform internal team or founder → Reply to original creator to thank them",
            ],
          } },
          { type: "macro", label: { id: "Template Permintaan Izin UGC", en: "UGC Permission Request DM Template" }, content: "\"Hi kak [Nama]! 🌿\nTerima kasih banyak sudah mention kami, we truly appreciate it. Kami senang jika produk kami sudah mulai bisa dinikmati dan terasa manfaatnya di tubuh kakak.\"" },
          { type: "warning", content: { id: "Selalu cari persetujuan dan konfirmasi dari tim internal. Jangan pernah repost tanpa persetujuan eksplisit dari kreator.", en: "Always seek approval and confirmation from the internal team. Never repost without explicit approval from the creator." } },
        ],
      },
      {
        id: "weekly-audit",
        title: { id: "2.11 Audit Mingguan & Koreksi Nada", en: "2.11 Weekly Audit & Tone Correction" },
        blocks: [
          { type: "text", content: { id: "Setiap Jumat sore (atau Senin pagi), lakukan audit 30 menit atas balasan seminggu terakhir.", en: "Every Friday afternoon (or first thing Monday morning), conduct a 30-minute audit of the past week's replies." } },
          { type: "bullets", items: {
            id: [
              "Pilih 10-15 balasan secara acak di seluruh channel",
              "Jalankan masing-masing melalui Tone Litmus Test (Section 3)",
              "Tandai balasan yang skor di bawah standar pada: kehangatan, akurasi, kepatuhan emoji, atau keselarasan macro",
              "Catat polanya — apakah tipe pertanyaan tertentu, atau waktu tertentu di mana kualitas turun?",
              "Koreksi balasan yang teridentifikasi jika masih terlihat (edit komentar jika mungkin)",
              "Log temuan di catatan mingguan sederhana (2-3 kalimat di Laporan Mingguan ke Founder)",
              "Audit untuk menemukan di mana SOP perlu diupdate. Jika tipe pertanyaan yang sama terus menghasilkan respons lemah, macro perlu diperbaiki",
            ],
            en: [
              "Select 10-15 replies across channels at random",
              "Run each through the Tone Litmus Test (Section 3)",
              "Flag any reply that scored below standard on: warmth, accuracy, emoji compliance, or macro alignment",
              "Note the pattern — is it a specific type of question, or a specific time of day where quality drops?",
              "Correct identified replies if still visible (edit comment if possible)",
              "Log findings in a simple weekly note (2-3 sentences in the Weekly Report to Founder)",
              "Audit to spot where the SOP needs updating. If the same type of question keeps generating weak responses, the macro needs improving",
            ],
          } },
        ],
      },
      {
        id: "reporting",
        title: { id: "2.12 Pelaporan ke Founder", en: "2.12 Reporting to Founder" },
        blocks: [
          { type: "heading", content: { id: "Laporan Mingguan (Setiap Senin)", en: "Weekly Report (Every Monday)" } },
          { type: "table", headers: ["Field", "What to Include"], rows: [
            ["Volume", "Total messages received across all channels this week"],
            ["Response Rate", "% replied within SLA (target: 95%+)"],
            ["Top Questions", "Top 3 friction points that came up most"],
            ["Testimonials", "Number of testimonials/reviews collected and quality rating"],
            ["Escalations", "Any complaints or escalations this week, outcome summary"],
            ["Content Gaps", "Top 1-2 questions that revealed a content gap (website or social)"],
            ["Tone Audit Finding", "One observation from weekly audit, good or needs improvement"],
            ["Priority Next Week", "One thing we plan to focus on"],
          ] },
          { type: "heading", content: { id: "Laporan Bulanan (Minggu Terakhir Setiap Bulan)", en: "Monthly Report (Last Week of Each Month)" } },
          { type: "text", content: { id: "Dokumen lebih terstruktur mencakup: tren volume, top friction points, perilaku VIP, ringkasan content gap, skor kepatuhan SOP, dan 3 rekomendasi perbaikan untuk bulan depan. Bagikan secara tertulis ke Founder dan Ecom Specialist.", en: "A more structured document covering: volume trends, top friction points, VIP behavior, content gap summary, SOP compliance score, and 3 recommended improvements for next month. Share in writing with Founder and Ecom Specialist." } },
        ],
      },
    ],
  },
  {
    id: "tone-of-voice",
    number: "3",
    title: { id: "Nada & Panduan Komunikasi", en: "Tone of Voice & Communication Guidelines" },
    description: { id: "Premium. Hangat. Edukatif. Tidak Robotik.", en: "Premium. Warm. Educational. Non-Robotic." },
    subsections: [
      {
        id: "tone-principles",
        title: { id: "3.1 Prinsip Nada", en: "3.1 Tone Principles" },
        blocks: [
          { type: "note", content: { id: "Treelogy berbicara seperti teman yang berpengetahuan, bukan salesperson, bukan manual klinis. Setiap balasan harus terasa ditulis oleh seseorang yang benar-benar memahami orang yang bertanya.", en: "Treelogy speaks like a knowledgeable friend, not a salesperson, not a clinical manual. Every reply should feel like it was written by someone who genuinely understands the person asking." } },
          { type: "table", headers: ["Principle", "What it Means", "In Practice"], rows: [
            ["Warm but not emotional", "Acknowledge the person before answering the question", "\"Terima kasih banyak sudah menjelaskan secara detail, kami sangat mengerti kekhawatiran kakak.\" — then answer"],
            ["Educational but not academic", "Explain clearly. One concept per sentence. No jargon", "Say \"moringa helps daily energy\" — NOT \"it modulates your ATP cycling pathway\""],
            ["Premium but not cold", "Maintain respect and quality in every word choice", "Use \"terjangkau\" not \"murah\". Use \"terima kasih\" not \"makasih\""],
            ["Precise but not robotic", "Be direct and specific. Avoid filler sentences", "Do NOT say \"Pertanyaan yang bagus kak\" before answering. Just answer"],
            ["Restrained but not distant", "Treelogy does not oversell. We inform and support", "Never say \"This WILL cure.\" Say \"This supports/helps...\""],
          ] },
        ],
      },
      {
        id: "dos-and-donts",
        title: { id: "3.2 Do's dan Don'ts", en: "3.2 Do's and Don'ts" },
        blocks: [
          { type: "table", headers: ["DO ✓", "DON'T ✗"], rows: [
            ["Acknowledge the person first, then answer", "Jump straight to product info without recognition"],
            ["Use \"ya\" or \"yaa\" (max two a's) for friendliness", "Use casual abbreviations: \"tp\", \"yg\", \"dgn\", \"makasih\", \"ok\""],
            ["Use \"terima kasih\" for thanks", "Use \"makasih\" or \"thx\""],
            ["Say \"sudah tersertifikasi halal\" (halal-certified)", "Say \"bersertifikat halal\""],
            ["Say \"terdaftar di BPOM\" (BPOM-registered)", "Say \"bersertifikasi BPOM\""],
            ["Use \"available\" on most platforms (\"ready stock\" on Tokopedia)", "Say \"ada stok\" or \"masih banyak\""],
            ["Use \"terjangkau\" or \"hemat\" for pricing", "Use \"murah\" or \"cheap\""],
            ["Use \"Special Price\" / \"exclusive offers\" for promotions", "Use \"diskon\" or \"discount\" (acceptable to some extent)"],
            ["End every reply with warmth or a soft CTA", "End abruptly or with no sign-off"],
            ["Move sensitive health topics to DM", "Answer complex medical questions publicly"],
            ["Use only approved emojis", "Use emojis not on the approved list"],
            ["Support + direct: \"Treelogy supports joint comfort\"", "Claim + guarantee: \"This will fix your joint issues\""],
          ] },
        ],
      },
      {
        id: "approved-emojis",
        title: { id: "3.3 Emoji yang Disetujui", en: "3.3 Approved Emojis" },
        blocks: [
          { type: "heading", content: { id: "Emoji Utama (Balasan Publik & Captions)", en: "Main Emojis (Public Replies & Captions)" } },
          { type: "text", content: { id: "Gunakan hemat. Maksimal 1-2 per balasan di komentar publik.", en: "Use sparingly. Maximum 1-2 per reply in public comments." } },
          { type: "macro", label: { id: "Daftar Emoji Utama", en: "Main Emoji List" }, content: "☺️  🌿  🌞  🙏🏼  🌏  💧" },
          { type: "heading", content: { id: "Emoji Sekunder (DM & Non-Publik)", en: "Secondary Emojis (DM & Non-Public)" } },
          { type: "macro", label: { id: "Daftar Emoji Sekunder", en: "Secondary Emoji List" }, content: "🙌🏼  😊  🤍  🍵  😍  🥰  🤔  😔  😏  😉  😌  🤗  🥹  😅  😂  🥲  😇  😎  🧠  🍿  + semua emoji buah & sayuran" },
          { type: "warning", content: { id: "Nol emoji pada respons komplain formal. Satu emoji maksimal pada balasan pertama ke DM baru. Untuk VIP atau returning customers, 1-2 emoji sesuai.", en: "Zero emojis on formal complaint responses. One emoji maximum on first reply to a new DM. For VIP or returning customers, 1-2 emojis is appropriate." } },
        ],
      },
      {
        id: "response-macros",
        title: { id: "3.4 Macro Respons", en: "3.4 Response Macros" },
        blocks: [
          { type: "warning", content: { id: "Ini adalah titik awal. SELALU personalisasi dengan nama customer, referensi produk, dan konteks spesifik. Jangan pernah copy-paste kata per kata tanpa membaca percakapan terlebih dahulu.", en: "These are starting points. ALWAYS personalize with customer name, product reference, and specific context. Never copy-paste word by word without reading the conversation first." } },
          { type: "macro", label: { id: "MACRO 01 - Rekomendasi Produk", en: "MACRO 01 - Product Recommendation" }, content: "ID: \"Halo kak [Nama]! Terima kasih sudah menghubungi Treelogy 🌿\nUntuk kebutuhan [sebutkan kebutuhan spesifik], kami rekomendasikan [Moringa Capsules / Powder / Oil].\n[1-2 kalimat singkat mengapa produk ini cocok].\nJika ada pertanyaan atau butuh bantuan lebih lanjut, jangan ragu untuk hubungi kami kembali ☺️\"\n\nEN: \"Hi [Name]! Thank you for reaching out to Treelogy. 🌿\nFor [specific need], we recommend [product]. [1-2 sentences why it fits].\nIf you have any other questions, please feel free to let us know anytime ☺️\"" },
          { type: "macro", label: { id: "MACRO 02 - Dosis & Penggunaan", en: "MACRO 02 - Dosage & Usage" }, content: "ID (Capsules): \"Hi kak! Untuk konsumsi kapsul, dosis standarnya adalah 3 kapsul per hari, idealnya di pagi hari saat atau setelah makan 🌿\nJika baru pertama kali mengonsumsi moringa, bisa mulai dari 2 kapsul selama 3 hari pertama agar tubuh beradaptasi.\"\n\nID (Powder): \"Hi kak! Untuk konsumsi powder, takaran standarnya adalah 1/2 sendok teh per hari (sekitar 1,5 gram), idealnya di pagi hari saat atau setelah makan 🌿\nBisa dicampur ke air hangat, smoothie, atau berbagai resep lain.\"" },
          { type: "note", content: { id: "Batas dosis yang disetujui: maksimal 6 kapsul/hari, 1 sdt powder/hari. Selalu rekomendasikan mulai rendah untuk pengguna baru.", en: "Approved dose limits: max 6 capsules/day, 1 tsp powder/day. Always recommend starting low for new users." } },
          { type: "macro", label: { id: "MACRO 03 - Timeline Hasil", en: "MACRO 03 - Results Timeline" }, content: "\"Terima kasih sudah bertanya kak 🌿\nKami memahami bahwa tubuh setiap orang berbeda, namun hasil penggunaan secara umum adalah:\n\n• Hari 0-2: Tubuh mulai beradaptasi dan menyerap nutrisi. Kebanyakan orang belum merasakan apapun.\n• Hari 3-7: Kebanyakan orang mulai merasakan dampaknya — energi lebih stabil, sendi lebih nyaman, fokus lebih baik.\n• Hari 8-30: Manfaat mulai jadi kebiasaan baru tubuh. Inilah yang kami sebut Realignment.\n• Hari 31+: Treelogy menjadi bagian dari rutinitas harian serta pelindung keseimbangan tubuh kakak.\"" },
          { type: "macro", label: { id: "MACRO 04 - Keamanan / Kondisi Medis", en: "MACRO 04 - Safety / Medical Condition" }, content: "\"Halo kak [Nama], terima kasih sudah bertanya langsung sebelum mulai mengonsumsi produknya 🌿\n\nSebagai informasi, Treelogy terbuat dari 100% daun moringa organik murni tanpa tambahan bahan lain atau campuran alkohol. Jadi nutrisinya tetap utuh dan terjaga.\n\nUntuk kondisi seperti [sebutkan kondisi mereka], kami ingin memastikan kandungan nutrisi dalam produk kami tidak ada kontraindikasi dengan kondisi kesehatan kakak saat ini.\n\nKami dengan senang hati menyediakan data klinis kami untuk kakak bagikan ke tenaga medis atau spesialis sebelum memutuskan untuk mengonsumsi moringa agar lebih aman dan sesuai kebutuhan tubuh kakak.\"\n\n(kirim tabel nutrition facts)" },
          { type: "warning", content: { id: "Jangan pernah katakan \"aman untuk semua orang.\" Jangan katakan \"tanya dokter\" tanpa framing premium. Gunakan bahasa \"Professional Alignment\".", en: "Never say \"safe for everyone.\" Never say \"ask your doctor\" without the premium framing. Use \"Professional Alignment\" language." } },
          { type: "macro", label: { id: "MACRO 05 - Harga / Kenapa Lebih Mahal", en: "MACRO 05 - Pricing / Why It Costs More" }, content: "\"Hai kak, terima kasih banyak sudah menyampaikan concern kakak mengenai harga produk kami. Kami memahami jika harga Treelogy terasa lebih tinggi dibandingkan produk lain 🌿\n\nNamun, kami ingin menginformasikan bahwa semua produk di Treelogy mengandung 100% daun moringa murni tanpa campuran lain. Setiap daun dipisahkan satu per satu dari batangnya secara manual. Daun moringa dikeringkan pada suhu 38°C selama 22 jam untuk menjaga enzim dan nutrisinya tetap aktif.\n\nDan produk kami 100% organik, terdaftar di BPOM, serta diproduksi langsung di lahan sendiri di Bali sehingga harga kami mencerminkan kualitas yang bisa kakak verifikasi.\n\nAgar terasa lebih hemat, kakak bisa gunakan kode promo… [inform discount code] 🙏🏼\"" },
          { type: "macro", label: { id: "MACRO 06 - Pemesanan / Ketersediaan", en: "MACRO 06 - Order / Availability / Where to Buy" }, content: "\"Halo kak [Nama]! Untuk pembelian online, saat ini kami tersedia di beberapa platform berikut:\n\n🌿 Website: https://treelogy.com/\n🌿 Tokopedia: https://www.tokopedia.com/treelogy-moringa\n🌿 Shopee: shopee.co.id/treelogy.moringa\n🌿 TikTok Shop: https://www.tiktok.com/@treelogy.moringa\n\nBisa juga kakak memesan langsung melalui WhatsApp di +62 811-3960-3993, tim kami akan dengan senang hati membantu prosesnya ☺️\"" },
          { type: "macro", label: { id: "MACRO 07 - Pengakuan Komplain (Respons Pertama)", en: "MACRO 07 - Complaint Acknowledgment (First Response)" }, content: "\"Halo kak [Nama], terima kasih sudah menghubungi Treelogy. Kami meminta maaf atas kendala dan ketidaknyamanan yang sudah kakak alami. Tentu ini bukan merupakan pengalaman yang kami harapkan akan terjadi kepada kakak 🙏🏼\n\nKami ingin memastikan kendala ini ditangani dengan baik ya kak. Jika berkenan, apakah kakak bersedia untuk menceritakan lebih detail agar kami bisa segera bantu cek dan teruskan ke tim terkait.\n\nTim kami akan segera menindaklanjuti setelah kami verifikasi detailnya. Terima kasih banyak atas kesabaran dan pengertiannya kak ☺️\"" },
          { type: "warning", content: { id: "Ini HANYA respons pertama. JANGAN tawarkan solusi dulu. Teruskan ke Ecom Specialist terlebih dahulu.", en: "This is ONLY the first response. Do NOT offer a solution yet. Forward to Ecom Specialist first." } },
          { type: "macro", label: { id: "MACRO 08 - Testimoni / Review Positif", en: "MACRO 08 - Testimonial / Positive Review Response" }, content: "\"Terima kasih banyak sudah berkenan untuk meluangkan waktu dan membagikan pengalaman kakak bersama Treelogy 🌿\n\nKami ikut senang mendengar produk kami dapat memberikan manfaat pada kesehatan tubuh kakak [sebutkan manfaat spesifik yang mereka rasakan]. Cerita seperti ini adalah alasan kami terus berkomitmen pada setiap tahapan dan proses yang kami jaga.\n\nSemoga terus berlanjut dan produk kami bisa mendukung kesehatan tubuh kakak terus membaik secara bertahap ya 🌞\"" },
        ],
      },
      {
        id: "good-bad-examples",
        title: { id: "3.5 Contoh Respons Baik vs Buruk", en: "3.5 Good vs. Bad Response Examples" },
        blocks: [
          { type: "heading", content: { id: "Contoh 1 — Pertanyaan Dosis", en: "Example 1 — Dosage Question" } },
          { type: "example", bad: "\"3 kapsul ya sehari, bisa dicoba dulu. Kalau ada efek samping hubungi dokter.\"", badReason: { id: "Tidak ada kehangatan. Tidak ada personalisasi. Terasa seperti label peringatan, bukan brand. Langsung merujuk \"dokter\".", en: "No warmth. No personalization. Feels like a warning label, not a brand. Refers to \"doctor\" immediately." }, good: "\"Halo kak! Untuk konsumsi kapsul, dosis hariannya adalah 3 kapsul di pagi hari dan dikonsumsi saat atau setelah makan. Jika baru memulai, kami sarankan untuk 2 kapsul terlebih dahulu selama 3 hari pertama agar tubuh bisa beradaptasi 🌿\"", goodReason: { id: "Pembuka hangat. Spesifik dan actionable. Fase transisi disebutkan. Penutup hangat dengan undangan melanjutkan.", en: "Warm open. Specific and actionable. Transition phase mentioned. Warm close with invitation to continue." } },
          { type: "heading", content: { id: "Contoh 2 — Keberatan Harga", en: "Example 2 — Price Objection" } },
          { type: "example", bad: "\"Harganya memang segitu karena produk kami premium. Silakan cek website kami ya.\"", badReason: { id: "Defensif dan dingin. \"Segitu\" dismissif. Tidak ada edukasi, tidak ada kehangatan.", en: "Defensive and cold. \"Segitu\" is dismissive. No education, no warmth." }, good: "\"Kami memahami kalau harganya terasa tinggi dibandingkan produk sejenis. 🌿 Perbedaannya ada pada prosesnya, setiap daun dipisahkan satu per satu, dikeringkan di suhu terkontrol, dan diproduksi di lahan sendiri. Boleh kami bantu dengan informasi lebih lanjut kak? 🙏🏼\"", goodReason: { id: "Mengakui concern. Mengedukasi dengan fakta. Mengundang engagement lebih lanjut. Premium tapi manusiawi.", en: "Acknowledges the concern. Educates with facts. Invites further engagement. Premium but human." } },
        ],
      },
    ],
  },
  {
    id: "logging-data",
    number: "4",
    title: { id: "Logging & Struktur Data", en: "Logging & Data Structure" },
    description: { id: "Sederhana, scalable, dan benar-benar bisa digunakan", en: "Simplified, scalable, and actually usable" },
    subsections: [
      {
        id: "logging-rules",
        title: { id: "4.1 Aturan Logging", en: "4.1 Logging Time Reduction" },
        blocks: [
          { type: "note", content: { id: "Prinsip inti: Hanya log percakapan yang memiliki signal value. Tidak setiap \"di mana belinya?\" perlu 8 kolom diisi. Log pertanyaan yang mengungkapkan friction, keinginan, kebingungan, atau peluang.", en: "Core principle: Only log conversations that carry signal value. Not every \"where to buy?\" needs 8 columns filled. Log questions that reveal friction, desire, confusion, or opportunity." } },
          { type: "bullets", items: {
            id: [
              "Aturan 1: Batch log, jangan live log. Log di akhir setiap siklus cek (3 jam), bukan setelah setiap balasan individual",
              "Aturan 2: Pertanyaan FAQ = 3 kolom saja. Untuk pertanyaan Tier 1 yang sudah tercakup FAQ: log hanya Origin, Date, dan Friction Point. Lewati Screenshot jika pertanyaan standar",
              "Aturan 3: Screenshot selektif. Hanya screenshot: testimoni, komplain, pertanyaan tidak biasa, apapun dengan content gap atau potensi nilai iklan",
              "Aturan 4: Testimoni selalu mendapat full log. Setiap testimoni atau review positif: full log dengan semua kolom + golden nugget extraction",
            ],
            en: [
              "Rule 1: Batch log, don't live log. Log at end of each 3-hour check cycle, not after every individual reply",
              "Rule 2: FAQ questions = 3 columns only. For Tier 1 covered by FAQ: log only Origin, Date, and Friction Point. Skip Screenshot for standard questions",
              "Rule 3: Screenshot selectively. Only screenshot: testimonials, complaints, unusual questions, anything with content gap or ad value",
              "Rule 4: Testimonials always get full log. Every positive testimonial/review: full log with all columns + golden nugget extraction",
            ],
          } },
        ],
      },
      {
        id: "sheet-structure",
        title: { id: "4.2 Struktur Sheet yang Disederhanakan", en: "4.2 Simplified Sheet Structure" },
        blocks: [
          { type: "heading", content: { id: "Sheet 1 - Questions Log (Restruktur)", en: "Sheet 1 - Questions Log (Restructured)" } },
          { type: "bullets", items: {
            id: [
              "Pertahankan semua kolom yang ada. Tidak menghapus apapun",
              "Tambah kolom PRIORITY: High / Medium / Low. High = content gap + friction tinggi. Low = sudah dijawab FAQ",
              "Arsipkan baris lebih dari 90 hari ke tab \"Archive\" terpisah — jaga sheet utama di bawah 200 baris aktif",
              "Tambah kolom MACRO USED — catat nomor macro yang digunakan (M03). Membantu tracking macro mana yang berjalan baik",
              "Color-code berdasarkan Friction Point menggunakan conditional formatting. Saran: Safety = merah, Premium Positioning = oranye, Usage = kuning, Logistics = biru",
            ],
            en: [
              "Keep all existing columns. Remove none",
              "Add PRIORITY column: High / Medium / Low. High = content gap + high friction. Low = already answered by FAQ",
              "Archive rows older than 90 days to separate \"Archive\" tab — keep main sheet under 200 active rows",
              "Add MACRO USED column — note which macro number was used (M03). Helps track which macros work",
              "Color-code by Friction Point using conditional formatting. Suggested: Safety = red, Premium Positioning = orange, Usage = yellow, Logistics = blue",
            ],
          } },
          { type: "heading", content: { id: "Sheet 2 - Reviews Log (Restruktur)", en: "Sheet 2 - Reviews Log (Restructured)" } },
          { type: "bullets", items: {
            id: [
              "Pertahankan semua kolom yang ada. Tambah: kolom AD READY (Yes / No / Pending) dan FOLLOW-UP NEEDED (Yes / No)",
              "\"Yes\" = golden nugget diekstrak dan disetujui untuk marketing. \"Pending\" = perlu review lebih lanjut",
              "FOLLOW-UP NEEDED untuk review 2-star dan 1-star yang perlu tindak lanjut CX team",
            ],
            en: [
              "Keep all existing columns. Add: AD READY column (Yes / No / Pending) and FOLLOW-UP NEEDED (Yes / No)",
              "\"Yes\" = golden nugget extracted and approved for marketing. \"Pending\" = needs more review",
              "FOLLOW-UP NEEDED for 2-star and 1-star reviews needing CX team follow-through",
            ],
          } },
          { type: "heading", content: { id: "Sheet 3 - Weekly Pulse (Baru)", en: "Sheet 3 - Weekly Pulse (New)" } },
          { type: "text", content: { id: "Menggantikan kebutuhan ringkasan manual. Isi setiap Jumat. Maksimal 10 baris.", en: "Replaces the need for manual summaries. Fill out every Friday. 10 rows maximum." } },
          { type: "table", headers: ["Field", "What to Log"], rows: [
            ["Week", "Date range of the reporting week"],
            ["Total Messages", "Approximate total across all channels"],
            ["Top Friction 1-3", "Most common question types this week"],
            ["Escalations", "Number of Tier 3 escalations"],
            ["Tone Audit Score", "% of reviewed replies passing Tone Litmus Test"],
            ["Content Gaps Found", "Number of new content gaps identified"],
            ["Golden Nuggets", "Number of ad-ready testimonials collected this week"],
            ["Notes", "One sentence observation for founder"],
          ] },
        ],
      },
    ],
  },
  {
    id: "performance",
    number: "5",
    title: { id: "Performa & Visibilitas", en: "Performance & Visibility" },
    description: { id: "Apa yang diukur dan bagaimana kita tetap jujur", en: "What to measure and how we stay honest" },
    subsections: [
      {
        id: "core-metrics",
        title: { id: "5.1 Metrik Inti", en: "5.1 Core Metrics" },
        blocks: [
          { type: "table", headers: ["Metric", "Definition", "Target"], rows: [
            ["First Response Time (FRT)", "Time from message received to first reply", "< 2h (DM/Comment), < 1h (Ecom), < 6h (Email)"],
            ["Response Rate", "% of messages replied within SLA", "95%+"],
            ["Tone Compliance Score", "% of audited replies passing Tone Litmus Test", "90%+"],
            ["Content Gap Rate", "% of logged questions flagged as content gap", "Track trend (rising = action needed)"],
            ["Testimonial Collection", "Number of testimonials logged per week", "Minimum 5/week"],
            ["Golden Nugget Extraction", "% of logged testimonials with golden nugget extracted", "100%"],
            ["Escalation Volume", "Number of Tier 3 escalations per week", "Track trend (rising = product/process issue)"],
            ["Macro Usage Rate", "% of replies using a macro as base", "70%+ (low usage = macros need updating)"],
          ] },
        ],
      },
      {
        id: "revenue-signals",
        title: { id: "5.2 Percakapan Berdampak Revenue", en: "5.2 Revenue-Impacting Conversations" },
        blocks: [
          { type: "text", content: { id: "Tidak semua percakapan sama. Tipe sinyal ini memiliki korelasi tertinggi dengan keputusan pembelian:", en: "Not all conversations are equal. These signal types have the highest correlation to purchase decisions:" } },
          { type: "bullets", items: {
            id: [
              "Customer menanyakan link produk (niat beli langsung)",
              "Customer bertanya \"apakah tersedia?\" atau \"ada stok?\" — stock inquiry dengan niat",
              "Customer membandingkan Treelogy dengan brand lain — mereka sedang memutuskan",
              "Customer bertanya tentang bundle atau harga bulk",
              "Customer bilang \"mau coba dulu\" — pembeli pertama kali",
              "Customer kembali setelah gap 3+ bulan tanpa pembelian — risiko churn",
            ],
            en: [
              "Customer asks for product link (direct purchase intent)",
              "Customer asks \"is it available?\" or \"any stock?\" — stock inquiry with intent",
              "Customer compares Treelogy to another brand — they are deciding",
              "Customer asks about bundles or bulk pricing",
              "Customer says \"want to try first\" — first-time buyer",
              "Customer returns after 3+ month gap without purchasing — churn risk",
            ],
          } },
          { type: "note", content: { id: "Saat menemukan percakapan berdampak revenue: tambahkan tag Revenue Signal di kolom Notes pada log. Track berapa banyak revenue signal yang dikonversi ke pembelian per bulan (perlu koordinasi dengan tim Ecom untuk data order).", en: "When you spot a revenue-impacting conversation: add a Revenue Signal tag in the Notes column of the log. Track how many revenue signals are converted to purchases per month (requires coordination with Ecom team on order data)." } },
        ],
      },
    ],
  },
  {
    id: "risk-prevention",
    number: "6",
    title: { id: "Risiko & Pencegahan Kegagalan", en: "Risk & Failure Prevention" },
    description: { id: "Ketahui mode kegagalan sebelum terjadi", en: "Know the failure modes before they happen" },
    subsections: [
      {
        id: "risk-matrix",
        title: { id: "6.1 Matriks Risiko Operasional", en: "6.1 Operational Risk Matrix" },
        blocks: [
          { type: "table", headers: ["Risk", "Likelihood", "Prevention", "Backup"], rows: [
            ["Meta ads comments hidden by filtering", "High", "Daily manual check of each active ad permalink in Ads Manager", "Cross-check ads library weekly"],
            ["Spam/gambling comments on posts", "High", "Immediate hide. Do not engage. Check every 3-hour cycle", "Enable keyword filter in Meta moderation"],
            ["Missed DMs during peak volume", "Medium", "Meta inbox \"Message Requests\" folder check daily + IG app", "Backup Sales team covers if unavailable"],
            ["Wrong/outdated product info in reply", "Medium", "Cross-reference Claims Playbook before answering health claims", "Say \"Boleh kami konfirmasikan dulu\" and check internally"],
            ["Tone inconsistency between channels", "Medium", "Weekly tone audit. Macro usage. Monthly SOP review", "Flag in weekly report to Founder"],
            ["Complaint not escalated in time", "Low-Med", "Tier classification at message receipt. Tier 3 = escalate within 2 hours", "Direct WhatsApp to Ecom Specialist"],
            ["Medical/legal risk claim", "Low", "Professional Alignment pivot. Never diagnose or promise cure", "Escalate immediately to Ecom Specialist + Founder"],
            ["Unauthorized repost of UGC", "Low", "Thank the creator for mention. That's it.", "If creator objects: remove immediately and apologize"],
          ] },
        ],
      },
      {
        id: "what-if-protocols",
        title: { id: "6.2 Protokol \"Bagaimana Jika\"", en: "6.2 \"What If\" Protocols" },
        blocks: [
          { type: "heading", content: { id: "Jika sakit atau tidak tersedia?", en: "What if I'm sick or unavailable?" } },
          { type: "bullets", items: {
            id: [
              "Notifikasi HR dan Ecom Specialist minimal 3 jam sebelum mulai hari",
              "Dokumen handoff: list semua percakapan terbuka dengan status (replied / waiting / escalated)",
              "Sales Team atau Ecom Specialist menangani Tier 1-2 di semua channel",
              "Ketidaktersediaan akhir pekan: notifikasi Jumat sore dengan percakapan terbuka yang pending",
            ],
            en: [
              "Notify HR and Ecom Specialist at least 3 hours before start of day",
              "Handoff document: list all open conversations with status (replied / waiting / escalated)",
              "Sales Team or Ecom Specialist handle Tier 1-2 on all channels",
              "Weekend unavailability: notify by Friday EOD with any pending open conversations",
            ],
          } },
          { type: "heading", content: { id: "Jika anggota baru bergabung?", en: "What if a new person joins?" } },
          { type: "bullets", items: {
            id: [
              "Dokumen SOP ini bisa digunakan sebagai onboarding mereka. Walk-through dalam 2 hari pertama",
              "Assign channel ownership split berdasarkan kekuatan: outreach eksternal vs. penanganan respons",
              "Bangun periode overlap 2 minggu di mana kedua orang melihat semua percakapan sebelum memisah",
              "Buat catatan handoff di akhir setiap hari selama bulan pertama",
            ],
            en: [
              "This SOP document is their onboarding. Walk through in first 2 days",
              "Assign channel ownership split based on strengths: external outreach vs. response handling",
              "Build 2-week overlap period where both people see all conversations before splitting",
              "Create handoff note at end of each day during the first month",
            ],
          } },
          { type: "heading", content: { id: "Jika Meta mengalami outage teknis?", en: "What if Meta has a technical outage?" } },
          { type: "bullets", items: {
            id: [
              "Eskalasi ke Founder jika outage lebih dari 4 jam saat hari kerja",
              "WhatsApp B2C menjadi channel utama untuk query customer mendesak saat itu",
              "Log semua percakapan yang terlewat secara retroaktif ketika sistem pulih",
            ],
            en: [
              "Escalate to Founder if outage is longer than 4 hours during business day",
              "WhatsApp B2C becomes primary channel for urgent customer queries at the moment",
              "Log all missed conversations retroactively when system recovers",
            ],
          } },
        ],
      },
    ],
  },
  {
    id: "implementation",
    number: "7",
    title: { id: "Rencana Implementasi", en: "Implementation Plan" },
    description: { id: "Apa yang dibangun, kapan, dan dalam urutan apa", en: "What to build, when, and in what order" },
    subsections: [
      {
        id: "phases",
        title: { id: "7.1 Fase Implementasi", en: "7.1 Implementation Phases" },
        blocks: [
          { type: "heading", content: { id: "Fase 0 (Selesai): Minggu 1-2 — Observasi & Pemetaan", en: "Phase 0 (Done): Weeks 1-2 — Observation & Mapping" } },
          { type: "bullets", items: { id: ["Channel dipetakan. Pain points diidentifikasi", "Kontak tim didokumentasikan", "Masalah komentar Meta ads diidentifikasi dan root cause dikonfirmasi", "Sistem logging saat ini dianalisis", "Dokumen brand direview. Nada dipahami"], en: ["Channels mapped. Pain points identified", "Team contacts documented", "Meta ads comment issue identified and root cause confirmed", "Current logging system analyzed", "Brand documents reviewed. Tone understood"] } },
          { type: "heading", content: { id: "Fase 1 (Saat ini): Minggu 3-4 — Strukturisasi & Testing", en: "Phase 1 (Current): Weeks 3-4 — Structuring & Testing" } },
          { type: "bullets", items: { id: ["Implementasi dokumen SOP ini sebagai standar operasi harian", "Setup channel ownership dengan jelas. Komunikasikan ke Sales Team dan Ecom Specialist", "Mulai pengecekan manual komentar Meta ads harian", "Print atau bookmark Macro Bank. Mulai gunakan macro untuk semua balasan standar", "Restruktur sheet Customer Questions Log: tambah kolom Priority, Platform, dan Macro Used", "Jalankan Weekly Pulse pertama (Sheet 3). Lengkapi semua 10 field", "Lakukan Weekly Tone Audit pertama — 10 balasan direview", "Kirim Laporan Mingguan pertama ke Founder (Senin pagi)"], en: ["Implement this SOP document as daily operating standard", "Set up channel ownership clearly. Communicate to Sales Team and Ecom Specialist", "Begin daily manual Meta ads comment check", "Print or bookmark Macro Bank. Begin using macros for all standard replies", "Restructure Customer Questions Log sheet: add Priority, Platform, and Macro Used columns", "Run first Weekly Pulse (Sheet 3). Complete all 10 fields", "Complete first Weekly Tone Audit — 10 replies reviewed", "Send first structured Weekly Report to Founder (Monday morning)"] } },
          { type: "heading", content: { id: "Fase 2: Bulan 2 — Implementasi & Optimisasi", en: "Phase 2: Month 2 — Implementation & Optimization" } },
          { type: "bullets", items: { id: ["Onboarding anggota tim baru: walk-through SOP ini dalam 2 hari pertama", "Assign channel split awal. Bangun periode overlap 2 minggu", "Laporan Bulanan pertama ke Founder dan Ecom Specialist", "Macro bank versi 2: update macro yang underperform di Bulan 1", "Ajukan: satu improvement pada sistem logging berdasarkan 4 minggu data"], en: ["New team member onboarding: walk through this SOP in first 2 days", "Assign preliminary channel split. Build 2-week overlap period", "First Monthly Report delivered to Founder and Ecom Specialist", "Macro bank version 2: update any macros that underperformed in Month 1", "Propose: one improvement to logging system based on 4 weeks of data"] } },
          { type: "heading", content: { id: "Fase 3: Bulan 3+ — Optimisasi Lanjutan", en: "Phase 3: Month 3+ — Optimization" } },
          { type: "bullets", items: { id: ["Evaluasi kelayakan CRM tool (Notion CRM, Airtable, atau Google Sheets terstruktur). Saat ini observasi Mekari Qontak", "Bangun daftar VIP customer dan ritme follow-up proaktif 3 bulan", "Buat laporan content gap untuk website dan tim social berdasarkan 3 bulan pertanyaan tercatat", "Tetapkan rotasi coverage akhir pekan antar anggota tim", "Review dan update dokumen SOP. Versi 2.0 di akhir Bulan 3"], en: ["Evaluate CRM tool feasibility (Notion CRM, Airtable, or restructured Google Sheets). Currently observing Mekari Qontak", "Build VIP customer list and proactive 3-month follow-up rhythm", "Create content gap report for website and social team based on 3 months of logged questions", "Establish weekend coverage rotation between team members", "Review and update SOP document. Version 2.0 by end of Month 3"] } },
          { type: "note", content: { id: "Ritme bulanan: Setiap Jumat pertama, kirim Laporan Bulanan. Setiap Jumat terakhir, review dan update SOP atau macro bank. Jaga sistem tetap hidup.", en: "Monthly rhythm: Every first Friday, deliver Monthly Report. Every last Friday, review and update SOP or macro bank. Keep the system alive." } },
        ],
      },
    ],
  },
  {
    id: "scheduling",
    number: "8",
    title: { id: "Jadwal & Coverage 7 Hari", en: "7-Day Coverage & Scheduling" },
    description: { id: "Jadwal operasi harian yang sustainable", en: "Sustainable daily operations schedule" },
    subsections: [
      {
        id: "weekly-schedule",
        title: { id: "8.1 Jadwal Mingguan", en: "8.1 Weekly Schedule" },
        blocks: [
          { type: "table", headers: ["Day", "Check Times", "Priority Task", "Admin Task"], rows: [
            ["Monday", "09:00, 12:00, 15:00, 18:00", "Full channel check + reply all pending", "Write & send Weekly Report to Founder"],
            ["Tuesday", "09:00, 12:00, 15:00, 18:00", "Channel monitoring + replies", "Update log sheet (batch)"],
            ["Wednesday", "09:00, 12:00, 15:00, 18:00", "Channel monitoring + replies", "Ads comment manual check — mid-week gap check"],
            ["Thursday", "09:00, 12:00, 15:00, 18:00", "Channel monitoring + replies", "Golden nugget extraction from reviews"],
            ["Friday", "09:00, 12:00, 15:00, 18:00", "Channel monitoring + replies", "Weekly Tone Audit (30 min) + Weekly Pulse Sheet"],
            ["Saturday", "10:00, 16:00", "Monitor only. Reply urgent messages", "No full logging required"],
            ["Sunday", "10:00, 16:00", "Monitor only. Reply urgent messages", "No full logging required"],
          ] },
        ],
      },
      {
        id: "time-budget",
        title: { id: "8.2 Budget Waktu Harian", en: "8.2 Daily Time Budget" },
        blocks: [
          { type: "table", headers: ["Task", "Time Estimate"], rows: [
            ["Channel monitoring (4 check cycles)", "~40 min total/day"],
            ["Replying to messages + comments", "~90-120 min total/day"],
            ["Batch logging (end of day)", "~30 min/day"],
            ["Ads comment manual check", "~30 min/day"],
            ["Email check and reply", "~30 min/day"],
            ["Weekly Tone Audit (Friday only)", "~60 min/Friday"],
            ["Weekly Pulse + Report (Monday/Friday)", "~60 min each"],
            ["TOTAL DAILY (weekday)", "~6-7 hours"],
          ] },
        ],
      },
      {
        id: "two-person-team",
        title: { id: "8.3 Coverage Tim Dua Orang", en: "8.3 Two-Person Team Coverage" },
        blocks: [
          { type: "table", headers: ["Role", "Scope"], rows: [
            ["Frontline Ops Lead", "Social media channels (IG, FB, TikTok), Shopify order tracking, WhatsApp B2C, Email, SOP management, weekly reporting"],
            ["New Team Member", "External outreach, UGC handling, KOL triage, VIP follow-up pipeline, partnership/KOL pipeline support"],
            ["Shared Responsibility", "Weekend monitoring rotation (alternate weekends). Emergency backup for each other's channels"],
          ] },
          { type: "note", content: { id: "Protokol Handoff: Quick WhatsApp di akhir hari ke satu sama lain: \"Open conversations: X. Urgent: Y. Pending log: Z.\"", en: "Handoff Protocol: End-of-day quick WhatsApp to each other: \"Open conversations: X. Urgent: Y. Pending log: Z.\"" } },
          { type: "heading", content: { id: "Standar Coverage Akhir Pekan", en: "Weekend Coverage Standard" } },
          { type: "bullets", items: {
            id: [
              "Kedua anggota tim berbagi monitoring akhir pekan secara merata (bergantian: A Sabtu-Minggu satu minggu, B minggu berikutnya)",
              "SLA akhir pekan: balas dalam 6 jam selama 10:00-18:00 WIB. Tidak ada ekspektasi di luar jam tersebut",
              "Monitoring akhir pekan hanya untuk balasan mendesak, bukan full logging. Log di hari kerja berikutnya",
              "Coverage hari libur: sama seperti standar akhir pekan kecuali peak campaign sedang berjalan (Founder konfirmasi coverage terlebih dahulu)",
            ],
            en: [
              "Both team members share weekend monitoring equally (alternate: A covers Sat-Sun one week, B the next)",
              "Weekend SLA: reply within 6 hours during 10:00-18:00 WIB. No expectation outside those hours",
              "Weekend monitoring is for urgent replies only, not full logging. Log the next working day",
              "Holiday coverage: same as weekend standard unless peak campaign is running (Founder confirms coverage in advance)",
            ],
          } },
        ],
      },
    ],
  },
];

export function getPlaybookSection(id) {
  return playbookSections.find((s) => s.id === id);
}

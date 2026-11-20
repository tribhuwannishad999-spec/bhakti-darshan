# Bhakti Darshan: सेटअप गाइड (सरल हिंदी)

> स्थिति: यह **चरण 2 का शुरुआती संस्करण** है। इसकी `npm install` और `npm run build` जाँच मेरे वातावरण में इंटरनेट बंद होने से **नहीं हो सकी**। पहला build Vercel पर होगा; यदि error आए तो उसका संदेश मुझे भेजें, मैं ठीक करूँगा।

## क्या काम करता है (कोड में लिखा है)
- पूरी स्क्रीन मंत्र बबल गेम (मोबाइल की पहली स्क्रीन पर केवल गेम), नीचे धनपात्र और 8 सेक्शन, हिंदी/English स्विचर
- कथा सूची, खोज, श्रेणी, वीडियो पेज (YouTube/वीडियो फ़ाइल, autoplay नहीं)
- मालिक लॉगिन और कथा जोड़ने/प्रकाशित/हटाने का पैनल (`/owner`)
- Supabase डेटाबेस और RLS (`supabase/migrations/0001_init.sql`), दान तालिकाएँ पूरी तरह निजी
- रोज़ 4:00 IST का cron ढाँचा, संपर्क फ़ॉर्म, robots और sitemap

## अधूरा (अभी जानबूझकर नहीं बनाया)
- पंचांग/राशिफल/कुंडली: API के असली डॉक्स देखकर चरण 4 में
- UPI/भुगतान और webhook सत्यापन: आपके विवरण के बाद चरण 5 में (अभी "भुगतान व्यवस्था जल्द उपलब्ध होगी।")
- हस्तरेखा, व्रत, त्योहार, मंदिर, भजन प्लेयर के पूरे पेज: चरण 3
- मंत्र ऑडियो: `public/audio/` में आपकी रिकॉर्डिंग चाहिए
- नीति पेज प्रारूप हैं; प्रकाशन से पहले जाँचें

## चरण 1: GitHub पर अपलोड
1. github.com पर `bhakti-darshan` नाम का नया खाली repository बनाएँ।
2. ZIP को कंप्यूटर में Extract करें।
3. Repository में **Add file → Upload files** दबाएँ, Extract किए फ़ोल्डर की **अंदर की सभी फ़ाइलें और फ़ोल्डर** खींचकर डालें, फिर **Commit changes**।
(`.env.local` कभी अपलोड न करें।)

## चरण 2: Supabase (मुफ़्त)
1. supabase.com पर नया project बनाएँ।
2. **SQL Editor** में `supabase/migrations/0001_init.sql` की पूरी सामग्री चिपकाकर Run करें।
3. **Authentication → Users → Add user** से अपना ईमेल/पासवर्ड बनाएँ।
4. SQL Editor में चलाएँ (ईमेल अपना डालें):
   `insert into owners select id from auth.users where email = 'आपका@ईमेल';`
5. **Project Settings → API** से URL, anon key और service_role key नोट करें।

## चरण 3: Vercel
1. vercel.com → **Add New → Project** → GitHub से `bhakti-darshan` चुनें।
2. **Environment Variables** में `.env.example` के नाम भरें: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `CRON_SECRET` (कोई लंबा random पासवर्ड)।
3. **Deploy** दबाएँ। पुरानी साइट का domain तब तक न बदलें जब तक आप स्वीकृति न दें।
4. जाँच: होमपेज मोबाइल पर खोलें, `/owner` में लॉगिन करके दो कथा जोड़ें, फिर `/katha` देखें।

## कंप्यूटर पर चलाना (वैकल्पिक)
`.env.example` को `.env.local` नाम से कॉपी करके values भरें, फिर `npm install` और `npm run dev`।

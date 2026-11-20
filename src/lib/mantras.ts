export type Mantra = { id: string; text: string; color: string };
// हर मंत्र की ऑडियो फ़ाइल: public/audio/<id>.mp3 (आप अपनी रिकॉर्डिंग यहाँ रखेंगे)
export const MANTRAS: Mantra[] = [
  { id: "om-namah-shivaya", text: "ॐ नमः शिवाय", color: "#E8751A" },
  { id: "jai-shri-ram", text: "जय श्रीराम", color: "#D4A017" },
  { id: "om-namo-bhagavate-vasudevaya", text: "ॐ नमो भगवते वासुदेवाय", color: "#5B3A8C" },
  { id: "jai-shri-krishna", text: "जय श्रीकृष्ण", color: "#2F7D8C" },
  { id: "om-hanumate-namah", text: "ॐ हनुमते नमः", color: "#C8401E" },
  { id: "om-gam-ganapataye-namah", text: "ॐ गं गणपतये नमः", color: "#B8336A" },
  { id: "jai-mata-di", text: "जय माता दी", color: "#A31621" },
  { id: "om-namo-narayanaya", text: "ॐ नमो नारायणाय", color: "#3E6FB0" },
  { id: "om-suryaya-namah", text: "ॐ सूर्याय नमः", color: "#E09F1F" },
  { id: "om-shanaishcharaya-namah", text: "ॐ शनैश्चराय नमः", color: "#4A4E69" },
];

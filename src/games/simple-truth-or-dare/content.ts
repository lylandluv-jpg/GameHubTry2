// Content provider for Simple Truth or Dare (English + Hindi)

export interface SimpleTruthOrDareCard {
  id: number;
  truth: string;
  dare: string;
}

type Locale = 'en' | 'hi';

/**
 * English card data
 */
export const DATA: SimpleTruthOrDareCard[] = [
  { id: 1, truth: 'When was the last time you cried?', dare: 'Do 10 pushups.' },
  { id: 2, truth: 'Who is your secret crush?', dare: 'Let the group DM someone on your Instagram.' },
  { id: 3, truth: 'What is your biggest fear?', dare: 'Sing a song loudly for 15 seconds.' },
  { id: 4, truth: 'What is your most embarrassing moment?', dare: 'Do your best celebrity impression.' },
  { id: 5, truth: 'Have you ever lied to get out of trouble?', dare: 'Let the group look through your phone for 1 minute.' },
  { id: 6, truth: 'What is your guilty pleasure?', dare: 'Talk in an accent for the next 3 rounds.' },
  { id: 7, truth: 'What is the worst gift you have ever received?', dare: 'Do your best dance move.' },
  { id: 8, truth: 'What is your favorite childhood memory?', dare: 'Eat a spoonful of a condiment of the group\'s choice.' },
  { id: 9, truth: 'Have you ever cheated on a test?', dare: 'Tell a joke. If no one laughs, drink.' },
  { id: 10, truth: 'What is the most childish thing you still do?', dare: 'Let someone draw on your face with a pen.' },
  { id: 11, truth: 'What is your biggest pet peeve?', dare: 'Do 20 jumping jacks.' },
  { id: 12, truth: 'Have you ever pretended to like a gift you hated?', dare: 'Send a text to your mom saying "I love you" right now.' },
  { id: 13, truth: 'What is something you have never told anyone?', dare: 'Let someone post a status on your social media.' },
  { id: 14, truth: 'Who in this group would you trust with your biggest secret?', dare: 'Sing the chorus of your favorite song.' },
  { id: 15, truth: 'What is the nicest thing someone in this group has done for you?', dare: 'Do a cartwheel or attempt one.' },
  { id: 16, truth: 'Have you ever talked behind someone in this group\'s back?', dare: 'Let someone go through your search history for 30 seconds.' },
  { id: 17, truth: 'Who in this group would you want to be stranded on an island with?', dare: 'Give your phone to someone and let them text anyone they want.' },
  { id: 18, truth: 'What is the most annoying habit someone in this group has?', dare: 'Share your most embarrassing photo on social media.' },
  { id: 19, truth: 'Who in this group is most likely to become famous?', dare: 'Do an impression of someone in the group.' },
  { id: 20, truth: 'Have you ever been jealous of someone in this group?', dare: 'Let someone post anything on your social media.' },
  { id: 21, truth: 'Who in this group would you want as a roommate?', dare: 'Tell everyone what you really think of them.' },
  { id: 22, truth: 'What is the biggest lie you have told to someone in this group?', dare: 'Show your last 5 text messages to the person next to you.' },
  { id: 23, truth: 'What was your first impression of your partner?', dare: 'Let someone choose your outfit for tomorrow.' },
  { id: 24, truth: 'What is the most romantic thing your partner has done for you?', dare: 'Do your best celebrity impression.' },
  { id: 25, truth: 'What is your partner\'s most annoying habit?', dare: 'Give your partner a massage for 2 minutes.' },
  { id: 26, truth: 'Have you ever considered breaking up?', dare: 'Slow dance with your partner for one song.' },
  { id: 27, truth: 'What is your favorite thing about your partner?', dare: 'Feed your partner a piece of food.' },
  { id: 28, truth: 'What is something you wish your partner would change?', dare: 'Whisper something romantic in your partner\'s ear.' },
  { id: 29, truth: 'What is your partner\'s best quality?', dare: 'Let your partner style your hair.' },
  { id: 30, truth: 'Have you ever kept a secret from your partner?', dare: 'Do your partner\'s favorite activity with them.' },
  { id: 31, truth: 'What is your favorite memory with your partner?', dare: 'Give your partner a piggyback ride.' },
  { id: 32, truth: 'What is something you have always wanted to tell your partner but haven\'t?', dare: 'Tell your partner 5 things you love about them.' },
  { id: 33, truth: 'What is the wildest thing you have ever done at a party?', dare: 'Do your best party trick.' },
  { id: 34, truth: 'Have you ever danced on a table?', dare: 'Dance with no music for 30 seconds.' },
  { id: 35, truth: 'What is the most embarrassing thing that has happened to you while drunk?', dare: 'Do your best karaoke performance.' },
  { id: 36, truth: 'Have you ever kissed someone you just met?', dare: 'Chug your drink.' },
  { id: 37, truth: 'What is the craziest thing you have done for attention?', dare: 'Do a shot of the group\'s choice.' },
  { id: 38, truth: 'Have you ever been kicked out of a bar or club?', dare: 'Let someone pour a shot down your throat.' },
  { id: 39, truth: 'What is the most trouble you have ever gotten into?', dare: 'Take a body shot from someone.' },
  { id: 40, truth: 'Have you ever done something illegal at a party?', dare: 'Let someone choose your next drink.' },
  { id: 41, truth: 'What is your biggest party foul?', dare: 'Take a drink every time someone says your name for the next 5 minutes.' },
  { id: 42, truth: 'Have you ever hooked up with someone at a party and regretted it?', dare: 'Do a keg stand (or pretend to).' }
];

/**
 * Hindi card data (हिंदी)
 */
export const DATA_HI: SimpleTruthOrDareCard[] = [
  { id: 1, truth: 'आखिरी बार आप कब रोए थे?', dare: '10 पुश-अप्स करो।' },
  { id: 2, truth: 'आपका सीक्रेट क्रश कौन है?', dare: 'ग्रुप को अपने इंस्टाग्राम पर किसी को DM करने दो।' },
  { id: 3, truth: 'आपका सबसे बड़ा डर क्या है?', dare: '15 सेकंड तक जोर से गाना गाओ।' },
  { id: 4, truth: 'आपका सबसे शर्मनाक पल क्या था?', dare: 'अपना सबसे अच्छा सेलिब्रिटी इंप्रेशन दो।' },
  { id: 5, truth: 'क्या आपने कभी मुसीबत से बचने के लिए झूठ बोला है?', dare: 'ग्रुप को 1 मिनट के लिए अपना फोन देखने दो।' },
  { id: 6, truth: 'आपकी गुप्त खुशी क्या है?', dare: 'अगले 3 राउंड तक एक्सेंट में बात करो।' },
  { id: 7, truth: 'आपको अब तक का सबसे बुरा गिफ्ट क्या मिला?', dare: 'अपना सबसे अच्छा डांस मूव दिखाओ।' },
  { id: 8, truth: 'आपकी पसंदीदा बचपन की याद क्या है?', dare: 'ग्रुप की पसंद का एक चम्मच कंडीमेंट खाओ।' },
  { id: 9, truth: 'क्या आपने कभी टेस्ट में नकल की है?', dare: 'एक जोक सुनाओ। अगर कोई न हंसे तो पीओ।' },
  { id: 10, truth: 'सबसे बचकानी चीज़ जो आप अभी भी करते हैं?', dare: 'किसी को पेन से अपने चेहरे पर ड्रॉ करने दो।' },
  { id: 11, truth: 'आपको सबसे ज्यादा क्या परेशान करता है?', dare: '20 जंपिंग जैक करो।' },
  { id: 12, truth: 'क्या आपने कभी नापसंद गिफ्ट को पसंद जताया है?', dare: 'अभी माँ को "आई लव यू" टेक्स्ट भेजो।' },
  { id: 13, truth: 'वो क्या बात है जो आपने किसी को नहीं बताई?', dare: 'किसी को अपने सोशल मीडिया पर स्टेटस पोस्ट करने दो।' },
  { id: 14, truth: 'इस ग्रुप में किस पर आप अपना सबसे बड़ा राज रख सकते हैं?', dare: 'अपने पसंदीदा गाने का कोरस गाओ।' },
  { id: 15, truth: 'इस ग्रुप में किसने आपके लिए सबसे अच्छा काम किया है?', dare: 'कार्टव्हील करो या कोशिश करो।' },
  { id: 16, truth: 'क्या आपने इस ग्रुप में किसी की पीठ पीछे बात की है?', dare: 'किसी को 30 सेकंड अपना सर्च हिस्ट्री दिखाने दो।' },
  { id: 17, truth: 'इस ग्रुप में किसके साथ द्वीप पर फंसना चाहेंगे?', dare: 'किसी को अपना फोन दो और वो किसी को भी मैसेज कर सकते हैं।' },
  { id: 18, truth: 'इस ग्रुप में किसकी सबसे परेशान करने वाली आदत है?', dare: 'सोशल मीडिया पर अपनी शर्मनाक फोटो शेयर करो।' },
  { id: 19, truth: 'इस ग्रुप में कौन मशहूर होने वाला है?', dare: 'ग्रुप में किसी का इंप्रेशन दो।' },
  { id: 20, truth: 'क्या आपने इस ग्रुप में किसी से जलन महसूस की है?', dare: 'किसी को अपने सोशल मीडिया पर कुछ भी पोस्ट करने दो।' },
  { id: 21, truth: 'इस ग्रुप में किसके साथ रूममेट बनना चाहेंगे?', dare: 'सबको बताओ कि आप उनके बारे में सच में क्या सोचते हैं।' },
  { id: 22, truth: 'इस ग्रुप में किससे सबसे बड़ा झूठ बोला है?', dare: 'बगल वाले को अपने आखिरी 5 टेक्स्ट दिखाओ।' },
  { id: 23, truth: 'आपके पार्टनर की पहली इंप्रेशन क्या थी?', dare: 'किसी को कल के लिए आपका आउटफिट चुनने दो।' },
  { id: 24, truth: 'पार्टनर ने आपके लिए सबसे रोमांटिक क्या किया?', dare: 'सबसे अच्छा सेलिब्रिटी इंप्रेशन दो।' },
  { id: 25, truth: 'पार्टनर की सबसे परेशान करने वाली आदत क्या है?', dare: '2 मिनट पार्टनर को मसाज दो।' },
  { id: 26, truth: 'क्या आपने कभी ब्रेकअप के बारे में सोचा है?', dare: 'एक गाने तक पार्टनर के साथ स्लो डांस करो।' },
  { id: 27, truth: 'पार्टनर में आपको सबसे पसंद क्या है?', dare: 'पार्टनर को एक निवाला खिलाओ।' },
  { id: 28, truth: 'पार्टनर में आप क्या बदलाव चाहेंगे?', dare: 'पार्टनर के कान में कुछ रोमांटिक कहो।' },
  { id: 29, truth: 'पार्टनर की सबसे अच्छी बात क्या है?', dare: 'पार्टनर को अपने बाल स्टाइल करने दो।' },
  { id: 30, truth: 'क्या आपने पार्टनर से कोई राज छुपाया है?', dare: 'पार्टनर की पसंदीदा एक्टिविटी उनके साथ करो।' },
  { id: 31, truth: 'पार्टनर के साथ आपकी पसंदीदा याद क्या है?', dare: 'पार्टनर को पिगीबैक राइड दो।' },
  { id: 32, truth: 'पार्टनर को वो क्या बताना चाहते थे जो अभी तक नहीं बताया?', dare: 'पार्टनर को 5 चीज़ें बताओ जो आप उन्हें पसंद करते हैं।' },
  { id: 33, truth: 'पार्टी में सबसे जंगली काम क्या किया है?', dare: 'अपना सबसे अच्छा पार्टी ट्रिक दिखाओ।' },
  { id: 34, truth: 'क्या आपने कभी टेबल पर डांस किया है?', dare: '30 सेकंड बिना म्यूज़िक डांस करो।' },
  { id: 35, truth: 'शराब पीने के बाद सबसे शर्मनाक क्या हुआ?', dare: 'सबसे अच्छा कराओके परफॉर्मेंस दो।' },
  { id: 36, truth: 'क्या आपने कभी अभी मिले किसी को किस किया है?', dare: 'अपना ड्रिंक एक सांस में पी लो।' },
  { id: 37, truth: 'ध्यान खींचने के लिए सबसे पागल क्या किया?', dare: 'ग्रुप की पसंद का एक शॉट लो।' },
  { id: 38, truth: 'क्या आपको कभी बार या क्लब से निकाला गया?', dare: 'किसी को आपके मुंह में शॉट डालने दो।' },
  { id: 39, truth: 'सबसे ज्यादा मुसीबत कब में फंसे?', dare: 'किसी से बॉडी शॉट लो।' },
  { id: 40, truth: 'क्या पार्टी में कभी कुछ गैरकानूनी किया?', dare: 'किसी को आपका अगला ड्रिंक चुनने दो।' },
  { id: 41, truth: 'सबसे बड़ा पार्टी फाउल क्या रहा?', dare: 'अगले 5 मिनट जब भी कोई आपका नाम बोले एक घूंट पीओ।' },
  { id: 42, truth: 'क्या पार्टी में किसी के साथ हुकअप के बाद पछतावा हुआ?', dare: 'कैग स्टैंड करो (या नाटक करो)।' }
];

export function getData(locale: Locale): SimpleTruthOrDareCard[] {
  return locale === 'hi' ? DATA_HI : DATA;
}

export const getRandomCard = (excludeIds: number[] = []): SimpleTruthOrDareCard => {
  const available = DATA.filter(item => !excludeIds.includes(item.id));
  
  if (available.length === 0) {
    return DATA[Math.floor(Math.random() * DATA.length)];
  }
  
  return available[Math.floor(Math.random() * available.length)];
};

export const getCardById = (id: number): SimpleTruthOrDareCard | undefined => {
  return DATA.find(item => item.id === id);
};

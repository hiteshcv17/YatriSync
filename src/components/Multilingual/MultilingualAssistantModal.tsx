import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MessageSquare,
  Globe,
  Sparkles,
  Send,
  X,
  Volume2,
  CheckCircle2,
  MapPin,
  Bus,
} from 'lucide-react';

interface MultilingualAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Lang = 'en' | 'kn' | 'hi';

interface FAQItem {
  q: { en: string; kn: string; hi: string };
  a: { en: string; kn: string; hi: string };
}

const FAQS: FAQItem[] = [
  {
    q: {
      en: 'Where do I board the YatriSync feeder bus at Mysuru Junction?',
      kn: 'ಮೈಸೂರು ಜಂಕ್ಷನ್‌ನಲ್ಲಿ ಯಾತ್ರಿಸಂಕ್ ಫೀಡರ್ ಬಸ್ ಅನ್ನು ನಾನು ಎಲ್ಲಿ ಹತ್ತಬೇಕು?',
      hi: 'मैसूर जंक्शन पर यात्रिसींक फीडर बस कहाँ से पकड़ें?',
    },
    a: {
      en: 'All allocated feeder buses depart from Main Concourse Bay 2 (outside Platform 1 main exit) or West Terminal Bay 1 (Platform 6 exit). Check your QR ticket for exact Bay assignment.',
      kn: 'ಎಲ್ಲಾ ನಿಗದಿಪಡಿಸಿದ ಬಸ್‌ಗಳು ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ 1 ರ ಮುಖ್ಯ ನಿರ್ಗಮನದ ಹೊರಗಿನ ಬೇ 2 ಅಥವಾ ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ 6 ರ ಪಶ್ಚಿಮ ಟರ್ಮಿನಲ್‌ನಿಂದ ಹೊರಡುತ್ತವೆ.',
      hi: 'सभी बसें प्लेटफॉर्म 1 मुख्य निकास के बाहर बे 2 या प्लेटफॉर्म 6 वेस्ट टर्मिनल से प्रस्थान करती हैं। अपने टिकट पर बे नंबर देखें।',
    },
  },
  {
    q: {
      en: 'What happens if my train is delayed?',
      kn: 'ನನ್ನ ರೈಲು ವಿಳಂಬವಾದರೆ ಏನಾಗುತ್ತದೆ?',
      hi: 'यदि मेरी ट्रेन लेट हो जाए तो क्या होगा?',
    },
    a: {
      en: 'YatriSync automatically synchronizes with train arrival times. If your train is delayed, the feeder bus departure will be pushed back by 15-20 minutes, or you will be offered alternate onward transit with full fare protection.',
      kn: 'ಯಾತ್ರಿಸಂಕ್ ಸ್ವಯಂಚಾಲಿತವಾಗಿ ರೈಲಿನ ಆಗಮನದ ಸಮಯವನ್ನು ಪರಿಶೀಲಿಸುತ್ತದೆ. ರೈಲು ತಡವಾದರೆ ಬಸ್ ಹೊರಡುವ ಸಮಯವನ್ನು ಮುಂದೂಡಲಾಗುತ್ತದೆ ಅಥವಾ ಪರ್ಯಾಯ ವ್ಯವಸ್ಥೆ ಮಾಡಲಾಗುತ್ತದೆ.',
      hi: 'यात्रिसींक ट्रेन के समय के साथ स्वचालित रूप से समन्वय करता है। देरी होने पर बस का प्रस्थान समय 15-20 मिनट आगे बढ़ा दिया जाता है।',
    },
  },
  {
    q: {
      en: 'How does the 20-seat passenger pooling work?',
      kn: '20 ಸೀಟುಗಳ ಪ್ರಯಾಣಿಕರ ಪೂಲಿಂಗ್ ಹೇಗೆ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ?',
      hi: '20-सीट पैसेंजर पूलिंग कैसे काम करती है?',
    },
    a: {
      en: 'Passengers arriving by train heading towards the same destination (e.g. Infosys, Chamundi) are grouped together. Once 20 seats are booked, a dedicated KSRTC feeder bus is immediately dispatched.',
      kn: 'ಒಂದೇ ಗಮ್ಯಸ್ಥಾನಕ್ಕೆ ಹೋಗುವ ಪ್ರಯಾಣಿಕರನ್ನು ಒಟ್ಟಿಗೆ ಗುಂಪು ಮಾಡಲಾಗುತ್ತದೆ. 20 ಸೀಟುಗಳು ಭರ್ತಿಯಾದ ತಕ್ಷಣ ಪ್ರತ್ಯೇಕ ಕೆಎಸ್‌ಆರ್‌ಟಿಸಿ ಬಸ್ ನಿಯೋಜಿಸಲಾಗುತ್ತದೆ.',
      hi: 'समान गंतव्य जाने वाले यात्रियों का समूह बनाया जाता है। 20 सीटें बुक होते ही तुरंत समर्पित केएसआरटीसी बस आवंटित कर दी जाती है।',
    },
  },
  {
    q: {
      en: 'Is there a late-night safety exception for women travelling alone?',
      kn: 'ರಾತ್ರಿ ಸಮಯದಲ್ಲಿ ಮಹಿಳೆಯರಿಗೆ ವಿಶೇಷ ಸುರಕ್ಷತಾ ವ್ಯವಸ್ಥೆ ಇದೆಯೇ?',
      hi: 'क्या देर रात यात्रा करने वाली महिलाओं के लिए विशेष सुरक्षा व्यवस्था है?',
    },
    a: {
      en: 'Yes. Under FR-11 Night Protocol (10 PM to 5 AM), feeder buses can be dispatched even below the 20-seat threshold with station concourse escort and RPF coordinate sharing.',
      kn: 'ಹೌದು. ರಾತ್ರಿ 10 ರಿಂದ ಬೆಳಿಗ್ಗೆ 5 ರವರೆಗೆ ಮಹಿಳಾ ಪ್ರಯಾಣಿಕರ ಸುರಕ್ಷತೆಗಾಗಿ 20 ಸೀಟುಗಳು ಭರ್ತಿಯಾಗದಿದ್ದರೂ ಆಪರೇಟರ್ ಅನುಮೋದನೆಯೊಂದಿಗೆ ಬಸ್ ಕಳುಹಿಸಲಾಗುತ್ತದೆ.',
      hi: 'हाँ। रात 10 से सुबह 5 बजे के बीच, महिला सुरक्षा प्राथमिकता के तहत 20 से कम सीटों पर भी विशेष बस भेजी जाती है।',
    },
  },
];

export const MultilingualAssistantModal: React.FC<MultilingualAssistantModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [lang, setLang] = useState<Lang>('kn');
  const [userQuery, setUserQuery] = useState<string>('');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string }>>([
    {
      sender: 'bot',
      text: 'ನಮಸ್ಕಾರ! ಮೈಸೂರು ಜಂಕ್ಷನ್ ರೈಲು-ಬಸ್ ಸಂಪರ್ಕ ಸಹಾಯವಾಣಿಗೆ ಸ್ವಾಗತ. ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?',
    },
  ]);

  if (!isOpen) return null;

  const handleSend = (textToSend?: string) => {
    const q = textToSend || userQuery;
    if (!q.trim()) return;

    const newMsgs = [...chatMessages, { sender: 'user' as const, text: q }];
    setUserQuery('');

    // Multilingual responses
    let reply = '';
    const lower = q.toLowerCase();

    if (lang === 'kn') {
      if (lower.includes('ಬಸ್') || lower.includes('ಎಲ್ಲಿ') || lower.includes('bus')) {
        reply = 'ಮೈಸೂರು ಜಂಕ್ಷನ್ ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ 1 ಹೊರಗಡೆ ಬೇ 2 ರಿಂದ ಇನ್ಫೋಸಿಸ್ ಮತ್ತು ಚಾಮುಂಡಿ ಬೆಟ್ಟಕ್ಕೆ ಬಸ್‌ಗಳು ಹೊರಡುತ್ತವೆ.';
      } else if (lower.includes('ದರ') || lower.includes('ಹಣ') || lower.includes('fare')) {
        reply = 'ನಗರ ಸಾರಿಗೆ ಫೀಡರ್ ಬಸ್ ದರ ಪ್ರತಿ ಸೀಟಿಗೆ ₹25 ರಿಂದ ₹35 ಇರುತ್ತದೆ.';
      } else {
        reply = 'ನಿಮ್ಮ ಪ್ರಶ್ನೆ ದಾಖಲಾಗಿದೆ. ನಿಲ್ದಾಣದ ಕನ್ಕೋರ್ಸ್‌ನಲ್ಲಿರುವ ಯಾತ್ರಿಸಂಕ್ ಮಾಹಿತಿ ಕೌಂಟರ್‌ನಲ್ಲಿ ನೇರ ಸಹಾಯ ಲಭ್ಯವಿದೆ.';
      }
    } else if (lang === 'hi') {
      if (lower.includes('बस') || lower.includes('कहाँ') || lower.includes('bus')) {
        reply = 'मैसूर जंक्शन के प्लेटफॉर्म 1 के बाहर बे 2 से इन्फोसिस और चामुंडी हिल्स की बसें उपलब्ध हैं।';
      } else if (lower.includes('किराया') || lower.includes('fare')) {
        reply = 'प्रति सीट मानक किराया ₹25 से ₹35 है।';
      } else {
        reply = 'आपके सवाल के लिए धन्यवाद। मैसूर जंक्शन पर हमारा हेल्पडेस्क हमेशा आपकी सेवा में है।';
      }
    } else {
      if (lower.includes('bus') || lower.includes('where')) {
        reply = 'Buses depart from Platform 1 Concourse Bay 2 and Platform 6 West Terminal Bay 1.';
      } else if (lower.includes('fare') || lower.includes('cost')) {
        reply = 'Standard feeder bus fare is ₹25 – ₹35 depending on the corridor.';
      } else {
        reply = 'Thank you for reaching out. Live dispatch assistance is active at Mysuru Junction concourse.';
      }
    }

    setChatMessages([...newMsgs, { sender: 'bot', text: reply }]);
  };

  const handleLangChange = (newLang: Lang) => {
    setLang(newLang);
    let greeting = '';
    if (newLang === 'kn') {
      greeting = 'ನಮಸ್ಕಾರ! ಮೈಸೂರು ಜಂಕ್ಷನ್ ರೈಲು-ಬಸ್ ಸಂಪರ್ಕ ಸಹಾಯವಾಣಿಗೆ ಸ್ವಾಗತ. ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?';
    } else if (newLang === 'hi') {
      greeting = 'नमस्ते! मैसूर जंक्शन ट्रेन-से-बस कनेक्टिविटी में आपका स्वागत है। मैं आपकी क्या मदद कर सकता हूँ?';
    } else {
      greeting = 'Hello! Welcome to YatriSync Mysuru Junction train-to-bus assistant. How may I help you today?';
    }
    setChatMessages([{ sender: 'bot', text: greeting }]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[560px]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold">
              <Globe className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Mysuru Multilingual Travel Assistant</h3>
              <p className="text-[10px] text-slate-300">ಕನ್ನಡ · English · हिंदी</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <div className="flex bg-slate-800 rounded-lg p-0.5 border border-slate-700 text-[11px] font-bold">
              <button
                onClick={() => handleLangChange('kn')}
                className={`px-2 py-0.5 rounded ${lang === 'kn' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
              >
                ಕನ್ನಡ
              </button>
              <button
                onClick={() => handleLangChange('en')}
                className={`px-2 py-0.5 rounded ${lang === 'en' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
              >
                EN
              </button>
              <button
                onClick={() => handleLangChange('hi')}
                className={`px-2 py-0.5 rounded ${lang === 'hi' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
              >
                हिंदी
              </button>
            </div>

            <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick FAQ Pills */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 overflow-x-auto flex gap-2 text-xs">
          {FAQS.slice(0, 3).map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(item.q[lang])}
              className="px-3 py-1 bg-white border border-slate-200 hover:border-indigo-400 rounded-full text-slate-700 whitespace-nowrap text-[11px] shadow-2xs font-medium"
            >
              {item.q[lang]}
            </button>
          ))}
        </div>

        {/* Chat Feed */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50 text-xs">
          {chatMessages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-2xl ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-none'
                    : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-2xs'
                }`}
              >
                <p className="leading-relaxed">{msg.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            value={userQuery}
            onChange={e => setUserQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder={
              lang === 'kn'
                ? 'ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಇಲ್ಲಿ ಬರೆಯಿರಿ (ಉದಾ: ಬಸ್ ಎಲ್ಲಿ ಸಿಗುತ್ತದೆ?)...'
                : lang === 'hi'
                  ? 'अपना प्रश्न यहाँ लिखें (जैसे: बस कहाँ मिलेगी?)...'
                  : 'Type your transit query (e.g., Where is Bay 2?)...'
            }
            className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:border-indigo-500"
          />
          <button
            onClick={() => handleSend()}
            className="p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

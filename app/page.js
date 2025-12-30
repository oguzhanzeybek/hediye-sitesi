"use client";
import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useSpring, useMotionValue, useMotionTemplate, AnimatePresence, useTransform } from 'framer-motion';
import confetti from 'canvas-confetti';

// --- AYARLAR ---
const KIZ_ARKADAS_ISMI = "Sevgilim Rabia"; 
const SENIN_ADIN = "Oguzhan";
const ILK_TANISMA_TARIHI = "2025-12-24"; 

// --- FOTOĞRAFLAR ---
const FOTOGRAFLAR = [
  { src: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=600&auto=format&fit=crop", text: "İlk Bakış" },
  { src: "https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=600&auto=format&fit=crop", text: "O Kahve" },
  { src: "https://images.unsplash.com/photo-1621600411688-4be93cd68504?q=80&w=600&auto=format&fit=crop", text: "Güzel Bir An" },
  { src: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?q=80&w=600&auto=format&fit=crop", text: "Biz" },
];

// --- İLİŞKİ SAYACI ---
function TimeCounter() {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const start = new Date(ILK_TANISMA_TARIHI).getTime();
      const now = new Date().getTime();
      const distance = now - start;

      setTime({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex gap-3 md:gap-8 justify-center items-center flex-wrap">
      {[
        { label: "Gün", val: time.days },
        { label: "Saat", val: time.hours },
        { label: "Dakika", val: time.minutes },
        { label: "Saniye", val: time.seconds }
      ].map((item, i) => (
        <motion.div 
          key={i}
          initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.1, type: "spring" }}
          className="flex flex-col items-center"
        >
          <div className="w-20 h-20 md:w-28 md:h-28 bg-white/5 backdrop-blur-md border border-pink-500/30 rounded-2xl flex items-center justify-center shadow-[0_0_15px_rgba(236,72,153,0.2)] group hover:bg-white/10 transition-all hover:scale-110">
            <span className="text-2xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-pink-400 to-purple-400 font-mono">
              {item.val}
            </span>
          </div>
          <span className="mt-3 text-xs md:text-sm text-gray-400 uppercase tracking-widest font-bold">{item.label}</span>
        </motion.div>
      ))}
    </div>
  );
}

// --- MOUSE ÇİÇEKLERİ (GÜNCELLENDİ: Güvenli Emoji Seçimi) ---
function MouseTrailFlowers() {
  const [flowers, setFlowers] = useState([]);
  const timeoutRef = useRef();

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Performans için throttle (sınırlama)
      if (timeoutRef.current) return; 
      
      timeoutRef.current = setTimeout(() => {
        // Emoji listesi burada tanımlı
        const emojis = ['🌸', '💮', '🌺', '🍃', '💐','🌷','🌹','🌸','🌺','🫧','🤍','🌸','🪽'];
        
        const newFlower = {
          id: Date.now(),
          x: e.clientX,
          y: e.clientY,
          rotation: Math.random() * 360,
          scale: Math.random() * 0.5 + 0.5,
          // Listeden otomatik ve güvenli seçim
          emoji: emojis[Math.floor(Math.random() * emojis.length)],
        };
        setFlowers((prev) => [...prev.slice(-15), newFlower]); 
        timeoutRef.current = null;
      }, 30); 
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      <AnimatePresence>
        {flowers.map((flower) => (
          <motion.div
            key={flower.id}
            initial={{ opacity: 0.8, scale: 0, x: flower.x, y: flower.y }}
            animate={{ opacity: 0, scale: flower.scale * 2, y: flower.y + 100, rotate: flower.rotation }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute text-2xl pointer-events-none select-none will-change-transform"
            style={{ left: -12, top: -12 }}
          >
            {flower.emoji}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// --- 3D KART ---
function Card3D({ title, icon, text, delay }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    let { left, top, width, height } = currentTarget.getBoundingClientRect();
    let xPoint = clientX - left;
    let yPoint = clientY - top;
    mouseX.set(xPoint - width / 2);
    mouseY.set(yPoint - height / 2);
  }

  const rotateX = useTransform(mouseY, [-100, 100], [15, -15]);
  const rotateY = useTransform(mouseX, [-100, 100], [-15, 15]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay }}
      style={{ perspective: 1000 }}
      className="w-full"
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => { mouseX.set(0); mouseY.set(0); }}
        className="relative h-full bg-black/40 border border-pink-500/20 p-8 rounded-3xl shadow-xl backdrop-blur-md group hover:bg-black/60 transition-colors duration-500 overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/flower-trail.png')] mix-blend-overlay"></div>
        
        <div style={{ transform: "translateZ(50px)" }} className="relative mb-6 mx-auto w-24 h-24 flex items-center justify-center">
           <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute inset-0 rounded-full border-2 border-dashed border-pink-400/50"></motion.div>
           <div className="absolute inset-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg shadow-pink-500/30">
            <span className="text-5xl">{icon}</span>
           </div>
        </div>

        <h3 style={{ transform: "translateZ(30px)" }} className="text-2xl font-bold text-white mb-3 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-pink-300">{title}</h3>
        <p style={{ transform: "translateZ(20px)" }} className="text-gray-300 text-center leading-relaxed font-light">
          {text}
        </p>
        
        <motion.div
            style={{
              background: useMotionTemplate`radial-gradient(400px circle at ${mouseX}px ${mouseY}px, rgba(236, 72, 153, 0.15), transparent 80%)`,
            }}
            className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        />
      </motion.div>
    </motion.div>
  );
}

// --- ANA SAYFA ---
export default function Home() {
  const [isAccepted, setIsAccepted] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const [displayedText, setDisplayedText] = useState("");
  
  const [backgroundElements, setBackgroundElements] = useState({
    sakura: [],
    stars: [],
    bgFlowers: []
  });

  const handleAccept = () => {
    setIsAccepted(true);
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 45, spread: 360, ticks: 150, zIndex: 100, shapes: ['circle'] };
    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);
      const particleCount = 100 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }, colors: ['#FF69B4', '#FFB6C1', '#FFC0CB', '#FFFFFF', '#C71585'] });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }, colors: ['#FF69B4', '#FFB6C1', '#FFC0CB', '#FFFFFF', '#C71585'] });
    }, 200);
  };

  const introText = "Gelecek, onu hayal edenlere aittir...";

  useEffect(() => {
    // 1. Yazı Efekti
    let index = 0;
    const timer = setInterval(() => {
      setDisplayedText(introText.slice(0, index + 1));
      index++;
      if (index > introText.length) clearInterval(timer);
    }, 100);

    // 2. Rastgele Konumları Client-Side Üretimi (GÜNCELLENDİ)
    const newSakura = [...Array(50)].map(() => {
      // Emoji listesi burada tanımlı
      const emojis = ['🌸', '💮', '🌺', '🍃', '💐','🌷','🌹','🌸','🌺','🫧','🤍','🌸','🪽'];
      
      return {
        // Başlangıç pozisyonu ekranın yukarısında
        left: Math.random() * 100 + '%',
        // Animasyon parametreleri
        duration: Math.random() * 10 + 15, // Daha yavaş ve sakin süzülme
        delay: Math.random() * -20, // Negatif delay
        // Listeden otomatik ve güvenli seçim
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        scale: Math.random() * 0.5 + 0.5
      };
    });

    const newStars = [...Array(5)].map(() => ({
      top: Math.random() * 60 + '%',
      delay: Math.random() * 10
    }));

    const newBgFlowers = [...Array(20)].map(() => ({
       left: Math.random() * 100 + '%',
       duration: Math.random() * 20 + 20,
       delay: Math.random() * -20,
       scale: Math.random() * 0.3 + 0.3
    }));

    setBackgroundElements({
      sakura: newSakura,
      stars: newStars,
      bgFlowers: newBgFlowers
    });

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans overflow-hidden relative selection:bg-pink-500 selection:text-white">
      
      <MouseTrailFlowers />
      <motion.div style={{ scaleX }} className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 origin-left z-50" />

      {/* 🌠 Arka Plan (OPTİMİZE EDİLDİ: GPU RENDER) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        
        {/* Ana Sakura Yağmuru */}
        {backgroundElements.sakura.map((item, i) => (
          <motion.div
            key={`sakura-${i}`}
            className="absolute drop-shadow-lg will-change-transform"
            style={{ 
              top: '-10%', // Ekranın hemen üstünden başla
              left: item.left,
              fontSize: `${item.scale + 1}rem`,
              zIndex: Math.random() > 0.5 ? 0 : 20 // Bazıları yazıların önüne geçsin, derinlik katar
            }}
            animate={{ 
              y: ['0vh', '120vh'], // GPU dostu hareket (transform: translateY)
              rotateZ: [0, 360], // Kendi etrafında dönüş
              rotateX: [0, 180, 360], // 3D dönüş (yaprak gibi süzülme)
              x: [0, Math.random() * 100 - 50, 0] // Hafif sağa sola salınım
            }}
            transition={{ 
              duration: item.duration, 
              repeat: Infinity, 
              ease: "linear", 
              delay: 0 // Delay'i state'te negatif vererek hallettik
            }}
          >
            {item.emoji}
          </motion.div>
        ))}
        
        {/* Kayan Yıldızlar */}
        {backgroundElements.stars.map((item, i) => (
           <motion.div
             key={`shooting-${i}`}
             className="absolute h-[2px] w-[100px] bg-gradient-to-r from-transparent via-pink-300 to-transparent"
             style={{ top: item.top, left: '-10%' }}
             animate={{ x: '120vw', y: '30vh', opacity: [0, 1, 0] }}
             transition={{ duration: 3, repeat: Infinity, delay: item.delay, ease: "easeInOut" }}
             transformTemplate={({ x, y }) => `translate(${x}, ${y}) rotate(15deg)`}
           />
        ))}

        {/* Arka Plandaki Bulanık Çiçekler (Derinlik İçin) */}
        {backgroundElements.bgFlowers.map((item, i) => (
          <motion.div 
            key={`bg-${i}`} 
            className="absolute text-xl opacity-20 blur-[2px]" 
            style={{ top: '-10%', left: item.left, scale: item.scale }}
            animate={{ y: ['0vh', '120vh'], rotate: 360 }} 
            transition={{ duration: item.duration, repeat: Infinity, ease: "linear" }} 
          >
            🌸
          </motion.div>
        ))}
      </div>

      <main className="relative z-10 flex flex-col items-center">
        
        {/* 🎬 GİRİŞ BÖLÜMÜ (HERO) */}
        <section className="h-screen flex flex-col justify-center items-center text-center px-4 relative perspective-[1000px]">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-600/20 rounded-full blur-[150px] -z-10 animate-pulse"></div>
          
          <motion.div 
            initial={{ scale: 0, rotateY: 180 }} 
            animate={{ scale: 1, rotateY: 0 }} 
            transition={{ type: "spring", stiffness: 50, duration: 1.5 }} 
            className="mb-8 relative"
          >
            <motion.span 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="text-7xl absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 opacity-50 block"
            >
              🌸
            </motion.span>
            <span className="text-8xl relative z-10 drop-shadow-[0_0_25px_rgba(236,72,153,0.6)]">💖</span>
          </motion.div>

          <h1 className="text-6xl md:text-9xl font-black mb-6 tracking-tighter relative z-10">
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-pink-300 via-purple-300 to-white filter drop-shadow-[0_0_30px_rgba(236,72,153,0.4)]">
              {KIZ_ARKADAS_ISMI}
            </span>
          </h1>
          <div className="h-8 mb-12 relative z-10">
            <p className="text-xl md:text-2xl text-pink-200 font-mono font-light">
              {displayedText}<span className="animate-blink">|</span>
            </p>
          </div>
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute bottom-10">
            <span className="text-pink-400/60 text-sm tracking-widest uppercase">Hikayemiz İçin Kaydır</span>
            <div className="w-[1px] h-16 bg-gradient-to-b from-pink-500 to-transparent mx-auto mt-2"></div>
          </motion.div>
        </section>

        {/* ⏳ SİSTEM UPTIME */}
        <section className="py-20 px-4 w-full max-w-5xl text-center">
          <motion.div 
            initial={{ opacity: 0, y: 50 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[3rem] p-10 md:p-16 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-pink-500 to-transparent opacity-50"></div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Bizim Zamanımız ⏳</h2>
            <p className="text-gray-400 mb-10 font-light">Seninle ilk anımızdan itibaren geçen süre...</p>
            
            <TimeCounter />
            
            <div className="mt-12 text-xs text-green-400 font-mono bg-green-400/10 inline-block px-4 py-2 rounded-full border border-green-500/20 animate-pulse">
              ● Sistem durumu: Perfectly in Love
            </div>
          </motion.div>
        </section>

        {/* 📸 FOTOĞRAF GALERİSİ */}
        <section className="py-20 px-4 w-full max-w-7xl">
           <motion.h2 
             initial={{ opacity: 0, y: 50 }} 
             whileInView={{ opacity: 1, y: 0 }} 
             viewport={{ once: true }}
             className="text-4xl md:text-6xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-purple-400"
           >
             Memory Lane 📸
           </motion.h2>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
             {FOTOGRAFLAR.map((foto, index) => (
               <motion.div 
                 key={index}
                 initial={{ opacity: 0, scale: 0.8 }}
                 whileInView={{ opacity: 1, scale: 1 }}
                 viewport={{ once: true }}
                 transition={{ delay: index * 0.1 }}
                 whileHover={{ scale: 1.05, rotate: index % 2 === 0 ? 2 : -2, zIndex: 10 }}
                 className="relative group aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-white/5 cursor-pointer"
               >
                 <img src={foto.src} alt={foto.text} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100" />
                 
                 <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                   <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                     <span className="text-pink-300 text-xs font-bold uppercase tracking-wider mb-1 block">Anı #{index + 1}</span>
                     <span className="text-white font-bold text-xl">{foto.text}</span>
                   </div>
                 </div>
               </motion.div>
             ))}
           </div>
        </section>

        {/* 🔮 3D KARTLAR */}
        <section className="min-h-screen py-20 px-4 w-full max-w-7xl relative">
          <motion.h2 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-bold text-center mb-24 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400 flex items-center justify-center gap-4"
          >
            <span className="text-4xl animate-bounce">🌸</span> Neden Sen? <span className="text-4xl animate-bounce">🌸</span>
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 px-4 md:px-0">
            <Card3D delay={0.1} icon="💅 👑" title="Havan" text="Kabul edelim, biraz fazla tatlısınnnnn... Bu sana o kadar çok yakışıyor ki! O nazın, o cilven, o pasif agresif tutumlarınnn. Aklına her şeyi takııışın ve tamamen ben gibi olman. yanındayken başkası olmama gerek  yok, ki senınde aynı sekılde.... Sen benim başımın en tatlı belası(aslında ben senın), hayatımın en güzel rengisin. :))))" />
            <Card3D delay={0.3} icon="✨" title="'Sen' olman..." text="Tarif etmesi zor bir şey bu.Bazen her şey için asıl olduğun kişi yeter işte, seninkide  yetiyor. Bu anlatıalcak bir şey değil, yani sadece her şeyiyle sen olduğun için... Mesela her mimiğin her tonlaman her vurgun için. Mesela sevgi denilen şeyi sonuna kadar bildiğin için. Sen olduğun için..." />
            <Card3D delay={0.5} icon="🎯" title="Uyumumuz" text="Zamanın nasıl geçtiğini anlamıyorum bile, zaman öyle hızlı geçiyor kiii......Bazen susarak da anlaşıyoruz. İçinden geçenleri asla soylememen bile çok tatlı(ben anlıyorum inkar etsen de sdkjnfsd). Zeki birisin ve yaşadığın hayatı çok iyi anlıyorum, olduğu kişiyi de..ilişki ve değer verme anlayışına da tabi. Güzel Bir gelecek bizi bekliyooorrrrr......" />
          </div>
        </section>

        {/* 🚀 FİNAL TEKLİF */}
        <section className="min-h-[80vh] flex items-center justify-center w-full px-4 py-20 relative overflow-hidden">
          <div className="absolute top-0 left-0 text-9xl opacity-10 rotate-[-20deg] pointer-events-none animate-pulse">🌹</div>
          <div className="absolute bottom-0 right-0 text-9xl opacity-10 rotate-[20deg] pointer-events-none animate-pulse">🌺</div>

          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="relative w-full max-w-4xl bg-black/50 backdrop-blur-2xl border border-pink-500/30 p-12 md:p-20 rounded-[3rem] text-center overflow-hidden group shadow-[0_0_80px_rgba(236,72,153,0.3)] z-20"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-800/20 via-transparent to-pink-800/20 pointer-events-none"></div>
            
            {!isAccepted ? (
              <div className="relative z-10 space-y-12">
                <h2 className="text-4xl md:text-6xl font-bold leading-tight">
                  Hayallerimiz sadece akılda kalmasın,isteklerimiz ,arzularımız..<br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400 filter drop-shadow">
                   o geleceği birlikte var edelim, hepsini birer birer beraber inşa edelim?
                  </span>
                </h2>
                
                <p className="text-pink-200/80 text-lg md:text-xl max-w-2xl mx-auto font-light">
                  Seninle her şey çok daha anlamlı, çok daha güçlü.Her şey seninle gerçek ve değerli, bunu anlıyorum sevgilim.Benimle bu hayata ve geleceğe var mısın?
                </p>

                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 0 50px rgba(236,72,153,0.7)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAccept}
                  className="relative group px-12 py-6 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full font-bold text-xl overflow-hidden transition-all shadow-xl"
                >
                  <span className="relative z-10 flex items-center justify-center gap-3 text-white">
                    <span>🌹</span> Geleceği Benimle Var Et
                  </span>
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300 mix-blend-overlay"></div>
                </motion.button>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 space-y-8"
              >
                <div className="text-8xl animate-bounce drop-shadow-[0_0_30px_rgba(236,72,153,0.8)]">🥂🌸</div>
                <h2 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">
                  Harika Karar!
                </h2>
                <p className="text-xl text-pink-200">
                  İyi ki Varsın, İyi ki Biziz! iyi ki sevgilimsin.. seni çoookkk seviyoruuummmm. <br/>
                  Seninle bu yola çıkmak, geleceği düşünmek bile beni dünyanın en şanslı insanı yapıyor. <br/>
                  Varlığınla hayatıma kattığın anlam paha biçilemez. şimdi ve daima... 💖                 
                  Sonsuza dek senininm...
                </p>
                <div className="text-sm text-pink-400/60 mt-4">
                  (Ekranına yağan çiçeklerin tadını çıkar... 😊)
                </div>
              </motion.div>
            )}
          </motion.div>
        </section>

        <footer className="py-10 text-pink-400/40 text-xs text-center font-mono">
          <p>Architected with ❤️ & Code by {SENIN_ADIN} • {new Date().getFullYear()}</p>
        </footer>

      </main>
    </div>
  );
}
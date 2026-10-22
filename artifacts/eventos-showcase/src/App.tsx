import { type ReactNode, useEffect } from 'react';
import { ArrowUpRight, Instagram, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();

function Home() {
  useEffect(() => {
    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      !('IntersectionObserver' in window)
    ) {
      return;
    }

    const revealElements = Array.from(
      document.querySelectorAll<HTMLElement>('[data-reveal]'),
    );
    if (!revealElements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );

    revealElements.forEach((element) => observer.observe(element));
    document.documentElement.classList.add('reveal-ready');

    return () => {
      observer.disconnect();
      document.documentElement.classList.remove('reveal-ready');
    };
  }, []);

  useEffect(() => {
    const section = document.querySelector<HTMLElement>('.photo-story');
    const images = Array.from(
      document.querySelectorAll<HTMLImageElement>('.photo-story-image'),
    );
    if (!section || images.length < 2) return;

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (reduceMotion) return;

    let animationFrame = 0;
    const clamp = (value: number, min: number, max: number) =>
      Math.min(max, Math.max(min, value));
    const smoothstep = (start: number, end: number, value: number) => {
      const t = clamp((value - start) / (end - start), 0, 1);
      return t * t * (3 - 2 * t);
    };

    const updateStory = () => {
      const rect = section.getBoundingClientRect();
      const scrollDistance = Math.max(1, rect.height - window.innerHeight);
      const progress = clamp(-rect.top / scrollDistance, 0, 1);
      const position = progress * (images.length - 1);

      images.forEach((image, index) => {
        const reveal = index === 0
          ? 1
          : smoothstep(index - 0.45, index, position);
        const depth = clamp(position - index, 0, 1);
        const scale = 1.025 + (1 - reveal) * 0.025 + depth * 0.015;
        const verticalShift = (1 - reveal) * 1.2;
        const clippedTop = (1 - reveal) * 100;

        image.style.clipPath = `inset(${clippedTop}% 0 0 0)`;
        image.style.transform = `translate3d(0, ${verticalShift}%, 0) scale(${scale})`;
      });
    };

    const scheduleUpdate = () => {
      if (animationFrame) return;
      animationFrame = window.requestAnimationFrame(() => {
        animationFrame = 0;
        updateStory();
      });
    };

    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);
    updateStory();

    return () => {
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <main className="site-shell">
      <section className="hero" aria-labelledby="hero-title">
        <nav className="hero-nav" aria-label="Navegação principal">
          <a className="brand-lockup" href="#inicio" aria-label="Estúdio 80, início">
            <img className="brand-logo" src="/images/logo-estudio-80-branco.png" alt="" />
          </a>
          <a className="nav-cta" href={whatsAppHref} target="_blank" rel="noreferrer">
            <MessageCircle size={16} strokeWidth={2.2} aria-hidden="true" />
            <span>Fale pelo WhatsApp</span>
          </a>
        </nav>
        <div className="hero-copy" id="inicio">
          <h1 id="hero-title">
            <span>CONTAR UMA</span>
            <span>HISTÓRIA <em>QUE FIQUE</em></span>
            <span><em>NA MEMÓRIA,</em></span>
            <span>SOMOS OS MELHORES NISSO.</span>
          </h1>
        </div>
        <div className="hero-bottom">
          <span className="hero-meta">Produções audiovisuais — Eventos — Digitalização.</span>
          <a className="scroll-cue" href="#producoes">Role para conhecer <i aria-hidden="true">↓</i></a>
        </div>
      </section>

      <section className="story-intro" id="producoes" aria-labelledby="story-heading">
        <div className="story-copy">
          <h2 id="story-heading" data-reveal="up">Histórias contadas<br />através da <em>fotografia.</em></h2>
        </div>
      </section>

      <section className="photo-story" id="fotografias" aria-label="Sequência fotográfica institucional">
        <div className="photo-story-stage">
          {photoStoryImages.map((photo, index) => (
            <img
              className="photo-story-image"
              src={photo.src}
              alt={photo.alt}
              loading={index === 0 ? 'eager' : 'lazy'}
              decoding="async"
              style={{
                clipPath: index === 0 ? 'inset(0 0 0 0)' : 'inset(100% 0 0 0)',
              }}
              key={photo.src}
            />
          ))}
        </div>
      </section>

      <section className="audiovisual-story" id="solucoes" aria-labelledby="audiovisual-heading">
        <div className="audiovisual-story-copy" data-reveal="up">
          <h2 id="audiovisual-heading">
            Histórias contadas<br />
            através do<br />
            <em>audiovisual.</em>
          </h2>
        </div>
      </section>

      <section
        className="archive-cover"
        id="acervos"
        aria-label="História contada através de acervos a serem preservados"
      >
        <img
          className="archive-cover-image"
          src="/images/archive-cover.jpg"
          alt="Soluções em imagens. História contada através de acervos a serem preservados. Digitalização, organização e cuidado com imagens e documentos institucionais."
          loading="lazy"
          decoding="async"
          data-reveal="up"
        />
      </section>

      <section className="contact-section" id="contato" aria-labelledby="contact-heading">
        <div className="contact-panel">
          <img
            className="contact-logo"
            src="/images/logo-estudio-80-branco.png"
            alt="Estúdio 80"
            loading="lazy"
            decoding="async"
          />
          <h2 id="contact-heading" data-reveal="up">Contato</h2>
          <address className="contact-details" data-reveal="up">
            <a className="contact-detail" href="mailto:estudio80@estudio80.com.br">
              <span className="contact-icon" aria-hidden="true"><Mail size={18} strokeWidth={1.6} /></span>
              <span>estudio80@estudio80.com.br</span>
            </a>
            <a className="contact-detail" href="tel:+5561992611547">
              <span className="contact-icon" aria-hidden="true"><Phone size={18} strokeWidth={1.6} /></span>
              <span>(61) 99261-1547</span>
            </a>
            <p className="contact-detail">
              <span className="contact-icon" aria-hidden="true"><MapPin size={18} strokeWidth={1.6} /></span>
              <span>SHCS CL, QD 216, Bloco A, Loja 36, Sobreloja — Asa Sul, Brasília/DF.</span>
            </p>
          </address>
          <div className="contact-actions" data-reveal="up">
            <a className="contact-button" href={whatsAppHref} target="_blank" rel="noreferrer">
              <MessageCircle size={18} strokeWidth={1.6} aria-hidden="true" />
              <span>WhatsApp</span>
              <ArrowUpRight size={16} strokeWidth={1.6} aria-hidden="true" />
            </a>
            <a className="contact-button" href="https://www.instagram.com/estudio.80/" target="_blank" rel="noreferrer">
              <Instagram size={18} strokeWidth={1.6} aria-hidden="true" />
              <span>Instagram</span>
              <ArrowUpRight size={16} strokeWidth={1.6} aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

    </main>
  );
}

const photoStoryImages = [
  {
    src: '/images/scroll-photo-01.jpg',
    alt: 'Palestrante se dirigindo ao público em um palco iluminado',
  },
  {
    src: '/images/scroll-photo-02.jpg',
    alt: 'Entrevista coletiva com representantes e profissionais de imprensa',
  },
  {
    src: '/images/scroll-photo-03.jpg',
    alt: 'Autoridades reunidas em uma mesa durante uma sessão institucional',
  },
];

const whatsAppHref =
  'https://wa.me/5561992611547?text=Ol%C3%A1%2C%20quero%20conversar%20sobre%20um%20projeto%20para%20o%20Est%C3%BAdio%2080.';

function Router() {
  return (
    // Keep a shared shell (sidebar, navbar) outside the boundary so it
    // survives a page crash.
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

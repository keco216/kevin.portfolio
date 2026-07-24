// Zentrale Inhalte des Portfolios.
// Alle Sektionen lesen ausschließlich aus dieser Datei.

export type Project = {
  name: string;
  description: string;
  tags: string[];
  liveUrl?: string;
  githubUrl?: string;
  /** Pfad unter /public, z. B. "/projects/litecloud.png" */
  image: string;
  /** Bild-Ausrichtung: "landscape" passt in den Laptop-Rahmen, "portrait" wird frei gestellt */
  orientation: "landscape" | "portrait";
};

export type SkillGroup = {
  title: string;
  skills: string[];
};

export type SystemStep = {
  label: string;
  title: string;
  description: string;
};

export type Principle = {
  title: string;
  description: string;
};

export const content = {
  name: {
    first: "Kevin",
    last: "Colic",
  },
  role: "IT-Techniker & Software Developer",
  avatar: "/kevin-avatar.png",
  availability: "Offen für ausgewählte Projekte",
  heroLeft:
    "Ich arbeite als IT-Techniker und entwickle als Freelancer eigene Software-Projekte.",
  heroRight:
    "Fokus auf Self-Hosting, Infrastruktur und saubere Tools — aus Österreich.",
  about: {
    // Wird per CSS uppercase dargestellt — hier bewusst normale Schreibweise
    headline: "Ich baue Tools, hoste alles selbst, automatisiere den Rest.",
    paragraphs: [
      "Ich bin IT-Techniker mit einer Leidenschaft für Software-Entwicklung. Als Freelance-Entwickler arbeite ich ständig daran, mich weiterzuentwickeln und Neues zu lernen.",
      "Am liebsten baue ich Dinge, die ich selbst hosten kann: meine eigene Cloud, meinen eigenen Passwortmanager, meinen eigenen Mail-Client und ein Remote-Desktop-Gateway — alles läuft in Docker auf eigener Infrastruktur.",
      "Wenn ich nicht gerade an Infrastruktur schraube, probiere ich neue Frameworks und Plattformen aus — von WPF über Jetpack Compose bis SvelteKit.",
    ],
  },
  skillGroups: [
    {
      title: "Frontend Tools",
      skills: [
        "TypeScript",
        "JavaScript (ES6+)",
        "React",
        "Next.js",
        "SvelteKit",
        "Svelte 5",
        "Tailwind CSS",
        "SCSS",
        "Material Design 3",
        "Jetpack Compose",
        "WPF/XAML",
      ],
    },
    {
      title: "Backend Tools",
      skills: [
        "Node.js",
        "Express",
        "Fastify",
        "C#/.NET",
        "Python",
        "Java (Spring Boot)",
        "PostgreSQL",
        "Redis",
        "SQLite",
        "Prisma ORM",
        "REST APIs",
        "Socket.IO/WebSockets",
      ],
    },
    {
      title: "IT & Infrastruktur",
      skills: [
        "Docker & Docker Compose",
        "Portainer",
        "Nginx & Reverse Proxy",
        "Apache Guacamole",
        "Netzwerktechnik (RDP, SSH, VNC)",
        "IMAP/SMTP",
        "GitHub Actions (CI/CD)",
        "AES-256-GCM & Argon2id",
        "TOTP/2FA",
        "WebDAV",
        "Windows & Linux",
      ],
    },
  ] satisfies SkillGroup[],
  system: {
    eyebrow: "Self-hosted by design",
    headline: "Vom ersten Request bis zu dauerhaft sicheren Daten.",
    description:
      "Ich denke Software nicht nur bis zum Interface. Netzwerk, Deployment, Zugriff und Betrieb gehören für mich zum selben System.",
    steps: [
      {
        label: "01",
        title: "Client",
        description: "Browser, Desktop oder Mobile",
      },
      {
        label: "02",
        title: "Gateway",
        description: "TLS, Nginx und Zugriffskontrolle",
      },
      {
        label: "03",
        title: "Services",
        description: "Apps und APIs in Containern",
      },
      {
        label: "04",
        title: "Data",
        description: "SQL, Redis und verschlüsselte Dateien",
      },
      {
        label: "05",
        title: "Ops",
        description: "CI/CD, Updates und Monitoring",
      },
    ] satisfies SystemStep[],
    protocols: [
      "HTTPS",
      "WebSocket",
      "RDP",
      "SSH",
      "VNC",
      "IMAP",
      "SMTP",
      "WebDAV",
    ],
  },
  projectsIntro:
    "Vom Remote-Desktop-Gateway bis zur eigenen Cloud — jedes Projekt hier löst ein echtes Problem auf eigener Infrastruktur.",
  projects: [
    {
      name: "Kevin Connection Manager",
      description:
        "Selbst gehostetes Remote-Desktop-Gateway für RDP, SSH und VNC auf Basis von Apache Guacamole 1.6. Das komplette Erscheinungsbild kommt als aufsteckbare Theme-Extension — kein Fork, keine Image-Modifikation.",
      tags: ["Docker", "Guacamole", "CI/CD"],
      githubUrl: "https://github.com/keco216/kevin-connection-manager",
      image: "/projects/kevin-connection-manager.png",
      orientation: "landscape",
    },
    {
      name: "LiteCloud",
      description:
        "Minimale, selbst gehostete Personal Cloud für Familien: ein Docker-Container, eine SQLite-Datei, ein Uploads-Ordner. Mit Ende-zu-Ende-Verschlüsselung, Foto-Timeline, Volltextsuche und WebDAV.",
      tags: ["SvelteKit", "SQLite", "Docker"],
      githubUrl: "https://github.com/keco216/litecloud",
      image: "/projects/litecloud.png",
      orientation: "landscape",
    },
    {
      name: "Mail-Kev",
      description:
        "ProtonMail-inspirierter E-Mail-Client als Fullstack-Monorepo: Multi-Account über IMAP/SMTP und Microsoft Graph, Conversation-Threading, zeitversetzter Versand und Undo-Send.",
      tags: ["React", "Node.js", "PostgreSQL"],
      githubUrl: "https://github.com/keco216/mail-kev",
      image: "/projects/mail-kev.png",
      orientation: "landscape",
    },
    {
      name: "u-got.me",
      description:
        "Wegwerf-E-Mail-Dienst ohne Registrierung: Adresse generieren, Mails kommen in Echtzeit per WebSocket an und verschwinden nach 60 Minuten von selbst.",
      tags: ["Next.js", "Fastify", "Redis"],
      githubUrl: "https://github.com/keco216/u-got-mail",
      image: "/projects/u-got-mail.png",
      orientation: "landscape",
    },
    {
      name: "KevinKey",
      description:
        "Zero-Knowledge-Passwortmanager für Web, Desktop und Browser: Ende-zu-Ende-verschlüsselt mit AES-256-GCM, Argon2id und Zwei-Schlüssel-System.",
      tags: ["Electron", "Python", "AES-256"],
      githubUrl: "https://github.com/keco216/KevinKey",
      image: "/projects/kevinkey.png",
      orientation: "landscape",
    },
    {
      name: "SpeedTest",
      description:
        "Internet-Speedtest für Windows als WPF-App im Windows-11-Look: Ping, Jitter, Paketverlust sowie Download und Upload mit animiertem Tacho — plus Konsolenversion und Auto-Update.",
      tags: ["C#", ".NET", "WPF"],
      githubUrl: "https://github.com/keco216/SpeedTest",
      image: "/projects/speedtest.png",
      orientation: "portrait",
    },
  ] satisfies Project[],
  principles: [
    {
      title: "Verstehen, nicht nur installieren.",
      description:
        "Ich möchte wissen, wie ein System unter der Oberfläche arbeitet. Das macht Fehlersuche schneller und Entscheidungen belastbarer.",
    },
    {
      title: "Einfach betreibbar gewinnt.",
      description:
        "Ein gutes Projekt muss nach dem Launch verständlich bleiben: klare Abhängigkeiten, reproduzierbare Deployments und wenig Handarbeit.",
    },
    {
      title: "Sicherheit ist Teil des Designs.",
      description:
        "Zugriff, Verschlüsselung, Backups und Updates plane ich von Anfang an mit — nicht erst, wenn das Interface fertig ist.",
    },
  ] satisfies Principle[],
  githubCta: {
    eyebrow: "Mehr Code als Karten",
    headline: "Nicht alles passt auf eine Seite.",
    description:
      "Auf GitHub findest du weitere Experimente, Desktop-Apps und laufende Projekte — inklusive Quellcode und Dokumentation.",
    action: "Alle Repositories ansehen",
  },
  contact: {
    email: "kevin.colic@pm.me",
    github: "https://github.com/keco216",
    githubLabel: "GitHub",
  },
};

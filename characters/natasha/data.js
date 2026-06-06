window.registerCharacter({
  id: "natasha",
  name: "Natasha S. Vire",
  avatar: "avatar.png",  // Auto-resolves to ./characters/natasha/images/avatar.png
  initials: "NV",
  
  overview: {
    fullName: "Natasha Selene Vire",
    height: "5'6\"–5'7\" (168–170 cm)",
    gender: "Female",
    occupation: "Monster Eradication / Expedition Personnel",
    personalitySummary: `Natasha is naturally stoic, quiet, and emotionally restrained — though not cold-hearted. She fits the demeanor of a kuudere: caring beneath a calm and serious exterior. Despite her expression rarely changing, she enjoys subtle humor and occasionally goofs around while maintaining a completely straight face. She is socially functional and capable of casual interaction, but usually avoids becoming the center of attention. She values peace, routine, and emotional stability more than recognition or glory.`,
    backgroundSummary: `Natasha's cautious personality was not shaped by pride or ambition, but by years of quietly enduring unwanted attention caused by something she never chose to have — her rare red right eye, which unintentionally attracts monsters, often making her a priority target during expeditions and even in public situations. During a past encounter, a monster severely scarred her right eye. Since then, she permanently hides it behind her hair both for safety and to avoid unnecessary attention. The eye also possesses a hidden power that can emerge during moments of intense emotional distress or rage — something Natasha actively suppresses and dislikes relying on.`,
    likes: ["Plushies", "Coffee (especially Spanish coffee)", "Quiet cafes", "Window shopping", "Exercising", "Cats, birds, and geckos", "Casual goofing around while remaining stoic"],
    dislikes: ["Alcohol, smoking, and unhealthy habits", "Being flirted with excessively", "Politics", "Depending on others too much", "People damaging plushies", "Drawing unnecessary attention to herself"],
    hobbies: ["Collecting plushies (secretly)", "Exercising and martial conditioning", "Walking through familiar city routes", "Relaxing at cafes", "Quiet observation of people and surroundings"],
    relationshipBehavior: `With strangers she is calm, reserved, and unintentionally intimidating. With friends she becomes casual, cooperative, and quietly humorous. With children she is gentle and patient without overly expressive reactions. She has a notable soft spot for animals — especially cats, birds, and geckos. She dislikes emotional dependence and tends to prioritize others over herself, often suppressing her own burdens in the process.`,
    equipment: `Summoned weapons: Pistol (precise ranged attacks) and Katana (fluid close-range combat). Her fighting style prioritizes precision, efficiency, counterattacks, controlled movement, and minimal wasted energy. She is a Close-Range & Precision Combat Specialist.`
  },
  
  tags: [
    { label: "Female", style: "accent" },
    { label: "Combat Specialist", style: "gold" },
    { label: "Expedition Personnel", style: "teal" }
  ],
  
  stats: [
    { label: "Height", value: "5'6\"–5'7\"" },
    { label: "Role", value: "Close-Range / Precision" },
    { label: "Eye (L / R)", value: "Blue / Red" }
  ],
  
  gallery: [
    { src: "monsterkillpose.png", title: "Mission Record Pose", date: "2024-05-14", description: "She decides to take a picture and pose as a proof that the mission is done." },
    { src: null, title: "Face Study", date: "2026-02-28", description: "Close-up expression study — neutral to tense range." },
    { src: null, title: "Casual Outfit", date: "2026-01-10", description: "" },
    { src: "natasha.png", title: "Whole Body Picture", date: "2023-01-12", description: "" }
  ],
  
  videos: [
    {
      url: "animation.mp4",  // Auto-resolves to ./characters/natasha/videos/animation.mp4
      youtubeId: null,
      title: "2026 Character Animation",
      date: "2026-04-15",
      description: "Full character animation sequence — movement and combat showcase. Represents notable personal growth over the earlier 2025 project.",
      thumbnailUrl: "animation_thumb.png"  // Auto-resolves to ./characters/natasha/images/animation_thumb.png
    }
  ],
  
  extra: {
    lore: `Natasha possesses heterochromia — her left eye is blue, her right eye is red. The red eye unintentionally attracts monsters, making her a recurring priority target even in non-combat situations. A past monster encounter left a severe scar over her right eye, which she now permanently conceals beneath her side fringe. Beyond the physical damage, the eye is connected to a suppressed power that surfaces only under extreme emotional distress or rage — a capability Natasha fears and actively avoids triggering.\n\nHer core character theme can be summarized as: "A quiet person trying to live normally in a world that keeps noticing her for the wrong reasons." She is defined not by ambition or power, but by quiet endurance, discipline, and the small comforts she protects within herself — chief among them, a shelf of 16 carefully arranged plushies she never brings up unprompted.`,
    trivia: [
      "Secretly collects plushies — her shelf holds exactly 16, each carefully arranged.",
      "Glances at plushies in stores and arcades but never mentions it.",
      "Quietly checks the scar beneath her bangs when looking in mirrors.",
      "Maintains a perfectly neutral face even during jokes, trends, or embarrassing situations.",
      "Fixes her bed immediately upon waking — without exception.",
      "Adjusts and resets her hair fringe regularly throughout the day.",
      "Prefers window seating at cafes so she can observe without being the center of attention."
    ],
    dailyLife: `Natasha lives a quiet and disciplined lifestyle. Her room is tidy and organized — featuring a bed near a curtained window, bright-colored walls, a clothing locker, and her plushie shelf. Mornings follow a fixed sequence: fix the bed, groom, exercise (punching bag and treadmill), shower, then coffee. Free time usually involves walking familiar city routes, possibly pausing near plushie shops, and settling alone at a cafe with window seating. She sleeps early unless duties require otherwise.`,
    habits: [
      { label: "Morning Sequence", text: "Bed → grooming → exercise → shower → coffee. No deviations." },
      { label: "Hair Habit", text: "Adjusts her fringe regularly — both out of habit and to keep her right eye covered." },
      { label: "Mirror Habit", text: "Quietly checks the scar beneath her bangs when near reflective surfaces." },
      { label: "Plushie Tell", text: "Glances at plushies in stores without saying a word." },
      { label: "Expression Control", text: "Neutral face at all times — even mid-joke or during goofing around." },
      { label: "Space Preference", text: "Organized, structured environments. Clutter makes her subtly uncomfortable." }
    ]
  }
});
window.registerCharacter({
  id: "natasha",
  name: "Natasha S. Vire",
  avatar: "avatar.png",  // Auto-resolves to ./characters/natasha/images/avatar.png
  initials: "NV",
  
  overview: {
	// Required fields (still work)
	fullName: "Natasha Selene Vire",
	height: "5'6\"–5'7\" (168–170 cm)",
	gender: "Female",
	occupation: "Monster Eradication / Expedition Personnel",

	// NEW: Add age, birthday, nationality, etc.
	age: "24",
	birthday: "February 14",
    personalitySummary: `Natasha is naturally stoic, quiet, and emotionally restrained — though not cold-hearted. She fits the demeanor of a kuudere: caring beneath a calm and serious exterior. Despite her expression rarely changing, she enjoys subtle humor and occasionally goofs around while maintaining a completely straight face. She is socially functional and capable of casual interaction, but usually avoids becoming the center of attention. She values peace, routine, and emotional stability more than recognition or glory. Although naturally stoic, she is not humorless. Natasha occasionally participates in trends, jokes, and harmless goofing around while somehow maintaining the exact same expression, making it difficult to tell whether she's joking until after the moment has passed.`,
    backgroundSummary: `Natasha's cautious personality was not shaped by pride or ambition, but by years of quietly enduring unwanted attention caused by something she never chose to have — her rare red right eye, which unintentionally attracts monsters, often making her a priority target during expeditions and even in public situations. During a past encounter, a monster severely scarred her right eye. Since then, she permanently hides it behind her hair both for safety and to avoid unnecessary attention.The eye contains an unstable power that Natasha intentionally suppresses. Although capable of remarkable perception and combat enhancement, prolonged use places increasing strain on her body. She therefore treats it as a last resort rather than a weapon to rely on.`,
    likes: ["Plushies", "Coffee (especially Spanish coffee)", "Quiet cafes", "Window shopping", "Exercising", "Cats, birds, and geckos", "Casual goofing around while remaining stoic", "Taking photos during memorable moments"],
    dislikes: ["Alcohol, smoking, and unhealthy habits", "Being flirted with excessively", "Politics", "Depending on others too much", "People damaging plushies", "Drawing unnecessary attention to herself", "Seeing plushies destroyed"],
    hobbies: ["Collecting plushies (secretly)", "Exercising and martial conditioning", "Walking through familiar city routes", "Relaxing at cafes", "Quiet observation of people and surroundings", "Taking occasional photos to preserve memories"],
	powers: [
	"Weapon Manifestation",
	"Enhanced Physical Strength",
	"Enhanced Combat Reflexes",
	"Right Eye Resonance",
	"Limit Break Compatibility"
	],
    relationshipBehavior: `With strangers she is calm, reserved, and unintentionally intimidating. With friends she becomes casual, cooperative, and quietly humorous. With children she is gentle and patient without overly expressive reactions. She has a notable soft spot for animals — especially cats, birds, and geckos. She dislikes emotional dependence and tends to prioritize others over herself, often suppressing her own burdens in the process.`,
    equipment: `Manifested Weapons: Precision Combat Pistol and Katana.
Natasha materializes both weapons at will. Her combat style revolves around calm decision-making, precise movements, efficient counters, and eliminating targets with as little wasted motion as possible rather than overwhelming force.

Natasha specializes in adaptive close-quarters combat supported by accurate handgun fire.

She rarely attacks recklessly.

Instead she waits for openings, counters efficiently, and conserves stamina throughout prolonged engagements.

Years of expedition work have refined her instincts, making experience her greatest weapon rather than raw power.`
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
  
  galleryCategories: {
	  order: ["official", "collab", "fanart"],
	  names: {
		official: "Official",
		collab: "Collaborations and Fanart",
	  },
	  icons: {
		official: "",      // Empty = no icon
		collab: "",        // Empty = no icon
	  }
	},

  
  gallery: [
    { src: "righteye.png", title: "Right Eye Unsealed", date: "2025-07-05", category: "official", description: "Natasha reveals the eye she normally hides after deciding the situation can no longer be resolved through ordinary means." },
    { src: "monsterkillpose.png", title: "Mission Record Pose", date: "2024-05-14", category: "official", description: "She decides to take a picture and pose as a proof that the mission is done." },
    { src: "natasha.png", title: "Whole Body Picture", date: "2023-01-12", category: "official", description: "" },
    
    { src: "fanart.jpg", title: "Natasha's Fanart", date: "2026-06-07", category: "collab", description: "A fanart from a fellow artist, Kumi Riagi. She looks so cute there, I'd be squeeing for a long while just by staring at it." },
    { src: "collab4_final.png", title: "Natasha & Belladona", date: "2026-06-02", category: "collab", description: "Collaborated with Dani. Made a poster with Belladona, a combat maid." },
    { src: "collab3_final.png", title: "Natasha & Aeri 2", date: "2026-05-11", category: "collab", description: "Collaborated with Riagi. Just another moment of Natasha participating in a trend then decides to goof around." },
    { src: "collab2_final.jpg", title: "Natasha & Aeri 1", date: "2026-05-09", category: "collab", description: "Collaborated with Riagi. Natasha going with a trend and goes along with it." },
  ],
  
  videos: [
    {
      url: "birthday_present.mp4",  // Auto-resolves to ./characters/natasha/videos/animation.mp4
      youtubeId: null,
      title: "2026 Birthday Present",
      date: "2026-03-30",
      description: "Natasha handing over a gift to a fellow member inside the facility.",
      thumbnailUrl: "birthday_thumbnail.png"  // Auto-resolves to ./characters/natasha/images/animation_thumb.png
    }
  ],
  
  extra: {
    lore: `Natasha's red right eye is not inherently dangerous because it is exposed.

Rather, it resonates with monsters and simultaneously houses a dormant power she has spent years learning to suppress.

Keeping it hidden serves multiple purposes:

• preventing unnecessary attention

• reducing psychological burden

• avoiding accidental activation

When activated deliberately, the eye grants extraordinary perception and significantly improves combat capability, but prolonged use rapidly exhausts her body.

For Natasha, revealing the eye is never a display of confidence.

It is an admission that the situation has become serious.`,
    trivia: [
      "Secretly collects plushies — her shelf holds exactly 16, each carefully arranged.",
      "Glances at plushies in stores and arcades but never mentions it.",
      "Quietly checks the scar beneath her bangs when looking in mirrors.",
      "Maintains a perfectly neutral face even during jokes, trends, or embarrassing situations.",
      "Fixes her bed immediately upon waking — without exception.",
      "Adjusts and resets her hair fringe regularly throughout the day.",
      "Prefers window seating at cafes so she can observe without being the center of attention.",
	  "Frequently breaks standard punching bags during morning training.",
	  "The facility eventually reinforced both the punching bags and their chains specifically for her.",
	  "If forced to wear unusual outfits, she'd likely take a selfie and treat it as a once-in-a-lifetime opportunity.",
	  "Can somehow participate in jokes while maintaining a completely emotionless face.",
	  "Her expression changes so subtly that many people fail to notice when she's actually amused."
    ],
    dailyLife: `Natasha lives a quiet and disciplined lifestyle. Her room is tidy and organized — featuring a bed near a curtained window, bright-colored walls, a clothing locker, and her plushie shelf. Mornings follow a fixed sequence: fix the bed, groom, exercise (punching bag and treadmill), shower, then coffee. Free time usually involves walking familiar city routes, possibly pausing near plushie shops, and settling alone at a cafe with window seating. She sleeps early unless duties require otherwise. Although disciplined, Natasha intentionally visits familiar cafes and plushie stores during her free time as a quiet way of maintaining emotional balance between expeditions.`,
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
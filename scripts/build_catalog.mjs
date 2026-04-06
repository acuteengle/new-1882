import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import Papa from 'papaparse'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')

/** @type {{ title: string; creator: string; type: string; description: string; release_date: string; language: string }[]} */
const preserved = [
  {
    title: 'The Joy Luck Club',
    creator: 'Amy Tan',
    type: 'Book',
    description:
      'Interwoven stories of Chinese immigrant mothers and their American-born daughters exploring memory identity and silence across generations.',
    release_date: '1989-02-08',
    language: 'English',
  },
  {
    title: 'Everything Everywhere All at Once',
    creator: 'Daniel Kwan and Daniel Scheinert',
    type: 'Movie',
    description:
      'A multiverse adventure that centers an Asian American family and asks what kindness can hold when the world feels impossibly fractured.',
    release_date: '2022-03-25',
    language: 'English',
  },
  {
    title: 'Minari',
    creator: 'Lee Isaac Chung',
    type: 'Movie',
    description:
      'A tender film about a Korean American family chasing a farm dream in rural Arkansas and the cost of belonging.',
    release_date: '2020-01-26',
    language: 'Korean / English',
  },
  {
    title: 'Beef',
    creator: 'Lee Sung Jin',
    type: 'TV Show',
    description:
      'A darkly comic series about a road-rage encounter that spirals into obsession and exposes class and mental health pressures in Asian American lives.',
    release_date: '2023-04-06',
    language: 'English',
  },
  {
    title: 'Pachinko',
    creator: 'Min Jin Lee',
    type: 'Book',
    description:
      'An epic following a Korean family across Japan and America tracing survival love and the weight of history across the twentieth century.',
    release_date: '2017-02-07',
    language: 'English',
  },
  {
    title: 'Turning Red',
    creator: 'Domee Shi',
    type: 'Movie',
    description:
      'A Pixar coming-of-age story set in Toronto that uses magical realism to talk about adolescence family expectations and cultural pride.',
    release_date: '2022-03-11',
    language: 'English',
  },
  {
    title: 'The Farewell',
    creator: 'Lulu Wang',
    type: 'Movie',
    description:
      'Based on Wang’s own family: a comedy-drama about a grandmother, a lie told with love, and the different ways cultures hold grief.',
    release_date: '2019-07-12',
    language: 'English / Mandarin',
  },
  {
    title: 'Crazy Rich Asians',
    creator: 'Jon M. Chu',
    type: 'Movie',
    description:
      'A romantic comedy that became a cultural moment for representation while playfully engaging class and diaspora identity in Singapore.',
    release_date: '2018-08-15',
    language: 'English',
  },
  {
    title: 'Interior Chinatown',
    creator: 'Charles Yu',
    type: 'Book',
    description:
      'A novel framed as a screenplay that satirizes Hollywood tropes and asks who gets to be the hero in the American story.',
    release_date: '2020-01-28',
    language: 'English',
  },
  {
    title: 'Yellowface',
    creator: 'R F Kuang',
    type: 'Book',
    description:
      'A sharp thriller about authorship social media and exploitation as a white writer steals an Asian colleagues unfinished manuscript.',
    release_date: '2023-05-16',
    language: 'English',
  },
  {
    title: 'American Born Chinese',
    creator: 'Gene Luen Yang',
    type: 'Book',
    description:
      'A graphic novel braiding three tales about identity myth and the everyday work of seeing yourself clearly.',
    release_date: '2006-09-05',
    language: 'English',
  },
  {
    title: 'Shang-Chi and the Legend of the Ten Rings',
    creator: 'Destin Daniel Cretton',
    type: 'Movie',
    description:
      'A Marvel blockbuster that foregrounds family trauma and martial-arts cinema heritage with a largely Asian cast.',
    release_date: '2021-09-03',
    language: 'English / Mandarin',
  },
  {
    title: 'Reservation Dogs',
    creator: 'Taika Waititi and Sterlin Harjo',
    type: 'TV Show',
    description:
      'While centered on Indigenous teens its writers room and guest arcs have helped widen conversations about whose stories anchor prestige TV including Asian Native collaborations in Oklahoma.',
    release_date: '2021-08-09',
    language: 'English',
  },
  {
    title: 'Raya and the Last Dragon',
    creator: 'Don Hall and Carlos López Estrada',
    type: 'Movie',
    description:
      'Southeast Asian inspired fantasy adventure emphasizing trust and repair after a fractured kingdom.',
    release_date: '2021-03-05',
    language: 'English',
  },
  {
    title: 'Bling Empire',
    creator: 'Netflix',
    type: 'TV Show',
    description:
      'A reality series following wealthy Asian Americans in Los Angeles that sparked debate about representation spectacle and community.',
    release_date: '2021-01-15',
    language: 'English',
  },
  {
    title: 'The Brothers Sun',
    creator: 'Brad Falchuk and Byron Wu',
    type: 'TV Show',
    description:
      'An action dramedy about a Taiwanese American family pulled back into crime and the tension between duty and chosen life.',
    release_date: '2024-01-04',
    language: 'English / Mandarin',
  },
  {
    title: 'Fire Island',
    creator: 'Andrew Ahn',
    type: 'Movie',
    description:
      'A modern Pride and Prejudice riff set among queer Asian American friends on vacation blending rom-com beats with found family.',
    release_date: '2022-06-03',
    language: 'English',
  },
  {
    title: 'Tigertail',
    creator: 'Alan Yang',
    type: 'Movie',
    description:
      'A quiet drama about a Taiwanese immigrant reflecting on the sacrifices that built his American life and the intimacy he could not express.',
    release_date: '2020-04-10',
    language: 'English / Mandarin',
  },
  {
    title: 'Ms Marvel',
    creator: 'Marvel Studios',
    type: 'TV Show',
    description:
      'Centers a Pakistani American teen in Jersey City and weaves partition history with superhero coming-of-age.',
    release_date: '2022-06-08',
    language: 'English',
  },
  {
    title: 'The Sympathizer',
    creator: 'Viet Thanh Nguyen',
    type: 'Book',
    description:
      'A Pulitzer-winning novel about a double agent after the Vietnam War dissecting revolution exile and the performance of loyalty.',
    release_date: '2015-04-12',
    language: 'English',
  },
  {
    title: 'Minor Feelings',
    creator: 'Cathy Park Hong',
    type: 'Book',
    description:
      'Essays on racialized consciousness art and the pressure to perform gratitude when your country questions your belonging.',
    release_date: '2020-02-25',
    language: 'English',
  },
  {
    title: 'Good Trouble',
    creator: 'Freeform',
    type: 'TV Show',
    description:
      'Includes storylines that follow young activists and artists in Los Angeles including nuanced arcs for Asian American characters navigating work and justice.',
    release_date: '2019-01-09',
    language: 'English',
  },
  {
    title: 'Blasian Narratives',
    creator: 'Jivan Atman, Victoria Thomason, and Lysander Puccio',
    type: 'Podcast',
    description:
      'Conversations at the intersection of Black and Asian diasporas exploring solidarity history and everyday kinship.',
    release_date: '2016-01-01',
    language: 'English',
  },
  {
    title: 'Self Evident: Asian Americans Stories',
    creator: 'Cathy Erway',
    type: 'Podcast',
    description:
      'Documentary-style episodes on Asian American life from voting rights to mental health told with care and historical context.',
    release_date: '2018-01-01',
    language: 'English',
  },
  {
    title: 'Far East Deep South',
    creator: 'Larissa Lam and Baldwin Chiu',
    type: 'Documentary',
    description:
      'Follows a Chinese American family uncovering their Mississippi roots and the hidden history of Chinese immigrants in the Jim Crow South.',
    release_date: '2020-09-01',
    language: 'English',
  },
  {
    title: 'Who Killed Vincent Chin?',
    creator: 'Christine Choy and Renee Tajima-Peña',
    type: 'Documentary',
    description:
      'A landmark film about the murder of Vincent Chin and the Asian American civil rights response that followed.',
    release_date: '1987-01-01',
    language: 'English',
  },
  {
    title: 'The Paper Menagerie',
    creator: 'Ken Liu',
    type: 'Short fiction',
    description:
      'A heartbreaking fantasy about a Chinese mother origami magic and the languages children learn to survive.',
    release_date: '2011-03-01',
    language: 'English',
  },
  {
    title: 'Sour',
    creator: 'Olivia Rodrigo',
    type: 'Music',
    description:
      'Breakout album from a Filipino American artist whose songwriting reshaped pop radio and youth culture in the early 2020s.',
    release_date: '2021-05-21',
    language: 'English',
  },
  {
    title: 'Killing Eve',
    creator: 'Phoebe Waller-Bridge',
    type: 'TV Show',
    description:
      'Features Sandra Oh in a career-defining lead role that expanded who audiences imagined at the center of a spy thriller.',
    release_date: '2018-04-08',
    language: 'English',
  },
  {
    title: "Kim's Convenience",
    creator: 'Ins Choi',
    type: 'TV Show',
    description:
      'A Canadian sitcom about a Korean Canadian family store that balanced warmth and critique before its controversial end.',
    release_date: '2016-10-11',
    language: 'English',
  },
  {
    title: 'Searching',
    creator: 'Aneesh Chaganty',
    type: 'Movie',
    description:
      'A thriller told entirely through screens that put John Cho in a leading role as a father racing to find his missing daughter.',
    release_date: '2018-08-24',
    language: 'English',
  },
]

function hashString(s) {
  let h = 0
  for (let i = 0; i < s.length; i += 1) h = (h * 31 + s.charCodeAt(i)) | 0
  return Math.abs(h)
}

/** Natural adjective for "a ___ film" etc.; null if we should say "from {region}" instead. */
function regionAdjective(region) {
  const map = {
    'South Korea': 'South Korean',
    Japan: 'Japanese',
    China: 'Chinese',
    Taiwan: 'Taiwanese',
    'Hong Kong': 'Hong Kong',
    India: 'Indian',
    'United States': 'American',
    'United Kingdom': 'British',
    Singapore: 'Singaporean',
    Thailand: 'Thai',
    Vietnam: 'Vietnamese',
    Indonesia: 'Indonesian',
    Philippines: 'Filipino',
    Malaysia: 'Malaysian',
    Bangladesh: 'Bangladeshi',
    Pakistan: 'Pakistani',
    Nepal: 'Nepali',
    'Sri Lanka': 'Sri Lankan',
    Iran: 'Iranian',
    Jordan: 'Jordanian',
    Syria: 'Syrian',
    Canada: 'Canadian',
    France: 'French',
    Australia: 'Australian',
    Hungary: 'Hungarian',
    Mongolia: 'Mongolian',
    Cambodia: 'Cambodian',
    Myanmar: 'Burmese',
    Kazakhstan: 'Kazakh',
  }
  return map[region] ?? null
}

function yearFrom(dateStr) {
  const y = String(dateStr).slice(0, 4)
  return /^\d{4}$/.test(y) ? y : null
}

/** "a" vs "an" before adjective (Indian, American, …). */
function aAn(word) {
  if (!word) return 'a'
  const w = String(word).trim()
  if (/^[aeiou]/i.test(w)) return 'an'
  return 'a'
}

function capitalizeFirst(str) {
  if (!str) return str
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function pickVariant(seed, variants) {
  return variants[seed % variants.length]
}

/**
 * Short catalog-style blurbs (not meta commentary about "studies" or "literacy").
 * @param {{ title: string; creator: string; type: string; release_date: string; language: string; region: string }} w
 */
function describeGenerated(w) {
  const { title, creator, type, release_date: rd, region } = w
  const y = yearFrom(rd)
  const adj = regionAdjective(region)
  const origin = adj ?? region
  const seed = hashString(`${title}|${type}|${creator}`)

  const by = creator.includes(',') || /\band\b/i.test(creator)
    ? `from ${creator}`
    : `by ${creator}`

  const aa = aAn(origin)

  switch (type) {
    case 'Movie': {
      const v = pickVariant(seed, [
        () =>
          y
            ? `Released in ${y}, ${title} is ${aa} ${origin} feature shaped ${by}, pairing strong performances with a clear sense of place and pacing.`
            : `${title} is ${aa} ${origin} feature shaped ${by}, pairing strong performances with a clear sense of place and pacing.`,
        () =>
          y
            ? `${title} (${y}) is ${aa} ${origin} film ${by === `by ${creator}` ? `directed by ${creator}` : fromCreators(creator)}, balancing character drama with memorable set pieces and tone.`
            : `${title} is ${aa} ${origin} film ${by === `by ${creator}` ? `directed by ${creator}` : fromCreators(creator)}, balancing character drama with memorable set pieces and tone.`,
        () =>
          y
            ? `This ${y} ${origin} release, ${title}, is helmed by ${creator} and sits among standout work from its era for mood, story, and craft.`
            : `${title}, ${aa} ${origin} release, is helmed by ${creator} and stands out for mood, story, and craft.`,
        () =>
          y
            ? `${title} (${y}) is ${aa} ${origin} film ${by}, following characters through conflict and consequence with a distinctive visual and narrative voice.`
            : `${title} is ${aa} ${origin} film ${by}, following characters through conflict and consequence with a distinctive visual and narrative voice.`,
      ])
      return v()
    }
    case 'TV Show': {
      const v = pickVariant(seed, [
        () =>
          y
            ? `${title} (${y} debut) is ${aa} ${origin} series ${by}, built for long-form storytelling, recurring characters, and serialized stakes.`
            : `${title} is ${aa} ${origin} series ${by}, built for long-form storytelling, recurring characters, and serialized stakes.`,
        () =>
          y
            ? `${capitalizeFirst(`${aa} ${origin} show`)} led ${by}, ${title} premiered around ${y} and blends episodic hooks with season-long arcs and production polish.`
            : `${capitalizeFirst(`${aa} ${origin} show`)} led ${by}, ${title} blends episodic hooks with season-long arcs and production polish.`,
        () =>
          `${title} follows an ensemble through shifting relationships and plot turns; ${by}, it represents a notable ${origin} entry in contemporary TV.`,
      ])
      return v()
    }
    case 'Anime': {
      const v = pickVariant(seed, [
        () =>
          y
            ? `${title} (${y}) is ${aa} ${origin} animated series ${by}, known for pacing, design, and serialized storytelling that built a wide fan base.`
            : `${title} is ${aa} ${origin} animated series ${by}, known for pacing, design, and serialized storytelling.`,
        () =>
          y
            ? `This ${origin} anime from ${y}, ${title}, is associated with ${creator} and mixes action, emotion, and distinctive art direction.`
            : `This ${origin} anime, ${title}, is associated with ${creator} and mixes action, emotion, and distinctive art direction.`,
      ])
      return v()
    }
    case 'Documentary': {
      const lensArt = aAn(origin)
      const v = pickVariant(seed, [
        () =>
          y
            ? `${title} (${y}) is ${aa} ${origin} documentary ${by}, focusing on real people and events with an observational, journalistic edge.`
            : `${title} is ${aa} ${origin} documentary ${by}, focusing on real people and events with an observational, journalistic edge.`,
        () =>
          y
            ? `Shot through ${lensArt} ${origin} lens, ${title} (${y}) ${by === `by ${creator}` ? `comes from filmmaker ${creator}` : `is credited to ${creator}`} and asks viewers to sit with facts, context, and human detail.`
            : `Shot through ${lensArt} ${origin} lens, ${title} ${by === `by ${creator}` ? `comes from filmmaker ${creator}` : `is credited to ${creator}`} and asks viewers to sit with facts, context, and human detail.`,
      ])
      return v()
    }
    case 'Book': {
      const v = pickVariant(seed, [
        () =>
          y
            ? `${title} (${y}) is a novel ${by} that weaves personal voice with history, family, and place across its chapters.`
            : `${title} is a novel ${by} that weaves personal voice with history, family, and place across its chapters.`,
        () =>
          y
            ? `In ${title}, ${creator} traces characters through memory, migration, and choice; the ${y} publication remains a readable entry point into ${origin} letters and ideas.`
            : `In ${title}, ${creator} traces characters through memory, migration, and choice, offering a readable entry point into ${origin} letters and ideas.`,
        () =>
          y
            ? `${by === `by ${creator}` ? `${possessive(creator)} ` : 'This '}${title} (${y}) mixes intimate scenes with wider social backdrop, anchored in ${origin} and diaspora storytelling traditions.`
            : `${by === `by ${creator}` ? `${possessive(creator)} ` : 'This '}${title} mixes intimate scenes with wider social backdrop, anchored in ${origin} and diaspora storytelling traditions.`,
      ])
      return v()
    }
    case 'Graphic novel':
    case 'Manga': {
      const format = type === 'Manga' ? 'serialized manga' : 'a graphic novel'
      return y
        ? `${title} (${y}) is ${format} ${by}, pairing panel rhythm and dialogue with a strong visual identity rooted in ${origin} comics culture.`
        : `${title} is ${format} ${by}, pairing panel rhythm and dialogue with a strong visual identity rooted in ${origin} comics culture.`
    }
    case 'Music': {
      const v = pickVariant(seed, [
        () =>
          y
            ? `${title} (${y}) is a recorded project ${by}, showcasing melody, production, and performance within the ${origin} popular-music landscape.`
            : `${title} is a recorded project ${by}, showcasing melody, production, and performance within the ${origin} popular-music landscape.`,
        () =>
          y
            ? `${title} (${y}), from ${creator}, collects tracks that highlight tone, arrangement, and era-defining studio choices in ${origin} pop and soundtrack culture.`
            : `${title}, from ${creator}, collects tracks that highlight tone, arrangement, and era-defining studio choices in ${origin} pop and soundtrack culture.`,
      ])
      return v()
    }
    case 'Podcast': {
      return `${title} is a show ${by}, mixing interviews, commentary, and stories aimed at listeners curious about culture, identity, and community.`
    }
    case 'Video game': {
      return y
        ? `${title} (${y}) is a game ${by}, combining systems, world-building, and play feel associated with ${origin} studios and design traditions.`
        : `${title} is a game ${by}, combining systems, world-building, and play feel associated with ${origin} studios and design traditions.`
    }
    case 'Web novel': {
      return `${title} is an online serial ${by}, written for chapter-by-chapter reading and fan engagement; it sits in the ${origin} web-fiction ecosystem.`
    }
    case 'Short fiction': {
      return `${title} is short fiction ${by}, compact in length but wide in implication—typical of contemporary ${origin} and diaspora story forms.`
    }
    default: {
      const v = pickVariant(seed, [
        () =>
          y
            ? `${title} (${y}) is ${aa} ${type.toLowerCase()} ${by}, notable for craft and context within ${origin} media and arts.`
            : `${title} is ${aa} ${type.toLowerCase()} ${by}, notable for craft and context within ${origin} media and arts.`,
        () =>
          y
            ? `${possessiveLead(creator)}${title} (${y}) offers a concise way into ${type.toLowerCase()} work from ${region}, mixing form and cultural backdrop.`
            : `${possessiveLead(creator)}${title} offers a concise way into ${type.toLowerCase()} work from ${region}, mixing form and cultural backdrop.`,
      ])
      return v()
    }
  }
}

function possessive(name) {
  return /s$/i.test(name.trim()) ? `${name}'` : `${name}'s`
}

function possessiveLead(creator) {
  if (/\band\b/i.test(creator) || creator.includes(',')) return ''
  return `${possessive(creator)} `
}

function fromCreators(creator) {
  return /\band\b/i.test(creator) || creator.includes(',')
    ? `from ${creator}`
    : `directed by ${creator}`
}

/**
 * Parse lines: title|creator|type|release_date|language|region
 * region is used only for generated descriptions.
 */
function loadPipeFile(filePath) {
  const text = fs.readFileSync(filePath, 'utf8')
  const out = []
  for (const line of text.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const parts = trimmed.split('|')
    if (parts.length < 6) continue
    const [title, creator, type, release_date, language, region] = parts
    out.push({
      title: title.trim(),
      creator: creator.trim(),
      type: type.trim(),
      release_date: release_date.trim(),
      language: language.trim(),
      region: region.trim(),
    })
  }
  return out
}

function normalizeTitle(s) {
  return s.trim().toLowerCase()
}

function build() {
  const dataDir = path.join(__dirname, 'data')
  const files = fs
    .readdirSync(dataDir)
    .filter((f) => f.endsWith('.pipe'))
    .sort()

  /** @type {Map<string, typeof preserved[0]>} */
  const byTitle = new Map()
  function dedupeKey(row) {
    return `${normalizeTitle(row.title)}|${normalizeTitle(row.type)}|${normalizeTitle(row.creator)}`
  }

  for (const row of preserved) {
    byTitle.set(dedupeKey(row), { ...row })
  }

  for (const f of files) {
    const chunk = loadPipeFile(path.join(dataDir, f))
    for (const w of chunk) {
      const candidate = {
        title: w.title,
        creator: w.creator,
        type: w.type,
        release_date: w.release_date,
        language: w.language,
        description: describeGenerated(w),
      }
      const key = dedupeKey(candidate)
      if (byTitle.has(key)) continue
      byTitle.set(key, candidate)
    }
  }

  const rows = [...byTitle.values()].sort((a, b) =>
    a.title.localeCompare(b.title, 'en', { sensitivity: 'base' }),
  )

  const csv = Papa.unparse(rows, {
    columns: [
      'title',
      'creator',
      'type',
      'description',
      'release_date',
      'language',
    ],
    quotes: true,
  })

  fs.writeFileSync(path.join(root, 'public', 'media.csv'), csv, 'utf8')
  console.log(`Wrote ${rows.length} rows to public/media.csv`)
}

build()

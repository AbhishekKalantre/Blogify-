// Mock data for posts with different categories
const posts = [
  // Blog posts
  {
    id: 1,
    title: "Getting Started with React",
    excerpt:
      "A beginner's guide to React development and modern frontend practices.",
    content:
      "React is a popular JavaScript library for building user interfaces. Created by Facebook, it allows developers to create reusable UI components.",
    category: "blog",
    subcategory: "programming",
    author: "Jane Smith",
    date: "2023-08-15",
    imageUrl:
      "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    tags: ["React", "JavaScript", "Frontend"],
  },
  {
    id: 2,
    title: "CSS Grid vs Flexbox",
    excerpt:
      "Understanding the differences between CSS Grid and Flexbox for layouts.",
    content:
      "CSS Grid and Flexbox are powerful layout systems available in CSS. Grid is two-dimensional while Flexbox is one-dimensional.",
    category: "blog",
    subcategory: "coding",
    author: "Alex Johnson",
    date: "2023-07-22",
    imageUrl:
      "https://images.unsplash.com/photo-1621839673705-6617adf9e890?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1332&q=80",
    tags: ["CSS", "Web Design", "Frontend"],
  },
  {
    id: 3,
    title: "The Future of Web Development",
    excerpt:
      "Exploring upcoming trends and technologies shaping the future of web development.",
    content:
      "The web development landscape is constantly evolving with new frameworks, tools, and approaches emerging regularly.",
    category: "blog",
    subcategory: "tech",
    author: "Samantha Lee",
    date: "2023-09-05",
    imageUrl:
      "https://images.unsplash.com/photo-1617042375876-a13e36732a04?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    tags: ["Web Development", "Future Tech", "Trends"],
  },
  {
    id: 10,
    title: "Understanding Blockchain Technology",
    excerpt:
      "A comprehensive guide to blockchain and its applications beyond cryptocurrency.",
    content:
      "Blockchain technology has applications far beyond just cryptocurrency. This distributed ledger technology is revolutionizing various industries.",
    category: "blog",
    subcategory: "tech",
    author: "Mark Robertson",
    date: "2023-08-28",
    imageUrl:
      "https://images.unsplash.com/photo-1639322537228-f710d846310a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1332&q=80",
    tags: ["Blockchain", "Technology", "Cryptocurrency"],
  },
  {
    id: 11,
    title: "Python for Data Science",
    excerpt:
      "How to use Python and its libraries for effective data analysis and visualization.",
    content:
      "Python has become the language of choice for data scientists thanks to libraries like pandas, NumPy, and matplotlib.",
    category: "blog",
    subcategory: "programming",
    author: "Lisa Chen",
    date: "2023-07-30",
    imageUrl:
      "https://images.unsplash.com/photo-1526379879527-8559ecfcaec0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80",
    tags: ["Python", "Data Science", "Programming"],
  },
  {
    id: 12,
    title: "Clean Code Principles",
    excerpt:
      "Best practices for writing maintainable and readable code across any language.",
    content:
      "Writing clean code is essential for long-term project success. This article covers the key principles that apply to any programming language.",
    category: "blog",
    subcategory: "coding",
    author: "James Wilson",
    date: "2023-09-15",
    imageUrl:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    tags: ["Clean Code", "Best Practices", "Software Development"],
  },

  // Stories
  {
    id: 4,
    title: "The Last Summer",
    excerpt: "A nostalgic journey through memories of a life-changing summer.",
    content:
      "It was the summer of 2010 when everything changed. The air was warm, filled with the scent of blooming jasmine and possibilities.",
    category: "story",
    subcategory: "coming-of-age",
    author: "Michael Chen",
    date: "2023-06-18",
    imageUrl:
      "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    tags: ["Fiction", "Coming of Age", "Summer"],
  },
  {
    id: 5,
    title: "Whispers in the Dark",
    excerpt: "A short thriller about mysterious events in a small town.",
    content:
      "The town of Millfield had always been quiet, perhaps too quiet. But when strange whispers began to emerge from the old forest, people started to worry.",
    category: "story",
    subcategory: "mystery",
    author: "Emily Williams",
    date: "2023-08-30",
    imageUrl:
      "https://images.unsplash.com/photo-1516410529446-2c777cb7366d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80",
    tags: ["Fiction", "Thriller", "Mystery"],
  },
  {
    id: 6,
    title: "The Journey Home",
    excerpt:
      "An emotional tale of finding one's way back to what matters most.",
    content:
      "After fifteen years away, Sarah returned to the place she once called home, unsure of what—or who—she might find.",
    category: "story",
    subcategory: "drama",
    author: "David Garcia",
    date: "2023-07-12",
    imageUrl:
      "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    tags: ["Fiction", "Drama", "Family"],
  },
  {
    id: 13,
    title: "Echoes of Eternity",
    excerpt:
      "A science fiction adventure spanning multiple galaxies and timelines.",
    content:
      "Commander Elara stepped onto the bridge of the Starship Horizon, unaware that her next decision would ripple across thousands of years of history.",
    category: "story",
    subcategory: "sci-fi",
    author: "Robert Taylor",
    date: "2023-08-05",
    imageUrl:
      "https://images.unsplash.com/photo-1505506874110-6a7a69069a08?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1073&q=80",
    tags: ["Science Fiction", "Space", "Time Travel"],
  },
  {
    id: 14,
    title: "The Dragon's Keep",
    excerpt:
      "A fantasy tale of courage, magic, and the unexpected friendship between a knight and a dragon.",
    content:
      "Sir Edmund had prepared his entire life to slay the dragon of the Northern Mountains. He never expected to end up sharing tea with it instead.",
    category: "story",
    subcategory: "fantasy",
    author: "Katherine Hill",
    date: "2023-07-20",
    imageUrl:
      "https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1332&q=80",
    tags: ["Fantasy", "Dragons", "Adventure"],
  },
  {
    id: 15,
    title: "Midnight Memories",
    excerpt:
      "A nostalgic reflection on childhood friendships and the moments that shape us.",
    content:
      "We used to meet at the old oak tree every midnight during summer vacation. Those moments, seemingly insignificant then, were quietly defining our lives.",
    category: "story",
    subcategory: "coming-of-age",
    author: "Sophia Martinez",
    date: "2023-09-12",
    imageUrl:
      "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80",
    tags: ["Nostalgia", "Friendship", "Growing Up"],
  },

  // News
  {
    id: 7,
    title: "New Framework Released",
    excerpt: "Major tech company unveils new web development framework.",
    content:
      "Yesterday at their annual developer conference, TechCorp announced the release of Quantum.js, a revolutionary framework designed to simplify complex state management.",
    category: "news",
    subcategory: "technology",
    author: "Tech Editorial Team",
    date: "2023-09-10",
    imageUrl:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    tags: ["Technology", "Framework", "Release"],
  },
  {
    id: 8,
    title: "Web Accessibility Guidelines Updated",
    excerpt:
      "WCAG releases new guidelines for making websites more accessible.",
    content:
      "The Web Content Accessibility Guidelines (WCAG) has released version 3.0, introducing new criteria for ensuring digital content is accessible to all users, including those with disabilities.",
    category: "news",
    subcategory: "web",
    author: "Accessibility Watch",
    date: "2023-08-05",
    imageUrl:
      "https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80",
    tags: ["Accessibility", "WCAG", "Web Standards"],
  },
  {
    id: 9,
    title: "Major Browser Update",
    excerpt:
      "Popular web browser introduces AI-powered features in latest update.",
    content:
      "Chrome has launched version 115 with a suite of AI-powered features, including improved translation capabilities, smart searching, and automated accessibility enhancements.",
    category: "news",
    subcategory: "software",
    author: "Web Tech News",
    date: "2023-09-02",
    imageUrl:
      "https://images.unsplash.com/photo-1581472723648-909f4851d4ae?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    tags: ["Browsers", "Chrome", "AI", "Technology"],
  },
  {
    id: 16,
    title: "Major AI Breakthrough Announced",
    excerpt:
      "Research team achieves significant milestone in artificial intelligence capabilities.",
    content:
      "A team of researchers at MIT has announced a breakthrough in AI cognition that allows systems to understand context and nuance in human communication at near-human levels.",
    category: "news",
    subcategory: "ai",
    author: "Science & Tech Review",
    date: "2023-09-18",
    imageUrl:
      "https://images.unsplash.com/photo-1581472723648-909f4851d4ae?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    tags: ["AI", "Machine Learning", "Research"],
  },
  {
    id: 17,
    title: "Global Cybersecurity Summit Addresses Rising Threats",
    excerpt:
      "Industry leaders gather to discuss strategies against evolving cyber attacks.",
    content:
      "The annual Global Cybersecurity Summit brought together experts from 45 countries to address the alarming rise in sophisticated ransomware attacks targeting critical infrastructure.",
    category: "news",
    subcategory: "security",
    author: "Cybersecurity Today",
    date: "2023-08-15",
    imageUrl:
      "https://images.unsplash.com/photo-1563453392212-326f5e854473?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    tags: ["Cybersecurity", "Ransomware", "Digital Security"],
  },
  {
    id: 18,
    title: "New API Standard Aims to Unify Service Integration",
    excerpt:
      "Industry consortium proposes new standard for more seamless API integrations.",
    content:
      "The Open API Consortium has released a draft of API Connect 2.0, a proposed standard aimed at simplifying cross-platform integrations and reducing implementation complexity.",
    category: "news",
    subcategory: "web",
    author: "Developer Weekly",
    date: "2023-09-05",
    imageUrl:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80",
    tags: ["API", "Web Development", "Standards"],
  },
];

export default posts;

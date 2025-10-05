export type JobView = {
  id: string;
  title: string;
  description: string;
  content: string;
  subViews?: JobView[];
};

export type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  description: string;
  views: JobView[];
};

const job1: Job = {
  id: "1",
  title: "Senior Frontend Developer",
  company: "TechCorp Inc.",
  location: "San Francisco, CA",
  salary: "$120k - $160k",
  description:
    "Join our team building next-generation web applications using React and TypeScript. We're looking for an experienced developer passionate about creating exceptional user experiences.",
  views: [
      {
        id: "1-1",
        title: "Research",
        description: "Company research and insights",
        content:
          "• TechCorp is a leading innovator in web technologies\n• Founded in 2015, now 500+ employees\n• Recent Series C funding of $50M\n• Known for cutting-edge React development\n• Strong engineering culture and mentorship",
        subViews: [
          {
            id: "1-1-1",
            title: "Company Culture",
            description: "Deep dive into work culture",
            content:
              "• Flexible work hours and remote options\n• Strong focus on work-life balance\n• Monthly team building events\n• Generous PTO policy (25 days)\n• Professional development budget ($5k/year)\n• Mentorship program for all levels\n• Quarterly hackathons\n• Open feedback culture",
          },
          {
            id: "1-1-2",
            title: "Tech Stack",
            description: "Technologies and tools",
            content:
              "• Frontend: React 18, TypeScript, Next.js\n• State Management: Zustand, React Query\n• Styling: Tailwind CSS, CSS Modules\n• Testing: Vitest, Playwright, Testing Library\n• CI/CD: GitHub Actions, Vercel\n• Monitoring: Sentry, Datadog\n• Design: Figma, Storybook\n• Version Control: Git, GitHub",
          },
          {
            id: "1-1-3",
            title: "Benefits",
            description: "Compensation and perks",
            content:
              "• Competitive salary with annual reviews\n• Equity/stock options included\n• Premium health, dental, vision insurance\n• 401k matching up to 6%\n• Home office stipend ($1500)\n• Latest MacBook Pro or equivalent\n• Unlimited learning resources\n• Gym membership reimbursement",
          },
        ],
      },
      {
        id: "1-2",
        title: "Messages",
        description: "Recent communications",
        content:
          "• Sarah from HR: 'Looking forward to your application!'\n• John (Engineering Manager): 'We're excited about this role'\n• Recruiter: 'Feel free to reach out with questions'\n• Team lead: 'Our team is growing fast'",
      },
      {
        id: "1-3",
        title: "Notifications",
        description: "Updates and alerts",
        content:
          "• Application deadline: 2 weeks remaining\n• 15 people have applied this week\n• Salary range recently updated\n• New benefits package announced\n• Virtual office tour available",
      },
      {
        id: "1-4",
        title: "Recent Activity",
        description: "Latest updates",
        content:
          "• Job posted 5 days ago\n• 47 views in last 24 hours\n• 3 employees shared this position\n• Featured in company newsletter\n• Trending in Frontend jobs",
      },
      {
        id: "1-5",
        title: "News",
        description: "Company news",
        content:
          "• TechCorp launches new AI-powered product line\n• Recognized as 'Best Place to Work 2024'\n• Opening new office in Austin, TX\n• CEO featured in Tech Innovation podcast\n• Partnership announced with major cloud provider",
      },
      {
        id: "1-6",
        title: "People",
        description: "Team and contacts",
        content:
          "• Hiring Manager: Sarah Chen (VP Engineering)\n• Recruiter: Mike Johnson\n• Team Size: 12 engineers\n• You'd work with: Frontend Architecture team\n• 3 of your connections work here",
      },
    ],
};

const job2: Job = {
  id: "2",
  title: "Full Stack Engineer",
  company: "StartupXYZ",
  location: "Remote",
  salary: "$100k - $140k",
  description:
    "Help us build scalable microservices and beautiful user interfaces. We're a fast-growing startup looking for someone who can work across the entire stack.",
  views: [
      {
        id: "2-1",
        title: "Research",
        description: "Company research and insights",
        content:
          "• StartupXYZ is a fast-growing SaaS platform\n• Seed stage startup with $5M in funding\n• 25 employees across engineering, product, and sales\n• Tech stack: React, Next.js, Node.js, PostgreSQL\n• Remote-first culture with quarterly team meetups",
      },
      {
        id: "2-2",
        title: "Messages",
        description: "Recent communications",
        content:
          "• Alex (CTO): 'We need someone who can hit the ground running'\n• Emma (Product): 'Excited to collaborate with new team member'\n• Recruiter: 'Applications being reviewed on rolling basis'\n• Engineering team: 'We value learning and experimentation'",
      },
      {
        id: "2-3",
        title: "Notifications",
        description: "Updates and alerts",
        content:
          "• Urgent: High priority role, fast hiring process\n• 8 candidates in final rounds\n• Remote work equipment stipend: $2000\n• Health insurance starts day one\n• Stock options included in offer",
      },
      {
        id: "2-4",
        title: "Recent Activity",
        description: "Latest updates",
        content:
          "• Job posted 2 weeks ago\n• 120 applications received\n• 5 candidates in interview process\n• Role shared 23 times on LinkedIn\n• Featured on RemoteOK and WeWorkRemotely",
      },
      {
        id: "2-5",
        title: "News",
        description: "Company news",
        content:
          "• StartupXYZ raises $5M seed round\n• Product launch exceeds 10K users in first month\n• Featured in TechCrunch startup spotlight\n• Expanding to European market Q2 2024\n• Named 'Startup to Watch' by VentureBeat",
      },
      {
        id: "2-6",
        title: "People",
        description: "Team and contacts",
        content:
          "• Hiring Manager: Alex Rivera (CTO)\n• Recruiter: Jessica Lee\n• Team Size: 15 engineers\n• You'd work with: Full product engineering team\n• 1 of your connections works here",
      },
    ],
};

const job3: Job = {
  id: "3",
  title: "Product Designer",
  company: "Design Studio",
  location: "New York, NY",
  salary: "$90k - $130k",
  description:
    "Create beautiful, intuitive designs for mobile and web applications. We're seeking a designer who combines creativity with user-centered thinking.",
  views: [
      {
        id: "3-1",
        title: "Research",
        description: "Company research and insights",
        content:
          "• Design Studio is a boutique design agency\n• Specializes in mobile and web product design\n• 30 person team: designers, researchers, developers\n• Clients include Fortune 500 and startups\n• Award-winning work featured in design publications",
      },
      {
        id: "3-2",
        title: "Messages",
        description: "Recent communications",
        content:
          "• Rachel (Design Director): 'Portfolio review happening weekly'\n• Chris (Lead Designer): 'We're looking for creative problem solvers'\n• Recruiter: 'Please include case studies with application'\n• Team: 'Collaborative environment, your voice matters'",
      },
      {
        id: "3-3",
        title: "Notifications",
        description: "Updates and alerts",
        content:
          "• Portfolio review required for consideration\n• Design challenge sent to shortlisted candidates\n• Onsite visit to NYC office for final round\n• Position may be filled quickly\n• Relocation assistance available",
      },
      {
        id: "3-4",
        title: "Recent Activity",
        description: "Latest updates",
        content:
          "• Job posted 1 week ago\n• 89 applications received\n• 12 portfolios under review\n• Position shared by design community\n• Featured on Dribbble job board",
      },
      {
        id: "3-5",
        title: "News",
        description: "Company news",
        content:
          "• Design Studio wins AIGA Design Award\n• New office opening in Brooklyn\n• Case study published in Fast Company\n• Speaking at Design Systems Conference\n• Partnership with leading design school announced",
      },
      {
        id: "3-6",
        title: "People",
        description: "Team and contacts",
        content:
          "• Hiring Manager: Rachel Martinez (Design Director)\n• Recruiter: Tom Anderson\n• Team Size: 8 product designers\n• You'd work with: Consumer products team\n• 2 of your connections work here",
      },
    ],
};

export const mockJobs: Job[] = [job1, job2, job3];

export const mockJobSearches = [
  {
    id: "search-1",
    title: "Tech Companies - Bay Area",
    description: "Searching for senior engineering roles at tech companies in San Francisco and surrounding areas",
    jobs: [job1],
  },
  {
    id: "search-2",
    title: "Remote Opportunities",
    description: "Remote-first companies offering full-stack and backend positions",
    jobs: [job2],
  },
  {
    id: "search-3",
    title: "Design & Creative Roles",
    description: "Product design and UX positions in New York and East Coast",
    jobs: [job3],
  },
];

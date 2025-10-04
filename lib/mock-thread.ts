export type ThreadView = {
  id: string;
  title: string;
  description: string;
  content: string;
  subViews?: ThreadView[];
};

export type Thread = {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  description: string;
  views: ThreadView[];
};

export const mockThreads: Thread[] = [
  {
    id: "t1",
    title: "Discussion with TechCorp Recruiter",
    company: "TechCorp Inc.",
    location: "3 messages",
    salary: "Active",
    description:
      "Ongoing conversation about the Senior Frontend Developer position. Last message received 2 hours ago.",
    views: [
      {
        id: "t1-1",
        title: "Messages",
        description: "View conversation history",
        content:
          "[Placeholder: Chat message thread would appear here]\n\nSarah (Recruiter): Hi! Thanks for your interest in our Senior Frontend role.\n\nYou: Thanks for reaching out! I'm very interested in learning more.\n\nSarah: Great! Would you be available for a quick call this week?",
      },
      {
        id: "t1-2",
        title: "Thread Info",
        description: "Details about this conversation",
        content:
          "• Started: 3 days ago\n• Participants: You, Sarah Chen\n• Status: Active\n• Last activity: 2 hours ago\n• Related job: Senior Frontend Developer",
      },
      {
        id: "t1-3",
        title: "Attachments",
        description: "Files and links shared",
        content:
          "• Resume.pdf (shared by you)\n• Job_Description.pdf (shared by Sarah)\n• Calendar invite: Interview screening\n• Company deck.pdf",
      },
    ],
  },
  {
    id: "t2",
    title: "StartupXYZ Interview Follow-up",
    company: "StartupXYZ",
    location: "7 messages",
    salary: "Pending",
    description:
      "Follow-up conversation after technical interview. Waiting for feedback from the team.",
    views: [
      {
        id: "t2-1",
        title: "Messages",
        description: "View conversation history",
        content:
          "[Placeholder: Chat message thread would appear here]\n\nAlex (CTO): Thanks for taking the time to interview with us!\n\nYou: It was great meeting the team. I'm excited about the opportunity.\n\nAlex: We'll have feedback for you by end of week.\n\nYou: Sounds good, looking forward to hearing from you!",
      },
      {
        id: "t2-2",
        title: "Thread Info",
        description: "Details about this conversation",
        content:
          "• Started: 1 week ago\n• Participants: You, Alex Rivera, Jessica Lee\n• Status: Pending response\n• Last activity: 1 day ago\n• Related job: Full Stack Engineer",
      },
      {
        id: "t2-3",
        title: "Interview Notes",
        description: "Your notes from the interview",
        content:
          "[Placeholder: Interview notes]\n\n• Tech stack matches my experience well\n• Team seems collaborative and supportive\n• Liked the product vision Alex shared\n• Questions about remote work schedule answered\n• Next steps: waiting for team feedback",
      },
    ],
  },
  {
    id: "t3",
    title: "Design Studio Portfolio Review",
    company: "Design Studio",
    location: "5 messages",
    salary: "Completed",
    description:
      "Portfolio review discussion and design challenge submission. Interview scheduled for next week.",
    views: [
      {
        id: "t3-1",
        title: "Messages",
        description: "View conversation history",
        content:
          "[Placeholder: Chat message thread would appear here]\n\nRachel (Design Director): Your portfolio looks great!\n\nYou: Thank you! I'd love to discuss the Product Designer role.\n\nRachel: We'd like to send you a design challenge. Are you interested?\n\nYou: Absolutely! Looking forward to it.\n\nRachel: Great! I'll send it over shortly.",
      },
      {
        id: "t3-2",
        title: "Thread Info",
        description: "Details about this conversation",
        content:
          "• Started: 2 weeks ago\n• Participants: You, Rachel Martinez, Tom Anderson\n• Status: Challenge submitted\n• Last activity: 3 days ago\n• Related job: Product Designer",
      },
      {
        id: "t3-3",
        title: "Design Challenge",
        description: "Challenge details and submission",
        content:
          "[Placeholder: Design challenge info]\n\n• Challenge: Mobile app redesign concept\n• Deadline: Submitted on time\n• Format: Figma file + case study\n• Status: Under review\n• Feedback expected: This week",
        subViews: [
          {
            id: "t3-3-1",
            title: "Submission Details",
            description: "What you submitted",
            content:
              "[Placeholder: Submission details]\n\n• Figma prototype link\n• Case study PDF (15 pages)\n• User research summary\n• Design rationale document\n• Submitted 3 days ago",
          },
        ],
      },
    ],
  },
];

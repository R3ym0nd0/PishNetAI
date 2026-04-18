const authTokenKey = 'phish_ai_token';
const authUserKey = 'phish_ai_user';
const activeChatKey = 'phish_ai_active_chat';
const DEPLOY_FRONTEND_ORIGINS = new Set([
    'https://phishnetai.netlify.app',
    'https://pishnetai.vercel.app'
]);
const RENDER_API_BASE = 'https://phishnetai-fb30.onrender.com';
const coreQuizIds = [
    'url-basics',
    'message-red-flags',
    'after-clicking',
    'login-page-clues',
    'qr-link-safety',
    'social-media-scams'
];
const skillBuilderQuizIds = [
    'sender-source-checks',
    'attachment-download-safety',
    'account-recovery-traps',
    'form-data-requests',
    'payment-delivery-scams',
    'support-impersonation'
];
const challengerQuizIds = [
    'scholarship-bait',
    'document-sharing-traps',
    'mobile-alert-deception',
    'event-registration-risks',
    'marketplace-meetup-scams',
    'multi-step-phish-cases'
];
const advancedSeriesQuizIds = [
    'campus-portal-spoofs',
    'urgent-admin-fraud',
    'cloud-drive-compromise',
    'internship-hiring-scams',
    'verification-chain-attacks',
    'phishing-scenarios'
];
const masterySeriesQuizIds = [
    'executive-impersonation',
    'breach-followup-scams',
    'recovery-flow-attacks',
    'financial-approval-fraud',
    'cross-channel-takeovers',
    'best-practices'
];
const eliteSeriesQuizIds = [
    'vendor-portal-breaches',
    'identity-chain-spoofs',
    'cloud-consent-traps',
    'incident-response-bait',
    'multi-actor-escalations',
    'trust-layer-collisions'
];
const expertSeriesQuizIds = [
    'zero-trust-breakpoints',
    'live-session-hijacks',
    'delegated-access-fraud',
    'forensic-cover-stories',
    'approval-chain-poisoning',
    'adaptive-impersonation-loops'
];
const proSeriesQuizIds = [
    'supply-chain-shadowing',
    'federated-login-pivots',
    'trust-graph-manipulation',
    'incident-command-spoofs',
    'recovery-delegation-loops',
    'environment-poisoning-cases'
];
const legendSeriesQuizIds = [
    'cross-tenant-bleedthrough',
    'response-playbook-subversion',
    'consent-laundering-rings',
    'governance-theater-attacks',
    'identity-weathering-loops',
    'signal-fog-exploitation'
];
const apexSeriesQuizIds = [
    'trust-collapse-scenarios',
    'operator-blend-intrusions',
    'decision-fatigue-breaches',
    'control-plane-misdirection',
    'cognitive-overlap-attacks',
    'irrecoverable-trust-failures'
];
const masteryPrepQuizIds = masterySeriesQuizIds.filter((quizId) => quizId !== 'best-practices');
const advancedQuizRules = {
    'sender-source-checks': {
        requiresQuizIds: [...coreQuizIds],
        label: 'Unlocks after you finish all 6 Core Series quiz sets.'
    },
    'attachment-download-safety': {
        requiresQuizIds: [...coreQuizIds],
        label: 'Unlocks after you finish all 6 Core Series quiz sets.'
    },
    'account-recovery-traps': {
        requiresQuizIds: [...coreQuizIds],
        label: 'Unlocks after you finish all 6 Core Series quiz sets.'
    },
    'form-data-requests': {
        requiresQuizIds: [...coreQuizIds],
        label: 'Unlocks after you finish all 6 Core Series quiz sets.'
    },
    'payment-delivery-scams': {
        requiresQuizIds: [...coreQuizIds],
        label: 'Unlocks after you finish all 6 Core Series quiz sets.'
    },
    'support-impersonation': {
        requiresQuizIds: [...coreQuizIds],
        label: 'Unlocks after you finish all 6 Core Series quiz sets.'
    },
    'scholarship-bait': {
        requiresQuizIds: [...skillBuilderQuizIds],
        label: 'Unlocks after you finish the Skill Builder Series.'
    },
    'document-sharing-traps': {
        requiresQuizIds: [...skillBuilderQuizIds],
        label: 'Unlocks after you finish the Skill Builder Series.'
    },
    'mobile-alert-deception': {
        requiresQuizIds: [...skillBuilderQuizIds],
        label: 'Unlocks after you finish the Skill Builder Series.'
    },
    'event-registration-risks': {
        requiresQuizIds: [...skillBuilderQuizIds],
        label: 'Unlocks after you finish the Skill Builder Series.'
    },
    'marketplace-meetup-scams': {
        requiresQuizIds: [...skillBuilderQuizIds],
        label: 'Unlocks after you finish the Skill Builder Series.'
    },
    'multi-step-phish-cases': {
        requiresQuizIds: [...skillBuilderQuizIds],
        label: 'Unlocks after you finish the Skill Builder Series.'
    },
    'campus-portal-spoofs': {
        requiresQuizIds: [...challengerQuizIds],
        label: 'Unlocks after you finish the Challenger Series.'
    },
    'urgent-admin-fraud': {
        requiresQuizIds: [...challengerQuizIds],
        label: 'Unlocks after you finish the Challenger Series.'
    },
    'cloud-drive-compromise': {
        requiresQuizIds: [...challengerQuizIds],
        label: 'Unlocks after you finish the Challenger Series.'
    },
    'internship-hiring-scams': {
        requiresQuizIds: [...challengerQuizIds],
        label: 'Unlocks after you finish the Challenger Series.'
    },
    'verification-chain-attacks': {
        requiresQuizIds: [...challengerQuizIds],
        label: 'Unlocks after you finish the Challenger Series.'
    },
    'phishing-scenarios': {
        requiresQuizIds: [...coreQuizIds, ...skillBuilderQuizIds, ...challengerQuizIds],
        label: 'Unlocks after you complete the Core, Skill Builder, and Challenger series.'
    },
    'best-practices': {
        requiresQuizIds: [...masteryPrepQuizIds],
        minimumAttempts: 4,
        minimumAverageScore: 70,
        label: 'Unlocks after the earlier Mastery sets plus 4 saved attempts and a 70% average.'
    },
    'executive-impersonation': {
        requiresQuizIds: [...advancedSeriesQuizIds],
        label: 'Unlocks after you finish the Advanced Series.'
    },
    'breach-followup-scams': {
        requiresQuizIds: [...advancedSeriesQuizIds],
        label: 'Unlocks after you finish the Advanced Series.'
    },
    'recovery-flow-attacks': {
        requiresQuizIds: [...advancedSeriesQuizIds],
        label: 'Unlocks after you finish the Advanced Series.'
    },
    'financial-approval-fraud': {
        requiresQuizIds: [...advancedSeriesQuizIds],
        label: 'Unlocks after you finish the Advanced Series.'
    },
    'cross-channel-takeovers': {
        requiresQuizIds: [...advancedSeriesQuizIds],
        label: 'Unlocks after you finish the Advanced Series.'
    },
    'vendor-portal-breaches': {
        requiresQuizIds: [...masterySeriesQuizIds],
        label: 'Finish Mastery Series first.'
    },
    'identity-chain-spoofs': {
        requiresQuizIds: [...masterySeriesQuizIds],
        label: 'Finish Mastery Series first.'
    },
    'cloud-consent-traps': {
        requiresQuizIds: [...masterySeriesQuizIds],
        label: 'Finish Mastery Series first.'
    },
    'incident-response-bait': {
        requiresQuizIds: [...masterySeriesQuizIds],
        label: 'Finish Mastery Series first.'
    },
    'multi-actor-escalations': {
        requiresQuizIds: [...masterySeriesQuizIds],
        label: 'Finish Mastery Series first.'
    },
    'trust-layer-collisions': {
        requiresQuizIds: [...masterySeriesQuizIds],
        label: 'Finish Mastery Series first.'
    },
    'zero-trust-breakpoints': {
        requiresQuizIds: [...eliteSeriesQuizIds],
        label: 'Finish Elite Series first.'
    },
    'live-session-hijacks': {
        requiresQuizIds: [...eliteSeriesQuizIds],
        label: 'Finish Elite Series first.'
    },
    'delegated-access-fraud': {
        requiresQuizIds: [...eliteSeriesQuizIds],
        label: 'Finish Elite Series first.'
    },
    'forensic-cover-stories': {
        requiresQuizIds: [...eliteSeriesQuizIds],
        label: 'Finish Elite Series first.'
    },
    'approval-chain-poisoning': {
        requiresQuizIds: [...eliteSeriesQuizIds],
        label: 'Finish Elite Series first.'
    },
    'adaptive-impersonation-loops': {
        requiresQuizIds: [...eliteSeriesQuizIds],
        label: 'Finish Elite Series first.'
    },
    'supply-chain-shadowing': {
        requiresQuizIds: [...expertSeriesQuizIds],
        label: 'Finish Expert Series first.'
    },
    'federated-login-pivots': {
        requiresQuizIds: [...expertSeriesQuizIds],
        label: 'Finish Expert Series first.'
    },
    'trust-graph-manipulation': {
        requiresQuizIds: [...expertSeriesQuizIds],
        label: 'Finish Expert Series first.'
    },
    'incident-command-spoofs': {
        requiresQuizIds: [...expertSeriesQuizIds],
        label: 'Finish Expert Series first.'
    },
    'recovery-delegation-loops': {
        requiresQuizIds: [...expertSeriesQuizIds],
        label: 'Finish Expert Series first.'
    },
    'environment-poisoning-cases': {
        requiresQuizIds: [...expertSeriesQuizIds],
        label: 'Finish Expert Series first.'
    },
    'cross-tenant-bleedthrough': {
        requiresQuizIds: [...proSeriesQuizIds],
        label: 'Finish Pro Series first.'
    },
    'response-playbook-subversion': {
        requiresQuizIds: [...proSeriesQuizIds],
        label: 'Finish Pro Series first.'
    },
    'consent-laundering-rings': {
        requiresQuizIds: [...proSeriesQuizIds],
        label: 'Finish Pro Series first.'
    },
    'governance-theater-attacks': {
        requiresQuizIds: [...proSeriesQuizIds],
        label: 'Finish Pro Series first.'
    },
    'identity-weathering-loops': {
        requiresQuizIds: [...proSeriesQuizIds],
        label: 'Finish Pro Series first.'
    },
    'signal-fog-exploitation': {
        requiresQuizIds: [...proSeriesQuizIds],
        label: 'Finish Pro Series first.'
    },
    'trust-collapse-scenarios': {
        requiresQuizIds: [...legendSeriesQuizIds],
        label: 'Finish Legend Series first.'
    },
    'operator-blend-intrusions': {
        requiresQuizIds: [...legendSeriesQuizIds],
        label: 'Finish Legend Series first.'
    },
    'decision-fatigue-breaches': {
        requiresQuizIds: [...legendSeriesQuizIds],
        label: 'Finish Legend Series first.'
    },
    'control-plane-misdirection': {
        requiresQuizIds: [...legendSeriesQuizIds],
        label: 'Finish Legend Series first.'
    },
    'cognitive-overlap-attacks': {
        requiresQuizIds: [...legendSeriesQuizIds],
        label: 'Finish Legend Series first.'
    },
    'irrecoverable-trust-failures': {
        requiresQuizIds: [...legendSeriesQuizIds],
        label: 'Finish Legend Series first.'
    }
};

const quizzes = {
    'url-basics': {
        title: 'URL Basics',
        description: 'Practice checking links and recognizing URL patterns that are often used in phishing attempts.',
        questions: [
            {
                topic: 'Link inspection',
                prompt: 'You receive a message asking you to verify your school account through `lcc-campus-login-support.com`. What is the best first reaction?',
                options: [
                    'Open it immediately because it mentions the school name.',
                    'Check the full domain first before trusting the link.',
                    'Reply with your password instead of clicking.',
                    'Ignore the spelling because support pages use many subdomains.'
                ],
                answer: 1,
                explanation: 'A suspicious domain name is a common phishing sign. Always inspect the exact website name before trusting the page.'
            },
            {
                topic: 'Shortened URLs',
                prompt: 'A classmate sends a shortened URL and says it leads to a scholarship form. What is the safest move?',
                options: [
                    'Open it right away if the message sounds urgent.',
                    'Ask where it leads or preview the destination first.',
                    'Share it with more classmates before checking.',
                    'Trust it because shortened links are normal.'
                ],
                answer: 1,
                explanation: 'Shortened links hide the real destination. It is safer to preview or verify them before opening.'
            },
            {
                topic: 'Secure domains',
                prompt: 'A page uses HTTPS but the website name looks slightly misspelled. What should you do?',
                options: [
                    'Trust it because HTTPS always means safe.',
                    'Continue only if the logo looks official.',
                    'Treat it with caution because HTTPS alone is not enough.',
                    'Enter your account details to test if it is real.'
                ],
                answer: 2,
                explanation: 'HTTPS only means the connection is encrypted. A fake website can still use HTTPS and steal information.'
            },
            {
                topic: 'URL structure',
                prompt: 'Which link is more suspicious for a login page?',
                options: [
                    'https://accounts.lcc.edu/login',
                    'https://lcc.edu.verify-user-access.net/login',
                    'https://portal.lcc.edu/student',
                    'https://lcc.edu/helpdesk'
                ],
                answer: 1,
                explanation: 'The real domain is at the end. In that suspicious link, `verify-user-access.net` is the actual website, not `lcc.edu`.'
            },
            {
                topic: 'Lookalike domains',
                prompt: 'You are about to open `https://lcc-portal.co/login` after searching for your school portal. What should you do first?',
                options: [
                    'Open it because the address still includes `lcc` and `portal`.',
                    'Compare it with the real school domain before using it.',
                    'Trust it if the page loads with a lock icon.',
                    'Sign in once and leave if the design looks unusual.'
                ],
                answer: 1,
                explanation: 'Lookalike domains often use believable words. It is safer to compare the full address with the official domain first.'
            }
        ]
    },
    'message-red-flags': {
        title: 'Message Red Flags',
        description: 'Learn how to notice warning signs in emails, texts, and chat messages before they put your account or information at risk.',
        questions: [
            {
                topic: 'Urgency',
                prompt: 'You receive a message saying your student portal will be locked in 10 minutes unless you confirm your account through a link. Which detail is the strongest warning sign?',
                options: [
                    'The message sounds formal and mentions your account.',
                    'The urgent deadline is pushing you to act fast.',
                    'The sender included a support contact below.',
                    'The message uses short sentences throughout.'
                ],
                answer: 1,
                explanation: 'Phishing messages often create panic so people react without checking the details first.'
            },
            {
                topic: 'Sender check',
                prompt: 'An email claims to be from the registrar and includes your full name, but the sender address ends in a free email domain. What is the safest response?',
                options: [
                    'Trust it because it includes personal details about you.',
                    'Reply to the same email and ask if it is legitimate.',
                    'Verify it through an official school contact or portal.',
                    'Open the attachment first, then decide if it feels real.'
                ],
                answer: 2,
                explanation: 'If the sender address does not match the official source, verify through a trusted contact before responding.'
            },
            {
                topic: 'Requests for secrets',
                prompt: 'Which message should raise the strongest phishing concern?',
                options: [
                    'A department post reminding students about office hours.',
                    'A campus office asking for your password by email.',
                    'A class representative posting a room change tomorrow.',
                    'A teacher sharing a deadline update in the class chat.'
                ],
                answer: 1,
                explanation: 'Legitimate organizations should not ask for passwords through email or chat.'
            },
            {
                topic: 'Attachments',
                prompt: 'You get an unexpected attachment labeled "account-update-form" from someone claiming to be campus support. What is the safest next step?',
                options: [
                    'Open it in preview mode first to inspect it safely.',
                    'Verify the request through an official school channel.',
                    'Download it, but wait before opening the file.',
                    'Reply and ask why the file is needed first.'
                ],
                answer: 1,
                explanation: 'Unexpected files can carry malware or phishing forms. Verify first before opening anything.'
            },
            {
                topic: 'Link pressure',
                prompt: 'A message says, "Use this link only today or your account request will be cancelled." Which response is safest?',
                options: [
                    'Open the link quickly so the request does not expire.',
                    'Ask someone else to open it for you first.',
                    'Verify the request from the official website or office.',
                    'Reply to the sender and wait for a second link.'
                ],
                answer: 2,
                explanation: 'Urgent link pressure is a common phishing tactic. A safer move is to verify through an official source you already trust.'
            }
        ]
    },
    'after-clicking': {
        title: 'After Clicking: What to Do?',
        description: 'Review the right steps to take after clicking a suspicious link or sharing personal details on an unsafe page.',
        questions: [
            {
                topic: 'Immediate action',
                prompt: 'You clicked a suspicious link but did not enter any information. What should you do first?',
                options: [
                    'Ignore it because nothing was submitted.',
                    'Close the page and monitor for unusual activity.',
                    'Share the link with others to confirm.',
                    'Log out of all your accounts immediately without checking anything else.'
                ],
                answer: 1,
                explanation: 'Closing the page and watching for anything unusual is a practical first response when no information was entered.'
            },
            {
                topic: 'Password response',
                prompt: 'You accidentally entered your password on a suspicious page. What is the best next step?',
                options: [
                    'Wait to see if anything happens.',
                    'Change your password right away on the real site.',
                    'Send another email to the attacker asking them to delete it.',
                    'Reuse the same password on another account to test it.'
                ],
                answer: 1,
                explanation: 'If a password may be exposed, change it immediately on the official website.'
            },
            {
                topic: 'Reporting',
                prompt: 'After receiving a phishing message that targets students, what is the most helpful thing to do?',
                options: [
                    'Delete it quietly and tell nobody.',
                    'Report it through the proper school or platform channel.',
                    'Reply angrily to the sender.',
                    'Post the full malicious link publicly without warning.'
                ],
                answer: 1,
                explanation: 'Reporting helps protect others and allows the incident to be reviewed through proper channels.'
            },
            {
                topic: 'Device safety',
                prompt: 'You downloaded a suspicious file from a fake page. What is the safest response?',
                options: [
                    'Keep using the device and hope nothing happens.',
                    'Run a security check and avoid opening the file again.',
                    'Rename the file so it becomes safe.',
                    'Move the file into another folder and ignore it.'
                ],
                answer: 1,
                explanation: 'A suspicious download should be treated carefully. Run a security check and avoid reopening the file.'
            },
            {
                topic: 'Account recovery',
                prompt: 'You are not sure whether you entered your student number on a fake page. What is the safest next step?',
                options: [
                    'Do nothing unless you notice a problem later.',
                    'Check your real account for unusual changes and secure it if needed.',
                    'Open the suspicious page again to confirm what you typed.',
                    'Post the link in a group chat and ask if others tried it.'
                ],
                answer: 1,
                explanation: 'When information may have been exposed, it is safer to check the real account directly and secure it if anything looks unusual.'
            }
        ]
    },
    'login-page-clues': {
        title: 'Login Page Clues',
        description: 'Practice checking login pages for warning signs before entering your school or personal account details.',
        questions: [
            {
                topic: 'Page checks',
                prompt: 'A login page looks polished and uses your school colors, but the address ends in `.secure-help.net`. What matters most?',
                options: [
                    'The familiar school colors on the page.',
                    'Whether the address matches the official domain.',
                    'Whether the button style looks updated.',
                    'Whether the page loads without errors.'
                ],
                answer: 1,
                explanation: 'Attackers can copy a school design. The full website address is a stronger trust check than the page style.'
            },
            {
                topic: 'Form requests',
                prompt: 'A page asks for your school email, password, and backup phone number before you can continue. What should you notice first?',
                options: [
                    'The page is asking for more information than expected.',
                    'The form uses neat spacing and aligned labels.',
                    'The password box hides the characters properly.',
                    'The page asks for details in one step only.'
                ],
                answer: 0,
                explanation: 'A login page that asks for extra personal details can be a sign that the form is collecting more than it should.'
            },
            {
                topic: 'Urgency on page',
                prompt: 'A login page says your account will be closed today unless you sign in again right now. What is the strongest warning sign?',
                options: [
                    'The page uses large bold text near the top.',
                    'The warning creates pressure to act immediately.',
                    'The form appears in the center of the page.',
                    'The message mentions your account status.'
                ],
                answer: 1,
                explanation: 'Pressure and urgency are common phishing tactics used to stop users from checking the page carefully.'
            },
            {
                topic: 'Support details',
                prompt: 'A login page tells you to contact `support@verify-portal-mail.net` if you have problems signing in. What should you do?',
                options: [
                    'Use the support address if the page looks official enough.',
                    'Check if the support contact belongs to the real organization.',
                    'Trust it if the email uses the word `support`.',
                    'Ignore the contact details and focus only on the logo.'
                ],
                answer: 1,
                explanation: 'Fake pages often include support contacts that look believable but do not belong to the official organization.'
            },
            {
                topic: 'Safer move',
                prompt: 'You are unsure if a login page is real. What is the safest next step?',
                options: [
                    'Try signing in once to see where the page redirects.',
                    'Open the real website or app you already trust instead.',
                    'Send the page to a friend and ask them to test it.',
                    'Refresh the page and see if the warning disappears.'
                ],
                answer: 1,
                explanation: 'When a login page feels off, it is safer to use the official website or app you already know instead of trusting the page.'
            }
        ]
    },
    'qr-link-safety': {
        title: 'QR & Link Safety',
        description: 'Learn how hidden destinations in QR codes and links can lead to risky pages even when they look harmless at first.',
        questions: [
            {
                topic: 'QR destination',
                prompt: 'You scan a QR code on a school bulletin board and it opens a shortened login link. What should you do first?',
                options: [
                    'Open it because the QR code came from campus.',
                    'Check where the link leads before trusting it.',
                    'Sign in quickly before the page expires.',
                    'Share it with classmates to confirm it works.'
                ],
                answer: 1,
                explanation: 'QR codes and shortened links can hide the real destination, so it is safer to check the target first.'
            },
            {
                topic: 'Shortened links',
                prompt: 'A message says a shortened link leads to an updated school form. Which reaction is safest?',
                options: [
                    'Trust it if the message came from a familiar group.',
                    'Preview or verify the destination before opening it.',
                    'Open it on mobile because the risk is lower there.',
                    'Save it for later and open it after class.'
                ],
                answer: 1,
                explanation: 'A shortened link hides the real site, so it is safer to preview or verify it before opening.'
            },
            {
                topic: 'Login after scan',
                prompt: 'A QR code leads to a sign-in page that asks for your school account. What matters most before you enter anything?',
                options: [
                    'Whether the page loads quickly after the scan.',
                    'Whether the page uses the official school domain.',
                    'Whether the QR code looked professionally printed.',
                    'Whether the form only asks for two fields.'
                ],
                answer: 1,
                explanation: 'The printed code or page speed does not prove trust. The official domain is the stronger check.'
            },
            {
                topic: 'Urgent QR notice',
                prompt: 'A QR code poster says "Scan now to keep your student access active today." What should you notice?',
                options: [
                    'The message is creating urgency to push quick action.',
                    'The poster uses a clean and modern layout.',
                    'The instruction is short and easy to follow.',
                    'The message mentions your student access.'
                ],
                answer: 0,
                explanation: 'Urgent wording is often used to pressure people into reacting before they verify where the QR code leads.'
            },
            {
                topic: 'Safer route',
                prompt: 'You are unsure whether a QR code or link is legitimate. What is the safest option?',
                options: [
                    'Go to the official site directly instead of using it.',
                    'Try it once and leave if anything looks unusual.',
                    'Ask another student to open it first.',
                    'Take a screenshot and scan it again later.'
                ],
                answer: 0,
                explanation: 'Using the official site or app directly is safer than relying on an unknown QR code or link.'
            }
        ]
    },
    'social-media-scams': {
        title: 'Social Media Scams',
        description: 'Practice spotting phishing and impersonation tactics that often appear in social media posts, chats, and direct messages.',
        questions: [
            {
                topic: 'Impersonation',
                prompt: 'A classmate account sends you a login link and says the school page is broken unless you use this one. What should you do?',
                options: [
                    'Use it if the account name looks familiar.',
                    'Verify with the classmate through another trusted contact.',
                    'Open it in a private tab to be safer.',
                    'Trust it because the message sounds personal.'
                ],
                answer: 1,
                explanation: 'A familiar account can still be impersonated or compromised. It is safer to verify through another channel you trust.'
            },
            {
                topic: 'Prize bait',
                prompt: 'A social media post says the first 50 students to sign in through a link will receive free load. Which sign is most suspicious?',
                options: [
                    'The post mentions a reward for quick action.',
                    'The post includes a bright image and headline.',
                    'The post uses short text with a direct link.',
                    'The post has many comments under it.'
                ],
                answer: 0,
                explanation: 'Prize bait and urgency are often used together to push users into opening risky links without checking them.'
            },
            {
                topic: 'Direct messages',
                prompt: 'A direct message says, "Is this you in the photo?" and includes a shortened link. What is the safest response?',
                options: [
                    'Open it because the message is short and common.',
                    'Check with the sender first before touching the link.',
                    'Open it only if the sender is on your friends list.',
                    'Save it and come back to it after a few hours.'
                ],
                answer: 1,
                explanation: 'Compromised accounts often send simple bait messages with hidden links. It is safer to verify with the sender first.'
            },
            {
                topic: 'Fake announcements',
                prompt: 'A page uses your school logo and posts an urgent login announcement in a student group. What should you verify first?',
                options: [
                    'Whether the wording matches the school tone.',
                    'Whether the linked domain is the real official one.',
                    'Whether the page has a large number of followers.',
                    'Whether the announcement looks professionally designed.'
                ],
                answer: 1,
                explanation: 'Fake pages can copy branding and attract followers. The linked domain is still the stronger trust check.'
            },
            {
                topic: 'Safer action',
                prompt: 'A suspicious social media message asks you to log in to confirm your account. What is the safest move?',
                options: [
                    'Go to the official website or app on your own.',
                    'Reply first and wait for another explanation.',
                    'Try the link only if it uses HTTPS.',
                    'Open the link on another device to compare it.'
                ],
                answer: 0,
                explanation: 'Going directly to the official platform yourself is safer than trusting a login link from a social media message.'
            }
        ]
    },
    'sender-source-checks': {
        title: 'Sender & Source Checks',
        description: 'Build stronger habits for checking who sent a message and whether the source really matches the organization it claims to be.',
        questions: [
            {
                topic: 'Display name mismatch',
                prompt: 'An email shows the name "LCC Finance Office," but the sender address is `alerts-finance@outlookmail.com`. What should matter most?',
                options: [
                    'The displayed sender name at the top.',
                    'The actual email address behind the message.',
                    'The formal tone used in the message.',
                    'The school-related subject line.'
                ],
                answer: 1,
                explanation: 'A display name can be copied easily. The actual sender address is a much stronger trust check.'
            },
            {
                topic: 'Message source',
                prompt: 'A text about a grade issue comes from an unknown number and includes a portal link. What is the safest first step?',
                options: [
                    'Open the link because the topic sounds important.',
                    'Check the portal directly using your usual route.',
                    'Reply and ask for more details in the same thread.',
                    'Save the number first before deciding.'
                ],
                answer: 1,
                explanation: 'When the source is unfamiliar, it is safer to use the official portal or contact route you already trust.'
            },
            {
                topic: 'Compromised contact',
                prompt: 'A familiar classmate account asks you to review a file through a login link. Which detail should raise concern first?',
                options: [
                    'The request feels unusual for that account.',
                    'The file name sounds short and generic.',
                    'The message was sent after class hours.',
                    'The sender used your nickname.'
                ],
                answer: 0,
                explanation: 'A familiar account can still be compromised. An unusual request is a strong reason to verify before trusting it.'
            },
            {
                topic: 'Copied branding',
                prompt: 'A message includes the school logo and footer, but the reply-to address points to another domain. What should you do?',
                options: [
                    'Trust the branding because the footer looks official.',
                    'Check whether the reply-to matches the real organization.',
                    'Focus only on whether the grammar looks polished.',
                    'Forward it to friends first to compare opinions.'
                ],
                answer: 1,
                explanation: 'Copied branding does not prove legitimacy. A mismatched reply-to address is a stronger warning sign.'
            },
            {
                topic: 'Cross-checking',
                prompt: 'You receive a password reset notice you did not request. What is the best response?',
                options: [
                    'Open the message and inspect the reset flow there.',
                    'Go to the official account page directly and check there.',
                    'Reply and ask why the reset was triggered.',
                    'Ignore it and keep using the same password.'
                ],
                answer: 1,
                explanation: 'If a reset notice was unexpected, it is safer to check your account from the official site directly instead of trusting the message.'
            }
        ]
    },
    'attachment-download-safety': {
        title: 'Attachment & Download Safety',
        description: 'Practice safer decisions when messages include unexpected files, downloads, or documents that ask you to open them quickly.',
        questions: [
            {
                topic: 'Unexpected file',
                prompt: 'An email claims to contain an updated tuition statement as a zip file you did not expect. What is the safest first reaction?',
                options: [
                    'Extract it first and inspect the contents after.',
                    'Verify the request through an official school contact.',
                    'Open it on a phone because that is safer.',
                    'Rename the file before opening it.'
                ],
                answer: 1,
                explanation: 'Unexpected downloads should be verified first, especially when the file type can hide malware.'
            },
            {
                topic: 'Shared document',
                prompt: 'A direct message says "View your schedule update" and includes a file download instead of a normal document link. What should you notice?',
                options: [
                    'The file arrived through an unusual channel.',
                    'The message uses a short sentence only.',
                    'The file name includes the word `schedule`.',
                    'The sender used a polite tone.'
                ],
                answer: 0,
                explanation: 'A download arriving through an unusual channel should be treated carefully, especially if you were not expecting it.'
            },
            {
                topic: 'Executable files',
                prompt: 'A message says you must install a file to keep your student account active. Which response is safest?',
                options: [
                    'Install it if the message includes your full name.',
                    'Avoid the file and verify the claim from the official portal.',
                    'Open it only after disabling Wi-Fi first.',
                    'Download it and wait until later to run it.'
                ],
                answer: 1,
                explanation: 'Legitimate account updates should not require random file installs from messages. Verify the claim through the official portal.'
            },
            {
                topic: 'Macros and forms',
                prompt: 'A document asks you to enable editing or content before you can read it. What should you do?',
                options: [
                    'Enable the feature so the document loads properly.',
                    'Treat the file as suspicious and avoid enabling it.',
                    'Move the file to another folder and open it again.',
                    'Print it first to see if it becomes safer.'
                ],
                answer: 1,
                explanation: 'Prompting users to enable extra document features is a common tactic used to trigger malicious content.'
            },
            {
                topic: 'Safer file handling',
                prompt: 'You are unsure whether a downloaded file is legitimate. What is the safest move?',
                options: [
                    'Send it to a friend and ask them to open it first.',
                    'Avoid opening it until the request is confirmed.',
                    'Open it offline so it cannot do harm.',
                    'Upload it back to the sender for checking.'
                ],
                answer: 1,
                explanation: 'If the file is suspicious, the safest move is to avoid opening it until the request itself has been verified.'
            }
        ]
    },
    'account-recovery-traps': {
        title: 'Account Recovery Traps',
        description: 'Learn how phishing messages abuse password resets, verification steps, and account recovery claims to steal account access.',
        questions: [
            {
                topic: 'Recovery pressure',
                prompt: 'A message says your recovery request must be approved through a link in the next 15 minutes. What is the biggest concern?',
                options: [
                    'The short deadline is pressuring you to act fast.',
                    'The message mentions account recovery directly.',
                    'The wording is brief and to the point.',
                    'The notice includes a case number.'
                ],
                answer: 0,
                explanation: 'Urgent recovery notices are often used to create panic before you have time to verify the request properly.'
            },
            {
                topic: 'Unexpected reset',
                prompt: 'You receive a recovery code by text even though you did not try to reset anything. What should you do?',
                options: [
                    'Share the code if the sender claims to be support.',
                    'Keep the code private and secure the real account if needed.',
                    'Enter the code into any page that mentions your account.',
                    'Reply with the code to stop the alerts.'
                ],
                answer: 1,
                explanation: 'Unexpected recovery codes should never be shared. They may mean someone is trying to access your account.'
            },
            {
                topic: 'Verification prompts',
                prompt: 'A page asks for your password and then your one-time code to "confirm recovery." What should you notice?',
                options: [
                    'The page is collecting multiple sensitive credentials.',
                    'The page uses a familiar account color theme.',
                    'The code field appears after the password field.',
                    'The page provides a help link below the form.'
                ],
                answer: 0,
                explanation: 'A fake recovery page often asks for both your password and verification code so attackers can take over the account immediately.'
            },
            {
                topic: 'Support impersonation',
                prompt: 'Someone claims they are helping with your recovery case and asks you to read back a verification code. What is the safest response?',
                options: [
                    'Read it back if they already know your email address.',
                    'Do not share the code and verify support independently.',
                    'Give only part of the code to stay safe.',
                    'Wait until they explain the full process in chat.'
                ],
                answer: 1,
                explanation: 'Verification codes should not be shared with people messaging you directly. Real support can be checked through official channels.'
            },
            {
                topic: 'Safer recovery route',
                prompt: 'Which recovery step is safest when you truly need to reset an account?',
                options: [
                    'Use the reset flow from the official site or app directly.',
                    'Follow the latest reset link sent to your messages.',
                    'Ask social media pages to handle it for you.',
                    'Use the first recovery page from search results.'
                ],
                answer: 0,
                explanation: 'The safest recovery route is the official website or app you already trust, not a link that arrived through a message.'
            }
        ]
    },
    'form-data-requests': {
        title: 'Form & Data Requests',
        description: 'Practice noticing when a page or message is asking for more information than a legitimate process usually needs.',
        questions: [
            {
                topic: 'Too much information',
                prompt: 'A scholarship form asks for your password, student ID, and recovery email on one page. What is the strongest warning sign?',
                options: [
                    'The form is asking for credentials it should not need.',
                    'The form uses several fields on one screen.',
                    'The form collects contact details together.',
                    'The form places the submit button at the bottom.'
                ],
                answer: 0,
                explanation: 'A legitimate form should not ask for account passwords as part of a normal information request.'
            },
            {
                topic: 'External forms',
                prompt: 'A message says you must complete a form immediately, but the page opens on a domain unrelated to the school. What should you do?',
                options: [
                    'Continue if the form mentions your department name.',
                    'Verify why the form is hosted on another domain first.',
                    'Trust it if the page still uses HTTPS.',
                    'Fill only the non-sensitive fields and submit.'
                ],
                answer: 1,
                explanation: 'An unrelated form domain is a reason to verify the request before sharing any information.'
            },
            {
                topic: 'Sensitive verification',
                prompt: 'A page asks for your mobile number, date of birth, and one-time code to keep your access active. What should you notice?',
                options: [
                    'The page is combining identity details with a security code.',
                    'The page clearly labels each field for the user.',
                    'The page uses a secure lock icon in the browser.',
                    'The code field appears last in the form.'
                ],
                answer: 0,
                explanation: 'Combining identity details with a one-time code is often a sign that the form is collecting enough data to misuse your account.'
            },
            {
                topic: 'Submission pressure',
                prompt: 'A form warns that your request will be cancelled if you leave any field blank. What should you do first?',
                options: [
                    'Complete every field so the request is not lost.',
                    'Check whether the form and request are really official.',
                    'Refresh the page and try again from the start.',
                    'Enter placeholder data in the extra fields.'
                ],
                answer: 1,
                explanation: 'Pressure to complete every field can be used to push people into sharing unnecessary or sensitive information.'
            },
            {
                topic: 'Safer habit',
                prompt: 'A form request seems important but slightly unusual. Which habit is safest?',
                options: [
                    'Pause and confirm the request before submitting anything.',
                    'Submit the form once and edit it later if needed.',
                    'Complete only the first half of the form for now.',
                    'Use the same answers you gave on another site.'
                ],
                answer: 0,
                explanation: 'Pausing to verify the request first is a safer habit than submitting information and hoping the form is legitimate.'
            }
        ]
    },
    'payment-delivery-scams': {
        title: 'Payment & Delivery Scams',
        description: 'Strengthen your judgment around phishing attempts that involve fees, deliveries, billing problems, and fake payment requests.',
        questions: [
            {
                topic: 'Small fee trick',
                prompt: 'A message says your parcel is waiting but you must pay a small fee through a link. What is the safest reaction?',
                options: [
                    'Pay it because the amount is small anyway.',
                    'Check the courier or seller through the official app first.',
                    'Open the page if the message includes a tracking number.',
                    'Use another card so the main account stays safe.'
                ],
                answer: 1,
                explanation: 'Small-fee delivery scams rely on urgency and low amounts. It is safer to verify the claim through the real courier or seller.'
            },
            {
                topic: 'Billing notice',
                prompt: 'An email says your subscription failed and asks you to update payment details through a message link. What should you do first?',
                options: [
                    'Open the link and check whether the amount looks right.',
                    'Go to the official service directly instead of the link.',
                    'Reply and ask whether cash payment is possible.',
                    'Trust it if the logo and colors seem correct.'
                ],
                answer: 1,
                explanation: 'Billing notices can be copied easily. Going to the official service directly is safer than trusting the message link.'
            },
            {
                topic: 'Fake order issue',
                prompt: 'A message says there is a problem with your order and asks you to confirm your card number to avoid cancellation. What should you notice?',
                options: [
                    'The message is asking for payment data unsafely.',
                    'The message includes an order issue explanation.',
                    'The request is written in short sentences.',
                    'The message was sent outside business hours.'
                ],
                answer: 0,
                explanation: 'Requests for card details through messages or suspicious pages are a major warning sign.'
            },
            {
                topic: 'Refund bait',
                prompt: 'A page promises a fast refund if you verify your login and bank details right away. What is the safest move?',
                options: [
                    'Avoid the page and contact the service from the official site.',
                    'Continue if the refund amount matches your purchase.',
                    'Use the page only if it loads with HTTPS.',
                    'Enter partial details first to test the process.'
                ],
                answer: 0,
                explanation: 'Refund bait is often used to collect both account and payment details. Use the official service instead of the page.'
            },
            {
                topic: 'Safer payment habit',
                prompt: 'Which habit lowers the risk of payment-related phishing the most?',
                options: [
                    'Checking issues from the official app or site.',
                    'Using message links when they look professional.',
                    'Responding quickly so orders are not delayed.',
                    'Saving all payment links in one note.'
                ],
                answer: 0,
                explanation: 'Using the official app or site directly is a much safer habit than following payment or delivery links from messages.'
            }
        ]
    },
    'support-impersonation': {
        title: 'Support Impersonation',
        description: 'Spot the tricks used by fake support staff, helpdesk pages, and urgent technical notices that try to steal trust and account access.',
        questions: [
            {
                topic: 'Helpdesk urgency',
                prompt: 'A helpdesk message says your account shows suspicious activity and you must verify it through a link today. What should you notice first?',
                options: [
                    'The message is using urgency to push fast action.',
                    'The message mentions suspicious activity directly.',
                    'The message includes a ticket number.',
                    'The message gives a support signature.'
                ],
                answer: 0,
                explanation: 'Urgent technical warnings are often used to stop users from verifying whether the support request is real.'
            },
            {
                topic: 'Fake agent chat',
                prompt: 'A chat popup says an agent can secure your account if you confirm your email and password right away. What is the safest response?',
                options: [
                    'Do not provide credentials and leave the chat.',
                    'Share the email first, then decide about the password.',
                    'Ask the agent to prove they work for support.',
                    'Continue only if the page uses a branded logo.'
                ],
                answer: 0,
                explanation: 'Real support should not ask for your password in a chat. Sharing credentials there is risky.'
            },
            {
                topic: 'Remote access bait',
                prompt: 'Someone claiming to be support asks you to install a remote tool so they can "clean up" your account issue. What should you do?',
                options: [
                    'Install it if they mention a specific problem.',
                    'Refuse the tool and verify support independently.',
                    'Install it only after changing your password.',
                    'Let them explain longer before deciding.'
                ],
                answer: 1,
                explanation: 'Unexpected remote support requests are risky. Verify support from a trusted official channel instead.'
            },
            {
                topic: 'Ticket portals',
                prompt: 'A support email links to a ticket page on a domain you have never seen before. What should you do first?',
                options: [
                    'Sign in once to check the ticket details.',
                    'Compare the domain with the official support site.',
                    'Reply and ask the sender if the page is safe.',
                    'Trust it if the email includes your correct name.'
                ],
                answer: 1,
                explanation: 'Fake support portals often use believable but unfamiliar domains. Compare the domain with the official support site first.'
            },
            {
                topic: 'Safer support check',
                prompt: 'Which support-related habit is safest when a message claims there is an urgent problem with your account?',
                options: [
                    'Use the official help center or contact route you know.',
                    'Open the message link first and inspect the page there.',
                    'Answer the support message before the case closes.',
                    'Rely on the support badge shown in the email or chat.'
                ],
                answer: 0,
                explanation: 'The safest habit is to contact support through the official route you already trust, not through the urgent message link.'
            }
        ]
    },
    'scholarship-bait': {
        title: 'Scholarship Bait',
        description: 'Work through higher-pressure scholarship and grant scams that mix urgency, prestige, and fake verification steps.',
        questions: [
            {
                topic: 'Prestige bait',
                prompt: 'A message says you were shortlisted for an exclusive grant and must sign in through a provided link before midnight. What matters most?',
                options: [
                    'The exclusive language used in the message.',
                    'Whether the link belongs to the real scholarship provider.',
                    'Whether the amount offered looks realistic.',
                    'Whether the email includes your full name.'
                ],
                answer: 1,
                explanation: 'Prestige and urgency can distract from the real issue. The actual domain still matters most.'
            },
            {
                topic: 'Verification trap',
                prompt: 'A scholarship form asks for your portal password to confirm your identity. What should you assume first?',
                options: [
                    'It is collecting a credential it should never need.',
                    'It is using a stronger verification method.',
                    'It is connected to your school account system.',
                    'It is trying to speed up the review process.'
                ],
                answer: 0,
                explanation: 'A legitimate scholarship form should not require your account password as part of normal verification.'
            },
            {
                topic: 'Forwarded opportunity',
                prompt: 'A class group forwards a scholarship link that many students are praising. What is still the safest step?',
                options: [
                    'Trust it because several students already shared it.',
                    'Verify the opportunity from the real source yourself.',
                    'Open it but avoid entering personal details first.',
                    'Use it only on a different device.'
                ],
                answer: 1,
                explanation: 'A widely shared link can still be fake. Independent verification is still safer than relying on group momentum.'
            },
            {
                topic: 'Fast deadline',
                prompt: 'A page warns that your scholarship slot will disappear if you leave the form unfinished. What should you notice?',
                options: [
                    'The form includes an account deadline at the top.',
                    'The page is pressuring you to submit without checking.',
                    'The page uses short instructions to guide you.',
                    'The message appears before the form fields.'
                ],
                answer: 1,
                explanation: 'Pressure and scarcity are common phishing tactics because they push people to skip verification.'
            },
            {
                topic: 'Safer route',
                prompt: 'Which response is safest when a scholarship message feels both exciting and slightly suspicious?',
                options: [
                    'Verify it from the official organization or campus office.',
                    'Open it once and decide based on the page design.',
                    'Submit only the non-sensitive details first.',
                    'Reply and ask the sender to reassure you.'
                ],
                answer: 0,
                explanation: 'When a high-reward message feels off, a trusted official source is the safest place to verify it.'
            }
        ]
    },
    'document-sharing-traps': {
        title: 'Document Sharing Traps',
        description: 'Spot the riskier sharing tricks that use shared files, document comments, and access requests to lure users into fake sign-ins.',
        questions: [
            {
                topic: 'Shared access request',
                prompt: 'A shared document notice says you need to sign in again to view comments from a teacher. What should you verify first?',
                options: [
                    'Whether the comment count seems believable.',
                    'Whether the sign-in page uses the real service domain.',
                    'Whether the notice came during class hours.',
                    'Whether the document title matches your course.'
                ],
                answer: 1,
                explanation: 'Shared document phishing often copies real notifications. The domain is the stronger check.'
            },
            {
                topic: 'Comment bait',
                prompt: 'A document notification says you were mentioned in feedback and includes a login prompt. What is the safest move?',
                options: [
                    'Open the login prompt if the file name looks familiar.',
                    'Go to the document service directly and check there.',
                    'Reply to the sender and ask if they tagged you.',
                    'Open it on mobile because it is a document, not a site.'
                ],
                answer: 1,
                explanation: 'Accessing the service directly is safer than trusting a login prompt from the notification.'
            },
            {
                topic: 'Fake collaboration',
                prompt: 'A class project file invites you to enable editing after a second sign-in. What should you notice?',
                options: [
                    'The file is part of a collaboration workflow.',
                    'The extra sign-in may be a fake credential prompt.',
                    'The project title uses your course code.',
                    'The page offers multiple access options.'
                ],
                answer: 1,
                explanation: 'A second sign-in prompt can be a fake layer added to steal credentials.'
            },
            {
                topic: 'Unusual host',
                prompt: 'A shared file link opens on a domain that resembles a document service but adds extra words. What is the safest response?',
                options: [
                    'Trust it if the layout looks identical to the real service.',
                    'Treat it as suspicious and compare the full domain.',
                    'Use it only if the file preview loads quickly.',
                    'Sign in once and leave if the content is missing.'
                ],
                answer: 1,
                explanation: 'Lookalike document domains are a common phishing method. Compare the full address before trusting it.'
            },
            {
                topic: 'Safer collaboration habit',
                prompt: 'Which habit best reduces shared-document phishing risk?',
                options: [
                    'Opening shared files from the official app or saved workspace.',
                    'Trusting links that arrive from classmates you know.',
                    'Using incognito mode before opening shared links.',
                    'Previewing the page and signing in only if needed.'
                ],
                answer: 0,
                explanation: 'Opening files from the official app or service you already trust reduces reliance on message links.'
            }
        ]
    },
    'mobile-alert-deception': {
        title: 'Mobile Alert Deception',
        description: 'Handle mobile-style phishing cases that use push alerts, SMS warnings, and account notices designed for fast phone reactions.',
        questions: [
            {
                topic: 'Push urgency',
                prompt: 'A phone alert says your account was locked and you must tap to restore access immediately. What is the safest response?',
                options: [
                    'Tap it quickly before the lock becomes permanent.',
                    'Open the real app or site yourself instead.',
                    'Tap it once and stop if the design looks unusual.',
                    'Wait for the same alert to appear again.'
                ],
                answer: 1,
                explanation: 'Urgent push alerts are designed for fast reactions. Opening the real app yourself is safer.'
            },
            {
                topic: 'SMS warning',
                prompt: 'A text says your SIM or banking access will be suspended today unless you verify through a shortened link. What should you notice?',
                options: [
                    'The warning uses suspension pressure and a hidden destination.',
                    'The message uses a realistic customer service tone.',
                    'The message mentions a same-day deadline clearly.',
                    'The link is short enough to fit on mobile.'
                ],
                answer: 0,
                explanation: 'Urgency plus a shortened link is a strong mobile phishing combination.'
            },
            {
                topic: 'App store bait',
                prompt: 'A mobile page says you need a security update and offers a direct download button. What is the safest move?',
                options: [
                    'Use the page if it matches your phone theme.',
                    'Get updates only from the official app store or source.',
                    'Download it now and install it after checking later.',
                    'Take a screenshot and come back when you have Wi-Fi.'
                ],
                answer: 1,
                explanation: 'Security updates should come from the official app store or trusted source, not a random page.'
            },
            {
                topic: 'Overlay login',
                prompt: 'A mobile page overlays a login prompt on top of a familiar service screen. What should you suspect?',
                options: [
                    'The overlay may be a fake prompt placed over copied content.',
                    'The service is using a faster mobile sign-in flow.',
                    'The page is loading an account check in two steps.',
                    'The service is simplifying the mobile interface.'
                ],
                answer: 0,
                explanation: 'Copied mobile screens with fake overlays are used to trick people into entering credentials quickly.'
            },
            {
                topic: 'Safer mobile habit',
                prompt: 'Which habit is best when a security alert appears on your phone?',
                options: [
                    'Verify the alert from the official app or settings directly.',
                    'Open the alert once to confirm whether it feels real.',
                    'Reply to the text and ask what triggered the alert.',
                    'Forward the alert to a friend before acting.'
                ],
                answer: 0,
                explanation: 'Verifying through the official app or settings is safer than trusting the alert itself.'
            }
        ]
    },
    'event-registration-risks': {
        title: 'Event Registration Risks',
        description: 'Practice spotting riskier event and registration scams that use limited slots, fake organizers, and payment or sign-in pressure.',
        questions: [
            {
                topic: 'Limited slots',
                prompt: 'An event page says only the first 20 students who sign in through a link can reserve a seat. What should stand out?',
                options: [
                    'The event is using scarcity to rush decisions.',
                    'The event clearly explains how seating works.',
                    'The page includes a matching event title.',
                    'The page offers a quick reservation process.'
                ],
                answer: 0,
                explanation: 'Scarcity is often used to pressure students into acting before verifying the event or the page.'
            },
            {
                topic: 'Fake organizer',
                prompt: 'A registration page uses campus branding but is hosted on a domain unrelated to the school. What should you do?',
                options: [
                    'Register if the branding looks current enough.',
                    'Verify the event from an official school source first.',
                    'Use the page only if no payment is required.',
                    'Fill in only your name and see what happens next.'
                ],
                answer: 1,
                explanation: 'A mismatched event domain should be verified through the official organizer before sharing information.'
            },
            {
                topic: 'Fee request',
                prompt: 'A student workshop page suddenly asks for a processing fee through a direct payment link. What is the safest move?',
                options: [
                    'Pay it if the fee seems small and reasonable.',
                    'Confirm the fee from the official organizer directly.',
                    'Use another account so the payment is isolated.',
                    'Complete the registration first, then decide.'
                ],
                answer: 1,
                explanation: 'Unexpected fee requests should be confirmed directly with the real organizer before any payment is made.'
            },
            {
                topic: 'Sign-in requirement',
                prompt: 'A simple RSVP form unexpectedly sends you to a login page asking for your school account. What should you notice?',
                options: [
                    'The registration process changed into a credential prompt.',
                    'The event uses account-based registration only.',
                    'The organizer wants to reduce duplicate signups.',
                    'The form may need stronger identity checks.'
                ],
                answer: 0,
                explanation: 'When a simple registration flow suddenly asks for account credentials, it can be a phishing sign.'
            },
            {
                topic: 'Safer registration habit',
                prompt: 'Which habit best lowers the risk of event registration phishing?',
                options: [
                    'Confirming the event through official campus pages or offices.',
                    'Joining quickly if several classmates already did.',
                    'Using the link only during school hours.',
                    'Saving the registration link for later use.'
                ],
                answer: 0,
                explanation: 'Official campus pages or offices are safer verification points than forwarded event links.'
            }
        ]
    },
    'marketplace-meetup-scams': {
        title: 'Marketplace & Meetup Scams',
        description: 'Handle phishing-style scam cases that mix payment pressure, fake buyer support, and identity checks in peer-to-peer deals.',
        questions: [
            {
                topic: 'Buyer confirmation',
                prompt: 'A buyer sends a page that says you must log in to confirm payment before shipping an item. What is the safest response?',
                options: [
                    'Use it if the buyer already sent screenshots.',
                    'Check the real marketplace or payment app directly.',
                    'Open it only if the buyer sounds genuine.',
                    'Continue if the payment amount matches your listing.'
                ],
                answer: 1,
                explanation: 'Screenshots and payment claims can be faked. It is safer to check the real platform or payment app directly.'
            },
            {
                topic: 'Fake support payment',
                prompt: 'A message says marketplace support requires you to verify your card before a sale can be released. What should you notice?',
                options: [
                    'The message is trying to collect payment data through a pressure tactic.',
                    'The message includes a support explanation for the sale.',
                    'The card check is linked to buyer protection.',
                    'The process is part of the release workflow.'
                ],
                answer: 0,
                explanation: 'Fake support messages often invent payment checks to steal card details from sellers.'
            },
            {
                topic: 'External checkout',
                prompt: 'A seller or buyer asks you to move to another page because the in-app process is "down." What is safest?',
                options: [
                    'Use the external page if the deal seems urgent.',
                    'Stay inside the real platform or stop the transaction.',
                    'Move to the page but avoid chatting there.',
                    'Ask them to lower the price first.'
                ],
                answer: 1,
                explanation: 'Moving outside the real platform removes safer checks and is a common setup for scams.'
            },
            {
                topic: 'Identity request',
                prompt: 'A meetup deal asks you to upload an ID and account login before confirming a pickup slot. What should you do?',
                options: [
                    'Proceed if the buyer also shares an ID photo.',
                    'Treat it as suspicious and avoid the request.',
                    'Upload only the front part of the ID first.',
                    'Blur some details and wait for a reply.'
                ],
                answer: 1,
                explanation: 'Combining identity documents with account access requests is a strong sign that the process is unsafe.'
            },
            {
                topic: 'Safer selling habit',
                prompt: 'Which habit best reduces marketplace phishing risk?',
                options: [
                    'Keeping payments and messages inside the official platform.',
                    'Moving to private chat once the deal feels serious.',
                    'Using any payment page that loads with HTTPS.',
                    'Accepting urgency if the buyer has good timing.'
                ],
                answer: 0,
                explanation: 'The official platform usually provides safer payment and messaging flows than external pages or private links.'
            }
        ]
    },
    'multi-step-phish-cases': {
        title: 'Multi-Step Phish Cases',
        description: 'Work through chained phishing cases where several believable steps appear before the real credential theft attempt happens.',
        questions: [
            {
                topic: 'Layered setup',
                prompt: 'A message first asks you to confirm a notice, then sends a follow-up login form, then requests a one-time code. What does that pattern suggest?',
                options: [
                    'The process is using multiple steps to look legitimate.',
                    'The sender is fixing an account issue carefully.',
                    'The system is verifying your identity thoroughly.',
                    'The service has a slower support workflow.'
                ],
                answer: 0,
                explanation: 'Multi-step phishing flows are designed to feel legitimate by gradually asking for more sensitive information.'
            },
            {
                topic: 'Escalation pressure',
                prompt: 'Each message in a thread becomes more urgent and asks for more account data than the last one. What is the safest interpretation?',
                options: [
                    'The issue is becoming more serious in real time.',
                    'The sender is escalating pressure to force compliance.',
                    'The system needs more data because the first step failed.',
                    'The account recovery process is almost complete.'
                ],
                answer: 1,
                explanation: 'Escalating urgency and data requests are often signs that the sender is trying to force a rushed mistake.'
            },
            {
                topic: 'Mixed channels',
                prompt: 'An email starts the process, then a text continues it, then a page asks for login details. What should you do first?',
                options: [
                    'Continue because the flow is consistent across channels.',
                    'Pause and verify the whole issue from an official source.',
                    'Use only the latest step because it is most updated.',
                    'Reply to the text and ask for clarification.'
                ],
                answer: 1,
                explanation: 'Using multiple channels can make a fake process feel real. A trusted official source is the safer place to verify it.'
            },
            {
                topic: 'Credential stacking',
                prompt: 'A case asks for your password, then recovery email, then one-time code across separate steps. What should you notice?',
                options: [
                    'The process is collecting layered credentials for takeover.',
                    'The process is repairing a complex account problem.',
                    'The service is confirming account ownership carefully.',
                    'The final code step makes the flow more trustworthy.'
                ],
                answer: 0,
                explanation: 'Attackers often stack credential requests across steps to avoid looking suspicious all at once.'
            },
            {
                topic: 'Best response',
                prompt: 'Which response is safest when a phishing attempt uses several believable steps across time?',
                options: [
                    'Stop responding and verify everything from the official source.',
                    'Finish the process once so you know what it wants.',
                    'Skip the first step and answer only the final one.',
                    'Continue if each step individually looks reasonable.'
                ],
                answer: 0,
                explanation: 'A multi-step flow can be dangerous even if each step seems mild on its own. The safest move is to stop and verify externally.'
            }
        ]
    },
    'campus-portal-spoofs': {
        title: 'Campus Portal Spoofs',
        description: 'Analyze more deceptive portal copies that mix familiar campus details with cloned login and update prompts.',
        questions: [
            {
                topic: 'Cloned portal',
                prompt: 'A page mirrors your school portal closely, but the domain adds `student-access-center` before a different ending. What matters most?',
                options: [
                    'How closely the page matches the real portal design.',
                    'Whether the full domain still belongs to the school.',
                    'Whether the portal shows the right campus color scheme.',
                    'How complete the page navigation looks.'
                ],
                answer: 1,
                explanation: 'A cloned design can look very convincing. The full domain is still the stronger trust check.'
            },
            {
                topic: 'Portal update notice',
                prompt: 'A portal login says you must re-verify today because of a system update, then asks for password and recovery email. What should you notice?',
                options: [
                    'The page is collecting more than a normal login should need.',
                    'The portal is trying to complete account migration steps.',
                    'The school is likely improving identity verification.',
                    'The update flow is more detailed than before.'
                ],
                answer: 0,
                explanation: 'A portal login that requests extra account recovery data is a strong sign the page is unsafe.'
            },
            {
                topic: 'Search result risk',
                prompt: 'You searched for the student portal and the top result leads to a page that asks for a fresh sign-in. What is safest?',
                options: [
                    'Use it if it appears first in search results.',
                    'Compare it with the official bookmarked portal first.',
                    'Try it once and stop if the dashboard looks different.',
                    'Trust it if the title includes the school name.'
                ],
                answer: 1,
                explanation: 'Search results can still lead to spoofed pages. A saved or known official portal is safer.'
            },
            {
                topic: 'Portal support link',
                prompt: 'A portal clone includes a help link that opens another unfamiliar domain for account verification. What does that suggest?',
                options: [
                    'The portal is using separate services correctly.',
                    'The spoof is extending the trap across more than one page.',
                    'The school now uses outsourced login support tools.',
                    'The support page is likely more secure than the portal.'
                ],
                answer: 1,
                explanation: 'Some phishing flows use more than one convincing-looking page to build false trust.'
            },
            {
                topic: 'Best response',
                prompt: 'Which response is safest when a school portal page feels almost right, but not fully trustworthy?',
                options: [
                    'Use the official portal you already know instead.',
                    'Retry the same page from another browser tab.',
                    'Ask a classmate whether the page worked for them.',
                    'Submit only your email to test the first step.'
                ],
                answer: 0,
                explanation: 'A familiar portal is still not trustworthy if key details feel off. The official route is safer.'
            }
        ]
    },
    'urgent-admin-fraud': {
        title: 'Urgent Admin Fraud',
        description: 'Handle deceptive admin-style messages that imitate registrar, finance, or IT notices with stronger authority pressure.',
        questions: [
            {
                topic: 'Authority pressure',
                prompt: 'A message claims to be from the registrar and says non-compliance today may affect enrollment records. What should stand out?',
                options: [
                    'The message uses authority and consequences to force speed.',
                    'The registrar office is clearly named in the message.',
                    'The notice explains the policy in formal language.',
                    'The message uses a serious administrative tone.'
                ],
                answer: 0,
                explanation: 'Authority plus consequences is a common phishing pattern because it pushes people to react before checking.'
            },
            {
                topic: 'Finance notice',
                prompt: 'A finance warning asks you to verify your account through a message link or risk late penalties. What is safest?',
                options: [
                    'Use the link quickly so the penalties do not apply.',
                    'Check the real finance portal or office directly.',
                    'Reply and ask for more billing details first.',
                    'Use the link if the amount shown looks familiar.'
                ],
                answer: 1,
                explanation: 'Penalty pressure is often used in finance-themed phishing. Verify the issue from the real portal or office.'
            },
            {
                topic: 'IT enforcement',
                prompt: 'An IT notice says device access will be revoked unless you sign in through a provided reset page. What should you notice?',
                options: [
                    'The message is turning a login prompt into an emergency task.',
                    'The IT team is protecting access across campus devices.',
                    'The reset page is part of routine security maintenance.',
                    'The notice is written clearly for students to follow.'
                ],
                answer: 0,
                explanation: 'Emergency-style login prompts are a common way to pressure users into trusting fake reset pages.'
            },
            {
                topic: 'Multiple admin names',
                prompt: 'A notice switches between registrar, records, and finance in the same message. What should that suggest?',
                options: [
                    'Several offices are working together on one issue.',
                    'The message may be copying authority cues without accuracy.',
                    'The process is more official because more offices are named.',
                    'The sender is giving extra detail to be helpful.'
                ],
                answer: 1,
                explanation: 'Fake administrative messages often stack official-sounding names without a coherent process behind them.'
            },
            {
                topic: 'Safer admin check',
                prompt: 'Which habit is best when a message claims immediate action is required by an admin office?',
                options: [
                    'Verify it using the official office page or contact route.',
                    'Follow the message first and verify afterward.',
                    'Ask classmates whether they got the same notice.',
                    'Wait to see if another warning arrives tomorrow.'
                ],
                answer: 0,
                explanation: 'The safest response is to verify the issue through the official office contact you already trust.'
            }
        ]
    },
    'cloud-drive-compromise': {
        title: 'Cloud Drive Compromise',
        description: 'Work through advanced file-sharing cases where fake storage notices, access errors, and permission prompts hide credential theft.',
        questions: [
            {
                topic: 'Drive error bait',
                prompt: 'A storage page says the file cannot load until you sign in again because your session token expired. What should you verify first?',
                options: [
                    'Whether the storage domain is the real official service.',
                    'Whether the file title matches your subject.',
                    'Whether the error message looks technically detailed.',
                    'Whether the file owner name is familiar.'
                ],
                answer: 0,
                explanation: 'A fake cloud-drive page often uses realistic errors. The domain still matters most.'
            },
            {
                topic: 'Permission request',
                prompt: 'A shared folder prompt asks for your password to confirm permission changes. What should you conclude first?',
                options: [
                    'The page is requesting a credential it should not need there.',
                    'The folder owner added a stricter access policy.',
                    'The service now uses direct account confirmation.',
                    'The folder may have been secured after recent issues.'
                ],
                answer: 0,
                explanation: 'A permission check should not require your password inside a suspicious or unfamiliar prompt.'
            },
            {
                topic: 'Multiple redirects',
                prompt: 'A file link first opens a fake preview, then redirects to a login page, then to a code prompt. What does that pattern suggest?',
                options: [
                    'A complicated but legitimate storage workflow.',
                    'A staged phishing flow designed to feel believable.',
                    'A broken document link that needs repeated login.',
                    'A secure process using layered access checks.'
                ],
                answer: 1,
                explanation: 'Layered redirects and repeated sign-ins are often used to make a phishing flow feel more legitimate.'
            },
            {
                topic: 'Shared ownership',
                prompt: 'A file claims to be shared by a teacher, but the real owner address does not match their usual account. What is safest?',
                options: [
                    'Trust it if the file contents seem class-related.',
                    'Verify the share through the teacher or official class channel.',
                    'Open it only in preview mode and avoid editing.',
                    'Download it first and inspect it later.'
                ],
                answer: 1,
                explanation: 'If the owner identity does not match what you expect, verify it through a trusted class channel before interacting.'
            },
            {
                topic: 'Best habit',
                prompt: 'Which habit best reduces cloud-drive phishing risk?',
                options: [
                    'Opening important files from the official workspace or app.',
                    'Trusting shared links when the file title sounds familiar.',
                    'Using preview mode before entering login details.',
                    'Checking only the logo and account avatar.'
                ],
                answer: 0,
                explanation: 'Using the official app or saved workspace is safer than relying on shared links that may be spoofed.'
            }
        ]
    },
    'internship-hiring-scams': {
        title: 'Internship Hiring Scams',
        description: 'Practice tougher hiring-related phishing cases involving fake recruiters, application portals, and job verification traps.',
        questions: [
            {
                topic: 'Recruiter urgency',
                prompt: 'A recruiter message says your internship spot is reserved only if you finish an account check today. What should you notice?',
                options: [
                    'The recruiter is using urgency to control your next step.',
                    'The role is probably in high demand.',
                    'The message is trying to keep hiring efficient.',
                    'The employer has a strict onboarding policy.'
                ],
                answer: 0,
                explanation: 'Urgency is often used in fake hiring messages to stop applicants from verifying the process.'
            },
            {
                topic: 'Application portal',
                prompt: 'A hiring page asks you to log in with your school account before you can upload a resume. What is safest?',
                options: [
                    'Use it because schools often connect with recruiters.',
                    'Verify the employer and portal independently first.',
                    'Upload the resume first and skip the login later.',
                    'Use it if the recruiter already knows your course.'
                ],
                answer: 1,
                explanation: 'A job application should not be trusted just because it mentions school-linked access. Verify the employer and portal independently.'
            },
            {
                topic: 'Document + login',
                prompt: 'An internship form asks for both your resume and your portal password. What does that suggest?',
                options: [
                    'The employer is combining two different processes improperly.',
                    'The employer needs stronger identity checks for applicants.',
                    'The company is screening applicants more carefully.',
                    'The form is part of an integrated hiring system.'
                ],
                answer: 0,
                explanation: 'A legitimate hiring process should not require your portal password just to accept an application.'
            },
            {
                topic: 'Interview bait',
                prompt: 'A message says an interview slot is waiting, but you must verify by entering a one-time code through a linked page. What is safest?',
                options: [
                    'Complete it if the interview company sounds real.',
                    'Verify the company and invitation through official channels.',
                    'Enter only the code and skip the other fields.',
                    'Try it once to avoid losing the interview slot.'
                ],
                answer: 1,
                explanation: 'Interview pressure can be used to steal verification codes. Verify the invitation independently.'
            },
            {
                topic: 'Best hiring habit',
                prompt: 'Which habit best reduces internship phishing risk?',
                options: [
                    'Checking hiring messages against the company’s real site or contact.',
                    'Replying quickly before opportunities disappear.',
                    'Trusting messages that include job titles and logos.',
                    'Using any portal that loads with HTTPS.'
                ],
                answer: 0,
                explanation: 'A real employer’s official site or contact channel is safer than trusting a hiring link from a message.'
            }
        ]
    },
    'verification-chain-attacks': {
        title: 'Verification Chain Attacks',
        description: 'Work through the hardest verification flows where attackers chain links, forms, and codes together to reach full account takeover.',
        questions: [
            {
                topic: 'Code chaining',
                prompt: 'A login page accepts your password, then sends you to a separate page asking for a code, then another asking for backup email. What does that suggest?',
                options: [
                    'A sophisticated but legitimate security check.',
                    'A chained phishing flow designed to gather layered access.',
                    'A temporary issue with the normal login sequence.',
                    'A system migration requiring additional confirmation.'
                ],
                answer: 1,
                explanation: 'Chained pages that keep collecting more sensitive account details are a strong sign of account takeover intent.'
            },
            {
                topic: 'Cross-channel verification',
                prompt: 'An email starts the process, a text continues it, and a chat message reminds you to finish verification. What is the safest interpretation?',
                options: [
                    'The service is using every channel for reliability.',
                    'The attacker is reinforcing pressure across channels.',
                    'The process is urgent because the account is exposed.',
                    'The platform is making sure you see the warning.'
                ],
                answer: 1,
                explanation: 'Using several channels together can make the flow feel more legitimate while increasing pressure to comply.'
            },
            {
                topic: 'Credential escalation',
                prompt: 'A case begins with email confirmation, then asks for login, then asks for recovery info, then asks for payment details. What should you conclude?',
                options: [
                    'The process is expanding far beyond a normal verification task.',
                    'The service uses one flow to update all account data.',
                    'The account has several unrelated issues at once.',
                    'The platform is resolving multiple warnings in one session.'
                ],
                answer: 0,
                explanation: 'When a process keeps expanding into more unrelated sensitive data, it is likely a phishing chain rather than a real verification flow.'
            },
            {
                topic: 'Partial trust trap',
                prompt: 'The first two steps of a flow look normal, but the third step asks for information no real system should need. What is safest?',
                options: [
                    'Continue because the earlier steps already looked real.',
                    'Treat the whole flow as compromised and stop there.',
                    'Finish the third step only if the page still uses HTTPS.',
                    'Retry the flow from the first step to compare it again.'
                ],
                answer: 1,
                explanation: 'A phishing flow can build trust gradually. One clearly unsafe step is enough reason to stop the whole process.'
            },
            {
                topic: 'Best response',
                prompt: 'Which response is strongest when a phishing attempt uses several believable verification steps?',
                options: [
                    'Stop the process and secure the real account from official channels.',
                    'Complete it quickly so you can review the account afterward.',
                    'Ask the sender to shorten the process before you continue.',
                    'Save screenshots and proceed if nothing looks obviously fake.'
                ],
                answer: 0,
                explanation: 'The safest response is to stop the chain and secure or verify the real account from trusted official channels.'
            }
        ]
    },
    'phishing-scenarios': {
        title: 'Phishing Scenarios',
        description: 'Go through realistic situations that test how well you can identify and respond to possible phishing attempts.',
        questions: [
            {
                topic: 'Campus scenario',
                prompt: 'A student receives a "tuition balance" email with an urgent payment link, but the message also includes correct school branding and a student number. What is the safest response?',
                options: [
                    'Use the payment link since the details look accurate.',
                    'Verify the balance through the official portal first.',
                    'Reply to the email and ask if the warning is real.',
                    'Wait for another message before taking action.'
                ],
                answer: 1,
                explanation: 'Payment-related urgency is a common phishing tactic. Verify through the official portal before taking action.'
            },
            {
                topic: 'Social media',
                prompt: 'A login page shared in a student group chat uses your school logo and says your session expired. What should you verify first?',
                options: [
                    'Whether the page colors match the usual school design.',
                    'Whether the button layout looks professional enough.',
                    'Whether the website address is the official domain.',
                    'Whether other students said the page worked for them.'
                ],
                answer: 2,
                explanation: 'Visual design can be copied easily. The actual domain is a far better trust check.'
            },
            {
                topic: 'QR code scam',
                prompt: 'You scan a QR code posted on campus that opens a login form for a "network upgrade." The page looks polished and uses HTTPS. What is the safest move?',
                options: [
                    'Enter your credentials if the page looks secure.',
                    'Verify the destination through an official source first.',
                    'Trust it because it was posted on school grounds.',
                    'Check the logo first, then continue if it looks real.'
                ],
                answer: 1,
                explanation: 'QR codes can hide suspicious destinations the same way shortened links can.'
            },
            {
                topic: 'Impersonation',
                prompt: 'A chat message from a "school officer" says they are helping restore student access and asks for the one-time code sent to your phone. What is the safest response?',
                options: [
                    'Share the code if the issue they mention sounds real.',
                    'Do not share it and verify the request independently.',
                    'Ask them to prove who they are before sharing it.',
                    'Wait a few minutes and send it if they follow up.'
                ],
                answer: 1,
                explanation: 'One-time codes should never be shared casually. Attackers often use impersonation to steal them.'
            },
            {
                topic: 'Fake support page',
                prompt: 'A support page says your school mailbox is full and asks you to sign in again to keep messages from being deleted. Which step matters most?',
                options: [
                    'Check whether the page uses the official school domain.',
                    'Check whether the logo looks clear and updated.',
                    'Check whether the form loads quickly on your phone.',
                    'Check whether the warning appears in bold red text.'
                ],
                answer: 0,
                explanation: 'A copied logo and urgent message can be faked. The official domain is the stronger trust check.'
            }
        ]
    },
    'executive-impersonation': {
        title: 'Executive Impersonation',
        description: 'Handle high-pressure messages that pretend to come from school leaders, administrators, or decision-makers.',
        questions: [
            {
                topic: 'Authority pressure',
                prompt: 'You receive a message claiming to be from the school president asking you to urgently review a private document through a link. What matters most first?',
                options: [
                    'Whether the request sounds important enough.',
                    'Whether the sender uses the official school channel.',
                    'Whether the message mentions your full name.',
                    'Whether the attachment opens on your phone.'
                ],
                answer: 1,
                explanation: 'Authority-based phishing often relies on urgency and title. The sender and channel should be verified first.'
            },
            {
                topic: 'Urgent payment',
                prompt: 'A department head asks you to keep a request confidential and buy digital vouchers immediately. Which signal is the biggest warning sign?',
                options: [
                    'The request sounds urgent and secretive.',
                    'The message is short and direct.',
                    'The sender uses polite language.',
                    'The item requested is digital.'
                ],
                answer: 0,
                explanation: 'Urgency plus secrecy is a classic impersonation pattern used to stop people from verifying the request.'
            },
            {
                topic: 'Message verification',
                prompt: 'A dean sends a late-night email asking you to click a link and approve a document before morning. What is the safest step?',
                options: [
                    'Approve it quickly if the message sounds formal.',
                    'Open the link on another device first.',
                    'Verify the request through an official contact route.',
                    'Reply to the same email and wait for confirmation.'
                ],
                answer: 2,
                explanation: 'Verification should happen through a trusted route you already know, not through the suspicious message itself.'
            },
            {
                topic: 'Copied identity',
                prompt: 'A message uses the name and profile picture of a real administrator, but the contact number is unfamiliar. What should you assume first?',
                options: [
                    'It is safe because the name and image match.',
                    'It may be impersonation and should be verified.',
                    'It is fine if the tone sounds professional.',
                    'It is real if it references a current event.'
                ],
                answer: 1,
                explanation: 'Names and profile photos are easy to copy. An unfamiliar contact route should be treated carefully.'
            },
            {
                topic: 'Approval request',
                prompt: 'A senior staff account asks you to approve access to a cloud file immediately using a shared link. What is the safest response?',
                options: [
                    'Use the link if it includes the correct office name.',
                    'Wait for someone else to approve first.',
                    'Open the file preview before deciding.',
                    'Go to the official platform directly and check there.'
                ],
                answer: 3,
                explanation: 'Using the official platform directly is safer than trusting a link sent in a pressured message.'
            }
        ]
    },
    'breach-followup-scams': {
        title: 'Breach Follow-Up Scams',
        description: 'Practice spotting fake breach warnings that try to exploit fear after a supposed security incident.',
        questions: [
            {
                topic: 'Account scare',
                prompt: 'You receive a message saying your school account was found in a data breach and must be reset through an attached link. What is the safest reaction?',
                options: [
                    'Use the provided reset link before the access window closes.',
                    'Check the official school portal or IT office notice first.',
                    'Reply and ask whether your classmates got the same alert.',
                    'Save the message in case you need it later.'
                ],
                answer: 1,
                explanation: 'Breach warnings can be faked. Verify through official sources before using any reset link.'
            },
            {
                topic: 'Fear-based messaging',
                prompt: 'Which message detail most strongly suggests a breach-themed phishing attempt?',
                options: [
                    'It says your account may be at risk.',
                    'It urges immediate action through one included link.',
                    'It includes a support footer with a case number.',
                    'It mentions account security in the subject line.'
                ],
                answer: 1,
                explanation: 'Attackers often mix fear and urgency with a single action path to push fast decisions.'
            },
            {
                topic: 'Password reset pressure',
                prompt: 'A text says your credentials leaked and tells you to sign in through a "secure recovery page." What should you do?',
                options: [
                    'Sign in if the page uses HTTPS.',
                    'Wait a few minutes and try the same link again.',
                    'Use the official website or app to check your account.',
                    'Forward the text to friends and ask if it looks real.'
                ],
                answer: 2,
                explanation: 'Official login routes are safer than links provided inside alarming messages.'
            },
            {
                topic: 'Follow-up scam',
                prompt: 'After a public news story about hacked school accounts, an email asks you to confirm your identity with your current password. Why is this risky?',
                options: [
                    'Real incidents do not justify sending your password.',
                    'It arrived after normal office hours.',
                    'It uses too many technical terms.',
                    'It references a current event too directly.'
                ],
                answer: 0,
                explanation: 'Attackers often piggyback on real events, but legitimate support should not ask for your password through email.'
            },
            {
                topic: 'Credential safety',
                prompt: 'A warning email says your account will stay exposed unless you "verify your current password" to prove ownership. What is the best response?',
                options: [
                    'Never provide the password through the email workflow.',
                    'Provide only part of the password for safety.',
                    'Change the password after sending it once.',
                    'Reply asking whether a shorter password is allowed.'
                ],
                answer: 0,
                explanation: 'A verification process that asks for your current password in a message flow should be treated as unsafe.'
            }
        ]
    },
    'recovery-flow-attacks': {
        title: 'Recovery Flow Attacks',
        description: 'Learn to recognize suspicious account recovery steps, one-time-code traps, and takeover attempts.',
        questions: [
            {
                topic: 'Recovery email',
                prompt: 'A page says your account recovery request has been started and asks you to enter your one-time code to cancel it. What is the biggest concern?',
                options: [
                    'The page may be trying to steal the one-time code.',
                    'The page uses a short recovery deadline.',
                    'The message mentions account protection often.',
                    'The design looks too simple for a school page.'
                ],
                answer: 0,
                explanation: 'Recovery scams often try to capture one-time codes to complete an account takeover.'
            },
            {
                topic: 'Unexpected reset',
                prompt: 'You did not request a password reset, but a message says someone else did and you must sign in now to stop it. What is safest?',
                options: [
                    'Use the included link to protect the account quickly.',
                    'Go to the official sign-in page yourself and review activity there.',
                    'Reply first and wait for an explanation.',
                    'Ignore it completely even if more alerts arrive.'
                ],
                answer: 1,
                explanation: 'If the alert is real, checking through the official platform is safer than trusting the message link.'
            },
            {
                topic: 'One-time code request',
                prompt: 'Someone claiming to be support says they sent a code to help restore your access and asks you to read it back. What should you do?',
                options: [
                    'Share it if they already know your full name.',
                    'Share it only if the request sounds urgent.',
                    'Do not share it and verify support separately.',
                    'Share the code but change your password later.'
                ],
                answer: 2,
                explanation: 'One-time codes should not be shared casually. Attackers use them to finish account takeovers.'
            },
            {
                topic: 'Cancel request page',
                prompt: 'A link says "Cancel unauthorized password reset" and opens a login form that asks for your current password. What should you check first?',
                options: [
                    'Whether the school logo matches the real site.',
                    'Whether the domain is the official account provider.',
                    'Whether the page loads quickly enough.',
                    'Whether the warning text appears in red.'
                ],
                answer: 1,
                explanation: 'A convincing design can be copied. The official domain matters more than visual polish.'
            },
            {
                topic: 'Takeover prevention',
                prompt: 'What is the best habit when you receive account recovery notices you did not trigger?',
                options: [
                    'Handle them through the official app or website only.',
                    'Open the message links on a safer device.',
                    'Ask the sender whether the notice is routine.',
                    'Wait for a second reminder before acting.'
                ],
                answer: 0,
                explanation: 'Using the official route reduces the chance of reacting inside a phishing-controlled recovery flow.'
            }
        ]
    },
    'financial-approval-fraud': {
        title: 'Financial Approval Fraud',
        description: 'Spot convincing approval requests involving reimbursements, invoices, budgets, and last-minute payments.',
        questions: [
            {
                topic: 'Invoice pressure',
                prompt: 'A message says an invoice must be approved immediately or a school service will be suspended today. What is the safest first move?',
                options: [
                    'Approve it first because service impact is serious.',
                    'Check the request through the official finance process.',
                    'Download the invoice and inspect it on your phone.',
                    'Reply asking if a smaller payment is possible.'
                ],
                answer: 1,
                explanation: 'Financial phishing often uses urgent consequences. Verification should happen through the official workflow.'
            },
            {
                topic: 'Bank details',
                prompt: 'An email says a supplier changed bank details and asks you to update the payment record using an attached form. Why is this risky?',
                options: [
                    'Bank detail changes should be verified directly.',
                    'Attached forms are always unsafe by default.',
                    'Emails about payments should only be short.',
                    'Suppliers should never send account updates.'
                ],
                answer: 0,
                explanation: 'Payment redirection scams often rely on fake change-of-bank notices.'
            },
            {
                topic: 'Approval chain',
                prompt: 'A finance request arrives from a familiar name, but the sender asks you to skip the usual approval process because of urgency. What should you do?',
                options: [
                    'Follow the normal process and verify the request.',
                    'Approve it once if the amount is small enough.',
                    'Send the request to another office without checking.',
                    'Wait until the sender becomes more specific.'
                ],
                answer: 0,
                explanation: 'Urgent requests to bypass normal controls are a strong fraud sign.'
            },
            {
                topic: 'Digital voucher request',
                prompt: 'A senior office message asks you to buy prepaid vouchers for an urgent event expense. What is the strongest red flag?',
                options: [
                    'The amount requested is unusually specific.',
                    'The payment method is hard to reverse or trace.',
                    'The message arrived outside office hours.',
                    'The request uses short sentences.'
                ],
                answer: 1,
                explanation: 'Irreversible payment methods are often preferred by scammers because they are harder to recover.'
            },
            {
                topic: 'Approval page',
                prompt: 'You are sent to an "approval portal" asking for your account password before you can release funds. What should you assume first?',
                options: [
                    'It is normal if the portal uses HTTPS.',
                    'It may be a credential theft page.',
                    'It is safe if the amount matches a real invoice.',
                    'It is legitimate if the sender follows up quickly.'
                ],
                answer: 1,
                explanation: 'A fake approval portal can be used to steal credentials and continue the fraud.'
            }
        ]
    },
    'cross-channel-takeovers': {
        title: 'Cross-Channel Takeovers',
        description: 'Work through attacks that jump across email, text, chat, and calls to feel more believable.',
        questions: [
            {
                topic: 'Linked channels',
                prompt: 'You get an email about account verification, then a text telling you to complete the same step quickly. Why is this still suspicious?',
                options: [
                    'Multiple channels can be used to increase pressure.',
                    'Texts are always less trustworthy than email.',
                    'Real support never contacts users twice.',
                    'A second message means the first one was fake.'
                ],
                answer: 0,
                explanation: 'Attackers often use multiple channels together so the request feels more urgent and legitimate.'
            },
            {
                topic: 'Follow-up call',
                prompt: 'After ignoring a login warning email, you receive a phone call telling you to read a code to "secure" the account. What is safest?',
                options: [
                    'Provide the code because the caller references the email.',
                    'End the call and verify using official support details.',
                    'Ask the caller to wait while you open the link.',
                    'Send the code by text instead of saying it aloud.'
                ],
                answer: 1,
                explanation: 'A follow-up call does not make the request trustworthy. Verification should use official contact details.'
            },
            {
                topic: 'Chat handoff',
                prompt: 'A support chat tells you to continue account verification through a new site shared by SMS. What is the best response?',
                options: [
                    'Switch channels and continue if both messages match.',
                    'Use only the official support site you already know.',
                    'Open the SMS link first, then go back to the chat.',
                    'Wait for a third message before deciding.'
                ],
                answer: 1,
                explanation: 'A channel handoff can be part of a coordinated phishing flow. Staying on official routes is safer.'
            },
            {
                topic: 'Trust layering',
                prompt: 'An attacker first sends a harmless-looking alert, then later follows up with a login page and a call. What tactic is being used?',
                options: [
                    'Building trust and pressure over multiple steps.',
                    'Testing whether your phone can open forms.',
                    'Confirming your school schedule before asking more.',
                    'Reducing the chance of technical problems.'
                ],
                answer: 0,
                explanation: 'Layered contact is used to make the attack feel more convincing and harder to dismiss.'
            },
            {
                topic: 'Safe habit',
                prompt: 'What is the strongest defense against cross-channel phishing attempts?',
                options: [
                    'Comparing the style of each message carefully.',
                    'Sticking to official websites and support routes only.',
                    'Responding on the channel that feels most formal.',
                    'Waiting for at least two messages before acting.'
                ],
                answer: 1,
                explanation: 'Using official routes removes much of the attacker’s control over the interaction.'
            }
        ]
    },
    'best-practices': {
        title: 'Best Practices',
        description: 'Strengthen your everyday safety habits with practical best practices for accounts, messages, and suspicious websites.',
        questions: [
            {
                topic: 'Password habits',
                prompt: 'Which habit does the most to limit damage if one of your accounts is compromised through phishing?',
                options: [
                    'Using one strong password for related school accounts.',
                    'Using different passwords for important accounts.',
                    'Keeping password screenshots in a private chat.',
                    'Changing only your email password regularly.'
                ],
                answer: 1,
                explanation: 'Different passwords reduce the damage if one account is exposed through phishing.'
            },
            {
                topic: 'Verification',
                prompt: 'When a message warns you about an account issue and provides a direct link, what is the best practice?',
                options: [
                    'Use the link quickly before the problem gets worse.',
                    'Use the official website or app you already know.',
                    'Open the link in another browser first.',
                    'Reply first, then decide if the sender sounds real.'
                ],
                answer: 1,
                explanation: 'Going directly to the official site is safer than trusting links from messages.'
            },
            {
                topic: 'Sharing links',
                prompt: 'A friend asks whether a suspicious link is safe because it "looks normal." What is the best response?',
                options: [
                    'Tell them to try it in incognito mode first.',
                    'Tell them not to open it until it is verified.',
                    'Ask more people in the group chat what they think.',
                    'Tell them it is probably fine if it uses HTTPS.'
                ],
                answer: 1,
                explanation: 'It is safer to pause and verify suspicious links before anyone interacts with them.'
            },
            {
                topic: 'Awareness habit',
                prompt: 'Which everyday habit most improves phishing awareness over time?',
                options: [
                    'Checking links, sender details, and requests first.',
                    'Reading messages quickly so you do not miss updates.',
                    'Trusting familiar names unless the writing looks bad.',
                    'Opening attachments first, then deciding later.'
                ],
                answer: 0,
                explanation: 'Consistently checking details before acting builds strong phishing awareness over time.'
            },
            {
                topic: 'Safer routine',
                prompt: 'Which routine makes it easier to avoid phishing mistakes during busy days?',
                options: [
                    'Handling urgent messages first before checking the details.',
                    'Using one trusted route to sign in instead of message links.',
                    'Opening suspicious pages on a different browser window.',
                    'Keeping risky messages unread until the next day.'
                ],
                answer: 1,
                explanation: 'A consistent habit of using the official site or app instead of message links reduces the chance of reacting to phishing pressure.'
            }
        ]
    },
    'vendor-portal-breaches': {
        title: 'Vendor Portal Breaches',
        description: 'Assess supplier portal changes, invoice workflows, and credential prompts that look operationally legitimate at first glance.',
        questions: [
            {
                topic: 'Portal migration notice',
                prompt: 'A supplier email says invoice access moved to a new portal today and includes a login link. The sender name matches an old thread, but the domain is slightly different from earlier billing messages. What is the safest first move?',
                options: [
                    'Open the portal in a separate browser profile and compare the dashboard after sign-in.',
                    'Reply to the message asking whether the migration notice was meant for your department.',
                    'Verify the portal change through a trusted vendor contact or prior procurement record.',
                    'Forward the email to another teammate and wait for their judgment about the request.'
                ],
                answer: 2,
                explanation: 'A believable migration story can still be phishing. The safest move is to verify the change through an existing trusted contact or workflow.'
            },
            {
                topic: 'Invoice workflow pressure',
                prompt: 'A portal page shows a real-looking purchase order reference and asks you to enter your full account password before invoice history will load. What is the strongest warning sign?',
                options: [
                    'The page asks for a secret that does not fit the task being described.',
                    'The purchase order number appears detailed enough to come from a live project.',
                    'The invoice history area remains hidden until one more step is completed.',
                    'The portal layout looks newer than the version the team used last quarter.'
                ],
                answer: 0,
                explanation: 'Attackers often mix true business context with unnecessary credential prompts. The request for a password is the strongest mismatch.'
            },
            {
                topic: 'Trust signal overload',
                prompt: 'A vendor notice includes the correct logo, your organization name, and a matching invoice amount, but the portal asks you to allow browser notifications before continuing. What should you conclude?',
                options: [
                    'The brand details outweigh the unrelated browser permission request on the page.',
                    'The page may combine true context with an unrelated permission trap for access.',
                    'The matching amount proves the portal is tied to a real invoice workflow already.',
                    'The notification prompt is normal because invoice portals often push urgent updates.'
                ],
                answer: 1,
                explanation: 'Advanced phishing pages often blend accurate business details with unrelated permission requests to build false confidence.'
            },
            {
                topic: 'Forwarded validation',
                prompt: 'A coworker forwards the portal link and says, "This seems like the new billing site, can you confirm?" What is the safest interpretation?',
                options: [
                    'The forwarded message is safe because it came from a known coworker account.',
                    'The link is probably safe because the coworker only asked for confirmation first.',
                    'The message still needs independent verification because trusted people can relay bad links.',
                    'The safest move is to open the portal once and inspect the page from inside the session.'
                ],
                answer: 2,
                explanation: 'A forwarded message from a known contact does not make the destination trustworthy. Coworkers can unknowingly pass along malicious links.'
            },
            {
                topic: 'Operational urgency',
                prompt: 'You are told the supplier account may be suspended by 5 PM unless the portal is activated today. Which response best protects workflow and security together?',
                options: [
                    'Activate the portal quickly, then rotate your password after the invoice batch clears.',
                    'Use a saved bookmark to check the vendor account and confirm the request with procurement.',
                    'Open the portal from a shared workstation so your own account stays outside the process.',
                    'Continue only from the office network because internal traffic lowers phishing risk overall.'
                ],
                answer: 1,
                explanation: 'Using a trusted entry point and confirming the request with the responsible team balances operational urgency with verification.'
            }
        ]
    },
    'identity-chain-spoofs': {
        title: 'Identity Chain Spoofs',
        description: 'Work through attack chains that reuse trusted names, quoted threads, and familiar roles to create false confidence.',
        questions: [
            {
                topic: 'Forward chain trust',
                prompt: 'You receive a forwarded thread that appears to include a dean, registrar staff, and student assistant discussing a document request. The newest message asks you to open a file and confirm access. What is the strongest concern?',
                options: [
                    'The chain may be staged even if the names and roles look familiar.',
                    'The request is too detailed for phishing because several offices are referenced.',
                    'The forwarded style is normal because teams often copy multiple people at once.',
                    'The document request is acceptable as long as no password is requested directly.'
                ],
                answer: 0,
                explanation: 'Attackers can reconstruct trust through names, quoted text, and believable roles. Familiar identities inside a thread are not enough.'
            },
            {
                topic: 'Display name confusion',
                prompt: 'A message displays the real name of a senior staff member, but the reply address uses a slightly altered domain and asks you to continue privately. What should matter most?',
                options: [
                    'The private follow-up is reasonable because urgent matters move off group threads.',
                    'The displayed sender name matters more than minor domain differences in the address.',
                    'The reply address and channel change both weaken the credibility of the request.',
                    'The safest move is to answer briefly and ask whether a faster platform is preferred.'
                ],
                answer: 2,
                explanation: 'A display name can be faked easily. A changed domain plus a shift to a more private channel is a major warning sign.'
            },
            {
                topic: 'Quoted prior message',
                prompt: 'An email quotes a real announcement from last month, then adds a new instruction to sign in through an attached access sheet. Why is this still suspicious?',
                options: [
                    'The older announcement proves the current attachment was probably generated internally.',
                    'The new instruction can piggyback on true context even when the action is malicious.',
                    'The quoted text means the sender copied an original internal thread automatically.',
                    'The attachment is safe because the message reuses wording from a legitimate notice.'
                ],
                answer: 1,
                explanation: 'Advanced phishing often reuses accurate old material to lower suspicion while inserting a new harmful step.'
            },
            {
                topic: 'Role pressure',
                prompt: 'A message says a department head is waiting on you and mentions your supervisor by name, but the link goes to a form asking for full credentials before showing the file. What is the best reading?',
                options: [
                    'The role references are reassuring because phishing rarely includes internal names correctly.',
                    'The credential request outweighs the internal references and should trigger verification.',
                    'The supervisor name confirms the sender has approved access to the workflow already.',
                    'The message is safer than usual because it requests action only once without repeats.'
                ],
                answer: 1,
                explanation: 'Accurate names can come from public pages or leaked context. The risky credential request remains the stronger signal.'
            },
            {
                topic: 'Breaking the chain',
                prompt: 'Which response best disrupts an identity-chain phishing attempt without slowing verification too much?',
                options: [
                    'Use a separately known contact method to confirm the request before opening the resource.',
                    'Stay inside the same thread and ask for more detail about the expected timeline.',
                    'Compare the tone of the message with how the sender usually writes in formal email.',
                    'Open the file in preview mode first, then call only if the layout seems unusual.'
                ],
                answer: 0,
                explanation: 'The safest move is to step outside the suspicious chain and verify through a trusted method you already know.'
            }
        ]
    },
    'cloud-consent-traps': {
        title: 'Cloud Consent Traps',
        description: 'Judge risky app permissions, shared workspace invites, and sign-in flows that abuse real cloud platforms instead of fake pages.',
        questions: [
            {
                topic: 'Permission consent',
                prompt: 'A real cloud login succeeds, but the next screen asks you to grant an app access to mail, files, and contacts so one shared document can open. What is the key problem?',
                options: [
                    'The permission scope is broader than what one shared document should require.',
                    'The cloud brand is reliable enough that consent prompts are usually pre-reviewed.',
                    'The document request is harmless because the sign-in already confirmed your identity.',
                    'The mail and file permissions are expected when collaboration tools are involved.'
                ],
                answer: 0,
                explanation: 'Consent phishing often uses real login pages and then asks for access that exceeds the stated task.'
            },
            {
                topic: 'Shared workspace lure',
                prompt: 'You are asked to join a shared workspace to review emergency policy changes. The invite opens a real platform, but the owner is unfamiliar and the permissions include persistent access. What is safest?',
                options: [
                    'Join the workspace but avoid posting anything until the owner identity is clearer later.',
                    'Treat the invite as risky until the owner and access need are verified independently.',
                    'Accept the invite because the platform itself enforces strong baseline security checks.',
                    'Use a second browser profile so the main account remains less exposed overall.'
                ],
                answer: 1,
                explanation: 'A legitimate platform does not make a request legitimate. Ownership and permission scope still need verification.'
            },
            {
                topic: 'Single sign-on comfort',
                prompt: 'A colleague says, "It is safe because you never typed your password, it just used single sign-on." Why is that incomplete?',
                options: [
                    'Single sign-on removes most credential risk, so the remaining issue is usually only spam.',
                    'Single sign-on matters less because unsafe apps cannot run on major cloud platforms anyway.',
                    'Single sign-on can still expose data if the app receives permissions it should not have.',
                    'Single sign-on is suspicious by itself because real teams avoid cloud integrations now.'
                ],
                answer: 2,
                explanation: 'Consent phishing often avoids password theft and instead steals access through broad permissions.'
            },
            {
                topic: 'App legitimacy check',
                prompt: 'Which detail gives the strongest reason to pause before approving a cloud app request?',
                options: [
                    'The app icon is simple and the permission prompt uses a very clean layout.',
                    'The app requests durable permissions that do not match the described task.',
                    'The request appears after a normal sign-in flow on a recognized login screen.',
                    'The app claims it will speed up collaboration and reduce manual review steps.'
                ],
                answer: 1,
                explanation: 'Permission mismatch is one of the strongest clues in a consent trap, especially when access persists beyond the immediate task.'
            },
            {
                topic: 'Safer workflow',
                prompt: 'You truly need the shared file today, but the consent flow feels wrong. Which response is best?',
                options: [
                    'Approve the app once, download the file, then revoke the permission later if needed.',
                    'Ask the sender to share the file through an approved channel or verified location.',
                    'Finish the approval from a guest browser session to reduce the account exposure.',
                    'Continue if the tenant branding and profile photo match your normal sign-in view.'
                ],
                answer: 1,
                explanation: 'A safer alternative is to use a verified existing channel instead of granting suspicious new access rights.'
            }
        ]
    },
    'incident-response-bait': {
        title: 'Incident Response Bait',
        description: 'Evaluate fake security escalations that sound procedural, reference real events, and push you toward the wrong containment step.',
        questions: [
            {
                topic: 'Security ticket scare',
                prompt: 'A message claims your account triggered an impossible-travel alert and says you must confirm identity through a rapid containment form. What makes this especially dangerous?',
                options: [
                    'The alert may use a realistic security concept to push you into a bad response path.',
                    'The impossible-travel wording is too technical for attackers and likely reflects a real alert.',
                    'The containment form is acceptable because incidents require immediate user confirmation.',
                    'The urgency is normal because all incident handling needs quick credential confirmation.'
                ],
                answer: 0,
                explanation: 'Attackers often borrow legitimate security language to lower suspicion. The unsafe response path is the real danger.'
            },
            {
                topic: 'Containment instructions',
                prompt: 'A supposed security analyst asks you to disable multifactor authentication temporarily so the incident can be isolated faster. What should you infer?',
                options: [
                    'The request may be valid because MFA sometimes blocks urgent investigation access.',
                    'The analyst is probably rushed and only needs confirmation of your role first.',
                    'The request conflicts with safe containment practice and needs outside verification.',
                    'The message is likely real because attackers usually ask for data instead of settings.'
                ],
                answer: 2,
                explanation: 'A request to weaken protective controls during an alleged incident is a major red flag and should be verified through a trusted route.'
            },
            {
                topic: 'Call-back manipulation',
                prompt: 'A caller references the same ticket number shown in the email and asks you to read a one-time code aloud to close the case. Why is this still suspicious?',
                options: [
                    'Matching ticket numbers can be staged if one actor controls both the email and call.',
                    'One-time codes are less sensitive during incident handling because they expire quickly.',
                    'Security teams often ask for verbal code confirmation during remote containment work.',
                    'The call is safer than the email because voice communication lowers phishing risk.'
                ],
                answer: 0,
                explanation: 'Coordinated email and phone follow-ups are common escalation tactics. The one-time code can still be used to seize access.'
            },
            {
                topic: 'Partial truth',
                prompt: 'The message correctly mentions a recent service outage your organization actually experienced. What is the best conclusion?',
                options: [
                    'Recent real outages make related security messages more trustworthy by default.',
                    'Accurate context can strengthen a deceptive request and should not replace verification.',
                    'A real outage means normal verification steps are usually relaxed for faster recovery.',
                    'Any message tied to a known event should be opened first before the window expires.'
                ],
                answer: 1,
                explanation: 'Real events are often used as bait. Accurate background context does not validate the requested action.'
            },
            {
                topic: 'Best defensive move',
                prompt: 'Which action best handles a message that sounds like urgent incident response but may be phishing?',
                options: [
                    'Use a known security contact channel or internal portal to confirm the case first.',
                    'Stay in the same thread and ask for more technical detail before deciding what to do.',
                    'Open the linked form but avoid typing anything until the layout feels familiar enough.',
                    'Wait silently for another follow-up because real incidents usually escalate again.'
                ],
                answer: 0,
                explanation: 'Independent verification through a trusted security channel is the strongest way to break a fake escalation attempt.'
            }
        ]
    },
    'multi-actor-escalations': {
        title: 'Multi-Actor Escalations',
        description: 'Analyze attacks where different roles and channels reinforce the same false request across several believable follow-ups.',
        questions: [
            {
                topic: 'Role stacking',
                prompt: 'You receive an email from "Support," then a chat message from a "team lead," and later a text from a supposed vendor contact, all pushing the same account request. What pattern matters most?',
                options: [
                    'Multiple roles agreeing on one task usually means the process is already approved.',
                    'The repeated request across channels may be building false trust through pressure.',
                    'The vendor message lowers the phishing risk because outsiders would not know the request.',
                    'The support email remains the safest source because it arrived before the others.'
                ],
                answer: 1,
                explanation: 'Attackers may deliberately use several identities and channels to manufacture trust around a harmful action.'
            },
            {
                topic: 'Escalation timing',
                prompt: 'The second and third follow-ups arrive minutes apart and reference your delayed response. Why does that matter?',
                options: [
                    'Fast cross-channel escalation can pressure you into skipping careful verification.',
                    'Fast follow-ups are typical of efficient operations and usually signal legitimacy.',
                    'Quick timing matters less than whether the final message includes a formal signature.',
                    'Quick timing mostly shows automation, which lowers the odds of malicious intent.'
                ],
                answer: 0,
                explanation: 'Short-gap follow-ups are often used to create urgency and overwhelm normal review habits.'
            },
            {
                topic: 'Different instructions',
                prompt: 'Each actor describes the issue a little differently, but all push you toward the same sign-in page. What is the strongest interpretation?',
                options: [
                    'Different wording is normal because each role understands the process differently.',
                    'The sign-in page becomes safer because several parties reached the same resolution.',
                    'Small inconsistencies can reveal a coordinated script built around one bad action.',
                    'The issue is probably real because attackers usually repeat the exact same wording.'
                ],
                answer: 2,
                explanation: 'When several actors converge on one risky action, the destination matters more than surface wording differences.'
            },
            {
                topic: 'Policy override',
                prompt: 'A supposed manager tells you to skip the usual verification because another team already confirmed the request. What is safest?',
                options: [
                    'Skip your own verification because duplicated checks slow down urgent work.',
                    'Follow the instruction if the message includes your real department and project code.',
                    'Keep the normal verification step because claimed approval can be part of the trap.',
                    'Proceed if the sign-in page shows a valid certificate and expected tenant branding.'
                ],
                answer: 2,
                explanation: 'A request to bypass established checks is itself a warning sign, especially in a coordinated multi-actor attack.'
            },
            {
                topic: 'Breaking the chain',
                prompt: 'Which response best disrupts a coordinated multi-actor phishing attempt?',
                options: [
                    'Answer only the most senior-sounding person because they are closest to the decision.',
                    'Pause the chain and confirm through a trusted owner or official internal workflow.',
                    'Open the link from the earliest message because later follow-ups are more suspicious.',
                    'Ask each sender the same question and continue if two replies sound professional.'
                ],
                answer: 1,
                explanation: 'The safest approach is to step outside the coordinated chain and verify through a trusted owner or official process.'
            }
        ]
    },
    'trust-layer-collisions': {
        title: 'Trust Layer Collisions',
        description: 'Break down advanced situations where branding, workflow context, urgency, and technical signals point in conflicting directions.',
        questions: [
            {
                topic: 'Mixed signals',
                prompt: 'A page uses the correct brand, HTTPS, and believable message history, but the requested action does not fit the business task being described. Which clue should carry the most weight?',
                options: [
                    'The action mismatch matters more because the request does not fit the stated purpose.',
                    'The correct brand and HTTPS status outweigh the smaller workflow inconsistency.',
                    'The believable message history is stronger because it reflects a trusted context chain.',
                    'The safest move is to trust the page if at least two major trust signals look real.'
                ],
                answer: 0,
                explanation: 'When trust cues conflict, the requested action and whether it fits the stated task is one of the strongest signals.'
            },
            {
                topic: 'Technical versus behavioral cues',
                prompt: 'A link resolves normally, uses a familiar login framework, and does not look obviously fake, yet the message insists you must act before discussing it with anyone. What should you prioritize?',
                options: [
                    'The normal technical behavior because phishing usually fails on visible technical checks.',
                    'The secrecy pressure because manipulation can outweigh normal-looking technical signals.',
                    'The familiar framework because attackers avoid copying enterprise login experiences.',
                    'The DNS behavior because a reachable site is less risky than a broken destination.'
                ],
                answer: 1,
                explanation: 'Advanced phishing can look technically normal. Behavioral manipulation like secrecy and isolation is still a major warning sign.'
            },
            {
                topic: 'Conflicting endorsement',
                prompt: 'A coworker says the page seems fine, but your checks reveal an unusual permission request and inconsistent support address. What is the best conclusion?',
                options: [
                    'The coworker approval should outweigh the smaller inconsistencies you noticed.',
                    'The page is probably safe because the coworker would have noticed bigger issues.',
                    'The support mismatch and permission problem still justify verification before action.',
                    'The page is safe enough to test if you avoid entering your password at first.'
                ],
                answer: 2,
                explanation: 'A colleague opinion should not override concrete warning signs like mismatched support details or unnecessary permissions.'
            },
            {
                topic: 'Decision under uncertainty',
                prompt: 'You cannot prove the request is malicious, but several moderate concerns remain and the requested action could expose account access if wrong. What is the best decision rule?',
                options: [
                    'Proceed carefully because uncertain cases should be treated as legitimate by default.',
                    'Delay the action and verify through a trusted path when the impact could be high.',
                    'Use a less important account first because low-privilege testing is more efficient.',
                    'Continue if the request includes enough real organizational detail to feel grounded.'
                ],
                answer: 1,
                explanation: 'When uncertainty remains and the downside is serious, verification before action is the safer rule.'
            },
            {
                topic: 'Hardest judgment call',
                prompt: 'Which situation is most likely to fool careful users and therefore deserves the slowest, most deliberate review?',
                options: [
                    'A plain message with spelling errors asking for a password through a short link.',
                    'A realistic request combining true context, real infrastructure, and one subtle mismatch.',
                    'An obvious fake page using poor layout, a strange domain, and a lockout threat.',
                    'A generic alert with no internal detail, no clear sender, and no follow-up pressure.'
                ],
                answer: 1,
                explanation: 'The hardest cases are the ones that mix real context and legitimate-looking infrastructure with only one or two subtle mismatches.'
            }
        ]
    },
    'zero-trust-breakpoints': {
        title: 'Zero-Trust Breakpoints',
        description: 'Judge access requests that exploit trusted workflows, shared tenants, and internal policy gaps.',
        questions: [
            {
                topic: 'Conditional access bait',
                prompt: 'A message says a shared tenant policy blocked your usual access, so you must approve a temporary exception through a linked sign-in flow. Which clue deserves the most attention?',
                options: [
                    'The request is asking you to weaken a security control through an untrusted path.',
                    'The tenant language sounds technical enough to match a real access platform.',
                    'The message references a real project workspace you used earlier this week.',
                    'The sign-in prompt appears inside a familiar browser-based identity screen.'
                ],
                answer: 0,
                explanation: 'The highest-risk detail is the attempt to bypass a control through a message-driven workflow instead of a trusted admin path.'
            },
            {
                topic: 'Shared workspace abuse',
                prompt: 'A collaborator says a protected folder cannot be opened until you re-accept a trust relationship for the workspace. What is the safest interpretation first?',
                options: [
                    'A shared workspace problem is being turned into a request for new trust you did not initiate.',
                    'The collaboration platform probably refreshed its internal trust agreements overnight.',
                    'The folder owner likely changed a setting that now requires everyone to rejoin manually.',
                    'The safest move is to continue if the folder name and team labels still look correct.'
                ],
                answer: 0,
                explanation: 'Attackers often reframe a normal workspace issue into a fake trust or access ceremony that collects sensitive actions.'
            },
            {
                topic: 'Policy mismatch',
                prompt: 'An access page asks for approval because "zero-trust is causing friction," yet your organization normally routes those requests through a ticketed admin process. What should guide your decision?',
                options: [
                    'The familiar zero-trust wording because policy changes often create temporary workarounds.',
                    'The usual internal process because attackers rely on exceptions that skip the real workflow.',
                    'The urgency of the blocked task because business impact should outweigh process delays.',
                    'The legitimacy of the interface because phishing pages rarely mimic enterprise access tools well.'
                ],
                answer: 1,
                explanation: 'When the request contradicts the known internal process, the process mismatch matters more than polished security language.'
            },
            {
                topic: 'Scope escalation',
                prompt: 'A one-time exception page says it will only restore one blocked file, but the permission request would grant broad directory access. What is the strongest conclusion?',
                options: [
                    'The broad permission suggests the action does not match the narrow business reason being offered.',
                    'The platform may need a wider grant temporarily before it narrows access after synchronization.',
                    'The request is probably standard because enterprise tools often present broad labels for simple tasks.',
                    'The mismatch is acceptable if the request expires automatically at the end of the session.'
                ],
                answer: 0,
                explanation: 'A narrow stated purpose paired with a broad permission grant is a classic mismatch that should trigger verification.'
            },
            {
                topic: 'Best expert response',
                prompt: 'Which response best handles a sophisticated zero-trust themed phishing attempt without creating more risk?',
                options: [
                    'Verify the block through the real admin route and refuse message-driven exception links.',
                    'Use the exception flow once, then revoke the access if the result feels suspicious later.',
                    'Ask the sender to shorten the process so the emergency work can resume more quickly.',
                    'Approve the request from a low-privilege account first to limit any possible damage.'
                ],
                answer: 0,
                explanation: 'The safest move is to confirm the issue through the real administrative route instead of using a link supplied inside the message.'
            }
        ]
    },
    'live-session-hijacks': {
        title: 'Live Session Hijacks',
        description: 'Analyze real-time prompts, re-auth flows, and sign-in interruptions that steal active access.',
        questions: [
            {
                topic: 'Mid-session interruption',
                prompt: 'While already signed in, a page abruptly says your session risk changed and you must re-enter credentials before the current work can be saved. What matters most?',
                options: [
                    'A sudden re-auth demand during pressure is a common way to exploit an active session.',
                    'A live session warning is normal because risk engines constantly revise user trust levels.',
                    'The save pressure is acceptable when the message appears inside a known cloud platform.',
                    'The safest move is to comply if the screen keeps the same branding and tenant name.'
                ],
                answer: 0,
                explanation: 'Live-session hijacks often appear in moments of urgency and use continuity with the real session to lower suspicion.'
            },
            {
                topic: 'Prompt fatigue',
                prompt: 'A phone approval request appears seconds after a message tells you to expect a "security challenge" while reviewing a document. Which clue should carry the most weight?',
                options: [
                    'The pre-conditioning message may be trying to normalize an approval you did not start.',
                    'The close timing proves the document platform is connected correctly to your identity system.',
                    'The security challenge is more credible because it arrived through a separate device channel.',
                    'The request is probably harmless if the notification text contains your real email address.'
                ],
                answer: 0,
                explanation: 'Attackers often prepare the victim with a believable message so an unexpected approval prompt feels expected.'
            },
            {
                topic: 'Session continuity trap',
                prompt: 'A re-auth page returns you to the exact document view you were using right after sign-in. Why can that still be dangerous?',
                options: [
                    'Restoring the same context can be part of a relay flow built to hide the credential capture.',
                    'Returning to the same page confirms that the original sign-in interruption was legitimate.',
                    'The smooth restoration means the page is using the same backend session as the real service.',
                    'The safest move is to trust the flow because attackers usually cannot preserve session context.'
                ],
                answer: 0,
                explanation: 'A convincing phishing relay can return the user to the original context precisely to remove suspicion after the theft.'
            },
            {
                topic: 'Repeated challenge loop',
                prompt: 'A flow asks for password, then code, then another approval, even though the first challenge should have completed the login. What is the best conclusion?',
                options: [
                    'The flow may be harvesting several factors because the repeated challenges exceed the stated goal.',
                    'The platform is likely refreshing multiple security layers because the account has higher privileges.',
                    'The second approval probably exists because the first prompt did not sync across all devices yet.',
                    'The repeated requests are acceptable if each screen keeps the same logo and policy language.'
                ],
                answer: 0,
                explanation: 'Repeated factor collection beyond what the task should require is a strong sign of a multi-step hijack attempt.'
            },
            {
                topic: 'Best defensive move',
                prompt: 'Which response best disrupts a real-time session hijack once you notice the flow feels wrong?',
                options: [
                    'Close the flow, return through a trusted bookmark, and check recent sign-in activity directly.',
                    'Finish the current prompt quickly so you can inspect the account after the urgent task ends.',
                    'Reply to the sender and ask whether the second approval was expected before deciding further.',
                    'Switch to a private browser window and restart the same process to compare the screens again.'
                ],
                answer: 0,
                explanation: 'Breaking the live flow and checking the account from a trusted entry point is safer than continuing inside the attacker-controlled sequence.'
            }
        ]
    },
    'delegated-access-fraud': {
        title: 'Delegated Access Fraud',
        description: 'Review approval rights, shared accounts, and delegated permissions used to widen compromise.',
        questions: [
            {
                topic: 'Delegate request mismatch',
                prompt: 'A message claims a senior staff member temporarily delegated you access rights for a single review task, but the approval screen would let you act across several unrelated resources. What stands out?',
                options: [
                    'The permission scope is too broad for the small task being used to justify the request.',
                    'The request is more trustworthy because it comes from a higher-privilege delegated workflow.',
                    'The extra resources are probably bundled because the platform groups related approvals together.',
                    'The safest move is to proceed if the named staff member usually handles similar access reviews.'
                ],
                answer: 0,
                explanation: 'A small stated purpose should not require a broad delegation grant across unrelated resources.'
            },
            {
                topic: 'Shared mailbox abuse',
                prompt: 'A shared mailbox notice asks you to reconnect access by approving a link from another team because the owner is currently unavailable. What is the best first reading?',
                options: [
                    'The request is using shared ownership to reduce accountability for a risky approval step.',
                    'The mailbox owner probably set an emergency fallback that now routes through a nearby team.',
                    'The access issue is likely legitimate because shared inboxes often break during staff absences.',
                    'The reconnection is safe enough if the notice includes the correct display name and alias.'
                ],
                answer: 0,
                explanation: 'Shared resources are useful phishing cover because responsibility feels blurred and no single owner is immediately confirming the action.'
            },
            {
                topic: 'Approval relay',
                prompt: 'One coworker asks you to approve on behalf of another because they are in a meeting, and the linked page already shows the target account preselected. Why is that risky?',
                options: [
                    'The preselected target can mask a permission handoff you did not independently verify.',
                    'The coworker is helping reduce delay by routing the approval through someone available.',
                    'The prefilled account proves the underlying delegation workflow is already authenticated.',
                    'The action is low risk because the requester is only trying to save time during a meeting.'
                ],
                answer: 0,
                explanation: 'Preselected targets and time-saving pressure can hide the fact that the approval path was never independently confirmed.'
            },
            {
                topic: 'Delegation versus impersonation',
                prompt: 'A request insists it is not asking for credentials, only for delegated approval to "speed up handling." What should you remember?',
                options: [
                    'Delegated approvals can be just as dangerous as credential theft when they expand attacker reach.',
                    'Approvals are safer than passwords because delegated actions remain tied to your real identity.',
                    'The request is lower risk because it avoids collecting any secret or one-time verification code.',
                    'Delegated access is acceptable when the message explains how the business delay would be resolved.'
                ],
                answer: 0,
                explanation: 'Attackers do not always need passwords directly if they can trick someone into granting access or acting on their behalf.'
            },
            {
                topic: 'Best escalation path',
                prompt: 'Which response is strongest when a delegation-themed request seems plausible but the approval scope feels wider than expected?',
                options: [
                    'Confirm the business need with the true owner and use the official approval route only.',
                    'Approve it once, then ask the owner to review the delegation history after the task ends.',
                    'Reject the current link but ask the same sender to issue a shorter and simpler request instead.',
                    'Use a secondary account first so the delegated workflow cannot affect your main workspace.'
                ],
                answer: 0,
                explanation: 'A direct confirmation with the true owner and the official workflow is safer than negotiating inside the suspicious request chain.'
            }
        ]
    },
    'forensic-cover-stories': {
        title: 'Forensic Cover Stories',
        description: 'Break down fake investigation trails, evidence requests, and incident narratives meant to disarm checks.',
        questions: [
            {
                topic: 'Investigation framing',
                prompt: 'A message says an internal forensic review found traces connected to your account, so you must upload logs and verify your sign-in details through a secure case portal. What is the strongest warning sign?',
                options: [
                    'The incident story is being used to justify a portal that requests information through an unverified route.',
                    'The forensic terminology makes the request more credible because it sounds specific and technical.',
                    'The secure case portal is likely legitimate because investigations usually centralize evidence gathering.',
                    'The message is safer if it includes dates, timestamps, and references to recent activity patterns.'
                ],
                answer: 0,
                explanation: 'A detailed investigation narrative can still be phishing if it funnels you into an untrusted collection portal.'
            },
            {
                topic: 'Evidence urgency',
                prompt: 'A supposed response lead says evidence must be preserved immediately, so you should not contact local support until after you submit the requested material. Why is that dangerous?',
                options: [
                    'The isolation rule tries to keep you inside the attacker narrative and away from trusted verification.',
                    'Evidence collection often requires secrecy because too many teams could overwrite useful traces.',
                    'Local support is probably excluded because the case belongs to a higher and more specialized team.',
                    'The preservation urgency is acceptable if the response lead uses the correct department naming style.'
                ],
                answer: 0,
                explanation: 'A request that blocks independent verification is a major warning sign even when it uses incident-response language.'
            },
            {
                topic: 'Attachment credibility',
                prompt: 'An attachment contains believable screenshots of login history and claims they prove compromise, but the next step is a linked revalidation form. What should drive your decision?',
                options: [
                    'The demanded action matters more because convincing evidence can be staged to force a bad next step.',
                    'The screenshots make the compromise story stronger because attackers rarely include usable proof.',
                    'The form is probably legitimate if the evidence file uses real dates and recognizable account fields.',
                    'The response should depend on whether the screenshots look recent and technically consistent enough.'
                ],
                answer: 0,
                explanation: 'A believable evidence package can still be bait if it leads to a credential or approval trap.'
            },
            {
                topic: 'Case portal mismatch',
                prompt: 'A case page asks for file uploads, account confirmation, and a backup contact method, even though the message claimed the investigation was only about one suspicious sign-in. What does that suggest?',
                options: [
                    'The portal is collecting broader access than the stated incident scope reasonably requires.',
                    'The investigation is probably expanding because response teams often gather everything at once.',
                    'The backup contact field is harmless because investigations need multiple communication options.',
                    'The portal is normal if the page explains each field with formal incident-handling language.'
                ],
                answer: 0,
                explanation: 'When the requested data expands beyond the described incident scope, the portal may be harvesting information rather than investigating.'
            },
            {
                topic: 'Safest expert habit',
                prompt: 'Which habit best protects you from a well-written forensic cover story that feels specific and urgent?',
                options: [
                    'Initiate contact with the real security team through a known channel before sharing anything.',
                    'Review the evidence carefully first because technical detail is the clearest trust signal.',
                    'Comply with the first step only, then decide whether the later requests still feel suspicious.',
                    'Wait for a second message because genuine investigations usually send several official reminders.'
                ],
                answer: 0,
                explanation: 'Independent contact through a known security channel is safer than trusting the case narrative or the collection portal inside the message.'
            }
        ]
    },
    'approval-chain-poisoning': {
        title: 'Approval Chain Poisoning',
        description: 'Test requests that abuse escalations, sign-off loops, and layered approvals to seem legitimate.',
        questions: [
            {
                topic: 'Layered endorsement',
                prompt: 'An approval request appears to include notes from finance, procurement, and operations, all nudging you toward the same linked confirmation page. What is the best interpretation?',
                options: [
                    'Several endorsements can be staged together to create false legitimacy around one risky action.',
                    'Cross-team notes make the request safer because multiple departments would catch a fake process.',
                    'The request is probably legitimate because attackers usually do not imitate several teams at once.',
                    'The page is acceptable if the listed teams match the kind of purchase being discussed there.'
                ],
                answer: 0,
                explanation: 'A chain of endorsements can be part of the deception rather than proof that the request is real.'
            },
            {
                topic: 'Sign-off fatigue',
                prompt: 'A thread says only one final sign-off remains, and that sign-off requires you to authenticate through a special approval portal outside the normal workflow. What should concern you most?',
                options: [
                    'The last-step framing is being used to push a new authentication path outside the normal process.',
                    'The final sign-off is naturally more sensitive and often uses a more secure external approval page.',
                    'The message is safer because it waits until the end of the process before asking for confirmation.',
                    'The portal is probably valid if the approval references previous real steps from the same project.'
                ],
                answer: 0,
                explanation: 'Attackers often wait until the process feels nearly complete before inserting the malicious approval step.'
            },
            {
                topic: 'Approval chain mismatch',
                prompt: 'A request claims all earlier approvers already cleared it, but none of the referenced approval IDs can be found in the actual system. What does that indicate?',
                options: [
                    'The request may be borrowing the language of governance while bypassing the real approval records.',
                    'The IDs probably disappeared because completed approvals are archived before the last sign-off.',
                    'The process is still safe because the human approver names match people from the real departments.',
                    'The missing IDs matter less if the request still explains the business reason in full detail.'
                ],
                answer: 0,
                explanation: 'When a request cites a process trail that cannot be verified in the actual system, the approval story itself becomes unreliable.'
            },
            {
                topic: 'Escalation pressure',
                prompt: 'A note warns that rejecting the current link will restart the full chain and delay an urgent deadline for several teams. Why is that effective phishing pressure?',
                options: [
                    'It turns process cost and team inconvenience into leverage for unsafe approval behavior.',
                    'It proves the approval chain is real because only real workflows create multi-team disruption.',
                    'It reduces suspicion because the sender is transparent about the consequences of a rejection.',
                    'It makes the request lower risk because attackers rarely understand internal process bottlenecks.'
                ],
                answer: 0,
                explanation: 'Phishing often weaponizes delay, inconvenience, and fear of blocking others to push risky approval actions.'
            },
            {
                topic: 'Strongest response',
                prompt: 'Which response best handles a poisoned approval chain when the process details feel partly real but the final action path is off?',
                options: [
                    'Pause the chain and verify it inside the real approval system before acting on any link.',
                    'Approve the request if only the last screen seems unusual and the earlier details still match.',
                    'Ask the sender to move the same approval link into a fresh thread with cleaner formatting.',
                    'Wait for a senior approver to remind you again because that would make the final step clearer.'
                ],
                answer: 0,
                explanation: 'Verification should happen inside the real approval system, not inside the suspicious chain that is asking for the action.'
            }
        ]
    },
    'adaptive-impersonation-loops': {
        title: 'Adaptive Impersonation Loops',
        description: 'Handle attackers who change tone, role, and pressure as your skepticism starts to rise.',
        questions: [
            {
                topic: 'Role shifting',
                prompt: 'A sender starts as support, then follows up as compliance, then later writes as a manager forwarding the same issue. What should you infer first?',
                options: [
                    'The changing roles may be an adaptive script designed to overcome each layer of your skepticism.',
                    'Several teams are probably involved because the issue has become more serious over time.',
                    'The thread is more trustworthy because each new role adds another independent perspective.',
                    'The escalation is normal if each message keeps the same ticket reference and department tone.'
                ],
                answer: 0,
                explanation: 'Adaptive impersonation often changes the messenger when the original story fails to secure compliance.'
            },
            {
                topic: 'Tone adjustment',
                prompt: 'After you ignore the first urgent message, the next one becomes calmer, more detailed, and more respectful while asking for the same risky action. Why is that still suspicious?',
                options: [
                    'The calmer tone may be a refinement tactic, not proof that the underlying request is safer.',
                    'The better wording shows the earlier message was just poorly written by a legitimate sender.',
                    'The respectful follow-up is more credible because attackers usually stay aggressive throughout.',
                    'The request is safer if the second message includes additional business context and courtesy.'
                ],
                answer: 0,
                explanation: 'Attackers adjust tone when urgency fails, but the risky destination or action often remains unchanged.'
            },
            {
                topic: 'Feedback exploitation',
                prompt: 'You ask one clarifying question, and the next reply directly addresses that concern while steering you back to the same approval page. What is the key lesson?',
                options: [
                    'A responsive answer can still be scripted to remove friction without changing the actual threat.',
                    'The specific reply proves the sender has real knowledge of the workflow and should be trusted.',
                    'The page is now safer because the concern was answered before any credentials were requested.',
                    'The exchange becomes legitimate once the sender adapts the explanation to your exact question.'
                ],
                answer: 0,
                explanation: 'Good phishing adapts to your questions precisely so you feel heard while still moving toward the attacker goal.'
            },
            {
                topic: 'Multi-channel persistence',
                prompt: 'The same issue appears by email, then chat, then text, each time with a slightly different explanation but the same final link. What should matter most?',
                options: [
                    'The repeated destination matters more than the changing explanations across channels.',
                    'The multi-channel follow-up confirms the issue because real teams use every path when urgent.',
                    'The different wording lowers risk because attackers normally reuse identical language each time.',
                    'The safest move is to trust the channel that sounds the most formal and internally specific.'
                ],
                answer: 0,
                explanation: 'Changing explanations do not make the request safer when every version points back to the same risky destination.'
            },
            {
                topic: 'Best expert defense',
                prompt: 'Which habit most reliably defeats adaptive impersonation once the attacker starts changing style to match your reactions?',
                options: [
                    'Judge the requested action by trusted process and destination, not by the sender’s changing tone.',
                    'Keep asking more questions until the attacker eventually gives an obviously inconsistent answer.',
                    'Wait for the most senior identity used in the chain before deciding how much to trust it.',
                    'Continue the conversation from one channel only so the sender cannot vary the message format.'
                ],
                answer: 0,
                explanation: 'The safest anchor is the trusted process and destination, because tone and role can be adjusted to fit your reactions.'
            }
        ]
    },
    'supply-chain-shadowing': {
        title: 'Supply Chain Shadowing',
        description: 'Assess partner-linked requests that piggyback on real vendors, invoices, and workflow timing.',
        questions: [
            {
                topic: 'Vendor familiarity trap',
                prompt: 'A request references a real supplier, correct invoice style, and a believable renewal window, but the approval link routes through a new partner portal nobody mentioned before. What matters most?',
                options: [
                    'The new portal matters most because the risky action path changed even if the business details stayed real.',
                    'The real supplier context should outweigh the portal change because attackers rarely match invoice timing so closely.',
                    'The renewal window makes the request safer because vendor phishing usually arrives outside normal contract cycles.',
                    'The invoice style is the strongest signal because copied branding is harder than building a fake portal quickly.'
                ],
                answer: 0,
                explanation: 'The business context can be real while the action path is still attacker-controlled, so the new portal deserves the most scrutiny.'
            },
            {
                topic: 'Shadow process',
                prompt: 'A procurement contact says finance now wants confirmations through a supplier-side portal instead of the internal workflow to reduce delays. What is the safest reading?',
                options: [
                    'A parallel approval path may be a shadow process designed to bypass your known verification controls.',
                    'A supplier-side portal is more trustworthy because it sits closer to the billing and fulfillment records.',
                    'The process is likely real because cross-company workflows often replace slower internal approval systems.',
                    'The request is acceptable if the portal uses HTTPS and includes the supplier branding you expect there.'
                ],
                answer: 0,
                explanation: 'The biggest risk is the attempt to move you off the known workflow into a new approval path justified by convenience.'
            },
            {
                topic: 'Thread inheritance',
                prompt: 'An invoice follow-up appears inside a thread that previously contained legitimate vendor discussions, but the newest message changes the destination for document review. What should guide your decision?',
                options: [
                    'The changed destination matters more because inherited trust from an older thread can be abused.',
                    'The older legitimate discussion should dominate because attackers usually start completely fresh threads instead.',
                    'The mixed thread is probably safe because it contains enough historic context to reveal any obvious mismatch.',
                    'The destination change is low risk if the requester keeps the same tone and project details as earlier there.'
                ],
                answer: 0,
                explanation: 'Old thread context can be repurposed to lower suspicion, so a changed destination still needs independent verification.'
            },
            {
                topic: 'Supplier urgency framing',
                prompt: 'A vendor warning says shipment timing will slip unless you complete a portal verification today, yet the requested access would expose more than the shipment status. What is the strongest conclusion?',
                options: [
                    'The narrow shipping issue is being used to justify broader access than the stated need supports.',
                    'The broader access may be standard because logistics and billing systems often connect behind one portal.',
                    'The same-day pressure proves the supplier is dealing with a live operational issue rather than phishing.',
                    'The safest move is to continue if the shipment number and project code both match your records there.'
                ],
                answer: 0,
                explanation: 'A small operational issue should not require a broad grant of access or identity confirmation beyond the stated purpose.'
            },
            {
                topic: 'Best pro response',
                prompt: 'Which response best handles a supply-chain themed phishing case when the partner and timing both look convincing?',
                options: [
                    'Verify the request through the known internal owner or saved supplier contact before using any new portal.',
                    'Use the portal once, then compare the invoice details afterward if anything feels inconsistent later.',
                    'Reply inside the same thread and continue if the sender repeats the same invoice references correctly.',
                    'Proceed from a less important workstation first because vendor-facing workflows usually involve lower account risk.'
                ],
                answer: 0,
                explanation: 'The safest move is to verify the action through a trusted owner or saved supplier contact rather than the new portal in the message.'
            }
        ]
    },
    'federated-login-pivots': {
        title: 'Federated Login Pivots',
        description: 'Judge identity hops that move across SSO, tenants, and app handoffs to hide the real risk.',
        questions: [
            {
                topic: 'SSO handoff mismatch',
                prompt: 'A page begins with a normal SSO screen, then hands you to a second tenant-branded prompt asking for extra confirmation beyond the original app login. What should stand out?',
                options: [
                    'The second identity hop may be a pivot that extends the flow beyond the original sign-in purpose.',
                    'A second tenant prompt is safer because federated systems often split trust decisions across providers.',
                    'The flow is probably normal because enterprise apps rarely work through a single identity step only.',
                    'The extra confirmation is expected if the second prompt still shows your correct organization domain.'
                ],
                answer: 0,
                explanation: 'The danger is the extra identity pivot that asks for more trust than the original app access should require.'
            },
            {
                topic: 'Tenant confusion',
                prompt: 'A collaborator invite lands you in a real cloud service, but the sign-in flow quietly switches to an unfamiliar tenant before asking for approval. Why is that risky?',
                options: [
                    'The tenant switch can hide a trust transfer to a context you did not intend to authorize.',
                    'The unfamiliar tenant is normal because shared workspaces often borrow the owner’s identity domain.',
                    'The approval is safer because the service stayed inside the same cloud platform the whole time.',
                    'The switch is low risk if the app name and document title still match the original invitation.'
                ],
                answer: 0,
                explanation: 'A federated service can still be abused if the tenant context changes in a way that expands trust without clear justification.'
            },
            {
                topic: 'Prompt sequencing',
                prompt: 'A sign-in flow asks for account selection, then password, then tenant consent, then another password-like field labeled "reauthorization token." What is the best reading?',
                options: [
                    'The layered prompts may be using federated complexity to hide unnecessary credential collection.',
                    'The flow is likely secure because extra identity steps usually mean stronger protection was applied.',
                    'The token field is normal because federated apps often rename passwords for downstream providers.',
                    'The repeated prompts are acceptable if each screen uses polished branding and consistent typography.'
                ],
                answer: 0,
                explanation: 'Federated complexity can make users tolerate unnecessary prompts, which is exactly why attackers exploit it.'
            },
            {
                topic: 'App legitimacy versus action path',
                prompt: 'An invitation comes from a real app marketplace entry, but the final approval screen grants permissions to a differently named service principal. What should you trust least?',
                options: [
                    'The mismatch between the app you expected and the entity receiving consent at the end.',
                    'The marketplace listing because reputable app directories rarely include any risky integrations there.',
                    'The permission detail because legitimate apps often use internal service names that look unfamiliar.',
                    'The final consent step because it appears later than the original marketplace context and feels separate.'
                ],
                answer: 0,
                explanation: 'The receiving entity at the final approval step matters more than the reassuring entry point used to bring you there.'
            },
            {
                topic: 'Best pro response',
                prompt: 'Which response best disrupts a federated-login phishing case that hides behind real identity infrastructure?',
                options: [
                    'Restart from a trusted app entry point and verify tenant, app, and consent target before approving.',
                    'Proceed until the last consent screen so you can compare every identity hop in one continuous flow.',
                    'Approve the request if the first login screen was real because later pivots usually inherit that trust.',
                    'Use the flow from a guest browser session first because federated prompts are easier to isolate there.'
                ],
                answer: 0,
                explanation: 'A trusted entry point and careful verification of the tenant and consent target is safer than continuing inside a suspicious pivot chain.'
            }
        ]
    },
    'trust-graph-manipulation': {
        title: 'Trust Graph Manipulation',
        description: 'Read relationship-based attacks that misuse old contacts, overlapping teams, and shared history.',
        questions: [
            {
                topic: 'Relationship layering',
                prompt: 'A request does not come from your closest teammate, but from someone two relationships away who references shared people, projects, and past decisions accurately. What is the main risk?',
                options: [
                    'Accurate social context can be used to simulate trust even when the requester is outside your normal verification path.',
                    'A wider relationship chain is safer because several overlapping connections make impersonation much harder to sustain.',
                    'The request is likely legitimate because outsiders usually cannot map project and people details this precisely.',
                    'The shared context is enough to trust the request if the action stays inside tools your organization already uses.'
                ],
                answer: 0,
                explanation: 'The core risk is using real relationship data to lower suspicion while avoiding the direct trusted owner of the request.'
            },
            {
                topic: 'Borrowed familiarity',
                prompt: 'A sender references an old internal joke and prior meeting outcome before asking for a sensitive approval step. Why is that still dangerous?',
                options: [
                    'Personal familiarity can be borrowed to smooth over a request that still needs proper verification.',
                    'Shared personal context makes the request safer because attackers focus on technical detail instead of social memory.',
                    'The meeting reference proves the sender belongs to the actual group handling the approval in question.',
                    'The approval is lower risk if the message uses the same phrasing your team normally uses with each other.'
                ],
                answer: 0,
                explanation: 'Even genuine social familiarity does not replace the need to verify a risky action through the right process.'
            },
            {
                topic: 'Network overlap trap',
                prompt: 'A colleague from another department asks for help "because we both report into the same leadership chain" and sends a link to confirm a decision. What should guide you?',
                options: [
                    'Leadership overlap is weak trust evidence compared with the actual process behind the requested action.',
                    'The shared reporting line makes the request more legitimate because both teams answer to the same authority.',
                    'The link is probably safe because cross-department approvals often depend on loose organizational alignment.',
                    'The message is acceptable if it references the right leader names and the timing fits a real reporting cycle.'
                ],
                answer: 0,
                explanation: 'Organizational proximity is not the same as process legitimacy, especially when the request includes a risky link.'
            },
            {
                topic: 'Trust graph overload',
                prompt: 'A message stacks names of mutual contacts, related projects, and departmental dependencies until the request feels socially costly to question. What is happening?',
                options: [
                    'The sender may be using social density to discourage the exact verification the request still needs.',
                    'The request is safer because a dense network of mutual contacts naturally reduces the chance of deception.',
                    'The social detail is a sign of transparency because legitimate requests usually include all relationship context.',
                    'The message becomes low risk if you personally recognize at least half of the people mentioned there.'
                ],
                answer: 0,
                explanation: 'A dense trust graph can make skepticism feel impolite, which is exactly why it is effective in social-engineering attacks.'
            },
            {
                topic: 'Best pro defense',
                prompt: 'Which habit best defeats relationship-heavy phishing when the social context is detailed and believable?',
                options: [
                    'Route the request back to the true owner or system of record instead of trusting the relationship map itself.',
                    'Ask one mutual contact for their opinion and proceed if they say the sender is probably legitimate.',
                    'Judge the request mostly by how much shared history and cross-team detail the message can reproduce there.',
                    'Continue if the request avoids asking for a password and only asks for one small confirmation action.'
                ],
                answer: 0,
                explanation: 'The most reliable defense is to move the action back to the real owner or system of record rather than trusting social proximity.'
            }
        ]
    },
    'incident-command-spoofs': {
        title: 'Incident Command Spoofs',
        description: 'Handle crisis-style requests that imitate coordinated response teams, war rooms, and live escalation.',
        questions: [
            {
                topic: 'War-room authority',
                prompt: 'A crisis thread claims an active war room already validated the issue and now needs your quick confirmation through a side portal to keep containment moving. Which clue matters most?',
                options: [
                    'The side portal matters most because urgent command language can be used to bypass the real incident workflow.',
                    'The war-room wording makes the request more credible because only real response teams use that coordination style.',
                    'The containment urgency lowers risk because response teams must move faster than ordinary approval processes.',
                    'The thread is likely safe if several incident roles are named consistently across the escalation messages there.'
                ],
                answer: 0,
                explanation: 'Command language can be copied, but a new action path outside the trusted workflow is still a strong warning sign.'
            },
            {
                topic: 'Containment theater',
                prompt: 'A responder tells you a system cannot be isolated until you sign in and acknowledge a live mitigation plan from a link they sent privately. Why is that risky?',
                options: [
                    'The private sign-in request turns operational urgency into leverage for a suspicious access step.',
                    'The private link is safer because responders often move sensitive containment work away from public channels.',
                    'The mitigation plan is likely legitimate because incident responders need acknowledgements from several owners quickly.',
                    'The sign-in is acceptable if the link arrives after a public thread already described the same incident there.'
                ],
                answer: 0,
                explanation: 'A private sign-in step tied to containment pressure is a strong sign that the urgency is being weaponized.'
            },
            {
                topic: 'Role choreography',
                prompt: 'One person frames the threat, another confirms urgency, and a third sends the action link. What is the best conclusion?',
                options: [
                    'The role choreography may be staged to make the final link feel independently validated.',
                    'The three-role pattern is safer because incident response naturally splits duties across different specialists.',
                    'The action link is more trustworthy because it was not sent by the person who raised the original alarm.',
                    'The sequence is low risk if each participant uses the correct terminology for their supposed incident role.'
                ],
                answer: 0,
                explanation: 'Splitting the story across several roles can create false consensus around the one step the attacker wants you to take.'
            },
            {
                topic: 'Command override',
                prompt: 'A message says standard approval gates are suspended during the incident and only the command link should be used for immediate action. What should you remember?',
                options: [
                    'Crisis language is often used to justify bypassing the very controls that would expose the phish.',
                    'Approval suspension is normal because emergencies always replace formal controls with faster manual paths.',
                    'The command link is probably legitimate if it arrives after an alert that mentioned real impacted systems.',
                    'The request becomes safer when it explicitly admits that normal controls are being skipped there.'
                ],
                answer: 0,
                explanation: 'Attackers frequently claim normal rules are suspended because verification steps are exactly what they want removed.'
            },
            {
                topic: 'Best pro response',
                prompt: 'Which response best handles a convincing incident-command spoof when the scenario feels high stakes and time pressured?',
                options: [
                    'Verify the incident through the known response channel and use only the established command workflow.',
                    'Complete the first requested action quickly so the response team can keep moving, then verify later.',
                    'Reply in-thread and ask for one more sign of legitimacy before deciding whether to use the link there.',
                    'Follow the command link if the message names systems that are genuinely important to your environment.'
                ],
                answer: 0,
                explanation: 'The safest path is to anchor on the known response channel and trusted workflow rather than the urgent link in the message.'
            }
        ]
    },
    'recovery-delegation-loops': {
        title: 'Recovery Delegation Loops',
        description: 'Analyze chained recovery requests that mix approval handoffs, resets, and identity verification.',
        questions: [
            {
                topic: 'Recovery handoff',
                prompt: 'A recovery request starts with a locked-account warning, then shifts into a delegated approval flow because the owner is supposedly unavailable. What is the main danger?',
                options: [
                    'The recovery story may be a pretext for shifting control to someone who was never meant to authorize it.',
                    'The delegated step is safer because unavailable owners often need trusted backups to restore access quickly.',
                    'The handoff is probably legitimate because recovery processes commonly change path when the primary user is absent.',
                    'The request is low risk if the owner name, account alias, and recovery deadline all match known records there.'
                ],
                answer: 0,
                explanation: 'Changing from recovery into delegated approval can quietly expand the attack from account restoration into unauthorized access transfer.'
            },
            {
                topic: 'Looped verification',
                prompt: 'A flow says the first recovery attempt failed, so you must confirm identity again through a second page sent by another team. What should stand out?',
                options: [
                    'The second page may be using failure as a reason to collect another layer of trust or access.',
                    'The second team makes the recovery safer because independent verification reduces the chance of error.',
                    'The repeat check is normal because recovery systems often escalate to manual review after one failed step.',
                    'The extra page is acceptable if it arrives quickly and reuses the same case number from the first notice.'
                ],
                answer: 0,
                explanation: 'Attackers often turn a supposed failed recovery into justification for another credential or approval collection step.'
            },
            {
                topic: 'Owner absence pressure',
                prompt: 'A message says the real owner cannot respond soon enough, so a backup approver must finish the recovery chain today. Why is that effective phishing pressure?',
                options: [
                    'It uses urgency plus unavailable ownership to make unsafe delegation feel like the only practical option.',
                    'It proves the recovery is legitimate because urgent access restoration always requires alternate approvers.',
                    'The backup approver path is safer because it keeps the business moving despite temporary user absence.',
                    'The request is more trustworthy if the message names the owner, backup, and expected downtime impact there.'
                ],
                answer: 0,
                explanation: 'Unavailable ownership is powerful pressure because it makes bypassing direct verification seem unavoidable.'
            },
            {
                topic: 'Recovery scope drift',
                prompt: 'A reset request that began with mailbox access now asks you to approve identity updates affecting several linked services. What is the strongest conclusion?',
                options: [
                    'The scope has drifted beyond recovery into a broader takeover path that needs to be questioned.',
                    'The wider service impact is normal because modern recovery systems unify several accounts in one flow.',
                    'The approval remains safe because linked-service updates are just part of a complete reset operation.',
                    'The request is acceptable if every service listed belongs to the same general organization environment.'
                ],
                answer: 0,
                explanation: 'When a narrow recovery case expands into broad identity changes, the request may be moving toward full takeover rather than simple restoration.'
            },
            {
                topic: 'Best pro defense',
                prompt: 'Which habit best breaks a sophisticated recovery-delegation loop before it turns into an account takeover?',
                options: [
                    'Reconfirm the case through the official recovery channel and verify the true owner before any approval.',
                    'Complete the minimum recovery step first so the locked user can regain access and sort details later.',
                    'Use the delegated path only if the requester avoids asking for passwords or one-time codes directly.',
                    'Wait for one more escalation message because legitimate recoveries usually grow clearer over time.'
                ],
                answer: 0,
                explanation: 'The strongest defense is to re-anchor the case in the official recovery channel and verify the true owner before approving anything.'
            }
        ]
    },
    'environment-poisoning-cases': {
        title: 'Environment Poisoning Cases',
        description: 'Break down scenarios where settings, tools, and context are subtly altered before the phish lands.',
        questions: [
            {
                topic: 'Context shaping',
                prompt: 'You notice a message feels unusually believable because recent settings, notifications, and app behavior all seem to support it. What is the expert concern?',
                options: [
                    'The environment itself may have been shaped first so the later phishing step feels more natural.',
                    'The consistency across tools proves the message is part of a legitimate coordinated workflow there.',
                    'The message is safer because attackers usually cannot influence enough surrounding context to feel realistic.',
                    'The supporting signals matter more than the link destination because context is harder to fake than pages.'
                ],
                answer: 0,
                explanation: 'Advanced attacks can alter or exploit surrounding context so the final phish appears to fit what the user is already seeing.'
            },
            {
                topic: 'Notification pollution',
                prompt: 'A suspicious approval request arrives shortly after several real notifications trained you to expect urgent admin prompts that day. Why is that dangerous?',
                options: [
                    'The real notifications may have primed you to accept a malicious prompt without the usual scrutiny.',
                    'The sequence is safer because malicious prompts rarely appear close to real administrative notifications.',
                    'The admin timing proves the approval request belongs to the same genuine maintenance event there.',
                    'The prompt is lower risk if its wording is slightly different from the earlier notifications you saw.'
                ],
                answer: 0,
                explanation: 'Priming through surrounding notifications can reduce skepticism and make a malicious prompt blend into the day’s expected noise.'
            },
            {
                topic: 'Tool familiarity weaponized',
                prompt: 'A fake page does not invent a new workflow, it only nudges you to use a familiar internal tool in a slightly different way than normal. What should you notice?',
                options: [
                    'A small deviation inside a trusted tool can be more dangerous than a completely unfamiliar page.',
                    'A familiar tool is safer because attackers usually need new websites to capture credentials effectively.',
                    'The workflow change is acceptable if the tool branding and navigation still match the real interface.',
                    'The request is probably legitimate because subtle changes usually come from product updates rather than phishing.'
                ],
                answer: 0,
                explanation: 'Minor deviations inside familiar tools are powerful because users often relax their scrutiny when the environment looks routine.'
            },
            {
                topic: 'Sequence poisoning',
                prompt: 'A message makes sense only because several earlier small events nudged you toward one expected action. What is the key lesson?',
                options: [
                    'Phishing can be designed as a sequence of setup steps rather than one obviously malicious message.',
                    'The sequence proves legitimacy because coordinated events are difficult for attackers to align correctly.',
                    'The final request is safe if each earlier event looked harmless enough on its own before the message.',
                    'The setup pattern matters less than whether the final page uses HTTPS and proper organizational colors.'
                ],
                answer: 0,
                explanation: 'Some attacks work by shaping expectations gradually, so judging only the final message can miss the broader manipulation.'
            },
            {
                topic: 'Best pro response',
                prompt: 'Which response best handles a case where the surrounding environment itself may be helping the phish feel legitimate?',
                options: [
                    'Step out of the current sequence and verify the request from a clean, trusted starting point.',
                    'Continue carefully because environmental consistency usually means the request belongs to a real workflow.',
                    'Focus only on the last message because earlier context is too indirect to matter in the decision there.',
                    'Use the same path one more time later to see whether the environment still pushes you to the same action.'
                ],
                answer: 0,
                explanation: 'The safest move is to break out of the manipulated sequence and verify the action from a trusted independent starting point.'
            }
        ]
    },
    'cross-tenant-bleedthrough': {
        title: 'Cross-Tenant Bleedthrough',
        description: 'Judge ultra-subtle tenant confusion cases where trust leaks between real shared environments.',
        questions: [
            {
                topic: 'Shared boundary leak',
                prompt: 'A workflow stays inside real cloud infrastructure, but one approval quietly grants trust to an adjacent tenant that only partially overlaps with the intended workspace. What is the key danger?',
                options: [
                    'A small tenant boundary shift can transfer trust farther than the business task ever required.',
                    'A partially overlapping tenant is safer because shared infrastructure naturally reduces identity mismatch.',
                    'The grant is probably legitimate because adjacent tenants often support one collaborative workstream.',
                    'The approval is low risk if the destination still belongs to the same broad vendor ecosystem.'
                ],
                answer: 0,
                explanation: 'The subtle shift in trust boundary matters more than the familiar infrastructure around it.'
            },
            {
                topic: 'Trust bleed',
                prompt: 'A user thinks they are restoring access to one shared app, but the consent chain also exposes profile and directory context to another tenant-controlled object. What should guide the decision?',
                options: [
                    'The extra trust target matters because mixed boundaries can hide a much broader exposure path.',
                    'The access is acceptable because federated systems often bundle profile context with shared app login.',
                    'The chain is safe if the app title and branding still match the original collaboration request.',
                    'The directory exposure is harmless because it only appears after a legitimate app handoff there.'
                ],
                answer: 0,
                explanation: 'When several trust targets are bundled into one flow, the least expected one often signals the real risk.'
            },
            {
                topic: 'Near-correct environment',
                prompt: 'Everything looks right except one environment detail feels slightly off, and the requested action would be high impact if mis-scoped. What is the safest rule?',
                options: [
                    'Treat a near-correct environment as high risk when one wrong boundary could expand access significantly.',
                    'Proceed because near-correct environments usually reflect harmless admin variation rather than active abuse.',
                    'Continue if the task urgency seems real enough to justify resolving the subtle mismatch later.',
                    'Trust the flow if at least two technical indicators still confirm the core service is authentic there.'
                ],
                answer: 0,
                explanation: 'A small environment mismatch can matter enormously when the action affects trust boundaries.'
            },
            {
                topic: 'Collaboration mirage',
                prompt: 'An invite relies on real cross-organization collaboration patterns, but the final trust grant lands just beyond the minimum needed scope. What should you conclude?',
                options: [
                    'Real collaboration context can still be used to normalize a trust grant that exceeds the actual need.',
                    'The grant is legitimate because real collaboration always needs extra trust for future flexibility there.',
                    'The flow is safer because attackers usually avoid nuanced cross-organization context this deep.',
                    'The scope drift matters less if the invite references a real project and a believable document title.'
                ],
                answer: 0,
                explanation: 'A believable collaboration story does not justify trust that exceeds the specific business need.'
            },
            {
                topic: 'Legend response',
                prompt: 'Which response best handles a suspected cross-tenant bleedthrough without relying on surface familiarity?',
                options: [
                    'Verify the exact tenant, target object, and minimum scope from a trusted admin or saved entry point.',
                    'Approve the request once, then inspect the tenant relationship afterward if nothing obviously breaks.',
                    'Continue if the platform remains inside a genuine provider ecosystem and avoids asking for passwords.',
                    'Ask the sender to simplify the consent language so the cross-tenant flow becomes easier to read.'
                ],
                answer: 0,
                explanation: 'The right defense is to validate the exact trust target and scope from a trusted path before approving.'
            }
        ]
    },
    'response-playbook-subversion': {
        title: 'Response Playbook Subversion',
        description: 'Break down attacks that twist familiar containment and recovery playbooks against the defender.',
        questions: [
            {
                topic: 'Playbook inversion',
                prompt: 'A message borrows the exact language of your incident playbook, but the requested action subtly skips the verification checkpoint normally used before containment. What matters most?',
                options: [
                    'The missing checkpoint matters most because borrowed playbook language can hide a dangerous shortcut.',
                    'The request is safer because attackers rarely reproduce internal response wording this precisely.',
                    'The containment step is legitimate because emergency actions often drop one checkpoint under time pressure.',
                    'The playbook match is enough to trust the request if the named systems really are business critical there.'
                ],
                answer: 0,
                explanation: 'The safest signal is whether the flow preserves the real checkpoint structure, not whether the language sounds familiar.'
            },
            {
                topic: 'Containment abuse',
                prompt: 'A responder says the account must be isolated immediately, and your normal validation should wait until after the urgent action succeeds. Why is that effective deception?',
                options: [
                    'It frames the protective control itself as the obstacle so you disable the very check that would catch the scam.',
                    'It proves legitimacy because true containment always outruns administrative validation during an active case.',
                    'The guidance is safe if the responder explains the business impact of waiting for ordinary review there.',
                    'The request is lower risk because isolation actions usually expose less data than recovery or consent flows.'
                ],
                answer: 0,
                explanation: 'A common trick is to portray verification as the thing preventing safety, even when skipping it creates the real danger.'
            },
            {
                topic: 'Recovery camouflage',
                prompt: 'A reset sequence follows your known response steps closely until one later stage asks for a manual approval route your team never uses in that scenario. What should you infer?',
                options: [
                    'The attacker may be hiding inside the playbook by changing only the one step that delivers access or approval.',
                    'The change is probably legitimate because real incidents often create one-off exceptions near the end of recovery.',
                    'The flow is safe because the earlier accurate steps prove the actor already knows the real response process.',
                    'The manual approval is acceptable if the reset case number and event timeline still look technically coherent.'
                ],
                answer: 0,
                explanation: 'High-end phishing often copies most of the routine and modifies only the step that gains control.'
            },
            {
                topic: 'Authority through procedure',
                prompt: 'Several messages do not sound emotional at all, but use calm procedural certainty to steer you into one unsafe step. Why is that dangerous?',
                options: [
                    'Procedure itself can create authority, making a harmful action feel responsible instead of suspicious.',
                    'A calm procedural tone is safer because phishing depends mostly on urgency and emotional manipulation.',
                    'The request is legitimate because formal language usually comes from trained responders, not attackers.',
                    'The action is acceptable if the process map sounds detailed enough to match a real internal response flow.'
                ],
                answer: 0,
                explanation: 'Advanced attacks do not always use panic; sometimes they weaponize calm process confidence instead.'
            },
            {
                topic: 'Legend response',
                prompt: 'Which response best defeats a playbook-subversion attempt when the procedure looks almost exactly right?',
                options: [
                    'Anchor on the required checkpoints of the real playbook and reject any message-driven shortcut around them.',
                    'Complete the step if the process is at least ninety percent accurate and only the timing feels unusual there.',
                    'Ask the sender for a cleaner summary and proceed once the flow becomes easier to compare with memory.',
                    'Wait for a second responder to confirm the same step because duplicate procedure language increases trust.'
                ],
                answer: 0,
                explanation: 'The defense is to preserve the real checkpoints rather than trusting the overall resemblance of the procedure.'
            }
        ]
    },
    'consent-laundering-rings': {
        title: 'Consent Laundering Rings',
        description: 'Analyze app approval flows that stay technically valid while hiding layered abuse paths.',
        questions: [
            {
                topic: 'Valid but unsafe',
                prompt: 'An app consent request is technically legitimate, signed, and hosted on a real platform, but the business reason feels thinner than the permissions being granted. What should drive your choice?',
                options: [
                    'The mismatch between business need and permission scope matters more than the technical validity of the flow.',
                    'The request is safe because real platform consent screens and signed apps remove the usual phishing risk.',
                    'The business reason is enough if the app operates in a category commonly used by your team already there.',
                    'The grant is acceptable because layered permissions often look broader on screen than in real operation.'
                ],
                answer: 0,
                explanation: 'A flow can be technically valid and still inappropriate or abusive if the scope exceeds the real need.'
            },
            {
                topic: 'Scope laundering',
                prompt: 'A harmless-looking app introduces a second integration later that inherits broad access through the original trust. Why is that hard to spot?',
                options: [
                    'The initial low-risk appearance can launder trust for later access the user never meant to authorize.',
                    'The inherited access is normal because connected enterprise apps always share one trusted permission pool.',
                    'The pattern is safe because later integrations still depend on the original platform safeguards to operate.',
                    'The second integration is low risk if the first app has already been used by others in the organization there.'
                ],
                answer: 0,
                explanation: 'The danger is not always the first consent itself, but the trust it enables for later linked behavior.'
            },
            {
                topic: 'Indirect abuse',
                prompt: 'No single permission looks catastrophic alone, but together they could support strong surveillance and future impersonation. What is the best conclusion?',
                options: [
                    'Combined permissions can be dangerous even when each individual line item looks ordinary on its own.',
                    'The request is safe because platform review would block any permission set that could combine harmfully.',
                    'The grant is acceptable if none of the permissions explicitly mention password access or account takeover.',
                    'The risk is low because ordinary users should judge app consent only by the most alarming single scope.'
                ],
                answer: 0,
                explanation: 'Sophisticated abuse often emerges from combinations of ordinary permissions rather than one dramatic request.'
            },
            {
                topic: 'Trust relay',
                prompt: 'A consent flow is recommended by a respected app already inside your environment, but the new target has a different owner and a looser business justification. What should stand out?',
                options: [
                    'Borrowed trust from one respected app can be used to normalize a weaker and riskier follow-on consent.',
                    'The chain is safer because a respected app would not route users toward an untrustworthy follow-up there.',
                    'The owner difference matters less if both apps still appear inside the same enterprise integration ecosystem.',
                    'The request is acceptable because the first app has effectively pre-vetted the second one for your team.'
                ],
                answer: 0,
                explanation: 'A trusted referral path does not remove the need to evaluate the new owner and business purpose independently.'
            },
            {
                topic: 'Legend response',
                prompt: 'Which response best handles a technically valid but business-questionable consent ring?',
                options: [
                    'Evaluate the minimum necessary scope and verified owner before granting any platform-valid consent.',
                    'Approve it if every screen remains inside the official platform and no password is requested anywhere.',
                    'Use the app briefly first and revoke it later if the resulting behavior feels broader than expected there.',
                    'Continue if the recommendation came from another already trusted integration used by your organization.'
                ],
                answer: 0,
                explanation: 'Technical validity is not enough; the owner, business need, and minimum scope still have to make sense.'
            }
        ]
    },
    'governance-theater-attacks': {
        title: 'Governance Theater Attacks',
        description: 'Spot requests that weaponize audits, committees, and policy optics to force unsafe action.',
        questions: [
            {
                topic: 'Committee pressure',
                prompt: 'A message claims a governance committee is already reviewing your delay and that one final confirmation link is needed before they can mark you compliant. What is the main warning sign?',
                options: [
                    'Governance pressure is being used to create urgency around an unsafe link-driven confirmation step.',
                    'Committee escalation makes the request safer because policy bodies usually require stronger evidence before acting.',
                    'The review is probably legitimate because attackers avoid using governance language that sounds dry and formal.',
                    'The confirmation is acceptable if the committee title and policy references match real documents in your org.'
                ],
                answer: 0,
                explanation: 'Governance language can make a bad action feel responsible, but the link-driven confirmation is still the real risk.'
            },
            {
                topic: 'Audit optics',
                prompt: 'A request focuses more on demonstrating compliance quickly than on explaining why the action is needed operationally. What should you infer?',
                options: [
                    'The message may be exploiting compliance optics to make a weak business reason feel mandatory.',
                    'The action is safer because audit-facing tasks often prioritize documentation over technical explanation.',
                    'The request is legitimate because compliance work naturally sounds more formal than operational work there.',
                    'The weak operational reason matters less if the request references a credible audit window and deadline.'
                ],
                answer: 0,
                explanation: 'When optics become the main driver, attackers may be using governance theater to bypass substantive scrutiny.'
            },
            {
                topic: 'Policy citation abuse',
                prompt: 'A message cites real policy sections accurately, but the action being requested does not actually follow the process defined there. What should you trust?',
                options: [
                    'The real process should outweigh the policy quotation because attackers can cite rules they do not intend to follow.',
                    'The accurate citations are enough because only legitimate senders usually bother matching policy language so closely.',
                    'The request is safe if the quoted policy sections are recent and still visible on the internal portal there.',
                    'The process gap is low risk because policies often leave room for practical shortcuts during busy periods.'
                ],
                answer: 0,
                explanation: 'Accurate policy citation does not prove the requested action is actually policy-compliant.'
            },
            {
                topic: 'Status shame tactic',
                prompt: 'The message hints that failure to act may make your team appear non-compliant in front of leadership, even though the requested action bypasses the normal review route. Why is that effective?',
                options: [
                    'It converts reputational pressure into leverage for a shortcut that your team would usually reject.',
                    'It shows legitimacy because only real compliance teams care about leadership-facing status in that way.',
                    'The reputational pressure is acceptable if the request arrives during a real reporting deadline there.',
                    'The action is lower risk because status-oriented requests usually involve paperwork rather than access changes.'
                ],
                answer: 0,
                explanation: 'Fear of appearing irresponsible can push people past the very process that would reveal the deception.'
            },
            {
                topic: 'Legend response',
                prompt: 'Which response best handles a governance-theater phishing attempt without getting trapped by policy optics?',
                options: [
                    'Validate the request inside the real governance workflow instead of complying with the message path.',
                    'Approve it if the policy references are accurate and the sender uses the expected compliance vocabulary.',
                    'Reply with a request for more documentation and continue if the message becomes more detailed afterward.',
                    'Wait for leadership to repeat the request because that would confirm the governance escalation is real.'
                ],
                answer: 0,
                explanation: 'The correct response is to go back to the actual governance workflow rather than follow the message path.'
            }
        ]
    },
    'identity-weathering-loops': {
        title: 'Identity Weathering Loops',
        description: 'Handle long-form attacks that slowly erode caution through repeated low-suspicion contact.',
        questions: [
            {
                topic: 'Slow-burn conditioning',
                prompt: 'A series of harmless-looking contacts over weeks gradually normalizes one identity, and only later introduces a risky request. What is the real attack pattern?',
                options: [
                    'The attacker is weathering your skepticism over time so the eventual request feels socially earned.',
                    'The long timeline makes the request safer because phishing usually depends on short bursts of urgency.',
                    'The identity is legitimate because long-term consistency is stronger evidence than any later process mismatch.',
                    'The risky request is acceptable if earlier contacts never asked for anything sensitive before it appeared.'
                ],
                answer: 0,
                explanation: 'Long-term familiarity can be manufactured so the final risky step feels deserved rather than suspicious.'
            },
            {
                topic: 'Harmless precedents',
                prompt: 'Several earlier interactions were genuine or low-risk, and now the next step asks for something much more consequential. Why is that dangerous?',
                options: [
                    'Past harmless interactions can create a precedent that hides a sudden jump in risk at the critical moment.',
                    'The request is safer because attackers rarely invest time in several low-value steps before making a move.',
                    'The escalation is normal because trust-based workflows naturally deepen after repeated successful exchanges.',
                    'The change is acceptable if the new request still uses the same tone and conversational style as before.'
                ],
                answer: 0,
                explanation: 'A gradual pattern of harmless steps can be exactly what makes a later high-risk ask easier to accept.'
            },
            {
                topic: 'Consistency trap',
                prompt: 'The sender’s identity never feels obviously wrong, but the request increasingly bends process as the relationship strengthens. What should guide you?',
                options: [
                    'Process integrity should guide you because consistent identity cues can still accompany a dangerous drift in asks.',
                    'The request is legitimate because identity consistency matters more than small process changes over time there.',
                    'The drift is low risk because trusted relationships often create shortcuts that save effort for both sides.',
                    'The action is acceptable if the sender continues to reference shared history and prior successful exchanges.'
                ],
                answer: 0,
                explanation: 'Even believable identity continuity should not justify a slow erosion of process safeguards.'
            },
            {
                topic: 'Emotional inertia',
                prompt: 'By the time the suspicious ask arrives, rejecting it feels awkward because so much normal interaction came first. Why is that powerful?',
                options: [
                    'The attacker is exploiting emotional inertia so social discomfort substitutes for real trust evidence.',
                    'The discomfort is a sign the request is probably legitimate because authentic relationships naturally feel sticky.',
                    'The ask is safer because awkwardness usually appears only when there is a real shared history between people.',
                    'The situation is low risk if the request still avoids direct password or code collection there.'
                ],
                answer: 0,
                explanation: 'Social discomfort can be weaponized so the victim avoids the verification that would break the spell.'
            },
            {
                topic: 'Legend response',
                prompt: 'Which habit best defeats an identity-weathering loop once the relationship feels familiar and established?',
                options: [
                    'Judge each risky action fresh against trusted process, not against the comfort built by previous contact.',
                    'Accept the request if the relationship has been stable long enough to feel more human than procedural.',
                    'Keep the relationship going but ask for one extra reassurance before taking the new step there.',
                    'Proceed if the sender has never once used panic or authority pressure during the earlier interactions.'
                ],
                answer: 0,
                explanation: 'Every high-risk action still has to stand on its own against the real process, regardless of prior familiarity.'
            }
        ]
    },
    'signal-fog-exploitation': {
        title: 'Signal Fog Exploitation',
        description: 'Untangle cases where many weak signals combine until the wrong action feels justifiable.',
        questions: [
            {
                topic: 'No single smoking gun',
                prompt: 'A case contains no single decisive red flag, but several moderate concerns align around one sensitive action. What is the strongest conclusion?',
                options: [
                    'The pattern of converging moderate risks can justify stopping even without one dramatic giveaway.',
                    'The action is probably safe because serious phishing usually depends on at least one obvious signal there.',
                    'The request is legitimate if no individual clue alone would be strong enough to support a firm rejection.',
                    'The situation is low risk because uncertainty should be resolved in favor of workflow continuity first.'
                ],
                answer: 0,
                explanation: 'Advanced cases often rely on uncertainty, so the combined risk pattern matters more than any single clue.'
            },
            {
                topic: 'Cumulative ambiguity',
                prompt: 'Each inconsistency seems explainable by itself, but together they create an uneasy picture around a high-impact approval. What should you prioritize?',
                options: [
                    'The cumulative picture matters more than giving every inconsistency its most charitable explanation.',
                    'The approval is safe because independent explanations reduce the chance that the signals are connected.',
                    'The request is legitimate if each separate clue has at least one plausible benign interpretation there.',
                    'The safest move is to continue because ambiguity without certainty should not interrupt important work.'
                ],
                answer: 0,
                explanation: 'When the action is high impact, the combined effect of several weak concerns is often enough reason to verify or stop.'
            },
            {
                topic: 'Fog as strategy',
                prompt: 'Why can an attacker benefit more from a fog of uncertainty than from an obvious dramatic lure?',
                options: [
                    'Uncertainty invites rationalization, making the victim finish the justification work for the attacker.',
                    'A foggy case is safer because attackers depend on clarity to push users toward one exact response there.',
                    'Ambiguity reduces risk because legitimate workflows are naturally more confusing than malicious ones.',
                    'The strategy fails if the user notices at least one strong technical signal anywhere in the flow.'
                ],
                answer: 0,
                explanation: 'A foggy scenario encourages the victim to explain away the concerns and keep moving.'
            },
            {
                topic: 'Impact-sensitive judgment',
                prompt: 'If the requested action could materially expose access or trust, how should uncertainty change your threshold?',
                options: [
                    'Higher impact should lower your tolerance for unresolved ambiguity before acting.',
                    'Higher impact should raise your tolerance because important workflows are naturally more complex there.',
                    'Impact matters less if the request stays within real infrastructure and a believable business setting.',
                    'The action is acceptable when the uncertainty is mostly social rather than technical in appearance.'
                ],
                answer: 0,
                explanation: 'The higher the downside, the less ambiguity you should tolerate before approving or complying.'
            },
            {
                topic: 'Legend response',
                prompt: 'Which response best handles a signal-fog case where many weak cues surround one risky action?',
                options: [
                    'Pause and verify from a trusted origin instead of forcing certainty inside the suspicious sequence.',
                    'Proceed slowly because careful reading inside the same flow usually resolves most uncertainty there.',
                    'Continue if the majority of visible signals still lean slightly toward legitimacy on balance overall.',
                    'Wait for the sender to clarify the ambiguity because better wording often removes the real issue.'
                ],
                answer: 0,
                explanation: 'The safest move is to step outside the fog and verify from a trusted starting point.'
            }
        ]
    },
    'trust-collapse-scenarios': {
        title: 'Trust Collapse Scenarios',
        description: 'Judge near-perfect cases where every familiar signal holds until one final trust boundary fails.',
        questions: [
            {
                topic: 'Last-link failure',
                prompt: 'A request survives domain checks, workflow checks, context checks, and relationship checks, but the final approval target is one level outside the exact trust boundary you expected. What should decide the outcome?',
                options: [
                    'The final trust boundary should decide the outcome because one wrong endpoint can invalidate the entire safe-looking chain.',
                    'The request is safe because the many earlier correct signals outweigh a small mismatch at the very end there.',
                    'The target drift is acceptable because real enterprise workflows often end one step outside the original context.',
                    'The flow should be trusted if the final page still belongs to the same vendor and uses valid identity plumbing.'
                ],
                answer: 0,
                explanation: 'Near-perfect flows often fail only at the final trust boundary, and that single failure still matters most.'
            },
            {
                topic: 'Borrowed certainty',
                prompt: 'Every earlier piece of evidence makes the final action feel inevitable, even though the last step cannot be independently justified on its own. What is the strongest conclusion?',
                options: [
                    'The earlier certainty may be borrowing trust for a final step that still lacks its own legitimate reason.',
                    'The request is legitimate because strong upstream context usually settles whether the final action is safe there.',
                    'The last step is low risk if the preceding chain was coherent enough to reduce the need for more verification.',
                    'The safest choice is to continue because isolated doubt near the end usually comes from harmless interface variation.'
                ],
                answer: 0,
                explanation: 'Apex-level phishing often uses perfect context to carry one unjustified final action across the line.'
            },
            {
                topic: 'Terminal scope drift',
                prompt: 'The business task appears narrow until the final confirmation introduces lasting access, not just temporary task completion. What should matter most?',
                options: [
                    'The lasting access matters most because final scope drift reveals the true risk hidden by the earlier task framing.',
                    'The change is probably legitimate because lasting access is often needed to reduce repeated approval friction later.',
                    'The request is safe if the task itself was real and the earlier workflow checkpoints all behaved normally there.',
                    'The final grant is acceptable as long as the user journey never visibly left the expected product environment.'
                ],
                answer: 0,
                explanation: 'When the ending scope becomes more durable than the stated task requires, the hidden objective is often broader access.'
            },
            {
                topic: 'False inevitability',
                prompt: 'Why can the most dangerous requests feel less suspicious precisely because they are the hardest to distinguish from normal work?',
                options: [
                    'They create a sense of inevitability, making scrutiny feel less reasonable even at the most critical step.',
                    'They are safer because only legitimate enterprise flows can sustain that level of consistency end to end.',
                    'They deserve trust because attackers usually rely on obvious pressure rather than long coherent workflows there.',
                    'They are low risk if the only mismatch appears after the user has already crossed several earlier confirmations.'
                ],
                answer: 0,
                explanation: 'The more inevitable a flow feels, the easier it becomes to stop evaluating the one step that matters most.'
            },
            {
                topic: 'Apex response',
                prompt: 'Which response best handles a trust-collapse scenario when almost every signal points toward legitimacy except the last boundary?',
                options: [
                    'Reject the final action until the exact target and minimum scope are independently verified from a trusted origin.',
                    'Proceed because a single late-stage concern should not outweigh a fully coherent chain of earlier legitimacy signals.',
                    'Complete the action once and monitor the resulting access later if the broader context still feels structurally sound.',
                    'Ask the sender to restate the final step more clearly and continue if the explanation sounds technically precise.'
                ],
                answer: 0,
                explanation: 'In apex scenarios, the exact final target still has to be independently justified no matter how convincing the lead-up felt.'
            }
        ]
    },
    'operator-blend-intrusions': {
        title: 'Operator Blend Intrusions',
        description: 'Handle attacks where human behavior, platform logic, and context cues align too well to doubt.',
        questions: [
            {
                topic: 'Human plus system harmony',
                prompt: 'A message, a system prompt, and a real operational deadline all point toward the same approval step with no obvious contradiction. Why is that especially dangerous?',
                options: [
                    'The harmony across people, platform, and timing can suppress doubt even when the final step is still wrong.',
                    'The request is safer because attackers rarely synchronize human and system cues tightly enough to feel seamless there.',
                    'The approval is legitimate because real deadlines and platform prompts would not naturally align inside a false flow.',
                    'The flow should be trusted if each layer reinforces the same story without visible technical inconsistency.'
                ],
                answer: 0,
                explanation: 'The most advanced attacks work precisely because every layer reinforces the same false action.'
            },
            {
                topic: 'Blended authority',
                prompt: 'The sender never demands anything dramatic, the platform never looks broken, and the workflow seems normal, but the resulting action would still widen trust significantly. What should guide you?',
                options: [
                    'The resulting trust expansion should guide you because calm delivery does not reduce the impact of the final action.',
                    'The action is low risk because severe phishing almost always depends on visible urgency or platform breakage there.',
                    'The request is legitimate if the surrounding behavior remains calm enough to avoid the usual social-engineering red flags.',
                    'The flow is acceptable because normal workflow tone usually proves the action belongs to routine enterprise operations.'
                ],
                answer: 0,
                explanation: 'A calm and seamless delivery can be more dangerous than panic because it lowers scrutiny around a high-impact step.'
            },
            {
                topic: 'Seamless wrongness',
                prompt: 'A flow feels too smooth to question, yet one small consequence would create durable cross-system access if you are wrong. What is the safest rule?',
                options: [
                    'Smoothness should never outweigh consequence when one mistake could create durable cross-system trust.',
                    'The request is safe because high-friction actions are more suspicious than unusually seamless enterprise flows there.',
                    'The flow is legitimate if no one part seems manipulative enough to justify interrupting the business task at hand.',
                    'The approval should proceed as long as the seamlessness stays inside real infrastructure and known organizational context.'
                ],
                answer: 0,
                explanation: 'When the downside is durable access expansion, smoothness is not a reason to stop checking.'
            },
            {
                topic: 'Behavioral camouflage',
                prompt: 'Which clue is easiest to overlook in an operator-blend intrusion because everything else feels coherent?',
                options: [
                    'A subtle mismatch between the action being justified and the authority actually needed to complete it.',
                    'A professional tone because advanced attackers usually cannot maintain believable enterprise language there.',
                    'A real deadline because legitimate operational timing rarely overlaps with identity and approval workflows.',
                    'A known platform because trustworthy tools do not meaningfully increase the risk of phishing-like decision errors.'
                ],
                answer: 0,
                explanation: 'The hardest clue is often the mismatch between the stated need and the authority being requested.'
            },
            {
                topic: 'Apex response',
                prompt: 'Which response best defeats an operator-blend intrusion that feels fully aligned with normal work?',
                options: [
                    'Evaluate the exact trust effect of the action from a clean independent standpoint before complying.',
                    'Proceed because alignment across people, timing, and platform is stronger than a small unresolved concern there.',
                    'Keep moving if the business deadline is real and the action appears reversible after the workflow completes.',
                    'Ask one participant to confirm the step and continue if their answer still fits the blended overall story.'
                ],
                answer: 0,
                explanation: 'The safest move is to step outside the blended experience and judge the trust effect independently.'
            }
        ]
    },
    'decision-fatigue-breaches': {
        title: 'Decision Fatigue Breaches',
        description: 'Break down elite pressure stacks that rely on ambiguity, speed, and mental exhaustion.',
        questions: [
            {
                topic: 'Cumulative strain',
                prompt: 'A case arrives after several real interruptions, multiple moderate-risk choices, and just enough urgency to discourage one more review. Why is that powerful?',
                options: [
                    'Decision fatigue lowers resistance, making a merely plausible action feel acceptable when scrutiny is depleted.',
                    'The request is safer because attackers prefer sharp single-step pressure over long noisy decision environments there.',
                    'The action is legitimate because real operational strain usually produces exactly this kind of messy workflow context.',
                    'The final choice should be trusted if every earlier interruption had at least some genuine business basis behind it.'
                ],
                answer: 0,
                explanation: 'Exhaustion changes the user’s threshold, so a risky action can pass simply because the mind wants closure.'
            },
            {
                topic: 'Urgency without panic',
                prompt: 'The request is not truly panicked, only just urgent enough that pausing feels costly after a long sequence of work. What should you infer?',
                options: [
                    'The attacker may be calibrating pressure precisely to exploit fatigue without triggering obvious alarm cues.',
                    'The request is legitimate because harmful urgency usually appears in louder and more dramatic language there.',
                    'The action is safe if the pressure stays moderate enough to feel consistent with normal enterprise operations.',
                    'The situation is low risk because fatigue-based doubt matters less than the visible professionalism of the flow.'
                ],
                answer: 0,
                explanation: 'Advanced manipulation often uses just enough urgency to close off reflection without looking theatrical.'
            },
            {
                topic: 'Exhausted rationalization',
                prompt: 'You notice yourself wanting the request to be legitimate because rejecting it would require more analysis and more delays. Why is that a warning sign?',
                options: [
                    'The desire for closure can become part of the attacker’s leverage, substituting comfort for real verification.',
                    'The request is safer because fatigue usually makes people overcautious rather than more vulnerable there.',
                    'The choice is acceptable if the extra analysis would probably reach the same answer after only a small delay.',
                    'The action should proceed because efficient judgment under pressure is often necessary in high-volume environments.'
                ],
                answer: 0,
                explanation: 'When you want the request to be true for emotional relief, the attacker may already have gained the advantage.'
            },
            {
                topic: 'Cost of delay framing',
                prompt: 'A message quietly makes delay feel more expensive than risk, even though the downside of one wrong action would be severe. What should matter most?',
                options: [
                    'The downside of the wrong action should matter most because fatigue can distort how delay and risk feel in the moment.',
                    'The request is legitimate because only real work pressure can make small delays feel this operationally costly there.',
                    'The action is acceptable if the visible delay cost seems more immediate than the abstract security downside.',
                    'The flow should be trusted when the message never explicitly asks you to ignore policy or skip formal checks.'
                ],
                answer: 0,
                explanation: 'Fatigue changes perception, so immediate inconvenience can feel bigger than long-term harm even when it is not.'
            },
            {
                topic: 'Apex response',
                prompt: 'Which response best protects you in a decision-fatigue breach scenario when one more review feels expensive?',
                options: [
                    'Pause anyway and re-evaluate from a trusted entry point before taking any high-impact action.',
                    'Proceed because fatigue is a subjective state and should not outweigh the visible structure of the request there.',
                    'Continue if the request still looks mostly consistent and the impact can probably be contained afterward.',
                    'Ask for one more confirmation inside the same thread and move ahead if it arrives quickly enough.'
                ],
                answer: 0,
                explanation: 'The protective move is to create a fresh decision moment outside the exhausting sequence before acting.'
            }
        ]
    },
    'control-plane-misdirection': {
        title: 'Control Plane Misdirection',
        description: 'Read cases where admin logic, recovery paths, and security controls are twisted into bait.',
        questions: [
            {
                topic: 'Control misuse',
                prompt: 'A message frames a dangerous trust change as a routine administrative adjustment inside the same control plane you normally trust. What is the main risk?',
                options: [
                    'Familiar control surfaces can normalize catastrophic changes when the user stops judging the actual effect there.',
                    'The request is safe because attacker infrastructure rarely reaches real admin surfaces closely enough to matter.',
                    'The adjustment is legitimate because risky actions are usually hidden behind plain interfaces only in real systems.',
                    'The control-plane step should be trusted if the administrative language matches your normal recovery terminology there.'
                ],
                answer: 0,
                explanation: 'Control-plane familiarity can make an unsafe action feel routine even when its effect is far broader than expected.'
            },
            {
                topic: 'Recovery to control transfer',
                prompt: 'A narrow recovery issue suddenly becomes an administrator-level configuration action with little explanation of the jump. What should you conclude?',
                options: [
                    'The jump from recovery into configuration control suggests the flow is seeking authority beyond the stated problem.',
                    'The escalation is normal because modern recovery workflows often finish with broad control-plane alignment there.',
                    'The action is safe if the same system handles both end-user resets and policy-level administrative changes.',
                    'The request is legitimate because only a real platform could bridge recovery and configuration this seamlessly.'
                ],
                answer: 0,
                explanation: 'Apex phishing often hides a large authority jump inside a plausible administrative continuity story.'
            },
            {
                topic: 'Protective control bait',
                prompt: 'A request claims you must disable or relax one security control to restore normal protection elsewhere. Why is that dangerous?',
                options: [
                    'It uses one protective control as the rationale for weakening another, masking the true direction of risk.',
                    'The action is legitimate because security systems often require one temporary relaxation to restore another properly.',
                    'The request is low risk if the relaxation is described as short term and fully reversible after the incident there.',
                    'The step should proceed when the same administrative console hosts both the disabled control and the restored one.'
                ],
                answer: 0,
                explanation: 'The deception works by making a harmful reduction in protection feel like part of a larger defensive fix.'
            },
            {
                topic: 'Admin trust shortcut',
                prompt: 'Why can real administrative complexity itself become a phishing advantage in a control-plane misdirection case?',
                options: [
                    'Complexity encourages users to trust the surface and wording rather than reason through the actual consequences.',
                    'Complex systems are safer because attackers cannot easily reproduce enough detail to guide a harmful action there.',
                    'Administrative complexity reduces risk because it forces every change through too many real checkpoints to abuse.',
                    'The request is acceptable if the complexity feels authentic enough that an ordinary user would struggle to parse it.'
                ],
                answer: 0,
                explanation: 'When the interface and language feel advanced, users may surrender judgment to the surface instead of the effect.'
            },
            {
                topic: 'Apex response',
                prompt: 'Which response best handles a control-plane misdirection case where the platform is real but the trust effect feels wrong?',
                options: [
                    'Stop and verify the exact configuration impact with a trusted owner before changing any control-plane setting.',
                    'Proceed because real administrative interfaces rarely present truly dangerous actions without other major warning signs.',
                    'Continue if the change is framed as temporary and the surrounding recovery timeline still appears technically plausible.',
                    'Ask the sender which checkbox matters most and move forward once the interface becomes easier to understand there.'
                ],
                answer: 0,
                explanation: 'Real platforms can still carry attacker-directed actions, so the exact impact must be verified before changing trust or control settings.'
            }
        ]
    },
    'cognitive-overlap-attacks': {
        title: 'Cognitive Overlap Attacks',
        description: 'Untangle scenarios where several believable explanations overlap until the wrong choice feels rational.',
        questions: [
            {
                topic: 'Competing explanations',
                prompt: 'A request can be explained by a real outage, a real policy update, or a phishing setup, and each explanation fits part of the evidence. What should you do?',
                options: [
                    'Judge the action by the maximum downside and trusted verification path, not by whichever explanation feels easiest there.',
                    'Proceed because the existence of several plausible explanations reduces the chance that the request is malicious there.',
                    'Trust the request if the most operationally convenient explanation still fits enough of the visible evidence overall.',
                    'Continue when at least one benign explanation remains possible, since certainty is rarely available in real systems.'
                ],
                answer: 0,
                explanation: 'When several explanations overlap, the safest anchor is the effect of the action and the trusted path for verification.'
            },
            {
                topic: 'Rational path to error',
                prompt: 'Why can a very smart user still make the wrong choice in a cognitive-overlap attack?',
                options: [
                    'Because each clue supports a different story, making a bad action feel intellectually defensible from several angles.',
                    'Because intelligence has little role in phishing once a request reaches a real platform with correct branding there.',
                    'Because overlapping explanations only matter when the user fails to notice the one strongest technical indicator there.',
                    'Because careful users usually overthink and therefore become less vulnerable than average in ambiguous high-context flows.'
                ],
                answer: 0,
                explanation: 'The trap is not stupidity; it is the feeling that several respectable lines of reasoning support moving forward.'
            },
            {
                topic: 'Ambiguity comfort',
                prompt: 'A message gives just enough evidence for multiple benign narratives, but each narrative requires a slightly different assumption. What is the safest interpretation?',
                options: [
                    'The need for several charitable assumptions is itself a sign that the action may not be safe to take there.',
                    'The request is legitimate because flexible interpretation is common in complex enterprise communication there.',
                    'The action is low risk if each individual assumption looks reasonable when considered separately on its own.',
                    'The flow should be trusted because attackers usually push toward one rigid story rather than several overlapping ones.'
                ],
                answer: 0,
                explanation: 'When safety depends on stacking several charitable assumptions, the situation may be less trustworthy than it feels.'
            },
            {
                topic: 'Interpretive overload',
                prompt: 'Which hidden risk grows when a user spends too much time choosing among competing stories inside the suspicious sequence itself?',
                options: [
                    'The user may normalize the sequence while reasoning through it, making the final action feel more acceptable there.',
                    'The request becomes safer because deep interpretation inside the same sequence usually resolves the attacker’s weak points.',
                    'The action is legitimate if the overlapping explanations remain technically possible after prolonged careful review there.',
                    'The flow should proceed because interpretive effort is a stronger trust signal than one clean external verification path.'
                ],
                answer: 0,
                explanation: 'The more time spent inside the attacker-controlled sequence, the easier it becomes to adapt to its logic.'
            },
            {
                topic: 'Apex response',
                prompt: 'Which response best handles a cognitive-overlap attack when several smart interpretations seem possible at once?',
                options: [
                    'Exit the sequence and verify the action from a trusted source that does not depend on any of those overlapping stories.',
                    'Proceed if the most plausible explanation seems slightly more likely than the others after reviewing the clues there.',
                    'Continue when no single explanation fully dominates, because complex systems often require interpretive tolerance there.',
                    'Ask the sender which of the competing explanations is correct and follow whichever one they clarify more convincingly.'
                ],
                answer: 0,
                explanation: 'The strongest defense is to leave the interpretive maze and verify from a source that stands outside it.'
            }
        ]
    },
    'irrecoverable-trust-failures': {
        title: 'Irrecoverable Trust Failures',
        description: 'Evaluate final-form cases where one bad action could permanently widen access or exposure.',
        questions: [
            {
                topic: 'One-step permanence',
                prompt: 'A single approval would create durable access that could be difficult to unwind even if you noticed the mistake minutes later. What should that imply?',
                options: [
                    'The tolerance for ambiguity should approach zero because the action’s permanence changes the decision standard.',
                    'The request is legitimate because durable changes normally appear only inside mature and carefully governed workflows there.',
                    'The action is acceptable if the likelihood of error seems lower than the immediate business cost of rejecting it there.',
                    'The flow should proceed as long as the platform offers some documented recovery mechanism after the change is made.'
                ],
                answer: 0,
                explanation: 'When one wrong step creates durable trust or exposure, even small unresolved doubt becomes too expensive to ignore.'
            },
            {
                topic: 'Asymmetric downside',
                prompt: 'The effort to verify properly is annoying, but the downside of a mistake could expose whole chains of access. What is the safest rule?',
                options: [
                    'Asymmetric downside means the verification burden is worth paying before taking the action there.',
                    'The action is legitimate because high-consequence enterprise workflows usually build enough safety into the interface there.',
                    'The choice is low risk if the burden of extra verification feels disproportionate to the visible uncertainty there.',
                    'The request should proceed whenever the likely operational upside appears larger than the immediate inconvenience of delay.'
                ],
                answer: 0,
                explanation: 'The greater the downside asymmetry, the more worthwhile it is to spend extra effort on verification first.'
            },
            {
                topic: 'No clean rollback',
                prompt: 'A sender reassures you that the action can be undone later, but the actual trust relationship or data exposure may already occur immediately. What should matter most?',
                options: [
                    'The immediate effect matters most because rollback promises do not erase what may happen in the first moments there.',
                    'The action is safe because reversible enterprise features are designed specifically to tolerate honest user mistakes there.',
                    'The request is legitimate if the rollback instructions sound detailed enough to show the sender understands recovery there.',
                    'The flow should proceed because the existence of any rollback path meaningfully lowers the decision risk overall.'
                ],
                answer: 0,
                explanation: 'A rollback path does not guarantee that the harm between approval and reversal would be acceptable.'
            },
            {
                topic: 'Catastrophic subtlety',
                prompt: 'Why are the most dangerous trust failures often the ones that look only slightly unusual rather than obviously malicious?',
                options: [
                    'Because small-seeming deviations are easier to rationalize right before a decision with outsized irreversible impact there.',
                    'Because catastrophic actions always require dramatic red flags that help careful users reject them in time there.',
                    'Because subtle deviations matter less once the user is already operating inside trusted infrastructure and real workflows.',
                    'Because advanced users should optimize for continuity unless the request becomes openly manipulative or technically broken there.'
                ],
                answer: 0,
                explanation: 'The most dangerous actions often depend on the victim minimizing a small deviation at exactly the wrong moment.'
            },
            {
                topic: 'Apex response',
                prompt: 'Which response best handles an irrecoverable trust-failure case where one click could create lasting damage?',
                options: [
                    'Decline the action until an independent trusted source confirms the target, scope, and necessity with near certainty.',
                    'Proceed if the surrounding evidence looks strong enough that the remaining doubt feels operationally tolerable there.',
                    'Complete the step but document the details carefully so reversal can happen quickly if anything later looks wrong there.',
                    'Ask the sender for a stronger reassurance and continue if the explanation addresses the permanence concern directly there.'
                ],
                answer: 0,
                explanation: 'When one action could create lasting damage, only near-certain independent verification is an acceptable basis for proceeding.'
            }
        ]
    }
};

const quizPointValues = {
    'url-basics': 80,
    'login-page-clues': 100,
    'message-red-flags': 110,
    'after-clicking': 90,
    'qr-link-safety': 110,
    'social-media-scams': 120,
    'sender-source-checks': 130,
    'attachment-download-safety': 130,
    'account-recovery-traps': 140,
    'form-data-requests': 140,
    'payment-delivery-scams': 150,
    'support-impersonation': 150,
    'scholarship-bait': 160,
    'document-sharing-traps': 160,
    'mobile-alert-deception': 170,
    'event-registration-risks': 170,
    'marketplace-meetup-scams': 180,
    'multi-step-phish-cases': 190,
    'campus-portal-spoofs': 200,
    'urgent-admin-fraud': 210,
    'cloud-drive-compromise': 220,
    'internship-hiring-scams': 220,
    'verification-chain-attacks': 230,
    'phishing-scenarios': 240,
    'executive-impersonation': 250,
    'breach-followup-scams': 260,
    'recovery-flow-attacks': 270,
    'financial-approval-fraud': 280,
    'cross-channel-takeovers': 290,
    'best-practices': 320,
    'vendor-portal-breaches': 340,
    'identity-chain-spoofs': 350,
    'cloud-consent-traps': 360,
    'incident-response-bait': 370,
    'multi-actor-escalations': 380,
    'trust-layer-collisions': 390,
    'zero-trust-breakpoints': 410,
    'live-session-hijacks': 420,
    'delegated-access-fraud': 430,
    'forensic-cover-stories': 440,
    'approval-chain-poisoning': 450,
    'adaptive-impersonation-loops': 460,
    'supply-chain-shadowing': 480,
    'federated-login-pivots': 490,
    'trust-graph-manipulation': 500,
    'incident-command-spoofs': 510,
    'recovery-delegation-loops': 520,
    'environment-poisoning-cases': 530,
    'cross-tenant-bleedthrough': 550,
    'response-playbook-subversion': 560,
    'consent-laundering-rings': 570,
    'governance-theater-attacks': 580,
    'identity-weathering-loops': 590,
    'signal-fog-exploitation': 600,
    'trust-collapse-scenarios': 620,
    'operator-blend-intrusions': 630,
    'decision-fatigue-breaches': 640,
    'control-plane-misdirection': 650,
    'cognitive-overlap-attacks': 660,
    'irrecoverable-trust-failures': 670,
    'lab-login-page-check': 100,
    'lab-email-header-clues': 110,
    'lab-qr-poster-check': 120,
    'lab-file-share-trap': 130,
    'lab-password-reset-sms': 140,
    'lab-delivery-scam-chat': 150
};

const labConfigs = {
    'login-page-check': {
        attemptId: 'lab-login-page-check',
        attemptTitle: 'Login Page Check Lab',
        renderMode: 'login',
        title: 'Login Page Check',
        description: 'Inspect the fake login page and click the strongest red flags.',
        briefLabel: 'Incoming Message',
        channel: 'Email Notice',
        scenarioTitle: 'Your campus email will be suspended unless you verify your account today.',
        scenarioBody: 'You receive a message that says your school account will be disabled in the next hour unless you log in through <span class="lab-inline-url">https://lcc-student-verify.helpdesk-login.net</span>.',
        previewUrl: 'https://lcc-student-verify.helpdesk-login.net',
        brandTitle: 'La Concepcion College Portal',
        brandSubtitle: 'Student verification required',
        alertText: 'Your account will be suspended today unless you confirm your credentials immediately.',
        primaryLabel: 'School email',
        primaryValue: 'student@lcc.edu.ph',
        secondaryLabel: 'Password',
        secondaryValue: 'examplepassword',
        submitLabel: 'Verify Account',
        supportText: 'Need help? Contact support@portal-helpdesk-login.net',
        checklistTitle: 'Click the 3 strongest warning signs',
        checklistCopy: 'You only get 3 picks, so choose carefully.',
        correctSpots: new Set(['domain', 'urgency', 'support']),
        explanationMap: {
            domain: 'The URL does not clearly match the official school domain, which is a strong phishing signal.',
            urgency: 'The suspension warning pressures the user to act fast instead of verifying first.',
            support: 'The support contact uses a suspicious helpdesk-style domain unrelated to the school.',
            brand: 'A copied logo or school name is not enough proof that a page is legitimate.',
            submit: 'A submit button by itself is not the strongest red flag; the surrounding context matters more.'
        },
        successSummary: 'You found the strongest phishing signals on the page: the suspicious domain, the urgency message, and the fake support contact.',
        failureSummary: 'The best red flags here are the suspicious domain, the urgency message, and the unrelated support contact.'
    },
    'email-header-clues': {
        attemptId: 'lab-email-header-clues',
        attemptTitle: 'Email Header Clues Lab',
        renderMode: 'email',
        title: 'Email Header Clues',
        description: 'Inspect the suspicious account notice and click the strongest clues.',
        briefLabel: 'Inbox Preview',
        channel: 'Registrar Email',
        scenarioTitle: 'The registrar office asks you to confirm your enrollment record through a support page.',
        scenarioBody: 'A message says your enrollment details need same-day correction and directs you to <span class="lab-inline-url">https://registrar-records-confirm.maildesk-center.net</span> before records close.',
        previewUrl: 'https://registrar-records-confirm.maildesk-center.net',
        senderLine: 'Registrar Office <records@maildesk-center.net>',
        replyToLine: 'registrar-update@maildesk-center.net',
        subjectLine: 'Enrollment record needs confirmation today',
        brandTitle: 'Registrar Record Support',
        brandSubtitle: 'Student enrollment update',
        alertText: 'Records close tonight. Confirm now to avoid processing delays.',
        primaryLabel: 'Student email',
        primaryValue: 'freshman@lcc.edu.ph',
        secondaryLabel: 'Student number',
        secondaryValue: '2026-10482',
        submitLabel: 'Confirm Records',
        supportText: 'Questions? Email registrar-update@maildesk-center.net',
        emailBodyHtml: `
            <p>Hello student,</p>
            <p>Your enrollment details need same-day correction before records close. Review the account notice and confirm your information at once.</p>
            <p>Use the button below to continue.</p>
        `,
        checklistTitle: 'Click the 3 strongest warning signs',
        checklistCopy: 'Choose the clearest phishing clues in the email-driven page.',
        correctSpots: new Set(['domain', 'urgency', 'support']),
        explanationMap: {
            domain: 'The maildesk-style domain does not match the official school registrar domain.',
            urgency: 'The same-day deadline is pressure designed to cut down careful checking.',
            support: 'The support email repeats the suspicious outside domain instead of an official school address.',
            brand: 'A believable office name can still be copied into a fake support page.',
            submit: 'The button label sounds normal, but it is not the strongest signal by itself.'
        },
        successSummary: 'You caught the strongest clues: the non-school domain, the pressure to act immediately, and the suspicious support address.',
        failureSummary: 'The strongest header-style warning signs here are the strange domain, the urgency, and the outside support contact.'
    },
    'qr-poster-check': {
        attemptId: 'lab-qr-poster-check',
        attemptTitle: 'QR Poster Check Lab',
        renderMode: 'poster',
        title: 'QR Poster Check',
        description: 'Review the poster-linked destination and click the strongest warning signs before scanning.',
        briefLabel: 'Campus Poster',
        channel: 'Public Notice',
        scenarioTitle: 'A campus poster says you must reconnect student Wi-Fi by scanning a QR code today.',
        scenarioBody: 'The QR code leads to <span class="lab-inline-url">https://lcc-wifi-reconnect.portal-device.help</span> and says students should sign in at once to keep internet access active.',
        previewUrl: 'https://lcc-wifi-reconnect.portal-device.help',
        posterKicker: 'Campus Connect Notice',
        posterChip: 'Public Poster',
        posterTitle: 'Reconnect Student Wi-Fi Today',
        posterBodyHtml: '<p>Scan the code below to avoid interruption to your campus internet access.</p>',
        posterLabel: 'Student Wi-Fi Restore',
        posterSubcopy: 'Open the access page and sign in immediately.',
        brandTitle: 'Campus Wi-Fi Restore',
        brandSubtitle: 'Reconnect your student access',
        alertText: 'Wi-Fi access expires today. Reconnect now to avoid losing internet service.',
        primaryLabel: 'Student email',
        primaryValue: 'campus.user@lcc.edu.ph',
        secondaryLabel: 'Network password',
        secondaryValue: 'wifipassword',
        submitLabel: 'Reconnect Wi-Fi',
        supportText: 'Network help: wifi-fix@portal-device.help',
        checklistTitle: 'Click the 3 strongest warning signs',
        checklistCopy: 'Look for the strongest signs that this QR destination should not be trusted.',
        correctSpots: new Set(['domain', 'urgency', 'support']),
        explanationMap: {
            domain: 'The portal-device.help domain is not the official school or trusted network domain.',
            urgency: 'The expiry warning is meant to rush students into scanning and signing in.',
            support: 'The support contact stays on the same suspicious outside domain as the fake portal.',
            brand: 'A school-themed network label is easy to fake on a landing page.',
            submit: 'The reconnect button matches the story, but the surrounding signs are more important.'
        },
        successSummary: 'Nice catch. The fake QR flow depends on the suspicious domain, the rush to reconnect today, and the outside support contact.',
        failureSummary: 'The strongest clues are the off-domain portal, the urgency to reconnect immediately, and the suspicious support email.'
    },
    'file-share-trap': {
        attemptId: 'lab-file-share-trap',
        attemptTitle: 'File Share Trap Lab',
        title: 'File Share Trap',
        description: 'Inspect the shared-file access page and click the strongest phishing clues.',
        briefLabel: 'Shared Document',
        channel: 'Cloud Drive Invite',
        scenarioTitle: 'A file-sharing notice says a department report is waiting, but access needs a quick recheck.',
        scenarioBody: 'The shared link opens <span class="lab-inline-url">https://lcc-doc-view.secure-share-access.co</span> and asks you to re-enter details before the file preview unlocks.',
        previewUrl: 'https://lcc-doc-view.secure-share-access.co',
        brandTitle: 'Department Document Access',
        brandSubtitle: 'Sign in to preview the file',
        alertText: 'File access expires in 15 minutes. Complete the check now to avoid link removal.',
        primaryLabel: 'School email',
        primaryValue: 'faculty.share@lcc.edu.ph',
        secondaryLabel: 'Password',
        secondaryValue: 'documentpassword',
        submitLabel: 'Open Shared File',
        supportText: 'Access support: help@secure-share-access.co',
        checklistTitle: 'Click the 3 strongest warning signs',
        checklistCopy: 'Choose the details that make this shared-file page unsafe.',
        correctSpots: new Set(['domain', 'urgency', 'support']),
        explanationMap: {
            domain: 'The secure-share-access.co domain is not the official file-sharing domain you would expect.',
            urgency: 'The short expiration timer pressures the user to stop verifying and just comply.',
            support: 'The help address points back to the same suspicious outside sharing domain.',
            brand: 'A generic document access label can be copied without proving the page is real.',
            submit: 'The file-open button matches the story but is not one of the strongest clues by itself.'
        },
        successSummary: 'You found the strongest shared-file clues: the suspicious domain, the fake urgency window, and the outside support contact.',
        failureSummary: 'The best red flags are the strange sharing domain, the 15-minute pressure, and the suspicious support email.'
    },
    'password-reset-sms': {
        attemptId: 'lab-password-reset-sms',
        attemptTitle: 'Password Reset SMS Lab',
        title: 'Password Reset SMS',
        description: 'Inspect the mobile reset flow and click the strongest warning signs.',
        briefLabel: 'SMS Alert',
        channel: 'Text Message',
        scenarioTitle: 'A password reset text says someone tried to access your student account and you must secure it right now.',
        scenarioBody: 'The message sends you to <span class="lab-inline-url">https://lcc-reset-alert.account-protect-now.com</span> and says failure to act may leave your account exposed.',
        previewUrl: 'https://lcc-reset-alert.account-protect-now.com',
        brandTitle: 'Student Account Reset',
        brandSubtitle: 'Secure your access now',
        alertText: 'Unrecognized access attempt detected. Reset your password immediately to stay protected.',
        primaryLabel: 'Student email',
        primaryValue: 'mobile.user@lcc.edu.ph',
        secondaryLabel: 'Current password',
        secondaryValue: 'myoldpassword',
        submitLabel: 'Secure Account',
        supportText: 'Recovery team: recovery@account-protect-now.com',
        checklistTitle: 'Click the 3 strongest warning signs',
        checklistCopy: 'Focus on the 3 details that most clearly point to phishing.',
        correctSpots: new Set(['domain', 'urgency', 'support']),
        explanationMap: {
            domain: 'The account-protect-now.com domain does not match the official school or identity provider domain.',
            urgency: 'The immediate danger framing is designed to make the user reset through the attacker page.',
            support: 'The recovery email remains on the same suspicious outside domain instead of a trusted school contact.',
            brand: 'A generic account reset brand can still be completely fake.',
            submit: 'The secure account button is not the strongest clue compared with the domain and pressure tactics.'
        },
        successSummary: 'You spotted the strongest SMS-reset clues: the off-domain reset site, the immediate pressure, and the fake recovery contact.',
        failureSummary: 'The strongest phishing signs here are the outside reset domain, the urgent scare tactic, and the suspicious recovery address.'
    },
    'delivery-scam-chat': {
        attemptId: 'lab-delivery-scam-chat',
        attemptTitle: 'Delivery Scam Chat Lab',
        title: 'Delivery Scam Chat',
        description: 'Inspect the fake package help chat and click the strongest warning signs.',
        briefLabel: 'Chat Transcript',
        channel: 'Support Chat',
        scenarioTitle: 'A delivery help chat says your package cannot be released until you verify your account details.',
        scenarioBody: 'The chat routes you to <span class="lab-inline-url">https://parcel-release.center-chat-help.net</span> and claims action is needed today so the package is not returned.',
        previewUrl: 'https://parcel-release.center-chat-help.net',
        brandTitle: 'Parcel Release Help',
        brandSubtitle: 'Delivery confirmation required',
        alertText: 'Your parcel will be returned tonight unless release details are confirmed now.',
        primaryLabel: 'Email address',
        primaryValue: 'buyer@example.com',
        secondaryLabel: 'Account password',
        secondaryValue: 'deliverypassword',
        submitLabel: 'Release Parcel',
        supportText: 'Chat support: help@center-chat-help.net',
        checklistTitle: 'Click the 3 strongest warning signs',
        checklistCopy: 'Pick the details that most strongly show this delivery chat is unsafe.',
        correctSpots: new Set(['domain', 'urgency', 'support']),
        explanationMap: {
            domain: 'The center-chat-help.net domain is not a trusted official courier or marketplace domain.',
            urgency: 'The same-night return warning is pressure meant to rush the decision.',
            support: 'The support email stays on the same suspicious outside help domain as the fake chat flow.',
            brand: 'A generic parcel-release brand is easy to imitate and does not prove legitimacy.',
            submit: 'The release button fits the story but is not the clearest phishing clue on its own.'
        },
        successSummary: 'You found the strongest delivery-scam clues: the fake help domain, the return-today pressure, and the suspicious support contact.',
        failureSummary: 'The strongest warning signs here are the outside domain, the urgent return warning, and the fake support address.'
    }
};

let activeLabId = 'login-page-check';
let activeLabConfig = labConfigs[activeLabId];

const quizStartButtons = document.querySelectorAll('.quiz-start-btn[data-quiz]');
const labStartButtons = document.querySelectorAll('.quiz-start-btn[data-start-lab]');
const quizSidebar = document.getElementById('quizSidebar');
const quizSidebarOverlay = document.getElementById('quizSidebarOverlay');
const quizSidebarToggle = document.getElementById('quizSidebarToggle');
const quizSidebarBackBtn = document.querySelector('.quiz-sidebar-back-btn');
const quizSidebarStartBtn = document.getElementById('quizSidebarStartBtn');
const quizSidebarLogoutBtn = document.getElementById('quizSidebarLogoutBtn');
const quizSidebarProfileBtn = document.getElementById('quizSidebarProfileBtn');
const quizSidebarLabel = document.getElementById('quizSidebarLabel');
const quizSidebarName = document.getElementById('quizSidebarName');
const quizSidebarEmail = document.getElementById('quizSidebarEmail');
const quizSidebarAuthActions = document.getElementById('quizSidebarAuthActions');
const quizSidebarNavLinks = [...document.querySelectorAll('[data-quiz-nav-link]')];
const quizMobileTopbar = document.getElementById('quizMobileTopbar');
const quizMobileTopbarLabel = document.getElementById('quizMobileTopbarLabel');
const quizBadgesPanel = document.getElementById('quizBadgesPanel');
const quizBadgesGuestPrompt = document.getElementById('quizBadgesGuestPrompt');
const quizBadgesList = document.getElementById('quizBadgesList');
const quizBadgesEmpty = document.getElementById('quizBadgesEmpty');
const quizBadgeUnlockedCount = document.getElementById('quizBadgeUnlockedCount');
const quizBadgeHardCount = document.getElementById('quizBadgeHardCount');
const quizBadgeTotalCount = document.getElementById('quizBadgeTotalCount');
const quizProfilePanel = document.getElementById('quizProfilePanel');
const quizProfileGrid = document.querySelector('#quizProfilePanel .quiz-profile-grid');
const quizLogoutConfirmOverlay = document.getElementById('quizLogoutConfirmOverlay');
const quizLogoutCancelBtn = document.getElementById('quizLogoutCancelBtn');
const quizLogoutConfirmBtn = document.getElementById('quizLogoutConfirmBtn');
const quizProfileName = document.getElementById('quizProfileName');
const quizProfileEmail = document.getElementById('quizProfileEmail');
const quizProfileAttempts = document.getElementById('quizProfileAttempts');
const quizProfileAverage = document.getElementById('quizProfileAverage');
const quizProfileBest = document.getElementById('quizProfileBest');
const quizProfileRank = document.getElementById('quizProfileRank');
const quizProfileRankProgressFill = document.getElementById('quizProfileRankProgressFill');
const quizProfileRankProgressText = document.getElementById('quizProfileRankProgressText');
const quizAchievementStack = document.getElementById('quizAchievementStack');
const quizProfileCompletedSets = document.getElementById('quizProfileCompletedSets');
const quizProfileNoteInput = document.getElementById('quizProfileNoteInput');
const quizProfileNoteCount = document.getElementById('quizProfileNoteCount');
const quizProfileNoteStatus = document.getElementById('quizProfileNoteStatus');
const quizProfileNoteDisplay = document.getElementById('quizProfileNoteDisplay');
const quizProfileNoteEditor = document.getElementById('quizProfileNoteEditor');
const quizProfileNoteText = document.getElementById('quizProfileNoteText');
const quizProfileNoteEditBtn = document.getElementById('quizProfileNoteEditBtn');
const quizProfileNoteSaveBtn = document.getElementById('quizProfileNoteSaveBtn');
const quizProfileBadgeList = document.getElementById('quizProfileBadgeList');
const quizProfileBadgeEmpty = document.getElementById('quizProfileBadgeEmpty');
const quizProfileUnlockedBadgeCount = document.getElementById('quizProfileUnlockedBadgeCount');
const quizHistoryPanelSection = document.getElementById('quizHistoryPanel');
const quizHistoryGuestPrompt = document.getElementById('quizHistoryGuestPrompt');
const quizHistoryList = document.getElementById('quizHistoryList');
const quizHistoryEmpty = document.getElementById('quizHistoryEmpty');
const quizHistoryToggleBtn = document.getElementById('quizHistoryToggleBtn');
const quizLeaderboardPanel = document.getElementById('quizLeaderboardPanel');
const labsPanel = document.getElementById('labsPanel');
const loginPageLab = document.getElementById('loginPageLab');
const loginPageLabClose = document.getElementById('loginPageLabClose');
const loginPageLabSelectionCount = document.getElementById('loginPageLabSelectionCount');
const loginPageLabSubmit = document.getElementById('loginPageLabSubmit');
const loginPageLabReset = document.getElementById('loginPageLabReset');
const loginPageLabFeedback = document.getElementById('loginPageLabFeedback');
const loginPageLabSpotTargets = [...document.querySelectorAll('.lab-spot-target[data-lab-spot]')];
const loginPageLabTitle = document.getElementById('loginPageLabTitle');
const loginPageLabDescription = document.getElementById('loginPageLabDescription');
const loginPageLabBriefLabel = document.getElementById('loginPageLabBriefLabel');
const loginPageLabChannel = document.getElementById('loginPageLabChannel');
const loginPageLabScenarioTitle = document.getElementById('loginPageLabScenarioTitle');
const loginPageLabScenarioBody = document.getElementById('loginPageLabScenarioBody');
const loginPageLabUrl = document.getElementById('loginPageLabUrl');
const loginPageLabBrandTitle = document.getElementById('loginPageLabBrandTitle');
const loginPageLabBrandSubtitle = document.getElementById('loginPageLabBrandSubtitle');
const loginPageLabAlert = document.getElementById('loginPageLabAlert');
const loginPageLabPrimaryLabel = document.getElementById('loginPageLabPrimaryLabel');
const loginPageLabPrimaryValue = document.getElementById('loginPageLabPrimaryValue');
const loginPageLabSecondaryLabel = document.getElementById('loginPageLabSecondaryLabel');
const loginPageLabSecondaryValue = document.getElementById('loginPageLabSecondaryValue');
const loginPageLabSubmitLabel = document.getElementById('loginPageLabSubmitLabel');
const loginPageLabSupport = document.getElementById('loginPageLabSupport');
const loginPageLabChecklistTitle = document.getElementById('loginPageLabChecklistTitle');
const loginPageLabChecklistCopy = document.getElementById('loginPageLabChecklistCopy');
const labBrowserBar = document.getElementById('labBrowserBar');
const labFakeLogin = document.getElementById('labFakeLogin');
const labEmailPreview = document.getElementById('labEmailPreview');
const labEmailSenderLine = document.getElementById('labEmailSenderLine');
const labEmailReplyToLine = document.getElementById('labEmailReplyToLine');
const labEmailSubjectLine = document.getElementById('labEmailSubjectLine');
const labEmailBanner = document.getElementById('labEmailBanner');
const labEmailBody = document.getElementById('labEmailBody');
const labEmailCta = document.getElementById('labEmailCta');
const labEmailFooter = document.getElementById('labEmailFooter');
const labPosterPreview = document.getElementById('labPosterPreview');
const labPosterKicker = document.getElementById('labPosterKicker');
const labPosterChip = document.getElementById('labPosterChip');
const labPosterTitle = document.getElementById('labPosterTitle');
const labPosterBody = document.getElementById('labPosterBody');
const labPosterQr = document.getElementById('labPosterQr');
const labPosterLabel = document.getElementById('labPosterLabel');
const labPosterSubcopy = document.getElementById('labPosterSubcopy');
const labPosterUrl = document.getElementById('labPosterUrl');
const labPosterSupport = document.getElementById('labPosterSupport');
const quizLeaderboardList = document.getElementById('quizLeaderboardList');
const quizLeaderboardEmpty = document.getElementById('quizLeaderboardEmpty');
const quizProfileGuestPrompt = document.getElementById('quizProfileGuestPrompt');
const quizPublicProfileOverlay = document.getElementById('quizPublicProfileOverlay');
const quizPublicProfileClose = document.getElementById('quizPublicProfileClose');
const quizPublicProfileBody = document.getElementById('quizPublicProfileBody');
const quizAttemptReviewOverlay = document.getElementById('quizAttemptReviewOverlay');
const quizAttemptReviewClose = document.getElementById('quizAttemptReviewClose');
const quizAttemptReviewBody = document.getElementById('quizAttemptReviewBody');
const quizSectionTitle = document.getElementById('quizSectionTitle');
const quizSectionDescription = document.getElementById('quizSectionDescription');
const quizPagination = document.getElementById('quizPagination');
const labsPagination = document.getElementById('labsPagination');
const quizzesSection = document.getElementById('quizzes');
const quizWorkspace = document.getElementById('quizWorkspace');
const quizSessionTitle = document.getElementById('quizSessionTitle');
const quizSessionDesc = document.getElementById('quizSessionDesc');
const quizQuestionCounter = document.getElementById('quizQuestionCounter');
const quizProgressFill = document.getElementById('quizProgressFill');
const quizQuestionTopic = document.getElementById('quizQuestionTopic');
const quizQuestionText = document.getElementById('quizQuestionText');
const quizOptions = document.getElementById('quizOptions');
const quizFeedback = document.getElementById('quizFeedback');
const quizNextBtn = document.getElementById('quizNextBtn');
const quizQuestionCard = document.getElementById('quizQuestionCard');
const quizResultCard = document.getElementById('quizResultCard');
const quizResultScore = document.getElementById('quizResultScore');
const quizResultTitle = document.getElementById('quizResultTitle');
const quizResultSummary = document.getElementById('quizResultSummary');
const quizCorrectCount = document.getElementById('quizCorrectCount');
const quizResultQuizName = document.getElementById('quizResultQuizName');
const guestQuizPrompt = document.getElementById('guestQuizPrompt');
const quizRetryBtn = document.getElementById('quizRetryBtn');
const quizChooseAnotherBtn = document.getElementById('quizChooseAnotherBtn');
const quizExitBtn = document.getElementById('quizExitBtn');
const quizGrid = document.getElementById('quizzesGrid');
const quizCards = [...document.querySelectorAll('.quiz-card[data-quiz-card]')];
const labsGrid = document.getElementById('labsGrid');
const labCards = [...document.querySelectorAll('.quiz-card[data-lab-card]')];

let currentQuizId = null;
let currentQuestionIndex = 0;
let selectedAnswerIndex = null;
let score = 0;
let answers = [];
let signedInQuizAttempts = [];
let signedInLeaderboardRank = null;
let hasInitializedBadgeUnlocks = false;
let unlockedBadgeSnapshot = new Set();
let achievementToastQueue = [];
let activeAchievementToast = null;
let currentQuizPage = 1;
let currentLabPage = 1;
let lockedQuizSidebarScrollY = 0;
let quizSidebarTouchStartY = 0;
const guestQuizCardsPreviewCount = 6;
const maxAdaptiveQuizCardsPerPage = 6;
const totalQuizPages = 10;
const totalLabPages = 10;

function getGuestPreviewCard(gridType = 'quizzes') {
    const grid = gridType === 'labs' ? labsGrid : quizGrid;
    if (!grid) return null;

    const cardId = gridType === 'labs' ? 'labsGuestPreviewCard' : 'quizzesGuestPreviewCard';
    let card = document.getElementById(cardId);
    if (card) return card;

    const kicker = gridType === 'labs' ? 'Labs Locked' : 'Training Locked';
    const title = gridType === 'labs' ? 'Sign in to unlock more hands-on labs' : 'Sign in to unlock more training sets';
    const description = gridType === 'labs'
        ? 'Your saved lab progress, more hands-on phishing practice, and future lab activities will appear here once you sign in.'
        : 'More training sets, saved progress, badges, and full training access will appear here once you sign in.';

    card = document.createElement('div');
    card.id = cardId;
    card.className = 'quiz-guest-preview-card';
    card.innerHTML = `
        <div class="quiz-locked-panel">
            <p class="quiz-dashboard-kicker">${kicker}</p>
            <h3>${title}</h3>
            <p>${description}</p>
            <div class="quiz-locked-panel-actions">
                <a href="/login?returnTo=/quiz" class="quiz-sidebar-auth-btn is-signin">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                    <span>Sign In</span>
                </a>
                <a href="/signup?returnTo=/quiz" class="quiz-sidebar-auth-btn is-signup">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                    <span>Sign Up</span>
                </a>
            </div>
        </div>
    `;

    grid.appendChild(card);
    return card;
}

function getQuizCardsPerPage() {
    return 6;
}

function escapeHtml(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

createPlaceholderQuizCards();
createPlaceholderLabCards();
reorderQuizCardsForPagination();
updateQuizCardTierLabels();
renderQuizPagination();
renderLabsPagination();
applyQuizPageState();

function getStoredAuthToken() {
    return localStorage.getItem(authTokenKey) || sessionStorage.getItem(authTokenKey) || '';
}

function getApiBase() {
    const { origin, hostname } = window.location;
    if (hostname === 'localhost' || hostname === '127.0.0.1') return origin;
    if (DEPLOY_FRONTEND_ORIGINS.has(origin)) return RENDER_API_BASE;
    return origin;
}

async function apiFetch(endpoint, options = {}) {
    const headers = new Headers(options.headers || {});
    const token = getStoredAuthToken();

    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    if (options.body && !headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
    }

    const response = await fetch(`${getApiBase()}${endpoint}`, {
        ...options,
        headers
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok || data?.ok === false) {
        throw new Error(data?.error || 'Request failed.');
    }

    return data;
}

function getStoredUser() {
    const rawUser = localStorage.getItem(authUserKey) || sessionStorage.getItem(authUserKey);
    if (!rawUser) return null;

    try {
        return JSON.parse(rawUser);
    } catch {
        return { name: rawUser };
    }
}

function setStoredUser(user) {
    if (!user) return;

    [localStorage, sessionStorage].forEach((storage) => {
        const existingRaw = storage.getItem(authUserKey);
        if (!existingRaw) return;

        try {
            const existingUser = JSON.parse(existingRaw);
            storage.setItem(authUserKey, JSON.stringify({
                ...existingUser,
                ...user
            }));
        } catch {
            storage.setItem(authUserKey, JSON.stringify(user));
        }
    });
}

function syncQuizProfileNoteUi(note = '', statusText = 'Keep it short and clear.', forceEdit = false) {
    const normalizedNote = String(note || '').slice(0, 120);
    const showSavedView = Boolean(normalizedNote) && !forceEdit;

    if (quizProfileNoteInput) {
        quizProfileNoteInput.value = normalizedNote;
        quizProfileNoteInput.disabled = !isLoggedIn();
    }

    if (quizProfileNoteCount) {
        quizProfileNoteCount.textContent = `${normalizedNote.length} / 120`;
    }

    if (quizProfileNoteStatus) {
        quizProfileNoteStatus.textContent = statusText;
    }

    if (quizProfileNoteText) {
        quizProfileNoteText.textContent = normalizedNote;
    }

    if (quizProfileNoteDisplay) {
        quizProfileNoteDisplay.hidden = !showSavedView;
    }

    if (quizProfileNoteEditor) {
        quizProfileNoteEditor.hidden = showSavedView;
    }

    if (quizProfileNoteSaveBtn) {
        quizProfileNoteSaveBtn.disabled = !isLoggedIn();
    }

    if (quizProfileNoteEditBtn) {
        quizProfileNoteEditBtn.hidden = !isLoggedIn();
    }
}

function isLoggedIn() {
    return Boolean(getStoredAuthToken());
}

function clearStoredAuth() {
    [localStorage, sessionStorage].forEach((storage) => {
        storage.removeItem(authTokenKey);
        storage.removeItem(authUserKey);
        storage.removeItem(activeChatKey);
    });
}

async function handleQuizLogout() {
    try {
        await apiFetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
        console.error('Quiz logout request failed', error);
    }

    clearStoredAuth();
    hasInitializedBadgeUnlocks = false;
    unlockedBadgeSnapshot = new Set();
    achievementToastQueue = [];
    if (activeAchievementToast) {
        activeAchievementToast.remove();
        activeAchievementToast = null;
    }
    closePublicQuizProfile();
    resetQuizWorkspace();
    applyQuizPageState();
    window.location.href = '/quiz';
}

function openQuizLogoutConfirm() {
    if (quizLogoutConfirmOverlay) {
        quizLogoutConfirmOverlay.hidden = false;
    }
    quizLogoutConfirmBtn?.focus();
}

function closeQuizLogoutConfirm() {
    if (quizLogoutConfirmOverlay) {
        quizLogoutConfirmOverlay.hidden = true;
    }
}

function getCompletedQuizIds(attempts = []) {
    const completedQuizIds = new Set();

    attempts.forEach((attempt) => {
        const quizId = String(attempt?.quizId || '').trim();
        const percentage = Number(attempt?.percentage || 0);

        if (quizId && percentage >= 75) {
            completedQuizIds.add(quizId);
        }
    });

    return completedQuizIds;
}

function getFinishedQuizIds(attempts = []) {
    const finishedQuizIds = new Set();

    attempts.forEach((attempt) => {
        const quizId = String(attempt?.quizId || '').trim();
        if (quizId) {
            finishedQuizIds.add(quizId);
        }
    });

    return finishedQuizIds;
}

function getEarnedQuizPoints(attempts = []) {
    return [...getCompletedQuizIds(attempts)].reduce((total, quizId) => total + Number(quizPointValues[quizId] || 0), 0);
}

function getStrongQuizCount(attempts = [], minimumScore = 85) {
    const bestByQuizId = new Map();

    attempts.forEach((attempt) => {
        const quizId = String(attempt?.quizId || '').trim();
        const percentage = Number(attempt?.percentage || 0);
        if (!quizId) return;
        bestByQuizId.set(quizId, Math.max(bestByQuizId.get(quizId) || 0, percentage));
    });

    return [...bestByQuizId.values()].filter((score) => score >= minimumScore).length;
}

function getQuizUnlockState(quizId, attempts = []) {
    const rule = advancedQuizRules[quizId];
    if (!rule) {
        return {
            locked: false,
            reason: '',
            cta: 'Start Set'
        };
    }

    if (!isLoggedIn()) {
        return {
            locked: true,
            reason: 'Sign in to start advanced quiz sets and save your progress.',
            cta: 'Sign In to Unlock',
            action: 'login'
        };
    }

    const attemptsCount = attempts.length;
    const uniqueTopics = new Set(attempts.map((attempt) => attempt.quizId)).size;
    const averageScore = attemptsCount
        ? Math.round(attempts.reduce((total, attempt) => total + Number(attempt.percentage || 0), 0) / attemptsCount)
        : 0;
    const finishedQuizIds = getFinishedQuizIds(attempts);
    const requiredQuizIds = Array.isArray(rule.requiresQuizIds) ? rule.requiresQuizIds : [];
    const missingQuizTitles = requiredQuizIds
        .filter((requiredQuizId) => !finishedQuizIds.has(requiredQuizId))
        .map((requiredQuizId) => quizzes[requiredQuizId]?.title || requiredQuizId);
    const hasRequiredQuizIds = requiredQuizIds.every((requiredQuizId) => finishedQuizIds.has(requiredQuizId));

    const getSeriesUnlockNote = () => {
        if (!requiredQuizIds.length) return rule.label || '';
        if (requiredQuizIds.every((requiredQuizId) => coreQuizIds.includes(requiredQuizId))) {
            return 'Finish Core Series first.';
        }
        if (requiredQuizIds.every((requiredQuizId) => skillBuilderQuizIds.includes(requiredQuizId))) {
            return 'Finish Skill Builder Series first.';
        }
        if (requiredQuizIds.every((requiredQuizId) => challengerQuizIds.includes(requiredQuizId))) {
            return 'Finish Challenger Series first.';
        }
        if (requiredQuizIds.every((requiredQuizId) => advancedSeriesQuizIds.includes(requiredQuizId))) {
            return 'Finish Advanced Series first.';
        }
        if (requiredQuizIds.every((requiredQuizId) => masteryPrepQuizIds.includes(requiredQuizId))) {
            return 'Finish the earlier Mastery sets first.';
        }
        return rule.label || '';
    };

    const unlocked =
        hasRequiredQuizIds &&
        attemptsCount >= (rule.minimumAttempts || 0) &&
        uniqueTopics >= (rule.minimumUniqueTopics || 0) &&
        averageScore >= (rule.minimumAverageScore || 0);

    let reason = '';
    if (!unlocked) {
        if (missingQuizTitles.length) {
            reason = getSeriesUnlockNote();
        } else if (attemptsCount < (rule.minimumAttempts || 0)) {
            reason = `Save ${rule.minimumAttempts} attempts first.`;
        } else if (uniqueTopics < (rule.minimumUniqueTopics || 0)) {
            reason = `Finish ${rule.minimumUniqueTopics} sets first.`;
        } else if (averageScore < (rule.minimumAverageScore || 0)) {
            reason = `Reach a ${rule.minimumAverageScore}% average first.`;
        } else {
            reason = rule.label;
        }
    }

    return {
        locked: !unlocked,
        reason,
        cta: unlocked ? 'Start Set' : 'Locked for Now',
        action: unlocked ? 'start' : 'locked'
    };
}

function updateQuizUnlockStates(attempts = []) {
    const completedQuizIds = getCompletedQuizIds(attempts);

    quizStartButtons.forEach((button) => {
        const quizId = button.dataset.quiz;
        const card = button.closest('[data-quiz-card]');
        let note = document.getElementById(`quizUnlockNote-${quizId}`) || card?.querySelector('.quiz-unlock-note.quiz-dynamic-unlock-note') || null;
        const completedChip = document.getElementById(`quizCompletedChip-${quizId}`);
        const state = getQuizUnlockState(quizId, attempts);
        const isCompleted = completedQuizIds.has(quizId);

        button.dataset.lockedAction = state.action || 'start';
        button.textContent = state.cta;
        button.disabled = state.locked && state.action !== 'login';

        if (card) {
            card.classList.toggle('is-locked', state.locked);
            card.classList.toggle('is-completed', isCompleted);
        }

        if (!note && card) {
            note = document.createElement('p');
            note.className = 'quiz-unlock-note quiz-dynamic-unlock-note';
            const buttonWrap = card.querySelector('.quiz-start-btn');
            if (buttonWrap) {
                card.insertBefore(note, buttonWrap);
            } else {
                card.appendChild(note);
            }
        }

        if (note) {
            note.hidden = !state.locked;
            note.textContent = state.reason;
        }

        if (completedChip) {
            completedChip.hidden = !isCompleted;
        }
    });
}

function updateLabCompletionStates(attempts = []) {
    const completedQuizIds = getCompletedQuizIds(attempts);

    labCards.forEach((card) => {
        const labId = card.dataset.labCard;
        const attemptId = labConfigs[labId]?.attemptId || '';
        const completedChip = document.getElementById(`labCompletedChip-${labId}`);
        const isCompleted = Boolean(attemptId) && completedQuizIds.has(attemptId);

        card.classList.toggle('is-completed', isCompleted);

        if (completedChip) {
            completedChip.hidden = !isCompleted;
        }
    });
}

function getRecommendedQuizId(attempts = []) {
    const completedQuizIds = getCompletedQuizIds(attempts);

    for (const quizId of coreQuizIds) {
        if (!completedQuizIds.has(quizId)) {
            return quizId;
        }
    }

    for (const quizId of skillBuilderQuizIds) {
        if (!completedQuizIds.has(quizId)) {
            return quizId;
        }
    }

    for (const quizId of challengerQuizIds) {
        if (!completedQuizIds.has(quizId)) {
            return quizId;
        }
    }

    for (const quizId of advancedSeriesQuizIds) {
        if (!completedQuizIds.has(quizId)) {
            return quizId;
        }
    }

    for (const quizId of masterySeriesQuizIds) {
        if (!getQuizUnlockState(quizId, attempts).locked && !completedQuizIds.has(quizId)) {
            return quizId;
        }
    }

    for (const quizId of eliteSeriesQuizIds) {
        if (!getQuizUnlockState(quizId, attempts).locked && !completedQuizIds.has(quizId)) {
            return quizId;
        }
    }

    for (const quizId of expertSeriesQuizIds) {
        if (!getQuizUnlockState(quizId, attempts).locked && !completedQuizIds.has(quizId)) {
            return quizId;
        }
    }

    for (const quizId of proSeriesQuizIds) {
        if (!getQuizUnlockState(quizId, attempts).locked && !completedQuizIds.has(quizId)) {
            return quizId;
        }
    }

    for (const quizId of legendSeriesQuizIds) {
        if (!getQuizUnlockState(quizId, attempts).locked && !completedQuizIds.has(quizId)) {
            return quizId;
        }
    }

    for (const quizId of apexSeriesQuizIds) {
        if (!getQuizUnlockState(quizId, attempts).locked && !completedQuizIds.has(quizId)) {
            return quizId;
        }
    }

    const summaryByQuizId = new Map();
    attempts.forEach((attempt) => {
        const existing = summaryByQuizId.get(attempt.quizId) || {
            quizId: attempt.quizId,
            bestScore: -1,
            latestAttemptAt: ''
        };

        existing.bestScore = Math.max(existing.bestScore, Number(attempt.percentage || 0));
        existing.latestAttemptAt = existing.latestAttemptAt > attempt.createdAt
            ? existing.latestAttemptAt
            : attempt.createdAt;

        summaryByQuizId.set(attempt.quizId, existing);
    });

    const fallbackOrder = [...coreQuizIds, ...skillBuilderQuizIds, ...challengerQuizIds, ...advancedSeriesQuizIds, ...masterySeriesQuizIds, ...eliteSeriesQuizIds, ...expertSeriesQuizIds, ...proSeriesQuizIds, ...legendSeriesQuizIds, ...apexSeriesQuizIds];
    const reviewCandidate = [...summaryByQuizId.values()]
        .sort((left, right) => {
            if (left.bestScore !== right.bestScore) return left.bestScore - right.bestScore;
            if (left.latestAttemptAt !== right.latestAttemptAt) return left.latestAttemptAt.localeCompare(right.latestAttemptAt);
            return fallbackOrder.indexOf(left.quizId) - fallbackOrder.indexOf(right.quizId);
        })[0];

    return reviewCandidate?.quizId || coreQuizIds[0];
}

function updateQuizCardTierLabels() {
    const tierMap = {
        'url-basics': { badge: 'Core Series', difficulty: 'Beginner', accent: 'core', difficultyClass: 'easy' },
        'login-page-clues': { badge: 'Core Series', difficulty: 'Beginner', accent: 'core', difficultyClass: 'easy' },
        'message-red-flags': { badge: 'Core Series', difficulty: 'Intermediate', accent: 'core', difficultyClass: 'medium' },
        'after-clicking': { badge: 'Core Series', difficulty: 'Beginner', accent: 'core', difficultyClass: 'easy' },
        'qr-link-safety': { badge: 'Core Series', difficulty: 'Intermediate', accent: 'core', difficultyClass: 'medium' },
        'social-media-scams': { badge: 'Core Series', difficulty: 'Intermediate', accent: 'core', difficultyClass: 'medium' },
        'sender-source-checks': { badge: 'Skill Builder Series', difficulty: 'Intermediate', accent: 'skill-builder', difficultyClass: 'medium' },
        'attachment-download-safety': { badge: 'Skill Builder Series', difficulty: 'Intermediate', accent: 'skill-builder', difficultyClass: 'medium' },
        'account-recovery-traps': { badge: 'Skill Builder Series', difficulty: 'Hard', accent: 'skill-builder', difficultyClass: 'hard' },
        'form-data-requests': { badge: 'Skill Builder Series', difficulty: 'Hard', accent: 'skill-builder', difficultyClass: 'hard' },
        'payment-delivery-scams': { badge: 'Skill Builder Series', difficulty: 'Hard', accent: 'skill-builder', difficultyClass: 'hard' },
        'support-impersonation': { badge: 'Skill Builder Series', difficulty: 'Hard', accent: 'skill-builder', difficultyClass: 'hard' },
        'scholarship-bait': { badge: 'Challenger Series', difficulty: 'Hard', accent: 'challenger', difficultyClass: 'hard' },
        'document-sharing-traps': { badge: 'Challenger Series', difficulty: 'Hard', accent: 'challenger', difficultyClass: 'hard' },
        'mobile-alert-deception': { badge: 'Challenger Series', difficulty: 'Hard', accent: 'challenger', difficultyClass: 'hard' },
        'event-registration-risks': { badge: 'Challenger Series', difficulty: 'Hard', accent: 'challenger', difficultyClass: 'hard' },
        'marketplace-meetup-scams': { badge: 'Challenger Series', difficulty: 'Hard', accent: 'challenger', difficultyClass: 'hard' },
        'multi-step-phish-cases': { badge: 'Challenger Series', difficulty: 'Hard', accent: 'challenger', difficultyClass: 'hard' },
        'campus-portal-spoofs': { badge: 'Advanced Series', difficulty: 'Advanced', accent: 'advanced', difficultyClass: 'advanced' },
        'urgent-admin-fraud': { badge: 'Advanced Series', difficulty: 'Advanced', accent: 'advanced', difficultyClass: 'advanced' },
        'cloud-drive-compromise': { badge: 'Advanced Series', difficulty: 'Advanced', accent: 'advanced', difficultyClass: 'advanced' },
        'internship-hiring-scams': { badge: 'Advanced Series', difficulty: 'Advanced', accent: 'advanced', difficultyClass: 'advanced' },
        'verification-chain-attacks': { badge: 'Advanced Series', difficulty: 'Advanced', accent: 'advanced', difficultyClass: 'advanced' },
        'phishing-scenarios': { badge: 'Advanced Series', difficulty: 'Advanced', accent: 'advanced', difficultyClass: 'advanced' },
        'executive-impersonation': { badge: 'Mastery Series', difficulty: 'Mastery', accent: 'mastery', difficultyClass: 'mastery' },
        'breach-followup-scams': { badge: 'Mastery Series', difficulty: 'Mastery', accent: 'mastery', difficultyClass: 'mastery' },
        'recovery-flow-attacks': { badge: 'Mastery Series', difficulty: 'Mastery', accent: 'mastery', difficultyClass: 'mastery' },
        'financial-approval-fraud': { badge: 'Mastery Series', difficulty: 'Mastery', accent: 'mastery', difficultyClass: 'mastery' },
        'cross-channel-takeovers': { badge: 'Mastery Series', difficulty: 'Mastery', accent: 'mastery', difficultyClass: 'mastery' },
        'best-practices': { badge: 'Mastery Series', difficulty: 'Mastery', accent: 'mastery', difficultyClass: 'mastery' },
        'vendor-portal-breaches': { badge: 'Elite Series', difficulty: 'Elite', accent: 'elite', difficultyClass: 'hard' },
        'identity-chain-spoofs': { badge: 'Elite Series', difficulty: 'Elite', accent: 'elite', difficultyClass: 'hard' },
        'cloud-consent-traps': { badge: 'Elite Series', difficulty: 'Elite', accent: 'elite', difficultyClass: 'hard' },
        'incident-response-bait': { badge: 'Elite Series', difficulty: 'Elite', accent: 'elite', difficultyClass: 'hard' },
        'multi-actor-escalations': { badge: 'Elite Series', difficulty: 'Elite', accent: 'elite', difficultyClass: 'hard' },
        'trust-layer-collisions': { badge: 'Elite Series', difficulty: 'Elite', accent: 'elite', difficultyClass: 'hard' },
        'zero-trust-breakpoints': { badge: 'Expert Series', difficulty: 'Expert', accent: 'expert', difficultyClass: '' },
        'live-session-hijacks': { badge: 'Expert Series', difficulty: 'Expert', accent: 'expert', difficultyClass: '' },
        'delegated-access-fraud': { badge: 'Expert Series', difficulty: 'Expert', accent: 'expert', difficultyClass: '' },
        'forensic-cover-stories': { badge: 'Expert Series', difficulty: 'Expert', accent: 'expert', difficultyClass: '' },
        'approval-chain-poisoning': { badge: 'Expert Series', difficulty: 'Expert', accent: 'expert', difficultyClass: '' },
        'adaptive-impersonation-loops': { badge: 'Expert Series', difficulty: 'Expert', accent: 'expert', difficultyClass: '' },
        'supply-chain-shadowing': { badge: 'Pro Series', difficulty: 'Pro', accent: 'pro', difficultyClass: '' },
        'federated-login-pivots': { badge: 'Pro Series', difficulty: 'Pro', accent: 'pro', difficultyClass: '' },
        'trust-graph-manipulation': { badge: 'Pro Series', difficulty: 'Pro', accent: 'pro', difficultyClass: '' },
        'incident-command-spoofs': { badge: 'Pro Series', difficulty: 'Pro', accent: 'pro', difficultyClass: '' },
        'recovery-delegation-loops': { badge: 'Pro Series', difficulty: 'Pro', accent: 'pro', difficultyClass: '' },
        'environment-poisoning-cases': { badge: 'Pro Series', difficulty: 'Pro', accent: 'pro', difficultyClass: '' },
        'cross-tenant-bleedthrough': { badge: 'Legend Series', difficulty: 'Legend', accent: 'legend', difficultyClass: '' },
        'response-playbook-subversion': { badge: 'Legend Series', difficulty: 'Legend', accent: 'legend', difficultyClass: '' },
        'consent-laundering-rings': { badge: 'Legend Series', difficulty: 'Legend', accent: 'legend', difficultyClass: '' },
        'governance-theater-attacks': { badge: 'Legend Series', difficulty: 'Legend', accent: 'legend', difficultyClass: '' },
        'identity-weathering-loops': { badge: 'Legend Series', difficulty: 'Legend', accent: 'legend', difficultyClass: '' },
        'signal-fog-exploitation': { badge: 'Legend Series', difficulty: 'Legend', accent: 'legend', difficultyClass: '' },
        'trust-collapse-scenarios': { badge: 'Apex Series', difficulty: 'Apex', accent: 'apex', difficultyClass: '' },
        'operator-blend-intrusions': { badge: 'Apex Series', difficulty: 'Apex', accent: 'apex', difficultyClass: '' },
        'decision-fatigue-breaches': { badge: 'Apex Series', difficulty: 'Apex', accent: 'apex', difficultyClass: '' },
        'control-plane-misdirection': { badge: 'Apex Series', difficulty: 'Apex', accent: 'apex', difficultyClass: '' },
        'cognitive-overlap-attacks': { badge: 'Apex Series', difficulty: 'Apex', accent: 'apex', difficultyClass: '' },
        'irrecoverable-trust-failures': { badge: 'Apex Series', difficulty: 'Apex', accent: 'apex', difficultyClass: '' }
    };

    Object.entries(tierMap).forEach(([quizId, config]) => {
        const card = document.querySelector(`[data-quiz-card="${quizId}"]`);
        if (!card) return;

        const badge = card.querySelector('.quiz-badge');
        const difficulty = card.querySelector('.difficulty');

        if (badge) {
            badge.textContent = config.badge;
        }

        if (difficulty) {
            difficulty.textContent = config.difficulty;
            difficulty.classList.remove('easy', 'medium', 'hard', 'advanced', 'mastery');
            if (config.difficultyClass) {
                difficulty.classList.add(config.difficultyClass);
            }
        }

        card.classList.remove('is-core', 'is-beginner', 'is-intermediate', 'is-skill-builder', 'is-challenger', 'is-advanced', 'is-mastery', 'is-elite', 'is-expert', 'is-pro', 'is-legend', 'is-apex');
        if (config.accent) {
            card.classList.add(`is-${config.accent}`);
        }
    });
}

function setActiveQuizSidebarLink(targetId = '') {
    const normalizedTargetId = targetId === 'loginPageLab' ? 'labsPanel' : targetId;
    quizSidebarNavLinks.forEach((link) => {
        const href = link.getAttribute('href') || '';
        const isActive = href === `#${normalizedTargetId}`;
        link.classList.toggle('is-active', isActive);
        if (isActive) {
            link.setAttribute('aria-current', 'page');
        } else {
            link.removeAttribute('aria-current');
        }
    });
}

function shouldUseQuizSidebarDrawer() {
    return window.innerWidth <= 1024;
}

function syncQuizSidebarToggleState(isOpen) {
    if (quizSidebarToggle) {
        quizSidebarToggle.setAttribute('aria-expanded', String(isOpen));
        quizSidebarToggle.setAttribute('aria-label', isOpen ? 'Close quiz navigation' : 'Open quiz navigation');
    }
}

function isQuizSidebarDrawerOpen() {
    return document.body.classList.contains('quiz-sidebar-open') && shouldUseQuizSidebarDrawer();
}

function getQuizSidebarScrollableAncestor(target) {
    if (!(target instanceof Element) || !quizSidebar) return null;

    let current = target.closest('.quiz-sidebar-section, .quiz-sidebar');

    while (current && quizSidebar.contains(current)) {
        if (current.scrollHeight > current.clientHeight + 1) {
            return current;
        }
        current = current.parentElement?.closest('.quiz-sidebar-section, .quiz-sidebar') || null;
    }

    return null;
}

function handleQuizSidebarTouchStart(event) {
    if (!isQuizSidebarDrawerOpen()) return;
    quizSidebarTouchStartY = event.touches?.[0]?.clientY || 0;
}

function handleQuizSidebarTouchMove(event) {
    if (!isQuizSidebarDrawerOpen()) return;

    const target = event.target;
    if (!(target instanceof Element)) {
        event.preventDefault();
        return;
    }

    if (!quizSidebar?.contains(target)) {
        event.preventDefault();
        return;
    }

    const scrollableAncestor = getQuizSidebarScrollableAncestor(target);
    if (!scrollableAncestor) {
        event.preventDefault();
        return;
    }

    const currentY = event.touches?.[0]?.clientY || 0;
    const deltaY = currentY - quizSidebarTouchStartY;
    const atTop = scrollableAncestor.scrollTop <= 0;
    const atBottom = scrollableAncestor.scrollTop + scrollableAncestor.clientHeight >= scrollableAncestor.scrollHeight - 1;

    if ((atTop && deltaY > 0) || (atBottom && deltaY < 0)) {
        event.preventDefault();
    }
}

function lockQuizSidebarBackgroundScroll() {
    if (!shouldUseQuizSidebarDrawer()) return;

    lockedQuizSidebarScrollY = window.scrollY || window.pageYOffset || 0;
    document.documentElement.classList.add('quiz-sidebar-open');
    document.body.style.position = 'fixed';
    document.body.style.top = `-${lockedQuizSidebarScrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
}

function unlockQuizSidebarBackgroundScroll() {
    const scrollY = lockedQuizSidebarScrollY;

    document.documentElement.classList.remove('quiz-sidebar-open');
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.width = '';

    if (scrollY > 0) {
        window.scrollTo(0, scrollY);
    }

    lockedQuizSidebarScrollY = 0;
}

function closeQuizSidebarDrawer() {
    document.body.classList.remove('quiz-sidebar-open');
    unlockQuizSidebarBackgroundScroll();
    syncQuizSidebarToggleState(false);
}

function openQuizSidebarDrawer() {
    if (!shouldUseQuizSidebarDrawer()) return;
    lockQuizSidebarBackgroundScroll();
    document.body.classList.add('quiz-sidebar-open');
    syncQuizSidebarToggleState(true);
}

function toggleQuizSidebarDrawer() {
    if (document.body.classList.contains('quiz-sidebar-open')) {
        closeQuizSidebarDrawer();
        return;
    }

    openQuizSidebarDrawer();
}

function handleQuizSidebarCloseControl(event) {
    event.preventDefault();
    event.stopPropagation();
    closeQuizSidebarDrawer();
}

function setQuizAppView(view = 'quiz-library') {
    const signedIn = isLoggedIn();
    const quizLibraryOnly = view === 'quiz-library';
    const labsOnly = view === 'labs';
    const currentLabOnly = view === 'current-lab';
    const leaderboardOnly = view === 'leaderboard';
    const profileOnly = view === 'profile';
    const badgesOnly = view === 'badges';
    const historyOnly = view === 'history';
    const currentQuizOnly = view === 'current-quiz';

    if (quizProfilePanel) quizProfilePanel.hidden = !profileOnly;
    if (quizBadgesPanel) quizBadgesPanel.hidden = !badgesOnly;
    if (quizHistoryPanelSection) quizHistoryPanelSection.hidden = !historyOnly;
    if (quizLeaderboardPanel) quizLeaderboardPanel.hidden = !leaderboardOnly;
    if (quizzesSection) quizzesSection.hidden = !quizLibraryOnly;
    if (labsPanel) labsPanel.hidden = !labsOnly;
    if (loginPageLab) loginPageLab.hidden = !currentLabOnly;
    if (quizWorkspace) quizWorkspace.hidden = !currentQuizOnly || !currentQuizId;

    if (quizHistoryGuestPrompt) quizHistoryGuestPrompt.hidden = !historyOnly || signedIn;
    if (quizBadgesGuestPrompt) quizBadgesGuestPrompt.hidden = !badgesOnly || signedIn;
    if (quizProfileGuestPrompt) quizProfileGuestPrompt.hidden = !profileOnly || signedIn;
    if (quizHistoryList) quizHistoryList.hidden = historyOnly && !signedIn;
    if (quizHistoryEmpty) quizHistoryEmpty.hidden = historyOnly && !signedIn ? true : quizHistoryEmpty.hidden;
    if (quizHistoryToggleBtn) quizHistoryToggleBtn.hidden = true;
    if (quizHistoryPanelSection) {
        quizHistoryPanelSection.classList.toggle('is-guest-locked', historyOnly && !signedIn);
    }
    if (quizBadgesPanel) {
        quizBadgesPanel.classList.toggle('is-guest-locked', badgesOnly && !signedIn);
    }
    if (quizProfilePanel) {
        quizProfilePanel.classList.toggle('is-guest-locked', profileOnly && !signedIn);
    }
    if (quizProfileGrid) quizProfileGrid.hidden = profileOnly && !signedIn;
    if (quizBadgesList) quizBadgesList.hidden = badgesOnly && !signedIn;
}

function scrollToQuizSection(targetId, behavior = 'smooth') {
    if (!targetId) return;
    const target = document.getElementById(targetId);
    if (!target) return;

    if (isLoggedIn()) {
        if (targetId === 'quizLeaderboardPanel') {
            setQuizAppView('leaderboard');
        } else if (targetId === 'quizBadgesPanel') {
            setQuizAppView('badges');
        } else if (targetId === 'quizProfilePanel') {
            setQuizAppView('profile');
        } else if (targetId === 'quizHistoryPanel') {
            setQuizAppView('history');
        } else if (targetId === 'labsPanel') {
            setQuizAppView('labs');
        } else if (targetId === 'loginPageLab') {
            setQuizAppView('current-lab');
        } else if (targetId === 'quizWorkspace') {
            setQuizAppView('current-quiz');
        } else {
            setQuizAppView('quiz-library');
        }
    } else {
        if (targetId === 'quizLeaderboardPanel') {
            setQuizAppView('leaderboard');
        } else if (targetId === 'quizBadgesPanel') {
            setQuizAppView('badges');
        } else if (targetId === 'quizProfilePanel') {
            setQuizAppView('profile');
        } else if (targetId === 'quizHistoryPanel') {
            setQuizAppView('history');
        } else if (targetId === 'labsPanel') {
            setQuizAppView('labs');
        } else if (targetId === 'loginPageLab') {
            setQuizAppView('current-lab');
        } else if (targetId === 'quizWorkspace') {
            setQuizAppView('current-quiz');
        } else {
            setQuizAppView('quiz-library');
        }
    }

    setActiveQuizSidebarLink(targetId);
    target.scrollIntoView({ behavior, block: 'start' });
}

function syncQuizViewFromHash(behavior = 'auto') {
    const hash = String(window.location.hash || '').trim();
    if (!hash.startsWith('#')) return;

    const targetId = hash.slice(1);
    const target = document.getElementById(targetId);
    if (!target) return;

    scrollToQuizSection(targetId, behavior);
}

function bindQuizSidebarNavigation() {
    if (!quizSidebarNavLinks.length) return;

    quizSidebarNavLinks.forEach((link) => {
        link.addEventListener('click', (event) => {
            const href = link.getAttribute('href') || '';
            if (!href.startsWith('#')) return;

            const targetId = href.slice(1);
            const target = document.getElementById(targetId);
            if (!target) return;

            event.preventDefault();
            if (window.location.hash !== `#${targetId}`) {
                history.replaceState(null, '', `#${targetId}`);
            }
            scrollToQuizSection(targetId);
            closeQuizSidebarDrawer();
        });
    });
}

function applyQuizPageState() {
    const signedIn = isLoggedIn();
    const user = getStoredUser();
    const firstName =
        user?.name?.split?.(' ')?.[0] ||
        user?.username?.split?.(' ')?.[0] ||
        user?.email?.split?.('@')?.[0] ||
        'Student';
    const fullLabel = user?.name || user?.username || firstName;
    const compactLabel = firstName || fullLabel;
    const secondaryLabel = user?.email || 'Quiz account';

    document.body.classList.add('quiz-signed-in');

    if (signedIn) {
        if (quizSidebarLabel) quizSidebarLabel.textContent = 'Signed in as';
        if (quizSidebarName) quizSidebarName.textContent = compactLabel;
        if (quizSidebarEmail) quizSidebarEmail.textContent = secondaryLabel;
        if (quizMobileTopbarLabel) quizMobileTopbarLabel.textContent = compactLabel;
        if (quizProfileName) quizProfileName.textContent = fullLabel;
        if (quizProfileEmail) quizProfileEmail.textContent = secondaryLabel;
        syncQuizProfileNoteUi(user?.profileNote || '');
        if (quizSidebar) quizSidebar.hidden = false;
        if (quizMobileTopbar) quizMobileTopbar.hidden = false;
        if (quizSidebarAuthActions) quizSidebarAuthActions.hidden = true;
        if (quizSidebarLogoutBtn) quizSidebarLogoutBtn.hidden = false;
        if (quizSidebarProfileBtn) quizSidebarProfileBtn.disabled = false;

        if (quizSectionTitle) quizSectionTitle.textContent = 'Available Training';
        if (quizSectionDescription) {
            quizSectionDescription.textContent = 'Choose a quiz set and strengthen your phishing awareness one topic at a time.';
        }

        loadSignedInQuizData();
        setQuizAppView('quiz-library');
        updateQuizUnlockStates();
        updateLabCompletionStates();
        renderQuizPagination();
        renderLabsPagination();
    } else {
        if (quizSidebarLabel) quizSidebarLabel.textContent = 'Guest access';
        if (quizSidebarName) quizSidebarName.textContent = 'Guest User';
        if (quizSidebarEmail) quizSidebarEmail.textContent = 'Sign in to save progress';
        if (quizMobileTopbarLabel) quizMobileTopbarLabel.textContent = 'Guest mode';
        if (quizProfileName) quizProfileName.textContent = 'Guest User';
        if (quizProfileEmail) quizProfileEmail.textContent = 'Sign in to save progress';
        syncQuizProfileNoteUi('', 'Sign in to save a short profile note.');
        if (quizSidebar) quizSidebar.hidden = false;
        if (quizMobileTopbar) quizMobileTopbar.hidden = false;
        if (quizSidebarAuthActions) quizSidebarAuthActions.hidden = false;
        if (quizSidebarLogoutBtn) quizSidebarLogoutBtn.hidden = true;
        if (quizSidebarProfileBtn) quizSidebarProfileBtn.disabled = false;
        closeQuizSidebarDrawer();

        if (quizSectionTitle) quizSectionTitle.textContent = 'Available Training';
        if (quizSectionDescription) {
            quizSectionDescription.textContent = 'Choose a quiz set and strengthen your phishing awareness one topic at a time.';
        }

        signedInQuizAttempts = [];
        renderQuizHistory([], {
            listElement: quizHistoryList,
            emptyElement: quizHistoryEmpty,
            limit: 100
        });
        populateQuizProfile([]);
        loadPublicQuizLeaderboard();
        setQuizAppView('quiz-library');
        updateQuizUnlockStates();
        updateLabCompletionStates();
        renderQuizPagination();
        renderLabsPagination();
    }

}

async function loadPublicQuizLeaderboard() {
    try {
        const data = await apiFetch('/api/quiz/public-leaderboard');
        renderQuizLeaderboard(Array.isArray(data?.leaderboard) ? data.leaderboard : [], '', 2);
    } catch (error) {
        console.warn('Public quiz leaderboard fallback:', error.message || error);
        renderQuizLeaderboard([], '', 2);
    }
}

async function loadSignedInQuizData() {
    if (!isLoggedIn()) return;

    try {
        const [attemptData, leaderboardData, authData] = await Promise.all([
            apiFetch('/api/quiz/attempts'),
            apiFetch('/api/quiz/leaderboard'),
            apiFetch('/api/auth/me')
        ]);

        if (authData?.user) {
            setStoredUser(authData.user);

            const fullLabel = authData.user.name || authData.user.username || 'Student';
            const secondaryLabel = authData.user.email || 'Quiz account';

            if (quizSidebarName) quizSidebarName.textContent = fullLabel;
            if (quizSidebarEmail) quizSidebarEmail.textContent = secondaryLabel;
            if (quizMobileTopbarLabel) quizMobileTopbarLabel.textContent = fullLabel;
            if (quizProfileName) quizProfileName.textContent = fullLabel;
            if (quizProfileEmail) quizProfileEmail.textContent = secondaryLabel;
            syncQuizProfileNoteUi(authData.user.profileNote || '');
        }

        signedInQuizAttempts = Array.isArray(attemptData?.attempts) ? attemptData.attempts : [];
        signedInLeaderboardRank = Number.isFinite(Number(leaderboardData?.currentUserRank))
            ? Number(leaderboardData.currentUserRank)
            : null;
        syncBadgeUnlockToasts(signedInQuizAttempts);
        renderQuizHistory(signedInQuizAttempts, {
            listElement: quizHistoryList,
            emptyElement: quizHistoryEmpty,
            limit: 100
        });
        populateQuizProfile(signedInQuizAttempts);
        updateQuizUnlockStates(signedInQuizAttempts);
        updateLabCompletionStates(signedInQuizAttempts);
        renderQuizLeaderboard(
            Array.isArray(leaderboardData?.leaderboard) ? leaderboardData.leaderboard : [],
            leaderboardData?.currentUserId || '',
            leaderboardData?.minimumAttempts || 2
        );
        renderQuizPagination();
        renderLabsPagination();
    } catch (error) {
        console.warn('Quiz dashboard data fallback:', error.message || error);
        signedInQuizAttempts = [];
        signedInLeaderboardRank = null;
        hasInitializedBadgeUnlocks = false;
        unlockedBadgeSnapshot = new Set();
        renderQuizHistory([], {
            listElement: quizHistoryList,
            emptyElement: quizHistoryEmpty,
            limit: 100
        });
        populateQuizProfile([]);
        updateQuizUnlockStates([]);
        updateLabCompletionStates([]);
        renderQuizLeaderboard([], '', 2);
        renderQuizPagination();
        renderLabsPagination();
    }
}

async function saveSignedInAttempt(result) {
    if (!isLoggedIn()) return null;

    const response = await apiFetch('/api/quiz/attempts', {
        method: 'POST',
        body: JSON.stringify(result)
    });

    return response?.attempt || null;
}

async function saveQuizProfileNote() {
    if (!isLoggedIn() || !quizProfileNoteInput) return;

    const profileNote = quizProfileNoteInput.value.trim().slice(0, 120);
    syncQuizProfileNoteUi(profileNote, 'Saving note...', true);
    if (quizProfileNoteSaveBtn) quizProfileNoteSaveBtn.disabled = true;

    try {
        const response = await apiFetch('/api/auth/profile-note', {
            method: 'PATCH',
            body: JSON.stringify({ profileNote })
        });

        if (response?.user) {
            setStoredUser(response.user);
        }

        syncQuizProfileNoteUi(profileNote, profileNote ? 'Profile note saved.' : 'Profile note cleared.');
    } catch (error) {
        syncQuizProfileNoteUi(profileNote, error.message || 'Could not save profile note.', true);
    } finally {
        if (quizProfileNoteSaveBtn) quizProfileNoteSaveBtn.disabled = !isLoggedIn();
    }
}

function buildQuizAttemptReviewData(quiz, answerRecords = []) {
    return quiz.questions.map((question, questionIndex) => {
        const answerRecord = answerRecords.find((entry) => entry.questionIndex === questionIndex) || {};
        const selectedIndex = Number.isInteger(answerRecord.selected) ? answerRecord.selected : null;
        const correctIndex = Number.isInteger(question.answer) ? question.answer : null;

        return {
            questionIndex,
            topic: question.topic,
            prompt: question.prompt,
            options: Array.isArray(question.options) ? question.options : [],
            selectedIndex,
            correctIndex,
            selectedAnswer: selectedIndex !== null ? question.options[selectedIndex] || '' : '',
            correctAnswer: correctIndex !== null ? question.options[correctIndex] || '' : '',
            isCorrect: selectedIndex !== null && selectedIndex === correctIndex,
            explanation: question.explanation || ''
        };
    });
}

function getLabSpotLabel(spot = '') {
    const labels = {
        domain: 'Domain Check',
        urgency: 'Urgency Language',
        support: 'Support Contact',
        brand: 'Branding Claim',
        submit: 'Action Button'
    };

    return labels[spot] || String(spot || 'Clue')
        .replace(/[-_]+/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

function buildLabAttemptReviewData(labConfig, selectedSpots = []) {
    if (!labConfig) return [];

    const selectedSet = new Set(selectedSpots);
    const correctSpots = [...(labConfig.correctSpots || [])];
    const reviewSpots = Array.from(new Set([
        ...correctSpots,
        ...selectedSpots
    ]));

    return reviewSpots.map((spot, index) => {
        const isSelected = selectedSet.has(spot);
        const prompt = `Did you flag "${getLabSpotLabel(spot)}" as one of the strongest warning signs?`;

        return {
            questionIndex: index,
            topic: 'Lab Clue Review',
            prompt,
            options: ['Not flagged', 'Flagged'],
            selectedIndex: isSelected ? 1 : 0,
            correctIndex: 1,
            selectedAnswer: isSelected ? 'Flagged' : 'Not flagged',
            correctAnswer: 'Flagged',
            isCorrect: isSelected,
            explanation: labConfig.explanationMap?.[spot] || ''
        };
    });
}

function populateSignedInDashboard(attempts = []) {
    renderQuizHistory(attempts, {
        listElement: quizHistoryList,
        emptyElement: quizHistoryEmpty,
        limit: 100
    });
    populateQuizProfile(attempts);
}

function getQuizRankMeta(pointsCount = 0, averageScore = 0, completedSetsCount = 0) {
    const totalQuizCount = Object.keys(quizzes).length;
    const rankTiers = [
        {
            label: 'Newcomer',
            requirements: []
        },
        {
            label: 'Aware User',
            requirements: [
                { label: 'points', current: pointsCount, target: 80 },
                { label: 'average score', current: averageScore, target: 70 }
            ]
        },
        {
            label: 'Threat Spotter',
            requirements: [
                { label: 'points', current: pointsCount, target: 250 },
                { label: 'completed sets', current: completedSetsCount, target: 2 },
                { label: 'average score', current: averageScore, target: 72 }
            ]
        },
        {
            label: 'Awareness Expert',
            requirements: [
                { label: 'points', current: pointsCount, target: 500 },
                { label: 'completed sets', current: completedSetsCount, target: 4 },
                { label: 'average score', current: averageScore, target: 75 }
            ]
        },
        {
            label: 'Phish Hunter',
            requirements: [
                { label: 'points', current: pointsCount, target: 900 },
                { label: 'completed sets', current: completedSetsCount, target: 6 },
                { label: 'average score', current: averageScore, target: 78 }
            ]
        },
        {
            label: 'Security Specialist',
            requirements: [
                { label: 'points', current: pointsCount, target: 1500 },
                { label: 'completed sets', current: completedSetsCount, target: 9 },
                { label: 'average score', current: averageScore, target: 80 }
            ]
        },
        {
            label: 'Threat Analyst',
            requirements: [
                { label: 'points', current: pointsCount, target: 2400 },
                { label: 'completed sets', current: completedSetsCount, target: 13 },
                { label: 'average score', current: averageScore, target: 82 }
            ]
        },
        {
            label: 'PhishNet Defender',
            requirements: [
                { label: 'points', current: pointsCount, target: 3600 },
                { label: 'completed sets', current: completedSetsCount, target: 18 },
                { label: 'average score', current: averageScore, target: 84 }
            ]
        },
        {
            label: 'Elite Guardian',
            requirements: [
                { label: 'points', current: pointsCount, target: 5000 },
                { label: 'completed sets', current: completedSetsCount, target: 24 },
                { label: 'average score', current: averageScore, target: 86 }
            ]
        },
        {
            label: 'PhishNet Guardian',
            requirements: [
                { label: 'points', current: pointsCount, target: 6500 },
                { label: 'average score', current: averageScore, target: 88 },
                { label: 'completed sets', current: completedSetsCount, target: totalQuizCount }
            ]
        }
    ];

    let currentTierIndex = 0;
    for (let index = rankTiers.length - 1; index >= 0; index -= 1) {
        const tier = rankTiers[index];
        const earned = tier.requirements.every((requirement) => requirement.current >= requirement.target);
        if (earned) {
            currentTierIndex = index;
            break;
        }
    }

    const currentTier = rankTiers[currentTierIndex];
    const nextTier = rankTiers[currentTierIndex + 1] || null;
    const progressValue = nextTier
        ? Math.round(
            nextTier.requirements.reduce((total, requirement) => total + Math.min(requirement.current / requirement.target, 1), 0)
            / nextTier.requirements.length
            * 100
        )
        : 100;

    const progressText = !nextTier
        ? 'This user reached the highest awareness rank in the training system.'
        : `Working toward ${nextTier.label}.`;

    return {
        currentTier,
        nextTier,
        progressValue,
        progressText
    };
}

function populateQuizProfile(attempts = []) {
    const earnedPoints = getEarnedQuizPoints(attempts);

    if (quizProfileAttempts) {
        quizProfileAttempts.textContent = String(earnedPoints);
    }
    renderQuizBadges(attempts);
    renderQuizProfileBadges(attempts);

    if (!attempts.length) {
        if (quizProfileAverage) quizProfileAverage.textContent = '--';
        if (quizProfileBest) quizProfileBest.textContent = '0';
        if (quizProfileRank) quizProfileRank.textContent = 'Newcomer';
        if (quizProfileRankProgressFill) quizProfileRankProgressFill.style.width = '0%';
        if (quizProfileRankProgressText) {
            quizProfileRankProgressText.textContent = 'Complete signed-in training sets to begin earning awareness points and rank progress.';
        }
        if (quizProfileCompletedSets) quizProfileCompletedSets.textContent = '0';
        return;
    }

    const averageScore = Math.round(
        attempts.reduce((total, attempt) => total + Number(attempt.percentage || 0), 0) / attempts.length
    );
    const strongResults = getStrongQuizCount(attempts, 85);
    const completedQuizIds = getCompletedQuizIds(attempts);
    if (quizProfileAverage) quizProfileAverage.textContent = `${averageScore}%`;
    if (quizProfileBest) quizProfileBest.textContent = String(strongResults);
    if (quizProfileCompletedSets) {
        quizProfileCompletedSets.textContent = String(completedQuizIds.size);
    }
    const rankMeta = getQuizRankMeta(earnedPoints, averageScore, completedQuizIds.size);

    if (quizProfileRank) {
        quizProfileRank.textContent = rankMeta.currentTier.label;
    }

    if (quizProfileRankProgressFill) {
        quizProfileRankProgressFill.style.width = `${rankMeta.progressValue}%`;
    }

    if (quizProfileRankProgressText) {
        if (!rankMeta.nextTier) {
            quizProfileRankProgressText.textContent = 'You reached the highest awareness rank in the training system.';
        } else {
            const requirementCopy = rankMeta.nextTier.requirements
                .map((requirement) => {
                    if (requirement.label === 'points') return `${requirement.target} points`;
                    if (requirement.label === 'average score') return `${requirement.target}% average`;
                    if (requirement.label === 'completed sets') return `${requirement.target} completed training sets`;
                    return `${requirement.target} ${requirement.label}`;
                })
                .join(' and ');

            quizProfileRankProgressText.textContent = `Work toward ${rankMeta.nextTier.label} by reaching ${requirementCopy}.`;
        }
    }
}

function renderQuizProfileBadges(attempts = []) {
    if (!quizProfileBadgeList) return;

    const unlockedBadges = getQuizBadgeDefinitions(attempts).filter((badge) => badge.earned);

    if (quizProfileUnlockedBadgeCount) {
        quizProfileUnlockedBadgeCount.textContent = `${unlockedBadges.length} unlocked`;
    }

    quizProfileBadgeList.querySelectorAll('.quiz-profile-badge').forEach((item) => item.remove());

    if (!unlockedBadges.length) {
        if (quizProfileBadgeEmpty) quizProfileBadgeEmpty.hidden = false;
        return;
    }

    if (quizProfileBadgeEmpty) quizProfileBadgeEmpty.hidden = true;

    unlockedBadges.forEach((badge) => {
        const item = document.createElement('article');
        item.className = 'quiz-profile-badge is-earned';
        item.innerHTML = `
            <div class="quiz-profile-badge-top">
                <div class="quiz-profile-badge-icon" aria-hidden="true">${badge.icon}</div>
                <div class="quiz-profile-badge-main">
                    <strong>${badge.title}</strong>
                    <span>${badge.difficulty}</span>
                </div>
            </div>
            <p class="quiz-profile-badge-note">${badge.detail}</p>
        `;
        quizProfileBadgeList.appendChild(item);
    });
}

function getQuizBadgeDefinitions(attempts = []) {
    const averageScore = attempts.length
        ? Math.round(attempts.reduce((total, attempt) => total + Number(attempt.percentage || 0), 0) / attempts.length)
        : 0;
    const bestScore = attempts.reduce((best, attempt) => (
        Number(attempt.percentage || 0) > best ? Number(attempt.percentage || 0) : best
    ), 0);
    const uniqueTopics = new Set(attempts.map((attempt) => attempt.quizId)).size;
    const completedQuizIds = getCompletedQuizIds(attempts);
    const earnedPoints = getEarnedQuizPoints(attempts);
    const advancedCompleted = completedQuizIds.has('phishing-scenarios');
    const masteryCompleted = completedQuizIds.has('best-practices');
    const strongAttempts = getStrongQuizCount(attempts, 85);
    const needsReviewCleared = completedQuizIds.size;
    const allQuizIds = Object.keys(quizzes);

    return [
        {
            id: 'first-step',
            title: 'First Step',
            detail: 'Complete your first credited quiz set.',
            earned: completedQuizIds.size >= 1,
            difficulty: 'Starter',
            icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 3 7v6c0 5 3.84 9.74 9 11 5.16-1.26 9-6 9-11V7l-9-5Zm-1 14-4-4 1.41-1.41L11 13.17l5.59-5.58L18 9l-7 7Z"/></svg>'
        },
        {
            id: 'practice-streak',
            title: 'Practice Streak',
            detail: 'Earn at least 180 training points.',
            earned: earnedPoints >= 180,
            difficulty: 'Starter',
            icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z"/></svg>'
        },
        {
            id: 'steady-learner',
            title: 'Steady Learner',
            detail: 'Earn at least 300 training points.',
            earned: earnedPoints >= 300,
            difficulty: 'Starter',
            icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 4h14v2H5V4Zm0 7h10v2H5v-2Zm0 7h14v2H5v-2Zm12-8h2v8h-2v-8Z"/></svg>'
        },
        {
            id: 'sharp-eye',
            title: 'Sharp Eye',
            detail: 'Reach a best score of 90% or higher.',
            earned: bestScore >= 90,
            difficulty: 'Core',
            icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7Zm0 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm0-2.2A1.8 1.8 0 1 0 12 10a1.8 1.8 0 0 0 0 3.6Z"/></svg>'
        },
        {
            id: 'steady-awareness',
            title: 'Steady Awareness',
            detail: 'Maintain an average score of 75% or higher after earning points from at least 2 quiz sets.',
            earned: averageScore >= 75 && completedQuizIds.size >= 2,
            difficulty: 'Core',
            icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 17h3v4H3v-4Zm5-7h3v11H8V10Zm5 3h3v8h-3v-8Zm5-10h3v18h-3V3Z"/></svg>'
        },
        {
            id: 'topic-explorer',
            title: 'Topic Explorer',
            detail: 'Try at least 3 different quiz sets.',
            earned: uniqueTopics >= 3,
            difficulty: 'Core',
            icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 4 5v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V5l-8-3Zm1 14h-2v-2h2v2Zm0-4h-2V7h2v5Z"/></svg>'
        },
        {
            id: 'full-coverage',
            title: 'Full Coverage',
            detail: 'Complete the full core quiz path.',
            earned: coreQuizIds.every((quizId) => completedQuizIds.has(quizId)),
            difficulty: 'Core',
            icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5a2 2 0 0 0-2 2v14l4-4h12a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Zm-8 9-3-3 1.41-1.41L11 9.17l4.59-4.58L17 6l-6 6Z"/></svg>'
        },
        {
            id: 'strong-finisher',
            title: 'Strong Finisher',
            detail: 'Earn at least 3 strong quiz results of 85% or higher.',
            earned: strongAttempts >= 3,
            difficulty: 'Advanced',
            icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 9.5 7.2 4 8l4 3.9-.94 5.5L12 14.9l4.94 2.5-.94-5.5 4-3.9-5.5-.8L12 2Z"/></svg>'
        },
        {
            id: 'review-crusher',
            title: 'Review Crusher',
            detail: 'Earn credit in all 30 quiz sets.',
            earned: needsReviewCleared >= 30,
            difficulty: 'Advanced',
            icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 5H5v14h14V5Zm-8 11-4-4 1.4-1.4 2.6 2.58 4.6-4.59L17 10l-6 6Z"/></svg>'
        },
        {
            id: 'scenario-survivor',
            title: 'Scenario Survivor',
            detail: 'Finish the Phishing Scenarios quiz set.',
            earned: advancedCompleted,
            difficulty: 'Advanced',
            icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11 2h2v3h-2V2Zm6.36 2.64 1.41 1.41-2.12 2.12-1.41-1.41 2.12-2.12ZM4.22 6.05l1.41-1.41 2.12 2.12-1.41 1.41-2.12-2.12ZM12 7a5 5 0 0 0-5 5c0 1.74.89 3.27 2.23 4.17L8 22h8l-1.23-5.83A4.98 4.98 0 0 0 17 12a5 5 0 0 0-5-5Z"/></svg>'
        },
        {
            id: 'mastery-unlocked',
            title: 'Mastery Unlocked',
            detail: 'Finish the Best Practices capstone set.',
            earned: masteryCompleted,
            difficulty: 'Hard',
            icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 1 4 5v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V5l-8-4Zm3.54 8.46-4.25 4.25-2.12-2.12-1.41 1.41 3.53 3.54 5.66-5.66-1.41-1.42Z"/></svg>'
        },
        {
            id: 'guardian-grade',
            title: 'Guardian Grade',
            detail: 'Maintain an average score of 88% or higher after earning at least 500 training points.',
            earned: averageScore >= 88 && earnedPoints >= 500,
            difficulty: 'Hard',
            icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 4 5v6c0 5.25 3.44 10.14 8 11.76 4.56-1.62 8-6.51 8-11.76V5l-8-3Zm-1 15-3.5-3.5 1.41-1.41L11 14.17l4.59-4.58L17 11l-6 6Z"/></svg>'
        },
        {
            id: 'phishnet-complete',
            title: 'PhishNet Complete',
            detail: 'Save at least one completed attempt for every quiz set in the library.',
            earned: allQuizIds.every((quizId) => completedQuizIds.has(quizId)),
            difficulty: 'Hard',
            icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 2 7l10 5 8.16-4.08A3 3 0 0 1 21 10.4V17h-2v-5.6l-7 3.5L2 10v7l10 5 6-3v2.2L12 24 0 18V7l12-5Z"/></svg>'
        }
    ];
}

function getQuizBadgeIconMarkup(badgeId = '') {
    const iconMap = {
        'first-step': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 3 7v6c0 5 3.84 9.74 9 11 5.16-1.26 9-6 9-11V7l-9-5Zm-1 14-4-4 1.41-1.41L11 13.17l5.59-5.58L18 9l-7 7Z"/></svg>',
        'practice-streak': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z"/></svg>',
        'sharp-eye': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7Zm0 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm0-2.2A1.8 1.8 0 1 0 12 10a1.8 1.8 0 0 0 0 3.6Z"/></svg>',
        'steady-awareness': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 17h3v4H3v-4Zm5-7h3v11H8V10Zm5 3h3v8h-3v-8Zm5-10h3v18h-3V3Z"/></svg>',
        'steady-learner': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 4h14v2H5V4Zm0 7h10v2H5v-2Zm0 7h14v2H5v-2Zm12-8h2v8h-2v-8Z"/></svg>',
        'topic-explorer': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 4 5v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V5l-8-3Zm1 14h-2v-2h2v2Zm0-4h-2V7h2v5Z"/></svg>',
        'full-coverage': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5a2 2 0 0 0-2 2v14l4-4h12a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Zm-8 9-3-3 1.41-1.41L11 9.17l4.59-4.58L17 6l-6 6Z"/></svg>',
        'strong-finisher': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 9.5 7.2 4 8l4 3.9-.94 5.5L12 14.9l4.94 2.5-.94-5.5 4-3.9-5.5-.8L12 2Z"/></svg>',
        'review-crusher': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 5H5v14h14V5Zm-8 11-4-4 1.4-1.4 2.6 2.58 4.6-4.59L17 10l-6 6Z"/></svg>',
        'scenario-survivor': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11 2h2v3h-2V2Zm6.36 2.64 1.41 1.41-2.12 2.12-1.41-1.41 2.12-2.12ZM4.22 6.05l1.41-1.41 2.12 2.12-1.41 1.41-2.12-2.12ZM12 7a5 5 0 0 0-5 5c0 1.74.89 3.27 2.23 4.17L8 22h8l-1.23-5.83A4.98 4.98 0 0 0 17 12a5 5 0 0 0-5-5Z"/></svg>',
        'mastery-unlocked': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 1 4 5v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V5l-8-4Zm3.54 8.46-4.25 4.25-2.12-2.12-1.41 1.41 3.53 3.54 5.66-5.66-1.41-1.42Z"/></svg>',
        'guardian-grade': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 4 5v6c0 5.25 3.44 10.14 8 11.76 4.56-1.62 8-6.51 8-11.76V5l-8-3Zm-1 15-3.5-3.5 1.41-1.41L11 14.17l4.59-4.58L17 11l-6 6Z"/></svg>',
        'phishnet-complete': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 2 7l10 5 8.16-4.08A3 3 0 0 1 21 10.4V17h-2v-5.6l-7 3.5L2 10v7l10 5 6-3v2.2L12 24 0 18V7l12-5Z"/></svg>'
    };

    return iconMap[badgeId] || '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 4 5v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V5l-8-3Z"/></svg>';
}

function getUnlockedBadgeMap(attempts = []) {
    return new Map(
        getQuizBadgeDefinitions(attempts)
            .filter((badge) => badge.earned)
            .map((badge) => [badge.id, badge])
    );
}

function showNextAchievementToast() {
    if (!quizAchievementStack || activeAchievementToast || !achievementToastQueue.length) return;

    const badge = achievementToastQueue.shift();
    const toast = document.createElement('article');
    toast.className = 'quiz-achievement-toast';
    toast.innerHTML = `
        <div class="quiz-achievement-icon" aria-hidden="true">${badge.icon || getQuizBadgeIconMarkup(badge.id)}</div>
        <div class="quiz-achievement-copy">
            <span class="quiz-achievement-kicker">Badge Unlocked</span>
            <strong>${badge.title}</strong>
            <p>${badge.detail}</p>
        </div>
    `;

    quizAchievementStack.appendChild(toast);
    activeAchievementToast = toast;

    requestAnimationFrame(() => {
        toast.classList.add('is-visible');
    });

    window.setTimeout(() => {
        toast.classList.remove('is-visible');
        window.setTimeout(() => {
            toast.remove();
            if (activeAchievementToast === toast) {
                activeAchievementToast = null;
            }
            showNextAchievementToast();
        }, 220);
    }, 4200);
}

function queueBadgeUnlockToasts(badges = []) {
    if (!Array.isArray(badges) || !badges.length) return;
    achievementToastQueue.push(...badges);
    showNextAchievementToast();
}

function syncBadgeUnlockToasts(attempts = []) {
    const unlockedBadgeMap = getUnlockedBadgeMap(attempts);
    const currentUnlockedIds = new Set(unlockedBadgeMap.keys());

    if (!hasInitializedBadgeUnlocks) {
        unlockedBadgeSnapshot = currentUnlockedIds;
        hasInitializedBadgeUnlocks = true;
        return;
    }

    const newlyUnlockedBadges = [...currentUnlockedIds]
        .filter((badgeId) => !unlockedBadgeSnapshot.has(badgeId))
        .map((badgeId) => unlockedBadgeMap.get(badgeId))
        .filter(Boolean);

    unlockedBadgeSnapshot = currentUnlockedIds;

    if (newlyUnlockedBadges.length) {
        queueBadgeUnlockToasts(newlyUnlockedBadges);
    }
}

function createPlaceholderQuizCards() {
    if (!quizGrid) return;

    const desiredCardCount = totalQuizPages * maxAdaptiveQuizCardsPerPage;
    const placeholdersNeeded = Math.max(0, desiredCardCount - quizCards.length);
    const placeholderSeries = Array.from({ length: placeholdersNeeded }, () => ({
        label: 'Coming Soon',
        accentClass: '',
        title: 'Upcoming Quiz Set',
        difficulty: 'Soon'
    }));

    for (let index = 0; index < placeholdersNeeded; index += 1) {
        const seriesConfig = placeholderSeries[index] || {
            label: 'Coming Soon',
            accentClass: '',
            title: 'Upcoming Quiz Set',
            difficulty: 'Soon'
        };
        const placeholderId = `placeholder-extra-${index + 1}`;
        const card = document.createElement('article');
        card.className = `quiz-card quiz-card-placeholder is-locked ${seriesConfig.accentClass}`.trim();
        card.dataset.quizCard = placeholderId;
        card.innerHTML = `
            <div class="quiz-card-header">
                <span class="quiz-badge">${seriesConfig.label}</span>
            </div>
            <h3>${seriesConfig.title} ${index + 1}</h3>
            <p>Higher-tier phishing challenge sets will appear here as the training path expands into tougher, prestige-level stages.</p>
            <div class="quiz-meta">
                <span>New Set</span>
                <span>Preview</span>
                <span class="difficulty">${seriesConfig.difficulty}</span>
            </div>
            <button type="button" class="quiz-start-btn" disabled>Coming Soon</button>
        `;
        quizGrid.appendChild(card);
        quizCards.push(card);
    }
}

function createPlaceholderLabCards() {
    if (!labsGrid) return;

    const cardsPerPage = maxAdaptiveQuizCardsPerPage;
    const desiredCardCount = totalLabPages * cardsPerPage;
    const placeholdersNeeded = Math.max(0, desiredCardCount - labCards.length);
    const placeholderSeries = Array.from({ length: placeholdersNeeded }, () => ({
        label: 'Lab Coming Soon',
        accentClass: '',
        title: 'Upcoming Lab',
        difficulty: 'Soon'
    }));

    for (let index = 0; index < placeholdersNeeded; index += 1) {
        const seriesConfig = placeholderSeries[index] || {
            label: 'Lab Coming Soon',
            accentClass: '',
            title: 'Upcoming Lab',
            difficulty: 'Soon'
        };
        const placeholderId = `placeholder-lab-${index + 1}`;
        const card = document.createElement('article');
        card.className = `quiz-card quiz-card-placeholder is-locked ${seriesConfig.accentClass}`.trim();
        card.dataset.labCard = placeholderId;
        card.innerHTML = `
            <div class="quiz-card-header">
                <span class="quiz-badge">${seriesConfig.label}</span>
            </div>
            <h3>${seriesConfig.title} ${index + 1}</h3>
            <p>More hands-on phishing labs will appear here as we expand the practical training path with guided scenarios and inspection challenges.</p>
            <div class="quiz-meta">
                <span>New Lab</span>
                <span>Preview</span>
                <span class="difficulty ${seriesConfig.difficulty.toLowerCase().replace(/\s+/g, '-')}">${seriesConfig.difficulty}</span>
            </div>
            <button type="button" class="quiz-start-btn" disabled>Coming Soon</button>
        `;
        labsGrid.appendChild(card);
        labCards.push(card);
    }
}

function reorderQuizCardsForPagination() {
    if (!quizGrid || !quizCards.length) return;

    const priorityOrder = [
        'url-basics',
        'login-page-clues',
        'message-red-flags',
        'after-clicking',
        'qr-link-safety',
        'social-media-scams',
        'sender-source-checks',
        'attachment-download-safety',
        'account-recovery-traps',
        'form-data-requests',
        'payment-delivery-scams',
        'support-impersonation',
        'scholarship-bait',
        'document-sharing-traps',
        'mobile-alert-deception',
        'event-registration-risks',
        'marketplace-meetup-scams',
        'multi-step-phish-cases',
        'campus-portal-spoofs',
        'urgent-admin-fraud',
        'cloud-drive-compromise',
        'internship-hiring-scams',
        'verification-chain-attacks',
        'phishing-scenarios',
        'executive-impersonation',
        'breach-followup-scams',
        'recovery-flow-attacks',
        'financial-approval-fraud',
        'cross-channel-takeovers',
        'best-practices',
        'vendor-portal-breaches',
        'identity-chain-spoofs',
        'cloud-consent-traps',
        'incident-response-bait',
        'multi-actor-escalations',
        'trust-layer-collisions',
        'zero-trust-breakpoints',
        'live-session-hijacks',
        'delegated-access-fraud',
        'forensic-cover-stories',
        'approval-chain-poisoning',
        'adaptive-impersonation-loops',
        'supply-chain-shadowing',
        'federated-login-pivots',
        'trust-graph-manipulation',
        'incident-command-spoofs',
        'recovery-delegation-loops',
        'environment-poisoning-cases',
        'cross-tenant-bleedthrough',
        'response-playbook-subversion',
        'consent-laundering-rings',
        'governance-theater-attacks',
        'identity-weathering-loops',
        'signal-fog-exploitation',
        'trust-collapse-scenarios',
        'operator-blend-intrusions',
        'decision-fatigue-breaches',
        'control-plane-misdirection',
        'cognitive-overlap-attacks',
        'irrecoverable-trust-failures'
    ];

    const orderedCards = [];
    const seen = new Set();

    priorityOrder.forEach((cardId) => {
        const card = quizCards.find((item) => item.dataset.quizCard === cardId);
        if (card) {
            orderedCards.push(card);
            seen.add(card);
        }
    });

    quizCards.forEach((card) => {
        if (!seen.has(card)) {
            orderedCards.push(card);
        }
    });

    quizCards.length = 0;
    orderedCards.forEach((card) => {
        quizCards.push(card);
        quizGrid.appendChild(card);
    });
}

function hasCompletedCoreQuizPath(attempts = []) {
    const finishedQuizIds = getFinishedQuizIds(attempts);
    return coreQuizIds.every((quizId) => finishedQuizIds.has(quizId));
}

function hasCompletedSkillBuilderPath(attempts = []) {
    const finishedQuizIds = getFinishedQuizIds(attempts);
    return skillBuilderQuizIds.every((quizId) => finishedQuizIds.has(quizId));
}

function hasCompletedChallengerPath(attempts = []) {
    const finishedQuizIds = getFinishedQuizIds(attempts);
    return challengerQuizIds.every((quizId) => finishedQuizIds.has(quizId));
}

function hasCompletedAdvancedPath(attempts = []) {
    const finishedQuizIds = getFinishedQuizIds(attempts);
    return advancedSeriesQuizIds.every((quizId) => finishedQuizIds.has(quizId));
}

function getHighestAccessibleQuizPage(attempts = []) {
    if (!hasCompletedCoreQuizPath(attempts)) return 1;
    if (!hasCompletedSkillBuilderPath(attempts)) return 2;
    if (!hasCompletedChallengerPath(attempts)) return 3;
    if (!hasCompletedAdvancedPath(attempts)) return 4;
    return totalQuizPages;
}

function renderQuizPagination() {
    if (!quizPagination || !quizCards.length) return;
    const quizLibraryToolbar = document.getElementById('quizLibraryToolbar');
    const cardsPerPage = getQuizCardsPerPage();
    const guestPreviewCard = getGuestPreviewCard('quizzes');

    if (!isLoggedIn()) {
        quizCards.forEach((card, index) => {
            card.hidden = index >= guestQuizCardsPreviewCount;
        });
        if (guestPreviewCard) guestPreviewCard.hidden = false;
        quizPagination.innerHTML = '';
        quizPagination.hidden = true;
        if (quizLibraryToolbar) quizLibraryToolbar.hidden = true;
        return;
    }

    if (guestPreviewCard) guestPreviewCard.hidden = true;
    quizPagination.hidden = false;
    if (quizLibraryToolbar) quizLibraryToolbar.hidden = false;

    const totalPages = Math.max(totalQuizPages, Math.ceil(quizCards.length / cardsPerPage));
    currentQuizPage = Math.min(Math.max(currentQuizPage, 1), totalPages);

    quizCards.forEach((card, index) => {
        const pageNumber = Math.floor(index / cardsPerPage) + 1;
        card.hidden = pageNumber !== currentQuizPage;
    });

    quizPagination.innerHTML = '';

    for (let pageNumber = 1; pageNumber <= totalPages; pageNumber += 1) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = `quiz-page-tab${pageNumber === currentQuizPage ? ' is-active' : ''}`;
        button.textContent = String(pageNumber);
        button.setAttribute('aria-label', `Show quiz page ${pageNumber}`);
        if (pageNumber === currentQuizPage) {
            button.setAttribute('aria-current', 'page');
        }
        button.addEventListener('click', () => {
            currentQuizPage = pageNumber;
            renderQuizPagination();
            quizzesSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
        quizPagination.appendChild(button);
    }
}

function renderLabsPagination() {
    if (!labsPagination || !labCards.length) return;
    const labsLibraryToolbar = document.getElementById('labsLibraryToolbar');
    const cardsPerPage = getQuizCardsPerPage();
    const guestPreviewCard = getGuestPreviewCard('labs');

    if (!isLoggedIn()) {
        labCards.forEach((card, index) => {
            card.hidden = index >= guestQuizCardsPreviewCount;
        });
        if (guestPreviewCard) guestPreviewCard.hidden = false;
        labsPagination.innerHTML = '';
        labsPagination.hidden = true;
        if (labsLibraryToolbar) labsLibraryToolbar.hidden = true;
        return;
    }

    if (guestPreviewCard) guestPreviewCard.hidden = true;
    const totalPages = Math.max(totalLabPages, Math.ceil(labCards.length / cardsPerPage));
    currentLabPage = Math.min(Math.max(currentLabPage, 1), totalPages);

    labCards.forEach((card, index) => {
        const pageNumber = Math.floor(index / cardsPerPage) + 1;
        card.hidden = pageNumber !== currentLabPage;
    });

    labsPagination.hidden = false;
    if (labsLibraryToolbar) labsLibraryToolbar.hidden = false;
    labsPagination.innerHTML = '';

    for (let pageNumber = 1; pageNumber <= totalPages; pageNumber += 1) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = `quiz-page-tab${pageNumber === currentLabPage ? ' is-active' : ''}`;
        button.textContent = String(pageNumber);
        button.setAttribute('aria-label', `Show lab page ${pageNumber}`);
        if (pageNumber === currentLabPage) {
            button.setAttribute('aria-current', 'page');
        }
        button.addEventListener('click', () => {
            currentLabPage = pageNumber;
            renderLabsPagination();
            labsPanel?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
        labsPagination.appendChild(button);
    }
}

function renderQuizBadges(attempts = []) {
    if (!quizBadgesList) return;

    const badges = getQuizBadgeDefinitions(attempts);
    const unlockedCount = badges.filter((badge) => badge.earned).length;
    const hardCount = badges.filter((badge) => badge.difficulty === 'Hard' && badge.earned).length;

    if (quizBadgeUnlockedCount) quizBadgeUnlockedCount.textContent = String(unlockedCount);
    if (quizBadgeHardCount) quizBadgeHardCount.textContent = String(hardCount);
    if (quizBadgeTotalCount) quizBadgeTotalCount.textContent = String(badges.length);

    quizBadgesList.querySelectorAll('.quiz-profile-badge').forEach((item) => item.remove());

    if (!badges.some((badge) => badge.earned)) {
        if (quizBadgesEmpty) quizBadgesEmpty.hidden = false;
    } else if (quizBadgesEmpty) {
        quizBadgesEmpty.hidden = true;
    }

    badges.forEach((badge) => {
        const item = document.createElement('article');
        item.className = `quiz-profile-badge ${badge.earned ? 'is-earned' : 'is-locked'}`;
        item.innerHTML = `
            <div class="quiz-profile-badge-top">
                <div class="quiz-profile-badge-icon" aria-hidden="true">${badge.icon}</div>
                <div class="quiz-profile-badge-main">
                    <strong>${badge.title}</strong>
                    <span>${badge.earned ? 'Unlocked' : 'Locked'} · ${badge.difficulty}</span>
                </div>
            </div>
            <p class="quiz-profile-badge-note">${badge.detail}</p>
        `;
        quizBadgesList.appendChild(item);
    });
}

function renderQuizHistory(attempts, options = {}) {
    const {
        badgeElement = null,
        listElement = quizHistoryList,
        emptyElement = quizHistoryEmpty,
        limit = 6,
        compact = false
    } = options;

    if (!listElement) return;

    if (badgeElement) {
        badgeElement.textContent = `${attempts.length} attempt${attempts.length === 1 ? '' : 's'}`;
    }

    if (!attempts.length) {
        if (emptyElement) emptyElement.hidden = false;
        listElement.querySelectorAll('.quiz-history-item').forEach((item) => item.remove());
        if (listElement === quizHistoryList) {
            if (quizHistoryToggleBtn) quizHistoryToggleBtn.hidden = true;
        }
        return;
    }

    if (emptyElement) emptyElement.hidden = true;
    listElement.querySelectorAll('.quiz-history-item').forEach((item) => item.remove());

    attempts.slice(0, limit).forEach((attempt) => {
        const percentage = Math.round(Number(attempt.percentage || 0));
        const statusLabel = percentage >= 90
            ? 'Strong'
            : percentage >= 75
                ? 'Improving'
                : 'Needs Review';
        const item = document.createElement('article');
        const historyBandClass = percentage >= 90
            ? 'is-strong'
            : percentage >= 75
                ? 'is-improving'
                : 'is-needs-review';
        item.className = `quiz-history-item is-clickable ${historyBandClass}`;
        item.setAttribute('role', 'button');
        item.setAttribute('tabindex', '0');
        item.innerHTML = `
            <div class="quiz-history-main">
                <strong>${attempt.quizTitle}</strong>
                <span>${new Date(attempt.createdAt).toLocaleDateString()} - ${attempt.score}/${attempt.totalQuestions} correct</span>
            </div>
            <div class="quiz-history-side">
                <span class="quiz-history-status ${statusLabel.toLowerCase().replace(/\s+/g, '-')}">${statusLabel}</span>
                ${compact ? '' : '<span class="quiz-history-review-hint">View Review</span>'}
                <div class="quiz-history-score-wrap">
                    <span class="quiz-history-score">${percentage}%</span>
                    ${compact ? '' : '<span class="quiz-history-arrow" aria-hidden="true">&rsaquo;</span>'}
                </div>
            </div>
        `;
        item.addEventListener('click', () => openQuizAttemptReview(attempt.id));
        item.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openQuizAttemptReview(attempt.id);
            }
        });
            listElement.appendChild(item);
        });

    if (listElement === quizHistoryList && quizHistoryToggleBtn) {
        quizHistoryToggleBtn.hidden = true;
    }
}

async function openQuizAttemptReview(attemptId) {
    if (!attemptId || !quizAttemptReviewOverlay || !quizAttemptReviewBody) return;

    quizAttemptReviewOverlay.hidden = false;
    document.body.classList.add('modal-open');
    quizAttemptReviewBody.innerHTML = `
        <div class="quiz-history-empty">
            <strong>Loading attempt</strong>
            <p>Please wait while we load the quiz review.</p>
        </div>
    `;

    try {
        const data = await apiFetch(`/api/quiz/attempts/${attemptId}`);
        renderQuizAttemptReview(data?.attempt || null);
    } catch (error) {
        quizAttemptReviewBody.innerHTML = `
            <div class="quiz-history-empty">
                <strong>Could not load attempt</strong>
                <p>${escapeHtml(error.message || 'Please try again.')}</p>
            </div>
        `;
    }
}

function closeQuizAttemptReview() {
    if (!quizAttemptReviewOverlay) return;
    quizAttemptReviewOverlay.hidden = true;
    document.body.classList.remove('modal-open');
}

function renderQuizAttemptReview(attempt) {
    if (!quizAttemptReviewBody) return;
    if (!attempt) {
        quizAttemptReviewBody.innerHTML = `
            <div class="quiz-history-empty">
                <strong>Attempt not available</strong>
                <p>The quiz review could not be loaded right now.</p>
            </div>
        `;
        return;
    }

    const reviewData = Array.isArray(attempt.reviewData) ? attempt.reviewData : [];
    if (!reviewData.length) {
        quizAttemptReviewBody.innerHTML = `
            <div class="quiz-history-empty">
                <strong>No review data for this attempt</strong>
                <p>This attempt was saved before answer review was enabled. New attempts will show full right and wrong breakdowns here.</p>
            </div>
        `;
        return;
    }

    quizAttemptReviewBody.innerHTML = `
        <div class="quiz-attempt-review-summary">
            <div class="quiz-attempt-review-score">
                <span class="quiz-attempt-review-score-label">Score</span>
                <strong>${escapeHtml(Math.round(attempt.percentage))}%</strong>
            </div>
            <div class="quiz-attempt-review-copy">
                <p class="quiz-dashboard-kicker">Saved Result</p>
                <h4>${escapeHtml(attempt.quizTitle)}</h4>
                <p>${escapeHtml(`${attempt.score}/${attempt.totalQuestions} correct`)}</p>
                <span class="quiz-attempt-review-date">${escapeHtml(new Date(attempt.createdAt).toLocaleDateString())}</span>
            </div>
        </div>
        <div class="quiz-attempt-review-list">
            ${reviewData.map((item, index) => `
                <article class="quiz-attempt-review-item ${item.isCorrect ? 'is-correct' : 'is-incorrect'}">
                    <div class="quiz-attempt-review-head">
                        <div>
                            <p class="quiz-dashboard-kicker">Question ${index + 1}${item.topic ? ` - ${escapeHtml(item.topic)}` : ''}</p>
                            <h5>${escapeHtml(item.prompt || 'Question')}</h5>
                        </div>
                        <span class="quiz-attempt-review-status">${item.isCorrect ? 'Correct' : 'Review Needed'}</span>
                    </div>
                    <div class="quiz-attempt-review-answer-grid">
                        <div class="quiz-attempt-review-answer-card is-selected">
                            <span class="quiz-attempt-review-answer-label">Your Answer</span>
                            <strong>${escapeHtml(
                                Array.isArray(item.options) && Number.isInteger(item.selectedIndex)
                                    ? item.options[item.selectedIndex] || 'No answer selected'
                                    : 'No answer selected'
                            )}</strong>
                        </div>
                        <div class="quiz-attempt-review-answer-card is-correct">
                            <span class="quiz-attempt-review-answer-label">Correct Answer</span>
                            <strong>${escapeHtml(
                                Array.isArray(item.options) && Number.isInteger(item.correctIndex)
                                    ? item.options[item.correctIndex] || 'Correct answer unavailable'
                                    : 'Correct answer unavailable'
                            )}</strong>
                        </div>
                    </div>
                    ${item.explanation ? `
                        <div class="quiz-attempt-review-explanation">
                            <span class="quiz-attempt-review-answer-label">Why</span>
                            <p>${escapeHtml(item.explanation)}</p>
                        </div>
                    ` : ''}
                </article>
            `).join('')}
        </div>
    `;
}

function renderQuizLeaderboard(entries, currentUserId, minimumAttempts = 2) {
    if (!quizLeaderboardList) return;

    if (!entries.length) {
        if (quizLeaderboardEmpty) quizLeaderboardEmpty.hidden = false;
        const heading = quizLeaderboardEmpty.querySelector('strong');
        const copy = quizLeaderboardEmpty.querySelector('p');
        if (heading) heading.textContent = 'No leaderboard data yet';
        if (copy) copy.textContent = `The leaderboard appears once users have at least ${minimumAttempts} saved quiz attempts.`;
        quizLeaderboardList.querySelectorAll('.quiz-leaderboard-item').forEach((item) => item.remove());
        return;
    }

    if (quizLeaderboardEmpty) quizLeaderboardEmpty.hidden = true;
    quizLeaderboardList.querySelectorAll('.quiz-leaderboard-item').forEach((item) => item.remove());

    entries.forEach((entry) => {
        const item = document.createElement('article');
        item.className = 'quiz-leaderboard-item is-clickable';
        if (entry.rank === 1) item.classList.add('is-rank-1');
        if (entry.rank === 2) item.classList.add('is-rank-2');
        if (entry.rank === 3) item.classList.add('is-rank-3');
        if (currentUserId && entry.userId === currentUserId) {
            item.classList.add('is-current-user');
        }
        item.setAttribute('role', 'button');
        item.setAttribute('tabindex', '0');

        item.innerHTML = `
            <div class="quiz-leaderboard-rank">#${entry.rank}</div>
            <div class="quiz-leaderboard-main">
                <strong>${entry.name}</strong>
                <span>${entry.earnedPoints || 0} pts - ${entry.completedSetsCount || 0} completed</span>
            </div>
            <div class="quiz-leaderboard-score-wrap">
                <span class="quiz-leaderboard-score-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 3 9.5 8H4l4.2 4.1-.99 5.79L12 15.2l4.79 2.69L15.8 12 20 8h-5.5L12 3Z"/>
                    </svg>
                </span>
                <div class="quiz-leaderboard-score-block">
                    <span class="quiz-leaderboard-score-label">Average Score</span>
                    <div class="quiz-leaderboard-score">${Math.round(entry.averageScore)}%</div>
                </div>
            </div>
        `;
        item.addEventListener('click', () => openPublicQuizProfile(entry.userId));
        item.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openPublicQuizProfile(entry.userId);
            }
        });
        quizLeaderboardList.appendChild(item);
    });
}

async function openPublicQuizProfile(userId) {
    if (!quizPublicProfileOverlay || !quizPublicProfileBody || !userId) return;

    quizPublicProfileOverlay.hidden = false;
    document.body.classList.add('modal-open');
    quizPublicProfileBody.innerHTML = `
        <div class="quiz-history-empty">
            <strong>Loading profile</strong>
            <p>Please wait while we load the public quiz stats.</p>
        </div>
    `;

    try {
        const data = await apiFetch(`/api/quiz/public-profile/${userId}`);
        renderPublicQuizProfile(data?.profile || null);
    } catch (error) {
        quizPublicProfileBody.innerHTML = `
            <div class="quiz-history-empty">
                <strong>Could not load profile</strong>
                <p>${escapeHtml(error.message || 'Please try again.')}</p>
            </div>
        `;
    }
}

function closePublicQuizProfile() {
    if (!quizPublicProfileOverlay) return;
    quizPublicProfileOverlay.hidden = true;
    document.body.classList.remove('modal-open');
}

function renderPublicQuizProfile(profile) {
    if (!quizPublicProfileBody) return;
    if (!profile) {
        quizPublicProfileBody.innerHTML = `
            <div class="quiz-history-empty">
                <strong>Profile not available</strong>
                <p>The public quiz profile could not be loaded right now.</p>
            </div>
        `;
        return;
    }

    const lastAttempt = profile.lastAttemptAt
        ? new Date(profile.lastAttemptAt).toLocaleDateString()
        : 'No attempts yet';

    const badges = Array.isArray(profile.badges) ? profile.badges : [];
    const unlockedBadges = badges.filter((badge) => badge.earned);
    const topics = Array.isArray(profile.topics) ? profile.topics : [];
    const completedSetsCount = topics.length;
    const rankMeta = getQuizRankMeta(profile.earnedPoints || 0, Math.round(profile.averageScore || 0), completedSetsCount);
    const note = String(profile.profileNote || '').trim();
    const shouldCollapseBadges = unlockedBadges.length > 6;

    quizPublicProfileBody.innerHTML = `
        <div class="quiz-public-profile-grid">
            <div class="quiz-public-profile-summary">
                <section class="quiz-public-profile-hero">
                    <div class="quiz-public-profile-top">
                        <div class="quiz-public-profile-head">
                            <div class="quiz-public-profile-avatar" aria-hidden="true">
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5Zm0 2c-3.33 0-10 1.67-10 5v3h20v-3c0-3.33-6.67-5-10-5Z"/>
                                </svg>
                            </div>
                            <div>
                                <p class="quiz-dashboard-kicker">Public Profile</p>
                                <h4>${escapeHtml(profile.name)}</h4>
                                <p class="quiz-public-profile-subtext">Last saved attempt: ${escapeHtml(lastAttempt)}</p>
                            </div>
                        </div>
                        <span class="quiz-public-profile-rank-chip">${escapeHtml(rankMeta.currentTier.label)}</span>
                    </div>

                    <div class="quiz-public-profile-rank-meter">
                        <div class="quiz-public-profile-rank-meter-bar" aria-hidden="true">
                            <span style="width: ${Math.max(0, Math.min(100, rankMeta.progressValue))}%"></span>
                        </div>
                        <p class="quiz-public-profile-rank-copy">${escapeHtml(rankMeta.progressText)}</p>
                    </div>

                    <div class="quiz-public-profile-note">
                        <span class="quiz-public-profile-note-label">About</span>
                        <p>${escapeHtml(note || 'This user has not added a public profile note yet.')}</p>
                    </div>

                        <div class="quiz-public-profile-stat-grid">
                            <div class="quiz-public-profile-stat">
                                <span>Earned Points</span>
                                <strong>${escapeHtml(profile.earnedPoints || 0)}</strong>
                            </div>
                        <div class="quiz-public-profile-stat">
                            <span>Average Score</span>
                            <strong>${escapeHtml(Math.round(profile.averageScore || 0))}%</strong>
                        </div>
                        <div class="quiz-public-profile-stat">
                            <span>85%+ Results</span>
                            <strong>${escapeHtml(profile.strongResultsCount || 0)}</strong>
                        </div>
                        <div class="quiz-public-profile-stat">
                            <span>Complete</span>
                            <strong>${escapeHtml(completedSetsCount || 0)}</strong>
                        </div>
                    </div>
                </section>

                <section class="quiz-public-profile-card">
                    <div class="quiz-history-heading">
                        <div>
                            <p class="quiz-dashboard-kicker">Earned Badges</p>
                            <h3>Awareness Milestones</h3>
                        </div>
                        <span class="quiz-history-badge">${unlockedBadges.length} unlocked</span>
                    </div>
                    <div class="quiz-public-profile-badges ${shouldCollapseBadges ? 'is-collapsed' : ''}" id="quizPublicProfileBadges">
                        ${unlockedBadges.length ? unlockedBadges.map((badge) => `
                            <article
                                class="quiz-public-profile-badge ${badge.earned ? 'is-earned' : ''}"
                                title="${escapeHtml(`${badge.title} - ${badge.earned ? 'Unlocked' : 'Locked'}`)}"
                                aria-label="${escapeHtml(`${badge.title} - ${badge.earned ? 'Unlocked' : 'Locked'}`)}"
                            >
                                <span class="quiz-public-profile-badge-icon" aria-hidden="true">${getQuizBadgeIconMarkup(badge.id)}</span>
                            </article>
                        `).join('') : `
                            <div class="quiz-history-empty">
                                <strong>No public badges yet</strong>
                                <p>This user has not unlocked any public awareness badges yet.</p>
                            </div>
                        `}
                    </div>
                    ${shouldCollapseBadges ? `
                        <div class="quiz-public-profile-badge-actions">
                            <button type="button" class="quiz-history-toggle-btn" id="quizPublicProfileBadgesToggleBtn">See More</button>
                        </div>
                    ` : ''}
                </section>
            </div>
        </div>
    `;

    const badgesToggleBtn = document.getElementById('quizPublicProfileBadgesToggleBtn');
    const badgesWrap = document.getElementById('quizPublicProfileBadges');

    badgesToggleBtn?.addEventListener('click', () => {
        const isExpanded = badgesWrap?.classList.toggle('is-expanded');
        badgesToggleBtn.textContent = isExpanded ? 'Show Less' : 'See More';
    });
}

function getScoreSummary(percentage) {
    if (percentage >= 90) {
        return 'Strong awareness. You consistently noticed the safer choices in these phishing-related situations.';
    }
    if (percentage >= 75) {
        return 'Good awareness overall. You caught most of the warning signs, but a few situations still need more caution.';
    }
    if (percentage >= 50) {
        return 'Fair start. You noticed some phishing signals, but more practice will help you react more safely.';
    }
    return 'This quiz needs another pass. Focus on checking links carefully, verifying requests, and slowing down before acting.';
}

function getQuizGradeClass(grade) {
    return `grade-${String(grade || 'f').toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
}

function updateWorkspaceVisibility(showResults = false) {
    if (!quizWorkspace) return;
    quizWorkspace.hidden = false;
    quizQuestionCard.hidden = showResults;
    quizResultCard.hidden = !showResults;
}

function scrollToWorkspace() {
    scrollToQuizSection('quizWorkspace');
}

function renderQuestion() {
    const quiz = quizzes[currentQuizId];
    const question = quiz?.questions[currentQuestionIndex];
    if (!quiz || !question) return;

    selectedAnswerIndex = null;
    quizSessionTitle.textContent = quiz.title;
    quizSessionDesc.textContent = quiz.description;
    quizQuestionTopic.textContent = `${quiz.title} - ${question.topic}`;
    quizQuestionText.textContent = question.prompt;
    quizQuestionCounter.textContent = `Question ${currentQuestionIndex + 1} of ${quiz.questions.length}`;
    quizProgressFill.style.width = `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%`;
    quizFeedback.hidden = true;
    quizFeedback.innerHTML = '';
    quizNextBtn.disabled = true;
    quizNextBtn.textContent = currentQuestionIndex === quiz.questions.length - 1 ? 'Finish Quiz' : 'Next Question';

    quizOptions.innerHTML = '';

    question.options.forEach((option, optionIndex) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'quiz-option';
        button.innerHTML = `
            <span class="quiz-option-key">${String.fromCharCode(65 + optionIndex)}</span>
            <span class="quiz-option-text">${option}</span>
        `;
        button.addEventListener('click', () => handleAnswerSelection(optionIndex));
        quizOptions.appendChild(button);
    });

    updateWorkspaceVisibility(false);
}

function handleAnswerSelection(optionIndex) {
    if (selectedAnswerIndex !== null) return;

    const quiz = quizzes[currentQuizId];
    const question = quiz.questions[currentQuestionIndex];
    const optionButtons = [...quizOptions.querySelectorAll('.quiz-option')];
    selectedAnswerIndex = optionIndex;

    const isCorrect = optionIndex === question.answer;
    if (isCorrect) score += 1;

    answers.push({
        questionIndex: currentQuestionIndex,
        selected: optionIndex,
        correct: question.answer,
        isCorrect
    });

    optionButtons.forEach((button, index) => {
        button.disabled = true;
        if (index === question.answer) {
            button.classList.add('is-correct');
        }
        if (index === optionIndex && !isCorrect) {
            button.classList.add('is-incorrect');
        }
        if (index === optionIndex) {
            button.classList.add('is-selected');
        }
    });

    quizFeedback.hidden = false;
    quizFeedback.innerHTML = `<strong>${isCorrect ? 'Correct.' : 'Not quite.'}</strong> ${question.explanation}`;
    quizNextBtn.disabled = false;
}

function showResults() {
    const quiz = quizzes[currentQuizId];
    const totalQuestions = quiz.questions.length;
    const percentage = Math.round((score / totalQuestions) * 100);

    quizResultScore.textContent = `${percentage}%`;
    quizResultTitle.textContent = percentage >= 75 ? 'Good phishing awareness result' : 'Keep building your phishing awareness';
    quizResultSummary.textContent = getScoreSummary(percentage);
    quizCorrectCount.textContent = `${score} / ${totalQuestions}`;
    quizResultQuizName.textContent = quiz.title;
    if (quizResultCard) {
        quizResultCard.classList.remove(
            'grade-a-plus',
            'grade-a',
            'grade-b-plus',
            'grade-b',
            'grade-c-plus',
            'grade-c',
            'grade-d',
            'grade-f'
        );
        if (percentage >= 95) quizResultCard.classList.add(getQuizGradeClass('A+'));
        else if (percentage >= 90) quizResultCard.classList.add(getQuizGradeClass('A'));
        else if (percentage >= 85) quizResultCard.classList.add(getQuizGradeClass('B+'));
        else if (percentage >= 80) quizResultCard.classList.add(getQuizGradeClass('B'));
        else if (percentage >= 75) quizResultCard.classList.add(getQuizGradeClass('C+'));
        else if (percentage >= 70) quizResultCard.classList.add(getQuizGradeClass('C'));
        else if (percentage >= 65) quizResultCard.classList.add(getQuizGradeClass('D'));
        else quizResultCard.classList.add(getQuizGradeClass('F'));
    }

    if (isLoggedIn()) {
        guestQuizPrompt.hidden = true;
        saveSignedInAttempt({
            quizId: currentQuizId,
            quizTitle: quiz.title,
            score,
            totalQuestions,
            percentage,
            reviewData: buildQuizAttemptReviewData(quiz, answers)
        }).then(() => {
            loadSignedInQuizData();
        }).catch((error) => {
            console.warn('Quiz attempt save failed:', error.message || error);
        });
    } else {
        guestQuizPrompt.hidden = false;
    }

    updateWorkspaceVisibility(true);
    scrollToWorkspace();
}

function startQuiz(quizId) {
    if (!quizzes[quizId]) return;

    currentQuizId = quizId;
    currentQuestionIndex = 0;
    selectedAnswerIndex = null;
    score = 0;
    answers = [];

    setQuizAppView('current-quiz');

    renderQuestion();
    scrollToWorkspace();
}

function resetQuizWorkspace() {
    currentQuizId = null;
    currentQuestionIndex = 0;
    selectedAnswerIndex = null;
    score = 0;
    answers = [];

    if (quizWorkspace) quizWorkspace.hidden = true;
    if (quizFeedback) {
        quizFeedback.hidden = true;
        quizFeedback.innerHTML = '';
    }

    setQuizAppView('quiz-library');
}

function resetLoginPageLabState() {
    if (loginPageLabSpotTargets.length) {
        loginPageLabSpotTargets.forEach((button) => {
            button.classList.remove('is-selected');
            button.setAttribute('aria-pressed', 'false');
        });
    }

    if (loginPageLabSelectionCount) {
        loginPageLabSelectionCount.textContent = `0 / ${activeLabConfig?.correctSpots?.size || 3}`;
    }

    if (loginPageLabFeedback) {
        loginPageLabFeedback.hidden = true;
        loginPageLabFeedback.className = 'lab-feedback-card';
        loginPageLabFeedback.innerHTML = '';
    }

    if (loginPageLabSubmit) {
        loginPageLabSubmit.hidden = false;
        loginPageLabSubmit.disabled = false;
    }
    if (loginPageLabReset) loginPageLabReset.hidden = true;
}

function syncLoginPageLabContent(labId = 'login-page-check') {
    activeLabId = labId in labConfigs ? labId : 'login-page-check';
    activeLabConfig = labConfigs[activeLabId];
    if (!activeLabConfig) return;
    const isEmailMode = activeLabConfig.renderMode === 'email';
    const isPosterMode = activeLabConfig.renderMode === 'poster';

    if (loginPageLabTitle) loginPageLabTitle.textContent = activeLabConfig.title;
    if (loginPageLabDescription) loginPageLabDescription.textContent = activeLabConfig.description;
    if (loginPageLabBriefLabel) loginPageLabBriefLabel.textContent = activeLabConfig.briefLabel;
    if (loginPageLabChannel) loginPageLabChannel.textContent = activeLabConfig.channel;
    if (loginPageLabScenarioTitle) loginPageLabScenarioTitle.textContent = activeLabConfig.scenarioTitle;
    if (loginPageLabScenarioBody) loginPageLabScenarioBody.innerHTML = activeLabConfig.scenarioBody;
    if (loginPageLabUrl) loginPageLabUrl.textContent = activeLabConfig.previewUrl;
    if (loginPageLabBrandTitle) loginPageLabBrandTitle.textContent = activeLabConfig.brandTitle;
    if (loginPageLabBrandSubtitle) loginPageLabBrandSubtitle.textContent = activeLabConfig.brandSubtitle;
    if (loginPageLabAlert) loginPageLabAlert.textContent = activeLabConfig.alertText;
    if (loginPageLabPrimaryLabel) loginPageLabPrimaryLabel.textContent = activeLabConfig.primaryLabel;
    if (loginPageLabPrimaryValue) loginPageLabPrimaryValue.value = activeLabConfig.primaryValue;
    if (loginPageLabSecondaryLabel) loginPageLabSecondaryLabel.textContent = activeLabConfig.secondaryLabel;
    if (loginPageLabSecondaryValue) loginPageLabSecondaryValue.value = activeLabConfig.secondaryValue;
    if (loginPageLabSubmitLabel) loginPageLabSubmitLabel.textContent = activeLabConfig.submitLabel;
    if (loginPageLabSupport) loginPageLabSupport.textContent = activeLabConfig.supportText;
    if (loginPageLabChecklistTitle) loginPageLabChecklistTitle.textContent = activeLabConfig.checklistTitle;
    if (loginPageLabChecklistCopy) loginPageLabChecklistCopy.textContent = activeLabConfig.checklistCopy;

    const fakeLogin = loginPageLab?.querySelector('.lab-fake-login');
    if (fakeLogin) fakeLogin.hidden = isEmailMode;
    if (labEmailPreview) labEmailPreview.hidden = !isEmailMode;

    if (isEmailMode) {
        if (labEmailSenderLine) labEmailSenderLine.innerHTML = `<strong>From:</strong> Registrar Office &lt;records@maildesk-center.net&gt;`;
        if (labEmailReplyToLine) labEmailReplyToLine.innerHTML = `<strong>Reply-To:</strong> registrar-update@maildesk-center.net`;
        if (labEmailSubjectLine) labEmailSubjectLine.innerHTML = `<strong>Subject:</strong> Enrollment record needs confirmation today`;
        if (labEmailBanner) labEmailBanner.textContent = activeLabConfig.alertText;
        if (labEmailBody) {
            labEmailBody.innerHTML = `
                <p>Hello student,</p>
                <p>Your enrollment details need same-day correction before records close. Review the account notice and confirm your information at once.</p>
                <p>Use the button below to continue.</p>
            `;
        }
        if (labEmailCta) labEmailCta.textContent = activeLabConfig.submitLabel;
        if (labEmailFooter) labEmailFooter.textContent = `${activeLabConfig.brandTitle} • ${activeLabConfig.brandSubtitle}`;
    }
}

function syncLoginPageLabContent(labId = 'login-page-check') {
    activeLabId = labId in labConfigs ? labId : 'login-page-check';
    activeLabConfig = labConfigs[activeLabId];
    if (!activeLabConfig) return;

    const isEmailMode = activeLabConfig.renderMode === 'email';
    const isPosterMode = activeLabConfig.renderMode === 'poster';

    if (loginPageLabTitle) loginPageLabTitle.textContent = activeLabConfig.title;
    if (loginPageLabDescription) loginPageLabDescription.textContent = activeLabConfig.description;
    if (loginPageLabBriefLabel) loginPageLabBriefLabel.textContent = activeLabConfig.briefLabel;
    if (loginPageLabChannel) loginPageLabChannel.textContent = activeLabConfig.channel;
    if (loginPageLabScenarioTitle) loginPageLabScenarioTitle.textContent = activeLabConfig.scenarioTitle;
    if (loginPageLabScenarioBody) loginPageLabScenarioBody.innerHTML = activeLabConfig.scenarioBody;
    if (loginPageLabUrl) loginPageLabUrl.textContent = activeLabConfig.previewUrl;
    if (loginPageLabBrandTitle) loginPageLabBrandTitle.textContent = activeLabConfig.brandTitle;
    if (loginPageLabBrandSubtitle) loginPageLabBrandSubtitle.textContent = activeLabConfig.brandSubtitle;
    if (loginPageLabAlert) loginPageLabAlert.textContent = activeLabConfig.alertText;
    if (loginPageLabPrimaryLabel) loginPageLabPrimaryLabel.textContent = activeLabConfig.primaryLabel;
    if (loginPageLabPrimaryValue) loginPageLabPrimaryValue.value = activeLabConfig.primaryValue;
    if (loginPageLabSecondaryLabel) loginPageLabSecondaryLabel.textContent = activeLabConfig.secondaryLabel;
    if (loginPageLabSecondaryValue) loginPageLabSecondaryValue.value = activeLabConfig.secondaryValue;
    if (loginPageLabSubmitLabel) loginPageLabSubmitLabel.textContent = activeLabConfig.submitLabel;
    if (loginPageLabSupport) loginPageLabSupport.textContent = activeLabConfig.supportText;
    if (loginPageLabChecklistTitle) loginPageLabChecklistTitle.textContent = activeLabConfig.checklistTitle;
    if (loginPageLabChecklistCopy) loginPageLabChecklistCopy.textContent = activeLabConfig.checklistCopy;

    if (labBrowserBar) labBrowserBar.hidden = isEmailMode || isPosterMode;
    if (loginPageLabUrl) loginPageLabUrl.hidden = isEmailMode || isPosterMode;
    if (labFakeLogin) labFakeLogin.hidden = isEmailMode || isPosterMode;
    if (labEmailPreview) labEmailPreview.hidden = !isEmailMode;
    if (labPosterPreview) labPosterPreview.hidden = !isPosterMode;

    if (isEmailMode) {
        if (labEmailSenderLine) labEmailSenderLine.innerHTML = `<strong>From:</strong> ${activeLabConfig.senderLine || ''}`;
        if (labEmailReplyToLine) labEmailReplyToLine.innerHTML = `<strong>Reply-To:</strong> ${activeLabConfig.replyToLine || ''}`;
        if (labEmailSubjectLine) labEmailSubjectLine.innerHTML = `<strong>Subject:</strong> ${activeLabConfig.subjectLine || ''}`;
        if (labEmailBanner) labEmailBanner.textContent = activeLabConfig.alertText;
        if (labEmailBody) labEmailBody.innerHTML = activeLabConfig.emailBodyHtml || '';
        if (labEmailCta) labEmailCta.textContent = activeLabConfig.submitLabel;
        if (labEmailFooter) labEmailFooter.textContent = `${activeLabConfig.brandTitle} • ${activeLabConfig.brandSubtitle}`;
    }

    if (labEmailFooter) {
        labEmailFooter.textContent = `${activeLabConfig.brandTitle} - ${activeLabConfig.brandSubtitle}`;
    }

    if (isPosterMode) {
        if (labPosterKicker) labPosterKicker.textContent = activeLabConfig.posterKicker || '';
        if (labPosterChip) labPosterChip.textContent = activeLabConfig.posterChip || '';
        if (labPosterTitle) labPosterTitle.textContent = activeLabConfig.posterTitle || '';
        if (labPosterBody) labPosterBody.innerHTML = activeLabConfig.posterBodyHtml || '';
        if (labPosterLabel) labPosterLabel.textContent = activeLabConfig.posterLabel || '';
        if (labPosterSubcopy) labPosterSubcopy.textContent = activeLabConfig.posterSubcopy || '';
        if (labPosterUrl) labPosterUrl.textContent = activeLabConfig.previewUrl || '';
        if (labPosterSupport) labPosterSupport.textContent = activeLabConfig.supportText || '';
        if (labPosterQr) labPosterQr.setAttribute('aria-label', activeLabConfig.posterLabel || 'QR code');
    }
}

function openLoginPageLab(labId = 'login-page-check') {
    if (!loginPageLab) return;
    syncLoginPageLabContent(labId);
    resetLoginPageLabState();
    setQuizAppView('current-lab');
    history.replaceState(null, '', '#loginPageLab');
    loginPageLab.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function closeLoginPageLab() {
    if (!loginPageLab) return;
    resetLoginPageLabState();
    setQuizAppView('labs');
    setActiveQuizSidebarLink('labsPanel');
    history.replaceState(null, '', '#labsPanel');
    labsPanel?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function getLoginPageLabSelections() {
    return loginPageLabSpotTargets
        .filter((button) => button.classList.contains('is-selected'))
        .map((button) => button.dataset.labSpot);
}

function renderLoginPageLabFeedback(selectedSpots) {
    if (!loginPageLabFeedback || !activeLabConfig) return;
    const correctSpots = activeLabConfig.correctSpots || new Set();
    const explanationMap = activeLabConfig.explanationMap || {};
    const correctSelections = selectedSpots.filter((spot) => correctSpots.has(spot));
    const missedSpots = [...correctSpots].filter((spot) => !selectedSpots.includes(spot));
    const wrongSelections = selectedSpots.filter((spot) => !correctSpots.has(spot));
    const perfectMatch = correctSelections.length === correctSpots.size && wrongSelections.length === 0;

    const notes = [
        ...missedSpots.map((spot) => `<li><strong>Missed:</strong> ${explanationMap[spot]}</li>`),
        ...wrongSelections.map((spot) => `<li><strong>Weak pick:</strong> ${explanationMap[spot]}</li>`)
    ].join('');

    loginPageLabFeedback.className = `lab-feedback-card ${perfectMatch ? 'is-success' : 'is-warning'}`;
    const pointsNote = perfectMatch
        ? (isLoggedIn()
            ? `<p><strong>Points earned:</strong> ${quizPointValues[activeLabConfig.attemptId]} training points.</p>`
            : '<p><strong>Nice catch.</strong> Sign in if you want this lab result and its points to count toward your progress.</p>')
        : (isLoggedIn()
            ? '<p><strong>No points yet.</strong> You need all 3 strongest red flags to earn points from this lab.</p>'
            : '');

    loginPageLabFeedback.innerHTML = `
        <strong>${perfectMatch ? 'Nice catch.' : 'Good try.'}</strong>
        <p>${perfectMatch ? activeLabConfig.successSummary : activeLabConfig.failureSummary}</p>
        ${pointsNote}
        ${notes ? `<ul>${notes}</ul>` : ''}
    `;
    loginPageLabFeedback.hidden = false;

    if (loginPageLabSubmit) loginPageLabSubmit.hidden = true;
    if (loginPageLabReset) loginPageLabReset.hidden = false;
}

async function saveLoginPageLabAttempt(selectedSpots = []) {
    if (!isLoggedIn() || !activeLabConfig) return null;

    const correctSpots = activeLabConfig.correctSpots || new Set();
    const totalQuestions = correctSpots.size;
    const correctSelections = selectedSpots.filter((spot) => correctSpots.has(spot)).length;
    const percentage = Math.round((correctSelections / totalQuestions) * 100);

    return saveSignedInAttempt({
        quizId: activeLabConfig.attemptId,
        quizTitle: activeLabConfig.attemptTitle,
        score: correctSelections,
        totalQuestions,
        percentage,
        reviewData: buildLabAttemptReviewData(activeLabConfig, selectedSpots)
    });
}

quizStartButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
        event.preventDefault();
        const action = button.dataset.lockedAction || 'start';
        if (action === 'login') {
            window.location.href = '/login?returnTo=/quiz';
            return;
        }
        if (action === 'locked') {
            return;
        }
        startQuiz(button.dataset.quiz);
    });
});

labStartButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
        event.preventDefault();
        const labId = button.dataset.startLab;
        if (labId && labConfigs[labId]) {
            openLoginPageLab(labId);
        }
    });
});

loginPageLabSpotTargets.forEach((button) => {
    button.addEventListener('click', () => {
        const isSelected = button.classList.contains('is-selected');
        const currentSelections = getLoginPageLabSelections();

        if (!isSelected && currentSelections.length >= 3) {
            return;
        }

        button.classList.toggle('is-selected');
        button.setAttribute('aria-pressed', button.classList.contains('is-selected') ? 'true' : 'false');

        if (loginPageLabSelectionCount) {
            loginPageLabSelectionCount.textContent = `${getLoginPageLabSelections().length} / ${activeLabConfig?.correctSpots?.size || 3}`;
        }
    });
});

loginPageLabSubmit?.addEventListener('click', () => {
    const selections = getLoginPageLabSelections();
    if (!selections.length) {
        if (loginPageLabFeedback) {
            loginPageLabFeedback.className = 'lab-feedback-card is-warning';
            loginPageLabFeedback.innerHTML = `
                <strong>Inspect the lab first.</strong>
                <p>Click the suspicious parts of the scenario before checking your findings.</p>
            `;
            loginPageLabFeedback.hidden = false;
        }
        return;
    }

    renderLoginPageLabFeedback(selections);

    if (isLoggedIn()) {
        saveLoginPageLabAttempt(selections)
            .then(() => {
                loadSignedInQuizData();
            })
            .catch((error) => {
                console.warn('Lab attempt save failed:', error.message || error);
            });
    }
});

loginPageLabReset?.addEventListener('click', () => {
    resetLoginPageLabState();
});

loginPageLabClose?.addEventListener('click', () => {
    closeLoginPageLab();
});

quizNextBtn?.addEventListener('click', () => {
    const quiz = quizzes[currentQuizId];
    if (!quiz || selectedAnswerIndex === null) return;

    if (currentQuestionIndex === quiz.questions.length - 1) {
        showResults();
        return;
    }

    currentQuestionIndex += 1;
    renderQuestion();
});

quizRetryBtn?.addEventListener('click', () => {
    if (!currentQuizId) return;
    startQuiz(currentQuizId);
});

quizChooseAnotherBtn?.addEventListener('click', () => {
    resetQuizWorkspace();
    document.getElementById('quizzes')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

quizExitBtn?.addEventListener('click', () => {
    resetQuizWorkspace();
    document.getElementById('quizzes')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

quizSidebarStartBtn?.addEventListener('click', () => {
    const recommendedQuizId = getRecommendedQuizId(signedInQuizAttempts);
    startQuiz(recommendedQuizId);
    closeQuizSidebarDrawer();
});

quizSidebarProfileBtn?.addEventListener('click', () => {
    setQuizAppView('profile');
    closeQuizSidebarDrawer();
    quizProfilePanel?.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

quizSidebarLogoutBtn?.addEventListener('click', () => {
    openQuizLogoutConfirm();
});

quizSidebarToggle?.addEventListener('click', () => {
    toggleQuizSidebarDrawer();
});

quizSidebarBackBtn?.addEventListener('click', handleQuizSidebarCloseControl);
quizSidebarBackBtn?.addEventListener('pointerup', handleQuizSidebarCloseControl);
quizSidebarBackBtn?.addEventListener('touchend', handleQuizSidebarCloseControl, { passive: false });

quizSidebarOverlay?.addEventListener('click', () => {
    closeQuizSidebarDrawer();
});

quizProfileNoteInput?.addEventListener('input', () => {
    const note = quizProfileNoteInput.value.slice(0, 120);
    if (quizProfileNoteInput.value !== note) {
        quizProfileNoteInput.value = note;
    }

    syncQuizProfileNoteUi(note, isLoggedIn() ? 'Save your note when you are ready.' : 'Sign in to save a short profile note.', true);
});

quizProfileNoteSaveBtn?.addEventListener('click', () => {
    saveQuizProfileNote();
});

quizProfileNoteEditBtn?.addEventListener('click', () => {
    const note = quizProfileNoteInput?.value || quizProfileNoteText?.textContent || '';
    syncQuizProfileNoteUi(note, 'Edit your note anytime.', true);
    quizProfileNoteInput?.focus();
});

document.querySelector('.quiz-sidebar-header')?.addEventListener('click', (event) => {
    const closeButton = event.target instanceof Element ? event.target.closest('.quiz-sidebar-back-btn') : null;
    if (!closeButton) return;
    handleQuizSidebarCloseControl(event);
});

quizPublicProfileClose?.addEventListener('click', () => {
    closePublicQuizProfile();
});

quizPublicProfileOverlay?.addEventListener('click', (event) => {
    if (event.target === quizPublicProfileOverlay) {
        closePublicQuizProfile();
    }
});

quizAttemptReviewClose?.addEventListener('click', () => {
    closeQuizAttemptReview();
});

quizAttemptReviewOverlay?.addEventListener('click', (event) => {
    if (event.target === quizAttemptReviewOverlay) {
        closeQuizAttemptReview();
    }
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && document.body.classList.contains('quiz-sidebar-open')) {
        closeQuizSidebarDrawer();
    }
    if (event.key === 'Escape' && quizPublicProfileOverlay && !quizPublicProfileOverlay.hidden) {
        closePublicQuizProfile();
    }
    if (event.key === 'Escape' && quizAttemptReviewOverlay && !quizAttemptReviewOverlay.hidden) {
        closeQuizAttemptReview();
    }
    if (event.key === 'Escape' && quizLogoutConfirmOverlay && !quizLogoutConfirmOverlay.hidden) {
        closeQuizLogoutConfirm();
    }
});

quizLogoutCancelBtn?.addEventListener('click', () => {
    closeQuizLogoutConfirm();
});

quizLogoutConfirmBtn?.addEventListener('click', async () => {
    closeQuizLogoutConfirm();
    await handleQuizLogout();
});

quizLogoutConfirmOverlay?.addEventListener('click', (event) => {
    if (event.target === quizLogoutConfirmOverlay) {
        closeQuizLogoutConfirm();
    }
});

document.addEventListener('touchstart', handleQuizSidebarTouchStart, { passive: true });
document.addEventListener('touchmove', handleQuizSidebarTouchMove, { passive: false });

window.addEventListener('resize', () => {
    if (!shouldUseQuizSidebarDrawer()) {
        closeQuizSidebarDrawer();
    }

    renderQuizPagination();
    renderLabsPagination();
  });

bindQuizSidebarNavigation();
window.addEventListener('hashchange', () => syncQuizViewFromHash('smooth'));

if (isLoggedIn()) {
    setActiveQuizSidebarLink('quizzes');
}

syncQuizViewFromHash();





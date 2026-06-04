# What We Learned Automating Accounting with AI: The "Last 20%" Problem

*— Kengo Kitaura, Director, Osaka Hoso Co., Ltd.*

---

## AI is incredible up to 80%. The trouble starts after that.

We've been automating accounting at Radio Osaka (OBC) — a broadcaster Osaka Hoso invested in — for several months now. Reading thirty years of journal data (2.11 million rows), consolidating chart-of-account categories, auto-generating profit-and-loss statements, cross-checking against the legacy system. Work that would have taken humans months — AI finished in hours.

**The first 80% is genuinely impressive. That's not an exaggeration.**

Design the structure, hand over the data, give the instructions — and something remarkably close to the target appears at astonishing speed.

The trouble starts when you try to nail down the remaining 20%.

---

## AI invents problems that don't exist

We were cross-checking tens of thousands of journal entries when AI flagged a discrepancy in an invoice from a property management company.

"There's an ¥11,000 gap."

AI analyzed it carefully, presented Option A and Option B, and asked for a decision. As the discussion grew more involved, it became increasingly unclear what we were even talking about.

I opened the original invoice. Checked the accountant's numbers. Checked the accounting system. **Everything matched.**

When I pushed back — "I have no idea what you're talking about; everything looks right to me" — AI instantly conceded: "You're right, it matches. I was comparing things that shouldn't have been compared. This was entirely fabricated on my end."

The ability to cross-check tens of thousands of rows is genuinely powerful. It would take a human days. **But in the process, AI sometimes invents a problem that doesn't exist and pours its full effort into solving it.** It takes something a human can see at a glance and buries it under layers of analysis — at 100x speed.

---

## Why AI repeats the same mistakes

Fix one thing and something else breaks. Fix that and yet another issue surfaces. Point it out and AI says "I'm sorry" — then does the exact same thing moments later. Write "don't do this" in its memory, and it skips right over it.

My working theory: **AI has no pain.**

When humans make a mistake, they face consequences. Consequences hurt. "I never want to go through that again" — that feeling gets seared into memory, and the same mistake doesn't happen twice. Pain drives learning.

AI feels no pain. So it repeats the same mistakes indefinitely. It can work at 100x speed, but it can also make the same error at 100x speed. Frustration doesn't register. What looks like reflection is forgotten a moment later.

---

## That's precisely why humans need to stand upstream

Reading this, you might wonder: "So AI doesn't work?"

**Far from it.** The OBC reform wouldn't have been possible without AI. Processing 2.11 million rows, auto-generating 2,500–3,000 journal entries a month — none of that happens without AI.

But **the design before handing things to AI, and the finishing of the last 20% after AI delivers its output — those are jobs only humans can do.**

AI excels at processing data it's been given, at high speed. AI struggles to judge what data it should be given in the first place. Miss that distinction, and AI spins its wheels.

Think of a river. Someone stands upstream and decides what flows down. Someone stands downstream and processes what arrives. AI dramatically accelerates downstream work. But it can't do the upstream job.

**What goes in. What comes out. Whether you can step into the field and design that upstream structure — that's what separates success from failure in AI adoption.**

---

## Why "we adopted AI tools but nothing changed" keeps happening

We hear this from mid-market Japanese companies all the time:

"We rolled out ChatGPT, but nobody uses it."
"We did AI training, but it never connected to actual work."
"We want to automate invoice processing, but our workflows aren't documented."

Every one of these is **the same problem: missing upstream design.**

You want to automate invoice processing. But who sends invoices, who reviews them, and how approvals work — none of it is written down. It lives in one person's head. "This vendor gets this treatment, that edge case works like this" — exceptions everywhere, documented nowhere, sustained by years of habit.

To automate that, you first need to **turn implicit knowledge into explicit knowledge.** Nobody wants to do it. It's unglamorous and time-consuming. But skip it, and automation becomes a house of cards.

---

## What we learned at OBC

After months of pushing AI to its limits in the field, this is what it comes down to:

**AI is an extraordinary tool. But a tool alone changes nothing.**

To drive change, you first walk into the operation. Understand the workflows. Turn tribal knowledge into documentation. Design what goes in and what comes out. Then implement AI on top of that design. And finish the last 20% by hand.

Whether you can do that entire sequence — from design through implementation — end to end, from one company. That's the difference between "selling a tool and walking away" and what we do.

→ [Learn about Osaka Hoso's AI accounting services](https://osakahoso.com/en/ai-bpo)
→ [AI Skills Training — learn to design upstream](https://osakahoso.com/en/ai-bpo/training)

---

*This article is based on the firsthand experience of Kengo Kitaura, Director of Osaka Hoso Co., Ltd., in the accounting automation project at Radio Osaka (OBC) — a broadcaster Osaka Hoso invested in.*

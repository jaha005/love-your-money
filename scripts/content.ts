// Programme content for the seed. Real text, not lorem ipsum.

export type SeedLesson = {
  title: string;
  duration_min: number;
  /** Andreja adds her own link in the editor; the demo ships no third-party recordings. */
  video_url?: string | null;
  body: string;
  worksheet?: { title: string; questions: string[] };
};

export type SeedModule = {
  title: string;
  subtitle: string;
  summary: string;
  lessons: SeedLesson[];
  assignment: { title: string; instructions: string };
};

export const modules: SeedModule[] = [
  {
    title: "Your relationship with money",
    subtitle: "Where your money decisions really come from",
    summary:
      "Before we touch a single spreadsheet, we look at where your decisions come from. Money is rarely just maths.",
    lessons: [
      {
        title: "What you learned about money before you ever earned it",
        duration_min: 14,
        body: `Most women who join this programme can add and subtract perfectly well. The maths was never the problem. The problem is that you make a money decision in three seconds, and the reason behind it is twenty years old.

Think about how money was talked about in the house you grew up in. Was it discussed out loud, in a whisper, or not at all? Was money the reason for arguments, for silence at the dinner table, or for a feeling that you shouldn't ask for things? These aren't sentimental questions. They're the questions that explain why your throat tightens today when you have to send a quote.

There are three patterns I see most often. The first is **avoidance**: you don't open your banking app, you don't check the balance, bills sit unopened. The second is **clamping down**: everything is tight, nothing may be spent, and when something is, guilt follows. The third is **spending as relief**: after a hard week, shopping is the only place you're kind to yourself.

None of these three patterns is a character flaw. All three are learned, and all three can be unlearned. But only once you name them.

In this lesson I'm not asking you to change anything. I'm only asking you to recognise which pattern feels closest, and when you last saw it in action.`,
        worksheet: {
          title: "Worksheet 1.1 — Your money story",
          questions: [
            "What is the first sentence about money you remember from childhood?",
            "Who made the money decisions in your home, and how did you know?",
            "Which of the three patterns (avoidance, clamping down, spending as relief) feels closest?",
            "When did you last feel uneasy about money? What exactly happened?",
            "What do you wish you had learned about money, but didn't?",
          ],
        },
      },
      {
        title: "Guilt, shame and why you don't check your balance",
        duration_min: 11,
        body: `Guilt says: I spent too much. Shame says: I'm someone who's bad with money. The difference isn't just linguistic. Guilt is about an action and can be fixed. Shame is about identity, and that's why it paralyses.

When you don't open your banking app, you aren't running from the number. You're running from the sentence you'll say to yourself when you see it. The number is neutral. The sentence isn't.

The exercise you'll practise throughout the programme is simple: when you look at a number, describe it without adjectives. Not "terribly low", but "412 euros". Not "a disaster", but "three bills are unpaid". Language without adjectives gives you back the ability to act, because suddenly it's a task, not a verdict.

This sounds small. It isn't. Women who do this consistently for eight weeks report that opening their banking app stopped being an event. That's the goal: for money to become boring.`,
      },
      {
        title: "What you want money to do for you",
        duration_min: 9,
        body: `The question "what's your financial goal?" usually gets an answer that sounds like it came from a magazine. A flat. A holiday. Security. All true, none of it usable.

A better question is: **what would change in your week if money weren't a problem?** The answer is concrete. I wouldn't do sums in my head before ordering. I wouldn't keep putting off the dentist. I'd say no to the client who pays late. I'd take Friday afternoon off.

Write three sentences like that. Those are your goals, and each one has a price we'll work out in module 5.

Notice that none of those sentences is a number. Numbers come later, and they're the easy part. The hard part is allowing yourself to want something out loud.`,
      },
    ],
    assignment: {
      title: "Your money story",
      instructions: `Write 10–15 sentences about your relationship with money.

Use these questions as a frame; you don't have to answer all of them:

- What is the first sentence about money you remember?
- Which of the three patterns (avoidance, clamping down, spending as relief) do you recognise in yourself?
- What would change in your week if money weren't a problem?

**Write without adjectives wherever you can.** Only your assistant and I will read this.`,
    },
  },

  {
    title: "Mapping your spending",
    subtitle: "Where the money actually goes",
    summary:
      "Four weeks of real data beat any estimate. This module is only about seeing clearly.",
    lessons: [
      {
        title: "Why estimates always miss",
        duration_min: 10,
        body: `If I ask how much you spend on food each month, you'll give me a number. That number is almost always 30 to 40 percent lower than the real one.

The reason isn't dishonesty. It's that we remember big purchases, not small ones. You remember the monthly shop. You don't remember the seven trips to the shop for "just two things" that add up to more.

So we don't start with a budget. We start with a map. A map is a record of what actually happened, with no plan and no judgement. Four weeks. Not a day less, because a month has a rhythm that a shorter period won't catch.

Two things people get wrong: they change their behaviour while measuring, and they give up after ten days because "nothing's happening". Don't change anything and don't give up. The data is the only goal.`,
        worksheet: {
          title: "Worksheet 2.1 — Four weeks of mapping",
          questions: [
            "How much do you think you spend on food each month? Write the number before you measure.",
            "Which three categories do you most often spend in without thinking?",
            "Which day of the week do you spend the most, and why?",
            "What did you pay for last month without noticing?",
            "What would surprise you to see on your map?",
          ],
        },
      },
      {
        title: "Four buckets: fixed, variable, occasional, invisible",
        duration_min: 13,
        body: `You don't need twenty-two categories. You need four.

**Fixed** is whatever is the same every month: rent, loan repayments, subscriptions. The easiest to see and the hardest to change.

**Variable** is what you spend every month, but in different amounts: food, fuel, toiletries. This is where the most room is, and the most resistance.

**Occasional** is what arrives a few times a year and surprises you every time: car registration, birthdays, a winter coat, the dentist. This is the category that breaks budgets, because everyone treats it as "unexpected" — yet something from it happens every single month.

**Invisible** is subscriptions that renew themselves, fees, round-ups, small amounts under five euros. The average household loses the equivalent of one monthly repayment here without ever making a decision about it.

When you sort your map into these four buckets, the same thing usually happens: occasional and invisible together turn out bigger than you expected. That isn't bad news. That's room.`,
      },
      {
        title: "A first look, without judgement",
        duration_min: 8,
        body: `The first time you see your map, there will be a reaction. For most people it's discomfort, for some it's relief, for some it's anger at themselves.

The rule is: **the first look is only looking.** You make no decisions on the same day. You don't cancel subscriptions, make rules or promise yourself anything.

The reason is practical. Decisions made from discomfort are too strict and don't last. You don't need a plan that survives three days. You need a plan that survives until spring.

Sit down with the map, read it out loud if you can, and write only three sentences: what surprised me, what I expected, what I don't understand. Everything else we do in module 3.`,
      },
    ],
    assignment: {
      title: "A four-week spending map",
      instructions: `Record every expense from the last four weeks and sort it into four buckets: **fixed**, **variable**, **occasional**, **invisible**.

You can use a bank statement, an app or paper — it doesn't matter how.

In your answer, write:
1. The total for each bucket
2. Three sentences: what surprised me, what I expected, what I don't understand

If you like, attach your table as a PDF or image.`,
    },
  },

  {
    title: "A budget without sacrifice",
    subtitle: "A plan that survives a bad month",
    summary:
      "A budget that forbids doesn't last. Here we build a plan with room for life built in.",
    lessons: [
      {
        title: "Why restrictive budgets break",
        duration_min: 12,
        body: `Anyone who has ever been on a diet knows how this goes. The first week is perfect. The second is good. The third has one bad day, and that bad day becomes proof that "it just doesn't work for me".

Budgets work the same way. If your plan forbids everything you enjoy, you don't break it because you're weak. You break it because the plan was impossible.

A good budget has three qualities. **It has room for life** — an amount you can spend without explaining. **It assumes a bad month** — because a bad month comes two or three times a year. And **it doesn't need daily attention** — if you have to look at it every day, you'll abandon it.

The rule I use: if a new plan needs more than ten minutes of your attention a week, it's too complicated.`,
        worksheet: {
          title: "Worksheet 3.1 — Your first budget",
          questions: [
            "What was your average monthly income over the last three months?",
            "How much is your 'fixed' bucket?",
            "What amount do you want to set aside as 'room for life' (no explanation needed)?",
            "How much do you need to put aside each month for the 'occasional' bucket?",
            "What amount is left, and what do you do with it?",
          ],
        },
      },
      {
        title: "The 50/30/20 rule, and when to break it",
        duration_min: 15,
        body: `The rule says: 50 percent of income on needs, 30 percent on wants, 20 percent on savings and debt. Useful as a starting point, useless as a rule.

If you live in a city where rent takes 45 percent of your income, a 50 percent cap on all needs is mathematically impossible. If you carry high-interest debt, 20 percent is too little. If your income is unpredictable, a percentage of what, exactly?

Use it like this: work out your real percentages from the module 2 map. Compare. The gap shows you where the pressure is, not where you went wrong.

For unpredictable income there's a better method: **plan around your lowest month of the past year.** Anything above that is surplus and goes into your reserve. Uncomfortable for the first couple of months, a lifesaver after that.`,
      },
      {
        title: "Room for life: the amount you justify to nobody",
        duration_min: 9,
        body: `This is the lesson women most often skip, and the one they need most.

Set an amount — weekly or monthly — that you can spend without any explanation. Not to yourself, not to a partner, not to me. Coffee, a book, nothing at all, whatever. The amount is yours and there's no report.

Two things happen when you introduce it. First: the guilt around small purchases stops, because they're agreed in advance. Second: total spending in that category usually **drops**, because the decision is made once a month instead of thirty times.

Keep the amount realistic. Too small and you won't respect it. A good starting point: between 5 and 10 percent of income, then adjust after two months.`,
      },
    ],
    assignment: {
      title: "A budget for next month",
      instructions: `Using your map from module 2, build a budget for next month.

It must include:
- An amount for each of the four buckets
- **Room for life** — the amount you spend without explanation
- One amount for the 'occasional' bucket that you set aside every month

In your answer, add one sentence: **what breaks first if the month goes badly?**`,
    },
  },

  {
    title: "Pricing and getting paid",
    subtitle: "What your work is worth, and how you ask for it",
    summary:
      "For everyone who works for themselves: how to set a price, how to say it out loud, and how to get paid without apologising.",
    lessons: [
      {
        title: "Your price is not a verdict on your worth",
        duration_min: 13,
        body: `When your throat tightens before you say a price, it's because in that moment you're not talking about the service. You're talking about yourself.

Separate the two. A price is a number that covers your time, your costs, tax, unpaid hours and risk. It isn't a rating of how good you are. A client who says "that's expensive" hasn't said "you're not worth it". They've said it doesn't fit their budget — which is information, not a verdict.

The calculation you'll do in the assignment: how many hours a month you actually bill (not how many you work), your target income, your fixed business costs, and the percentage that goes to tax and contributions. Divide. You get a minimum hourly rate below which you're working at a loss.

Most women who do this for the first time discover their current price is 30 to 50 percent below that minimum.`,
        worksheet: {
          title: "Worksheet 4.1 — Your minimum hourly rate",
          questions: [
            "How many hours a month do you actually bill (not how many you work)?",
            "What is your target monthly income after tax?",
            "What are your fixed monthly business costs?",
            "What percentage goes on tax and contributions?",
            "What is your minimum hourly rate, and how far is it from your current one?",
          ],
        },
      },
      {
        title: "How to say your price, then stay quiet",
        duration_min: 10,
        body: `There's one technique that changes more than any calculation: **you say the price, and you pause.**

What most people do instead is say the price and immediately add "but I can go a bit lower", "I know that might be a lot", "we can work something out if needed". Every one of those sentences negotiates against you before the other person has said anything.

The sentence is: "For this scope, the price is X." Full stop. Then you stay quiet and let the other person respond.

The silence will feel endless. It lasts three seconds. Practise out loud, alone, ten times. It sounds silly until it works.

If they ask for a discount, the answer isn't yes or no. It's: "I can adjust the price if we reduce the scope — which of these matters least to you?" That keeps the price tied to the work, not to your willingness to please.`,
      },
      {
        title: "Getting paid: deadlines, reminders and when to stop working",
        duration_min: 11,
        body: `Unpaid work isn't work. It's a gift with an invoice.

Three rules solve 90 percent of payment problems:

**A deposit.** For new clients, 30 to 50 percent up front. This isn't mistrust; it's standard. A client who refuses a deposit is usually the same one who pays the rest late.

**A deadline written as a number.** Not "on completion", but "15 days from the invoice date". The date isn't up for negotiation, because it was on the quote they signed.

**A reminder without an apology.** The day after the deadline: "A reminder about invoice 24, due yesterday. Thank you." No "sorry to bother you". You're not the one bothering anyone.

And finally: decide in advance the point at which you stop working if you haven't been paid. Put it in your quote. You won't need it often, but you need to have it.`,
        worksheet: {
          title: "Worksheet 4.3 — Payment terms",
          questions: [
            "What deposit do you ask new clients for, and how do you phrase it?",
            "What payment term do you put on invoices, written as a number of days?",
            "What does your first reminder say once the deadline has passed?",
            "At what point do you stop working if you haven't been paid?",
            "Which client owes you money right now, and what are you sending them this week?",
          ],
        },
      },
    ],
    assignment: {
      title: "Your price, and one quote sent",
      instructions: `Two parts:

**1. The calculation.** Work out your minimum hourly rate using the formula from lesson 4.1. Show the numbers.

**2. The quote.** Write (and, if you can, send) one quote at your new price. No sentences that negotiate against you.

Paste the text of the quote into your answer. We'll look at the wording together.`,
    },
  },

  {
    title: "Your reserve and savings",
    subtitle: "How much you need to stop being afraid",
    summary:
      "A reserve isn't a luxury; it's the condition for everything else. We work out your exact number and the path to it.",
    lessons: [
      {
        title: "Three months or six: what's your number?",
        duration_min: 12,
        body: `The general rule says three to six months of expenses. Like every general rule, it's useful until you reach your own situation.

Your number depends on four things: how predictable your income is, how many people depend on you, how quickly you'd find a new job or client, and how much debt you carry.

A steady job, no children, an in-demand profession — three months is enough. Your own business with unpredictable income and a child — six months is the minimum, nine is calmer.

More important than the exact number: **you count months of expenses, not months of income.** That's usually 25 to 35 percent less, and so more achievable than it looks.

Work out your number today. Not so you'll have it straight away, but so you stop fearing an unknown amount.`,
        worksheet: {
          title: "Worksheet 5.1 — Your reserve",
          questions: [
            "What are your monthly expenses in their minimum version (no wants)?",
            "How many months of reserve do you need, given your situation?",
            "What is the total reserve amount?",
            "How much can you put aside each month, and how long will it take?",
            "Where will you keep the reserve so it isn't too easy to reach?",
          ],
        },
      },
      {
        title: "Where to keep your reserve",
        duration_min: 8,
        body: `A reserve has two requirements: you can reach it within a few days, and it isn't so close to hand that you spend it on something that isn't urgent.

So not in a current account with a card attached. And not in something that takes months to turn into cash.

The practical answer for most people: a separate savings account, ideally at a different bank, with no card, and a standing order that moves the amount across on payday. Automation is the whole trick — the decision is made once, not every month.

If your income is unpredictable, replace the standing order with a rule: **from every payment in, the first 10 percent goes straight to the reserve.** Before anything else.`,
      },
      {
        title: "When you're allowed to touch the reserve",
        duration_min: 7,
        body: `Write this down in advance, while you're calm, because when you need it you won't be thinking clearly.

The reserve is for things that are **unplanned, necessary and urgent.** All three, not one of the three.

A broken boiler in January: yes. Tyres that have worn out: that was planned, it comes from the 'occasional' bucket. A once-in-a-lifetime trip with friends: no, however much it hurts.

And the last rule, the one people forget: **once you've used it, rebuilding the reserve becomes priority number one** — ahead of saving, ahead of investing, ahead of everything except the minimum debt repayments.`,
      },
    ],
    assignment: {
      title: "Your reserve, and your first standing order",
      instructions: `1. Work out your reserve amount (months × minimum monthly expenses).
2. Write how much you can put aside each month and how many months it will take to reach the goal.
3. **Set up a standing order** (or the 10-percent-per-payment rule) and say that you've done it.

In your answer, also say where you'll keep the reserve and why there.`,
    },
  },

  {
    title: "Debt without shame",
    subtitle: "Order, a plan and a conversation with the bank",
    summary:
      "Debt is maths with interest, not proof of character. This is the most practical module in the programme.",
    lessons: [
      {
        title: "Every debt on one sheet of paper",
        duration_min: 11,
        body: `The hardest part isn't repaying. The hardest part is writing everything down in one place.

For each debt you need four facts: **the remaining balance**, **the interest rate**, **the monthly repayment**, **the end date**. Cards, overdraft, personal loans, the money you borrowed from your sister, the instalments on your phone. All of it.

Almost every woman who does this says the same thing: the total is smaller than she thought, but the interest on one item is much higher than she knew. That's typical. Overdrafts and credit cards are almost always the most expensive money you have.

Once you have the list, debt stops being a cloud and becomes a list. A list can be worked through in order.`,
        worksheet: {
          title: "Worksheet 6.1 — Your debt list",
          questions: [
            "List every debt: balance, interest rate, repayment, end date.",
            "Which debt has the highest interest rate?",
            "Which debt has the smallest remaining balance?",
            "How much goes on repayments each month in total?",
            "Which debt would bring the most relief if it disappeared?",
          ],
        },
      },
      {
        title: "Avalanche or snowball: choosing an order",
        duration_min: 12,
        body: `There are two methods, and both work.

**Avalanche**: pay off the highest-interest debt first and the rest at the minimum. It's mathematically cheaper — you pay less interest overall.

**Snowball**: pay off the smallest balance first, regardless of interest. It's psychologically stronger — the first debt disappears quickly and that gives you momentum.

Which should you choose? If the gap in interest rates is large (say a card at 18 percent against a loan at 5 percent), go avalanche. If the rates are similar, or if you've tried before and given up, go snowball.

Choosing a method isn't a moral question. The best method is the one you'll actually see through.

One rule applies to both: **while you're repaying, you don't take on new debt.** It sounds obvious, but it's where plans most often fall apart.`,
      },
      {
        title: "Talking to the bank: what to ask for, and in what words",
        duration_min: 10,
        body: `A bank isn't your enemy and isn't your friend. A bank is an institution with procedures, and procedures have options nobody will tell you about unless you ask.

Three things worth asking for: **refinancing** a more expensive debt with a cheaper one, **restructuring** if your repayment is too heavy, and **a lower rate** if your credit position has improved since you took the loan.

How to say it: "I have a loan from 2023 at X percent. My situation has changed since then. What options do I have to lower the rate or restructure?"

Don't apologise, and don't explain your private circumstances more than you need to. This is a business conversation.

And always: **ask for the offer in writing** and compare it with what you have now before you sign anything. A refinance that extends the term can lower your repayment while raising the total interest you pay.`,
      },
    ],
    assignment: {
      title: "Your debt list and repayment plan",
      instructions: `1. List every debt (balance, interest rate, repayment, end date).
2. Choose a method — **avalanche** or **snowball** — and explain why that one.
3. Write down the repayment order and the estimated date the first debt disappears.

If you have no debt, write instead a plan for what you'll do with the amount that would otherwise go on repayments.`,
    },
  },

  {
    title: "Investing basics",
    subtitle: "What you need to know for a first step",
    summary:
      "No recommendations and no promises. Only the concepts you need to understand what's being talked about.",
    lessons: [
      {
        title: "What investing is, and what it isn't",
        duration_min: 14,
        body: `Investing is buying something that could be worth more over time, while accepting that it could be worth less. That's the whole definition.

What investing **isn't**: it isn't saving (savings have a guaranteed amount, investments don't), it isn't fast (think in years, not months), and it isn't something you start before you have a reserve and before you've dealt with expensive debt.

The order is always the same: **reserve → expensive debt → investing.** If you invest while carrying 18 percent on a credit card, the maths works against you however good the investment is.

This module has no recommendations. I'm not a licensed adviser and I won't tell you what to buy. The aim is for you to understand the concepts well enough to ask the right questions when you talk to someone who is licensed.`,
        worksheet: {
          title: "Worksheet 7.1 — Are you ready?",
          questions: [
            "Do you have a reserve of at least three months of expenses?",
            "Do you have any debt with interest above 8 percent?",
            "In how many years might you need this money?",
            "How big a drop in value could you live with without panicking?",
            "Which concepts don't you understand well enough yet?",
          ],
        },
      },
      {
        title: "Risk, time, and why you don't check it every day",
        duration_min: 11,
        body: `Risk in investing isn't "you could lose everything". Risk is **how much the value swings, and how long you can wait for it to recover.**

That's why time is the most important variable. Money you need in two years and money you won't need for fifteen aren't the same kind of money, and they don't go in the same place.

The second thing: checking the value every day does harm. Not because the information is bad, but because daily swings look dramatic and prompt decisions that cost you in the long run. People who check rarely do better than people who check often. It's a consistent finding.

Set yourself a rule in advance: how often you look, and what could make you sell. Write it down while you're calm.`,
      },
      {
        title: "The first questions to ask before you invest anything",
        duration_min: 10,
        body: `When anyone offers you any kind of product — a bank, an adviser, an acquaintance with an "opportunity" — ask these five questions:

1. **What does this cost each year, as a percentage and in euros?** Fees look small until you multiply them by twenty years.
2. **How, and within how many days, can I get my money out?**
3. **What happens if I stop paying in?**
4. **Who earns from my payment, and how much?**
5. **Is this person licensed, and how are they paid?**

If you don't get a clear answer to any of them in writing, the answer is no.

And one rule that always applies: **don't invest in anything you can't explain to a friend in three sentences.**`,
      },
    ],
    assignment: {
      title: "A readiness check and your five questions",
      instructions: `1. Answer the questions from worksheet 7.1 — are you ready for a first step?
2. Write, in your own words, the **five questions** you'll ask before investing anything.
3. Write one sentence: which concept is still unclear to you?

This isn't an assignment where you buy anything. It's one where you check where you stand.`,
    },
  },

  {
    title: "Your 12-month plan",
    subtitle: "What you do when the programme ends",
    summary:
      "We turn everything from the previous seven modules into one sheet of paper that lives somewhere you can see it.",
    lessons: [
      {
        title: "Three numbers to track, and nothing else",
        duration_min: 10,
        body: `After the programme you won't have me, an assistant or weekly calls. So the plan has to be simple enough to keep up on your own.

Three numbers, once a month, ten minutes:

**Your reserve balance.** Is it growing, flat, or falling?
**Your total debt.** One number, all debts together.
**Spending in the 'variable' bucket.** The only bucket you genuinely control month to month.

Track nothing else. Don't track daily. Don't build spreadsheets with fifteen tabs, because you'll abandon them by March.

Write those three numbers in the same document every month, on the same day. After six months you'll have a trend, and a trend is the only thing that really tells you anything.`,
        worksheet: {
          title: "Worksheet 8.1 — Your 12-month plan",
          questions: [
            "Which three numbers will you track, and on which day of the month?",
            "What is your reserve goal for the next 12 months?",
            "Which debt do you want gone, and by when?",
            "What do you do when a month goes badly?",
            "Who is the person you'll talk to about this once a month?",
          ],
        },
      },
      {
        title: "What you do when a month goes badly",
        duration_min: 9,
        body: `A bad month will come. Not twice in a lifetime — two or three times a year. If your plan doesn't expect that, the plan isn't finished.

Write down in advance three steps you take in a bad month:

**First:** what you pause. Usually investment contributions and part of your room for life. Not the reserve, not the minimum repayments.
**Second:** what you don't touch under any circumstances.
**Third:** when you go back to normal, and by what sign.

The key is to write this **now**, while your head is clear. In a bad month you won't make a good plan; you'll only carry out the one you already have.

And a reminder: a bad month isn't proof the plan doesn't work. A plan that expects a bad month is exactly the plan that works then.`,
      },
      {
        title: "How to keep this going after the programme",
        duration_min: 12,
        body: `Eight weeks is enough for something to change, and too short for the habit to set. So the last lesson isn't about money; it's about maintenance.

Three things that help, in order of impact:

**A date in your calendar.** The same day each month, a reminder, ten minutes, three numbers. If it isn't in the calendar, it won't happen.

**One person.** A friend, a sister, someone from this group. Once a month you send her your three numbers, she sends you hers. No advice, just numbers. This is the most effective thing in the whole programme, and the least popular.

**One sheet of paper somewhere visible.** Not an app. Paper. The reserve amount you're aiming for, and the date you want it by.

Finally: the goal isn't to become someone who thinks about money all the time. The goal is the opposite — for money to take ten minutes a month and leave you alone the rest of the time.`,
      },
    ],
    assignment: {
      title: "Your 12-month plan on one sheet",
      instructions: `Write your 12-month plan. It must fit on one page.

It includes:
1. **Three numbers** you'll track, and the day of the month you record them
2. **Your reserve goal** for 12 months, and the monthly amount
3. **Your bad-month plan** — what you pause, what you don't touch, when you go back to normal
4. **The name of the person** you'll swap three numbers with once a month

This is the last assignment in the programme. Take your time.`,
    },
  },
];

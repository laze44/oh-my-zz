# Idea Refine Examples

Use these patterns to decide whether to draft, ask one question, or offer a small set of directions.

| Situation | Response |
|---|---|
| Motivation, goal, and concept are clear | Draft directly |
| One material gap prevents a faithful summary | Ask one focused question |
| Several interpretations would change the purpose or outcome | Offer two or three directions |
| The user mentions a repository but supplies a clear idea | Draft from the conversation |

## 1. Clear idea: normalize without questioning or branching

**User:**

> I want a small internal page where our support team can record recurring customer complaints, group duplicates, and see which problems are becoming more common. The goal is to stop relying on scattered chat messages when deciding what to fix.

Draft directly because the motivation, goal, and concept are already clear.

```markdown
# Recurring Customer Problem Tracker

## Refined Idea
Create a shared internal record of recurring customer complaints so the support team can consolidate duplicates and identify problems that are becoming more frequent.

## Motivation
Customer feedback is currently scattered across chat messages, making recurring problems difficult to recognize and prioritize.

## Primary Goals
- Give the support team one place to capture and consolidate recurring complaints.
- Make emerging problem patterns visible when deciding what to address.

## Rough Steps
1. Define the complaint information and grouping behavior the support team needs.
2. Establish a shared workflow for recording and consolidating complaints.
3. Validate whether the resulting view improves prioritization decisions.
```

## 2. Unclear purpose: ask one necessary question

**User:**

> I want something that summarizes our meetings with AI.

The concept is visible, but the intended outcome is unclear. Ask one question:

> What is the main problem you want the summaries to solve: helping attendees remember decisions, updating people who missed the meeting, or turning discussion into follow-up actions?

## 3. Material ambiguity: offer limited directions

**User:**

> I want a tool that helps open-source maintainers deal with too many issues.

If the user confirms that the goal is to reduce triage workload but has not established what kind of help they want, two or three directions may be useful:

1. **Intake quality:** help reporters submit complete, actionable issues.
2. **Triage assistance:** help maintainers classify, deduplicate, and prioritize incoming issues.
3. **Backlog maintenance:** identify stale, superseded, or no-longer-relevant issues.

Ask which interpretation matches the intended idea.

## 4. Clear direction inside a repository: ignore repository context

**User:**

> Refine this idea for the project I'm currently in: let users export their account history so they can keep a personal record before closing an account.

The repository location does not change the decision: the motivation, goal, and direction are already clear, so draft from the conversation.

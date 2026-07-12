# Idea Refine Examples

Use these patterns to decide whether to challenge, ask one question, offer alternative directions, or draft.

| Situation | Response |
|---|---|
| The claim is clear and survives the challenge checkpoint | Draft without manufacturing an objection |
| A material concern could change the idea | Explain it and ask one focused question |
| Several interpretations would change the purpose or outcome | Offer two or three distinct directions |
| The user accepts a correction | Revise the idea claim before drafting |
| The user rejects a recommendation knowingly | Preserve the direction and record the assumption or trade-off |
| The user mentions a repository | Refine from the conversation without inspecting it |

## 1. Clear and coherent: challenge internally, then draft

**User:**

> I want a shared internal record where our support team can group recurring customer complaints and see which problems are becoming more common. We want to stop relying on scattered chat messages when deciding what to fix.

The problem, proposed change, and desired outcome are coherent. Complaint frequency is presented as useful evidence, not as the only prioritization rule; do not invent that stronger claim and challenge it. The checkpoint finds no material concern, so draft directly without asking a question.

```markdown
# Recurring Customer Problem Record

## Refined Idea
Create a shared internal record of recurring customer complaints so the support team can consolidate duplicates and recognize problems that are becoming more frequent.

## Motivation
Customer feedback is scattered across chat messages, making recurring problems difficult to recognize when deciding what to address.

## Primary Goals
- Give the support team one place to capture and consolidate recurring complaints.
- Make emerging problem patterns visible during prioritization.

## Rough Steps
1. Clarify the complaint information and grouping behavior the team needs.
2. Establish a shared workflow for recording and consolidating complaints.
3. Validate whether the resulting record improves prioritization decisions.
```

## 2. Solution-first idea: challenge the missing outcome

**User:**

> I want something that summarizes our meetings with AI.

Do not accept the mechanism as the idea. The intended benefit is missing, and different outcomes would produce different ideas. Ask one question:

> The idea currently commits to AI summaries before defining the problem they should solve. Is the primary outcome to help attendees remember decisions, update people who missed the meeting, or turn discussion into follow-up actions?

## 3. Genuine directional ambiguity: offer limited alternatives

**User:**

> I want a tool that helps open-source maintainers deal with too many issues. The goal is to reduce triage workload, but I am not sure what kind of help it should provide.

The motivation is clear, but the concept is not. Offer materially distinct interpretations:

1. **Improve intake:** help reporters submit complete, actionable issues.
2. **Assist active triage:** help maintainers classify, deduplicate, and prioritize incoming issues.
3. **Reduce backlog noise:** identify stale, superseded, or no-longer-relevant issues.

Ask which direction best matches the intended outcome. Do not turn the directions into technical designs.

## 4. Internally conflicting idea: recommend a correction

**User:**

> Require employees to publish daily activity rankings so people feel psychologically safe admitting mistakes.

The proposed mechanism introduces public comparison, while the stated goal depends on people feeling safe exposing weakness. That tension could invalidate the direction. Challenge it directly:

> Public activity rankings may make people more guarded about mistakes, which conflicts with the stated goal of psychological safety. Would you rather refine the idea around private team learning from mistakes, or is public comparison an intentional trade-off you want to preserve?

If the user chooses private learning, revise the idea claim around that outcome. If the user preserves rankings, record the causal assumption and accepted trade-off instead of presenting the concern as resolved.

## 5. User rejects the recommendation: preserve agency

**User:**

> I understand that rankings may discourage openness, but transparent individual comparison is a non-negotiable part of the idea.

Do not silently remove rankings. Continue with the chosen direction and capture the tension:

```markdown
## Critical Assumptions
- Visible individual rankings will increase accountability without preventing people from reporting mistakes honestly.

## Key Trade-offs
- The idea prioritizes transparent individual comparison despite the risk that competition may weaken psychological safety.
```

## 6. Clear direction inside a repository: keep idea-level scope

**User:**

> Refine this idea for the project I'm currently in: let users export their account history so they can keep a personal record before closing an account.

The repository does not change the refinement process. Test the causal logic from the conversation, then draft without reading files, inferring architecture, or adding implementation constraints.

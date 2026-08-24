# Recent Best-Paper Exemplar Corpus

This is a curated seed corpus spanning the five complete conference years 2021–2025. It is not an exhaustive award database. Entries marked `official award` are backed by the linked conference or society source. Re-verify the source before claiming award status because conference pages can change.

## Contents

- How to use the corpus
- Systems exemplars
- Networking exemplars
- Architecture exemplars
- Corpus maintenance contract

## How to use the corpus

1. Classify the writing problem by research shape and section.
2. Select one exemplar from the same research shape; add a second from the target venue family only if needed.
3. Open the actual paper and inspect the relevant section, figures, and evidence flow.
4. Extract a structural pattern in original words.
5. Adapt the pattern to the user's evidence spine without borrowing prose.

Do not use a title or abstract alone to infer detailed writing structure. Do not cite a paper until its metadata and relevance to the manuscript claim are independently verified.

## Systems exemplars

### OSDI 2021

Official source: https://www.usenix.org/conference/osdi21/technical-sessions

- **Pollux: Co-adaptive Cluster Scheduling for Goodput-Optimized Deep Learning** — official award; route for cross-layer scheduler stories, new metric introduction, and end-to-end plus trace-driven evaluation.
- **MAGE: Nearly Zero-Cost Virtual Memory for Secure Computation** — official award; route for property-derived system design and mechanism-to-runtime evaluation.

### OSDI 2022

Official source: https://www.usenix.org/conference/osdi22/technical-sessions

- **MemLiner: Lining up Tracing and Application for a Far-Memory-Friendly Runtime** — official award; route for runtime/storage interaction and bottleneck-to-mechanism framing.
- **XRP: In-Kernel Storage Functions with eBPF** — official award; route for interface redesign, semantic preservation, and prototype-based evaluation.

### OSDI 2023

Official source: https://www.usenix.org/conference/osdi23/technical-sessions

- **Scalene: Scripting-Language Aware Profiling for Python** — official award; route for tool papers combining algorithmic novelty, adoption, and developer outcomes.
- **Ensō: A Streaming Interface for NIC-Application Communication** — official award; route for interface-mismatch framing and end-to-end datapath evidence.

### OSDI 2024

Official source: https://www.usenix.org/conference/osdi24/technical-sessions

- **ServiceLab: Preventing Tiny Performance Regressions at Hyperscale** — official award; route for operational observations, measurement methodology, and lessons from deployment.
- **Anvil: Verifying Liveness of Cluster Management Controllers** — official award; route for correctness-property decomposition and verified systems evaluation.

### OSDI 2025

Official source: https://www.usenix.org/conference/osdi25/technical-sessions

- **Basilisk: Using Provenance Invariants to Automate Proofs of Distributed Protocols** — official award; route for proof-obstacle, key-insight, and coverage framing.
- **Omniglot: Securely and Efficiently Interfacing with Foreign Code** — official award; route for safety boundary, compatibility, and cost-of-guarantee framing.

## Networking exemplars

### NSDI 2021

Official source: https://www.usenix.org/conference/nsdi21/technical-sessions

- **ATP: In-network Aggregation for Multi-tenant Learning** — official award; route for constrained shared-resource design and multi-tenant end-to-end evaluation.

### NSDI 2022

Official source: https://www.usenix.org/conference/nsdi22/technical-sessions

- **Graham: Synchronizing Clocks by Leveraging Local Clock Properties** — official award; route for failure-model framing and commodity-hardware validation.

### NSDI 2025

Official source: https://www.usenix.org/conference/nsdi25/technical-sessions

- **NDD: A Decision Diagram for Network Verification** — official outstanding paper; route for domain-specific abstraction, drop-in replacement, and multi-system validation.

### SIGCOMM 2021–2022

Official award source: https://www.sigcomm.org/awards/best-paper-award

- **Seven Years in the Life of Hypergiants' Off-Nets** — SIGCOMM 2021 official award; route for longitudinal measurement and carefully bounded operational implications.
- **Software-Defined Network Assimilation: Bridging the Last Mile Towards Centralized Network Configuration Management with NAssim** — SIGCOMM 2022 official award; route for deployment transition, compatibility, and incremental adoption.

The SIGCOMM award page is incomplete for later years. Do not infer 2023–2025 winners from its absence; consult the corresponding official conference programs before expanding the corpus.

## Architecture exemplars

### ISCA 2022–2025

Official award source: https://www.sigarch.org/benefit/awards/acm-sigarch-ieee-cs-tcca-isca-best-paper-awardacm-sigarch-ieee-cs-tcca-isca-best-paper-award/

- **NvMR: Non-Volatile Memory Renaming for Intermittent Computing** — ISCA 2022 official award; route for architecture mechanism, correctness across interruption, and cost analysis.
- **Contiguitas: The Pursuit of Physical Memory Contiguity in Datacenters** — ISCA 2023 official award; route for datacenter observation-to-memory-mechanism framing.
- **Constable: Improving Performance and Power Efficiency by Safely Eliminating Load Execution** — ISCA 2024 official award; route for safety conditions, eliminated work, and performance-energy trade-offs.
- **Precise Exceptions in Relaxed Architectures** — ISCA 2025 official award; route for semantics-first architecture arguments and precise correctness claims.
- **H2-LLM: Hardware-Dataflow Co-Exploration for Heterogeneous Hybrid-Bonding-based Low-Batch LLM Inference** — ISCA 2025 official award; route for hardware-dataflow co-design and design-space exploration.

### HPCA 2024–2025

Official sources:

- https://www.hpca-conf.org/2024/program/main.php
- https://www.sigarch.org/hpca-2025-trip-report/

- **Pathfinding Future PIM Architectures by Demystifying a Commercial PIM Technology** — HPCA 2024 official award; route for measurement-led architecture analysis and commercial-system grounding.
- **DynamoLLM: Designing LLM Inference Clusters for Performance and Energy Efficiency** — HPCA 2025 official award; route for cluster architecture, joint performance-energy objectives, and end-to-end evaluation.

### ASPLOS 2025

Official award source: https://www.asplos-conference.org/asplos2025/awards/index.html

- **CXLfork: Fast Remote Fork over CXL Fabrics** — official award; route for hardware-software interface, remote-memory mechanism, and latency breakdown.

### MICRO 2024–2025

Official sources:

- https://microarch.org/micro57/program/index.php
- https://microarch.org/micro58/program/index.php

- **Fusion-3D: Integrated Acceleration for Instant 3D Reconstruction and Real-Time Rendering** — MICRO 2024 official award; route for emerging application, integrated accelerator, and end-to-end demonstration.
- **LLM.265: Video Codecs are Secretly Tensor Codecs** — MICRO 2025 official award; route for cross-domain analogy, representation insight, and architecture opportunity.

## Corpus maintenance contract

- Use the last five complete conference years; do not mix a partial current year into a complete-year claim.
- Add an entry only with an official conference, publisher, or sponsoring-society award source.
- Record award type exactly: best, outstanding, distinguished, runner-up, or honorable mention.
- Keep writing annotations separate from award facts; annotations are analytical guidance, not official conference claims.
- Prefer links to official open-access paper pages or author copies when adding paper-level URLs.
- Remove or correct an entry when its official source contradicts the recorded status.

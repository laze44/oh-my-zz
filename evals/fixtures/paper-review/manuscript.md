# StreamTile: A Tiled Memory Accelerator

Synthetic manuscript for workflow evaluation; all evidence available to the reviewer is below.

## Abstract [page 1]

StreamTile improve end-to-end latency by 4x on every evaluated workload. The contribution is a tile-reuse mechanism for a memory-bound accelerator.

## Design [page 2]

The accelerator consumes a cold 64 GB input from DRAM once per invocation. GB means decimal gigabytes throughout. Every input byte must cross the single DRAM interface after invocation begins and before it ends. No compression, caching, or other input path is used. The DRAM interface has a hard aggregate transfer limit of 32 GB/s. Tile reuse applies only to on-chip intermediate values.

The design proposes a 1 GHz implementation but the evaluation uses a simulator. The paper describes neither a timing validation nor a synthesized implementation. Prior work A uses untiled intermediates; no other related-work comparison is supplied.

## Evaluation [page 3]

Table 1 reports full-invocation latency in seconds, including the input transfer. Each row is one workload. Results are deterministic simulator outputs.

| Workload | Baseline | StreamTile |
| --- | --- | --- |
| W1 | 4.0 | 1.0 |
| W2 | 6.0 | 3.0 |

The arithmetic mean of the two per-workload speedups is 3x. These measurements isolate the tiled design as a whole; no component ablation is provided. Energy and chip area are not evaluated, and the paper makes no energy or area claim.

## Conclusion [page 4]

The experiments show a 3x arithmetic-mean speedup on two simulated workloads. Broader workload coverage is left for future work.

## References

[A] A fictional untiled intermediate-buffer design, summarized in Section Design.

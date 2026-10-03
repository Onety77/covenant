import type { Activity, Milestone, Project, Proof, Vote } from '@/types'
import { BOND_SOL, CURVE_TARGET_SOL, ESCROW_PCT, addDays } from '@/lib/rules'

/*
  Fictional sample launches. No project, person or wallet here is real.
  The sample clock is fixed so countdowns and term days always tell the same story.
*/
export const sampleNow = Date.parse('2026-10-03T15:00:00Z')

const ago = (days: number, h = 0) => new Date(sampleNow - (days * 24 + h) * 3_600_000).toISOString()

const proof = (submittedAt: string, summary: string, readings: Proof['readings'], links: string[]): Proof => ({
  submittedAt,
  summary,
  readings,
  links: links.map((l) => ({ label: l, href: '#' })),
})

const votes = (spec: string, at: string, notes: Record<number, string> = {}): Vote[] =>
  // spec: five chars, a = approve, r = reject, . = not voted yet; panel order v1..v5 shifted by offset
  spec.split('').map((c, i) => ({
    verifierId: `v${i + 1}`,
    verdict: c === 'a' ? 'approve' : c === 'r' ? 'reject' : undefined,
    note: notes[i],
    at: c === '.' ? undefined : addDays(at, 0.2 + i * 0.27),
  }))

const ms = (n: 1 | 2 | 3, title: string, measure: string, target: string, dueDay: number, rest: Partial<Milestone> = {}): Milestone => ({
  n,
  title,
  measure,
  target,
  dueDay,
  status: 'locked',
  releasePct: ESCROW_PCT / 3,
  ...rest,
})

const lanternStart = ago(52, 6)

export const projects: Project[] = [
  {
    id: 'lantern',
    name: 'Lanternfish',
    ticker: 'LANTN',
    tagline: 'A wallet-activity API for Solana apps',
    about:
      'Lanternfish indexes every wallet’s history into one fast API, so apps can show balances, trades and transfers without running their own indexer.',
    launchedAt: lanternStart,
    market: { stage: 'graduated', curveSol: CURVE_TARGET_SOL, curveTargetSol: CURVE_TARGET_SOL, priceUsd: 0.004182, change24h: 0.084, mcapUsd: 4_182_000, volume24hUsd: 612_000, holders: 6_204, liquidityUsd: 388_000 },
    covenant: {
      state: 'active',
      builder: { handle: 'mara.sol', wallet: '3vLx…k8Qe' },
      startedAt: lanternStart,
      endsAt: addDays(lanternStart, 90),
      bondSol: BOND_SOL,
      escrowPct: ESCROW_PCT,
      feesSol: 184.6,
      feesReleasedSol: 41.2,
      milestones: [
        ms(1, 'Public API live', 'The public API answers 99% of requests within 300 ms for 14 straight days.', '99% uptime · 14 days', 30, {
          status: 'proven',
          decidedAt: ago(27),
          proof: proof(ago(30, 4), 'API went public on day 12. Uptime monitor and latency logs for days 12–26 attached.', [
            { k: 'Uptime, 14 days', v: '99.82%' },
            { k: 'p95 latency', v: '212 ms' },
          ], ['Status page', 'Monitor export (CSV)', 'API docs']),
          panel: votes('aaaaa', ago(30, 2)),
        }),
        ms(2, '500 paying API keys', 'At least 500 distinct keys pay for usage, settled onchain to the project treasury.', '500 paying keys', 60, {
          status: 'review',
          reviewClosesAt: addDays(ago(1, 3), 3),
          proof: proof(ago(1, 3), 'Paying keys passed 500 on day 49. Each key pays a treasury address; the list of payer transactions is attached.', [
            { k: 'Paying keys', v: '561' },
            { k: 'Treasury receipts', v: '1,904 tx' },
          ], ['Treasury address', 'Payer list (CSV)', 'Billing dashboard']),
          panel: votes('a..a.', ago(1, 2), { 0: 'Sampled 40 payer wallets; all distinct, all paid within 30 days.', 3: 'Matches treasury receipts. Two keys share a funder, still well above 500.' }),
        }),
        ms(3, '$20k monthly revenue', 'Treasury receives at least $20,000 in fees over any 30-day window before day 90.', '$20,000 / 30 days', 90),
      ],
    },
  },
  (() => {
    const start = ago(18, 2)
    return {
      id: 'tidepool',
      name: 'Tidepool',
      ticker: 'TIDE',
      tagline: 'One order, every perps venue on Solana',
      about: 'Tidepool routes each perpetuals order to the venue with the best price and funding, from one account.',
      launchedAt: start,
      market: { stage: 'graduated', curveSol: CURVE_TARGET_SOL, curveTargetSol: CURVE_TARGET_SOL, priceUsd: 0.00191, change24h: -0.036, mcapUsd: 1_910_000, volume24hUsd: 254_000, holders: 3_118, liquidityUsd: 201_000 },
      covenant: {
        state: 'active',
        builder: { handle: 'kestrel', wallet: '8nTa…Wq31' },
        startedAt: start,
        endsAt: addDays(start, 90),
        bondSol: BOND_SOL,
        escrowPct: ESCROW_PCT,
        feesSol: 61.8,
        feesReleasedSol: 0,
        milestones: [
          ms(1, 'Mainnet beta routing', 'The router fills $1M of notional volume on mainnet across at least two venues.', '$1M routed', 30, { status: 'open' }),
          ms(2, 'Three venues live', 'Orders route across three or more perps venues, with fills visible onchain.', '3 venues', 60),
          ms(3, '10,000 traders', '10,000 distinct wallets place at least one routed order.', '10k wallets', 90),
        ],
      },
    } satisfies Project
  })(),
  (() => {
    const start = ago(29, 1)
    return {
      id: 'sable',
      name: 'Sable',
      ticker: 'SABL',
      tagline: 'Private payroll for onchain teams',
      about: 'Sable pays contributors in stablecoins on a schedule, with amounts hidden from the public ledger.',
      launchedAt: start,
      market: { stage: 'graduated', curveSol: CURVE_TARGET_SOL, curveTargetSol: CURVE_TARGET_SOL, priceUsd: 0.00122, change24h: 0.012, mcapUsd: 1_220_000, volume24hUsd: 98_000, holders: 2_406, liquidityUsd: 142_000 },
      covenant: {
        state: 'active',
        builder: { handle: 'oona', wallet: 'Dk2v…7tLs' },
        startedAt: start,
        endsAt: addDays(start, 90),
        bondSol: BOND_SOL,
        escrowPct: ESCROW_PCT,
        feesSol: 38.9,
        feesReleasedSol: 0,
        milestones: [
          ms(1, 'Audited contracts', 'An independent audit of the payroll program is published with no open critical findings.', 'Audit, 0 critical', 30, {
            status: 'review',
            reviewClosesAt: addDays(ago(0, 20), 3),
            proof: proof(ago(0, 20), 'Audit report published. Two medium findings fixed in the deployed program; the fix commits are linked.', [
              { k: 'Critical findings', v: '0' },
              { k: 'Medium, fixed', v: '2 of 2' },
            ], ['Audit report (PDF)', 'Fix commits', 'Deployed program']),
            panel: votes('a.r..', ago(0, 19), { 0: 'Report is real and matches the deployed program hash.', 2: 'Program hash in the report differs from the one deployed today. Needs the re-audit letter.' }),
          }),
          ms(2, '50 teams paid', '50 distinct teams run at least one payroll cycle on mainnet.', '50 teams', 60),
          ms(3, '$2M paid out', 'Cumulative payroll volume reaches $2,000,000.', '$2M volume', 90),
        ],
      },
    } satisfies Project
  })(),
  (() => {
    const start = ago(70, 3)
    return {
      id: 'kiln',
      name: 'Kiln',
      ticker: 'KILN',
      tagline: 'A crafting game where every item is fired onchain',
      about: 'Kiln is a mobile crafting game. Players fire items in a shared kiln; rare results are minted and tradable.',
      launchedAt: start,
      market: { stage: 'graduated', curveSol: CURVE_TARGET_SOL, curveTargetSol: CURVE_TARGET_SOL, priceUsd: 0.00287, change24h: 0.141, mcapUsd: 2_870_000, volume24hUsd: 433_000, holders: 5_377, liquidityUsd: 260_000 },
      covenant: {
        state: 'active',
        builder: { handle: 'potterfield', wallet: 'Gu4e…1Rnd' },
        startedAt: start,
        endsAt: addDays(start, 90),
        bondSol: BOND_SOL,
        escrowPct: ESCROW_PCT,
        feesSol: 236.4,
        feesReleasedSol: 118.1,
        milestones: [
          ms(1, 'Playable beta', 'A public beta on iOS and Android with 1,000 players who finish the tutorial.', '1,000 players', 30, {
            status: 'proven',
            decidedAt: ago(45),
            proof: proof(ago(47), 'Beta live on both stores since day 15. Tutorial completions from the game’s onchain registry.', [{ k: 'Tutorial completions', v: '1,486' }], ['App Store', 'Google Play', 'Registry']),
            panel: votes('aaaaa', ago(47)),
          }),
          ms(2, 'Onchain items', 'Players mint 25,000 items through the kiln program.', '25,000 mints', 60, {
            status: 'proven',
            decidedAt: ago(12),
            proof: proof(ago(14), 'Mint count from the kiln program, deduplicated by item ID.', [{ k: 'Items minted', v: '31,920' }], ['Program', 'Mint export']),
            panel: votes('aaaar', ago(14)),
            attempts: [
              {
                proof: proof(ago(19), 'Mint count from the kiln program.', [{ k: 'Items minted', v: '27,004' }], ['Program']),
                panel: votes('rrar.', ago(19), { 0: '9,000 of these are test mints from one wallet on day 52.' }),
                decidedAt: ago(17),
              },
            ],
          }),
          ms(3, 'Season one', 'Season one ships with 4,000 weekly players for two consecutive weeks.', '4,000 weekly × 2', 90, { status: 'open' }),
        ],
      },
    } satisfies Project
  })(),
  (() => {
    const start = ago(41, 8)
    return {
      id: 'ferrous',
      name: 'Ferrous',
      ticker: 'FERR',
      tagline: 'An open-source trading terminal',
      about: 'Ferrous is a fast, open-source desktop terminal for Solana markets, with keyboard-first order entry.',
      launchedAt: start,
      market: { stage: 'graduated', curveSol: CURVE_TARGET_SOL, curveTargetSol: CURVE_TARGET_SOL, priceUsd: 0.000846, change24h: -0.071, mcapUsd: 846_000, volume24hUsd: 71_000, holders: 1_942, liquidityUsd: 96_000 },
      covenant: {
        state: 'active',
        builder: { handle: 'tamsin', wallet: 'Pq6r…Ma0e' },
        startedAt: start,
        endsAt: addDays(start, 90),
        bondSol: BOND_SOL,
        escrowPct: ESCROW_PCT,
        feesSol: 44.2,
        feesReleasedSol: 12.6,
        milestones: [
          ms(1, 'Public release', 'Signed builds for macOS, Windows and Linux, with source published.', '3 platforms', 30, {
            status: 'proven',
            decidedAt: ago(14),
            proof: proof(ago(16), 'v0.9 released with reproducible builds.', [{ k: 'Platforms', v: '3' }], ['Releases', 'Source']),
            panel: votes('aaaa.', ago(16)),
          }),
          ms(2, '1,000 daily users', '1,000 distinct wallets sign an order through Ferrous on a single day.', '1,000 DAU', 60, { status: 'open' }),
          ms(3, '$50M volume', 'Orders placed through Ferrous total $50M in notional volume.', '$50M', 90),
        ],
      },
    } satisfies Project
  })(),
  (() => {
    const start = ago(2, 5)
    return {
      id: 'parcel',
      name: 'Parcel',
      ticker: 'PRCL',
      tagline: 'Pay-per-request storage for agents',
      about: 'Parcel lets AI agents store and fetch files, paying per request in SOL with no account.',
      launchedAt: start,
      market: { stage: 'curve', curveSol: 51.4, curveTargetSol: CURVE_TARGET_SOL, priceUsd: 0.0000412, change24h: 0.62, mcapUsd: 41_200, volume24hUsd: 88_000, holders: 611, liquidityUsd: 0 },
      covenant: {
        state: 'active',
        builder: { handle: 'juno.dev', wallet: 'Ah1c…9vVu' },
        startedAt: start,
        endsAt: addDays(start, 90),
        bondSol: BOND_SOL,
        escrowPct: ESCROW_PCT,
        feesSol: 3.1,
        feesReleasedSol: 0,
        milestones: [
          ms(1, 'Storage API on mainnet', 'Agents store 100,000 files through the public API, paid onchain.', '100k paid writes', 30, { status: 'open' }),
          ms(2, 'SDKs in 3 languages', 'TypeScript, Python and Rust SDKs published, each with 500 weekly downloads.', '3 SDKs · 500/wk', 60),
          ms(3, '1 TB stored', 'Total paid storage held by the network exceeds 1 TB.', '1 TB', 90),
        ],
      },
    } satisfies Project
  })(),
  (() => {
    const start = ago(0, 9)
    return {
      id: 'beacon',
      name: 'Beacon',
      ticker: 'BCN',
      tagline: 'Alerts for validator operators',
      about: 'Beacon watches your validator and pages you before a missed slot turns into lost stake.',
      launchedAt: start,
      market: { stage: 'curve', curveSol: 12.8, curveTargetSol: CURVE_TARGET_SOL, priceUsd: 0.0000108, change24h: 0, mcapUsd: 10_800, volume24hUsd: 21_000, holders: 148, liquidityUsd: 0 },
      covenant: {
        state: 'active',
        builder: { handle: 'ruthless.eth', wallet: 'Lt7p…cE2s' },
        startedAt: start,
        endsAt: addDays(start, 90),
        bondSol: BOND_SOL,
        escrowPct: ESCROW_PCT,
        feesSol: 0.6,
        feesReleasedSol: 0,
        milestones: [
          ms(1, '200 validators watched', '200 distinct validator identities connected and alerting.', '200 validators', 30, { status: 'open' }),
          ms(2, 'Paid plan', '60 operators on a paid plan, settled onchain.', '60 paying', 60),
          ms(3, '10% of stake', 'Validators using Beacon hold 10% of active stake.', '10% stake', 90),
        ],
      },
    } satisfies Project
  })(),
  (() => {
    const start = ago(63, 2)
    const def = ago(3, 2)
    return {
      id: 'meridian',
      name: 'Meridian',
      ticker: 'MRDN',
      tagline: 'A bridge front-end that picks the cheapest route',
      about: 'Meridian compared bridge routes into Solana and executed the cheapest one in a single signature.',
      launchedAt: start,
      market: { stage: 'graduated', curveSol: CURVE_TARGET_SOL, curveTargetSol: CURVE_TARGET_SOL, priceUsd: 0.0000171, change24h: -0.034, mcapUsd: 17_100, volume24hUsd: 9_400, holders: 2_512, liquidityUsd: 21_800 },
      covenant: {
        state: 'defaulted',
        builder: { handle: 'vantage', wallet: 'Rr3k…h6Yo' },
        startedAt: start,
        endsAt: addDays(start, 90),
        bondSol: BOND_SOL,
        escrowPct: ESCROW_PCT,
        feesSol: 92.3,
        feesReleasedSol: 21.4,
        milestones: [
          ms(1, 'Route comparison live', 'Quotes from four bridges shown and executable from one screen.', '4 bridges', 30, {
            status: 'proven',
            decidedAt: ago(38),
            proof: proof(ago(40), 'Live with four bridges.', [{ k: 'Bridges', v: '4' }], ['App']),
            panel: votes('aaaaa', ago(40)),
          }),
          ms(2, '$5M bridged', 'Users bridge $5,000,000 in volume through Meridian.', '$5M bridged', 60, { status: 'missed', decidedAt: def }),
          ms(3, 'Fee switch', 'Route fees reach the treasury, $10,000 in any 30 days.', '$10k / 30 days', 90),
        ],
        default: {
          at: def,
          milestone: 2,
          reason: 'missed',
          poolSol: 80.9,
          redeemedPct: 0.118,
          redemptionClosesAt: addDays(def, 14),
          takeovers: [
            { id: 't1', builder: { handle: 'sundial', wallet: 'Wy5m…3Pzs' }, bondSol: 10, plan: 'Rebuild routing on a single aggregator, ship $5M volume in 30 days, then turn on the fee switch.', schedule: [30, 60], at: ago(2, 2) },
            { id: 't2', builder: { handle: 'arcwright', wallet: 'Nn2e…7Duq' }, bondSol: 10, plan: 'Fork the front-end, add intents-based routes, and target $5M in 45 days.', schedule: [45, 80], at: ago(1, 7) },
          ],
        },
      },
    } satisfies Project
  })(),
  (() => {
    const first = ago(112)
    const def = ago(82)
    const start = ago(36, 5)
    return {
      id: 'wren',
      name: 'Wren',
      ticker: 'WREN',
      tagline: 'Group chats with a shared wallet',
      about: 'Wren is a group chat where the group shares a wallet and votes on every payment in the thread.',
      launchedAt: first,
      market: { stage: 'graduated', curveSol: CURVE_TARGET_SOL, curveTargetSol: CURVE_TARGET_SOL, priceUsd: 0.00151, change24h: 0.052, mcapUsd: 1_510_000, volume24hUsd: 140_000, holders: 3_640, liquidityUsd: 176_000 },
      covenant: {
        state: 'active',
        builder: { handle: 'brightwater', wallet: 'Tk9s…e2Hf' },
        startedAt: start,
        endsAt: addDays(start, 90),
        bondSol: BOND_SOL,
        escrowPct: ESCROW_PCT,
        feesSol: 99.1,
        feesReleasedSol: 18.3,
        takenOverFrom: 'fieldnotes',
        milestones: [
          ms(1, 'Group wallets onchain', '2,000 groups each hold an onchain group wallet.', '2,000 wallets', 30, {
            status: 'proven',
            decidedAt: ago(9),
            proof: proof(ago(11), 'Every group now opens with an onchain wallet; the registry lists them.', [{ k: 'Group wallets', v: '2,388' }], ['Registry', 'App Store']),
            panel: votes('aaaaa', ago(11)),
          }),
          ms(2, 'Android + payments', 'Android ships and groups send $250k in voted payments.', '$250k voted', 60, { status: 'open' }),
          ms(3, '25,000 groups', '25,000 groups with an onchain wallet.', '25k groups', 90),
        ],
      },
      previous: [
        {
          state: 'succeeded',
          builder: { handle: 'fieldnotes', wallet: 'Qe4u…b8Kc' },
          startedAt: first,
          endsAt: addDays(first, 90),
          bondSol: BOND_SOL,
          escrowPct: ESCROW_PCT,
          feesSol: 29.6,
          feesReleasedSol: 0,
          milestones: [
            ms(1, 'iOS app live', 'The iOS app is public with 2,000 groups created.', '2,000 groups', 30, {
              status: 'rejected',
              decidedAt: def,
              proof: proof(ago(85), 'App live. Group count from our database.', [{ k: 'Groups', v: '2,140' }], ['App Store']),
              panel: votes('rrrr.', ago(85), { 0: 'Group count is from a private database. The covenant asks for onchain group wallets: 312 exist.' }),
            }),
            ms(2, 'Android + payments', 'Android ships and groups send $250k in voted payments.', '$250k voted', 60),
            ms(3, '25,000 groups', '25,000 groups with an onchain wallet.', '25k groups', 90),
          ],
          default: {
            at: def,
            milestone: 1,
            reason: 'rejected',
            poolSol: 39.6,
            redeemedPct: 0.21,
            redemptionClosesAt: addDays(def, 14),
            takeovers: [{ id: 't3', builder: { handle: 'brightwater', wallet: 'Tk9s…e2Hf' }, bondSol: 10, plan: 'Ship group wallets onchain first, then the Android app.', schedule: [30, 60, 90], at: ago(78) }],
            successor: { handle: 'brightwater', wallet: 'Tk9s…e2Hf', at: start },
          },
        },
      ],
    } satisfies Project
  })(),
  (() => {
    const start = ago(131)
    return {
      id: 'orchard',
      name: 'Orchard',
      ticker: 'ORCH',
      tagline: 'Grants that pay out on delivery',
      about: 'Orchard runs grant programs where each payment unlocks when the grantee ships.',
      launchedAt: start,
      market: { stage: 'graduated', curveSol: CURVE_TARGET_SOL, curveTargetSol: CURVE_TARGET_SOL, priceUsd: 0.00612, change24h: 0.021, mcapUsd: 6_120_000, volume24hUsd: 302_000, holders: 8_820, liquidityUsd: 510_000 },
      covenant: {
        state: 'fulfilled',
        builder: { handle: 'alder', wallet: 'Mc1x…Vv5a' },
        startedAt: start,
        endsAt: addDays(start, 90),
        bondSol: BOND_SOL,
        escrowPct: ESCROW_PCT,
        feesSol: 402.5,
        feesReleasedSol: 402.5,
        milestones: [
          ms(1, 'First program live', 'One grant program with 20 funded grantees.', '20 grantees', 30, { status: 'proven', decidedAt: ago(104), proof: proof(ago(106), 'Program one live.', [{ k: 'Grantees', v: '26' }], ['Program']), panel: votes('aaaaa', ago(106)) }),
          ms(2, '$500k granted', 'Programs pay out $500,000 on verified deliveries.', '$500k', 60, { status: 'proven', decidedAt: ago(75), proof: proof(ago(77), 'Payout ledger.', [{ k: 'Paid out', v: '$612k' }], ['Ledger']), panel: votes('aaaa.', ago(77)) }),
          ms(3, '10 programs', 'Ten independent organisations run programs on Orchard.', '10 orgs', 90, { status: 'proven', decidedAt: ago(43), proof: proof(ago(45), 'Ten organisations live.', [{ k: 'Organisations', v: '11' }], ['Directory']), panel: votes('aaaaa', ago(45)) }),
        ],
      },
    } satisfies Project
  })(),
  (() => {
    const start = ago(96)
    return {
      id: 'quill',
      name: 'Quill',
      ticker: 'QUILL',
      tagline: 'Paid newsletters, settled per read',
      about: 'Quill lets writers charge a few cents per read, paid by readers’ wallets without a subscription.',
      launchedAt: start,
      market: { stage: 'graduated', curveSol: CURVE_TARGET_SOL, curveTargetSol: CURVE_TARGET_SOL, priceUsd: 0.00244, change24h: -0.018, mcapUsd: 2_440_000, volume24hUsd: 120_000, holders: 4_410, liquidityUsd: 233_000 },
      covenant: {
        state: 'fulfilled',
        builder: { handle: 'inkwell', wallet: 'Sb6n…o4Ji' },
        startedAt: start,
        endsAt: addDays(start, 90),
        bondSol: BOND_SOL,
        escrowPct: ESCROW_PCT,
        feesSol: 211.9,
        feesReleasedSol: 211.9,
        milestones: [
          ms(1, '100 writers', '100 writers publish at least one paid post.', '100 writers', 30, { status: 'proven', decidedAt: ago(70), proof: proof(ago(72), 'Writer registry.', [{ k: 'Writers', v: '133' }], ['Registry']), panel: votes('aaaaa', ago(72)) }),
          ms(2, '1M paid reads', 'Readers pay for 1,000,000 reads.', '1M reads', 60, { status: 'proven', decidedAt: ago(38), proof: proof(ago(40), 'Read receipts.', [{ k: 'Paid reads', v: '1.2M' }], ['Receipts']), panel: votes('aaaaa', ago(40)) }),
          ms(3, '$100k to writers', 'Writers receive $100,000 in total.', '$100k paid', 90, { status: 'proven', decidedAt: ago(7), proof: proof(ago(9), 'Payout ledger.', [{ k: 'Paid to writers', v: '$118k' }], ['Ledger']), panel: votes('aaaa.', ago(9)) }),
        ],
      },
    } satisfies Project
  })(),
]

export const getProject = (id: string) => projects.find((p) => p.id === id)

/** Recent protocol events, newest first, interleaved across projects. */
export const activity: Activity[] = [
  { id: 'a1', kind: 'proof', projectId: 'sable', at: ago(0, 20), text: 'Sable submitted proof for “Audited contracts”' },
  { id: 'a2', kind: 'launch', projectId: 'beacon', at: ago(0, 9), text: 'Beacon launched with a 10 SOL bond' },
  { id: 'a3', kind: 'takeover', projectId: 'meridian', at: ago(1, 7), text: 'arcwright offered to take over Meridian' },
  { id: 'a4', kind: 'proof', projectId: 'lantern', at: ago(1, 3), text: 'Lanternfish submitted proof for “500 paying API keys”' },
  { id: 'a5', kind: 'redeem', projectId: 'meridian', at: ago(2, 0), text: 'Meridian holders redeemed 11.8% of supply' },
  { id: 'a6', kind: 'takeover', projectId: 'meridian', at: ago(2, 2), text: 'sundial offered to take over Meridian' },
  { id: 'a7', kind: 'launch', projectId: 'parcel', at: ago(2, 5), text: 'Parcel launched with a 10 SOL bond' },
  { id: 'a8', kind: 'default', projectId: 'meridian', at: ago(3, 4), text: 'Meridian defaulted: “$5M bridged” missed' },
  { id: 'a9', kind: 'proven', projectId: 'quill', at: ago(7), text: 'Quill proved “$100k to writers” — covenant fulfilled' },
  { id: 'a10', kind: 'proven', projectId: 'kiln', at: ago(12), text: 'Kiln proved “Onchain items” on its second attempt' },
  { id: 'a11', kind: 'proven', projectId: 'ferrous', at: ago(14), text: 'Ferrous proved “Public release”' },
  { id: 'a13', kind: 'proven', projectId: 'wren', at: ago(9), text: 'Wren’s new builder proved “Group wallets onchain”' },
  { id: 'a12', kind: 'graduated', projectId: 'tidepool', at: ago(16), text: 'Tidepool graduated; liquidity locked for good' },
]

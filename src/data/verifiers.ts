import type { Verifier } from '@/types'

/** Fictional verifier set. Every name and wallet here is made up. */
const verifiers: Verifier[] = [
  { id: 'v1', handle: 'halcyon', wallet: '7Hq2…mV4e', reviews: 214, agreement: 0.97, stakeSol: 120 },
  { id: 'v2', handle: 'saltmarsh', wallet: 'Cx9a…22Lp', reviews: 188, agreement: 0.95, stakeSol: 90 },
  { id: 'v3', handle: 'norte', wallet: '4kPe…Q1zz', reviews: 162, agreement: 0.96, stakeSol: 100 },
  { id: 'v4', handle: 'ivyline', wallet: 'Bm3s…uT8c', reviews: 141, agreement: 0.93, stakeSol: 75 },
  { id: 'v5', handle: 'oddfellow', wallet: '9Ztr…Kd0a', reviews: 133, agreement: 0.91, stakeSol: 60 },
  { id: 'v6', handle: 'quarry', wallet: 'Ev7n…3hRw', reviews: 127, agreement: 0.98, stakeSol: 140 },
  { id: 'v7', handle: 'pinemarten', wallet: '2Gfa…pW9m', reviews: 98, agreement: 0.94, stakeSol: 55 },
  { id: 'v8', handle: 'ledgerlark', wallet: 'Hn5d…xA4t', reviews: 86, agreement: 0.9, stakeSol: 50 },
  { id: 'v9', handle: 'tallgrass', wallet: '6Rcw…Lm2k', reviews: 71, agreement: 0.96, stakeSol: 65 },
  { id: 'v10', handle: 'moth', wallet: 'Fq8u…9sNe', reviews: 52, agreement: 0.92, stakeSol: 40 },
]

export const getVerifier = (id: string) => verifiers.find((v) => v.id === id)

/** You, when viewing the verify console as a verifier. */
export const me = verifiers[2]

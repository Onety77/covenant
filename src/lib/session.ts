import type { Takeover, Verdict } from '@/types'
import { createStore } from './store'

/*
  What you did this visit, shared across pages: verdicts you cast as a verifier,
  takeover offers you posted, tokens you burned to redeem. Nothing is sent anywhere.
*/

export interface MyVote {
  verdict: Verdict
  note: string
  at: number
}
export const myVotes = createStore<Record<string, MyVote>>({})
export const castVote = (reviewId: string, v: MyVote) => myVotes.set((all) => ({ ...all, [reviewId]: v }))

export const myTakeovers = createStore<Record<string, Takeover>>({})
export const postTakeover = (projectId: string, t: Takeover) => myTakeovers.set((all) => ({ ...all, [projectId]: t }))

export interface MyRedeem {
  tokens: number
  sol: number
  at: number
}
export const myRedeems = createStore<Record<string, MyRedeem>>({})
export const redeem = (projectId: string, r: MyRedeem) =>
  myRedeems.set((all) => {
    const prev = all[projectId]
    return { ...all, [projectId]: prev ? { tokens: prev.tokens + r.tokens, sol: prev.sol + r.sol, at: r.at } : r }
  })

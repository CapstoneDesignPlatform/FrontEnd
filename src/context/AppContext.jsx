/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from 'react'

import { buildInitialData } from '../data'
import { platformApi } from '../services/api'
import { cloneData } from '../utils/helpers'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [state, setState] = useState(() => cloneData(buildInitialData()))
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    let active = true

    const hydrate = async () => {
      const nextState = await platformApi.getAppState()
      if (!active) return

      setState(nextState)
      setIsHydrated(true)
    }

    hydrate()

    return () => {
      active = false
    }
  }, [])

  const actions = useMemo(() => {
    const applyResult = async (request) => {
      const result = await request
      const nextState = result.state ?? result

      setState(nextState)
      return result.data ?? nextState
    }

    return {
      async refreshState() {
        const nextState = await platformApi.getAppState()
        setState(nextState)
        return nextState
      },
      async getRequestDetailForClient(clientId, requestId) {
        return platformApi.getRequestDetailForClient(clientId, requestId)
      },
      async getRequestDetailForExpert(expertId, requestId) {
        return platformApi.getRequestDetailForExpert(expertId, requestId)
      },
      async login(role, userId, isGuest = false) {
        return applyResult(platformApi.login(role, userId, isGuest))
      },
      async logout() {
        return applyResult(platformApi.logout())
      },
      async registerClient(payload) {
        return applyResult(platformApi.registerClient(payload))
      },
      async registerExpert(payload) {
        return applyResult(platformApi.registerExpert(payload))
      },
      async updateClientProfile(clientId, payload) {
        return applyResult(platformApi.updateClientProfile(clientId, payload))
      },
      async createGuestClient(payload) {
        return applyResult(platformApi.createGuestClient(payload))
      },
      async createGuestRequest(guestPayload, requestPayload, publishNow = true) {
        return applyResult(platformApi.createGuestRequest(guestPayload, requestPayload, publishNow))
      },
      async createRequest(payload, publishNow = true, clientId = state.session.userId) {
        return applyResult(platformApi.createRequest(clientId, payload, publishNow))
      },
      async updateRequest(requestId, payload) {
        return applyResult(platformApi.updateRequest(requestId, payload))
      },
      async submitBid(requestId, payload) {
        return applyResult(platformApi.submitBid(state.session.userId, requestId, payload))
      },
      async submitVerification(expertId, payload) {
        return applyResult(platformApi.submitVerification(expertId, payload))
      },
      async reviewExpertVerification(expertId, status) {
        return applyResult(platformApi.reviewExpertVerification(expertId, status))
      },
      async selectExpert(requestId, bidId) {
        return applyResult(platformApi.selectExpert(requestId, bidId))
      },
      async updateClientConfirmedPrice(requestId, bidId, amount) {
        return applyResult(platformApi.updateClientConfirmedPrice(requestId, bidId, amount))
      },
      async markShortlisted(requestId, bidIds) {
        return applyResult(platformApi.markShortlisted(requestId, bidIds))
      },
      async confirmPayment(requestId, method) {
        return applyResult(platformApi.confirmPayment(requestId, method))
      },
      async updateProgress(requestId, status) {
        return applyResult(platformApi.updateProgress(requestId, status))
      },
      async submitClientReview(requestId, review) {
        return applyResult(platformApi.submitClientReview(requestId, review))
      },
      async completeSettlement(requestId) {
        return applyResult(platformApi.completeSettlement(requestId))
      },
      async updateAdminSettings(payload) {
        return applyResult(platformApi.updateAdminSettings(payload))
      },
      async getRequestByCode(code) {
        return platformApi.getRequestByCode(code)
      },
      async lookupGuestRequest(code, verifier) {
        return platformApi.lookupGuestRequest(code, verifier)
      },
      async resetDemoData() {
        const nextState = await platformApi.resetDemoData()
        setState(nextState)
        return nextState
      },
    }
  }, [state.session.userId])

  const value = useMemo(() => ({ state, actions, isHydrated }), [actions, isHydrated, state])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider')
  }
  return context
}

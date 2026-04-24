import { buildInitialData } from '../../data'
import { STORAGE_KEY } from '../../utils/constants'
import { cloneData, createId, createRequestCode } from '../../utils/helpers'

const DEMO_DELAY_MS = 80

const delay = (value) =>
  new Promise((resolve) => {
    window.setTimeout(() => resolve(value), DEMO_DELAY_MS)
  })

const readState = () => {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    return JSON.parse(stored)
  }

  const initialState = cloneData(buildInitialData())
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialState))
  return initialState
}

const writeState = (state) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  return state
}

const getSelectedBid = (state, request) =>
  state.bids.find((bid) => bid.id === request?.selectedBidId) || null

const getSelectedExpert = (state, request) =>
  state.experts.find((expert) => expert.id === request?.selectedExpertId) || null

const buildSelectedExpertPayload = (state, request) => {
  const selectedExpert = getSelectedExpert(state, request)
  const selectedBid = getSelectedBid(state, request)

  if (!selectedExpert) return null

  return {
    id: selectedExpert.id,
    name: selectedExpert.name,
    organization: selectedExpert.organization,
    qualificationType: selectedExpert.qualificationType,
    careerYears: selectedExpert.careerYears,
    phone: selectedExpert.phone,
    email: selectedExpert.email,
    bidAmount: selectedBid?.amount ?? null,
    clientConfirmedPrice: request.clientConfirmedPrice ?? request.finalPrice ?? null,
  }
}

const buildClientContactPayload = (state, request) => {
  const client = state.clients.find((item) => item.id === request?.clientId)
  if (!client) return null

  return {
    id: client.id,
    companyName: client.companyName,
    managerName: client.managerName,
    phone: client.phone,
    email: client.email,
  }
}

const persist = async (updater) => {
  const currentState = readState()
  const result = updater(currentState)
  const nextState = result.state ?? result

  writeState(nextState)

  return delay({
    state: nextState,
    data: result.data,
  })
}

export async function getAppState() {
  return delay(readState())
}

export async function getRequestDetailForClient(clientId, requestId) {
  const state = readState()
  const request = state.requests.find((item) => item.id === requestId && item.clientId === clientId)
  if (!request) return delay(null)

  return delay({
    ...request,
    selectedExpert: buildSelectedExpertPayload(state, request),
  })
}

export async function getRequestDetailForExpert(expertId, requestId) {
  const state = readState()
  const request = state.requests.find((item) => item.id === requestId)
  if (!request) return delay(null)

  const isSelectedExpert = request.selectedExpertId === expertId

  return delay({
    id: request.id,
    code: request.code,
    industrySlug: request.industrySlug,
    industryLabel: request.industryLabel,
    requestCategory: request.requestCategory,
    type: request.type,
    title: request.title,
    description: request.description,
    region: request.region,
    deadline: request.deadline,
    budgetMin: request.budgetMin,
    budgetMax: request.budgetMax,
    status: request.status,
    paymentStatus: request.paymentStatus,
    settlementStatus: request.settlementStatus,
    progressStep: request.progressStep,
    finalPrice: request.finalPrice,
    clientConfirmedPrice: request.clientConfirmedPrice,
    myBid: state.bids.find((bid) => bid.requestId === requestId && bid.expertId === expertId) || null,
    clientContact: isSelectedExpert ? buildClientContactPayload(state, request) : null,
    isSelectedExpert,
  })
}

export async function login(role, userId, isGuest = false) {
  return persist((current) => ({
    state: {
      ...current,
      session: { role, userId, isGuest },
    },
    data: { role, userId, isGuest },
  }))
}

export async function logout() {
  return persist((current) => ({
    state: {
      ...current,
      session: { role: null, userId: null, isGuest: false },
    },
  }))
}

export async function registerClient(payload) {
  return persist((current) => {
    const newClient = { id: createId('client'), ...payload }

    return {
      state: {
        ...current,
        clients: [...current.clients, newClient],
        session: { role: 'client', userId: newClient.id, isGuest: false },
      },
      data: newClient,
    }
  })
}

export async function registerExpert(payload) {
  return persist((current) => {
    const newExpert = {
      id: createId('expert'),
      verificationStatus: 'pending',
      certificateNumber: '',
      businessLicenseFile: '',
      certificateFile: '',
      intro: '',
      careerYears: 0,
      ...payload,
    }

    return {
      state: {
        ...current,
        experts: [...current.experts, newExpert],
        session: { role: 'expert', userId: newExpert.id, isGuest: false },
      },
      data: newExpert,
    }
  })
}

export async function updateClientProfile(clientId, payload) {
  return persist((current) => ({
    state: {
      ...current,
      clients: current.clients.map((client) =>
        client.id === clientId ? { ...client, ...payload } : client,
      ),
    },
  }))
}

export async function createGuestClient(payload) {
  return persist((current) => {
    const guestClient = {
      id: createId('guest-client'),
      ...payload,
      isGuestProfile: true,
    }

    return {
      state: {
        ...current,
        clients: [...current.clients, guestClient],
        session: { role: 'client', userId: guestClient.id, isGuest: true },
      },
      data: guestClient,
    }
  })
}

export async function createGuestRequest(guestPayload, requestPayload, publishNow = true) {
  return persist((current) => {
    const guestClient = {
      id: createId('guest-client'),
      ...guestPayload,
      isGuestProfile: true,
    }

    const nextRequest = {
      id: createId('request'),
      code: createRequestCode(current.requests),
      clientId: guestClient.id,
      status: publishNow ? 'bidding' : 'draft',
      paymentStatus: 'unpaid',
      settlementStatus: 'pending',
      selectedBidId: null,
      selectedExpertId: null,
      finalPrice: null,
      clientConfirmedPrice: null,
      progressStep: '필요정보등록',
      review: null,
      notificationCount: Math.floor(Math.random() * 5) + 1,
      isGuestRequest: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...requestPayload,
    }

    return {
      state: {
        ...current,
        clients: [...current.clients, guestClient],
        requests: [...current.requests, nextRequest],
      },
      data: {
        guestClient,
        request: nextRequest,
      },
    }
  })
}

export async function createRequest(sessionUserId, payload, publishNow = true) {
  return persist((current) => {
    const nextRequest = {
      id: createId('request'),
      code: createRequestCode(current.requests),
      clientId: sessionUserId,
      status: publishNow ? 'bidding' : 'draft',
      paymentStatus: 'unpaid',
      settlementStatus: 'pending',
      selectedBidId: null,
      selectedExpertId: null,
      finalPrice: null,
      clientConfirmedPrice: null,
      progressStep: '필요정보등록',
      review: null,
      notificationCount: Math.floor(Math.random() * 5) + 1,
      isGuestRequest: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...payload,
    }

    return {
      state: {
        ...current,
        requests: [...current.requests, nextRequest],
      },
      data: nextRequest,
    }
  })
}

export async function updateRequest(requestId, payload) {
  return persist((current) => ({
    state: {
      ...current,
      requests: current.requests.map((request) =>
        request.id === requestId
          ? { ...request, ...payload, updatedAt: new Date().toISOString() }
          : request,
      ),
    },
  }))
}

export async function submitBid(sessionUserId, requestId, payload) {
  return persist((current) => {
    const existingBid = current.bids.find(
      (bid) => bid.requestId === requestId && bid.expertId === sessionUserId,
    )

    const nextBid = existingBid
      ? {
          ...existingBid,
          ...payload,
          status: 'submitted',
          submittedAt: new Date().toISOString(),
        }
      : {
          id: createId('bid'),
          requestId,
          expertId: sessionUserId,
          status: 'submitted',
          submittedAt: new Date().toISOString(),
          ...payload,
        }

    return {
      state: {
        ...current,
        bids: existingBid
          ? current.bids.map((bid) => (bid.id === existingBid.id ? nextBid : bid))
          : [...current.bids, nextBid],
        requests: current.requests.map((request) =>
          request.id === requestId
            ? { ...request, status: 'bidding', updatedAt: new Date().toISOString() }
            : request,
        ),
      },
      data: nextBid,
    }
  })
}

export async function submitVerification(expertId, payload) {
  return persist((current) => ({
    state: {
      ...current,
      experts: current.experts.map((expert) =>
        expert.id === expertId ? { ...expert, ...payload, verificationStatus: 'pending' } : expert,
      ),
    },
  }))
}

export async function reviewExpertVerification(expertId, status) {
  return persist((current) => ({
    state: {
      ...current,
      experts: current.experts.map((expert) =>
        expert.id === expertId ? { ...expert, verificationStatus: status } : expert,
      ),
    },
  }))
}

export async function selectExpert(requestId, bidId) {
  return persist((current) => {
    const selectedBid = current.bids.find((bid) => bid.id === bidId)

    return {
      state: {
        ...current,
        bids: current.bids.map((bid) => {
          if (bid.requestId !== requestId) return bid
          if (bid.id === bidId) return { ...bid, status: 'selected' }
          if (['selected', 'shortlisted', 'submitted'].includes(bid.status)) {
            return { ...bid, status: 'rejected' }
          }
          return bid
        }),
        requests: current.requests.map((request) =>
          request.id === requestId
            ? {
                ...request,
                status: 'awaiting_payment',
                selectedBidId: bidId,
                selectedExpertId: selectedBid?.expertId || null,
                finalPrice: selectedBid?.amount || request.finalPrice,
                clientConfirmedPrice: selectedBid?.amount || request.clientConfirmedPrice,
                progressStep: '마감',
                updatedAt: new Date().toISOString(),
              }
            : request,
        ),
      },
    }
  })
}

export async function updateClientConfirmedPrice(requestId, bidId, amount) {
  return persist((current) => {
    const targetBid = current.bids.find((bid) => bid.id === bidId)
    const nextAmount = Number(amount)

    if (!targetBid || nextAmount < Number(targetBid.amount)) {
      return {
        state: current,
        data: {
          error: '의뢰인 확정 금액은 전문가 제시 금액 이상이어야 합니다.',
        },
      }
    }

    return {
      state: {
        ...current,
        requests: current.requests.map((request) =>
          request.id === requestId
            ? {
                ...request,
                finalPrice: nextAmount,
                clientConfirmedPrice: nextAmount,
                updatedAt: new Date().toISOString(),
              }
            : request,
        ),
      },
      data: {
        amount: nextAmount,
      },
    }
  })
}

export async function markShortlisted(requestId, bidIds) {
  return persist((current) => ({
    state: {
      ...current,
      bids: current.bids.map((bid) => {
        if (bid.requestId !== requestId) return bid
        if (bidIds.includes(bid.id) && bid.status === 'submitted') {
          return { ...bid, status: 'shortlisted' }
        }
        return bid
      }),
    },
  }))
}

export async function confirmPayment(requestId, method) {
  return persist((current) => ({
    state: {
      ...current,
      requests: current.requests.map((request) =>
        request.id === requestId
          ? {
              ...request,
              status: 'paid',
              paymentStatus: method === 'escrow' ? 'escrow' : 'paid',
              progressStep: '결제',
              updatedAt: new Date().toISOString(),
            }
          : request,
      ),
    },
  }))
}

export async function updateProgress(requestId, status) {
  return persist((current) => ({
    state: {
      ...current,
      requests: current.requests.map((request) =>
        request.id === requestId
          ? {
              ...request,
              status,
              progressStep:
                status === 'in_progress'
                  ? '진단시작'
                  : status === 'association_review'
                    ? '협회 경유'
                  : status === 'report_submitted'
                    ? '작성 완료 및 발송'
                    : '수령',
              updatedAt: new Date().toISOString(),
            }
          : request,
      ),
    },
  }))
}

export async function submitClientReview(requestId, review) {
  return persist((current) => ({
    state: {
      ...current,
      requests: current.requests.map((request) =>
        request.id === requestId
          ? {
              ...request,
              status: 'completed',
              settlementStatus: 'ready',
              progressStep: '수령',
              review,
              updatedAt: new Date().toISOString(),
            }
          : request,
      ),
    },
  }))
}

export async function completeSettlement(requestId) {
  return persist((current) => ({
    state: {
      ...current,
      requests: current.requests.map((request) =>
        request.id === requestId
          ? {
              ...request,
              status: 'settled',
              settlementStatus: 'completed',
              updatedAt: new Date().toISOString(),
            }
          : request,
      ),
    },
  }))
}

export async function getRequestByCode(code) {
  const state = readState()
  return delay(state.requests.find((request) => request.code === code) || null)
}

export async function lookupGuestRequest(code, verifier) {
  const state = readState()
  const request = state.requests.find((item) => item.code === code && item.isGuestRequest)
  if (!request) return delay(null)

  const client = state.clients.find((item) => item.id === request.clientId)
  const normalized = verifier.trim()
  const matched =
    client?.phone === normalized ||
    client?.email === normalized ||
    client?.email?.includes(normalized) ||
    client?.phone?.endsWith(normalized.replaceAll('-', ''))

  return delay(matched ? { request, client } : null)
}

export async function updateAdminSettings(payload) {
  return persist((current) => ({
    state: {
      ...current,
      adminSettings: { ...current.adminSettings, ...payload },
    },
  }))
}

export async function resetDemoData() {
  const initialState = cloneData(buildInitialData())
  writeState(initialState)
  return delay(initialState)
}

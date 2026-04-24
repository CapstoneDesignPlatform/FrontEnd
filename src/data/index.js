import { adminSettings } from './adminSettings'
import { admins } from './admins'
import { bids } from './bids'
import { clients } from './clients'
import { experts } from './experts'
import { requests } from './requests'

export const buildInitialData = () => ({
  admins,
  clients,
  experts,
  requests,
  bids,
  adminSettings,
  session: {
    role: null,
    userId: null,
    isGuest: false,
  },
})

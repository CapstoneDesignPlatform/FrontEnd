import { useState } from 'react'

import { InfoBanner } from '../../components/common/InfoBanner'
import { PageTitle } from '../../components/common/PageTitle'
import { SectionCard } from '../../components/common/SectionCard'
import { useAppContext } from '../../context/AppContext'
import { formatRatio } from '../../utils/formatters'

export function AdminSettingsPage() {
  const { state, actions } = useAppContext()
  const [dumpingThresholdRatio, setDumpingThresholdRatio] = useState(state.adminSettings.dumpingThresholdRatio)
  const [platformFeeRate, setPlatformFeeRate] = useState(state.adminSettings.platformFeeRate)
  const [saved, setSaved] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    await actions.updateAdminSettings({
      dumpingThresholdRatio: Number(dumpingThresholdRatio),
      platformFeeRate: Number(platformFeeRate),
    })
    setSaved(true)
  }

  return (
    <div>
      <PageTitle eyebrow="Platform Settings" title="덤핑 방지 / 수수료 설정" description="데모용 mock API 저장소에 유지되는 관리자 설정 값입니다." />
      {saved ? <InfoBanner tone="success">설정이 저장되었습니다.</InfoBanner> : null}
      <SectionCard title="현재 기준">
        <div className="detail-grid">
          <div className="detail-item">
            <span>덤핑 하한 비율</span>
            <strong>{formatRatio(state.adminSettings.dumpingThresholdRatio)}</strong>
          </div>
          <div className="detail-item">
            <span>플랫폼 수수료율</span>
            <strong>{formatRatio(state.adminSettings.platformFeeRate)}</strong>
          </div>
        </div>
      </SectionCard>
      <SectionCard title="설정 변경">
        <form className="form-grid" onSubmit={handleSubmit}>
          <label>
            평균가 대비 하한 비율
            <input max="1" min="0.1" step="0.05" type="number" value={dumpingThresholdRatio} onChange={(event) => setDumpingThresholdRatio(event.target.value)} />
          </label>
          <label>
            플랫폼 수수료율
            <input max="0.3" min="0" step="0.01" type="number" value={platformFeeRate} onChange={(event) => setPlatformFeeRate(event.target.value)} />
          </label>
          <div className="full inline-actions">
            <button className="button" type="submit">
              설정 저장
            </button>
          </div>
        </form>
      </SectionCard>
    </div>
  )
}

import AccountNavBar from "../../../src/components/core/AccountNavBar"
import AutomationDetailsContent from "../../../src/components/pages/automationDetails/components/AutomationDetailsContent"

export const TerminalAutomationDetailPage = () => {
  return (
    <div className="h-screen">
      <div className="flex h-[calc(100%-18px)] flex-col">
        <AccountNavBar />
        <AutomationDetailsContent />
      </div>
    </div>
  )
}

export default TerminalAutomationDetailPage

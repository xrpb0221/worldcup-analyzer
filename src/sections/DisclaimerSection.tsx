import { useI18n } from '@/i18n';

export default function DisclaimerSection({ onBack }: { onBack: () => void }) {
  const { t } = useI18n();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="text-blue-500 hover:text-blue-700 text-sm flex items-center gap-1 cursor-pointer"
        >
          ← {t('common.back') || '返回'}
        </button>
        <h1 className="text-2xl font-bold text-slate-800">
          ⚖️ {t('disclaimer.title') || '免责声明与法律信息'}
        </h1>
      </div>

      <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
        {/* 免责声明 */}
        <section className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-3">📢 免责声明</h2>
          <div className="space-y-2 text-slate-600">
            <p>1. 本网站（WorldCup Analyzer）所有内容仅供<strong>娱乐和信息参考</strong>之用，不构成任何专业建议。</p>
            <p>2. 比赛预测、模拟结果、数据分析等功能均为<strong>算法自动生成</strong>，不代表实际情况，不应作为任何决策依据。</p>
            <p>3. 本网站<strong>不涉及任何真实货币赌博、投注或博彩活动</strong>，所有预测功能均为免费娱乐性质。</p>
            <p>4. 用户使用本网站预测竞猜功能，系自愿参与，<strong>本站不对任何因使用本网站内容而产生的直接或间接损失负责</strong>。</p>
            <p>5. 本网站尽力确保数据的准确性，但<strong>不保证所有信息的完全准确性、完整性或时效性</strong>，数据来源参见下文。</p>
          </div>
        </section>

        {/* 数据来源 */}
        <section className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-3">📊 数据来源声明</h2>
          <div className="space-y-2 text-slate-600">
            <p>本网站数据来源于以下公开渠道：</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>TheSportsDB API（公开体育数据接口）</li>
              <li>Open-Meteo API（公开天气数据）</li>
              <li>Fox Sports、ESPN 等媒体RSS订阅</li>
              <li>懂球帝、新浪体育等公开报道</li>
            </ul>
            <p className="mt-2">所有数据仅供参考资料，本站不对数据源的准确性承担保证责任。如发现数据错误，请联系我们更正。</p>
            <p className="mt-2 text-xs text-slate-400">本网站为个人非商业项目，符合《信息网络传播权保护条例》合理使用原则。如涉及版权问题，请联系我们删除。</p>
          </div>
        </section>

        {/* 法律合规 */}
        <section className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-3">⚖️ 法律合规声明</h2>
          <div className="space-y-2 text-slate-600">
            <p>1. 本网站已完成ICP备案申请，在备案审核期间按要求展示备案提示。</p>
            <p>2. 本网站<strong>严禁任何赌博、投注、博彩相关行为</strong>。预测功能仅限免费娱乐，不涉及真实货币交易。</p>
            <p>3. 根据《中华人民共和国网络安全法》，本网站采取措施保护用户个人信息安全，详见隐私政策。</p>
            <p>4. 本网站内容如涉及第三方权利（包括但不限于商标、肖像、版权等），相关权利归原作者所有，本站仅作非营利性引用。</p>
            <p>5. 如本网站内容侵犯了您的合法权益，请以书面方式通知我们，我们将尽快处理。</p>
          </div>
        </section>

        {/* 联系方式 */}
        <section className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-3">📬 联系我们</h2>
          <div className="space-y-2 text-slate-600">
            <p>如发现数据错误、版权问题或其他需要联系本站的事项，请通过以下方式联系：</p>
            <p>网站：<a href="https://worldcupanalyzer.com:8443" className="text-blue-500 underline">worldcupanalyzer.com:8443</a></p>
            <p className="text-xs text-slate-400 mt-2">本免责声明最后更新时间：2026年6月18日</p>
          </div>
        </section>

        <div className="text-center">
          <button
            onClick={onBack}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer"
          >
            {t('common.back') || '返回首页'}
          </button>
        </div>
      </div>
    </div>
  );
}

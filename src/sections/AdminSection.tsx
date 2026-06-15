import { useState } from 'react';
import { adminAuth, getAdminTeams, saveAdminTeams, getAdminStadiums, saveAdminStadiums, exportAllData, importAllData, resetAdminData } from '@/data/admin';
import { teams as defaultTeams } from '@/data/teams';
import { stadiums as defaultStadiums } from '@/data/stadiums';
import type { Team, Player, Stadium } from '@/types';
import { Lock, Users, MapPin, Download, Upload, RotateCcw, LogOut, Plus, Trash2, Edit3, Save, X, ChevronDown, ChevronRight, Shield, Star } from 'lucide-react';

function LoginForm({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminAuth.login(password)) {
      onLogin();
    } else {
      setError('密码错误，请重试');
      setPassword('');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
          <div className="flex items-center justify-center w-16 h-16 bg-amber-100 rounded-2xl mx-auto mb-6">
            <Lock className="w-8 h-8 text-amber-600" />
          </div>
          <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">管理后台</h2>
          <p className="text-slate-500 text-center text-sm mb-6">请输入管理密码以进入后台</p>
          <form onSubmit={handleSubmit}>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="输入管理密码"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-lg mb-2"
              autoFocus
            />
            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              登录
            </button>
          </form>
          <div className="mt-4 p-3 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-500 text-center">默认密码: <code className="bg-slate-200 px-1.5 py-0.5 rounded">worldcup2026</code></p>
            <p className="text-xs text-slate-400 text-center mt-1">登录后可在设置中修改</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Team Editor Component
function TeamEditor({ team, onSave, onCancel }: { team: Team; onSave: (t: Team) => void; onCancel: () => void }) {
  const [form, setForm] = useState<Team>({ ...team });
  const [expandedPlayer, setExpandedPlayer] = useState<string | null>(null);

  const updateField = (key: keyof Team, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const updatePlayer = (idx: number, field: keyof Player, value: any) => {
    const newPlayers = [...form.keyPlayers];
    newPlayers[idx] = { ...newPlayers[idx], [field]: value };
    setForm(prev => ({ ...prev, keyPlayers: newPlayers }));
  };

  const addPlayer = () => {
    const newPlayer: Player = {
      id: `${form.id}-${form.keyPlayers.length + 1}`,
      name: '新球员',
      position: 'MF',
      age: 25,
      club: '',
      nationality: form.nameEn,
      rating: 75,
      goals: 0,
      assists: 0,
      matches: 0,
      value: '€10M',
      injured: false,
      fitness: 80,
    };
    setForm(prev => ({ ...prev, keyPlayers: [...prev.keyPlayers, newPlayer] }));
  };

  const removePlayer = (idx: number) => {
    setForm(prev => ({ ...prev, keyPlayers: prev.keyPlayers.filter((_, i) => i !== idx) }));
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-800">编辑球队 - {form.flag} {form.name}</h3>
        <div className="flex gap-2">
          <button onClick={() => onSave(form)} className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            <Save className="w-4 h-4" /> 保存
          </button>
          <button onClick={onCancel} className="flex items-center gap-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            <X className="w-4 h-4" /> 取消
          </button>
        </div>
      </div>

      {/* Basic Info */}
      <div className="mb-8">
        <h4 className="text-sm font-semibold text-slate-600 mb-3 flex items-center gap-2"><Users className="w-4 h-4" /> 基本信息</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {[
            { label: '球队名称', key: 'name' as const },
            { label: '英文名', key: 'nameEn' as const },
            { label: '国旗', key: 'flag' as const },
            { label: '小组', key: 'group' as const },
            { label: '排名', key: 'ranking' as const, type: 'number' },
            { label: '主教练', key: 'coach' as const },
            { label: '教练国籍', key: 'coachNationality' as const },
            { label: '教练年龄', key: 'coachAge' as const, type: 'number' },
            { label: '教练经验(年)', key: 'coachExperience' as const, type: 'number' },
            { label: '教练评分', key: 'coachRating' as const, type: 'number' },
            { label: '进攻评分', key: 'attackRating' as const, type: 'number' },
            { label: '防守评分', key: 'defenseRating' as const, type: 'number' },
            { label: '中场评分', key: 'midRating' as const, type: 'number' },
            { label: '综合评分', key: 'overallRating' as const, type: 'number' },
            { label: '胜', key: 'wins' as const, type: 'number' },
            { label: '平', key: 'draws' as const, type: 'number' },
            { label: '负', key: 'losses' as const, type: 'number' },
            { label: '进球', key: 'goalsFor' as const, type: 'number' },
            { label: '失球', key: 'goalsAgainst' as const, type: 'number' },
            { label: '积分', key: 'points' as const, type: 'number' },
            { label: '战术风格', key: 'style' as const },
            { label: '所属洲', key: 'confederation' as const },
            { label: '总身价', key: 'totalValue' as const },
            { label: '平均年龄', key: 'avgAge' as const, type: 'number' },
          ].map(field => (
            <div key={field.key}>
              <label className="block text-xs text-slate-500 mb-1">{field.label}</label>
              <input
                type={field.type || 'text'}
                value={(form as any)[field.key]}
                onChange={e => updateField(field.key, field.type === 'number' ? Number(e.target.value) : e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Players */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-slate-600 flex items-center gap-2"><Star className="w-4 h-4" /> 关键球员</h4>
          <button onClick={addPlayer} className="flex items-center gap-1 text-amber-600 hover:text-amber-700 text-sm font-medium">
            <Plus className="w-4 h-4" /> 添加球员
          </button>
        </div>
        <div className="space-y-2">
          {form.keyPlayers.map((player, idx) => (
            <div key={player.id} className="border border-slate-200 rounded-lg">
              <button
                onClick={() => setExpandedPlayer(expandedPlayer === player.id ? null : player.id)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {expandedPlayer === player.id ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                  <span className="font-medium text-sm text-slate-800">{player.name}</span>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{player.position}</span>
                  <span className="text-xs text-slate-500">评分 {player.rating}</span>
                </div>
                <button onClick={(e) => { e.stopPropagation(); removePlayer(idx); }} className="text-red-400 hover:text-red-600 p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </button>
              {expandedPlayer === player.id && (
                <div className="px-4 pb-4 pt-2 border-t border-slate-100">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {[
                      { label: '姓名', key: 'name' as const },
                      { label: '位置', key: 'position' as const },
                      { label: '年龄', key: 'age' as const, type: 'number' },
                      { label: '俱乐部', key: 'club' as const },
                      { label: '国籍', key: 'nationality' as const },
                      { label: '评分', key: 'rating' as const, type: 'number' },
                      { label: '进球', key: 'goals' as const, type: 'number' },
                      { label: '助攻', key: 'assists' as const, type: 'number' },
                      { label: '出场', key: 'matches' as const, type: 'number' },
                      { label: '身价', key: 'value' as const },
                      { label: '体能', key: 'fitness' as const, type: 'number' },
                    ].map(field => (
                      <div key={field.key}>
                        <label className="block text-xs text-slate-500 mb-1">{field.label}</label>
                        <input
                          type={field.type || 'text'}
                          value={(player as any)[field.key]}
                          onChange={e => updatePlayer(idx, field.key, field.type === 'number' ? Number(e.target.value) : e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                        />
                      </div>
                    ))}
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">伤病</label>
                      <select
                        value={player.injured ? '1' : '0'}
                        onChange={e => updatePlayer(idx, 'injured', e.target.value === '1')}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                      >
                        <option value="0">健康</option>
                        <option value="1">受伤</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Stadium Editor Component
function StadiumEditor({ stadium, onSave, onCancel }: { stadium: Stadium; onSave: (s: Stadium) => void; onCancel: () => void }) {
  const [form, setForm] = useState<Stadium>({ ...stadium });

  const updateField = (key: keyof Stadium, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-800">编辑球场 - {form.name}</h3>
        <div className="flex gap-2">
          <button onClick={() => onSave(form)} className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            <Save className="w-4 h-4" /> 保存
          </button>
          <button onClick={onCancel} className="flex items-center gap-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            <X className="w-4 h-4" /> 取消
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {[
          { label: '球场名称', key: 'name' as const },
          { label: '城市', key: 'city' as const },
          { label: '国家', key: 'country' as const },
          { label: '容量', key: 'capacity' as const, type: 'number' },
          { label: '草坪类型', key: 'surface' as const },
          { label: '海拔(m)', key: 'altitude' as const, type: 'number' },
          { label: '建成年份', key: 'builtYear' as const, type: 'number' },
          { label: '简介', key: 'description' as const },
        ].map(field => (
          <div key={field.key} className={field.key === 'description' ? 'col-span-2 md:col-span-3' : ''}>
            <label className="block text-xs text-slate-500 mb-1">{field.label}</label>
            {field.key === 'description' ? (
              <textarea
                value={(form as any)[field.key]}
                onChange={e => updateField(field.key, e.target.value)}
                rows={3}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
              />
            ) : (
              <input
                type={field.type || 'text'}
                value={(form as any)[field.key]}
                onChange={e => updateField(field.key, field.type === 'number' ? Number(e.target.value) : e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

type AdminTab = 'teams' | 'stadiums' | 'settings';

export default function AdminSection() {
  const [isAuth, setIsAuth] = useState(adminAuth.isAuthenticated());
  const [activeAdminTab, setActiveAdminTab] = useState<AdminTab>('teams');
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [editingStadium, setEditingStadium] = useState<Stadium | null>(null);
  const [adminTeams, setAdminTeams] = useState<Team[]>(() => getAdminTeams(defaultTeams));
  const [adminStadiums, setAdminStadiums] = useState<Stadium[]>(() => getAdminStadiums(defaultStadiums));
  const [importText, setImportText] = useState('');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showNotif = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  if (!isAuth) {
    return <LoginForm onLogin={() => setIsAuth(true)} />;
  }

  const handleSaveTeam = (team: Team) => {
    const newTeams = adminTeams.map(t => t.id === team.id ? team : t);
    setAdminTeams(newTeams);
    saveAdminTeams(newTeams);
    setEditingTeam(null);
    showNotif('success', `球队 ${team.name} 已保存`);
  };

  const handleDeleteTeam = (id: string) => {
    const newTeams = adminTeams.filter(t => t.id !== id);
    setAdminTeams(newTeams);
    saveAdminTeams(newTeams);
    showNotif('success', '球队已删除');
  };

  const handleAddTeam = () => {
    const newTeam: Team = {
      id: `NEW-${Date.now()}`,
      name: '新球队',
      nameEn: 'New Team',
      flag: '🏳️',
      group: 'A',
      ranking: 50,
      coach: '未指定',
      coachNationality: '',
      coachAge: 50,
      coachExperience: 5,
      coachRating: 60,
      attackRating: 70,
      defenseRating: 70,
      midRating: 70,
      overallRating: 70,
      avgAge: 26,
      totalValue: '€100M',
      wins: 0, draws: 0, losses: 0,
      goalsFor: 0, goalsAgainst: 0, points: 0,
      form: [],
      keyPlayers: [],
      style: '平衡',
      confederation: 'AFC',
    };
    const newTeams = [...adminTeams, newTeam];
    setAdminTeams(newTeams);
    saveAdminTeams(newTeams);
    setEditingTeam(newTeam);
    showNotif('success', '已添加新球队');
  };

  const handleSaveStadium = (stadium: Stadium) => {
    const newStadiums = adminStadiums.map(s => s.id === stadium.id ? stadium : s);
    setAdminStadiums(newStadiums);
    saveAdminStadiums(newStadiums);
    setEditingStadium(null);
    showNotif('success', `球场 ${stadium.name} 已保存`);
  };

  const handleDeleteStadium = (id: string) => {
    const newStadiums = adminStadiums.filter(s => s.id !== id);
    setAdminStadiums(newStadiums);
    saveAdminStadiums(newStadiums);
    showNotif('success', '球场已删除');
  };

  const handleAddStadium = () => {
    const newStadium: Stadium = {
      id: `ST-${Date.now()}`,
      name: '新球场',
      city: '未指定',
      country: '未指定',
      capacity: 40000,
      surface: '天然草皮',
      altitude: 0,
      builtYear: 2020,
      description: '',
      coordinates: { lat: 0, lng: 0 },
    };
    const newStadiums = [...adminStadiums, newStadium];
    setAdminStadiums(newStadiums);
    saveAdminStadiums(newStadiums);
    setEditingStadium(newStadium);
    showNotif('success', '已添加新球场');
  };

  const handleExport = () => {
    const data = exportAllData(adminTeams, adminStadiums);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `worldcup-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showNotif('success', '数据已导出');
  };

  const handleImport = () => {
    const result = importAllData(importText);
    if (result) {
      setAdminTeams(result.teams);
      setAdminStadiums(result.stadiums);
      saveAdminTeams(result.teams);
      saveAdminStadiums(result.stadiums);
      setImportText('');
      showNotif('success', '数据已导入');
    } else {
      showNotif('error', '导入失败，JSON格式不正确');
    }
  };

  const handleReset = () => {
    if (confirm('确定要重置所有数据吗？这将恢复为默认数据。')) {
      resetAdminData();
      setAdminTeams(defaultTeams);
      setAdminStadiums(defaultStadiums);
      showNotif('success', '数据已重置为默认');
    }
  };

  return (
    <div className="space-y-6">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium ${
          notification.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {notification.message}
        </div>
      )}

      {/* Admin Header */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2"><Shield className="w-7 h-7" /> 管理后台</h2>
            <p className="text-amber-100 mt-1">管理球队、球员、球场等所有数据</p>
          </div>
          <button
            onClick={() => { adminAuth.logout(); setIsAuth(false); }}
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
          >
            <LogOut className="w-4 h-4" /> 退出
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 bg-white rounded-xl p-1.5 shadow-sm border border-slate-200">
        {([
          { key: 'teams' as AdminTab, label: '球队管理', icon: Users },
          { key: 'stadiums' as AdminTab, label: '球场管理', icon: MapPin },
          { key: 'settings' as AdminTab, label: '数据管理', icon: Shield },
        ] as const).map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveAdminTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeAdminTab === tab.key
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeAdminTab === 'teams' && (
        <div className="space-y-4">
          {editingTeam ? (
            <TeamEditor team={editingTeam} onSave={handleSaveTeam} onCancel={() => setEditingTeam(null)} />
          ) : (
            <>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">共 {adminTeams.length} 支球队</span>
                <button onClick={handleAddTeam} className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  <Plus className="w-4 h-4" /> 添加球队
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {adminTeams.map(team => (
                  <div key={team.id} className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{team.flag}</span>
                        <div>
                          <div className="font-semibold text-slate-800">{team.name}</div>
                          <div className="text-xs text-slate-500">{team.nameEn} · {team.group}组</div>
                        </div>
                      </div>
                      <div className="text-lg font-bold text-amber-600">{team.overallRating}</div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
                      <div className="bg-red-50 text-red-700 px-2 py-1 rounded text-center">
                        <div className="font-semibold">{team.attackRating}</div>进攻
                      </div>
                      <div className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-center">
                        <div className="font-semibold">{team.midRating}</div>中场
                      </div>
                      <div className="bg-green-50 text-green-700 px-2 py-1 rounded text-center">
                        <div className="font-semibold">{team.defenseRating}</div>防守
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                      <span>教练: {team.coach}</span>
                      <span>{team.keyPlayers.length} 名关键球员</span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setEditingTeam(team)} className="flex-1 flex items-center justify-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-lg text-sm transition-colors">
                        <Edit3 className="w-3.5 h-3.5" /> 编辑
                      </button>
                      <button onClick={() => handleDeleteTeam(team.id)} className="flex items-center justify-center gap-1 bg-red-50 hover:bg-red-100 text-red-600 py-2 px-3 rounded-lg text-sm transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {activeAdminTab === 'stadiums' && (
        <div className="space-y-4">
          {editingStadium ? (
            <StadiumEditor stadium={editingStadium} onSave={handleSaveStadium} onCancel={() => setEditingStadium(null)} />
          ) : (
            <>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">共 {adminStadiums.length} 个球场</span>
                <button onClick={handleAddStadium} className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  <Plus className="w-4 h-4" /> 添加球场
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {adminStadiums.map(stadium => (
                  <div key={stadium.id} className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-slate-800">{stadium.name}</h4>
                      <div className="flex gap-2">
                        <button onClick={() => setEditingStadium(stadium)} className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-sm transition-colors">
                          <Edit3 className="w-3.5 h-3.5" /> 编辑
                        </button>
                        <button onClick={() => handleDeleteStadium(stadium.id)} className="flex items-center gap-1 bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-lg text-sm transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="text-sm text-slate-600 space-y-1">
                      <div>📍 {stadium.city}, {stadium.country}</div>
                      <div>👥 容量: {stadium.capacity.toLocaleString()}</div>
                      <div>🌿 {stadium.surface} · 海拔 {stadium.altitude}m · 建于 {stadium.builtYear}</div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {activeAdminTab === 'settings' && (
        <div className="space-y-6">
          {/* Export */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2"><Download className="w-5 h-5 text-emerald-600" /> 导出数据</h3>
            <p className="text-sm text-slate-500 mb-4">将所有数据导出为 JSON 文件，可用于备份或迁移到其他平台。</p>
            <button onClick={handleExport} className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors">
              <Download className="w-4 h-4" /> 导出全部数据
            </button>
          </div>

          {/* Import */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2"><Upload className="w-5 h-5 text-blue-600" /> 导入数据</h3>
            <p className="text-sm text-slate-500 mb-4">粘贴之前导出的 JSON 数据来恢复或覆盖当前数据。</p>
            <textarea
              value={importText}
              onChange={e => setImportText(e.target.value)}
              placeholder='粘贴 JSON 数据...'
              rows={6}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none font-mono mb-3"
            />
            <button onClick={handleImport} disabled={!importText.trim()} className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-300 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors">
              <Upload className="w-4 h-4" /> 导入数据
            </button>
          </div>

          {/* Reset */}
          <div className="bg-white rounded-xl border border-red-200 p-6">
            <h3 className="text-lg font-bold text-red-600 mb-3 flex items-center gap-2"><RotateCcw className="w-5 h-5" /> 重置数据</h3>
            <p className="text-sm text-slate-500 mb-4">清除所有自定义修改，恢复为默认数据。此操作不可撤销！</p>
            <button onClick={handleReset} className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors">
              <RotateCcw className="w-4 h-4" /> 重置为默认数据
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from 'react';
import { stadiums } from '@/data/stadiums';
import { fetchWeatherData } from '@/data/liveData';
import type { Stadium } from '@/types';
import { MapPin, Users, Mountain, Calendar, Wind, Droplets, Thermometer, Trophy, Flag, RefreshCw } from 'lucide-react';

// 默认天气数据（API 不可用时回退）
const defaultWeather: Record<string, { temp: number; humidity: number; windSpeed: number; condition: string; icon: string }> = {
  '墨西哥城': { temp: 18, humidity: 55, windSpeed: 8, condition: '多云', icon: '⛅' },
  '瓜达拉哈拉': { temp: 22, humidity: 50, windSpeed: 6, condition: '晴朗', icon: '☀️' },
  '蒙特雷': { temp: 30, humidity: 60, windSpeed: 10, condition: '炎热', icon: '🌞' },
  '温哥华': { temp: 16, humidity: 70, windSpeed: 12, condition: '多云有小雨', icon: '🌦️' },
  '多伦多': { temp: 22, humidity: 60, windSpeed: 8, condition: '晴间多云', icon: '⛅' },
  '达拉斯': { temp: 35, humidity: 55, windSpeed: 14, condition: '干热', icon: '🌡️' },
  '纽约/新泽西': { temp: 24, humidity: 65, windSpeed: 10, condition: '沿海温和', icon: '🌤️' },
  '洛杉矶': { temp: 26, humidity: 45, windSpeed: 8, condition: '晴朗舒适', icon: '☀️' },
  '亚特兰大': { temp: 28, humidity: 70, windSpeed: 6, condition: '湿热', icon: '🌤️' },
  '休斯敦': { temp: 33, humidity: 75, windSpeed: 8, condition: '炎热潮湿', icon: '🌡️' },
  '迈阿密': { temp: 31, humidity: 80, windSpeed: 10, condition: '热带气候', icon: '🌴' },
  '波士顿': { temp: 22, humidity: 60, windSpeed: 10, condition: '夏季宜人', icon: '⛅' },
  '堪萨斯城': { temp: 28, humidity: 55, windSpeed: 12, condition: '温暖', icon: '☀️' },
  '费城': { temp: 24, humidity: 60, windSpeed: 8, condition: '夏季温和', icon: '⛅' },
  '旧金山湾区': { temp: 18, humidity: 65, windSpeed: 16, condition: '凉爽多雾', icon: '🌫️' },
  '西雅图': { temp: 18, humidity: 70, windSpeed: 12, condition: '凉爽多云', icon: '⛅' },
};

function WeatherWidget({ city, liveWeather }: { city: string; liveWeather?: { temp: number; humidity: number; windSpeed: number; condition: string; icon: string } }) {
  const w = liveWeather || defaultWeather[city] || { temp: 22, humidity: 60, windSpeed: 8, condition: '适宜', icon: '⛅' };
  const isLive = !!liveWeather;
  return (
    <div className="flex items-center gap-3 p-3 bg-sky-50 rounded-xl border border-sky-100">
      <span className="text-2xl">{w.icon}</span>
      <div className="flex-1">
        <div className="font-medium text-slate-700 text-sm flex items-center gap-1.5">
          {w.condition}
          {isLive && <span className="text-[10px] text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded-full">实时</span>}
        </div>
        <div className="flex gap-3 text-xs text-slate-500 mt-1">
          <span className="flex items-center gap-1"><Thermometer className="w-3 h-3" />{w.temp}°C</span>
          <span className="flex items-center gap-1"><Droplets className="w-3 h-3" />{w.humidity}%</span>
          <span className="flex items-center gap-1"><Wind className="w-3 h-3" />{w.windSpeed}km/h</span>
        </div>
      </div>
    </div>
  );
}

function StadiumCard({ stadium, liveWeather }: { stadium: Stadium; liveWeather?: { temp: number; humidity: number; windSpeed: number; condition: string; icon: string } }) {
  const flagMap: Record<string, string> = {
    '美国': '🇺🇸',
    '加拿大': '🇨🇦',
    '墨西哥': '🇲🇽',
    '卡塔尔': '🇶🇦',
  };

  const gradients: Record<number, string> = {
    0: 'from-blue-600 to-blue-800',
    1: 'from-red-600 to-red-800',
    2: 'from-green-600 to-green-800',
    3: 'from-purple-600 to-purple-800',
    4: 'from-orange-600 to-orange-800',
    5: 'from-teal-600 to-teal-800',
    6: 'from-indigo-600 to-indigo-800',
    7: 'from-rose-600 to-rose-800',
  };

  const idx = stadiums.indexOf(stadium);
  const grad = gradients[idx % 8];

  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm match-card-hover">
      {/* Header */}
      <div className={`px-5 py-4 bg-gradient-to-r ${grad} text-white`}>
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-bold text-lg leading-snug">{stadium.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <MapPin className="w-3.5 h-3.5 text-white/70" />
              <span className="text-sm text-white/80">{stadium.city}, {stadium.country}</span>
              <span className="text-base">{flagMap[stadium.country] || '🏳️'}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-black mono">{stadium.capacity.toLocaleString()}</div>
            <div className="text-xs text-white/70">座位容量</div>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-5 space-y-4">
        <p className="text-sm text-slate-500 leading-relaxed">{stadium.description}</p>

        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Mountain, label: '海拔高度', value: `${stadium.altitude}m` },
            { icon: Calendar, label: '建成年份', value: `${stadium.builtYear}年` },
            { icon: Users, label: '草坪类型', value: stadium.surface },
          ].map(item => (
            <div key={item.label} className="bg-slate-50 rounded-xl p-3 text-center">
              <item.icon className="w-4 h-4 mx-auto mb-1 text-slate-400" />
              <div className="font-semibold text-slate-700 text-sm">{item.value}</div>
              <div className="text-xs text-slate-400">{item.label}</div>
            </div>
          ))}
        </div>

        {/* Weather */}
        <div>
          <div className="text-xs font-semibold text-slate-500 mb-2">📡 赛时天气预报</div>
          <WeatherWidget city={stadium.city} liveWeather={liveWeather} />
        </div>

        {/* Altitude Warning */}
        {stadium.altitude > 1000 && (
          <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-xl border border-amber-100">
            <span className="text-amber-500 text-lg mt-0.5">⚠️</span>
            <div className="text-xs text-amber-700">
              <span className="font-semibold">高海拔警告：</span>
              海拔 {stadium.altitude}m，空气稀薄，体能消耗比平原地区高约15-20%，
              可能影响球员发挥，高海拔适应性强的球队具有优势。
            </div>
          </div>
        )}

        {/* Key matches */}
        {stadium.keyMatches && stadium.keyMatches.length > 0 && (
          <div>
            <div className="text-xs font-semibold text-slate-500 mb-2">🏆 重点场次</div>
            <div className="flex flex-wrap gap-1.5">
              {stadium.keyMatches.map((m, i) => (
                <span key={i} className="px-2 py-1 bg-amber-50 border border-amber-200 rounded text-xs text-amber-700 font-medium">{m}</span>
              ))}
            </div>
          </div>
        )}

        {/* Matches count */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-2 flex-1 w-32 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
                style={{ width: `${Math.min(100, (stadium.capacity / 110000) * 100)}%` }}
              />
            </div>
            <span className="text-xs text-slate-400">容量规模</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <MapPin className="w-3 h-3" />
            <span className="mono">{stadium.coordinates.lat.toFixed(1)}°N, {Math.abs(stadium.coordinates.lng).toFixed(1)}°W</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StadiumsSection() {
  const [weatherData, setWeatherData] = useState<Record<string, { temp: number; humidity: number; windSpeed: number; condition: string; icon: string }>>({});
  const [weatherLoading, setWeatherLoading] = useState(false);

  // 加载实时天气
  useEffect(() => {
    const loadWeather = async () => {
      setWeatherLoading(true);
      try {
        const data = await fetchWeatherData();
        if (data) {
          const mapped: Record<string, { temp: number; humidity: number; windSpeed: number; condition: string; icon: string }> = {};
          for (const [, val] of Object.entries(data)) {
            mapped[val.stadiumId] = {
              temp: val.temp,
              humidity: val.humidity,
              windSpeed: val.windSpeed,
              condition: val.condition,
              icon: val.icon,
            };
          }
          setWeatherData(mapped);
        }
      } catch { /* ignore */ }
      setWeatherLoading(false);
    };
    loadWeather();
  }, []);

  const weatherSummary = [
    { city: '墨西哥城', note: '高海拔·阴凉', flag: '🇲🇽', temp: weatherData['estadio-azteca']?.temp || 18 },
    { city: '瓜达拉哈拉', note: '晴朗舒适', flag: '🇲🇽', temp: weatherData['guadalajara']?.temp || 22 },
    { city: '蒙特雷', note: '干热', flag: '🇲🇽', temp: weatherData['monterrey']?.temp || 30 },
    { city: '温哥华', note: '多雨·凉爽', flag: '🇨🇦', temp: weatherData['vancouver']?.temp || 16 },
    { city: '多伦多', note: '夏季宜人', flag: '🇨🇦', temp: weatherData['toronto']?.temp || 22 },
    { city: '纽约', note: '沿海·温和', flag: '🇺🇸', temp: weatherData['new-york']?.temp || 24 },
    { city: '洛杉矶', note: '晴朗·舒适', flag: '🇺🇸', temp: weatherData['los-angeles']?.temp || 26 },
    { city: '达拉斯', note: '干热·炎夏', flag: '🇺🇸', temp: weatherData['dallas']?.temp || 35 },
    { city: '亚特兰大', note: '湿热', flag: '🇺🇸', temp: weatherData['atlanta']?.temp || 28 },
    { city: '休斯顿', note: '炎热·潮湿', flag: '🇺🇸', temp: weatherData['houston']?.temp || 33 },
    { city: '迈阿密', note: '热带气候', flag: '🇺🇸', temp: weatherData['miami']?.temp || 31 },
    { city: '波士顿', note: '夏季温和', flag: '🇺🇸', temp: weatherData['boston']?.temp || 22 },
    { city: '堪萨斯城', note: '温暖', flag: '🇺🇸', temp: weatherData['kansas-city']?.temp || 28 },
    { city: '费城', note: '夏季宜人', flag: '🇺🇸', temp: weatherData['philadelphia']?.temp || 24 },
    { city: '旧金山', note: '凉爽多雾', flag: '🇺🇸', temp: weatherData['san-francisco']?.temp || 18 },
    { city: '西雅图', note: '凉爽多云', flag: '🇺🇸', temp: weatherData['seattle']?.temp || 18 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Weather Overview */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Thermometer className="w-4 h-4 text-amber-500" />
          各赛场城市天气概览
          {weatherLoading && <RefreshCw className="w-3.5 h-3.5 text-blue-500 animate-spin" />}
          {Object.keys(weatherData).length > 0 && <span className="text-[10px] text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded-full">实时</span>}
        </h3>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
          {weatherSummary.map(w => (
            <div
              key={w.city}
              className={`text-center p-3 rounded-xl ${
                w.temp > 32 ? 'bg-red-50 border border-red-100' :
                w.temp > 25 ? 'bg-amber-50 border border-amber-100' :
                w.temp > 20 ? 'bg-green-50 border border-green-100' :
                'bg-blue-50 border border-blue-100'
              }`}
            >
              <div className="text-lg">{w.flag}</div>
              <div className={`text-xl font-black mono ${
                w.temp > 32 ? 'text-red-600' : w.temp > 25 ? 'text-amber-600' : w.temp > 20 ? 'text-green-600' : 'text-blue-600'
              }`}>{w.temp}°</div>
              <div className="text-xs text-slate-600 font-medium">{w.city}</div>
              <div className="text-xs text-slate-400">{w.note}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Stadiums Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {stadiums.map(stadium => (
          <StadiumCard key={stadium.id} stadium={stadium} liveWeather={weatherData[stadium.id]} />
        ))}
      </div>
    </div>
  );
}
